/**
 * Instagram Service
 * Contains business logic for Instagram-related operations
 * Uses Instagram Graph API (graph.instagram.com)
 */

import { getValidAccessToken } from "@/lib/instagram/token-manager";
import { findUserWithInstaAccount } from "@/server/repositories/user.repository";
import {
  GRAPH_API,
  GRAPH_API_FIELDS,
  ERROR_MESSAGES,
  buildGraphApiUrl,
} from "@/config/instagram.config";
import type { InstagramPost, InstagramComment, InstagramStatusConnected, InstagramStatusDisconnected } from "@dm-broo/common-types";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";
import { getRedisClient } from "@/lib/queue/redis";
import { ApiRouteError } from "@/lib/middleware/errors/classes";
import { getUserPostsFromInstagram } from "@/lib/instagram/user";

/**
 * Gets Instagram posts for a user
 * @param clerkId - The Clerk ID of the user
 */
export async function getUserPosts(clerkId: string) {
  // Gets the user record with possible Instagram account
  const user = await findUserWithInstaAccount(clerkId);

  if (!user || !user.instaAccount) {
    throw new ApiRouteError(ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT, "NO_INSTAGRAM_ACCOUNT");
  }

  const { instagramUserId, username } = user.instaAccount;

  // Gets valid access token (refreshes if needed)
  const accessToken = await getValidAccessToken(user.instaAccount);

  const posts = await getUserPostsFromInstagram(instagramUserId, accessToken);

  return {
    posts: posts.posts,
    username: username,
    paging: posts.paging,
  };
}

/**
 * Gets comments for a specific post
 */
export async function getPostComments(clerkId: string, postId: string) {
  // Gets the user record with Instagram account
  const user = await findUserWithInstaAccount(clerkId);

  if (!user || !user.instaAccount) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT);
  }

  // Gets valid access token (refreshes if needed)
  const accessToken = await getValidAccessToken(user.instaAccount);

  // Builds Graph API URL
  const url = buildGraphApiUrl(GRAPH_API.ENDPOINTS.POST_COMMENTS(postId));
  url.searchParams.set("fields", GRAPH_API_FIELDS.COMMENTS.join(","));
  url.searchParams.set("access_token", accessToken);

  // Fetches comments from Instagram Graph API
  try {
    const result = await fetchWithTimeout<any>(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 seconds for comments fetch
      retries: 2,
    });

    const data = result.data;

    // Checks for Graph API errors
    if (data.error) {
      throw new Error(data.error.message || ERROR_MESSAGES.API.GENERIC_ERROR);
    }

    return {
      postId: postId,
      comments: (data.data || []) as InstagramComment[],
      paging: data.paging,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : ERROR_MESSAGES.API.GENERIC_ERROR;
    throw new Error(errorMessage);
  }
}

/**
 * Gets the connection status for a user
 * @param clerkId - The Clerk ID of the user
 * @returns Instagram connection status in the expected format
 */
export async function getConnectionStatus(clerkId: string): Promise<InstagramStatusConnected> {
  const redis = getRedisClient();

  // Checks cache first
  const instaAccountCacheKey = `ig:account:${clerkId}`;
  const instaAccountCache = await redis.get(instaAccountCacheKey);

  // When cache is found
  if (instaAccountCache) {
    return JSON.parse(instaAccountCache);
  }

  // When cache is not found, fetches from database
  const user = await findUserWithInstaAccount(clerkId);

  // If user is not found or their Instagram account is not active, throws an error
  if (!user || !user.instaAccount || !user.instaAccount.isActive) {
    throw new ApiRouteError(ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT, "NO_INSTAGRAM_ACCOUNT");
  }

  // Otherwise, transforms user data to the expected status format
  const status: InstagramStatusConnected = {
    connected: true,
    username: user.instaAccount.username,
    profilePictureUrl: user.instaAccount.profilePictureUrl,
    accountType: (user.instaAccount.accountType || "PERSONAL") as "BUSINESS" | "CREATOR" | "PERSONAL",
    connectedAt: user.instaAccount.connectedAt,
    lastSyncedAt: user.instaAccount.lastSyncedAt,
  };

  // And caches the transformed status
  await redis.set(instaAccountCacheKey, JSON.stringify(status), "EX", 60 * 60);

  return status;
}
