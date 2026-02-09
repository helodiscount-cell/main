/**
 * Instagram OAuth Callback Endpoint
 * Handles the redirect back from Instagram after user authorizes
 */

import { NextRequest, NextResponse } from "next/server";
import { handleOAuthCallback } from "@/server/services/instagram/oauth.service";

enum RedirectUrls {
  SUCCESS = "/dashboard?connected=true",
  ERROR_OAUTH_DECLINED = "/dashboard?error=oauth_declined",
  ERROR_OAUTH_INVALID = "/dashboard?error=oauth_invalid",
  ERROR_OAUTH_FAILED = "/dashboard?error=oauth_failed",
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handles user declining authorization
    if (
      error?.toLowerCase() === "access_denied" ||
      error?.toLowerCase() === "access_denied_by_user" ||
      error?.toLowerCase() === "oauth_declined"
    ) {
      const returnUrl = RedirectUrls.ERROR_OAUTH_DECLINED;
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }

    // Validates required parameters
    if (!code || !state) {
      const returnUrl = RedirectUrls.ERROR_OAUTH_INVALID;
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }

    // Calls service layer to handle the callback
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
  } catch (error) {
    const errorUrl = RedirectUrls.ERROR_OAUTH_FAILED;
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
