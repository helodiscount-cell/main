"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { EDITOR_CANVAS_CONFIG } from "./config";
import type { FormValues } from "@dm-broo/common-types";

// Editable title and description bound to react-hook-form
export const FormTitleSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <div className="space-y-0.5">
      {/* Title */}
      <input
        {...register("title")}
        placeholder={EDITOR_CANVAS_CONFIG.TITLE_PLACEHOLDER}
        className="w-full text-lg font-bold text-slate-900 bg-transparent outline-none placeholder:text-slate-500"
      />
      {errors.title && (
        <p className="text-xs text-red-500">{errors.title.message}</p>
      )}

      {/* Description */}
      <input
        {...register("description")}
        placeholder={EDITOR_CANVAS_CONFIG.DESCRIPTION_PLACEHOLDER}
        className="w-full text-sm text-slate-500 bg-transparent outline-none placeholder:text-slate-500"
      />
    </div>
  );
};
