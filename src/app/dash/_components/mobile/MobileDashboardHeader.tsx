"use client";

import React from "react";
import { Search, RefreshCw, PanelLeft } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface MobileDashboardHeaderProps {
  title: string;
  onSearch?: () => void;
  onRefresh?: () => void;
}

/**
 * Mobile-specific header matching the requested dashboard design.
 * Contains: Navigation trigger, Logo, User profile, Title Box, Search, and Refresh button.
 */
export const MobileDashboardHeader = ({
  title,
  onSearch,
  onRefresh,
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
      <div className="flex items-center gap-2">
        {/* Title Box */}
        <div className="h-12 bg-white rounded-2xl px-5 flex items-center flex-1 -sm border border-slate-50">
          <span className="text-[17px] font-bold text-slate-800">{title}</span>
        </div>

        {/* Search Toggle */}
        <Button
          size="icon"
          variant="ghost"
          aria-label="Open search"
          onClick={onSearch}
          disabled={!onSearch}
          className="h-12 w-12 bg-white rounded-2xl text-slate-400 -sm border border-slate-50 hover:bg-white active:scale-95 transition-transform disabled:opacity-50"
        >
          <Search size={22} />
        </Button>

        {/* Refresh Action */}
        <Button
          size="icon"
          aria-label="Refresh"
          onClick={onRefresh}
          disabled={!onRefresh}
          className="h-12 w-12 bg-[#6A06E4] hover:bg-[#5a05c4] rounded-xl text-white -sm border-none active:scale-95 transition-transform disabled:opacity-50"
        >
          <RefreshCw size={22} />
        </Button>
      </div>
    </div>
  );
};
