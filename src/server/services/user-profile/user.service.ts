/**
 * User Service
 * Contains business logic for user management
 */

import { upsertUser } from "@/server/repository/user-profile/user.repository";

/**
 * Ensures a user exists in the database (creates or updates)
 */
export async function ensureUser(
  clerkId: string,
  userData: {
    email?: string;
    fullName?: string;
    imageUrl?: string | null;
  },
) {
  const user = await upsertUser({
    clerkId,
    email: userData.email,
    fullName: userData.fullName,
    imageUrl: userData.imageUrl,
  });

  return { id: user.id };
}
