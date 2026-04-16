import { NextResponse } from "next/server";
import { workspaceService } from "@/server/workspace";
import { prisma } from "@/server/db";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/workspace/profile
 * Returns the active Instagram workspace's profile details.
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activeId = await workspaceService.getActiveId();
    if (!activeId) {
      return NextResponse.json(
        { error: "No active workspace" },
        { status: 404 },
      );
    }

    const account = await prisma.instaAccount.findFirst({
      where: {
        id: activeId,
        user: { clerkId: userId },
        isActive: true,
      },
      select: {
        username: true,
        profilePictureUrl: true,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      result: account,
    });
  } catch (error) {
    console.error("[API Workspace Profile] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
