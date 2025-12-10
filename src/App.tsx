import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
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
import SubscriptionPage from "./pages/subscription/SubscriptionPage.tsx";

// Editors
import { FactCardsEditor } from "./components/editors/FactCardsTemplate/Holder.tsx";
import { BarGraphEditor } from "./components/editors/BarGraph/Holder.tsx";
import { SplitScreenEditor } from "./components/editors/SplitScreen/Holder.tsx";
import { KpiFlipCardEditor } from "./components/editors/KpiFlipCards/Holder.tsx";
import { RedditVideoEditor } from "./components/editors/RedditTemplate/Holder.tsx";
import { StoryTellingVideoEditor } from "./components/editors/StoryTellingVideo/Holder.tsx";
import { CurveLineTrendEditor } from "./components/editors/CurveLineTrend/Holder.tsx";
import { NewTypingEditor } from "./components/editors/NewTextTypingEditor/Holder.tsx";
import { KineticEditor } from "./components/editors/KineticText/Holder.tsx";
// import { NeonFlickerEditor } from "./components/editors/NeonFlicker/Holder.tsx";
// import { HeatmapEditor } from "./components/editors/HeatMap/Holder.tsx";
import { FlipCardsEditor } from "./components/editors/FlipCards/Holder.tsx";
import { LogoAnimationEditor } from "./components/editors/LogoAnimation/Holder.tsx";
// import { NeonTubeFlickerEditor } from "./components/editors/NeonTubeFlicker/Holder.tsx";
// import { DynamicTextEditor } from "./components/editors/RetroNeonText/Holder.tsx";

// Batch Rendering
import { QuoteSpotlightBatchRendering } from "./pages/batchrendering/QuoteSpotlight.tsx";
import { TextTypingTemplateBatchRendering } from "./pages/batchrendering/TextTyping.tsx";
import { BarGraphBatchRendering } from "./pages/batchrendering/BarGraph.tsx";
import { CurveLineTrendBatchRendering } from "./pages/batchrendering/CurveLineTrend.tsx";
import { KenBurnsSwipeBatchRendering } from "./pages/batchrendering/KenburnsStack.tsx";
import { FactCardsBatchRendering } from "./pages/batchrendering/FactCardsTemplate.tsx";
import { KpiFlipBatchRendering } from "./pages/batchrendering/KpilipCards.tsx";

// Tools
import { AIToolsPanel } from "./components/ui/dsahboard/sections/tools/AIToolsPanel.tsx";
import QuoteGenerator from "./trials/geminischematester.tsx";
import QuoteTester from "./trials/quotesapitester.tsx";

// Theme
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/theme.css";
import VideoEditorDemo from "./pages/trials/ScreenshotTrial.tsx";
import PricingPage from "./pages/PricingPage.tsx";
import { backendPrefix } from "./config.ts";

