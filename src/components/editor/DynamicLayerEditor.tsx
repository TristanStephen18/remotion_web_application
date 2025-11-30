import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; 
import toast from "react-hot-toast";

// Editor Components
import { EditorIcons } from "./components/EditorIcons";
import { Timeline, type TimelineTrack } from "./components/Timeline";
import { RemotionPreview, type RemotionPreviewHandle } from "./components/RemotionPreview";
import { DynamicPreviewOverlay } from "./components/DynamicPreviewOverlay";
import { MediaGalleryModal } from "./components/MediaGalleryModal";
import { ImageEditor } from "./components/ImageEditor";
import DynamicLayerComposition from "../remotion_compositions/DynamicLayerComposition";

import { getTemplate, type TemplateDefinition } from '../../utils/SimpleTemplateRegistry';


// AI Tool Modals ✨
import { VoiceoverModal } from "../ui/modals/VoiceOverModal";
import { RedditPostModal } from "../ui/modals/RedditPostModal";
import { MagicCropModal } from "../ui/modals/MagicCropModal";
import { EmojiPickerModal } from "../ui/modals/EmojiPickerModal";
import { RemixShortsModal, type RemixResult } from "../ui/modals/RemixShortsModal";
import { AIImageModal } from "../ui/modals/AIImageModal";
import { VEOGeneratorModal } from "../ui/modals/VEOGenaratorModal";
import { YoutubeDownloaderModal } from "../ui/modals/YoutubeDownloaderModal";
import { EnhanceSpeechModal } from "../ui/modals/EnhanceSpeechModal";
import { RemoveBackgroundModal } from "../ui/modals/RemoveBackgroundModal";

import { KenBurnsEditor } from "./components/KenBurnsEditor";

// Remotion composition and types
import {
  type Layer,
  type TextLayer,
  type ImageLayer,
  type AudioLayer,
  type VideoLayer,
  isTextLayer,
  isImageLayer,
  isAudioLayer,
  isVideoLayer,
} from "../remotion_compositions/DynamicLayerComposition";

// Hooks
import { useProjectSave } from "../../hooks/SaveProject";
import { renderVideo } from "../../utils/VideoRenderer";

// UI Components
import { ExportModal } from "../ui/modals/ExportModal";
import { SaveProjectModal } from "../ui/modals/SaveModal";
import { LoadingOverlay } from "../ui/modals/LoadingProjectModal";

// Constants & Helpers
import { FPS, LAYER_COLORS } from "./constants";
import { generateId, createDefaultLayers } from "./utils/layerHelpers";
import { useHistoryState } from "./hooks/useHistory";
import { useLayerManagement } from "./hooks/useLayerManagement";
import { type SidebarTab } from "./types";
import { editorStyles } from "./styles/editorStyles";

// Refactored components
import { TextEditor } from "./components/TextEditor";
import { AudioEditor } from "./components/AudioEditor";
import { VideoEditor } from "./components/VideoEditor";
import { MediaLibrary } from "./components/MediaLibrary";

// Custom Icons
const Icons = {
  ChevronLeft: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  Close: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Music: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  Carousel: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="15" rx="2" />
      <path d="M17 2l-5 5-5-5" />
    </svg>
  ),
  Layout: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  ),
  Pip: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="4" y="13" width="6" height="7" rx="1" fill="currentColor" />
    </svg>
  ),
  // Tool Panel Icons
  Image: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  Video: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  ),
  Mic: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
    </svg>
  ),
  Reddit: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
      <path d="M8 15c.5 1 2 2 4 2s3.5-1 4-2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
  Eraser: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 20H7L3 16l6-6 8 8" />
      <line x1="14.5" y1="9.5" x2="16.5" y2="7.5" />
      <line x1="19" y1="15" x2="17" y2="17" />
    </svg>
  ),
  Waveform: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="12" x2="5" y2="12" />
      <line x1="9" y1="8" x2="9" y2="16" />
      <line x1="14" y1="6" x2="14" y2="18" />
      <line x1="19" y1="9" x2="19" y2="15" />
    </svg>
  ),
  Crop: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2v14a2 2 0 002 2h14" />
      <path d="M18 22V8a2 2 0 00-2-2H2" />
    </svg>
  ),
  Download: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Smile: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  Shuffle: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  ),
};

const CarouselIcon = Icons.Carousel;

// Inline styles for the grid system
const gridStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
    padding: '20px',
    overflowY: 'auto' as const,
    height: '100%',
  },
  section: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    paddingLeft: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '16px 8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    height: '100px',
    gap: '8px',
  },
  cardIcon: {
    marginBottom: '4px',
  },
  cardTitle: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#e5e5e5',
    textAlign: 'center' as const,
    lineHeight: '1.2',
  },
  cardDesc: {
    fontSize: '9px',
    color: '#888',
    textAlign: 'center' as const,
    display: 'none',
  }
};

