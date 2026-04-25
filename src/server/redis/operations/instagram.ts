import { getRedisClient } from "../client";
import { KEYS, TTL } from "../keys";
import { logger } from "../../utils/pino";

/**
 * Helper to delete all keys matching a prefix using SCAN (cursor-safe)
 */
async function deleteByPrefix(
  redis: NonNullable<ReturnType<typeof getRedisClient>>,
  baseKey: string,
) {
  await redis.del(baseKey);

  let cursor = "0";
  do {
    const [next, keys] = await redis.scan(
      cursor,
      "MATCH",
      `${baseKey}:*`,
      "COUNT",
      200,
    );
    cursor = next;
    if (keys.length) {
      await redis.del(...keys);
    }
  } while (cursor !== "0");
}

/**
 * Domain: Instagram
 * Caches Instagram posts and stories to respect rate limits and speed up the dashboard.
 */

/**
 * Deletes cached posts for a user — forces fresh fetch from Instagram API
 */
export async function invalidateInstagramPostsCache(
  identifier: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  await deleteByPrefix(redis, KEYS.INSTAGRAM_POSTS(identifier));
  logger.info({ identifier }, "[Redis:Instagram] Posts cache invalidated");
}

/**
 * Deletes cached stories for a user — forces fresh fetch from Instagram API
 */
export async function invalidateInstagramStoriesCache(
  identifier: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  await deleteByPrefix(redis, KEYS.INSTAGRAM_STORIES(identifier));
  logger.info({ identifier }, "[Redis:Instagram] Stories cache invalidated");
}

/**
 * Deletes cached BOTH posts and stories for a user — forces fresh fetch from Instagram API
 */
export async function invalidateInstagramCache(
  identifier: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  await Promise.all([
    deleteByPrefix(redis, KEYS.INSTAGRAM_POSTS(identifier)),
    deleteByPrefix(redis, KEYS.INSTAGRAM_STORIES(identifier)),
  ]);

  logger.info({ identifier }, "[Redis:Instagram] Complete cache invalidated");
}

/**
 * Retrieves cached Instagram posts or executes fallback
 */
export async function getCachedPosts<T>(
  identifier: string,
  fetchNative: () => Promise<T>,
  after?: string,
): Promise<T> {
  const redis = getRedisClient();
  const key = KEYS.INSTAGRAM_POSTS(identifier, after);

  if (!redis) return fetchNative();

  try {
    const cached = await redis.get(key);
    if (cached) {
      logger.info({ identifier }, "[Redis:Instagram] Hit: Posts");
      return JSON.parse(cached);
    }

    const data = await fetchNative();

    // Cache with fire and forget
    redis
      .set(key, JSON.stringify(data), "EX", TTL.INSTAGRAM_DATA)
      .catch((err) =>
        logger.warn(
          { error: err.message },
          "[Redis:Instagram] Failed to cache posts",
        ),
      );

    return data;
  } catch (error: any) {
    logger.error(
      { error: error.message },
      "[Redis:Instagram] Error during posts caching",
    );
    return fetchNative();
  }
}

/**
 * Retrieves cached Instagram stories or executes fallback
 */
export async function getCachedStories<T>(
  identifier: string,
  fetchNative: () => Promise<T>,
  after?: string,
): Promise<T> {
  const redis = getRedisClient();
  const key = KEYS.INSTAGRAM_STORIES(identifier, after);

  if (!redis) return fetchNative();

  try {
    const cached = await redis.get(key);
    if (cached) {
      logger.info({ identifier }, "[Redis:Instagram] Hit: Stories");
      return JSON.parse(cached);
    }

    const data = await fetchNative();

    // Cache with fire and forget
    redis
      .set(key, JSON.stringify(data), "EX", TTL.INSTAGRAM_DATA)
      .catch((err) =>
        logger.warn(
          { error: err.message },
          "[Redis:Instagram] Failed to cache stories",
        ),
      );

    return data;
  } catch (error: any) {
    logger.error(
      { error: error.message },
      "[Redis:Instagram] Error during stories caching",
    );
    return fetchNative();
  }
}
