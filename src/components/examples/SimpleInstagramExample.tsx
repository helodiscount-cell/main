"use client";

import { useInstagram } from "@/hooks/instagram/use-instagram";
import { Button } from "@/components/ui/button";
import { Instagram, Loader2 } from "lucide-react";

/**
 * Simple example component using the all-in-one useInstagram hook
 * This is the easiest way to work with Instagram in your app
 */
export function SimpleInstagramExample() {
  // Get everything you need from one hook
  const instagram = useInstagram();

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Instagram Connection</h2>

      {/* Error Display */}
      {instagram.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{instagram.error}</p>
          <button
            onClick={instagram.clearError}
            className="text-red-600 text-xs underline mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {instagram.isLoading && (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading account information...</span>
        </div>
      )}

      {/* Connected State */}
      {instagram.isConnected && instagram.account && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Instagram className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-900">
                @{instagram.account.username}
              </p>
              <p className="text-sm text-green-700">
                {instagram.account.accountType}
              </p>
            </div>
          </div>

          <Button
            onClick={instagram.disconnect}
            disabled={instagram.isDisconnecting}
            variant="outline"
            className="w-full"
          >
            {instagram.isDisconnecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Disconnecting...
              </>
            ) : (
              "Disconnect Account"
            )}
          </Button>
        </div>
      )}

      {/* Not Connected State */}
      {!instagram.isConnected && !instagram.isLoading && (
        <div className="space-y-3">
          <p className="text-gray-600">
            Connect your Instagram account to get started
          </p>

          <Button
            onClick={instagram.connect}
            disabled={instagram.isConnecting}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {instagram.isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Instagram className="w-4 h-4 mr-2" />
                Connect Instagram
              </>
            )}
          </Button>
        </div>
      )}

      {/* Refresh Button */}
      <Button
        onClick={instagram.refresh}
        disabled={instagram.isBusy}
        variant="ghost"
        size="sm"
        className="w-full"
      >
        Refresh Status
      </Button>
    </div>
  );
}
