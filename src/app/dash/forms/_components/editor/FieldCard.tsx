"use client";

import React from "react";
import { Trash2, Plus, X, Star } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FIELD_TYPE_LABELS } from "./config";
import type { FormValues, FieldType } from "@dm-broo/common-types";

type FieldCardProps = {
  index: number;
  onRemove: () => void;
};

// Map of field types to their preview input types
const INPUT_TYPE_MAP: Partial<Record<FieldType, string>> = {
  text: "text",
  number: "number",
  email: "email",
  url: "url",
  phone: "tel",
  date: "date",
};

// Single field card — dynamically renders its configuration inputs based on type
export const FieldCard = ({ index, onRemove }: FieldCardProps) => {
  /**
   * Main form context to access validation state and registration
   */
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<FormValues>();

  /**
   * Watch key field properties to drive conditional rendering
   */
  const fieldType = watch(`fields.${index}.type`);
  const isRequired = watch(`fields.${index}.required`);

  /**
   * Field array for managing dynamic options (used for Dropdowns and Checkboxes)
   */
  const {
    fields: options,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    // @ts-ignore - Dynamic path for nested field array
    name: `fields.${index}.options`,
  });

  const showOptions = fieldType === "dropdown" || fieldType === "checkbox";

  return (
    <div className="relative flex gap-2 group animate-in fade-in slide-in-from-top-2 duration-200">
      {/*
          FIELD CONTAINER
          Houses the entire configuration for a single form field
      */}
      <div className="flex-1 bg-white rounded-xl border border-slate-100 px-4 py-3 space-y-3 shadow-sm hover:border-[#6A06E4]/20 transition-colors">
        {/* HEADER SECTION: Displays field type and the 'Required' toggle */}
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
              onClick={() =>
                setValue(`fields.${index}.required`, !isRequired, {
                  shouldDirty: true,
                })
              }
              className={`relative inline-flex h-4 w-8 shrink-0 rounded-full transition-colors cursor-pointer ${
                isRequired ? "bg-[#6A06E4]" : "bg-slate-200"
              }`}
              aria-label="Toggle required"
            >
              <span
                className={`inline-block h-3 w-3 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${
                  isRequired ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* LABEL SECTION: The 'Question' or 'Title' of the field */}
        <div className="space-y-1">
          <input
            {...register(`fields.${index}.label`)}
            placeholder="What's the question?"
            className="w-full text-sm font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300"
          />
          {/* Validation Feedback for Field Label */}
          {/* @ts-ignore */}
          {errors.fields?.[index]?.label && (
            <p className="text-[10px] text-red-500">
              {/* @ts-ignore */}
              {errors.fields[index].label.message}
            </p>
          )}
        </div>

        {/*
            DYNAMIC CONFIG AREA
            Renders different UI based on the field type (Options, Star rating, or Input Mockup)
        */}
        <div className="space-y-3">
          {/* STAR RATING PREVIEW */}
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
            /* CHOICE FIELD OPTIONS (Dropdown/Checkbox) */
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
          ) : fieldType === "upload" ? (
            /* FILE UPLOAD PREVIEW */
            <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-lg p-4 flex flex-col items-center gap-1 text-slate-300">
              <span className="text-[10px] font-medium">
                User will upload a file here
              </span>
            </div>
          ) : (
            /* DEFAULT INPUT MOCKUP (Text, Email, URL, Number, Date, etc.) */
            <div className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-100 group-focus-within:border-[#6A06E4]/20 transition-colors">
              <input
                {...register(`fields.${index}.placeholder`)}
                type={INPUT_TYPE_MAP[fieldType] || "text"}
                placeholder="Edit placeholder text..."
                onClick={(e) =>
                  fieldType === "date" && e.currentTarget.showPicker?.()
                }
                className="w-full text-xs text-slate-500 bg-transparent outline-none placeholder:text-slate-300"
              />
            </div>
          )}
        </div>
      </div>

      {/* DELETE BUTTON: Removes the entire field from the form */}
      <button
        type="button"
        onClick={onRemove}
        className="mt-2 text-slate-300 hover:text-red-500 shrink-0 transition-colors h-fit p-1.5 cursor-pointer"
        aria-label="Remove field"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
