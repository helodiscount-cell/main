import { SlidersHorizontal } from "lucide-react";
import React from "react";
import ColHeader from "./ColHeader";
import { TABLE_CONFIGS, TableVariant } from "@/configs/table.config";

import {
  StatusFilter,
  TriggerFilter,
  TableFilterMenu,
} from "./TableFilterMenu";

export type { StatusFilter, TriggerFilter };
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
      {config.columns.map((col: any) => {
        if (col.type === "main") {
          return (
            <span
              key={col.id}
              className="text-[16px] font-medium text-[#212121]"
            >
              {col.label}
            </span>
          );
        }

        if (col.type === "info" && !(col as { sortable?: boolean }).sortable) {
          return (
            <span
              key={col.id}
              className="text-center text-[16px] font-medium text-[#212121]"
            >
              {col.label}
            </span>
          );
        }

        if (col.type === "status") {
          return (
            <span
              key={col.id}
              className="text-center text-[16px] font-medium text-[#212121]"
            >
              {col.label}
            </span>
          );
        }

        if (col.type === "info" || col.type === "date") {
          const field =
            (col.id as string) === "followers"
              ? "newFollowers"
              : (col.id as "count" | "date");

          return (
            <ColHeader
              key={col.id}
              label={col.label}
              sortable={(col as any).sortable}
              sortOrder={sortField === field ? sortOrder : null}
              onSort={() => onSort?.(field)}
            />
          );
        }

        if (col.type === "actions") {
          return (
            <TableFilterMenu
              key={col.id}
              variant={variant}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              triggerFilter={props.triggerFilter}
              onTriggerChange={
                props.variant === "automations"
                  ? props.setTriggerFilter
                  : undefined
              }
            >
              <button
                type="button"
                aria-label="Open filters"
                className="p-2 bg-slate-800 text-white rounded-md w-fit justify-self-end cursor-pointer hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                <SlidersHorizontal size={14} />
              </button>
            </TableFilterMenu>
          );
        }

        return null;
      })}
    </div>
  );
};

export default TableHeader;
