"use client";

import {
  useInstagramAccountApi,
  useStartInstagramOAuthApi,
  useDisconnectInstagramApi,
} from "@/lib/api/services/instagram/hooks/use-insta-oauth";
import { useInstagramStore } from "@/store/instagram";

export function useInstagram() {
  // Fetch account data (this updates the store automatically)
  const { refetch } = useInstagramAccountApi();

  // Get mutations
  const { mutate: connectMutation } = useStartInstagramOAuthApi();
  const { mutate: disconnectMutation } = useDisconnectInstagramApi();

  // Get state from store
  const account = useInstagramStore((state) => state.account);
  const isLoading = useInstagramStore((state) => state.isLoading);
  const isConnecting = useInstagramStore((state) => state.isConnecting);
  const isDisconnecting = useInstagramStore((state) => state.isDisconnecting);
  const error = useInstagramStore((state) => state.error);
  const clearError = useInstagramStore((state) => state.clearError);

  // Simple wrapper functions
  const connect = (returnUrl: string) => connectMutation(returnUrl);
  const disconnect = () => disconnectMutation();
  const refresh = () => refetch();

  // Check if connected
  const isConnected = account !== null && account.connected;

  // Check if any operation is in progress
  const isBusy = isLoading || isConnecting || isDisconnecting;

  return {
    // Account data
    account,
    isConnected,

    // Loading states
    isLoading,
    isConnecting,
    isDisconnecting,
    isBusy,

    // Error
    error,
    clearError,

    // Actions
    connect,
    disconnect,
    refresh,
  };
}
