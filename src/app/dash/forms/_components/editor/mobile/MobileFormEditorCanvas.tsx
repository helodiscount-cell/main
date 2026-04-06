"use client";

import React, { useCallback } from "react";
import { FieldType } from "@dm-broo/common-types";
import { useFormEditor } from "../../FormEditorProvider";
import { useFieldArray, FormProvider } from "react-hook-form";
import { MobileCoverImageUpload } from "./MobileCoverImageUpload";
import { MobileFormTitleSection } from "./MobileFormTitleSection";
import { MobileFieldCard } from "./MobileFieldCard";
import { MobileAddFieldButton } from "./MobileAddFieldButton";
import { MobileSubmitButton } from "./MobileSubmitButton";
import { PatternedBackground } from "./PatternedBackground";

/**
 * Mobile-specific form editor canvas.
 * Orchestrates the patterned background, high-fidelity mobile components,
 * and maintains feature parity with the desktop editor.
 */
export const MobileFormEditorCanvas = () => {
  const { methods, save, isLoading } = useFormEditor();

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "fields",
  });

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

  const handleCanvasSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    save("PUBLISHED");
  };

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      <PatternedBackground>
        <FormProvider {...methods}>
          <form onSubmit={handleCanvasSubmit} className="space-y-6">
            {/* Header Area */}
            <div className="space-y-4">
              <MobileCoverImageUpload />
              <MobileFormTitleSection />
            </div>

            {/* Field Area */}
            <div className="space-y-4">
              {fields.map((field, index) => (
                <MobileFieldCard
                  key={field.id}
                  index={index}
                  onRemove={() => remove(index)}
                />
              ))}
            </div>

            {/* Action Area */}
            <div className="flex flex-col items-center gap-6 pt-4">
              <MobileAddFieldButton onAddField={handleAddField} />
              <MobileSubmitButton disabled={isLoading} />
            </div>
          </form>
        </FormProvider>
      </PatternedBackground>
    </div>
  );
};
