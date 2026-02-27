import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getSizeLimitForRoute,
  validateRequestSize,
} from "@/server/utils/request-limits";
import { validateCsrfProtection } from "@/server/utils/csrf";
import { rateLimitMiddleware } from "@/server/utils/rate-limit";
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
    const rateLimitResponse = rateLimitMiddleware(request, userId || undefined);
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
  let isConnected = (sessionClaims?.metadata as any)?.isConnected === true;

  // 2nd Check: Fallback path (Live Metadata check)
  // We do this if the JWT is stale (e.g., immediately after first connection)
  if (!isConnected && userId) {
    try {
      const { createClerkClient } = await import("@clerk/nextjs/server");
      const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      const user = await clerkClient.users.getUser(userId);
      isConnected = user.publicMetadata?.isConnected === true;

      // If we found it's actually connected, we should trust this
      console.log(
        `Middleware fallback for ${userId}: isConnected=${isConnected}`,
      );
    } catch (e) {
      console.error("Middleware fallback check failed:", e);
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
