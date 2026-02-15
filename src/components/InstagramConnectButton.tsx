"use client";

import { Button } from "@/components/ui/button";
import {
  useInstagramAccountApi,
  useStartInstagramOAuthApi,
  useDisconnectInstagramApi,
} from "@/lib/api/services/instagram/hooks/use-insta-oauth";
import { Instagram, Loader2 } from "lucide-react";

export function InstagramConnectButton() {
  const { data: account, isLoading: isLoadingAccount } =
    useInstagramAccountApi();
  const { mutate: start, isPending: isStartingOAuth } =
    useStartInstagramOAuthApi();
  const { mutate: disconnect, isPending: isDisconnecting } =
    useDisconnectInstagramApi();

  const isLoading = isLoadingAccount || isStartingOAuth || isDisconnecting;

  if (isLoadingAccount) {
    return (
      <Button disabled className="gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (account?.connected) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Instagram className="w-4 h-4 text-purple-600" />
          <span className="font-medium">@{account.username}</span>
        </div>
        <Button
          variant="outline"
          onClick={() => disconnect()}
          disabled={isDisconnecting}
          className="gap-2"
        >
          {isDisconnecting && <Loader2 className="w-4 h-4 animate-spin" />}
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => start(undefined)}
      disabled={isLoading}
      className="bg-[#6A06E4] hover:bg-[#5a05c4] text-white gap-2"
    >
      {isStartingOAuth ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Instagram className="w-4 h-4" />
          Connect Instagram
        </>
      )}
    </Button>
  );
}
