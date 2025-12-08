"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useApi } from "@/hooks/use-api";
import {
  InstagramStatusResponse,
  InstagramPostsResponse,
  InstagramPost,
  AutomationListResponse,
  AutomationResponse,
} from "@dm-broo/common-types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import InstagramConnect from "@/components/instagram/connect";
import { useRouter } from "next/navigation";
import { handleInstagramOAuthCallback } from "@/hooks/use-instagram-oauth-callback";
import { ConnectionStatusHeader } from "@/components/dashboard/connection-status-header";
import { ErrorBanner } from "@/components/dashboard/error-banner";
import { PostsSection } from "@/components/dashboard/posts-section";
import { AutomationsSection } from "@/components/dashboard/automations-section";

// Handles Instagram connection redirect
const handleConnectInstagram = () => {
  window.location.href = "/api/instagram/oauth/authorize?returnUrl=/dashboard";
};

// Main dashboard page component
export default function DashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [automations, setAutomations] = useState<AutomationResponse[]>([]);

  // Handles OAuth callback
  handleInstagramOAuthCallback();

  // Status: /instagram/status
  const {
    execute: getInstaConnectionStatus,
    loading: isCheckingStatus,
    error: checkStatusError,
    data: statusData,
  } = useApi<InstagramStatusResponse>();

  // Posts: /instagram/posts
  const {
    execute: fetchPosts,
    loading: isFetchingPosts,
    error: fetchPostsError,
    data: postsData,
  } = useApi<InstagramPostsResponse>();

  // Automations: /automations/list
  const {
    execute: fetchAutomations,
    loading: isFetchingAutomations,
    error: fetchAutomationsError,
    data: automationsData,
  } = useApi<AutomationListResponse>();

  // Update automation: /automations/[id]
  const { execute: updateAutomation } = useApi<any>();

  // Delete automation: /automations/[id]
  const { execute: deleteAutomation } = useApi<any>();

  // Determines connection status safely
  const isConnected =
    statusData && "connected" in statusData && statusData.connected === true;
  const connectedStatus = isConnected
    ? (statusData as Extract<InstagramStatusResponse, { connected: true }>)
    : null;

  // Computes error message for unified display
  const errorBanner =
    checkStatusError || fetchPostsError || fetchAutomationsError
      ? getErrorMessage(
          checkStatusError || fetchPostsError || fetchAutomationsError
        )
      : null;

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
          if (Array.isArray(parsedPosts)) {
            setPosts(parsedPosts);
          }
        }
      } catch (err) {
        localStorage.removeItem("instagram_posts");
        console.error("Failed to parse stored posts:", err);
      }
    } else {
      setPosts([]);
    }
  }, [isConnected]);

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
  }, [isConnected, fetchAutomations]);

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
      fetchAutomations("/automations/list?status=ACTIVE", "GET");
    } catch (err) {
      toast.error("Failed to delete automation");
    }
  };

  // Loading state for status check
  if (isCheckingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner className="size-8 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-background">
      <div className="w-full min-h-screen relative z-10 flex flex-col px-4 sm:px-8 md:px-16 py-12 max-w-5xl mx-auto">
        {/* Shows error banner if needed */}
        {errorBanner && <ErrorBanner message={errorBanner} />}

        {/* Shows connect panel if not connected */}
        {!isConnected && (
          <div className="flex flex-1 items-center justify-center">
            <InstagramConnect
              handleConnectInstagram={handleConnectInstagram}
              isConnecting={false}
            />
          </div>
        )}

        {/* Shows main dashboard sections when connected */}
        {isConnected && connectedStatus && (
          <div className="animate-fade-in flex flex-col gap-8">
            <ConnectionStatusHeader
              status={connectedStatus}
              onFetchPosts={handleFetchPosts}
              isFetchingPosts={isFetchingPosts}
              postsCount={posts.length}
            />

            <PostsSection posts={posts} onPostClick={handlePostClick} />

            <AutomationsSection
              automations={automations}
              isFetching={isFetchingAutomations}
              onToggleStatus={handleToggleAutomation}
              onDelete={handleDeleteAutomation}
              onViewDetails={(id) =>
                router.push(
                  `/posts/${automations.find((a) => a.id === id)?.postId || ""}`
                )
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
