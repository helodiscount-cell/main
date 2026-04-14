import { RefreshCw, Play } from "lucide-react";
import { RefreshInstaDialog } from "../../../auth/RefreshInstaDialog";
import { Button } from "@/components/ui/button";

import { EditableAutomationName } from "./EditableAutomationName";

export default function FreshHeader({
  isPending,
  automationName,
  onNameChange,
  breadcrumb = "DM For Comment",
}: {
  isPending: boolean;
  automationName: string;
  onNameChange: (name: string) => void;
  breadcrumb?: string;
}) {
  return (
    <div className="flex w-full gap-3 items-center animate-in fade-in duration-300">
      <div className="grow flex-2 bg-white rounded-md px-4 flex items-center justify-between h-9 min-w-0">
        <p className="text-sm font-semibold flex gap-1 items-center truncate">
          <span className="opacity-50 shrink-0">Automation / </span>
          <span className="opacity-50 shrink-0">{breadcrumb} / </span>
          <span
            className={
              automationName
                ? "text-[#0F172A] font-bold"
                : "text-[#6A06E4] italic font-medium"
            }
          >
            {automationName || "/undefined"}
          </span>
        </p>

        {/* This triggers the rename dialog */}
        <EditableAutomationName
          value={automationName}
          onChange={onNameChange}
        />
      </div>

      <div className="w-fit flex items-center gap-2 bg-white rounded-md px-3 h-9">
        <RefreshCw size={15} className="text-slate-400" />
        <span className="text-sm text-slate-600">
          <span className="font-semibold text-slate-800">{0}</span>
          <span className="text-slate-400"> / 1000</span>
        </span>
      </div>

      <RefreshInstaDialog />

      <Button
        type="submit"
        className="bg-green-500 hover:bg-green-600 transition-all font-bold px-6"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <RefreshCw size={14} className="animate-spin" />
            Going Live…
          </>
        ) : (
          <>
            <Play size={14} fill="currentColor" />
            Go Live
          </>
        )}
      </Button>
    </div>
  );
}
