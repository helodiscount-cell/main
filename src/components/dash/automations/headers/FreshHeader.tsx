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
      <div className="flex-2 bg-white rounded-md px-4 flex items-center h-9">
        <p className="text-sm font-semibold">
          <span className="opacity-50">Automation </span>/{" "}
          <EditableAutomationName
            value={automationName}
            onChange={onNameChange}
          />
        </p>
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
        className="bg-green-500 hover:bg-green-600 transition-all"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <RefreshCw size={14} className="animate-spin" />
            Going Live…
          </>
        ) : (
          <>
            <Play size={14} />
            Go Live
          </>
        )}
      </Button>
    </div>
  );
}
