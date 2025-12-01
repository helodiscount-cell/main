/**
 * Instagram Service
 * Contains business logic for Instagram-related operations
 */

import { prisma } from "@/lib/db";
import { getValidAccessToken } from "@/lib/instagram/token-manager";
import {
  GRAPH_API,
  GRAPH_API_FIELDS,
  RATE_LIMITS,
  ERROR_MESSAGES,
  buildGraphApiUrl,
} from "@/config/instagram.config";
import type { InstagramPost, InstagramComment } from "@insta-auto/common-types";

/**
 * Gets Instagram posts for a user
 */
export async function getUserPosts(clerkId: string) {
  // Gets the user record with possible Instagram account
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { instaAccount: true },
  });

  if (!user || !user.instaAccount) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT);
  }

  const { instagramUserId, username } = user.instaAccount;

  // Gets valid access token (refreshes if needed)
  const accessToken = await getValidAccessToken(user.instaAccount.id);

  // Uses Facebook Graph API for Instagram Business accounts
  const url = buildGraphApiUrl(GRAPH_API.ENDPOINTS.USER_MEDIA(instagramUserId));
  url.searchParams.set("fields", GRAPH_API_FIELDS.POSTS.join(","));
  url.searchParams.set("limit", RATE_LIMITS.POSTS_PER_REQUEST.toString());
  url.searchParams.set("access_token", accessToken);

  // Fetches posts from Instagram Graph API
  const response = await fetch(url.toString());

  if (!response.ok) {
    let instagramError: any;
    try {
      instagramError = await response.json();
    } catch {
      instagramError = {};
    }

    const mainError =
      instagramError.error?.message || ERROR_MESSAGES.API.GENERIC_ERROR;
    throw new Error(mainError);
  }

  const data = await response.json();

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
}

/**
 * Gets comments for a specific post
 */
export async function getPostComments(clerkId: string, postId: string) {
  // Gets the user record with Instagram account
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { instaAccount: true },
  });

  if (!user || !user.instaAccount) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT);
  }

  // Gets valid access token (refreshes if needed)
  const accessToken = await getValidAccessToken(user.instaAccount.id);

  // Builds Graph API URL
  const url = buildGraphApiUrl(GRAPH_API.ENDPOINTS.POST_COMMENTS(postId));
  url.searchParams.set("fields", GRAPH_API_FIELDS.COMMENTS.join(","));
  url.searchParams.set("access_token", accessToken);

  // Fetches comments from Facebook Graph API
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Parses response
  const data = await response.json();

  // Checks for Graph API errors
  if (data.error) {
    throw new Error(data.error.message || ERROR_MESSAGES.API.GENERIC_ERROR);
  }

  return {
    postId: postId,
    comments: (data.data || []) as InstagramComment[],
    paging: data.paging,
  };
}

/**
 * Gets the connection status for a user
 */
export async function getConnectionStatus(clerkId: string) {
  // Finds user with Instagram account
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      instaAccount: true,
    },
  });

  // Returns disconnected status if user or account is not found
  if (!user || !user.instaAccount) {
    return {
      connected: false as const,
      message: "User or Instagram account not found",
    };
  }

  // Returns connected status and account info
  return {
    connected: true as const,
    username: user.instaAccount.username,
    connectedAt: user.instaAccount.connectedAt,
    lastSyncedAt: user.instaAccount.lastSyncedAt,
  };
}
