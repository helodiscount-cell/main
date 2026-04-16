"use client";

import {
  useFormContext,
  useFieldArray,
  type FieldArrayPath,
} from "react-hook-form";
import type { FormValues, FieldType } from "@dm-broo/common-types";

/**
 * Shared logic for form fields.
 * Extracts form context, watchers, and option management.
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
    name: `fields.${index}.options` as FieldArrayPath<FormValues>,
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
