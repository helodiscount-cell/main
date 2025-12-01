/**
 * Instagram OAuth Callback Endpoint
 * Handles the redirect back from Instagram after user authorizes
 */

import { NextRequest, NextResponse } from "next/server";
import { handleOAuthCallback } from "@/server/services/oauth.service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handles user declining authorization
    if (error) {
      const returnUrl = "/dashboard?error=oauth_declined";
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }

    // Validates required parameters
    if (!code || !state) {
      const returnUrl = "/dashboard?error=oauth_invalid";
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
    const errorUrl = "/dashboard?error=oauth_failed";
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
