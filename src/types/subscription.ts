export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  status: 'free_trial' | 'active' | 'trialing' | 'canceled' | 'past_due' | 'incomplete' | 'unpaid';
  plan: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  trialStart: string | null;
  trialEnd: string | null;
  metadata: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  isInTrial: boolean;
  trialDaysRemaining: number;
  status: string | null;
  shouldRedirectToSubscription: boolean;
}