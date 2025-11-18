import React, { useState, useRef, useEffect } from "react";
// import { DisplayerModal } from "../Global/Modal"; // <-- Replaced
import { KineticTemplateSideNav } from "./Sidenav";
import { KineticTextSection } from "./sidenav_sections/TextSection";
import { KineticColorSection } from "./sidenav_sections/ColorSection";
import { KineticTimingSection } from "./sidenav_sections/TimingSection";
import { KineticEffectsSection } from "./sidenav_sections/EffectsSection";
import { KineticTypographyPreview } from "../../layout/EditorPreviews/KineticTypographyPreview";
import { defaultpanelwidth } from "../../../data/DefaultValues";
// --- REMOVED BROKEN IMPORTS for options and export ---

// --- ADDED IMPORTS ---
import { ExportModal } from "../../ui/modals/ExportModal";
import { TopNavWithSave } from "../../navigations/single_editors/WithSave";
import { SaveProjectModal } from "../../ui/modals/SaveModal";
import { LoadingOverlay } from "../../ui/modals/LoadingProjectModal";
import { useProjectSave } from "../../../hooks/SaveProject";
import { useParams } from "react-router-dom";
import { backendPrefix } from "../../../config"; // Assuming this path is correct
// --- END ADDED IMPORTS ---

// Define the config interface matching Composition.tsx
interface TypographyConfig {
  id: string;
  words: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  timing: {
    staggerDelay: number;
    collisionFrame: number;
    explosionDelay: number;
  };
  effects: {
    shakeIntensity: number;
    particleCount: number;
    ballSize: number;
  };
}

// Define a default configuration
const defaultConfig: TypographyConfig = {
  id: "default-kinetic-v1",
  words: ["KINETIC", "TYPOGRAPHY"],
  colors: {
    primary: "#00f2ff",
    secondary: "#ff4fa3",
    accent: "#ffffff",
  },
  timing: {
    staggerDelay: 5,
    collisionFrame: 45,
    explosionDelay: 20,
  },
  effects: {
    shakeIntensity: 12,
    particleCount: 70,
    ballSize: 120,
  },
};

