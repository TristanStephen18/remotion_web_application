import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";
import { ThemeToggle } from "../../components/ui/theme/ThemeToggle";
import html2canvas from "html2canvas";

// Editor Components
import DynamicLayerComposition from "../remotion_compositions/DynamicLayerComposition";

// Sidebar
import { SidebarTabs } from "../editor_components/SideBarTabs";

import {
  CollagePanel,
  type CollageLayout,
} from "../editor_components/CollagePanel";

// AI Tool Modals
import { VoiceoverModal } from "../ui/modals/VoiceOverModal";
import { RedditPostModal } from "../ui/modals/RedditPostModal";
import { MagicCropModal } from "../ui/modals/MagicCropModal";
import { EmojiPickerModal } from "../ui/modals/EmojiPickerModal";
import {
  RemixShortsModal,
  type RemixResult,
} from "../ui/modals/RemixShortsModal";
import { AIImageModal } from "../ui/modals/AIImageModal";
import { VEOGeneratorModal } from "../ui/modals/VEOGenaratorModal";
import { YoutubeDownloaderModal } from "../ui/modals/YoutubeDownloaderModal";
import { EnhanceSpeechModal } from "../ui/modals/EnhanceSpeechModal";
import { RemoveBackgroundModal } from "../ui/modals/RemoveBackgroundModal";

// Remotion composition and types
import {
  type Layer,
  type TextLayer,
  type ImageLayer,
  type AudioLayer,
  type VideoLayer,
  type ChatBubbleLayer,
  isTextLayer,
  isImageLayer,
  isAudioLayer,
  isVideoLayer,
} from "../remotion_compositions/DynamicLayerComposition";

// Hooks
import { useProjectSave } from "../../hooks/SaveProject";
// import { renderVideo } from "../../utils/VideoRenderer";

// UI Components
import { ExportModal } from "../ui/modals/ExportModal";
import { SaveProjectModal } from "../ui/modals/SaveModal";
import { LoadingOverlay } from "../ui/modals/LoadingProjectModal";
import { createDefaultLayers, generateId } from "../../utils/layerHelper";
import { useHistoryState } from "../../hooks/editor_hooks/useHistory";
import type { SidebarTab } from "../../types/editor_types";
import { FPS, LAYER_COLORS } from "../../data/editor_constants";
import { useLayerManagement } from "../../hooks/editor_hooks/useLayerManagement";
import { editorStyles } from "../../styles/editorStyles";
import Timeline, { type TimelineTrack } from "../editor_components/Timeline";
import MediaGalleryModal from "../editor_components/MediaGalleryModal";
import DynamicPreviewOverlay from "../editor_components/DynamicPreviewOverlay";
import { EditorIcons } from "../editor_components/EditorIcons";
import { TextEditor } from "../editor_components/TextEditor";
import { AudioEditor } from "../editor_components/AudioEditor";
import { ImageEditor } from "../editor_components/ImageEditor";
import { VideoEditor } from "../editor_components/VideoEditor";
import {
  RemotionPreview,
  type RemotionPreviewHandle,
} from "../editor_components/RemotionPreview";
import MediaLibrary from "../editor_components/MediaLibrary";
import {
  getTemplate,
  type TemplateDefinition,
} from "../../utils/simpleTemplateRegistry";
import { renderVideoUsingLambda } from "../../utils/lambdarendering";
import { backendPrefix } from "../../config";
import { compareProjectProps } from "../../utils/projectPropsComparison";
import { saveExistingProject } from "../../utils/projectSaver";

import { CropOverlay, type CropData } from "../editor_components/CropOverlay";

// ============================================================================
// ICONS & STYLES
// ============================================================================

const Icons = {
  ChevronLeft: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  Close: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Music: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  Carousel: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="7" width="20" height="15" rx="2" />
      <path d="M17 2l-5 5-5-5" />
    </svg>
  ),
  Layout: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  ),
  Pip: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="4" y="13" width="6" height="7" rx="1" fill="currentColor" />
    </svg>
  ),
  Image: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  Video: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  ),
  Mic: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
    </svg>
  ),
  Reddit: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
      <path
        d="M8 15c.5 1 2 2 4 2s3.5-1 4-2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  ),
  Eraser: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 20H7L3 16l6-6 8 8" />
      <line x1="14.5" y1="9.5" x2="16.5" y2="7.5" />
      <line x1="19" y1="15" x2="17" y2="17" />
    </svg>
  ),
  Waveform: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="4" y1="12" x2="5" y2="12" />
      <line x1="9" y1="8" x2="9" y2="16" />
      <line x1="14" y1="6" x2="14" y2="18" />
      <line x1="19" y1="9" x2="19" y2="15" />
    </svg>
  ),
  Crop: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 2v14a2 2 0 002 2h14" />
      <path d="M18 22V8a2 2 0 00-2-2H2" />
    </svg>
  ),
  Download: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Smile: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  Shuffle: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  ),
  Watch: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="7" />
      <polyline points="12 9 12 12 13.5 13.5" />
      <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.35-10.7l.35-3.83A2 2 0 0 1 9.83 2h4.35a2 2 0 0 1 2 1.82l.35 3.83" />
    </svg>
  ),
  Type: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  ),
  Chat: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  User: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Send: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
};

