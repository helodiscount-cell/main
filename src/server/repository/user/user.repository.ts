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
 * Finds a user with Instagram account
 */
export async function findUserWithInstaAccount(clerkId: string) {
  return executeWithErrorHandling(
    () =>
      prisma.user.findUnique({
        where: { clerkId },
        include: { instaAccount: true },
      }),
    {
      operation: "findUserWithInstaAccount",
      model: "User",
      fallback: null,
    },
  );
}
