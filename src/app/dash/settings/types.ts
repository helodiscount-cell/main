export type SettingsTab = "profile" | "accounts" | "billing";

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
  tokenExpiresAt: Date;
  connectedAt: Date;
  isActive: boolean;
}

export interface SettingsPageData {
  activeTab: SettingsTab;
  profile: ProfileData;
  accounts: ConnectedAccount[];
}
