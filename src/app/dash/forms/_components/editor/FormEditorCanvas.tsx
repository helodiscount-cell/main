"use client";

import React, { useCallback } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValuesSchema } from "@dm-broo/common-types";
import type { FormValues, FieldType } from "@dm-broo/common-types";
import { CoverImageUpload } from "./CoverImageUpload";
import { FormTitleSection } from "./FormTitleSection";
import { FieldCard } from "./FieldCard";
import { AddFieldButton } from "./AddFieldButton";
import { SubmitButton } from "./SubmitButton";

import { toast } from "sonner";

const DEFAULT_FORM_VALUES: FormValues = {
  title: "",
  description: "",
  coverImage: undefined,
  fields: [],
};

// Orchestrates the canvas: form state, field array, submit handler
export const FormEditorCanvas = () => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(FormValuesSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "fields",
  });

  // Appends a new field with sensible defaults
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

  // Final submit — logs entire form to console for now
  const handleSubmit = methods.handleSubmit(
    (data) => {
      console.log("[FormEditor] Submit:", data);
      toast.success("Form data logged to console!");
    },
    (errors) => {
      console.error("[FormEditor] Errors:", errors);
      toast.error("Please fix the errors in the form.");
    },
  );

  return (
    <div className="flex-1 bg-[#E0E0E0] overflow-y-auto p-6 m-4 rounded-xl">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
          {/* Cover image banner */}
          <CoverImageUpload />

          {/* Title + description */}
          <FormTitleSection />

          {/* Dynamic field cards */}
          <div className="space-y-4 h-[calc(100vh-600px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {fields.map((field, index) => (
              <FieldCard
                key={field.id}
                index={index}
                onRemove={() => remove(index)}
              />
            ))}
          </div>

          {/* Add field picker */}
          <AddFieldButton onAddField={handleAddField} />

          {/* Submit */}
          <SubmitButton />
        </form>
      </FormProvider>
    </div>
  );
};
