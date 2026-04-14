/**
 * Instagram Stories Endpoint
 * Retrieves Instagram stories for the authenticated user
 */

import { getUserStories } from "@/server/services/instagram/instagram.service";
import { runWithErrorHandling } from "@/server/middleware/errors";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return runWithErrorHandling(
    async ({ instaAccountId }) => {
      const { searchParams } = new URL(request.url);
      const forceRefresh = searchParams.get("forceRefresh") === "true";

      return await getUserStories(instaAccountId!, forceRefresh);
    },
    { requireWorkspace: true },
  );
}
