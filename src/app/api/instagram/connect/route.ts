import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    // Verify user is authenticated
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get access token from environment
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Instagram access token not configured" },
        { status: 500 }
      );
    }

    // Fetch Instagram user info using the access token
    const userInfoUrl = `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${accessToken}`;
    const response = await fetch(userInfoUrl);
    const instagramData = await response.json();

    if (instagramData.error) {
      console.error("Instagram API error:", instagramData.error);
      return NextResponse.json(
        {
          error: "Failed to fetch Instagram data",
          details: instagramData.error.message,
        },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Save or update Instagram account
    const instaAccount = await prisma.instaAccount.upsert({
      where: { userId: user.id },
      update: {
        instagramUserId: instagramData.id,
        username: instagramData.username,
        lastSyncedAt: new Date(),
      },
      create: {
        userId: user.id,
        instagramUserId: instagramData.id,
        username: instagramData.username,
      },
    });

    return NextResponse.json(
      {
        success: true,
        username: instaAccount.username,
        connectedAt: instaAccount.connectedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Instagram connect error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
