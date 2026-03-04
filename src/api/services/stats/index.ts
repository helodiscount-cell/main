import { api, request } from "@/api/client";
import { ApiResponse } from "../instagram/types";

export interface OutreachImpactResponse {
  count: number;
  range: string;
}

export const statsService = {
  getOutreachImpact: async (range: string): Promise<OutreachImpactResponse> => {
    const envelope = await request(
      api.get<ApiResponse<OutreachImpactResponse>>(
        `/stats/outreach-impact?range=${encodeURIComponent(range)}`,
      ),
    );
    return envelope.result;
  },
};
