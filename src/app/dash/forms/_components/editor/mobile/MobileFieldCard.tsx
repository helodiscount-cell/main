"use client";

import React from "react";
import { GripVertical, Trash2, Plus, X, Star } from "lucide-react";
import { FIELD_TYPE_LABELS } from "../config";
import { useFieldCardLogic } from "../useFieldCardLogic";

type MobileFieldCardProps = {
  index: number;
  onRemove: () => void;
};

/**
 * Mobile-specific field card design.
 * Matches the requested image with drag handle on left, purple toggle, and red trash icon.
 * Refactored to use useFieldCardLogic for a cleaner, DRYer implementation.
 */
export const MobileFieldCard = ({ index, onRemove }: MobileFieldCardProps) => {
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

  return (
    <div className="relative flex items-center gap-3 group animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Drag Handle (Visual only) */}
      <div className="flex flex-col items-center justify-center p-2 rounded-full bg-white/60 text-slate-400 shrink-0 -sm border border-slate-50 cursor-grab active:cursor-grabbing">
        <GripVertical size={16} />
      </div>

      {/* FIELD CONTAINER */}
      <div className="flex-1 bg-white rounded-[24px] p-5 space-y-4 -[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-50 relative">
        {/* HEADER SECTION: Type + Required Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-[17px] font-bold text-slate-800">
            {FIELD_TYPE_LABELS[fieldType]}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold text-slate-500">
              Required
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isRequired}
              aria-label="Toggle required"
              onClick={toggleRequired}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer ${
                isRequired ? "bg-[#6A06E4]" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white -sm transition-transform mt-0.5 ${
                  isRequired ? "translate-x-5.5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* LABEL SECTION: The Question */}
        <div className="space-y-1.5 mt-2">
          <input
            {...register(`fields.${index}.label`)}
            placeholder="Add a field title"
            className="w-full text-base font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-300"
          />
          {/* Validation Feedback */}
          {/* @ts-ignore */}
          {errors.fields?.[index]?.label && (
            <p className="text-xs text-red-500 font-medium">
              {/* @ts-ignore */}
              {errors.fields[index].label.message}
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
                  size={20}
                  className="text-slate-200 fill-slate-50"
                />
              ))}
            </div>
          ) : showOptions ? (
            <div className="space-y-2.5">
              {options.map((opt, optIndex) => (
                <div key={opt.id} className="flex items-center gap-2 group/opt">
                  <div
                    className={`w-4 h-4 border-2 border-slate-200 ${fieldType === "checkbox" ? "rounded-sm" : "rounded-full"}`}
                  />
                  <input
                    {...register(
                      `fields.${index}.options.${optIndex}.label` as any,
                    )}
                    placeholder={`Option ${optIndex + 1}`}
                    className="flex-1 text-sm font-medium bg-transparent outline-none text-slate-700 placeholder:text-slate-200"
                  />
                  {options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(optIndex)}
                      className="opacity-100 text-slate-300 hover:text-red-400 transition-all cursor-pointer p-0.5"
                    >
                      <X size={14} />
                    </button>
                  )}
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
                className="flex items-center gap-1.5 text-xs font-bold text-[#6A06E4] hover:opacity-70 transition-opacity cursor-pointer mt-2"
              >
                <Plus size={14} strokeWidth={3} />
                ADD OPTION
              </button>
            </div>
          ) : fieldType === "upload" ? (
            <div className="bg-[#F8FAFC] border-2 border-dashed border-slate-100 rounded-xl p-4 flex flex-col items-center gap-1.5 text-slate-300">
              <span className="text-xs font-semibold text-slate-400">
                User will upload a file here
              </span>
            </div>
          ) : (
            <div className="bg-[#F8FAFC] rounded-xl px-4 py-3 border border-slate-50 focus-within:border-[#6A06E4]/10 transition-colors">
              <input
                {...register(`fields.${index}.placeholder`)}
                type="text"
                placeholder="Add Placeholder"
                className="w-full text-sm font-medium text-slate-500 bg-transparent outline-none placeholder:text-slate-300"
              />
            </div>
          )}
        </div>
      </div>

      {/* DELETE BUTTON: Red Trash Icon */}
      <button
        type="button"
        aria-label="Delete field"
        onClick={onRemove}
        className="text-red-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all shrink-0 cursor-pointer self-center"
      >
        <Trash2 size={24} strokeWidth={2.5} />
      </button>
    </div>
  );
};
