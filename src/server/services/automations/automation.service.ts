/**
 * Automation Service
 * Contains business logic for automation management
 */

import { ERROR_MESSAGES } from "@/server/config/instagram.config";
import type {
  CreateAutomationInput,
  UpdateAutomationInput,
} from "@dm-broo/common-types";
import {
  findUserById,
  findUserByClerkId,
  findUserWithInstaAccount,
} from "@/server/repository/user/user.repository";
import {
  createAutomation as createAutomationRecord,
  findAutomationById,
  findAutomationByIdAndUserId,
  findAutomationByIdAndUserIdForUpdate,
  findUserAutomations,
  updateAutomation as updateAutomationRecord,
  softDeleteAutomation,
  findActiveAutomationsByPost,
  findActiveAutomationsByStory,
  AutomationFilters,
} from "@/server/repository/automations/automation.repository";
import { invalidateAutomationCache } from "@/server/utils/automation-cache";
import { logger } from "@/server/utils/pino";
import { ApiRouteError } from "@/server/middleware/errors/classes";

/**
 * Creates a new automation for a user.
 * Invalidates cache to ensure webhooks re-check for automations
 */
export async function createAutomation(
  clerkId: string,
  input: CreateAutomationInput,
) {
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

  const triggerType = input.triggerType ?? "COMMENT_ON_POST";

  // Dedup check — only ACTIVE ones block creation
  if (triggerType === "COMMENT_ON_POST" && input.postId) {
    const existing = await findActiveAutomationsByPost(user.id, input.postId);
    if (existing && existing.length > 0) {
      throw new ApiRouteError(
        "An automation already exists for this post. Only one automation per post is allowed.",
        "DUPLICATE_AUTOMATION",
        409,
      );
    }
  } else if (triggerType === "STORY_REPLY" && input.story) {
    const existing = await findActiveAutomationsByStory(
      user.id,
      input.story.id,
    );
    if (existing && existing.length > 0) {
      throw new ApiRouteError(
        "An automation already exists for this story. Only one automation per story is allowed.",
        "DUPLICATE_AUTOMATION",
        409,
      );
    }
  }

  const automation = await createAutomationRecord(user.id, input);

  // Cache invalidation — use the relevant target ID
  const cacheTargetId =
    triggerType === "STORY_REPLY" ? input.story?.id : input.postId;

  if (cacheTargetId) {
    await invalidateAutomationCache(user.clerkId, cacheTargetId).catch(
      (error) => {
        logger.error(
          { clerkId: user.clerkId, targetId: cacheTargetId, triggerType },
          "Failed to invalidate automation cache after creation",
          error instanceof Error ? error : new Error(String(error)),
        );
      },
    );
  }

  return {
    id: automation.id,
    triggerType: automation.triggerType,
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
    triggerType: automation.triggerType,
    post: automation.post,
    story: automation.story,
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
    status?: "ACTIVE" | "PAUSED";
  },
) {
  const user = await findUserByClerkId(clerkId);

  if (!user) {
    throw new ApiRouteError(ERROR_MESSAGES.AUTH.NO_USER, "NO_USER");
  }

  const repositoryFilters: AutomationFilters = {
    userId: user.id,
    // Only shows DELETED if explicitly requested; otherwise hide them
    status: filters?.status ?? ["ACTIVE", "PAUSED"],
  };

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
  const targetId = existingAutomation.post?.id ?? existingAutomation.story?.id;
  try {
    const user = await findUserById(userId);
    if (user?.clerkId && targetId) {
      await invalidateAutomationCache(user.clerkId, targetId).catch((error) => {
        logger.error(
          {
            clerkId: user.clerkId,
            targetId,
            automationId,
          },
          "Failed to invalidate automation cache after update",
          error instanceof Error ? error : new Error(String(error)),
        );
      });
    } else if (!user?.clerkId) {
      logger.warn(
        {
          userId,
          targetId,
          automationId,
        },
        "Missing clerkId for user when invalidating automation cache",
      );
    }
  } catch (error) {
    logger.error(
      { userId, targetId, automationId },
      "Failed to resolve user for automation cache invalidation after update",
      error instanceof Error ? error : new Error(String(error)),
    );
  }

  return {
    id: updatedAutomation.id,
    triggerType: updatedAutomation.triggerType,
    post: updatedAutomation.post,
    story: updatedAutomation.story,
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
  const targetId = existingAutomation.post?.id ?? existingAutomation.story?.id;
  try {
    const user = await findUserById(userId);
    if (user?.clerkId && targetId) {
      await invalidateAutomationCache(user.clerkId, targetId).catch((error) => {
        logger.error(
          {
            clerkId: user.clerkId,
            targetId,
            automationId,
          },
          "Failed to invalidate automation cache after deletion",
          error instanceof Error ? error : new Error(String(error)),
        );
      });
    } else if (!user?.clerkId) {
      logger.warn(
        {
          userId,
          targetId,
          automationId,
        },
        "Missing clerkId for user when invalidating automation cache after deletion",
      );
    }
  } catch (error) {
    logger.error(
      { userId, targetId, automationId },
      "Failed to resolve user for automation cache invalidation after deletion",
      error instanceof Error ? error : new Error(String(error)),
    );
  }

  return {
    message: "Automation deleted successfully",
  };
}
