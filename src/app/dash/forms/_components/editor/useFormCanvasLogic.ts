"use client";

import { useCallback } from "react";
import { useFieldArray, Control } from "react-hook-form";
import type { FieldType, FormValues } from "@dm-broo/common-types";

/**
 * Shared logic for the form canvas.
 * Extracts field array management and submit handlers.
 */
export const useFormCanvasLogic = (
  control: Control<FormValues>,
  save: (status: "DRAFT" | "PUBLISHED") => void,
) => {
  const { fields, append, remove } = useFieldArray({
    control,
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

  return {
    fields,
    append,
    remove,
    handleAddField,
    handleCanvasSubmit,
  };
};
