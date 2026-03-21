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

    const result = await handleOAuthCallback(code, state);

    // Redirects back to the return URL with success
    const successUrl = `${result.returnUrl}?connected=true`;
    const redirectUrl = new URL(successUrl, request.url);

    // Fixes protocol for localhost (dev environment)
    if (
      redirectUrl.hostname === "localhost" ||
      redirectUrl.hostname === "127.0.0.1"
    ) {
      redirectUrl.protocol = "http:";
    }

    return NextResponse.redirect(redirectUrl);
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

    const redirectUrl = new URL(errorUrl, request.url);

    // Fixes protocol for localhost (dev environment)
    if (
      redirectUrl.hostname === "localhost" ||
      redirectUrl.hostname === "127.0.0.1"
    ) {
      redirectUrl.protocol = "http:";
    }

    return NextResponse.redirect(redirectUrl);
  }
}
