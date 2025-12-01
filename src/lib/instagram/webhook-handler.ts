/**
 * Instagram Webhook Event Handler
 * Processes incoming webhook events from Instagram
 */

import { prisma } from "@/lib/db";
import {
  validateCommentData,
  findMatchingAutomations,
  isCommentProcessed,
  AutomationRule,
} from "@/lib/automation/matcher";
import { executeAutomation } from "@/lib/automation/executor";
import { getValidAccessToken } from "@/lib/instagram/token-manager";

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
    throw error;
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
  await prisma.webhookEvent.create({
    data: {
      eventType: field,
      instagramUserId,
      payload: value,
      processed: false,
      receivedAt: new Date(),
    },
  });

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
  await prisma.webhookEvent.create({
    data: {
      eventType: "messaging",
      instagramUserId,
      payload: messagingEvent,
      processed: false,
      receivedAt: new Date(),
    },
  });

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
  // Validates comment data
  const comment = validateCommentData(commentData);
  if (!comment) {
    return;
  }

  // Gets postId early for optimized query
  const postId = commentData.media?.id || commentData.media_id;

  if (!postId) {
    return;
  }

  // Optimized: Queries directly for automations on this specific post
  // This avoids fetching all automations and filtering in memory
  const instaAccount = await prisma.instaAccount.findUnique({
    where: { instagramUserId },
    select: {
      id: true,
      userId: true,
      accessToken: true,
    },
  });

  if (!instaAccount) {
    return;
  }

  // Fetches only active automations for this specific post
  const relevantAutomations = await prisma.automation.findMany({
    where: {
      userId: instaAccount.userId,
      postId: postId,
      status: "ACTIVE",
    },
  });

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
  const matches = findMatchingAutomations(comment, automationRules);

  if (matches.length === 0) {
    return;
  }

  // Gets valid access token
  let accessToken: string;
  try {
    accessToken = await getValidAccessToken(instaAccount.id);
  } catch (error) {
    return;
  }

  // Executes each matching automation
  for (const match of matches) {
    // Checks if already processed
    const alreadyProcessed = await isCommentProcessed(
      comment.id,
      match.automation.id,
      prisma
    );

    if (alreadyProcessed) {
      continue;
    }

    // Executes the automation
    await executeAutomation(match.automation.id, comment, accessToken);
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

