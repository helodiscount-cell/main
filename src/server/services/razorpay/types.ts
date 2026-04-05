import { z } from "zod";
import {
  CreateOrderSchema,
  VerifyPaymentSchema,
  WebhookPayloadSchema,
} from "./schemas";

// Input types (used by callers)
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;
export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;

// Result types (returned by service functions)
export interface RazorpayOrderResult {
  orderId: string;
  amount: number; // in paise
  currency: string;
  receipt: string | undefined;
  status: string;
}

export interface PaymentVerificationResult {
  verified: boolean;
  orderId: string;
  paymentId: string;
}

// Narrowed webhook event types
export type PaymentCapturedEvent = Extract<
  WebhookPayload,
  { event: "payment.captured" }
>;
export type PaymentFailedEvent = Extract<
  WebhookPayload,
  { event: "payment.failed" }
>;
export type OrderPaidEvent = Extract<WebhookPayload, { event: "order.paid" }>;
