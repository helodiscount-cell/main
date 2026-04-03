/**
 * Automation Service
 * Workspace-scoped — all operations are isolated to a specific instaAccountId
 */

import { ERROR_MESSAGES } from "@/server/config/instagram.config";
import type {
  CreateAutomationInput,
  UpdateAutomationInput,
} from "@dm-broo/common-types";
import { findUserByClerkId } from "@/server/repository/user/user.repository";
import {
  createAutomation as createAutomationRecord,
  findAutomationByIdAndUserId,
  findAutomationByIdAndUserIdForUpdate,
  findUserAutomations,
  updateAutomation as updateAutomationRecord,
  softDeleteAutomation,
  findAutomationsByTargetAndKeywords,
} from "@/server/repository/automations/automation.repository";
import { invalidateAutomationCache } from "@/server/redis";
import { logger } from "@/server/utils/pino";
import { ApiRouteError } from "@/server/middleware/errors/classes";
import { AutomationFilters } from "@/types/automation";
import { prisma } from "@/server/db";

// Creates a new automation scoped to a specific workspace
export async function createAutomation(
  clerkId: string,
  instaAccountId: string,
  input: CreateAutomationInput,
) {
  const user = await findUserByClerkId(clerkId);
  if (!user) {
    throw new ApiRouteError(ERROR_MESSAGES.AUTH.NO_USER, "NO_USER");
  }

  const account = await prisma.instaAccount.findFirst({
    where: { id: instaAccountId, userId: user.id, isActive: true },
    select: { id: true },
  });

  if (!account) {
    throw new ApiRouteError(
      ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT,
      "NO_INSTAGRAM_ACCOUNT",
    );
  }

  const triggerType = input.triggerType ?? "COMMENT_ON_POST";
  const warnings: string[] = [];

  const targetId =
    triggerType === "RESPOND_TO_ALL_DMS"
      ? "account"
      : triggerType === "STORY_REPLY"
        ? input.story?.id
        : input.postId;
  const targetType =
    triggerType === "RESPOND_TO_ALL_DMS"
      ? "account"
      : triggerType === "STORY_REPLY"
        ? "story"
        : "post";

  if (targetId && input.triggers.length > 0) {
    const overlapping = await findAutomationsByTargetAndKeywords(
      user.id,
      targetId,
      targetType,
      input.triggers,
    );

    overlapping.forEach((auto) => {
      const shared = auto.triggers.filter((t) => input.triggers.includes(t));
      if (shared.length > 0) {
        warnings.push(
          `Automation "${auto.automationName}" already uses these keywords on this ${targetType}: ${shared.join(", ")}`,
        );
      }
    });
  }

  const automation = await createAutomationRecord(
    user.id,
    instaAccountId,
    input,
  );

  if (!automation) {
    throw new ApiRouteError(
      "Failed to create automation. Please try again.",
      "CREATE_FAILED",
      500,
    );
  }

  // Invalidate workspace automation cache
  const invalidateType =
    triggerType === "RESPOND_TO_ALL_DMS"
      ? "account"
      : triggerType === "STORY_REPLY"
        ? "story"
        : "post";
  const finalTargetId = targetId || "account";

  await invalidateAutomationCache(
    instaAccountId,
    finalTargetId,
    invalidateType,
    automation.id,
  ).catch((error) => {
    logger.error(
      { instaAccountId, targetId: finalTargetId, triggerType },
      "Failed to invalidate automation cache after creation",
      error instanceof Error ? error : new Error(String(error)),
    );
  });

  return {
    id: automation.id,
    triggerType: automation.triggerType,
    automationName: automation.automationName,
    createdAt: automation.createdAt,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

// Gets a specific automation by ID (ownership enforced in the query)
export async function getAutomation(userId: string, automationId: string) {
  const automation = await findAutomationByIdAndUserId(automationId, userId);

  if (!automation) {
    throw new Error("Automation not found or access denied");
  }

  return {
    id: automation.id,
    triggerType: automation.triggerType,
    automationName: automation.automationName,
    post: automation.post,
    story: automation.story,
    triggers: automation.triggers,
    matchType: automation.matchType,
    actionType: automation.actionType,
    replyMessage: automation.replyMessage,
    replyImage: automation.replyImage,
    commentReplyWhenDm: automation.commentReplyWhenDm,
    askToFollowEnabled: automation.askToFollowEnabled,
    askToFollowMessage: automation.askToFollowMessage,
    askToFollowLink: automation.askToFollowLink,
    openingMessageEnabled: automation.openingMessageEnabled,
    openingMessage: automation.openingMessage,
    openingButtonText: automation.openingButtonText,
    dmLinks: automation.dmLinks || [],
    status: automation.status,
    timesTriggered: automation.timesTriggered,
    lastTriggeredAt: automation.lastTriggeredAt,
    createdAt: automation.createdAt,
    updatedAt: automation.updatedAt,
    recentExecutions: automation.executions,
    totalExecutions: automation._count.executions,
  };
}

// Lists all automations for a specific workspace
export async function getUserAutomations(
  instaAccountId: string,
  filters?: { status?: "ACTIVE" | "PAUSED" },
) {
  const repositoryFilters: AutomationFilters = {
    instaAccountId,
    status: filters?.status ?? ["ACTIVE", "PAUSED"],
  };

  return findUserAutomations(repositoryFilters);
}

// Updates an automation (ownership enforced in the query)
export async function updateAutomation(
  userId: string,
  automationId: string,
  input: UpdateAutomationInput,
) {
  const existingAutomation = await findAutomationByIdAndUserIdForUpdate(
    automationId,
    userId,
  );

  if (!existingAutomation) {
    throw new Error("Automation not found or access denied");
  }

  const updatedAutomation = await updateAutomationRecord(automationId, input);

  // Invalidate cache using the workspace ID
  const invalidateType =
    existingAutomation.triggerType === "RESPOND_TO_ALL_DMS"
      ? "account"
      : existingAutomation.triggerType === "STORY_REPLY"
        ? "story"
        : "post";
  const targetId =
    existingAutomation.post?.id ?? existingAutomation.story?.id ?? "account";

  await invalidateAutomationCache(
    existingAutomation.instaAccountId,
    targetId,
    invalidateType,
    automationId,
  ).catch((error) => {
    logger.error(
      {
        instaAccountId: existingAutomation.instaAccountId,
        targetId,
        automationId,
      },
      "Failed to invalidate automation cache after update",
      error instanceof Error ? error : new Error(String(error)),
    );
  });

  return {
    id: updatedAutomation.id,
    triggerType: updatedAutomation.triggerType,
    automationName: updatedAutomation.automationName,
    post: updatedAutomation.post,
    story: updatedAutomation.story,
    triggers: updatedAutomation.triggers,
    matchType: updatedAutomation.matchType,
    actionType: updatedAutomation.actionType,
    replyMessage: updatedAutomation.replyMessage,
    replyImage: updatedAutomation.replyImage,
    commentReplyWhenDm: updatedAutomation.commentReplyWhenDm,
    askToFollowEnabled: updatedAutomation.askToFollowEnabled,
    askToFollowMessage: updatedAutomation.askToFollowMessage,
    askToFollowLink: updatedAutomation.askToFollowLink,
    openingMessageEnabled: updatedAutomation.openingMessageEnabled,
    openingMessage: updatedAutomation.openingMessage,
    openingButtonText: updatedAutomation.openingButtonText,
    dmLinks: updatedAutomation.dmLinks || [],
    status: updatedAutomation.status,
    updatedAt: updatedAutomation.updatedAt,
  };
}

// Soft-deletes an automation (ownership enforced in the query)
export async function deleteAutomation(userId: string, automationId: string) {
  const existingAutomation = await findAutomationByIdAndUserIdForUpdate(
    automationId,
    userId,
  );

  if (!existingAutomation) {
    throw new Error("Automation not found or access denied");
  }

  await softDeleteAutomation(automationId);

  const invalidateType =
    existingAutomation.triggerType === "RESPOND_TO_ALL_DMS"
      ? "account"
      : existingAutomation.triggerType === "STORY_REPLY"
        ? "story"
        : "post";
  const targetId =
    existingAutomation.post?.id ?? existingAutomation.story?.id ?? "account";
  await invalidateAutomationCache(
    existingAutomation.instaAccountId,
    targetId,
    invalidateType,
    automationId,
  ).catch((error) => {
    logger.error(
      {
        instaAccountId: existingAutomation.instaAccountId,
        targetId,
        automationId,
      },
      "Failed to invalidate automation cache after deletion",
      error instanceof Error ? error : new Error(String(error)),
    );
  });

  return { message: "Automation deleted successfully" };
}
