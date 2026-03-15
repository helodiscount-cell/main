"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormValuesSchema =
  exports.FormFieldSchema =
  exports.FormFieldOptionSchema =
  exports.FieldTypeSchema =
    void 0;
const zod_1 = require("zod");
// All supported field types — drives the AddFieldDialog picker
exports.FieldTypeSchema = zod_1.z.enum([
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
exports.FormFieldOptionSchema = zod_1.z.object({
  id: zod_1.z.string(),
  label: zod_1.z.string(),
});
// A single field on the form
exports.FormFieldSchema = zod_1.z.object({
  id: zod_1.z.string(),
  type: exports.FieldTypeSchema,
  label: zod_1.z.string().min(1, "Label is required"),
  placeholder: zod_1.z.string().optional(),
  required: zod_1.z.boolean(),
  options: zod_1.z.array(exports.FormFieldOptionSchema).optional(),
});
// Top-level form values managed by react-hook-form
exports.FormValuesSchema = zod_1.z.object({
  title: zod_1.z.string().min(1, "Title is required"),
  description: zod_1.z.string(),
  coverImage: zod_1.z.string().optional(),
  fields: zod_1.z.array(exports.FormFieldSchema),
});
