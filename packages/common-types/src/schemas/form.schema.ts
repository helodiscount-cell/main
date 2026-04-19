import { z } from "zod";

// All supported field types — drives the AddFieldDialog picker
export const FieldTypeSchema = z.enum([
  "text",
  "number",
  "email",
  "url",
  "phone",
  "location",
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

// Common name schema for internal use and external API
export const FormNameSchema = z
  .string()
  .min(1, "Form name is required")
  .refine(
    (val) => val !== "Untitled Form",
    "Please provide a custom form name",
  );

// Top-level form values managed by react-hook-form
export const FormValuesSchema = z.object({
  name: FormNameSchema,
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  coverImage: z.string().optional(),
  submitButtonLabel: z.string().default("Submit"),
  fields: z.array(FormFieldSchema).min(1, "Please provide atleast one fields"),
});

// What the frontend POSTs to save a form
export const CreateFormSchema = z.object({
  name: FormNameSchema,
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  coverImage: z.string().url().optional(),
  fields: z.array(FormFieldSchema).min(1, "Please provide atleast one fields"),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  submitButtonLabel: z.string().default("Submit"),
});

// Status values for a form
export const FormStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

// A single answer — string for text-based fields, string[] for checkbox
export const FormSubmissionAnswerSchema = z.record(
  z.string(),
  z.union([z.string(), z.array(z.string()), z.null()]),
);

// What an anonymous visitor POSTs to submit a form
export const SubmitFormSchema = z.object({
  answers: FormSubmissionAnswerSchema,
});
