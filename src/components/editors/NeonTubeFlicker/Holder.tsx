import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { backendPrefix } from '../../../config';
import { useProjectSave } from '../../../hooks/SaveProject';
import { defaultpanelwidth } from '../../../data/DefaultValues';
import { TopNavWithSave } from '../../navigations/single_editors/WithSave';
import { SaveProjectModal } from '../../ui/modals/SaveModal';
import { ExportModal } from '../../ui/modals/ExportModal';
import { LoadingOverlay } from '../../ui/modals/LoadingProjectModal';

// Template-specific imports
import { NeonTubeFlickerSidenav } from './Sidenav';
import { TextSection } from './sidenav_sections/TextSection';
import { ColorSection } from './sidenav_sections/ColorSection';
import { TimingSection } from './sidenav_sections/TimingSection';
import { EffectsSection } from './sidenav_sections/EffectsSection';
import { NeonTubeFlickerPreview } from '../../layout/EditorPreviews/NeonTubeFlickerPreview';
import type { NeonTubeFlickerProps, Palette } from '../../remotion_compositions/NeonTubeFlicker';

// --- CONFIGURATION & UTILITY ---

const defaultPalette: Palette = {
  primary: "#FFEE00",
  secondary: "#FF4D00",
  accent: "#FF00AA",
  bgTop: "#0A0011",
  bgBottom: "#220033",
};

const defaultNeonTubeFlickerConfig: NeonTubeFlickerProps = {
  title: 'DISCO INFERNO',
  showLogo: false,
  seed: 12345,
  palette: defaultPalette,
  grainIntensity: 0.2,
  scanlineOpacity: 0.12,
  glowStrength: 1.0,
  flickerEndAt: 2.0,
  settleDuration: 0.6,
  breathingAmplitude: 0.08,
  letterSpacing: 0.03,
  safePadding: 84,
  durationInSeconds: 5,
  // fps will use useVideoConfig default (30) unless overridden
};

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};


