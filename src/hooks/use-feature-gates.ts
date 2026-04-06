"use client";

import { useQuery } from "@tanstack/react-query";
import { billingKeys } from "@/keys/react-query";
import { FeatureGates } from "@/server/services/billing/feature-gates";

/**
 * useFeatureGates Hook
 * Fetches the current user's feature access and subscription state.
 * Uses React Query for caching and automatic re-fetching.
 */
export function useFeatureGates() {
  return useQuery<FeatureGates>({
    queryKey: billingKeys.featureGates(),
    queryFn: async () => {
      const response = await fetch("/api/billing/feature-gates");
      if (!response.ok) {
        throw new Error("Failed to fetch feature gates");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
