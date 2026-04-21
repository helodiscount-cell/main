import { ApiRouteError } from "@/server/middleware/errors/classes";
import { prisma } from "@/server/db";

import {
  BestPerformerStats,
  BestTimeStats,
  BestPerformerWidgetConfig,
} from "@/api/services/stats/types";

export async function getBestPerformerStats(
  instaAccountId: string,
  rangeLabel: string,
): Promise<BestPerformerWidgetConfig> {
  const account = await prisma.instaAccount.findUnique({
    where: { id: instaAccountId, isActive: true },
    select: { id: true },
  });
  if (!account) {
    throw new ApiRouteError("Instagram account not found", "NOT_FOUND", 404);
  }

  // Determine date range for the widget
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let daysParam = 7;
  const rangeMatch = rangeLabel.match(/^Last (\d+)\s*(days?)$/i);
  if (rangeMatch) {
    daysParam = parseInt(rangeMatch[1], 10);
  } else if (rangeLabel === "Last 30 days") {
    daysParam = 30;
  } else if (rangeLabel === "All time") {
    daysParam = 365 * 10; // essentially all time
  }

  const startDate = new Date(
    today.getTime() - (daysParam - 1) * 24 * 60 * 60 * 1000,
  );

  // Find automations triggered within the time window — scoped to this workspace
  const automations = await prisma.automation.findMany({
    where: {
      instaAccountId,
      triggerType: "COMMENT_ON_POST",
      post: { isSet: true },
      status: { not: "DELETED" },
      executions: { some: { executedAt: { gte: startDate } } },
    },
    include: {
      executions: { where: { executedAt: { gte: startDate } } },
    },
  });

  // Calculate performance per post
  // Performance metric = number of executions in the date range
  const performanceList = automations
    .map((auto) => {
      return {
        automation: auto,
        score: auto.executions.length,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // Take top 3
  const top3 = performanceList.slice(0, 3);

  // Month formatter
  const formattedDates = top3.map((item) => {
    // If post timestamp isn't saved, fallback to automation creation date
    const dateObj = new Date(item.automation.createdAt);

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
    return {
      day: dateObj.getUTCDate(),
      month: monthNames[dateObj.getUTCMonth()],
      fullDateObj: dateObj,
    };
  });

  const chartData: BestPerformerStats[] = top3.map((item, idx) => {
    const post = (item.automation as any).post;
    return {
      id: item.automation.id,
      date: `${formattedDates[idx].day} ${formattedDates[idx].month}`,
      value: item.score,
      imageUrl: post?.thumbnailUrl || post?.mediaUrl || "",
    };
  });

  // Calculate Best Time To Post based on the peak activity window of these top performers
  let bestTimeData: BestTimeStats;

  if (top3.length > 0) {
    // Collect all execution hours from top 3 performing posts
    const allExecutionHours = top3.flatMap((item) =>
      item.automation.executions.map((ex) =>
        new Date(ex.executedAt).getUTCHours(),
      ),
    );

    // Find the most frequent hour (the mode)
    const hourFrequency: Record<number, number> = {};
    let peakHour = 0;
    let maxCount = 0;

    allExecutionHours.forEach((hour) => {
      hourFrequency[hour] = (hourFrequency[hour] || 0) + 1;
      if (hourFrequency[hour] > maxCount) {
        maxCount = hourFrequency[hour];
        peakHour = hour;
      }
    });

    // If no executions (shouldn't happen due to filter), fallback to first post's creation hour
    if (allExecutionHours.length === 0) {
      peakHour = new Date(top3[0].automation.createdAt).getUTCHours();
    }

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const fullMonthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const bestDateObj = formattedDates[0].fullDateObj;
    const dayName = dayNames[bestDateObj.getUTCDay()];
    const fullDate = `${bestDateObj.getUTCDate()} ${fullMonthNames[bestDateObj.getUTCMonth()]}, ${bestDateObj.getUTCFullYear()}`;

    // 1 hour window based on peakHour
    const startHour = peakHour;
    const endHour = (startHour + 1) % 24;

    const formatHour = (hour: number) => {
      const ampm = hour >= 12 ? "p.m." : "a.m.";
      const hour12 = hour % 12 || 12;
      return `${hour12}:00 ${ampm}`;
    };

    bestTimeData = {
      imageUrl: chartData[0].imageUrl,
      fullDate,
      day: dayName,
      timeWindow: `${formatHour(startHour)} - ${formatHour(endHour)}`,
    };
  } else {
    // Empty state fallback
    bestTimeData = {
      imageUrl:
        "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&q=80&w=200&h=200",
      fullDate: "No data yet",
      day: "N/A",
      timeWindow: "N/A",
    };
  }

  // Ensure chartData is ascending by date for the widget display
  chartData.sort((a, b) => {
    return parseInt(a.date.split(" ")[0]) - parseInt(b.date.split(" ")[0]);
  });

  return {
    title: "Best Performer",
    dropdownOptions: ["Last 7 days", "Last 30 days", "All time"],
    chartData,
    bestTimeData,
  };
}
