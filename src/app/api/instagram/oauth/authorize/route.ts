/**
 * Instagram OAuth Authorization Endpoint
 * Initiates OAuth flow by redirecting to Instagram
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateAuthorizationUrl } from "@/lib/instagram/oauth";
import { validateOAuthConfig } from "@/config/instagram.config";
import { logger } from "@/lib/logger-backend";

export async function GET(request: NextRequest) {
  try {
    // Gets current authenticated user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      logger.apiRoute("GET", "/api/instagram/oauth/authorize", {
        error: "Unauthorized",
      });
      return NextResponse.json(
        { success: false, error: "You must be logged in to connect Instagram" },
        { status: 401 }
      );
    }

    // Validates OAuth configuration
    if (!validateOAuthConfig()) {
      logger.apiRoute("GET", "/api/instagram/oauth/authorize", {
        error: "OAuth config incomplete",
      });
      return NextResponse.json(
        {
          success: false,
          error: "Instagram OAuth is not configured. Please contact support.",
        },
        { status: 500 }
      );
    }

    // Gets return URL from query params
    const returnUrl =
      request.nextUrl.searchParams.get("returnUrl") || "/dashboard";

    // Generates authorization URL with state
    const authUrl = generateAuthorizationUrl({
      clerkId,
      returnUrl,
    });

    logger.apiRoute("GET", "/api/instagram/oauth/authorize", {
      clerkId,
      returnUrl,
    });

    // Redirects to Instagram OAuth
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error in OAuth authorize:", error);
    logger.apiRoute("GET", "/api/instagram/oauth/authorize", {
      error: "Internal error",
      details: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to initiate Instagram authorization",
      },
      { status: 500 }
    );
  }
}
