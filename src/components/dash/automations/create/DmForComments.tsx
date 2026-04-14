import { instagramService } from "@/api/services/instagram";
import { instagramKeys } from "@/keys/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { TemplateHeader } from "./TemplateHeader";
import { useState } from "react";

export default function DMForComments({ onBack }: { onBack: () => void }) {
  const queryClient = useQueryClient();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data } = useQuery({
    queryKey: instagramKeys.posts(),
    queryFn: () => instagramService.profile.getUserPosts(),
  });

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await instagramService.profile.getUserPosts(true);
      queryClient.setQueryData(instagramKeys.posts(), res);
    } catch {
      // Background refetch if direct update fails
      await queryClient.invalidateQueries({ queryKey: instagramKeys.posts() });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <TemplateHeader
        title="Select Post/Reel"
        onBack={onBack}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 py-2">
        {data?.result.data.data.map((item) => {
          const previewUrl =
            (item as any).thumbnail_url || item.media_url || "";

          return (
            <div
              key={item.id}
              className="aspect-square bg-gray-50 rounded-lg border-2 border-transparent hover:border-purple-600 transition-all cursor-pointer flex items-center justify-center group overflow-hidden relative"
            >
              <Link
                href={`/dash/automations/dmforcomments/${item.id}`}
                className="w-full h-full"
              >
                <Image
                  src={previewUrl}
                  alt={item.caption || "Post preview"}
                  fill
                  className="object-cover"
                  unoptimized={previewUrl?.includes("fbcdn.net")}
                />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
