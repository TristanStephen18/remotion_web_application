import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import toast from "react-hot-toast";

// ============================================================================
// TYPES - Matching CollagePanel exactly
// ============================================================================

export interface CollageSlot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  borderRadius?: number;
  zIndex?: number;
  shadow?: boolean;
  slideDirection?: "left" | "right" | "up" | "down" | "none";
}

export interface CollageLayout {
  id: string;
  name: string;
  description: string;
  slots: CollageSlot[];
  category: "grid" | "creative" | "split" | "polaroid" | "magazine" | "animated";
  animated?: boolean;
  animationConfig?: {
    photoDelay: number;
    photoDuration: number;
    textStartFrame: number;
  };
  textOverlay?: {
    mainText: string;
    subText: string;
    mainFont: string;
    subFont: string;
    mainSize: number;
    subSize: number;
  };
}

interface PhotoItem {
  id: string;
  src: string;
  file?: File;
}

interface WizardState {
  photos: PhotoItem[];
  selectedLayoutId: string;
  mainText: string;
  subText: string;
  mainFont: string;
  subFont: string;
  textColor: string;
  showTextOverlay: boolean;
  backgroundMusicPath: string;
  musicVolume: number;
  animationStyle: "slide" | "fade" | "zoom" | "none";
  photoDuration: number;
  backgroundColor: string;
  transitionEffect: "fade" | "slideLeft" | "slideRight" | "slideUp" | "slideDown" | "scale" | "none";
}

type WizardStep = "layout" | "photos" | "style" | "audio";

// ============================================================================
// ALL LAYOUTS FROM COLLAGEPANEL - EXACT COPY
// ============================================================================

