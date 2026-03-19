import { ArrowDown } from "lucide-react";

const ColHeader = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
    {label}
    <ArrowDown
      size={13}
      className="bg-slate-900 text-white rounded-sm p-[2px]"
    />
  </div>
);

export default ColHeader;
