import { NextRequest, NextResponse } from "next/server";
import { runWithErrorHandling } from "@/server/middleware/errors";
import { getBestPerformerStats } from "@/server/services/stats/best-performer.service";

/**
 * GET /api/stats/best-performer
 *
 * Fetches the user's top three performing posts based on internal automation execution stats
 */
import { getFeatureGates } from "@/server/services/billing/feature-gates";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  return runWithErrorHandling(
    async ({ instaAccountId }) => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");

      const gates = await getFeatureGates(userId);
      if (!gates.access.hasBestPerformer) {
        throw new Error("This feature requires a Black plan subscription.");
      }

      const { searchParams } = new URL(req.url);
      const rangeLabel = searchParams.get("range") || "Last 7 days";

      const stats = await getBestPerformerStats(instaAccountId!, rangeLabel);

      return stats;
    },
    { requireWorkspace: true },
  );
}
