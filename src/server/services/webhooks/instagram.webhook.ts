/**
 * Webhook Service
 * Contains business logic for webhook verification and processing
 */

import {
  verifyWebhookSignature,
  getWebhookVerifyToken,
  getWebhookSecret,
} from "@/lib/instagram/webhook/validator";
import { webhookQueue } from "@/lib/queue/queues";
import type { WebhookPayload } from "@dm-broo/common-types";
import { logger } from "@/lib/utils/logger";

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

  // FILTER OUT SELF-COMMENTS BEFORE QUEUEING
  if (parsedPayload.entry && Array.isArray(parsedPayload.entry)) {
    for (const entry of parsedPayload.entry) {
      if (entry.changes && Array.isArray(entry.changes)) {
        entry.changes = entry.changes.filter((change: any) => {
          // Skips self-comments before queueing
          if (
            change.field === "comments" &&
            change.value?.from?.self_ig_scoped_id
          ) {
            logger.info("⏭️  Filtered out self-comment before queueing", {
              commentId: change.value.id,
              username: change.value.from.username,
            });
            return false; // Removes from array
          }
          return true; // Keep all other events
        });
      }
    }

    // Removes entries with no changes left after filtering
    parsedPayload.entry = parsedPayload.entry.filter(
      (entry: any) => entry.changes && entry.changes.length > 0,
    );
  }

  // Returns success if all events were filtered out
  if (!parsedPayload.entry || parsedPayload.entry.length === 0) {
    logger.info("All webhook events filtered (self-comments only)");
    return { success: true as const };
  }

  // Adds webhook event to queue for processing
  // Returns immediately to Instagram
  try {
    await webhookQueue.add("webhook-event", parsedPayload, {
      jobId: `webhook-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    });

    logger.logWebhook(
      parsedPayload.object || "unknown",
      "instagram",
      true,
      undefined,
      {
        payloadType: parsedPayload.object,
        entryCount: Array.isArray(parsedPayload.entry)
          ? parsedPayload.entry.length
          : 0,
      },
    );
  } catch (error) {
    // Logs error but still returns success to Instagram
    // Queue errors shouldn't cause webhook failures
    logger.error(
      "Failed to add webhook to queue",
      error instanceof Error ? error : new Error(String(error)),
      {
        payloadType: parsedPayload.object,
        entryCount: Array.isArray(parsedPayload.entry)
          ? parsedPayload.entry.length
          : 0,
      },
    );
  }

  return { success: true as const };
}
