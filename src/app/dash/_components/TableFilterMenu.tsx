"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { TableVariant } from "@/configs/table.config";

export type StatusFilter =
  | "ACTIVE"
  | "STOPPED"
  | "EXPIRED"
  | "PUBLISHED"
  | "DRAFT"
  | "POST"
  | "REEL"
  | "STORY"
  | "ALL";

export type TriggerFilter = "COMMENT" | "DM" | "STORY" | "ALL";

export const getStatusOptions = (
  variant: TableVariant,
): { label: string; value: Exclude<StatusFilter, "ALL"> }[] => {
  if (variant === "forms") {
    return [
      { label: "Live", value: "PUBLISHED" },
      { label: "Draft", value: "DRAFT" },
    ];
  }
  if (variant === "contacts") {
    return [
      { label: "Post", value: "POST" },
      { label: "Reel", value: "REEL" },
      { label: "Story", value: "STORY" },
    ];
  }
  return [
    { label: "Live", value: "ACTIVE" },
    { label: "Stopped", value: "STOPPED" },
    { label: "Expired", value: "EXPIRED" },
  ];
};

export const getTriggerOptions = (): {
  label: string;
  value: Exclude<TriggerFilter, "ALL">;
}[] => {
  return [
    { label: "Comment", value: "COMMENT" },
    { label: "DM", value: "DM" },
    { label: "Story", value: "STORY" },
  ];
};

interface TableFilterMenuProps {
  variant: TableVariant;
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  triggerFilter?: TriggerFilter;
  onTriggerChange?: (trigger: TriggerFilter) => void;
  children: React.ReactNode;
}

/**
 * Reusable filter menu for dashboard tables (Desktop and Mobile).
 */
export const TableFilterMenu = ({
  variant,
  statusFilter,
  onStatusChange,
  triggerFilter,
  onTriggerChange,
  children,
}: TableFilterMenuProps) => {
  const toggleStatus = (val: Exclude<StatusFilter, "ALL">) => {
    onStatusChange(statusFilter === val ? "ALL" : val);
  };

  const toggleTrigger = (val: Exclude<TriggerFilter, "ALL">) => {
    if (variant === "automations" && onTriggerChange) {
      onTriggerChange(triggerFilter === val ? "ALL" : val);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[150px] p-1.5 rounded-2xl bg-white border border-slate-100 shadow-xl"
      >
        <DropdownMenuLabel className="px-3 pt-2 pb-1 text-sm font-medium text-slate-900 border-b border-slate-50 mb-1">
          Filter By
        </DropdownMenuLabel>

        {/* Trigger Filters (Specific to Automations) */}
        {variant === "automations" &&
          getTriggerOptions().map((opt) => (
            <DropdownMenuCheckboxItem
              key={opt.value}
              checked={triggerFilter === opt.value}
              onCheckedChange={() => toggleTrigger(opt.value)}
              className="cursor-pointer font-medium text-slate-500 data-[state=checked]:text-[#6A06E4]"
            >
              {opt.label}
            </DropdownMenuCheckboxItem>
          ))}

        {/* Status Filters */}
        {getStatusOptions(variant).map((opt) => (
          <DropdownMenuCheckboxItem
            key={opt.value}
            checked={statusFilter === opt.value}
            onCheckedChange={() => toggleStatus(opt.value)}
            className="cursor-pointer font-medium text-slate-500 data-[state=checked]:text-[#6A06E4]"
          >
            {opt.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
