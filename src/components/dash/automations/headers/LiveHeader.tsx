import { AutomationListItem } from "@/types/automation";
import { Button } from "../../../ui/button";
import { Play, RefreshCw, RotateCcw, Square } from "lucide-react";

interface LiveHeaderProps {
  automation: AutomationListItem;
  onStop: () => void;
  isStopping: boolean;
  onReRun: () => void;
  isReRunning: boolean;
  isUpdating?: boolean;
  breadcrumb?: string;
  label?: string;
}

export default function LiveHeader({
  automation,
  onStop,
  isStopping,
  onReRun,
  isReRunning,
  isUpdating,
  breadcrumb = "DM For Comment",
  label,
}: LiveHeaderProps) {
  const displayLabel =
    label ??
    (automation.post?.caption
      ? automation.post.caption.slice(0, 30) +
        (automation.post.caption.length > 30 ? "…" : "")
      : automation.post?.id);

  return (
    <div className="flex w-full gap-2 items-center animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Breadcrumb pill */}
      <div className="flex items-center gap-2 bg-white rounded-md px-4 h-9 flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">
          <span className="opacity-50">Automation / {breadcrumb}/ </span>
          <span>{displayLabel}</span>
        </p>
      </div>

      {/* Re-Run */}
      <Button
        type="button"
        onClick={onReRun}
        disabled={isReRunning}
        className="bg-slate-900 hover:bg-slate-700 h-9 transition-all"
      >
        <Play size={13} />
        {isReRunning ? "Running…" : "Re-Run"}
      </Button>

      {/* Stop */}
      <Button
        type="button"
        onClick={onStop}
        disabled={isStopping}
        className="bg-red-500 hover:bg-red-600 h-9 transition-all"
      >
        {isStopping ? (
          <RefreshCw size={13} className="animate-spin" />
        ) : (
          <Square size={13} fill="currentColor" />
        )}
        {isStopping ? "Stopping…" : "Stop"}
      </Button>

      {/* Update */}
      <Button
        type="submit"
        disabled={isUpdating}
        className="bg-indigo-600 hover:bg-indigo-700 h-9 transition-all"
      >
        {isUpdating ? (
          <RefreshCw size={13} className="animate-spin" />
        ) : (
          <RefreshCw size={13} />
        )}
        {isUpdating ? "Updating…" : "Update"}
      </Button>

      {/* Live badge */}
      <div className="h-9 px-4 rounded-md border-2 border-green-500 text-green-600 text-sm font-semibold flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Live
      </div>
    </div>
  );
}
