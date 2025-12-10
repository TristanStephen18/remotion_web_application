import React, { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiPieChart,
  FiShield,
  FiAlertCircle,
  FiCreditCard,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiExternalLink,
  FiPackage,
  FiZap,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { SUBSCRIPTION_PRICE } from "../../data/subscriptionData";
import { getSubscriptionDetails } from "../../utils/subscriptionUtils.ts";
import type { Subscription } from "../../types/subscription";
import { backendPrefix } from "../../config.ts";

const SubscriptionPlan: React.FC = () => {
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelFeedback, setCancelFeedback] = useState("");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const data = await getSubscriptionDetails();
        setSubscription(data);
      } catch (error) {
        console.error("Error fetching subscription:", error);
        toast.error("Failed to load subscription details");
      } finally {
        setLoading(false);
      }
    };

    fetchSub();
  }, []);

  const handleManageBilling = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendPrefix}/api/subscription/portal`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success && data.url) {
        toast.success("Redirecting to billing portal...", { icon: "🔗" });
        // Open Stripe portal in new tab
        window.open(data.url, "_blank");
      } else {
        throw new Error(data.error || "Failed to create portal session");
      }
    } catch (error: any) {
      console.error("Billing portal error:", error);
      toast.error(error.message || "Failed to open billing portal");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler: Cancel Subscription
  const handleCancelSubscription = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendPrefix}/api/subscription/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          "Subscription will be canceled at the end of your billing period",
          {
            icon: "✅",
            duration: 5000,
          }
        );

        // Send feedback to backend (optional)
        if (cancelReason || cancelFeedback) {
          console.log("Cancellation feedback:", {
            reason: cancelReason,
            feedback: cancelFeedback,
          });
          // You can add an API endpoint to save this feedback
        }

        // Close modal
        setOpenCancelModal(false);
        setCancelReason("");
        setCancelFeedback("");

        // Refresh subscription data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error(data.error || "Failed to cancel subscription");
      }
    } catch (error: any) {
      console.error("Cancel subscription error:", error);
      toast.error(error.message || "Failed to cancel subscription");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${backendPrefix}/api/subscription/reactivate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Subscription reactivated successfully!", {
          icon: "🎉",
          duration: 4000,
        });

        // Refresh page to show updated status
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error(data.error || "Failed to reactivate subscription");
      }
    } catch (error: any) {
      console.error("Reactivate subscription error:", error);
      toast.error(error.message || "Failed to reactivate subscription");
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-3 sm:px-4 md:px-8 py-4 pt-16 md:pt-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  // ✅ Show no subscription message
  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 px-3 sm:px-4 md:px-8 py-4 pt-16 md:pt-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No subscription found</p>
          <button
            onClick={() => (window.location.href = "/subscription")}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-4 md:px-8 py-4 pt-16 md:pt-4">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Header Card */}
          <motion.div
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary-1), var(--primary-2) 55%, var(--primary-3))",
                }}
              >
                <FiPackage className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Subscription Management
                </h3>
                <p className="text-sm text-gray-500">
                  Manage your plan, billing, and payment methods
                </p>
              </div>
            </div>

            {/* Cancellation Warning Banner */}
            {subscription.cancelAtPeriodEnd && (
              <motion.div
                className="mt-4 mb-6 p-5 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-2xl shadow-md"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start gap-3">
                  <FiAlertCircle
                    className="text-orange-600 mt-0.5 flex-shrink-0"
                    size={24}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-orange-900 mb-2">
                      ⚠️ Subscription Set to Cancel
                    </p>
                    <p className="text-sm text-orange-800 leading-relaxed mb-3">
                      Your subscription will be canceled on{" "}
                      <strong>
                        {new Date(
                          subscription.currentPeriodEnd
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </strong>
                      . You'll continue to have access to all features until
                      then.
                    </p>
                    <button
                      onClick={handleReactivateSubscription}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isProcessing
                        ? "Reactivating..."
                        : "Reactivate Subscription"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Current Plan Card */}
            <div
              className="relative overflow-hidden rounded-2xl p-4 sm:p-6 md:p-8 mb-6"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary-1), var(--primary-2) 55%, var(--primary-3))",
              }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

              <div className="relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <p className="text-white/80 text-xs sm:text-sm mb-2">
                      Current Plan
                    </p>
                    <h4 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                      ViralMotion{" "}
                      {subscription.plan.charAt(0).toUpperCase() +
                        subscription.plan.slice(1)}
                    </h4>
                    <div
                      className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm border text-white ${
                        subscription.cancelAtPeriodEnd
                          ? "bg-red-500/80 border-red-300"
                          : "bg-white/20 border-white/30"
                      }`}
                    >
                      <FiZap className="text-base sm:text-lg" />
                      {subscription.cancelAtPeriodEnd
                        ? "Canceling at Period End"
                        : subscription.status === "trialing"
                        ? "Trial Active"
                        : subscription.status.charAt(0).toUpperCase() +
                          subscription.status.slice(1)}
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                      ${SUBSCRIPTION_PRICE}
                    </div>
                    <div className="text-white/80 text-base sm:text-lg">
                      /month
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {[
                    { icon: FiZap, text: "Unlimited renders" },
                    { icon: FiPackage, text: "All templates" },
                    { icon: FiTrendingUp, text: "4K quality" },
                    { icon: FiShield, text: "Priority support" },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 sm:gap-2.5 text-white/90"
                    >
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        <feature.icon className="text-xs sm:text-sm" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trial Progress */}
            {subscription.status === "trialing" &&
              subscription.trialStart &&
              subscription.trialEnd && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <FiPieChart className="text-indigo-600" />
                      Trial Period Progress
                    </h4>
                  </div>

                  {(() => {
                    const trialStart = new Date(subscription.trialStart);
                    const trialEnd = new Date(subscription.trialEnd);
                    const today = new Date();
                    const totalDays = Math.ceil(
                      (trialEnd.getTime() - trialStart.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    const daysElapsed = Math.max(
                      0,
                      Math.ceil(
                        (today.getTime() - trialStart.getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    );
                    const daysRemaining = Math.max(
                      0,
                      Math.ceil(
                        (trialEnd.getTime() - today.getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    );
                    const progressPercent = Math.min(
                      100,
                      (daysElapsed / totalDays) * 100
                    );

                    return (
                      <>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-3">
                            <span className="text-gray-600 font-medium">
                              {daysElapsed} of {totalDays} days used
                            </span>
                            <span
                              className="font-bold text-transparent bg-clip-text"
                              style={{
                                backgroundImage:
                                  "linear-gradient(135deg, var(--primary-1), var(--primary-2))",
                              }}
                            >
                              {daysRemaining} days remaining
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                            <motion.div
                              className="h-full rounded-full shadow-lg"
                              style={{
                                background:
                                  "linear-gradient(90deg, #8b5cf6, #ec4899)",
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercent}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>

                        {/* Calendar View */}
                        <div className="mt-4 p-3 bg-white rounded-xl border border-gray-200">
                          <div className="flex items-center justify-between mb-2.5">
                            <h5 className="font-semibold text-gray-800 flex items-center gap-1.5 text-xs">
                              <FiCalendar className="text-indigo-600 text-sm" />
                              {trialStart.toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                              })}
                            </h5>
                            <div className="flex items-center gap-2 text-xs">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-gray-600 text-xs">
                                  Start
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="text-gray-600 text-xs">
                                  End
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Calendar Grid */}
                          {(() => {
                            const year = trialStart.getFullYear();
                            const month = trialStart.getMonth();
                            const firstDay = new Date(year, month, 1);
                            const lastDay = new Date(year, month + 1, 0);
                            const startingDayOfWeek = firstDay.getDay();
                            const daysInMonth = lastDay.getDate();

                            const days = [];

                            // Add empty cells for days before month starts
                            for (let i = 0; i < startingDayOfWeek; i++) {
                              days.push(
                                <div
                                  key={`empty-${i}`}
                                  className="flex justify-center items-center h-8"
                                >
                                  <div className="w-7 h-7"></div>
                                </div>
                              );
                            }

                            // Add days of month
                            for (let day = 1; day <= daysInMonth; day++) {
                              const currentDate = new Date(year, month, day);
                              const isTrialStart = day === trialStart.getDate();
                              const isTrialEnd = day === trialEnd.getDate();
                              const isInTrial =
                                currentDate >= trialStart &&
                                currentDate <= trialEnd;
                              const isToday =
                                currentDate.toDateString() ===
                                today.toDateString();

                              let className =
                                "relative w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-all ";

                              if (isTrialStart) {
                                className +=
                                  "bg-green-500 text-white shadow-sm ring-2 ring-green-300";
                              } else if (isTrialEnd) {
                                className +=
                                  "bg-red-500 text-white shadow-sm ring-2 ring-red-300";
                              } else if (isInTrial) {
                                className +=
                                  "bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-semibold";
                              } else {
                                className += "text-gray-400 hover:bg-gray-50";
                              }

                              if (isToday && !isTrialStart && !isTrialEnd) {
                                className += " ring-2 ring-indigo-400";
                              }

                              days.push(
                                <div
                                  key={day}
                                  className="flex justify-center items-center h-8"
                                >
                                  <div className={className}>{day}</div>
                                </div>
                              );
                            }

                            return (
                              <>
                                {/* Day headers */}
                                <div className="grid grid-cols-7 gap-1 mb-1">
                                  {["S", "M", "T", "W", "T", "F", "S"].map(
                                    (day, idx) => (
                                      <div
                                        key={idx}
                                        className="h-7 flex items-center justify-center text-xs font-bold text-gray-600"
                                      >
                                        {day}
                                      </div>
                                    )
                                  )}
                                </div>
                                {/* Calendar days */}
                                <div className="grid grid-cols-7 gap-1">
                                  {days}
                                </div>
                              </>
                            );
                          })()}

                          {/* Date Info */}
                          <div className="mt-2.5 pt-2.5 border-t border-gray-200 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              <span className="text-gray-600">
                                {trialStart.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                              <span className="text-gray-600">
                                {trialEnd.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {daysRemaining <= 3 && daysRemaining > 0 && (
                          <motion.div
                            className="mt-4 p-5 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl shadow-md"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-start gap-3">
                              <FiAlertCircle
                                className="text-yellow-600 mt-0.5 flex-shrink-0"
                                size={22}
                              />
                              <div>
                                <p className="text-sm font-bold text-yellow-900 mb-1">
                                  Trial Ending Soon!
                                </p>
                                <p className="text-sm text-yellow-800 leading-relaxed">
                                  Your trial ends in{" "}
                                  <strong>
                                    {daysRemaining}{" "}
                                    {daysRemaining === 1 ? "day" : "days"}
                                  </strong>
                                  . You'll be charged{" "}
                                  <strong>${SUBSCRIPTION_PRICE}/month</strong>{" "}
                                  starting{" "}
                                  {trialEnd.toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                  })}
                                  .
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
          </motion.div>

          {/* Payment Method & Billing Info */}
          <motion.div
            className="grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <FiCreditCard className="text-indigo-600 text-xl" />
                <h4 className="font-bold text-gray-800">Payment Method</h4>
              </div>
              <div className="p-5 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-slate-50 to-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      VISA
                    </div>
                    <div>
                      <p className="font-mono text-gray-800 font-semibold">
                        •••• •••• •••• 4242
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Expires 12/2028
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Default
                  </div>
                </div>
                <button
                  onClick={handleManageBilling}
                  disabled={isProcessing}
                  className="w-full py-2 px-4 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Opening...
                    </span>
                  ) : (
                    "Update Card"
                  )}
                </button>
              </div>
            </div>

            {/* Next Billing */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <FiDollarSign className="text-green-600 text-xl" />
                <h4 className="font-bold text-gray-800">Next Billing</h4>
              </div>
              <div className="p-5 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 font-medium">Amount</span>
                  <span className="text-3xl font-bold text-gray-800">
                    ${SUBSCRIPTION_PRICE}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">
                    Billing Date
                  </span>
                  <span className="font-semibold text-gray-800">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subscription Details */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="font-bold text-gray-800 mb-5">
              Subscription Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon: FiFileText,
                  label: "Subscription ID",
                  value: subscription.stripeSubscriptionId || "N/A",
                },
                {
                  icon: FiFileText,
                  label: "Customer ID",
                  value: subscription.stripeCustomerId || "N/A",
                },
                {
                  icon: FiCalendar,
                  label: "Created Date",
                  value: subscription.createdAt
                    ? new Date(subscription.createdAt).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric" }
                      )
                    : "N/A",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="text-indigo-600 text-sm" />
                    <p className="text-xs text-gray-600 font-medium">
                      {item.label}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-800 truncate text-sm">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={handleManageBilling}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary-1), var(--primary-2) 55%, var(--primary-3))",
              }}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Opening...
                </>
              ) : (
                <>
                  <FiExternalLink />
                  Manage Billing Portal
                </>
              )}
            </button>

            {/* ✅ Show different button based on cancellation status */}
            {subscription.cancelAtPeriodEnd ? (
              <button
                onClick={handleReactivateSubscription}
                disabled={isProcessing}
                className="flex-1 px-6 py-4 bg-white border-2 border-green-500 rounded-xl text-green-600 font-bold hover:bg-green-50 transition-all duration-300 hover:border-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Reactivating...
                  </span>
                ) : (
                  "Reactivate Subscription"
                )}
              </button>
            ) : (
              <button
                onClick={() => setOpenCancelModal(true)}
                className="flex-1 px-6 py-4 bg-white border-2 border-red-300 rounded-xl text-red-600 font-bold hover:bg-red-50 transition-all duration-300 hover:border-red-400"
              >
                Cancel Subscription
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      <AnimatePresence>
        {openCancelModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenCancelModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setOpenCancelModal(false);
                  setCancelReason("");
                  setCancelFeedback("");
                }}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition z-10"
              >
                <FiX size={20} />
              </button>

              {/* Header */}
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6 pr-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FiAlertCircle className="text-red-600 text-xl sm:text-2xl" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Cancel Subscription
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                    We're sad to see you go
                  </p>
                </div>
              </div>

              {/* Warning Message */}
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="flex items-start gap-2 sm:gap-3">
                  <FiAlertCircle
                    className="text-red-600 mt-0.5 flex-shrink-0"
                    size={18}
                  />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-red-900 mb-1.5 sm:mb-2">
                      What happens when you cancel:
                    </p>
                    <ul className="text-xs sm:text-sm text-red-800 space-y-1 sm:space-y-1.5">
                      <li className="flex items-start gap-1.5 sm:gap-2">
                        <span className="text-red-600 mt-0.5">•</span>
                        <span className="leading-relaxed">
                          You'll lose access to all premium features at the end
                          of your billing period
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5 sm:gap-2">
                        <span className="text-red-600 mt-0.5">•</span>
                        <span className="leading-relaxed">
                          Your current subscription is active until{" "}
                          {new Date(
                            subscription.currentPeriodEnd
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5 sm:gap-2">
                        <span className="text-red-600 mt-0.5">•</span>
                        <span className="leading-relaxed">
                          You won't be charged again
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5 sm:gap-2">
                        <span className="text-red-600 mt-0.5">•</span>
                        <span className="leading-relaxed">
                          You can reactivate anytime before the period ends
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reason Selection */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Why are you canceling? (Optional)
                </label>
                <div className="space-y-1.5 sm:space-y-2">
                  {[
                    "Too expensive",
                    "Not using it enough",
                    "Missing features I need",
                    "Found a better alternative",
                    "Technical issues",
                    "Other",
                  ].map((reason) => (
                    <label
                      key={reason}
                      className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        cancelReason === reason
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancelReason"
                        value={reason}
                        checked={cancelReason === reason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500 w-4 h-4 flex-shrink-0"
                      />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        {reason}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Additional feedback (Optional)
                </label>
                <textarea
                  value={cancelFeedback}
                  onChange={(e) => setCancelFeedback(e.target.value)}
                  placeholder="Tell us how we can improve..."
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition resize-none text-xs sm:text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-4 sm:mb-0">
                <button
                  onClick={() => {
                    setOpenCancelModal(false);
                    setCancelReason("");
                    setCancelFeedback("");
                  }}
                  className="w-full sm:flex-1 px-5 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-700 text-sm sm:text-base font-semibold hover:bg-gray-50 transition order-2 sm:order-1"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={isProcessing}
                  className="w-full sm:flex-1 px-5 sm:px-6 py-2.5 sm:py-3 bg-red-600 rounded-xl text-white text-sm sm:text-base font-bold hover:bg-red-700 transition shadow-lg order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Canceling...
                    </span>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionPlan;
