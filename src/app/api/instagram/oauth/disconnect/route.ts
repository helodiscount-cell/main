/**
 * Instagram OAuth Disconnect Endpoint
 * Removes Instagram connection for the current user
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { disconnectAccount } from "@/server/services/oauth.service";

export async function POST() {
  try {
    // Gets current authenticated user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in to disconnect Instagram",
        },
        { status: 401 }
      );
    }

    // Calls service layer
    const result = await disconnectAccount(clerkId);

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
            : "Failed to disconnect Instagram. Please try again.",
      },
      { status: 500 }
    );
  }
}
