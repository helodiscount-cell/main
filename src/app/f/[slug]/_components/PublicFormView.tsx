"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { formService } from "@/api/services/forms";
import { PublicFieldRenderer } from "./PublicFieldRenderer";
import type { FormPublic } from "@/types/form";
import type { FormField } from "@dm-broo/common-types";
import { useRouter } from "next/navigation";

type PublicFormViewProps = {
  form: FormPublic;
  slug: string;
};

// Renders the interactive public form that anonymous users fill and submit
export const PublicFormView = ({ form, slug }: PublicFormViewProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [activeUploads, setActiveUploads] = useState(0);
  const isMediaUploading = activeUploads > 0;
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm<
    Record<string, string | string[]>
  >({ defaultValues: {} });

  const handleUploadStateChange = (uploading: boolean) => {
    setActiveUploads((prev) => (uploading ? prev + 1 : Math.max(0, prev - 1)));
  };

  const onSubmit = async (answers: Record<string, string | string[]>) => {
    setIsLoading(true);

    // Reformat phone fields by stripping the internal '|phone|' separator
    const cleanedAnswers = Object.fromEntries(
      Object.entries(answers).map(([key, value]) => [
        key,
        typeof value === "string" && value.includes("|phone|")
          ? value.replace("|phone|", "")
          : value,
      ]),
    ) as Record<string, string | string[]>;

    try {
      await formService.submit(slug, cleanedAnswers);
      setSubmitted(true);
    } catch (error: any) {
      const message =
        error?.response?.data?.error ??
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Replace the form with a thank-you screen after successful submission
  if (submitted) router.push(`/f/${slug}/submitted`);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {form.fields.map((field: FormField) => (
        <PublicFieldRenderer
          key={field.id}
          field={field}
          register={register}
          setValue={setValue}
          watch={watch}
          onUploadStateChange={handleUploadStateChange}
        />
      ))}

      <button
        type="submit"
        disabled={isLoading || isMediaUploading}
        className="w-full bg-[#6A06E4] hover:bg-[#5a05c4] disabled:opacity-60 text-white font-semibold py-3 rounded-md transition-colors"
      >
        {isLoading
          ? "Submitting..."
          : isMediaUploading
            ? "Uploading..."
            : "Submit"}
      </button>
    </form>
  );
};
