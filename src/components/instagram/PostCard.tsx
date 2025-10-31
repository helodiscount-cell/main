import React from "react";
import { InstagramPost } from "@/types";

interface PostCardProps {
  post: InstagramPost;
}

// Renders an individual Instagram post card with media, caption, and engagement stats
const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div
      key={post.id}
      className="border dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow bg-white dark:bg-gray-900"
    >
      <div className="relative">
        <img
          src={post.media_url}
          alt={post.caption || "Instagram post"}
          className="w-full h-64 object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-black/70 dark:bg-black/80 text-white text-xs px-2 py-1 rounded">
          {post.media_type === "VIDEO"
            ? "🎥"
            : post.media_type === "CAROUSEL_ALBUM"
            ? "📸"
            : "🖼️"}
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm line-clamp-2 mb-2 text-gray-700 dark:text-gray-300">
          {post.caption || "No caption"}
        </p>
        <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span>
            ❤️{" "}
            {typeof post.like_count === "number"
              ? post.like_count.toLocaleString()
              : 0}
          </span>
          <span>💬 {post.comments_count ?? 0}</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          {new Date(post.timestamp).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PostCard;
