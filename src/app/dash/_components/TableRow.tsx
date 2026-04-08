"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { AutomationListItem } from "@/types/automation";
import type { FormListItem } from "@/types/form";
import { AutomationActionsMenu } from "@/components/dash/automations/AutomationActionsMenu";
import { FormActionsMenu } from "../forms/_components/FormActionsMenu";
import { mapDashboardItem } from "./useDashboardItemMapper";
import { MoreVertical } from "lucide-react";

/**
 * Props for the dumb UI component.
 */
export interface TableRowUIProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string | React.ReactNode;
  href: string | null;
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
      className={`grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center px-8 py-4 gap-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors group/row ${className}`}
    >
      {/* 1. Icon + Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-md bg-slate-50 shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
          {icon}
        </div>
        {href ? (
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
/**
 * Main component that decides what to render based on input data.
 * Refactored to use a shared mapper for consistency with mobile views.
 */
const TableRow = ({ data }: { data: AutomationListItem | FormListItem }) => {
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
      icon={mapped.image}
      title={mapped.title}
      subtitle={mapped.subtitle}
      href={mapped.href}
      status={mapped.status}
      stats={mapped.stats}
      date={mapped.date}
      actions={actions}
    />
  );
};

export default TableRow;
