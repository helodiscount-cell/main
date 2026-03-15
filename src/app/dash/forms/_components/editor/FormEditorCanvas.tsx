"use client";

import React, { useCallback, useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormValuesSchema } from "@dm-broo/common-types";
import type { FormValues, FieldType } from "@dm-broo/common-types";
import { formService } from "@/api/services/forms";
import { CoverImageUpload } from "./CoverImageUpload";
import { FormTitleSection } from "./FormTitleSection";
import { FieldCard } from "./FieldCard";
import { AddFieldButton } from "./AddFieldButton";
import { SubmitButton } from "./SubmitButton";
import { EditorHeader } from "./EditorHeader";

const DEFAULT_FORM_VALUES: FormValues = {
  title: "",
  description: "",
  coverImage: undefined,
  fields: [],
};

// Orchestrates the full editor — form state, field array, save & publish
export const FormEditorCanvas = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<FormValues>({
    resolver: zodResolver(FormValuesSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

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

  // Saves the form to the backend with the given status
  const save = useCallback(
    async (status: "DRAFT" | "PUBLISHED") => {
      const isValid = await methods.trigger();

      if (!isValid) {
        toast.error("Please fix the errors before saving.");
        return;
      }

      const data = methods.getValues();
      setIsLoading(true);

      try {
        const result = await formService.create({ ...data, status });
        toast.success(
          status === "PUBLISHED"
            ? `Published! Public URL: /f/${result.slug}`
            : "Saved as draft.",
        );
        router.push("/dash/forms");
      } catch (error: any) {
        const message =
          error?.response?.data?.error ?? "Something went wrong. Try again.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [methods, router],
  );

  // Separate save handlers for header buttons
  const handleSaveDraft = useCallback(() => save("DRAFT"), [save]);
  const handlePublish = useCallback(() => save("PUBLISHED"), [save]);

  // Final submit button inside the canvas also publishes
  const handleCanvasSubmit = methods.handleSubmit(
    () => save("PUBLISHED"),
    () => toast.error("Please fix the errors in the form."),
  );

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header with save/publish wired up */}
      <EditorHeader
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isLoading={isLoading}
      />

      {/* Canvas area */}
      <div className="flex-1 bg-[#E0E0E0] overflow-y-auto p-6 m-4 rounded-xl">
        <FormProvider {...methods}>
          <form
            onSubmit={handleCanvasSubmit}
            className="max-w-lg mx-auto space-y-4"
          >
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

            {/* Publish via the canvas submit button */}
            <SubmitButton disabled={isLoading} />
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
