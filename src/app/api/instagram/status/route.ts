import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ connected: false }, { status: 200 });
    }

    // Find user with Instagram account
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        instaAccount: true,
      },
    });

    if (!user || !user.instaAccount) {
      return NextResponse.json({ connected: false }, { status: 200 });
    }

    return NextResponse.json(
      {
        connected: true,
        username: user.instaAccount.username,
        connectedAt: user.instaAccount.connectedAt,
        lastSyncedAt: user.instaAccount.lastSyncedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
