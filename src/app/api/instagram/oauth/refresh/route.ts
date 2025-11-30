/**
 * Instagram OAuth Token Refresh Endpoint
 * Manually refreshes the Instagram access token
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { refreshAccessToken } from "@/lib/instagram/token-manager";
import { logger } from "@/lib/logger-backend";

export async function POST() {
  try {
    // Gets current authenticated user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      logger.apiRoute("POST", "/api/instagram/oauth/refresh", {
        error: "Unauthorized",
      });
      return NextResponse.json(
        { success: false, error: "You must be logged in to refresh token" },
        { status: 401 }
      );
    }

    // Finds user with Instagram account
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { instaAccount: true },
    });

    if (!user || !user.instaAccount) {
      logger.apiRoute("POST", "/api/instagram/oauth/refresh", {
        error: "No Instagram account found",
      });
      return NextResponse.json(
        { success: false, error: "No Instagram account connected" },
        { status: 400 }
      );
    }

    // Refreshes the token
    const { accessToken, expiresAt } = await refreshAccessToken(
      user.instaAccount.id
    );

    logger.apiRoute("POST", "/api/instagram/oauth/refresh", {
      clerkId,
      username: user.instaAccount.username,
      expiresAt: expiresAt.toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Token refreshed successfully",
        expiresAt: expiresAt.toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error refreshing token:", error);
    logger.apiRoute("POST", "/api/instagram/oauth/refresh", {
      error: "Refresh failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to refresh token. Please try reconnecting your account.",
      },
      { status: 500 }
    );
  }
}

