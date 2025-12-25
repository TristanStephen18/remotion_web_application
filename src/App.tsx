import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { getCurrentUser, tokenManager } from "./services/authService";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignUp";
import ForgotPasswordPage from "./pages/auth/ForgotPassword.tsx";
import GoogleLoading from "./pages/auth/GoogleLoading.tsx";
import LoginLoading from "./pages/auth/LoginLoader.tsx";

// Main Pages
import Dashboard from "./pages/user/D2.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import DynamicLayerEditor from "./components/editors/DynamicLayerEditor.tsx";
import RedditVideoWizard from "./components/editors/RedditVideoWizard.tsx";
import QuoteVideoWizard from './components/editors/QuoteVideoWizard.tsx';
import KenBurnsWizard from './components/editors/KenBurnsWizard';
import PhotoCollageWizard from "./components/editors/PhotoCollageWizard.tsx";
import FakeChatWizard from "./components/editors/FakeChatWizard.tsx";
import SplitScreenWizard from "./components/editors/SplitScreenWizard.tsx";
import SubscriptionPage from "./pages/subscription/SubscriptionPage.tsx";

// Editors
// import { FactCardsEditor } from "./components/editors/FactCardsTemplate/Holder.tsx";
// import { BarGraphEditor } from "./components/editors/BarGraph/Holder.tsx";
// import { SplitScreenEditor } from "./components/editors/SplitScreen/Holder.tsx";
// import { KpiFlipCardEditor } from "./components/editors/KpiFlipCards/Holder.tsx";
// import { RedditVideoEditor } from "./components/editors/RedditTemplate/Holder.tsx";
// import { StoryTellingVideoEditor } from "./components/editors/StoryTellingVideo/Holder.tsx";
// import { CurveLineTrendEditor } from "./components/editors/CurveLineTrend/Holder.tsx";
// import { NewTypingEditor } from "./components/editors/NewTextTypingEditor/Holder.tsx";
// import { KineticEditor } from "./components/editors/KineticText/Holder.tsx";
// import { NeonFlickerEditor } from "./components/editors/NeonFlicker/Holder.tsx";
// import { HeatmapEditor } from "./components/editors/HeatMap/Holder.tsx";
// import { FlipCardsEditor } from "./components/editors/FlipCards/Holder.tsx";
// import { LogoAnimationEditor } from "./components/editors/LogoAnimation/Holder.tsx";
// import { NeonTubeFlickerEditor } from "./components/editors/NeonTubeFlicker/Holder.tsx";
// import { DynamicTextEditor } from "./components/editors/RetroNeonText/Holder.tsx";

// Batch Rendering
// import { QuoteSpotlightBatchRendering } from "./pages/batchrendering/QuoteSpotlight.tsx";
// import { TextTypingTemplateBatchRendering } from "./pages/batchrendering/TextTyping.tsx";
// import { BarGraphBatchRendering } from "./pages/batchrendering/BarGraph.tsx";
// import { CurveLineTrendBatchRendering } from "./pages/batchrendering/CurveLineTrend.tsx";
// import { KenBurnsSwipeBatchRendering } from "./pages/batchrendering/KenburnsStack.tsx";
// import { FactCardsBatchRendering } from "./pages/batchrendering/FactCardsTemplate.tsx";
// import { KpiFlipBatchRendering } from "./pages/batchrendering/KpilipCards.tsx";

// Tools
import { AIToolsPanel } from "./components/ui/dsahboard/sections/tools/AIToolsPanel.tsx";
import QuoteGenerator from "./trials/geminischematester.tsx";
import QuoteTester from "./trials/quotesapitester.tsx";

// Theme
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/theme.css";
// import VideoEditorDemo from "./pages/trials/ScreenshotTrial.tsx";
import PricingPage from "./pages/PricingPage.tsx";
import { backendPrefix } from "./config";
// import { TemplateGallery } from "./components/ui/dsahboard/sections/refactored/TemplatesSection.tsx";

import { AdminProvider } from "./contexts/AdminContext";
import { ReAuthProvider } from "./contexts/ReAuthContext";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminSetup } from "./pages/admin/AdminSetup";
import { usePageTracking } from "./hooks/usePageTracking";
import { AdminUserDetail } from "./pages/admin/AdminUserDetail";
import { AdminSecurity } from "./pages/admin/AdminSecurity";
import { AdminManagement } from "./pages/admin/AdminManagement";


