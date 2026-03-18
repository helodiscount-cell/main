"use client";

import React, { useCallback } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { FormValuesSchema } from "@dm-broo/common-types";
import type { FormValues, FieldType } from "@dm-broo/common-types";
import { formService } from "@/api/services/forms";
import { formKeys } from "@/keys/react-query";
import { CoverImageUpload } from "./CoverImageUpload";
import { FormTitleSection } from "./FormTitleSection";
import { FieldCard } from "./FieldCard";
import { AddFieldButton } from "./AddFieldButton";
import { SubmitButton } from "./SubmitButton";
import { EditorHeader } from "./EditorHeader";
import { useQueryClient } from "@tanstack/react-query";

const DEFAULT_FORM_VALUES: FormValues = {
  title: "",
  description: "",
  coverImage: undefined,
  fields: [],
};

// Orchestrates the full editor — form state, field array, save & publish
export const FormEditorCanvas = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const methods = useForm<FormValues>({
    resolver: zodResolver(FormValuesSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "fields",
  });

  // Mutation handles loading state, error handling, and cache invalidation
  const { mutate: saveForm, isPending: isLoading } = useMutation({
    mutationFn: (payload: FormValues & { status: "DRAFT" | "PUBLISHED" }) =>
      formService.create(payload),
    onSuccess: (result, variables) => {
      toast.success(
        variables.status === "PUBLISHED"
          ? `Published! Public URL: /f/${result.slug}`
          : "Saved as draft.",
      );
      // Invalidate the forms list so the dashboard reflects the new entry
      queryClient.invalidateQueries({ queryKey: formKeys.all });
      router.push("/dash/forms");
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Something went wrong. Try again.";
      toast.error(message);
    },
  });

  // Validates form fields before triggering the mutation
  const save = useCallback(
    async (status: "DRAFT" | "PUBLISHED") => {
      const isValid = await methods.trigger();

      if (!isValid) {
        toast.error("Please fix the errors before saving.");
        return;
      }

      const data = methods.getValues();
      saveForm({ ...data, status });
    },
    [methods, saveForm],
  );

  const handleSaveDraft = useCallback(() => save("DRAFT"), [save]);
  const handlePublish = useCallback(() => save("PUBLISHED"), [save]);

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

  // Canvas submit button also publishes
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
