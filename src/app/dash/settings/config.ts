import { SettingsTab } from "./types";
import { User, CreditCard, Users } from "lucide-react";

export const SETTINGS_CONFIG = {
  BACKGROUND_COLOR: "#878787",
  DEFAULT_TAB: "profile" as SettingsTab,
  TABS: [
    {
      id: "profile" as SettingsTab,
      label: "Profile",
      Icon: User,
    },
    {
      id: "accounts" as SettingsTab,
      label: "Accounts",
      Icon: Users,
    },
    {
      id: "billing" as SettingsTab,
      label: "Billing",
      Icon: CreditCard,
    },
  ],
} as const;
