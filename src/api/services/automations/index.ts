import { api, request } from "@/api/client";

export type AutomationStatus = "ACTIVE" | "PAUSED" | "DELETED";

export interface AutomationListItem {
  id: string;
  postId: string;
  postCaption: string | null;
  triggers: string[];
  matchType: string;
  actionType: string;
  replyMessage: string;
  status: string;
  timesTriggered: number;
  lastTriggeredAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    executions: number;
  };
}

interface AutomationListResponse {
  automations: AutomationListItem[];
}

// The middleware always wraps responses as { success: true, result: <data> }
interface ApiEnvelope<T> {
  success: boolean;
  result: T;
}

export const automationService = {
  list: async (filters?: {
    status?: AutomationStatus;
    postId?: string;
  }): Promise<AutomationListResponse> => {
    const envelope = await request(
      api.post<ApiEnvelope<AutomationListResponse>>(
        "/automations/list",
        filters ?? {},
      ),
    );
    return envelope.result;
  },

  create: async (
    payload: Record<string, unknown>,
  ): Promise<{ id: string; postId: string }> => {
    const envelope = await request(
      api.post<ApiEnvelope<{ id: string; postId: string }>>(
        "/automations/create",
        payload,
      ),
    );
    return envelope.result;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const envelope = await request(
      api.delete<ApiEnvelope<{ message: string }>>(`/automations/${id}`),
    );
    return envelope.result;
  },
};
