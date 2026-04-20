import {
  verifyPayment,
  VerifyPaymentSchema,
  PaymentVerificationError,
} from "@/server/services/razorpay";
import { auth } from "@clerk/nextjs/server";

/**
 * Route Handler for verifying a Razorpay payment.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let rawBody;
    try {
      rawBody = await req.json();
    } catch (e) {
      return Response.json({ error: "Malformed JSON" }, { status: 400 });
    }

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
