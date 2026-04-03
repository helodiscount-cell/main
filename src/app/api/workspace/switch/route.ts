/**
 * Workspace Switch API
 * Sets the active_ig_id cookie to the selected workspace
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/server/db";
import { setActiveWorkspaceCookie } from "@/server/utils/workspace-cookie";

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

  let body: any;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Malformed JSON" },
      { status: 400 },
    );
  }

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

  // Use the shared helper to ensure security attributes are consistent
  return setActiveWorkspaceCookie(response, account.id);
}