export const NeonTubeFlickerEditor: React.FC = () => {
  const { id } = useParams();

  const [templateName, setTemplateName] = useState('✨ Neon Flicker Template');
  const [config, setConfig] = useState<NeonTubeFlickerProps>(defaultNeonTubeFlickerConfig);
  
  // UI State
  const [previewSize, setPreviewSize] = useState(0.6);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [activeSection, setActiveSection] = useState<
    'phrase' | 'palette' | 'timing' | 'effects'
  >('phrase');
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();

  // Modal & Loading States
  const [showModal, setShowModal] = useState(false); 
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = ['💡 Firing up the tubes...', '⚡ Initializing neon effects...'];

  // Resizable panel state
  const [panelWidth, setPanelWidth] = useState(defaultpanelwidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Drag handlers
  useEffect(() => {
    if (isMobile || !isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth =
        e.clientX - (panelRef.current?.getBoundingClientRect().left || 0);
      if (newWidth > 250 && newWidth < 600) {
        setPanelWidth(newWidth);
      }
    };
    const handleMouseUp = () => setIsResizing(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isMobile]);
  
  // --- Project Save Hook ---
  const {
    setProjectId,
    isSaving,
    showSaveModal,
    setShowSaveModal,
    handleSave,
    saveNewProject,
    lastSavedProps,
  } = useProjectSave({
    templateId: 5, // Assuming a different template ID
    buildProps: () => config, 
    videoEndpoint: `${backendPrefix}/generatevideo/neontube`, 
  });

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
          setConfig(data.props.config); 
          lastSavedProps.current = data.props;
        })
        .catch((err) => console.error("❌ Project load failed:", err))
        .finally(() => setIsLoading(false));
    }
  }, [id, setProjectId, lastSavedProps]); 


  // --- Config Setter Functions ---
  const setTextConfig = (props: {
    title: string;
    showLogo: boolean;
    seed: number;
  }) => {
    setConfig((prev) => ({ ...prev, ...props }));
  };

  const setPalette = (palette: Palette) => {
    setConfig((prev) => ({ ...prev, palette }));
  };

  const setTiming = (timing: {
    durationInSeconds: number;
    flickerEndAt: number;
    settleDuration: number;
    fps?: number; // Optional in state setter, use default if not provided
  }) => {
     setConfig((prev) => ({ ...prev, ...timing }));
  };

  const setEffects = (effects: {
    grainIntensity: number;
    scanlineOpacity: number;
    glowStrength: number;
    breathingAmplitude: number;
    letterSpacing: number;
    safePadding: number;
  }) => {
    setConfig((prev) => ({ ...prev, ...effects }));
  };


  useEffect(() => {
      if (!isLoading) return;
      const interval = setInterval(
        () => setMessageIndex((prev) => (prev + 1) % messages.length),
        10000
      );
      return () => clearInterval(interval);
    }, [isLoading]);

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setExportUrl(null); 
    try {
      const response = await fetch(`${backendPrefix}/generatevideo/neontube`, { 
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
          `HTTP error! ${response.status}, message: ${errorText}`
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
  
  const isPanelVisible = isMobile ? true : !collapsed;
  
  // Player size is fixed for this template to 1080x1920 (Portrait/Vertical video)
  const previewWidth = 1080;
  const previewHeight = 1920;
  

  return (
    <div style={{ display: 'flex', height: '100%', flex: 1 }}>
      {isLoading && <LoadingOverlay message={messages[messageIndex]} />}

      <TopNavWithSave
        templateName={templateName}
        onSave={handleSave}
        onExport={() => {}} 
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
      {showModal && (
        <ExportModal
          showExport={showModal}
          setShowExport={setShowModal}
          isExporting={isExporting}
          exportUrl={exportUrl}
          onExport={handleExport} 
        />
      )}

      <div 
        style={{ 
          display: 'flex', 
          flex: 1, 
          marginTop: '60px',
          flexDirection: isMobile ? 'column' : 'row',
          height: 'calc(100vh - 60px)', 
        }}
      >
        
        <div 
          style={{
            display: 'flex',
            flexDirection: 'row',
            flex: isMobile ? '1' : '0 0 auto',
            width: isMobile ? '100%' : 'auto',
            height: isMobile ? 'auto' : '100%',
            overflow: 'hidden', 
          }}
        >
          <NeonTubeFlickerSidenav
            activeSection={activeSection}
            collapsed={collapsed}
            setActiveSection={setActiveSection}
            setCollapsed={setCollapsed}
            isMobile={isMobile}
          />

          {isPanelVisible && (
            <div
              ref={panelRef}
              style={{
                width: isMobile ? 'auto' : `${panelWidth}px`,
                flex: isMobile ? 1 : '0 0 auto', 
                padding: isMobile ? '1rem' : '2rem',
                overflowY: 'auto',
                background: '#fff',
                borderRight: isMobile ? 'none' : '1px solid #eee',
                borderTop: isMobile ? '1px solid #eee' : 'none',
                position: 'relative',
                transition: isResizing ? 'none' : 'width 0.2s',
              }}
            >
              {!isMobile && (
                 <div
                  onMouseDown={() => setIsResizing(true)}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '6px',
                    cursor: 'col-resize',
                    background: '#ddd',
                    opacity: 0.5,
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
                />
              )}

              {/* Sections */}
              {activeSection === 'phrase' && (
                <TextSection
                  title={config.title || ''}
                  showLogo={config.showLogo || false}
                  seed={config.seed || 12345}
                  setText={setTextConfig}
                />
              )}

              {activeSection === 'palette' && (
                <ColorSection
                  palette={config.palette || defaultPalette}
                  setPalette={setPalette}
                />
              )}

              {activeSection === 'timing' && (
                <TimingSection
                  timing={{
                    durationInSeconds: config.durationInSeconds || 5,
                    flickerEndAt: config.flickerEndAt || 2.0,
                    settleDuration: config.settleDuration || 0.6,
                    fps: config.fps,
                  }}
                  setTiming={setTiming}
                />
              )}

              {activeSection === 'effects' && (
                <EffectsSection
                  effects={{
                    grainIntensity: config.grainIntensity || 0.2,
                    scanlineOpacity: config.scanlineOpacity || 0.12,
                    glowStrength: config.glowStrength || 1.0,
                    breathingAmplitude: config.breathingAmplitude || 0.08,
                    letterSpacing: config.letterSpacing || 0.03,
                    safePadding: config.safePadding || 84,
                  }}
                  setEffects={setEffects}
                />
              )}
            </div>
          )}
        </div> 

        <NeonTubeFlickerPreview
          config={config}
          previewScale={previewSize}
          onPreviewScaleChange={setPreviewSize}
          isMobile={isMobile}
          compositionWidth={previewWidth}
          compositionHeight={previewHeight}
          showSafeMargins={showSafeMargins}
          onToggleSafeMargins={setShowSafeMargins}
        />
      </div>
    </div>
  );
};