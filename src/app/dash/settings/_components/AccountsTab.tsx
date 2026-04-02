"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ConnectedAccount } from "../types";
import { disconnectActiveAccount } from "../actions";
import Link from "next/link";
import { CONNECT_ROUTE } from "@/configs/routes.config";
import { AccountRow } from "./AccountRow";

interface AccountsTabProps {
  accounts: ConnectedAccount[];
  activeAccountId: string;
}

export function AccountsTab({ accounts, activeAccountId }: AccountsTabProps) {
  return (
    <div className="w-full max-w-md flex flex-col gap-6 m-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-[#1A202C]">Accounts</h2>
        <p className="text-[#718096] text-sm">
          Change the settings for your current workspace
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[12px] font-semibold text-[#A0AEC0] uppercase tracking-wider">
          Connected Accounts
        </span>
        <div className="flex flex-col gap-0">
          {accounts.map((account) => (
            <AccountRow
              key={account.id}
              account={account}
              isActive={account.id === activeAccountId}
            />
          ))}
        </div>
      </div>

      <Link href={CONNECT_ROUTE} className="w-full">
        <Button className="w-full py-6 bg-[#6A06E4] hover:bg-[#5A05C4] text-white font-medium text-md shadow-purple-200 transition-all">
          Add New Account
        </Button>
      </Link>
    </div>
  );
}
