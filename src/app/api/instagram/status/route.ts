import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import {
  BeErrorResponse,
  InstagramStatusConnectedResponse,
  InstagramStatusDisconnectedResponse,
} from "@/types";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    // Returns disconnected status if user is not authenticated
    if (!clerkId) {
      const disconnected: InstagramStatusDisconnectedResponse = {
        connected: false,
        message: "Unauthorized",
      };
      return NextResponse.json(disconnected, { status: 200 });
    }

    // Finds user with Instagram account
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        instaAccount: true,
      },
    });

    // Returns disconnected status if user or account is not found
    if (!user || !user.instaAccount) {
      const disconnected: InstagramStatusDisconnectedResponse = {
        connected: false,
        message: "User or Instagram account not found",
      };
      return NextResponse.json(disconnected, {
        status: 200,
      });
    }

    // Returns connected status and account info
    const connected: InstagramStatusConnectedResponse = {
      connected: true,
      username: user.instaAccount.username,
      connectedAt: user.instaAccount.connectedAt,
      lastSyncedAt: user.instaAccount.lastSyncedAt,
    };
    return NextResponse.json(connected, {
      status: 200,
    });
  } catch (error) {
    // Logs the error and returns an error response
    console.error("Instagram connection status check error:", error);
    const errorResponse: BeErrorResponse = {
      success: false,
      error:
        "An unexpected server error occurred while checking your Instagram connection status. Please try again.",
    };
    return NextResponse.json(errorResponse, {
      status: 500,
    });
  }
}
