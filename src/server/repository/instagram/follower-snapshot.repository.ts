/**
 * Follower Snapshot Repository
 * Data access layer for InstaFollowerSnapshot model
 */

import { prisma } from "@/server/db";
import { executeWithErrorHandling } from "../repository-utils";

/**
 * Creates a follower snapshot for a specific date (UTC).
 * Relies on the database @@unique([instaAccountId, date]) constraint to prevent duplicates.
 * Returns true if created successfully, false if duplicate or error.
 */
export async function createFollowerSnapshot(
  instaAccountId: string,
  followersCount: number,
  snapshotDateUTC: Date,
): Promise<boolean> {
  return executeWithErrorHandling(
    async () => {
      try {
        await prisma.instaFollowerSnapshot.create({
          data: {
            instaAccountId,
            followersCount,
            date: snapshotDateUTC,
          },
        });
        return true;
      } catch (error: any) {
        // P2002 is Prisma's unique constraint violation error code
        if (error.code === "P2002") {
          return false; // Silently ignore duplicate for the day
        }
        throw error;
      }
    },
    {
      operation: "createFollowerSnapshot",
      model: "InstaFollowerSnapshot",
      fallback: false, // Don't crash on failure
      retries: 0, // No need to retry a snapshot
    },
  );
}

/**
 * Retrieves historical follower snapshots for an account within a date range
 */
export async function getFollowerSnapshots(
  instaAccountId: string,
  startDateUTC: Date,
) {
  return executeWithErrorHandling(
    () =>
      prisma.instaFollowerSnapshot.findMany({
        where: {
          instaAccountId,
          date: {
            gte: startDateUTC,
          },
        },
        orderBy: {
          date: "asc",
        },
      }),
    {
      operation: "getFollowerSnapshots",
      model: "InstaFollowerSnapshot",
      fallback: [],
      retries: 1,
    },
  );
}
