/**
 * Rate Limiting Utility
 * Provides in-memory rate limiting for API endpoints
 * Note: For production, consider using Redis-based rate limiting (e.g., @upstash/ratelimit)
 */

import { NextRequest, NextResponse } from "next/server";
import { logger } from "./logger";

/**
 * Rate limit entry stored in memory
 */
interface RateLimitEntry {
  count: number;
  resetTime: number; // Timestamp when the limit resets
}

/**
 * In-memory rate limit store
 * In production, this should be replaced with Redis
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Default rate limit configurations per endpoint type
 */
export const RATE_LIMITS = {
  // General API endpoints: 100 requests per 15 minutes
  API_DEFAULT: {
    limit: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // Authentication endpoints: 10 requests per 15 minutes
  AUTH: {
    limit: 10,
    windowMs: 15 * 60 * 1000,
  },
  // Automation creation: 20 requests per hour
  AUTOMATION_CREATE: {
    limit: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  // Automation listing: 60 requests per minute
  AUTOMATION_LIST: {
    limit: 60,
    windowMs: 60 * 1000, // 1 minute
  },
  // Webhook endpoints: No rate limiting (handled by signature validation)
  WEBHOOK: {
    limit: Infinity,
    windowMs: 0,
  },
} as const;

/**
 * Gets a rate limit key for a request
 */
function getRateLimitKey(request: NextRequest, identifier?: string): string {
  // Uses user ID from Clerk if available
  const userId = identifier || "anonymous";
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  return `${method}:${pathname}:${userId}`;
}

/**
 * Checks if a request should be rate limited
 */
function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // If no entry exists or window has expired, create new entry
  if (!entry || now >= entry.resetTime) {
    const resetTime = now + windowMs;
    rateLimitStore.set(key, {
      count: 1,
      resetTime,
    });

    return {
      allowed: true,
      remaining: limit - 1,
      resetTime,
    };
  }

  // If limit exceeded, deny request
  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count and allow request
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Cleans up expired rate limit entries
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Runs cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Determines the appropriate rate limit configuration for a route
 */
export function getRateLimitForRoute(pathname: string): {
  limit: number;
  windowMs: number;
} {
  // Webhook endpoints: no rate limiting
  if (pathname.startsWith("/api/webhooks")) {
    return RATE_LIMITS.WEBHOOK;
  }

  // Authentication endpoints
  if (
    pathname.includes("/oauth/") ||
    pathname.includes("/sign-in") ||
    pathname.includes("/sign-up")
  ) {
    return RATE_LIMITS.AUTH;
  }

  // Automation creation
  if (pathname === "/api/automations/create" || pathname.endsWith("/create")) {
    return RATE_LIMITS.AUTOMATION_CREATE;
  }

  // Automation listing
  if (pathname === "/api/automations/list" || pathname.endsWith("/list")) {
    return RATE_LIMITS.AUTOMATION_LIST;
  }

  // Default for all other API endpoints
  return RATE_LIMITS.API_DEFAULT;
}

/**
 * Rate limiting middleware
 * Returns NextResponse with 429 status if rate limit exceeded, null otherwise
 */
export function rateLimitMiddleware(
  request: NextRequest,
  identifier?: string
): NextResponse | null {
  const pathname = request.nextUrl.pathname;

  // Skips rate limiting for webhook endpoints
  if (pathname.startsWith("/api/webhooks")) {
    return null;
  }

  const { limit, windowMs } = getRateLimitForRoute(pathname);

  // No rate limiting if limit is Infinity
  if (limit === Infinity) {
    return null;
  }

  const key = getRateLimitKey(request, identifier);
  const result = checkRateLimit(key, limit, windowMs);

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);

    logger.warn("Rate limit exceeded", {
      pathname,
      method: request.method,
      identifier,
      limit,
      windowMs,
      retryAfter,
    });

    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
        },
      }
    );
  }

  // Adds rate limit headers to successful requests
  return null; // Returns null to indicate request should proceed
}

/**
 * Gets rate limit headers for a response
 */
export function getRateLimitHeaders(
  request: NextRequest,
  identifier?: string
): Record<string, string> {
  const pathname = request.nextUrl.pathname;
  const { limit, windowMs } = getRateLimitForRoute(pathname);

  if (limit === Infinity) {
    return {};
  }

  const key = getRateLimitKey(request, identifier);
  const entry = rateLimitStore.get(key);

  if (!entry) {
    return {
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": limit.toString(),
    };
  }

  const remaining = Math.max(0, limit - entry.count);

  return {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": new Date(entry.resetTime).toISOString(),
  };
}

