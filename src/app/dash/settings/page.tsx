import { currentUser } from "@clerk/nextjs/server";
import { workspaceService } from "@/server/workspace";
import {
  SettingsLayout,
  SettingsTabNav,
  ProfileTab,
  BillingTab,
} from "./_components";
import { SettingsTab, ProfileData, BillingData } from "./types";
import { SETTINGS_CONFIG } from "./config";
import { getUserBillingData } from "@/server/services/billing/subscription.service";

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function SettingsPage({ searchParams }: PageProps) {
  await workspaceService.getVerifiedContext();
  const user = await currentUser();
  if (!user) return null; // Should not happen after verifiedContext but needed for type safety (email addresses)

  const queryParams = await searchParams;
  const activeTab =
    (queryParams.tab as SettingsTab) || SETTINGS_CONFIG.DEFAULT_TAB;

  const profileData: ProfileData = {
    email: user.emailAddresses[0]?.emailAddress || "",
    isEmailVerified:
      user.emailAddresses[0]?.verification?.status === "verified",
  };

  const billingData: BillingData = await getUserBillingData(user.id);

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab data={profileData} />;
      case "billing":
        return <BillingTab data={billingData} />;
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
