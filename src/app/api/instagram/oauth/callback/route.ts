/**
 * Instagram OAuth Callback Endpoint
 * Handles the redirect back from Instagram after user authorizes
 */

import { NextRequest, NextResponse } from "next/server";
import { handleOAuthCallback } from "@/server/services/instagram/oauth.service";
import { clogger } from "@/server/utils/consola";

enum RedirectUrls {
  SUCCESS = "/dash?connected=true",
  ERROR_OAUTH_DECLINED = "/dash?error=oauth_declined",
  ERROR_OAUTH_INVALID = "/dash?error=oauth_invalid",
  ERROR_OAUTH_FAILED = "/dash?error=oauth_failed",
  ERROR_ACCOUNT_CLAIMED = "/auth/claim",
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  try {
    // Handles user declining authorization
    if (
      error?.toLowerCase() === "access_denied" ||
      error?.toLowerCase() === "access_denied_by_user" ||
      error?.toLowerCase() === "oauth_declined"
    ) {
      // Needs to be handled on the frontend as well
      const returnUrl = RedirectUrls.ERROR_OAUTH_DECLINED;
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }

    // Validates required parameters
    if (!code || !state) {
      // Needs to be handled on the frontend as well
      const returnUrl = RedirectUrls.ERROR_OAUTH_INVALID;
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }

    // Helper to construct absolute URLs that preserve the current host (ngrok support)
    const constructUrl = (path: string) => {
      const host =
        request.headers.get("x-forwarded-host") ||
        request.headers.get("host") ||
        "localhost:3000";
      const protocol = request.headers.get("x-forwarded-proto") || "http";
      return new URL(path, `${protocol}://${host}`);
    };

    const result = await handleOAuthCallback(code, state);

    // Redirects back to the return URL with success
    const successUrl = `${result.returnUrl}?connected=true`;
    return NextResponse.redirect(constructUrl(successUrl));
  } catch (err) {
    const errorInstance = err instanceof Error ? err : new Error(String(err));
    clogger.error(
      {
        state,
      },
      "Instagram OAuth callback failed",
      errorInstance.message,
    );

    const isAccountClaimed =
      errorInstance.message.includes("already connected") ||
      (errorInstance as any).code === "IG_ACCOUNT_ALREADY_CLAIMED";

    const errorUrl = isAccountClaimed
      ? RedirectUrls.ERROR_ACCOUNT_CLAIMED
      : RedirectUrls.ERROR_OAUTH_FAILED;

    const host =
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const errorRedirectUrl = new URL(errorUrl, `${protocol}://${host}`);

    return NextResponse.redirect(errorRedirectUrl);
  }
}
