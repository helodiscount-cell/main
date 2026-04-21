"use client";

import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { TableVariant } from "@/configs/table.config";
import TableHeader, {
  StatusFilter,
  TriggerFilter,
  SortField,
  SortOrder,
} from "./TableHeader";
import Pagination from "./Pagination";

interface TablePageLayoutBaseProps<T extends { id: string }> {
  isLoading: boolean;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  items: T[];
  renderRow: (item: T) => React.ReactNode;
  emptyState: {
    message: string;
    icon?: React.ReactNode;
  };
  // Props for TableHeader
  statusFilter: StatusFilter;
  handleStatusChange: (val: StatusFilter) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  handleSort: (field: SortField) => void;
}

interface AutomationTableLayoutProps<
  T extends { id: string },
> extends TablePageLayoutBaseProps<T> {
  variant: "automations";
  triggerFilter: TriggerFilter;
  handleTriggerChange: (val: TriggerFilter) => void;
}

interface GenericTableLayoutProps<
  T extends { id: string },
> extends TablePageLayoutBaseProps<T> {
  variant: Exclude<TableVariant, "automations">;
  triggerFilter?: never;
  handleTriggerChange?: never;
}

type TablePageLayoutProps<T extends { id: string }> =
  | AutomationTableLayoutProps<T>
  | GenericTableLayoutProps<T>;

/**
 * Premium Unified Table Skeleton
 * Combines TableHeader, Rows, Loading states, and Pagination into a single cohesive layout.
 */
export default function TablePageLayout<T extends { id: string }>(
  props: TablePageLayoutProps<T>,
) {
  const {
    variant,
    isLoading,
    totalItems,
    currentPage,
    pageSize,
    onPageChange,
    items,
    renderRow,
    emptyState,
    statusFilter,
    handleStatusChange,
    sortField,
    sortOrder,
    handleSort,
  } = props;

  return (
    <div className="flex flex-col flex-1 gap-4 overflow-hidden">
      <div className="bg-white rounded-xl overflow-hidden flex-1 border border-slate-50 flex flex-col shadow-sm">
        {/* Unified Header */}
        {props.variant === "automations" ? (
          <TableHeader
            variant="automations"
            statusFilter={statusFilter}
            setStatusFilter={handleStatusChange}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            triggerFilter={props.triggerFilter}
            setTriggerFilter={props.handleTriggerChange}
          />
        ) : (
          <TableHeader
            variant={props.variant}
            statusFilter={statusFilter}
            setStatusFilter={handleStatusChange}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        )}

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-sm text-slate-400">
              <Spinner className="text-[#6A06E4] size-6" strokeWidth={2.5} />
              <p className="font-medium animate-pulse">Loading {variant}...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
              <div className="p-4 bg-slate-50 rounded-full scale-110">
                {emptyState.icon || (
                  <span className="text-4xl text-slate-300">📋</span>
                )}
              </div>
              <p className="text-sm font-medium">{emptyState.message}</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {items.map((item) => (
                <React.Fragment key={item.id}>{renderRow(item)}</React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Premium Pagination Footer */}
        {totalItems > pageSize && (
          <div className="border-t border-slate-50 px-6 py-4 bg-slate-50/40 mt-auto">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
