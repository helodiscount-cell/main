// GET /api/forms/[id] — returns a single form owned by the signed-in user (for editor)
// DELETE /api/forms/[id] — permanently deletes the form (owner only)
import { NextRequest } from "next/server";
import { getFormById, updateForm, deleteForm } from "@/server/services/forms";
import { CreateFormSchema } from "@dm-broo/common-types";
import { ApiRouteError } from "@/server/middleware/errors/classes";
import { runWithErrorHandling } from "@/server/middleware/errors";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return runWithErrorHandling(
    async ({ clerkId, instaAccountId }) => {
      const { id } = await params;
      return getFormById(clerkId, instaAccountId!, id);
    },
    { requireWorkspace: true },
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return runWithErrorHandling(
    async ({ clerkId, instaAccountId }) => {
      const { id } = await params;
      const body = await request.json();

      const validation = CreateFormSchema.safeParse(body);

      if (!validation.success) {
        throw new ApiRouteError(
          validation.error.issues[0]?.message || "Invalid input",
          "INVALID_INPUT",
          400,
        );
      }

      return updateForm(clerkId, instaAccountId!, id, validation.data);
    },
    { requireWorkspace: true },
  );
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return runWithErrorHandling(
    async ({ clerkId, instaAccountId }) => {
      const { id } = await params;
      return deleteForm(clerkId, instaAccountId!, id);
    },
    { requireWorkspace: true },
  );
}
