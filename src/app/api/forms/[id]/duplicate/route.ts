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

      // CHECK FORM COUNT LIMIT (FREE plan cap)
      if (state.maxForms !== -1) {
        const { countFormsByInstaAccountId } =
          await import("@/server/repository/forms");
        const currentCount = await countFormsByInstaAccountId(instaAccountId!);
        if (currentCount >= state.maxForms) {
          const { ApiRouteError } =
            await import("@/server/middleware/errors/classes");
          throw new ApiRouteError(
            `Free plan allows up to ${state.maxForms} forms. Upgrade to create more.`,
            "FORM_LIMIT_REACHED",
            403,
          );
        }
      }

      const { id } = await params;
      return duplicateForm(clerkId!, instaAccountId!, id);
    },
    { requireWorkspace: true },
  );
}
