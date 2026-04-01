/**
 * Contacts List Endpoint
 * Retrieves unique contacts derived from automation executions
 */

import { NextRequest } from "next/server";
import { getUserContacts } from "@/server/services/contacts/contacts.service";
import { runWithErrorHandling } from "@/server/middleware/errors";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  const cursor = searchParams.get("cursor") || undefined;

  return runWithErrorHandling(
    async ({ clerkId, instaAccountId }) => {
      return await getUserContacts(instaAccountId!, limit, cursor);
    },
    { requireWorkspace: true },
  );
}
