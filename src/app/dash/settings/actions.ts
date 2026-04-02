"use server";

import { workspaceService } from "@/server/workspace";

/**
 * Disconnects the currently active Instagram workspace
 */
export async function disconnectActiveAccount(): Promise<void> {
  await workspaceService.disconnectActive();
}

/**
 * Updates the active Instagram workspace cookie (pure action)
 */
export async function setWorkspaceCookie(
  instaAccountId: string,
): Promise<void> {
  await workspaceService.setActive(instaAccountId);
}
