"use server";

import { auth } from "@clerk/nextjs/server";
import { workspaceService } from "@/server/workspace";

// Clean up any remaining session state on logout
export async function cleanupOnLogout(): Promise<void> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return;

  // Explicitly clear the workspace cookie so a new user doesn't inherit it
  await workspaceService.clearActiveWorkspaceCookie();
}
