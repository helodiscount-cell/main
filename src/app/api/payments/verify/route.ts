import { verifyPayment } from "@/server/services/razorpay";
import { VerifyPaymentSchema } from "@/server/services/razorpay/schemas";
import { PaymentVerificationError } from "@/server/services/razorpay";

/**
 * Route Handler for verifying a Razorpay payment.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const rawBody = await req.json();
    const body = VerifyPaymentSchema.safeParse(rawBody);

    if (!body.success) {
      return Response.json({ error: body.error.flatten() }, { status: 400 });
    }

    const result = await verifyPayment(body.data);
    return Response.json(result);
  } catch (err) {
    if (err instanceof PaymentVerificationError) {
      return Response.json(
        { error: "Invalid payment signature" },
        { status: 400 },
      );
    }
    console.error("[Verify Payment Route Error]:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