const COLLAGE_LAYOUTS: CollageLayout[] = [
  // --- ANIMATED ---
  {
    id: "collage-stories-animated",
    name: "Collage Stories",
    description: "Animated 2x3 Instagram style",
    category: "animated",
    animated: true,
    animationConfig: { photoDelay: 8, photoDuration: 25, textStartFrame: 65 },
    textOverlay: { mainText: "Layout", subText: "stories", mainFont: "Pacifico, cursive", subFont: "Dancing Script, cursive", mainSize: 7, subSize: 4 },
    slots: [
      { id: "top-left", x: 0, y: 0, width: 50, height: 33.33, slideDirection: "left" },
      { id: "top-right", x: 50, y: 0, width: 50, height: 33.33, slideDirection: "right" },
      { id: "middle-left", x: 0, y: 33.33, width: 50, height: 33.33, slideDirection: "left" },
      { id: "middle-right", x: 50, y: 33.33, width: 50, height: 33.33, slideDirection: "right" },
      { id: "bottom-left", x: 0, y: 66.66, width: 50, height: 33.34, slideDirection: "left" },
      { id: "bottom-right", x: 50, y: 66.66, width: 50, height: 33.34, slideDirection: "right" },
    ],
  },
  // --- GRIDS ---
  {
    id: "original-3x2",
    name: "Classic Grid (3x2)",
    description: "6 photos in a horizontal grid",
    category: "grid",
    textOverlay: { mainText: "GRID", subText: "classic collection", mainFont: "Montserrat, sans-serif", subFont: "Lato, sans-serif", mainSize: 6, subSize: 3 },
    slots: [
      { id: "top-left", x: 0, y: 0, width: 33.33, height: 33.33 },
      { id: "top-center", x: 33.33, y: 0, width: 33.33, height: 33.33 },
      { id: "top-right", x: 66.66, y: 0, width: 33.34, height: 33.33 },
      { id: "bottom-left", x: 0, y: 66.67, width: 33.33, height: 33.33 },
      { id: "bottom-center", x: 33.33, y: 66.67, width: 33.33, height: 33.33 },
      { id: "bottom-right", x: 66.66, y: 66.67, width: 33.34, height: 33.33 },
    ],
  },
  {
    id: "grid-2x1",
    name: "Split (2x1)",
    description: "Two photos stacked vertically",
    category: "grid",
    textOverlay: { mainText: "DUO", subText: "stack", mainFont: "Oswald, sans-serif", subFont: "Roboto, sans-serif", mainSize: 8, subSize: 4 },
    slots: [
      { id: "top", x: 0, y: 0, width: 100, height: 50 },
      { id: "bottom", x: 0, y: 50, width: 100, height: 50 },
    ],
  },
  {
    id: "grid-2x2",
    name: "Grid (2x2)",
    description: "Four photos in a square grid",
    category: "grid",
    textOverlay: { mainText: "QUAD", subText: "squares", mainFont: "Montserrat, sans-serif", subFont: "Lato, sans-serif", mainSize: 7, subSize: 3.5 },
    slots: [
      { id: "tl", x: 0, y: 0, width: 50, height: 25 },
      { id: "tr", x: 50, y: 0, width: 50, height: 25 },
      { id: "bl", x: 0, y: 25, width: 50, height: 25 },
      { id: "br", x: 50, y: 25, width: 50, height: 25 },
    ],
  },
  {
    id: "grid-3x3",
    name: "Grid (3x3)",
    description: "Nine photos in a grid",
    category: "grid",
    textOverlay: { mainText: "NINE", subText: "grid layout", mainFont: "Montserrat, sans-serif", subFont: "Lato, sans-serif", mainSize: 7, subSize: 3.5 },
    slots: [
      { id: "1", x: 0, y: 0, width: 33.33, height: 16.67 },
      { id: "2", x: 33.33, y: 0, width: 33.33, height: 16.67 },
      { id: "3", x: 66.66, y: 0, width: 33.33, height: 16.67 },
      { id: "4", x: 0, y: 16.67, width: 33.33, height: 16.67 },
      { id: "5", x: 33.33, y: 16.67, width: 33.33, height: 16.67 },
      { id: "6", x: 66.66, y: 16.67, width: 33.33, height: 16.67 },
      { id: "7", x: 0, y: 33.34, width: 33.33, height: 16.67 },
      { id: "8", x: 33.33, y: 33.34, width: 33.33, height: 16.67 },
      { id: "9", x: 66.66, y: 33.34, width: 33.33, height: 16.67 },
    ],
  },
  // --- CREATIVE ---
  {
    id: "creative-hero",
    name: "Hero Shot",
    description: "One large photo with two smaller ones",
    category: "creative",
    textOverlay: { mainText: "HERO", subText: "focus", mainFont: "Playfair Display, serif", subFont: "Lora, serif", mainSize: 8, subSize: 4 },
    slots: [
      { id: "hero", x: 0, y: 0, width: 100, height: 60 },
      { id: "left", x: 0, y: 60, width: 50, height: 40 },
      { id: "right", x: 50, y: 60, width: 50, height: 40 },
    ],
  },
  {
    id: "creative-spotlight",
    name: "Spotlight",
    description: "Center photo with side panels",
    category: "creative",
    textOverlay: { mainText: "FOCUS", subText: "center stage", mainFont: "Oswald, sans-serif", subFont: "Roboto, sans-serif", mainSize: 8, subSize: 4 },
    slots: [
      { id: "left", x: 0, y: 0, width: 25, height: 100 },
      { id: "center", x: 25, y: 10, width: 50, height: 80, zIndex: 2, shadow: true },
      { id: "right", x: 75, y: 0, width: 25, height: 100 },
    ],
  },
  // --- SPLIT ---
  {
    id: "split-lr",
    name: "Left-Right Split",
    description: "Two photos side by side",
    category: "split",
    textOverlay: { mainText: "VS", subText: "comparison", mainFont: "Impact, sans-serif", subFont: "Arial, sans-serif", mainSize: 10, subSize: 4 },
    slots: [
      { id: "left", x: 0, y: 0, width: 50, height: 100 },
      { id: "right", x: 50, y: 0, width: 50, height: 100 },
    ],
  },
  {
    id: "split-thirds",
    name: "Thirds Split",
    description: "One large, two small in thirds",
    category: "split",
    textOverlay: { mainText: "SPLIT", subText: "thirds", mainFont: "Oswald, sans-serif", subFont: "Roboto, sans-serif", mainSize: 8, subSize: 4 },
    slots: [
      { id: "main", x: 0, y: 0, width: 66.66, height: 100 },
      { id: "top", x: 66.66, y: 0, width: 33.34, height: 50 },
      { id: "bottom", x: 66.66, y: 50, width: 33.34, height: 50 },
    ],
  },
  // --- POLAROID ---
  {
    id: "polaroid-classic",
    name: "Classic Polaroid",
    description: "Polaroid style with borders",
    category: "polaroid",
    textOverlay: { mainText: "MEMORIES", subText: "captured moments", mainFont: "Permanent Marker, cursive", subFont: "Caveat, cursive", mainSize: 7, subSize: 4 },
    slots: [
      { id: "photo", x: 12.5, y: 15, width: 75, height: 60, shadow: true, borderRadius: 2 },
    ],
  },
  {
    id: "polaroid-stack",
    name: "Stacked Polaroids",
    description: "Three overlapping polaroids",
    category: "polaroid",
    textOverlay: { mainText: "SNAP", subText: "shots", mainFont: "Permanent Marker, cursive", subFont: "Caveat, cursive", mainSize: 8, subSize: 4 },
    slots: [
      { id: "back", x: 5, y: 10, width: 60, height: 50, rotation: -5, zIndex: 1, shadow: true, borderRadius: 2 },
      { id: "middle", x: 20, y: 25, width: 60, height: 50, rotation: 3, zIndex: 2, shadow: true, borderRadius: 2 },
      { id: "front", x: 35, y: 40, width: 60, height: 50, rotation: -2, zIndex: 3, shadow: true, borderRadius: 2 },
    ],
  },
  // --- MAGAZINE ---
  {
    id: "magazine-cover",
    name: "Magazine Cover",
    description: "Full bleed with header and footer",
    category: "magazine",
    textOverlay: { mainText: "VOGUE", subText: "fashion edition", mainFont: "Playfair Display, serif", subFont: "Lora, serif", mainSize: 12, subSize: 4 },
    slots: [
      { id: "hero", x: 0, y: 0, width: 100, height: 100 },
    ],
  },
  {
    id: "magazine-feature",
    name: "Feature Story",
    description: "Large image with text area",
    category: "magazine",
    textOverlay: { mainText: "FEATURE", subText: "exclusive story", mainFont: "Playfair Display, serif", subFont: "Lora, serif", mainSize: 9, subSize: 4 },
    slots: [
      { id: "main", x: 0, y: 0, width: 100, height: 70 },
      { id: "text", x: 0, y: 70, width: 100, height: 30 },
    ],
  },
];

// ============================================================================
// CONSTANTS
// ============================================================================

