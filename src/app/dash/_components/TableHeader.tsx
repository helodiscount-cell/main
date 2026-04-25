import { SlidersHorizontal } from "lucide-react";
import React from "react";
import ColHeader from "./ColHeader";
import { TABLE_CONFIGS, TableVariant } from "@/configs/table.config";

import {
  TableFilterMenu,
  StatusFilterMap,
  TriggerFilter,
} from "./TableFilterMenu";

export type SortField = "count" | "date" | "newFollowers";
export type SortOrder = "asc" | "desc" | null;

interface BaseProps<V extends TableVariant> {
  statusFilter: StatusFilterMap[V] | "ALL";
  setStatusFilter: (value: StatusFilterMap[V] | "ALL") => void;
  sortField?: SortField;
  sortOrder?: SortOrder;
  onSort?: (field: SortField) => void;
}

interface AutomationProps extends BaseProps<"automations"> {
  variant: "automations";
  triggerFilter: TriggerFilter;
  setTriggerFilter: (value: TriggerFilter) => void;
}

interface GenericProps<
  V extends Exclude<TableVariant, "automations">,
> extends BaseProps<V> {
  variant: V;
  triggerFilter?: never;
  setTriggerFilter?: never;
}

type Props = AutomationProps | GenericProps<"forms"> | GenericProps<"contacts">;

const TableHeader = (props: Props) => {
  const { variant } = props;
  const config = TABLE_CONFIGS[variant];

  type TableColumn = (typeof TABLE_CONFIGS)[TableVariant]["columns"][number];

  return (
    <div
      className={`grid ${config.gridClass} hidden md:grid items-center p-4 gap-4 border-b border-slate-100 m-4 bg-[#F9F9F9] rounded-lg`}
    >
      {config.columns.map((col: TableColumn) => {
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
              sortable={"sortable" in col ? !!col.sortable : false}
              sortOrder={props.sortField === field ? props.sortOrder : null}
              onSort={() => props.onSort?.(field)}
            />
          );
        }

        if (col.type === "actions") {
          if (props.variant === "automations") {
            return (
              <TableFilterMenu
                key={col.id}
                variant="automations"
                statusFilter={props.statusFilter}
                onStatusChange={props.setStatusFilter}
                triggerFilter={props.triggerFilter}
                onTriggerChange={props.setTriggerFilter}
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
          if (props.variant === "forms") {
            return (
              <TableFilterMenu
                key={col.id}
                variant="forms"
                statusFilter={props.statusFilter}
                onStatusChange={props.setStatusFilter}
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
          if (props.variant === "contacts") {
            return (
              <TableFilterMenu
                key={col.id}
                variant="contacts"
                statusFilter={props.statusFilter}
                onStatusChange={props.setStatusFilter}
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
        }

        return null;
      })}
    </div>
  );
};

export default TableHeader;
