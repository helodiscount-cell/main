import { z } from "zod";

// All supported field types — drives the AddFieldDialog picker
export const FieldTypeSchema = z.enum([
  "text",
  "number",
  "email",
  "url",
  "phone",
  "location",
  "country",
  "date",
  "dropdown",
  "checkbox",
  "rating",
  "upload",
]);

// Option for choice-based fields
export const FormFieldOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
});

// A single field on the form
export const FormFieldSchema = z.object({
  id: z.string(),
  type: FieldTypeSchema,
  label: z.string().min(1, "Label is required"),
  placeholder: z.string().optional(),
  required: z.boolean(),
  options: z.array(FormFieldOptionSchema).optional(),
});

// Top-level form values managed by react-hook-form
export const FormValuesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  coverImage: z.string().optional(),
  fields: z.array(FormFieldSchema),
});
