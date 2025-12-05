import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// import Homepage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignUp";

import Dashboard from "./pages/user/D2.tsx";

import { FactCardsEditor } from "./components/editors/FactCardsTemplate/Holder.tsx";
// import { QuoteTemplateEditor } from "./components/editors/QuoteTemplate/Holder.tsx";
import { BarGraphEditor } from "./components/editors/BarGraph/Holder.tsx";
import { SplitScreenEditor } from "./components/editors/SplitScreen/Holder.tsx";
import { KpiFlipCardEditor } from "./components/editors/KpiFlipCards/Holder.tsx";
// import { KenBurnsEditor } from "./components/editors/KenBurnsCarousel/Holder.tsx";
import { RedditVideoEditor } from "./components/editors/RedditTemplate/Holder.tsx";
import { StoryTellingVideoEditor } from "./components/editors/StoryTellingVideo/Holder.tsx";
import { CurveLineTrendEditor } from "./components/editors/CurveLineTrend/Holder.tsx";
import { NewTypingEditor } from "./components/editors/NewTextTypingEditor/Holder.tsx";
import QuoteGenerator from "./trials/geminischematester.tsx";
import QuoteTester from "./trials/quotesapitester.tsx";
import { QuoteSpotlightBatchRendering } from "./pages/batchrendering/QuoteSpotlight.tsx";
import { TextTypingTemplateBatchRendering } from "./pages/batchrendering/TextTyping.tsx";
import { KineticEditor } from "./components/editors/KineticText/Holder.tsx";
import { NeonFlickerEditor } from "./components/editors/NeonFlicker/Holder.tsx";
import { BarGraphBatchRendering } from "./pages/batchrendering/BarGraph.tsx";
import { CurveLineTrendBatchRendering } from "./pages/batchrendering/CurveLineTrend.tsx";
import { KenBurnsSwipeBatchRendering } from "./pages/batchrendering/KenburnsStack.tsx";
import { FactCardsBatchRendering } from "./pages/batchrendering/FactCardsTemplate.tsx";
import { KpiFlipBatchRendering } from "./pages/batchrendering/KpilipCards.tsx";
import { HeatmapEditor } from "./components/editors/HeatMap/Holder.tsx";
import { FlipCardsEditor } from "./components/editors/FlipCards/Holder.tsx";
import { LogoAnimationEditor } from "./components/editors/LogoAnimation/Holder.tsx";
import { NeonTubeFlickerEditor } from "./components/editors/NeonTubeFlicker/Holder.tsx";
import { DynamicTextEditor } from "./components/editors/RetroNeonText/Holder.tsx";
import RequireAuth from "./pages/auth/AuthChecker.tsx";
import ForgotPasswordPage from "./pages/auth/ForgotPassword.tsx";
import GoogleLoading from "./pages/auth/GoogleLoading.tsx";
import { AIToolsPanel } from "./components/ui/dsahboard/sections/tools/AIToolsPanel.tsx";
import { LandingPage } from "./pages/LandingPage.tsx";
import DynamicLayerEditor from "./components/editors/DynamicLayerEditor.tsx";
import LoginLoading from "./pages/auth/LoginLoader.tsx";

import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/theme.css";

