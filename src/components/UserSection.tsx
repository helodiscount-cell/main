import React from "react";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";

const UserSection = async () => {
  const data = await currentUser();

  if (!data?.publicMetadata.isConnected) {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  const profilePictureUrl = data.imageUrl;
  const username = data.publicMetadata.instaUsername || data.username || "User";

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="relative w-24 h-24 rounded-full p-[3px] bg-linear-to-br from-purple-400 via-purple-300 to-blue-200">
        <div className="w-full h-full rounded-full overflow-hidden bg-white">
          <Image
            src={profilePictureUrl as string}
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
