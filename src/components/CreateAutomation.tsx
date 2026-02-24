"use client";

import { instagramService } from "@/api/services/instagram";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { instagramKeys } from "@/keys/react-query";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MessageSquare, Instagram, Zap } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const tabs = [
  {
    id: "dm-from-comments",
    title: "DM from Comments",
    description:
      "Send links instantly when people comment on your post or reel",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    id: "dm-from-stories",
    title: "DM from Stories",
    description: "Automate responses when people interact with your stories",
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    id: "respond-to-all-dms",
    title: "Respond to All DMs",
    description: "Instantly reply to any direct message you receive",
    icon: <Zap className="w-5 h-5" />,
  },
];

export function CreateAutomationDialog() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case "dm-from-comments":
        return <DMFromComments onBack={() => setActiveTab(null)} />;
      case "dm-from-stories":
        return <DmFromStories onSetActiveTab={setActiveTab} />;
      case "respond-to-all-dms":
        return <RespondToAllDms onSetActiveTab={setActiveTab} />;
      default:
        return <TabSelector setActiveTab={setActiveTab} />;
    }
  };

  useEffect(() => {
    return () => {
      setActiveTab(null);
    };
  }, []);

  return (
    <Dialog onOpenChange={(open) => !open && setActiveTab(null)}>
      <DialogTrigger asChild>
        <Button className="bg-[#6A06E4] hover:bg-[#5a05c4] text-white rounded-sm px-6 py-2 transition-all font-medium border-none outline-none">
          Create your first automation
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-3xl overflow-hidden"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            {activeTab ? "Configure Automation" : "Choose a Template"}
          </DialogTitle>
        </DialogHeader>
        <div>{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
}

const TabSelector = ({
  setActiveTab,
}: {
  setActiveTab: (value: string | null) => void;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className="group relative rounded-xl border border-gray-100 bg-gray-50/50 p-6 hover:bg-white hover:border-purple-200 hover:shadow-sm transition-all cursor-pointer flex flex-col"
          onClick={() => setActiveTab(tab.id)}
        >
          <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-white p-2 text-purple-600 shadow-sm ring-1 ring-gray-200 group-hover:ring-purple-200 transition-all">
            {tab.icon}
          </div>
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
            {tab.title}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {tab.description}
          </p>
        </div>
      ))}
    </div>
  );
};

const DMFromComments = ({ onBack }: { onBack: () => void }) => {
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
              <Image
                src={item.media_url}
                alt={item.caption as string}
                fill
                className="object-cover"
              />
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

const DmFromStories: React.FC<{
  onSetActiveTab: (value: string | null) => void;
}> = ({ onSetActiveTab }) => {
  return (
    <div className="py-12 text-center flex flex-col items-center justify-center space-y-4">
      <div className="p-4 rounded-full bg-purple-50">
        <Instagram className="w-12 h-12 text-purple-400" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-medium">DM from Stories</h3>
        <p className="text-sm text-muted-foreground max-w-[250px]">
          We're currently building this feature to help you engage with story
          interactions.
        </p>
      </div>
      <Button
        variant="outline"
        onClick={() => onSetActiveTab(null)}
        className="mt-2"
      >
        Back to Templates
      </Button>
    </div>
  );
};

const RespondToAllDms: React.FC<{
  onSetActiveTab: (value: string | null) => void;
}> = ({ onSetActiveTab }) => {
  return (
    <div className="py-12 text-center flex flex-col items-center justify-center space-y-4">
      <div className="p-4 rounded-full bg-purple-50">
        <Zap className="w-12 h-12 text-purple-400" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Respond to All DMs</h3>
        <p className="text-sm text-muted-foreground max-w-[250px]">
          Automated DM responses are coming soon to help you scale your
          messaging.
        </p>
      </div>
      <Button
        variant="outline"
        onClick={() => onSetActiveTab(null)}
        className="mt-2"
      >
        Back to Templates
      </Button>
    </div>
  );
};
