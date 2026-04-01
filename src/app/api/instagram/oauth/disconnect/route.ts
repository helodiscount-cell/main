/**
 * Instagram OAuth Disconnect Endpoint
 * Deactivates a specific Instagram workspace
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { disconnectAccount } from "@/server/services/instagram/oauth.service";
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

    const result = await disconnectAccount(validation.data.instaAccountId);

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
