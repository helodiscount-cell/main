/**
 * Automation Execution Repository
 * Data access layer for AutomationExecution model operations
 */

import { prisma } from "@/server/db";
import { executeWithErrorHandling } from "../repository-utils";

import { CreateExecutionData } from "@/types/automation";

/**
 * Creates a new automation execution record
 */
export async function createExecution(data: CreateExecutionData) {
  return executeWithErrorHandling(
    () =>
      prisma.automationExecution.create({
        data: {
          automationId: data.automationId,
          commentId: data.commentId,
          commentText: data.commentText,
          commentUsername: data.commentUsername,
          commentUserId: data.commentUserId,
          actionType: data.actionType,
          sentMessage: data.sentMessage,
          status: data.status,
          errorMessage: data.errorMessage,
          instagramMessageId: data.instagramMessageId,
          executedAt: new Date(),
        },
      }),
    {
      operation: "createExecution",
      model: "AutomationExecution",
      retries: 2,
    },
  );
}

/**
 * Checks if a comment was already processed by an automation
 * Returns false on error to allow processing (fail-open for availability)
 */
export async function isCommentProcessed(
  commentId: string,
  automationId: string,
): Promise<boolean> {
  return executeWithErrorHandling(
    async () => {
      const existing = await prisma.automationExecution.findFirst({
        where: {
          commentId,
          automationId,
        },
      });
      return !!existing;
    },
    {
      operation: "isCommentProcessed",
      model: "AutomationExecution",
      fallback: false, // Fail-open: if we can't check, allow processing
      retries: 1,
    },
  );
}

/**
 * Finds executions by automation ID
 */
export async function findExecutionsByAutomationId(
  automationId: string,
  limit?: number,
) {
  return executeWithErrorHandling(
    () =>
      prisma.automationExecution.findMany({
        where: { automationId },
        orderBy: {
          executedAt: "desc",
        },
        take: limit,
      }),
    {
      operation: "findExecutionsByAutomationId",
      model: "AutomationExecution",
      fallback: [], // Returns empty array on error
      retries: 1,
    },
  );
}

/**
 * Finds executions by comment ID
 */
export async function findExecutionsByCommentId(commentId: string) {
  return executeWithErrorHandling(
    () =>
      prisma.automationExecution.findMany({
        where: { commentId },
        include: {
          automation: true,
        },
      }),
    {
      operation: "findExecutionsByCommentId",
      model: "AutomationExecution",
      fallback: [], // Returns empty array on error
      retries: 1,
    },
  );
}
/**
 * Counts unique automation executions for a user within a date range
 * This is the basis for the "Outreach Impact" / "Automation Reach" widget
 */
export async function countExecutionsByDateRange(
  clerkId: string,
  startDate?: Date,
  endDate?: Date,
): Promise<number> {
  return executeWithErrorHandling(
    () =>
      prisma.automationExecution.count({
        where: {
          automation: {
            user: {
              clerkId: clerkId,
            },
          },
          ...(startDate || endDate
            ? {
                executedAt: {
                  ...(startDate && { gte: startDate }),
                  ...(endDate && { lte: endDate }),
                },
              }
            : {}),
        },
      }),
    {
      operation: "countExecutionsByDateRange",
      model: "AutomationExecution",
      fallback: 0,
      retries: 1,
    },
  );
}

/**
 * Gets executedAt dates for automation executions within a date range
 * Used for building charts and time-series data
 */
export async function getExecutionDatesByDateRange(
  clerkId: string,
  startDate?: Date,
  endDate?: Date,
) {
  return executeWithErrorHandling(
    () =>
      prisma.automationExecution.findMany({
        where: {
          automation: {
            user: {
              clerkId: clerkId,
            },
          },
          ...(startDate || endDate
            ? {
                executedAt: {
                  ...(startDate && { gte: startDate }),
                  ...(endDate && { lte: endDate }),
                },
              }
            : {}),
        },
        select: {
          executedAt: true,
        },
        orderBy: {
          executedAt: "asc",
        },
      }),
    {
      operation: "getExecutionDatesByDateRange",
      model: "AutomationExecution",
      fallback: [],
      retries: 1,
    },
  );
}
