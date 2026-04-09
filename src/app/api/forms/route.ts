// GET /api/forms — returns all forms for the signed-in user
import { getUserForms } from "@/server/services/forms";
import { runWithErrorHandling } from "@/server/middleware/errors";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;

  return runWithErrorHandling(
    async ({ instaAccountId }) => {
      return getUserForms(instaAccountId!, status);
    },
    { requireWorkspace: true },
  );
}
