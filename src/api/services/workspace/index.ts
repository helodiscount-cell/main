import { api, request } from "@/api/client";
import { ApiResponse } from "@/types/api";

export interface WorkspaceProfile {
  username: string;
  profilePictureUrl: string | null;
}

export const workspaceClientService = {
  getProfile: async (): Promise<ApiResponse<WorkspaceProfile>> => {
    return request(
      api.get<ApiResponse<WorkspaceProfile>>("/workspace/profile"),
    );
  },
};
