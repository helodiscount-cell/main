"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useApi } from "@/hooks/use-api";
import {
  InstagramPostsResponse,
  InstagramPost,
  AutomationListResponse,
  AutomationResponse,
  InstagramStatusConnected,
} from "@dm-broo/common-types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import InstagramConnect from "@/components/instagram/connect";
import { useRouter } from "next/navigation";
import { useInstagramOAuthCallback } from "@/hooks/use-instagram-oauth-callback";
import { ConnectionStatusHeader } from "@/components/dashboard/connection-status-header";
import { ErrorBanner } from "@/components/dashboard/error-banner";
import { PostsSection } from "@/components/dashboard/posts-section";
import { AutomationsSection } from "@/components/dashboard/automations-section";
import { SuccessResponse } from "@/lib/middleware/errors";

const handleConnectInstagram = () => {
  window.location.href = "/api/instagram/oauth/authorize?returnUrl=/dashboard";
};

export default function DashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [automations, setAutomations] = useState<AutomationResponse[]>([]);

  useInstagramOAuthCallback();

  // Status: /instagram/status
  const {
    execute: getInstaConnectionStatus,
    loading: isCheckingStatus,
    error: checkStatusError,
    data: statusData,
  } = useApi<SuccessResponse<InstagramStatusConnected>>();

  // Posts: /instagram/user/posts
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
  } = useApi<{ data: AutomationListResponse; success: true }>();

  // Update automation: /automations/[id]
  const { execute: updateAutomation } = useApi<any>();

  // Delete automation: /automations/[id]
  const { execute: deleteAutomation } = useApi<any>();

  // Disconnect Instagram: /instagram/oauth/disconnect
  const { execute: disconnectInstagram, loading: isDisconnecting } = useApi<{
    success: boolean;
    message: string;
  }>();

  // Tracks URL parameter for connection status
  const [urlConnected, setUrlConnected] = useState(false);

  // Checks URL parameter on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const connected = params.get("connected") === "true";
      setUrlConnected(connected);
    }
  }, []);

  // Determines if Instagram is connected based on API response
  const connectedStatus =
    statusData &&
    statusData.data &&
    "connected" in statusData.data &&
    statusData.data.connected === true;

  const errorBanner =
    checkStatusError || fetchPostsError || fetchAutomationsError
      ? getErrorMessage(
          checkStatusError || fetchPostsError || fetchAutomationsError,
        )
      : null;

  // Fetches posts from API and stores them in localStorage
  const handleFetchPosts = async () => {
    try {
      const result = await fetchPosts("/instagram/user/posts", "GET");
      if (result?.data?.posts) {
        console.log(result.data.posts);
        setPosts(result.data.posts);
        localStorage.setItem(
          "instagram_posts",
          JSON.stringify(result.data.posts),
        );
        toast.success(`Loaded ${result.data.posts.length} posts successfully!`);
      }
    } catch (err) {
      toast.error("Failed to fetch posts. Please try again.");
    }
  };

  const handlePostClick = (post: InstagramPost) => {
    router.push(`/posts/${post.id}`);
  };

  // Fetches Instagram connection status on mount
  useEffect(() => {
    getInstaConnectionStatus("/instagram/status", "GET");
  }, []);

  // Refetches status when connected=true is in URL (after OAuth callback)
  useEffect(() => {
    if (urlConnected && !isCheckingStatus) {
      // Small delay to ensure backend has processed the OAuth callback
      const timer = setTimeout(() => {
        getInstaConnectionStatus("/instagram/status", "GET");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [urlConnected, isCheckingStatus, getInstaConnectionStatus]);

  // Loads posts from localStorage when connection status is confirmed
  useEffect(() => {
    if (connectedStatus) {
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
  }, [connectedStatus]);

  useEffect(() => {
    if (postsData?.data?.posts) {
      console.log(postsData.data.posts);
      setPosts(postsData.data.posts);
    }
  }, [postsData]);

  useEffect(() => {
    if (connectedStatus) {
      fetchAutomations("/automations/list?status=ACTIVE", "GET");
    }
  }, [connectedStatus, fetchAutomations]);

  const handleToggleAutomation = async (
    id: string,
    newStatus: "ACTIVE" | "PAUSED",
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

  const handleDisconnectInstagram = async () => {
    if (
      !confirm(
        "Are you sure you want to disconnect your Instagram account? All automations will be removed.",
      )
    ) {
      return;
    }

    try {
      const result = await disconnectInstagram(
        "/instagram/oauth/disconnect",
        "POST",
      );
      if (result?.success) {
        toast.success("Instagram account disconnected");
        localStorage.removeItem("instagram_posts");
        setPosts([]);
        setAutomations([]);
        getInstaConnectionStatus("/instagram/status", "GET");
      }
    } catch (err) {
      toast.error("Failed to disconnect Instagram account");
    }
  };

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
        {errorBanner && <ErrorBanner message={errorBanner} />}

        {!connectedStatus && (
          <div className="flex flex-1 items-center justify-center">
            <InstagramConnect
              handleConnectInstagram={handleConnectInstagram}
              isConnecting={false}
            />
          </div>
        )}

        {connectedStatus &&
          statusData &&
          statusData.data &&
          "connected" in statusData.data &&
          statusData.data.connected === true && (
            <div className="animate-fade-in flex flex-col gap-8">
              <ConnectionStatusHeader
                status={statusData.data}
                onFetchPosts={handleFetchPosts}
                isFetchingPosts={isFetchingPosts}
                postsCount={posts.length}
                onDisconnect={handleDisconnectInstagram}
                isDisconnecting={isDisconnecting}
              />

              <PostsSection posts={posts} onPostClick={handlePostClick} />

              <AutomationsSection
                automations={automationsData}
                isFetching={isFetchingAutomations}
                onToggleStatus={handleToggleAutomation}
                onDelete={handleDeleteAutomation}
                onViewDetails={(id) =>
                  router.push(
                    `/posts/${automations.find((a) => a.id === id)?.postId || ""}`,
                  )
                }
              />
            </div>
          )}
      </div>
    </div>
  );
}
