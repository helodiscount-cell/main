import { getRedisClient } from "../client";
import { logger } from "../../utils/pino";
import { KEYS, TTL } from "../keys";

/**
 * Domain: Automations
 * Caches the active automation rules and dbAccount object to prevent PostgreSQL hammering
 * during burst comments.
 */

/**
 * Atomically clears all automation and account caches for a user.
 * Invoked by Next.js when automations or accounts are changed.
 */
export async function invalidateAutomations(userId: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const pipeline = redis.pipeline();

    // Use SCAN to find all Post and Story automation caches
    let cursor = "0";
    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        `ig:automation:*:${userId}:*`,
        "COUNT",
        100,
      );
      cursor = nextCursor;
      if (keys.length > 0) {
        pipeline.del(...keys);
      }
    } while (cursor !== "0");

    await pipeline.exec();
    logger.info(
      { userId },
      "[Redis:Automation] Invalidation completed successfully",
    );
  } catch (error: any) {
    logger.error(
      { userId, error: error.message },
      "[Redis:Automation] Failed to invalidate cache",
    );
  }
}

/**
 * Invalidates the automation existence cache for a specific user and post/story
 */
export async function invalidateAutomationCache(
  userId: string,
  targetId: string,
  type: "post" | "story" = "post",
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const cacheKey =
    type === "post"
      ? KEYS.AUTOMATIONS_BY_POST(userId, targetId)
      : KEYS.AUTOMATIONS_BY_STORY(userId, targetId);

  await redis.del(cacheKey);
}

/**
 * Checks if a comment was already processed (with caching)
 */
export async function isCommentProcessedCached(
  commentId: string,
  automationId: string,
  dbCheck: () => Promise<boolean>,
): Promise<boolean> {
  const cacheKey = KEYS.COMMENT_PROCESSED(commentId, automationId);

  const redis = getRedisClient();
  if (!redis) return dbCheck();

  const cached = await redis.get(cacheKey);
  if (cached === "1") return true;

  const processed = await dbCheck();

  await redis.set(
    cacheKey,
    processed ? "1" : "0",
    "EX",
    processed ? TTL.COMMENT_PROCESSED : 120, // 2 minutes for fail check
  );

  return processed;
}

/**
 * Marks a comment as processed in cache
 */
export async function markCommentProcessed(
  commentId: string,
  automationId: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const cacheKey = KEYS.COMMENT_PROCESSED(commentId, automationId);
  await redis.set(cacheKey, "1", "EX", TTL.COMMENT_PROCESSED);
}

/**
 * Clears all cache related to an Instagram account and user
 */
export async function clearAllUserCache(
  webhookUserId: string,
  clerkId: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const pipeline = redis.pipeline();

  // Webhook cache (Uses webhook ID)
  // Note: we might want to add this to KEYS registry too
  pipeline.del(`ig:webhook:${webhookUserId}`);

  // Invalidate all post/story automations for this user
  let cursor = "0";
  do {
    const [nextCursor, keys] = await redis.scan(
      cursor,
      "MATCH",
      `ig:automation:*:${clerkId}:*`,
      "COUNT",
      100,
    );
    cursor = nextCursor;
    if (keys.length > 0) pipeline.del(...keys);
  } while (cursor !== "0");

  pipeline.del(`ig:account:${clerkId}`);
  await pipeline.exec();
}
