import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { SUBSCRIPTION_PRICE } from "../../data/subscriptionData.ts";
import { backendPrefix } from "../../config.ts";
import toast from "react-hot-toast";

// Stripe promise will be initialized after fetching the key
let stripePromise: Promise<any> | null = null;

// Card Element styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1e293b",
      fontFamily: '"DM Sans", sans-serif',
      "::placeholder": {
        color: "#94a3b8",
      },
      iconColor: "#8b5cf6",
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
  },
  hidePostalCode: true,
};

// Main form component
function CheckoutForm() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [formData, setFormData] = useState({
    nameOnCard: "",
    zipCode: "",
  });

  // ✅ Fetch client secret on mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${backendPrefix}/api/subscription/create-setup-intent`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          toast.error(data.error || "Failed to initialize payment");
        }
      })
      .catch((err) => {
        console.error("Setup intent error:", err);
        toast.error("Failed to connect to server");
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe hasn't loaded yet. Please try again.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card information is missing.");
      return;
    }

    if (!formData.nameOnCard.trim()) {
      toast.error("Please enter the cardholder name.");
      return;
    }

    if (!clientSecret) {
      toast.error("Payment not initialized. Please refresh the page.");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Confirm card setup with Stripe
      const { error: setupError, setupIntent } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.nameOnCard,
              address: {
                postal_code: formData.zipCode,
              },
            },
          },
        }
      );

      if (setupError) {
        console.error("Stripe setup error:", setupError);
        toast.error(
          setupError.message || "Failed to process card information."
        );
        setIsProcessing(false);
        return;
      }

      console.log("✅ Card setup confirmed:", setupIntent.id);

      // Step 2: Send payment method to backend to create subscription
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${backendPrefix}/api/subscription/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentMethodId: setupIntent.payment_method,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create subscription");
      }

      // Step 3: Success!
      console.log("✅ Subscription created:", data.subscription);
      toast.success("Subscription activated successfully!");
      setShowReceiptModal(true);
    } catch (error) {
      console.error("Subscription error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create subscription. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoToDashboard = () => {
    setShowReceiptModal(false);
    navigate("/dashboard");
  };

  const handleBack = () => {
    
    navigate("/dashboard");
  };

  // ✅ Calculate dates - billing starts immediately (no additional trial)
  const today = new Date();
  const billingStartDate = today; // Immediate billing
  const nextBillingDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  return (
    <div
      className="min-h-screen relative font-['DM_Sans',sans-serif]"
      style={{
        background:
          "linear-gradient(135deg, #f8f9fc 0%, #faf6fb 25%, #f6f9fc 50%, #f9f6fa 75%, #f6fafb 100%)",
      }}
    >
      {/* CSS Variables */}
      <style>{`
        :root {
          --primary-1: #8b5cf6;
          --primary-2: #ec4899;
          --primary-3: #06b6d4;
        }
        .conic-gradient-bg {
          background: conic-gradient(from 120deg, var(--primary-1), var(--primary-2), var(--primary-3));
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .StripeElement {
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background-color: #ffffff;
          transition: all 0.2s;
        }
        .StripeElement:hover {
          border-color: #cbd5e1;
        }
        .StripeElement--focus {
          border-color: var(--primary-1) !important;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1) !important;
        }
        .StripeElement--invalid {
          border-color: #ef4444;
        }
      `}</style>

      {/* Header */}
      <div className="absolute top-3 sm:top-6 left-3 sm:left-6 right-3 sm:right-6 z-20 flex justify-between items-center">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white hover:border-slate-300 text-slate-700 font-medium transition-all duration-300 shadow-sm hover:shadow-md text-sm"
        >
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full conic-gradient-bg"
            style={{ boxShadow: "0 2px 8px rgba(139, 92, 246, 0.4)" }}
          ></div>
          <span className="font-semibold text-base sm:text-lg text-slate-700">
            ViralMotion
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-6 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-6 sm:mb-10 mt-8 sm:mt-12">
            <div
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-white font-semibold text-xs sm:text-sm shadow-lg mb-4 sm:mb-6 animate-bounce-subtle"
              style={{
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                boxShadow: "0 8px 24px rgba(168, 85, 247, 0.35)",
              }}
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>7 Days FREE Trial</span>
            </div>

            <h1
              className="font-['Syne',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight px-4"
              style={{
                background:
                  "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                paddingBottom: "0.15em",
              }}
            >
              Start Creating Today
            </h1>
            <p className="text-slate-500 text-sm sm:text-base lg:text-lg px-4">
              Get instant access to unlimited video creation tools.
            </p>
          </div>

          {/* Two Column Layout - Now stacks on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
            {/* Left Column - Pricing Card */}
            <div
              className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-2xl overflow-hidden relative order-2 lg:order-1"
              style={{
                background:
                  "linear-gradient(160deg, #a855f7 0%, #c026d3 40%, #ec4899 100%)",
                boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.4)",
              }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

              <div className="relative flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-2">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[10px] font-bold tracking-wide">
                      RISK-FREE
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">7 - days free trial</h3>
                </div>
              </div>

              <div className="relative text-center py-6 border-b border-white/20">
                <p className="text-white/80 text-sm mb-1">Subscription Fee</p>
                <p className="text-6xl font-bold">$0</p>
              </div>

              <div className="relative space-y-3 py-5 border-b border-white/20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">After Trial</p>
                    <p className="text-white/70 text-xs">Billed monthly</p>
                  </div>
                  <p className="font-bold text-lg">${SUBSCRIPTION_PRICE}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Subtotal</p>
                  <p className="font-bold text-lg">${SUBSCRIPTION_PRICE}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-white/80">Tax</p>
                  <p className="text-white/80">$0.00</p>
                </div>
              </div>

              <div className="relative flex justify-between items-center py-5 border-b border-white/20">
                <p className="font-bold text-lg">Total due today</p>
                <p className="font-bold text-2xl">$0.00</p>
              </div>

              <div className="relative mt-5 flex items-center gap-3 p-4 rounded-xl bg-white/15 backdrop-blur-sm">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm">
                  Cancel anytime! Manage your subscription from your profile
                  settings.
                </p>
              </div>
            </div>

            {/* Right Column - Payment Form */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl border border-slate-100 order-1 lg:order-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-5">
                Payment Information
              </h2>

              <div className="mb-4 sm:mb-5 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-violet-50/80 to-pink-50/80 border border-violet-100">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-800 font-semibold">
                      Subscribe for ${SUBSCRIPTION_PRICE}/month
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Your subscription starts today. Next billing:{" "}
                      {nextBillingDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      .
                    </p>
                  </div>
                </div>
              </div>

              {/* Card badges - Hide on mobile, show compact on tablet+ */}
              <div className="hidden sm:flex items-center gap-3 mb-5">
                <span className="text-sm text-slate-500">We accept:</span>
                <div className="flex gap-2">{/* Card badges */}</div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-slate-700 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Card Information
                  </label>
                  <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>

                <div>
                  <label className="block text-slate-700 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="nameOnCard"
                    value={formData.nameOnCard}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border border-slate-200 bg-white transition-all duration-200 text-sm sm:text-base text-slate-800 placeholder-slate-400 outline-none hover:border-slate-300 focus:border-violet-500 focus:ring-3 focus:ring-violet-500/10"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border border-slate-200 bg-white transition-all duration-200 text-sm sm:text-base text-slate-800 placeholder-slate-400 outline-none hover:border-slate-300 focus:border-violet-500 focus:ring-3 focus:ring-violet-500/10"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!stripe || isProcessing || !clientSecret}
                  className="w-full py-3 sm:py-4 rounded-lg sm:rounded-xl text-white font-bold text-sm sm:text-base shadow-lg transition-all duration-300 transform active:scale-95 sm:hover:-translate-y-0.5 sm:hover:shadow-xl mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:active:scale-100"
                  style={{
                    background:
                      "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                    boxShadow: "0 10px 25px rgba(168, 85, 247, 0.3)",
                  }}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
                        viewBox="0 0 24 24"
                      >
                        {/* Loading spinner */}
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Subscribe Now"
                  )}
                </button>

                <p className="text-[10px] sm:text-xs text-slate-400 text-center leading-relaxed pt-1">
                  By subscribing, you agree to our{" "}
                  <a href="#" className="text-violet-500 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-violet-500 hover:underline">
                    Privacy Policy
                  </a>
                  . Your card will be charged ${SUBSCRIPTION_PRICE}/month
                  starting today.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showReceiptModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-32 opacity-10"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #ec4899)",
                }}
              ></div>

              <div className="relative p-8">
                <div className="flex justify-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, #a855f7, #ec4899)",
                    }}
                  >
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          delay: 0.4,
                          duration: 0.5,
                          ease: "easeOut",
                        }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                </div>

                <div className="text-center mb-6">
                  <h2
                    className="text-3xl font-bold mb-2"
                    style={{
                      background: "linear-gradient(135deg, #a855f7, #ec4899)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Welcome to ViralMotion!
                  </h2>
                  <p className="text-slate-600 text-lg">
                    Your trial has started successfully
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
                          style={{
                            background:
                              "linear-gradient(135deg, #a855f7, #ec4899)",
                          }}
                        >
                          V
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">
                            ViralMotion Pro
                          </div>
                          <div className="text-xs text-slate-500">
                            Monthly Subscription
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-slate-800">
                          ${SUBSCRIPTION_PRICE}
                        </div>
                        <div className="text-xs text-slate-500">/month</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2 text-sm">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #a855f7, #ec4899)",
                          }}
                        >
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">
                            Subscription Active
                          </div>
                          <div className="text-xs text-slate-500">
                            Next billing:{" "}
                            {nextBillingDate.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-100">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="text-sm">
                        <p className="text-slate-800 font-semibold mb-1">
                          What's Next?
                        </p>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Your subscription is now active! You've been charged $
                          {SUBSCRIPTION_PRICE} today. Your next billing date is{" "}
                          {nextBillingDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGoToDashboard}
                  className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #ec4899)",
                    boxShadow: "0 10px 25px rgba(168, 85, 247, 0.3)",
                  }}
                >
                  Get Started
                </button>

                <p className="text-xs text-slate-500 text-center mt-4">
                  You can manage your subscription anytime from your profile
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main wrapper component
export default function SubscriptionPage() {
  const [loading, setLoading] = useState(true);
  const [publishableKey, setPublishableKey] = useState("");

  useEffect(() => {
    const initPaymentForm = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // ✅ STEP 1: Check subscription status FIRST
        const statusResponse = await fetch(
          `${backendPrefix}/api/subscription/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();

          console.log("📊 Subscription status check:", statusData);

          // ✅ FIXED: Only block users with PAID subscriptions
          // Allow free_trial users to add payment method
          if (
            statusData.hasSubscription &&
            !statusData.trialExpired &&
            statusData.status !== "free_trial" // ✅ Key change: allow free_trial
          ) {
            console.log(
              "✅ User already has paid subscription, redirecting to dashboard"
            );
            toast.success("You already have an active subscription!");
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 1000);
            return; // Stop initialization
          }

          // ✅ Free trial users can proceed to add payment
          if (statusData.status === "free_trial") {
            console.log(
              "🎁 Free trial user - allowing payment method addition"
            );
          }
        }

        // ✅ STEP 2: Only proceed with setup intent if no active subscription
        const response = await fetch(
          `${backendPrefix}/api/subscription/create-setup-intent`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (data.publishableKey) {
          setPublishableKey(data.publishableKey);
          stripePromise = loadStripe(data.publishableKey);
          console.log("✅ Stripe initialized successfully");
        } else {
          throw new Error(data.error || "Failed to initialize payment");
        }
      } catch (err: any) {
        console.error("Failed to initialize payment form:", err);
        toast.error(err.message || "Failed to load payment form");

        // ✅ If error is about existing subscription, redirect
        if (
          err.message?.includes("already have") ||
          err.message?.includes("active subscription")
        ) {
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    initPaymentForm();
  }, []);

  if (loading || !publishableKey || !stripePromise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
