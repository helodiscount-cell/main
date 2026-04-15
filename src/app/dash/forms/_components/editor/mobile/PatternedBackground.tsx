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
    <div className="-mt-4 relative flex-1 h-full overflow-hidden bg-[#E2E8F0]/30">
      {/*
          PLUS PATTERN OVERLAY
          Using a SVG-based plus pattern for crispness
      */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 8V16M8 12H16' stroke='%2364748B' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundSize: "32px 32px",
          backgroundPosition: "center center",
        }}
      />
      {/* Content Layer */}
      <div className="max-w-lg mx-auto">{children}</div>
    </div>
  );
};
