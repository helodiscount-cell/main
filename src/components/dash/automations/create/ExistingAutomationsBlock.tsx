"use client";

import { useQuery } from "@tanstack/react-query";
import { automationKeys } from "@/keys/react-query";
import { automationService } from "@/api/services/automations";
import Link from "next/link";
import { ExternalLink, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { getAutomationRoute } from "@/utils/automation";

interface ExistingAutomationsBlockProps {
  targetId: string;
  type: "post" | "story" | "account";
}

export default function ExistingAutomationsBlock({
  targetId,
  type,
}: ExistingAutomationsBlockProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: automationKeys.list(),
    queryFn: () => automationService.list(),
  });

  const existingOnThisTarget =
    data?.automations.filter((a) => {
      if (type === "post")
        return a.post?.id === targetId && a.status === "ACTIVE";
      if (type === "story")
        return a.story?.id === targetId && a.status === "ACTIVE";
      return (
        a.triggerType === "RESPOND_TO_ALL_DMS" &&
        a.status === "ACTIVE" &&
        targetId === "account"
      );
    }) || [];

  if (isLoading || existingOnThisTarget.length === 0) return null;

  return (
    <div className="mt-8 border-t border-slate-100 pt-6">
      <div className="flex items-center gap-2 mb-4 text-slate-500">
        <Info size={16} />
        <h3 className="text-sm font-medium">
          Existing Automations on this {type}
        </h3>
      </div>

      <div className="w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between py-2 px-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-xs text-slate-600"
        >
          <span>
            {existingOnThisTarget.length} active automation
            {existingOnThisTarget.length > 1 ? "s" : ""}
          </span>
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {isOpen && (
          <div className="pt-2 space-y-2">
            {existingOnThisTarget.map((auto) => (
              <div
                key={auto.id}
                className="flex items-center justify-between p-3 rounded-md border border-slate-50 bg-white"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-slate-700">
                    {auto.automationName || "Unnamed"}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-tight">
                    {auto.status} • {auto.triggers.length} keyword
                    {auto.triggers.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <Link
                  href={getAutomationRoute(auto.triggerType, auto.id)}
                  className="text-xs text-[#6A06E4] hover:underline flex items-center gap-1 font-medium"
                >
                  Edit <ExternalLink size={12} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
