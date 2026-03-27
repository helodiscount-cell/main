"use client";

import React, { useCallback } from "react";
import { toast } from "sonner";
import { FieldType } from "@dm-broo/common-types";
import { useFormEditor } from "../FormEditorProvider";
import { useFieldArray, FormProvider } from "react-hook-form";
import { CoverImageUpload } from "./CoverImageUpload";
import { FormTitleSection } from "./FormTitleSection";
import { FieldCard } from "./FieldCard";
import { AddFieldButton } from "./AddFieldButton";
import { SubmitButton } from "./SubmitButton";

// Orchestrates the form canvas — field array, card rendering, and validation hooks
export const FormEditorCanvas = () => {
  const { methods, save, isLoading } = useFormEditor();

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "fields",
  });

  // Adds a new field card with sensible defaults
  const handleAddField = useCallback(
    (type: FieldType) => {
      const isChoice = type === "dropdown" || type === "checkbox";
      append({
        id: crypto.randomUUID(),
        type,
        label: "",
        placeholder: "",
        required: false,
        options: isChoice
          ? [{ id: crypto.randomUUID(), label: "Option 1" }]
          : undefined,
      });
    },
    [append],
  );

  // Form submit handler that triggers the save mutation
  const handleCanvasSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    save("PUBLISHED");
  };

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      {/* Canvas scrollable area */}
      <div className="flex-1 overflow-y-auto mt-2 rounded-xl shadow-inner-sm">
        <FormProvider {...methods}>
          <form
            onSubmit={handleCanvasSubmit}
            className="max-w-lg mx-auto space-y-4"
          >
            {/* Form visual elements */}
            <CoverImageUpload />
            <FormTitleSection />

            {/* Dynamic field list */}
            <div className="space-y-4 h-[calc(100vh-600px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {fields.map((field, index) => (
                <FieldCard
                  key={field.id}
                  index={index}
                  onRemove={() => remove(index)}
                />
              ))}
            </div>

            {/* Form builder actions */}
            <AddFieldButton onAddField={handleAddField} />
            <SubmitButton disabled={isLoading} />
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
