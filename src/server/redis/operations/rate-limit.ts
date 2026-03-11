import { getRedisClient } from "../client";
import { KEYS, TTL } from "../keys";
import { logger } from "../../utils/pino";
import { RATE_LIMIT_THRESHOLDS } from "@/server/config/instagram.config";

export class InstagramRateLimitError extends Error {
  isAppLevel: boolean;

  constructor(message: string, isAppLevel: boolean = false) {
    super(message);
    this.name = "InstagramRateLimitError";
    this.isAppLevel = isAppLevel;
  }
}

/**
 * Domain: Meta Graph API Rate Limits
 * Enforces dynamic application-level and account-level API call budgets.
 */

/**
 * Stores limits extracted dynamically from the "X-App-Usage" or "X-Business-Use-Case-Usage" headers.
 * Following Meta documentation: parses call_count, total_time, and total_cputime and takes the maximum.
 */
export async function updateRateLimitsFromHeadersR(
  instagramUserId: string,
  appUsage: Record<string, any> | null,
  businessUsage: Record<string, any> | null,
  adAccountUsage?: Record<string, any> | null,
) {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const pipeline = redis.pipeline();

    // 1. App-Level Usage (X-App-Usage)
    if (appUsage) {
      // Take the max of call_count, total_time, and total_cputime
      const usage = Math.max(
        appUsage.call_count || 0,
        appUsage.total_time || 0,
        appUsage.total_cputime || 0,
      );
      if (usage > 0) {
        pipeline.set(KEYS.APP_USAGE(), usage, "EX", TTL.API_USAGE);
      }
    }

    // 2. Business Use Case Usage (X-Business-Use-Case-Usage)
    if (businessUsage) {
      let maxAccountUsage = 0;
      for (const key of Object.keys(businessUsage)) {
        const metrics = businessUsage[key];
        if (Array.isArray(metrics) && metrics.length > 0) {
          const m = metrics[0];
          const usage = Math.max(
            m.call_count || 0,
            m.total_time || 0,
            m.total_cputime || 0,
          );
          if (usage > maxAccountUsage) {
            maxAccountUsage = usage;
          }
        }
      }

      if (maxAccountUsage > 0) {
        pipeline.set(
          KEYS.ACCOUNT_USAGE(instagramUserId),
          maxAccountUsage,
          "EX",
          TTL.API_USAGE,
        );
      }
    }

    // 3. Ad Account Usage (X-Ad-Account-Usage)
    if (adAccountUsage && adAccountUsage.acc_id_util_pct) {
      const usage = Math.round(adAccountUsage.acc_id_util_pct);
      pipeline.set(
        KEYS.ACCOUNT_USAGE(instagramUserId),
        usage,
        "EX",
        TTL.API_USAGE,
      );
    }

    await pipeline.exec();
    logger.debug({ instagramUserId }, "[Redis:RateLimit] Headers synchronized");
  } catch (error: any) {
    logger.error(
      { instagramUserId, error: error.message },
      "[Redis:RateLimit] Failed to update headers",
    );
  }
}

/**
 * Throws InstagramRateLimitError if the current API usage is dangerously strict,
 * allowing the executing worker to gracefully abort and transfer the job to the Delayed queue.
 */
export async function checkRateLimits(instagramUserId: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) {
    logger.warn(
      { instagramUserId },
      "[Redis:RateLimit] Client down, falling open to API",
    );
    return; // Fallback: Allow API call, rely on standard try/catch if HTTP 429 returns natively
  }

  try {
    const [appUsageStr, accountUsageStr] = await redis.mget(
      KEYS.APP_USAGE(),
      KEYS.ACCOUNT_USAGE(instagramUserId),
    );

    const appUsage = appUsageStr ? parseInt(appUsageStr, 10) : 0;
    const accountUsage = accountUsageStr ? parseInt(accountUsageStr, 10) : 0;

    if (appUsage >= RATE_LIMIT_THRESHOLDS.APP_USAGE_STOP_PERCENT) {
      logger.warn(
        { appUsage, threshold: RATE_LIMIT_THRESHOLDS.APP_USAGE_STOP_PERCENT },
        "[Redis:RateLimit] App Limit Exceeded",
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
        "[Redis:RateLimit] Account Limit Exceeded",
      );
      throw new InstagramRateLimitError(
        `Account-Level Rate Limit at ${accountUsage}%`,
        false,
      );
    }
  } catch (error: any) {
    if (error instanceof InstagramRateLimitError) throw error; // Re-throw native

    // Swallow redis unhandled errors and fall open so the queue job continues
    logger.error(
      { instagramUserId, error: error.message },
      "[Redis:RateLimit] Rate limit check failed, falling open",
    );
  }
}
