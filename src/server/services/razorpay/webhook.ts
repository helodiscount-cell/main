import { WebhookPayloadSchema } from "./schemas";
import type {
  WebhookPayload,
  PaymentCapturedEvent,
  PaymentFailedEvent,
  OrderPaidEvent,
  SubscriptionActivatedEvent,
  SubscriptionChargedEvent,
  SubscriptionHaltedEvent,
  SubscriptionCancelledEvent,
  SubscriptionCompletedEvent,
} from "./types";
import { verifyHmacSignature } from "./utils";
import { razorpayConfig } from "./config";
import { prisma } from "@/server/db";
import {
  activateSubscription,
  renewSubscription,
  expireSubscription,
} from "../billing";
import { PlanId, getInternalPlanIdByRazorpayId } from "@/configs/plans.config";

// --- Per-event handlers (Stub implementations) ---

async function onPaymentCaptured(event: PaymentCapturedEvent): Promise<void> {
  const { entity } = event.payload.payment;
  console.info(
    `[Razorpay] Payment captured: ${entity.id} for order ${entity.order_id}`,
  );
}

async function onPaymentFailed(event: PaymentFailedEvent): Promise<void> {
  const { entity } = event.payload.payment;
  console.warn(`[Razorpay] Payment failed: ${entity.id}`, event.payload.error);
}

async function onOrderPaid(event: OrderPaidEvent): Promise<void> {
  const { entity: order } = event.payload.order;
  console.info(`[Razorpay] Order paid: ${order.id}`);
}

async function onSubscriptionActivated(
  event: SubscriptionActivatedEvent,
): Promise<void> {
  const { entity: sub } = event.payload.subscription;
  const userId = sub.notes?.clerkUserId;
  if (!userId) {
    console.error(
      "[Razorpay] No userId in activated subscription notes",
      sub.id,
    );
    return;
  }

  const planId = getInternalPlanIdByRazorpayId(sub.plan_id);
  if (!planId) {
    console.error("[Razorpay] Unknown Razorpay plan_id", sub.plan_id);
    return;
  }

  await activateSubscription(userId, planId, sub.id, sub.plan_id);
}

async function onSubscriptionCharged(
  event: SubscriptionChargedEvent,
): Promise<void> {
  const { entity: sub } = event.payload.subscription;
  const { entity: payment } = event.payload.payment;
  const userId = sub.notes?.clerkUserId;
  if (!userId) {
    console.error("[Razorpay] No userId in charged subscription notes", sub.id);
    return;
  }

  const planId = getInternalPlanIdByRazorpayId(sub.plan_id);
  if (!planId) {
    console.error(
      "[Razorpay] Unknown Razorpay plan_id in charged",
      sub.plan_id,
    );
    return;
  }

  await renewSubscription(userId, planId, {
    paymentId: payment.id,
    amount: payment.amount,
  });
}

async function onSubscriptionHalted(
  event:
    | SubscriptionHaltedEvent
    | SubscriptionCancelledEvent
    | SubscriptionCompletedEvent,
): Promise<void> {
  const { entity: sub } = event.payload.subscription;
  const userId = sub.notes?.clerkUserId;
  if (!userId) {
    console.error(
      `[Razorpay] No userId in ${event.event} subscription notes`,
      sub.id,
    );
    return;
  }

  await expireSubscription(userId);
}

/**
 * Handles incoming Razorpay webhook events.
 * Verify signature → Validate payload → Dispatch to handlers.
 */
export async function handleWebhookEvent(
  rawBody: string,
  signature: string,
): Promise<void> {
  // 1. Verify signature
  verifyHmacSignature(rawBody, signature, razorpayConfig.webhookSecret);

  // 2. Parse payload
  let rawJson;
  try {
    rawJson = JSON.parse(rawBody);
  } catch (err) {
    console.warn("[Razorpay] Invalid JSON payload.");
    return;
  }

  // Idempotency check — ignore if already processed
  const razorpayEventId = rawJson.id;
  if (razorpayEventId) {
    const processed = await prisma.processedWebhookEvent.findUnique({
      where: { razorpayEventId },
    });
    if (processed) {
      console.info(
        `[Razorpay] Event ${razorpayEventId} already processed, skipping.`,
      );
      return;
    }
  }

  const parsed = WebhookPayloadSchema.safeParse(rawJson);
  if (!parsed.success) {
    console.warn(
      "[Razorpay] Unrecognised webhook event branch or invalid payload.",
    );
    return;
  }

  // Mark as processed in DB for idempotency
  if (razorpayEventId) {
    await prisma.processedWebhookEvent.create({ data: { razorpayEventId } });
  }

  // 3. Dispatch
  const event = parsed.data;

  switch (event.event) {
    case "payment.captured":
      return onPaymentCaptured(event);
    case "payment.failed":
      return onPaymentFailed(event);
    case "order.paid":
      return onOrderPaid(event);
    case "subscription.activated":
      return onSubscriptionActivated(event);
    case "subscription.charged":
      return onSubscriptionCharged(event);
    case "subscription.halted":
    case "subscription.cancelled":
    case "subscription.completed":
      return onSubscriptionHalted(event);
  }
}
