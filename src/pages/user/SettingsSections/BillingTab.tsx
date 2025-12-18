import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrendingUp,
  FiShield,
  FiAlertCircle,
  FiCreditCard,
  FiExternalLink,
  FiPackage,
  FiZap,
  FiX,
  FiDollarSign,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { SUBSCRIPTION_PRICE } from "../../../data/subscriptionData";
import { getSubscriptionDetails } from "../../../utils/subscriptionUtils";
import type { Subscription } from "../../../types/subscription";
import { backendPrefix } from "../../../config";

const formatStatus = (status: string, cancelAtPeriodEnd: boolean): string => {
  if (cancelAtPeriodEnd) {
    return "Canceling at Period End";
  }

  switch (status) {
    case "free_trial":
      return "Free Trial";
    case "trialing":
      return "Trial Active";
    case "active":
      return "Active";
    case "canceled":
      return "Canceled";
    case "past_due":
      return "Past Due";
    case "incomplete":
      return "Incomplete";
    case "unpaid":
      return "Unpaid";
    default:
      return status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
};

export const BillingTab: React.FC = () => {
  const navigate = useNavigate();
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

        if (cancelReason || cancelFeedback) {
          console.log("Cancellation feedback:", {
            reason: cancelReason,
            feedback: cancelFeedback,
          });
        }

        setOpenCancelModal(false);
        setCancelReason("");
        setCancelFeedback("");

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading subscription details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="space-y-6">
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCreditCard className="text-purple-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Subscription Found
            </h3>
            <p className="text-gray-600 mb-6">
              Start your free trial to access all features
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              Subscribe Now
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const isFreeTrialOnly = subscription.status === "free_trial";

  return (
    <div className="space-y-6">
      {/* Cancellation Warning Banner */}
      {subscription.cancelAtPeriodEnd && (
        <motion.div
          className="p-5 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-2xl shadow-sm"
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
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </strong>
                . You'll continue to have access to all features until then.
              </p>
              <button
                onClick={handleReactivateSubscription}
                disabled={isProcessing}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isProcessing ? "Reactivating..." : "Reactivate Subscription"}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Current Plan Card */}
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div
          className="relative p-6 md:p-8"
          style={{
            background:
              "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
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
                  {formatStatus(
                    subscription.status,
                    subscription.cancelAtPeriodEnd
                  )}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  ${SUBSCRIPTION_PRICE}
                </div>
                <div className="text-white/80 text-base sm:text-lg">/month</div>
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

        {/* Trial Expiry Display */}
        {(subscription.status === "trialing" ||
          subscription.status === "free_trial") &&
          subscription.trialEnd && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
              <p className="text-sm text-gray-700">
                {subscription.status === "free_trial" ? (
                  <>
                    <span className="font-semibold">Free trial ends:</span>{" "}
                    {new Date(subscription.trialEnd).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Next billing date:</span>{" "}
                    {new Date(subscription.trialEnd).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </>
                )}
              </p>
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
          {isFreeTrialOnly ? (
            <div className="p-5 rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FiCreditCard className="text-indigo-600 text-2xl" />
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  No Payment Method Added
                </p>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  Add a payment method to continue your subscription after the
                  free trial ends
                </p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition text-sm"
                >
                  Add Payment Method
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-slate-50 to-gray-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    CARD
                  </div>
                  <div>
                    <p className="font-mono text-gray-800 font-semibold">
                      •••• •••• •••• ••••
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Payment method on file
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  Active
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
          )}
        </div>

        {/* Next Billing */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <FiDollarSign className="text-green-600 text-xl" />
            <h4 className="font-bold text-gray-800">
              {isFreeTrialOnly ? "Trial Period" : "Next Billing"}
            </h4>
          </div>
          <div
            className={`p-5 rounded-xl border-2 ${
              isFreeTrialOnly
                ? "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50"
                : "border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50"
            }`}
          >
            {isFreeTrialOnly ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 font-medium">Trial Ends</span>
                  <span className="text-2xl font-bold text-gray-800">
                    {subscription.trialEnd &&
                      new Date(subscription.trialEnd).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Add payment method before trial ends to continue your
                  subscription
                </p>
              </div>
            ) : (
              <>
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
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Free Trial Info Box */}
      {isFreeTrialOnly && (
        <motion.div
          className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <FiZap className="text-green-600 text-xl" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-green-900 mb-2">
                Your Trial Period is Protected
              </p>
              <p className="text-xs text-green-800 leading-relaxed">
                You can add your payment method now and still enjoy your{" "}
                <strong>full 7-day free trial</strong>. You won't be charged
                until{" "}
                <strong>
                  {subscription.trialEnd &&
                    new Date(subscription.trialEnd).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                </strong>
                , regardless of when you subscribe.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {isFreeTrialOnly ? (
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
            style={{
              background:
                "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
            }}
          >
            <FiZap />
            Subscribe to Continue After Trial
          </button>
        ) : (
          <>
            <button
              onClick={handleManageBilling}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              style={{
                background:
                  "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
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
          </>
        )}
      </motion.div>

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