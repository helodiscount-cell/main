import React from "react";
import { Button } from "@/components/ui/button";
import { BillingData } from "../types";
import { PLANS, type PlanId } from "@/configs/plans.config";
import { CreditCard, Wallet, Landmark } from "lucide-react";

export function BillingTab({ data }: { data: BillingData }) {
  const { subscription, ledger } = data;

  // Fallback to FREE plan details if no subscription exists
  const currentPlanId = (subscription?.plan as PlanId) || "FREE";
  const planInfo = PLANS[currentPlanId];

  const formatDate = (date: Date | undefined) => {
    if (!date) return "--";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const creditsUsed = ledger?.creditsUsed ?? 0;
  const creditLimit = ledger?.creditLimit ?? planInfo.creditLimit;
  const isUnlimited = creditLimit === -1;
  const progress = isUnlimited
    ? 0
    : Math.min(Math.max((creditsUsed / creditLimit) * 100, 0), 100);

  const getPlanLabel = (id: string) => {
    return id.charAt(0).toUpperCase() + id.slice(1).toLowerCase();
  };

  // Helper to render payment method icon
  const PaymentIcon = ({ method }: { method: string | null | undefined }) => {
    if (method === "upi") {
      return (
        <div className="flex flex-col -gap-1">
          <div className="w-5 h-2.5 bg-[#E66624] rounded-t-[2px] transform -skew-x-12" />
          <div className="w-5 h-2.5 bg-[#008945] rounded-b-[2px] transform skew-x-12" />
        </div>
      );
    }
    if (method === "card")
      return <CreditCard size={20} className="text-[#6A06E4]" />;
    if (method === "netbanking")
      return <Landmark size={20} className="text-[#6A06E4]" />;
    return <Wallet size={20} className="text-[#6A06E4]" />;
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto w-full py-6 gap-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-[#111827] mb-2 tracking-tight">
          Billing Information
        </h2>
        <p className="text-[#4B5563] text-[15px] max-w-lg mx-auto leading-relaxed">
          Update your payment information or switch plans according to your
          needs
        </p>
      </div>

      {/* Main Plan Card */}
      <div className="w-full bg-white border border-[#E5E7EB] rounded-[22px] p-8">
        <div className="flex flex-col gap-6">
          {/* Plan Header */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <span className="text-[22px] font-bold bg-linear-to-r from-[#6A06E4] to-[#C026D3] bg-clip-text text-transparent">
                  {getPlanLabel(currentPlanId)}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#DCFCE7] text-[#166534] text-[11px] font-bold uppercase tracking-wider border border-[#BBF7D0]">
                  {subscription?.status || "ACTIVE"}
                </span>
              </div>
              <p className="text-[15px] text-[#6B7280] font-medium">
                {formatDate(subscription?.currentPeriodStart)} -{" "}
                {formatDate(subscription?.currentPeriodEnd)}
              </p>
            </div>

            <Button className="bg-[#0D0D15] hover:bg-[#1A1A24] text-white rounded-xl px-8 h-[46px] text-sm font-semibold transition-all duration-300 shadow-lg shadow-black/10 active:scale-95">
              Upgrade
            </Button>
          </div>

          {/* Credit Limit Progress */}
          <div className="space-y-3 mt-2">
            <div className="relative w-full h-[14px] bg-[#F3E8FF] rounded-full overflow-hidden">
              {/* Progress Fill */}
              {!isUnlimited && (
                <div
                  className="absolute left-0 top-0 h-full bg-[#6A06E4] rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              )}
              {isUnlimited && (
                <div className="absolute left-0 top-0 h-full bg-linear-to-r from-[#6A06E4] to-[#C026D3] w-full rounded-full" />
              )}
            </div>
            <div className="flex justify-between items-center text-[13px] font-semibold text-[#4B5563]">
              <span className="text-[#6A06E4]">{creditsUsed}</span>
              <span className="text-[#9CA3AF]">
                {isUnlimited ? "Unlimited" : creditLimit}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Card */}
      {subscription?.paymentMethod && (
        <div className="w-full bg-white border border-[#E5E7EB] rounded-[22px] p-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-4">
              <h3 className="text-[18px] font-bold text-[#111827]">
                Payment Method
              </h3>
              <div className="flex items-center gap-3">
                <PaymentIcon method={subscription.paymentMethod} />
                <span className="text-[15px] font-semibold text-[#111827]">
                  {subscription.paymentDetail}
                </span>
              </div>
            </div>
            {/* The "Change" button was requested to be ignored for functionality,
                but I'll keep the UI element if it was in the design screenshot provided by user */}
          </div>
        </div>
      )}
    </div>
  );
}
