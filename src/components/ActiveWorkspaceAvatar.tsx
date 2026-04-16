"use client";

import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { workspaceClientService } from "@/api/services/workspace";
import { cn } from "@/server/utils";

/**
 * ActiveWorkspaceAvatar
 * Fetches and displays the current workspace's profile picture.
 * Optimized for mobile headers.
 */
export function ActiveWorkspaceAvatar({ size = 32 }: { size?: number }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["workspace", "profile"],
    queryFn: () => workspaceClientService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Log error for debugging
  React.useEffect(() => {
    if (isError && error) {
      console.error(
        "[ActiveWorkspaceAvatar] Failed to load workspace profile:",
        error,
      );
    }
  }, [isError, error]);

  const profile = data?.success ? data.result : null;

  if (isLoading || isError) {
    return (
      <div
        className={cn(
          "rounded-full border-2 border-white ring-1 ring-slate-100 flex items-center justify-center transition-colors",
          isLoading ? "bg-slate-100 animate-pulse" : "bg-red-50 border-red-100",
        )}
        style={{ width: size, height: size }}
        aria-label={isLoading ? "Loading profile" : "Failed to load profile"}
        title={isError ? "Failed to load profile" : undefined}
      >
        {isError && (
          <span className="text-[10px] text-red-500 font-bold">!</span>
        )}
      </div>
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
