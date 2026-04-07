import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/server/utils";

interface ColHeaderProps {
  label: string;
  sortable?: boolean;
  sortOrder?: "asc" | "desc" | null;
  onSort?: () => void;
}

const ColHeader = ({ label, sortable, sortOrder, onSort }: ColHeaderProps) => (
  <button
    onClick={onSort}
    disabled={!sortable}
    className={cn(
      "flex items-center gap-2 text-sm font-medium text-[#212121] transition-colors",
      sortable && "hover:text-[#6A06E4]",
    )}
  >
    {label}
    {sortable && (
      <div
        className={cn(
          "p-1 rounded-sm transition-colors",
          sortOrder ? "bg-[#212121] text-white" : "bg-slate-200 text-slate-500",
        )}
      >
        {sortOrder === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
      </div>
    )}
  </button>
);

export default ColHeader;
