/**
 * Instagram Posts Endpoint
 * Retrieves Instagram posts for the authenticated user
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserPosts } from "@/server/services/instagram.service";

export async function GET() {
  try {
    // Gets current authenticated user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You need to be signed in to view your Instagram posts. Please login and try again.",
        },
        { status: 401 }
      );
    }

    // Calls service layer
    const result = await getUserPosts(clerkId);

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
            : "An unexpected server error occurred while fetching your Instagram posts. Please try again.",
      },
      { status: 500 }
    );
  }
}
