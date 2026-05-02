import { prisma } from "@/server/db";
import { executeWithErrorHandling } from "../repository-utils";
import type { CreateFormInput, FormStatus } from "@dm-broo/common-types";
import type { Form, FormSubmission } from "@prisma/client";

// Generates a short 8-char alphanumeric slug from a UUID
function generateSlug(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}

// Creates a form scoped to a workspace. Retries up to 5 times on slug collision (P2002)
export async function createForm(
  userId: string,
  instaAccountId: string,
  data: CreateFormInput,
): Promise<Form> {
  let attempts = 0;

  while (attempts < 5) {
    const slug = generateSlug();

    try {
      return await prisma.form.create({
        data: {
          userId,
          instaAccountId,
          name: data.name || data.title,
          title: data.title,
          description: data.description ?? "",
          coverImage: data.coverImage ?? null,
          fields: (data.fields ?? []) as any,
          slug,
          status: data.status ?? "DRAFT",
          submitButtonLabel: data.submitButtonLabel ?? "Submit",
        },
      });
    } catch (error: any) {
      // Retry only on unique constraint violation (slug collision)
      if (error?.code === "P2002") {
        attempts++;
        continue;
      }
      throw error;
    }
  }

  throw new Error("Failed to generate a unique slug after 5 attempts");
}

// Returns total form count for a workspace — used for FREE plan cap enforcement
export async function countFormsByInstaAccountId(
  instaAccountId: string,
): Promise<number> {
  return prisma.form.count({ where: { instaAccountId } });
}

// All forms for a workspace, ordered newest first. Optionally filter by status.
export async function findFormsByInstaAccountId(
  instaAccountId: string,
  status?: FormStatus,
): Promise<Form[]> {
  return executeWithErrorHandling(
    () =>
      prisma.form.findMany({
        where: {
          instaAccountId,
          ...(status ? { status } : {}),
        },
        orderBy: { createdAt: "desc" },
      }),
    { operation: "findFormsByInstaAccountId", model: "Form", fallback: [] },
  );
}

// Single form by DB id — no ownership check (caller must verify)
export async function findFormById(formId: string): Promise<Form | null> {
  return executeWithErrorHandling(
    () => prisma.form.findUnique({ where: { id: formId } }),
    { operation: "findFormById", model: "Form", fallback: null },
  );
}

// Ownership-scoped get — returns null if form doesn't belong to the user
export async function findFormByIdAndUserId(
  formId: string,
  userId: string,
): Promise<Form | null> {
  return executeWithErrorHandling(
    () =>
      prisma.form.findFirst({
        where: { id: formId, userId },
        include: { submissions: false },
      }),
    { operation: "findFormByIdAndUserId", model: "Form", fallback: null },
  );
}

// Used by the public page and submission handler
export async function findFormBySlug(slug: string): Promise<Form | null> {
  return executeWithErrorHandling(
    () => prisma.form.findUnique({ where: { slug } }),
    { operation: "findFormBySlug", model: "Form", fallback: null },
  );
}

// Saves a submission + atomically increments submissionCount
export async function createFormSubmission(
  formId: string,
  answers: Record<string, string | string[] | null>,
  meta: { ipAddress?: string; userAgent?: string },
): Promise<FormSubmission> {
  const [submission] = await prisma.$transaction([
    prisma.formSubmission.create({
      data: {
        formId,
        answers,
        ipAddress: meta.ipAddress ?? null,
        userAgent: meta.userAgent ?? null,
      },
    }),
    prisma.form.update({
      where: { id: formId },
      data: { submissionCount: { increment: 1 } },
    }),
  ]);

  return submission;
}

// Hard deletes a form by id (submissions cascade via DB constraint)
export async function deleteFormById(formId: string): Promise<void> {
  await executeWithErrorHandling(
    () => prisma.form.delete({ where: { id: formId } }),
    { operation: "deleteFormById", model: "Form" },
  );
}

// All submissions for a form, newest first
export async function findSubmissionsByFormId(
  formId: string,
): Promise<FormSubmission[]> {
  return executeWithErrorHandling(
    () =>
      prisma.formSubmission.findMany({
        where: { formId },
        orderBy: { submittedAt: "desc" },
      }),
    {
      operation: "findSubmissionsByFormId",
      model: "FormSubmission",
      fallback: [],
    },
  );
}

// Updates an existing form
export async function updateForm(
  formId: string,
  data: Partial<CreateFormInput>,
): Promise<Form> {
  return executeWithErrorHandling(
    () =>
      prisma.form.update({
        where: { id: formId },
        data: {
          name: data.name,
          title: data.title,
          description: data.description,
          coverImage: data.coverImage,
          ...(data.fields !== undefined && { fields: data.fields as any }),
          status: data.status,
          submitButtonLabel: data.submitButtonLabel,
        },
      }),
    { operation: "updateForm", model: "Form" },
  );
}
