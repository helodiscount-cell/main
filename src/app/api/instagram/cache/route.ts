/**
 * Instagram Cache Invalidation Endpoint
 * Clears Redis cache for posts and stories, forcing fresh data from the Instagram API.
 */

import { findUserWithInstaAccount } from "@/server/repository/user/user.repository";
import { invalidateInstagramCache } from "@/server/redis";
import { runWithErrorHandling } from "@/server/middleware/errors";
import { ApiRouteError } from "@/server/middleware/errors/classes";

export async function DELETE() {
  return runWithErrorHandling(async (clerkId) => {
    const user = await findUserWithInstaAccount(clerkId);

    if (!user?.instaAccount) {
      throw new ApiRouteError(
        "No Instagram account linked",
        "NO_INSTAGRAM_ACCOUNT",
        404,
      );
    }

    await invalidateInstagramCache(user.instaAccount.instagramUserId);

    return { success: true };
  });
}
