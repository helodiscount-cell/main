import { getRedisClient } from "../client";
import { KEYS, TTL } from "../keys";
import { logger } from "../../utils/pino";

/**
 * Domain: Instagram
 * Caches Instagram posts and stories to respect rate limits and speed up the dashboard.
 */

/**
 * Deletes cached posts and stories for a user — forces fresh fetch from Instagram API
 */
export async function invalidateInstagramCache(
  identifier: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const pipeline = redis.pipeline();
  pipeline.del(KEYS.INSTAGRAM_POSTS(identifier));
  pipeline.del(KEYS.INSTAGRAM_STORIES(identifier));

  await pipeline.exec();
  logger.info({ identifier }, "[Redis:Instagram] Cache invalidated");
}

/**
 * Retrieves cached Instagram posts or executes fallback
 */
export async function getCachedPosts<T>(
  identifier: string,
  fetchNative: () => Promise<T>,
): Promise<T> {
  const redis = getRedisClient();
  const key = KEYS.INSTAGRAM_POSTS(identifier);

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
): Promise<T> {
  const redis = getRedisClient();
  const key = KEYS.INSTAGRAM_STORIES(identifier);

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
