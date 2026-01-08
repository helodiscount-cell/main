/**
 * Automation Executor
 * Executes automation actions (DM or comment reply)
 */

import { CommentData, replaceVariables } from "./matcher";
import { sendDirectMessageWithRetry } from "@/lib/instagram/messaging-api";
import { replyToCommentWithRetry } from "@/lib/instagram/comments-api";
import {
  isRateLimited,
  incrementRateLimit,
  createMessagingRateLimitKey,
  createCommentsRateLimitKey,
} from "@/lib/instagram/rate-limiter";
import { logger } from "@/lib/utils/logger";
import { findAutomationById } from "@/server/repositories/automation.repository";
import { findInstaAccountByAutomationId } from "@/server/repositories/insta-account.repository";

export interface ExecutionResult {
  success: boolean;
  executionId?: string;
  error?: string;
}

/**
 * Executes an automation action
 */
export async function executeAutomation(
  automationId: string,
  comment: CommentData,
  accessToken: string
): Promise<ExecutionResult> {
  try {
    // Gets the automation
    const automation = await findAutomationById(automationId);

    if (!automation) {
      logger.warn("Automation not found", { automationId });
      return {
        success: false,
        error: "Automation not found",
      };
    }

    // Prepares the message
    let finalMessage = automation.replyMessage;
    if (automation.useVariables) {
      finalMessage = replaceVariables(finalMessage, comment);
    }

    let instagramMessageId: string | null = null;
    let executionStatus: "SUCCESS" | "FAILED" | "PENDING" = "PENDING";
    let errorMessage: string | null = null;

    // Gets Instagram user ID for rate limiting
    const instaAccount = await findInstaAccountByAutomationId(automationId);

    if (!instaAccount) {
      return {
        success: false,
        error: "Instagram account not found",
      };
    }

    // Executes based on action type
    try {
      if (automation.actionType === "COMMENT_REPLY") {
        // Checks rate limit
        const rateLimitKey = createCommentsRateLimitKey(
          instaAccount.instagramUserId
        );
        if (isRateLimited(rateLimitKey)) {
          throw new Error("Rate limit exceeded for comment replies");
        }

        // Replies to comment with retry
        const result = await replyToCommentWithRetry({
          commentId: comment.id,
          message: finalMessage,
          accessToken,
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        instagramMessageId = result.replyId || null;
        executionStatus = "SUCCESS";
        incrementRateLimit(rateLimitKey);
      } else if (automation.actionType === "DM") {
        // Checks rate limit
        const rateLimitKey = createMessagingRateLimitKey(
          instaAccount.instagramUserId
        );
        if (isRateLimited(rateLimitKey)) {
          throw new Error("Rate limit exceeded for direct messages");
        }

        // Sends DM with retry
        // Note: If user hasn't messaged before, DM will go to their "Message Requests" folder
        // We use the commentId to reply privately to the comment which bypasses the 24h window for the first message
        const result = await sendDirectMessageWithRetry({
          recipientId: comment.userId,
          commentId: comment.id,
          message: finalMessage,
          accessToken,
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        instagramMessageId = result.messageId || null;
        executionStatus = "SUCCESS";
        incrementRateLimit(rateLimitKey);
      } else {
        throw new Error(`Unknown action type: ${automation.actionType}`);
      }
    } catch (actionError) {
      executionStatus = "FAILED";
      errorMessage =
        actionError instanceof Error
          ? actionError.message
          : "Unknown error executing action";

      logger.error(
        "Failed to execute automation action",
        actionError instanceof Error
          ? actionError
          : new Error(String(actionError)),
        {
          automationId,
          actionType: automation.actionType,
          commentId: comment.id,
        }
      );
    }

    // Records the execution and updates stats in a transaction
    // Ensures execution record and stats are updated atomically
    const { executeTransaction } = await import(
      "@/server/repositories/repository-utils"
    );
    const { prisma } = await import("@/lib/db");

    const execution = await executeTransaction(
      async (tx) => {
        // Creates execution record
        const execution = await tx.automationExecution.create({
          data: {
            automationId,
            commentId: comment.id,
            commentText: comment.text,
            commentUsername: comment.username,
            commentUserId: comment.userId,
            actionType: automation.actionType,
            sentMessage: finalMessage,
            status: executionStatus,
            errorMessage,
            instagramMessageId,
            executedAt: new Date(),
          },
        });

        // Updates automation stats
        await tx.automation.update({
          where: { id: automationId },
          data: {
            timesTriggered: {
              increment: 1,
            },
            lastTriggeredAt: new Date(),
          },
        });

        return execution;
      },
      {
        operation: "executeAutomation",
        models: ["AutomationExecution", "Automation"],
      }
    );

    // Logs execution result
    if (executionStatus !== "SUCCESS") {
      logger.warn("Automation execution failed", {
        automationId,
        executionId: execution.id,
        actionType: automation.actionType,
        error: errorMessage,
      });
    }
    return {
      success: executionStatus === "SUCCESS",
      executionId: execution.id,
      error: errorMessage || undefined,
    };
  } catch (error) {
    logger.error(
      "Error in executeAutomation",
      error instanceof Error ? error : new Error(String(error)),
      {
        automationId,
        commentId: comment.id,
      }
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Batch executes multiple automations for a comment
 */
export async function batchExecuteAutomations(
  automationIds: string[],
  comment: CommentData,
  accessToken: string
): Promise<ExecutionResult[]> {
  const results: ExecutionResult[] = [];

  for (const automationId of automationIds) {
    const result = await executeAutomation(automationId, comment, accessToken);
    results.push(result);
  }

  return results;
}
