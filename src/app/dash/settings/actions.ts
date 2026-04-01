"use server";

import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/server/db";
import { WORKSPACE_CONFIG } from "@/configs/workspace.config";
import { disconnectAccount } from "@/server/services/instagram/oauth.service";
import { CONNECT_ROUTE } from "@/configs/routes.config";

/**
 * Disconnects the currently active Instagram workspace
 */
export async function disconnectActiveAccount(): Promise<void> {
  const { userId } = await auth();
  if (!userId) redirect("/auth/signin");

  const cookieStore = await cookies();
  const activeIgId = cookieStore.get(
    WORKSPACE_CONFIG.ACTIVE_WORKSPACE_COOKIE,
  )?.value;

  if (!activeIgId) {
    redirect(CONNECT_ROUTE);
  }

  // 1. Verify ownership before disconnecting
  const account = await prisma.instaAccount.findFirst({
    where: { id: activeIgId, user: { clerkId: userId } },
    select: { id: true },
  });

  if (!account) {
    // If account doesn't belong to the user, just clear cookie/redirect
    cookieStore.delete(WORKSPACE_CONFIG.ACTIVE_WORKSPACE_COOKIE);
    redirect(CONNECT_ROUTE);
  }

  // 2. Perform the server-side disconnection
  await disconnectAccount(activeIgId);

  // 3. Clear the active workspace cookie and push back to connect screen
  cookieStore.delete(WORKSPACE_CONFIG.ACTIVE_WORKSPACE_COOKIE);

  redirect(CONNECT_ROUTE);
}
