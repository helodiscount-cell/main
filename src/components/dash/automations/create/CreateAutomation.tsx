"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DMForComments,
  DmForStories,
  TabSelector,
} from "@/components/dash/automations/create";

export default function CreateAutomationDialog({ title }: { title: string }) {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case "dm-from-comments":
        return <DMForComments onBack={() => setActiveTab(null)} />;
      case "dm-from-stories":
        return <DmForStories onSetActiveTab={setActiveTab} />;
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
            </div>
          </DialogTitle>
        </DialogHeader>
        <div>{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
}
