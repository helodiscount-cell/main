"use client";

import { LucideInstagram } from "lucide-react";
import PostCard from "@/components/instagram/PostCard";
import type { InstagramPost } from "@dm-broo-auto/common-types";

interface PostsSectionProps {
  posts: InstagramPost[];
  onPostClick: (post: InstagramPost) => void;
}

// Renders posts grid section with cards
export const PostsSection = ({ posts, onPostClick }: PostsSectionProps) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-muted/30">
        <LucideInstagram
          className="mx-auto mb-4 text-muted-foreground/50"
          size={48}
        />
        <p className="text-lg font-medium mb-2">No posts yet</p>
        <p className="text-sm">Clicks \"Fetch Posts\" to load your posts</p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Your{" "}
          <span className="bg-linear-to-r from-fuchsia-600 to-cyan-500 bg-clip-text text-transparent">
            Posts
          </span>
        </h2>
        <p className="text-sm text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"} loaded
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="cursor-pointer group"
            onClick={() => onPostClick(post)}
          >
            <div className="rounded-2xl bg-card border border-border/50 hover:border-border hover:shadow-xl hover:shadow-fuchsia-500/5 transition-all duration-300 overflow-hidden">
              <PostCard post={post} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
