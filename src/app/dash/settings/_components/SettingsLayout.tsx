import React from "react";
import { SETTINGS_CONFIG } from "../config";

interface SettingsLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
}

export function SettingsLayout({ children, header }: SettingsLayoutProps) {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: SETTINGS_CONFIG.BACKGROUND_COLOR }}
    >
      <div className="w-full max-w-4xl flex flex-col gap-4">
        {/* Navigation/Header Card */}
        <div className="bg-white rounded-2xl p-6 flex items-center justify-between">
          {header}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl p-10 min-h-[500px]">
          {children}
        </div>
      </div>
    </div>
  );
}
