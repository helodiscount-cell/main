import { instagramService } from "@/api/services/instagram";
import { instagramKeys } from "@/keys/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, ImageIcon, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TemplateHeader } from "./TemplateHeader";

export default function DmForStories({
  onSetActiveTab,
}: {
  onSetActiveTab: (value: string | null) => void;
}) {
  const queryClient = useQueryClient();

  const {
    data: storiesData,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: instagramKeys.stories(),
    queryFn: () => instagramService.profile.getUserStories(),
  });

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: instagramKeys.stories() });
  };

  const stories = storiesData?.result.stories ?? [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <TemplateHeader
        title="Select Story"
        onBack={() => onSetActiveTab(null)}
        onRefresh={handleRefresh}
        isRefreshing={isRefetching}
      />

      {isLoading ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 py-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
          <Clock className="w-8 h-8 text-gray-300" />
          <p>No active stories. Stories disappear after 24 hours.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 py-2">
          {stories.map((story) => {
            const previewUrl =
              (story as any).thumbnail_url || story.media_url || "";

            return (
              <Link
                key={story.id}
                href={`/dash/automations/dmforstories/${story.id}`}
              >
                <div className="aspect-square bg-gray-50 rounded-lg border-2 border-transparent hover:border-purple-600 transition-all cursor-pointer overflow-hidden relative group">
                  <Image
                    src={previewUrl}
                    alt={story.caption ?? "Story preview"}
                    fill
                    className="object-cover"
                    unoptimized={previewUrl?.includes("fbcdn.net")}
                  />
                  <div className="absolute bottom-1 right-1 bg-black/50 rounded p-0.5">
                    {story.media_type === "VIDEO" ? (
                      <Video className="w-3 h-3 text-white" />
                    ) : (
                      <ImageIcon className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
