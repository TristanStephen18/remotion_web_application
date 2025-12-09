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
import { useParams } from "react-router-dom";
import { backendPrefix } from "../../../config"; // Assuming this path is correct
import type { KineticTiming, TypographyConfig, KineticColors, KineticEffects  } from "../../../models/KineticText";
import { renderVideo } from "../../../utils/VideoRenderer";
import toast from "react-hot-toast";
import { useProjectSave2 } from "../../../hooks/saveProjectVersion2";

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

  // setState configurations

  const [words, setWords] = useState(["KINETIC", "TYPOGRAPHY"]);
  const [colors, setColors] = useState<KineticColors>({
    primary: "#00f2ff",
    secondary: "#ff4fa3",
    accent: "#ffffff",
  });
  const [timing, setTiming] = useState<KineticTiming>({
    staggerDelay: 5,
    collisionFrame: 45,
    explosionDelay: 20,
  });
  const [effects, setEffects] = useState<KineticEffects>({
    shakeIntensity: 12,
    particleCount: 70,
    ballSize: 120,
  })
  const [templateName, setTemplateName] = useState("💥 Kinetic Text Template");
  // Main state for the Remotion component
  const [config, setConfig] = useState<TypographyConfig>(defaultConfig);

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
  } = useProjectSave2({
    templateId: 12, 
    buildProps: () => ({config}), 
    compositionId: "KineticText",
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

  // const setColors = (colors: TypographyConfig["colors"]) =>
  //   setConfig((prev) => ({ ...prev, colors }));
  // const setTiming = (timing: TypographyConfig["timing"]) =>
  //   setConfig((prev) => ({ ...prev, timing }));
  // const setEffects = (effects: TypographyConfig["effects"]) =>
  //   setConfig((prev) => ({ ...prev, effects }));

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setExportUrl(null); // Clear previous URL
    const response = await renderVideo({config}, 12, "KineticText",format);
    if(response === "error"){
      toast.error("There was an error rendering your video")
    }else{
      setExportUrl(response);
    }
    setShowModal(true);
    setIsExporting(false);
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
        screenshot="askdhksaj"
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
              <KineticTextSection words={words} setWords={setWords} setConfig={setConfig}/>
            )}

            {activeSection === "colors" && (
              <KineticColorSection
                colors={colors}
                setConfig={setConfig}
                setColors={setColors}
              />
            )}

            {activeSection === "timing" && (
              <KineticTimingSection
                timing={timing}
                setConfig={setConfig}
                setTiming={setTiming}
              />
            )}

            {activeSection === "effects" && (
              <KineticEffectsSection
              setConfig={setConfig}
                effects={effects}
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
