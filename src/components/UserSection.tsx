import React from "react";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";

const UserSection = async () => {
  const data = await currentUser();

  // Handle state where Instagram is not yet connected
  if (!data?.publicMetadata.isConnected) {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  // Validate and normalize Instagram profile data
  const instaProfilePictureUrl = data.publicMetadata.instaProfilePictureUrl;
  const safeProfilePictureUrl =
    typeof instaProfilePictureUrl === "string" &&
    instaProfilePictureUrl.trim().length > 0
      ? instaProfilePictureUrl
      : "";

  const username =
    (data.publicMetadata.instaUsername as string) || data.username || "User";

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {/* Profile Image Container with gradient border */}
      <div className="relative w-24 h-24 rounded-full p-[3px] bg-linear-to-br from-purple-400 via-purple-300 to-blue-200">
        <div className="w-full h-full rounded-full overflow-hidden bg-white">
          {safeProfilePictureUrl ? (
            <Image
              src={safeProfilePictureUrl}
              alt={username}
              width={96}
              height={96}
              className="rounded-full object-cover w-full h-full"
              unoptimized
            />
          ) : (
            // Fallback for missing profile picture
            <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-muted-foreground uppercase font-semibold text-2xl">
              {username.slice(0, 1)}
            </div>
          )}
        </div>
      </div>
      <span className="text-sm font-medium text-gray-700">{username}</span>
    </div>
  );
};

export default UserSection;
