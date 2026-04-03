import React from "react";
import { CreditCard } from "lucide-react";

export function BillingTab() {
  return (
    <div className="flex flex-col items-center text-center gap-8 py-20">
      <div className="bg-[#F3E8FF] p-6 rounded-full text-[#6A06E4] mb-4">
        <CreditCard size={48} />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-[#1A202C]">Billing & Plans</h2>
        <p className="text-[#718096] text-sm max-w-sm mx-auto">
          Billing management is currently under maintenance. Please check back
          later for invoice history and plan upgrades.
        </p>
      </div>
    </div>
  );
}
