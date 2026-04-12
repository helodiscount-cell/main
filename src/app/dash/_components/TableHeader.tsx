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
import { TABLE_CONFIGS, TableVariant } from "@/configs/table.config";

export type StatusFilter = "ACTIVE" | "PAUSED" | "PUBLISHED" | "DRAFT" | "ALL";
export type SortField = "count" | "date" | "newFollowers";
export type SortOrder = "asc" | "desc" | null;

interface Props {
  variant: TableVariant;
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
  sortField?: SortField;
  sortOrder?: SortOrder;
  onSort?: (field: SortField) => void;
}

export const getStatusOptions = (
  variant: TableVariant,
): { label: string; value: string }[] => {
  if (variant === "forms") {
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
  variant,
  statusFilter,
  setStatusFilter,
  sortField,
  sortOrder,
  onSort,
}: Props) => {
  const config = TABLE_CONFIGS[variant];

  return (
    <div
      className={`grid ${config.gridClass} items-center p-4 gap-4 border-b border-slate-100 m-4 bg-[#F9F9F9] rounded-lg`}
    >
      {config.columns.map((col) => {
        if (col.type === "main") {
          return (
            <span key={col.id} className="text-sm font-medium text-[#212121]">
              {col.label}
            </span>
          );
        }

        if (col.type === "status") {
          return (
            <div
              key={col.id}
              className="flex items-center justify-between gap-2"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-sm font-medium text-[#212121] hover:text-[#212121] transition-colors">
                    {statusFilter === "ALL"
                      ? "Status"
                      : getStatusOptions(variant).find(
                          (o) => o.value === statusFilter,
                        )?.label}
                    <ChevronDown size={13} className="text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[130px]">
                  <DropdownMenuRadioGroup
                    value={statusFilter}
                    onValueChange={(v) => setStatusFilter(v as StatusFilter)}
                  >
                    {getStatusOptions(variant).map((opt) => (
                      <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="w-px h-4 bg-slate-200 shrink-0" />
            </div>
          );
        }

        if (col.type === "stats" || col.type === "date") {
          const field =
            col.id === "followers"
              ? "newFollowers"
              : (col.id as "count" | "date");

          const hasSeparator = col.id !== "date";

          return (
            <div
              key={col.id}
              className="flex items-center justify-between gap-2"
            >
              <ColHeader
                label={col.label}
                sortable={col.sortable}
                sortOrder={sortField === field ? sortOrder : null}
                onSort={() => onSort?.(field)}
              />
              {hasSeparator && (
                <div className="w-px h-4 bg-slate-200 shrink-0" />
              )}
            </div>
          );
        }

        if (col.type === "actions") {
          return (
            <div
              key={col.id}
              className="p-2 bg-slate-800 text-white rounded-md w-fit justify-self-end"
            >
              <SlidersHorizontal size={14} />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default TableHeader;
