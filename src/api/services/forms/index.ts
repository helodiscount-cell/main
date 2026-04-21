import { api, request } from "@/api/client";
import type { ApiResponse } from "@/api/types";
import type { CreateFormInput, FormStatus } from "@dm-broo/common-types";
import type {
  FormListItem,
  FormDetail,
  FormPublic,
  FormSubmission,
  FormSaveResult,
} from "@/api/services/forms/form";

export const formService = {
  // Saves a form — returns id + public slug
  create: async (payload: CreateFormInput): Promise<FormSaveResult> => {
    const envelope = await request(
      api.post<ApiResponse<FormSaveResult>>("/forms/create", payload),
    );
    return envelope.result;
  },

  // Updates an existing form
  update: async (
    id: string,
    payload: CreateFormInput,
  ): Promise<FormSaveResult> => {
    const envelope = await request(
      api.patch<ApiResponse<FormSaveResult>>(`/forms/${id}`, payload),
    );
    return envelope.result;
  },

  // Lists all forms for the dashboard
  list: async (params?: { status?: FormStatus }): Promise<FormListItem[]> => {
    const envelope = await request(
      api.get<ApiResponse<FormListItem[]>>("/forms", { params }),
    );
    return envelope.result;
  },

  // Gets a single form for the editor (owner only)
  getById: async (id: string): Promise<FormDetail> => {
    const envelope = await request(
      api.get<ApiResponse<FormDetail>>(`/forms/${id}`),
    );
    return envelope.result;
  },

  // Gets a form for anonymous public consumption
  getPublic: async (slug: string): Promise<FormPublic> => {
    const envelope = await request(
      api.get<ApiResponse<FormPublic>>(`/forms/public/${slug}`),
    );
    return envelope.result;
  },

  // Submits a public form response (no auth)
  submit: async (
    slug: string,
    answers: Record<string, string | string[]>,
  ): Promise<{ submissionId: string; submittedAt: string }> => {
    const envelope = await request(
      api.post<ApiResponse<{ submissionId: string; submittedAt: string }>>(
        `/forms/public/${slug}/submit`,
        { answers },
      ),
    );
    return envelope.result;
  },

  // Lists all submissions for the owner
  getSubmissions: async (formId: string): Promise<FormSubmission[]> => {
    const envelope = await request(
      api.get<ApiResponse<FormSubmission[]>>(`/forms/${formId}/submissions`),
    );
    return envelope.result;
  },

  // Deletes a form (owner only)
  delete: async (formId: string): Promise<{ message: string }> => {
    const envelope = await request(
      api.delete<ApiResponse<{ message: string }>>(`/forms/${formId}`),
    );
    return envelope.result;
  },

  // Duplicates an existing form
  duplicate: async (id: string): Promise<FormSaveResult> => {
    const envelope = await request(
      api.post<ApiResponse<FormSaveResult>>(`/forms/${id}/duplicate`, {}),
    );
    return envelope.result;
  },
};
