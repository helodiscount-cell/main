import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getSizeLimitForRoute,
  validateRequestSize,
} from "@/lib/utils/request-limits";
import { validateCsrfProtection } from "@/lib/utils/csrf";
import {
  rateLimitMiddleware,
  getRateLimitHeaders,
} from "@/lib/utils/rate-limit";

const isPublicRoute = createRouteMatcher([
  "/",
  "/auth",
  "/api/webhooks/instagram",
]);

const isApiRoute = createRouteMatcher(["/api/(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  // Gets user ID for rate limiting
  const { userId } = await auth();

  // Applies rate limiting to API routes
  if (isApiRoute(request)) {
    const rateLimitResponse = rateLimitMiddleware(request, userId || undefined);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }

  // Validates CSRF protection for state-changing API requests
  if (
    isApiRoute(request) &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(request.method)
  ) {
    const csrfValidation = validateCsrfProtection(request);
    if (!csrfValidation.valid) {
      return NextResponse.json(
        { error: csrfValidation.error || "CSRF validation failed" },
        { status: 403 }, // 403 Forbidden
      );
    }
  }

  // Validates request size for API routes with request bodies
  if (
    isApiRoute(request) &&
    ["POST", "PUT", "PATCH"].includes(request.method)
  ) {
    const contentLength = request.headers.get("content-length");
    const pathname = request.nextUrl.pathname;
    const maxSize = getSizeLimitForRoute(pathname);

    const validation = validateRequestSize(contentLength, maxSize);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || "Request body too large" },
        { status: 413 }, // 413 Payload Too Large
      );
    }
  }

  // Handles authentication
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
