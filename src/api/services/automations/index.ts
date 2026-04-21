import { api, request } from "@/api/client";
import { ApiResponse } from "@/api/types";
import {
  AutomationStatus,
  AutomationListItem,
  AutomationListResponse,
} from "@/api/services/automations/types";

export const automationService = {
  list: async (filters?: {
    status?: AutomationStatus;
    postId?: string;
  }): Promise<AutomationListResponse> => {
    const envelope = await request(
      api.post<ApiResponse<AutomationListResponse>>(
        "/automations/list",
        filters ?? {},
      ),
    );
    return envelope.result;
  },

  create: async (
    payload: Record<string, unknown>,
  ): Promise<{ id: string; triggerType: string; warnings?: string[] }> => {
    const envelope = await request(
      api.post<
        ApiResponse<{ id: string; triggerType: string; warnings?: string[] }>
      >("/automations/create", payload),
    );
    return envelope.result;
  },

  getById: async (id: string): Promise<{ automation: AutomationListItem }> => {
    const envelope = await request(
      api.get<ApiResponse<{ automation: AutomationListItem }>>(
        `/automations/${id}`,
      ),
    );
    return envelope.result;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const envelope = await request(
      api.delete<ApiResponse<{ message: string }>>(`/automations/${id}`),
    );
    return envelope.result;
  },

  update: async (
    id: string,
    payload: Record<string, unknown>,
  ): Promise<{ automation: AutomationListItem }> => {
    const envelope = await request(
      api.patch<ApiResponse<{ automation: AutomationListItem }>>(
        `/automations/${id}`,
        payload,
      ),
    );
    return envelope.result;
  },
};
