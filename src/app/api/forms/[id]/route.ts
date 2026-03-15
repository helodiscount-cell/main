// GET /api/forms/[id] — returns a single form owned by the signed-in user (for editor)
import { NextRequest } from "next/server";
import { getFormById } from "@/server/services/forms";
import { runWithErrorHandling } from "@/server/middleware/errors";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return runWithErrorHandling(async (clerkId) => {
    const { id } = await params;
    return getFormById(clerkId, id);
  });
}
