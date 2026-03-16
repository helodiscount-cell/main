"use client";

import { ChevronDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { statsService } from "@/api/services/stats";
import { statsKeys } from "@/keys/react-query";
import { ChartDataPoint } from "@/types/stats";

// Internal configuration for different widget types
const WIDGET_CONFIGS = {
  followers: {
    title: "New Followers",
    queryKeyFn: statsKeys.followersGrowth,
    queryFn: statsService.getFollowerGrowth,
    extractMetric: (data: any) => data?.growth ?? 0,
    extractChartData: (data: any) => data?.data ?? ([] as ChartDataPoint[]),
    showTrendIndicator: true,
  },
  outreach: {
    title: "Outreach Impact",
    queryKeyFn: statsKeys.outreachImpact,
    queryFn: statsService.getOutreachImpact,
    extractMetric: (data: any) => data?.count ?? 0,
    extractChartData: (data: any) => data?.data ?? ([] as ChartDataPoint[]),
    showTrendIndicator: false,
  },
};

export type GrowthWidgetType = keyof typeof WIDGET_CONFIGS;

export interface GrowthWidgetProps {
  type: GrowthWidgetType;
  lineColor?: string;
  defaultRange?: string;
}

export function GrowthWidget({
  type,
  lineColor = "#7C3AED",
  defaultRange = "Last 7 days",
}: GrowthWidgetProps) {
  const options = ["Last 7 days", "Last 30 days", "All time"];
  const [range, setRange] = useState(defaultRange);

  const config = WIDGET_CONFIGS[type];

  const { data, isLoading } = useQuery({
    queryKey: config.queryKeyFn(range),
    queryFn: () => config.queryFn(range),
  } as any);

  const chartData = config.extractChartData(data);
  const metricValue = config.extractMetric(data);
  const isPositive = metricValue >= 0;

  // Chart calculation
  const width = 300;
  const height = 120;

  const defaultPoints =
    "20,80 40,40 60,40 80,100 120,40 180,40 220,100 240,60 270,60 280,100";
  let points = defaultPoints;

  if (chartData.length > 0) {
    const values = chartData.map((d: ChartDataPoint) => d.value);
    const maxVal = Math.max(...values, 10); // Ensure some height even if all 0s
    const minVal = Math.min(...values);

    // Add padding to top and bottom (20%)
    const paddingMultiplier = 0.2;
    const rangeHeight = maxVal - minVal || maxVal; // Prevent division by zero
    const paddedMax = maxVal + rangeHeight * paddingMultiplier;
    const paddedMin = Math.max(0, minVal - rangeHeight * paddingMultiplier);
    const paddedRange = paddedMax - paddedMin || 1;

    // Map data points closely to SVG coords
    const stepX = width / Math.max(chartData.length - 1, 1);

    points = chartData
      .map((d: ChartDataPoint, i: number) => {
        const x = i * stepX;
        // Invert Y axis for SVG (0 is top)
        const normalizedY = (d.value - paddedMin) / paddedRange;
        const y = height - normalizedY * height;
        return `${x},${Math.max(0, Math.min(height, y))}`; // clamp to viewbox
      })
      .join(" ");
  }

  return (
    <div className="bg-white rounded-[32px] p-7 shadow-sm border border-gray-100 flex flex-col gap-2 min-h-[380px] w-full max-w-sm">
      {/* Header section with title and range */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[#1E293B] font-bold text-xl">{config.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 text-[#475569] text-sm font-medium hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors outline-none cursor-pointer">
              {range}
              <ChevronDown size={14} className="text-[#94A3B8]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 bg-white">
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

      {/* Main metric display */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="w-32 h-16 bg-muted animate-pulse rounded-xl" />
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-[68px] font-bold text-[#7C3AED] leading-none tracking-tight">
              {config.showTrendIndicator && metricValue > 0
                ? `+${metricValue}`
                : metricValue}
            </span>
            {config.showTrendIndicator && metricValue !== 0 && (
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
          {chartData.length > 0 ? (
            <polyline
              fill="none"
              stroke={lineColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          ) : (
            <polyline
              fill="none"
              stroke={lineColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.2"
              strokeDasharray="4 4"
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
