"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { AutomationListItem } from "@/types/automation";
import type { FormListItem } from "@/types/form";
import { AutomationActionsMenu } from "@/components/dash/automations/AutomationActionsMenu";
import { FormActionsMenu } from "../forms/_components/FormActionsMenu";
import { mapDashboardItem } from "./useDashboardItemMapper";
import { MoreVertical } from "lucide-react";

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
  stats: React.ReactNode;
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
                  <span className="text-sm font-medium text-slate-800 group-hover:text-[#6A06E4] transition-colors truncate">
                    {title}
                  </span>
                  {subtitle && (
                    <span className="text-xs text-slate-400 truncate max-w-[260px]">
                      {subtitle}
                    </span>
                  )}
                </Link>
              ) : (
                <div className="flex flex-col gap-0.5 min-w-0 opacity-70">
                  <span className="text-sm font-medium text-slate-800 truncate">
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

        if (col.type === "status") {
          return (
            <div
              key={col.id}
              className="flex items-center justify-between gap-2 overflow-hidden"
            >
              {status}
              <div className="w-px h-4 bg-slate-200 shrink-0" />
            </div>
          );
        }

        if (col.id === "count") {
          return (
            <div
              key={col.id}
              className="flex items-center justify-between gap-2 overflow-hidden"
            >
              <div className="text-sm text-slate-700 font-medium">{stats}</div>
              <div className="w-px h-4 bg-slate-200 shrink-0" />
            </div>
          );
        }

        if (col.id === "followers") {
          return (
            <div
              key={col.id}
              className="flex items-center justify-between gap-2 overflow-hidden"
            >
              <div className="text-sm text-slate-700 font-medium whitespace-nowrap">
                {newFollowersGained}
              </div>
              <div className="w-px h-4 bg-slate-200 shrink-0" />
            </div>
          );
        }

        if (col.type === "date") {
          return (
            <div
              key={col.id}
              className="text-sm text-slate-500 whitespace-nowrap"
            >
              {date}
            </div>
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
const TableRow = ({
  data,
  variant,
}: {
  data: AutomationListItem | FormListItem;
  variant: TableVariant;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const mapped = mapDashboardItem(data);

  // Desktop-specific actions
  const actions = (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        title="More actions"
      >
        <MoreVertical size={16} />
      </button>
      {menuOpen &&
        ("triggerType" in data ? (
          <AutomationActionsMenu
            onClose={() => setMenuOpen(false)}
            fullAutomation={data as AutomationListItem}
          />
        ) : (
          <FormActionsMenu
            formId={data.id}
            onClose={() => setMenuOpen(false)}
            slug={(data as FormListItem).slug}
          />
        ))}
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
