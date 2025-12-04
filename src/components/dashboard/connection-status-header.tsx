"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle, RefreshCw } from "lucide-react";
import type { InstagramStatusConnected } from "@insta-auto/common-types";

interface ConnectionStatusHeaderProps {
  status: InstagramStatusConnected;
  onFetchPosts: () => void;
  isFetchingPosts: boolean;
  postsCount: number;
}

// Renders connection status header with username and connection date
export const ConnectionStatusHeader = ({
  status,
  onFetchPosts,
  isFetchingPosts,
  postsCount,
}: ConnectionStatusHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-border/50">
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center justify-center size-12 rounded-xl bg-linear-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <CheckCircle className="size-6 text-green-500 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            @{status.username}
          </h1>
          <p className="text-sm text-muted-foreground">
            Connected on{" "}
            {new Date(status.connectedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <Button
        onClick={onFetchPosts}
        disabled={isFetchingPosts}
        variant="outline"
        size="lg"
        className="group w-full sm:w-auto bg-linear-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 transition-all duration-300"
      >
        {isFetchingPosts ? (
          <>
            <Spinner className="size-4 mr-2" />
            Loading...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 size-4 group-hover:rotate-180 transition-transform duration-500" />
            {postsCount > 0 ? "Refresh Posts" : "Fetch Posts"}
          </>
        )}
      </Button>
    </div>
  );
};


