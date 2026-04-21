import { AutomationListItem } from "@/api/services/automations/types";
import { Button } from "../../../ui/button";
import { RefreshCw, Square } from "lucide-react";
import EditableAutomationName from "./EditableAutomationName";

interface LiveHeaderProps {
  automation: AutomationListItem;
  onStop: () => void;
  isStopping: boolean;
  onStart: () => void;
  isStarting: boolean;
  isUpdating?: boolean;
  isMediaUploading?: boolean;
  breadcrumb?: string;
  label?: string;
  onNameChange: (name: string) => void;
}

export default function LiveHeader({
  automation,
  onStop,
  isStopping,
  onStart,
  isStarting,
  isUpdating,
  isMediaUploading,
  breadcrumb = "DM For Comment",
  label,
  onNameChange,
}: LiveHeaderProps) {
  const automationName = automation.automationName || "";

  const isActive = automation.status === "ACTIVE";

  return (
    <div className="flex w-full gap-2 items-center animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Breadcrumb pill with name editor */}
      <div className="flex items-center justify-between gap-4 bg-white rounded-md px-4 h-9 flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">
          <span className="opacity-50">Automation / {breadcrumb} / </span>
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

      {/* Stop - Only visible when Active */}
      {isActive && (
        <Button
          type="button"
          onClick={onStop}
          disabled={isStopping}
          className="bg-red-500 hover:bg-red-600 h-9 transition-all font-bold px-4"
        >
          {isStopping ? (
            <RefreshCw size={13} className="animate-spin" />
          ) : (
            <Square size={13} fill="currentColor" />
          )}
          {isStopping ? "Stopping…" : "Stop"}
        </Button>
      )}

      {/* Update - Only visible when Active */}
      {isActive && (
        <Button
          type="submit"
          disabled={isUpdating || isMediaUploading}
          className="bg-indigo-600 hover:bg-indigo-700 h-9 transition-all font-bold px-4 disabled:bg-indigo-400 disabled:opacity-50"
        >
          {isUpdating && !isMediaUploading ? (
            <RefreshCw size={13} className="animate-spin" />
          ) : (
            <RefreshCw size={13} />
          )}
          {isUpdating ? "Updating…" : "Update"}
        </Button>
      )}

      {/* Live Button/Badge */}
      {isActive ? (
        <div className="h-9 px-4 rounded-md border-2 border-green-500 text-green-600 text-sm font-bold flex items-center gap-1.5 shrink-0 bg-white">
          <span className="w-2 h-2 rounded-sm bg-green-500 animate-pulse" />
          Live
        </div>
      ) : (
        <Button
          type="button"
          onClick={onStart}
          disabled={isStarting || isMediaUploading}
          className="bg-green-500 hover:bg-green-600 h-9 text-white font-bold transition-all px-4 disabled:bg-gray-200 disabled:text-gray-400 disabled:opacity-100"
        >
          {isStarting && !isMediaUploading ? (
            <RefreshCw size={13} className="animate-spin" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-white mr-1" />
          )}
          {isStarting ? "Starting…" : "Go Live"}
        </Button>
      )}
    </div>
  );
}
