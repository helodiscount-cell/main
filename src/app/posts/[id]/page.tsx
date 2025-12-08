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
  Zap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/use-api";
import type {
  InstagramPost,
  CreateAutomationInput,
} from "@dm-broo-auto/common-types";

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<InstagramPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [triggers, setTriggers] = useState<string[]>([]);
  const [triggerInput, setTriggerInput] = useState("");
  const [reply, setReply] = useState("");
  const [actionType, setActionType] = useState<"DM" | "COMMENT_REPLY">(
    "COMMENT_REPLY"
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    execute: executeAddAutomation,
    loading: loadingAddAutomation,
    error: errorAddAutomation,
    data: dataAddAutomation,
  } = useApi();

  // Fetches post data from localStorage
  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem("instagram_posts");
      if (storedPosts) {
        const parsedPosts: InstagramPost[] = JSON.parse(storedPosts);
        const foundPost = parsedPosts.find((p) => p.id === postId);

        if (foundPost) {
          setPost(foundPost);
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

  // Handles automation creation success
  useEffect(() => {
    if (dataAddAutomation) {
      toast.success("Automation created successfully!");
      // Clears form
      setTriggers([]);
      setReply("");
    }
  }, [dataAddAutomation]);

  // Handles automation creation error
  useEffect(() => {
    if (errorAddAutomation) {
      toast.error(errorAddAutomation.error || "Failed to create automation");
    }
  }, [errorAddAutomation]);

  // Navigates back to dashboard
  const handleBack = () => {
    router.push("/dashboard");
  };

  // Handles add automation button click
  const handleAutoReplyCommentAutomation = () => {
    // Validates inputs before composing payload
    const trimmedTriggers = triggers.map((t) => t.trim()).filter(Boolean);
    const trimmedReply = reply.trim();

    if (trimmedTriggers.length === 0) {
      toast.error("At least one trigger is required");
      return;
    }

    if (!trimmedReply) {
      toast.error("Reply message is required");
      return;
    }

    // Composes payload matching CreateAutomationSchema
    const payload: CreateAutomationInput = {
      postId,
      postCaption: post?.caption || null,
      triggers: trimmedTriggers,
      matchType: "CONTAINS",
      actionType,
      replyMessage: trimmedReply,
      useVariables: true,
    };

    // Sends to server
    executeAddAutomation("/automations/create", "POST", {
      body: payload,
    });
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Spinner className="size-8 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </div>
    );
  }

  // Shows error message if post is not found
  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-destructive/10 border border-destructive/20 mb-6">
            <X className="size-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            Post Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            {error || "Post not found"}
          </p>
          <Button onClick={handleBack} variant="outline" size="lg">
            <ArrowLeft className="mr-2 size-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background gradient effects */}
      <div className="h-[5vh]"></div>
      <div className="absolute inset-0 bg-linear-to-br from-fuchsia-500/5 via-transparent to-cyan-500/5 dark:from-fuchsia-500/10 dark:to-cyan-500/10 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Header with back button */}
        <div className="mb-8">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="group hover:bg-accent/50"
          >
            <ArrowLeft className="mr-2 size-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Post media card */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border/50 bg-card shadow-lg shadow-fuchsia-500/5 group-hover:shadow-xl group-hover:shadow-fuchsia-500/10 transition-all duration-300">
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

                {/* Post stats overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.6)_60%,transparent_100%)] p-6 space-y-3">
                  <div className="flex items-center gap-6 text-sm text-white">
                    {post.like_count !== undefined && (
                      <div className="flex items-center gap-2">
                        <Heart className="size-5 fill-red-500 text-red-500" />
                        <span className="font-medium">
                          {post.like_count.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {post.comments_count !== undefined && (
                      <div className="flex items-center gap-2">
                        <MessageCircle className="size-5" />
                        <span className="font-medium">
                          {post.comments_count.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <Calendar className="size-4" />
                    <span>
                      {new Date(post.timestamp).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200 hover:underline transition-colors"
                  >
                    <Eye className="size-4" />
                    View on Instagram
                  </a>
                </div>
              </div>
            </div>

            {/* Caption card */}
            {post.caption && (
              <div className="rounded-2xl bg-card border border-border/50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                  <MessageCircle className="size-5 text-fuchsia-500" />
                  Caption
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {post.caption}
                </p>
              </div>
            )}
          </div>

          {/* Automation configuration card */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-card border border-border/50 p-6 lg:p-8 shadow-lg shadow-fuchsia-500/5">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center size-12 rounded-xl bg-linear-to-br from-fuchsia-500/10 to-cyan-500/10 border border-fuchsia-500/20 mb-4">
                  <Sparkles className="size-6 text-fuchsia-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Create{" "}
                  <span className="bg-linear-to-r from-fuchsia-600 to-cyan-500 bg-clip-text text-transparent">
                    Automation
                  </span>
                </h2>
                <p className="text-muted-foreground text-sm">
                  Sets up automated responses for this post
                </p>
              </div>

              <div className="space-y-6">
                {/* Trigger keywords section */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                    <Zap className="size-4 text-fuchsia-500" />
                    Trigger Keywords
                  </label>
                  <div className="flex flex-wrap gap-2 px-4 py-3 rounded-xl min-h-12 border border-border bg-background  transition-all">
                    {triggers.map((tag, idx) => (
                      <Badge
                        key={tag + idx}
                        variant="secondary"
                        className="flex items-center gap-1.5 bg-linear-to-r from-fuchsia-500/10 to-cyan-500/10 text-foreground border border-fuchsia-500/20 px-3 py-1 rounded-lg"
                      >
                        <span className="text-sm font-medium">{tag}</span>
                        <button
                          aria-label="Remove tag"
                          type="button"
                          className="ml-1 hover:text-destructive focus:outline-none transition-colors"
                          tabIndex={-1}
                          onClick={() => handleRemoveTag(idx)}
                        >
                          <X className="size-3.5" />
                        </button>
                      </Badge>
                    ))}
                    <input
                      ref={inputRef}
                      type="text"
                      value={triggerInput}
                      onChange={(e) => setTriggerInput(e.target.value)}
                      onKeyDown={handleTriggerKeyDown}
                      placeholder={
                        triggers.length === 0
                          ? "Type keywords and press Enter..."
                          : ""
                      }
                      className="grow min-w-[120px] bg-transparent outline-none border-none text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Press{" "}
                    <span className="font-semibold text-foreground">Enter</span>{" "}
                    to add trigger. Triggers are case-insensitive.
                  </div>
                  {triggers.length === 0 && (
                    <div className="mt-2 text-xs text-destructive flex items-center gap-1">
                      <X className="size-3" />
                      Add at least one trigger keyword or phrase.
                    </div>
                  )}
                </div>

                {/* Action type selection */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Action Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setActionType("COMMENT_REPLY")}
                      className={`cursor-pointer px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        actionType === "COMMENT_REPLY"
                          ? "bg-linear-to-r from-fuchsia-600 to-pink-600 text-white shadow-lg shadow-fuchsia-500/25 border-2 border-transparent"
                          : "bg-background border-2 border-border text-foreground hover:border-fuchsia-500/50 hover:bg-accent/50"
                      }`}
                    >
                      <MessageCircle className="size-4 mx-auto mb-1.5" />
                      Reply to Comment
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionType("DM")}
                      className={`cursor-pointer px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        actionType === "DM"
                          ? "bg-linear-to-r from-fuchsia-600 to-pink-600 text-white shadow-lg shadow-fuchsia-500/25 border-2 border-transparent"
                          : "bg-background border-2 border-border text-foreground hover:border-fuchsia-500/50 hover:bg-accent/50"
                      }`}
                    >
                      <MessageCircle className="size-4 mx-auto mb-1.5" />
                      Send DM
                    </button>
                  </div>
                </div>

                {/* Reply message input */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Reply Message
                  </label>
                  <input
                    type="text"
                    placeholder="Your automated message (use {username} for their name)"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none transition-all"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <div className="mt-2 text-xs text-muted-foreground">
                    Available variables:{" "}
                    <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-[0.7rem]">
                      {"{username}"}
                    </code>
                    ,{" "}
                    <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-[0.7rem]">
                      {"{comment_text}"}
                    </code>
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  className="w-full mt-4 bg-linear-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 transition-all duration-300"
                  onClick={handleAutoReplyCommentAutomation}
                  disabled={
                    loadingAddAutomation ||
                    triggers.length === 0 ||
                    !reply.trim()
                  }
                  size="lg"
                >
                  {loadingAddAutomation ? (
                    <>
                      <Spinner className="size-4 mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4 mr-2" />
                      Create Automation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
