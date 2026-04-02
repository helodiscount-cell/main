"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SETTINGS_CONFIG } from "../config";
import { SettingsTab } from "../types";
import { cn } from "@/server/utils";

export function SettingsTabNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab =
    (searchParams.get("tab") as SettingsTab) || SETTINGS_CONFIG.DEFAULT_TAB;

  const handleTabChange = (tab: SettingsTab) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-6">
      <h1 className="text-2xl font-bold text-[#1A202C] mr-8">Setting</h1>
      <div className="flex items-center gap-2">
        {SETTINGS_CONFIG.TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const { Icon } = tab;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium",
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
