"use client";

import { ChevronDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { statsKeys } from "@/keys/react-query";
import { statsService } from "@/api/services/stats";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FollowersWidget() {
  const [range, setRange] = useState("Last 7 days");

  const { data, isLoading } = useQuery({
    queryKey: statsKeys.followersGrowth(range),
    queryFn: () => statsService.getFollowerGrowth(range),
  });

  const chartData = data?.data || [];
  const growth = data?.growth || 0;
  const isPositive = growth >= 0;

  // SVG Logic: map data points to coordinates
  const width = 300;
  const height = 120;
  const padding = 20;

  const maxVal = Math.max(
    ...chartData.map((d) => d.value),
    // Ensures a minor buffer if line is completely flat
    chartData.length > 0 ? chartData[0].value + 10 : 10,
  );
  const minVal =
    chartData.length > 0
      ? Math.max(0, Math.min(...chartData.map((d) => d.value)) - 10)
      : 0;

  const span = Math.max(maxVal - minVal, 1); // Avoid division by zero

  const points = chartData
    .map((d, i) => {
      const x =
        (i / Math.max(chartData.length - 1, 1)) * (width - padding * 2) +
        padding;
      const y =
        height - padding - ((d.value - minVal) / span) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const color = "#7C3AED"; // Brand purple

  return (
    <div className="bg-white rounded-[32px] p-7 shadow-sm border border-gray-100 flex flex-col gap-2 min-h-[380px] w-full max-w-sm">
      {/* Header section with title and range */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[#1E293B] font-bold text-xl">New Followers</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 text-[#475569] text-sm font-medium hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors outline-none cursor-pointer">
              {range}
              <ChevronDown size={14} className="text-[#94A3B8]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 bg-white">
            {["Last 7 days", "Last 30 days", "All time"].map((opt) => (
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

      {/* Main metric display */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="w-32 h-16 bg-muted animate-pulse rounded-xl" />
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-[68px] font-bold text-[#7C3AED] leading-none tracking-tight">
              {growth >= 0 ? `+${growth}` : growth}
            </span>
            {growth !== 0 && (
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  isPositive
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight size={20} />
                ) : (
                  <ArrowDownRight size={20} />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sharp-edged graph implementation */}
      <div className="relative w-full h-[120px] mt-auto mb-6">
        {/* Horizontal grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-1">
          <div className="border-t border-purple-50 w-full" />
          <div className="border-t border-purple-50 w-full" />
          <div className="border-t border-purple-100 w-full" />
        </div>

        {/* SVG Path for the line graph */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible w-full h-full relative z-10"
          preserveAspectRatio="none"
        >
          {chartData.length > 0 && (
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          )}
        </svg>

        {/* X-Axis labels */}
        <div className="absolute top-full left-0 right-0 flex justify-between mt-3 px-1 text-[#64748B] text-[11px] font-semibold">
          {chartData.length > 0 ? (
            <>
              <div className="flex flex-col items-center gap-1.5 min-w-[40px]">
                <div className="w-px h-1.5 bg-gray-200" />
                <span className="whitespace-nowrap">{chartData[0].label}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 min-w-[40px]">
                <div className="w-px h-1.5 bg-gray-200" />
                <span className="whitespace-nowrap">
                  {chartData[Math.floor(chartData.length / 2)].label}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 min-w-[40px]">
                <div className="w-px h-1.5 bg-gray-200" />
                <span className="whitespace-nowrap">
                  {chartData[chartData.length - 1].label}
                </span>
              </div>
            </>
          ) : (
            <div className="w-full text-center text-gray-400 mt-2">
              No data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
