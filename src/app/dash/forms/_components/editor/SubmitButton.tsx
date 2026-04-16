"use client";

import React from "react";
import { EDITOR_CANVAS_CONFIG } from "./config";

type SubmitButtonProps = {
  disabled?: boolean;
};

// Submit button at the bottom of the canvas — publishes the form
export const SubmitButton = ({ disabled }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full bg-[#6A06E4] hover:bg-[#5a05c4] disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors"
    >
      {EDITOR_CANVAS_CONFIG.SUBMIT_LABEL}
    </button>
  );
};
