import { api } from "@/api/client";

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
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.postId) params.set("postId", filters.postId);
    const query = params.toString();
    const res = await api.get<ApiEnvelope<AutomationListResponse>>(
      `/automations/list${query ? `?${query}` : ""}`,
    );
    return res.data.result;
  },
};
