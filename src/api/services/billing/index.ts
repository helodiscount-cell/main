import { api, request } from "@/api/client";
import { type PlanId } from "@/configs/plans.config";

export interface CheckoutResponse {
  checkoutUrl: string;
}

export interface FeatureGatesResponse {
  state: {
    currentPlan: string | PlanId;
    [key: string]: any;
  };
}

export const billingService = {
  checkout: async (planId: PlanId): Promise<CheckoutResponse> => {
    return request(api.post<CheckoutResponse>("/billing/checkout", { planId }));
  },

  getFeatureGates: async (): Promise<FeatureGatesResponse> => {
    return request(api.get<FeatureGatesResponse>("/billing/feature-gates"));
  },
};
