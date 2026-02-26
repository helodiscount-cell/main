import { instagramService } from "@/api/services/instagram";
import { Button } from "@/components/ui/button";
import { instagramKeys } from "@/keys/react-query";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const DMForComments = ({ onBack }: { onBack: () => void }) => {
  const { data: userPosts } = useQuery({
    queryKey: instagramKeys.posts(),
    queryFn: () => instagramService.profile.getUserPosts(),
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-medium">Select Post/Reel</h3>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 py-2">
        {userPosts?.result.data.data.map((item) => (
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
              <video
                src={item.media_url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            {/* <Instagram className="w-6 h-6 text-gray-200 group-hover:text-purple-300 transition-colors" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" /> */}
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-4">
        <Button
          disabled
          className="bg-gray-100 text-gray-400 cursor-not-allowed"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
