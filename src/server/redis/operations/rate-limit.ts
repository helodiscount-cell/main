import { getRedisClient } from "../client";
import { KEYS, TTL } from "../keys";
import { logger } from "../../utils/pino";

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
