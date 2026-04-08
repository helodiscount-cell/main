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
export const Pagination = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

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
          {(currentPage - 1) * pageSize + 1}
        </span>{" "}
        to{" "}
        <span className="text-slate-900 font-bold">
          {Math.min(currentPage * pageSize, totalItems)}
        </span>{" "}
        of <span className="text-slate-900 font-bold">{totalItems}</span>{" "}
        results
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPrev}
          className="h-8 px-2 border-slate-200 text-slate-600 hover:text-[#6A06E4] hover:bg-[#F7F0FF] hover:border-[#6A06E4]"
        >
          <ChevronLeft size={16} />
        </Button>

        <div className="flex items-center gap-1 mx-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Simple logic: show first, last, and around current
            const isNear = Math.abs(page - currentPage) <= 1;
            const isEdge = page === 1 || page === totalPages;

            if (isNear || isEdge) {
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={cn(
                    "w-8 h-8 text-xs font-bold rounded-md transition-all",
                    page === currentPage
                      ? "bg-[#6A06E4] text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                  )}
                >
                  {page}
                </button>
              );
            }

            // Ellipsis placeholder logic
            if (page === 2 || page === totalPages - 1) {
              return (
                <span key={page} className="text-slate-300 px-1">
                  ...
                </span>
              );
            }

            return null;
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNext}
          className="h-8 px-2 border-slate-200 text-slate-600 hover:text-[#6A06E4] hover:bg-[#F7F0FF] hover:border-[#6A06E4]"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};
