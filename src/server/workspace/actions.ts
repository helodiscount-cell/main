"use server";

import { workspaceService } from "./service";
import { redirect } from "next/navigation";

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
  await workspaceService.disconnectActive();
}
