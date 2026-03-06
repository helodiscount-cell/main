import { api, request } from "@/api/client";
import { ApiResponse } from "../instagram/types";

export interface OutreachImpactResponse {
  count: number;
  data: ChartDataPoint[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface FollowerGrowthResponse {
  growth: number;
  data: ChartDataPoint[];
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

  getFollowerGrowth: async (range: string): Promise<FollowerGrowthResponse> => {
    const envelope = await request(
      api.get<ApiResponse<FollowerGrowthResponse>>(
        `/stats/followers-growth?range=${encodeURIComponent(range)}`,
      ),
    );
    return envelope.result;
  },

  getBestPerformerStats: async (range: string): Promise<any> => {
    const envelope = await request(
      api.get<ApiResponse<any>>(
        `/stats/best-performer?range=${encodeURIComponent(range)}`,
      ),
    );
    return envelope.result;
  },
};
