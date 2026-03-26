import { instagramService } from "@/api/services/instagram";
import { instagramKeys } from "@/keys/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { TemplateHeader } from "./TemplateHeader";

export default function DMForComments({ onBack }: { onBack: () => void }) {
  const queryClient = useQueryClient();

  const { data, isRefetching } = useQuery({
    queryKey: instagramKeys.posts(),
    queryFn: () => instagramService.profile.getUserPosts(),
  });

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: instagramKeys.posts() });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <TemplateHeader
        title="Select Post/Reel"
        onBack={onBack}
        onRefresh={handleRefresh}
        isRefreshing={isRefetching}
      />
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 py-2">
        {data?.result.data.data.map((item) => (
          <div
            key={item.id}
            className="aspect-square bg-gray-50 rounded-lg border-2 border-transparent hover:border-purple-600 transition-all cursor-pointer flex items-center justify-center group overflow-hidden relative"
          >
            {item.media_type === "IMAGE" ? (
              <Link href={`/dash/automations/dmforcomments/${item.id}`}>
                <Image
                  src={item.media_url}
                  alt={item.caption as string}
                  fill
                  className="object-cover"
                />
              </Link>
            ) : (
              <Link href={`/dash/automations/dmforcomments/${item.id}`}>
                <video
                  src={item.media_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
