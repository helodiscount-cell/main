"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText, ExternalLink, Copy, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import type { AutomationListItem } from "@/types/automation";
import type { FormListItem } from "@/types/form";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AutomationActionsMenu } from "@/components/dash/automations/AutomationActionsMenu";
import { FormActionsMenu } from "../forms/_components/FormActionsMenu";

// Styles
const FORM_STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-700",
  DRAFT: "bg-slate-100 text-slate-500",
};

/**
 * Props for the dumb UI component.
 */
export interface TableRowUIProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string | React.ReactNode;
  href: string;
  status: React.ReactNode;
  stats: React.ReactNode;
  date: React.ReactNode;
  actions: React.ReactNode;
  className?: string;
}

/**
 * Purely presentational component that renders the table row structure.
 */
const TableRowUI = ({
  icon,
  title,
  subtitle,
  href,
  status,
  stats,
  date,
  actions,
  className = "",
}: TableRowUIProps) => {
  return (
    <div
      className={`grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center px-4 py-4 gap-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors group/row ${className}`}
    >
      {/* 1. Icon + Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-md bg-slate-50 shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
          {icon}
        </div>
        <Link href={href} className="flex flex-col gap-0.5 group min-w-0">
          <span className="text-sm font-medium text-slate-800 group-hover:text-[#6A06E4] transition-colors truncate">
            {title}
          </span>
          {subtitle && (
            <span className="text-xs text-slate-400 truncate max-w-[260px]">
              {subtitle}
            </span>
          )}
        </Link>
      </div>

      {/* 2. Status Section */}
      <div className="flex items-center gap-2 overflow-hidden">
        {status}
        <div className="w-px h-4 bg-slate-200 shrink-0" />
      </div>

      {/* 3. Stats Section */}
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="text-sm text-slate-700 font-medium">{stats}</div>
        <div className="w-px h-4 bg-slate-200 shrink-0" />
      </div>

      {/* 4. Timestamp */}
      <div className="text-sm text-slate-500 whitespace-nowrap">{date}</div>

      {/* 5. Actions */}
      <div className="flex justify-end">{actions}</div>
    </div>
  );
};

// --- DATA MAPPING LOGIC SEPARATED FROM UI ---

/**
 * Maps Automation and Form data to TableRow UI pieces.
 */
const useTableRowMapper = (
  data: AutomationListItem | FormListItem,
  menuOpen: boolean,
  setMenuOpen: (o: boolean) => void,
): TableRowUIProps => {
  const isAutomation = "triggerType" in data;

  if (isAutomation) {
    const automation = data as AutomationListItem;
    return {
      title:
        automation.post?.caption ??
        automation.story?.caption ??
        automation.post?.id ??
        automation.story?.id ??
        "Untitled",
      href:
        automation.triggerType === "STORY_REPLY"
          ? `/dash/automations/dmforstories/${automation.story?.id}`
          : `/dash/automations/dmforcomments/${automation.post?.id}`,
      icon:
        automation.post?.mediaUrl || automation.story?.mediaUrl ? (
          <Image
            alt=""
            src={
              (automation.post?.mediaUrl ??
                automation.story?.mediaUrl) as string
            }
            width={100}
            height={100}
            className="rounded-md object-cover"
          />
        ) : (
          <span className="text-[10px] text-slate-400">IMG</span>
        ),
      status: (
        <StatusBadge
          status={
            automation.story &&
            Date.now() - new Date(automation.story.timestamp).getTime() >=
              24 * 60 * 60 * 1000
              ? "EXPIRED"
              : automation.status
          }
        />
      ),
      stats: automation._count.executions,
      date: automation.lastTriggeredAt
        ? new Date(automation.lastTriggeredAt).toLocaleDateString()
        : "—",
      actions: (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1.5"
            title="More actions"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <AutomationActionsMenu
              onClose={() => setMenuOpen(false)}
              fullAutomation={automation}
            />
          )}
        </div>
      ),
    };
  }

  // Map Form data
  const form = data as FormListItem;

  return {
    title: form.title || "Untitled Form",
    subtitle: form.description || "No description",
    href: `/dash/forms/${form.id}/submissions`,
    icon: <FileText size={15} className="text-slate-400" />,
    status: (
      <span
        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${FORM_STATUS_STYLES[form.status] ?? FORM_STATUS_STYLES.DRAFT}`}
      >
        {form.status}
      </span>
    ),
    stats: form.submissionCount,
    date: new Date(form.updatedAt).toLocaleDateString(),
    actions: (
      <div className="flex items-center gap-1">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="More actions"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <FormActionsMenu
              formId={form.id}
              onClose={() => setMenuOpen(false)}
              slug={form.slug}
            />
          )}
        </div>
      </div>
    ),
  };
};

/**
 * Main component that decides what to render based on input data.
 */
const TableRow = ({ data }: { data: AutomationListItem | FormListItem }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const rowProps = useTableRowMapper(data, menuOpen, setMenuOpen);

  return <TableRowUI {...rowProps} />;
};

export default TableRow;
