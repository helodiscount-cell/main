"use server";

import { workspaceService } from "./service";

/**
 * Server Action: Switches the active workspace cookie
 */
export async function switchWorkspaceAction(
  instaAccountId: string,
): Promise<void> {
  await workspaceService.setActive(instaAccountId);
}

/**
 * Server Action: Disconnects the current active workspace
 */
export async function disconnectActiveWorkspaceAction(): Promise<void> {
  const activeId = await workspaceService.getActiveId();
  if (activeId) {
    await workspaceService.disconnect(activeId);
  }
}
