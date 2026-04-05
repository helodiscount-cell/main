import { createCheckoutSession } from "@/server/services/billing";
import { PlanIdSchema } from "@/configs/plans.config";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const CheckoutSchema = z.object({
  planId: PlanIdSchema,
});

/**
 * Route Handler for creating a Razorpay subscription checkout session.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let rawBody;
    try {
      rawBody = await req.json();
    } catch (e) {
      return Response.json({ error: "Malformed JSON" }, { status: 400 });
    }

    const body = CheckoutSchema.safeParse(rawBody);

    if (!body.success) {
      return Response.json({ error: body.error.flatten() }, { status: 400 });
    }

    const { planId } = body.data;

    if (planId === "FREE") {
      return Response.json(
        { error: "Free plan does not require a payment session." },
        { status: 400 },
      );
    }

    const session = await createCheckoutSession(clerkUserId, planId);
    return Response.json(session, { status: 201 });
  } catch (err: unknown) {
    console.error("[Checkout Route Error]:", err);
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return Response.json({ error: message }, { status: 500 });
  }
}