// --- MOCK CLOUDINARY ASSETS ---
const CloudinaryAssets = {
  watches: [
    {
      id: "w1",
      name: "Rolex Submariner",
      src: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "w2",
      name: "Omega Speedmaster",
      src: "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "w3",
      name: "Patek Philippe",
      src: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "w4",
      name: "Audemars Piguet",
      src: "https://images.unsplash.com/photo-1619134778706-c7310520fb10?auto=format&fit=crop&w=300&q=80",
    },
  ],
  videos: [
    {
      id: "v1",
      name: "Luxury Apartment",
      src: "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-a-view-4848-large.mp4",
    },
    {
      id: "v2",
      name: "City Night Drive",
      src: "https://assets.mixkit.co/videos/preview/mixkit-city-traffic-on-sunset-highway-335-large.mp4",
    },
    {
      id: "v3",
      name: "Abstract Gold",
      src: "https://assets.mixkit.co/videos/preview/mixkit-golden-particles-in-a-dark-background-3467-large.mp4",
    },
  ],
  music: [
    {
      id: "m1",
      name: "Trap Beat",
      src: "https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3",
    },
    {
      id: "m2",
      name: "Luxury Lounge",
      src: "https://assets.mixkit.co/music/preview/mixkit-hazy-after-hours-132.mp3",
    },
    {
      id: "m3",
      name: "Viral Phonk",
      src: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
    },
  ],
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DynamicLayerEditor: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [searchParams] = useSearchParams();
  const [template, setTemplate] = useState<TemplateDefinition | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState<string>("");

  const [screenshot, setScreenshot] = useState<string | null>(null);

  // const [isLight, setIsLight] = useState(false);

  // State
  const [duration, setDuration] = useState(10);
  const totalFrames = useMemo(() => duration * FPS, [duration]);

  const { layers, pushState, undo, redo, canUndo, canRedo } = useHistoryState(
    createDefaultLayers(duration)
  );

  useEffect(() => {
    if (layers.length === 0) {
      setDuration(10);
      return;
    }

    const maxEndFrame = Math.max(...layers.map((layer) => layer.endFrame));

    const requiredDuration = Math.ceil(maxEndFrame / FPS) + 1;

    // Update to fit exactly (minimum 5 seconds)
    setDuration(Math.max(requiredDuration, 5));
  }, [layers, FPS]);

  const [projectAssets, setProjectAssets] = useState<any[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [copiedLayer, setCopiedLayer] = useState<Layer | null>(null);
  const [activeTab, setActiveTab] = useState<SidebarTab>(null);

  const [cropMode, setCropMode] = useState(false);

  const [replacingVideoLayerId, setReplacingVideoLayerId] = useState<
    string | null
  >(null);

  // Modals & Gallery State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMediaGalleryOpen, setIsMediaGalleryOpen] = useState(false);
  const [mediaGalleryActiveTab, setMediaGalleryActiveTab] = useState<
    "media" | "audio" | "video" | "text"
  >("media");

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatPartnerName, setChatPartnerName] = useState("User");

  const [timelineHeight, setTimelineHeight] = useState(200); // Default height
  const [isResizingVertical, setIsResizingVertical] = useState(false);
  const verticalResizerRef = useRef<HTMLDivElement>(null);

  // Watch State
  const [watchNameInput, setWatchNameInput] = useState("");
  const [captionInput, setCaptionInput] = useState("");
  const [watchCategory, setWatchCategory] = useState<
    "main" | "watches" | "videos" | "music"
  >("main");

  // Carousel/Blur Style State
  const [carouselLayout, setCarouselLayout] = useState<"cinema" | "full">(
    "cinema"
  );

  // Collage State
  const [selectedCollageLayout, setSelectedCollageLayout] =
    useState<CollageLayout | null>(null);

  const [replacingLayerId, setReplacingLayerId] = useState<string | null>(null);
  const [replacingLayerType, setReplacingLayerType] = useState<
    "image" | "video" | "audio" | null
  >(null);

  const previewRef = useRef<RemotionPreviewHandle>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const remotionWrapperRef = useRef<HTMLDivElement>(null);

  // AI Tool Modals
  const [showVoiceoverModal, setShowVoiceoverModal] = useState(false);
  const [showRedditModal, setShowRedditModal] = useState(false);
  const [showMagicCropModal, setShowMagicCropModal] = useState(false);
  const [showEmojiPickerModal, setShowEmojiPickerModal] = useState(false);
  const [showRemixShortsModal, setShowRemixShortsModal] = useState(false);
  const [showAIImageModal, setShowAIImageModal] = useState(false);
  const [showRemoveBackgroundModal, setShowRemoveBackgroundModal] =
    useState(false);
  const [showEnhanceSpeechModal, setShowEnhanceSpeechModal] = useState(false);
  const [showYoutubeDownloaderModal, setShowYoutubeDownloaderModal] =
    useState(false);
  const [showVEOGeneratorModal, setShowVEOGeneratorModal] = useState(false);

  const [previewDimensions, setPreviewDimensions] = useState({
    width: 0,
    height: 0,
  });
  const hasLoadedTemplate = useRef(false);
  const isPanelOpen = activeTab !== null;

  //additional usestates for project saving
  const [isProjectSaving, setIsPorjectSaving] = useState(false);

  // Themed grid styles
  const gridStyles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "20px",
      padding: "20px",
      overflowY: "auto" as const,
      height: "100%",
    },
    section: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "10px",
    },
    sectionTitle: {
      fontSize: "11px",
      fontWeight: 700,
      color: colors.textMuted,
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      paddingLeft: "4px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "10px",
    },
    card: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bgHover,
      border: `1px solid ${colors.border}`,
      borderRadius: "12px",
      padding: "16px 8px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      height: "100px",
      gap: "8px",
    },
    compactCard: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: "8px",
      padding: "12px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      height: "80px",
      gap: "6px",
      textAlign: "center" as const,
    },
    cardTitle: {
      fontSize: "12px",
      fontWeight: 500,
      color: colors.textPrimary,
      textAlign: "center" as const,
      lineHeight: "1.2",
    },
    sleekInput: {
      width: "100%",
      padding: "10px 12px",
      marginBottom: "8px",
      borderRadius: "6px",
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.bgTertiary,
      color: colors.textPrimary,
      fontSize: "13px",
      outline: "none",
      transition: "border-color 0.2s",
    },
  };

  // Refs
  const watchImageInputRef = useRef<HTMLInputElement>(null);
  const watchBgInputRef = useRef<HTMLInputElement>(null);
  const watchAudioInputRef = useRef<HTMLInputElement>(null);
  const carouselInputRef = useRef<HTMLInputElement>(null);
  const chatAvatarInputRef = useRef<HTMLInputElement>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const layoutFileRef = useRef<HTMLInputElement>(null);
  const activeSlotId = useRef<string | null>(null);

  const hasLoadedProject = useRef(false);
  const location = useLocation();

  useEffect(() => {
    const templateIdParam = searchParams.get("template");
    const projectIdParam = searchParams.get("project");

    // ✅ Handle VEO redirect FIRST (before template/project loading)
    if (
      location.state?.fromVEO &&
      location.state?.videoData &&
      !hasLoadedTemplate.current
    ) {
      hasLoadedTemplate.current = true;
      const videoData = location.state.videoData;

      // Create video layer from VEO
      const newLayer: VideoLayer = {
        id: generateId(),
        type: "video",
        name: `VEO: ${videoData.prompt.substring(0, 30)}...`,
        visible: true,
        locked: false,
        startFrame: 0,
        endFrame: Math.round(videoData.duration * FPS),
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        rotation: 0,
        opacity: 1,
        src: videoData.url,
        volume: 0.8,
        loop: false,
        playbackRate: 1,
        objectFit: "cover",
        filter: "",
        fadeIn: 0,
        fadeOut: 0,
        animation: { entrance: "fade", entranceDuration: 30 },
      };

      // Set project title from VEO prompt
      setProjectTitle(`VEO: ${videoData.prompt.substring(0, 40)}...`);

      // Start with ONLY the video layer
      pushState([newLayer]);
      setSelectedLayerId(newLayer.id);
      setDuration(Math.max(videoData.duration + 2, 5)); // Add 2s buffer

      toast.success("VEO video loaded in editor! 🎬");

      // Clear navigation state to prevent re-triggering
      navigate(location.pathname, { replace: true, state: {} });

      // Don't load template or project
      return;
    }

    // ✅ Handle AI Image redirect
    if (
      location.state?.fromAIImage &&
      location.state?.imageData &&
      !hasLoadedTemplate.current
    ) {
      hasLoadedTemplate.current = true;
      const imageData = location.state.imageData;

      // Determine size based on aspect ratio
      let layerSize = { width: 80, height: 60 }; // Default
      if (imageData.aspectRatio === "9:16") {
        layerSize = { width: 50, height: 90 }; // Portrait
      } else if (imageData.aspectRatio === "16:9") {
        layerSize = { width: 90, height: 50 }; // Landscape
      } else if (imageData.aspectRatio === "1:1") {
        layerSize = { width: 70, height: 70 }; // Square
      } else if (imageData.aspectRatio === "4:5") {
        layerSize = { width: 60, height: 75 }; // Portrait-ish
      }

      // Create image layer from AI generation
      const newLayer: ImageLayer = {
        id: generateId(),
        type: "image",
        name: `AI Image: ${imageData.model}`,
        visible: true,
        locked: false,
        startFrame: 0,
        endFrame: 300, // 10 seconds at 30fps
        position: { x: 50, y: 50 },
        size: layerSize,
        rotation: 0,
        opacity: 1,
        src: imageData.url,
        isBackground: false,
        objectFit: "contain",
        filter: "",
        animation: { entrance: "fade", entranceDuration: 30 },
      };

      setProjectTitle(`AI Image: ${imageData.model}`);
      pushState([newLayer]);
      setSelectedLayerId(newLayer.id);
      setDuration(10); // Default 10 seconds

      toast.success("AI Image loaded in editor! 🎨");
      navigate(location.pathname, { replace: true, state: {} });
      return;
    }

    // ✅ Handle Background Removal redirect
    if (
      location.state?.fromBgRemoval &&
      location.state?.imageData &&
      !hasLoadedTemplate.current
    ) {
      hasLoadedTemplate.current = true;
      const imageData = location.state.imageData;

      // Create image layer from background removal
      const newLayer: ImageLayer = {
        id: generateId(),
        type: "image",
        name: imageData.name
          ? `BG Removed: ${imageData.name.substring(0, 20)}`
          : "Background Removed",
        visible: true,
        locked: false,
        startFrame: 0,
        endFrame: 300, // 10 seconds
        position: { x: 50, y: 50 },
        size: { width: 60, height: 80 }, // Portrait by default (most bg removal images)
        rotation: 0,
        opacity: 1,
        src: imageData.url,
        isBackground: false,
        objectFit: "contain",
        filter: "",
        animation: { entrance: "fade", entranceDuration: 30 },
      };

      setProjectTitle(
        imageData.name
          ? `Edited: ${imageData.name}`
          : "Background Removed Image"
      );
      pushState([newLayer]);
      setSelectedLayerId(newLayer.id);
      setDuration(10);

      toast.success("Image loaded! Background removed ✨");
      navigate(location.pathname, { replace: true, state: {} });
      return;
    }

    // ✅ Normal template loading
    if (templateIdParam && !hasLoadedTemplate.current) {
      hasLoadedTemplate.current = true;
      const templateId = parseInt(templateIdParam);
      const templateDef = getTemplate(templateId);
      if (templateDef) {
        setTemplate(templateDef);
        const defaultLayers = templateDef.createDefaultLayers();
        pushState(defaultLayers);
        if (templateDef.calculateDuration) {
          setDuration(
            Math.ceil(templateDef.calculateDuration(defaultLayers) / FPS)
          );
        }
        // Initialize chat name
        if (templateId === 9) {
          const firstBubble = defaultLayers.find(
            (l: any) => l.type === "chat-bubble"
          );
          if (firstBubble)
            setChatPartnerName((firstBubble as any).senderName || "User");
        }
      } else {
        toast.error("Template not found");
      }
    }
    // ✅ Normal project loading
    else if (projectIdParam && !hasLoadedProject.current) {
      hasLoadedProject.current = true;
      setProjectId(projectIdParam);
      setIsLoading(true);
      fetch(`${backendPrefix}/projects/${projectIdParam}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const templateDef = getTemplate(data.templateId);
          if (templateDef) setTemplate(templateDef);
          pushState(data.props.layers || []);
          setProjectTitle(data.title || "");
          if (data.props.duration) setDuration(data.props.duration);

          // Initialize chat name
          if (data.templateId === 9) {
            const firstBubble = data.props.layers.find(
              (l: any) => l.type === "chat-bubble"
            );
            if (firstBubble)
              setChatPartnerName((firstBubble as any).senderName || "User");
          }
          toast.success("Project loaded!");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load project");
        })
        .finally(() => setIsLoading(false));
    }
  }, [searchParams, location.state, pushState, navigate]);

  const capturePreviewScreenshot = async (): Promise<Blob | null> => {
    if (!remotionWrapperRef.current) {
      console.error("Preview container not found");
      return null;
    }

    try {
      // Optional: Temporarily hide overlays during capture
      const overlays =
        remotionWrapperRef.current.querySelectorAll("[data-overlay]");
      overlays.forEach((el) => ((el as HTMLElement).style.display = "none"));

      // Wait a bit for render
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(remotionWrapperRef.current, {
        backgroundColor: colors.bgPrimary,
        scale: 1,
        useCORS: true,
        allowTaint: true,
        logging: false,
        foreignObjectRendering: false,
        ignoreElements: (element) => {
          return (
            element.classList.contains("control-overlay") ||
            element.classList.contains("crop-overlay")
          );
        },
      });

      // Restore overlays
      overlays.forEach((el) => ((el as HTMLElement).style.display = ""));

      // Convert to blob (no cropping)
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.85);
      });
    } catch (error) {
      console.error("Screenshot capture failed:", error);
      return null;
    }
  };

  const handleSaveThumbnail = async () => {
    handleFrameChange((duration-2)*30)
    const blob = await capturePreviewScreenshot();

    if (blob) {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("thumbnail", blob, `project-${Date.now()}.jpg`);

      const response = await fetch(
        `${backendPrefix}/cloudinary/upload-thumbnail`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Thumbnail URL:", data.url);
      setScreenshot(data.url as string);
    }
  };

  const {
    addTextLayer,
    handleImageUpload,
    handleAudioUpload,
    handleVideoUpload,
    updateLayer,
    deleteLayer,
    reorderLayers,
  } = useLayerManagement({
    layers,
    currentFrame,
    totalFrames,
    pushState,
    setSelectedLayerId,
  });

  const handleCropChange = useCallback(
    (crop: CropData) => {
      if (selectedLayerId) {
        updateLayer(selectedLayerId, { crop });
      }
    },
    [selectedLayerId, updateLayer]
  );

  const handleCropComplete = useCallback(() => {
    setCropMode(false);
  }, []);

  const { showSaveModal, setShowSaveModal, saveNewProject } = useProjectSave({
    templateId: template?.id || 1,
    buildProps: () => ({
      layers,
      duration,
      currentFrame,
      templateId: template?.id || 1,
    }),
    videoEndpoint: `${backendPrefix}/generatevideo/render-video/lambda`,
  });

  const selectedLayer = useMemo(
    () => layers?.find((l) => l.id === selectedLayerId) || null,
    [layers, selectedLayerId]
  );
  const selectedTextLayer =
    selectedLayer && isTextLayer(selectedLayer) ? selectedLayer : null;
  const selectedImageLayer =
    selectedLayer && isImageLayer(selectedLayer) ? selectedLayer : null;
  const selectedAudioLayer =
    selectedLayer && isAudioLayer(selectedLayer) ? selectedLayer : null;
  const selectedVideoLayer =
    selectedLayer && isVideoLayer(selectedLayer) ? selectedLayer : null;
  const showEditPanel =
    selectedTextLayer !== null ||
    selectedImageLayer !== null ||
    selectedAudioLayer !== null ||
    selectedVideoLayer !== null;

  const getSelectedVideoElement = useCallback((): HTMLVideoElement | null => {
    if (!selectedLayerId) return null;
    const layer = layers.find((l) => l.id === selectedLayerId);
    if (!layer || layer.type !== "video") return null;
    return videoRefs.current.get(selectedLayerId) || null;
  }, [selectedLayerId, layers]);

  const handleVideoReplaceUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !replacingVideoLayerId) return;

      const url = URL.createObjectURL(file);
      updateLayer(replacingVideoLayerId, { src: url } as Partial<VideoLayer>);
      toast.success("Video replaced successfully");
      setReplacingVideoLayerId(null);
      e.target.value = ""; // Reset input
    },
    [replacingVideoLayerId, updateLayer]
  );

  useEffect(() => {
    const updateDimensions = () => {
      if (previewContainerRef.current) {
        const container = previewContainerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const aspectRatio = 9 / 16;
        let width = containerWidth * 0.95;
        let height = width / aspectRatio;
        if (height > containerHeight * 0.95) {
          height = containerHeight * 0.95;
          width = height * aspectRatio;
        }
        setPreviewDimensions({ width, height });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [timelineHeight]);

  // --- SPLIT SCREEN HANDLERS ---
  const getLayoutMode = () => {
    const lowerPanel = layers.find((l) => l.id === "lower-panel");
    if (!lowerPanel) return "split";
    return lowerPanel.size.height < 40 ? "pip" : "split";
  };
  const layoutMode = getLayoutMode();
  const handleLayoutChange = useCallback(
    (type: "split" | "pip") => {
      const newLayers = layers.map((layer) => {
        if (layer.id === "upper-panel")
          return {
            ...layer,
            position: type === "split" ? { x: 50, y: 25 } : { x: 50, y: 50 },
            size:
              type === "split"
                ? { width: 100, height: 50 }
                : { width: 100, height: 100 },
            borderWidth: 0,
          };
        if (layer.id === "lower-panel")
          return {
            ...layer,
            position: type === "split" ? { x: 50, y: 75 } : { x: 22, y: 75 },
            size:
              type === "split"
                ? { width: 100, height: 50 }
                : { width: 30, height: 25 },
            borderWidth: type === "pip" ? 5 : 0,
            borderColor: "#38bdf8",
          };
        if (layer.id === "divider")
          return { ...layer, visible: type === "split" };
        return layer;
      });
      pushState(newLayers as Layer[]);
      toast.success(
        `Switched to ${
          type === "split" ? "Split Screen" : "Picture-in-Picture"
        }`
      );
    },
    [layers, pushState]
  );

  // const handleSlotReplace = useCallback((layerId: string) => {
  //   const layer = layers.find(l => l.id === layerId);
  //   if (layer) { activeSlotId.current = layerId; if (layoutFileRef.current) layoutFileRef.current.click(); }
  //   else toast.error("Layer not found.");
  // }, [layers]);
  const handleLayoutFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && activeSlotId.current) {
        const url = URL.createObjectURL(file);
        const fileType = file.type.startsWith("video") ? "video" : "image";
        updateLayer(activeSlotId.current, {
          src: url,
          type: fileType,
        } as Partial<Layer>);
        toast.success(
          `${fileType === "video" ? "Video" : "Image"} replaced successfully`
        );
        e.target.value = "";
      }
    },
    [updateLayer]
  );

  // --- CHAT HANDLERS ---
  const handleChatStyleChange = useCallback(
    (newStyle: "imessage" | "whatsapp" | "instagram" | "messenger" | "fakechatconversation") => {
      const updatedLayers = layers.map((layer) =>
        layer.type === "chat-bubble" ? { ...layer, chatStyle: newStyle } : layer
      );
      pushState(updatedLayers as any);
      toast.success(`Switched to ${newStyle}`);
    },
    [layers, pushState]
  );

  const handleUpdateChatPartner = useCallback(
    (name: string) => {
      setChatPartnerName(name);
      // Update all bubbles to carry this name (simplest way to persist header info)
      const updatedLayers = layers.map((layer) =>
        layer.type === "chat-bubble" ? { ...layer, senderName: name } : layer
      );
      pushState(updatedLayers as any);
    },
    [layers, pushState]
  );

  const handleChatAvatarUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const updatedLayers = layers.map((layer) =>
          layer.type === "chat-bubble" ? { ...layer, avatarUrl: url } : layer
        );
        pushState(updatedLayers as any);
        toast.success("Chat avatar updated");
        e.target.value = "";
      }
    },
    [layers, pushState]
  );

  const handleAddMessage = useCallback(
    (isSender: boolean, isTyping = false) => {
      const chatLayers = layers.filter((l) => l.type === "chat-bubble");
      const lastLayer = chatLayers[chatLayers.length - 1];

      // Auto-spacing logic
      const startY = lastLayer ? (lastLayer as any).position.y + 12 : 20;

      // Inherit properties from first bubble (style, name, avatar)
      const firstBubble = chatLayers[0] as any;
      const currentStyle = firstBubble?.chatStyle || "imessage";
      const currentName = firstBubble?.senderName || "User";
      const currentAvatar = firstBubble?.avatarUrl;

      if (!chatInput && !isTyping) {
        toast.error("Enter a message first");
        return;
      }

      const newMsg: ChatBubbleLayer = {
        id: `msg-${Date.now()}`,
        type: "chat-bubble",
        name: isTyping
          ? "Typing..."
          : isSender
          ? "Me: Message"
          : "Them: Message",
        startFrame: currentFrame,
        endFrame: Math.min(currentFrame + 150, totalFrames),
        visible: true,
        locked: false,
        message: chatInput,
        isSender: isSender,
        isTyping: isTyping,
        chatStyle: currentStyle,
        senderName: currentName,
        avatarUrl: currentAvatar,
        position: { x: 50, y: startY }, // Centered X, Y increments automatically handled by rendering
        size: { width: 100, height: 10 },
        rotation: 0,
        opacity: 1,
        animation: { entrance: "slideUp", entranceDuration: 20 },
      };

      pushState([...layers, newMsg]);
      setSelectedLayerId(newMsg.id);
      if (!isTyping) setChatInput("");
      toast.success("Message added");
    },
    [layers, currentFrame, totalFrames, chatInput, pushState]
  );

  // --- WATCH HANDLERS (UPDATED) ---
  const handleUpdateWatchText = useCallback(
    (type: "name" | "caption", value: string) => {
      const layerId = type === "name" ? "watch-name" : "watch-caption";
      const layer = layers.find((l) => l.id === layerId);
      if (layer) {
        updateLayer(layerId, { content: value });
      }
    },
    [layers, updateLayer]
  );

  const handleSelectWatchAsset = useCallback(
    (url: string, type: "image" | "video" | "audio") => {
      let layerId = "";
      if (type === "image") layerId = "watch-image";
      else if (type === "video") layerId = "watch-bg";
      else if (type === "audio") layerId = "watch-audio";

      const layer = layers.find((l) => l.id === layerId);
      if (layer) {
        updateLayer(layerId, { src: url } as Partial<Layer>);
        toast.success(
          `${
            type === "image"
              ? "Watch"
              : type === "video"
              ? "Background"
              : "Music"
          } updated!`
        );
      } else {
        toast.error(`Layer ${layerId} not found in template.`);
      }
    },
    [layers, updateLayer]
  );

  const handleWatchFileChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      targetId: string,
      type: "image" | "video" | "audio"
    ) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        updateLayer(targetId, { src: url } as Partial<Layer>);
        toast.success(`${type} updated!`);
        e.target.value = "";
      }
    },
    [updateLayer]
  );

  // --- CAROUSEL UPLOAD HANDLER ---
  const handleCarouselUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const newLayers: Layer[] = [];
      let startFrame = currentFrame;
      const slideDuration = 90;

      const lastContentLayer = [...layers].sort(
        (a, b) => b.endFrame - a.endFrame
      )[0];
      if (lastContentLayer) {
        startFrame = lastContentLayer.endFrame;
      }

      Array.from(files).forEach((file, index) => {
        const url = URL.createObjectURL(file);
        const type = file.type.startsWith("video") ? "video" : "image";

        const newLayer: any = {
          id: generateId(),
          type: type,
          name: `Slide ${index + 1}`,
          visible: true,
          locked: false,
          startFrame: startFrame,
          endFrame: startFrame + slideDuration,
          position: { x: 50, y: 50 },
          size: { width: 100, height: 100 },
          rotation: 0,
          opacity: 1,
          src: url,
          isBackground: false,
        };

        if (type === "video") {
          newLayer.volume = 1;
          newLayer.loop = true;
          newLayer.playbackRate = 1;
        } else {
          newLayer.objectFit = "contain";
        }

        newLayers.push(newLayer);
        startFrame += slideDuration;
      });

      pushState([...layers, ...newLayers]);
      toast.success(`Added ${files.length} photos/videos`);

      if (carouselInputRef.current) carouselInputRef.current.value = "";
    },
    [layers, currentFrame, pushState]
  );

  const handleGlobalDeselect = useCallback(
    (e: MouseEvent) => {
      if (!selectedLayerId && !editingLayerId) return; 

      const target = e.target as HTMLElement;
      
      const isTargetingInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true';
      const isTargetingButton = target.tagName === 'BUTTON' || target.closest('button');
      const isTargetingModal = target.closest('.react-modal-overlay') !== null;
      const isTargetingTimeline = target.closest('[data-timeline="true"]') !== null;
      const isTargetingPanel = target.closest('[data-panel="true"]') !== null;
      
      if (!isTargetingInput && !isTargetingButton && !isTargetingModal && !isTargetingTimeline && !isTargetingPanel) {
        setSelectedLayerId(null);
        setEditingLayerId(null);
      }
    },
    [selectedLayerId, editingLayerId]
  );

  useEffect(() => {
    const mainAreaElement = mainAreaRef.current;
    if (mainAreaElement) {
      mainAreaElement.addEventListener('click', handleGlobalDeselect as EventListener);
    }

    return () => {
      if (mainAreaElement) {
        mainAreaElement.removeEventListener('click', handleGlobalDeselect as EventListener);
      }
    };
  }, [handleGlobalDeselect]);


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingVertical) return;
      e.preventDefault();
      
      const mainArea = mainAreaRef.current;
      if (!mainArea) return;

      const mainRect = mainArea.getBoundingClientRect();
      const newTimelineHeight = Math.max(
        100, // Minimum height
        Math.min(
          mainRect.height - 200, // Maximum height (leaves space for preview)
          mainRect.bottom - e.clientY // Distance from mouse to bottom of mainArea
        )
      );

      setTimelineHeight(newTimelineHeight);
    };

    const handleMouseUp = () => {
      if (isResizingVertical) {
        setIsResizingVertical(false);
        document.body.style.cursor = "default";
      }
    };

    if (isResizingVertical) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ns-resize";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingVertical]);

  // ============================================================================
  // COLLAGE HANDLERS
  // ============================================================================

  const handleCollageLayoutSelect = useCallback(
    (layout: CollageLayout) => {
      setSelectedCollageLayout(layout);

      // Sample images to cycle through
      const sampleImages = [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=1600&fit=crop", // Mountain landscape
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=1600&fit=crop", // Nature scene
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=1600&fit=crop", // Beach sunset
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=1600&fit=crop", // Beach view
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=1600&fit=crop", // Ocean
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=1600&fit=crop", // Lake
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=1600&fit=crop", // Forest
        "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&h=1600&fit=crop", // Sunset
        "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&h=1600&fit=crop", // Mountain peak
      ];

      // Animation options for variety
      const animations = ["fade", "slideUp", "scale", "zoomPunch"];

      // Timing configuration
      const collageEndFrame = 90; // Collage shows for 3 seconds
      const photoStartFrame = 90; // Individual photos start at 3 seconds
      const photoDuration = 60; // Each photo shows for 2 seconds

      // 1. CREATE COLLAGE SLOT LAYERS (with aesthetic enhancements)
      const collageLayers: Layer[] = layout.slots.map((slot, index) => {
        const layerId = generateId();
        const animation = animations[index % animations.length];

        const imageLayer: ImageLayer = {
          id: layerId,
          name: `Collage Slot ${index + 1}`,
          visible: true,
          locked: false,
          type: "image",
          startFrame: 0,
          endFrame: collageEndFrame,
          position: {
            x: slot.x + slot.width / 2,
            y: slot.y + slot.height / 2,
          },
          size: {
            width: slot.width,
            height: slot.height,
          },
          rotation: slot.rotation || 0,
          opacity: 1,
          animation: {
            entrance: animation as
              | "fade"
              | "slideUp"
              | "slideDown"
              | "scale"
              | "zoomPunch",
            entranceDuration: 30,
          },
          src: sampleImages[index % sampleImages.length],
          objectFit: "cover",
          // Enhanced aesthetic filters
          filter: slot.shadow
            ? "drop-shadow(0px 12px 32px rgba(0, 0, 0, 0.6)) brightness(1.05) contrast(1.05)"
            : "brightness(1.05) contrast(1.05)",
        };

        return imageLayer;
      });

      // 2. CREATE FULLSCREEN TRAILING INDIVIDUAL PHOTO LAYERS (aesthetic designs)
      const trailingPhotoLayers: ImageLayer[] = [];
      const individualAnimations = ["zoomPunch", "scale", "fade"];

      for (let i = 0; i < 6; i++) {
        const photoId = generateId();
        trailingPhotoLayers.push({
          id: photoId,
          name: `Individual Photo ${i + 1}`,
          visible: true,
          locked: false,
          type: "image",
          startFrame: photoStartFrame + i * photoDuration,
          endFrame: photoStartFrame + (i + 1) * photoDuration,
          position: { x: 50, y: 50 }, // Center
          size: { width: 100, height: 100 }, // FULLSCREEN
          rotation: 0,
          opacity: 1,
          animation: {
            entrance: individualAnimations[i % individualAnimations.length] as
              | "fade"
              | "scale"
              | "zoomPunch",
            entranceDuration: 25,
          },
          src: sampleImages[(layout.slots.length + i) % sampleImages.length],
          objectFit: "cover",
          // Aesthetic enhancement filters
          filter: "brightness(1.08) contrast(1.1) saturate(1.15)",
        });
      }

      // 3. CREATE AESTHETIC TEXT OVERLAY (only during collage section)
      const textLayer: TextLayer = {
        id: generateId(),
        name: "Collage Title",
        visible: true,
        locked: false,
        type: "text",
        startFrame: 0,
        endFrame: collageEndFrame,
        position: { x: 50, y: 10 }, // Top center
        size: { width: 85, height: 12 },
        rotation: 0,
        opacity: 1,
        animation: {
          entrance: "slideDown",
          entranceDuration: 30,
        },
        content: layout.name.toUpperCase(), // Uppercase for style
        fontFamily: "Poppins",
        fontSize: 7,
        fontColor: "#ffffff",
        fontWeight: "800",
        fontStyle: "normal",
        textAlign: "center",
        lineHeight: 1.3,
        letterSpacing: 3, // Wide letter spacing for aesthetic
        textTransform: "uppercase",
        textOutline: true,
        outlineColor: "#000000",
        textShadow: true,
        shadowColor: "#000000",
        shadowX: 0,
        shadowY: 4,
        shadowBlur: 12,
      };

      // 4. CREATE SUBTLE GRADIENT OVERLAY (only during collage for depth)
      const gradientOverlay: ImageLayer = {
        id: generateId(),
        name: "Gradient Overlay",
        visible: true,
        locked: true,
        type: "image",
        startFrame: 0,
        endFrame: collageEndFrame, // Only during collage
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        rotation: 0,
        opacity: 0.15, // Subtle overlay
        // Black gradient from top (for text readability)
        src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA4MCIgaGVpZ2h0PSIxOTIwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDA7c3RvcC1vcGFjaXR5OjAuOCIvPjxzdG9wIG9mZnNldD0iNDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwO3N0b3Atb3BhY2l0eTowIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwO3N0b3Atb3BhY2l0eTowIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwODAiIGhlaWdodD0iMTkyMCIgZmlsbD0idXJsKCNncmFkKSIvPjwvc3ZnPg==",
        objectFit: "cover",
        isBackground: false,
      };

      // 5. CREATE BOTTOM VIGNETTE FOR INDIVIDUAL PHOTOS (for aesthetic depth)
      const bottomVignette: ImageLayer = {
        id: generateId(),
        name: "Bottom Vignette",
        visible: true,
        locked: true,
        type: "image",
        startFrame: photoStartFrame,
        endFrame: totalFrames, // During all individual photos
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        rotation: 0,
        opacity: 0.25, // Subtle vignette
        // Dark edges vignette
        src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA4MCIgaGVpZ2h0PSIxOTIwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0idmlnIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI3MCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDA7c3RvcC1vcGFjaXR5OjAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDA7c3RvcC1vcGFjaXR5OjAuOSIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDgwIiBoZWlnaHQ9IjE5MjAiIGZpbGw9InVybCgjdmlnKSIvPjwvc3ZnPg==",
        objectFit: "cover",
        isBackground: false,
      };

      // 6. COMBINE ALL LAYERS IN PROPER ORDER
      const allLayers: Layer[] = [
        ...collageLayers, // Collage slots (appear first)
        gradientOverlay, // Gradient for collage section
        textLayer, // Text overlay (only during collage)
        ...trailingPhotoLayers, // Individual fullscreen photos
        bottomVignette, // Vignette for individual photos
      ];

      // Remove ALL old layers and add new composition
      console.log("=== CREATING AESTHETIC COLLAGE COMPOSITION ===");
      console.log("Removing all", layers.length, "existing layers");
      console.log("Adding", collageLayers.length, "collage slots (0-3s)");
      console.log(
        "Adding",
        trailingPhotoLayers.length,
        "fullscreen photos (3-15s)"
      );
      console.log("Adding text layer (0-3s only)");
      console.log("Adding aesthetic overlays");

      pushState(allLayers);

      // Clear selection
      setSelectedLayerId(null);
      setEditingLayerId(null);

      // Force cursor back to default
      document.body.style.cursor = "default";
      setTimeout(() => {
        document.body.style.cursor = "default";
      }, 0);

      toast.success(`✨ Applied ${layout.name} with aesthetic design!`);
    },
    [layers, pushState, totalFrames, setSelectedLayerId, setEditingLayerId]
  );

  // --- TOOLS HANDLERS ---
  const handleRemoveBackground = useCallback(
    (processedImageUrl: string) => {
      if (selectedImageLayer)
        updateLayer(selectedImageLayer.id, { src: processedImageUrl });
      else if (selectedVideoLayer)
        updateLayer(selectedVideoLayer.id, { src: processedImageUrl });
      toast.success("Background removed");
    },
    [selectedImageLayer, selectedVideoLayer, updateLayer]
  );
  const handleEnhanceSpeech = useCallback(
    (data: { audioUrl: string }) => {
      if (selectedAudioLayer)
        updateLayer(selectedAudioLayer.id, { src: data.audioUrl });
      toast.success("Speech enhanced");
    },
    [selectedAudioLayer, updateLayer]
  );
  const handleVoiceoverGenerate = useCallback(
    (audioData: any) => {
      const newLayer: AudioLayer = {
        id: generateId(),
        type: "audio",
        name: `Voiceover`,
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
      toast.success("Voiceover added");
    },
    [currentFrame, totalFrames, layers, pushState]
  );
  const handleRedditPostGenerate = useCallback(
    (imageUrl: string) => {
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
      toast.success("Reddit post added");
    },
    [currentFrame, totalFrames, layers, pushState]
  );
  const handleAIImageGenerate = useCallback(
    (imageUrl: string) => {
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
      toast.success("AI image added");
    },
    [currentFrame, totalFrames, layers, pushState]
  );
  const handleMagicCropApply = useCallback(
    (settings: any) => {
      const selectedVideo = layers.find(
        (l) => l.id === selectedLayerId && l.type === "video"
      ) as VideoLayer;
      if (!selectedVideo) {
        toast.error("Select video layer");
        return;
      }
      const newLayers = layers.map((layer) => {
        if (layer.id !== selectedVideo.id) return layer;
        return {
          ...layer,
          position: { x: settings.cropRegion.x, y: settings.cropRegion.y },
          size: {
            width: settings.cropRegion.width,
            height: settings.cropRegion.height,
          },
          objectFit:
            settings.cropType === "smart" || settings.cropType === "face"
              ? "cover"
              : "contain",
        } as VideoLayer;
      });
      pushState(newLayers);
      toast.success(`Magic crop applied!`);
    },
    [selectedLayerId, layers, pushState]
  );
  const handleEmojiSelect = useCallback(
    (emoji: string) => {
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
      toast.success("Emoji added");
    },
    [currentFrame, totalFrames, layers, pushState]
  );
  const handleRemixGenerate = useCallback(
    (remixes: RemixResult[]) => {
      const newLayers = remixes.map((remix, index) => ({
        id: generateId(),
        type: "video" as const,
        name: remix.title || `Remix ${index + 1}`,
        visible: true,
        locked: false,
        startFrame: currentFrame,
        endFrame: Math.min(
          currentFrame + Math.round(remix.duration * FPS),
          totalFrames
        ),
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        rotation: 0,
        opacity: 1,
        src: remix.url,
        volume: 0.8,
        loop: false,
        playbackRate: 1,
        objectFit: "cover" as const,
        filter: "",
        fadeIn: 15,
        fadeOut: 15,
        animation: { entrance: "fade" as const, entranceDuration: 30 },
      }));
      pushState([...newLayers, ...layers]);
      if (newLayers.length > 0) setSelectedLayerId(newLayers[0].id);
      toast.success(`Added ${remixes.length} remixes`);
    },
    [currentFrame, totalFrames, layers, pushState, FPS]
  );
  const handleYoutubeDownload = useCallback(
    (data: {
      videoUrl: string;
      title: string;
      duration: number;
      format?: string;
    }) => {
      const durationInFrames = Math.round(data.duration * FPS);
      const newLayer: VideoLayer = {
        id: generateId(),
        type: "video",
        name: `${data.title}`,
        visible: true,
        locked: false,
        startFrame: currentFrame,
        endFrame: Math.min(currentFrame + durationInFrames, totalFrames),
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
        animation: { entrance: "none", entranceDuration: 0 },
      };
      pushState([newLayer, ...layers]);
      setSelectedLayerId(newLayer.id);
      toast.success(`Added: ${data.title}`);
    },
    [currentFrame, totalFrames, layers, pushState, FPS]
  );
  const handleVEOGenerate = useCallback(
    (data: { videoUrl: string; prompt: string; duration: number }) => {
      const newLayer: VideoLayer = {
        id: generateId(),
        type: "video",
        name: `VEO: ${data.prompt.substring(0, 30)}...`,
        visible: true,
        locked: false,
        startFrame: currentFrame,
        endFrame: Math.min(
          currentFrame + Math.round(data.duration * FPS),
          totalFrames
        ),
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
        animation: { entrance: "fade", entranceDuration: 30 },
      };
      pushState([newLayer, ...layers]);
      setSelectedLayerId(newLayer.id);
      toast.success("VEO video generated");
    },
    [currentFrame, totalFrames, layers, pushState, FPS]
  );

  const selectLayerAndCloseTab = useCallback((layerId: string | null) => {
    setSelectedLayerId(layerId);
    if (layerId) setActiveTab(null);
  }, []);
  const handleAddText = useCallback(() => {
    addTextLayer();
  }, [addTextLayer]);

  const addMediaToCanvas = useCallback(
    (media: any) => {
      // ✨ ADD: Log what we're adding
      console.log("🎨 addMediaToCanvas called with:", {
        name: media.name,
        type: media.type,
        isGif: media.isGif,
        hasUrl: !!media.url,
        url: media.url,
      });

      const mediaSource =
        media.type === "image" ||
        media.type === "video" ||
        media.type === "audio"
          ? media.url
          : media.data;
      if (!mediaSource) {
        toast.error("No source URL found");
        return;
      }
      const newId = generateId();
      let newLayer: any;
      if (media.type?.startsWith("image")) {
        // ✨ ADD: Detect if it's a GIF
        const isGif = media.isGif || mediaSource.toLowerCase().endsWith(".gif");
        console.log(
          `🖼️ Creating image layer (${isGif ? "GIF" : "static image"}):`,
          media.name
        );

        newLayer = {
          id: newId,
          type: "image",
          name: media.name || (isGif ? "GIF" : "Image"), // ✨ Better naming
          // ... rest of layer properties
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
      } else if (media.type?.startsWith("video")) {
        newLayer = {
          id: newId,
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
          animation: { entrance: "fade", entranceDuration: 30 },
        };
      } else if (media.type?.startsWith("audio")) {
        newLayer = {
          id: newId,
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
      }
      if (newLayer) {
        // ✅ Keep it simple - this is for single file operations only
        pushState([...(layers || []), newLayer]);
        selectLayerAndCloseTab(newLayer.id);
        toast.success(`Added ${media.name}`);
      }
    },
    [currentFrame, totalFrames, layers, pushState, selectLayerAndCloseTab]
  );

  // Replace your handleMediaConfirm function with this version:

  const handleMediaConfirm = useCallback(
    (mediaOrArray: any) => {
      console.log("📥 handleMediaConfirm called", {
        mediaOrArray,
        isArray: Array.isArray(mediaOrArray),
        replacingLayerId,
        replacingLayerType,
      });

      // Handle single media (replace mode)
      if (!Array.isArray(mediaOrArray)) {
        const media = mediaOrArray;

        // Handle replace mode
        if (media.replaceMode && replacingLayerId) {
          const mediaSource = media.url || media.data;
          if (!mediaSource) {
            toast.error("No source URL found");
            return;
          }

          updateLayer(replacingLayerId, { src: mediaSource } as Partial<Layer>);
          toast.success(`${replacingLayerType} replaced successfully`);
          setReplacingLayerId(null);
          setReplacingLayerType(null);
          setIsMediaGalleryOpen(false);
          return;
        }

        // Single file add
        addMediaToCanvas(media);
        setProjectAssets((prev) => {
          const exists = prev.find(
            (p) => p.name === media.name && p.type === media.type
          );
          if (exists) return prev;
          return [...prev, media];
        });
        setIsMediaGalleryOpen(false);
        return;
      }

      // Handle multiple files (array)
      const mediaArray = mediaOrArray;
      console.log("📦 Processing multiple files:", mediaArray.length);
      console.log("📦 Current layers count:", layers.length);

      // Create all layers at once with offset positions
      const newLayers: Layer[] = [];

      mediaArray.forEach((media, index) => {
        const mediaSource =
          media.type === "image" ||
          media.type === "video" ||
          media.type === "audio"
            ? media.url
            : media.data;

        if (!mediaSource) {
          console.warn("⚠️ Skipping file with no source:", media.name);
          return;
        }

        const newId = generateId();

        // Calculate offset position for each layer
        const offsetX = 50 + index * 5;
        const offsetY = 50 + index * 5;

        let newLayer: any;

        if (media.type?.startsWith("image")) {
          newLayer = {
            id: newId,
            type: "image",
            name: media.name || "Image",
            visible: true,
            locked: false,
            startFrame: currentFrame,
            endFrame: Math.min(currentFrame + 300, totalFrames),
            position: { x: offsetX, y: offsetY },
            size: { width: 40, height: 25 },
            rotation: 0,
            opacity: 1,
            src: mediaSource,
            isBackground: false,
            objectFit: "contain",
            filter: "none",
            animation: { entrance: "fade", entranceDuration: 30 },
          };
        } else if (media.type?.startsWith("video")) {
          newLayer = {
            id: newId,
            type: "video",
            name: media.name || "Video",
            visible: true,
            locked: false,
            startFrame: currentFrame,
            endFrame: Math.min(currentFrame + 300, totalFrames),
            position: { x: offsetX, y: offsetY },
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
            animation: { entrance: "fade", entranceDuration: 30 },
          };
        } else if (media.type?.startsWith("audio")) {
          newLayer = {
            id: newId,
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
        }

        if (newLayer) {
          console.log(
            `✅ Created layer ${index + 1}:`,
            newLayer.name,
            newLayer.id
          );
          newLayers.push(newLayer);
        }
      });

      console.log("📊 Total new layers created:", newLayers.length);
      console.log(
        "📊 Layer IDs:",
        newLayers.map((l) => l.id)
      );

      // Add all layers at once
      if (newLayers.length > 0) {
        const currentLayers = layers || [];
        const combinedLayers = [...currentLayers, ...newLayers];

        console.log(
          "🔄 Pushing state with",
          combinedLayers.length,
          "total layers"
        );
        console.log(
          "🔄 Before:",
          currentLayers.length,
          "After:",
          combinedLayers.length
        );

        pushState(combinedLayers);

        // Select the last added layer
        selectLayerAndCloseTab(newLayers[newLayers.length - 1].id);
        toast.success(
          `Added ${newLayers.length} ${
            newLayers.length === 1 ? "item" : "items"
          }`
        );
      } else {
        console.error("❌ No layers were created!");
      }

      // Add all to project assets
      setProjectAssets((prev) => {
        const newAssets = mediaArray.filter(
          (media) =>
            !prev.find((p) => p.name === media.name && p.type === media.type)
        );
        console.log(
          "💾 Adding to project assets:",
          newAssets.length,
          "new items"
        );
        return [...prev, ...newAssets];
      });

      setIsMediaGalleryOpen(false);
    },
    [
      addMediaToCanvas,
      replacingLayerId,
      replacingLayerType,
      updateLayer,
      layers,
      currentFrame,
      totalFrames,
      pushState,
      selectLayerAndCloseTab,
    ]
  );

  const openMediaGallery = useCallback(
    (
      tab: string,
      replaceLayerId?: string,
      replaceType?: "image" | "video" | "audio"
    ) => {
      console.log("🔄 openMediaGallery", { tab, replaceLayerId, replaceType });

      if (replaceLayerId && replaceType) {
        setReplacingLayerId(replaceLayerId);
        setReplacingLayerType(replaceType);
      } else {
        setReplacingLayerId(null);
        setReplacingLayerType(null);
      }

      setMediaGalleryActiveTab(tab as any);
      setIsMediaGalleryOpen(true);
    },
    []
  );

  // ==========================================
  // TIMELINE TRACKS (Reversed Logic)
  // ==========================================
  const timelineTracks = useMemo(
    (): TimelineTrack[] =>
      layers
        ? [...layers].reverse().map((layer) => ({
            id: layer.id,
            name: layer.name,
            type: layer.type as any,
            label: layer.name,
            startFrame: layer.startFrame,
            endFrame: layer.endFrame,
            color: LAYER_COLORS[layer.type] || "#888",
            visible: layer.visible,
            locked: layer.locked,
          }))
        : [],
    [layers]
  );

  const handleTrackSelect = useCallback(
    (trackId: string | null) => {
      selectLayerAndCloseTab(trackId);
      setEditingLayerId(null);
    },
    [selectLayerAndCloseTab]
  );

  const handleReorderTracks = useCallback(
    (fromIndex: number, toIndex: number) => {
      // Timeline displays in reverse, so convert indices
      const actualFromIndex = layers.length - 1 - fromIndex;
      const actualToIndex = layers.length - 1 - toIndex;

      // Use the validated reorderLayers function
      reorderLayers(actualFromIndex, actualToIndex);
    },
    [layers, reorderLayers]
  );

  const handleTracksChange = useCallback(
    (updatedTracks: TimelineTrack[]) => {
      if (!layers) return;
      const newLayers = layers.map((layer) => {
        const track = updatedTracks.find((t) => t.id === layer.id);
        if (track)
          return {
            ...layer,
            startFrame: track.startFrame,
            endFrame: track.endFrame,
            visible:
              track.visible !== undefined ? track.visible : layer.visible,
            locked: track.locked !== undefined ? track.locked : layer.locked,
          };
        return layer;
      });
      pushState(newLayers);
    },
    [layers, pushState]
  );

  const handleFrameChange = useCallback((frame: number) => {
    setCurrentFrame(frame);
    if (previewRef.current) previewRef.current.seekTo(frame);
  }, []);
  const togglePlayback = useCallback(() => {
    if (isPlaying) previewRef.current?.pause();
    else previewRef.current?.play();
    setIsPlaying(!isPlaying);
  }, [isPlaying]);
  const handlePreviewFrameUpdate = useCallback(
    (frame: number) => setCurrentFrame(frame),
    []
  );

  // --- PROCESSING LAYERS FOR TEMPLATE 8 (KEN BURNS / BLUR STYLE) ---
  const getProcessedLayers = useCallback(
    (currentLayers: Layer[]) => {
      if (template?.id === 8) {
        const processed: Layer[] = [];
        const contentLayers = currentLayers.filter(
          (l) => !(l as any).isBackground
        );

        contentLayers.forEach((layer) => {
          if (layer.type !== "video" && layer.type !== "image") {
            processed.push(layer);
            return;
          }

          if (carouselLayout === "cinema") {
            const bgLayer = {
              ...layer,
              id: `bg-${layer.id}`,
              name: `${layer.name} (BG)`,
              isBackground: false,
              position: { x: 50, y: 50 },
              size: { width: 100, height: 100 },
              opacity: 1,
              rotation: 0,
              filter: "blur(20px) brightness(0.7)",
              animation: { entrance: "slideLeft", entranceDuration: 30 },
              volume: 0,
              objectFit: "cover",
            };
            processed.push(bgLayer as Layer);

            const fgLayer = {
              ...layer,
              size: { width: 85, height: 65 },
              objectFit: "cover",
              animation: {
                ...layer.animation,
                entrance: "slideLeft",
                entranceDuration: 30,
              },
              filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.3))",
            };
            processed.push(fgLayer as Layer);
          } else {
            const fullLayer = {
              ...layer,
              size: { width: 100, height: 100 },
              objectFit: "cover",
              position: { x: 50, y: 50 },
              animation: {
                ...layer.animation,
                entrance: "slideLeft",
                entranceDuration: 30,
              },
            };
            processed.push(fullLayer as Layer);
          }
        });
        return processed;
      }
      return currentLayers;
    },
    [template, carouselLayout]
  );

  const processedLayers = useMemo(
    () => getProcessedLayers(layers),
    [layers, getProcessedLayers]
  );

  const handleExport = useCallback(
    async (format: string = "mp4") => {
      setIsExporting(true);
      try {
        const layersToRender = getProcessedLayers(layers);
        const inputProps = {
          config: {
            layers: layersToRender,
          },
        };
        const videoUrl = await renderVideoUsingLambda(
          inputProps,
          template?.id as number,
          format
        );
        setExportUrl(videoUrl);
        toast.success("Video exported!");
      } catch (error) {
        console.error(error);
        toast.error("Export failed");
      } finally {
        setIsExporting(false);
      }
    },
    [layers, template, getProcessedLayers]
  );

  async function handleSaveExistingProject() {
    if (projectId) {
      setIsPorjectSaving(true);
      const props = {
        layers,
        duration,
        currentFrame,
        templateId: template?.id || 1,
      };
      const changedprops = await compareProjectProps(projectId, props);
      console.log(changedprops);
      if (changedprops === true) {
        toast.success("Nothing to save. Make some changes before saving");
      } else {
        const saveresponse = await saveExistingProject(projectId, props, screenshot as string);
        if (saveresponse === "error") {
          toast.error("There was an error saving your project");
        } else {
          toast.success("Changes saved!");
        }
      }
    }
    setIsPorjectSaving(false);
  }

  const handleSaveProject = useCallback(
    async (
      title: string,
      setStatus: (s: string) => void,
      screenshot: string
    ) => {
      setStatus("Saving...");
      try {
        const savedProjectId = (await saveNewProject(
          title,
          setStatus,
          screenshot
        )) as unknown as string;
        if (savedProjectId && !projectId) {
          setProjectId(savedProjectId);
          navigate(`/editor?project=${savedProjectId}`, { replace: true });
        }
      } catch (error) {
        setStatus("Error");
        toast.error("Save failed");
      }
    },
    [saveNewProject, projectId, navigate]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isEditingText =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true" ||
        editingLayerId !== null;
      if ((e.ctrlKey || e.metaKey) && e.key === "c" && selectedLayerId) {
        const layer = layers.find((l) => l.id === selectedLayerId);
        if (layer) setCopiedLayer(layer);
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
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedLayerId &&
        !isEditingText
      ) {
        e.preventDefault();
        const layer = layers.find((l) => l.id === selectedLayerId);
        if (layer && !layer.locked) deleteLayer(selectedLayerId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedLayerId,
    copiedLayer,
    deleteLayer,
    layers,
    pushState,
    editingLayerId,
  ]);

  const previewInputProps = useMemo(
    () => ({
      layers: processedLayers, // Use processed layers for preview
      currentFrame,
      editingLayerId,
      templateId: template?.id,
      ...(template?.layersToProps
        ? template.layersToProps(processedLayers)
        : {}),
      _forceUpdate: Date.now(),
    }),
    [template, processedLayers, currentFrame, editingLayerId]
  );

  // Helper ToolCard
  const ToolCard = ({
    icon,
    title,
    onClick,
    color,
  }: {
    icon: React.ReactNode;
    title: string;
    onClick: () => void;
    color: string;
  }) => (
    <div
      style={gridStyles.card}
      onClick={onClick}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = colors.bgHover;
        e.currentTarget.style.borderColor = colors.borderLight;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = colors.bgSecondary;
        e.currentTarget.style.borderColor = colors.border;
      }}
    >
      <div style={{ marginBottom: "4px", color }}>{icon}</div>
      <div style={gridStyles.cardTitle}>{title}</div>
    </div>
  );

  // Helper Compact Card
  const CompactCard = ({
    icon,
    title,
    onClick,
    color,
  }: {
    icon: React.ReactNode;
    title: string;
    onClick: () => void;
    color: string;
  }) => (
    <div
      style={gridStyles.compactCard}
      onClick={onClick}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = colors.bgHover;
        e.currentTarget.style.borderColor = colors.borderLight;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = colors.bgSecondary;
        e.currentTarget.style.borderColor = colors.border;
      }}
    >
      <div style={{ color }}>{icon}</div>
      <div style={gridStyles.cardTitle}>{title}</div>
    </div>
  );

  return (
    <>
      <div
        style={{
          ...editorStyles.container,
          backgroundColor: colors.bgPrimary,
        }}
      >
        {isLoading && <LoadingOverlay message="Loading project..." />}

        {/* --- LEFT SIDEBAR --- */}
        <SidebarTabs
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            // setSelectedLayerId(null);
            setWatchCategory("main");
          }}
          onPanelToggle={() => {}}
          templateId={template?.id}
        />

        {/* --- LAYERS PANEL --- */}
        <div
          style={{
            ...editorStyles.layersPanel,
            backgroundColor: colors.bgPrimary,
            // ← ADD THIS LINE
            zIndex: 50, // ← Ensure this is set
            pointerEvents: "auto", // ← Allow clicks
            ...(isPanelOpen ? {} : editorStyles.layersPanelClosed),
          }}
          data-panel="true"
        >
          {isPanelOpen && (
            <>
              <div
                style={{
                  ...editorStyles.layersPanelHeader,
                  backgroundColor: colors.bgSecondary,
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                {activeTab === "watch" && watchCategory !== "main" ? (
                  <button
                    onClick={() => setWatchCategory("main")}
                    style={{
                      background: "none",
                      border: "none",
                      color: colors.textSecondary,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Icons.ChevronLeft /> Back
                  </button>
                ) : (
                  <span
                    style={{
                      ...editorStyles.layersPanelTitle,
                      color: colors.textPrimary,
                    }}
                  >
                    {activeTab === "chat"
                      ? "Chat Settings"
                      : activeTab === "watch"
                      ? "Showcase"
                      : activeTab === "carousel"
                      ? "Blur Style"
                      : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </span>
                )}
                <button
                  style={{
                    ...editorStyles.closeButton,
                    color: colors.textMuted,
                  }}
                  onClick={() => setActiveTab(null)}
                >
                  <Icons.Close />
                </button>
              </div>

              {/* Standard Media Library */}
              {activeTab !== "tools" &&
                activeTab !== "layout" &&
                activeTab !== "chat" &&
                activeTab !== "watch" &&
                activeTab !== "carousel" && (
                  <MediaLibrary
                    activeTab={activeTab as any}
                    projectAssets={projectAssets}
                    onAddLayer={addMediaToCanvas}
                    onOpenGallery={openMediaGallery}
                    onAddText={handleAddText}
                    currentFrame={currentFrame}
                    totalFrames={totalFrames}
                  />
                )}

              {/* --- CHAT PANEL (Dedicated Tab) --- */}
              {activeTab === "chat" && template?.id === 9 && (
                <div style={gridStyles.container}>
                  {/* Style Switcher */}
                  <div style={gridStyles.section}>
                    <div style={gridStyles.sectionTitle}>Interface Style</div>
                    <div style={gridStyles.grid}>
                      <ToolCard
                        icon={<Icons.Chat />}
                        title="Instagram"
                        color="#E1306C"
                        onClick={() => handleChatStyleChange("instagram")}
                      />
                      <ToolCard
                        icon={<span style={{ fontSize: "18px" }}>💬</span>}
                        title="iMessage"
                        color="#007AFF"
                        onClick={() => handleChatStyleChange("imessage")}
                      />
                      <ToolCard
                        icon={<span style={{ fontSize: "18px" }}>📞</span>}
                        title="WhatsApp"
                        color="#25D366"
                        onClick={() => handleChatStyleChange("whatsapp")}
                      />
                      <ToolCard
                        icon={<span style={{ fontSize: "18px" }}>⚡</span>}
                        title="Messenger"
                        color="#0084FF"
                        onClick={() => handleChatStyleChange("messenger")}
                      />
                      <ToolCard
                        icon={<span style={{ fontSize: "18px" }}>🎬</span>}
                        title="Cinematic"
                        color="#0EA5E9"
                        onClick={() => handleChatStyleChange("fakechatconversation")}
                      />
                    </div>
                  </div>

                  {/* Chat Partner Info */}
                  <div style={gridStyles.section}>
                    <div style={gridStyles.sectionTitle}>Chat Partner</div>
                    <input
                      type="text"
                      placeholder="Partner Name (e.g. John)"
                      value={chatPartnerName}
                      onChange={(e) => handleUpdateChatPartner(e.target.value)}
                      style={gridStyles.sleekInput}
                    />
                    <div
                      style={gridStyles.card}
                      onClick={() => chatAvatarInputRef.current?.click()}
                    >
                      <Icons.User />
                      <span style={gridStyles.cardTitle}>Change Avatar</span>
                    </div>
                  </div>

                  {/* Message Actions */}
                  <div style={gridStyles.section}>
                    <div style={gridStyles.sectionTitle}>Add Messages</div>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddMessage(true)
                      } // Default to Me on Enter
                      style={gridStyles.sleekInput}
                    />
                    <div style={gridStyles.grid}>
                      <ToolCard
                        icon={<Icons.Send />}
                        title="Add (Me)"
                        color="#3b82f6"
                        onClick={() => handleAddMessage(true)}
                      />
                      <ToolCard
                        icon={<Icons.Chat />}
                        title="Add (Them)"
                        color="#10b981"
                        onClick={() => handleAddMessage(false)}
                      />
                      <ToolCard
                        icon={<span style={{ fontSize: "18px" }}>...</span>}
                        title="Typing"
                        color="#888"
                        onClick={() => handleAddMessage(false, true)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* --- WATCH PANEL --- */}
              {activeTab === "watch" && template?.id === 30 && (
                <div style={gridStyles.container}>
                  {watchCategory === "main" ? (
                    <>
                      <div style={gridStyles.section}>
                        <div style={gridStyles.sectionTitle}>Details</div>
                        <input
                          type="text"
                          placeholder="Watch Name (e.g. ROLEX)"
                          value={watchNameInput}
                          onChange={(e) => {
                            setWatchNameInput(e.target.value);
                            handleUpdateWatchText("name", e.target.value);
                          }}
                          style={gridStyles.sleekInput}
                        />
                        <textarea
                          placeholder="Viral caption..."
                          value={captionInput}
                          onChange={(e) => {
                            setCaptionInput(e.target.value);
                            handleUpdateWatchText("caption", e.target.value);
                          }}
                          style={{
                            ...gridStyles.sleekInput,
                            minHeight: "60px",
                            resize: "vertical",
                          }}
                        />
                      </div>
                      <div style={gridStyles.section}>
                        <div style={gridStyles.sectionTitle}>Select Assets</div>
                        <div
                          style={{
                            ...gridStyles.grid,
                            gridTemplateColumns: "repeat(3, 1fr)",
                          }}
                        >
                          <CompactCard
                            icon={<Icons.Watch />}
                            title="Watches"
                            color="#fbbf24"
                            onClick={() => setWatchCategory("watches")}
                          />
                          <CompactCard
                            icon={<Icons.Video />}
                            title="Videos"
                            color="#60a5fa"
                            onClick={() => setWatchCategory("videos")}
                          />
                          <CompactCard
                            icon={<Icons.Music />}
                            title="Music"
                            color="#c084fc"
                            onClick={() => setWatchCategory("music")}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={gridStyles.section}>
                      <div style={gridStyles.sectionTitle}>
                        Select {watchCategory}
                      </div>
                      <div style={gridStyles.grid}>
                        {CloudinaryAssets[watchCategory]?.map((asset: any) => (
                          <div
                            key={asset.id}
                            style={{
                              ...gridStyles.card,
                              height: "110px",
                              padding: "0",
                              overflow: "hidden",
                            }}
                            onClick={() =>
                              handleSelectWatchAsset(
                                asset.src,
                                watchCategory === "watches"
                                  ? "image"
                                  : watchCategory === "videos"
                                  ? "video"
                                  : "audio"
                              )
                            }
                          >
                            {watchCategory === "music" ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: "8px",
                                  color: colors.textPrimary,
                                }}
                              >
                                <Icons.Music />
                                <span
                                  style={{
                                    fontSize: "12px",
                                    color: colors.textSecondary,
                                  }}
                                >
                                  {asset.name}
                                </span>
                              </div>
                            ) : (
                              <>
                                <div
                                  style={{
                                    width: "100%",
                                    height: "80px",
                                    overflow: "hidden",
                                  }}
                                >
                                  {watchCategory === "videos" ? (
                                    <video
                                      src={asset.src}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                      muted
                                      loop
                                      onMouseOver={(e) =>
                                        e.currentTarget.play()
                                      }
                                      onMouseOut={(e) =>
                                        e.currentTarget.pause()
                                      }
                                    />
                                  ) : (
                                    <img
                                      src={asset.src}
                                      alt={asset.name}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  )}
                                </div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: colors.textSecondary,
                                    padding: "4px",
                                  }}
                                >
                                  {asset.name}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                        <div
                          style={{
                            ...gridStyles.card,
                            color: colors.textPrimary,
                          }}
                          onClick={() => {
                            if (watchCategory === "watches")
                              watchImageInputRef.current?.click();
                            else if (watchCategory === "videos")
                              watchBgInputRef.current?.click();
                            else if (watchCategory === "music")
                              watchAudioInputRef.current?.click();
                          }}
                        >
                          <Icons.Download />
                          <span
                            style={{
                              fontSize: "11px",
                              color: colors.textSecondary,
                            }}
                          >
                            Upload Custom
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* --- CAROUSEL / BLUR STYLE PANEL --- */}
              {activeTab === "carousel" && template?.id === 8 && (
                <div style={gridStyles.container}>
                  <div style={gridStyles.section}>
                    <div style={gridStyles.sectionTitle}>Choose Layout</div>
                    <div style={gridStyles.grid}>
                      <ToolCard
                        icon={<Icons.Video />}
                        title="Cinema"
                        color={carouselLayout === "cinema" ? "#3b82f6" : "#666"}
                        onClick={() => setCarouselLayout("cinema")}
                      />
                      <ToolCard
                        icon={<Icons.Image />}
                        title="Full Screen"
                        color={carouselLayout === "full" ? "#10b981" : "#666"}
                        onClick={() => setCarouselLayout("full")}
                      />
                    </div>
                  </div>

                  <div style={gridStyles.section}>
                    <div style={gridStyles.sectionTitle}>Media</div>
                    <div
                      style={gridStyles.card}
                      onClick={() => carouselInputRef.current?.click()}
                    >
                      <Icons.Download />
                      <span style={gridStyles.cardTitle}>Insert Photos</span>
                      <span
                        style={{ fontSize: "10px", color: colors.textMuted }}
                      >
                        Bulk Upload
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* --- PHOTO COLLAGE PANEL (TEMPLATE 19) --- */}
              {activeTab === "collage" && template?.id === 19 && (
                <CollagePanel
                  onLayoutSelect={handleCollageLayoutSelect}
                  selectedLayoutId={selectedCollageLayout?.id}
                />
              )}

              {/* Layout Panel */}
              {activeTab === "layout" && template?.id === 6 && (
                <div style={gridStyles.container}>
                  <div style={gridStyles.section}>
                    <div style={gridStyles.sectionTitle}>Choose Layout</div>
                    <div style={gridStyles.grid}>
                      <ToolCard
                        icon={<Icons.Layout />}
                        title="Split Screen"
                        color={layoutMode === "split" ? "#3b82f6" : "#666"}
                        onClick={() => handleLayoutChange("split")}
                      />
                      <ToolCard
                        icon={<Icons.Pip />}
                        title="Pic-in-Pic"
                        color={layoutMode === "pip" ? "#10b981" : "#666"}
                        onClick={() => handleLayoutChange("pip")}
                      />
                    </div>
                  </div>
                </div>
              )}

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
                      {/* <ToolCard
                        icon={<Icons.Shuffle />}
                        title="Remix Shorts"
                        color="#3b82f6"
                        onClick={() => setShowRemixShortsModal(true)}
                      /> */}
                      <ToolCard
                        icon={<Icons.Smile />}
                        title="Emoji"
                        color="#f59e0b"
                        onClick={() => setShowEmojiPickerModal(true)}
                      />
                      {/* <ToolCard
                        icon={<Icons.Download />}
                        title="YT Download"
                        color="#ef4444"
                        onClick={() => setShowYoutubeDownloaderModal(true)}
                      /> */}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* --- EDIT PANEL --- */}
        <div
          style={{
            ...editorStyles.editPanel,
            backgroundColor: colors.bgPrimary,
            zIndex: 50, // ← ADD THIS - Same as layers panel
            pointerEvents: showEditPanel && !isPanelOpen ? "auto" : "none", // ← ADD THIS
            ...(showEditPanel && !isPanelOpen
              ? {}
              : editorStyles.editPanelHidden),
          }}
        >
          {showEditPanel && (
            <>
              <div
                style={{
                  ...editorStyles.editPanelHeader,
                  backgroundColor: colors.bgSecondary,
                  borderBottom: `1px solid ${colors.border}`,
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    ...editorStyles.editPanelTitle,
                    color: colors.textPrimary,
                  }}
                >
                  {selectedTextLayer && "Edit Text"}
                  {selectedAudioLayer && "Edit Audio"}
                  {selectedVideoLayer && "Edit Video"}
                  {selectedImageLayer && "Edit Image"}
                </span>
                <button
                  style={editorStyles.backButton}
                  onClick={() => setSelectedLayerId(null)}
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
                  totalFrames={totalFrames}
                  onReplace={() =>
                    openMediaGallery("audio", selectedAudioLayer.id, "audio")
                  }
                />
              )}
              {selectedLayer && isImageLayer(selectedLayer) && (
                <ImageEditor
                  layer={selectedLayer}
                  totalFrames={totalFrames}
                  onUpdate={updateLayer}
                  onDelete={deleteLayer}
                  onReplace={() =>
                    openMediaGallery("media", selectedLayer.id, "image")
                  }
                />
              )}
              {selectedVideoLayer && (
                <VideoEditor
                  layer={selectedVideoLayer}
                  totalFrames={totalFrames}
                  onUpdate={updateLayer}
                  onDelete={deleteLayer}
                  onReplace={() =>
                    openMediaGallery("video", selectedVideoLayer.id, "video")
                  }
                />
              )}
            </>
          )}
        </div>

        {/* --- MAIN AREA --- */}
        <div
          style={{
            ...editorStyles.mainArea,
            backgroundColor: colors.bgPrimary,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
          ref={mainAreaRef}
        >
          <div
            style={{
              ...editorStyles.header,
              backgroundColor: colors.bgSecondary,
              borderBottom: `1px solid ${colors.border}`,
              height: "64px",
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{ ...editorStyles.headerTitle, color: colors.textPrimary }}
            >
              {projectTitle || template?.displayName || "Video Editor"}
            </span>
            <div style={editorStyles.headerButtonsRight}>
              <ThemeToggle />
              <button
                style={editorStyles.addButton}
                onClick={() => {
                  handleSaveThumbnail();
                  if (screenshot) {
                    if (projectId) {
                      handleSaveExistingProject();
                      // handleSaveProject();
                    } else {
                      setShowSaveModal(true);
                    }
                  } else {
                    toast.error("There was an error saving your project.\nTry again later.");
                  }
                }}
              >
                {isProjectSaving ? "Saving..." : "Save"}
              </button>
              <button
                style={{
                  ...editorStyles.exportButton,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "8px",
                }}
                onClick={() => setShowExportModal(true)}
              >
                <EditorIcons.Download /> Export
              </button>
            </div>
          </div>

          <div
            style={{
              ...editorStyles.previewArea,
              backgroundColor: colors.bgPrimary,
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              padding: "20px",
              minHeight: 0,
              position: "relative", // ← Important
              pointerEvents: "auto", // ← Allow clicks
            }}
            ref={previewContainerRef}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative", // ← Important
                pointerEvents: "none",
              }}
            >
              <div
                ref={remotionWrapperRef}
                style={{
                  position: "relative",
                  display: "inline-block",
                  pointerEvents: "auto",
                }}
              >
                <RemotionPreview
                  key={`preview-${layers.length}-${layers
                    .map((l) => l.id)
                    .join(",")}`}
                  ref={previewRef}
                  component={template?.composition || DynamicLayerComposition}
                  inputProps={previewInputProps}
                  durationInFrames={totalFrames}
                  fps={FPS}
                  onFrameUpdate={handlePreviewFrameUpdate}
                  onPlayingChange={(playing) => setIsPlaying(playing)}
                  containerWidth="100%"
                  containerHeight="100%"
                  phoneFrameWidth={`${previewDimensions.width}px`}
                  phoneFrameHeight={`${previewDimensions.height}px`}
                />

                {cropMode && selectedLayer && isImageLayer(selectedLayer) && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "auto", // ← Change from "none" to "auto" only when cropMode is active
                      zIndex: 1000, // ← Ensure it's on top
                    }}
                  >
                    <CropOverlay
                      layer={selectedLayer}
                      containerWidth={previewDimensions.width}
                      containerHeight={previewDimensions.height}
                      compositionWidth={1080}
                      compositionHeight={1920}
                      onCropChange={handleCropChange}
                      onCropComplete={handleCropComplete}
                    />
                  </div>
                )}

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
          </div>

          <div
            ref={verticalResizerRef}
            style={{
              height: "8px",
              backgroundColor: colors.bgSecondary,
              borderTop: `1px solid ${colors.borderLight}`,
              borderBottom: `1px solid ${colors.borderLight}`,
              cursor: "ns-resize",
              flexShrink: 0,
              zIndex: 5,
              transition: isResizingVertical ? 'none' : 'background-color 0.15s',
              boxShadow: isResizingVertical ? '0 0 10px rgba(59, 130, 246, 0.4)' : 'none',
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizingVertical(true);
            }}
            onMouseOver={(e) => {
              if (!isResizingVertical) e.currentTarget.style.backgroundColor = colors.bgHover;
            }}
            onMouseOut={(e) => {
              if (!isResizingVertical) e.currentTarget.style.backgroundColor = colors.bgSecondary;
            }}
          />

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
            data-timeline="true"
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            // 🎯 NEW: Pass the dynamic height
            height={`${timelineHeight}px`} 
          />
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        style={{ display: "none" }}
        onChange={handleAudioUpload}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        style={{ display: "none" }}
        onChange={(e) => {
          if (replacingVideoLayerId) {
            handleVideoReplaceUpload(e);
          } else {
            handleVideoUpload(e);
          }
        }}
      />
      <input
        ref={layoutFileRef}
        type="file"
        accept="image/*,video/*"
        style={{ display: "none" }}
        onChange={handleLayoutFileChange}
      />

      {/* Watch Template Inputs */}
      <input
        ref={watchImageInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleWatchFileChange(e, "watch-image", "image")}
      />
      <input
        ref={watchBgInputRef}
        type="file"
        accept="video/*"
        style={{ display: "none" }}
        onChange={(e) => handleWatchFileChange(e, "watch-bg", "video")}
      />
      <input
        ref={watchAudioInputRef}
        type="file"
        accept="audio/*"
        style={{ display: "none" }}
        onChange={(e) => handleWatchFileChange(e, "watch-audio", "audio")}
      />

      {/* Chat Template Inputs */}
      <input
        ref={chatAvatarInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChatAvatarUpload}
      />

      {/* Carousel Input */}
      <input
        ref={carouselInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        style={{ display: "none" }}
        onChange={handleCarouselUpload}
      />

      {/* Hidden container for video elements - CRITICAL for Magic Crop */}
      <div style={{ display: "none" }}>
        {layers
          .filter((l) => l.type === "video")
          .map((layer) => (
            <video
              key={layer.id}
              ref={(el) => {
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
          screenshot={screenshot as string}
        />
      )}
      {isMediaGalleryOpen && (
        <MediaGalleryModal
          isOpen={isMediaGalleryOpen}
          onClose={() => {
            setIsMediaGalleryOpen(false);
            setReplacingLayerId(null);
            setReplacingLayerType(null);
          }}
          onConfirm={handleMediaConfirm}
          activeTab={mediaGalleryActiveTab}
          replaceMode={!!replacingLayerId}
          replaceLayerId={replacingLayerId || undefined}
        />
      )}

      {/* Modals */}
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
                duration: Math.round(
                  (selectedVideoLayer.endFrame -
                    selectedVideoLayer.startFrame) /
                    FPS
                ),
                thumbnail: undefined,
              }
            : layers.find((l): l is VideoLayer => l.type === "video")
            ? {
                url: (
                  layers.find(
                    (l): l is VideoLayer => l.type === "video"
                  ) as VideoLayer
                ).src,
                duration: Math.round(
                  ((
                    layers.find(
                      (l): l is VideoLayer => l.type === "video"
                    ) as VideoLayer
                  ).endFrame -
                    (
                      layers.find(
                        (l): l is VideoLayer => l.type === "video"
                      ) as VideoLayer
                    ).startFrame) /
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
        currentImageUrl={selectedImageLayer?.src || selectedVideoLayer?.src}
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
