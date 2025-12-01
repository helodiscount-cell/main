/**
 * Instagram Connect Endpoint
 * Legacy endpoint - use OAuth flow instead
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in to connect Instagram.",
        },
        { status: 401 }
      );
    }

    // This endpoint is deprecated - redirects users to use OAuth flow instead
    return NextResponse.json(
      {
        success: false,
        error:
          "This endpoint is deprecated. Please use /api/instagram/oauth/authorize instead.",
      },
      { status: 410 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}
