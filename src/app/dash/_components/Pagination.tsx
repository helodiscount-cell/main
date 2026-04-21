"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/server/utils";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Common pagination component for dashboard tables.
 */
export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: PaginationProps) {
  const safePageSize = pageSize > 0 ? pageSize : 1;
  const totalPages = Math.ceil(totalItems / safePageSize);

  if (totalPages <= 1) return null;

  // Clamp current page to valid range
  const clampedPage = Math.min(Math.max(currentPage, 1), totalPages);

  const canPrev = clampedPage > 1;
  const canNext = clampedPage < totalPages;

  /**
   * Helper to build a compact page model to avoid O(totalPages) rendering
   */
  const buildPageModel = (total: number, current: number) => {
    const items: Array<{
      type: "page" | "ellipsis";
      value?: number;
      key: string;
    }> = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        items.push({ type: "page", value: i, key: `page-${i}` });
      }
      return items;
    }

    // Always show page 1
    items.push({ type: "page", value: 1, key: "page-1" });

    if (current > 3) {
      items.push({ type: "ellipsis", key: "left" });
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      items.push({ type: "page", value: i, key: `page-${i}` });
    }

    if (current < total - 2) {
      items.push({ type: "ellipsis", key: "right" });
    }

    // Always show last page
    items.push({ type: "page", value: total, key: `page-${total}` });

    return items;
  };

  const pageItems = buildPageModel(totalPages, clampedPage);

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 bg-white border-t border-slate-100",
        className,
      )}
    >
      <div className="text-xs text-slate-500 font-medium">
        Showing{" "}
        <span className="text-slate-900 font-bold">
          {(clampedPage - 1) * safePageSize + 1}
        </span>{" "}
        to{" "}
        <span className="text-slate-900 font-bold">
          {Math.min(clampedPage * safePageSize, totalItems)}
        </span>{" "}
        of <span className="text-slate-900 font-bold">{totalItems}</span>{" "}
        results
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(clampedPage - 1)}
          disabled={!canPrev}
          aria-label="Previous page"
          className="h-8 px-2 border-slate-200 text-slate-600 hover:text-[#6A06E4] hover:bg-[#F7F0FF] hover:border-[#6A06E4]"
        >
          <ChevronLeft size={16} />
        </Button>

        <div className="flex items-center gap-1 mx-1">
          {pageItems.map((item) => {
            if (item.type === "page") {
              return (
                <button
                  key={item.key}
                  onClick={() => onPageChange(item.value!)}
                  aria-current={item.value === clampedPage ? "page" : undefined}
                  aria-label={`Page ${item.value}`}
                  className={cn(
                    "w-8 h-8 text-xs font-bold rounded-md transition-all",
                    item.value === clampedPage
                      ? "bg-[#6A06E4] text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                  )}
                >
                  {item.value}
                </button>
              );
            }
            return (
              <span
                key={item.key}
                className="text-slate-300 px-1"
                aria-hidden="true"
              >
                ...
              </span>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(clampedPage + 1)}
          disabled={!canNext}
          aria-label="Next page"
          className="h-8 px-2 border-slate-200 text-slate-600 hover:text-[#6A06E4] hover:bg-[#F7F0FF] hover:border-[#6A06E4]"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
