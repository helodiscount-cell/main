/**
 * Redis-Backed Instagram Rate Limiter
 * Tracks and enforces Meta Graph API Rate Limits globally between frontend and worker.
 */

import { getRedisClient } from "@/server/redis/client";
import { KEYS } from "@/server/redis/keys";
import { RATE_LIMIT_THRESHOLDS } from "@/server/config/instagram.config";
import { logger } from "@/server/utils/pino";

export class InstagramRateLimitError extends Error {
  isAppLevel: boolean;

  constructor(message: string, isAppLevel: boolean = false) {
    super(message);
    this.name = "InstagramRateLimitError";
    this.isAppLevel = isAppLevel;
  }
}

/**
 * Updates Redis with new usage percentages extracted from headers
 */
export async function updateRateLimitsFromHeadersR(
  instagramUserId: string,
  appUsage: Record<string, any> | null,
  businessUsage: Record<string, any> | null,
) {
  const redis = getRedisClient();
  if (!redis) return;
  const pipeline = redis.pipeline();

  if (appUsage && typeof appUsage.call_count === "number") {
    // App usage metric: 1 hour rolling window from Meta usually, but the header is live.
    pipeline.set(KEYS.APP_USAGE(), appUsage.call_count, "EX", 300);
  }

  if (businessUsage) {
    // Find the highest call_count across business usage types
    let maxAccountUsage = 0;
    for (const key of Object.keys(businessUsage)) {
      const metrics = businessUsage[key];
      if (Array.isArray(metrics) && metrics.length > 0) {
        const count = metrics[0].call_count;
        if (typeof count === "number" && count > maxAccountUsage) {
          maxAccountUsage = count;
        }
      }
    }

    if (maxAccountUsage > 0) {
      pipeline.set(
        KEYS.ACCOUNT_USAGE(instagramUserId),
        maxAccountUsage,
        "EX",
        300,
      );
    }
  }

  await pipeline.exec();
}

/**
 * Verifies if it is safe to make an Instagram API call based on Redis limits
 * Throws InstagramRateLimitError if unsafe.
 */
export async function checkRateLimits(instagramUserId: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;
  const [appUsageStr, accountUsageStr] = await redis.mget(
    KEYS.APP_USAGE(),
    KEYS.ACCOUNT_USAGE(instagramUserId),
  );

  const appUsage = appUsageStr ? parseInt(appUsageStr, 10) : 0;
  const accountUsage = accountUsageStr ? parseInt(accountUsageStr, 10) : 0;

  if (appUsage >= RATE_LIMIT_THRESHOLDS.APP_USAGE_STOP_PERCENT) {
    logger.warn(
      { appUsage, threshold: RATE_LIMIT_THRESHOLDS.APP_USAGE_STOP_PERCENT },
      "App-Level Rate Limit Threshold Exceeded",
    );
    throw new InstagramRateLimitError(
      `App-Level Rate Limit at ${appUsage}%`,
      true,
    );
  }

  if (accountUsage >= RATE_LIMIT_THRESHOLDS.ACCOUNT_USAGE_STOP_PERCENT) {
    logger.warn(
      {
        instagramUserId,
        accountUsage,
        threshold: RATE_LIMIT_THRESHOLDS.ACCOUNT_USAGE_STOP_PERCENT,
      },
      "Account-Level Rate Limit Threshold Exceeded",
    );
    throw new InstagramRateLimitError(
      `Account-Level Rate Limit at ${accountUsage}%`,
      false,
    );
  }
}

/**
 * Utility to get current usage stats for debugging
 */
export async function getRateLimitStats(instagramUserId: string) {
  const redis = getRedisClient();
  if (!redis) return { appUsagePercent: 0, accountUsagePercent: 0 };
  const [appUsage, accountUsage] = await redis.mget(
    KEYS.APP_USAGE(),
    KEYS.ACCOUNT_USAGE(instagramUserId),
  );
  return {
    appUsagePercent: appUsage ? parseInt(appUsage, 10) : 0,
    accountUsagePercent: accountUsage ? parseInt(accountUsage, 10) : 0,
  };
}
