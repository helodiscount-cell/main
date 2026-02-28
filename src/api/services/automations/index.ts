import { api, request } from "@/api/client";
import { ApiResponse } from "../instagram/types";

export type AutomationStatus = "ACTIVE" | "PAUSED";

export interface AutomationListItem {
  id: string;
  triggerType: "COMMENT_ON_POST" | "STORY_REPLY";
  post: { id: string; caption: string | null } | null;
  story: {
    id: string;
    mediaUrl: string;
    mediaType: string;
    caption: string | null;
    permalink: string;
    timestamp: string;
  } | null;
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
  ): Promise<{ id: string; triggerType: string }> => {
    const envelope = await request(
      api.post<ApiResponse<{ id: string; triggerType: string }>>(
        "/automations/create",
        payload,
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
};
