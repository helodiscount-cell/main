/**
 * Instagram OAuth Callback Endpoint
 * Handles the redirect back from Instagram after user authorizes
 */

import { NextRequest, NextResponse } from "next/server";
import { handleOAuthCallback } from "@/server/services/instagram/oauth.service";
import { logger } from "@/lib/utils/logger";

enum RedirectUrls {
  SUCCESS = "/dashboard?connected=true",
  ERROR_OAUTH_DECLINED = "/dashboard?error=oauth_declined",
  ERROR_OAUTH_INVALID = "/dashboard?error=oauth_invalid",
  ERROR_OAUTH_FAILED = "/dashboard?error=oauth_failed",
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  logger.info("Instagram OAuth callback received", {
    state,
    error,
    hasCode: !!code,
  });

  try {
    // Handles user declining authorization
    if (
      error?.toLowerCase() === "access_denied" ||
      error?.toLowerCase() === "access_denied_by_user" ||
      error?.toLowerCase() === "oauth_declined"
    ) {
      logger.warn("User declined Instagram authorization", { error });
      const returnUrl = RedirectUrls.ERROR_OAUTH_DECLINED;
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }

    // Validates required parameters
    if (!code || !state) {
      logger.warn("Missing required OAuth parameters", {
        hasCode: !!code,
        hasState: !!state,
      });
      const returnUrl = RedirectUrls.ERROR_OAUTH_INVALID;
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }

    // Calls service layer to handle the callback
    logger.debug("Processing Instagram OAuth code", { state });
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

    const duration = Date.now() - startTime;
    logger.info("Instagram OAuth callback successful", {
      username: result.username,
      accountType: result.accountType,
      duration,
    });

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    const errorInstance = err instanceof Error ? err : new Error(String(err));
    logger.error("Instagram OAuth callback failed", errorInstance, {
      state,
    });

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
