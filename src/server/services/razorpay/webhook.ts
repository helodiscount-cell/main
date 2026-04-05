import { WebhookPayloadSchema } from "./schemas";
import type {
  WebhookPayload,
  PaymentCapturedEvent,
  PaymentFailedEvent,
  OrderPaidEvent,
} from "./types";
import { verifyHmacSignature } from "./utils";
import { razorpayConfig } from "./config";

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

  const parsed = WebhookPayloadSchema.safeParse(rawJson);
  if (!parsed.success) {
    console.warn(
      "[Razorpay] Unrecognised webhook event branch or invalid payload.",
    );
    return;
  }

  // 3. Dispatch
  const event: WebhookPayload = parsed.data;
  switch (event.event) {
    case "payment.captured":
      return onPaymentCaptured(event);
    case "payment.failed":
      return onPaymentFailed(event);
    case "order.paid":
      return onOrderPaid(event);
  }
}
