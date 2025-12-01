/**
 * Automation Service
 * Contains business logic for automation management
 */

import { prisma } from "@/lib/db";
import { ERROR_MESSAGES } from "@/config/instagram.config";
import type {
  CreateAutomationInput,
  UpdateAutomationInput,
  AutomationListQuery,
} from "@insta-auto/common-types";

/**
 * Creates a new automation for a user
 */
export async function createAutomation(
  userId: string,
  input: CreateAutomationInput
) {
  // Gets the user record with Instagram account
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { instaAccount: true },
  });

  if (!user) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_USER);
  }

  if (!user.instaAccount) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT);
  }

  // Creates the automation
  const automation = await prisma.automation.create({
    data: {
      userId: user.id,
      postId: input.postId,
      postCaption: input.postCaption,
      triggers: input.triggers,
      matchType: input.matchType,
      actionType: input.actionType,
      replyMessage: input.replyMessage,
      useVariables: input.useVariables,
      status: "ACTIVE",
    },
  });

  return {
    id: automation.id,
    postId: automation.postId,
    actionType: automation.actionType,
    triggers: automation.triggers,
    replyMessage: automation.replyMessage,
    createdAt: automation.createdAt,
  };
}

/**
 * Gets a specific automation by ID
 */
export async function getAutomation(userId: string, automationId: string) {
  const automation = await prisma.automation.findUnique({
    where: { id: automationId },
    include: {
      executions: {
        orderBy: {
          executedAt: "desc",
        },
        take: 10,
      },
      _count: {
        select: {
          executions: true,
        },
      },
    },
  });

  if (!automation) {
    throw new Error(ERROR_MESSAGES.VALIDATION.INVALID_POST_ID);
  }

  // Verifies ownership
  if (automation.userId !== userId) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_USER);
  }

  return {
    id: automation.id,
    postId: automation.postId,
    postCaption: automation.postCaption,
    triggers: automation.triggers,
    matchType: automation.matchType,
    actionType: automation.actionType,
    replyMessage: automation.replyMessage,
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
export async function listAutomations(
  userId: string,
  filters?: AutomationListQuery
) {
  // Builds filter conditions
  const where: any = {
    userId: userId,
  };

  if (filters?.status && ["ACTIVE", "PAUSED", "DELETED"].includes(filters.status)) {
    where.status = filters.status;
  }

  if (filters?.postId) {
    where.postId = filters.postId;
  }

  // Fetches automations
  const automations = await prisma.automation.findMany({
    where,
    include: {
      _count: {
        select: {
          executions: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return automations.map((automation) => ({
    id: automation.id,
    postId: automation.postId,
    postCaption: automation.postCaption,
    triggers: automation.triggers,
    matchType: automation.matchType,
    actionType: automation.actionType,
    replyMessage: automation.replyMessage,
    status: automation.status,
    timesTriggered: automation.timesTriggered,
    lastTriggeredAt: automation.lastTriggeredAt,
    createdAt: automation.createdAt,
    updatedAt: automation.updatedAt,
    executionsCount: automation._count.executions,
  }));
}

/**
 * Updates an existing automation
 */
export async function updateAutomation(
  userId: string,
  automationId: string,
  input: UpdateAutomationInput
) {
  // Verifies automation exists and user owns it
  const existingAutomation = await prisma.automation.findUnique({
    where: { id: automationId },
  });

  if (!existingAutomation) {
    throw new Error("Automation not found");
  }

  if (existingAutomation.userId !== userId) {
    throw new Error("Unauthorized");
  }

  // Updates the automation
  const updatedAutomation = await prisma.automation.update({
    where: { id: automationId },
    data: input,
  });

  return {
    id: updatedAutomation.id,
    postId: updatedAutomation.postId,
    triggers: updatedAutomation.triggers,
    matchType: updatedAutomation.matchType,
    actionType: updatedAutomation.actionType,
    replyMessage: updatedAutomation.replyMessage,
    status: updatedAutomation.status,
    updatedAt: updatedAutomation.updatedAt,
  };
}

/**
 * Deletes an automation (soft delete)
 */
export async function deleteAutomation(userId: string, automationId: string) {
  // Verifies automation exists and user owns it
  const existingAutomation = await prisma.automation.findUnique({
    where: { id: automationId },
  });

  if (!existingAutomation) {
    throw new Error(ERROR_MESSAGES.VALIDATION.INVALID_POST_ID);
  }

  if (existingAutomation.userId !== userId) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_USER);
  }

  // Soft delete: mark as DELETED instead of actually deleting
  await prisma.automation.update({
    where: { id: automationId },
    data: { status: "DELETED" },
  });

  return {
    message: "Automation deleted successfully",
  };
}
