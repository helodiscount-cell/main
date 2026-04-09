import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import React from "react";
import ColHeader from "./ColHeader";

export type StatusFilter = "ACTIVE" | "PAUSED" | "PUBLISHED" | "DRAFT" | "ALL";
export type SortField = "count" | "date";
export type SortOrder = "asc" | "desc" | null;

interface Props {
  title: string;
  selectedLabel: string;
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
  sortField?: SortField;
  sortOrder?: SortOrder;
  onSort?: (field: SortField) => void;
}

export const getStatusOptions = (
  title: string,
): { label: string; value: string }[] => {
  if (title === "Forms") {
    return [
      { label: "All", value: "ALL" },
      { label: "Live", value: "PUBLISHED" },
      { label: "Draft", value: "DRAFT" },
    ];
  }
  return [
    { label: "All", value: "ALL" },
    { label: "Live", value: "ACTIVE" },
    { label: "Paused", value: "PAUSED" },
  ];
};

const TableHeader = ({
  title,
  selectedLabel,
  statusFilter,
  setStatusFilter,
  sortField,
  sortOrder,
  onSort,
}: Props) => {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center p-4 gap-4 border-b border-slate-100 m-4 bg-[#F9F9F9] rounded-lg">
      <span className="text-sm font-medium text-[#212121]">{title}</span>

      {/* Status column with filter dropdown */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 text-sm font-medium text-[#212121] hover:text-[#212121] transition-colors">
              {statusFilter === "ALL"
                ? "Status"
                : getStatusOptions(title).find((o) => o.value === statusFilter)
                    ?.label}
              <ChevronDown size={13} className="text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[130px]">
            <DropdownMenuRadioGroup
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as StatusFilter)}
            >
              {getStatusOptions(title).map((opt) => (
                <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                  {opt.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="w-px h-4 bg-slate-200" />
      </div>

      <ColHeader
        label={title === "Forms" ? "Submissions" : "Runs"}
        sortable
        sortOrder={sortField === "count" ? sortOrder : null}
        onSort={() => onSort?.("count")}
      />
      <ColHeader
        label={title === "Forms" ? "Last Updated" : "Last Triggered"}
        sortable
        sortOrder={sortField === "date" ? sortOrder : null}
        onSort={() => onSort?.("date")}
      />
      <button className="p-2 bg-slate-800 text-white rounded-md">
        <SlidersHorizontal size={14} />
      </button>
    </div>
  );
};

export default TableHeader;
