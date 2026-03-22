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
export async function getUniqueContactsForUser(userId: string) {
  return executeWithErrorHandling(
    async () => {
      // Find all executions for this user's automations
      const executions = await prisma.automationExecution.findMany({
        where: {
          automation: {
            userId: userId,
          },
        },
        include: {
          automation: {
            select: {
              triggerType: true,
              post: true,
              story: true,
            },
          },
        },
        orderBy: {
          executedAt: "desc",
        },
      });

      // Group by commentUserId to get unique contacts
      const contactMap = new Map();

      for (const execution of executions) {
        if (!contactMap.has(execution.commentUserId)) {
          // Determine type: mapping triggerType to UI labels
          let type: "Post" | "Reel" = "Post";
          if (execution.automation.triggerType === "STORY_REPLY") {
            type = "Reel"; // Or "Story", following mock data preference
          }

          contactMap.set(execution.commentUserId, {
            id: execution.commentUserId,
            username: execution.commentUsername,
            avatarUrl: `https://i.pravatar.cc/150?u=${execution.commentUsername}`, // Placeholder as we don't store avatar
            type: type,
            email: null, // Email not available in executions
            lastInteractedAt: execution.executedAt,
          });
        }
      }

      return Array.from(contactMap.values());
    },
    {
      operation: "getUniqueContactsForUser",
      model: "AutomationExecution",
      fallback: [],
      retries: 1,
    },
  );
}