function App() {
  return (

    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        {/* <Route
          path="/template/quotetemplate"
          element={
            <RequireAuth>
              <QuoteTemplateEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/project/:id/quotetemplate"
          element={
            <RequireAuth>
              <QuoteTemplateEditor />
            </RequireAuth>
          }
        /> */}
        <Route
          path="/template/quotetemplate/mode/batchrendering"
          element={
            <RequireAuth>
              <QuoteSpotlightBatchRendering />
            </RequireAuth>
          }
        />
        <Route
          path="/template/splitscreen"
          element={
            <RequireAuth>
              <SplitScreenEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/project/:id/splitscreen"
          element={
            <RequireAuth>
              <SplitScreenEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/template/newtexttyping/mode/batchrendering"
          element={
            <RequireAuth>
              <TextTypingTemplateBatchRendering />
            </RequireAuth>
          }
        />

        <Route
          path="/project/:id/texttypingtemplate"
          element={
            <RequireAuth>
              <NewTypingEditor />
            </RequireAuth>
          }
        />

        <Route
          path="/template/kinetictext"
          element={
            <RequireAuth>
              <KineticEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/project/:id/kinetictext"
          element={
            <RequireAuth>
              <KineticEditor />
            </RequireAuth>
          }
        />

        <Route
          path="/template/flipcards"
          element={
            <RequireAuth>
              <FlipCardsEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/project/:id/flipcards"
          element={
            <RequireAuth>
              <FlipCardsEditor />
            </RequireAuth>
          }
        />

        <Route
          path="/template/factcards"
          element={
            <RequireAuth>
              <FactCardsEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/project/:id/factcards"
          element={
            <RequireAuth>
              <FactCardsEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/template/factcards/mode/batchrendering"
          element={
            <RequireAuth>
              <FactCardsBatchRendering />
            </RequireAuth>
          }
        />

        <Route
          path="/template/bargraph"
          element={
            <RequireAuth>
              <BarGraphEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/project/:id/bargraph"
          element={
            <RequireAuth>
              <BarGraphEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/template/bargraph/mode/batchrendering"
          element={
            <RequireAuth>
              <BarGraphBatchRendering />
            </RequireAuth>
          }
        />

        <Route
          path="/template/retroneon"
          element={
            <RequireAuth>
              <DynamicTextEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/project/:id/retroneon"
          element={
            <RequireAuth>
              <DynamicTextEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/template/kpiflipcards"
          element={
            <RequireAuth>
              <KpiFlipCardEditor />
            </RequireAuth>
          }
        />

        <Route
          path="/project/:id/kpiflipcards"
          element={
            <RequireAuth>
              <KpiFlipCardEditor />
            </RequireAuth>
          }
        />

        <Route
          path="/template/kpiflipcards/mode/batchrendering"
          element={
            <RequireAuth>
              <KpiFlipBatchRendering />
            </RequireAuth>
          }
        />
        {/* <Route
          path="/template/kenburnscarousel"
          element={
            <RequireAuth>
              <KenBurnsEditor />
            </RequireAuth>
          }
        /> */}
        {/* <Route
          path="/project/:id/kenburnscarousel"
          element={
            <RequireAuth>
              <KenBurnsEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/template/kenburnscarousel"
          element={
            <RequireAuth>
              <KenBurnsEditor />
            </RequireAuth>
          }
        /> */}
        <Route
          path="/template/kenburnscarousel/mode/batchrendering"
          element={
            <RequireAuth>
              <KenBurnsSwipeBatchRendering />
            </RequireAuth>
          }
        />
        <Route
          path="/template/curvelinetrend"
          element={
            <RequireAuth>
              <CurveLineTrendEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/project/:id/curvelinetrend"
          element={
            <RequireAuth>
              <CurveLineTrendEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/template/curvelinetrend/mode/batchrendering"
          element={
            <RequireAuth>
              <CurveLineTrendBatchRendering />
            </RequireAuth>
          }
        />

        {/* <Route
          path="/template/faketextconversation"
          element={
            <RequireAuth>
              <FakeTextConversationEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/project/:id/faketextconversation"
          element={
            <RequireAuth>
              <FakeTextConversationEditor />
            </RequireAuth>
          }
        /> */}
        <Route
          path="/template/redditvideo"
          element={
            <RequireAuth>
              <RedditVideoEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/project/:id/redditvideo"
          element={
            <RequireAuth>
              <RedditVideoEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/template/storytelling"
          element={
            <RequireAuth>
              <StoryTellingVideoEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/project/:id/storytelling"
          element={
            <RequireAuth>
              <StoryTellingVideoEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/template/newtexttyping"
          element={
            <RequireAuth>
              <NewTypingEditor />
            </RequireAuth>
          }
        />

        <Route
          path="/template/neonflicker"
          element={
            <RequireAuth>
              <NeonFlickerEditor />
            </RequireAuth>
          }
        />

        <Route
          path="/project/:id/neonflicker"
          element={
            <RequireAuth>
              <NeonFlickerEditor />
            </RequireAuth>
          }
        />

        <Route
          path="/template/logoanimation"
          element={
            <RequireAuth>
              <LogoAnimationEditor />
            </RequireAuth>
          }
        />

        <Route
          path="/project/:id/logoanimation"
          element={
            <RequireAuth>
              <LogoAnimationEditor />
            </RequireAuth>
          }
        />

        <Route
          path="/template/heatmap"
          element={
            <RequireAuth>
              <HeatmapEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/project/:id/heatmap"
          element={
            <RequireAuth>
              <HeatmapEditor />
            </RequireAuth>
          }
        />

        <Route
          path="/template/neontube"
          element={
            <RequireAuth>
              <NeonTubeFlickerEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/project/:id/neontube"
          element={
            <RequireAuth>
              <NeonTubeFlickerEditor />
            </RequireAuth>
          }
        />
        <Route path="/loading" element={<GoogleLoading />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/initializing-login" element={<LoginLoading />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LandingPage />} />

        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/editor"
          element={
            <RequireAuth>
              <DynamicLayerEditor />
            </RequireAuth>
          }
        />
        <Route path="/tester" element={<QuoteGenerator />} />
        <Route path="/qtester" element={<QuoteTester />} />
        <Route
          path="/tools/ai-image"
          element={
            <RequireAuth>
              <AIToolsPanel />
            </RequireAuth>
          }
        />
        {/* <Route path="/testpage" element={<QuoteTemplateEditor2 />} /> */}
      </Routes>
      {/* 👇 Must be rendered globally */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#333",
          },
          success: {
            iconTheme: {
              primary: "#4f46e5", // Indigo
              secondary: "#fff",
            },
          },
        }}
      />
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
