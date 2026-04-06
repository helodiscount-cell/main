"use client";

import React from "react";
import { Lock } from "lucide-react";
import Link from "next/link";

interface LockedOverlayProps {
  children: React.ReactNode;
  isLocked: boolean;
  title?: string;
  description?: string;
  className?: string;
  borderRadius?: string;
}

/**
 * LockedOverlay Component
 * Renders a subtle greyed-out overlay for gated features.
 * Optimized for both large widgets (Dashboard) and small widgets (Automation Builder).
 */
export const LockedOverlay = ({
  children,
  isLocked,
  title = "Premium Feature",
  description = "Available on Black & Free plans",
  className = "",
  borderRadius = "1rem",
}: LockedOverlayProps) => {
  if (!isLocked) return <>{children}</>;

  return (
    <div
      className={`relative group ${className} overflow-hidden transition-all duration-300 ${isLocked ? "min-h-[140px]" : ""}`}
      style={{ borderRadius }}
    >
      {/* Greyed Out Content Layer */}
      <div className="filter grayscale blur-[0.5px] pointer-events-none select-none opacity-20 transition-all duration-500 h-full">
        {children}
      </div>

      {/* Modern Integrated Discovery Layer */}
      <div className="absolute inset-0 z-40 bg-slate-900/[0.01] flex items-center justify-center p-3 text-center">
        <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300 scale-90 sm:scale-100">
          {/* Badge */}
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.08)] rounded-xl px-4 py-2.5 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shadow-lg">
              <Lock className="text-white w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-slate-900 font-bold text-[13px] leading-tight">
                {title}
              </span>
              <span className="text-slate-500 text-[9px] font-bold uppercase tracking-tight mt-0.5">
                {description}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Link
            href="/dash/billing"
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs shadow-lg shadow-purple-200 transition-all active:scale-95"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  );
};
