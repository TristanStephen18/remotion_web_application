import { backendPrefix } from "../config";
import type { Subscription, SubscriptionStatus } from "../types/subscription";

// ✅ Cache for subscription data to avoid multiple API calls
let cachedSubscription: Subscription | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Fetch subscription from backend
 */
async function fetchSubscription(): Promise<Subscription | null> {
  const now = Date.now();
  
  // Return cached data if still fresh
  if (cachedSubscription && (now - lastFetchTime) < CACHE_DURATION) {
    console.log('📦 Using cached subscription data');
    return cachedSubscription;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('❌ No auth token found');
      return null;
    }

    console.log('🔄 Fetching subscription from API...');

    const response = await fetch(`${backendPrefix}/api/subscription/details`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log('ℹ️ No subscription found (404)');
        cachedSubscription = null;
        lastFetchTime = now;
        return null;
      }
      throw new Error('Failed to fetch subscription');
    }

    const data = await response.json();
    
    console.log('✅ Subscription API response:', data); // ✅ Debug log
    
    if (data.success && data.subscription) {
      console.log('📊 Subscription data:', {
        status: data.subscription.status,
        plan: data.subscription.plan,
        stripeSubscriptionId: data.subscription.stripeSubscriptionId,
        createdAt: data.subscription.createdAt,
      }); // ✅ Log key fields
      
      cachedSubscription = data.subscription;
      lastFetchTime = now;
      return data.subscription;
    }

    console.log('⚠️ API returned success but no subscription data');
    return null;
  } catch (error) {
    console.error('❌ Error fetching subscription:', error);
    return null;
  }
}

/**
 * Check the current subscription status
 * @returns Promise<SubscriptionStatus> object with subscription details
 */
export async function checkSubscriptionStatus(): Promise<SubscriptionStatus> {
  const subscription = await fetchSubscription();

  // Default status for no subscription
  if (!subscription) {
    return {
      hasActiveSubscription: false,
      isInTrial: false,
      trialDaysRemaining: 0,
      status: null,
      shouldRedirectToSubscription: true,
    };
  }

  const { status, trialEnd, cancelAtPeriodEnd } = subscription;
  const now = new Date();

  // Calculate trial days remaining
  let trialDaysRemaining = 0;
  let isInTrial = false;

  if (trialEnd) {
    const trialEndDate = new Date(trialEnd);
    const diffTime = trialEndDate.getTime() - now.getTime();
    trialDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    isInTrial = status === "trialing" && trialDaysRemaining > 0;
  }

  // Check if subscription is active or in trial
  const hasActiveSubscription =
    status === "active" ||
    (status === "trialing" && isInTrial) ||
    (status === "canceled" && cancelAtPeriodEnd === false);

  // Determine if user should be redirected to subscription page
  const shouldRedirectToSubscription = !hasActiveSubscription;

  return {
    hasActiveSubscription,
    isInTrial,
    trialDaysRemaining: isInTrial ? trialDaysRemaining : 0,
    status,
    shouldRedirectToSubscription,
  };
}

/**
 * Get subscription details
 */
export async function getSubscriptionDetails(): Promise<Subscription | null> {
  return fetchSubscription();
}

/**
 * Clear subscription cache (call after subscription changes)
 */
export function clearSubscriptionCache(): void {
  cachedSubscription = null;
  lastFetchTime = 0;
}

/**
 * Format subscription status for display
 */
export function formatSubscriptionStatus(status: string | null): string {
  if (!status) return "No subscription";

  const statusMap: Record<string, string> = {
    active: "Active",
    trialing: "Trial",
    canceled: "Canceled",
    past_due: "Past Due",
    incomplete: "Incomplete",
    unpaid: "Unpaid",
  };

  return statusMap[status] || status;
}

/**
 * Get subscription status badge color
 */
export function getSubscriptionStatusColor(
  status: string | null
): "success" | "warning" | "error" | "info" {
  if (!status) return "error";

  const colorMap: Record<string, "success" | "warning" | "error" | "info"> = {
    active: "success",
    trialing: "info",
    canceled: "warning",
    past_due: "error",
    incomplete: "error",
    unpaid: "error",
  };

  return colorMap[status] || "info";
}

/**
 * Calculate days until subscription renewal
 */
export function getDaysUntilRenewal(subscription: Subscription | null): number {
  if (!subscription || !subscription.currentPeriodEnd) return 0;

  const now = new Date();
  const renewalDate = new Date(subscription.currentPeriodEnd);
  const diffTime = renewalDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if subscription is expiring soon (within 7 days)
 */
export function isSubscriptionExpiringSoon(subscription: Subscription | null): boolean {
  const daysUntilRenewal = getDaysUntilRenewal(subscription);
  return daysUntilRenewal > 0 && daysUntilRenewal <= 7;
}