/**
 * Automation Repository
 * Data access layer for Automation model operations
 */

import { prisma } from "@/server/db";
import { executeWithErrorHandling } from "../repository-utils";
import { CreateAutomationInput } from "@dm-broo/common-types";
import { invalidateAutomations } from "@/server/redis";

export interface CreateAutomationData {
  postId: string;
  postCaption?: string | null;
  postMediaUrl?: string | null;
  postPermalink?: string | null;
  postTimestamp?: string | null;
  triggers: string[];
  matchType: string;
  actionType: string;
  replyMessage: string; // Fixed DM message
  replyImage?: string | null; // Optional image URL for DM
  useVariables: boolean;
  commentReplyWhenDm?: string[]; // Optional public replies for DM flows
  // Ask to Follow gate fields
  askToFollowEnabled?: boolean;
  askToFollowMessage?: string | null;
  askToFollowLink?: string | null;
}

export interface UpdateAutomationData {
  postCaption?: string | null;
  triggers?: string[];
  matchType?: string;
  actionType?: string;
  replyMessage?: string; // Fixed DM message
  replyImage?: string | null; // Optional image URL for DM
  commentReplyWhenDm?: string[]; // Optional public replies for DM flows
  useVariables?: boolean;
  askToFollowEnabled?: boolean;
  askToFollowMessage?: string | null;
  askToFollowLink?: string | null;
  status?: string;
}

export interface AutomationFilters {
  userId: string;
  status?: string | string[];
  skip?: number;
  take?: number;
}

/**
 * Creates a new automation
 */
export async function createAutomation(
  userId: string,
  data: CreateAutomationInput,
) {
  const triggerType = data.triggerType ?? "COMMENT_ON_POST";

  const result = await executeWithErrorHandling(
    () =>
      prisma.automation.create({
        data: {
          userId: userId,
          triggerType,
          // Embedded post target (only for COMMENT_ON_POST)
          ...(triggerType === "COMMENT_ON_POST" && data.postId
            ? {
                post: {
                  id: data.postId,
                  caption: data.postCaption ?? null,
                  mediaUrl: data.postMediaUrl ?? null,
                  permalink: data.postPermalink ?? null,
                  timestamp: data.postTimestamp ?? null,
                },
              }
            : {}),
          // Embedded story target (only for STORY_REPLY)
          ...(triggerType === "STORY_REPLY" && data.story
            ? {
                story: {
                  id: data.story.id,
                  mediaUrl: data.story.mediaUrl,
                  mediaType: data.story.mediaType,
                  caption: data.story.caption ?? null,
                  permalink: data.story.permalink,
                  timestamp: data.story.timestamp,
                },
              }
            : {}),
          triggers: data.triggers,
          matchType: data.matchType,
          actionType: data.actionType,
          replyMessage: data.replyMessage,
          replyImage: data.replyImage,
          useVariables: data.useVariables,
          status: "ACTIVE",
          commentReplyWhenDm: data.commentReplyWhenDm,
          askToFollowEnabled: data.askToFollowEnabled ?? false,
          askToFollowMessage: data.askToFollowMessage ?? null,
          askToFollowLink: data.askToFollowLink ?? null,
        },
      }),
    {
      operation: "createAutomation",
      model: "Automation",
      retries: 1,
    },
  );

  if (result) {
    // Invalidate the post/story automations cache so the worker pulls fresh rules
    await invalidateAutomations(userId).catch(() => {});
  }
  return result;
}

/**
 * Finds an automation by ID
 */
export async function findAutomationById(automationId: string) {
  return executeWithErrorHandling(
    () =>
      prisma.automation.findUnique({
        where: { id: automationId },
      }),
    {
      operation: "findAutomationById",
      model: "Automation",
      fallback: null, // Returns null if not found or on error
      retries: 1,
    },
  );
}

/**
 * Finds an automation by ID with executions
 */
export async function findAutomationByIdWithExecutions(automationId: string) {
  return executeWithErrorHandling(
    () =>
      prisma.automation.findUnique({
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
      }),
    {
      operation: "findAutomationByIdWithExecutions",
      model: "Automation",
      fallback: null, // Returns null if not found or on error
      retries: 1,
    },
  );
}

/**
 * Finds an automation by ID and userId (authorized query)
 * Returns null if automation doesn't exist or user doesn't own it
 * This prevents information disclosure by checking ownership in the query
 */
