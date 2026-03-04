"use client";

import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { statsService } from "@/api/services/stats";
import { statsKeys } from "@/keys/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function OutreachImpactWidget() {
  const options = ["Last 7 days", "Last 30 days", "All time"];
  const [range, setRange] = useState(options[0]);

  // Use react-query for data fetching
  const { data, isLoading } = useQuery({
    queryKey: statsKeys.outreachImpact(range),
    queryFn: () => statsService.getOutreachImpact(range),
  });

  const count = data?.count ?? 0;

  return (
    <div className="bg-white rounded-[32px] p-7 shadow-sm border border-gray-100 flex flex-col gap-2 min-h-[380px] w-full max-w-sm">
      {/* Header with dynamic selector */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[#1E293B] font-bold text-xl">Outreach Impact</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 text-[#475569] text-sm font-medium hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors outline-none cursor-pointer">
              {range}
              <ChevronDown size={14} className="text-[#94A3B8]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white">
            {options.map((opt) => (
              <DropdownMenuItem
                key={opt}
                className="cursor-pointer"
                onClick={() => setRange(opt)}
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Metric Display */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="w-32 h-16 bg-muted animate-pulse rounded-xl" />
        ) : (
          <span className="text-[68px] font-bold text-[#7C3AED] leading-none tracking-tight">
            {count ?? 0}
          </span>
        )}
      </div>

      {/* Visual Chart - Using static peaks to maintain UI aesthetics */}
      <div className="relative w-full h-[120px] mt-auto mb-6">
        <div className="absolute inset-0 flex flex-col justify-between py-1">
          <div className="border-t border-purple-50 w-full" />
          <div className="border-t border-purple-50 w-full" />
          <div className="border-t border-purple-100 w-full" />
        </div>

        <svg
          viewBox="0 0 300 120"
          className="overflow-visible w-full h-full relative z-10"
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke="#7C3AED"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="20,80 40,40 60,40 80,100 120,40 180,40 220,100 240,60 270,60 280,100"
          />
        </svg>

        {/* Dynamic labels could go here, but kept simple for now */}
        <div className="absolute top-full left-0 right-0 flex justify-between mt-3 px-1 text-[#64748B] text-[11px] font-semibold">
          {/* Static markers for visual consistency */}
          <div className="flex flex-col items-center gap-1.5 min-w-[40px]">
            <div className="w-px h-1.5 bg-gray-200" />
            <span className="whitespace-nowrap">Start</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 min-w-[40px]">
            <div className="w-px h-1.5 bg-gray-200" />
            <span className="whitespace-nowrap">Trend</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 min-w-[40px]">
            <div className="w-px h-1.5 bg-gray-200" />
            <span className="whitespace-nowrap">End</span>
          </div>
        </div>
      </div>
    </div>
  );
}
