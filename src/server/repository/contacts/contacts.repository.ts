/**
 * Contacts Repository
 * Data access layer for derived Contact information from AutomationExecutions
 */

import { prisma } from "@/server/db";
import { executeWithErrorHandling } from "../repository-utils";

/**
 * Fetches unique contacts (people who interacted) for a specific user
 * A contact is uniquely identified by their commentUserId or commentUsername
 */
export async function getUniqueContactsForUser(
  userId: string,
  limit: number = 20,
  cursor?: string,
) {
  return executeWithErrorHandling(
    async () => {
      // Fetch unique contacts using Prisma's distinct feature for efficient pagination
      const executions = await prisma.automationExecution.findMany({
        where: {
          automation: {
            userId: userId,
          },
        },
        // We use distinct on commentUserId to ensure each contact appears once
        distinct: ["commentUserId"],
        include: {
          automation: {
            select: {
              triggerType: true,
            },
          },
        },
        orderBy: {
          executedAt: "desc",
        },
        // Fetch one extra to determine if there are more results
        take: limit + 1,
        // Use the execution ID as the cursor
        cursor: cursor ? { id: cursor } : undefined,
        // Skip the cursor itself when requesting the next page
        skip: cursor ? 1 : 0,
      });

      // Interface for normalized contact data
      interface RepositoryContact {
        id: string; // The commentUserId
        username: string;
        avatarUrl: string;
        type: "Post" | "Reel" | "Story";
        email: null;
        lastInteractedAt: Date;
        lastExecutionId: string; // Stored to serve as the next cursor
      }

      // Map the executions to the normalized contact format
      const contacts: RepositoryContact[] = executions
        .slice(0, limit)
        .map((execution) => {
          let type: "Post" | "Reel" | "Story" = "Post";
          if (execution.automation.triggerType === "STORY_REPLY") {
            type = "Story";
          }

          return {
            id: execution.commentUserId,
            username: execution.commentUsername,
            avatarUrl: `https://i.pravatar.cc/150?u=${execution.commentUsername}`,
            type: type,
            email: null,
            lastInteractedAt: execution.executedAt,
            lastExecutionId: execution.id,
          };
        });

      // Determine the cursor for the next page
      const nextCursor =
        executions.length > limit ? executions[limit].id : undefined;

      return {
        contacts,
        nextCursor,
      };
    },
    {
      operation: "getUniqueContactsForUser",
      model: "AutomationExecution",
      fallback: { contacts: [], nextCursor: undefined },
      retries: 1,
    },
  );
}
