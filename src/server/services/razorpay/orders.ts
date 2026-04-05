import { getRazorpayClient } from "./client";
import { CreateOrderSchema } from "./schemas";
import type { CreateOrderInput, RazorpayOrderResult } from "./types";
import { OrderCreationError } from "./errors";
import { toRazorpayAmount, generateReceipt } from "./utils";

/**
 * Creates a new Razorpay order.
 */
export async function createOrder(
  input: CreateOrderInput,
): Promise<RazorpayOrderResult> {
  const parsed = CreateOrderSchema.parse(input);

  const client = getRazorpayClient();

  try {
    const order = await client.orders.create({
      amount: toRazorpayAmount(parsed.amountInRupees),
      currency: parsed.currency,
      receipt: parsed.receipt ?? generateReceipt(),
      notes: parsed.notes ?? {},
    });

    return {
      orderId: order.id,
      amount:
        typeof order.amount === "string"
          ? parseInt(order.amount, 10)
          : order.amount,
      currency: order.currency,
      receipt: order.receipt || undefined,
      status: order.status,
    };
  } catch (err) {
    throw new OrderCreationError(err);
  }
}
