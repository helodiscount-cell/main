import { ArrowDown } from "lucide-react";

const ColHeader = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 text-sm font-medium text-[#212121]">
    {label}
    <div className="bg-slate-800 p-1 rounded-sm">
      <ArrowDown className="text-white" size={12} />
    </div>
  </div>
);

export default ColHeader;
