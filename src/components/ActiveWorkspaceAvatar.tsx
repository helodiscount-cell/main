"use client";

import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { workspaceClientService } from "@/api/services/workspace";

/**
 * ActiveWorkspaceAvatar
 * Fetches and displays the current workspace's profile picture.
 * Optimized for mobile headers.
 */
export function ActiveWorkspaceAvatar({ size = 32 }: { size?: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["workspace", "profile"],
    queryFn: () => workspaceClientService.getProfile(),
  });

  const profile = data?.success ? data.result : null;

  if (isLoading) {
    return (
      <div
        className="rounded-full bg-slate-100 animate-pulse border-2 border-white ring-1 ring-slate-100"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full overflow-hidden border-2 border-white ring-1 ring-slate-100 shadow-sm"
      style={{ width: size, height: size }}
    >
      {profile?.profilePictureUrl ? (
        <Image
          src={profile.profilePictureUrl}
          alt={profile.username}
          width={size}
          height={size}
          className="object-cover w-full h-full"
          unoptimized
        />
      ) : (
        <div className="w-full h-full bg-[#6A06E4] flex items-center justify-center text-white font-bold text-xs uppercase">
          {profile?.username?.slice(0, 1) || "?"}
        </div>
      )}
    </div>
  );
}
