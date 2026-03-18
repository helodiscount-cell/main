import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { AutomationActionsMenu } from "./ActionMenu";
import { StatusBadge } from "./StatusBadge";
import Link from "next/link";
import { AutomationListItem } from "@/types/automation";
import Image from "next/image";

// Automation row
export const AutomationRow = ({
  automation,
}: {
  automation: AutomationListItem;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center px-4 py-4 gap-4">
        {/* Name + target */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-slate-100 shrink-0 flex items-center justify-center text-xs font-bold text-slate-400">
            {/* {(automation.post?.id ?? automation.story?.id ?? "")
              .slice(0, 2)
              .toUpperCase()} */}
            {automation.post?.mediaUrl || automation.story?.mediaUrl ? (
              <Image
                alt=""
                src={
                  (automation.post?.mediaUrl as string) ||
                  (automation.story?.mediaUrl as string)
                }
                width={100}
                height={100}
                className="rounded-md object-cover"
              />
            ) : (
              <span className="text-[10px] text-slate-400">IMG</span>
            )}
          </div>
          <Link
            href={
              automation.triggerType === "STORY_REPLY"
                ? `/dash/automations/dmforstories/${automation.story?.id}`
                : `/dash/automations/dmforcomments/${automation.post?.id}`
            }
          >
            <span className="text-sm font-medium text-slate-800 truncate max-w-[180px]">
              {automation.post?.caption ??
                automation.story?.caption ??
                automation.post?.id ??
                automation.story?.id ??
                "Untitled"}
            </span>
          </Link>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <StatusBadge status={automation.status} />
          <div className="w-px h-4 bg-slate-200" />
        </div>

        {/* Runs */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700">
            {automation._count.executions}
          </span>
          <div className="w-px h-4 bg-slate-200" />
        </div>

        {/* Last triggered */}
        <span className="text-sm text-slate-700">
          {automation.lastTriggeredAt
            ? new Date(automation.lastTriggeredAt).toLocaleDateString()
            : "—"}
        </span>

        {/* Actions */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <AutomationActionsMenu
              onClose={() => setMenuOpen(false)}
              fullAutomation={automation}
            />
          )}
        </div>
      </div>
      <div className="h-px bg-slate-100 mx-4" />
    </>
  );
};
