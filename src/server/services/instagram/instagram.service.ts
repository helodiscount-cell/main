/**
 * Instagram Service
 * Contains business logic for Instagram-related operations
 * Uses Instagram Graph API (graph.instagram.com)
 */

import { getValidAccessToken } from "@/lib/instagram/token-manager";
import { findUserWithInstaAccount } from "@/server/repository/user-profile/user.repository";
import { ERROR_MESSAGES } from "@/server/config/instagram.config";
import type { InstagramStatusConnected } from "@dm-broo/common-types";
import { getRedisClient } from "@/lib/queue/redis";
import { ApiRouteError } from "@/lib/middleware/errors/classes";
import {
  getUserPostsFromInstagram,
  getUserStoriesFromInstagram,
} from "@/lib/instagram/user";

/**
 * Gets Instagram posts for a user
 * @param clerkId - The Clerk ID of the user
 */
export async function getUserPosts(clerkId: string) {
  // Gets the user record with possible Instagram account
  const user = await findUserWithInstaAccount(clerkId);

  if (!user || !user.instaAccount) {
    throw new ApiRouteError(
      ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT,
      "NO_INSTAGRAM_ACCOUNT",
    );
  }

  const { instagramUserId } = user.instaAccount;

  // Gets valid access token (refreshes if needed)
  const accessToken = await getValidAccessToken(user.instaAccount);

  const result = await getUserPostsFromInstagram(instagramUserId, accessToken);

  return result;
}

/**
 * Gets the connection status for a user
 * @param clerkId - The Clerk ID of the user
 * @returns Instagram connection status in the expected format
 */
// We have to rate-limit this API bruh. anyone can spam it.
export async function getInstaConnectionStatus(
  clerkId: string,
): Promise<InstagramStatusConnected> {
  const redis = getRedisClient();

  // Checks cache first
  const instaAccountCacheKey = `ig:account:${clerkId}`;
  const instaAccountCache = await redis.get(instaAccountCacheKey);

  console.log(instaAccountCache);

  // When cache is found
  if (instaAccountCache) return JSON.parse(instaAccountCache);

  // When cache is not found, fetches from database
  const user = await findUserWithInstaAccount(clerkId);

  // If user is not found or their Instagram account is not active, throws an error
  if (!user || !user.instaAccount || !user.instaAccount.isActive) {
    throw new ApiRouteError(
      ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT,
      "NO_INSTAGRAM_ACCOUNT",
    );
  }

  // Otherwise, transforms user data to the expected status format
  const status: InstagramStatusConnected = {
    connected: true,
    username: user.instaAccount.username,
    profilePictureUrl: user.instaAccount.profilePictureUrl,
    accountType: (user.instaAccount.accountType || "PERSONAL") as
      | "BUSINESS"
      | "CREATOR"
      | "PERSONAL",
    connectedAt: user.instaAccount.connectedAt,
    lastSyncedAt: user.instaAccount.lastSyncedAt,
  };

  // And caches the transformed status
  await redis.set(instaAccountCacheKey, JSON.stringify(status), "EX", 60 * 60);

  return status;
}

/**
 * Gets stories for a user
 * @param clerkId - The Clerk ID of the user
 */
export async function getUserStories(clerkId: string) {
  const user = await findUserWithInstaAccount(clerkId);

  if (!user || !user.instaAccount) {
    throw new ApiRouteError(
      ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT,
      "NO_INSTAGRAM_ACCOUNT",
    );
  }

  const { instagramUserId } = user.instaAccount;

  const accessToken = await getValidAccessToken(user.instaAccount);

  const result = await getUserStoriesFromInstagram(
    instagramUserId,
    accessToken,
  );

  return {
    stories: result.data,
    paging: result.data.paging,
  };
}
