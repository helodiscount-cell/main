import { api, request } from "@/api/client";
import { ApiResponse } from "@/types/api";
import { Contact } from "@/types/contact";

export interface ContactsListResponse {
  contacts: Contact[];
  nextCursor?: string;
}

export const contactsService = {
  list: async (
    limit: number = 20,
    cursor?: string,
    query?: string,
  ): Promise<ContactsListResponse> => {
    // Construct query parameters
    const params = new URLSearchParams();
    params.set("limit", limit.toString());
    if (cursor) {
      params.set("cursor", cursor);
    }
    if (query) {
      params.set("q", query);
    }

    const envelope = await request(
      api.get<ApiResponse<ContactsListResponse>>(
        `/contacts?${params.toString()}`,
      ),
    );
    return envelope.result;
  },
};
