import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user with Instagram account
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        instaAccount: true,
      },
    });

    if (!user || !user.instaAccount) {
      return NextResponse.json(
        { error: "Instagram not connected" },
        { status: 400 }
      );
    }

    // Get access token from environment
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Instagram access token not configured" },
        { status: 500 }
      );
    }

    const { instagramUserId, username } = user.instaAccount;

    // Fetch posts from Instagram Graph API
    const fields = [
      "id",
      "caption",
      "media_type",
      "media_url",
      "permalink",
      "timestamp",
      "like_count",
      "comments_count",
    ].join(",");

    const postsUrl = `https://graph.instagram.com/${instagramUserId}/media?fields=${fields}&limit=25&access_token=${accessToken}`;

    const response = await fetch(postsUrl);
    const data = await response.json();

    if (data.error) {
      console.error("Instagram API error:", data.error);
      return NextResponse.json(
        {
          error: "Failed to fetch posts",
          details: data.error.message,
        },
        { status: 400 }
      );
    }

    // Update last synced time
    await prisma.instaAccount.update({
      where: { id: user.instaAccount.id },
      data: { lastSyncedAt: new Date() },
    });

    return NextResponse.json(
      {
        success: true,
        posts: data.data || [],
        username: username,
        paging: data.paging,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
