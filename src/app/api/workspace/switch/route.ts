/**
 * Workspace Switch API
 * Sets the active_ig_id cookie to the selected workspace
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/server/db";
import { WORKSPACE_CONFIG } from "@/configs/workspace.config";

const SwitchSchema = z.object({
  instaAccountId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await request.json();
  const validation = SwitchSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: "instaAccountId is required" },
      { status: 400 },
    );
  }

  // Ownership check — only the account's owner can switch to it
  const account = await prisma.instaAccount.findFirst({
    where: {
      id: validation.data.instaAccountId,
      isActive: true,
      user: { clerkId },
    },
    select: { id: true },
  });

  if (!account) {
    return NextResponse.json(
      { success: false, error: "Account not found" },
      { status: 404 },
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set(WORKSPACE_CONFIG.ACTIVE_WORKSPACE_COOKIE, account.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: WORKSPACE_CONFIG.COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });

  return response;
}
