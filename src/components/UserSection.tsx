"use client";

import React from "react";
import Image from "next/image";
import StockImage from "@/assets/homepage/@2x/Ellipse 12@2x.png";
import { useQuery } from "@tanstack/react-query";
import { instagramKeys } from "@/keys/react-query";
import { instagramService } from "@/api/services/instagram";

const UserSection = () => {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: instagramKeys.profile(),
    queryFn: () => instagramService.profile.getUserProfile(),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (error || !response?.success) {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="relative w-24 h-24 rounded-full p-[3px] bg-gradient-to-br from-purple-400 via-purple-300 to-blue-200">
          <div className="w-full h-full rounded-full overflow-hidden bg-white">
            <Image
              src={StockImage}
              alt="Default Profile"
              width={96}
              height={96}
              className="rounded-full object-cover w-full h-full"
            />
          </div>
        </div>
        <span className="text-sm font-medium text-gray-700">Guest</span>
      </div>
    );
  }

  const { username, profilePictureUrl } = response.result;

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="relative w-24 h-24 rounded-full p-[3px] bg-gradient-to-br from-purple-400 via-purple-300 to-blue-200">
        <div className="w-full h-full rounded-full overflow-hidden bg-white">
          <Image
            src={profilePictureUrl || StockImage}
            alt={username}
            width={96}
            height={96}
            className="rounded-full object-cover w-full h-full"
            unoptimized={!!profilePictureUrl}
          />
        </div>
      </div>
      <span className="text-sm font-medium text-gray-700">{username}</span>
    </div>
  );
};

export default UserSection;
