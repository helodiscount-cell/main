"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { instagramKeys } from "@/keys/react-query";
import { api, request } from "@/api/client";
import { toast } from "sonner";
import {
  DMForComments,
  DmForStories,
  TabSelector,
} from "@/components/dash/automations/create";

export default function CreateAutomationDialog({ title }: { title: string }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Clears Redis cache then invalidates React Query so the next render fetches fresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await request(api.delete("/instagram/cache"));
      await queryClient.invalidateQueries({ queryKey: instagramKeys.posts() });
      await queryClient.invalidateQueries({
        queryKey: instagramKeys.stories(),
      });
      toast.success("Feed refreshed!");
    } catch {
      toast.error("Failed to refresh. Try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dm-from-comments":
        return <DMForComments onBack={() => setActiveTab(null)} />;
      case "dm-from-stories":
        return <DmForStories onSetActiveTab={setActiveTab} />;
      case "respond-to-all-dms":
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
          <PlusIcon />
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-3xl overflow-hidden"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            <div className="flex flex-1 justify-between">
              {activeTab ? "Configure Automation" : "Choose a Template"}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCwIcon
                  className={`w-4 h-4 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div>{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
}
