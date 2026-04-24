/**
 * BillingCard component: handles plan display and checkout initiation.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { type PlanId } from "@/configs/plans.config";
import { billingService } from "@/api/services/billing";

interface BillingCardProps {
  plan: {
    id: PlanId;
    creditLimit: number;
    maxAccounts: number;
    hasLeadGen: boolean;
    priceInRupees: number;
  };
  isCurrent: boolean;
}

export function BillingCard({ plan, isCurrent }: BillingCardProps) {
  const [loading, setLoading] = useState(false);
  const isCreatingCheckoutRef = useRef(false);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  const handleCheckout = async () => {
    if (isCurrent || isCreatingCheckoutRef.current) return;

    isCreatingCheckoutRef.current = true;
    setLoading(true);
    try {
      const data = await billingService.checkout(plan.id);

      if (data.checkoutUrl) {
        const width = 600;
        const height = 800;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
          data.checkoutUrl,
          "Checkout",
          `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`,
        );

        // Fallback if popup was blocked
        if (!popup) {
          window.location.assign(data.checkoutUrl);
          return;
        }

        // Poll for subscription status change to avoid race conditions with webhook
        const startTime = Date.now();
        const MAX_POLL_TIME = 120000; // 2 minutes
        pollTimerRef.current = setInterval(async () => {
          try {
            const gateData = await billingService.getFeatureGates();

            // Success: Webhook processed and plan updated
            if (gateData?.state?.currentPlan === plan.id) {
              if (pollTimerRef.current) clearInterval(pollTimerRef.current);
              pollTimerRef.current = null;
              setLoading(false);
              isCreatingCheckoutRef.current = false;
              window.location.reload();
              return;
            }
          } catch (e) {
            console.error("[Polling] Error checking status:", e);
          }

          const elapsed = Date.now() - startTime;
          // If popup is closed and we've waited at least 15s for the webhook to land
          if ((popup.closed && elapsed > 15000) || elapsed > MAX_POLL_TIME) {
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
            pollTimerRef.current = null;
            setLoading(false);
            isCreatingCheckoutRef.current = false;
            window.location.reload();
          }
        }, 2000);
      } else {
        console.error("[Checkout] Response missing checkoutUrl:", data);
        throw new Error("Unable to start checkout. Please try again.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(message);
      setLoading(false);
      isCreatingCheckoutRef.current = false;
    }
  };

  return (
    <div
      className={`relative p-8 rounded-3xl border transition-all duration-300 ${
        isCurrent
          ? "bg-primary/5 border-primary   ring-1 ring-primary/20"
          : "bg-card hover:border-primary/50"
      }`}
    >
      {isCurrent && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest   ">
          Current Plan
        </span>
      )}

      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{plan.id}</h2>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold">
              ₹{plan.priceInRupees}
            </span>
            <span className="text-muted-foreground font-medium">/mo</span>
          </div>
        </div>

        <ul className="space-y-4 py-4 min-h-[160px]">
          <li className="flex items-center gap-3">
            <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="size-2 rounded-full bg-primary" />
            </div>
            <span className="text-sm font-medium">
              {plan.creditLimit === -1
                ? "Unlimited Credits"
                : `${plan.creditLimit.toLocaleString()} Monthly Credits`}
            </span>
          </li>
          <li className="flex items-center gap-3">
            <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="size-2 rounded-full bg-primary" />
            </div>
            <span className="text-sm font-medium">
              Connect up to {plan.maxAccounts}{" "}
              {plan.maxAccounts === 1 ? "Account" : "Accounts"}
            </span>
          </li>
          {plan.hasLeadGen && (
            <li className="flex items-center gap-3">
              <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="size-2 rounded-full bg-primary" />
              </div>
              <span className="text-sm font-medium">
                Full Lead Generation Suite
              </span>
            </li>
          )}
        </ul>

        <button
          onClick={handleCheckout}
          disabled={loading || isCurrent || isCreatingCheckoutRef.current}
          className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${
            isCurrent
              ? "bg-emerald-500/10 text-emerald-600 cursor-default"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Redirecting...
            </span>
          ) : isCurrent ? (
            "Current Plan"
          ) : (
            "Upgrade Plan"
          )}
        </button>
      </div>
    </div>
  );
}
