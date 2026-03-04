/**
 * Outreach Impact Service
 * Business logic for outreach statistics
 */

import { findUserByClerkId } from "@/server/repository/user/user.repository";
import { countExecutionsByDateRange } from "@/server/repository/automations/automation-execution.repository";
import { ApiRouteError } from "@/server/middleware/errors/classes";

/**
 * Gets the total number of automation executions for a user within a specified range
 */
export async function getOutreachImpactStats(
  clerkId: string,
  rangeLabel: string,
) {
  // Get internal user ID from Clerk ID
  const user = await findUserByClerkId(clerkId);
  if (!user) {
    throw new ApiRouteError("User not found", "NOT_FOUND", 404);
  }

  const now = new Date();
  let startDate: Date | undefined;

  // Determine start date based on range label
  switch (rangeLabel) {
    case "Last 1 hour":
      startDate = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case "Last 6 hours":
      startDate = new Date(now.getTime() - 6 * 60 * 60 * 1000);
      break;
    case "Today":
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case "Yesterday":
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      startDate = yesterday;
      // For "Yesterday", we should also cap the end date to the start of today
      const endOfYesterday = new Date(now.setHours(0, 0, 0, 0));
      return await countExecutionsByDateRange(
        user.id,
        startDate,
        endOfYesterday,
      );
    case "Last 3 days":
      startDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      break;
    case "Last 7 days":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "Last 30 days":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "Since you joined":
    case "All time":
    default:
      startDate = undefined; // Null means since the beginning
      break;
  }

  // Count executions from start date to now
  return await countExecutionsByDateRange(user.id, startDate);
}
