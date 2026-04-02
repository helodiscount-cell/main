"use server";

import { redirect } from "next/navigation";
import { workspaceService } from "@/server/workspace";
import { DASHBOARD_ROUTE } from "@/configs/routes.config";

// Sets the active workspace cookie and redirects to the dashboard
export async function selectWorkspace(instaAccountId: string): Promise<void> {
  await workspaceService.setActive(instaAccountId);
  redirect(DASHBOARD_ROUTE);
}

// Fetches all Instagram accounts for the current user
export async function getUserWorkspaces() {
  return workspaceService.getUserWorkspaces();
}
