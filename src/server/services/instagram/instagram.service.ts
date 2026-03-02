/**
 * Instagram Service
 * Contains business logic for Instagram-related operations
 * Uses Instagram Graph API (graph.instagram.com)
 */

import { getValidAccessToken } from "@/server/instagram/token-manager";
import { findUserWithInstaAccount } from "@/server/repository/user/user.repository";
import { ERROR_MESSAGES } from "@/server/config/instagram.config";
import { ApiRouteError } from "@/server/middleware/errors/classes";
import {
  getUserPostsFromInstagram,
  getUserStoriesFromInstagram,
} from "@/server/instagram/user";

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
