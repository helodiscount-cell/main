import { api, request } from "@/api/client";
import { ApiResponse } from "@/types/api";
import { Contact } from "@/components/dash/contacts/types";

export interface ContactsListResponse {
  contacts: Contact[];
}

export const contactsService = {
  list: async (): Promise<ContactsListResponse> => {
    const envelope = await request(
      api.get<ApiResponse<ContactsListResponse>>("/contacts"),
    );
    return envelope.result;
  },
};
