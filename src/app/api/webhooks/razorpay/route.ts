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
      // Return 200 for signature failures to "ignore" potentially spoofed requests
      console.warn("[Razorpay Webhook Warning]: Invalid signature.");
      return new Response(null, { status: 200 });
    }

    // Return 500 for all other processing errors so Razorpay will retry the event
    console.error("[Razorpay Webhook Error]:", err);
    return new Response(null, { status: 500 });
  }
}
