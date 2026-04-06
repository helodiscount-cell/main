"use client";

import React from "react";
import { Button } from "@/components/ui/button";

/**
 * Large, mobile-friendly Submit button.
 * Matches the design reference.
 */
export const MobileSubmitButton = ({ disabled }: { disabled?: boolean }) => {
  return (
    <div className="w-full">
      <Button
        type="submit"
        disabled={disabled}
        className="w-full h-[52px] bg-[#6A06E4] hover:bg-[#5a05c4] text-white rounded-2xl text-[17px] font-bold    -[0_8px_30px_rgba(106,6,228,0.15)] active:scale-[0.98] transition-all"
      >
        {disabled ? "Saving..." : "Submit"}
      </Button>
    </div>
  );
};
