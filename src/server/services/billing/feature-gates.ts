import { prisma } from "@/server/db";
import { PLANS, type PlanId } from "@/configs/plans.config";
import {
  getCreditStateR,
  syncCreditStateToRedis,
} from "@/server/redis/operations/billing";
import { logger } from "@/server/utils/pino";

export type FeatureGates = {
  state: {
    currentPlan: PlanId;
    creditsUsed: number;
    creditLimit: number;
    subStatus: string;
  };
  access: {
    canAddAccount: boolean;
    hasLeadGen: boolean;
    canCreateForms: boolean;
  };
};

/**
 * Returns the current feature access and credit state for a user.
 * Parameters: clerkUserId (Clerk ID)
 * Prefers Redis for speed; falls back to MongoDB if cache is cold.
 */
export async function getFeatureGates(
  clerkUserId: string,
): Promise<FeatureGates> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });

  if (!user) {
    throw new Error(`User with Clerk ID ${clerkUserId} not found`);
  }

  const userId = user.id;

  // Try Redis first (keyed by clerkUserId per keys.ts plan)
  const cached = await getCreditStateR(clerkUserId);

  // Resolve subscription (in parallel with Redis fallback if needed)
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });
  const planId: PlanId = (subscription?.plan as PlanId) ?? "FREE";
  const isActive = subscription?.status === "ACTIVE";
  const plan = PLANS[planId];

  let creditsUsed: number;
  let creditLimit: number;

  if (cached.creditsUsed !== null && cached.creditLimit !== null) {
    creditsUsed = cached.creditsUsed;
    creditLimit = cached.creditLimit;
  } else {
    // Cache miss — read from DB and restore Redis
    logger.warn({ userId }, "Credit cache miss — falling back to MongoDB");
    const ledger = await prisma.creditLedger.findUnique({ where: { userId } });
    creditsUsed = ledger?.creditsUsed ?? 0;
    creditLimit = ledger?.creditLimit ?? plan.creditLimit;
    const subStatus = subscription?.status ?? "EXPIRED";
    await syncCreditStateToRedis(
      clerkUserId,
      creditsUsed,
      creditLimit,
      subStatus,
    );
  }

  // Count active Instagram accounts to enforce multi-account gate
  const activeAccountCount = await prisma.instaAccount.count({
    where: { userId, isActive: true },
  });

  const subStatus = subscription?.status ?? "EXPIRED";

  return {
    state: {
      currentPlan: planId,
      creditsUsed,
      creditLimit,
      subStatus,
    },
    access: {
      canAddAccount:
        activeAccountCount < plan.maxAccounts && subStatus === "ACTIVE",
      hasLeadGen: plan.hasLeadGen && subStatus === "ACTIVE",
      canCreateForms: plan.hasLeadGen && subStatus === "ACTIVE",
    },
  };
}
