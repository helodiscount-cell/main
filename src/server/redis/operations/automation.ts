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
 * Invoked by Next.js when automations are created, updated, or stopped.
 */
export async function invalidateAutomations(
  webhookUserId: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const pipeline = redis.pipeline();

    // 1. Delete the specific account-level DM cache key
    pipeline.del(KEYS.AUTOMATIONS_FOR_ACCOUNT_DM(webhookUserId));

    // 2. SCAN for all post and story automation caches scoped to this workspace
    let cursor = "0";
    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        `ig:automation:*:${webhookUserId}:*`,
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
      { webhookUserId },
      "[Redis:Automation] Workspace cache invalidated using Webhook ID",
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(
      { webhookUserId, error: message },
      "[Redis:Automation] Failed to invalidate cache",
    );
  }
}

/**
 * Invalidates the automation cache for a specific workspace and post/story target
 */
export async function invalidateAutomationCache(
  webhookUserId: string,
  targetId: string,
  type: "post" | "story" | "account" = "post",
  automationId?: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  let cacheKey: string;
  switch (type) {
    case "post":
      cacheKey = KEYS.AUTOMATIONS_BY_POST(webhookUserId, targetId);
      break;
    case "story":
      cacheKey = KEYS.AUTOMATIONS_BY_STORY(webhookUserId, targetId);
      break;
    case "account":
      cacheKey = KEYS.AUTOMATIONS_FOR_ACCOUNT_DM(webhookUserId);
      break;
  }

  const pipeline = redis.pipeline();
  pipeline.del(cacheKey);

  if (automationId) {
    pipeline.del(KEYS.AUTOMATION_BY_ID(webhookUserId, automationId));
  }

  await pipeline.exec();
}

/**
 * Checks if a comment was already processed (with caching)
 */
export async function isCommentProcessedCached(
  webhookUserId: string,
  commentId: string,
  automationId: string,
  dbCheck: () => Promise<boolean>,
): Promise<boolean> {
  const cacheKey = KEYS.COMMENT_PROCESSED(
    webhookUserId,
    commentId,
    automationId,
  );

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
  webhookUserId: string,
  commentId: string,
  automationId: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const cacheKey = KEYS.COMMENT_PROCESSED(
    webhookUserId,
    commentId,
    automationId,
  );
  await redis.set(cacheKey, "1", "EX", TTL.COMMENT_PROCESSED);
}

/**
 * Clears all cache associated with a specific Instagram workspace on disconnect
 */
export async function clearAllUserCache(
  clerkId: string,
  webhookUserId: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const pipeline = redis.pipeline();

  // 1. Webhook connection marker for this IG account
  if (webhookUserId) {
    pipeline.del(`ig:webhook:${webhookUserId}`);
    pipeline.del(KEYS.ACCESS_TOKEN(clerkId, webhookUserId));
    pipeline.del(KEYS.USER_CONNECTION(webhookUserId));
  }

  // 2. Global account-level DM automation cache
  pipeline.del(KEYS.AUTOMATIONS_FOR_ACCOUNT_DM(webhookUserId));

  // 3. All post/story automation caches scoped to this workspace
  let cursor = "0";
  do {
    const [nextCursor, keys] = await redis.scan(
      cursor,
      "MATCH",
      `ig:automation:*:${webhookUserId}:*`,
      "COUNT",
      100,
    );
    cursor = nextCursor;
    if (keys.length > 0) pipeline.del(...keys);
  } while (cursor !== "0");

  await pipeline.exec();
}
