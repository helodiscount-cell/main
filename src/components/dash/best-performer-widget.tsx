"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { statsService } from "@/api/services/stats";
import { statsKeys } from "@/keys/react-query";

export interface BestPerformerStats {
  id: string;
  date: string;
  value: number;
  imageUrl: string;
}

export interface BestTimeStats {
  imageUrl: string;
  fullDate: string;
  day: string;
  timeWindow: string;
}

export interface BestPerformerWidgetConfig {
  title: string;
  dropdownOptions: string[];
  chartData: BestPerformerStats[];
  bestTimeData: BestTimeStats;
}

export interface BestPerformerWidgetProps {
  className?: string;
}

export function BestPerformerWidget({
  className = "",
}: BestPerformerWidgetProps) {
  const options = ["Last 7 days", "Last 30 days", "All time"];
  const [range, setRange] = useState(options[0]);

  const { data: config, isLoading } = useQuery({
    queryKey: statsKeys.bestPerformer(range),
    queryFn: () => statsService.getBestPerformerStats(range),
  });

  // Chart calculations
  const chartData = config?.chartData || [];
  const maxValue =
    chartData.length > 0
      ? Math.max(...chartData.map((d: any) => d.value), 10)
      : 10;

  return (
    <div
      className={`bg-white rounded-[32px] p-7 shadow-sm border border-gray-100 flex flex-col gap-6 w-full min-h-[380px] ${className}`}
    >
      {/* Header section with title and range */}
      <div className="flex justify-between items-center">
        <h3 className="text-[#1E293B] font-bold text-xl">Best Performer</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 text-[#475569] text-sm font-medium hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors outline-none cursor-pointer">
              {range}
              <ChevronDown size={14} className="text-[#94A3B8]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
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

      {isLoading || !config ? (
        <div className="flex-1 flex items-center justify-center h-full">
          <div className="w-full h-full min-h-[200px] bg-muted animate-pulse rounded-2xl" />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 items-stretch h-full">
          {/* Left Column: Bar Chart */}
          <div className="flex-1 flex flex-col justify-end relative pt-12 pb-8">
            {/* Horizontal grid lines */}
            <div className="absolute inset-x-0 top-12 bottom-[44px] flex flex-col justify-between py-1 z-0 pointer-events-none">
              <div className="border-t border-purple-50 w-full" />
              <div className="border-t border-purple-50 w-full" />
              <div className="border-t border-purple-50 w-full" />
            </div>

            <div className="flex justify-around items-end h-[180px] relative z-10 w-full px-4">
              {chartData.map((data: BestPerformerStats) => {
                const heightPercent = (data.value / maxValue) * 100;
                return (
                  <div
                    key={data.id}
                    className="flex flex-col items-center justify-end h-full relative group"
                  >
                    {/* Image hovering over bar */}
                    <div
                      className="absolute w-[36px] h-[36px] rounded-lg overflow-hidden shadow-sm transition-transform duration-300 group-hover:-translate-y-1"
                      style={{
                        bottom: `calc(${heightPercent}% + 8px)`,
                      }}
                    >
                      <Image
                        src={data.imageUrl}
                        alt="Post thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Bar */}
                    <div
                      className="w-[40px] bg-[#7C3AED] rounded-t-lg transition-all duration-500 ease-in-out"
                      style={{ height: `${heightPercent}%` }}
                    />

                    {/* X-Axis labels */}
                    <div className="absolute -bottom-[32px] flex flex-col items-center gap-1.5 w-full">
                      <div className="w-px h-1.5 bg-gray-300" />
                      <span className="text-[#64748B] text-[11px] font-semibold whitespace-nowrap">
                        {data.date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Best Time To Post */}
          {config?.bestTimeData && (
            <div className="w-full md:w-[280px] bg-[#F8FAFC] rounded-[24px] p-6 flex flex-col items-center justify-center text-center gap-3 border border-gray-50 flex-shrink-0 relative">
              <h4 className="text-[#1E293B] font-medium text-base mb-1">
                Best Time To Post
              </h4>

              <div className="w-[120px] h-[120px] rounded-[16px] overflow-hidden shadow-sm relative mb-2">
                <Image
                  src={config.bestTimeData.imageUrl}
                  alt="Best performing post"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-[#7C3AED] font-medium text-sm">
                  {config.bestTimeData.fullDate}
                </span>
                <span className="text-[#94A3B8] text-[10px]">-</span>
                <span className="text-[#475569] text-xs font-medium">
                  {config.bestTimeData.day}
                </span>
                <span className="text-[#94A3B8] text-[10px]">-</span>
                <span className="text-[#475569] text-xs font-medium">
                  {config.bestTimeData.timeWindow}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
