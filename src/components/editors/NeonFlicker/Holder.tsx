import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { defaultpanelwidth } from '../../../data/DefaultValues'; // Assuming path
import { backendPrefix } from '../../../config'; // Assuming path

// --- Import New/Modified Components ---
import {
  type NeonConfig,
  defaultNeonConfig,
} from '../../remotion_compositions/neonConfig';  

import { NeonTemplateSideNav } from './Sidenav'; // New Sidenav
import { NeonTextSection } from './sidenav_sections/TextSection'; // New Section
import { NeonColorSection } from './sidenav_sections/ColorSection'; // New Section
import { NeonTimingSection } from './sidenav_sections/TimingSection'; // New Section
import { NeonEffectsSection } from './sidenav_sections/EffectSection'; // New Section
import { NeonFlickerPreview } from '../../layout/EditorPreviews/NeonFlickerPreview'; // New Preview

// --- Import Standard UI Components ---
import { ExportModal } from '../../ui/modals/ExportModal';
import { TopNavWithSave } from '../../navigations/single_editors/WithSave';
import { SaveProjectModal } from '../../ui/modals/SaveModal';
import { LoadingOverlay } from '../../ui/modals/LoadingProjectModal';
import { useProjectSave } from '../../../hooks/SaveProject';

// Define the valid sections for this editor
type NeonSection = 'text' | 'colors' | 'timing' | 'effects';

export const NeonFlickerEditor: React.FC = () => {
  const { id } = useParams();

  // 🟢 Core States
  const [templateName, setTemplateName] = useState('🌃 Neon Flicker Title');
  const [config, setConfig] = useState<NeonConfig>(defaultNeonConfig);

  // UI State
  const [previewSize, setPreviewSize] = useState(0.7);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<NeonSection>('text');
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
    '⏳ Preparing your template...',
    '🙇 Sorry for the wait, still working on it...',
    '🚀 Almost there, thanks for your patience!',
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
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
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
  } = useProjectSave({
    templateId: 2, // 👈 Set a NEW unique ID for this template
    buildProps: () => config, // 👈 Save the entire NeonConfig
    videoEndpoint: `${backendPrefix}/generatevideo/neonrender`, // 👈 Use a new endpoint
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
  const setText = (text: string) =>
    setConfig((prev) => ({ ...prev, text }));
  const setColors = (colors: NeonConfig['colors']) =>
    setConfig((prev) => ({ ...prev, colors }));
  const setTiming = (timing: NeonConfig['timing']) =>
    setConfig((prev) => ({ ...prev, timing }));
  const setEffects = (effects: NeonConfig['effects']) =>
    setConfig((prev) => ({ ...prev, effects }));

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setExportUrl(null); // Clear previous URL
    try {
      const response = await fetch(`/generatevideo/neonrender`, { // 👈 Use new endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: config,
          format: format,
        }),
      });
      if (!response.ok) throw new Error("Export failed");
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

      <TopNavWithSave
        templateName={templateName}
        onSave={handleSave}
        onExport={() => {}} // Handled by modal
        setTemplateName={setTemplateName}
        onOpenExport={() => setShowModal(true)}
        template={templateName}
        isSaving={isSaving}
      />

      <SaveProjectModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={saveNewProject}
        screenshot="askdhksaj"
      />

      <div style={{ display: "flex", flex: 1, marginTop: "60px" }}>
        {showModal && (
          <ExportModal
            showExport={showModal}
            setShowExport={setShowModal}
            isExporting={isExporting}
            exportUrl={exportUrl}
            onExport={handleExport}
          />
        )}

        {/* Use the new Neon Sidenav */}
        <NeonTemplateSideNav
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

            {/* Render the correct section based on state */}
            {activeSection === "text" && (
              <NeonTextSection text={config.text} setText={setText} />
            )}

            {activeSection === "colors" && (
              <NeonColorSection colors={config.colors} setColors={setColors} />
            )}

            {activeSection === "timing" && (
              <NeonTimingSection timing={config.timing} setTiming={setTiming} />
            )}

            {activeSection === "effects" && (
              <NeonEffectsSection
                effects={config.effects}
                setEffects={setEffects}
              />
            )}
          </div>
        )}

        {/* Use the new Neon Preview */}
        <NeonFlickerPreview
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