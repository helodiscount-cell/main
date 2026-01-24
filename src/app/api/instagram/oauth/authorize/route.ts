// url from frontend: http://localhost:3000/api/instagram/oauth/authorize?returnUrl=/dashboard

/**
 * Instagram OAuth Authorization Endpoint
 * Initiates OAuth flow by redirecting to Instagram
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { initiateOAuth } from "@/server/services/oauth.service";
import { ERROR_MESSAGES } from "@/config/instagram.config";

export async function GET(request: NextRequest) {
  try {
    // Gets current authenticated user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.AUTH.NO_USER },
        { status: 401 }
      );
    }

    const returnUrl =
      request.nextUrl.searchParams.get("returnUrl") || "/dashboard";

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
            : ERROR_MESSAGES.AUTH.OAUTH_FAILED,
      },
      { status: 500 }
    );
  }
}
