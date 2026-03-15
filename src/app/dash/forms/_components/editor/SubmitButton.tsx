"use client";

import React from "react";
import { EDITOR_CANVAS_CONFIG } from "./config";

// Cosmetic submit row at the bottom of the canvas — not interactive in editor view
export const SubmitButton = () => {
  return (
    <button
      type="submit"
      className="w-full bg-[#6A06E4] hover:bg-[#5a05c4] text-white font-semibold py-3 rounded-xl transition-colors"
    >
      {EDITOR_CANVAS_CONFIG.SUBMIT_LABEL}
    </button>
  );
};
