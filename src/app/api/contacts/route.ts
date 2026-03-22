/**
 * Contacts List Endpoint
 * Retrieves unique contacts derived from automation executions
 */

import { getUserContacts } from "@/server/services/contacts/contacts.service";
import { runWithErrorHandling } from "@/server/middleware/errors";

export async function GET() {
  return runWithErrorHandling(async (clerkId) => {
    const contacts = await getUserContacts(clerkId);
    return { contacts };
  });
}
