/**
 * User Service
 * Contains business logic for user management
 */

import { prisma } from "@/lib/db";

/**
 * Ensures a user exists in the database (creates or updates)
 */
export async function ensureUser(
  clerkId: string,
  userData: {
    email?: string;
    fullName?: string;
    imageUrl?: string | null;
  }
) {
  const user = await prisma.user.upsert({
    where: { clerkId: clerkId },
    update: {
      fullName: userData.fullName || "",
      email: userData.email || "",
      imageUrl: userData.imageUrl ?? null,
    },
    create: {
      clerkId: clerkId,
      fullName: userData.fullName || "",
      email: userData.email || "",
      imageUrl: userData.imageUrl ?? null,
    },
  });

  return { id: user.id };
}

