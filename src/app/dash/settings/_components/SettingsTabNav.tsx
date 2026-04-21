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
    <div className="flex items-center gap-6 w-full">
      <h1 className="text-xl font-bold text-[#071329]">Setting</h1>
      <div className="flex items-center gap-2 w-full" role="tablist">
        {SETTINGS_CONFIG.TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const { Icon } = tab;

          return (
            <Link
              key={tab.id}
              href={`?tab=${tab.id}`}
              className={cn(
                "flex flex-1 items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium",
                isActive
                  ? "bg-[#F3E8FF] text-[#6A06E4]"
                  : "bg-[#F7FAFC] text-[#4A5568] hover:bg-gray-100",
              )}
            >
              <Icon
                size={18}
                className={isActive ? "text-[#6A06E4]" : "text-[#4A5568]"}
              />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
