import { getRedisClient } from "@/server/redis/client";
import { KEYS } from "@/server/redis/keys";
import { logger } from "@/server/utils/pino";
import type { PlanId } from "@/configs/plans.config";

/**
 * Sets all three billing Redis keys atomically for a user.
 * Called on subscription activation, renewal, and downgrade.
 */
export async function syncCreditStateToRedis(
  userId: string,
  creditsUsed: number,
  creditLimit: number,
  status: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) {
    logger.warn(
      { userId },
      "Redis unavailable — billing state not synced to cache",
    );
    return;
  }

  try {
    const pipeline = redis.pipeline();
    pipeline.set(KEYS.CREDIT_USED(userId), creditsUsed.toString());
    pipeline.set(KEYS.CREDIT_LIMIT(userId), creditLimit.toString());
    pipeline.set(KEYS.SUB_STATUS(userId), status);
    await pipeline.exec();

    logger.info(
      { userId, creditsUsed, creditLimit, status },
      "Billing state synced to Redis",
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error(
      { userId, err: message },
      "Failed to sync billing state to Redis",
    );
  }
}

/**
 * Increments the creditsUsed counter in Redis by 1.
 * Returns the new total (used by the persist layer after a successful DM).
 */
export async function incrementCreditUsedR(
  userId: string,
): Promise<number | null> {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    return await redis.incr(KEYS.CREDIT_USED(userId));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error(
      { userId, err: message },
      "Failed to increment credit counter in Redis",
    );
    return null;
  }
}

/**
 * Reads current credit state from Redis.
 * Returns null values when the key is missing (indicating a cache miss).
 */
export async function getCreditStateR(userId: string): Promise<{
  creditsUsed: number | null;
  creditLimit: number | null;
  subStatus: string | null;
}> {
  const redis = getRedisClient();
  if (!redis) return { creditsUsed: null, creditLimit: null, subStatus: null };

  try {
    const [used, limit, status] = await redis.mget(
      KEYS.CREDIT_USED(userId),
      KEYS.CREDIT_LIMIT(userId),
      KEYS.SUB_STATUS(userId),
    );

    return {
      creditsUsed: used !== null ? parseInt(used, 10) : null,
      creditLimit: limit !== null ? parseInt(limit, 10) : null,
      subStatus: status,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error(
      { userId, err: message },
      "Failed to read credit state from Redis",
    );
    return { creditsUsed: null, creditLimit: null, subStatus: null };
  }
}