// ✅ NEW: Auth Provider Component
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
      } catch (error) {
        console.error("❌ Auth check failed:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();

    // ✅ NEW: Cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      console.log(isAuthenticated);
      if (e.key === "token") {
        if (e.newValue) {
          // Logged in another tab
          setIsAuthenticated(true);
          tokenManager.startAutoRefresh();
          window.location.href = "/subscription";
        } else {
          // Logged out in another tab
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f9fafb",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #6366f1",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p
          style={{
            marginTop: "16px",
            color: "#6b7280",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Checking session...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
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

// ✅ NEW: Public Only Route (redirect to subscription if logged in)
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  if (token) {
    console.log("✅ Already logged in, redirecting to subscription");
    return <Navigate to="/subscription" replace />;
  }

  return <>{children}</>;
}

function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSub = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${backendPrefix}/api/subscription/status`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        // If user already has subscription, redirect to dashboard
        if (data.success && data.hasSubscription) {
          console.log('✅ User has subscription, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
          return;
        }

        setChecking(false);
      } catch (error) {
        console.error('Error checking subscription:', error);
        setChecking(false);
      }
    };

    checkSub();
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking subscription...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* ========== PUBLIC ROUTES (Redirect to subscription if logged in) ========== */}
            <Route
              path="/"
              element={
                localStorage.getItem("token") ? (
                  <Navigate to="/subscription" replace />
                ) : (
                  <LandingPage />
                )
              }
            />

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
            {/* <Route path="/pricing" element={<PricingPage />} /> */}

            {/* ========== PROTECTED ROUTES (Require authentication) ========== */}
            <Route
              path="/subscription"
              element={
                <ProtectedRoute>
                  <SubscriptionGuard>
                    <SubscriptionPage />
                  </SubscriptionGuard>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
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

            {/* ========== TEMPLATE EDITORS ========== */}
            <Route
              path="/template/splitscreen"
              element={
                <ProtectedRoute>
                  <SplitScreenEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/splitscreen"
              element={
                <ProtectedRoute>
                  <SplitScreenEditor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/template/kinetictext"
              element={
                <ProtectedRoute>
                  <KineticEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/kinetictext"
              element={
                <ProtectedRoute>
                  <KineticEditor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/template/flipcards"
              element={
                <ProtectedRoute>
                  <FlipCardsEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/flipcards"
              element={
                <ProtectedRoute>
                  <FlipCardsEditor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/template/factcards"
              element={
                <ProtectedRoute>
                  <FactCardsEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/factcards"
              element={
                <ProtectedRoute>
                  <FactCardsEditor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/template/bargraph"
              element={
                <ProtectedRoute>
                  <BarGraphEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/bargraph"
              element={
                <ProtectedRoute>
                  <BarGraphEditor />
                </ProtectedRoute>
              }
            />

            {/* <Route
              path="/template/retroneon"
              element={
                <ProtectedRoute>
                  <DynamicTextEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/retroneon"
              element={
                <ProtectedRoute>
                  <DynamicTextEditor />
                </ProtectedRoute>
              }
            /> */}

            <Route
              path="/template/kpiflipcards"
              element={
                <ProtectedRoute>
                  <KpiFlipCardEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/kpiflipcards"
              element={
                <ProtectedRoute>
                  <KpiFlipCardEditor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/template/curvelinetrend"
              element={
                <ProtectedRoute>
                  <CurveLineTrendEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/curvelinetrend"
              element={
                <ProtectedRoute>
                  <CurveLineTrendEditor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/template/redditvideo"
              element={
                <ProtectedRoute>
                  <RedditVideoEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/redditvideo"
              element={
                <ProtectedRoute>
                  <RedditVideoEditor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/template/storytelling"
              element={
                <ProtectedRoute>
                  <StoryTellingVideoEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/storytelling"
              element={
                <ProtectedRoute>
                  <StoryTellingVideoEditor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/template/newtexttyping"
              element={
                <ProtectedRoute>
                  <NewTypingEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/texttypingtemplate"
              element={
                <ProtectedRoute>
                  <NewTypingEditor />
                </ProtectedRoute>
              }
            />

            {/* <Route
              path="/template/neonflicker"
              element={
                <ProtectedRoute>
                  <NeonFlickerEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/neonflicker"
              element={
                <ProtectedRoute>
                  <NeonFlickerEditor />
                </ProtectedRoute>
              }
            /> */}

            <Route
              path="/template/logoanimation"
              element={
                <ProtectedRoute>
                  <LogoAnimationEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/logoanimation"
              element={
                <ProtectedRoute>
                  <LogoAnimationEditor />
                </ProtectedRoute>
              }
            />

            {/* <Route
              path="/template/heatmap"
              element={
                <ProtectedRoute>
                  <HeatmapEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/heatmap"
              element={
                <ProtectedRoute>
                  <HeatmapEditor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/template/neontube"
              element={
                <ProtectedRoute>
                  <NeonTubeFlickerEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/neontube"
              element={
                <ProtectedRoute>
                  <NeonTubeFlickerEditor />
                </ProtectedRoute>
              }
            /> */}

            {/* ========== BATCH RENDERING ========== */}
            <Route
              path="/template/quotetemplate/mode/batchrendering"
              element={
                <ProtectedRoute>
                  <QuoteSpotlightBatchRendering />
                </ProtectedRoute>
              }
            />

            <Route
              path="/template/newtexttyping/mode/batchrendering"
              element={
                <ProtectedRoute>
                  <TextTypingTemplateBatchRendering />
                </ProtectedRoute>
              }
            />

            <Route
              path="/template/factcards/mode/batchrendering"
              element={
                <ProtectedRoute>
                  <FactCardsBatchRendering />
                </ProtectedRoute>
              }
            />

            <Route
              path="/template/bargraph/mode/batchrendering"
              element={
                <ProtectedRoute>
                  <BarGraphBatchRendering />
                </ProtectedRoute>
              }
            />

            <Route
              path="/template/kpiflipcards/mode/batchrendering"
              element={
                <ProtectedRoute>
                  <KpiFlipBatchRendering />
                </ProtectedRoute>
              }
            />

            <Route
              path="/template/kenburnscarousel/mode/batchrendering"
              element={
                <ProtectedRoute>
                  <KenBurnsSwipeBatchRendering />
                </ProtectedRoute>
              }
            />

            <Route
              path="/template/curvelinetrend/mode/batchrendering"
              element={
                <ProtectedRoute>
                  <CurveLineTrendBatchRendering />
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
            <Route path="/ss" element={<VideoEditorDemo/>} />


            {/* ========== 404 FALLBACK ========== */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

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
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
