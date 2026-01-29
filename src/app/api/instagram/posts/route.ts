/**
 * Instagram Posts Endpoint
 * Retrieves Instagram posts for the authenticated user
 */

import { getUserPosts } from "@/server/services/instagram.service";
import { runWithErrorHandling } from "@/lib/middleware/errors";

/**
 * This endpoint should not be spammed, hit it once and then store the data in local storage of the browser
 * and then use the data from the local storage for the rest of the session until the user logs out or clicks refresh
*/

export async function GET() {
  return runWithErrorHandling(async (clerkId) => {
    const result = await getUserPosts(clerkId);
    return result;
  });
}
