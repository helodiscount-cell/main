/**
 * Instagram OAuth Callback Endpoint
 * Handles the redirect back from Instagram after user authorizes
 */

import { NextRequest, NextResponse } from "next/server";
import { handleOAuthCallback } from "@/server/services/instagram/oauth.service";
import { logger } from "@/server/utils/pino";

enum RedirectUrls {
  SUCCESS = "/dash?connected=true",
  ERROR_OAUTH_DECLINED = "/dash?error=oauth_declined",
  ERROR_OAUTH_INVALID = "/dash?error=oauth_invalid",
  ERROR_OAUTH_FAILED = "/dash?error=oauth_failed",
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  logger.info(
    {
      state,
      error,
      hasCode: !!code,
    },
    "Instagram OAuth callback received",
  );

  try {
    // Handles user declining authorization
    if (
      error?.toLowerCase() === "access_denied" ||
      error?.toLowerCase() === "access_denied_by_user" ||
      error?.toLowerCase() === "oauth_declined"
    ) {
      logger.warn(
        {
          error,
        },
        "User declined Instagram authorization",
      );
      const returnUrl = RedirectUrls.ERROR_OAUTH_DECLINED;
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }

    // Validates required parameters
    if (!code || !state) {
      logger.warn(
        {
          hasCode: !!code,
          hasState: !!state,
        },
        "Missing required OAuth parameters",
      );
      const returnUrl = RedirectUrls.ERROR_OAUTH_INVALID;
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }

    // Calls service layer to handle the callback
    logger.debug(
      {
        state,
      },
      "Processing Instagram OAuth code",
    );
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
    logger.info(
      {
        username: result.username,
        accountType: result.accountType,
        duration,
      },
      "Instagram OAuth callback successful",
    );

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    const errorInstance = err instanceof Error ? err : new Error(String(err));
    logger.error(
      {
        state,
      },
      "Instagram OAuth callback failed",
      errorInstance,
    );

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
