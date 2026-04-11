import { getRedisClient } from "@/server/redis/client";
import { KEYS } from "@/server/redis/keys";
import { logger } from "@/server/utils/pino";
import type { PlanId } from "@/configs/plans.config";

/**
 * Sets all three billing Redis keys atomically for a user.
 * Called on subscription activation, renewal, and downgrade.
 */
export async function syncCreditStateToRedis(
  clerkId: string,
  creditsUsed: number,
  creditLimit: number,
  status: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) {
    logger.warn(
      { clerkId },
      "Redis unavailable — billing state not synced to cache",
    );
    return;
  }

  try {
    const multi = redis.multi();
    const SIX_MONTHS = 180 * 24 * 60 * 60; // 6-month TTL for billing cache
    multi.set(
      KEYS.CREDIT_USED(clerkId),
      creditsUsed.toString(),
      "EX",
      SIX_MONTHS,
    );
    multi.set(
      KEYS.CREDIT_LIMIT(clerkId),
      creditLimit.toString(),
      "EX",
      SIX_MONTHS,
    );
    multi.set(KEYS.SUB_STATUS(clerkId), status, "EX", SIX_MONTHS);
    await multi.exec();

    logger.info(
      { clerkId, creditsUsed, creditLimit, status },
      "Billing state synced to Redis",
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error(
      { clerkId, err: message },
      "Failed to sync billing state to Redis",
    );
  }
}

/**
 * Increments the creditsUsed counter in Redis by 1.
 * Returns the new total (used by the persist layer after a successful DM).
 * Ensures an expiry is set if a new key is created.
 */
export async function incrementCreditUsedR(
  clerkId: string,
): Promise<number | null> {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const SIX_MONTHS = 180 * 24 * 60 * 60;
    const key = KEYS.CREDIT_USED(clerkId);

    const multi = redis.multi();
    multi.incr(key);
    multi.ttl(key);

    const results = await multi.exec();
    if (!results) return null;

    // results is [[error, result], [error, result]]
    const count = results[0][1] as number;
    const ttl = results[1][1] as number;

    // If key is new (TTL -1), set expiry
    if (ttl === -1) {
      await redis.expire(key, SIX_MONTHS);
    }

    return count;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error(
      { clerkId, err: message },
      "Failed to increment credit counter in Redis",
    );
    return null;
  }
}

/**
 * Reads current credit state from Redis.
 * Returns null values when the key is missing (indicating a cache miss).
 */
export async function getCreditStateR(clerkId: string): Promise<{
  creditsUsed: number | null;
  creditLimit: number | null;
  subStatus: string | null;
}> {
  const redis = getRedisClient();
  if (!redis) return { creditsUsed: null, creditLimit: null, subStatus: null };

  try {
    const [used, limit, status] = await redis.mget(
      KEYS.CREDIT_USED(clerkId),
      KEYS.CREDIT_LIMIT(clerkId),
      KEYS.SUB_STATUS(clerkId),
    );

    return {
      creditsUsed: used !== null ? parseInt(used, 10) : null,
      creditLimit: limit !== null ? parseInt(limit, 10) : null,
      subStatus: status,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error(
      { clerkId, err: message },
      "Failed to read credit state from Redis",
    );
    return { creditsUsed: null, creditLimit: null, subStatus: null };
  }
}
