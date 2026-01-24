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
  RATE_LIMITS,
  ERROR_MESSAGES,
  buildGraphApiUrl,
} from "@/config/instagram.config";
import type { InstagramPost, InstagramComment, InstagramStatusConnected, InstagramStatusDisconnected } from "@dm-broo/common-types";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";
import { getRedisClient } from "@/lib/queue/redis";

/**
 * Gets Instagram posts for a user
 */
export async function getUserPosts(clerkId: string) {
  // Gets the user record with possible Instagram account
  const user = await findUserWithInstaAccount(clerkId);

  if (!user || !user.instaAccount) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT);
  }

  const { instagramUserId, username } = user.instaAccount;

  // Gets valid access token (refreshes if needed)
  const accessToken = await getValidAccessToken(user.instaAccount.id);

  // Uses Instagram Graph API directly
  const url = buildGraphApiUrl(GRAPH_API.ENDPOINTS.USER_MEDIA(instagramUserId));
  url.searchParams.set("fields", GRAPH_API_FIELDS.POSTS.join(","));
  url.searchParams.set("limit", RATE_LIMITS.POSTS_PER_REQUEST.toString());
  url.searchParams.set("access_token", accessToken);

  // Fetches posts from Instagram Graph API
  try {
    const result = await fetchWithTimeout<any>(url.toString(), {
      method: "GET",
      timeout: 30000, // 30 seconds for posts fetch
      retries: 2,
    });

    const data = result.data;

    // Handles Instagram API error object
    if (data.error) {
      const readableError =
        data.error.message && typeof data.error.message === "string"
          ? data.error.message
          : ERROR_MESSAGES.API.GENERIC_ERROR;
      throw new Error(readableError);
    }

    // Checks for missing data
    if (!Array.isArray(data.data)) {
      throw new Error(ERROR_MESSAGES.API.INVALID_RESPONSE);
    }

    return {
      posts: data.data as InstagramPost[],
      username: username,
      paging: data.paging,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : ERROR_MESSAGES.API.GENERIC_ERROR;
    throw new Error(errorMessage);
  }
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
  const accessToken = await getValidAccessToken(user.instaAccount.id);

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
export async function getConnectionStatus<T>(clerkId: string): Promise<InstagramStatusConnected | InstagramStatusDisconnected> {
  const redis = getRedisClient();

  // Checks cache first
  const instaAccountCacheKey = `ig:account:${clerkId}`;
  const instaAccountCache = await redis.get(instaAccountCacheKey);

  if (instaAccountCache) {
    const cached = JSON.parse(instaAccountCache);
    // If cached data has the correct format, return it
    if (cached && "connected" in cached) {
      return cached as InstagramStatusConnected | InstagramStatusDisconnected;
    }
    // Otherwise, transform it
    if (cached && cached.instaAccount) {
      const status: InstagramStatusConnected = {
        connected: true,
        username: cached.instaAccount.username,
        profilePictureUrl: cached.instaAccount.profilePictureUrl,
        accountType: cached.instaAccount.accountType as "BUSINESS" | "CREATOR" | "PERSONAL",
        connectedAt: new Date(cached.instaAccount.connectedAt),
        lastSyncedAt: cached.instaAccount.lastSyncedAt ? new Date(cached.instaAccount.lastSyncedAt) : null,
      };
      await redis.set(instaAccountCacheKey, JSON.stringify(status), "EX", 60 * 60);
      return status;
    }
  }

  // If cache is not found, fetches from database
  // Finds user and Instagram account from database
  const user = await findUserWithInstaAccount(clerkId);

  if (!user || !user.instaAccount || !user.instaAccount.isActive) {
    return {
      connected: false,
      message: ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT,
    } as InstagramStatusDisconnected;
  }

  // Transforms user data to the expected status format
  const status: InstagramStatusConnected = {
    connected: true,
    username: user.instaAccount.username,
    profilePictureUrl: user.instaAccount.profilePictureUrl,
    accountType: (user.instaAccount.accountType || "PERSONAL") as "BUSINESS" | "CREATOR" | "PERSONAL",
    connectedAt: user.instaAccount.connectedAt,
    lastSyncedAt: user.instaAccount.lastSyncedAt,
  };

  // Caches the transformed status
  await redis.set(instaAccountCacheKey, JSON.stringify(status), "EX", 60 * 60);

  return status;
}
