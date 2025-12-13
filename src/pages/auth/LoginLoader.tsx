import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { checkSubscriptionStatus } from "../../utils/subscriptionUtils";
import { backendPrefix } from "../../config";

const LoginLoading = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAndRedirect = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${backendPrefix}/api/subscription/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        console.log("📊 Subscription check result:", data);

        // ✅ NEW LOGIC:
        if (data.success) {
          if (data.hasSubscription) {
            // User has active subscription OR active free trial
            console.log(
              "✅ Has active subscription/trial - redirecting to dashboard"
            );
            navigate("/dashboard");
          } else if (data.trialExpired) {
            // Free trial expired, needs to subscribe
            console.log("⏰ Trial expired - redirecting to subscription page");
            navigate("/subscription");
          } else {
            // Edge case: no subscription record (shouldn't happen with auto-creation)
            // Default to dashboard with fail-open approach
            console.log(
              "⚠️ No subscription record found - allowing dashboard access"
            );
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        navigate("/dashboard"); // On error, allow access (fail open)
      } finally {
        setIsChecking(false);
      }
    };

    checkAndRedirect();
  }, [navigate]);

  if (!isChecking) return null;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden px-6 text-center bg-white">
      <div className="absolute w-[280px] h-[280px] bg-purple-200/40 rounded-full blur-3xl top-20 left-20 animate-float-gentle"></div>
      <div className="absolute w-[320px] h-[320px] bg-pink-200/30 rounded-full blur-3xl bottom-20 right-20 animate-float-gentle-alt"></div>
      <div className="absolute w-[200px] h-[200px] bg-blue-200/35 rounded-full blur-3xl top-1/2 right-1/4 animate-float-soft"></div>

      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-twinkle"></div>
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-twinkle delay-600"></div>
      <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-twinkle delay-1200"></div>
      <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-purple-300 rounded-full animate-twinkle delay-400"></div>

      <div className="relative z-10">
        <div className="animate-slide-up mb-14">
          <div className="logo flex items-center gap-3 justify-center">
            <div className="relative">
              <span className="logo__dot block w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse-soft shadow-lg shadow-purple-300/50"></span>
            </div>
            <span className="logo__text text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent tracking-wide">
              ViralMotion
            </span>
          </div>
        </div>

        <div className="relative w-32 h-32 mb-12 mx-auto animate-slide-up delay-200">
          <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin-smooth"></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-xl animate-camera-bob flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                </div>
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-recording-pulse"></div>
              </div>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-t-md"></div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-center mb-8 animate-slide-up delay-300">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce-gentle"></div>
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce-gentle delay-200"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce-gentle delay-400"></div>
        </div>

        <h2 className="text-3xl font-bold mb-3 animate-slide-up delay-400 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          Setting up your studio
        </h2>

        <p className="text-gray-600 text-lg font-medium mb-2 animate-slide-up delay-500">
          Preparing your video creation tools
        </p>

        <div className="relative w-80 max-w-full mx-auto mt-6 animate-slide-up delay-600">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full animate-progress-fill shadow-lg"></div>
          </div>
        </div>

        <p className="text-gray-400 text-sm mt-5 animate-slide-up delay-700">
          Your creative workspace is almost ready ✨
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes spin-smooth {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float-gentle {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-15px, -20px) scale(1.05); }
        }

        @keyframes float-gentle-alt {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, 20px) scale(1.08); }
        }

        @keyframes float-soft {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-10px, -15px); }
        }

        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes progress-fill {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }

        @keyframes camera-bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-1deg); }
          75% { transform: translateY(-3px) rotate(1deg); }
        }

        @keyframes recording-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        .animate-spin-smooth { animation: spin-smooth 3s linear infinite; }
        .animate-slide-up { animation: slide-up 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-float-gentle { animation: float-gentle 12s ease-in-out infinite; }
        .animate-float-gentle-alt { animation: float-gentle-alt 14s ease-in-out infinite; }
        .animate-float-soft { animation: float-soft 10s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulse-soft 2.5s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 1.8s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-progress-fill { animation: progress-fill 3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-camera-bob { animation: camera-bob 3s ease-in-out infinite; }
        .animate-recording-pulse { animation: recording-pulse 1.5s ease-in-out infinite; }

        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-1200 { animation-delay: 1200ms; }
      `}</style>
    </div>
  );
};

export default LoginLoading;
