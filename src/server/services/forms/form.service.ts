import { z } from "zod";
import { findUserByClerkId } from "@/server/repository/user/user.repository";
import {
  createForm as createFormRecord,
  findFormsByUserId,
  findFormByIdAndUserId,
  findFormBySlug,
  createFormSubmission,
  findSubmissionsByFormId,
  deleteFormById,
} from "@/server/repository/forms";
import { ApiRouteError } from "@/server/middleware/errors/classes";
import type {
  CreateFormInput,
  SubmitFormInput,
  FieldType,
} from "@dm-broo/common-types";
import type { FormFieldEntry } from "@prisma/client";

// Config-driven validators per field type — runs during submission
const FIELD_VALIDATORS: Partial<
  Record<FieldType, (value: unknown, field: FormFieldEntry) => boolean>
> = {
  email: (v) => z.string().email().safeParse(v).success,
  url: (v) => z.string().url().safeParse(v).success,
  number: (v) => typeof v === "string" && !isNaN(Number(v)) && v.trim() !== "",
  phone: (v) => typeof v === "string" && /^\+?[\d\s\-()\u00d7]{7,15}$/.test(v),
  rating: (v) =>
    typeof v === "string" &&
    Number(v) >= 1 &&
    Number(v) <= 5 &&
    Number.isInteger(Number(v)),
  dropdown: (v, f) =>
    typeof v === "string" &&
    ((f.options ?? []) as any[]).some((o: any) => o.label === v),
  checkbox: (v, f) =>
    Array.isArray(v) &&
    v.every((item) =>
      ((f.options ?? []) as any[]).some((o: any) => o.label === item),
    ),
  upload: (v) => typeof v === "string" && v.startsWith("https://"),
};

// Creates a form for the signed-in user, returns the public slug
export async function createForm(clerkId: string, input: CreateFormInput) {
  const user = await findUserByClerkId(clerkId);

  if (!user) {
    throw new ApiRouteError("User not found", "NO_USER", 404);
  }

  const form = await createFormRecord(user.id, input);

  return {
    id: form.id,
    slug: form.slug,
    status: form.status,
    createdAt: form.createdAt,
  };
}

// Lightweight list for the dashboard — no fields array
export async function getUserForms(clerkId: string) {
  const user = await findUserByClerkId(clerkId);

  if (!user) {
    throw new ApiRouteError("User not found", "NO_USER", 404);
  }

  const forms = await findFormsByUserId(user.id);

  return forms.map((f) => ({
    id: f.id,
    title: f.title,
    description: f.description,
    coverImage: f.coverImage,
    slug: f.slug,
    status: f.status,
    submissionCount: f.submissionCount,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
  }));
}

// Full form for the editor — ownership checked
export async function getFormById(clerkId: string, formId: string) {
  const user = await findUserByClerkId(clerkId);

  if (!user) {
    throw new ApiRouteError("User not found", "NO_USER", 404);
  }

  const form = await findFormByIdAndUserId(formId, user.id);

  if (!form) {
    throw new ApiRouteError("Form not found", "NOT_FOUND", 404);
  }

  return form;
}

// Public-facing form data — strips internal fields
export async function getPublicFormBySlug(slug: string) {
  const form = await findFormBySlug(slug);

  if (!form) {
    throw new ApiRouteError("Form not found", "NOT_FOUND", 404);
  }

  return {
    id: form.id,
    title: form.title,
    description: form.description,
    coverImage: form.coverImage,
    fields: form.fields,
  };
}

// Validates and persists a form submission
export async function submitForm(
  slug: string,
  input: SubmitFormInput,
  meta: { ipAddress?: string; userAgent?: string },
) {
  const form = await findFormBySlug(slug);

  if (!form) {
    throw new ApiRouteError("Form not found", "NOT_FOUND", 404);
  }

  // Walk every field and validate the submitted answer
  for (const field of form.fields as FormFieldEntry[]) {
    const answer = input.answers[field.id];
    const isEmpty =
      answer === undefined ||
      answer === null ||
      answer === "" ||
      (Array.isArray(answer) && answer.length === 0);

    if (field.required && isEmpty) {
      throw new ApiRouteError(
        `"${field.label}" is required`,
        "INVALID_ANSWER",
        422,
      );
    }

    // Skip optional fields that weren't answered
    if (isEmpty) continue;

    const validator = FIELD_VALIDATORS[field.type as FieldType];

    if (validator && !validator(answer, field)) {
      throw new ApiRouteError(
        `Invalid value for "${field.label}"`,
        "INVALID_ANSWER",
        422,
      );
    }
  }

  const submission = await createFormSubmission(form.id, input.answers, meta);

  return {
    submissionId: submission.id,
    submittedAt: submission.submittedAt,
  };
}

// Returns all submissions for a form — owner checked
export async function getFormSubmissions(clerkId: string, formId: string) {
  const user = await findUserByClerkId(clerkId);

  if (!user) {
    throw new ApiRouteError("User not found", "NO_USER", 404);
  }

  // Ownership check — returns null if formId doesn't belong to this user
  const form = await findFormByIdAndUserId(formId, user.id);

  if (!form) {
    throw new ApiRouteError("Form not found", "NOT_FOUND", 404);
  }

  return findSubmissionsByFormId(formId);
}

// Deletes a form — ownership verified before deletion
export async function deleteForm(clerkId: string, formId: string) {
  const user = await findUserByClerkId(clerkId);

  if (!user) {
    throw new ApiRouteError("User not found", "NO_USER", 404);
  }

  // Ownership check — returns null if formId doesn't belong to this user
  const form = await findFormByIdAndUserId(formId, user.id);

  if (!form) {
    throw new ApiRouteError("Form not found", "NOT_FOUND", 404);
  }

  await deleteFormById(formId);

  return { message: "Form deleted successfully" };
}
