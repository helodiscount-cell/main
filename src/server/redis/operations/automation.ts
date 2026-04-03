import { getRedisClient } from "../client";
import { logger } from "../../utils/pino";
import { KEYS, TTL } from "../keys";

/**
 * Domain: Automations
 * Caches the active automation rules and dbAccount object to prevent PostgreSQL hammering
 * during burst comments.
 */

/**
 * Clears all automation caches for a specific Instagram workspace.
 * Invoked by Next.js when automations are created, updated, or deleted.
 */
export async function invalidateAutomations(
  instaAccountId: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const pipeline = redis.pipeline();

    // SCAN for all post and story automation caches scoped to this workspace
    let cursor = "0";
    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        `ig:automation:*:${instaAccountId}:*`,
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
      { instaAccountId },
      "[Redis:Automation] Workspace cache invalidated",
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(
      { instaAccountId, error: message },
      "[Redis:Automation] Failed to invalidate cache",
    );
  }
}

/**
 * Invalidates the automation cache for a specific workspace and post/story target
 */
export async function invalidateAutomationCache(
  instaAccountId: string,
  targetId: string,
  type: "post" | "story" = "post",
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const cacheKey =
    type === "post"
      ? KEYS.AUTOMATIONS_BY_POST(instaAccountId, targetId)
      : KEYS.AUTOMATIONS_BY_STORY(instaAccountId, targetId);

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
 * Clears all cache associated with a specific Instagram workspace on disconnect
 */
export async function clearAllUserCache(
  webhookUserId: string,
  instaAccountId: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const pipeline = redis.pipeline();

  // Webhook connection marker for this IG account
  pipeline.del(`ig:webhook:${webhookUserId}`);

  // All post/story automation caches scoped to this workspace
  let cursor = "0";
  do {
    const [nextCursor, keys] = await redis.scan(
      cursor,
      "MATCH",
      `ig:automation:*:${instaAccountId}:*`,
      "COUNT",
      100,
    );
    cursor = nextCursor;
    if (keys.length > 0) pipeline.del(...keys);
  } while (cursor !== "0");

  await pipeline.exec();
}
