/**
 * Instagram Posts Endpoint
 * Retrieves Instagram posts for the authenticated user
 */

import { getUserPosts } from "@/server/services/instagram/instagram.service";
import { runWithErrorHandling } from "@/server/middleware/errors";
import { NextRequest } from "next/server";

/**
 * This endpoint should not be spammed, hit it once and then store the data in local storage of the browser
 * and then use the data from the local storage for the rest of the session until the user logs out or clicks refresh
 */

export async function GET(request: NextRequest) {
  return runWithErrorHandling(
    async ({ instaAccountId }) => {
      const { searchParams } = new URL(request.url);
      const forceRefresh = searchParams.get("forceRefresh") === "true";
      const after = searchParams.get("after") || undefined;

      return await getUserPosts(instaAccountId!, forceRefresh, after);
    },
    { requireWorkspace: true },
  );
}
