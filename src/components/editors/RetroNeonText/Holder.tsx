import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { backendPrefix } from '../../../config';
import { useProjectSave } from '../../../hooks/SaveProject';
import { defaultpanelwidth } from '../../../data/DefaultValues';
import { TopNavWithSave } from '../../navigations/single_editors/WithSave';
import { SaveProjectModal } from '../../ui/modals/SaveModal';
import { ExportModal } from '../../ui/modals/ExportModal';
import { LoadingOverlay } from '../../ui/modals/LoadingProjectModal';

import { DynamicTextSidenav } from './Sidenav';
import { TextSplitSection } from './sidenav_sections/TextSplitSection';
import { StyleColorSection } from './sidenav_sections/StyleColorSection';
import { AnimationSection } from './sidenav_sections/AnimationSection';
import { CoreEffectsSection } from './sidenav_sections/CoreEffectsSection';
import { AdvancedEffectsSection } from './sidenav_sections/AdvancedEffectsSection';
import { DynamicTextPreview } from '../../layout/EditorPreviews/RetroNeonTextPreview';

export interface DynamicTextConfig {
  text: string;
  style: 'neon' | 'cyber' | 'gradient' | 'glass' | 'holographic' | 'liquid' | 'electric' | 'matrix';
  colorScheme: 'electric' | 'sunset' | 'ocean' | 'cosmic' | 'monochrome' | 'rainbow';
  animationType: 'typewriter' | 'fade' | 'slide' | 'glitch' | 'wave' | 'lightning' | 'morph' | 'audioReactive' | 'matrix';
  fontSize: number;
  fontWeight: string;
  spacing: 'tight' | 'normal' | 'wide';
  effects: boolean;
  splitBy: 'word' | 'letter' | 'line';
  environmentalEffects: boolean;
  interactiveMode: boolean; 
  audioReactive: boolean;
  advancedEffects: boolean;
}

const defaultDynamicTextConfig: DynamicTextConfig = {
  text: 'DYNAMIC\nTEXT EFFECT',
  style: 'neon',
  colorScheme: 'electric',
  animationType: 'typewriter',
  fontSize: 120,
  fontWeight: '900',
  spacing: 'normal',
  effects: true,
  splitBy: 'word',
  environmentalEffects: true,
  interactiveMode: false,
  audioReactive: false,
  advancedEffects: true,
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


export const DynamicTextEditor: React.FC = () => {
  const { id } = useParams();

  const [templateName, setTemplateName] = useState('✨ Dynamic Text Editor');
  const [config, setConfig] = useState<DynamicTextConfig>(defaultDynamicTextConfig);
  
  const [previewSize, setPreviewSize] = useState(0.8);
  const [showSafeMargins, setShowSafeMargins] = useState(false);
  const [previewBg, setPreviewBg] = useState<'dark' | 'light' | 'grey'>('dark');
  const [activeSection, setActiveSection] = useState<
    'text_split' | 'style_color' | 'animation' | 'core_effects' | 'advanced'
  >('text_split');
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const [showModal, setShowModal] = useState(false); 
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = ['✍️ Preparing text composition...', '🎨 Rendering initial effects...'];

  const [panelWidth, setPanelWidth] = useState(defaultpanelwidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

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
  
  const {
    setProjectId,
    isSaving,
    showSaveModal,
    setShowSaveModal,
    handleSave,
    saveNewProject,
    lastSavedProps,
  } = useProjectSave({
    templateId: 10,
    buildProps: () => config, 
    videoEndpoint: `${backendPrefix}/generatevideo/dynamictextrender`, 
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
          lastSavedProps.current = data.props;
        })
        .catch((err) => console.error("❌ Project load failed:", err))
        .finally(() => setIsLoading(false));
    }
  }, [id, setProjectId, lastSavedProps]); 


  const setConfigProp = useCallback(
    (key: keyof DynamicTextConfig, value: any) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    []
  );
  
  const handleTextChange = useCallback(
    (newText: string) => {
        setConfig((prev) => ({ ...prev, text: newText }));
    },
    [] 
  );
  
  const cycleBg = () => {
    if (previewBg === 'dark') setPreviewBg('light');
    else if (previewBg === 'light') setPreviewBg('grey');
    else setPreviewBg('dark');
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
      const response = await fetch(`${backendPrefix}/generatevideo/dynamictextrender`, { 
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
  
  const compositionWidth = 1920;
  const compositionHeight = 1080;
  

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
          <DynamicTextSidenav
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

              {activeSection === 'text_split' && (
                <TextSplitSection
                  key="text-split-section"
                  text={config.text}
                  fontSize={config.fontSize}
                  fontWeight={config.fontWeight}
                  splitBy={config.splitBy}
                  onChange={setConfigProp}
                  onTextChange={handleTextChange}
                />
              )}

              {activeSection === 'style_color' && (
                <StyleColorSection
                  style={config.style}
                  colorScheme={config.colorScheme}
                  spacing={config.spacing}
                  onChange={setConfigProp}
                />
              )}

              {activeSection === 'animation' && (
                <AnimationSection
                  animationType={config.animationType}
                  onChange={setConfigProp}
                />
              )}

              {activeSection === 'core_effects' && (
                <CoreEffectsSection
                  effects={config.effects}
                  audioReactive={config.audioReactive}
                  interactiveMode={config.interactiveMode}
                  onChange={setConfigProp}
                />
              )}

              {activeSection === 'advanced' && (
                <AdvancedEffectsSection
                  environmentalEffects={config.environmentalEffects}
                  advancedEffects={config.advancedEffects}
                  onChange={setConfigProp}
                />
              )}
            </div>
          )}
        </div> 

        <DynamicTextPreview
          config={config}
          previewBg={previewBg}
          cycleBg={cycleBg}
          showSafeMargins={showSafeMargins}
          onToggleSafeMargins={() => setShowSafeMargins(!showSafeMargins)}
          previewScale={previewSize}
          onPreviewScaleChange={setPreviewSize}
          isMobile={isMobile}
          compositionWidth={compositionWidth}
          compositionHeight={compositionHeight}
        />
      </div>
    </div>
  );
};