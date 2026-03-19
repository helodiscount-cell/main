import { ColHeader } from "@/components/dash/automations/ColHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import React from "react";

export type StatusFilter = "ACTIVE" | "PAUSED" | "ALL";
interface Props {
  title: string;
  selectedLabel: string;
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
}

export const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Live", value: "ACTIVE" },
  { label: "Paused", value: "PAUSED" },
];

export const TableHeader = ({
  title,
  selectedLabel,
  statusFilter,
  setStatusFilter,
}: Props) => {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center px-4 py-3 gap-4 border-b border-slate-100">
      <span className="text-sm font-medium text-slate-700">{title}</span>

      {/* Status column with filter dropdown */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
              {selectedLabel === "All" ? "Status" : selectedLabel}
              <ChevronDown size={13} className="text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[130px]">
            <DropdownMenuRadioGroup
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as StatusFilter)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                  {opt.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="w-px h-4 bg-slate-200" />
      </div>

      <ColHeader label="Runs" />
      <ColHeader label="Last Triggered" />
      <SlidersHorizontal size={14} />
    </div>
  );
};
