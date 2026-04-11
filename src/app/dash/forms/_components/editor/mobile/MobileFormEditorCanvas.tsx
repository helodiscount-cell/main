"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { useFormEditor } from "../../FormEditorProvider";
import { MobileCoverImageUpload } from "./MobileCoverImageUpload";
import { MobileFormTitleSection } from "./MobileFormTitleSection";
import { MobileFieldCard } from "./MobileFieldCard";
import { MobileAddFieldButton } from "./MobileAddFieldButton";
import { MobileSubmitButton } from "./MobileSubmitButton";
import { PatternedBackground } from "./PatternedBackground";
import { useFormCanvasLogic } from "../useFormCanvasLogic";

/**
 * Mobile-specific form editor canvas.
 * Refactored to use useFormCanvasLogic for a cleaner, DRYer implementation.
 */
export const MobileFormEditorCanvas = () => {
  const { methods, save, isLoading } = useFormEditor();
  const { fields, remove, handleAddField, handleCanvasSubmit } =
    useFormCanvasLogic(methods.control, save);

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
