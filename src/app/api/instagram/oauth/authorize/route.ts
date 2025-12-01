/**
 * Instagram OAuth Authorization Endpoint
 * Initiates OAuth flow by redirecting to Instagram
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { initiateOAuth } from "@/server/services/oauth.service";

export async function GET(request: NextRequest) {
  try {
    // Gets current authenticated user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to connect Instagram" },
        { status: 401 }
      );
    }

    // Gets return URL from query params
    const returnUrl =
      request.nextUrl.searchParams.get("returnUrl") || "/dashboard";

    // Calls service layer to generate auth URL
    const authUrl = await initiateOAuth(clerkId, returnUrl);

    // Redirects to Instagram OAuth
    return NextResponse.redirect(authUrl);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to initiate Instagram authorization",
      },
      { status: 500 }
    );
  }
}
