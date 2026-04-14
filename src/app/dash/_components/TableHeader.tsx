import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal, Check } from "lucide-react";
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
              <span className="text-sm font-medium text-[#212121]">
                {col.label}
              </span>
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
            <DropdownMenu key={col.id}>
              <DropdownMenuTrigger asChild>
                <div className="p-2 bg-slate-800 text-white rounded-md w-fit justify-self-end cursor-pointer hover:bg-slate-700 transition-colors">
                  <SlidersHorizontal size={14} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px] p-1.5">
                <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold text-slate-900">
                  Filter By
                </DropdownMenuLabel>
                {getStatusOptions(variant)
                  .filter((opt) => opt.value !== "ALL")
                  .map((opt) => {
                    const isActive = statusFilter === opt.value;
                    return (
                      <DropdownMenuItem
                        key={opt.value}
                        onSelect={() =>
                          setStatusFilter(
                            isActive ? "ALL" : (opt.value as StatusFilter),
                          )
                        }
                        className="flex items-center gap-3 px-2 py-2 cursor-pointer focus:bg-slate-50 transition-colors"
                      >
                        <div
                          className={`w-4 h-4 rounded-sm border transition-all duration-300 flex items-center justify-center ${
                            isActive
                              ? "bg-slate-900 border-slate-900 scale-110"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isActive && (
                            <Check
                              size={12}
                              className="text-white p-0.5 animate-in zoom-in-50 duration-200"
                            />
                          )}
                        </div>
                        <span
                          className={`text-sm transition-colors ${
                            isActive
                              ? "text-slate-900 font-semibold"
                              : "text-slate-600 font-medium"
                          }`}
                        >
                          {opt.label}
                        </span>
                      </DropdownMenuItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return null;
      })}
    </div>
  );
};

export default TableHeader;
