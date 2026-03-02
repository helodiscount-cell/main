import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
  RATE_LIMIT_CONFIG,
  RATE_LIMIT_TIERS,
  UserTier,
} from "@/server/config/rate-limit.config";

// Lazy-initialize Redis only if needed to avoid startup crashes if env is missing
let redisClient: Redis | null = null;
function getUpstashRedis() {
  if (!redisClient) {
    if (
      process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      redisClient = Redis.fromEnv();
    } else {
      console.warn(
        "⚠️ Rate Limiting disabled: Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN",
      );
    }
  }
  return redisClient;
}

// Cache ratelimiters so we don't recreate them every request
const ratelimiters = new Map<string, Ratelimit>();

function getOrCreateLimiter(
  category: keyof typeof RATE_LIMIT_CONFIG,
  tier: UserTier | undefined,
  limit: number,
  windowStr: string,
): Ratelimit | null {
  const redis = getUpstashRedis();
  const t = tier || RATE_LIMIT_TIERS.FREE;
  if (!redis) return null;

  const key = `${category}:${t}`;
  if (!ratelimiters.has(key)) {
    // Note: The "windowStr" must be a valid upstash Duration format, e.g., "15 m", "1 h"
    // @ts-ignore - Upstash types are sometimes tricky with strings vs Duration
    ratelimiters.set(
      key,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, windowStr as any),
        analytics: false, // We don't need analytics overhead for now
        prefix: `@upstash/ratelimit:${key}`,
      }),
    );
  }

  return ratelimiters.get(key)!;
}

/**
 * Checks the ratelimit using Upstash and the sliding window algorithm.
 * Returns a NextResponse pointing to 429 if limited, null if allowed or disabled.
 */
export async function checkRateLimit(
  request: NextRequest,
  userId: string | null,
  tier?: UserTier,
): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;

  // 1. Ignored Routes Bypass
  if (
    RATE_LIMIT_CONFIG.IGNORED_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    return null; // Let it pass immediately
  }

  // Determine policy category based on pathname
  let category: keyof typeof RATE_LIMIT_CONFIG = "DEFAULT";
  if (RATE_LIMIT_CONFIG.AUTH.MATCHERS.some((m) => pathname.includes(m))) {
    category = "AUTH";
  } else if (
    RATE_LIMIT_CONFIG.MUTATION.MATCHERS.some((m) => pathname.includes(m))
  ) {
    category = "MUTATION";
  } else if (
    RATE_LIMIT_CONFIG.QUERY.MATCHERS.some((m) => pathname.includes(m))
  ) {
    category = "QUERY";
  }

  const currentTier = tier || RATE_LIMIT_TIERS.FREE;
  const policy = (RATE_LIMIT_CONFIG[category] as any).LIMITS[currentTier];

  // Initialize standard error response just in case
  const fallback = null; // Fail-open: allow request if Redis fails.

  const limiter = getOrCreateLimiter(
    category,
    currentTier,
    policy.limit,
    policy.windowMs,
  );
  if (!limiter) {
    return fallback;
  }

  // Identification (Pin by UserID or IP)
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const identifier = userId ? `user:${userId}` : `ip:${ip}`;

  try {
    const { success, limit, remaining, reset } =
      await limiter.limit(identifier);

    if (!success) {
      console.warn(
        `[RateLimit] Triggered 429 on ${pathname} for ${identifier}`,
      );

      const retryAfter = Math.ceil((reset - Date.now()) / 1000);

      return NextResponse.json(
        { error: "Too many requests. Please try again later.", retryAfter },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": new Date(reset).toISOString(),
          },
        },
      );
    }

    // In many scenarios you'd append success headers to the response,
    // but in Next.js middleware, setting headers on a passthrough request
    // is slightly more verbose. For now, returning null indicates "allowed".
    return null;
  } catch (error) {
    console.error("[RateLimit] Redis or Ratelimit error, falling open:", error);
    return fallback;
  }
}
