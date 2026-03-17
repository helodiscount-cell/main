import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getSizeLimitForRoute,
  validateRequestSize,
} from "@/server/utils/request-limits";
import { validateCsrfProtection } from "@/server/utils/csrf";
import { checkRateLimit } from "@/server/utils/redis-ratelimit";
import {
  isPublicRoute,
  isApiRoute,
  isConnectRoute,
  isAuthRoute,
  AUTH_ROUTE,
  CONNECT_ROUTE,
  DASHBOARD_ROUTE,
} from "@/configs/routes.config";

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();
  const { pathname } = request.nextUrl;

  // 1. API Route Logic (Rate Limiting, CSRF, Size Validation)
  if (isApiRoute(pathname)) {
    // Applies rate limiting to API routes
    const tier = (sessionClaims?.metadata as any)?.tier;
    const rateLimitResponse = await checkRateLimit(request, userId, tier);
    if (rateLimitResponse) return rateLimitResponse;

    // Validates CSRF protection for state-changing API requests
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
      const csrfValidation = validateCsrfProtection(request);
      if (!csrfValidation.valid) {
        return NextResponse.json(
          { error: csrfValidation.error || "CSRF validation failed" },
          { status: 403 },
        );
      }
    }

    // Validates request size for API routes with request bodies
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      const contentLength = request.headers.get("content-length");
      const maxSize = getSizeLimitForRoute(pathname);
      const validation = validateRequestSize(contentLength, maxSize);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error || "Request body too large" },
          { status: 413 },
        );
      }
    }

    // Allow API routes to proceed (individual route handlers will handle auth if needed)
    return NextResponse.next();
  }

  // 2. Authentication and Authorization Logic for Pages

  // Public routes are always accessible for unlogged users
  if (isPublicRoute(pathname) && !userId) {
    return NextResponse.next();
  }

  // If not logged in and trying to access a non-public route, redirect to auth
  if (!userId) {
    if (!isPublicRoute(pathname)) {
      return NextResponse.redirect(new URL(AUTH_ROUTE, request.url));
    }
    return NextResponse.next();
  }

  // User is logged in

  // 1st Check: Fast path (JWT Claims)
  const metadata = sessionClaims?.metadata as any;
  let isConnected = metadata?.isConnected === true;
  const instaUserId = metadata?.instaUserId as string | undefined;

  // 2nd Check: If JWT says connected, verify against Redis (source of truth)
  // Prevents stale Clerk metadata from bypassing /auth/connect after logout
  if (isConnected && instaUserId) {
    try {
      const { getRedisClient } = await import("@/server/redis/client");
      const { KEYS } = await import("@/server/redis/keys");
      const redis = getRedisClient();
      if (redis) {
        const cached = await redis.get(KEYS.USER_CONNECTION(instaUserId));
        if (cached !== null) {
          // Cache hit: Redis is the source of truth
          isConnected = cached === "1";
        }
        // Cache miss: fall through to Clerk live API fallback below
      }
    } catch (e) {
      console.error("Middleware Redis verification failed:", e);
      // fail-open: proceed to Clerk live API fallback
    }
  }

  // 3rd Check: Fallback path (Live Clerk metadata)
  // Runs when JWT says not connected OR Redis had a cache miss
  if (!isConnected && userId) {
    try {
      const { createClerkClient } = await import("@clerk/nextjs/server");
      const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      const user = await clerkClient.users.getUser(userId);
      isConnected = user.publicMetadata?.isConnected === true;
    } catch (e) {
      console.error("Middleware Clerk fallback check failed:", e);
    }
  }

  // Handle Logic for Logged-in Users
  if (userId) {
    // If logged in and trying to go to /auth, redirect based on connection status
    if (isAuthRoute(pathname)) {
      return NextResponse.redirect(
        new URL(isConnected ? DASHBOARD_ROUTE : CONNECT_ROUTE, request.url),
      );
    }

    // if they are logged in then they should be allowed to only visit the /connect url and nothing else
    if (!isConnected && !isConnectRoute(pathname) && !isPublicRoute(pathname)) {
      return NextResponse.redirect(new URL(CONNECT_ROUTE, request.url));
    }

    // but if they are connected then they are free to go anywhere inside the app
    if (isConnected) {
      // If connected and on /connect, maybe redirect to dashboard
      if (isConnectRoute(pathname)) {
        return NextResponse.redirect(new URL(DASHBOARD_ROUTE, request.url));
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
