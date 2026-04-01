// GET /api/forms — returns all forms for the signed-in user
import { getUserForms } from "@/server/services/forms";
import { runWithErrorHandling } from "@/server/middleware/errors";

export async function GET() {
  return runWithErrorHandling(
    async ({ clerkId, instaAccountId }) => {
      return getUserForms(instaAccountId!);
    },
    { requireWorkspace: true },
  );
}
