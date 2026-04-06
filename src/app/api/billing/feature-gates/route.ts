import { auth } from "@clerk/nextjs/server";
import { getFeatureGates } from "@/server/services/billing/feature-gates";
import { NextResponse } from "next/server";

/**
 * GET /api/billing/feature-gates
 *
 * Fetches the current user's feature access flags and subscription state.
 * Used for client-side gating of premium widgets and features.
 */
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const gates = await getFeatureGates(userId);
    return NextResponse.json(gates);
  } catch (error: any) {
    console.error("[FeatureGates API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
