import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { RATE_LIMIT_CONFIG } from "@/server/config/rate-limit.config";

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
  key: string,
  limit: number,
  windowStr: string,
): Ratelimit | null {
  const redis = getUpstashRedis();
  if (!redis) return null;

  if (!ratelimiters.has(key)) {
    ratelimiters.set(
      key,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, windowStr as any),
        analytics: true,
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
): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;

  // 1. Root and Ignored Routes Bypass
  if (
    pathname === "/" ||
    RATE_LIMIT_CONFIG.IGNORED_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    return null;
  }

  // 2. Identification (Pin by UserID or IP)
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded
    ? (forwarded as string).split(",")[0].trim()
    : "127.0.0.1";
  const identifier = userId ? `user:${userId}` : `ip:${ip}`;

  // 3. Selection of Policy
  const isAuth = RATE_LIMIT_CONFIG.AUTH.MATCHERS.some((m) =>
    pathname.startsWith(m),
  );
  const config = isAuth ? RATE_LIMIT_CONFIG.AUTH : RATE_LIMIT_CONFIG.API;
  const key = isAuth ? "auth" : "api";

  const limiter = getOrCreateLimiter(key, config.LIMIT, config.WINDOW);

  if (!limiter) return null; // Fail-open

  try {
    const { success, limit, remaining, reset } =
      await limiter.limit(identifier);

    if (!success) {
      console.warn(`[RateLimit] Blocked 429 on ${pathname} for ${identifier}`);

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

    return null;
  } catch (error) {
    console.error("[RateLimit] Redis error, falling open:", error);
    return null;
  }
}
