import { Prisma } from "@prisma/client";
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
    throw new Error(
      `[Razorpay] No userId in activated subscription notes for ${sub.id}`,
    );
  }

  const planId = getInternalPlanIdByRazorpayId(sub.plan_id);
  if (!planId) {
    throw new Error(`[Razorpay] Unknown Razorpay plan_id: ${sub.plan_id}`);
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
    throw new Error(
      `[Razorpay] No userId in charged subscription notes for ${sub.id}`,
    );
  }

  const planId = getInternalPlanIdByRazorpayId(sub.plan_id);
  if (!planId) {
    throw new Error(
      `[Razorpay] Unknown Razorpay plan_id in charged: ${sub.plan_id}`,
    );
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
    throw new Error(
      `[Razorpay] No userId in ${event.event} subscription notes for ${sub.id}`,
    );
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

  // Idempotency: Attempt to claim the event atomically
  const razorpayEventId = rawJson.id;
  if (!razorpayEventId) {
    console.warn(
      "[Razorpay Webhook] Payload missing 'id' for deduplication. Processing as non-idempotent.",
    );
  } else {
    try {
      await prisma.processedWebhookEvent.create({
        data: { razorpayEventId },
      });
      console.info(`[Razorpay] Atomically claimed event ${razorpayEventId}`);
    } catch (err: any) {
      if (err.code === "P2002") {
        console.info(
          `[Razorpay] Event ${razorpayEventId} already processed, skipping.`,
        );
        return;
      }
      throw err; // Re-throw other errors to trigger webhook retry
    }
  }

  const parsed = WebhookPayloadSchema.safeParse(rawJson);
  if (!parsed.success) {
    console.warn(
      "[Razorpay] Unrecognised webhook event branch or invalid payload.",
    );
    return;
  }

  // 3. Dispatch

  const event = parsed.data;

  switch (event.event) {
    case "payment.captured":
      await onPaymentCaptured(event);
      break;
    case "payment.failed":
      await onPaymentFailed(event);
      break;
    case "order.paid":
      await onOrderPaid(event);
      break;
    case "subscription.activated":
      await onSubscriptionActivated(event);
      break;
    case "subscription.charged":
      await onSubscriptionCharged(event);
      break;
    case "subscription.halted":
    case "subscription.cancelled":
    case "subscription.completed":
      await onSubscriptionHalted(event);
      break;
  }
}
