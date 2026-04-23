"use client";

import React from "react";
import { UpgradeTooltip } from "@/components/shared/UpgradeTooltip";

interface LockedOverlayProps {
  children: React.ReactNode;
  isLocked: boolean;
  className?: string;
}

/**
 * LockedOverlay Component
 * When locked, the outer div receives pointer events (so hover works),
 * children are blocked via an inner pointer-events-none layer,
 * and an absolute overlay intercepts any residual clicks.
 */
export const LockedOverlay = ({
  children,
  isLocked,
  className = "",
}: LockedOverlayProps) => {
  if (!isLocked) return <>{children}</>;

  return (
    <UpgradeTooltip>
      {/*
        Must NOT have pointer-events-none at this level —
        Radix fires the tooltip via onPointerEnter/Leave on this element.
      */}
      <div className={`relative cursor-not-allowed ${className}`}>
        {/* Disable all interactions on the actual children */}
        <div className="pointer-events-none select-none" inert>
          {children}
        </div>

        {/* Intercepts any clicks that reach through */}
        <div className="absolute inset-0 z-10" />
      </div>
    </UpgradeTooltip>
  );
};
