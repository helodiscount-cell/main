import React from "react";
import { disconnectActiveAccount, setWorkspaceCookie } from "../actions";

export function AccountRow({
  account,
  isActive,
}: {
  account: any;
  isActive: boolean;
}) {
  const [isPending, startTransition] = React.useTransition();

  const handleSwitch = () => {
    if (isActive) return;
    startTransition(async () => {
      // 1. Update the workspace cookie on the backend
      await setWorkspaceCookie(account.id);

      // 2. Perform a hard navigation to force-purge all client-side caches
      // (Next.js Router Cache & React Query) and ensure the new workspace data loads everywhere.
      window.location.href = "/dash/settings?tab=accounts";
    });
  };

  return (
    <div className="flex flex-col gap-1 pb-4">
      <div className="bg-[#F7FAFC] rounded-xl p-4 flex items-center justify-between border border-transparent hover:border-[#6A06E4]/20 transition-all group">
        <button
          onClick={handleSwitch}
          disabled={isPending || isActive}
          className={`flex items-center gap-2 font-bold transition-all ${
            isActive
              ? "text-[#6A06E4] hover:scale-[1.02] active:scale-[0.98]"
              : "text-[#1A202C]"
          }`}
        >
          <span>@{account.username}</span>
          {isPending && (
            <span className="text-[#A0AEC0] text-[10px] animate-pulse">
              Switching...
            </span>
          )}
        </button>

        <form action={disconnectActiveAccount}>
          {/* Hide the ID if we are using the generic active disconnect action,
              but since we have the ID here, it could be improved to disconnect specific ones */}
          <button
            type="submit"
            className="text-[#E53E3E] text-sm font-semibold hover:underline"
          >
            Remove
          </button>
        </form>
      </div>
      <span className="text-[11px] text-[#A0AEC0] font-medium px-1">
        User Since:{" "}
        {new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(account.connectedAt))}
      </span>
    </div>
  );
}
