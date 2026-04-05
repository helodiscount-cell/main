import { handleWebhookEvent } from "@/server/services/razorpay";
import { SignatureVerificationError } from "@/server/services/razorpay";

/**
 * Route Handler for Razorpay webhooks.
 * Uses exact raw body for signature verification.
 */
export async function POST(req: Request): Promise<Response> {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  try {
    await handleWebhookEvent(rawBody, signature);
    return new Response(null, { status: 200 });
  } catch (err) {
    if (err instanceof SignatureVerificationError) {
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }
    // Return 200 to prevent Razorpay from retrying while we log the error.
    console.error("[Razorpay Webhook Error]:", err);
    return new Response(null, { status: 200 });
  }
}