const STEPS: { id: WizardStep; label: string; icon: string }[] = [
  { id: "layout", label: "Layout", icon: "📐" },
  { id: "photos", label: "Photos", icon: "🖼️" },
  { id: "style", label: "Style", icon: "🎨" },
  { id: "audio", label: "Audio", icon: "🎵" },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "animated", label: "Animated ⚡" },
  { id: "grid", label: "Grid" },
  { id: "creative", label: "Creative" },
  { id: "split", label: "Split" },
  { id: "polaroid", label: "Polaroid" },
  { id: "magazine", label: "Magazine" },
];

const FONTS = [
  { value: "Pacifico, cursive", label: "Pacifico" },
  { value: "Montserrat, sans-serif", label: "Montserrat" },
  { value: "Playfair Display, serif", label: "Playfair Display" },
  { value: "Oswald, sans-serif", label: "Oswald" },
  { value: "Dancing Script, cursive", label: "Dancing Script" },
  { value: "Lato, sans-serif", label: "Lato" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Permanent Marker, cursive", label: "Permanent Marker" },
  { value: "Caveat, cursive", label: "Caveat" },
  { value: "Lora, serif", label: "Lora" },
  { value: "Impact, sans-serif", label: "Impact" },
  { value: "Bebas Neue, sans-serif", label: "Bebas Neue" },
];

const MUSIC = [
  { value: "", label: "None", icon: "🔇" },
  { value: "https://cdn.pixabay.com/audio/2022/10/25/audio_052b24090a.mp3", label: "Happy", icon: "😊" },
  { value: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3", label: "Romantic", icon: "💕" },
  { value: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3", label: "Chill", icon: "☕" },
  { value: "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3", label: "Energetic", icon: "⚡" },
  { value: "https://cdn.pixabay.com/audio/2021/11/25/audio_91b32e02f9.mp3", label: "Cinematic", icon: "🎬" },
];

const PRESETS = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80",
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80",
  "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
];

const genId = () => Math.random().toString(36).slice(2, 9);

// ============================================================================
// COMPONENT
// ============================================================================

const PhotoCollageWizard: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const dark = colors.bgPrimary !== "#ffffff";
  const fileRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [step, setStep] = useState<WizardStep>("layout");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [state, setState] = useState<WizardState>({
    photos: [],
    selectedLayoutId: "collage-stories-animated",
    mainText: "MEMORIES",
    subText: "2024",
    mainFont: "Pacifico, cursive",
    subFont: "Dancing Script, cursive",
    textColor: "#ffffff",
    showTextOverlay: true,
    backgroundMusicPath: "",
    musicVolume: 0.3,
    animationStyle: "slide",
    photoDuration: 3,
    backgroundColor: "#000000",
    transitionEffect: "fade",
  });

  // Animation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const set = useCallback((u: Partial<WizardState>) => setState((p) => ({ ...p, ...u })), []);
  const stepIdx = STEPS.findIndex((s) => s.id === step);
  const layout = COLLAGE_LAYOUTS.find((l) => l.id === state.selectedLayoutId) || COLLAGE_LAYOUTS[0];

  // Animation config - matching CollagePanel exactly
  const animConfig = layout.animationConfig || { photoDelay: 8, photoDuration: 25, textStartFrame: 65 };
  const fps = 30;
  const collageDuration = 180; // Collage duration (6 seconds)
const showcaseDurationPerPhoto = 30; // ~1s per photo fullscreen
const showcaseStartFrame = collageDuration; // Showcase starts AFTER collage
const showcaseTotalFrames = Math.max(state.photos.length, 1) * showcaseDurationPerPhoto;
const totalFrames = collageDuration + showcaseTotalFrames;

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const animate = (time: number) => {
      if (time - lastTimeRef.current >= 1000 / fps) {
        setCurrentFrame((prev) => (prev + 1) % totalFrames);
        lastTimeRef.current = time;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, fps, totalFrames]);


  // Audio playback control
useEffect(() => {
  if (!audioRef.current) return;
  
  if (isPlaying && state.backgroundMusicPath) {
    audioRef.current.volume = state.musicVolume;
    audioRef.current.play().catch(e => console.log("Audio play failed:", e));
  } else {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }
}, [isPlaying, state.backgroundMusicPath, state.musicVolume]);

// Update volume when changed
useEffect(() => {
  if (audioRef.current) {
    audioRef.current.volume = state.musicVolume;
  }
}, [state.musicVolume]);

  // Reset animation when layout changes
  useEffect(() => {
    setCurrentFrame(0);
    setIsPlaying(false);
  }, [state.selectedLayoutId]);

  const selectLayout = (layoutId: string) => {
    const newLayout = COLLAGE_LAYOUTS.find((l) => l.id === layoutId);
    if (newLayout?.textOverlay) {
      set({
        selectedLayoutId: layoutId,
        mainText: newLayout.textOverlay.mainText,
        subText: newLayout.textOverlay.subText,
        mainFont: newLayout.textOverlay.mainFont,
        subFont: newLayout.textOverlay.subFont,
      });
    } else {
      set({ selectedLayoutId: layoutId });
    }
  };

  const filteredLayouts = selectedCategory === "all"
    ? COLLAGE_LAYOUTS
    : COLLAGE_LAYOUTS.filter((l) => l.category === selectedCategory);

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({ id: genId(), src: URL.createObjectURL(file), file }));
    if (newPhotos.length) {
      set({ photos: [...state.photos, ...newPhotos] });
      toast.success(`Added ${newPhotos.length} photo(s)`);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const addPreset = (src: string) => set({ photos: [...state.photos, { id: genId(), src }] });
  const removePhoto = (id: string) => set({ photos: state.photos.filter((p) => p.id !== id) });

  const canNext = () => {
    if (step === "layout") return !!state.selectedLayoutId;
    if (step === "photos") return state.photos.length >= 1;
    return true;
  };

  const next = () => stepIdx < STEPS.length - 1 && setStep(STEPS[stepIdx + 1].id);
  const back = () => stepIdx > 0 && setStep(STEPS[stepIdx - 1].id);

  const finish = () => {
  const selectedLayout = COLLAGE_LAYOUTS.find((l) => l.id === state.selectedLayoutId);
  
  // Calculate duration matching preview
  const photoCount = Math.min(state.photos.length, selectedLayout?.slots.length || 6);
  const collageDurationFrames = 180; // 6 seconds for collage
  const showcaseDurationPerPhotoFrames = 30; // 1 second per photo
  const showcaseTotalFrames = photoCount * showcaseDurationPerPhotoFrames;
  const totalDurationFrames = collageDurationFrames + showcaseTotalFrames;
  
  const cfg = {
    templateId: 19,
    layoutId: state.selectedLayoutId,
    layoutData: selectedLayout,
    photos: state.photos.map((p) => p.src),
    mainText: state.mainText,
    subText: state.subText,
    mainFont: state.mainFont,
    subFont: state.subFont,
    textColor: state.textColor,
    showTextOverlay: state.showTextOverlay,
    backgroundMusicPath: state.backgroundMusicPath,
    musicVolume: state.musicVolume,
    animationStyle: state.animationStyle,
    transitionEffect: state.transitionEffect,
    photoDuration: state.photoDuration,
    backgroundColor: state.backgroundColor,
    mainSize: selectedLayout?.textOverlay?.mainSize || 7,
    subSize: selectedLayout?.textOverlay?.subSize || 4,
    // Duration config
    totalDurationFrames: totalDurationFrames,
    collageDurationFrames: collageDurationFrames,
    showcaseDurationPerPhotoFrames: showcaseDurationPerPhotoFrames,
    showcaseTotalFrames: showcaseTotalFrames,
    photoCount: photoCount,
    skipPersistedLayers: true,
    timestamp: Date.now(),
  };
  
  // Clear any existing persisted layers for template 19 BEFORE navigating
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.includes('template-19') ||
      key.includes('template19') ||
      key.includes('editor-layers-19') ||
      key.includes('layers-19') ||
      key.includes('photocollage') ||
      key.includes('editor_state_') && key.includes('19')
    )) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  sessionStorage.setItem("collageWizardConfig", JSON.stringify(cfg));
  navigate(`/editor?template=19&fromWizard=true&t=${Date.now()}`, { state: { wizardConfig: cfg } });
};

  // Colors
  const accent = "#10B981";
  const border = colors.border;
  const bg1 = dark ? "#09090b" : "#f8fafc";
  const bg2 = dark ? "#18181b" : "#ffffff";
  const bg3 = dark ? "#27272a" : "#f1f5f9";
  const text1 = colors.textPrimary;
  const text2 = colors.textSecondary;
  const text3 = colors.textMuted;

  // ============================================================================
  // ANIMATED PREVIEW - Simulates actual video output
  // ============================================================================

  const renderAnimatedPreview = () => {
    const photoSrcs = state.photos.map((p) => p.src);
    const textOverlay = layout.textOverlay;

  const getSlotAnimation = (_slot: CollageSlot, index: number) => {
  // During showcase phase (after collage), keep collage visible but static
  if (currentFrame >= showcaseStartFrame) {
    return { opacity: 1, transform: "none" };
  }
  
  const startFrame = index * animConfig.photoDelay;
  const endFrame = startFrame + animConfig.photoDuration;
  const duration = animConfig.photoDuration;
  
  // Use the selected transition effect from state
  const effect = state.transitionEffect;
  
  if (currentFrame < startFrame) {
    // Not started yet - set initial state based on effect
    switch (effect) {
      case "slideLeft":
        return { opacity: 0, transform: "translateX(100%)" };
      case "slideRight":
        return { opacity: 0, transform: "translateX(-100%)" };
      case "slideUp":
        return { opacity: 0, transform: "translateY(100%)" };
      case "slideDown":
        return { opacity: 0, transform: "translateY(-100%)" };
      case "scale":
        return { opacity: 0, transform: "scale(0.5)" };
      case "none":
        return { opacity: 1, transform: "none" };
      case "fade":
      default:
        return { opacity: 0, transform: "none" };
    }
  } else if (currentFrame < endFrame) {
    // Animating in
    const t = (currentFrame - startFrame) / duration;
    // Spring approximation matching Remotion
    const springProgress = 1 - Math.pow(1 - t, 2) * Math.cos(t * Math.PI * 0.5);
    const eased = Math.min(1, Math.max(0, springProgress));
    const opacity = Math.min(1, t * 2); // Fade in over first half
    
    switch (effect) {
      case "slideLeft": {
        const offset = (1 - eased) * 100;
        return { opacity, transform: `translateX(${offset}%)` };
      }
      case "slideRight": {
        const offset = (1 - eased) * 100;
        return { opacity, transform: `translateX(-${offset}%)` };
      }
      case "slideUp": {
        const offset = (1 - eased) * 100;
        return { opacity, transform: `translateY(${offset}%)` };
      }
      case "slideDown": {
        const offset = (1 - eased) * 100;
        return { opacity, transform: `translateY(-${offset}%)` };
      }
      case "scale": {
        const scale = 0.5 + (0.5 * eased);
        return { opacity, transform: `scale(${scale})` };
      }
      case "none":
        return { opacity: 1, transform: "none" };
      case "fade":
      default:
        return { opacity, transform: "none" };
    }
  }
  return { opacity: 1, transform: "none" };
};

 const getTextAnimation = (isMain: boolean) => {
  const textStart = animConfig.textStartFrame;
  const duration = isMain ? 20 : 15;
  const delay = isMain ? 0 : 5;
  const startFrame = textStart + delay;
  const progress = Math.min(1, Math.max(0, (currentFrame - startFrame) / duration));

  if (currentFrame < startFrame) {
    return { opacity: 0, transform: isMain ? "scale(0.5)" : "translateY(20px)" };
  }
  const eased = 1 - Math.pow(1 - progress, 3);
  if (isMain) {
    return { opacity: eased, transform: `scale(${0.5 + 0.5 * eased})` };
  }
  return { opacity: eased, transform: `translateY(${20 * (1 - eased)}px)` };
};

    // Screen dimensions (preview is 260px wide, 9:16 ratio)
    const screenHeight = 260 * (16 / 9);

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        {/* Phone Frame */}
        <div style={{
          width: 260,
          aspectRatio: "9/16",
          backgroundColor: "#000",
          borderRadius: 28,
          padding: 8,
          boxShadow: "0 20px 50px -12px rgba(0,0,0,0.5)",
          position: "relative",
        }}>
          {/* Notch */}
          <div style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 70,
            height: 20,
            backgroundColor: "#000",
            borderRadius: "0 0 12px 12px",
            zIndex: 20,
          }} />

          {/* Screen */}
          <div style={{
            width: "100%",
            height: "100%",
            borderRadius: 20,
            overflow: "hidden",
            position: "relative",
            backgroundColor: state.backgroundColor,
          }}>