export const KineticEditor: React.FC = () => {
  const { id } = useParams(); // ADDED

  // 🟢 Core States (ADDED)
  const [templateName, setTemplateName] = useState(
    "💥 Kinetic Text Template"
  );
  // Main state for the Remotion component
  const [config, setConfig] = useState(defaultConfig);

  // UI State
  const [previewSize, setPreviewSize] = useState(0.7);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "text" | "colors" | "timing" | "effects" // <-- UPDATED type
  >("text");
  const [collapsed, setCollapsed] = useState(false);

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Resizable panel state
  const [panelWidth, setPanelWidth] = useState(defaultpanelwidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // 🟢 Loading overlay (ADDED)
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "⏳ Preparing your template...",
    "🙇 Sorry for the wait, still working on it...",
    "🚀 Almost there, thanks for your patience!",
  ];
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(
      () => setMessageIndex((prev) => (prev + 1) % messages.length),
      10000
    );
    return () => clearInterval(interval);
  }, [isLoading]);

  // Drag handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth =
        e.clientX - (panelRef.current?.getBoundingClientRect().left || 0);
      if (newWidth > 200 && newWidth < 600) {
        setPanelWidth(newWidth);
      }
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // 🟢 Project Save Hook (ADDED)
  const {
    setProjectId,
    isSaving,
    showSaveModal,
    setShowSaveModal,
    handleSave,
    saveNewProject,
    lastSavedProps,
  } = useProjectSave({
    templateId: 1, // 👈 Set a unique ID for this template
    buildProps: () => config, // 👈 Save the entire config object
    videoEndpoint: `${backendPrefix}/generatevideo/kineticrender`, // 👈 Use the kinetic endpoint
  });

  // 🟢 Load project if editing existing (ADDED)
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetch(`${backendPrefix}/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load project");
          return res.json();
        })
        .then((data) => {
          setTemplateName(data.title);
          setProjectId(data.id);
          setConfig(data.props); // 👈 Set the config from loaded props
          lastSavedProps.current = data.props;
        })
        .catch((err) => console.error("❌ Project load failed:", err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const cycleBg = () => {
    if (previewBg === "dark") setPreviewBg("light");
    else if (previewBg === "light") setPreviewBg("grey");
    else setPreviewBg("dark");
  };

  // Helper functions to update nested config state
  const setWords = (words: string[]) =>
    setConfig((prev) => ({ ...prev, words }));
  const setColors = (colors: TypographyConfig["colors"]) =>
    setConfig((prev) => ({ ...prev, colors }));
  const setTiming = (timing: TypographyConfig["timing"]) =>
    setConfig((prev) => ({ ...prev, timing }));
  const setEffects = (effects: TypographyConfig["effects"]) =>
    setConfig((prev) => ({ ...prev, effects }));

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setExportUrl(null); // Clear previous URL
    try {
      const response = await fetch(`/generatevideo/kineticrender`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: config,
          format: format,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      setExportUrl(data.url);
      setShowModal(true);
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Export failed: ${error || "Please try again."}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100%", flex: 1 }}>
      {isLoading && <LoadingOverlay message={messages[messageIndex]} />}

      {/* 🔹 Top Navigation (ADDED) */}
      <TopNavWithSave
        templateName={templateName}
        onSave={handleSave}
        onExport={() => {}} // Export is handled by the modal
        setTemplateName={setTemplateName}
        onOpenExport={() => setShowModal(true)}
        template={templateName}
        isSaving={isSaving}
      />

      {/* 🔹 Save Modal (ADDED) */}
      <SaveProjectModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={saveNewProject}
      />

      {/* This div wraps the main content and adds the top margin */}
      <div style={{ display: "flex", flex: 1, marginTop: "60px" }}>
        {/* modal (REPLACED) */}
        {showModal && (
          <ExportModal
            showExport={showModal}
            setShowExport={setShowModal}
            isExporting={isExporting}
            exportUrl={exportUrl}
            onExport={handleExport} // Pass the existing export function
          />
        )}

        {/* sidenav */}
        <KineticTemplateSideNav
          activeSection={activeSection}
          collapsed={collapsed}
          setActiveSection={setActiveSection}
          setCollapsed={setCollapsed}
        />

        {/* Controls Panel */}
        {!collapsed && (
          <div
            ref={panelRef}
            style={{
              width: `${panelWidth}px`,
              padding: "2rem",
              overflowY: "auto",
              background: "#fff",
              borderRight: "1px solid #eee",
              position: "relative",
              transition: isResizing ? "none" : "width 0.2s",
            }}
          >
            {/* Drag Handle */}
            <div
              onMouseDown={() => setIsResizing(true)}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "6px",
                cursor: "col-resize",
                background: "#ddd",
              }}
            />

            {/* REMOVED H2 Title, as it's now in the TopNav */}
            {/* <h2 ... > 💥 Kinetic Text Template </h2> */}

            {activeSection === "text" && (
              <KineticTextSection
                words={config.words}
                setWords={setWords}
              />
            )}

            {activeSection === "colors" && (
              <KineticColorSection
                colors={config.colors}
                setColors={setColors}
              />
            )}

            {activeSection === "timing" && (
              <KineticTimingSection
                timing={config.timing}
                setTiming={setTiming}
              />
            )}

            {activeSection === "effects" && (
              <KineticEffectsSection
                effects={config.effects}
                setEffects={setEffects}
              />
            )}

            {/* --- REMOVED "options" and "export" sections --- */}
          </div>
        )}

        {/* Preview Panel */}
        <KineticTypographyPreview
          config={config}
          previewBg={previewBg}
          cycleBg={cycleBg}
          showSafeMargins={showSafeMargins}
          onToggleSafeMargins={() => setShowSafeMargins(!showSafeMargins)}
          previewScale={previewSize}
          onPreviewScaleChange={setPreviewSize}
        />
      </div>
    </div>
  );
};