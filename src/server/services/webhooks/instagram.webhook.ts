/**
 * Webhook Service
 * Contains business logic for webhook verification and processing
 */

import {
  verifyWebhookSignature,
  getWebhookVerifyToken,
  getWebhookSecret,
} from "@/server/instagram/webhook/validator";
import { webhookQueue } from "@/server/redis/queues";
import type { WebhookPayload } from "@dm-broo/common-types";
import { logger } from "@/server/utils/pino";
import { clogger } from "@/server/utils/consola";

/**
 * Verifies webhook registration from Instagram
 */
export async function verifyWebhook(
  mode: string,
  token: string,
  challenge: string,
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
  // these tests are mainly for the imposters
  // Gets the webhook secret
  const secret = getWebhookSecret();
  if (!secret) throw new Error("Webhook not configured");

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

  // Adds webhook event to queue for processing
  // Filters and validation happen at the worker level (Pipeline Stage 2)
  try {
    await webhookQueue.add("webhook-event", parsedPayload, {
      jobId: `webhook-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    });

    clogger.info(
      {
        payloadType: parsedPayload.object,
        entryCount: Array.isArray(parsedPayload.entry)
          ? parsedPayload.entry.length
          : 0,
      },
      "Webhook event added to queue",
    );
  } catch (error) {
    // Logs error but still returns success to Instagram
    // Queue errors shouldn't cause webhook failures
    logger.error(
      {
        payloadType: parsedPayload.object,
        entryCount: Array.isArray(parsedPayload.entry)
          ? parsedPayload.entry.length
          : 0,
      },
      "Failed to add webhook to queue",
    );
  }

  return { success: true as const };
}
