"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  LucideInstagram,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useApi } from "@/hooks/use-api";
import { useUser } from "@clerk/nextjs";
import {
  InstagramStatusConnectedResponse,
  InstagramConnectRequestBody,
  InstagramConnectSuccessResponse,
  InstagramPostsSuccessResponse,
  InstagramPost,
  BeErrorResponse,
  InstagramStatusDisconnectedResponse,
} from "@/types";
import { InstagramConnectRequestSchema } from "@/types/instagram";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import InstagramConnect from "@/components/instagram/connect";
import PostCard from "@/components/instagram/PostCard";

export default function DashboardPage() {
  const { user: clerkUser } = useUser();

  // Status: /instagram/status
  const {
    execute: getInstaConnectionStatus,
    loading: isCheckingStatus,
    error: checkStatusError,
    data: statusData,
  } = useApi<
    InstagramStatusConnectedResponse | InstagramStatusDisconnectedResponse
  >();

  // Connect: /instagram/connect
  const {
    execute: connectInstagram,
    loading: isConnecting,
    error: connectError,
    data: connectData,
  } = useApi<InstagramConnectSuccessResponse>();

  // Posts: /instagram/posts
  const {
    execute: fetchPosts,
    loading: isFetchingPosts,
    error: fetchPostsError,
    data: postsData,
  } = useApi<InstagramPostsSuccessResponse>();

  // Extracts posts array safely from response
  const posts: InstagramPost[] = postsData?.posts ?? [];

  // Determines connection status safely
  const isConnected = statusData && statusData.connected === true;
  const connectedStatus = isConnected
    ? (statusData as InstagramStatusConnectedResponse)
    : null;

  // Computes error message for unified display
  const errorBanner =
    checkStatusError || connectError || fetchPostsError
      ? getErrorMessage(checkStatusError || connectError || fetchPostsError)
      : null;

  // Handles Instagram connect using zod validation
  const handleConnectInstagram = async () => {
    try {
      // Creates raw data from Clerk user
      const bodyRaw = {
        fullName: clerkUser?.firstName,
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? undefined,
        imageUrl: clerkUser?.imageUrl ?? null,
      };

      // Validates request body using zod schema to guarantee type-safety
      const parseResult = InstagramConnectRequestSchema.safeParse(bodyRaw);
      if (!parseResult.success) {
        // Shows validation error if input does not pass zod schema
        toast.error("Validation error. Please check your input.");
        return;
      }

      // Calls connect API with valid data
      const result = await connectInstagram("/instagram/connect", "POST", {
        body: parseResult.data,
      });

      if (result) {
        toast.success(`Successfully connected @${result.data.username}!`);
        // Refreshes connection status after successful connection
        await getInstaConnectionStatus("/instagram/status", "GET");
      }
    } catch (err) {
      // Handles unexpected errors during connection
      toast.error("Failed to connect Instagram. Please try again.");
    }
  };

  const handleFetchPosts = async () => {
    try {
      const result = await fetchPosts("/instagram/posts", "GET");
      if (result && result.posts) {
        toast.success(`Loaded ${result.posts.length} posts successfully!`);
      }
    } catch (err) {
      // Handles unexpected errors during fetch
      toast.error("Failed to fetch posts. Please try again.");
    }
  };

  // Fetches Instagram connection status on mount
  useEffect(() => {
    getInstaConnectionStatus("/instagram/status", "GET");
    // Does not prefetch posts to keep new connections fresh
  }, []);

  // Refetches status after successful connection
  useEffect(() => {
    if (connectData) {
      getInstaConnectionStatus("/instagram/status", "GET");
    }
  }, [connectData]);

  // Loading state for status check
  if (isCheckingStatus) {
    return (
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-screen">
          <Spinner className="size-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl min-h-[80vh]">
      {/* Error Banner */}
      {errorBanner && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{errorBanner}</p>
          </div>
        </div>
      )}

      {/* Shows Instagram connect panel when not connected */}
      {!isConnected && (
        <InstagramConnect
          handleConnectInstagram={handleConnectInstagram}
          isConnecting={isConnecting}
        />
      )}

      {/* Shows Instagram posts when connected */}
      {isConnected && connectedStatus && (
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                <CheckCircle
                  className="text-green-600 dark:text-green-400"
                  size={20}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  @{connectedStatus.username}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Connected on{" "}
                  {new Date(connectedStatus.connectedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Fetch Posts Button */}
            <Button
              onClick={handleFetchPosts}
              disabled={isFetchingPosts}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {isFetchingPosts ? (
                <>
                  <Spinner className="size-4 mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2" size={16} />
                  {posts.length > 0 ? "Refresh Posts" : "Fetch Posts"}
                </>
              )}
            </Button>
          </div>

          {/* Shows Instagram posts grid when posts are loaded */}
          {posts.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {posts.length} {posts.length === 1 ? "post" : "posts"} loaded
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post as InstagramPost} />
                ))}
              </div>
            </div>
          )}

          {/* Shows empty state when no posts are loaded */}
          {posts.length === 0 && !isFetchingPosts && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 border-2 border-dashed dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <LucideInstagram
                className="mx-auto mb-4 text-gray-400 dark:text-gray-600"
                size={48}
              />
              <p className="text-lg font-medium mb-2">No posts yet</p>
              <p className="text-sm">
                Click "Fetch Posts" to load your Instagram posts
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
