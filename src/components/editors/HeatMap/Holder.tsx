import React, { useState, useRef, useEffect } from 'react';
import { HeatmapTemplateSideNav } from './Sidenav';
import { HeatmapTextSection } from './sidenav_sections/TextSection';
import { HeatmapColorSection } from './sidenav_sections/ColorSection';
import { HeatmapDataSection } from './sidenav_sections/DataSection';
import { HeatmapStyleSection } from './sidenav_sections/StyleSection';
import { HeatmapPreview } from '../../layout/EditorPreviews/HeatMapPreview';
import { defaultpanelwidth } from '../../../data/DefaultValues';
import { ExportModal } from '../../ui/modals/ExportModal';
import { TopNavWithSave } from '../../navigations/single_editors/WithSave';
import { SaveProjectModal } from '../../ui/modals/SaveModal';
import { LoadingOverlay } from '../../ui/modals/LoadingProjectModal';
import { useProjectSave } from '../../../hooks/SaveProject';
import { useParams } from 'react-router-dom';
import { backendPrefix } from '../../../config';


// --- CONFIGURATION INTERFACES ---
export interface LanguageData {
  name: string;
  usage: number;
  squares: number;
  logo: string;
}

export interface HeatmapConfig {
  id: string;
  title: string;
  subtitle: string;
  textColor: string; 
  languages: LanguageData[];
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  maxValue: number;
  backgroundStyle: 'gradient' | 'radial';
}

const defaultHeatmapConfig: HeatmapConfig = {
  id: 'default-heatmap-v1',
  title: 'Programming Language Usage',
  subtitle: 'Weekly contribution heatmap',
  textColor: '#FFFFFF', 
  languages: [
    { name: 'Python', usage: 92.5, squares: 10, logo: 'python.png' },
    { name: 'JavaScript', usage: 88.1, squares: 9, logo: 'javascript.png' },
    { name: 'TypeScript', usage: 75.3, squares: 8, logo: 'typescript.png' },
    { name: 'Go', usage: 60.7, squares: 6, logo: 'go.png' },
    { name: 'Rust', usage: 45.2, squares: 5, logo: 'rust.png' },
    { name: 'C++', usage: 30.9, squares: 3, logo: 'cpp.png' },
  ],
  primaryColor: '#3b82f6',
  secondaryColor: '#10b981',
  accentColor: '#f59e0b',
  maxValue: 100,
  backgroundStyle: 'gradient',
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


export const HeatmapEditor: React.FC = () => {
  const { id } = useParams();

  const [templateName, setTemplateName] = useState('📊 Heatmap Template');
  
  const [config, setConfig] = useState(() => {
    const { languages, ...baseConfig } = defaultHeatmapConfig;
    return { ...baseConfig, languages: [] }; 
  });
  
  const [userLanguages, setUserLanguages] = useState<LanguageData[] | null>(null);

  // UI State
  const [previewSize, setPreviewSize] = useState(0.7);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<
    'dark' | 'light' | 'grey'
  >('dark');
  const [activeSection, setActiveSection] = useState<
    'text' | 'data' | 'colors' | 'style'
  >('text');
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();

  // Modal & Loading States
  const [showModal, setShowModal] = useState(false); 
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = ['竢ｳ Preparing your template...'];

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
    templateId: 2, 
    buildProps: () => config, 
    videoEndpoint: `${backendPrefix}/generatevideo/heatmaprender`, 
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
          setConfig(data.props); 
          setUserLanguages(data.props.languages); 
          lastSavedProps.current = data.props;
        })
        .catch((err) => console.error("❌ Project load failed:", err))
        .finally(() => setIsLoading(false));
    }
  }, [id, setProjectId, lastSavedProps]); 


  // Background cycle function
  const cycleBg = () => {
    if (previewBg === 'dark') setPreviewBg('light');
    else if (previewBg === 'light') setPreviewBg('grey');
    else setPreviewBg('dark');
  };

  
  const setTextConfig = (props: {
    title: string;
    subtitle: string;
    textColor: string;
  }) => {
    setConfig((prev) => ({ ...prev, ...props }));
  };

  const setLanguages = (languages: LanguageData[]) => {
    setConfig((prev) => ({ ...prev, languages }));
    setUserLanguages(languages); 
  };

  const setColors = (colors: {
    primary: string;
    secondary: string;
    accent: string;
  }) => {
    setConfig((prev) => ({
      ...prev,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      accentColor: colors.accent,
    }));
  };

  const setStyle = (style: {
    maxValue: number;
    backgroundStyle: 'gradient' | 'radial';
  }) => {
    setConfig((prev) => ({
      ...prev,
      maxValue: style.maxValue,
      backgroundStyle: style.backgroundStyle,
    }));
  };

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setExportUrl(null); 
    try {
      const configToExport = userLanguages === null 
        ? { ...config, languages: defaultHeatmapConfig.languages }
        : config;

      const response = await fetch(`${backendPrefix}/generatevideo/heatmaprender`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: configToExport, 
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

  const languagesForPreview =
    userLanguages === null ? defaultHeatmapConfig.languages : config.languages;

  const previewConfig: HeatmapConfig = {
    ...config,
    languages: languagesForPreview,
  };

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
          <HeatmapTemplateSideNav
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
              {activeSection === 'text' && (
                <HeatmapTextSection
                  title={config.title}
                  subtitle={config.subtitle}
                  textColor={config.textColor} 
                  setText={setTextConfig} 
                />
              )}

              {activeSection === 'data' && (
                <HeatmapDataSection
                  languages={config.languages}
                  setLanguages={setLanguages}
                />
              )}

              {activeSection === 'colors' && (
                <HeatmapColorSection
                  colors={{
                    primary: config.primaryColor,
                    secondary: config.secondaryColor,
                    accent: config.accentColor,
                  }}
                  setColors={setColors}
                />
              )}

              {activeSection === 'style' && (
                <HeatmapStyleSection
                  style={{
                    maxValue: config.maxValue,
                    backgroundStyle: config.backgroundStyle,
                  }}
  
                  setStyle={setStyle}
                />
              )}
            </div>
          )}
        </div> 

        <HeatmapPreview
          config={previewConfig}
          previewBg={previewBg}
          cycleBg={cycleBg}
          showSafeMargins={showSafeMargins}
          onToggleSafeMargins={() => setShowSafeMargins(!showSafeMargins)}
          previewScale={previewSize}
          onPreviewScaleChange={setPreviewSize}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};