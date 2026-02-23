"use client";

import React from "react";
import Image from "next/image";
import { useInstagramUser } from "@/lib/api/services/instagram/hooks/use-insta-oauth";
import StockImage from "@/assets/homepage/@2x/Ellipse 12@2x.png";

const UserSection = () => {
  const { data: response, isLoading, error } = useInstagramUser();

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 px-2 py-1">
        <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (error || !response?.success) {
    return (
      <div className="flex items-center gap-3 px-2 py-1">
        <Image
          src={StockImage}
          alt="Default Profile"
          width={40}
          height={40}
          className="rounded-full overflow-hidden object-cover"
        />
        <span className="text-sm font-medium text-muted-foreground">Guest</span>
      </div>
    );
  }

  const { username, profilePictureUrl } = response.data;

  return (
    <div className="flex items-center gap-3 px-2 py-1 flex-col">
      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border">
        <Image
          src={profilePictureUrl || StockImage}
          alt={username}
          fill
          className="object-cover"
          unoptimized={!!profilePictureUrl} // Instagram URLs often need unoptimized if they are external and not in next.config
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold truncate max-w-[120px]">
          @{username}
        </span>
        <span className="text-[10px] text-muted-foreground uppercase">
          Instagram
        </span>
      </div>
    </div>
  );
};

export default UserSection;
