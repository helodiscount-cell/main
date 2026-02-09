/**
 * Automation Service
 * Contains business logic for automation management
 */

import { ERROR_MESSAGES } from "@/config/instagram.config";
import type {
  CreateAutomationInput,
  UpdateAutomationInput,
} from "@dm-broo/common-types";
import {
  findUserById,
  findUserByIdWithInstaAccount,
  findUserByClerkId,
  findUserWithInstaAccount,
} from "@/server/repository/user-profile/user.repository";
import {
  createAutomation as createAutomationRecord,
  findAutomationById,
  findAutomationByIdAndUserId,
  findAutomationByIdAndUserIdForUpdate,
  findUserAutomations,
  updateAutomation as updateAutomationRecord,
  softDeleteAutomation,
} from "@/server/repository/automations/automation.repository";
import { invalidateAutomationCache } from "@/lib/utils/automation-cache";
import { logger } from "@/lib/utils/logger";
import { ApiRouteError } from "@/lib/middleware/errors/classes";

/**
 * Creates a new automation for a user
 */
export async function createAutomation(
  clerkId: string,
  input: CreateAutomationInput,
) {
  // Gets the user record with Instagram account
  const user = await findUserWithInstaAccount(clerkId);

  if (!user) {
    throw new ApiRouteError(ERROR_MESSAGES.AUTH.NO_USER, "NO_USER");
  }

  if (!user.instaAccount) {
    throw new ApiRouteError(
      ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT,
      "NO_INSTAGRAM_ACCOUNT",
    );
  }

  // Creates the automation
  const automation = await createAutomationRecord(user.id, input);

  // Invalidates cache to ensure webhooks re-check for automations
  await invalidateAutomationCache(user.clerkId, input.postId).catch((error) => {
    // Logs error but doesn't fail the operation
    logger.error(
      "Failed to invalidate automation cache after creation",
      error instanceof Error ? error : new Error(String(error)),
      { clerkId: user.clerkId, postId: input.postId },
    );
  });

  return {
    id: automation.id,
    postId: automation.postId,
    createdAt: automation.createdAt,
  };
}

/**
 * Gets a specific automation by ID
 * Uses authorized query to prevent information disclosure
 */
export async function getAutomation(userId: string, automationId: string) {
  // Checks ownership in the database query to prevent information disclosure
  // Returns null if automation doesn't exist OR user doesn't own it
  const automation = await findAutomationByIdAndUserId(automationId, userId);

  if (!automation) {
    // Generic error message that doesn't reveal if resource exists
    throw new Error("Automation not found or access denied");
  }

  return {
    id: automation.id,
    postId: automation.postId,
    postCaption: automation.postCaption,
    triggers: automation.triggers,
    matchType: automation.matchType,
    actionType: automation.actionType,
    replyMessage: automation.replyMessage,
    commentReplyWhenDm: automation.commentReplyWhenDm,
    status: automation.status,
    timesTriggered: automation.timesTriggered,
    lastTriggeredAt: automation.lastTriggeredAt,
    createdAt: automation.createdAt,
    updatedAt: automation.updatedAt,
    recentExecutions: automation.executions,
    totalExecutions: automation._count.executions,
  };
}

/**
 * Lists all automations for a user with optional filters
 */
export async function getUserAutomations(
  clerkId: string,
  filters?: {
    status?: "ACTIVE" | "PAUSED" | "DELETED";
    postId?: string;
  },
) {
  // Gets the user by clerkId to obtain userId
  const user = await findUserByClerkId(clerkId);

  if (!user) {
    throw new ApiRouteError(ERROR_MESSAGES.AUTH.NO_USER, "NO_USER");
  }

  // Builds filter conditions using userId
  const repositoryFilters: any = {
    userId: user.id,
  };

  if (
    filters?.status &&
    ["ACTIVE", "PAUSED", "DELETED"].includes(filters.status)
  ) {
    repositoryFilters.status = filters.status;
  }

  if (filters?.postId) {
    repositoryFilters.postId = filters.postId;
  }

  // Fetches all automations without pagination
  const automations = await findUserAutomations(repositoryFilters);

  return automations;
}

