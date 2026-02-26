export const StatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    ACTIVE: "text-green-500",
    PAUSED: "text-blue-500",
    DELETED: "text-red-400",
  };
  const labelMap: Record<string, string> = {
    ACTIVE: "Live",
    PAUSED: "Draft",
    DELETED: "Deleted",
  };
  return (
    <span
      className={`font-medium text-sm ${colorMap[status] ?? "text-slate-500"}`}
    >
      {labelMap[status] ?? status}
    </span>
  );
};
