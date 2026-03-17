"use server";

import { auth } from "@clerk/nextjs/server";
import { disconnectAccount } from "@/server/services/instagram/oauth.service";

/**
 * Server-side logout cleanup.
 * Clears all Clerk metadata and disconnects Instagram before the client calls signOut().
 * Running this server-side ensures it cannot be blocked by CSRF, network issues, or client errors.
 */
export async function cleanupOnLogout(): Promise<void> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return;

  // 1. ALWAYS wipe Clerk metadata first — this is the critical step.
  //    Even if Instagram disconnect fails below, the auth state is clean.
  try {
    const { createClerkClient } = await import("@clerk/nextjs/server");
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    await clerkClient.users.updateUserMetadata(clerkId, {
      publicMetadata: {
        isConnected: false,
        instaUsername: null!,
        instaProfilePictureUrl: null!,
        instaUserId: null!,
        instaAccountType: null!,
        lastSync: null!,
      },
    });
  } catch (e) {
    console.error("Failed to clear Clerk metadata on logout:", e);
  }

  // 2. Disconnect Instagram and clean up Redis/DB (best effort)
  try {
    await disconnectAccount(clerkId);
  } catch (e) {
    console.error("Instagram disconnect failed during logout:", e);
  }
}
