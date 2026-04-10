"use client";

import React from "react";
import { SlidersHorizontal, ChevronDown, MessageCircle } from "lucide-react";
import { MobileDashboardHeader } from "./MobileDashboardHeader";
import { MobileCard } from "./MobileCard";
import { AutomationListItem } from "@/types/automation";
import { FormListItem } from "@/types/form";
import { Spinner } from "@/components/ui/spinner";

interface MobilePageLayoutProps {
  title: string;
  items: (AutomationListItem | FormListItem)[];
  isLoading: boolean;
  emptyMessage: string;
  actionButton: React.ReactNode;
  onSortChange?: (sortKey: string) => void;
  onFilterToggle?: () => void;
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
  onSortChange,
  onFilterToggle,
}: MobilePageLayoutProps) => {
  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA] pb-[100px] overflow-hidden relative">
      <MobileDashboardHeader title={title} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-5 bg-[#f1f1f1]">
        {/* Sort/Filter Bar */}
        {(onSortChange || onFilterToggle) && (
          <div className="flex items-center justify-between mb-4 mt-2">
            {onSortChange && (
              <button
                onClick={() => onSortChange?.("createdAt")}
                className="flex items-center gap-1.5 text-[#212121] font-semibold text-sm active:opacity-50 transition-opacity"
                aria-label="Change sort order"
              >
                Last Published
                <ChevronDown size={16} className="text-[#212121]" />
              </button>
            )}
            {onFilterToggle && (
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
          <div className="flex flex-col pb-6">
            {items.map((item) => (
              <MobileCard key={item.id} data={item} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Chat Icon (Static for UI) */}
      <div className="absolute right-6 bottom-[110px] z-20">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#6A06E4] border border-slate-100">
          <MessageCircle size={24} />
        </div>
      </div>

      {/* Sticky Bottom Action Button */}
      <div className="absolute bottom-0 inset-x-0 p-5 bg-[#FAFAFA] z-30">
        <div className="w-full">{actionButton}</div>
      </div>
    </div>
  );
};
