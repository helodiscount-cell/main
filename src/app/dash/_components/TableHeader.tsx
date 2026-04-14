import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";
import React from "react";
import ColHeader from "./ColHeader";
import { TABLE_CONFIGS, TableVariant } from "@/configs/table.config";

export type StatusFilter = "ACTIVE" | "PAUSED" | "PUBLISHED" | "DRAFT" | "ALL";
export type TriggerFilter = "COMMENT" | "DM" | "STORY" | "ALL";
export type SortField = "count" | "date" | "newFollowers";
export type SortOrder = "asc" | "desc" | null;

interface BaseProps {
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
  sortField?: SortField;
  sortOrder?: SortOrder;
  onSort?: (field: SortField) => void;
}

interface AutomationProps extends BaseProps {
  variant: "automations";
  triggerFilter: TriggerFilter;
  setTriggerFilter: (value: TriggerFilter) => void;
}

interface GenericProps extends BaseProps {
  variant: Exclude<TableVariant, "automations">;
  triggerFilter?: never;
  setTriggerFilter?: never;
}

type Props = AutomationProps | GenericProps;

export const getStatusOptions = (
  variant: TableVariant,
): { label: string; value: StatusFilter }[] => {
  if (variant === "forms") {
    return [
      { label: "All Status", value: "ALL" },
      { label: "Live", value: "PUBLISHED" },
      { label: "Draft", value: "DRAFT" },
    ];
  }
  return [
    { label: "All Status", value: "ALL" },
    { label: "Live", value: "ACTIVE" },
    { label: "Paused", value: "PAUSED" },
  ];
};

export const getTriggerOptions = (): {
  label: string;
  value: TriggerFilter;
}[] => {
  return [
    { label: "All Types", value: "ALL" },
    { label: "Comment", value: "COMMENT" },
    { label: "DM", value: "DM" },
    { label: "Story", value: "STORY" },
  ];
};

const TableHeader = (props: Props) => {
  const {
    variant,
    statusFilter,
    setStatusFilter,
    sortField,
    sortOrder,
    onSort,
  } = props;
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
                <button
                  type="button"
                  aria-label="Open filters"
                  className="p-2 bg-slate-800 text-white rounded-md w-fit justify-self-end cursor-pointer hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                  <SlidersHorizontal size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[180px] p-2">
                <DropdownMenuLabel className="px-2 pb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Status
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val as StatusFilter)}
                >
                  {getStatusOptions(variant).map((opt) => (
                    <DropdownMenuRadioItem
                      key={opt.value}
                      value={opt.value}
                      className="px-2 py-2 cursor-pointer focus:bg-slate-50 transition-colors rounded-md text-sm font-medium text-slate-600 data-[state=checked]:text-slate-900 data-[state=checked]:font-semibold"
                    >
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>

                {props.variant === "automations" && (
                  <>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuLabel className="px-2 pb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Trigger Type
                    </DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={props.triggerFilter}
                      onValueChange={(val) =>
                        props.setTriggerFilter(val as TriggerFilter)
                      }
                    >
                      {getTriggerOptions().map((opt) => (
                        <DropdownMenuRadioItem
                          key={opt.value}
                          value={opt.value}
                          className="px-2 py-2 cursor-pointer focus:bg-slate-50 transition-colors rounded-md text-sm font-medium text-slate-600 data-[state=checked]:text-slate-900 data-[state=checked]:font-semibold"
                        >
                          {opt.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </>
                )}
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
