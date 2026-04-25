"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { Search } from "lucide-react";
import { useSearchSync } from "@/hooks/use-search-sync";
import { getHeaderConfig } from "@/configs/dash-header.config";

/**
 * Dashboard Header
 * Completely config-driven and synced with the URL search parameters via useSearchSync.
 */
function DashboardHeader() {
  const pathname = usePathname();
  const { sync, value: searchValue } = useSearchSync();
  const config = getHeaderConfig(pathname);

  // Early return for rendering ONLY (after all hooks are called)
  if (!config || config.hideHeader) return null;

  const showSearch = config.showSearch;
  const childComp = config.childComp;

  const titleSegments = pathname
    .split("/")
    .filter(Boolean)
    .map((item: string) => item.charAt(0).toUpperCase() + item.slice(1));

  const pageTitle =
    titleSegments.length > 0
      ? titleSegments[titleSegments.length - 1]
      : "Dashboard";

  return (
    <header className="hidden md:flex items-center justify-between gap-4">
      <div className="flex w-full gap-4 items-center h-10">
        <div className="h-full px-4 flex-1 bg-white rounded-lg flex items-center">
          <p className="text-sm font-bold text-[#1A1D1F]">
            {pageTitle === "Dash" ? "Dashboard" : pageTitle}
          </p>
        </div>

        {showSearch && (
          <div className="px-4 bg-white rounded-lg flex items-center gap-2 h-full">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder={`Search ${pageTitle}`}
              value={searchValue}
              onChange={(e) => sync(e.target.value)}
              className="w-full text-sm bg-transparent outline-none text-[#1A1D1F] placeholder:text-slate-400 font-semibold"
            />
          </div>
        )}

        {childComp && (
          <div className="flex items-center gap-3 h-full">{childComp}</div>
        )}
      </div>
    </header>
  );
}

export default DashboardHeader;
