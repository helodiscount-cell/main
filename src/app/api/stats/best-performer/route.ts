import { NextRequest, NextResponse } from "next/server";
import { runWithErrorHandling } from "@/server/middleware/errors";
import { getBestPerformerStats } from "@/server/services/stats/best-performer.service";

/**
 * GET /api/stats/best-performer
 *
 * Fetches the user's top three performing posts based on internal automation execution stats
 */
export async function GET(req: NextRequest) {
  return runWithErrorHandling(async (clerkId) => {
    const { searchParams } = new URL(req.url);
    const rangeLabel = searchParams.get("range") || "Last 7 days";

    const stats = await getBestPerformerStats(clerkId, rangeLabel);

    return {
      success: true,
      result: stats,
    };
  });
}
