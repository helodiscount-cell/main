import { z } from "zod";

// --- Inputs ---

export const CreateOrderSchema = z.object({
  amountInRupees: z.number().positive("Amount must be positive"),
  currency: z.enum(["INR"]).default("INR"),
  receipt: z.string().max(40).optional(),
  notes: z
    .record(z.string(), z.union([z.string(), z.number(), z.null()]))
    .optional(),
});

export const VerifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

// --- Webhook event payloads ---

const PaymentEntitySchema = z.object({
  id: z.string(),
  order_id: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.string(),
  method: z.string().optional(),
  email: z.string().optional(),
  contact: z.string().optional(),
  created_at: z.number(),
});

const PaymentCapturedSchema = z.object({
  payment: z.object({ entity: PaymentEntitySchema }),
});

const PaymentFailedSchema = z.object({
  payment: z.object({ entity: PaymentEntitySchema }),
  error: z.object({
    code: z.string(),
    description: z.string(),
    reason: z.string().optional(),
  }),
});

const OrderPaidSchema = z.object({
  order: z.object({
    entity: z.object({
      id: z.string(),
      amount: z.number(),
      status: z.string(),
    }),
  }),
  payment: z.object({ entity: PaymentEntitySchema }),
});

export const WebhookPayloadSchema = z.discriminatedUnion("event", [
  z.object({
    event: z.literal("payment.captured"),
    payload: PaymentCapturedSchema,
  }),
  z.object({
    event: z.literal("payment.failed"),
    payload: PaymentFailedSchema,
  }),
  z.object({ event: z.literal("order.paid"), payload: OrderPaidSchema }),
  // --- Subscription events ---
  z.object({
    event: z.literal("subscription.activated"),
    payload: z.object({
      subscription: z.object({
        entity: z.object({
          id: z.string(),
          plan_id: z.string(),
          status: z.string(),
          notes: z.record(z.string(), z.string()).optional(),
        }),
      }),
    }),
  }),
  z.object({
    event: z.literal("subscription.charged"),
    payload: z.object({
      subscription: z.object({
        entity: z.object({
          id: z.string(),
          plan_id: z.string(),
          notes: z.record(z.string(), z.string()).optional(),
        }),
      }),
      payment: z.object({
        entity: z.object({
          id: z.string(),
          amount: z.number(),
          currency: z.string(),
        }),
      }),
    }),
  }),

  z.object({
    event: z.literal("subscription.halted"),
    payload: z.object({
      subscription: z.object({
        entity: z.object({
          id: z.string(),
          notes: z.record(z.string(), z.string()).optional(),
        }),
      }),
    }),
  }),
  z.object({
    event: z.literal("subscription.cancelled"),
    payload: z.object({
      subscription: z.object({
        entity: z.object({
          id: z.string(),
          notes: z.record(z.string(), z.string()).optional(),
        }),
      }),
    }),
  }),
  z.object({
    event: z.literal("subscription.completed"),
    payload: z.object({
      subscription: z.object({
        entity: z.object({
          id: z.string(),
          notes: z.record(z.string(), z.string()).optional(),
        }),
      }),
    }),
  }),
]);
