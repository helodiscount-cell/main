"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instagramService } from "@/lib/api/services/instagram/oauth";
import { toast } from "sonner";
import { useInstagramStore } from "@/store/instagram";

// Query keys for Instagram OAuth
export const instagramKeys = {
  all: ["instagram"] as const,
  account: () => [...instagramKeys.all, "account"] as const,
};

/**
 * Hook to get Instagram account information
 * Syncs data with Zustand store
 */
export function useInstagramAccountApi() {
  const setAccount = useInstagramStore((state) => state.setAccount);
  const setLoading = useInstagramStore((state) => state.setLoading);
  const setError = useInstagramStore((state) => state.setError);

  return useQuery({
    queryKey: instagramKeys.account(),
    queryFn: async () => {
      setLoading(true);
      try {
        const account = await instagramService.profile.getAccountInfo();
        setAccount(account);
        setError(null);
        return account;
      } catch (error: any) {
        setError(error?.response?.data?.message || "Failed to fetch account");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    retry: false,
  });
}

/**
 * Hook to start Instagram OAuth flow
 * Updates Zustand store with connecting state
 */
export function useStartInstagramOAuthApi() {
  const setConnecting = useInstagramStore((state) => state.setConnecting);
  const setError = useInstagramStore((state) => state.setError);

  return useMutation({
    mutationFn: async (returnUrl: string) => {
      setConnecting(true);
      setError(null);
      await instagramService.oauth.connect(returnUrl);
    },
    onError: (error: any) => {
      setConnecting(false);
      const errorMessage =
        error?.response?.data?.message || "Failed to start Instagram OAuth";
      setError(errorMessage);
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook to disconnect Instagram account
 * Updates Zustand store after disconnection
 */
export function useDisconnectInstagramApi() {
  const queryClient = useQueryClient();
  const setDisconnecting = useInstagramStore((state) => state.setDisconnecting);
  const setAccount = useInstagramStore((state) => state.setAccount);
  const setError = useInstagramStore((state) => state.setError);

  return useMutation({
    mutationFn: async () => {
      setDisconnecting(true);
      setError(null);
      await instagramService.oauth.disconnect();
    },
    onSuccess: () => {
      setDisconnecting(false);
      setAccount(null);
      // Invalidate account query to refetch
      queryClient.invalidateQueries({ queryKey: instagramKeys.account() });
      toast.success("Instagram account disconnected successfully");
    },
    onError: (error: any) => {
      setDisconnecting(false);
      const errorMessage =
        error?.response?.data?.message || "Failed to disconnect Instagram";
      setError(errorMessage);
      toast.error(errorMessage);
    },
  });
}
