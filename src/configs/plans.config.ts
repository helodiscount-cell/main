import { z } from "zod";

/**
 * All valid plan identifiers.
 */
export const PLAN_IDS = ["FREE", "BASIC", "PREMIUM", "BLACK"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

/**
 * Subscription status values.
 */
export const SUBSCRIPTION_STATUSES = [
  "ACTIVE",
  "EXPIRED",
  "SOFT_PAUSED",
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

/**
 * Zod schema for validating plan selection at runtime.
 */
export const PlanIdSchema = z.enum(PLAN_IDS);

/**
 * Single source of truth for plan capabilities.
 * creditLimit: -1 = unlimited (Black plan)
 * razorpayPlanId: null = no Razorpay plan (Free)
 */
// Centralised billing policy configuration
export const BILLING_CONFIG = {
  // Users created on or before this day on FREE tier are entitled to 2 accounts
  GRANDFATHER_CUTOFF: "2026-04-05",
} as const;

/**
 * Calculates the effective account limit for a user/workspace,
 * applying legacy grandfathering policies where applicable.
 */
export function getEffectiveMaxAccounts(
  createdAt: Date | string,
  planId: PlanId,
): number {
  const baseLimit = PLANS[planId].maxAccounts;

  // Grandfathering: Pre-cutoff FREE users get 2 accounts
  if (planId === "FREE") {
    const createdDate = new Date(createdAt);
    const cutoffDate = new Date(BILLING_CONFIG.GRANDFATHER_CUTOFF);

    // Normalize both to date-only for robust comparison
    createdDate.setUTCHours(0, 0, 0, 0);
    cutoffDate.setUTCHours(0, 0, 0, 0);

    if (createdDate <= cutoffDate) {
      return 2;
    }
  }

  return baseLimit;
}

if (typeof process !== "undefined" && process.env.NODE_ENV === "production") {
  const required = [
    "RAZORPAY_PLAN_ID_BASIC",
    "RAZORPAY_PLAN_ID_PREMIUM",
    "RAZORPAY_PLAN_ID_BLACK",
  ];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(
        `CRITICAL_BILLING: Environment variable ${key} is missing.`,
      );
    }
  }
}

export const PLANS: Record<
  PlanId,
  {
    creditLimit: number;
    maxAccounts: number;
    hasLeadGen: boolean;
    priceInRupees: number;
    razorpayPlanId: string | null;
  }
> = {
  FREE: {
    creditLimit: 1000,
    maxAccounts: 1,
    hasLeadGen: true,
    priceInRupees: 0,
    razorpayPlanId: null,
  },
  BASIC: {
    creditLimit: 10000,
    maxAccounts: 1,
    hasLeadGen: true,
    priceInRupees: 99,
    razorpayPlanId: process.env.RAZORPAY_PLAN_ID_BASIC ?? null,
  },
  PREMIUM: {
    creditLimit: 25000,
    maxAccounts: 1,
    hasLeadGen: true,
    priceInRupees: 279,
    razorpayPlanId: process.env.RAZORPAY_PLAN_ID_PREMIUM ?? null,
  },
  BLACK: {
    creditLimit: -1,
    maxAccounts: 2,
    hasLeadGen: true,
    priceInRupees: 479,
    razorpayPlanId: process.env.RAZORPAY_PLAN_ID_BLACK ?? null,
  },
} as const;

/**
 * Maps a Razorpay Plan ID (e.g. plan_PGX...) back to our internal PlanId (e.g. BASIC).
 */
export function getInternalPlanIdByRazorpayId(
  razorpayId: string,
): PlanId | undefined {
  const entry = Object.entries(PLANS).find(
    ([_, plan]) => plan.razorpayPlanId === razorpayId,
  );
  return entry ? (entry[0] as PlanId) : undefined;
}
