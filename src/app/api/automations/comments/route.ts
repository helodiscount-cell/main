/**
 * Automation Comments Endpoint
 * Legacy endpoint - kept for backwards compatibility
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized. Please sign in.",
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // This endpoint is deprecated - redirects users to use /api/automations/create instead
    return NextResponse.json(
      {
        success: false,
        error:
          "This endpoint is deprecated. Please use /api/automations/create instead.",
        data: body,
      },
      { status: 410 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Unexpected server error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
