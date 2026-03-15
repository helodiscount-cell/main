"use client";

import React, { useState } from "react";
import type { FormField, FieldType } from "@dm-broo/common-types";
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Star } from "lucide-react";

type PublicFieldRendererProps = {
  field: FormField;
  register: UseFormRegister<Record<string, string | string[]>>;
  setValue: UseFormSetValue<Record<string, string | string[]>>;
  watch: UseFormWatch<Record<string, string | string[]>>;
};

// Maps field types to the correct HTML input type for the public form
const INPUT_TYPE_MAP: Partial<Record<FieldType, string>> = {
  text: "text",
  number: "number",
  email: "email",
  url: "url",
  phone: "tel",
  date: "date",
  location: "text",
  country: "text",
};

// Renders the correct interactive input for each field type
export const PublicFieldRenderer = ({
  field,
  register,
  setValue,
  watch,
}: PublicFieldRendererProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const checkedValues = (watch(field.id) as string[]) ?? [];

  const inputClass =
    "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#6A06E4] focus:ring-1 focus:ring-[#6A06E4] transition-colors";

  // Standard text-like inputs
  if (INPUT_TYPE_MAP[field.type as FieldType]) {
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          {...register(field.id)}
          type={INPUT_TYPE_MAP[field.type as FieldType] ?? "text"}
          placeholder={field.placeholder ?? ""}
          className={inputClass}
          required={field.required}
        />
      </div>
    );
  }

  // Dropdown – native select
  if (field.type === "dropdown") {
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          {...register(field.id)}
          className={inputClass}
          defaultValue=""
          required={field.required}
        >
          <option value="" disabled>
            Select an option
          </option>
          {(field.options ?? []).map((opt) => (
            <option key={opt.id} value={opt.label}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Checkbox — allows multiple selections
  if (field.type === "checkbox") {
    const toggleOption = (label: string) => {
      const current = checkedValues.includes(label)
        ? checkedValues.filter((v) => v !== label)
        : [...checkedValues, label];
      setValue(field.id, current);
    };

    return (
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="space-y-2">
          {(field.options ?? []).map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={checkedValues.includes(opt.label)}
                onChange={() => toggleOption(opt.label)}
                className="w-4 h-4 accent-[#6A06E4]"
              />
              <span className="text-sm text-slate-600">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // Star rating
  if (field.type === "rating") {
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => {
                setRating(star);
                setValue(field.id, String(star));
              }}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={
                  star <= (hoverRating || rating)
                    ? "text-[#6A06E4] fill-[#6A06E4]"
                    : "text-slate-200 fill-slate-50"
                }
              />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Fallback for unrecognized types
  return null;
};
