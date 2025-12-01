/**
 * Automation Service
 * Contains business logic for automation management
 */

import { ERROR_MESSAGES } from "@/config/instagram.config";
import type {
  CreateAutomationInput,
  UpdateAutomationInput,
  AutomationListQuery,
} from "@insta-auto/common-types";
import {
  findUserByIdWithInstaAccount,
} from "@/server/repositories/user.repository";
import {
  createAutomation as createAutomationRecord,
  findAutomationById,
  findAutomationByIdAndUserId,
  findAutomationByIdAndUserIdForUpdate,
  findAutomations,
  countAutomations,
  updateAutomation as updateAutomationRecord,
  softDeleteAutomation,
} from "@/server/repositories/automation.repository";

/**
 * Creates a new automation for a user
 */
export async function createAutomation(
  userId: string,
  input: CreateAutomationInput
) {
  // Gets the user record with Instagram account
  const user = await findUserByIdWithInstaAccount(userId);

  if (!user) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_USER);
  }

  if (!user.instaAccount) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT);
  }

  // Creates the automation
  const automation = await createAutomationRecord({
    userId: user.id,
    postId: input.postId,
    postCaption: input.postCaption,
    triggers: input.triggers,
    matchType: input.matchType,
    actionType: input.actionType,
    replyMessage: input.replyMessage,
    useVariables: input.useVariables,
    status: "ACTIVE",
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
 * Lists all automations for a user with optional filters and pagination
 */
export async function listAutomations(
  userId: string,
  filters?: AutomationListQuery
) {
  // Builds filter conditions
  const repositoryFilters: any = {
    userId: userId,
  };

  if (filters?.status && ["ACTIVE", "PAUSED", "DELETED"].includes(filters.status)) {
    repositoryFilters.status = filters.status;
  }

  if (filters?.postId) {
    repositoryFilters.postId = filters.postId;
  }

  // Pagination parameters
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  repositoryFilters.skip = skip;
  repositoryFilters.take = limit;

  // Fetches automations with pagination
  const [automations, total] = await Promise.all([
    findAutomations(repositoryFilters),
    countAutomations(repositoryFilters),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: automations.map((automation) => ({
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
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}

/**
 * Updates an existing automation
 * Uses authorized query to prevent information disclosure
 */
export async function updateAutomation(
  userId: string,
  automationId: string,
  input: UpdateAutomationInput
) {
  // Checks ownership in the database query to prevent information disclosure
  // Returns null if automation doesn't exist OR user doesn't own it
  const existingAutomation = await findAutomationByIdAndUserIdForUpdate(
    automationId,
    userId
  );

  if (!existingAutomation) {
    // Generic error message that doesn't reveal if resource exists
    throw new Error("Automation not found or access denied");
  }

  // Updates the automation
  const updatedAutomation = await updateAutomationRecord(automationId, input);

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
 * Uses authorized query to prevent information disclosure
 */
export async function deleteAutomation(userId: string, automationId: string) {
  // Checks ownership in the database query to prevent information disclosure
  // Returns null if automation doesn't exist OR user doesn't own it
  const existingAutomation = await findAutomationByIdAndUserIdForUpdate(
    automationId,
    userId
  );

  if (!existingAutomation) {
    // Generic error message that doesn't reveal if resource exists
    throw new Error("Automation not found or access denied");
  }

  // Soft delete: mark as DELETED instead of actually deleting
  await softDeleteAutomation(automationId);

  return {
    message: "Automation deleted successfully",
  };
}
