/**
 * Automation Execution Repository
 * Data access layer for AutomationExecution model operations
 */

import { prisma } from "@/server/db";
import { executeWithErrorHandling } from "../repository-utils";

// Counts automation executions for a workspace within a date range
export async function countExecutionsByDateRange(
  instaAccountId: string,
  startDate?: Date,
  endDate?: Date,
): Promise<number> {
  return executeWithErrorHandling(
    () =>
      prisma.automationExecution.count({
        where: {
          automation: { instaAccountId },
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

// Gets executedAt dates for a workspace's executions within a date range
export async function getExecutionDatesByDateRange(
  instaAccountId: string,
  startDate?: Date,
  endDate?: Date,
) {
  return executeWithErrorHandling(
    () =>
      prisma.automationExecution.findMany({
        where: {
          automation: { instaAccountId },
          ...(startDate || endDate
            ? {
                executedAt: {
                  ...(startDate && { gte: startDate }),
                  ...(endDate && { lte: endDate }),
                },
              }
            : {}),
        },
        select: { executedAt: true },
        orderBy: { executedAt: "asc" },
      }),
    {
      operation: "getExecutionDatesByDateRange",
      model: "AutomationExecution",
      fallback: [],
      retries: 1,
    },
  );
}
