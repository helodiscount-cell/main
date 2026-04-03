/**
 * User Repository
 * Data access layer for User model operations
 */

import { prisma } from "@/server/db";
import { executeWithErrorHandling } from "../repository-utils";

import { CreateUserData, UpdateUserData } from "@/types/user";

/**
 * Finds a user by Clerk ID
 */
export async function findUserByClerkId(clerkId: string) {
  return executeWithErrorHandling(
    () =>
      prisma.user.findUnique({
        where: { clerkId },
      }),
    {
      operation: "findUserByClerkId",
      model: "User",
      fallback: null,
    },
  );
}

/**
 * Finds a user by ID
 */
export async function findUserById(userId: string) {
  return executeWithErrorHandling(
    () =>
      prisma.user.findUnique({
        where: { id: userId },
      }),
    {
      operation: "findUserById",
      model: "User",
      fallback: null,
    },
  );
}

/**
 * Finds a user with all connected Instagram workspaces
 */
export async function findUserWithInstaAccounts(clerkId: string) {
  return executeWithErrorHandling(
    () =>
      prisma.user.findUnique({
        where: { clerkId },
        include: { instaAccounts: { orderBy: { connectedAt: "asc" } } },
      }),
    {
      operation: "findUserWithInstaAccounts",
      model: "User",
      fallback: null,
    },
  );
}
