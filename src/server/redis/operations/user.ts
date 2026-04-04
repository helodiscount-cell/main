import { getRedisClient } from "../client";
import { KEYS, TTL } from "../keys";
import { RedisError } from "../errors";
import { logger } from "../../utils/pino";

/**
 * Domain: User Connections
 * Tracks whether a user's Instagram account is actively connected.
 * This is used to short-circuit processing for disconnected users without hitting MongoDB.
 */

/**
 * Checks if a user is actively connected.
 *
 * @param instagramUserId User ID from Instagram
 * @param dbFallback The fallback function to query MongoDB if Redis misses
 * @returns true if connected, false if disconnected
 */
export async function isUserConnectedR(
  instagramUserId: string,
  dbFallback: () => Promise<boolean>,
): Promise<boolean> {
  const redis = getRedisClient();
  const key = KEYS.USER_CONNECTION(instagramUserId);

  if (!redis) {
    logger.debug(
      { instagramUserId },
      "[Redis:User] Client unavailable, falling back to MongoDB",
    );
    return dbFallback();
  }

  try {
    const cached = await redis.get(key);

    // Cache Hit
    if (cached) {
      logger.debug(
        { instagramUserId, hit: true },
        "[Redis:User] Status retrieved",
      );
      return cached === "1";
    }

    // Cache Miss -> DB Fallback -> Repopulate
    logger.debug(
      { instagramUserId, hit: false },
      "[Redis:User] Status missing, falling back to MongoDB",
    );
    const isConnected = await dbFallback();

    // Repopulate Cache (Fire and Forget to avoid blocking)
    redis
      .set(key, isConnected ? "1" : "0", "EX", TTL.USER_CONNECTED)
      .catch((e) => {
        logger.warn(
          { instagramUserId, error: e.message },
          "[Redis:User] Failed to repopulate cache",
        );
      });

    return isConnected;
  } catch (error: any) {
    logger.error(
      { instagramUserId, error: error.message },
      "[Redis:User] Operation failed, falling back to MongoDB",
    );
    // Fallback on error
    return dbFallback();
  }
}

/**
 * Explicitly sets a user as connected in Redis.
 * Used when a user successfully connects their Instagram account.
 */
export async function setUserConnected(instagramUserId: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const key = KEYS.USER_CONNECTION(instagramUserId);
  try {
    await redis.set(key, "1", "EX", TTL.USER_CONNECTED);
    logger.info({ instagramUserId }, "[Redis:User] Status marked as connected");
  } catch (error: any) {
    // We log but don't throw, as Next.js app / Worker shouldn't crash over cache update failures
    logger.error(
      { instagramUserId, error: error.message },
      "[Redis:User] Failed to set connected status",
    );
  }
}

/**
 * Atomically clears all cache keys associated with a user when they disconnect.
 * Requires `accountId` to find associated tokens.
 */
export async function invalidateUser(
  instagramUserId: string,
  instaAccountId: string,
  accountId?: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const pipeline = redis.pipeline();
    pipeline.del(KEYS.USER_CONNECTION(instagramUserId));
    pipeline.del(KEYS.ACCOUNT_BY_IG(instagramUserId));

    if (accountId) {
      pipeline.del(KEYS.ACCESS_TOKEN(accountId));
    }

    // SCAN and delete all automation cache keys scoped to this IG account
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

    // Also delete the DM automation key (not pattern-matched above)
    pipeline.del(KEYS.AUTOMATIONS_FOR_ACCOUNT_DM(instaAccountId));

    await pipeline.exec();
    logger.info(
      { instagramUserId, instaAccountId, accountId },
      "[Redis:User] All account cache invalidated",
    );
  } catch (error: any) {
    logger.error(
      { instagramUserId, instaAccountId, error: error.message },
      "[Redis:User] Failed to invalidate cache",
    );
  }
}
