/**
 * Instagram Service
 * Contains business logic for Instagram-related operations
 * Uses Instagram Graph API (graph.instagram.com)
 */

import { getValidAccessToken } from "@/server/instagram/token-manager";
import { findUserWithInstaAccount } from "@/server/repository/user/user.repository";
import { ERROR_MESSAGES } from "@/server/config/instagram.config";
import type { InstagramStatusConnected } from "@dm-broo/common-types";
import { getRedisClient } from "@/server/redis";
import { ApiRouteError } from "@/server/middleware/errors/classes";
import {
  getUserPostsFromInstagram,
  getUserStoriesFromInstagram,
} from "@/server/instagram/user";
import { redisKeys } from "@/server/redis/keys";

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
    stories: result.data.data,
    paging: result.data.paging,
  };
}

export const getInstaUserProfile = async (clerkId: string) => {
  const redis = getRedisClient();
  const data = await redis.get(redisKeys.instagram.account(clerkId));

  if (data) {
    return JSON.parse(data);
  }

  // Cache miss, let's fetch from DB
  const user = await findUserWithInstaAccount(clerkId);
  if (user && user.instaAccount) {
    const accountData = {
      id: user.instaAccount.id,
      username: user.instaAccount.username,
      accountType: user.instaAccount.accountType,
      profilePictureUrl: user.instaAccount.profilePictureUrl,
      biography: user.instaAccount.biography,
      followersCount: user.instaAccount.followersCount,
      followsCount: user.instaAccount.followsCount,
      mediaCount: user.instaAccount.mediaCount,
      lastSyncedAt: user.instaAccount.lastSyncedAt,
    };

    // Cache it for future, let's use a TTL of 1 hour to prevent stale state forever
    await redis.set(
      redisKeys.instagram.account(clerkId),
      JSON.stringify(accountData),
    );

    return accountData;
  }

  return null;
};
