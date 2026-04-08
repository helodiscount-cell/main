import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import phoneImg from "@/assets/png/phone.png";

import { MessageCircle, Send } from "lucide-react";

type AutomationLayoutProps = {
  header: React.ReactNode;
  leftCol: React.ReactNode;
  rightCol: React.ReactNode;
  post?: {
    mediaUrl: string | null;
    mediaType: string | null;
  } | null;
  triggerType?: string;
};

const DMPlaceholder = () => (
  <div className="relative w-full aspect-9/16 rounded-[2.5rem] overflow-hidden border-8 border-zinc-900 drop-   -2xl bg-white flex flex-col pt-10 px-4">
    {/* Mock Header */}
    <div className="flex items-center gap-3 mb-8 px-2">
      <div className="w-10 h-10 rounded-full bg-linear-to-tr from-purple-500 to-pink-500 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-2.5 w-24 bg-zinc-100 rounded-full" />
        <div className="h-2 w-16 bg-zinc-50 rounded-full" />
      </div>
    </div>

    {/* Message Bubbles */}
    <div className="space-y-4">
      <div className="self-start bg-zinc-100 rounded-2xl rounded-bl-none p-4 max-w-[80%]">
        <div className="h-2 w-20 bg-zinc-200 rounded-full mb-2" />
        <div className="h-2 w-32 bg-zinc-200 rounded-full" />
      </div>
      <div className="self-end bg-purple-600 rounded-2xl rounded-br-none p-4 max-w-[80%] ml-auto">
        <div className="h-2 w-24 bg-white/30 rounded-full mb-2" />
        <div className="h-2 w-16 bg-white/30 rounded-full" />
      </div>
      <div className="self-start bg-zinc-100 rounded-2xl rounded-bl-none p-4 max-w-[80%]">
        <div className="h-2 w-28 bg-zinc-200 rounded-full" />
      </div>
    </div>

    {/* Mock Input */}
    <div className="mt-8 pt-8 border-t border-zinc-50">
      <div className="bg-zinc-50 rounded-full h-10 px-4 flex items-center justify-between">
        <div className="h-2 w-24 bg-zinc-200 rounded-full" />
        <Send size={14} className="text-purple-500" />
      </div>
    </div>

    <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/20 to-white/60 pointer-events-none flex items-center justify-center">
      <div className="bg-white p-6 rounded-3xl    -xl flex flex-col items-center gap-3">
        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
          <MessageCircle size={28} />
        </div>
        <p className="text-sm font-bold text-zinc-800">All Direct Messages</p>
      </div>
    </div>
  </div>
);

export function AutomationLayout({
  header,
  leftCol,
  rightCol,
  post,
  triggerType,
}: AutomationLayoutProps) {
  const renderMedia = () => {
    if (!post || !post.mediaUrl) {
      if (triggerType === "RESPOND_TO_ALL_DMS") {
        return <DMPlaceholder />;
      }
      return (
        <div className="relative drop-   -2xl h-full w-full">
          <Image
            src={phoneImg}
            alt="Phone preview"
            className="w-full h-auto"
            priority
          />
        </div>
      );
    }

    // Video handles Reels and standard videos
    if (post.mediaType === "VIDEO") {
      return (
        <div className="relative w-full aspect-9/16 rounded-[2.5rem] overflow-hidden border-8 border-zinc-900 drop-   -2xl bg-black">
          <video
            src={post.mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    // Standard static image or carousel (showing first frame)
    return (
      <div className="relative w-full aspect-9/16 rounded-[2.5rem] overflow-hidden border-8 border-zinc-900 drop-   -2xl bg-black">
        <Image
          src={post.mediaUrl}
          alt="Post preview"
          fill
          className="object-cover"
          unoptimized={post.mediaUrl?.includes("fbcdn.net")}
          priority
        />
      </div>
    );
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        {header}
      </header>

      {/* Main canvas */}
      <div
        className="flex-1 m-4 rounded-xl overflow-hidden"
        style={{
          backgroundColor: "#D4D4D4",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath d='M12 8v8M8 12h8' stroke='%23BEBEBE' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="justify-center h-full grid grid-cols-[280px_30rem_280px] gap-4 p-4 overflow-hidden">
          {/* Left: Keywords */}
          <div className="flex flex-col justify-center gap-3 overflow-y-auto pr-1">
            {leftCol}
          </div>

          {/* Center: Post Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[280px] flex items-start justify-center">
              {renderMedia()}
            </div>
          </div>

          {/* Right: Scrollable widgets */}
          <div className="flex flex-col justify-center gap-3 overflow-y-auto pr-1">
            {rightCol}
          </div>
        </div>
      </div>
    </>
  );
}
