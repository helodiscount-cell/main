export function HeaderSkeleton() {
  return (
    <div className="flex w-full gap-3 items-center animate-pulse">
      <div className="h-9 w-48 bg-slate-200 rounded-md" />
      <div className="h-9 w-24 bg-slate-200 rounded-md" />
      <div className="h-9 w-28 bg-slate-200 rounded-md ml-auto" />
    </div>
  );
}
