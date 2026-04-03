/**
 * Instagram OAuth Callback Endpoint
 * Handles the redirect back from Instagram after user authorizes
 */

import { NextRequest, NextResponse } from "next/server";
import { handleOAuthCallback } from "@/server/services/instagram/oauth.service";
import { clogger } from "@/server/utils/consola";
import { APP_CONFIG } from "@/configs/app.config";

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

  // Helper to construct absolute URLs from a trusted origin (prevents Host Header Injection)
  const constructUrl = (path: string) => {
    // Uses the trust anchor from APP_CONFIG (fails fast in production if missing)
    const base = APP_CONFIG.ORIGIN;

    // Strictly enforce relative paths to avoid open redirects or host injection
    if (path.includes("://") || path.startsWith("//")) {
      console.error(
        `[constructUrl] BLOCKING potentially malicious path: ${path}`,
      );
      return new URL("/dash", base);
    }

    const safePath = `/${path.replace(/^\//, "")}`;
    return new URL(safePath, base);
  };

  try {
    // Handles user declining authorization
    if (
      error?.toLowerCase() === "access_denied" ||
      error?.toLowerCase() === "access_denied_by_user" ||
      error?.toLowerCase() === "oauth_declined"
    ) {
      return NextResponse.redirect(
        constructUrl(RedirectUrls.ERROR_OAUTH_DECLINED),
      );
    }

    // Validates required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        constructUrl(RedirectUrls.ERROR_OAUTH_INVALID),
      );
    }

    const result = await handleOAuthCallback(code, state);

    // Safely append the 'connected' parameter to the return URL
    const url = new URL(result.returnUrl, APP_CONFIG.ORIGIN);
    url.searchParams.set("connected", "true");

    // Redirects back to the return URL with victory state
    return NextResponse.redirect(constructUrl(url.pathname + url.search));
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

    return NextResponse.redirect(constructUrl(errorUrl));
  }
}
