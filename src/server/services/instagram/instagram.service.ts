/**
 * Instagram Service
 * Workspace-scoped — all operations require an active instaAccountId
 */

import { getValidAccessToken } from "@/server/instagram/token-manager";
import { ERROR_MESSAGES } from "@/server/config/instagram.config";
import { ApiRouteError } from "@/server/middleware/errors/classes";
import {
  getUserPostsFromInstagram,
  getUserStoriesFromInstagram,
} from "@/server/instagram/user";
import {
  getCachedPosts,
  getCachedStories,
  invalidateInstagramPostsCache,
  invalidateInstagramStoriesCache,
} from "@/server/redis";
import { prisma } from "@/server/db";

// Resolves the active InstaAccount by its ID or throws if unavailable
async function resolveActiveAccount(instaAccountId: string) {
  const account = await prisma.instaAccount.findUnique({
    where: { id: instaAccountId, isActive: true },
  });
  if (!account) {
    throw new ApiRouteError(
      ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT,
      "NO_INSTAGRAM_ACCOUNT",
    );
  }
  return account;
}

// Gets Instagram posts for the active workspace
export async function getUserPosts(
  instaAccountId: string,
  forceRefresh?: boolean,
) {
  const account = await resolveActiveAccount(instaAccountId);
  const accessToken = await getValidAccessToken(account);
  const identifier = account.webhookUserId || account.instagramUserId;

  if (forceRefresh) {
    await invalidateInstagramPostsCache(identifier);
  }

  // Cache by webhookUserId to align with standardized Redis key architecture
  return getCachedPosts(identifier, async () =>
    getUserPostsFromInstagram(account.instagramUserId, accessToken),
  );
}

// Gets Instagram stories for the active workspace
export async function getUserStories(
  instaAccountId: string,
  forceRefresh?: boolean,
) {
  const account = await resolveActiveAccount(instaAccountId);
  const accessToken = await getValidAccessToken(account);
  const identifier = account.webhookUserId || account.instagramUserId;

  if (forceRefresh) {
    await invalidateInstagramStoriesCache(identifier);
  }

  const result = await getCachedStories(identifier, async () =>
    getUserStoriesFromInstagram(account.instagramUserId, accessToken),
  );

  return {
    stories: result.data.data,
    paging: result.data.paging,
  };
}
