import React, { useState, useRef, useEffect } from 'react';
import { FlipCardsTemplateSideNav } from './Sidenav';
import { FlipCardsTextSection } from './sidenav_sections/TextSection';
import { FlipCardsDataSection, type MetricDataUI } from './sidenav_sections/DataSection';
import { FlipCardsStyleSection } from './sidenav_sections/StyleSection';
import { FlipCardsPreview } from '../../layout/EditorPreviews/FlipCardsPreview';
import { defaultpanelwidth } from '../../../data/DefaultValues';

import { ExportModal } from '../../ui/modals/ExportModal';
import { TopNavWithSave } from '../../navigations/single_editors/WithSave';
import { SaveProjectModal } from '../../ui/modals/SaveModal';
import { LoadingOverlay } from '../../ui/modals/LoadingProjectModal';
import { useProjectSave } from '../../../hooks/SaveProject';
import { useParams } from 'react-router-dom';
import { backendPrefix } from '../../../config';

export interface MetricDataRemotion {
  front: string;
  back: string;
  color: string;
}

export interface FlipCardsConfig {
  id: string;
  title: string;
  subtitle: string;
  metrics: MetricDataRemotion[];
  flipDuration: number;
  spacing: number;
  cardWidth: number;
  backgroundGradient: string[];
}

const defaultFlipCardsConfig: FlipCardsConfig = {
  id: 'default-flipcards-v1',
  title: 'Project Key Metrics',
  subtitle: 'This Quarter vs. Last Quarter',
  metrics: [
    { front: '1,204\nNew Users', back: '+15.2%\nvs. Q2', color: '#3b82f6' },
    { front: '72.5%\nConversion', back: '-0.8%\nvs. Q2', color: '#10b981' },
    { front: '$42,800\nRevenue', back: '+22.0%\nvs. Q2', color: '#f59e0b' },
  ],
  flipDuration: 0.8,
  spacing: 20,
  cardWidth: 0,
  backgroundGradient: ["#0f0f23", "#1a1a2e", "#16213e"],
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

export const FlipCardsEditor: React.FC = () => {
  const { id } = useParams();

  const [templateName, setTemplateName] = useState('📊 Flip Cards Template');
  
  const [config, setConfig] = useState<Omit<FlipCardsConfig, 'id'>>(() => {
    const { id, ...baseConfig } = defaultFlipCardsConfig;
    return { ...baseConfig, metrics: [] };
  });

  const [userMetrics, setUserMetrics] = useState<MetricDataUI[] | null>(null);

  const [previewSize, setPreviewSize] = useState(0.8);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<'dark' | 'light' | 'grey'>('dark');
  const [activeSection, setActiveSection] = useState<'text' | 'data' | 'style'>('text');
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const [showModal, setShowModal] = useState(false); 
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = ['竢ｳ Preparing your template...'];

  const [panelWidth, setPanelWidth] = useState(defaultpanelwidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isMobile || !isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX - (panelRef.current?.getBoundingClientRect().left || 0);
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
    templateId: 3,
    buildProps: () => {
      const metricsForSave =
        userMetrics === null
          ? defaultFlipCardsConfig.metrics
          : convertUiMetricsToRemotion(userMetrics);
      return { ...config, metrics: metricsForSave };
    },
    videoEndpoint: `${backendPrefix}/generatevideo/flipcardsrender`,
  });

  const convertUiMetricsToRemotion = (uiMetrics: MetricDataUI[]): MetricDataRemotion[] => {
    return uiMetrics.map(item => ({
      front: `${item.frontNumber}\n${item.frontLabel}`,
      back: `${item.backNumber}\n${item.backLabel}`,
      color: item.color,
    }));
  };

  const convertRemotionMetricsToUi = (remotionMetrics: MetricDataRemotion[]): MetricDataUI[] => {
    return remotionMetrics.map(item => {
      const [frontNumber = '', frontLabel = ''] = item.front.split('\n');
      const [backNumber = '', backLabel = ''] = item.back.split('\n');
      return { frontNumber, frontLabel, backNumber, backLabel, color: item.color };
    });
  };

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
          setUserMetrics(convertRemotionMetricsToUi(data.props.metrics));
          lastSavedProps.current = data.props;
        })
        .catch((err) => console.error("❌ Project load failed:", err))
        .finally(() => setIsLoading(false));
    } else {
      setUserMetrics(convertRemotionMetricsToUi(defaultFlipCardsConfig.metrics));
    }
  }, [id, setProjectId, lastSavedProps]); 

  const cycleBg = () => {
    if (previewBg === 'dark') setPreviewBg('light');
    else if (previewBg === 'light') setPreviewBg('grey');
    else setPreviewBg('dark');
  };
  
  const setTextConfig = (props: {
    title: string;
    subtitle: string;
  }) => {
    setConfig((prev) => ({ ...prev, ...props }));
  };

  const setMetrics = (uiMetrics: MetricDataUI[]) => {
    setUserMetrics(uiMetrics);
  };

  const setStyle = (style: {
    flipDuration: number;
    spacing: number;
    cardWidth: number;
    backgroundGradient: string[];
  }) => {
    setConfig((prev) => ({ ...prev, ...style }));
  };

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setExportUrl(null); 
    try {
      const metricsForExport =
        userMetrics === null
          ? defaultFlipCardsConfig.metrics
          : convertUiMetricsToRemotion(userMetrics);

      const configToExport = {
        ...config,
        metrics: metricsForExport,
      };

      const response = await fetch(`${backendPrefix}/generatevideo/flipcardsrender`, {
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

  const metricsForPreview =
    userMetrics === null
      ? defaultFlipCardsConfig.metrics
      : convertUiMetricsToRemotion(userMetrics);

  const previewConfig = {
    ...config,
    metrics: metricsForPreview,
    cardWidth: config.cardWidth > 0 ? config.cardWidth : undefined,
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
          <FlipCardsTemplateSideNav
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

              {activeSection === 'text' && (
                <FlipCardsTextSection
                  title={config.title}
                  subtitle={config.subtitle}
                  setText={setTextConfig} 
                />
              )}

              {activeSection === 'data' && (
                <FlipCardsDataSection
                  metrics={userMetrics || []}
                  setMetrics={setMetrics}
                />
              )}

              {activeSection === 'style' && (
                <FlipCardsStyleSection
                  style={{
                    flipDuration: config.flipDuration,
                    spacing: config.spacing,
                    cardWidth: config.cardWidth,
                    backgroundGradient: config.backgroundGradient,
                  }}
                  setStyle={setStyle}
                />
              )}
            </div>
          )}
        </div> 

        <FlipCardsPreview
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