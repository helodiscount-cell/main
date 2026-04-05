import { prisma } from "@/server/db";
import { PLANS, type PlanId } from "@/configs/plans.config";
import { syncCreditStateToRedis } from "@/server/redis/operations/billing";

import { logger } from "@/server/utils/pino";
import { getRazorpayClient } from "../razorpay/client";
import { sendEmail } from "@/lib/email";

// 28-day billing cycle (BullMQ week × 4 in Razorpay)
const BILLING_CYCLE_DAYS = 28;

/**
 * Resolves a Clerk user ID to the internal MongoDB User ID.
 */
async function resolveInternalUserId(clerkUserId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });

  if (!user) {
    throw new Error(`User with Clerk ID ${clerkUserId} not found in database`);
  }

  return user.id;
}

export function getPeriodEnd(start: Date): Date {
  const end = new Date(start);
  end.setDate(end.getDate() + BILLING_CYCLE_DAYS);
  return end;
}

/**
 * Provisions or activates a subscription for a user.
 * Used on first signup (FREE) and after a successful Razorpay payment.
 */
export async function activateSubscription(
  clerkUserId: string,
  planId: PlanId,
  razorpaySubscriptionId: string | null = null,
  razorpayPlanId: string | null = null,
): Promise<void> {
  const userId = await resolveInternalUserId(clerkUserId);
  const plan = PLANS[planId];
  const periodStart = new Date();
  const periodEnd = getPeriodEnd(periodStart);

  // Upsert Subscription and CreditLedger in a transaction
  await prisma.$transaction([
    prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        plan: planId,
        status: "ACTIVE",
        razorpaySubscriptionId,
        razorpayPlanId,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
      },
      update: {
        plan: planId,
        status: "ACTIVE",
        razorpaySubscriptionId,
        razorpayPlanId,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
      },
    }),
    prisma.creditLedger.upsert({
      where: { userId },
      create: {
        userId,
        creditsUsed: 0,
        creditLimit: plan.creditLimit,
        periodStart,
        periodEnd,
        quotaEmailSentAt: null,
      },
      update: {
        creditsUsed: 0,
        creditLimit: plan.creditLimit,
        periodStart,
        periodEnd,
        quotaEmailSentAt: null,
      },
    }),
  ]);

  // Sync fresh state to Redis immediately
  await syncCreditStateToRedis(clerkUserId, 0, plan.creditLimit, "ACTIVE");

  // Send first invoice/onboarding confirmation
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (
    user &&
    user.email &&
    razorpaySubscriptionId &&
    process.env.NODE_ENV === "production"
  ) {
    sendEmail({
      type: "invoice",
      to: user.email,
      name: user.fullName || "there",
      invoiceNumber: `INV-${razorpaySubscriptionId}`,
      amount: plan.priceInRupees,
      currency: "INR",
      dueDate: new Date().toLocaleDateString(),
      paymentUrl: `${process.env.APP_URL}/dash/billing`,
    }).catch((err) => {
      logger.error({ clerkUserId, err: err.message }, "Activation mail failed");
    });
  }

  logger.info({ clerkUserId, planId }, "Subscription activated");
}

/**
 * Resets credits at the start of a new billing cycle (subscription.charged).
 * Does NOT change the plan — only resets usage and period dates.
 */
