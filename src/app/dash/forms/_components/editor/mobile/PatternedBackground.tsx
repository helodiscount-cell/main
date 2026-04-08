"use client";

import React from "react";

/**
 * Renders a repeatable cross pattern for the editor canvas background.
 * Matches the design requested by the user.
 */
export const PatternedBackground = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="relative flex-1 h-full overflow-hidden bg-[#F1F5F9] rounded-xl border border-slate-200">
      {/*
          PATTERN OVERLAY
          Uses a CSS background-image with a tiny cross (plus) shape
      */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px), radial-gradient(circle, #000 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 12px 12px",
        }}
      />

      {/* Alternative implementation if the radial gradient doesn't match perfectly:
          Using a CSS-drawn plus pattern
      */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "center center",
          maskImage:
            "radial-gradient(circle at center, black, transparent 80%)",
          opacity: 0.4,
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="max-w-lg mx-auto py-8 px-4 pb-[120px]">{children}</div>
      </div>
    </div>
  );
};
