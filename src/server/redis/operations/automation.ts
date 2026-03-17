import { getRedisClient } from "../client";
import { logger } from "../../utils/pino";

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
        `ig:automations_*:${userId}:*`,
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