const DynamicLayerEditor: React.FC = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [template, setTemplate] = useState<TemplateDefinition | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState<string>('');

  // State
  const [duration, setDuration] = useState(10);
  const totalFrames = useMemo(() => duration * FPS, [duration]);
  
  const {
    layers,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistoryState(createDefaultLayers(duration));

  // Store uploaded assets locally for the session
  const [projectAssets, setProjectAssets] = useState<any[]>([]);

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);

  const [copiedLayer, setCopiedLayer] = useState<Layer | null>(null);

  const [activeTab, setActiveTab] = useState<SidebarTab>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMediaGalleryOpen, setIsMediaGalleryOpen] = useState(false);
  const [mediaGalleryActiveTab, setMediaGalleryActiveTab] = useState<"media" | "audio" | "video" | "text">("media");

  const previewRef = useRef<RemotionPreviewHandle>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);


  // AI Tool Modals
  const [showVoiceoverModal, setShowVoiceoverModal] = useState(false);
  const [showRedditModal, setShowRedditModal] = useState(false);
  const [showMagicCropModal, setShowMagicCropModal] = useState(false);
  const [showEmojiPickerModal, setShowEmojiPickerModal] = useState(false);
  const [showRemixShortsModal, setShowRemixShortsModal] = useState(false);
  const [showAIImageModal, setShowAIImageModal] = useState(false);
  const [showRemoveBackgroundModal, setShowRemoveBackgroundModal] = useState(false);
  const [showEnhanceSpeechModal, setShowEnhanceSpeechModal] = useState(false);
  const [showYoutubeDownloaderModal, setShowYoutubeDownloaderModal] = useState(false);
  const [showVEOGeneratorModal, setShowVEOGeneratorModal] = useState(false);
  const [previewDimensions, setPreviewDimensions] = useState({ width: 0, height: 0 });

  const hasLoadedTemplate = useRef(false);

  // Derived: isPanelOpen when activeTab is set
  const isPanelOpen = activeTab !== null;

  useEffect(() => {
    const templateIdParam = searchParams.get('template');
    const projectIdParam = searchParams.get('project');

    if (templateIdParam && !hasLoadedTemplate.current) {
      hasLoadedTemplate.current = true;
      console.log('Loading template:', templateIdParam);

      const templateId = parseInt(templateIdParam);
      const templateDef = getTemplate(templateId);
      
      if (templateDef) {
        setTemplate(templateDef);
        const defaultLayers = templateDef.createDefaultLayers();
        pushState(defaultLayers);
        
        if (templateDef.calculateDuration) {
          const calculatedDuration = templateDef.calculateDuration(defaultLayers);
          setDuration(Math.ceil(calculatedDuration / FPS));
        }
        console.log('Template loaded:', templateDef.displayName);
      } else {
        console.error('Template not found:', templateId);
        toast.error('Template not found');
      }
    } else if (projectIdParam) {
      console.log('Loading project:', projectIdParam);
      setProjectId(projectIdParam);
      setIsLoading(true);
     
      fetch(`/api/projects/${projectIdParam}`)
       .then(res => res.json())
        .then(data => {
         const templateDef = getTemplate(data.templateId);
         if (templateDef) {
          setTemplate(templateDef);
         }
         
          pushState(data.layers || []);
          setProjectTitle(data.title || '');
          
          if (data.duration) {
            setDuration(data.duration);
          }
          
          toast.success('Project loaded!');
        })
        .catch(err => {
          console.error('Failed to load project:', err);
          toast.error('Failed to load project');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [searchParams, pushState]);
  
  // Layer management
  const {
    addTextLayer,
    handleImageUpload,
    handleAudioUpload,
    handleVideoUpload,
    updateLayer,
    deleteLayer,
    fileInputRef,
    audioInputRef,
    videoInputRef,
  } = useLayerManagement({
    layers,
    currentFrame,
    totalFrames,
    pushState,
    setSelectedLayerId,
  });

  // Project save
  const {
    showSaveModal,
    setShowSaveModal,
    saveNewProject,
  }  = useProjectSave({
    templateId: template?.id || 1,
    buildProps: () => ({ 
     layers, 
     duration, 
      currentFrame,
      templateId: template?.id || 1
    }),
   videoEndpoint: template?.compositionId || "DynamicLayerComposition",
  });

  // Derived state
  const selectedLayer = useMemo(
    () => layers?.find((l) => l.id === selectedLayerId) || null,
    [layers, selectedLayerId]
  );

  const selectedTextLayer = selectedLayer && isTextLayer(selectedLayer) ? selectedLayer : null;
  const selectedImageLayer = selectedLayer && isImageLayer(selectedLayer) ? selectedLayer : null;
  const selectedAudioLayer = selectedLayer && isAudioLayer(selectedLayer) ? selectedLayer : null;
  const selectedVideoLayer = selectedLayer && isVideoLayer(selectedLayer) ? selectedLayer : null;
  const showEditPanel = selectedTextLayer !== null || selectedImageLayer !== null || selectedAudioLayer !== null || selectedVideoLayer !== null;

  // Video Reference Management for Magic Crop
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  
  const getSelectedVideoElement = useCallback((): HTMLVideoElement | null => {
    if (!selectedLayerId) return null;
    const layer = layers.find(l => l.id === selectedLayerId);
    if (!layer || layer.type !== 'video') return null;
    return videoRefs.current.get(selectedLayerId) || null;
  }, [selectedLayerId, layers]);

  useEffect(() => {
    const updateDimensions = () => {
      if (previewContainerRef.current) {
        const container = previewContainerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const aspectRatio = 9 / 16;
        
        let width = containerWidth * 0.8;
        let height = width / aspectRatio;
        
        if (height > containerHeight * 0.8) {
          height = containerHeight * 0.8;
          width = height * aspectRatio;
        }
        
        setPreviewDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // ============================================================================
  // SPLIT SCREEN HANDLERS (Layout Switching & Slot Management)
  // ============================================================================

  const getLayoutMode = () => {
    const lowerPanel = layers.find(l => l.id === 'lower-panel');
    if (!lowerPanel) return 'split';
    return lowerPanel.size.height < 40 ? 'pip' : 'split';
  };

  const layoutMode = getLayoutMode();

  const handleLayoutChange = useCallback((type: 'split' | 'pip') => {
    const newLayers = layers.map(layer => {
      if (layer.id === 'upper-panel') {
        // Main Video or Top Video
        return {
          ...layer,
          position: type === 'split' ? { x: 50, y: 25 } : { x: 50, y: 50 },
          size: type === 'split' ? { width: 100, height: 50 } : { width: 100, height: 100 },
          borderWidth: 0,
        };
      }
      if (layer.id === 'lower-panel') {
        // Reaction Video
        return {
          ...layer,
          position: type === 'split' ? { x: 50, y: 75 } : { x: 22, y: 75 }, 
          size: type === 'split' ? { width: 100, height: 50 } : { width: 30, height: 25 },
          borderWidth: type === 'pip' ? 5 : 0,
          borderColor: '#38bdf8', 
          borderRadius: type === 'pip' ? 0 : 0, 
        };
      }
      if (layer.id === 'divider') {
        return {
          ...layer,
          visible: type === 'split', 
        };
      }
      return layer;
    });
    pushState(newLayers as Layer[]);
    toast.success(`Switched to ${type === 'split' ? 'Split Screen' : 'Picture-in-Picture'}`);
  }, [layers, pushState]);

  // ✅ NEW: Refs for Replacement Logic
  const layoutFileRef = useRef<HTMLInputElement>(null);
  const activeSlotId = useRef<string | null>(null);

  // ✅ NEW: Trigger function specifically for replacements
  const handleSlotReplace = useCallback((layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      activeSlotId.current = layerId;
      if (layoutFileRef.current) {
        layoutFileRef.current.click();
      }
    } else {
      toast.error("Layer not found. Is this the Split Screen template?");
    }
  }, [layers]);

  // ✅ UPDATED: Handler detects type (Video vs Image) and updates the layer accordingly
  const handleLayoutFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSlotId.current) {
      const url = URL.createObjectURL(file);
      const fileType = file.type.startsWith('video') ? 'video' : 'image';
      
      // Call updateLayer directly to Modify existing layer
      updateLayer(activeSlotId.current, { 
        src: url,
        type: fileType, // ✅ Force the correct type so renderer uses <Video> or <Img>
      } as Partial<Layer>);
      
      toast.success(`${fileType === 'video' ? 'Video' : 'Image'} replaced successfully`);
      
      // Reset input so we can select same file again if needed
      e.target.value = '';
    }
  }, [updateLayer]);


  // ============================================================================
  // TOOLS HANDLERS
  // ============================================================================

  const handleRemoveBackground = useCallback((processedImageUrl: string) => {
    if (!selectedImageLayer && !selectedVideoLayer) {
      toast.error("Please select an image or video layer first");
      return;
    }
    if (selectedImageLayer) {
      updateLayer(selectedImageLayer.id, { src: processedImageUrl });
      toast.success("Background removed from image");
    } else if (selectedVideoLayer) {
      updateLayer(selectedVideoLayer.id, { src: processedImageUrl });
      toast.success("Background removed from video");
    }
  }, [selectedImageLayer, selectedVideoLayer, updateLayer]);

  const handleEnhanceSpeech = useCallback((data: {
    audioUrl: string;
    denoiseLevel: number;
    enhanceClarity: boolean;
  }) => {
    if (!selectedAudioLayer) {
      toast.error("Please select an audio layer first");
      return;
    }
    updateLayer(selectedAudioLayer.id, { src: data.audioUrl });
    toast.success("Speech enhanced successfully");
  }, [selectedAudioLayer, updateLayer]);

  const handleVoiceoverGenerate = useCallback((audioData: {
    text: string;
    voice: string;
    speed: number;
    audioUrl: string;
  }) => {
    const newLayer: AudioLayer = {
      id: generateId(),
      type: "audio",
      name: `Voiceover (${audioData.voice})`,
      visible: true,
      locked: false,
      startFrame: currentFrame,
      endFrame: Math.min(currentFrame + 300, totalFrames),
      position: { x: 50, y: 50 },
      size: { width: 100, height: 10 },
      rotation: 0,
      opacity: 1,
      src: audioData.audioUrl,
      volume: 1,
      loop: false,
      fadeIn: 0,
      fadeOut: 0,
    };
    pushState([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
    toast.success("Voiceover added to timeline");
  }, [currentFrame, totalFrames, layers, pushState]);

  const handleRedditPostGenerate = useCallback((imageUrl: string) => {
    const newLayer: ImageLayer = {
      id: generateId(),
      type: "image",
      name: "Reddit Post",
      visible: true,
      locked: false,
      startFrame: currentFrame,
      endFrame: Math.min(currentFrame + 150, totalFrames),
      position: { x: 50, y: 50 },
      size: { width: 60, height: 40 },
      rotation: 0,
      opacity: 1,
      src: imageUrl,
      isBackground: false,
      objectFit: "contain",
    };
    pushState([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
    toast.success("Reddit post added to timeline");
  }, [currentFrame, totalFrames, layers, pushState]);

  const handleAIImageGenerate = useCallback((imageUrl: string) => {
    const newLayer: ImageLayer = {
      id: generateId(),
      type: "image",
      name: "AI Generated Image",
      visible: true,
      locked: false,
      startFrame: currentFrame,
      endFrame: Math.min(currentFrame + 150, totalFrames),
      position: { x: 50, y: 50 },
      size: { width: 60, height: 40 },
      rotation: 0,
      opacity: 1,
      src: imageUrl,
      isBackground: false,
      objectFit: "contain",
    };
    pushState([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
    toast.success("AI image added to timeline");
  }, [currentFrame, totalFrames, layers, pushState]);

  const handleMagicCropApply = useCallback((settings: {
    cropType: string;
    intensity: number;
    focusPoint: string;
    enableAutoZoom: boolean;
    aspectRatio: string;
    cropRegion: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    keyframes?: Array<{
      time: number;
      x: number;
      y: number;
      scale: number;
    }>;
  }) => {
    // Get selected video layer
    const selectedVideo = layers.find(l => l.id === selectedLayerId && l.type === 'video') as VideoLayer | undefined;
    
    if (!selectedVideo) {
      toast.error("Please select a video layer first");
      return;
    }

    console.log('📐 Applying Magic Crop:', settings);

    const newLayers = layers.map((layer): Layer => {
      if (layer.id !== selectedVideo.id) return layer;

      const updatedLayer: VideoLayer = {
        ...layer,
        // Apply crop region (these are in percentages)
        position: {
          x: settings.cropRegion.x,
          y: settings.cropRegion.y,
        },
        size: {
          width: settings.cropRegion.width,
          height: settings.cropRegion.height,
        },
        // Apply object fit based on crop type
        objectFit: settings.cropType === "smart" || settings.cropType === "face" 
          ? "cover" 
          : "contain",
      } as VideoLayer;

      return updatedLayer;
    });

    pushState(newLayers);
    
    toast.success(
      `Magic crop applied! 🎬\n${settings.cropType.toUpperCase()} • ${settings.aspectRatio}`,
      { duration: 3000 }
    );
  }, [selectedLayerId, layers, pushState]);

  const handleEmojiSelect = useCallback((emoji: string) => {
    const newLayer: TextLayer = {
      id: generateId(),
      type: "text",
      name: `Emoji ${emoji}`,
      visible: true,
      locked: false,
      startFrame: currentFrame,
      endFrame: Math.min(currentFrame + 90, totalFrames),
      position: { x: 50, y: 50 },
      size: { width: 20, height: 20 },
      rotation: 0,
      opacity: 1,
      content: emoji,
      fontFamily: "Arial, sans-serif",
      fontSize: 6,
      fontColor: "#ffffff",
      fontWeight: "normal",
      fontStyle: "normal",
      textAlign: "center",
      lineHeight: 1,
      textOutline: false,
      outlineColor: "#000000",
      textShadow: false,
      shadowColor: "#000000",
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      animation: { entrance: "fade", entranceDuration: 20 },
    };
    pushState([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
    toast.success("Emoji added to timeline");
  }, [currentFrame, totalFrames, layers, pushState]);

  const handleRemixGenerate = useCallback((remixes: RemixResult[]) => {
    console.log("✅ Received remixes:", remixes);
    
    // Add each remix as a video layer
    const newLayers = remixes.map((remix, index) => {
      const newLayer: VideoLayer = {
        id: generateId(),
        type: "video",
        name: remix.title || `Remix ${index + 1}`,
        visible: true,
        locked: false,
        startFrame: currentFrame,
        endFrame: Math.min(currentFrame + Math.round(remix.duration * FPS), totalFrames),
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        rotation: 0,
        opacity: 1,
        src: remix.url,
        volume: 0.8,
        loop: false,
        playbackRate: 1,
        objectFit: "cover",
        filter: "",
        fadeIn: 15,
        fadeOut: 15,
        animation: {
          entrance: "fade",
          entranceDuration: 30,
        },
      };
      return newLayer;
    });

    // Add all remixes to layers
    pushState([...newLayers, ...layers]);
    
    // Select the first remix
    if (newLayers.length > 0) {
      setSelectedLayerId(newLayers[0].id);
    }

    toast.success(`Added ${remixes.length} remix${remixes.length > 1 ? 'es' : ''} to timeline! 🎬`);
  }, [currentFrame, totalFrames, layers, pushState, FPS]);

  const handleYoutubeDownload = useCallback((data: {
    videoUrl: string;
    title: string;
    duration: number;
    format?: string; 
  }) => {
    const durationInFrames = Math.round(data.duration * FPS);
    const layerEndFrame = Math.min(currentFrame + durationInFrames, totalFrames);
    
    const formatLabel = data.format?.toUpperCase() || 'MP4';
    
    const newLayer: VideoLayer = {
      id: generateId(),
      type: "video",
      name: `${data.title} (${formatLabel})`, 
      visible: true,
      locked: false,
      startFrame: currentFrame,
      endFrame: layerEndFrame,
      position: { x: 50, y: 50 },
      size: { width: 100, height: 100 },
      rotation: 0,
      opacity: 1,
      src: data.videoUrl,
      volume: 1.0,
      loop: false,
      playbackRate: 1,
      objectFit: "contain",
      filter: "",
      fadeIn: 15,
      fadeOut: 15,
      animation: {
        entrance: "none",
        entranceDuration: 0,
      },
    };
    
    pushState([newLayer, ...layers]);
    setSelectedLayerId(newLayer.id);
    
    const durationText = data.duration > 60
      ? `${Math.floor(data.duration / 60)}:${String(data.duration % 60).padStart(2, '0')}`
      : `${data.duration}s`;
    
    toast.success(`Added: ${data.title} (${durationText})`);
  }, [currentFrame, totalFrames, layers, pushState, FPS]);


  const handleVEOGenerate = useCallback((data: {
    videoUrl: string;
    prompt: string;
    duration: number;
  }) => {
    const newLayer: VideoLayer = {
      id: generateId(),
      type: "video",
      name: `VEO: ${data.prompt.substring(0, 30)}...`,
      visible: true,
      locked: false,
      startFrame: currentFrame,
      endFrame: Math.min(currentFrame + Math.round(data.duration * FPS), totalFrames),
      position: { x: 50, y: 50 },
      size: { width: 100, height: 100 },
      rotation: 0,
      opacity: 1,
      src: data.videoUrl,
      volume: 0.8,
      loop: false,
      playbackRate: 1,
      objectFit: "cover",
      filter: "",
      fadeIn: 0,
      fadeOut: 0,
      animation: {
        entrance: "fade",
        entranceDuration: 30,
      },
    };
    pushState([newLayer, ...layers]);
    setSelectedLayerId(newLayer.id);
    toast.success("VEO video generated successfully");
  }, [currentFrame, totalFrames, layers, pushState, FPS]);

  const handleTabClick = useCallback((tab: SidebarTab) => {
    if (activeTab === tab) {
      setActiveTab(null);
    } else {
      setActiveTab(tab);
      setSelectedLayerId(null);
    }
  }, [activeTab]);

  const selectLayerAndCloseTab = useCallback((layerId: string | null) => {
    setSelectedLayerId(layerId);
    if (layerId) {
      setActiveTab(null);
    }
  }, []);

  const handleAddText = useCallback(() => {
    addTextLayer();
  }, [addTextLayer]);

  // Helper to add a specific media item to the canvas
  const addMediaToCanvas = useCallback((media: any) => {
    // Determine source type and get media URL
    const isPredefined = media.type === "image" || media.type === "video" || media.type === "audio";
    const mediaSource = isPredefined ? media.url : media.data;
    
    if (!mediaSource) {
      console.error('❌ ERROR: No media source found!', { media });
      toast.error('Cannot add media: No source URL found');
      return; 
    }
    
    // Handle Images
    if (media.type === "image" || media.type?.startsWith("image/")) {
      const newLayer: any = {
        id: generateId(),
        type: "image",
        name: media.name || "Image",
        visible: true,
        locked: false,
        startFrame: currentFrame,
        endFrame: Math.min(currentFrame + 300, totalFrames),
        position: { x: 50, y: 50 },
        size: { width: 40, height: 25 },
        rotation: 0,
        opacity: 1,
        src: mediaSource, 
        isBackground: false,
        objectFit: "contain",
      };
      
      pushState([...(layers || []), newLayer]);
      selectLayerAndCloseTab(newLayer.id);
      toast.success(`Added ${media.name}`);
    } 
    // Handle Videos
    else if (media.type === "video" || media.type?.startsWith("video/")) {
      const newLayer: any = {
        id: generateId(),
        type: "video",
        name: media.name || "Video",
        visible: true,
        locked: false,
        startFrame: currentFrame,
        endFrame: Math.min(currentFrame + 300, totalFrames),
        position: { x: 50, y: 50 },
        size: { width: 60, height: 45 },
        rotation: 0,
        opacity: 1,
        src: mediaSource, 
        volume: 0.8,
        loop: false,
        playbackRate: 1,
        objectFit: "contain",
        filter: "",
        fadeIn: 0,
        fadeOut: 0,
        animation: {
          entrance: "fade",
          entranceDuration: 30,
        },
      };
      
      pushState([...(layers || []), newLayer]);
      selectLayerAndCloseTab(newLayer.id);
      toast.success(`Added ${media.name}`);
    } 
    // Handle Audio
    else if (media.type === "audio" || media.type?.startsWith("audio/")) {
      const newLayer: any = {
        id: generateId(),
        type: "audio",
        name: media.name || "Audio",
        visible: true,
        locked: false,
        startFrame: currentFrame,
        endFrame: Math.min(currentFrame + 300, totalFrames),
        position: { x: 50, y: 50 },
        size: { width: 100, height: 10 },
        rotation: 0,
        opacity: 1,
        src: mediaSource,
        volume: 1,
        loop: false,
        fadeIn: 0,
        fadeOut: 0,
      };
      
      pushState([...(layers || []), newLayer]);
      selectLayerAndCloseTab(newLayer.id);
      toast.success(`Added ${media.name}`);
    } 
    else {
      console.warn('⚠️ Unknown media type:', media.type, media);
      toast.error(`Unsupported media type: ${media.type}`);
    }
  }, [currentFrame, totalFrames, layers, pushState, selectLayerAndCloseTab]);


  // Handle confirmation from the modal
  const handleMediaConfirm = useCallback((media: any) => {
    addMediaToCanvas(media);
    setProjectAssets(prev => {
      const exists = prev.find(p => p.name === media.name && p.type === media.type);
      if (exists) return prev;
      return [...prev, media];
    });
    setIsMediaGalleryOpen(false);
  }, [addMediaToCanvas]);

  const openMediaGallery = useCallback((tab: string) => {
    setMediaGalleryActiveTab(tab as "media" | "audio" | "video" | "text");
    setIsMediaGalleryOpen(true);
  }, []);

  const timelineTracks = useMemo((): TimelineTrack[] => {
    if (!layers) return [];
    return layers.map((layer) => ({
      id: layer.id,
      name: layer.name,
      type: layer.type,
      label: layer.name,
      startFrame: layer.startFrame,
      endFrame: layer.endFrame,
      color: LAYER_COLORS[layer.type] || "#888",
      visible: layer.visible,
      locked: layer.locked,
    }));
  }, [layers]);

  const handleTrackSelect = useCallback((trackId: string | null) => {
    selectLayerAndCloseTab(trackId);
    setEditingLayerId(null);
  }, [selectLayerAndCloseTab]);

  const handleReorderTracks = useCallback(
    (fromIndex: number, toIndex: number) => {
      const reorderedLayers = [...layers];
      const [movedLayer] = reorderedLayers.splice(fromIndex, 1);
      reorderedLayers.splice(toIndex, 0, movedLayer);
      pushState(reorderedLayers);
      toast.success("Layer reordered");
    },
    [layers, pushState]
  );

  const handleTracksChange = useCallback(
    (updatedTracks: TimelineTrack[]) => {
      if (!layers) return; 

      if (updatedTracks.length > layers.length) {
        // Handle split/cut tracks
        const newTrackIds = updatedTracks.map(t => t.id).filter(id => !layers.find(l => l.id === id));
        const newTracks = updatedTracks.filter(t => newTrackIds.includes(t.id));
        
        const newLayersMap = new Map<string, { layer: Layer; originalId: string }>();
        
        newTracks.forEach(track => {
          const originalId = track.id.includes('-cut-') ? track.id.split('-cut-')[0] : track.id;
          const originalLayer = layers.find(l => l.id === originalId);
          
          if (originalLayer) {
            const newLayer = {
              ...originalLayer,
              id: track.id,
              name: track.label,
              startFrame: track.startFrame,
              endFrame: track.endFrame,
              visible: track.visible !== undefined ? track.visible : originalLayer.visible,
              locked: track.locked !== undefined ? track.locked : originalLayer.locked,
            } as Layer;
            
            newLayersMap.set(track.id, { layer: newLayer, originalId });
          }
        });
        
        const finalLayers: Layer[] = [];
        
        layers.forEach((layer) => {
          const track = updatedTracks.find((t) => t.id === layer.id);
          if (track) {
            finalLayers.push({
              ...layer,
              startFrame: track.startFrame,
              endFrame: track.endFrame,
              visible: track.visible !== undefined ? track.visible : layer.visible,
              locked: track.locked !== undefined ? track.locked : layer.locked,
            });
          } else {
            finalLayers.push(layer);
          }
          
          for (const [newLayerId, { layer: newLayer, originalId }] of newLayersMap.entries()) {
            if (originalId === layer.id) {
              finalLayers.push(newLayer);
              newLayersMap.delete(newLayerId); 
            }
          }
        });
        
        newLayersMap.forEach(({ layer }) => finalLayers.push(layer));
        pushState(finalLayers);
      } else {
        const updatedLayers = layers.map((layer) => {
          const track = updatedTracks.find((t) => t.id === layer.id);
          if (track) {
            return {
              ...layer,
              startFrame: track.startFrame,
              endFrame: track.endFrame,
              visible: track.visible !== undefined ? track.visible : layer.visible,
              locked: track.locked !== undefined ? track.locked : layer.locked,
            };
          }
          return layer;
        });
        pushState(updatedLayers);
      }
    },
    [layers, pushState]
  );

  const handleFrameChange = useCallback((frame: number) => {
    setCurrentFrame(frame);
    if (previewRef.current) {
      previewRef.current.seekTo(frame);
    }
  }, []);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      previewRef.current?.pause();
    } else {
      previewRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handlePreviewFrameUpdate = useCallback((frame: number) => {
    setCurrentFrame(frame);
  }, []);

  const handleExport = useCallback(async (format: string = "mp4") => {
    setIsExporting(true);
    try {
     let exportProps;
     if (template && template.layersToProps) {
       exportProps = template.layersToProps(layers);
     } else {
        exportProps = { layers, currentFrame: 0 };
      }
     
      const videoUrl = await renderVideo(
      exportProps,
        template?.id || 1,
       template?.compositionId || "DynamicLayerComposition",
       format
     );
     setExportUrl(videoUrl);
    toast.success("Video exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
     toast.error("Failed to export video");
   } finally {
     setIsExporting(false);
    }
  }, [layers, template]);

 const handleSaveProject = useCallback(async (title: string, setStatus: (s: string) => void) => {
    setStatus("Saving...");
    try {
      // Fixed: Cast result to bypass void error from hook definition
      const savedProjectId = (await saveNewProject(title, setStatus)) as unknown as string;
      
      if (savedProjectId && !projectId) {
        setProjectId(savedProjectId);
        navigate(`/editor?project=${savedProjectId}`, { replace: true });
     }

     toast.success("Project saved successfully!");
    } catch (error) {
      setStatus("Error saving");
      toast.error("Failed to save project");
      throw error;
    }
  }, [saveNewProject, projectId, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isEditingText = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.contentEditable === 'true' ||
        editingLayerId !== null;
      
      if ((e.ctrlKey || e.metaKey) && e.key === "c" && selectedLayerId) {
        const layer = layers.find((l) => l.id === selectedLayerId);
        if (layer) {
          setCopiedLayer(layer);
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "v" && copiedLayer) {
        e.preventDefault();
        const newLayer = {
          ...copiedLayer,
          id: `${copiedLayer.type}-${Date.now()}`,
          name: `${copiedLayer.name} (Copy)`,
          position: {
            x: (copiedLayer.position?.x || 50) + 5,
            y: (copiedLayer.position?.y || 50) + 5,
          },
        };
        pushState([...layers, newLayer]);
        setSelectedLayerId(newLayer.id);
      }

      if ((e.key === "Delete" || e.key === "Backspace") && selectedLayerId && !isEditingText) {
        e.preventDefault();
        const layer = layers.find(l => l.id === selectedLayerId);
        if (layer && !layer.locked) {
          deleteLayer(selectedLayerId);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedLayerId, copiedLayer, deleteLayer, layers, pushState, setCopiedLayer, setSelectedLayerId, editingLayerId]);

  // Preview dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (previewContainerRef.current) {
        const container = previewContainerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const aspectRatio = 9 / 16;
        
        let width = containerWidth * 0.8;
        let height = width / aspectRatio;
        
        if (height > containerHeight * 0.8) {
          height = containerHeight * 0.8;
          width = height * aspectRatio;
        }
        
        setPreviewDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const previewInputProps = useMemo(() => {
    const timestamp = Date.now();
    
    // ✅ FORCE: Always grab the current template ID
    const activeTemplateId = template?.id;

    // Get specific props from the registry if they exist
    let registryProps = {};
    if (template && template.layersToProps) {
      registryProps = template.layersToProps(layers);
    }
    
    return { 
      layers, 
      currentFrame, 
      editingLayerId,
      // ✅ FORCE: Pass templateId explicitly so Composition detects it
      templateId: activeTemplateId,
      ...registryProps, // Spread registry props (like images/text) on top
      _forceUpdate: timestamp,
    };
  }, [template, layers, currentFrame, editingLayerId]);

  // Helper component for Tool Card
  const ToolCard = ({ icon, title, onClick, color }: { icon: React.ReactNode, title: string, onClick: () => void, color: string }) => (
    <div
      style={gridStyles.card}
      onClick={onClick}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div style={{ ...gridStyles.cardIcon, color }}>
        {icon}
      </div>
      <div style={gridStyles.cardTitle}>{title}</div>
    </div>
  );

  return (
    <>
      <div style={editorStyles.container}>
        {isLoading && <LoadingOverlay message="Loading project..." />}

        {/* Left Sidebar */}
        <div style={editorStyles.leftSidebar}>
          <button
            style={editorStyles.sidebarBackButton}
            onClick={() => navigate("/dashboard")}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            title="Back to Dashboard"
          >
            <Icons.ChevronLeft />
          </button>
          <button
            style={{
              ...editorStyles.sidebarButton,
              ...(activeTab === "text" ? editorStyles.sidebarButtonActive : {}),
            }}
            onClick={() => handleTabClick("text")}
            onMouseOver={(e) => {
              if (activeTab !== "text") {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#888";
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== "text") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#666";
              }
            }}
          >
            <EditorIcons.Type />
            <span>Text</span>
          </button>
          <button
            style={{
              ...editorStyles.sidebarButton,
              ...(activeTab === "media" ? editorStyles.sidebarButtonActive : {}),
            }}
            onClick={() => handleTabClick("media")}
            onMouseOver={(e) => {
              if (activeTab !== "media") {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#888";
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== "media") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#666";
              }
            }}
          >
            <EditorIcons.Image />
            <span>Media</span>
          </button>
          <button
            style={{
              ...editorStyles.sidebarButton,
              ...(activeTab === "audio" ? editorStyles.sidebarButtonActive : {}),
            }}
            onClick={() => handleTabClick("audio")}
            onMouseOver={(e) => {
              if (activeTab !== "audio") {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#888";
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== "audio") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#666";
              }
            }}
          >
            <Icons.Music />
            <span>Audio</span>
          </button>
          <button
            style={{
              ...editorStyles.sidebarButton,
              ...(activeTab === "video" ? editorStyles.sidebarButtonActive : {}),
            }}
            onClick={() => handleTabClick("video")}
            onMouseOver={(e) => {
              if (activeTab !== "video") {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#888";
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== "video") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#666";
              }
            }}
          >
            <EditorIcons.Video />
            <span>Video</span>
          </button>

          {/* Tools Tab */}
          <button
            style={{
              ...editorStyles.sidebarButton,
              ...(activeTab === "tools" ? editorStyles.sidebarButtonActive : {}),
            }}
            onClick={() => handleTabClick("tools")}
            onMouseOver={(e) => {
              if (activeTab !== "tools") {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#888";
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== "tools") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#666";
              }
            }}
            title="Tools"
          >
            <EditorIcons.Tools />
            <span>Tools</span>
          </button>

          {/* Special Layout Tab - Only for Split Screen (ID 6) */}
          {template?.id === 6 && (
            <button
              style={{
                ...editorStyles.sidebarButton,
                ...(activeTab === "layout" ? editorStyles.sidebarButtonActive : {}),
              }}
              onClick={() => handleTabClick("layout")}
              onMouseOver={(e) => {
                if (activeTab !== "layout") {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "#888";
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== "layout") {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#666";
                }
              }}
              title="Layout"
            >
              <Icons.Layout />
              <span>Layout</span>
            </button>
          )}

          {/* Carousel Tab - Only for Ken Burns Template */}
          {!template && (
            <button
              style={{
                ...editorStyles.sidebarButton,
                ...(activeTab === "carousel" ? editorStyles.sidebarButtonActive : {}),
              }}
              onClick={() => handleTabClick("carousel")}
              onMouseOver={(e) => {
                if (activeTab !== "carousel") {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "#888";
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== "carousel") {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#666";
                }
              }}
            >
              <CarouselIcon />
              <span>Carousel</span>
            </button>
          )}

          <div style={editorStyles.sidebarSpacer} />
        </div>

       {/* Layers Panel */}
        <div style={{
          ...editorStyles.layersPanel,
          ...(isPanelOpen && !showEditPanel ? {} : editorStyles.layersPanelClosed),
        }}>
          {isPanelOpen && !showEditPanel && (
            <>
              {activeTab === "carousel" && template?.id === 8 ? (
                <>
                  <div style={editorStyles.layersPanelHeader}>
                    <span style={editorStyles.layersPanelTitle}>Carousel</span>
                    <button
                      style={editorStyles.closeButton}
                      onClick={() => setActiveTab(null)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.color = "#888";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#666";
                      }}
                      title="Close panel"
                    >
                      <Icons.Close />
                    </button>
                  </div>

                  <KenBurnsEditor
                    layers={layers}
                    onUpdate={updateLayer}
                    onDelete={deleteLayer}
                    onAddImage={(imageUrl) => {
                      const existingImages = layers.filter(l => l.type === 'image').length;
                      const newLayer = {
                        id: `carousel-image-${Date.now()}`,
                        type: 'image' as const,
                        name: `Image ${existingImages + 1}`,
                        startFrame: 0,
                        endFrame: (existingImages + 1) * 90,
                        visible: true,
                        locked: false,
                        src: imageUrl,
                        isBackground: false,
                        objectFit: 'cover' as const,
                        position: { x: 50, y: 50 },
                        size: { width: 80, height: 80 },
                        rotation: 0,
                        opacity: 1,
                      };
                      pushState([...layers, newLayer]);
                      setDuration(Math.ceil(((existingImages + 1) * 90) / FPS));
                    }}
                    onReorder={(fromIndex, toIndex) => {
                      console.log('Reorder:', fromIndex, toIndex);
                    }}
                  />
                </>
              ) : (
                <>
                  <div style={editorStyles.layersPanelHeader}>
                    <span style={editorStyles.layersPanelTitle}>
                      {activeTab === "text" 
                        ? "Text" 
                        : activeTab === "audio" 
                        ? "Audio" 
                        : activeTab === "video"
                        ? "Video"
                        : activeTab === "tools"  
                        ? "Tools"
                        : activeTab === "layout"
                        ? "Layout"
                        : "Media"}
                    </span>
                    <button
                      style={editorStyles.closeButton}
                      onClick={() => setActiveTab(null)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.color = "#888";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#666";
                      }}
                      title="Close panel"
                    >
                      <Icons.Close />
                    </button>
                  </div>

                  {activeTab !== "tools" && activeTab !== "layout" && (
                    <MediaLibrary
                      activeTab={activeTab as "text" | "media" | "audio" | "video"}
                      projectAssets={projectAssets}
                      onAddLayer={addMediaToCanvas}
                      onOpenGallery={openMediaGallery}
                      onAddText={handleAddText}
                      currentFrame={currentFrame}
                      totalFrames={totalFrames}
                    />
                  )}
                  
                  {/* Special Layout Panel for Split Screen */}
                  {activeTab === "layout" && template?.id === 6 && (
                    <div style={gridStyles.container}>
                      
                      <div style={gridStyles.section}>
                        <div style={gridStyles.sectionTitle}>Choose Layout</div>
                        <div style={gridStyles.grid}>
                          <ToolCard 
                            icon={<Icons.Layout />} 
                            title="Split Screen" 
                            color={layoutMode === 'split' ? "#3b82f6" : "#666"}
                            onClick={() => handleLayoutChange('split')} 
                          />
                          <ToolCard 
                            icon={<Icons.Pip />} 
                            title="Pic-in-Pic" 
                            color={layoutMode === 'pip' ? "#10b981" : "#666"}
                            onClick={() => handleLayoutChange('pip')} 
                          />
                        </div>
                      </div>

                      <div style={gridStyles.section}>
                        <div style={gridStyles.sectionTitle}>Media Slots</div>
                        
                        {/* Upper/Main Slot */}
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          padding: '12px',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          {/* DYNAMIC LABEL */}
                          <div style={{ fontSize: '12px', color: '#ccc' }}>
                            {layoutMode === 'split' ? 'Top Video' : 'Main Background Video'}
                          </div>
                          <button
                            onClick={() => handleSlotReplace('upper-panel')}
                            style={{
                              backgroundColor: 'rgba(59, 130, 246, 0.2)',
                              color: '#3b82f6',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              cursor: 'pointer'
                            }}
                          >Replace</button>
                        </div>

                        {/* Lower/Reaction Slot */}
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          padding: '12px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          {/* DYNAMIC LABEL */}
                          <div style={{ fontSize: '12px', color: '#ccc' }}>
                            {layoutMode === 'split' ? 'Bottom Video' : 'Reaction / Overlay Video'}
                          </div>
                          <button
                            onClick={() => handleSlotReplace('lower-panel')}
                            style={{
                              backgroundColor: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              cursor: 'pointer'
                            }}
                          >Replace</button>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Tools Panel Grid */}
                  {activeTab === "tools" && (
                    <div style={gridStyles.container}>
                      
                      {/* Section: AI Generation */}
                      <div style={gridStyles.section}>
                        <div style={gridStyles.sectionTitle}>AI Generation</div>
                        <div style={gridStyles.grid}>
                          <ToolCard 
                            icon={<Icons.Image />} 
                            title="AI Images" 
                            color="#ec4899" 
                            onClick={() => setShowAIImageModal(true)} 
                          />
                          <ToolCard 
                            icon={<Icons.Video />} 
                            title="VEO Video" 
                            color="#a855f7" 
                            onClick={() => setShowVEOGeneratorModal(true)} 
                          />
                          <ToolCard 
                            icon={<Icons.Mic />} 
                            title="Voiceover" 
                            color="#8b5cf6" 
                            onClick={() => setShowVoiceoverModal(true)} 
                          />
                          <ToolCard 
                            icon={<Icons.Reddit />} 
                            title="Reddit Post" 
                            color="#ff4500" 
                            onClick={() => setShowRedditModal(true)} 
                          />
                        </div>
                      </div>

                      {/* Section: Editing & Enhancement */}
                      <div style={gridStyles.section}>
                        <div style={gridStyles.sectionTitle}>Enhancement</div>
                        <div style={gridStyles.grid}>
                          <ToolCard 
                            icon={<Icons.Eraser />} 
                            title="Remove BG" 
                            color="#06b6d4" 
                            onClick={() => setShowRemoveBackgroundModal(true)} 
                          />
                          <ToolCard 
                            icon={<Icons.Waveform />} 
                            title="Enhance Audio" 
                            color="#14b8a6" 
                            onClick={() => setShowEnhanceSpeechModal(true)} 
                          />
                          <ToolCard 
                            icon={<Icons.Crop />} 
                            title="Magic Crop" 
                            color="#10b981" 
                            onClick={() => setShowMagicCropModal(true)} 
                          />
                        </div>
                      </div>

                      {/* Section: Utilities */}
                      <div style={gridStyles.section}>
                        <div style={gridStyles.sectionTitle}>Utilities</div>
                        <div style={gridStyles.grid}>
                           <ToolCard 
                            icon={<Icons.Shuffle />} 
                            title="Remix Shorts" 
                            color="#3b82f6" 
                            onClick={() => setShowRemixShortsModal(true)} 
                          />
                           <ToolCard 
                            icon={<Icons.Smile />} 
                            title="Emoji" 
                            color="#f59e0b" 
                            onClick={() => setShowEmojiPickerModal(true)} 
                          />
                          <ToolCard 
                            icon={<Icons.Download />} 
                            title="YT Download" 
                            color="#ef4444" 
                            onClick={() => setShowYoutubeDownloaderModal(true)} 
                          />
                        </div>
                      </div>

                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Edit Panel */}
        <div style={{
          ...editorStyles.editPanel,
          ...(showEditPanel ? {} : editorStyles.editPanelHidden),
        }}>
          {showEditPanel && (
            <>
              <div style={{
                ...editorStyles.editPanelHeader,
                justifyContent: "space-between",
              }}>
                <span style={editorStyles.editPanelTitle}>
                  {selectedTextLayer && "Edit Text"}
                  {selectedAudioLayer && "Edit Audio"}
                  {selectedVideoLayer && "Edit Video"}
                  {selectedImageLayer && "Edit Image"}
                </span>
                <button
                  style={editorStyles.backButton}
                  onClick={() => setSelectedLayerId(null)}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <Icons.Close />
                </button>
              </div>

              {selectedTextLayer && (
                <TextEditor
                  layer={selectedTextLayer}
                  onUpdate={updateLayer}
                  onDelete={deleteLayer}
                />
              )}

              {selectedAudioLayer && (
                <AudioEditor
                  layer={selectedAudioLayer}
                  onUpdate={updateLayer}
                  onDelete={deleteLayer}
                  totalFrames={totalFrames} // Fixed: Added prop
                  onReplace={() => audioInputRef.current?.click()} // Fixed: Added prop
                />
              )}

              {selectedLayer && isImageLayer(selectedLayer) && (
                <ImageEditor
                  layer={selectedLayer}
                  totalFrames={totalFrames}
                  onUpdate={updateLayer}
                  onDelete={deleteLayer}
                  onReplace={() => fileInputRef.current?.click()}
                />
              )}

              {selectedVideoLayer && (
                <VideoEditor
                  layer={selectedVideoLayer}
                  totalFrames={totalFrames}
                  onUpdate={updateLayer}
                  onDelete={deleteLayer}
                  onReplace={() => videoInputRef.current?.click()}
                />
              )}
            </>
          )}
        </div>

        {/* Main Area */}
        <div style={editorStyles.mainArea}>
          <div style={editorStyles.header}>
            <span style={editorStyles.headerTitle}>{projectTitle || template?.displayName || 'Video Editor'}
              </span>
            <div style={editorStyles.headerButtonsRight}>
              <button
                style={editorStyles.addButton}
                onClick={() => setShowSaveModal(true)}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.15)")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.1)")}
              >
                Save
              </button>
              <button
                style={{
                  ...editorStyles.exportButton,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onClick={() => setShowExportModal(true)}
                onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <EditorIcons.Download />
                Export
              </button>
            </div>
          </div>

          <div style={editorStyles.previewArea} ref={previewContainerRef}>
            <div style={editorStyles.previewWrapper}>

            <RemotionPreview
              key={`preview-${layers.length}-${layers.map(l => l.id).join(',')}`}
              ref={previewRef}
              component={template?.composition || DynamicLayerComposition}
              inputProps={previewInputProps}
              durationInFrames={totalFrames}
              fps={FPS}
              onFrameUpdate={handlePreviewFrameUpdate}
              onPlayingChange={(playing) => setIsPlaying(playing)}
              // ✅ ADDED: Pass dynamic dimensions for responsiveness
              containerWidth="100%"
              containerHeight="100%"
              phoneFrameWidth={`${previewDimensions.width}px`}
              phoneFrameHeight={`${previewDimensions.height}px`}
            />

              {/* Enable overlay for Quote (ID 1), Typing (ID 2), etc. - Disable for Ken Burns (ID 8) */}
              {template?.id !== 8 && (
                <DynamicPreviewOverlay
                  layers={layers}
                  currentFrame={currentFrame}
                  selectedLayerId={selectedLayerId}
                  editingLayerId={editingLayerId}
                  onSelectLayer={selectLayerAndCloseTab}
                  onLayerUpdate={updateLayer}
                  containerWidth={previewDimensions.width}
                  containerHeight={previewDimensions.height}
                  onEditingLayerChange={setEditingLayerId}
                  isPlaying={isPlaying}
                  onPlayingChange={setIsPlaying}
                />
              )}
            </div>
          </div>

          <Timeline
            tracks={timelineTracks}
            currentFrame={currentFrame}
            totalFrames={totalFrames}
            fps={FPS}
            selectedTrackId={selectedLayerId}
            onFrameChange={handleFrameChange}
            onTrackSelect={handleTrackSelect}
            onTracksChange={handleTracksChange}
            onReorderTracks={handleReorderTracks}
            onDeleteTrack={deleteLayer}
            isPlaying={isPlaying}
            onPlayPause={togglePlayback}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
      <input ref={audioInputRef} type="file" accept="audio/*" style={{ display: "none" }} onChange={handleAudioUpload} />
      <input ref={videoInputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={handleVideoUpload} />

      {/* ✅ FIXED: Broadened accept to include common extensions + types */}
      <input 
        ref={layoutFileRef} 
        type="file" 
        accept="image/*,video/*,.png,.jpg,.jpeg,.mp4,.mov,.avi,.mkv,.webp,.gif" 
        style={{ display: "none" }} 
        onChange={handleLayoutFileChange} 
      />

      {/* Hidden container for video elements - CRITICAL for Magic Crop to work */}
      <div style={{ display: 'none' }}>
        {layers.filter(l => l.type === 'video').map(layer => (
          <video
            key={layer.id}
            ref={el => {
              if (el) videoRefs.current.set(layer.id, el);
              else videoRefs.current.delete(layer.id);
            }}
            src={(layer as VideoLayer).src}
            crossOrigin="anonymous" 
          />
        ))}
      </div>

      {showExportModal && (
        <ExportModal
          showExport={showExportModal}
          setShowExport={setShowExportModal}
          isExporting={isExporting}
          exportUrl={exportUrl}
          onExport={handleExport}
        />
      )}

      {showSaveModal && (
        <SaveProjectModal
          open={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveProject}
        />
      )}

      {isMediaGalleryOpen && (
        <MediaGalleryModal
          isOpen={isMediaGalleryOpen}
          onClose={() => setIsMediaGalleryOpen(false)}
          onConfirm={handleMediaConfirm}
          activeTab={mediaGalleryActiveTab}
        />
      )}

       {/* AI Tool Modals ✨ */}
        <VoiceoverModal
          isOpen={showVoiceoverModal}
          onClose={() => setShowVoiceoverModal(false)}
          onGenerate={handleVoiceoverGenerate}
        />
        <RedditPostModal
          isOpen={showRedditModal}
          onClose={() => setShowRedditModal(false)}
          onGenerate={handleRedditPostGenerate}
        />

        <MagicCropModal
          isOpen={showMagicCropModal}
          onClose={() => setShowMagicCropModal(false)}
          onApply={handleMagicCropApply}
          selectedLayerId={selectedLayerId}
          videoElement={getSelectedVideoElement()}
          videoUrl={selectedVideoLayer?.src} 
        />
        
        <EmojiPickerModal
          isOpen={showEmojiPickerModal}
          onClose={() => setShowEmojiPickerModal(false)}
          onSelect={handleEmojiSelect}
        />
        <RemixShortsModal
          isOpen={showRemixShortsModal}
          onClose={() => setShowRemixShortsModal(false)}
          onGenerate={handleRemixGenerate}
          currentVideo={
            selectedVideoLayer
              ? {
                  url: selectedVideoLayer.src,
                  duration: Math.round((selectedVideoLayer.endFrame - selectedVideoLayer.startFrame) / FPS),
                  thumbnail: undefined,
                }
              : layers.find((l): l is VideoLayer => l.type === 'video')
              ? {
                  url: (layers.find((l): l is VideoLayer => l.type === 'video') as VideoLayer).src,
                  duration: Math.round(
                    ((layers.find((l): l is VideoLayer => l.type === 'video') as VideoLayer).endFrame -
                      (layers.find((l): l is VideoLayer => l.type === 'video') as VideoLayer).startFrame) /
                      FPS
                  ),
                  thumbnail: undefined,
                }
              : null
          }
        />
        <AIImageModal
          isOpen={showAIImageModal}
          onClose={() => setShowAIImageModal(false)}
          onGenerate={handleAIImageGenerate}
        />
        <RemoveBackgroundModal
          isOpen={showRemoveBackgroundModal}
          onClose={() => setShowRemoveBackgroundModal(false)}
          onProcess={handleRemoveBackground}
          selectedLayerId={selectedLayerId}
        />
        <EnhanceSpeechModal
          isOpen={showEnhanceSpeechModal}
          onClose={() => setShowEnhanceSpeechModal(false)}
          onEnhance={handleEnhanceSpeech}
          selectedLayerId={selectedLayerId}
          currentAudioUrl={selectedAudioLayer?.src}
        />
        <YoutubeDownloaderModal
          isOpen={showYoutubeDownloaderModal}
          onClose={() => setShowYoutubeDownloaderModal(false)}
          onDownload={handleYoutubeDownload}
        />
        <VEOGeneratorModal
          isOpen={showVEOGeneratorModal}
          onClose={() => setShowVEOGeneratorModal(false)}
          onGenerate={handleVEOGenerate}
        />
    </>
  );
};

export default DynamicLayerEditor;