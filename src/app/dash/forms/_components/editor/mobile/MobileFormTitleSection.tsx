"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { EDITOR_CANVAS_CONFIG } from "../config";
import type { FormValues } from "@dm-broo/common-types";

/**
 * Mobile-specific form title and description section.
 * Elevated font sizes to match the high-fidelity mobile image.
 */
export const MobileFormTitleSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <div className="space-y-1.5 mt-4 px-1">
      {/* Title */}
      <input
        {...register("title")}
        placeholder={EDITOR_CANVAS_CONFIG.TITLE_PLACEHOLDER}
        className="w-full text-[26px] font-bold text-slate-800 bg-transparent outline-none placeholder:text-slate-200"
      />
      {errors.title && (
        <p className="text-sm text-red-500 font-medium px-1">
          {errors.title.message}
        </p>
      )}

      {/* Description */}
      <input
        {...register("description")}
        placeholder={EDITOR_CANVAS_CONFIG.DESCRIPTION_PLACEHOLDER}
        className="w-full text-[17px] font-medium text-slate-400 bg-transparent outline-none placeholder:text-slate-200"
      />
    </div>
  );
};
