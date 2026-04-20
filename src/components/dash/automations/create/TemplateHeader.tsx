import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCwIcon } from "lucide-react";

interface TemplateHeaderProps {
  title: string;
  onBack: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

/**
 * Reusable header for automation template configuration views.
 * Includes a back button, title, and optional refresh button.
 */
export default function TemplateHeader({
  title,
  onBack,
  onRefresh,
  isRefreshing,
}: TemplateHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-1">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      </div>

      {onRefresh && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="text-slate-500 hover:text-slate-900 transition-colors h-8"
        >
          <RefreshCwIcon
            className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span className="text-sm font-medium">Refresh</span>
        </Button>
      )}
    </div>
  );
}
