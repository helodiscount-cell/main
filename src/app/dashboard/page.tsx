"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LucideInstagram, RefreshCw, CheckCircle } from "lucide-react";

interface ConnectionStatus {
  connected: boolean;
  username?: string;
  connectedAt?: string;
}

interface InstagramPost {
  id: string;
  caption: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

export default function DashboardPage() {
  const [status, setStatus] = useState<ConnectionStatus>({ connected: false });
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check connection status on mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    setIsCheckingStatus(true);
    setError(null);

    try {
      const response = await fetch("/api/instagram/status");
      const data = await response.json();

      if (response.ok) {
        setStatus(data);
      }
    } catch (err) {
      console.error("Error checking status:", err);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleConnectInstagram = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const response = await fetch("/api/instagram/connect", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({
          connected: true,
          username: data.username,
          connectedAt: data.connectedAt,
        });
        // Auto-fetch posts after connecting
        fetchPosts();
      } else {
        setError(data.error || "Failed to connect Instagram");
      }
    } catch (err) {
      console.error("Error connecting Instagram:", err);
      setError("Failed to connect Instagram");
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchPosts = async () => {
    setIsFetchingPosts(true);
    setError(null);

    try {
      const response = await fetch("/api/instagram/posts");
      const data = await response.json();

      if (response.ok && data.success) {
        setPosts(data.posts);
      } else {
        setError(data.error || "Failed to fetch posts");
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to fetch posts");
    } finally {
      setIsFetchingPosts(false);
    }
  };

  // Loading state
  if (isCheckingStatus) {
    return (
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Not Connected State */}
      {!status.connected && (
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="text-center">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <LucideInstagram className="text-purple-600" size={40} />
            </div>
            <h1 className="text-2xl font-bold mb-2">Connect Your Instagram</h1>
            <p className="text-gray-600 mb-6 max-w-md">
              Connect your Instagram account to fetch posts and set up
              automations
            </p>
            <Button
              onClick={handleConnectInstagram}
              disabled={isConnecting}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <LucideInstagram className="mr-2" />
                  Connect Instagram
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Connected State */}
      {status.connected && (
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <h1 className="text-xl font-bold">@{status.username}</h1>
                <p className="text-sm text-gray-500">
                  Connected on{" "}
                  {new Date(status.connectedAt!).toLocaleDateString()}
                </p>
              </div>
            </div>

            <Button
              onClick={fetchPosts}
              disabled={isFetchingPosts}
              variant="outline"
            >
              {isFetchingPosts ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2" />
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

          {/* Posts Grid */}
          {posts.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                {posts.length} posts loaded
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={post.media_url}
                        alt={post.caption || "Instagram post"}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {post.media_type === "VIDEO"
                          ? "🎥"
                          : post.media_type === "CAROUSEL_ALBUM"
                          ? "📸"
                          : "🖼️"}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm line-clamp-2 mb-2 text-gray-700">
                        {post.caption || "No caption"}
                      </p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>❤️ {post.like_count?.toLocaleString() || 0}</span>
                        <span>💬 {post.comments_count || 0}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(post.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {posts.length === 0 && !isFetchingPosts && (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
              <p>Click "Fetch Posts" to load your Instagram posts</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
