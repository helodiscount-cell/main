"use client";

import { useInstagramStore } from "@/store/instagram";
import {
  useInstagramAccountApi,
  useDisconnectInstagramApi,
} from "@/lib/api/services/instagram/hooks/use-insta-oauth";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

/**
 * Example component showing how to use the Instagram store
 * This demonstrates different ways to access and use the store
 */
export function InstagramAccountStatus() {
  // Fetch account data (this also updates the store)
  useInstagramAccountApi();

  // Get data from Zustand store
  const account = useInstagramStore((state) => state.account);
  const isLoading = useInstagramStore((state) => state.isLoading);
  const isDisconnecting = useInstagramStore((state) => state.isDisconnecting);
  const error = useInstagramStore((state) => state.error);

  // Get disconnect mutation
  const { mutate: disconnect } = useDisconnectInstagramApi();

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg bg-white">
        <p className="text-gray-500">Loading account information...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  // Not connected state
  if (!account || !account.connected) {
    return (
      <div className="p-4 border rounded-lg bg-white">
        <p className="text-gray-500">No Instagram account connected</p>
      </div>
    );
  }

  // Connected state
  return (
    <div className="p-4 border rounded-lg bg-white space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-full">
          <Instagram className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">@{account.username}</h3>
          <p className="text-sm text-gray-500">{account.accountType}</p>
        </div>
      </div>

      <Button
        onClick={() => disconnect()}
        disabled={isDisconnecting}
        variant="outline"
        className="w-full"
      >
        {isDisconnecting ? "Disconnecting..." : "Disconnect Account"}
      </Button>
    </div>
  );
}
