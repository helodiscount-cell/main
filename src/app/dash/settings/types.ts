export type SettingsTab = "profile" | "billing";

export interface ProfileData {
  email: string;
  isEmailVerified: boolean;
}

export interface ConnectedAccount {
  id: string;
  username: string;
  profilePictureUrl?: string | null;
  followersCount: number;
  accountType?: string | null;
  tokenExpiresAt: Date | string;
  connectedAt: Date | string;
  isActive: boolean;
}

export interface BillingData {
  subscription: {
    plan: string;
    status: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    paymentMethod: string | null;
    paymentDetail: string | null;
  } | null;
  ledger: {
    creditsUsed: number;
    creditLimit: number;
    periodStart: Date;
    periodEnd: Date;
  } | null;
}

export interface SettingsPageData {
  activeTab: SettingsTab;
  profile: ProfileData;
  billing: BillingData;
}
