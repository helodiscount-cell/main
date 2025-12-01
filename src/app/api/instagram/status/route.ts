/**
 * Instagram Status Endpoint
 * Checks Instagram connection status for the current user
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getConnectionStatus } from "@/server/services/instagram.service";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    // Returns disconnected status if user is not authenticated
    if (!clerkId) {
      return NextResponse.json(
        {
          connected: false,
          message: "Unauthorized",
        },
        { status: 200 }
      );
    }

    // Calls service layer
    const status = await getConnectionStatus(clerkId);

    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          "An unexpected server error occurred while checking your Instagram connection status. Please try again.",
      },
      { status: 500 }
    );
  }
}
