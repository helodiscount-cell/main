/**
 * Instagram OAuth Token Refresh Endpoint
 * Manually refreshes the Instagram access token
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { refreshAccessToken } from "@/server/services/oauth.service";

export async function POST() {
  try {
    // Gets current authenticated user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to refresh token" },
        { status: 401 }
      );
    }

    // Calls service layer
    const result = await refreshAccessToken(clerkId);

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 200 }
    );
  } catch (error) {
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
