/**
 * User Repository
 * Data access layer for User model operations
 */

import { prisma } from "@/lib/db";
import { executeWithErrorHandling } from "./repository-utils";

export interface CreateUserData {
  clerkId: string;
  fullName?: string;
  email?: string;
  imageUrl?: string | null;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  imageUrl?: string | null;
}

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
      retries: 1,
    }
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
      retries: 1,
    }
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
      retries: 1,
    }
  );
}

/**
 * Finds a user by ID with Instagram account
 */
export async function findUserByIdWithInstaAccount(userId: string) {
  return executeWithErrorHandling(
    () =>
      prisma.user.findUnique({
        where: { id: userId },
        include: { instaAccount: true },
      }),
    {
      operation: "findUserByIdWithInstaAccount",
      model: "User",
      fallback: null,
      retries: 1,
    }
  );
}

/**
 * Creates or updates a user (upsert)
 */
export async function upsertUser(data: CreateUserData) {
  return executeWithErrorHandling(
    () =>
      prisma.user.upsert({
        where: { clerkId: data.clerkId },
        update: {
          fullName: data.fullName || "",
          email: data.email || "",
          imageUrl: data.imageUrl ?? null,
        },
        create: {
          clerkId: data.clerkId,
          fullName: data.fullName || "",
          email: data.email || "",
          imageUrl: data.imageUrl ?? null,
        },
      }),
    {
      operation: "upsertUser",
      model: "User",
      retries: 1,
    }
  );
}

/**
 * Creates a new user
 */
export async function createUser(data: CreateUserData) {
  return executeWithErrorHandling(
    () =>
      prisma.user.create({
        data: {
          clerkId: data.clerkId,
          fullName: data.fullName || "",
          email: data.email || "",
          imageUrl: data.imageUrl ?? null,
        },
      }),
    {
      operation: "createUser",
      model: "User",
      retries: 1,
    }
  );
}

/**
 * Updates a user
 */
export async function updateUser(userId: string, data: UpdateUserData) {
  return executeWithErrorHandling(
    () =>
      prisma.user.update({
        where: { id: userId },
        data,
      }),
    {
      operation: "updateUser",
      model: "User",
      retries: 1,
    }
  );
}

