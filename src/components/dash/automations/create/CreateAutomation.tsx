"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PlusIconSvg from "@/assets/svgs/addthis.svg";
import { useState } from "react";
import {
  DMForComments,
  DmForStories,
  TabSelector,
} from "@/components/dash/automations/create";
import Image from "next/image";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { automationKeys } from "@/keys/react-query";
import { automationService } from "@/api/services/automations";

export default function CreateAutomationDialog({
  title,
  triggerClassName,
}: {
  title: string;
  triggerClassName?: string;
}) {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Reuses the same query key as page.tsx when status is undefined (ALL)
  const { data } = useQuery({
    queryKey: [...automationKeys.all, "list", { status: undefined }],
    queryFn: () => automationService.list(),
  });

  const automations = data?.automations ?? [];
  const hasAutomations = automations.length > 0;

  const renderContent = () => {
    switch (activeTab) {
      case "dm-from-comments":
        return <DMForComments onBack={() => setActiveTab(null)} />;
      case "dm-from-stories":
        return <DmForStories onSetActiveTab={setActiveTab} />;
      default:
        return (
          <TabSelector setActiveTab={setActiveTab} activeTab={activeTab} />
        );
    }
  };

  return (
    <Dialog onOpenChange={(open) => !open && setActiveTab(null)}>
      <DialogTrigger asChild>
        <Button
          className={
            triggerClassName ||
            "bg-[#6A06E4] hover:bg-[#5a05c4] text-white px-6 py-2 transition-all font-medium border-none outline-none h-full"
          }
        >
          <Image src={PlusIconSvg} alt="add" width={15} height={15} />
          {hasAutomations ? title : "Create your first automation."}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-3xl overflow-hidden rounded-2xl"
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-[#212121] text-xl font-semibold tracking-tight flex flex-1 justify-between">
            {activeTab ? "Configure Automation" : "Templates"}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="rounded-full w-8 h-8 border-2 border-gray-200"
            >
              <X className="text-gray-500" size={20} />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="w-2xl">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
}
