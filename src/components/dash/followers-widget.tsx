"use client";

import { ChevronDown } from "lucide-react";
import React from "react";

// Types for the widget configuration
interface DataPoint {
  label: string;
  value: number;
}

interface FollowersWidgetProps {
  config?: {
    title: string;
    metric: string;
    range: string;
    data: DataPoint[];
    color: string;
  };
}

// Dummy data to match the UI exactly
const DUMMY_CONFIG = {
  title: "New Followers",
  metric: "2993",
  range: "Last 7 days",
  data: [
    { label: "3 Nov", value: 40 },
    { label: "Nov 3.5", value: 80 }, // peak
    { label: "Nov 3.7", value: 80 }, // flat peak
    { label: "4 Nov", value: 10 },
    { label: "Nov 4.5", value: 40 },
    { label: "Nov 5", value: 40 },
    { label: "Nov 5.5", value: 40 },
    { label: "Nov 6", value: 40 },
    { label: "Nov 6.5", value: 10 },
    { label: "Nov 7", value: 10 },
    { label: "Nov 7.5", value: 10 },
    { label: "Nov 7.7", value: 60 },
    { label: "Nov 8", value: 60 },
    { label: "Nov 8.2", value: 60 },
    { label: "8 Nov", value: 10 },
  ],
  color: "#7C3AED", // Vibrant purple
};

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FollowersWidget({
  config = DUMMY_CONFIG,
}: FollowersWidgetProps) {
  // SVG Logic: map data points to coordinates
  const width = 300;
  const height = 120;
  const padding = 20;

  const maxVal = Math.max(...config.data.map((d) => d.value));
  const minVal = 0;
  const range = maxVal - minVal;

  const points = config.data
    .map((d, i) => {
      const x =
        (i / (config.data.length - 1)) * (width - padding * 2) + padding;
      const y =
        height -
        padding -
        ((d.value - minVal) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="bg-white rounded-[32px] p-7 shadow-sm border border-gray-100 flex flex-col gap-2 min-h-[380px] w-full max-w-sm">
      {/* Header section with title and range */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[#1E293B] font-bold text-xl">{config.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 text-[#475569] text-sm font-medium hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors outline-none cursor-pointer">
              {config.range}
              <ChevronDown size={14} className="text-[#94A3B8]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 bg-white">
            <DropdownMenuItem className="cursor-pointer">
              Last 7 days
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Last 30 days
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Last 90 days
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main metric display */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <span className="text-[68px] font-bold text-[#7C3AED] leading-none tracking-tight">
          {config.metric}
        </span>
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
          <polyline
            fill="none"
            stroke={config.color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>

        {/* X-Axis labels positioned outside the relative graph box to avoid clipping */}
        <div className="absolute top-full left-0 right-0 flex justify-between mt-3 px-1 text-[#64748B] text-[11px] font-semibold">
          <div className="flex flex-col items-center gap-1.5 min-w-[40px]">
            <div className="w-px h-1.5 bg-gray-200" />
            <span className="whitespace-nowrap">3 Nov</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 min-w-[40px]">
            <div className="w-px h-1.5 bg-gray-200" />
            <span className="whitespace-nowrap">5 Nov</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 min-w-[40px]">
            <div className="w-px h-1.5 bg-gray-200" />
            <span className="whitespace-nowrap">8 Nov</span>
          </div>
        </div>
      </div>
    </div>
  );
}
