"use client";

import React from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { MobileDashboardHeader } from "./MobileDashboardHeader";
import { MobileCard } from "./MobileCard";
import { DashboardItem } from "../mapDashboardItem";
import { Spinner } from "@/components/ui/spinner";

interface MobilePageLayoutProps {
  title: string;
  items: DashboardItem[];
  isLoading: boolean;
  emptyMessage: string;
  actionButton?: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSortChange?: (sortKey: string) => void;
  sortOrder?: "asc" | "desc" | null;
  onFilterToggle?: () => void;
  filterMenu?: React.ReactNode;
}

/**
 * Mobile-specific layout for dashboard pages (Forms/Automations).
 * Handles the overall structure, scrollable content, and fixed bottom actions.
 */
export const MobilePageLayout = ({
  title,
  items,
  isLoading,
  emptyMessage,
  actionButton,
  searchValue,
  onSearchChange,
  onSortChange,
  sortOrder = "desc",
  onFilterToggle,
  filterMenu,
}: MobilePageLayoutProps) => {
  return (
    <div className="flex flex-col gap-4 h-screen overflow-hidden relative">
      <MobileDashboardHeader
        title={title}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
      />

      {/* Main Content Area */}
      <div className="flex flex-col gap-4 flex-1 overflow-y-auto bg-[#f1f1f1]">
        {/* Sort/Filter Bar */}
        {(onSortChange || onFilterToggle) && (
          <div className="flex items-center justify-between">
            {onSortChange && (
              <button
                onClick={() => onSortChange?.("createdAt")}
                className="flex items-center gap-1.5 text-[#212121] font-semibold text-sm active:opacity-50 transition-opacity"
                aria-label="Change sort order"
              >
                Last Published
                {sortOrder === "desc" ? (
                  <ChevronDown size={16} className="text-[#212121]" />
                ) : (
                  <ChevronUp size={16} className="text-[#212121]" />
                )}
              </button>
            )}
            {filterMenu
              ? filterMenu
              : onFilterToggle && (
                  <button
                    onClick={onFilterToggle}
                    className="p-2 bg-slate-800 text-white rounded-lg active:scale-95 transition-transform"
                    aria-label="Toggle filters"
                  >
                    <SlidersHorizontal size={16} />
                  </button>
                )}
          </div>
        )}
        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-sm text-slate-400">
            <Spinner className="text-[#6A06E4] size-5" strokeWidth={2.5} />
            Loading {title.toLowerCase()}...
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
            <p className="text-sm font-medium">{emptyMessage}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <MobileCard key={item.id} data={item} />
            ))}
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Button */}
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};
