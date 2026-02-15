"use client";

import {
  useInstagramAccountApi,
  useStartInstagramOAuthApi,
  useDisconnectInstagramApi,
} from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Instagram, Loader2, CheckCircle2, XCircle } from "lucide-react";

/**
 * Example component showing complete React Query integration
 * This demonstrates all the Instagram OAuth hooks in action
 */
export function InstagramOAuthExample() {
  // Query: Get account information
  const {
    data: account,
    isLoading: isLoadingAccount,
    error: accountError,
  } = useInstagramAccountApi();

  // Mutation: Start OAuth flow
  const { mutate: start, isPending: isStartingOAuth } =
    useStartInstagramOAuthApi();

  // Mutation: Disconnect account
  const { mutate: disconnect, isPending: isDisconnecting } =
    useDisconnectInstagramApi();

  const isLoading = isLoadingAccount || isStartingOAuth || isDisconnecting;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Instagram className="w-5 h-5" />
          Instagram Connection
        </CardTitle>
        <CardDescription>
          Connect your Instagram account to enable automation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Loading State */}
        {isLoadingAccount && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        )}

        {/* Error State */}
        {accountError && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-600">
              Failed to load account information
            </p>
          </div>
        )}

        {/* Connected State */}
        {!isLoadingAccount && account?.connected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">
                  Connected as @{account.username}
                </p>
                <p className="text-xs text-green-700">
                  Account Type: {account.accountType}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => disconnect()}
              disabled={isDisconnecting}
              className="w-full"
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                "Disconnect Instagram"
              )}
            </Button>
          </div>
        )}

        {/* Disconnected State */}
        {!isLoadingAccount && !account?.connected && !accountError && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                Connect your Instagram Business or Creator account to get
                started
              </p>
            </div>

            <Button
              onClick={() => start(undefined)}
              disabled={isStartingOAuth}
              className="w-full bg-[#6A06E4] hover:bg-[#5a05c4]"
            >
              {isStartingOAuth ? (
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

        {/* Info */}
        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            We'll never post without your permission
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Usage in a page:
 *
 * import { InstagramOAuthExample } from "@/components/examples/InstagramOAuthExample";
 * import { useInstagramOAuthCallback } from "@/hooks";
 *
 * export default function Page() {
 *   useInstagramOAuthCallback(); // Handle OAuth callback
 *
 *   return (
 *     <div className="container mx-auto py-8">
 *       <InstagramOAuthExample />
 *     </div>
 *   );
 * }
 */
