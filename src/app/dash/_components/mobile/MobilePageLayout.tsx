"use client";

import React from "react";
import { SlidersHorizontal, ChevronDown, MessageCircle } from "lucide-react";
import { MobileDashboardHeader } from "./MobileDashboardHeader";
import { MobileCard } from "./MobileCard";
import { AutomationListItem } from "@/types/automation";
import { FormListItem } from "@/types/form";

interface MobilePageLayoutProps {
  title: string;
  items: (AutomationListItem | FormListItem)[];
  isLoading: boolean;
  emptyMessage: string;
  actionButton: React.ReactNode;
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
}: MobilePageLayoutProps) => {
  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA] pb-[100px] overflow-hidden relative">
      <MobileDashboardHeader title={title} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-5">
        {/* Sort/Filter Bar */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <button className="flex items-center gap-1.5 text-[#212121] font-semibold text-sm">
            Last Published
            <ChevronDown size={16} className="text-[#212121]" />
          </button>
          <button className="p-2 bg-slate-800 text-white rounded-lg">
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-sm text-slate-400">
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
