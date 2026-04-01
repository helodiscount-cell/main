"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/server/db";
import { WORKSPACE_CONFIG } from "@/configs/workspace.config";
import { DASHBOARD_ROUTE } from "@/configs/routes.config";

// Sets the active workspace cookie and redirects to the dashboard
export async function selectWorkspace(instaAccountId: string): Promise<void> {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/auth");

  // Ownership check — prevent forged account IDs
  const account = await prisma.instaAccount.findFirst({
    where: {
      id: instaAccountId,
      isActive: true,
      user: { clerkId },
    },
    select: { id: true },
  });

  if (!account) redirect("/auth/connect");

  const cookieStore = await cookies();
  cookieStore.set(WORKSPACE_CONFIG.ACTIVE_WORKSPACE_COOKIE, account.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: WORKSPACE_CONFIG.COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });

  redirect(DASHBOARD_ROUTE);
}

// Fetches all Instagram accounts for the current user
export async function getUserWorkspaces() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return [];

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: {
      instaAccounts: {
        orderBy: { connectedAt: "asc" },
        select: {
          id: true,
          username: true,
          profilePictureUrl: true,
          isActive: true,
          tokenExpiresAt: true,
        },
      },
    },
  });

  return user?.instaAccounts ?? [];
}
