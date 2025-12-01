/**
 * Instagram Webhook Event Handler
 * Processes incoming webhook events from Instagram
 */

import {
  validateCommentData,
  findMatchingAutomations,
  isCommentProcessed,
  AutomationRule,
} from "@/lib/automation/matcher";
import { executeAutomation } from "@/lib/automation/executor";
import { getValidAccessToken } from "@/lib/instagram/token-manager";
import { logger } from "@/lib/utils/logger";
import { prisma } from "@/lib/db";

export interface WebhookEntry {
  id: string;
  time: number;
  changes?: Array<{
    field: string;
    value: any;
  }>;
  messaging?: Array<{
    sender: { id: string };
    recipient: { id: string };
    timestamp: number;
    message?: {
      mid: string;
      text: string;
    };
  }>;
}

export interface InstagramWebhookPayload {
  object: string;
  entry: WebhookEntry[];
}

/**
 * Processes a webhook event
 */
export async function processWebhookEvent(
  payload: InstagramWebhookPayload
): Promise<void> {
  const webhookId = payload.entry?.[0]?.id || "unknown";
  const entryCount = payload.entry?.length || 0;

  try {
    logger.info("Processing webhook event", {
      webhookId,
      object: payload.object,
      entryCount,
    });

    for (const entry of payload.entry) {
      try {
        // Processes changes (comments, etc.)
        if (entry.changes) {
          for (const change of entry.changes) {
            try {
              await processChange(entry.id, change);
            } catch (error) {
              logger.error(
                "Failed to process webhook change event",
                error instanceof Error ? error : new Error(String(error)),
                {
                  webhookId: entry.id,
                  field: change.field,
                  changeValue: JSON.stringify(change.value).substring(0, 200), // Log first 200 chars
                }
              );
              // Continues processing other changes
            }
          }
        }

        // Processes messaging events (DMs)
        if (entry.messaging) {
          for (const messagingEvent of entry.messaging) {
            try {
              await processMessagingEvent(entry.id, messagingEvent);
            } catch (error) {
              logger.error(
                "Failed to process webhook messaging event",
                error instanceof Error ? error : new Error(String(error)),
                {
                  webhookId: entry.id,
                  senderId: messagingEvent.sender?.id,
                  recipientId: messagingEvent.recipient?.id,
                }
              );
              // Continues processing other messaging events
            }
          }
        }
      } catch (error) {
        logger.error(
          "Failed to process webhook entry",
          error instanceof Error ? error : new Error(String(error)),
          {
            webhookId: entry.id,
            entryTime: entry.time,
          }
        );
        // Continues processing other entries
      }
    }

    logger.info("Webhook event processing completed", {
      webhookId,
      entryCount,
    });
  } catch (error) {
    logger.error(
      "Critical error processing webhook event",
      error instanceof Error ? error : new Error(String(error)),
      {
        webhookId,
        object: payload.object,
        entryCount,
      }
    );
    throw error; // Re-throws to be caught by webhook service
  }
}

/**
 * Processes a change event (comment, etc.)
 */
async function processChange(
  instagramUserId: string,
  change: { field: string; value: any }
): Promise<void> {
  const { field, value } = change;

  // Stores the event in database for processing
  try {
    await prisma.webhookEvent.create({
      data: {
        eventType: field,
        instagramUserId,
        payload: value,
        processed: false,
        receivedAt: new Date(),
      },
    });
  } catch (error) {
    logger.error(
      "Failed to store webhook event in database",
      error instanceof Error ? error : new Error(String(error)),
      {
        eventType: field,
        instagramUserId,
      }
    );
    // Continues processing even if storage fails
  }

  // Handles different event types
  switch (field) {
    case "comments":
      await handleCommentEvent(instagramUserId, value);
      break;
    case "messages":
      await handleMessageEvent(instagramUserId, value);
      break;
    default:
      // Unknown field type
      break;
  }
}

/**
 * Processes a messaging event (DM)
 */
async function processMessagingEvent(
  instagramUserId: string,
  messagingEvent: any
): Promise<void> {
  // Stores the event in database
  try {
    await prisma.webhookEvent.create({
      data: {
        eventType: "messaging",
        instagramUserId,
        payload: messagingEvent,
        processed: false,
        receivedAt: new Date(),
      },
    });
  } catch (error) {
    logger.error(
      "Failed to store messaging event in database",
      error instanceof Error ? error : new Error(String(error)),
      {
        instagramUserId,
        senderId: messagingEvent.sender?.id,
      }
    );
    // Continues processing even if storage fails
  }

  // Processes the message
  if (messagingEvent.message) {
    await handleIncomingMessage(instagramUserId, messagingEvent);
  }
}

