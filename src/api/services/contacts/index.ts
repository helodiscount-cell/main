import { api, request } from "@/api/client";
import { ApiResponse } from "@/api/types";
import {
  ContactsListParams,
  ContactsListResponse,
} from "@/api/services/contacts/types";

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
