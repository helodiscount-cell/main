export const StatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    ACTIVE: "text-green-500",
    EXPIRED: "text-orange-500",
    STOPPED: "text-red-400",
  };
  const labelMap: Record<string, string> = {
    ACTIVE: "Live",
    EXPIRED: "Expired",
    STOPPED: "Stopped",
  };
  return (
    <span
      className={`font-medium text-sm ${colorMap[status] ?? "text-slate-500"}`}
    >
      {labelMap[status] ?? status}
    </span>
  );
};
