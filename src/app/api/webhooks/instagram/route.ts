/**
 * Instagram Webhook Endpoint
 * Receives real-time events from Instagram
 */

import { NextRequest, NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  getWebhookVerifyToken,
  getWebhookSecret,
} from "@/lib/instagram/webhook-validator";
import {
  processWebhookEvent,
  InstagramWebhookPayload,
} from "@/lib/instagram/webhook-handler";
import { logger } from "@/lib/logger-backend";

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

    logger.apiRoute("GET", "/api/webhooks/instagram", {
      mode,
      hasToken: !!token,
      hasChallenge: !!challenge,
    });

    // Verifies that this is a subscribe request
    if (mode !== "subscribe") {
      return NextResponse.json(
        { error: "Invalid mode" },
        { status: 403 }
      );
    }

    // Gets the verify token from environment
    const verifyToken = getWebhookVerifyToken();
    if (!verifyToken) {
      logger.apiRoute("GET", "/api/webhooks/instagram", {
        error: "Verify token not configured",
      });
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    // Verifies the token matches
    if (token !== verifyToken) {
      logger.apiRoute("GET", "/api/webhooks/instagram", {
        error: "Token mismatch",
      });
      return NextResponse.json(
        { error: "Invalid verify token" },
        { status: 403 }
      );
    }

    logger.apiRoute("GET", "/api/webhooks/instagram", {
      status: "verified",
    });

    // Returns the challenge to verify the webhook
    return new NextResponse(challenge, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error in webhook GET:", error);
    logger.apiRoute("GET", "/api/webhooks/instagram", {
      error: "Internal error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
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

    logger.apiRoute("POST", "/api/webhooks/instagram", {
      hasSignature: !!signature,
      bodyLength: bodyText.length,
    });

    // Gets the webhook secret
    const secret = getWebhookSecret();
    if (!secret) {
      logger.apiRoute("POST", "/api/webhooks/instagram", {
        error: "Webhook secret not configured",
      });
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    // Verifies the signature
    if (!verifyWebhookSignature(bodyText, signature, secret)) {
      logger.apiRoute("POST", "/api/webhooks/instagram", {
        error: "Invalid signature",
      });
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 403 }
      );
    }

    // Parses the payload
    let payload: InstagramWebhookPayload;
    try {
      payload = JSON.parse(bodyText);
    } catch (error) {
      logger.apiRoute("POST", "/api/webhooks/instagram", {
        error: "Invalid JSON",
      });
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    logger.apiRoute("POST", "/api/webhooks/instagram", {
      object: payload.object,
      entriesCount: payload.entry?.length || 0,
    });

    // Processes the webhook event asynchronously
    // Don't await - respond quickly to Instagram
    processWebhookEvent(payload).catch((error) => {
      console.error("Error processing webhook event:", error);
      logger.apiRoute("POST", "/api/webhooks/instagram", {
        error: "Processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    });

    // Returns 200 immediately to Instagram
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in webhook POST:", error);
    logger.apiRoute("POST", "/api/webhooks/instagram", {
      error: "Internal error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

