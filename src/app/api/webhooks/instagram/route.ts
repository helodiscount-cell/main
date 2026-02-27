/**
 * Instagram Webhook Endpoint
 * Receives real-time events from Instagram
 */

import { NextRequest, NextResponse } from "next/server";
import {
  verifyWebhook,
  processWebhookEvent,
} from "@/server/services/webhooks/instagram.webhook";

/**
 * GET handler for webhook verification
 * Instagram calls this to verify the webhook endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    if (!mode || !token || !challenge) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 },
      );
    }

    // Calls service layer
    const challengeResponse = await verifyWebhook(mode, token, challenge);

    // Returns the challenge to verify the webhook
    return new NextResponse(challengeResponse, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      {
        status:
          error instanceof Error && error.message === "Invalid mode"
            ? 403
            : 500,
      },
    );
  }
}

/**
 * POST handler for webhook events
 * Instagram sends real-time updates here
 */
export async function POST(request: NextRequest) {
  try {
    // Gets the raw body for signature verification
    const bodyText = await request.text();

    // Gets the signature header
    const signature = request.headers.get("x-hub-signature-256") || "";

    // Calls service layer
    const result = await processWebhookEvent(bodyText, signature);

    // Returns 200 immediately to Instagram
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      {
        status:
          error instanceof Error && error.message === "Invalid signature"
            ? 403
            : 500,
      },
    );
  }
}
