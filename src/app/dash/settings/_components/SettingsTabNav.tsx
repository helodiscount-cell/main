import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { SETTINGS_CONFIG } from "../config";
import { SettingsTab } from "../types";
import { cn } from "@/server/utils";

export async function SettingsTabNav() {
  const headerList = await headers();
  const currentUrl = headerList.get("x-url") || "";

  // Extract the tab from the URL query string
  const url = new URL(currentUrl, "http://localhost");
  const rawTab = url.searchParams.get("tab");

  const isValidTab = SETTINGS_CONFIG.TABS.some((t) => t.id === rawTab);
  const activeTab = isValidTab
    ? (rawTab as SettingsTab)
    : SETTINGS_CONFIG.DEFAULT_TAB;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full">
      <h1 className="hidden md:block text-xl font-bold text-[#071329] shrink-0">
        Setting
      </h1>
      <div className="flex flex-wrap items-center gap-2 w-full" role="tablist">
        {SETTINGS_CONFIG.TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const { Icon } = tab;

          return (
            <Link
              key={tab.id}
              href={`?tab=${tab.id}`}
              role="tab"
              aria-selected={isActive}
              className={cn(
                "flex flex-1 sm:flex-initial items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-200 font-medium text-sm sm:text-base whitespace-nowrap",
                isActive
                  ? "bg-[#F3E8FF] text-[#6A06E4]"
                  : "bg-[#F7FAFC] text-[#4A5568] hover:bg-gray-100",
              )}
            >
              <Icon
                size={18}
                className={cn(
                  "shrink-0",
                  isActive ? "text-[#6A06E4]" : "text-[#4A5568]",
                )}
              />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
