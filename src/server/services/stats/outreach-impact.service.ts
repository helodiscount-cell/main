/**
 * Outreach Impact Service
 * Business logic for outreach statistics
 */

import {
  countExecutionsByDateRange,
  getExecutionDatesByDateRange,
} from "@/server/repository/automations/automation-execution.repository";

interface DataPoint {
  label: string;
  value: number;
}

/**
 * Gets the total number of automation executions and time-series data for a user
 */
export async function getOutreachImpactStats(
  instaAccountId: string,
  rangeLabel: string,
) {
  const nowUtc = new Date();
  const todayUtc = new Date(
    Date.UTC(
      nowUtc.getUTCFullYear(),
      nowUtc.getUTCMonth(),
      nowUtc.getUTCDate(),
    ),
  );

  let daysParam = 7;
  const rangeMatch = rangeLabel.match(/^Last (\d+)\s*(days?)$/i);
  if (rangeMatch) {
    daysParam = parseInt(rangeMatch[1], 10);
  } else if (rangeLabel === "Last 30 days") {
    daysParam = 30;
  } else if (rangeLabel === "All time") {
    daysParam = 30; // Caps visual chart to 30 days to avoid overcrowding, but keeps total count accurate
  }

  const startDateUtc = new Date(
    todayUtc.getTime() - (daysParam - 1) * 24 * 60 * 60 * 1000,
  );

  // Still calculate exact total count accurately regardless of chart bucketing
  let totalCountStartDate: Date | undefined = startDateUtc;
  if (rangeLabel === "All time") {
    totalCountStartDate = undefined; // Fetch everything for the big number
  }

  // Count executions from start date to now
  const count = await countExecutionsByDateRange(
    instaAccountId,
    totalCountStartDate,
  );
  const executions = await getExecutionDatesByDateRange(
    instaAccountId,
    startDateUtc,
  );

  // Bucket into days
  const chartData: DataPoint[] = [];
  const bucketMap = new Map<number, number>();

  executions.forEach((exec) => {
    // Truncate to UTC day
    const d = new Date(
      Date.UTC(
        exec.executedAt.getUTCFullYear(),
        exec.executedAt.getUTCMonth(),
        exec.executedAt.getUTCDate(),
      ),
    );
    const time = d.getTime();
    bucketMap.set(time, (bucketMap.get(time) || 0) + 1);
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

    const dailyCount = bucketMap.get(dayTime) || 0;

    const day = currentDayUtc.getUTCDate();
    const month = monthNames[currentDayUtc.getUTCMonth()];

    chartData.push({
      label: `${day} ${month}`,
      value: dailyCount,
    });
  }

  return {
    count,
    data: chartData,
  };
}