/**
 * Updates an existing automation
 * Uses authorized query to prevent information disclosure
 */
export async function updateAutomation(
  userId: string,
  automationId: string,
  input: UpdateAutomationInput,
) {
  // Checks ownership in the database query to prevent information disclosure
  // Returns null if automation doesn't exist OR user doesn't own it
  const existingAutomation = await findAutomationByIdAndUserIdForUpdate(
    automationId,
    userId,
  );

  if (!existingAutomation) {
    // Generic error message that doesn't reveal if resource exists
    throw new Error("Automation not found or access denied");
  }

  // Updates the automation
  const updatedAutomation = await updateAutomationRecord(automationId, input);

  // Invalidates cache to ensure webhooks re-check for automations
  // Uses existing postId from the automation and Clerk ID for cache key
  try {
    const user = await findUserById(userId);
    if (user?.clerkId) {
      await invalidateAutomationCache(
        user.clerkId,
        existingAutomation.postId,
      ).catch((error) => {
        // Logs error but doesn't fail the operation
        logger.error(
          "Failed to invalidate automation cache after update",
          error instanceof Error ? error : new Error(String(error)),
          {
            clerkId: user.clerkId,
            postId: existingAutomation.postId,
            automationId,
          },
        );
      });
    } else {
      logger.warn(
        "Missing clerkId for user when invalidating automation cache",
        {
          userId,
          postId: existingAutomation.postId,
          automationId,
        },
      );
    }
  } catch (error) {
    logger.error(
      "Failed to resolve user for automation cache invalidation after update",
      error instanceof Error ? error : new Error(String(error)),
      { userId, postId: existingAutomation.postId, automationId },
    );
  }

  return {
    id: updatedAutomation.id,
    postId: updatedAutomation.postId,
    triggers: updatedAutomation.triggers,
    matchType: updatedAutomation.matchType,
    actionType: updatedAutomation.actionType,
    replyMessage: updatedAutomation.replyMessage,
    commentReplyWhenDm: updatedAutomation.commentReplyWhenDm,
    status: updatedAutomation.status,
    updatedAt: updatedAutomation.updatedAt,
  };
}

/**
 * Deletes an automation (soft delete)
 * Uses authorized query to prevent information disclosure
 */
export async function deleteAutomation(userId: string, automationId: string) {
  // Checks ownership in the database query to prevent information disclosure
  // Returns null if automation doesn't exist OR user doesn't own it
  const existingAutomation = await findAutomationByIdAndUserIdForUpdate(
    automationId,
    userId,
  );

  if (!existingAutomation) {
    // Generic error message that doesn't reveal if resource exists
    throw new Error("Automation not found or access denied");
  }

  // Soft delete: mark as DELETED instead of actually deleting
  await softDeleteAutomation(automationId);

  // Invalidates cache to ensure webhooks re-check for automations
  try {
    const user = await findUserById(userId);
    if (user?.clerkId) {
      await invalidateAutomationCache(
        user.clerkId,
        existingAutomation.postId,
      ).catch((error) => {
        // Logs error but doesn't fail the operation
        logger.error(
          "Failed to invalidate automation cache after deletion",
          error instanceof Error ? error : new Error(String(error)),
          {
            clerkId: user.clerkId,
            postId: existingAutomation.postId,
            automationId,
          },
        );
      });
    } else {
      logger.warn(
        "Missing clerkId for user when invalidating automation cache after deletion",
        {
          userId,
          postId: existingAutomation.postId,
          automationId,
        },
      );
    }
  } catch (error) {
    logger.error(
      "Failed to resolve user for automation cache invalidation after deletion",
      error instanceof Error ? error : new Error(String(error)),
      { userId, postId: existingAutomation.postId, automationId },
    );
  }

  return {
    message: "Automation deleted successfully",
  };
}
