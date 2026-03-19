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

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[250px]">
          <div className="w-full h-full bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center">
            <span className="text-gray-400 font-medium">
              Loading details...
            </span>
          </div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4 min-h-[250px]">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-2">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <h4 className="text-gray-900 font-semibold text-lg">
              No Data Found
            </h4>
            <p className="text-gray-500 text-sm max-w-[240px]">
              Engage with your posts to see which perform best in this range.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 items-stretch h-full">
          {/* Left Column: Bar Chart */}
          <div className="flex-1 flex flex-col justify-end relative pt-12 pb-8 min-h-[250px]">
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
                    {/* Value Badge on Hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none z-20">
                      {data.value} Triggers
                    </div>

                    {/* Image hovering over bar */}
                    <div
                      className="absolute w-[40px] h-[40px] rounded-lg overflow-hidden shadow-md border-2 border-white transition-transform duration-300 group-hover:-translate-y-2 z-20"
                      style={{
                        bottom: `calc(${heightPercent}% + 8px)`,
                      }}
                    >
                      <Image
                        src={data.imageUrl}
                        alt="Post thumbnail"
                        fill
                        className="object-cover"
                        unoptimized={data.imageUrl.includes("unsplash")}
                      />
                    </div>

                    {/* Bar with gradient */}
                    <div
                      className="w-[44px] bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-xl transition-all duration-700 ease-out shadow-sm group-hover:from-purple-500 group-hover:to-purple-300"
                      style={{ height: `${heightPercent}%` }}
                    />

                    {/* X-Axis labels */}
                    <div className="absolute -bottom-[32px] flex flex-col items-center gap-1.5 w-full">
                      <div className="w-px h-1.5 bg-gray-300" />
                      <span className="text-[#64748B] text-[11px] font-bold whitespace-nowrap">
                        {data.date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Best Time To Post */}
          <div className="w-full md:w-[280px] bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-[28px] p-6 flex flex-col items-center justify-center text-center gap-4 border border-white shadow-inner flex-shrink-0 relative">
            <h4 className="text-[#1E293B] font-bold text-base">
              Best Time To Post
            </h4>

            <div className="w-[130px] h-[130px] rounded-[20px] overflow-hidden shadow-lg border-4 border-white relative transition-transform duration-300">
              <Image
                src={config.bestTimeData.imageUrl}
                alt="Best performing post"
                fill
                className="object-cover"
                unoptimized={config.bestTimeData.imageUrl.includes("unsplash")}
              />
            </div>

            <div className="flex flex-col items-center gap-1.5 bg-white/50 backdrop-blur-sm py-3 px-6 rounded-2xl border border-white">
              <span className="text-purple-600 font-bold text-sm">
                {config.bestTimeData.fullDate}
              </span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span className="text-[#475569] text-xs font-semibold uppercase tracking-wider">
                  {config.bestTimeData.day}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              </div>
              <span className="text-gray-900 text-sm font-black mt-1">
                {config.bestTimeData.timeWindow}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
