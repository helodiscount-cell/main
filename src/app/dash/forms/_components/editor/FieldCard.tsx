"use client";

import React from "react";
import { Trash2, Plus, X, Star } from "lucide-react";
import { FIELD_TYPE_LABELS } from "./config";
import { useFieldCardLogic } from "./useFieldCardLogic";

type FieldCardProps = {
  index: number;
  onRemove: () => void;
};

/**
 * Single field card — dynamically renders its configuration inputs based on type.
 * Optimized for clean code and performance using the useFieldCardLogic hook.
 */
export const FieldCard = ({ index, onRemove }: FieldCardProps) => {
  const {
    register,
    fieldType,
    isRequired,
    toggleRequired,
    options,
    appendOption,
    removeOption,
    errors,
    showOptions,
  } = useFieldCardLogic(index);

  // Safely type errors for field access as react-hook-form can have complex nested types
  const fieldError = (errors.fields as any)?.[index] as {
    label?: { message?: string };
  };

  return (
    <div className="relative flex gap-2 group animate-in fade-in slide-in-from-top-2 duration-200">
      {/* FIELD CONTAINER */}
      <div className="flex-1 bg-white rounded-xl border border-slate-100 px-4 py-3 space-y-3 -sm hover:border-[#6A06E4]/20 transition-colors">
        {/* HEADER SECTION: Displays field type, Required toggle and Delete button */}
        <div className="flex items-center justify-between border-b border-slate-50 pb-2">
          <span className="text-[10px] font-bold text-[#6A06E4] uppercase tracking-wider">
            {FIELD_TYPE_LABELS[fieldType]}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-slate-400">
              Required
            </span>
            <button
              type="button"
              onClick={toggleRequired}
              className={`relative inline-flex h-4 w-8 shrink-0 rounded-full transition-colors cursor-pointer ${
                isRequired ? "bg-[#6A06E4]" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-3 w-3 rounded-full bg-white -sm transition-transform mt-0.5 ${
                  isRequired ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
            {/* DELETE BUTTON: Integrated into header based on user tweak */}
            <button
              type="button"
              onClick={onRemove}
              className="text-slate-200 hover:text-red-500 shrink-0 transition-colors h-fit p-1.5 cursor-pointer ml-1"
              aria-label="Remove field"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* LABEL SECTION: The Question */}
        <div className="space-y-1">
          <input
            {...register(`fields.${index}.label`)}
            placeholder="What's the question?"
            className="w-full text-sm font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300"
          />
          {fieldError?.label?.message && (
            <p className="text-[10px] text-red-500 font-medium">
              {fieldError.label.message}
            </p>
          )}
        </div>

        {/* DYNAMIC CONFIG AREA */}
        <div className="space-y-3">
          {fieldType === "rating" ? (
            <div className="flex gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  className="text-slate-200 fill-slate-50"
                />
              ))}
            </div>
          ) : showOptions ? (
            <div className="space-y-2">
              {options.map((opt, optIndex) => (
                <div key={opt.id} className="flex items-center gap-2 group/opt">
                  <div
                    className={`w-3.5 h-3.5 border border-slate-300 ${fieldType === "checkbox" ? "rounded-sm" : "rounded-full"}`}
                  />
                  <input
                    {...register(
                      `fields.${index}.options.${optIndex}.label` as any,
                    )}
                    placeholder={`Option ${optIndex + 1}`}
                    className="flex-1 text-sm bg-transparent outline-none text-slate-600 placeholder:text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(optIndex)}
                    className="opacity-0 group-hover/opt:opacity-100 text-slate-300 hover:text-red-400 transition-all cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  appendOption({
                    id: crypto.randomUUID(),
                    label: "",
                  })
                }
                className="flex items-center gap-1 text-[11px] font-bold text-[#6A06E4] hover:opacity-70 transition-opacity cursor-pointer mt-1"
              >
                <Plus size={12} strokeWidth={3} />
                ADD OPTION
              </button>
            </div>
          ) : fieldType === "upload" || fieldType === "location" ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-lg p-4 flex flex-col items-center gap-1 text-slate-300">
              <span className="text-[10px] font-medium">
                {fieldType === "upload"
                  ? "User will upload a file here"
                  : "Hierarchical location picker (Country, State, City)"}
              </span>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-100 focus-within:border-[#6A06E4]/20 transition-colors">
              <input
                {...register(`fields.${index}.placeholder`)}
                type="text"
                placeholder="Edit placeholder text..."
                className="w-full text-xs text-slate-500 bg-transparent outline-none placeholder:text-slate-300"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
