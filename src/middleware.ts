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
  isAuthRoute,
  AUTH_ROUTE,
  DASHBOARD_ROUTE,
} from "@/configs/routes.config";

/**
 * clerkMiddleware: Runs in Edge Runtime
 * No Prisma imports here to avoid WASM engine errors.
 */
export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const { pathname } = request.nextUrl;

  // 1. API routes: rate limit, CSRF, and size checks
  if (isApiRoute(pathname)) {
    const rateLimitResponse = await checkRateLimit(request, userId);
    if (rateLimitResponse) return rateLimitResponse;

    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
      const csrfValidation = validateCsrfProtection(request);
      if (!csrfValidation.valid) {
        return NextResponse.json(
          { error: csrfValidation.error || "CSRF validation failed" },
          { status: 403 },
        );
      }
    }

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

    return NextResponse.next();
  }

  // 2. Public route handling
  if (isPublicRoute(pathname) && !userId) return NextResponse.next();

  // 3. Auth enforcement
  if (!userId) {
    return NextResponse.redirect(new URL(AUTH_ROUTE, request.url));
  }

  // 4. Authenticated user hitting auth pages (login/register)
  if (isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL(DASHBOARD_ROUTE, request.url));
  }

  // Note: Workspace enforcement (no-account redirect) is handled in the
  // Root Dashboard Layout to avoid Edge Runtime Prisma issues.

  // Construct headers for deep linking support in server components
  const requestHeaders = new Headers(request.headers);
  const currentUrl = `${pathname}${request.nextUrl.search}`;
  requestHeaders.set("x-url", currentUrl);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
