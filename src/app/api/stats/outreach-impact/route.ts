/**
 * Outreach Impact API Route
 * GET /api/stats/outreach-impact?range=Last 7 days
 */

import { runWithErrorHandling } from "@/server/middleware/errors";
import { getOutreachImpactStats } from "@/server/services/stats/outreach-impact.service";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return runWithErrorHandling(
    async ({ instaAccountId }) => {
      // Get range from query params
      const { searchParams } = new URL(req.url);
      const range = searchParams.get("range") || "Last 7 days";

      // Get statistics
      const stats = await getOutreachImpactStats(instaAccountId!, range);

      return {
        count: stats.count,
        data: stats.data,
      };
    },
    { requireWorkspace: true },
  );
}
