"use client";

import { useEffect, useState } from "react";
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
  InstagramConnectSuccessResponse,
  InstagramPostsSuccessResponse,
  InstagramPost,
  InstagramStatusDisconnectedResponse,
} from "@/types";
import { InstagramConnectRequestSchema } from "@/types/zod";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import InstagramConnect from "@/components/instagram/connect";
import PostCard from "@/components/instagram/PostCard";
import AutomationCard from "@/components/automations/AutomationCard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [automations, setAutomations] = useState<any[]>([]);

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

  // Automations: /automations/list
  const {
    execute: fetchAutomations,
    loading: isFetchingAutomations,
    error: fetchAutomationsError,
    data: automationsData,
  } = useApi<any>();

  // Update automation: /automations/[id]
  const { execute: updateAutomation, loading: isUpdatingAutomation } =
    useApi<any>();

  // Delete automation: /automations/[id]
  const { execute: deleteAutomation, loading: isDeletingAutomation } =
    useApi<any>();

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

  // Handles Instagram connect using OAuth flow
  const handleConnectInstagram = () => {
    // Redirects to OAuth authorize endpoint
    // The callback will return to dashboard with status
    window.location.href =
      "/api/instagram/oauth/authorize?returnUrl=/dashboard";
  };

  // Fetches posts from API and stores them in localStorage
  const handleFetchPosts = async () => {
    try {
      const result = await fetchPosts("/instagram/posts", "GET");
      if (result?.posts) {
        setPosts(result.posts);
        localStorage.setItem("instagram_posts", JSON.stringify(result.posts));
        toast.success(`Loaded ${result.posts.length} posts successfully!`);
      }
    } catch (err) {
      toast.error("Failed to fetch posts. Please try again.");
    }
  };

  // Navigates to the individual post detail page using the post ID
  const handlePostClick = (post: InstagramPost) => {
    router.push(`/posts/${post.id}`);
  };

  // Handles OAuth callback parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    const error = params.get("error");

    if (connected === "true") {
      toast.success("Instagram connected successfully!");
      // Cleans up URL
      window.history.replaceState({}, "", "/dashboard");
    } else if (error) {
      const errorMessages: Record<string, string> = {
        oauth_declined: "You declined the Instagram authorization.",
        oauth_invalid: "Invalid OAuth response from Instagram.",
        oauth_invalid_state: "OAuth security check failed. Please try again.",
        invalid_account_type:
          "Please use an Instagram Business or Creator account.",
        oauth_failed: "Failed to connect Instagram. Please try again.",
      };

      toast.error(
        errorMessages[error] || "Failed to connect Instagram. Please try again."
      );
      // Cleans up URL
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);

  // Fetches Instagram connection status on mount
  useEffect(() => {
    getInstaConnectionStatus("/instagram/status", "GET");
  }, []);

  // Loads posts from localStorage when connection status is confirmed
  useEffect(() => {
    if (isConnected) {
      try {
        const storedPosts = localStorage.getItem("instagram_posts");
        if (storedPosts) {
          const parsedPosts = JSON.parse(storedPosts);
          // Validates that parsed data is an array
          if (Array.isArray(parsedPosts)) {
            setPosts(parsedPosts);
          }
        }
      } catch (err) {
        // Clears invalid localStorage data
        localStorage.removeItem("instagram_posts");
        console.error("Failed to parse stored posts:", err);
      }
    } else {
      // Clears posts when disconnected
      setPosts([]);
    }
  }, [isConnected]);

  // Refetches status after successful connection
  useEffect(() => {
    if (connectData) {
      getInstaConnectionStatus("/instagram/status", "GET");
    }
  }, [connectData]);

  // Updates posts state when new data is fetched
  useEffect(() => {
    if (postsData?.posts) {
      setPosts(postsData.posts);
    }
  }, [postsData]);

  // Fetches automations when connected
  useEffect(() => {
    if (isConnected) {
      fetchAutomations("/automations/list?status=ACTIVE", "GET");
    }
  }, [isConnected]);

  // Updates automations state when new data is fetched
  useEffect(() => {
    if (automationsData?.automations) {
      setAutomations(automationsData.automations);
    }
  }, [automationsData]);

  // Handles automation toggle
  const handleToggleAutomation = async (
    id: string,
    newStatus: "ACTIVE" | "PAUSED"
  ) => {
    try {
      await updateAutomation(`/automations/${id}`, "PATCH", {
        body: { status: newStatus },
      });
      toast.success(`Automation ${newStatus.toLowerCase()}`);
      // Refetches automations
      fetchAutomations("/automations/list?status=ACTIVE", "GET");
    } catch (err) {
      toast.error("Failed to update automation");
    }
  };

  // Handles automation deletion
  const handleDeleteAutomation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this automation?")) {
      return;
    }

    try {
      await deleteAutomation(`/automations/${id}`, "DELETE");
      toast.success("Automation deleted");
      // Refetches automations
      fetchAutomations("/automations/list?status=ACTIVE", "GET");
    } catch (err) {
      toast.error("Failed to delete automation");
    }
  };

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
                  <div
                    key={post.id}
                    className="cursor-pointer"
                    onClick={() => handlePostClick(post)}
                  >
                    <PostCard post={post} />
                  </div>
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

          {/* Shows active automations section */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Active Automations
            </h2>
            {isFetchingAutomations ? (
              <div className="flex justify-center py-8">
                <Spinner className="size-6" />
              </div>
            ) : automations.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {automations.map((automation) => (
                  <AutomationCard
                    key={automation.id}
                    automation={automation}
                    onToggleStatus={handleToggleAutomation}
                    onDelete={handleDeleteAutomation}
                    onViewDetails={(id) =>
                      router.push(`/posts/${automation.postId}`)
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <p className="text-sm">
                  No active automations yet. Click on a post to create one.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
