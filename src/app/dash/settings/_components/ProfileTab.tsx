"use client";

import React from "react";
import { Check } from "lucide-react";
import { ProfileData } from "../types";

interface ProfileTabProps {
  data: ProfileData;
}

export function ProfileTab({ data }: ProfileTabProps) {
  return (
    <div className="flex flex-col items-center text-center gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-[#1A202C]">Profile</h2>
        <p className="text-[#718096] text-sm max-w-md mx-auto">
          View and manage your account email and verification status.
        </p>
      </div>

      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-left">
          <label className="text-[12px] font-semibold text-[#A0AEC0] uppercase tracking-wider text-center">
            Email
          </label>
          <div className="bg-[#F7FAFC] rounded-xl p-4 flex items-center justify-between text-[#1A202C] font-medium border border-transparent focus-within:border-[#6A06E4]">
            <span>{data.email}</span>
            {data.isEmailVerified && (
              <div
                className="bg-[#00FF66] rounded-full p-1    -sm"
                role="img"
                aria-label="Email verified"
              >
                <Check size={14} className="text-white" strokeWidth={4} />
                <span className="sr-only">Email verified</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
