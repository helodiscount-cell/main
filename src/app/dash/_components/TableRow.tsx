"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { AutomationListItem } from "@/types/automation";
import type { FormListItem } from "@/types/form";
import type { Contact } from "@/types/contact";
import { AutomationActionsMenu } from "@/components/dash/automations/AutomationActionsMenu";
import { FormActionsMenu } from "../forms/_components/FormActionsMenu";
import { MoreVertical, Copy } from "lucide-react";
import { toast } from "sonner";
import mapDashboardItem, { DashboardItem } from "./mapDashboardItem";
import { TABLE_CONFIGS, TableVariant } from "@/configs/table.config";

/**
 * Props for the dumb UI component.
 */
export interface TableRowUIProps {
  variant: TableVariant;
  icon: React.ReactNode;
  title: string;
  subtitle?: string | React.ReactNode;
  href: string | null;
  status: React.ReactNode;
  stats: string | number;
  date: React.ReactNode;
  actions: React.ReactNode;
  className?: string;
  newFollowersGained: number;
}

/**
 * Purely presentational component that renders the table row structure.
 */
const TableRowUI = ({
  variant,
  icon,
  title,
  subtitle,
  href,
  status,
  stats,
  date,
  actions,
  className = "",
  newFollowersGained,
}: TableRowUIProps) => {
  const config = TABLE_CONFIGS[variant];

  return (
    <div
      className={`grid ${config.gridClass} items-center px-8 py-4 gap-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors group/row ${className}`}
    >
      {config.columns.map((col) => {
        const colId = col.id as string;

        if (col.type === "main") {
          return (
            <div key={col.id} className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-md bg-slate-50 shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                {icon}
              </div>
              {href ? (
                <Link
                  href={href}
                  className="flex flex-col gap-0.5 group min-w-0"
                >
                  <span className="text-[16px] font-medium text-slate-800 group-hover:text-[#6A06E4] transition-colors truncate">
                    {title}
                  </span>
                  {subtitle && (
                    <span className="text-xs text-slate-400 truncate max-w-[260px]">
                      {subtitle}
                    </span>
                  )}
                </Link>
              ) : (
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[16px] font-medium text-slate-800 truncate">
                    {title}
                  </span>
                  {subtitle && (
                    <span className="text-xs text-slate-400 truncate max-w-[260px]">
                      {subtitle}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        }

        if (col.type === "info" && !(col as { sortable?: boolean }).sortable) {
          let content: React.ReactNode = stats;
          if (colId === "type") content = status;
          if (colId === "followers") content = newFollowersGained;

          return (
            <span
              key={colId}
              className="text-center text-[16px] font-medium text-[#212121] truncate"
            >
              {content}
            </span>
          );
        }

        if (col.type === "status") {
          return (
            <div
              key={col.id}
              className="flex items-center justify-center gap-2 overflow-hidden"
            >
              {status}
            </div>
          );
        }

        if (col.type === "date") {
          return (
            <span
              key={col.id}
              className="text-center text-sm text-slate-500 whitespace-nowrap"
            >
              {date}
            </span>
          );
        }

        if (col.type === "actions") {
          return (
            <div key={col.id} className="flex justify-end">
              {actions}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

/**
 * Maps Automation and Form data to TableRow UI pieces.
 */
/**
 * Main component that decides what to render based on input data.
 * Refactored to use a shared mapper for consistency with mobile views.
 */
type TableRowProps =
  | { variant: "forms"; data: FormListItem }
  | { variant: "automations"; data: AutomationListItem }
  | { variant: "contacts"; data: Contact };

const TableRow = ({ data, variant }: TableRowProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const mapped = mapDashboardItem(data);

  const isForm = variant === "forms";
  const isAutomation = variant === "automations";

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (variant !== "forms") return;
    const slug = data.slug;
    if (!slug) return;

    const url = `${window.location.origin}/f/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy to clipboard.");
    }
  };

  const slug = isForm ? data.slug : undefined;

  const actions = (
    <div className="relative flex items-center gap-2 justify-end">
      {isForm && (
        <button
          onClick={copyToClipboard}
          disabled={!slug}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[#6A06E5] hover:bg-purple-50 transition-colors text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Copy size={14} />
          Copy
        </button>
      )}

      {(isForm || isAutomation) && (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
            title="More actions"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen &&
            (variant === "automations" ? (
              <AutomationActionsMenu
                onClose={() => setMenuOpen(false)}
                fullAutomation={data}
              />
            ) : variant === "forms" ? (
              <FormActionsMenu
                formId={data.id}
                onClose={() => setMenuOpen(false)}
                slug={data.slug}
              />
            ) : null)}
        </div>
      )}
    </div>
  );

  return (
    <TableRowUI
      variant={variant}
      icon={mapped.image}
      title={mapped.title}
      subtitle={mapped.subtitle}
      href={mapped.href}
      status={mapped.status}
      stats={mapped.stats}
      newFollowersGained={mapped.newFollowersGained || 0}
      date={mapped.date}
      actions={actions}
    />
  );
};

export default TableRow;
