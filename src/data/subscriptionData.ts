import type { Subscription } from "../types/subscription.ts";

export const subscriptionData: Subscription = {
  id: "8f7c9e2a-3d4b-4c5e-8f9a-1b2c3d4e5f6a",
  userId: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  stripeSubscriptionId: "sub_1QM7xKLpH3jN9vR2wT4yU6zA",
  stripeCustomerId: "cus_RkL8mN9pQ2rS3tU4vW5xY6zA",
  stripePriceId: "price_1QM7wPLpH3jN9vR2mN8oP9qR",

  // Subscription details
  status: "canceled",
  plan: "pro",

  trialStart: "2025-12-05T14:23:47Z",
  trialEnd: "2025-12-12T14:23:47Z",

  // Subscription period already ended
  currentPeriodStart: "2026-01-12T14:23:47Z",
  currentPeriodEnd: "2026-02-12T14:23:47Z",

  cancelAtPeriodEnd: true,
  canceledAt: "2026-02-12T14:23:47Z",

  metadata: null,
  createdAt: "2025-12-05T14:23:47Z",
  updatedAt: "2026-02-12T14:30:00Z"
};

export const SUBSCRIPTION_PRICE = 19.99;
export const SUBSCRIPTION_CURRENCY = "USD";
