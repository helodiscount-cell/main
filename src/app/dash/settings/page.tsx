import { currentUser } from "@clerk/nextjs/server";
import { workspaceService } from "@/server/workspace";
import {
  SettingsLayout,
  SettingsTabNav,
  ProfileTab,
  AccountsTab,
  BillingTab,
} from "./_components";
import { SettingsTab, ProfileData, ConnectedAccount } from "./types";
import { SETTINGS_CONFIG } from "./config";

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function SettingsPage({ searchParams }: PageProps) {
  const user = await currentUser();
  if (!user) return null;

  // Centralized verification: handles auth, account existence, and session validity.
  const workspace = await workspaceService.getVerifiedActiveWorkspace();
  if (!workspace) return null;

  const queryParams = await searchParams;
  const activeTab =
    (queryParams.tab as SettingsTab) || SETTINGS_CONFIG.DEFAULT_TAB;

  // Map to internal ConnectedAccount type
  const connectedAccounts: ConnectedAccount[] = workspace.allAccounts.map(
    (acc) => ({
      ...acc,
      followersCount: 0, // Default for type compatibility if not fetched
      accountType: "BUSINESS",
      connectedAt: new Date(),
      isActive: true,
      tokenExpiresAt: new Date(),
    }),
  );

  const profileData: ProfileData = {
    email: user.emailAddresses[0]?.emailAddress || "",
    isEmailVerified:
      user.emailAddresses[0]?.verification?.status === "verified",
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab data={profileData} />;
      case "accounts":
        return (
          <AccountsTab
            accounts={connectedAccounts}
            activeAccountId={workspace.id}
          />
        );
      case "billing":
        return <BillingTab />;
      default:
        return <ProfileTab data={profileData} />;
    }
  };

  return (
    <SettingsLayout header={<SettingsTabNav />}>
      {renderTabContent()}
    </SettingsLayout>
  );
}
