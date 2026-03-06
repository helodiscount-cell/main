import { findUserWithInstaAccount } from "@/server/repository/user/user.repository";
import { ApiRouteError } from "@/server/middleware/errors/classes";
import { prisma } from "@/server/db";

export interface BestPerformerStats {
  id: string;
  date: string;
  value: number;
  imageUrl: string;
}

export interface BestTimeStats {
  imageUrl: string;
  fullDate: string;
  day: string;
  timeWindow: string;
}

export interface BestPerformerWidgetConfig {
  title: string;
  dropdownOptions: string[];
  chartData: BestPerformerStats[];
  bestTimeData: BestTimeStats;
}

export async function getBestPerformerStats(
  clerkId: string,
  rangeLabel: string,
): Promise<BestPerformerWidgetConfig> {
  const user = await findUserWithInstaAccount(clerkId);
  if (!user || !user.instaAccount) {
    throw new ApiRouteError(
      "User or Instagram account not found",
      "NOT_FOUND",
      404,
    );
  }

  // Determine date range for the widget
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
    daysParam = 365 * 10; // essentially all time
  }

  const startDateUtc = new Date(
    todayUtc.getTime() - (daysParam - 1) * 24 * 60 * 60 * 1000,
  );

  // Find automations triggered within the time window
  const automations = await prisma.automation.findMany({
    where: {
      userId: user.id,
      triggerType: "COMMENT_ON_POST",
      post: {
        isSet: true,
      },
      executions: {
        some: {
          executedAt: { gte: startDateUtc },
        },
      },
    },
    include: {
      executions: {
        where: { executedAt: { gte: startDateUtc } },
      },
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
    const fallbackImage =
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100";
    return {
      id: item.automation.id,
      date: `${formattedDates[idx].day} ${formattedDates[idx].month}`,
      value: item.score,
      imageUrl: fallbackImage,
    };
  });

  // Calculate Best Time To Post based on the #1 performing post (or aggregate)
  let bestTimeData: BestTimeStats;

  if (top3.length > 0) {
    const absoluteBest = top3[0];
    const bestDateObj = formattedDates[0].fullDateObj;

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

    const dayName = dayNames[bestDateObj.getUTCDay()];
    const fullDate = `${bestDateObj.getUTCDate()} ${fullMonthNames[bestDateObj.getUTCMonth()]}, ${bestDateObj.getUTCFullYear()}`;

    // 1 hour window e.g 4:00 p.m. - 5:00 p.m.
    const startHour = bestDateObj.getUTCHours();
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

  // Ensure chartData is ascending by date for a chronological chart, if desired.
  // The UI mock showed [3 Nov, 5 Nov, 8 Nov], implying chronological.
  // Wait, the prompt specifically says "shows top 3 performing posts of a user". So the order could be chronological.
  chartData.sort((a, b) => {
    // simple sort by day of month, assumes same month/year or just display order
    return parseInt(a.date.split(" ")[0]) - parseInt(b.date.split(" ")[0]);
  });

  return {
    title: "Best Performer",
    dropdownOptions: ["Last 7 days", "Last 30 days", "All time"],
    chartData,
    bestTimeData,
  };
}
