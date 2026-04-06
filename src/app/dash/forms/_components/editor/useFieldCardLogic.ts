"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import type { FormValues, FieldType } from "@dm-broo/common-types";

/**
 * Shared logic for form fields (FieldCard & MobileFieldCard).
 * Extracts form context, watchers, and option management to keep components DRY.
 */
export const useFieldCardLogic = (index: number) => {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<FormValues>();

  const fieldType = watch(`fields.${index}.type`);
  const isRequired = watch(`fields.${index}.required`);

  const {
    fields: options,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    // @ts-ignore - Dynamic path for nested field array
    name: `fields.${index}.options`,
  });

  const toggleRequired = () => {
    setValue(`fields.${index}.required`, !isRequired, {
      shouldDirty: true,
    });
  };

  const showOptions = fieldType === "dropdown" || fieldType === "checkbox";

  return {
    register,
    fieldType,
    isRequired,
    toggleRequired,
    options,
    appendOption,
    removeOption,
    errors,
    showOptions,
  };
};

// Shared constants for field rendering
export const FIELD_INPUT_TYPE_MAP: Partial<Record<FieldType, string>> = {
  text: "text",
  number: "number",
  email: "email",
  url: "url",
  phone: "tel",
  date: "date",
};
