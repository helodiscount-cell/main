/**
 * Follower Growth Service
 * Handles fetching stats and acting as a pseudo-cron for daily snapshots
 */

import { findUserWithInstaAccount } from "@/server/repository/user/user.repository";
import {
  createFollowerSnapshot,
  getFollowerSnapshots,
} from "@/server/repository/instagram/follower-snapshot.repository";
import { fetchInstagramUserData } from "@/server/instagram/oauth/oauth";
import { ApiRouteError } from "@/server/middleware/errors/classes";
import { prisma } from "@/server/db";

interface DataPoint {
  label: string;
  value: number;
}

export async function getFollowersGrowthStats(
  clerkId: string,
  rangeLabel: string,
) {
  const user = await findUserWithInstaAccount(clerkId);
  if (!user || !user.instaAccount) {
    throw new ApiRouteError(
      "User or Instagram account not found",
      "NOT_FOUND",
      404,
    );
  }

  const nowUtc = new Date();
  const todayUtc = new Date(
    Date.UTC(
      nowUtc.getUTCFullYear(),
      nowUtc.getUTCMonth(),
      nowUtc.getUTCDate(),
    ),
  );

  // 1. Pseudo-Cron: Check if we need to take a snapshot today
  const existingToday = await prisma.instaFollowerSnapshot.findFirst({
    where: {
      instaAccountId: user.instaAccount.id,
      date: todayUtc,
    },
  });

  if (!existingToday) {
    // Try to fetch current count from Instagram Graph API
    // Fail silently so dashboard still loads if API fails
    try {
      const igData = await fetchInstagramUserData(
        user.instaAccount.accessToken,
      );
      if (igData && typeof igData.followers_count === "number") {
        await createFollowerSnapshot(
          user.instaAccount.id,
          igData.followers_count,
          todayUtc,
        );
      }
    } catch (error) {
      console.error(
        "Failed to fetch fresh follower count for snapshot:",
        error,
      );
      // We do not throw here! Dashboard must not be blocked.
    }
  }

  // 2. Determine date range for the widget
  let daysParam = 7;
  const rangeMatch = rangeLabel.match(/^Last (\d+)\s*(days?)$/i);
  if (rangeMatch) {
    daysParam = parseInt(rangeMatch[1], 10);
  } else if (rangeLabel === "All time") {
    daysParam = 30; // Fallback or we could calculate since joined. Since they wanted same UI, let's keep ranges simple.
  }

  const startDateUtc = new Date(
    todayUtc.getTime() - (daysParam - 1) * 24 * 60 * 60 * 1000,
  );

  // 3. Fetch snapshots in range
  const snapshots = await getFollowerSnapshots(
    user.instaAccount.id,
    startDateUtc,
  );

  // 4. Fetch the baseline (last snapshot BEFORE the range, for Option A interpolation)
  let lastKnownCount = 0;
  if (snapshots.length === 0 || snapshots[0].date > startDateUtc) {
    const baselineSnapshot = await prisma.instaFollowerSnapshot.findFirst({
      where: {
        instaAccountId: user.instaAccount.id,
        date: { lt: startDateUtc },
      },
      orderBy: { date: "desc" },
    });

    if (baselineSnapshot) {
      lastKnownCount = baselineSnapshot.followersCount;
    } else if (snapshots.length > 0) {
      // If we don't have an older baseline, use the very first snapshot we found as the baseline
      lastKnownCount = snapshots[0].followersCount;
    }
  } else {
    lastKnownCount = snapshots[0].followersCount;
  }

  // 5. Fill gaps using Option A (Carry Forward)
  const chartData: DataPoint[] = [];
  const snapshotMap = new Map<number, number>();

  snapshots.forEach((snap) => {
    snapshotMap.set(snap.date.getTime(), snap.followersCount);
  });

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let i = 0; i < daysParam; i++) {
    const currentDayUtc = new Date(
      startDateUtc.getTime() + i * 24 * 60 * 60 * 1000,
    );
    const dayTime = currentDayUtc.getTime();

    if (snapshotMap.has(dayTime)) {
      lastKnownCount = snapshotMap.get(dayTime)!;
    }

    // Format label like "3 Nov" (matching the DUMMY_CONFIG)
    const day = currentDayUtc.getUTCDate();
    const month = monthNames[currentDayUtc.getUTCMonth()];

    chartData.push({
      label: `${day} ${month}`,
      value: lastKnownCount,
    });
  }

  // Net growth calculation
  const startCount = chartData[0]?.value || 0;
  const endCount = chartData[chartData.length - 1]?.value || 0;
  const newFollowers = endCount - startCount;

  return {
    growth: newFollowers >= 0 ? newFollowers : 0, // usually we show positive text, or net change
    data: chartData,
  };
}
