"use client";

import { useFormEditor } from "@/providers/FormEditorProvider";
import React from "react";
import { FormProvider } from "react-hook-form";
import { useFormCanvasLogic } from "../_hooks/useFormCanvasLogic";
import {
  CoverImageUpload,
  FormTitleSection,
  AddFieldButton,
  SubmitButton,
  FieldCard,
} from "../_components/editor";

/**
 * Edit Form Page — Fetches form data via the layout's provider and renders the editor.
 */
export default function EditFormPage() {
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
            className="max-w-lg mx-auto space-y-4 h-full flex flex-col justify-center py-4"
          >
            {/* Form fixed elements */}
            <CoverImageUpload />
            <FormTitleSection />

            {/* Dynamic field list */}
            <div className="space-y-4 flex-1 min-h-0 overflow-y-auto no-scrollbar">
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
}
