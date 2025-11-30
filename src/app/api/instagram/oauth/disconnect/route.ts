/**
 * Instagram OAuth Disconnect Endpoint
 * Removes Instagram connection for the current user
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger-backend";

export async function POST() {
  try {
    // Gets current authenticated user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      logger.apiRoute("POST", "/api/instagram/oauth/disconnect", {
        error: "Unauthorized",
      });
      return NextResponse.json(
        { success: false, error: "You must be logged in to disconnect Instagram" },
        { status: 401 }
      );
    }

    // Finds user with Instagram account
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { instaAccount: true },
    });

    if (!user || !user.instaAccount) {
      logger.apiRoute("POST", "/api/instagram/oauth/disconnect", {
        error: "No Instagram account found",
      });
      return NextResponse.json(
        { success: false, error: "No Instagram account connected" },
        { status: 400 }
      );
    }

    // Deletes the Instagram account (cascade will delete automations)
    await prisma.instaAccount.delete({
      where: { id: user.instaAccount.id },
    });

    logger.apiRoute("POST", "/api/instagram/oauth/disconnect", {
      clerkId,
      username: user.instaAccount.username,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Instagram account disconnected successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error disconnecting Instagram:", error);
    logger.apiRoute("POST", "/api/instagram/oauth/disconnect", {
      error: "Internal error",
      details: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to disconnect Instagram. Please try again.",
      },
      { status: 500 }
    );
  }
}

