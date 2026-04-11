import Image from "next/image";
import { Instagram } from "lucide-react";
import { getUserWorkspaces, selectWorkspace } from "./actions";
import { instagramOAuthAction } from "@/api/services/instagram/actions";
import { WORKSPACE_CONFIG } from "@/configs/workspace.config";
import connectImage from "@/assets/stock-images/connect-page.png";
import metaLogo from "@/assets/svgs/meta-color.svg";

// Server component — fetches accounts server-side, no client state needed
export default async function ConnectPage() {
  const accounts = await getUserWorkspaces();
  const hasAccounts = accounts.length > 0;
  const atLimit = accounts.length >= WORKSPACE_CONFIG.MAX_ACCOUNTS;

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-[960px] w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* Left: auth card */}
        <div className="bg-white rounded-[20px] flex flex-col items-center justify-between p-10 lg:p-12 text-center h-full min-h-[560px]">
          <div className="w-full flex flex-col items-center grow">
            <h2 className="text-[#6A06E4] font-bold text-[18px] mb-12">
              DmBroo
            </h2>

            {hasAccounts ? (
              // Returning user — show account list
              <>
                <h1 className="text-[#1A1A1A] font-bold text-[24px] mb-1 tracking-tight">
                  Choose a Workspace
                </h1>
                <p className="text-gray-500 text-[13px] mb-6 max-w-[260px] mx-auto">
                  Select an account to continue, or add a new one.
                </p>

                {/* Account list */}
                <div className="w-full flex flex-col gap-3 mb-6">
                  {accounts.map((account) => {
                    const isTokenExpired =
                      new Date(account.tokenExpiresAt) < new Date();
                    const isInactive = !account.isActive;
                    const needsReauth = isTokenExpired || isInactive;

                    return (
                      <form
                        key={account.id}
                        action={
                          needsReauth
                            ? instagramOAuthAction
                            : selectWorkspace.bind(null, account.id)
                        }
                      >
                        <button
                          type="submit"
                          className="w-full h-11 flex items-center gap-3 px-4 py-3 rounded-[12px] border border-gray-100 hover:border-[#6A06E4] hover:bg-purple-50 transition-all cursor-pointer group"
                        >
                          {account.profilePictureUrl ? (
                            <Image
                              src={account.profilePictureUrl}
                              alt={account.username}
                              width={36}
                              height={36}
                              className="rounded-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                              <Instagram className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <span className="text-sm font-medium text-[#1A1A1A]">
                            @{account.username}
                          </span>
                          {isTokenExpired && !isInactive && (
                            <span className="ml-auto text-[10px] text-red-500 font-medium whitespace-nowrap">
                              ⚠️ Disconnected
                            </span>
                          )}
                          {isInactive && (
                            <span className="ml-auto text-[10px] text-slate-400 font-medium border border-slate-100 bg-slate-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                              Deactivated
                            </span>
                          )}
                        </button>
                      </form>
                    );
                  })}
                </div>

                {/* Add another account — hidden when at limit */}
                {!atLimit && (
                  <form action={instagramOAuthAction}>
                    <button
                      type="submit"
                      className="text-[13px] text-[#6A06E4] font-medium underline underline-offset-2"
                    >
                      + Add another account
                    </button>
                  </form>
                )}
              </>
            ) : (
              // Fresh user — full connect flow
              <>
                <h1 className="text-[#1A1A1A] font-bold text-[26px] mb-2 tracking-tight">
                  Connect Instagram
                </h1>
                <p className="text-gray-500 text-[13px] mb-8 max-w-[240px] mx-auto">
                  Use your Instagram account to connect with us.
                </p>

                {/* Visual connector */}
                <div className="flex items-center justify-center my-6">
                  <div className="w-[46px] h-[46px] rounded-[14px] bg-linear-to-tr from-[#FFB800] via-[#FF007A] to-[#6A06E4] flex items-center justify-center ring-[3px] ring-white">
                    <Instagram className="text-white w-6 h-6" />
                  </div>
                  <div className="flex gap-[6px] items-center px-[14px]">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className="w-[5px] h-[5px] rounded-full bg-[#6A06E4]"
                      />
                    ))}
                  </div>
                  <div className="w-[46px] h-[46px] rounded-[14px] bg-[#6A06E4] flex items-center justify-center ring-[3px] ring-white">
                    <span className="text-white font-bold text-[10px]">
                      DmBroo
                    </span>
                  </div>
                </div>

                <div className="px-4 w-full mt-6">
                  {!atLimit && (
                    <form action={instagramOAuthAction}>
                      <button
                        type="submit"
                        className="w-full bg-[#6A06E4] hover:bg-[#5a05c4] text-white py-3 rounded-[10px] font-medium text-[15px] transition-all"
                      >
                        Go to Instagram
                      </button>
                    </form>
                  )}
                  {atLimit && (
                    <div className="text-sm text-red-500 font-medium bg-red-50 p-4 rounded-lg border border-red-100">
                      You have reached the maximum number of connected accounts.
                    </div>
                  )}
                </div>

                <p className="mt-5 text-[10px] text-gray-400 leading-relaxed max-w-[240px] mx-auto">
                  Log in with Instagram and set your permissions.
                </p>
              </>
            )}
          </div>

          {/* Meta badge */}
          <div className="mt-8 flex flex-col items-center">
            <Image
              src={metaLogo}
              alt="Meta Tech Provider"
              className="h-[22px] w-auto object-contain mb-1"
            />
            <p className="text-[9px] text-gray-400 font-medium">
              Certified by Meta as an official Tech Provider.
            </p>
          </div>
        </div>

        {/* Right: illustration */}
        <div className="hidden md:block w-full h-full relative rounded-[20px] overflow-hidden">
          <Image
            src={connectImage}
            alt="Grow your audience"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
