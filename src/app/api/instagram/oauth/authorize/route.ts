// url from frontend: http://localhost:3000/api/instagram/oauth/authorize?returnUrl=/dash

/**
 * Instagram OAuth Authorization Endpoint
 * Initiates OAuth flow by redirecting to Instagram
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ERROR_MESSAGES } from "@/server/config/instagram.config";
import { initiateOAuth } from "@/server/services/instagram/oauth.service";

export async function GET(request: NextRequest) {
  try {
    // Gets current authenticated user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.AUTH.NO_USER },
        { status: 401 },
      );
    }

    const returnUrl = request.nextUrl.searchParams.get("returnUrl") || "/dash";

    const authUrl = await initiateOAuth({ clerkId, returnUrl });

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
      { status: 500 },
    );
  }
}