export async function renewSubscription(
  clerkUserId: string,
  planId: PlanId,
  paymentData?: { paymentId: string; amount: number },
): Promise<void> {
  const userId = await resolveInternalUserId(clerkUserId);
  const plan = PLANS[planId];
  const periodStart = new Date();
  const periodEnd = getPeriodEnd(periodStart);

  await prisma.$transaction([
    prisma.subscription.update({
      where: { userId },
      data: {
        plan: planId,
        status: "ACTIVE",
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
      },
    }),
    prisma.creditLedger.update({
      where: { userId },
      data: {
        creditsUsed: 0,
        creditLimit: plan.creditLimit,
        periodStart,
        periodEnd,
        quotaEmailSentAt: null,
      },
    }),
  ]);

  await syncCreditStateToRedis(clerkUserId, 0, plan.creditLimit, "ACTIVE");

  if (paymentData && process.env.NODE_ENV === "production") {
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (user && user.email) {
      sendEmail({
        type: "invoice",
        to: user.email,
        name: user.fullName || "there",
        invoiceNumber: `INV-${paymentData.paymentId}`,
        amount: paymentData.amount / 100, // Paise to Rupees
        currency: "INR",
        dueDate: new Date().toLocaleDateString(),
        paymentUrl: `${process.env.APP_URL}/dash/billing`,
      }).catch((err) => {
        logger.error({ clerkUserId, err: err.message }, "Invoice mail failed");
      });
    }
  }

  logger.info({ clerkUserId, planId }, "Subscription renewed — credits reset");
}

/**
 * Expires a subscription (on cancellation, halt, or completion).
 * Downgrades the user to the FREE plan limits immediately.
 */
export async function expireSubscription(clerkUserId: string): Promise<void> {
  const userId = await resolveInternalUserId(clerkUserId);
  const freePlan = PLANS.FREE;

  const [_, ledger] = await prisma.$transaction([
    prisma.subscription.update({
      where: { userId },
      data: { status: "EXPIRED" },
    }),
    prisma.creditLedger.update({
      where: { userId },
      data: {
        creditLimit: freePlan.creditLimit,
      },
    }),
  ]);

  await syncCreditStateToRedis(
    clerkUserId,
    ledger.creditsUsed,
    freePlan.creditLimit,
    "EXPIRED",
  );

  logger.info(
    { clerkUserId },
    "Subscription expired — downgraded to FREE limits",
  );
}

/**
 * Changes a user's plan mid-cycle (upgrade or downgrade).
 * Updates limit in DB and Redis immediately.
 */
export async function changePlan(
  clerkUserId: string,
  newPlanId: PlanId,
  razorpaySubscriptionId: string | null = null,
  razorpayPlanId: string | null = null,
): Promise<void> {
  const userId = await resolveInternalUserId(clerkUserId);
  const newPlan = PLANS[newPlanId];

  const [ledger] = await prisma.$transaction([
    prisma.creditLedger.update({
      where: { userId },
      data: { creditLimit: newPlan.creditLimit },
    }),
    prisma.subscription.update({
      where: { userId },
      data: {
        plan: newPlanId,
        status: "ACTIVE",
        razorpaySubscriptionId,
        razorpayPlanId,
      },
    }),
  ]);

  await syncCreditStateToRedis(
    clerkUserId,
    ledger.creditsUsed,
    newPlan.creditLimit,
    "ACTIVE",
  );

  logger.info({ clerkUserId, newPlanId }, "Plan changed");
}

/**
 * Creates a Razorpay Subscription session and returns the checkout URL.
 */
export async function createCheckoutSession(
  userId: string,
  planId: PlanId,
): Promise<{ checkoutUrl: string }> {
  const plan = PLANS[planId];
  if (!plan.razorpayPlanId) {
    throw new Error(`Plan ${planId} has no associated Razorpay plan ID`);
  }

  const client = getRazorpayClient();

  try {
    const subscription = await client.subscriptions.create({
      plan_id: plan.razorpayPlanId,
      total_count: 12, // 1 year of weekly-style blocks (4 weeks each)
      quantity: 1,
      customer_notify: process.env.NODE_ENV === "production" ? 1 : 0,
      notes: {
        clerkUserId: userId,
      },
    });

    if (!subscription.short_url) {
      throw new Error("Razorpay did not return a checkout URL");
    }

    return { checkoutUrl: subscription.short_url };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error(
      { userId, planId, err: message },
      "Failed to create Razorpay subscription",
    );
    throw new Error("Failed to initialize payment session. Please try again.");
  }
}
