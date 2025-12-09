import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LogoTemplateSideNav } from "./Sidenav";
import { LogoTextSection } from "./sidenav_sections/TextSection";
import { LogoColorSection } from "./sidenav_sections/ColorSection";
import { LogoTimingSection } from "./sidenav_sections/TimingSection";
import { LogoAnimationPreview } from "../../layout/EditorPreviews/LogoAnimationPreview";
import { defaultpanelwidth } from "../../../data/DefaultValues";
import { ExportModal } from "../../ui/modals/ExportModal";
import { TopNavWithSave } from "../../navigations/single_editors/WithSave";
import { SaveProjectModal } from "../../ui/modals/SaveModal";
import { LoadingOverlay } from "../../ui/modals/LoadingProjectModal";
import { backendPrefix } from "../../../config";
import type { LogoLiquidOverlayProps } from "../../remotion_compositions/LogoAnimation";
import { renderVideo } from "../../../utils/VideoRenderer";
import toast from "react-hot-toast";
import { useProjectSave2 } from "../../../hooks/saveProjectVersion2";

// Define a default configuration from your schema
const defaultConfig: LogoLiquidOverlayProps = {
  text: "SHAKER",
  durationOutline: 2,
  durationFill: 2.5,
  baseColor: "#FFD700",
  durationEndPause: 2,
};

// Define the type for the active section
type LogoActiveSection = "text" | "color" | "timing";

export const LogoAnimationEditor: React.FC = () => {
  const { id } = useParams();

  // 🟢 Core States
  const [templateName, setTemplateName] = useState("💧 Liquid Logo Template");
  // Main state for the Remotion component, using your props type
  const [config, setConfig] = useState<LogoLiquidOverlayProps>(defaultConfig);

  // UI State
  const [previewSize, setPreviewSize] = useState(0.8); // Default zoom
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<LogoActiveSection>("text");
  const [collapsed, setCollapsed] = useState(false);

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Resizable panel state
  const [panelWidth, setPanelWidth] = useState(defaultpanelwidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // 🟢 Loading overlay
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

  // 🟢 Project Save Hook
  const {
    setProjectId,
    isSaving,
    showSaveModal,
    setShowSaveModal,
    handleSave,
    saveNewProject,
    lastSavedProps,
  } = useProjectSave2({
    templateId: 14, // 👈 Set a unique ID for this new template
    buildProps: () => ({config}), // 👈 Save the entire config object
    compositionId: "LogoAnimation"
  });

  // 🟢 Load project if editing existing
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
          setConfig(data.props.config); // 👈 Set the config from loaded props
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

  // Helper functions to update config state
  const setText = (text: string) => setConfig((prev) => ({ ...prev, text }));

  const setColor = (baseColor: string) =>
    setConfig((prev) => ({ ...prev, baseColor }));

  // This function receives a *partial* timing object
  const setTiming = (
    newTiming: Partial<{ durationOutline: number; durationFill: number }>
  ) =>
    setConfig((prev) => ({
      ...prev,
      ...newTiming,
    }));

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setExportUrl(null);
    const response = await renderVideo({ config }, 14, "LogoAnimation", format);
    if (response === "error") {
      toast.error("There was an error rendering your video");
    } else {
      setExportUrl(response);
    }
    setShowModal(true);
    setIsExporting(false);
  };

  return (
    <div style={{ display: "flex", height: "100%", flex: 1 }}>
      {isLoading && <LoadingOverlay message={messages[messageIndex]} />}

      {/* 🔹 Top Navigation */}
      <TopNavWithSave
        templateName={templateName}
        onSave={handleSave}
        onExport={() => {}} // Export is handled by the modal
        setTemplateName={setTemplateName}
        onOpenExport={() => setShowModal(true)}
        template={templateName}
        isSaving={isSaving}
      />

      {/* 🔹 Save Modal */}
      <SaveProjectModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={saveNewProject}
        screenshot="askdhksaj"
      />

      {/* This div wraps the main content and adds the top margin */}
      <div style={{ display: "flex", flex: 1, marginTop: "60px" }}>
        {/* Export modal */}
        {showModal && (
          <ExportModal
            showExport={showModal}
            setShowExport={setShowModal}
            isExporting={isExporting}
            exportUrl={exportUrl}
            onExport={handleExport}
          />
        )}

        {/* Sidenav */}
        <LogoTemplateSideNav
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

            {/* Render active section based on state */}
            {activeSection === "text" && (
              <LogoTextSection text={config.text} setText={setText} />
            )}

            {activeSection === "color" && (
              <LogoColorSection color={config.baseColor} setColor={setColor} />
            )}

            {activeSection === "timing" && (
              <LogoTimingSection
                timing={{
                  durationOutline: config.durationOutline,
                  durationFill: config.durationFill,
                }}
                setTiming={setTiming}
              />
            )}
          </div>
        )}

        {/* Preview Panel */}
        <LogoAnimationPreview
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