{/* Individual Photo Showcase - Fullscreen AFTER collage */}
{currentFrame >= showcaseStartFrame && state.photos.length > 0 && (() => {
  const showcaseFrame = currentFrame - showcaseStartFrame;
  const photoIndex = Math.min(
    Math.floor(showcaseFrame / showcaseDurationPerPhoto),
    state.photos.length - 1
  );
  const photoFrame = showcaseFrame % showcaseDurationPerPhoto;
  const src = state.photos[photoIndex]?.src;
  
  if (!src || photoIndex >= state.photos.length) return null;
  
  // Ken Burns zoom effect
  const zoomProgress = photoFrame / showcaseDurationPerPhoto;
  const scale = 1 + (zoomProgress * 0.08);
  
  // Fade in/out
  const fadeInFrames = 6;
  const fadeOutFrames = 6;
  let opacity = 1;
  if (photoFrame < fadeInFrames) {
    opacity = photoFrame / fadeInFrames;
  } else if (photoFrame > showcaseDurationPerPhoto - fadeOutFrames) {
    opacity = (showcaseDurationPerPhoto - photoFrame) / fadeOutFrames;
  }
  
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      zIndex: 100,
      backgroundColor: state.backgroundColor,
      overflow: "hidden",
    }}>
      <img 
        src={src} 
        alt="" 
        style={{ 
          width: "100%", 
          height: "100%", 
          objectFit: "cover",
          transform: `scale(${scale})`,
          opacity: opacity,
          transition: "none",
        }} 
      />
      {/* Photo counter dots */}
      <div style={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 6,
        zIndex: 101,
      }}>
        {state.photos.slice(0, layout.slots.length).map((_, i) => (
          <div key={i} style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: i === photoIndex ? "#fff" : "rgba(255,255,255,0.4)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
          }} />
        ))}
      </div>
      {/* Photo number */}
      <div style={{
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "rgba(0,0,0,0.6)",
        color: "#fff",
        padding: "4px 10px",
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 600,
        zIndex: 101,
      }}>
        {photoIndex + 1} / {Math.min(state.photos.length, layout.slots.length)}
      </div>
    </div>
  );
})()}
            {/* Render slots with photos and animations */}
            {/* CollagePanel uses TOP-LEFT positioning: x/y are percentages from top-left */}
            {layout.slots.map((slot, i) => {
              const src = photoSrcs[i];
              const anim = getSlotAnimation(slot, i);
              return (
                <div
                  key={slot.id}
                  style={{
                    position: "absolute",
                    // Position from TOP-LEFT corner (matching CollagePanel)
                    left: `${slot.x}%`,
                    top: `${slot.y}%`,
                    width: `${slot.width}%`,
                    height: `${slot.height}%`,
                    // Rotation around center, plus animation transform
                    transform: `${slot.rotation ? `rotate(${slot.rotation}deg) ` : ""}${anim.transform}`,
                    transformOrigin: "center center",
                    borderRadius: slot.borderRadius ? `${slot.borderRadius}%` : 0,
                    zIndex: slot.zIndex || 1,
                    boxShadow: slot.shadow ? "0 4px 16px rgba(0,0,0,0.5)" : undefined,
                    overflow: "hidden",
                    backgroundColor: dark ? "#27272a" : "#e2e8f0",
                    // border: slot.shadow ? "3px solid white" : "1px solid rgba(255,255,255,0.1)",
                    opacity: anim.opacity,
                    transition: isPlaying ? "none" : "all 0.3s ease",
                  }}
                >
                  {src ? (
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: dark ? "#52525b" : "#94a3b8",
                      fontSize: 10,
                      gap: 2,
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      <span style={{ fontWeight: 600 }}>{i + 1}</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Text Overlay with Animation - EXACT POSITIONS FROM COLLAGEPANEL */}
            {state.showTextOverlay && textOverlay && (
              <>
                {/* Main text - position: videoHeight/2 - 70 = 46.35% */}
                <div style={{
                  position: "absolute",
                  top: `calc(50% - ${70 * (screenHeight / 1920)}px)`,
                  left: "50%",
                  width: `${(900 / 1080) * 100}%`, 
                  height: `${(250 / 1920) * 100}%`, 
                  transform: `translate(-50%, -50%) ${getTextAnimation(true).transform}`,
                  // fontSize: mainSize is percentage of video height
                  fontSize: `${(textOverlay.mainSize / 100) * screenHeight}px`,
                  fontFamily: state.mainFont,
                  fontWeight: "bold",
                  color: state.textColor,
                  textShadow: "2px 2px 8px rgba(0,0,0,0.9)",
                  WebkitTextStroke: "1px rgba(0,0,0,0.3)",
                  zIndex: 10,
                  textAlign: "center",
                  letterSpacing: 3,
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: getTextAnimation(true).opacity,
                  transition: isPlaying ? "none" : "all 0.3s ease",
                }}>
                  {state.mainText}
                </div>
                {/* Subtitle - position: videoHeight/2 + 100 = 55.2% */}
                <div style={{
                  position: "absolute",
                  top: `calc(50% + ${100 * (screenHeight / 1920)}px)`, // Exact: videoHeight/2 + 100
                  left: "50%",
                  width: `${(500 / 1080) * 100}%`, // 500px out of 1080 = 46.3%
                  height: `${(120 / 1920) * 100}%`, // 120px out of 1920 = 6.25%
                  transform: `translate(-50%, -50%) ${getTextAnimation(false).transform}`,
                  fontSize: `${(textOverlay.subSize / 100) * screenHeight}px`,
                  fontFamily: state.subFont,
                  fontStyle: "italic",
                  color: state.textColor,
                  textShadow: "1px 1px 6px rgba(0,0,0,0.8)",
                  zIndex: 10,
                  textAlign: "center",
                  letterSpacing: 1,
                  lineHeight: 1.2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: getTextAnimation(false).opacity * 0.98,
                  transition: isPlaying ? "none" : "all 0.3s ease",
                }}>
                  {state.subText}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Play Controls */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 20px",
          backgroundColor: bg2,
          borderRadius: 12,
          border: `1px solid ${border}`,
        }}>
          <button
            onClick={() => { setIsPlaying(!isPlaying); if (!isPlaying) setCurrentFrame(0); }}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "none",
              backgroundColor: accent,
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <div style={{ fontSize: 12, color: text3, minWidth: 80 }}>
            {(currentFrame / fps).toFixed(1)}s / {(totalFrames / fps).toFixed(1)}s
          </div>
          <div style={{
            flex: 1,
            height: 4,
            backgroundColor: bg3,
            borderRadius: 2,
            overflow: "hidden",
            minWidth: 100,
          }}>
            <div style={{
              width: `${(currentFrame / totalFrames) * 100}%`,
              height: "100%",
              backgroundColor: accent,
              transition: isPlaying ? "none" : "width 0.1s",
            }} />
          </div>
          <button
            onClick={() => { setCurrentFrame(0); setIsPlaying(false); }}
            style={{
              padding: "6px 12px",
              fontSize: 11,
              borderRadius: 6,
              border: `1px solid ${border}`,
              backgroundColor: "transparent",
              color: text2,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>


        {/* Hidden Audio Element for Preview */}
{state.backgroundMusicPath && (
  <audio
    ref={audioRef}
    src={state.backgroundMusicPath}
    loop
    preload="auto"
  />
)}

        {/* Animated Badge */}
        {layout.animated && (
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            backgroundColor: "#ffb800",
            color: "#000",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
          }}>
            ⚡ ANIMATED LAYOUT
          </div>
        )}

        {/* Stats */}
        <div style={{
          display: "flex",
          gap: 20,
          padding: "12px 24px",
          backgroundColor: bg2,
          borderRadius: 12,
          border: `1px solid ${border}`,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: accent }}>{state.photos.length}</div>
            <div style={{ fontSize: 10, color: text3 }}>photos</div>
          </div>
          <div style={{ width: 1, backgroundColor: border }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: accent }}>{layout.slots.length}</div>
            <div style={{ fontSize: 10, color: text3 }}>slots</div>
          </div>
          <div style={{ width: 1, backgroundColor: border }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: accent }}>{state.photoDuration}s</div>
            <div style={{ fontSize: 10, color: text3 }}>per slide</div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // PANELS - Same as before but more compact
  // ============================================================================

  const panelStyle: React.CSSProperties = {
    flex: 1,
    maxWidth: 500,
    backgroundColor: bg2,
    borderRadius: 14,
    border: `1px solid ${border}`,
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    overflowY: "auto",
    maxHeight: "calc(100vh - 120px)",
  };

  const sectionTitle: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: text1, marginBottom: 2 };
  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 500, color: text3, marginBottom: 5, display: "block" };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 11px", fontSize: 13, border: `1px solid ${border}`, borderRadius: 8, backgroundColor: bg3, color: text1, outline: "none" };
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };
  const chipStyle = (active: boolean): React.CSSProperties => ({ padding: "7px 14px", fontSize: 11, fontWeight: 500, borderRadius: 18, border: `1px solid ${active ? accent : border}`, backgroundColor: active ? accent : "transparent", color: active ? "#fff" : text2, cursor: "pointer" });

  // ============================================================================
  // STEP RENDERS
  // ============================================================================

  const renderLayoutStep = () => (
    <div style={panelStyle}>
      <div style={sectionTitle}>Choose Your Layout</div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 6 }}>
        {CATEGORIES.map((cat) => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} style={{ padding: "5px 10px", fontSize: 10, fontWeight: 500, borderRadius: 5, border: `1px solid ${selectedCategory === cat.id ? accent : border}`, backgroundColor: selectedCategory === cat.id ? accent : bg3, color: selectedCategory === cat.id ? "#fff" : text2, cursor: "pointer" }}>
            {cat.label}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8 }}>
        {filteredLayouts.map((l) => (
          <div key={l.id} onClick={() => selectLayout(l.id)} style={{ aspectRatio: "9/16", backgroundColor: bg3, borderRadius: 8, cursor: "pointer", overflow: "hidden", border: `2px solid ${state.selectedLayoutId === l.id ? accent : "transparent"}`, boxShadow: state.selectedLayoutId === l.id ? `0 0 0 2px ${accent}40` : undefined, position: "relative" }}>
            {l.animated && <div style={{ position: "absolute", top: 3, right: 3, backgroundColor: "#ffb800", color: "#000", padding: "1px 4px", borderRadius: 3, fontSize: 7, fontWeight: 700, zIndex: 10 }}>⚡</div>}
            <div style={{ position: "absolute", inset: 4, backgroundColor: "#1a1a1a", borderRadius: 5, overflow: "hidden" }}>
              {l.slots.map((slot) => (
                <div key={slot.id} style={{ position: "absolute", left: `${slot.x}%`, top: `${slot.y}%`, width: `${slot.width}%`, height: `${slot.height}%`, backgroundColor: "#444", border: "1px solid #555", transform: slot.rotation ? `rotate(${slot.rotation}deg)` : undefined, borderRadius: slot.borderRadius || 0, zIndex: slot.zIndex || 1, boxShadow: slot.shadow ? "0 2px 4px rgba(0,0,0,0.3)" : undefined }} />
              ))}
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 2px", fontSize: 8, fontWeight: 600, textAlign: "center", backgroundColor: bg3, color: state.selectedLayoutId === l.id ? accent : text3 }}>{l.name}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPhotosStep = () => (
    <div style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={sectionTitle}>Add Your Photos</div>
        <span style={{ fontSize: 12, color: state.photos.length >= layout.slots.length ? accent : text3, fontWeight: 500 }}>{state.photos.length} / {layout.slots.length}</span>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFiles} style={{ display: "none" }} />
      <div onClick={() => fileRef.current?.click()} onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = accent; }} onDragLeave={(e) => { e.currentTarget.style.borderColor = border; }} onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = border; if (e.dataTransfer.files.length && fileRef.current) { const dt = new DataTransfer(); Array.from(e.dataTransfer.files).forEach((f) => dt.items.add(f)); fileRef.current.files = dt.files; fileRef.current.dispatchEvent(new Event("change", { bubbles: true })); } }} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: 20, border: `2px dashed ${border}`, borderRadius: 10, cursor: "pointer", backgroundColor: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={text3} strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
        <div style={{ fontSize: 13, fontWeight: 500, color: text1 }}>Drop photos or click to browse</div>
      </div>
      {state.photos.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))", gap: 6 }}>
          {state.photos.map((p, idx) => (
            <div key={p.id} style={{ aspectRatio: "1", borderRadius: 6, overflow: "hidden", position: "relative", border: `2px solid ${idx < layout.slots.length ? accent : border}` }}>
              <img src={p.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: 3, left: 3, width: 18, height: 18, borderRadius: "50%", backgroundColor: idx < layout.slots.length ? accent : bg3, color: idx < layout.slots.length ? "#fff" : text3, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{idx + 1}</div>
              <button onClick={() => removePhoto(p.id)} style={{ position: "absolute", top: 3, right: 3, width: 18, height: 18, borderRadius: "50%", backgroundColor: "rgba(239,68,68,0.9)", color: "#fff", border: "none", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
          ))}
        </div>
      )}
      <div>
        <div style={{ fontSize: 11, color: text3, marginBottom: 6 }}>Sample photos:</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PRESETS.map((src, i) => (
            <div key={i} onClick={() => addPreset(src)} style={{ width: 48, height: 48, borderRadius: 6, overflow: "hidden", cursor: "pointer", border: "2px solid transparent" }} onMouseOver={(e) => e.currentTarget.style.borderColor = accent} onMouseOut={(e) => e.currentTarget.style.borderColor = "transparent"}>
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStyleStep = () => (
    <div style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={sectionTitle}>Text Overlay</div>
        <div onClick={() => set({ showTextOverlay: !state.showTextOverlay })} style={{ width: 40, height: 22, borderRadius: 11, backgroundColor: state.showTextOverlay ? accent : border, position: "relative", cursor: "pointer" }}>
          <div style={{ position: "absolute", top: 2, left: state.showTextOverlay ? 20 : 2, width: 18, height: 18, borderRadius: "50%", backgroundColor: "#fff", transition: "all 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
        </div>
      </div>
      {state.showTextOverlay && (
        <>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}><label style={labelStyle}>Main Text</label><input value={state.mainText} onChange={(e) => set({ mainText: e.target.value })} style={inputStyle} /></div>
            <div style={{ flex: 1 }}><label style={labelStyle}>Font</label><select value={state.mainFont} onChange={(e) => set({ mainFont: e.target.value })} style={selectStyle}>{FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}</select></div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}><label style={labelStyle}>Subtitle</label><input value={state.subText} onChange={(e) => set({ subText: e.target.value })} style={inputStyle} /></div>
            <div style={{ flex: 1 }}><label style={labelStyle}>Font</label><select value={state.subFont} onChange={(e) => set({ subFont: e.target.value })} style={selectStyle}>{FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}</select></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label style={{ ...labelStyle, margin: 0 }}>Color</label>
            <input type="color" value={state.textColor} onChange={(e) => set({ textColor: e.target.value })} style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${border}`, cursor: "pointer", padding: 0 }} />
            <span style={{ fontSize: 11, color: text3 }}>{state.textColor}</span>
          </div>
        </>
      )}
      <div style={{ height: 1, backgroundColor: border }} />
<div style={sectionTitle}>Photo Transition Effect</div>
<div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
  {[
    { value: "fade", label: "Fade" },
    { value: "slideLeft", label: "Slide Left" },
    { value: "slideRight", label: "Slide Right" },
    { value: "slideUp", label: "Slide Up" },
    { value: "slideDown", label: "Slide Down" },
    { value: "scale", label: "Scale" },
    { value: "none", label: "None" },
  ].map((a) => (
    <button key={a.value} onClick={() => set({ transitionEffect: a.value as any })} style={chipStyle(state.transitionEffect === a.value)}>{a.label}</button>
  ))}
</div>
      <div><label style={labelStyle}>Duration: {state.photoDuration}s</label><input type="range" min="2" max="10" value={state.photoDuration} onChange={(e) => set({ photoDuration: +e.target.value })} style={{ width: "100%", accentColor: accent }} /></div>
      <div style={{ height: 1, backgroundColor: border }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <label style={{ ...labelStyle, margin: 0 }}>Background</label>
        <input type="color" value={state.backgroundColor} onChange={(e) => set({ backgroundColor: e.target.value })} style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${border}`, cursor: "pointer", padding: 0 }} />
      </div>
    </div>
  );

  const renderAudioStep = () => (
    <div style={panelStyle}>
      <div style={sectionTitle}>Background Music</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {MUSIC.map((m) => (<button key={m.value} onClick={() => set({ backgroundMusicPath: m.value })} style={chipStyle(state.backgroundMusicPath === m.value)}>{m.icon} {m.label}</button>))}
      </div>
      {state.backgroundMusicPath && (<div><label style={labelStyle}>Volume: {Math.round(state.musicVolume * 100)}%</label><input type="range" min="0" max="100" value={state.musicVolume * 100} onChange={(e) => set({ musicVolume: +e.target.value / 100 })} style={{ width: "100%", accentColor: accent }} /></div>)}
      <div style={{ height: 1, backgroundColor: border }} />
      <div style={sectionTitle}>Summary</div>
      <div style={{ backgroundColor: bg3, borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {[["Layout", layout.name], ["Photos", `${state.photos.length}/${layout.slots.length}`], ["Animation", state.animationStyle], ["Duration", `${state.photoDuration}s`], ["Text", state.showTextOverlay ? state.mainText : "Off"], ["Music", MUSIC.find((m) => m.value === state.backgroundMusicPath)?.label]].map(([k, v], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><span style={{ color: text3 }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span></div>
        ))}
      </div>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div style={{ minHeight: "100vh", backgroundColor: bg1, color: text1, display: "flex", flexDirection: "column" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", backgroundColor: bg2, borderBottom: `1px solid ${border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 16, fontWeight: 700, cursor: "pointer" }} onClick={() => navigate(-1)}>
          <span>←</span><span style={{ color: accent }}>Photo</span> Collage
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {STEPS.map((s, i) => (
            <button key={s.id} onClick={() => setStep(s.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 16px", fontSize: 12, fontWeight: 500, borderRadius: 18, border: "none", cursor: "pointer", backgroundColor: step === s.id ? accent : i < stepIdx ? bg3 : "transparent", color: step === s.id ? "#fff" : i < stepIdx ? text2 : text3 }}>
              <span>{s.icon}</span><span>{s.label}</span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {stepIdx > 0 && <button onClick={back} style={{ padding: "8px 16px", fontSize: 12, fontWeight: 500, borderRadius: 6, border: `1px solid ${border}`, backgroundColor: "transparent", color: text2, cursor: "pointer" }}>← Back</button>}
          <button onClick={() => step === "audio" ? finish() : canNext() && next()} disabled={!canNext()} style={{ padding: "8px 20px", fontSize: 12, fontWeight: 600, borderRadius: 6, border: "none", backgroundColor: accent, color: "#fff", cursor: "pointer", opacity: canNext() ? 1 : 0.5 }}>
            {step === "audio" ? "Create →" : "Next →"}
          </button>
        </div>
      </header>
      <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: 20, gap: 24, overflow: "auto" }}>
        {renderAnimatedPreview()}
        {step === "layout" && renderLayoutStep()}
        {step === "photos" && renderPhotosStep()}
        {step === "style" && renderStyleStep()}
        {step === "audio" && renderAudioStep()}
      </main>
    </div>
  );
};

export { COLLAGE_LAYOUTS };
export default PhotoCollageWizard;