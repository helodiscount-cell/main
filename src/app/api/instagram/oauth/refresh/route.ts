/**
 * Instagram OAuth Token Refresh Endpoint
 * Manually refreshes the Instagram access token
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { refreshAccessToken } from "@/server/services/instagram/oauth.service";
import { workspaceService } from "@/server/workspace";
import { ERROR_MESSAGES } from "@/server/config/instagram.config";

export async function POST() {
  try {
    // Gets current authenticated user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to refresh token" },
        { status: 401 },
      );
    }

    // Refresh only the currently active workspace
    const activeId = await workspaceService.getActiveId();

    if (!activeId) {
      return NextResponse.json(
        { success: false, error: "No active workspace found to refresh" },
        { status: 400 },
      );
    }

    // Calls service layer with ownership verification
    const result = await refreshAccessToken(activeId, clerkId);

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 200 },
    );
  } catch (error) {
    const isAuthError =
      error instanceof Error &&
      (error.message.includes(ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT) ||
        error.message.includes("Access denied") ||
        error.message.includes("not found"));

    return NextResponse.json(
      {
        success: false,
        error: isAuthError
          ? "The Instagram account could not be found or access was denied. Please reconnect your account."
          : error instanceof Error
            ? error.message
            : "Failed to refresh token. Please try again.",
      },
      { status: isAuthError ? 403 : 500 },
    );
  }
}
