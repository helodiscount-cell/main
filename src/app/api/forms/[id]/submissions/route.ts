// GET /api/forms/[id]/submissions — returns all submissions for a form owned by the user
import { NextRequest } from "next/server";
import { getFormSubmissions } from "@/server/services/forms";
import { runWithErrorHandling } from "@/server/middleware/errors";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return runWithErrorHandling(async (clerkId) => {
    const { id } = await params;
    return getFormSubmissions(clerkId, id);
  });
}
