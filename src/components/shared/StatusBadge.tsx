export const StatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    ACTIVE: "text-green-500",
    PAUSED: "text-blue-500",
    DELETED: "text-red-400",
    EXPIRED: "text-orange-500",
  };
  const labelMap: Record<string, string> = {
    ACTIVE: "Live",
    PAUSED: "Paused",
    DELETED: "Deleted",
    EXPIRED: "Expired",
  };
  return (
    <span
      className={`font-medium text-sm ${colorMap[status] ?? "text-slate-500"}`}
    >
      {labelMap[status] ?? status}
    </span>
  );
};
