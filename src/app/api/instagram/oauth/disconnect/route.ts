/**
 * Instagram OAuth Disconnect Endpoint
 * Deactivates a specific Instagram workspace
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { disconnectAccount } from "@/server/services/instagram/oauth.service";
import { workspaceService } from "@/server/workspace";
import { z } from "zod";

const DisconnectSchema = z.object({
  instaAccountId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in to disconnect Instagram",
        },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validation = DisconnectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "instaAccountId is required" },
        { status: 400 },
      );
    }

    const { instaAccountId } = validation.data;

    // Verify ownership before disconnecting
    const account = await workspaceService.verifyOwnership(
      instaAccountId,
      clerkId,
    );

    if (!account) {
      return NextResponse.json(
        { success: false, error: "Access denied or account not found" },
        { status: 403 },
      );
    }

    const result = await disconnectAccount(instaAccountId);

    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to disconnect Instagram. Please try again.",
      },
      { status: 500 },
    );
  }
}
