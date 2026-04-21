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
  const query = searchParams.get("q") || undefined;

  return runWithErrorHandling(
    async ({ instaAccountId }) => {
      return await getUserContacts(instaAccountId!, limit, cursor, query);
    },
    { requireWorkspace: true },
  );
}
