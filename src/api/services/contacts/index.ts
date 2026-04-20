import { api, request } from "@/api/client";
import { ApiResponse } from "@/types/api";
import { Contact } from "@/types/contact";

export interface ContactsListResponse {
  contacts: Contact[];
  nextCursor?: string;
}

export interface ContactsListParams {
  limit?: number;
  page?: number;
  cursor?: string;
  q?: string;
}

export const contactsService = {
  list: async (
    params: ContactsListParams = {},
  ): Promise<ContactsListResponse> => {
    // Construct query parameters
    const sParams = new URLSearchParams();

    // Default limit if not provided
    const limit = params.limit || 20;
    sParams.set("limit", limit.toString());

    if (params.page) {
      sParams.set("page", params.page.toString());
    }
    if (params.cursor) {
      sParams.set("cursor", params.cursor);
    }
    if (params.q) {
      sParams.set("q", params.q);
    }

    const envelope = await request(
      api.get<ApiResponse<ContactsListResponse>>(
        `/contacts?${sParams.toString()}`,
      ),
    );
    return envelope.result;
  },
};
