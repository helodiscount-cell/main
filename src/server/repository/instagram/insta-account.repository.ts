/**
 * Instagram Account Repository
 * Data access layer for InstaAccount model operations
 * Supports Instagram Login (no Facebook Page required)
 */

import { prisma } from "@/server/db";
import { executeWithErrorHandling } from "../repository-utils";
import { logger } from "@/server/utils/pino";
import { ApiRouteError } from "@/server/middleware/errors/classes";

/**
 * Finds an Instagram account by its Webhook Business ID (for webhooks)
 */
export async function findInstaAccountByWebhookUserId(webhookUserId: string) {
  // Ensures Webhook user ID is a string for consistent querying
  const userIdString = String(webhookUserId);

  return executeWithErrorHandling(
    () =>
      prisma.instaAccount.findUnique({
        where: { webhookUserId: userIdString },
        select: {
          id: true,
          userId: true,
          accessToken: true,
          instagramUserId: true,
          webhookUserId: true,
          isActive: true,
          username: true,
          user: {
            select: {
              clerkId: true,
            },
          },
        },
      }),
    {
      operation: "findInstaAccountByWebhookUserId",
      model: "InstaAccount",
      fallback: null,
      retries: 1,
    },
  );
}

/**
 * Finds an Instagram account by ID
 */
export async function findInstaAccountById(id: string) {
  return executeWithErrorHandling(
    () =>
      prisma.instaAccount.findUnique({
        where: { id },
      }),
    {
      operation: "findInstaAccountById",
      model: "InstaAccount",
      fallback: null,
      retries: 1,
    },
  );
}

/**
 * Finds an Instagram account by automation ID
 */
export async function findInstaAccountByAutomationId(automationId: string) {
  return executeWithErrorHandling(
    () =>
      prisma.instaAccount.findFirst({
        where: {
          automations: {
            some: {
              id: automationId,
            },
          },
        },
      }),
    {
      operation: "findInstaAccountByAutomationId",
      model: "InstaAccount",
      fallback: null,
      retries: 1,
    },
  );
}

/**
 * Deletes an Instagram account
 * @param instaAccountId - The DB id of the Instagram account
 * @param clerkId - The Clerk ID of the user (enforces ownership)
 */
export async function deleteInstaAccount(
  instaAccountId: string,
  clerkId: string,
) {
  return executeWithErrorHandling(
    async () => {
      // Execute lookup and deletion in a single atomic transaction
      const result = await prisma.$transaction(async (tx) => {
        // 1. Verify ownership
        const account = await tx.instaAccount.findFirst({
          where: { id: instaAccountId, user: { clerkId } },
          select: {
            id: true,
            webhookUserId: true,
            instagramUserId: true,
            user: { select: { clerkId: true } },
          },
        });

        if (!account) {
          // Diagnostics for account lookup failure
          logger.info(
            { instaAccountId, clerkId },
            "Instagram account not found or access denied for deletion",
          );
          throw new ApiRouteError(
            "Instagram account not found or access denied",
            "INSTA_NOT_FOUND",
            404,
          );
        }

        // 2. Atomic delete
        const deleteResult = await tx.instaAccount.deleteMany({
          where: { id: instaAccountId, user: { clerkId } },
        });

        return { account, count: deleteResult.count };
      });

      // 3. Clear all cache for this workspace ONLY if deletion succeeded
      if (result.count > 0) {
        const { clearAllUserCache } =
          await import("@/server/redis/operations/automation");
        const identifier =
          result.account.instagramUserId || result.account.webhookUserId || "";
        const clerkUserId = result.account.user.clerkId;

        await clearAllUserCache(clerkUserId, identifier).catch((error) => {
          logger.error(
            { instaAccountId, clerkId, identifier },
            "Failed to clear account cache after disconnect",
            error instanceof Error ? error : new Error(String(error)),
          );
        });
      }

      return { count: result.count };
    },
    {
      operation: "deleteInstaAccount",
      model: "InstaAccount",
      retries: 1,
    },
  );
}

/**
 * Softly deactivates an Instagram account by setting isActive to false
 * @param instaAccountId - The ID of the Instagram account
 * @param clerkId - The Clerk ID of the user (enforces ownership)
 * @returns The updated Instagram account
 */
export async function deactivateInstaAccount(
  instaAccountId: string,
  clerkId: string,
) {
  return executeWithErrorHandling(
    () =>
      prisma.instaAccount.update({
        where: { id: instaAccountId, user: { clerkId } },
        data: { isActive: false },
      }),
    {
      operation: "deactivateInstaAccount",
      model: "InstaAccount",
      retries: 1,
    },
  );
}
