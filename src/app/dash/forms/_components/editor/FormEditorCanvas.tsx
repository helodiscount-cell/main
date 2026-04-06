"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { useFormEditor } from "../FormEditorProvider";
import { CoverImageUpload } from "./CoverImageUpload";
import { FormTitleSection } from "./FormTitleSection";
import { FieldCard } from "./FieldCard";
import { AddFieldButton } from "./AddFieldButton";
import { SubmitButton } from "./SubmitButton";
import { useFormCanvasLogic } from "./useFormCanvasLogic";

/**
 * Orchestrates the form canvas.
 * Refactored to use useFormCanvasLogic for a cleaner, DRYer implementation.
 */
export const FormEditorCanvas = () => {
  const { methods, save, isLoading } = useFormEditor();
  const { fields, remove, handleAddField, handleCanvasSubmit } =
    useFormCanvasLogic(methods.control, save);

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden rounded-xl">
      {/* Canvas scrollable area */}
      <div className="flex-1 overflow-y-auto rounded-xl -inner-sm">
        <FormProvider {...methods}>
          <form
            onSubmit={handleCanvasSubmit}
            className="max-w-lg mx-auto space-y-4 h-full flex flex-col justify-center p-4"
          >
            {/* Form fixed elements */}
            <CoverImageUpload />
            <FormTitleSection />

            {/* Dynamic field list */}
            <div className="space-y-4 h-[calc(100vh-600px)] overflow-y-auto no-scrollbar">
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
