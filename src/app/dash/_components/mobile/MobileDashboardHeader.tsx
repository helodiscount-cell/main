"use client";

import React from "react";
import { Search, PanelLeft } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

interface MobileDashboardHeaderProps {
  title: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

/**
 * Mobile-specific header matching the requested dashboard design.
 * Contains: Navigation trigger, Logo, User profile, Title Box, Search, and Refresh button.
 */
export const MobileDashboardHeader = ({
  title,
  searchValue = "",
  onSearchChange,
}: MobileDashboardHeaderProps) => {
  return (
    <div className="flex flex-col gap-6 px-5 py-6 bg-[#f1f1f1]">
      {/* Top Bar: Nav + Logo + Profile */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-2 text-slate-800 scale-125">
            <PanelLeft size={24} />
          </SidebarTrigger>
          <span className="text-2xl font-semibold text-[#6A06E4] tracking-tight">
            Dmbroo
          </span>
        </div>
        <div className="rounded-full overflow-hidden scale-110">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center gap-3">
        {/* Title Box */}
        <div className="h-12 bg-white rounded-2xl px-5 flex items-center shrink-0 border border-slate-50">
          <span className="text-[17px] font-bold text-slate-800 whitespace-nowrap">
            {title}
          </span>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6A06E4] transition-colors">
            <Search size={18} />
          </div>
          <Input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="h-12 w-full pl-11 pr-4 bg-white rounded-2xl border-slate-50 border outline-none focus-visible:ring-1 focus-visible:ring-purple-200 text-slate-800 text-[15px] font-medium placeholder:text-slate-400 transition-all"
          />
        </div>
      </div>
    </div>
  );
};
