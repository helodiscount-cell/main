import { RefreshCw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RefreshInstaDialog } from "@/app/auth/_components/RefreshInstaDialog";
import EditableAutomationName from "./EditableAutomationName";

interface FreshHeaderProps {
  isPending: boolean;
  isMediaUploading?: boolean;
  automationName: string;
  onNameChange: (name: string) => void;
  breadcrumb?: string;
}

export default function FreshHeader({
  isPending,
  isMediaUploading,
  automationName,
  onNameChange,
  breadcrumb = "DM For Comment",
}: FreshHeaderProps) {
  const isActuallyPending = isPending && !isMediaUploading;

  return (
    <div className="flex h-full w-full gap-3 items-center animate-in fade-in duration-300">
      {/* Breadcrumb + name display */}
      <div className="grow flex-2 bg-white rounded-md px-4 flex items-center justify-between h-full min-w-0">
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
        <EditableAutomationName
          value={automationName}
          onChange={onNameChange}
        />
      </div>

      <RefreshInstaDialog />

      <Button
        type="submit"
        className="bg-green-500 hover:bg-green-600 transition-all font-bold px-6 h-full disabled:bg-gray-200 disabled:text-gray-400 disabled:opacity-100"
        disabled={isPending || isMediaUploading}
      >
        {isActuallyPending ? (
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
