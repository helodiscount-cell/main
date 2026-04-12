"use client";

import React, { useState } from "react";
import type { FormField, FieldType } from "@dm-broo/common-types";
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Star, Upload, FileCheck, Loader2 } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import { CountryPicker } from "./CountryPicker";
import { HierarchicalLocationPicker } from "./HierarchicalLocationPicker";

type PublicFieldRendererProps = {
  field: FormField;
  register: UseFormRegister<Record<string, string | string[]>>;
  setValue: UseFormSetValue<Record<string, string | string[]>>;
  watch: UseFormWatch<Record<string, string | string[]>>;
  onUploadStateChange?: (isUploading: boolean) => void;
};

// Maps field types to the correct HTML input type for the public form
const INPUT_TYPE_MAP: Partial<Record<FieldType, string>> = {
  text: "text",
  number: "number",
  email: "email",
  url: "url",
  date: "date",
};

// Renders the correct interactive input for each field type
export const PublicFieldRenderer = ({
  field,
  register,
  setValue,
  watch,
  onUploadStateChange,
}: PublicFieldRendererProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Watch field value at top level to avoid rule of hook violations in branches
  const rawValue = watch(field.id);
  const fullValue = (rawValue as string) || "";
  const checkedValues = (rawValue as string[]) ?? [];

  const inputClass =
    "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#6A06E4] focus:ring-1 focus:ring-[#6A06E4] transition-colors";

  // Standard text-like inputs
  if (INPUT_TYPE_MAP[field.type as FieldType]) {
    return (
      <div className="space-y-1.5 flex flex-col gap-2">
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

  // Location — Hierarchical picker (Country > State > City)
  if (field.type === "location") {
    return (
      <div className="space-y-1.5 flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <HierarchicalLocationPicker
          value={fullValue}
          onChange={(val) => setValue(field.id, val)}
          required={field.required}
        />
        {/* Hidden input to hold the joined value for react-hook-form */}
        <input type="hidden" {...register(field.id)} />
      </div>
    );
  }

  // Phone — custom dual-input renderer for country code + 10-digit number
  if (field.type === "phone") {
    // Extract code and number from the joined value (+CODE|phone|NUMBER)
    const parts = fullValue.replace("+", "").split("|phone|");
    const code = parts[0] || "91";
    const number = parts[1] || "";

    // Helper to join code and number
    const handlePhoneChange = (newCode: string, newNum: string) => {
      const cleanCode = newCode.replace(/\D/g, "").slice(0, 4);
      const cleanNum = newNum.replace(/\D/g, "").slice(0, 10);

      if (cleanNum) {
        setValue(field.id, `+${cleanCode}|phone|${cleanNum}`);
      } else {
        setValue(field.id, "");
      }
    };

    return (
      <div className="space-y-1.5 flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex gap-2">
          {/* Country Picker Toggle */}
          <CountryPicker
            value={code}
            onChange={(newCode) => handlePhoneChange(newCode, number)}
            className="w-24 shrink-0"
          />

          {/* Main Number */}
          <input
            type="text"
            placeholder="9998887776"
            value={number}
            onChange={(e) => handlePhoneChange(code, e.target.value)}
            className={inputClass}
            maxLength={10}
            required={field.required}
          />
        </div>
        {/* Hidden input to hold the joined E.164-like value for react-hook-form */}
        <input type="hidden" {...register(field.id)} />
      </div>
    );
  }

  // Dropdown – native select
  if (field.type === "dropdown") {
    return (
      <div className="space-y-1.5 flex flex-col gap-2">
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
      <div className="space-y-1.5 flex flex-col gap-2">
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
      <div className="space-y-1.5 flex flex-col gap-2">
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

  if (field.type === "upload") {
    const fileUrl = fullValue;

    return (
      <div className="space-y-1.5 flex flex-col gap-2">
        {/* File upload - Audio, Video, and GIFs are disallowed for public form submissions */}
        <label className="text-sm font-semibold text-slate-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {fileUrl ? (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl animate-in fade-in zoom-in duration-300">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <FileCheck size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-emerald-900 truncate">
                {(() => {
                  try {
                    const data = JSON.parse(fileUrl);
                    return data.name || "File uploaded";
                  } catch {
                    return "File uploaded";
                  }
                })()}
              </p>
              <button
                type="button"
                onClick={() => setValue(field.id, "")}
                className="text-xs text-emerald-600 hover:underline"
              >
                Remove and re-upload
              </button>
            </div>
          </div>
        ) : (
          <UploadDropzone
            endpoint="formAttachment"
            onUploadBegin={() => onUploadStateChange?.(true)}
            onClientUploadComplete={(res) => {
              onUploadStateChange?.(false);
              if (res?.[0]) {
                // Store both URL and original filename as a stringified object
                const uploadValue = JSON.stringify({
                  url: res[0].url,
                  name: res[0].name,
                });
                setValue(field.id, uploadValue);
                toast.success("File uploaded!");
              }
            }}
            onUploadError={(error: Error) => {
              onUploadStateChange?.(false);
              toast.error(`Upload failed: ${error.message}`);
            }}
            appearance={{
              container:
                "border-slate-200 border-2 border-dashed bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200 py-8",
              label: "text-[#6A06E4] hover:text-[#5a05c4]",
              button:
                "bg-[#6A06E4] w-[40%] ut-ready:bg-[#6A06E4] ut-uploading:bg-[#6A06E4]/50 after:bg-[#6A06E4]",
              allowedContent: "text-slate-400 text-[10px]",
            }}
          />
        )}
        {/* Hidden input to satisfy react-hook-form registry if needed, though setValue works directly */}
        <input type="hidden" {...register(field.id)} />
      </div>
    );
  }

  // Fallback for unrecognized types
  return null;
};
