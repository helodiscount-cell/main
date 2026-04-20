"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getHeaderConfig } from "@/configs/dashboard-header.config";
import { Search } from "lucide-react";

/**
 * Dashboard Header
 * Completely config-driven and synced with the URL search parameters.
 */
function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const config = getHeaderConfig(pathname);

  // Hooks must be called unconditionally at the top
  const urlSearchVal = searchParams.get("q") ?? "";
  const [localSearchValue, setLocalSearchValue] = useState(urlSearchVal);

  // Sync search value to URL with a native debounce to avoid library overhead
  useEffect(() => {
    if (!config || config.hideHeader) return;

    // Skip sync if the value hasn't changed from the URL to avoid redundant triggers
    if (localSearchValue === urlSearchVal) return;

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (localSearchValue) {
        params.set("q", localSearchValue);
      } else {
        params.delete("q");
      }
      // Use replace during active typing to avoid bloating the history stack
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [localSearchValue, pathname, router, searchParams, config, urlSearchVal]);

  // Handle URL change (e.g. back button)
  useEffect(() => {
    setLocalSearchValue(urlSearchVal);
  }, [urlSearchVal]);

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
    <header className="flex items-center justify-between gap-4">
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
              value={localSearchValue}
              onChange={(e) => setLocalSearchValue(e.target.value)}
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
