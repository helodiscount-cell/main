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
import { getRedisClient } from "@/lib/queue/redis";
import { Automation, InstaAccount } from "@prisma/client";
const redis = getRedisClient();

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

  // Logs only essential fields to avoid logging large payload objects
  // and prevent issues with object references being mutated later
  logger.info("processWebhookEvent", {
    object: payload.object,
    webhookId,
    entryCount,
  });

  try {
    for (const entry of payload.entry) {
      // Processes changes (comments, etc.)
      if (entry.changes) {
        for (const change of entry.changes) {
          await processChange(entry.id, change);
        }
      }

      // Processes messaging events (DMs)
      if (entry.messaging) {
        for (const messagingEvent of entry.messaging) {
          await processMessagingEvent(entry.id, messagingEvent);
        }
      }
    }
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

  // Processes event with timeout
  Promise.race([
    (async () => {
      switch (field) {
        case "comments":
          await handleCommentEvent(instagramUserId, value);
          break;
        case "messages":
          await handleMessageEvent(instagramUserId, value);
          break;
        default:
          logger.warn("Unknown webhook field", { field });
      }
    })(),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Handler timeout")), 4000)
    ),
  ]).catch((error) => {
    logger.error("processChange - Webhook processing failed", error, {
      field,
      instagramUserId,
    });
  });

  // Returns immediately - don't await the Promise.race
}

/**
 * Processes a messaging event (DM)
 */
async function processMessagingEvent(
  instagramUserId: string,
  messagingEvent: any
): Promise<void> {
  // Processes the message
  if (messagingEvent.message) {
    await handleIncomingMessage(instagramUserId, messagingEvent);
  }
}

/**
 * Handles a comment event
 */
/**
 * Handles a comment event
 */
async function handleCommentEvent(
  instagramUserId: string,
  commentData: any
): Promise<void> {
  try {
    // 1. Validate comment
    const comment = validateCommentData(commentData);
    if (!comment) {
      logger.warn("Invalid comment data in webhook", {
        instagramUserId,
        commentData: JSON.stringify(commentData).slice(0, 200),
      });
      return;
    }

    // 2. Extract postId
    const postId = commentData.media?.id || commentData.media_id;
    if (!postId) {
      logger.warn("Missing postId in comment event", {
        instagramUserId,
        commentId: comment.id,
      });
      return;
    }

    /* --------------------------------------------------
     * ACCOUNT GATING (Redis → DB fallback)
     * -------------------------------------------------- */

    const accountCacheKey = `ig:webhook:${instagramUserId}`;

    // type InstaAccountCache =
    //   | { isActive: false }
    //   | {
    //       isActive: true;
    //       id: string;
    //       userId: string;
    //     };

    let instaAccount: Pick<
      InstaAccount,
      "id" | "userId" | "isActive" | "id"
    > | null = null;

    const cachedAccount = await redis.get(accountCacheKey);
    if (cachedAccount) {
      instaAccount = JSON.parse(cachedAccount);

      if (!instaAccount?.isActive) {
        // Account disconnected → ignore webhook
        return;
      }
    }

    if (!instaAccount) {
      const { findInstaAccountByInstagramUserId } = await import(
        "@/server/repositories/insta-account.repository"
      );

      const dbAccount = await findInstaAccountByInstagramUserId(
        String(instagramUserId)
      );

      if (!dbAccount || !dbAccount.isActive) {
        await redis.set(
          accountCacheKey,
          JSON.stringify({ isActive: false }),
          "EX",
          60 * 60
        );
        return;
      }

      instaAccount = {
        isActive: true,
        id: dbAccount.id,
        userId: dbAccount.userId,
      };

      await redis.set(
        accountCacheKey,
        JSON.stringify(instaAccount),
        "EX",
        60 * 60
      );
    }

    /* --------------------------------------------------
     * AUTOMATION EXISTENCE CACHE (NOT LOGIC)
     * -------------------------------------------------- */

    const automationsCacheKey = `ig:automation:${instaAccount?.userId}:${postId}`;

    type AutomationExistenceCache =
      | { hasAutomations: false }
      | { hasAutomations: true };

    let hasAutomations: boolean | null = null;

    const cachedAutomationFlag = await redis.get(automationsCacheKey);
    if (cachedAutomationFlag) {
      const parsed: AutomationExistenceCache = JSON.parse(cachedAutomationFlag);
      hasAutomations = parsed.hasAutomations;
    }

    if (hasAutomations === false) {
      return;
    }

    /* --------------------------------------------------
     * FETCH FULL AUTOMATIONS (DB)
     * -------------------------------------------------- */

    const { findActiveAutomationsByPost } = await import(
      "@/server/repositories/automation.repository"
    );

    const automations = await findActiveAutomationsByPost(
      instaAccount.userId,
      postId
    );

    if (automations.length === 0) {
      await redis.set(
        automationsCacheKey,
        JSON.stringify({ hasAutomations: false }),
        "EX",
        5 * 60
      );
      return;
    }

    await redis.set(
      automationsCacheKey,
      JSON.stringify({ hasAutomations: true }),
      "EX",
      5 * 60
    );

    /* --------------------------------------------------
     * MATCH AUTOMATIONS
     * -------------------------------------------------- */

    const matches = await findMatchingAutomations(comment, automations);
    if (matches.length === 0) {
      return;
    }

    /* --------------------------------------------------
     * RESOLVE ACCESS TOKEN (DB AUTHORITY)
     * -------------------------------------------------- */

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

    /* --------------------------------------------------
     * EXECUTE AUTOMATIONS (IDEMPOTENT)
     * -------------------------------------------------- */

    for (const match of matches) {
      try {
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
      }
    }
  } catch (error) {
    logger.error(
      "Error handling comment event",
      error instanceof Error ? error : new Error(String(error)),
      {
        instagramUserId,
        commentId: commentData?.id,
        postId: commentData?.media?.id || commentData?.media_id,
      }
    );
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

  logger.info("handleIncomingMessage", {
    instagramUserId,
    messagingEvent,
  });
}

/**
 * Handles a message event from comments field
 */
async function handleMessageEvent(
  instagramUserId: string,
  messageData: any
): Promise<void> {
  // TODO: Implements message event handling

  logger.info("handleMessageEvent", {
    instagramUserId,
    messageData,
  });
}
