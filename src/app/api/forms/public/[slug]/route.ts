// GET /api/forms/public/[slug] — public form data, no auth required
import { NextRequest } from "next/server";
import { getPublicFormBySlug } from "@/server/services/forms";
import { runWithErrorHandling } from "@/server/middleware/errors";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  return runWithErrorHandling(
    async () => {
      const { slug } = await params;
      return getPublicFormBySlug(slug);
    },
    { requireAuth: false },
  );
}