/**
 * Handles a comment event
 */
async function handleCommentEvent(
  instagramUserId: string,
  commentData: any
): Promise<void> {
  try {
    // Validates comment data
    const comment = validateCommentData(commentData);
    if (!comment) {
      logger.warn("Invalid comment data in webhook", {
        instagramUserId,
        commentData: JSON.stringify(commentData).substring(0, 200),
      });
      return;
    }

    // Gets postId early for optimized query
    const postId = commentData.media?.id || commentData.media_id;

    if (!postId) {
      logger.warn("Missing postId in comment event", {
        instagramUserId,
        commentId: comment.id,
      });
      return;
    }

  // Optimized: Queries directly for automations on this specific post
  // This avoids fetching all automations and filtering in memory
  const { findInstaAccountByInstagramUserId } = await import(
    "@/server/repositories/insta-account.repository"
  );
  const { findActiveAutomationsByPost } = await import(
    "@/server/repositories/automation.repository"
  );

  const instaAccount = await findInstaAccountByInstagramUserId(instagramUserId);

  if (!instaAccount) {
    return;
  }

  // Fetches only active automations for this specific post
  const relevantAutomations = await findActiveAutomationsByPost(
    instaAccount.userId,
    postId
  );

  if (relevantAutomations.length === 0) {
    return;
  }

  // Converts to AutomationRule format
  const automationRules: AutomationRule[] = relevantAutomations.map((auto) => ({
    id: auto.id,
    triggers: auto.triggers,
    matchType: auto.matchType as "CONTAINS" | "EXACT" | "REGEX",
    actionType: auto.actionType,
    replyMessage: auto.replyMessage,
    useVariables: auto.useVariables,
  }));

  // Finds matching automations
  const matches = await findMatchingAutomations(comment, automationRules);

  if (matches.length === 0) {
    return;
  }

    // Gets valid access token
    let accessToken: string;
    try {
      accessToken = await getValidAccessToken(instaAccount.id);
    } catch (error) {
      logger.error(
        "Failed to get valid access token for webhook processing",
        error instanceof Error ? error : new Error(String(error)),
        {
          instagramUserId,
          instaAccountId: instaAccount.id,
        }
      );
      return;
    }

    // Executes each matching automation
    for (const match of matches) {
      try {
        // Checks if already processed
        const alreadyProcessed = await isCommentProcessed(
          comment.id,
          match.automation.id
        );

        if (alreadyProcessed) {
          logger.debug("Comment already processed", {
            commentId: comment.id,
            automationId: match.automation.id,
          });
          continue;
        }

        // Executes the automation
        await executeAutomation(match.automation.id, comment, accessToken);

        logger.info("Automation executed successfully", {
          commentId: comment.id,
          automationId: match.automation.id,
          actionType: match.automation.actionType,
        });
      } catch (error) {
        logger.error(
          "Failed to execute automation for comment",
          error instanceof Error ? error : new Error(String(error)),
          {
            commentId: comment.id,
            automationId: match.automation.id,
            actionType: match.automation.actionType,
          }
        );
        // Continues processing other automations
      }
    }
  } catch (error) {
    logger.error(
      "Error handling comment event",
      error instanceof Error ? error : new Error(String(error)),
      {
        instagramUserId,
        commentId: commentData.id,
        postId: commentData.media?.id || commentData.media_id,
      }
    );
    // Re-throws to be caught by processChange
    throw error;
  }
}

/**
 * Handles an incoming message (DM)
 */
async function handleIncomingMessage(
  instagramUserId: string,
  messagingEvent: any
): Promise<void> {
  // TODO: Phase 4 will implement message handling
  // For now, we just log that we received the event
}

/**
 * Handles a message event from comments field
 */
async function handleMessageEvent(
  instagramUserId: string,
  messageData: any
): Promise<void> {
  // TODO: Implements message event handling
}

/**
 * Marks a webhook event as processed
 */
export async function markEventProcessed(
  eventId: string,
  error?: string
): Promise<void> {
  await prisma.webhookEvent.update({
    where: { id: eventId },
    data: {
      processed: true,
      processedAt: new Date(),
      error,
    },
  });
}

/**
 * Gets unprocessed webhook events
 */
export async function getUnprocessedEvents(limit: number = 100): Promise<any[]> {
  return await prisma.webhookEvent.findMany({
    where: {
      processed: false,
    },
    orderBy: {
      receivedAt: "asc",
    },
    take: limit,
  });
}