export async function findAutomationByIdAndUserId(
  automationId: string,
  userId: string,
) {
  return executeWithErrorHandling(
    () =>
      prisma.automation.findFirst({
        where: {
          id: automationId,
          userId: userId, // Checks ownership in the query
        },
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
      }),
    {
      operation: "findAutomationByIdAndUserId",
      model: "Automation",
      fallback: null, // Returns null if not found or on error
      retries: 1,
    },
  );
}

/**
 * Finds an automation by ID and userId (for update/delete operations)
 * Returns null if automation doesn't exist or user doesn't own it
 */
export async function findAutomationByIdAndUserIdForUpdate(
  automationId: string,
  userId: string,
) {
  return executeWithErrorHandling(
    () =>
      prisma.automation.findFirst({
        where: {
          id: automationId,
          userId: userId, // Checks ownership in the query
        },
      }),
    {
      operation: "findAutomationByIdAndUserIdForUpdate",
      model: "Automation",
      fallback: null, // Returns null if not found or on error
      retries: 1,
    },
  );
}

/**
 * Finds automations with filters
 */
export async function findUserAutomations(filters: AutomationFilters) {
  return executeWithErrorHandling(
    () => {
      const where: any = {
        userId: filters.userId,
      };

      if (filters.status) {
        if (Array.isArray(filters.status)) {
          where.status = { in: filters.status };
        } else {
          where.status = filters.status;
        }
      }

      return prisma.automation.findMany({
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
        skip: filters.skip,
        take: filters.take,
      });
    },
    {
      operation: "findUserAutomations",
      model: "Automation",
      fallback: [], // Returns empty array on error
      retries: 1,
    },
  );
}

/**
 * Counts automations with filters (for pagination)
 */
export async function countAutomations(
  filters: AutomationFilters,
): Promise<number> {
  return executeWithErrorHandling(
    () => {
      const where: any = {
        userId: filters.userId,
      };

      if (filters.status) {
        where.status = filters.status;
      }

      return prisma.automation.count({ where });
    },
    {
      operation: "countAutomations",
      model: "Automation",
      fallback: 0, // Returns 0 on error
      retries: 1,
    },
  );
}

/**
 * Finds active automations for a specific post
 */
export async function findActiveAutomationsByPost(
  userId: string,
  postId: string,
) {
  return executeWithErrorHandling(
    () =>
      prisma.automation.findMany({
        where: {
          userId,
          post: { is: { id: postId } },
          status: "ACTIVE",
        },
      }),
    {
      operation: "findActiveAutomationsByPost",
      model: "Automation",
      fallback: [], // Returns empty array on error (allows webhook to continue)
      retries: 1,
    },
  );
}

/**
 * Finds active automations for a specific story
 */
export async function findActiveAutomationsByStory(
  userId: string,
  storyId: string,
) {
  return executeWithErrorHandling(
    () =>
      prisma.automation.findMany({
        where: {
          userId,
          story: { is: { id: storyId } },
          status: "ACTIVE",
        },
      }),
    {
      operation: "findActiveAutomationsByStory",
      model: "Automation",
      fallback: [],
      retries: 1,
    },
  );
}

/**
 * Updates an automation
 */
export async function updateAutomation(
  automationId: string,
  data: UpdateAutomationData,
) {
  const result = await executeWithErrorHandling(
    () =>
      prisma.automation.update({
        where: { id: automationId },
        data,
      }),
    {
      operation: "updateAutomation",
      model: "Automation",
      retries: 1,
    },
  );

  if (result) {
    // Invalidate the post/story automations cache so the worker pulls fresh rules
    await invalidateAutomations(result.userId).catch(() => {});
  }
  return result;
}

/**
 * Updates automation trigger stats
 * Fails silently to prevent blocking automation execution
 */
export async function updateAutomationStats(automationId: string) {
  return executeWithErrorHandling(
    () =>
      prisma.automation.update({
        where: { id: automationId },
        data: {
          timesTriggered: {
            increment: 1,
          },
          lastTriggeredAt: new Date(),
        },
      }),
    {
      operation: "updateAutomationStats",
      model: "Automation",
      fallback: null, // Stats update failure shouldn't block execution
      retries: 1,
    },
  );
}

/**
 * Soft deletes an automation (marks as DELETED)
 */
export async function softDeleteAutomation(automationId: string) {
  const result = await executeWithErrorHandling(
    () =>
      prisma.automation.update({
        where: { id: automationId },
        data: { status: "DELETED" },
      }),
    {
      operation: "softDeleteAutomation",
      model: "Automation",
      retries: 1,
    },
  );

  if (result) {
    // Invalidate the post/story automations cache so the worker pulls fresh rules
    await invalidateAutomations(result.userId).catch(() => {});
  }
  return result;
}
