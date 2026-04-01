import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/server/db";
import { WORKSPACE_CONFIG } from "@/configs/workspace.config";
import { CONNECT_ROUTE } from "@/configs/routes.config";
import { Button } from "@/components/ui/button";
import { Instagram, LogOut, RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { disconnectActiveAccount } from "./actions";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/auth/signin");

  const cookieStore = await cookies();
  const activeIgId = cookieStore.get(
    WORKSPACE_CONFIG.ACTIVE_WORKSPACE_COOKIE,
  )?.value;

  if (!activeIgId) {
    redirect(CONNECT_ROUTE);
  }

  // Fetch active account details
  const account = await prisma.instaAccount.findFirst({
    where: {
      id: activeIgId,
      user: { clerkId: userId },
      isActive: true,
    },
    select: {
      id: true,
      username: true,
      profilePictureUrl: true,
      followersCount: true,
      accountType: true,
      tokenExpiresAt: true,
    },
  });

  if (!account) {
    redirect(CONNECT_ROUTE);
  }

  const isExpired = new Date(account.tokenExpiresAt) < new Date();

  return (
    <div className="max-w-[1100px] w-full p-8 mx-auto font-sans">
      <div className="flex flex-col gap-10">
        {/* Header section */}
        <div>
          <h1 className="text-[#1A1A1A] font-bold text-3xl tracking-tight mb-2">
            Settings
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your Instagram workspace connections and account properties.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Account Settings Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100/50 flex flex-col gap-8">
            <div className="flex items-start justify-between border-b border-gray-50 pb-8">
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-full p-[3px] bg-linear-to-br from-[#6A06E4] via-purple-300 to-blue-200">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white ring-2 ring-white">
                    {account.profilePictureUrl ? (
                      <Image
                        src={account.profilePictureUrl}
                        alt={account.username}
                        width={96}
                        height={96}
                        className="rounded-full object-cover w-full h-full"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-[#6A06E4] flex items-center justify-center text-white font-bold text-2xl uppercase">
                        {account.username.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#6A06E4] rounded-full p-1.5 shadow-lg border-2 border-white">
                    <Instagram size={14} className="text-white" />
                  </div>
                </div>

                <div>
                  <h2 className="text-[#1A1A1A] font-bold text-xl mb-1 flex items-center gap-2">
                    @{account.username}
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Active
                    </span>
                  </h2>
                  <p className="text-gray-400 text-[13px] font-medium leading-relaxed">
                    {account.accountType || "Professional"} Account •{" "}
                    {(account.followersCount ?? 0).toLocaleString()} Followers
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link href={CONNECT_ROUTE} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full h-11 border-gray-100 hover:bg-gray-50 rounded-[12px] flex items-center gap-2"
                  >
                    <RefreshCcw size={16} className="text-gray-600" />
                    <span className="text-gray-700 font-semibold text-sm">
                      Switch Workspace
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Health status section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100">
                <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider block mb-2">
                  Connection Status
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${isExpired ? "bg-red-500" : "bg-emerald-500"}`}
                  />
                  <span className="text-[14px] font-bold text-gray-800">
                    {isExpired ? "Link Expired" : "Securely Linked"}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 font-medium italic">
                  Next token refresh{" "}
                  {isExpired ? "now required" : "on scheduled rotation"}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100">
                <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider block mb-2">
                  Automation Support
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[14px] font-bold text-gray-800">
                    Operational
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 font-medium italic underline underline-offset-2">
                  Webhooks enabled for this workspace
                </p>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end pt-4">
              <form action={disconnectActiveAccount}>
                <Button
                  variant="destructive"
                  type="submit"
                  className="h-12 px-8 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-[14px] transition-all flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span className="font-bold text-sm">
                    Disconnect This Account
                  </span>
                </Button>
              </form>
            </div>
          </div>

          {/* Right sidebar: Limits/Info */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#6A06E4] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-purple-200">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Your Plan</h3>
                <div className="flex flex-col gap-3 py-4 border-y border-white/10 my-4">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span>Workspaces</span>
                    <span>1 / 2</span>
                  </div>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="w-1/2 bg-white h-full rounded-full shadow-xs" />
                  </div>
                </div>
                <p className="text-[11px] text-white/70 italic leading-relaxed">
                  You can connect one more Instagram account on your current
                  beta trial.
                </p>
              </div>
              {/* Decorative background circle */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
