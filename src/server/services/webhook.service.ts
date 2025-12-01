/**
 * Webhook Service
 * Contains business logic for webhook verification and processing
 */

import {
  verifyWebhookSignature,
  getWebhookVerifyToken,
  getWebhookSecret,
} from "@/lib/instagram/webhook-validator";
import { processWebhookEvent as processEvent } from "@/lib/instagram/webhook-handler";
import type { WebhookPayload } from "@insta-auto/common-types";
import { logger } from "@/lib/utils/logger";

/**
 * Verifies webhook registration from Instagram
 */
export async function verifyWebhook(
  mode: string,
  token: string,
  challenge: string
) {
  // Verifies that this is a subscribe request
  if (mode !== "subscribe") {
    throw new Error("Invalid mode");
  }

  // Gets the verify token from environment
  const verifyToken = getWebhookVerifyToken();
  if (!verifyToken) {
    throw new Error("Webhook not configured");
  }

  // Verifies the token matches
  if (token !== verifyToken) {
    throw new Error("Invalid verify token");
  }

  // Returns the challenge to verify the webhook
  return challenge;
}

/**
 * Processes an incoming webhook event from Instagram
 */
export async function processWebhookEvent(payload: string, signature: string) {
  // Gets the webhook secret
  const secret = getWebhookSecret();
  if (!secret) {
    throw new Error("Webhook not configured");
  }

  // Verifies the signature
  if (!verifyWebhookSignature(payload, signature, secret)) {
    throw new Error("Invalid signature");
  }

  // Parses the payload
  let parsedPayload: WebhookPayload;
  try {
    parsedPayload = JSON.parse(payload);
  } catch (error) {
    throw new Error("Invalid JSON");
  }

  // Processes the webhook event asynchronously
  // Don't await - respond quickly to Instagram
  processEvent(parsedPayload).catch((error) => {
    // Logs error for monitoring - already acknowledged to Instagram
    logger.logWebhook(
      parsedPayload.object || "unknown",
      "instagram",
      false,
      error instanceof Error ? error : new Error(String(error)),
      {
        payloadType: parsedPayload.object,
        entryCount: Array.isArray(parsedPayload.entry) ? parsedPayload.entry.length : 0,
      }
    );
  });

  logger.logWebhook(
    parsedPayload.object || "unknown",
    "instagram",
    true,
    undefined,
    {
      payloadType: parsedPayload.object,
      entryCount: Array.isArray(parsedPayload.entry) ? parsedPayload.entry.length : 0,
    }
  );

  return { success: true as const };
}

