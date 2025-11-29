"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Calendar,
  MessageCircle,
  Heart,
  Eye,
  ArrowLeft,
  X,
} from "lucide-react";
import { AutoReplyCommentAutomationRequestBody, InstagramPost } from "@/types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { AutoReplyCommentsSchema } from "@/types/zod";
import { useApi } from "@/hooks/use-api";

type Comment = {
  id: string;
  username: string;
  text: string;
  timestamp: string;
};

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<InstagramPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [triggers, setTriggers] = useState<string[]>([]);
  const [triggerInput, setTriggerInput] = useState("");
  const [reply, setReply] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    execute: executeAddAutomation,
    loading: loadingAddAutomation,
    error: errorAddAutomation,
    data: dataAddAutomation,
  } = useApi();

  const {
    execute: executeFetchComments,
    loading: loadingFetchComments,
    error: errorFetchComments,
    data: dataFetchComments,
  } = useApi();

  // Fetches post data and comments from localStorage
  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem("instagram_posts");
      if (storedPosts) {
        const parsedPosts: InstagramPost[] = JSON.parse(storedPosts);
        const foundPost = parsedPosts.find((p) => p.id === postId);

        if (foundPost) {
          setPost(foundPost);
          executeFetchComments(`/instagram/comments?postId=${postId}`, "GET");
        } else {
          setError("Post not found");
        }
      } else {
        setError("No posts available");
      }
    } catch (err) {
      setError("Failed to load post");
      console.error("Error loading post:", err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // Fetches comments from Instagram Graph API
  useEffect(() => {
    if (dataFetchComments) {
      setComments(dataFetchComments.comments || []);
    }
  }, [dataFetchComments]);

  // Navigates back to dashboard
  const handleBack = () => {
    router.push("/dashboard");
  };

  // Handles add automation button click
  const handleAutoReplyCommentAutomation = () => {
    // Composes payload for submission
    const payload: AutoReplyCommentAutomationRequestBody = {
      triggers: triggers.map((t) => t.trim()).filter(Boolean),
      replyWith: reply.trim(),
      postId,
    };

    // Validates payload using zod
    const result = AutoReplyCommentsSchema.safeParse(payload);

    if (result.success) {
      // Logs the valid payload to console for dev
      toast.success("Automation config is valid! Sending to server...");
      executeAddAutomation("/automations/comments", "POST", {
        body: payload,
      });
    } else {
      // Picks first zod error and shows toast
      const firstErr =
        Array.isArray(result.error.issues) && result.error.issues.length > 0
          ? result.error.issues[0].message
          : "Invalid input";
      toast.error(firstErr);
    }
  };

  // Handles trigger/tag input on keydown
  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === "Enter" || e.key === "," || e.key === "Tab") &&
      triggerInput.trim()
    ) {
      e.preventDefault();
      const newTag = triggerInput.trim();
      if (newTag.length > 0 && !triggers.includes(newTag.toLowerCase())) {
        // Adds new tag to the list
        setTriggers([...triggers, newTag.toLowerCase()]);
      }
      setTriggerInput("");
    } else if (e.key === "Backspace" && !triggerInput && triggers.length > 0) {
      // Removes last tag
      setTriggers(triggers.slice(0, -1));
    }
  };

  // Handles removing an individual tag
  const handleRemoveTag = (index: number) => {
    setTriggers(triggers.filter((_, i) => i !== index));
  };

  // Shows loading spinner while fetching data
  if (loading) {
    return (
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-screen">
          <Spinner className="size-8" />
        </div>
      </div>
    );
  }

  // Shows error message if post is not found
  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || "Post not found"}
          </p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 size-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      {/* Navigates to dashboard */}
      <Button onClick={handleBack} variant="ghost" className="mb-6">
        <ArrowLeft className="mr-2 size-4" />
        Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Renders post media/details */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
            {post.media_type === "VIDEO" ? (
              <video
                src={post.media_url}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={post.media_url}
                alt={post.caption || "Instagram post"}
                fill
                className="object-cover"
                priority
              />
            )}

            {/* Shows post stats and actions overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.5)_60%,transparent_100%)] p-4 space-y-2">
              <div className="flex items-center gap-6 text-sm text-white">
                {post.like_count !== undefined && (
                  <div className="flex items-center gap-2">
                    <Heart className="size-5" />
                    <span>{post.like_count.toLocaleString()} likes</span>
                  </div>
                )}
                {post.comments_count !== undefined && (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="size-5" />
                    <span>{post.comments_count.toLocaleString()} comments</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/90">
                <Calendar className="size-4" />
                <span>{new Date(post.timestamp).toLocaleString()}</span>
              </div>
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200 hover:underline"
              >
                <Eye className="size-4" />
                View on Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Caption & Auto-Reply Config */}
        <div className="space-y-6">
          {post.caption && (
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-950">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Caption
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {post.caption}
              </p>
            </div>
          )}
          {/* Renders auto-reply UI and get values */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-5 bg-white dark:bg-gray-950 shadow-sm">
            <div className="space-y-7">
              {/* Handles trigger/tag input with tag display */}
              <div>
                <label className="block text-base font-mono text-gray-700 dark:text-gray-200 mb-3">
                  If someone comments -
                </label>
                {/* Tag-like triggers input */}
                <div className="flex flex-wrap gap-2 px-3 py-2 rounded-md min-h-12 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-blue-500">
                  {/* Renders triggers as shadecn badges */}
                  {triggers.map((tag, idx) => (
                    <Badge
                      key={tag + idx}
                      variant="secondary"
                      className="flex items-center bg-primary/10 text-primary-foreground/90 dark:bg-primary/30 rounded px-2 py-[2px] text-[0.98em] font-mono max-w-xs gap-1"
                    >
                      <span className="truncate max-w-[100px]">{tag}</span>
                      <button
                        aria-label="Remove tag"
                        type="button"
                        className="ml-1 text-primary-900/60 hover:text-red-500 focus:outline-none"
                        tabIndex={-1}
                        onClick={() => handleRemoveTag(idx)}
                      >
                        <X className="size-4" />
                      </button>
                    </Badge>
                  ))}
                  {/* Input for trigger entry */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={triggerInput}
                    onChange={(e) => setTriggerInput(e.target.value)}
                    onKeyDown={handleTriggerKeyDown}
                    placeholder={
                      triggers.length === 0 ? "Type and press Enter..." : ""
                    }
                    className="grow min-w-[140px] bg-transparent outline-none border-none text-base font-mono text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
                <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
                  Press <span className="font-bold">Enter</span> to add trigger.
                  Triggers are case-insensitive.
                </div>
                {triggers.length === 0 && (
                  <div className="mt-2 text-xs text-red-500 dark:text-red-400 font-mono">
                    Add at least one trigger keyword or phrase.
                  </div>
                )}
              </div>
              <div>
                <label className="block text-base font-mono text-gray-700 dark:text-gray-200 mb-3">
                  Reply with-
                </label>
                <input
                  type="text"
                  placeholder="Some message"
                  className="w-full px-4 py-2 text-base font-mono rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
              </div>
              <Button
                className="w-full mt-2"
                onClick={handleAutoReplyCommentAutomation}
                disabled={loadingAddAutomation}
              >
                {loadingAddAutomation ? (
                  <Spinner className="size-4" />
                ) : (
                  "Add automation"
                )}
              </Button>
            </div>
          </div>
        </div>
        {/* Shows comments section */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-950">
          {loadingFetchComments ? (
            <div className="text-center py-8">
              <Spinner className="mx-auto mb-2 size-8" />
              <p className="text-gray-500 dark:text-gray-400">
                Loading comments...
              </p>
            </div>
          ) : errorFetchComments ? (
            <div className="text-center py-8 text-red-500 dark:text-red-400 border border-dashed border-red-300 dark:border-red-700 rounded-lg">
              <MessageCircle className="mx-auto mb-2 size-8 text-red-400 dark:text-red-600" />
              <p>{errorFetchComments.error}</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <MessageCircle className="mx-auto mb-2 size-8 text-gray-400 dark:text-gray-600" />
              <p>No comments yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-200 dark:border-gray-800 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                    @{comment.username}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm">
                    {comment.text}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {new Date(comment.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
