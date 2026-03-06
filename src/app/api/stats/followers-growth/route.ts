import { NextRequest, NextResponse } from "next/server";
import { runWithErrorHandling } from "@/server/middleware/errors";
import { getFollowersGrowthStats } from "@/server/services/stats/followers-growth.service";

/**
 * GET /api/stats/followers-growth
 *
 * Fetches the follower growth statistics and pseudo-cron takes a daily snapshot if missing.
 */
export async function GET(req: NextRequest) {
  return runWithErrorHandling(async (clerkId) => {
    const { searchParams } = new URL(req.url);
    const rangeLabel = searchParams.get("range") || "Last 7 days";

    const stats = await getFollowersGrowthStats(clerkId, rangeLabel);

    return stats;
  });
}
