"use client";

import React from "react";
import Image from "next/image";
import { FileText } from "lucide-react";
import { AutomationListItem } from "@/types/automation";
import { FormListItem } from "@/types/form";
import { getAutomationRoute, getAutomationLabel } from "@/utils/automation";
import { StatusBadge } from "@/components/shared/StatusBadge";

export interface MappedDashboardItem {
  id: string;
  title: string;
  subtitle: string;
  image: React.ReactNode;
  status: React.ReactNode;
  statusText: string;
  stats: number;
  statsLabel: string;
  secondaryStats?: number;
  secondaryStatsLabel?: string;
  newFollowersGained?: number;
  date: string;
  dateLabel: string;
  href: string | null;
  raw: AutomationListItem | FormListItem;
}

/**
 * Shared hook to map raw dashboard data (Forms or Automations) into a unified UI structure.
 * This ensures consistency between desktop TableRow and mobile MobileCard.
 */
export const mapDashboardItem = (
  data: AutomationListItem | FormListItem,
): MappedDashboardItem => {
  const isAutomation = "triggerType" in data;

  const safeFormatDate = (date: string | Date | null | undefined) => {
    if (!date) return "—";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "—";

    const secondsAgo = Math.floor((Date.now() - d.getTime()) / 1000);
    if (secondsAgo >= 0 && secondsAgo < 60) {
      return "just now";
    }

    return d.toLocaleDateString();
  };

  if (isAutomation) {
    const automation = data as AutomationListItem;
    const newFollowersGained = data.newFollowersGained;
    const imageUrl =
      automation.post?.thumbnailUrl ||
      automation.post?.mediaUrl ||
      automation.story?.thumbnailUrl ||
      automation.story?.mediaUrl;

    const currentStatus =
      automation.story &&
      Date.now() - new Date(automation.story.timestamp).getTime() >=
        24 * 60 * 60 * 1000
        ? "EXPIRED"
        : (automation.status as string);

    return {
      id: automation.id,
      title: automation.automationName || "Unnamed Automation",
      subtitle:
        automation.post?.caption ||
        automation.story?.caption ||
        (automation.triggers.length > 0
          ? `Keywords: ${automation.triggers.join(", ")}`
          : "No keyword triggers"),
      href: getAutomationRoute(automation.triggerType, automation.id),
      image:
        typeof imageUrl === "string" && imageUrl.trim().length > 0 ? (
          <Image
            alt="Media preview"
            src={imageUrl}
            width={40}
            height={40}
            className="rounded-lg object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-[10px] text-slate-400 font-bold uppercase text-center p-1">
            {getAutomationLabel(automation.triggerType) || "Auto"}
          </div>
        ),
      status: <StatusBadge status={currentStatus} />,
      statusText: currentStatus,
      stats: automation.timesTriggered,
      statsLabel: "Total Executions",
      secondaryStats: automation._count.executions,
      secondaryStatsLabel: "Runs",
      newFollowersGained: automation.newFollowersGained,
      date: safeFormatDate(automation.lastTriggeredAt),
      dateLabel: "Last Triggered",
      raw: data,
    };
  }

  // Handle Forms
  const form = data as FormListItem;
  return {
    id: form.id,
    title: form.name || "Untitled Form",
    subtitle: "",
    href: `/dash/forms/${form.id}`,
    image:
      typeof form.coverImage === "string" &&
      form.coverImage.trim().length > 0 ? (
        <div className="w-full h-full flex items-center justify-center bg-white rounded-lg overflow-hidden border border-slate-100">
          <Image
            src={form.coverImage}
            className="h-full w-full object-cover"
            height={100}
            width={100}
            alt={form.title || "Untitled Form"}
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-lg text-slate-300">
          <FileText size={20} />
        </div>
      ),
    status: (
      <span
        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
          form.status === "PUBLISHED"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {form.status === "PUBLISHED" ? "Live" : "Draft"}
      </span>
    ),
    statusText: form.status,
    stats: form.submissionCount,
    statsLabel: "Submissions",
    date: safeFormatDate(form.updatedAt),
    dateLabel: "Last Updated",
    raw: data,
  };
};