// ✅ UPDATED: Auth Provider with subscription check
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }

      try {
        const user = await getCurrentUser();

        if (user) {
          setIsAuthenticated(true);
          tokenManager.startAutoRefresh();
          console.log("✅ Session restored for:", user.email);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("token");
        }
        console.log("User is loggedin:", isAuthenticated);
      } catch (error) {
        console.error("❌ Auth check failed:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        if (e.newValue) {
          setIsAuthenticated(true);
          tokenManager.startAutoRefresh();
          window.location.href = "/dashboard";
        } else {
          setIsAuthenticated(false);
          tokenManager.stopAutoRefresh();
          window.location.href = "/login";
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (isChecking) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Animated Background Blobs */}
        <div className="absolute w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl top-20 left-20 animate-float-1"></div>
        <div className="absolute w-80 h-80 bg-purple-200/25 rounded-full blur-3xl bottom-20 right-20 animate-float-2"></div>
        <div className="absolute w-48 h-48 bg-blue-200/30 rounded-full blur-3xl top-1/2 right-1/4 animate-float-3"></div>

        {/* Sparkle Effects */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-sparkle"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-sparkle delay-700"></div>
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-sparkle delay-1400"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-indigo-300 rounded-full animate-sparkle delay-500"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Main Spinner with Gradient Ring */}
          <div className="relative w-24 h-24 mb-8">
            {/* Outer static ring */}
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>

            {/* Animated gradient ring */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 border-r-purple-500 rounded-full animate-spin-smooth"></div>
            </div>

            {/* Inner pulsing circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full animate-pulse-scale shadow-lg shadow-indigo-300/50"></div>
            </div>

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white animate-fade-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </div>

          {/* Animated Dots */}
          <div className="flex gap-2 mb-6">
            <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce-smooth"></div>
            <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce-smooth delay-200"></div>
            <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce-smooth delay-400"></div>
          </div>

          {/* Text */}
          <p className="text-gray-700 text-lg font-semibold tracking-wide animate-fade-in">
            Redirecting...
          </p>

          {/* Subtle progress indicator */}
          <div className="relative w-40 h-1 bg-gray-100 rounded-full mt-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full animate-progress-slide"></div>
          </div>
        </div>

        {/* Animations */}
        <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(-20px, -25px) scale(1.1); opacity: 0.4; }
        }

        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.25; }
          50% { transform: translate(20px, 25px) scale(1.15); opacity: 0.35; }
        }

        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(-15px, -20px); opacity: 0.4; }
        }

        @keyframes spin-smooth {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        @keyframes bounce-smooth {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(-10px); opacity: 0.7; }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        @keyframes progress-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-float-1 { animation: float-1 14s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 16s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 12s ease-in-out infinite; }
        .animate-spin-smooth { animation: spin-smooth 2s linear infinite; }
        .animate-pulse-scale { animation: pulse-scale 2s ease-in-out infinite; }
        .animate-bounce-smooth { animation: bounce-smooth 1.6s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 3s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-pulse { animation: fade-pulse 2s ease-in-out infinite; }
        .animate-progress-slide { animation: progress-slide 2s ease-in-out infinite; }

        .delay-200 { animation-delay: 200ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-1400 { animation-delay: 1400ms; }
      `}</style>
      </div>
    );
  }

  return <>{children}</>;
}

// ✅ FIXED: RootRedirect - only shows landing page for non-authenticated users
// ✅ NEW: Smart redirect for root route
function RootRedirect() {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndRedirect = async () => {
      const token = localStorage.getItem("token");

      // Not logged in → Show landing page
      if (!token) {
        setChecking(false);
        return;
      }

      // Logged in → Check subscription status
      try {
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

        console.log("🔍 Root redirect - subscription check:", data);

        if (data.success) {
          if (data.hasSubscription && !data.trialExpired) {
            // Has active subscription/trial → Dashboard
            console.log("✅ Redirecting to dashboard");
            navigate("/dashboard", { replace: true });
          } else if (data.trialExpired) {
            // Trial expired → Subscription page
            console.log("⏰ Trial expired, redirecting to subscription");
            navigate("/subscription", { replace: true });
          } else {
            // Edge case → Dashboard (fail open)
            console.log("⚠️ Edge case, redirecting to dashboard");
            navigate("/dashboard", { replace: true });
          }
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        navigate("/dashboard", { replace: true }); // Fail open
      } finally {
        setChecking(false);
      }
    };

    checkAndRedirect();
  }, [navigate]);

  if (checking) {
    return null;
  }

  return <LandingPage />;
}

// ✅ NEW: Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("🚫 No token, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// ✅ NEW: Subscription Protected Route - Checks authentication AND subscription
function SubscriptionProtectedRoute({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkSubscription = async () => {
      if (!token) {
        setHasAccess(false);
        setChecking(false);
        return;
      }

      try {
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

        console.log("🔐 SubscriptionProtectedRoute - Subscription check:", data);
        console.log("   - hasSubscription:", data.hasSubscription);
        console.log("   - isLifetime:", data.isLifetime);
        console.log("   - status:", data.status);
        console.log("   - trialExpired:", data.trialExpired);

        if (data.success) {
          // ✅ CRITICAL: Check lifetime FIRST
          if (data.isLifetime === true) {
            console.log("🌟 Lifetime access detected - GRANTING ACCESS");
            setHasAccess(true);
          } else if (data.hasSubscription === true && data.trialExpired !== true) {
            console.log("✅ Active subscription detected - GRANTING ACCESS");
            setHasAccess(true);
          } else {
            console.log("❌ No active subscription - DENYING ACCESS");
            console.log("   Reason: hasSubscription=", data.hasSubscription, "trialExpired=", data.trialExpired);
            setHasAccess(false);
          }
        } else {
          console.log("❌ API returned success: false");
          setHasAccess(false);
        }
      } catch (error) {
        console.error("❌ Subscription check error:", error);
        setHasAccess(false);
      } finally {
        setChecking(false);
      }
    };

    checkSubscription();
  }, [token]);

  // Still checking
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Checking access...</p>
        </div>
      </div>
    );
  }

  // No token
  if (!token) {
    console.log("🚫 No token, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // No subscription access
  if (!hasAccess) {
    console.log("🚫 No subscription access, redirecting to subscription page");
    return <Navigate to="/subscription" replace />;
  }

  // Has access!
  console.log("✅ Access granted, rendering protected content");
  return <>{children}</>;
}

// ✅ NEW: Public Only Route (redirect to subscription if logged in)
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  if (token) {
    console.log("✅ Already logged in, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// ✅ NEW: AppContent component with page tracking
function AppContent() {
  usePageTracking(); // Track all page views
  
  return (
    <Routes>
      {/* ========== PUBLIC ROUTES (Redirect to subscription if logged in) ========== */}
      
      <Route path="/" element={<RootRedirect />} />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <PublicOnlyRoute>
            <ForgotPasswordPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/pricing"
        element={
          <PublicOnlyRoute>
            <PricingPage />
          </PublicOnlyRoute>
        }
      />

      {/* Loading pages (no protection needed) */}
      <Route path="/loading" element={<GoogleLoading />} />
      <Route path="/initializing-login" element={<LoginLoading />} />

      {/* ========== PROTECTED ROUTES (Require authentication) ========== */}
      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <SubscriptionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <SubscriptionProtectedRoute>
            <Dashboard />
          </SubscriptionProtectedRoute>
        }
      />

      <Route
        path="/editor"
        element={
          <ProtectedRoute>
            <DynamicLayerEditor />
          </ProtectedRoute>
        }
      />

       {/* =========== Wixards ========= */}
        <Route
        path="/reddit-wizard"
        element={
          <ProtectedRoute>
            <RedditVideoWizard />
          </ProtectedRoute>
        }
      />


      <Route
        path="/quote-wizard"
        element={
          <ProtectedRoute>
            <QuoteVideoWizard />
          </ProtectedRoute>
        }
      />

      <Route
  path="/kenburns-wizard"
  element={
    <ProtectedRoute>
      <KenBurnsWizard />
    </ProtectedRoute>
  }
/>


<Route
  path="/collage-wizard"
  element={
    <ProtectedRoute>
      <PhotoCollageWizard />
    </ProtectedRoute>
  }
/>


<Route
  path="/fakechat-wizard"
  element={
    <ProtectedRoute>
      <FakeChatWizard />
    </ProtectedRoute>
  }
/>


<Route
  path="/splitscreen-wizard"
  element={
    <ProtectedRoute>
      <SplitScreenWizard />
    </ProtectedRoute>
  }
/>
      
      {/* ========== TOOLS ========== */}
      <Route
        path="/tools/ai-image"
        element={
          <ProtectedRoute>
            <AIToolsPanel />
          </ProtectedRoute>
        }
      />

      {/* ========== TEST ROUTES ========== */}
      <Route
        path="/tester"
        element={
          <ProtectedRoute>
            <QuoteGenerator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/qtester"
        element={
          <ProtectedRoute>
            <QuoteTester />
          </ProtectedRoute>
        }
      />

      {/* ========== ADMIN ROUTES ========== */}
      <Route path="/admin/setup" element={<AdminSetup />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/users/:userId" element={<AdminUserDetail />} />
      <Route path="/admin/security" element={<AdminSecurity />} />
      <Route path="/admin/manage" element={<AdminManagement />} /> 
      

      {/* ========== 404 FALLBACK ========== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AdminProvider>
            <ReAuthProvider>
            <AppContent />

            {/* Global Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#fff",
                  color: "#333",
                },
                success: {
                  iconTheme: {
                    primary: "#4f46e5",
                    secondary: "#fff",
                  },
                },
              }}
            />
            </ReAuthProvider>
          </AdminProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

// function App() {
//   return (
//     <ThemeProvider>
//       <BrowserRouter>
//         <AuthProvider>
//           <Routes>
//             {/* ========== PUBLIC ROUTES (Redirect to subscription if logged in) ========== */}
            
//             <Route path="/" element={<RootRedirect />} />

//             <Route
//               path="/login"
//               element={
//                 <PublicOnlyRoute>
//                   <LoginPage />
//                 </PublicOnlyRoute>
//               }
//             />

//             <Route
//               path="/signup"
//               element={
//                 <PublicOnlyRoute>
//                   <SignupPage />
//                 </PublicOnlyRoute>
//               }
//             />

//             <Route
//               path="/forgot-password"
//               element={
//                 <PublicOnlyRoute>
//                   <ForgotPasswordPage />
//                 </PublicOnlyRoute>
//               }
//             />

//             <Route
//               path="/pricing"
//               element={
//                 <PublicOnlyRoute>
//                   <PricingPage />
//                 </PublicOnlyRoute>
//               }
//             />

//             {/* Loading pages (no protection needed) */}
//             <Route path="/loading" element={<GoogleLoading />} />
//             <Route path="/initializing-login" element={<LoginLoading />} />
//             {/* <Route path="/pricing" element={<PricingPage />} /> */}

//             {/* ========== PROTECTED ROUTES (Require authentication) ========== */}
//             <Route
//               path="/subscription"
//               element={
//                 <ProtectedRoute>
//                   <SubscriptionPage /> {/* ✅ REMOVED SubscriptionGuard */}
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute>
//                   <Dashboard />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/editor"
//               element={
//                 <ProtectedRoute>
//                   <DynamicLayerEditor />
//                 </ProtectedRoute>
//               }
//             />
            
//             {/* ========== TOOLS ========== */}
//             <Route
//               path="/tools/ai-image"
//               element={
//                 <ProtectedRoute>
//                   <AIToolsPanel />
//                 </ProtectedRoute>
//               }
//             />

//             {/* ========== TEST ROUTES ========== */}
//             <Route
//               path="/tester"
//               element={
//                 <ProtectedRoute>
//                   <QuoteGenerator />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/qtester"
//               element={
//                 <ProtectedRoute>
//                   <QuoteTester />
//                 </ProtectedRoute>
//               }
//             />

//             {/* ========== 404 FALLBACK ========== */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>

//           {/* Global Toast Notifications */}
//           <Toaster
//             position="top-right"
//             toastOptions={{
//               style: {
//                 background: "#fff",
//                 color: "#333",
//               },
//               success: {
//                 iconTheme: {
//                   primary: "#4f46e5",
//                   secondary: "#fff",
//                 },
//               },
//             }}
//           />
//         </AuthProvider>
//       </BrowserRouter>
//     </ThemeProvider>
//   );
// }

export default App;
