import { NextRequest } from "next/server";
import { duplicateForm } from "@/server/services/forms";
import { runWithErrorHandling } from "@/server/middleware/errors";

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return runWithErrorHandling(
    async ({ clerkId, instaAccountId }) => {
      const { getFeatureGates } =
        await import("@/server/services/billing/feature-gates");
      const { state } = await getFeatureGates(clerkId!);

      const { id } = await params;
      return duplicateForm(clerkId!, instaAccountId!, id, state.maxForms);
    },
    { requireWorkspace: true },
  );
}
