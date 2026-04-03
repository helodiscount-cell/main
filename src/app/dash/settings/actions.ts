"use server";

import { workspaceService } from "@/server/workspace";

/**
 * Disconnects the currently active Instagram workspace
 */
export async function disconnectActiveAccount(
  formData: FormData,
): Promise<void> {
  const accountId = formData.get("instaAccountId") as string;
  if (!accountId) throw new Error("No account ID provided for disconnection");
  await workspaceService.disconnect(accountId);
}

/**
 * Updates the active Instagram workspace cookie (pure action)
 */
export async function setWorkspaceCookie(
  instaAccountId: string,
): Promise<void> {
  await workspaceService.setActive(instaAccountId);
}
