"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { formService } from "@/api/services/forms";
import { PublicFieldRenderer } from "./PublicFieldRenderer";
import type { FormPublic } from "@/types/form";
import type { FormField } from "@dm-broo/common-types";

type PublicFormViewProps = {
  form: FormPublic;
  slug: string;
};

// Renders the interactive public form that anonymous users fill and submit
export const PublicFormView = ({ form, slug }: PublicFormViewProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<
    Record<string, string | string[]>
  >({ defaultValues: {} });

  const onSubmit = async (answers: Record<string, string | string[]>) => {
    setIsLoading(true);
    try {
      await formService.submit(slug, answers);
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
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-bold text-slate-900">Thank you!</h2>
        <p className="text-slate-500 max-w-sm">
          Your response has been recorded. We&apos;ll be in touch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {form.fields.map((field: FormField) => (
        <PublicFieldRenderer
          key={field.id}
          field={field}
          register={register}
          setValue={setValue}
          watch={watch}
        />
      ))}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#6A06E4] hover:bg-[#5a05c4] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};
