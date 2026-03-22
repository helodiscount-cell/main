/**
 * Contacts Service
 * Contains business logic for contacts management
 */

import { findUserByClerkId } from "@/server/repository/user/user.repository";
import { getUniqueContactsForUser } from "@/server/repository/contacts/contacts.repository";
import { ApiRouteError } from "@/server/middleware/errors/classes";
import { ERROR_MESSAGES } from "@/server/config/instagram.config";

/**
 * Gets unique contacts for a user identified by Clerk ID
 */
export async function getUserContacts(clerkId: string) {
  const user = await findUserByClerkId(clerkId);

  if (!user) {
    throw new ApiRouteError(ERROR_MESSAGES.AUTH.NO_USER, "NO_USER");
  }

  const contacts = await getUniqueContactsForUser(user.id);

  return contacts.map((contact) => ({
    ...contact,
    // Format date for frontend consistency if needed, but repository already returns Date objects
    lastInteractedAt:
      contact.lastInteractedAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) +
      " (" +
      getTimeAgo(contact.lastInteractedAt) +
      ")",
  }));
}

/**
 * Helper to get time ago string
 */
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
}
