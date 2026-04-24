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
import { cn } from "@/server/utils";
import Link from "next/link";

export function CreateAutomationModal({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setActiveTab(null);
      }}
    >
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

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
        <div className="w-2xl">
          {activeTab === "dm-from-comments" ? (
            <DMForComments onBack={() => setActiveTab(null)} />
          ) : activeTab === "dm-from-stories" ? (
            <DmForStories onSetActiveTab={setActiveTab} />
          ) : (
            <TabSelector setActiveTab={setActiveTab} activeTab={activeTab} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CreateAutomationDialog({ title }: { title: string }) {
  // Matched exactly how it's queried on the index page
  const { data, isPending } = useQuery({
    queryKey: automationKeys.list({ status: undefined }),
    queryFn: () => automationService.list(undefined),
  });

  const automations = data?.automations || [];
  const hasAutomations = automations.length > 0;

  const buttonClass = cn(
    "bg-[#6A06E4] hover:bg-[#5a05c4] text-white px-6 py-2 transition-all font-medium border-none outline-none h-full flex items-center gap-2",
    isPending && !data && "opacity-70 cursor-wait",
  );

  if (!hasAutomations) {
    return (
      <Link href="/dash/automations/new" className="contents">
        <Button className={buttonClass} disabled={isPending && !data}>
          <Image src={PlusIconSvg} alt="add" width={15} height={15} />
          Create your first automation
        </Button>
      </Link>
    );
  }

  return (
    <CreateAutomationModal>
      <Button className={buttonClass} disabled={isPending && !data}>
        <Image src={PlusIconSvg} alt="add" width={15} height={15} />
        {title}
      </Button>
    </CreateAutomationModal>
  );
}
