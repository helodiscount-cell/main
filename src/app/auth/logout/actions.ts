"use server";

import { auth } from "@clerk/nextjs/server";

// Logout only clears the server-side Clerk session context.
// Instagram workspace connections remain intact in the DB — logout ≠ disconnect.
export async function cleanupOnLogout(): Promise<void> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return;

  // Nothing to do server-side — Clerk handles session revocation on signOut().
  // Workspaces stay active so the user lands on /choose-account on next login.
}
