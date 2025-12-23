import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import toast from "react-hot-toast";

// ============================================================================
// TYPES
// ============================================================================

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  duration: number;
  file?: File;
  name?: string;
}

interface WizardState {
  // Media
  mediaItems: MediaItem[];
  
  // Layout
  layout: 'layout1' | 'layout2';
  
  // Timing
  defaultDuration: number;
  transitionDuration: number;
  
  // Audio
  backgroundMusicPath: string;
  musicVolume: number;
  
  // UI State
  draggedIndex: number | null;
  previewIndex: number;
  isPlaying: boolean;
  isTransitioning: boolean;
}

type WizardStep = "media" | "layout" | "audio";

// ============================================================================
// CONSTANTS
// ============================================================================

const STEPS: { id: WizardStep; label: string; icon: string }[] = [
  { id: "media", label: "Photos", icon: "🖼️" },
  { id: "layout", label: "Layout", icon: "📐" },
  { id: "audio", label: "Audio", icon: "🎵" },
];

const PRESET_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&q=80', label: 'Mountains' },
  { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1080&q=80', label: 'Nature' },
  { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1080&q=80', label: 'Foggy Hills' },
  { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1080&q=80', label: 'Valley' },
  { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080&q=80', label: 'Forest' },
  { src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1080&q=80', label: 'Ocean' },
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&q=80', label: 'Beach' },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1080&q=80', label: 'Starry Night' },
];

const TRANSITION_SPEEDS = [
  { value: 10, label: "Fast" },
  { value: 15, label: "Normal" },
  { value: 25, label: "Slow" },
];

const BACKGROUND_MUSIC = [
  { value: "", label: "None", icon: "🔇" },
  { value: "/audio/ambient-piano.mp3", label: "Ambient Piano", icon: "🎹" },
  { value: "/audio/cinematic.mp3", label: "Cinematic", icon: "🎬" },
  { value: "/audio/uplifting.mp3", label: "Uplifting", icon: "✨" },
  { value: "/audio/emotional.mp3", label: "Emotional", icon: "💫" },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

// ============================================================================
// COMPONENT
// ============================================================================

const KenBurnsWizard: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const isDark = colors.bgPrimary !== "#ffffff";
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [currentStep, setCurrentStep] = useState<WizardStep>("media");
  const [state, setState] = useState<WizardState>({
    mediaItems: [],
    layout: 'layout2',
    defaultDuration: 3,
    transitionDuration: 15,
    backgroundMusicPath: "",
    musicVolume: 0.3,
    draggedIndex: null,
    previewIndex: 0,
    isPlaying: false,
    isTransitioning: false,
  });

  const updateState = useCallback((updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newItems: MediaItem[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (!isVideo && !isImage) {
        toast.error(`${file.name} is not a valid image or video`);
        continue;
      }

      newItems.push({
        id: generateId(),
        type: isVideo ? 'video' : 'image',
        src: URL.createObjectURL(file),
        duration: state.defaultDuration,
        file,
        name: file.name,
      });
    }

    updateState({ mediaItems: [...state.mediaItems, ...newItems] });
    toast.success(`Added ${newItems.length} item(s)`);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddPreset = (preset: typeof PRESET_IMAGES[0]) => {
    const isAdded = state.mediaItems.some(item => item.src === preset.src);
    if (isAdded) {
      toast.error("Already added");
      return;
    }

    updateState({
      mediaItems: [...state.mediaItems, {
        id: generateId(),
        type: 'image',
        src: preset.src,
        duration: state.defaultDuration,
        name: preset.label,
      }],
    });
    toast.success(`Added ${preset.label}`);
  };

  const handleRemoveItem = (id: string) => {
    updateState({
      mediaItems: state.mediaItems.filter(item => item.id !== id),
      previewIndex: Math.max(0, state.previewIndex - 1),
    });
  };

  const handleUpdateDuration = (id: string, duration: number) => {
    updateState({
      mediaItems: state.mediaItems.map(item =>
        item.id === id ? { ...item, duration } : item
      ),
    });
  };

  const handleApplyDurationToAll = () => {
    updateState({
      mediaItems: state.mediaItems.map(item => ({
        ...item,
        duration: state.defaultDuration,
      })),
    });
    toast.success(`Applied ${state.defaultDuration}s to all slides`);
  };

  const handleDragStart = (index: number) => {
    updateState({ draggedIndex: index });
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (state.draggedIndex === null || state.draggedIndex === index) return;

    const newItems = [...state.mediaItems];
    const draggedItem = newItems[state.draggedIndex];
    newItems.splice(state.draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    updateState({ mediaItems: newItems, draggedIndex: index });
  };

  const handleDragEnd = () => {
    updateState({ draggedIndex: null });
  };

  const getTotalDuration = () => {
    return state.mediaItems.reduce((acc, item) => acc + item.duration, 0);
  };

  // Preview auto-play with per-slide duration and transitions
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get transition duration in milliseconds based on frames (at 30fps)
  const getTransitionMs = useCallback(() => {
    // transitionDuration is in frames (10, 15, or 25)
    return (state.transitionDuration / 30) * 1000;
  }, [state.transitionDuration]);

  // Advance to next slide with fade transition
  const advanceSlide = useCallback((direction: 'next' | 'prev' = 'next') => {
    if (state.mediaItems.length <= 1) return;
    
    const transitionMs = getTransitionMs();
    
    // Start fade out
    setState(prev => ({ ...prev, isTransitioning: true }));
    
    // After fade out, change slide and fade in
    transitionTimeoutRef.current = setTimeout(() => {
      setState(prev => {
        const newIndex = direction === 'next'
          ? (prev.previewIndex + 1) % prev.mediaItems.length
          : (prev.previewIndex - 1 + prev.mediaItems.length) % prev.mediaItems.length;
        return { ...prev, previewIndex: newIndex, isTransitioning: false };
      });
    }, transitionMs);
  }, [state.mediaItems.length, getTransitionMs]);

  // Toggle play/pause with proper slide timing
  const togglePreviewPlay = useCallback(() => {
    if (state.isPlaying) {
      // Stop playing
      if (previewIntervalRef.current) {
        clearInterval(previewIntervalRef.current);
        previewIntervalRef.current = null;
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
      updateState({ isPlaying: false, isTransitioning: false });
    } else {
      // Start playing
      updateState({ isPlaying: true });
      
      // Schedule first advance based on current slide's duration
      const scheduleNextSlide = () => {
        setState(prev => {
          const currentSlide = prev.mediaItems[prev.previewIndex];
          const slideDuration = (currentSlide?.duration || prev.defaultDuration) * 1000;
          const transitionMs = (prev.transitionDuration / 30) * 1000;
          
          // Clear existing interval
          if (previewIntervalRef.current) {
            clearInterval(previewIntervalRef.current);
          }
          
          // Set timeout for this slide's duration
          previewIntervalRef.current = setTimeout(() => {
            // Start transition
            setState(p => ({ ...p, isTransitioning: true }));
            
            // After transition, change slide
            setTimeout(() => {
              setState(p => ({
                ...p,
                previewIndex: (p.previewIndex + 1) % Math.max(1, p.mediaItems.length),
                isTransitioning: false,
              }));
              // Schedule next slide if still playing
              if (previewIntervalRef.current) {
                scheduleNextSlide();
              }
            }, transitionMs);
          }, slideDuration - transitionMs) as unknown as NodeJS.Timeout;
          
          return prev;
        });
      };
      
      scheduleNextSlide();
    }
  }, [state.isPlaying, updateState]);

  // Manual prev/next with transitions
  const goToPrevSlide = useCallback(() => {
    if (state.mediaItems.length <= 1 || state.isTransitioning) return;
    advanceSlide('prev');
  }, [state.mediaItems.length, state.isTransitioning, advanceSlide]);

  const goToNextSlide = useCallback(() => {
    if (state.mediaItems.length <= 1 || state.isTransitioning) return;
    advanceSlide('next');
  }, [state.mediaItems.length, state.isTransitioning, advanceSlide]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (previewIntervalRef.current) {
        clearTimeout(previewIntervalRef.current);
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  const canProceed = useCallback(() => {
    if (currentStep === "media") return state.mediaItems.length > 0;
    return true;
  }, [currentStep, state.mediaItems.length]);

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const proceedToEditor = () => {
    if (state.mediaItems.length === 0) {
      toast.error('Please add at least one photo');
      return;
    }

    const config = {
      sequence: state.mediaItems.map(item => ({
        id: item.id,
        type: item.type,
        src: item.src,
        duration: item.duration,
      })),
      layout: state.layout,
      transitionDuration: state.transitionDuration,
      audio: {
        backgroundMusicPath: state.backgroundMusicPath,
        musicVolume: state.musicVolume,
      },
    };

    console.log("📦 Saving Ken Burns config:", config);
    sessionStorage.setItem("kenBurnsConfig", JSON.stringify(config));

    // Clear persisted state
    localStorage.removeItem('editor_state_template_8');
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.includes('template_8') || key.includes('template-8'))) {
        localStorage.removeItem(key);
      }
    }

    navigate("/editor?template=8&fromWizard=true");
  };

  // ============================================================================
  // STYLES
  // ============================================================================

  const styles: Record<string, React.CSSProperties> = {
    container: {
      height: "100vh",
      maxHeight: "100vh",
      backgroundColor: isDark ? "#0a0a0b" : "#f8f9fa",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 24px",
      borderBottom: `1px solid ${isDark ? "#1f1f23" : "#e5e7eb"}`,
      backgroundColor: isDark ? "#111113" : "#ffffff",
      flexShrink: 0,
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 16,
      fontWeight: 700,
      color: colors.textPrimary,
      cursor: "pointer",
    },
    stepNav: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      backgroundColor: isDark ? "#1a1a1d" : "#f3f4f6",
      padding: 3,
      borderRadius: 10,
    },
    stepPill: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "6px 12px",
      borderRadius: 7,
      fontSize: 12,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s",
      border: "none",
      background: "transparent",
      color: colors.textSecondary,
    },
    stepPillActive: {
      backgroundColor: isDark ? "#2d2d30" : "#ffffff",
      color: colors.textPrimary,
      boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.08)",
    },
    headerActions: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    btnSecondary: {
      padding: "8px 16px",
      backgroundColor: "transparent",
      border: `1px solid ${isDark ? "#333" : "#e5e7eb"}`,
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 500,
      color: colors.textPrimary,
      cursor: "pointer",
    },
    btnPrimary: {
      padding: "8px 20px",
      background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
      border: "none",
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 600,
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 6,
    },
    main: {
      flex: 1,
      display: "flex",
      maxWidth: 1400,
      margin: "0 auto",
      width: "100%",
      padding: "20px 32px",
      gap: 24,
      overflow: "hidden",
      minHeight: 0,
    },
    previewPanel: {
      width: 300,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      overflow: "hidden",
    },
    phoneFrame: {
      width: 240,
      aspectRatio: "9/16",
      maxHeight: "calc(100vh - 160px)",
      backgroundColor: "#000",
      borderRadius: 28,
      padding: 8,
      boxShadow: isDark 
        ? "0 20px 50px rgba(0,0,0,0.6), inset 0 0 0 2px #333"
        : "0 20px 50px rgba(0,0,0,0.2), inset 0 0 0 2px #e5e7eb",
      position: "relative",
      overflow: "hidden",
    },
    phoneScreen: {
      width: "100%",
      height: "100%",
      borderRadius: 20,
      overflow: "hidden",
      position: "relative",
      backgroundColor: "#0a0a0a",
    },
    previewLabel: {
      fontSize: 11,
      fontWeight: 600,
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
    previewControls: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginTop: 12,
    },
    previewBtn: {
      width: 40,
      height: 40,
      backgroundColor: "#8B5CF6",
      border: "none",
      borderRadius: "50%",
      fontSize: 14,
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(139, 92, 246, 0.4)",
    },
    previewNav: {
      width: 32,
      height: 32,
      backgroundColor: isDark ? "#2d2d30" : "#e5e7eb",
      border: "none",
      borderRadius: "50%",
      cursor: "pointer",
      color: colors.textPrimary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
    },
    // Middle column - uploads/slides
    uploadsPanel: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      overflowY: "auto",
      overflowX: "hidden",
    },
    // Right column - presets
    presetsPanel: {
      width: 320,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      overflowY: "auto",
      overflowX: "hidden",
    },
    controlsPanel: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      overflowX: "hidden",
      paddingRight: 8,
    },
    card: {
      backgroundColor: isDark ? "#141416" : "#ffffff",
      borderRadius: 12,
      border: `1px solid ${isDark ? "#1f1f23" : "#e5e7eb"}`,
      padding: 16,
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: 600,
      color: colors.textPrimary,
      marginBottom: 14,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    label: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 10,
      fontWeight: 500,
      color: colors.textSecondary,
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: "0.03em",
    },
    labelValue: {
      color: "#8B5CF6",
      fontWeight: 600,
    },
    pillGroup: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
    },
    pill: {
      padding: "6px 12px",
      backgroundColor: isDark ? "#1a1a1d" : "#f3f4f6",
      border: `1px solid ${isDark ? "#2d2d30" : "#e5e7eb"}`,
      borderRadius: 16,
      fontSize: 12,
      fontWeight: 500,
      color: colors.textSecondary,
      cursor: "pointer",
      transition: "all 0.2s",
    },
    pillActive: {
      backgroundColor: "#8B5CF6",
      borderColor: "#8B5CF6",
      color: "#fff",
    },
    slider: {
      width: "100%",
      height: 4,
      borderRadius: 2,
      appearance: "none",
      background: isDark ? "#2d2d30" : "#e5e7eb",
      outline: "none",
      cursor: "pointer",
    },
    sliderRow: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    sliderValue: {
      fontSize: 12,
      fontWeight: 600,
      color: colors.textPrimary,
      minWidth: 40,
      textAlign: "right",
    },
    uploadZone: {
      border: `2px dashed ${isDark ? "#333" : "#d1d5db"}`,
      borderRadius: 8,
      padding: "12px 10px",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.2s",
      backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
    },
    presetGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 6,
    },
    presetCard: {
      aspectRatio: "1",
      borderRadius: 8,
      overflow: "hidden",
      cursor: "pointer",
      position: "relative",
      border: "2px solid transparent",
      transition: "all 0.2s",
    },
    presetCardActive: {
      borderColor: "#8B5CF6",
    },
    presetImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    presetLabel: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: "12px 4px 4px",
      background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
      fontSize: 9,
      fontWeight: 600,
      color: "#fff",
      textAlign: "center",
    },
    mediaList: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      maxHeight: 200,
      overflowY: "auto",
    },
    mediaItem: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: 6,
      backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
      borderRadius: 6,
      border: `1px solid ${isDark ? "#2d2d30" : "#e5e7eb"}`,
      cursor: "move",
      transition: "all 0.2s",
    },
    mediaItemDragging: {
      opacity: 0.5,
      borderColor: "#8B5CF6",
    },
    mediaThumb: {
      width: 36,
      height: 36,
      borderRadius: 4,
      objectFit: "cover",
      backgroundColor: "#000",
    },
    mediaInfo: {
      flex: 1,
      minWidth: 0,
    },
    mediaName: {
      fontSize: 11,
      fontWeight: 600,
      color: colors.textPrimary,
      marginBottom: 1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    durationInput: {
      width: 40,
      padding: "2px 4px",
      backgroundColor: isDark ? "#0a0a0b" : "#ffffff",
      border: `1px solid ${isDark ? "#333" : "#e5e7eb"}`,
      borderRadius: 4,
      fontSize: 11,
      color: colors.textPrimary,
      textAlign: "center",
    },
    removeBtn: {
      padding: 4,
      backgroundColor: "transparent",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      color: "#ef4444",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    layoutGrid: {
      display: "flex",
      gap: 12,
    },
    layoutCard: {
      flex: 1,
      padding: 12,
      backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
      border: `2px solid ${isDark ? "#2d2d30" : "#e5e7eb"}`,
      borderRadius: 10,
      cursor: "pointer",
      transition: "all 0.2s",
      textAlign: "center",
    },
    layoutCardActive: {
      borderColor: "#8B5CF6",
      backgroundColor: isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(139, 92, 246, 0.1)",
    },
    layoutPreview: {
      aspectRatio: "9/16",
      maxHeight: 120,
      backgroundColor: isDark ? "#0a0a0b" : "#e5e7eb",
      borderRadius: 6,
      marginBottom: 8,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    layoutName: {
      fontSize: 12,
      fontWeight: 600,
      color: colors.textPrimary,
      marginBottom: 2,
    },
    layoutDesc: {
      fontSize: 10,
      color: colors.textSecondary,
    },
    stats: {
      display: "flex",
      gap: 16,
      marginTop: 12,
      padding: "12px",
      backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
      borderRadius: 10,
    },
    stat: {
      textAlign: "center",
      flex: 1,
    },
    statValue: {
      fontSize: 18,
      fontWeight: 700,
      color: colors.textPrimary,
    },
    statLabel: {
      fontSize: 10,
      color: colors.textSecondary,
      marginTop: 2,
      textTransform: "uppercase",
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? "#1f1f23" : "#e5e7eb",
      margin: "12px 0",
    },
    slideDots: {
      display: "flex",
      gap: 5,
      justifyContent: "center",
      position: "absolute",
      bottom: 16,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    slideDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: "rgba(255,255,255,0.35)",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    slideDotActive: {
      backgroundColor: "#fff",
      width: 16,
    },
    emptyState: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      color: colors.textSecondary,
      gap: 8,
    },
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderPhonePreview = () => {
    const currentMedia = state.mediaItems[state.previewIndex];
    const nextIndex = (state.previewIndex + 1) % state.mediaItems.length;
    const nextMedia = state.mediaItems.length > 1 ? state.mediaItems[nextIndex] : null;
    const animationDuration = currentMedia?.duration || state.defaultDuration;
    
    // Alternate zoom directions (matching editor)
    const isEvenSlide = state.previewIndex % 2 === 0;
    const kenBurnsAnimation = isEvenSlide ? 'kenBurnsZoomIn' : 'kenBurnsZoomOut';
    
    // Layout settings - matching editor Template 8
    const isFullscreen = state.layout === 'layout1';
    const cardSize = isFullscreen ? '100%' : '82%';
    const cardRadius = isFullscreen ? 0 : 16;
    
    // Transition timing
    const transitionSec = state.transitionDuration / 30;
    
    return (
      <div style={styles.previewPanel}>
        <div style={styles.previewLabel}>LIVE PREVIEW</div>
        <div style={styles.phoneFrame}>
          <div style={styles.phoneScreen}>
            {state.mediaItems.length > 0 && currentMedia ? (
              <>
                {/* Background layer - blurred current image */}
                {!isFullscreen && (
                  <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
                    <img
                      key={`bg-${state.previewIndex}`}
                      src={currentMedia.src}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "blur(35px) saturate(1.4) brightness(0.6)",
                        transform: "scale(1.2)",
                      }}
                    />
                    {/* Dark overlay for better contrast */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0,0,0,0.2)",
                    }} />
                    
                    {/* Background wipe transition */}
                    {nextMedia && state.isTransitioning && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          animation: `wipeIn ${transitionSec}s ease-out forwards`,
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={nextMedia.src}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: "blur(35px) saturate(1.4) brightness(0.6)",
                            transform: "scale(1.2)",
                          }}
                        />
                        <div style={{
                          position: "absolute",
                          inset: 0,
                          backgroundColor: "rgba(0,0,0,0.2)",
                        }} />
                      </div>
                    )}
                  </div>
                )}

                {/* Main content layer */}
                <div style={{ 
                  position: "absolute", 
                  inset: 0, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  zIndex: 1,
                }}>
                  {/* Current slide container */}
                  <div
                    style={{
                      width: cardSize,
                      height: cardSize,
                      borderRadius: cardRadius,
                      overflow: "hidden",
                      boxShadow: isFullscreen ? "none" : "0 12px 40px rgba(0,0,0,0.6)",
                      position: "relative",
                    }}
                  >
                    {/* Ken Burns animated image */}
                    <div
                      key={`kb-${state.previewIndex}-${state.isPlaying}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        animation: state.isPlaying && !state.isTransitioning ? `${kenBurnsAnimation} ${animationDuration}s ease-out forwards` : 'none',
                        transform: state.isPlaying ? undefined : 'scale(1.05)',
                      }}
                    >
                      {currentMedia.type === 'video' ? (
                        <video
                          key={currentMedia.id}
                          src={currentMedia.src}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          muted loop autoPlay playsInline
                        />
                      ) : (
                        <img
                          key={currentMedia.id}
                          src={currentMedia.src}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: "contrast(1.05) saturate(1.1) brightness(1.02)",
                          }}
                        />
                      )}
                    </div>

                    {/* Vignette overlay */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)",
                      pointerEvents: "none",
                    }} />

                    {/* Wipe transition overlay (next slide coming in from right) */}
                    {nextMedia && state.isTransitioning && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          animation: `wipeIn ${transitionSec}s ease-out forwards`,
                          overflow: "hidden",
                        }}
                      >
                        <div style={{
                          width: "100%",
                          height: "100%",
                          transform: "scale(1.05)",
                        }}>
                          <img
                            src={nextMedia.src}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              filter: "contrast(1.05) saturate(1.1) brightness(1.02)",
                            }}
                          />
                        </div>
                        <div style={{
                          position: "absolute",
                          inset: 0,
                          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)",
                          pointerEvents: "none",
                        }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Slide indicators */}
                <div style={styles.slideDots}>
                  {state.mediaItems.map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        ...styles.slideDot,
                        ...(idx === state.previewIndex ? styles.slideDotActive : {}),
                      }}
                      onClick={() => !state.isTransitioning && updateState({ previewIndex: idx })}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div style={styles.emptyState}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span style={{ fontSize: 10 }}>Add photos to preview</span>
              </div>
            )}
          </div>
        </div>

        {/* Playback controls - outside phone */}
        {state.mediaItems.length > 0 && (
          <div style={styles.previewControls}>
            <button 
              style={{...styles.previewNav, opacity: state.isTransitioning ? 0.5 : 1}} 
              onClick={goToPrevSlide}
              disabled={state.isTransitioning}
            >
              ◀
            </button>
            <button style={styles.previewBtn} onClick={togglePreviewPlay}>
              {state.isPlaying ? '⏸' : '▶'}
            </button>
            <button 
              style={{...styles.previewNav, opacity: state.isTransitioning ? 0.5 : 1}} 
              onClick={goToNextSlide}
              disabled={state.isTransitioning}
            >
              ▶
            </button>
          </div>
        )}
      </div>
    );
  };


  // Uploads panel - middle column
  const renderUploadsPanel = () => (
    <div style={styles.uploadsPanel}>
      <div style={styles.card}>
        <div style={styles.cardTitle}>📤 Upload Photos & Videos</div>
        
        <div
          style={styles.uploadZone}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length > 0 && fileInputRef.current) {
              const dt = new DataTransfer();
              Array.from(files).forEach(f => dt.items.add(f));
              fileInputRef.current.files = dt.files;
              fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.5" style={{ marginBottom: 4 }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <div style={{ fontSize: 11, fontWeight: 600, color: colors.textPrimary }}>
            Click or drag to upload
          </div>
          <div style={{ fontSize: 10, color: colors.textSecondary }}>
            PNG, JPG, WEBP, MP4
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </div>

      {/* Slides List */}
      {state.mediaItems.length > 0 && (
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: colors.textPrimary }}>
              Your Slides ({state.mediaItems.length})
            </span>
            <span style={{ fontSize: 10, color: colors.textSecondary }}>
              Total: {getTotalDuration()}s
            </span>
          </div>
          <div style={{...styles.mediaList, maxHeight: "calc(100vh - 320px)"}}>
            {state.mediaItems.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => updateState({ previewIndex: index })}
                style={{
                  ...styles.mediaItem,
                  ...(state.draggedIndex === index ? styles.mediaItemDragging : {}),
                  ...(state.previewIndex === index ? { borderColor: "#8B5CF6" } : {}),
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2">
                  <line x1="8" y1="6" x2="16" y2="6" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="8" y1="18" x2="16" y2="18" />
                </svg>
                
                {item.type === 'video' ? (
                  <video src={item.src} style={styles.mediaThumb} muted />
                ) : (
                  <img src={item.src} alt="" style={styles.mediaThumb} />
                )}
                
                <div style={styles.mediaInfo}>
                  <div style={styles.mediaName}>Slide {index + 1}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={item.duration}
                      onChange={(e) => handleUpdateDuration(item.id, Number(e.target.value))}
                      onClick={(e) => e.stopPropagation()}
                      style={styles.durationInput}
                    />
                    <span style={{ fontSize: 9, color: colors.textSecondary }}>sec</span>
                  </div>
                </div>
                
                <button 
                  style={styles.removeBtn} 
                  onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.id); }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Presets panel - right column
  const renderPresetsPanel = () => (
    <div style={styles.presetsPanel}>
      <div style={styles.card}>
        <div style={styles.cardTitle}>✨ Quick Add - Presets</div>
        <div style={{...styles.presetGrid, gridTemplateColumns: "repeat(2, 1fr)"}}>
          {PRESET_IMAGES.map((preset, idx) => {
            const isAdded = state.mediaItems.some(item => item.src === preset.src);
            return (
              <div
                key={idx}
                style={{
                  ...styles.presetCard,
                  ...(isAdded ? styles.presetCardActive : {}),
                  opacity: isAdded ? 0.6 : 1,
                }}
                onClick={() => handleAddPreset(preset)}
              >
                <img src={preset.src} alt={preset.label} style={styles.presetImage} />
                <div style={styles.presetLabel}>
                  {isAdded ? "✓ Added" : preset.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );


  const renderLayoutStep = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>


      {/* Timing Card */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>⏱️ Timing</div>
        
        <div style={{ display: "flex", gap: 24 }}>
          {/* Duration Slider */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: colors.textSecondary, textTransform: "uppercase", fontWeight: 500 }}>Duration per slide</span>
              <span style={{ fontSize: 13, color: "#8B5CF6", fontWeight: 700 }}>{state.defaultDuration}s</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={0.5}
              value={state.defaultDuration}
              onChange={(e) => updateState({ defaultDuration: Number(e.target.value) })}
              style={styles.slider}
            />
            <button
              style={{ 
                marginTop: 10,
                fontSize: 11, 
                padding: "8px 14px", 
                backgroundColor: isDark ? "#2d2d30" : "#e5e7eb", 
                border: "none", 
                borderRadius: 6, 
                cursor: "pointer", 
                color: colors.textPrimary,
                fontWeight: 500,
              }}
              onClick={handleApplyDurationToAll}
            >
              Apply to all →
            </button>
          </div>

          {/* Divider */}
          <div style={{ width: 1, backgroundColor: isDark ? "#2d2d30" : "#e5e7eb" }} />

          {/* Transition Speed */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: colors.textSecondary, textTransform: "uppercase", fontWeight: 500, marginBottom: 10 }}>Transition speed</div>
            <div style={{ display: "flex", gap: 8 }}>
              {TRANSITION_SPEEDS.map((speed) => (
                <button
                  key={speed.value}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    fontSize: 12,
                    fontWeight: 600,
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    backgroundColor: state.transitionDuration === speed.value ? "#8B5CF6" : (isDark ? "#2d2d30" : "#e5e7eb"),
                    color: state.transitionDuration === speed.value ? "#fff" : colors.textPrimary,
                    transition: "all 0.15s ease",
                  }}
                  onClick={() => updateState({ transitionDuration: speed.value })}
                >
                  {speed.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{
        ...styles.card,
        display: "flex",
        justifyContent: "space-around",
        padding: 20,
        backgroundColor: isDark ? "#18181b" : "#fafafa",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: colors.textPrimary }}>{state.mediaItems.length}</div>
          <div style={{ fontSize: 10, color: colors.textSecondary, textTransform: "uppercase", fontWeight: 500 }}>Slides</div>
        </div>
        <div style={{ width: 1, backgroundColor: isDark ? "#2d2d30" : "#e5e7eb" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: colors.textPrimary }}>{getTotalDuration()}s</div>
          <div style={{ fontSize: 10, color: colors.textSecondary, textTransform: "uppercase", fontWeight: 500 }}>Duration</div>
        </div>
        <div style={{ width: 1, backgroundColor: isDark ? "#2d2d30" : "#e5e7eb" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#8B5CF6" }}>{state.layout === 'layout1' ? 'Full' : 'Center'}</div>
          <div style={{ fontSize: 10, color: colors.textSecondary, textTransform: "uppercase", fontWeight: 500 }}>Layout</div>
        </div>
      </div>
    </div>
  );

  const renderAudioStep = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
      {/* Background Music Selection */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>🎵 Background Music</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {BACKGROUND_MUSIC.map((music) => (
            <button
              key={music.value}
              style={{
                padding: "12px 20px",
                fontSize: 13,
                fontWeight: 500,
                border: state.backgroundMusicPath === music.value ? "2px solid #8B5CF6" : `2px solid ${isDark ? "#2d2d30" : "#e5e7eb"}`,
                borderRadius: 28,
                cursor: "pointer",
                backgroundColor: state.backgroundMusicPath === music.value ? "rgba(139, 92, 246, 0.15)" : (isDark ? "#1a1a1d" : "#f9fafb"),
                color: state.backgroundMusicPath === music.value ? "#8B5CF6" : colors.textPrimary,
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.15s ease",
              }}
              onClick={() => updateState({ backgroundMusicPath: music.value })}
            >
              {music.icon} {music.label}
            </button>
          ))}
        </div>

        {state.backgroundMusicPath && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${isDark ? "#2d2d30" : "#e5e7eb"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: colors.textSecondary, textTransform: "uppercase", fontWeight: 500 }}>Volume</span>
              <span style={{ fontSize: 13, color: "#8B5CF6", fontWeight: 700 }}>{Math.round(state.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={state.musicVolume * 100}
              onChange={(e) => updateState({ musicVolume: Number(e.target.value) / 100 })}
              style={styles.slider}
            />
          </div>
        )}
      </div>

      {/* Project Summary */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>📊 Summary</div>
        
        {/* Stats Row */}
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "16px 0",
          marginBottom: 16,
          backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
          borderRadius: 10,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: colors.textPrimary }}>{state.mediaItems.length}</div>
            <div style={{ fontSize: 10, color: colors.textSecondary, textTransform: "uppercase", fontWeight: 500 }}>Photos</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: colors.textPrimary }}>{getTotalDuration()}s</div>
            <div style={{ fontSize: 10, color: colors.textSecondary, textTransform: "uppercase", fontWeight: 500 }}>Duration</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#8B5CF6" }}>
              {TRANSITION_SPEEDS.find(s => s.value === state.transitionDuration)?.label}
            </div>
            <div style={{ fontSize: 10, color: colors.textSecondary, textTransform: "uppercase", fontWeight: 500 }}>Transition</div>
          </div>
        </div>

        {/* Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            fontSize: 13,
            padding: "10px 14px",
            backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
            borderRadius: 8,
          }}>
            <span style={{ color: colors.textSecondary }}>Layout</span>
            <span style={{ color: colors.textPrimary, fontWeight: 600 }}>
              {state.layout === 'layout1' ? 'Fullscreen' : 'Centered with Blur'}
            </span>
          </div>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            fontSize: 13,
            padding: "10px 14px",
            backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
            borderRadius: 8,
          }}>
            <span style={{ color: colors.textSecondary }}>Background Music</span>
            <span style={{ color: state.backgroundMusicPath ? "#8B5CF6" : colors.textPrimary, fontWeight: 600 }}>
              {BACKGROUND_MUSIC.find(m => m.value === state.backgroundMusicPath)?.label || "None"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #8B5CF6;
          border-radius: 50%;
          cursor: pointer;
        }
        /* Ken Burns: subtle zoom in with small pan - always stays zoomed to avoid edges */
        @keyframes kenBurnsZoomIn {
          0% {
            transform: scale(1.05) translate(0px, 0px);
          }
          100% {
            transform: scale(1.12) translate(-8px, -5px);
          }
        }
        /* Ken Burns: subtle zoom out with small pan - minimum scale 1.05 to avoid edges */
        @keyframes kenBurnsZoomOut {
          0% {
            transform: scale(1.12) translate(0px, 0px);
          }
          100% {
            transform: scale(1.05) translate(5px, 3px);
          }
        }
        /* Wipe transition from right to left */
        @keyframes wipeIn {
          0% {
            clip-path: inset(0 0 0 100%);
          }
          100% {
            clip-path: inset(0 0 0 0);
          }
        }
      `}</style>
      
      <header style={styles.header}>
        <div style={styles.logo} onClick={() => navigate(-1)}>
          <span style={{ fontSize: 20 }}>←</span>
          <span style={{ color: "#8B5CF6" }}>Ken Burns</span> Carousel
        </div>

        <div style={styles.stepNav}>
          {STEPS.map((step) => (
            <button
              key={step.id}
              style={{ ...styles.stepPill, ...(currentStep === step.id ? styles.stepPillActive : {}) }}
              onClick={() => setCurrentStep(step.id)}
            >
              {step.icon} {step.label}
            </button>
          ))}
        </div>

        <div style={styles.headerActions}>
          {currentStepIndex > 0 && (
            <button style={styles.btnSecondary} onClick={goToPrevStep}>← Back</button>
          )}
          <button
            style={{ ...styles.btnPrimary, opacity: canProceed() ? 1 : 0.5 }}
            onClick={() => currentStep === "audio" ? proceedToEditor() : canProceed() && goToNextStep()}
            disabled={!canProceed()}
          >
            {currentStep === "audio" ? "Create Video" : "Next"} →
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {renderPhonePreview()}
        {currentStep === "media" ? (
          <>
            {renderUploadsPanel()}
            {renderPresetsPanel()}
          </>
        ) : (
          <div style={styles.controlsPanel}>
            {currentStep === "layout" && renderLayoutStep()}
            {currentStep === "audio" && renderAudioStep()}
          </div>
        )}
      </main>
    </div>
  );
};

export default KenBurnsWizard;