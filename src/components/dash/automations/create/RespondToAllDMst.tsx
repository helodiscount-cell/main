import { instagramService } from "@/api/services/instagram";
import { Button } from "@/components/ui/button";
import { instagramKeys } from "@/keys/react-query";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, ImageIcon, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function RespondToAllDMs({
  onSetActiveTab,
}: {
  onSetActiveTab: (value: string | null) => void;
}) {
  const { data: storiesData, isLoading } = useQuery({
    queryKey: instagramKeys.stories(),
    queryFn: () => instagramService.profile.getUserStories(),
  });

  const stories = storiesData?.result.stories ?? [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSetActiveTab(null)}
          className="h-8 w-8 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-medium">Select Story</h3>
      </div>

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
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/dash/automations/dmforstories/${story.id}`}
            >
              <div className="aspect-square bg-gray-50 rounded-lg border-2 border-transparent hover:border-purple-600 transition-all cursor-pointer overflow-hidden relative group">
                {story.media_type === "IMAGE" ? (
                  <Image
                    src={story.media_url ?? ""}
                    alt={story.caption ?? "Story"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <video
                    src={story.media_url ?? ""}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-1 right-1 bg-black/50 rounded p-0.5">
                  {story.media_type === "VIDEO" ? (
                    <Video className="w-3 h-3 text-white" />
                  ) : (
                    <ImageIcon className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
