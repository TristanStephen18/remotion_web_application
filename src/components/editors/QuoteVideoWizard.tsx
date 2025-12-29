import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import toast from "react-hot-toast";
import { backendPrefix } from "../../config";

// ============================================================================
// TYPES
// ============================================================================

interface WordTiming {
  word: string;
  start: number;
  end: number;
}

interface WizardState {
  // Quote Content
  quoteText: string;
  authorName: string;
  authorTitle: string; // e.g., "Physicist" or "Author"
  
  // Generated Data (for optional voiceover)
  words: WordTiming[];
  voiceoverUrl: string;
  estimatedDuration: number;
  
  // Style - Quote
  quoteFontSize: number;
  quoteFontFamily: string;
  quoteFontColor: string;
  quoteFontStyle: "normal" | "italic";
  quoteTextAlign: "left" | "center" | "right";
  
  // Style - Author
  authorFontSize: number;
  authorFontColor: string;
  
  // Style - Quotation Mark
  showQuotationMark: boolean;
  quotationMarkSize: number;
  quotationMarkColor: string;
  
  // Style - Background
  backgroundType: "image" | "video" | "gradient";
  backgroundImage: string;
  backgroundVideo: string;
  backgroundGradient: string;
  backgroundOverlayColor: string;
  backgroundFilter: string;
  
  // Animation
  quoteAnimation: "fade" | "scale" | "bounce" | "slideUp" | "typewriter";
  authorAnimation: "fade" | "slideUp" | "none";
  quotationMarkAnimation: "scale" | "fade" | "none";
  
  // Audio (optional)
  enableVoiceover: boolean;
  aiVoice: string;
  emotion: string;
  speed: number;
  backgroundMusicPath: string;
  musicVolume: number;
  
  // UI State
  isGeneratingVoiceover: boolean;
  voiceoverGenerated: boolean;
}

type WizardStep = "content" | "style" | "background" | "audio";

// ============================================================================
// CONSTANTS
// ============================================================================

const STEPS: { id: WizardStep; label: string; icon: string }[] = [
  { id: "content", label: "Content", icon: "✍️" },
  { id: "style", label: "Style", icon: "🎨" },
  { id: "background", label: "Background", icon: "🖼️" },
  { id: "audio", label: "Audio", icon: "🎵" },
];

const FONT_FAMILIES = [
  { value: "'Libre Baskerville', Baskerville, Georgia, serif", label: "Libre Baskerville" },
  { value: "'Playfair Display', Georgia, serif", label: "Playfair Display" },
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
  { value: "'Oswald', sans-serif", label: "Oswald" },
  { value: "'Lora', Georgia, serif", label: "Lora" },
  { value: "'Merriweather', Georgia, serif", label: "Merriweather" },
  { value: "'Roboto Slab', serif", label: "Roboto Slab" },
  { value: "'Dancing Script', cursive", label: "Dancing Script" },
];

const AI_VOICES = [
  { value: "alloy", label: "Alloy", gender: "Neutral", desc: "Balanced, clear" },
  { value: "echo", label: "Echo", gender: "Male", desc: "Deep, authoritative" },
  { value: "fable", label: "Fable", gender: "Male", desc: "Warm, storytelling" },
  { value: "onyx", label: "Onyx", gender: "Male", desc: "Professional" },
  { value: "nova", label: "Nova", gender: "Female", desc: "Energetic, young" },
  { value: "shimmer", label: "Shimmer", gender: "Female", desc: "Soft, friendly" },
];

const EMOTIONS = [
  { value: "neutral", label: "Neutral", icon: "😐" },
  { value: "calm", label: "Calm", icon: "😌" },
  { value: "inspiring", label: "Inspiring", icon: "✨" },
  { value: "happy", label: "Happy", icon: "😊" },
  { value: "sad", label: "Sad", icon: "😢" },
];

const BACKGROUND_IMAGES = [
  {
    value: "https://res.cloudinary.com/dcu9xuof0/image/upload/v1764429657/OIP_fchw6q.png",
    label: "Dark Mountains",
  },
  {
    value: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&q=80",
    label: "Sunset Mountains",
  },
  {
    value: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1080&q=80",
    label: "Forest Path",
  },
  {
    value: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1080&q=80",
    label: "Misty Valley",
  },
  {
    value: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&q=80",
    label: "Beach Sunset",
  },
  {
    value: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1080&q=80",
    label: "Starry Night",
  },
];

const BACKGROUND_VIDEOS = [
  {
    value: "https://res.cloudinary.com/djnyytyd0/video/upload/v1764558376/the_way_they_got_so_much_aura_so_tuff_song_ilyTOMMY_-_pretty_ho3_..._sar5qk.mp4",
    label: "Abstract Flow",
  },
  {
    value: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    label: "Fire Abstract",
  },
];

const BACKGROUND_GRADIENTS = [
  { value: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", label: "Deep Night" },
  { value: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)", label: "Ocean Blue" },
  { value: "linear-gradient(135deg, #141e30 0%, #243b55 100%)", label: "Midnight" },
  { value: "linear-gradient(135deg, #232526 0%, #414345 100%)", label: "Steel Gray" },
  { value: "linear-gradient(135deg, #4a0e4e 0%, #2c003e 100%)", label: "Royal Purple" },
  { value: "linear-gradient(135deg, #000428 0%, #004e92 100%)", label: "Blue Depths" },
];

const BACKGROUND_MUSIC = [
  { value: "", label: "None", icon: "🔇" },
  { value: "ambient", label: "Ambient", icon: "🌌" },
  { value: "piano", label: "Piano", icon: "🎹" },
  { value: "inspirational", label: "Inspirational", icon: "✨" },
];

const QUOTE_ANIMATIONS = [
  { value: "fade", label: "Fade In" },
  { value: "scale", label: "Scale Up" },
  { value: "bounce", label: "Bounce" },
  { value: "slideUp", label: "Slide Up" },
  { value: "typewriter", label: "Typewriter" },
];

const SAMPLE_QUOTES = [
  {
    quote: "Life is like riding a bicycle. To keep your balance, you must keep moving.",
    author: "Albert Einstein",
    title: "Physicist",
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    title: "Entrepreneur",
  },
  {
    quote: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    title: "Physicist",
  },
  {
    quote: "Be the change you wish to see in the world.",
    author: "Mahatma Gandhi",
    title: "Leader",
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    title: "Diplomat",
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function estimateWordTimings(text: string, speed: number = 1.0): WordTiming[] {
  const words = text.split(/\s+/).filter(w => w.trim());
  const baseWordsPerSecond = 2.0 * speed; // Slower for quotes
  const avgWordDuration = 1 / baseWordsPerSecond;
  
  let currentTime = 0.5; // Start half second delay
  
  return words.map((word) => {
    const wordLength = word.replace(/[^a-zA-Z]/g, '').length;
    const duration = avgWordDuration * (0.8 + (wordLength / 10) * 0.4);
    
    const timing: WordTiming = {
      word: word,
      start: currentTime,
      end: currentTime + duration,
    };
    
    currentTime += duration;
    
    if (/[.!?]$/.test(word)) {
      currentTime += 0.6 / speed;
    } else if (/[,;:]$/.test(word)) {
      currentTime += 0.3 / speed;
    }
    
    return timing;
  });
}

function calculateDuration(words: WordTiming[]): number {
  if (words.length === 0) return 0;
  return words[words.length - 1].end + 1; // Add 1 second buffer
}

// ============================================================================
// COMPONENT
// ============================================================================

const QuoteVideoWizard: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const isDark = colors.bgPrimary !== "#ffffff";
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Mobile responsiveness
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [currentStep, setCurrentStep] = useState<WizardStep>("content");
  const [state, setState] = useState<WizardState>({
    // Content
    quoteText: "",
    authorName: "",
    authorTitle: "",
    
    // Generated Data
    words: [],
    voiceoverUrl: "",
    estimatedDuration: 9, // Default 9 seconds
    
    // Style - Quote
    quoteFontSize: 4,
    quoteFontFamily: "'Libre Baskerville', Baskerville, Georgia, serif",
    quoteFontColor: "#ffffff",
    quoteFontStyle: "italic",
    quoteTextAlign: "center",
    
    // Style - Author
    authorFontSize: 2.5,
    authorFontColor: "#ffffff",
    
    // Style - Quotation Mark
    showQuotationMark: true,
    quotationMarkSize: 8,
    quotationMarkColor: "#ffffff",
    
    // Background
    backgroundType: "image",
    backgroundImage: BACKGROUND_IMAGES[0].value,
    backgroundVideo: BACKGROUND_VIDEOS[0].value,
    backgroundGradient: BACKGROUND_GRADIENTS[0].value,
    backgroundOverlayColor: "rgba(0,0,0,0.6)",
    backgroundFilter: "brightness(0.6)",
    
    // Animation
    quoteAnimation: "bounce",
    authorAnimation: "fade",
    quotationMarkAnimation: "scale",
    
    // Audio
    enableVoiceover: false,
    aiVoice: "fable",
    emotion: "calm",
    speed: 0.9,
    backgroundMusicPath: "",
    musicVolume: 0.2,
    
    // UI State
    isGeneratingVoiceover: false,
    voiceoverGenerated: false,
  });

  const updateState = useCallback((updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  // ============================================================================
  // VOICEOVER GENERATION
  // ============================================================================

  const handleGenerateVoiceover = async () => {
    if (!state.quoteText.trim()) {
      toast.error("Please enter quote text first");
      return;
    }

    updateState({ isGeneratingVoiceover: true });

    try {
      const fullText = state.authorName 
        ? `${state.quoteText} — ${state.authorName}`
        : state.quoteText;

      const response = await fetch(`${backendPrefix}/sound/generate-voiceover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: fullText,
          voice: state.aiVoice,
          emotion: state.emotion,
          speed: state.speed,
          pitch: 1.0,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate voiceover");

      const audioBlob = await response.blob();
      const persistentUrl = URL.createObjectURL(audioBlob);

      const wordTimings = estimateWordTimings(fullText, state.speed);
      const duration = calculateDuration(wordTimings);

      updateState({
        voiceoverUrl: persistentUrl,
        words: wordTimings,
        estimatedDuration: Math.max(duration + 2, 9), // Minimum 9 seconds
        isGeneratingVoiceover: false,
        voiceoverGenerated: true,
      });

      toast.success("Voiceover generated! 🎙️");
    } catch (error) {
      console.error("Generate voiceover error:", error);
      
      const wordTimings = estimateWordTimings(state.quoteText, state.speed);
      const duration = calculateDuration(wordTimings);

      updateState({
        words: wordTimings,
        estimatedDuration: Math.max(duration + 2, 9),
        isGeneratingVoiceover: false,
        voiceoverGenerated: true,
        voiceoverUrl: "",
      });

      toast.error("Voiceover failed - using estimated timing only");
    }
  };

  const handlePreviewVoiceover = () => {
    if (state.voiceoverUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(state.voiceoverUrl);
      audioRef.current = audio;
      audio.volume = 1.0;
      
      audio.play()
        .then(() => toast.success("Playing voiceover..."))
        .catch((err) => toast.error("Failed: " + err.message));
    } else {
      toast.error("Generate voiceover first");
    }
  };

  // ============================================================================
  // FILE UPLOADS
  // ============================================================================

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload a valid image file");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      updateState({ backgroundImage: imageUrl, backgroundType: "image" });
      toast.success("Background image uploaded!");
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error("Please upload a valid video file");
        return;
      }
      const videoUrl = URL.createObjectURL(file);
      updateState({ backgroundVideo: videoUrl, backgroundType: "video" });
      toast.success("Background video uploaded!");
    }
  };

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  const canProceed = useCallback(() => {
    if (currentStep === "content") return state.quoteText.trim().length > 0;
    return true;
  }, [currentStep, state.quoteText]);

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

  const loadSampleQuote = () => {
    const sample = SAMPLE_QUOTES[Math.floor(Math.random() * SAMPLE_QUOTES.length)];
    updateState({
      quoteText: sample.quote,
      authorName: sample.author,
      authorTitle: sample.title,
    });
    toast.success("Sample quote loaded!");
  };

  const proceedToEditor = () => {
    // Calculate estimated duration based on quote length
    const baseDuration = 9; // 9 seconds base
    const extraDuration = Math.ceil(state.quoteText.length / 50); // Add time for longer quotes
    const totalDuration = state.enableVoiceover && state.voiceoverGenerated
      ? state.estimatedDuration
      : baseDuration + extraDuration;

    const config = {
      content: {
        quoteText: state.quoteText,
        authorName: state.authorName,
        authorTitle: state.authorTitle,
        duration: totalDuration,
      },
      style: {
        quoteFontSize: state.quoteFontSize,
        quoteFontFamily: state.quoteFontFamily,
        quoteFontColor: state.quoteFontColor,
        quoteFontStyle: state.quoteFontStyle,
        quoteTextAlign: state.quoteTextAlign,
        authorFontSize: state.authorFontSize,
        authorFontColor: state.authorFontColor,
        showQuotationMark: state.showQuotationMark,
        quotationMarkSize: state.quotationMarkSize,
        quotationMarkColor: state.quotationMarkColor,
      },
      background: {
        type: state.backgroundType,
        image: state.backgroundImage,
        video: state.backgroundVideo,
        gradient: state.backgroundGradient,
        overlayColor: state.backgroundOverlayColor,
        filter: state.backgroundFilter,
      },
      animation: {
        quote: state.quoteAnimation,
        author: state.authorAnimation,
        quotationMark: state.quotationMarkAnimation,
      },
      audio: {
        enableVoiceover: state.enableVoiceover,
        voiceoverPath: state.voiceoverUrl,
        words: state.words,
        backgroundMusicPath: state.backgroundMusicPath,
        musicVolume: state.musicVolume,
      },
    };
    
    console.log("📦 Saving quote config to sessionStorage:", config);
    
    sessionStorage.setItem("quoteVideoConfig", JSON.stringify(config));

    // Clear any persisted editor state for template 1 so fresh layers are created
    localStorage.removeItem('editor_state_template_1');
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.includes('template_1')) {
        localStorage.removeItem(key);
      }
    }
    console.log("🧹 Cleared persisted state before navigating to editor");

    navigate("/editor?template=1&fromWizard=true");
  };

  // ============================================================================
  // STYLES
  // ============================================================================

  const styles: Record<string, React.CSSProperties> = {
    container: {
      minHeight: "100vh",
      backgroundColor: isDark ? "#0a0a0b" : "#f8f9fa",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: isMobile ? "12px 16px" : "16px 24px",
      borderBottom: `1px solid ${isDark ? "#1f1f23" : "#e5e7eb"}`,
      backgroundColor: isDark ? "#111113" : "#ffffff",
      flexWrap: isMobile ? "wrap" : "nowrap",
      gap: isMobile ? 12 : 0,
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 6 : 10,
      fontSize: isMobile ? 15 : 18,
      fontWeight: 700,
      color: colors.textPrimary,
      cursor: "pointer",
    },
    stepNav: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 2 : 4,
      backgroundColor: isDark ? "#1a1a1d" : "#f3f4f6",
      padding: isMobile ? 3 : 4,
      borderRadius: isMobile ? 10 : 12,
      order: isMobile ? 3 : 0,
      width: isMobile ? "100%" : "auto",
      justifyContent: isMobile ? "space-between" : "flex-start",
    },
    stepPill: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 4 : 6,
      padding: isMobile ? "6px 10px" : "8px 16px",
      borderRadius: isMobile ? 6 : 8,
      fontSize: isMobile ? 11 : 13,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s",
      border: "none",
      background: "transparent",
      color: colors.textSecondary,
      flex: isMobile ? 1 : "none",
      justifyContent: "center",
    },
    stepPillActive: {
      backgroundColor: isDark ? "#2d2d30" : "#ffffff",
      color: colors.textPrimary,
      boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.08)",
    },
    headerActions: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 8 : 12,
    },
    btnSecondary: {
      padding: isMobile ? "8px 12px" : "10px 20px",
      backgroundColor: "transparent",
      border: `1px solid ${isDark ? "#333" : "#e5e7eb"}`,
      borderRadius: isMobile ? 8 : 10,
      fontSize: isMobile ? 12 : 14,
      fontWeight: 500,
      color: colors.textPrimary,
      cursor: "pointer",
    },
    btnPrimary: {
      padding: isMobile ? "8px 14px" : "10px 24px",
      background: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
      border: "none",
      borderRadius: isMobile ? 8 : 10,
      fontSize: isMobile ? 12 : 14,
      fontWeight: 600,
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 4 : 8,
    },
    main: {
      flex: 1,
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      maxWidth: 1400,
      margin: "0 auto",
      width: "100%",
      padding: isMobile ? 12 : 24,
      gap: isMobile ? 12 : 32,
      overflow: isMobile ? "hidden" : "visible",
      height: isMobile ? "calc(100vh - 110px)" : "auto",
    },
    previewPanel: {
      width: isMobile ? "100%" : 340,
      flexShrink: 0,
      display: "flex",
      flexDirection: isMobile ? "row" : "column",
      alignItems: "center",
      justifyContent: isMobile ? "center" : "flex-start",
      gap: isMobile ? 8 : 16,
      padding: isMobile ? "8px 0" : 0,
      borderBottom: isMobile ? `1px solid ${isDark ? "#1f1f23" : "#e5e7eb"}` : "none",
    },
    phoneFrame: {
      width: isMobile ? 180 : 300,
      height: isMobile ? 360 : 600,
      backgroundColor: "#000",
      borderRadius: isMobile ? 22 : 36,
      padding: isMobile ? 5 : 10,
      boxShadow: isDark 
        ? "0 25px 50px rgba(0,0,0,0.5), inset 0 0 0 2px #333"
        : "0 25px 50px rgba(0,0,0,0.15), inset 0 0 0 2px #e5e7eb",
      position: "relative",
      overflow: "hidden",
      flexShrink: 0,
    },
    phoneScreen: {
      width: "100%",
      height: "100%",
      borderRadius: isMobile ? 17 : 26,
      overflow: "hidden",
      position: "relative",
      backgroundColor: "#1a1a1a",
    },
    previewLabel: {
      fontSize: isMobile ? 10 : 12,
      fontWeight: 600,
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      display: isMobile ? "none" : "block",
    },
    mobilePreviewToggle: {
      display: "none",
    },
    controlsPanel: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? 12 : 20,
      maxHeight: isMobile ? "100%" : "calc(100vh - 140px)",
      overflowY: "auto",
      paddingBottom: isMobile ? 16 : 0,
    },
    card: {
      backgroundColor: isDark ? "#141416" : "#ffffff",
      borderRadius: isMobile ? 10 : 16,
      border: `1px solid ${isDark ? "#1f1f23" : "#e5e7eb"}`,
      padding: isMobile ? 12 : 24,
    },
    cardTitle: {
      fontSize: isMobile ? 12 : 15,
      fontWeight: 600,
      color: colors.textPrimary,
      marginBottom: isMobile ? 8 : 16,
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 5 : 10,
    },
    inputGroup: {
      marginBottom: isMobile ? 8 : 16,
    },
    label: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: isMobile ? 9 : 12,
      fontWeight: 500,
      color: colors.textSecondary,
      marginBottom: isMobile ? 3 : 6,
      textTransform: "uppercase",
      letterSpacing: "0.03em",
    },
    labelValue: {
      color: "#8B5CF6",
      fontWeight: 600,
    },
    input: {
      width: "100%",
      padding: isMobile ? "8px 10px" : "12px 14px",
      backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
      border: `1px solid ${isDark ? "#2d2d30" : "#e5e7eb"}`,
      borderRadius: isMobile ? 6 : 10,
      fontSize: isMobile ? 12 : 14,
      color: colors.textPrimary,
      outline: "none",
    },
    textarea: {
      width: "100%",
      padding: isMobile ? "8px 10px" : "12px 14px",
      backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
      border: `1px solid ${isDark ? "#2d2d30" : "#e5e7eb"}`,
      borderRadius: isMobile ? 6 : 10,
      fontSize: isMobile ? 12 : 14,
      color: colors.textPrimary,
      outline: "none",
      resize: "vertical",
      minHeight: isMobile ? 60 : 100,
      fontFamily: "'Libre Baskerville', Georgia, serif",
      fontStyle: "italic",
      lineHeight: 1.5,
    },
    sampleBtn: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 4 : 6,
      padding: isMobile ? "5px 8px" : "8px 14px",
      backgroundColor: isDark ? "#2d2d30" : "#f3f4f6",
      border: "none",
      borderRadius: isMobile ? 5 : 8,
      fontSize: isMobile ? 11 : 13,
      color: colors.textSecondary,
      cursor: "pointer",
    },
    pillGroup: {
      display: "flex",
      flexWrap: "wrap",
      gap: isMobile ? 4 : 8,
    },
    pill: {
      padding: isMobile ? "5px 8px" : "10px 16px",
      borderRadius: isMobile ? 12 : 20,
      fontSize: isMobile ? 10 : 13,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s",
      border: `1px solid ${isDark ? "#2d2d30" : "#e5e7eb"}`,
      backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
      color: colors.textSecondary,
    },
    pillActive: {
      backgroundColor: "#8B5CF6",
      borderColor: "#8B5CF6",
      color: "#fff",
    },
    colorPicker: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 4 : 12,
      flexWrap: isMobile ? "wrap" : "nowrap",
    },
    colorSwatch: {
      width: isMobile ? 28 : 40,
      height: isMobile ? 28 : 40,
      borderRadius: isMobile ? 4 : 10,
      border: `2px solid ${isDark ? "#333" : "#e5e7eb"}`,
      cursor: "pointer",
      flexShrink: 0,
    },
    slider: {
      width: "100%",
      height: 6,
      borderRadius: 3,
      background: isDark ? "#2d2d30" : "#e5e7eb",
      appearance: "none",
      cursor: "pointer",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      gap: isMobile ? 8 : 16,
    },
    col: {
      flex: 1,
      minWidth: 0,
    },
    imageGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: isMobile ? 4 : 10,
    },
    imageThumbnail: {
      width: "100%",
      aspectRatio: "9/16",
      objectFit: "cover",
      borderRadius: isMobile ? 3 : 8,
      cursor: "pointer",
      border: `2px solid transparent`,
      transition: "all 0.2s",
    },
    imageThumbnailActive: {
      borderColor: "#8B5CF6",
      boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.3)",
    },
    voiceGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: isMobile ? 4 : 10,
    },
    voiceCard: {
      padding: isMobile ? 6 : 14,
      borderRadius: isMobile ? 6 : 12,
      border: `1px solid ${isDark ? "#2d2d30" : "#e5e7eb"}`,
      backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
      cursor: "pointer",
      transition: "all 0.2s",
      textAlign: "center",
    },
    voiceCardActive: {
      borderColor: "#8B5CF6",
      backgroundColor: "rgba(139, 92, 246, 0.1)",
    },
    voiceName: {
      fontSize: isMobile ? 10 : 14,
      fontWeight: 600,
      color: colors.textPrimary,
    },
    voiceGender: {
      fontSize: isMobile ? 8 : 11,
      color: "#8B5CF6",
      marginTop: isMobile ? 1 : 2,
    },
    voiceDesc: {
      fontSize: isMobile ? 8 : 11,
      color: colors.textSecondary,
      marginTop: isMobile ? 1 : 2,
      display: isMobile ? "none" : "block",
    },
    generateBtn: {
      width: "100%",
      padding: isMobile ? "8px 12px" : "14px 20px",
      background: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
      border: "none",
      borderRadius: isMobile ? 6 : 12,
      fontSize: isMobile ? 11 : 14,
      fontWeight: 600,
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: isMobile ? 5 : 10,
      marginTop: isMobile ? 8 : 16,
    },
    generateBtnDisabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    successBadge: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: isMobile ? "6px 8px" : "12px 16px",
      backgroundColor: isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(139, 92, 246, 0.1)",
      border: "1px solid rgba(139, 92, 246, 0.3)",
      borderRadius: isMobile ? 5 : 10,
      marginTop: isMobile ? 6 : 12,
    },
    previewBtn: {
      padding: isMobile ? "3px 6px" : "6px 12px",
      backgroundColor: "#8B5CF6",
      border: "none",
      borderRadius: isMobile ? 3 : 6,
      fontSize: isMobile ? 9 : 12,
      fontWeight: 500,
      color: "#fff",
      cursor: "pointer",
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? "#2d2d30" : "#e5e7eb",
      margin: isMobile ? "10px 0" : "20px 0",
    },
    uploadBtn: {
      width: "100%",
      padding: isMobile ? "6px 8px" : "12px 16px",
      backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
      border: `2px dashed ${isDark ? "#2d2d30" : "#e5e7eb"}`,
      borderRadius: isMobile ? 5 : 10,
      fontSize: isMobile ? 10 : 13,
      color: colors.textSecondary,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: isMobile ? 3 : 8,
    },
    toggleRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: isMobile ? "6px 0" : "12px 0",
    },
    toggle: {
      width: isMobile ? 36 : 48,
      height: isMobile ? 20 : 26,
      borderRadius: isMobile ? 10 : 13,
      backgroundColor: isDark ? "#2d2d30" : "#e5e7eb",
      cursor: "pointer",
      position: "relative",
      transition: "all 0.2s",
    },
    toggleActive: {
      backgroundColor: "#8B5CF6",
    },
    toggleKnob: {
      position: "absolute",
      top: isMobile ? 2 : 3,
      left: isMobile ? 2 : 3,
      width: isMobile ? 16 : 20,
      height: isMobile ? 16 : 20,
      borderRadius: isMobile ? 8 : 10,
      backgroundColor: "#fff",
      transition: "all 0.2s",
    },
    toggleKnobActive: {
      left: isMobile ? 18 : 25,
    },
    spinner: {
      width: 16,
      height: 16,
      border: "2px solid rgba(255,255,255,0.3)",
      borderTopColor: "#fff",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    },
  };

  // ============================================================================
  // RENDER PREVIEW
  // ============================================================================

  const getBackgroundStyle = (): React.CSSProperties => {
    if (state.backgroundType === "gradient") {
      return { background: state.backgroundGradient };
    } else if (state.backgroundType === "video") {
      return {};
    } else {
      return {
        backgroundImage: `url(${state.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
  };

  const renderPhonePreview = () => (
    <div style={styles.previewPanel}>
      <div style={styles.previewLabel}>Live Preview</div>
      <div style={styles.phoneFrame}>
        <div style={{ ...styles.phoneScreen, ...getBackgroundStyle() }}>
          {/* Video Background */}
          {state.backgroundType === "video" && (
            <video
              src={state.backgroundVideo}
              autoPlay
              muted
              loop
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: state.backgroundFilter,
              }}
            />
          )}
          
          {/* Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: state.backgroundOverlayColor,
            }}
          />

          {/* Quotation Mark */}
          {state.showQuotationMark && (
            <div
              style={{
                position: "absolute",
                top: "15%",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: `${state.quotationMarkSize * (isMobile ? 1.8 : 3)}px`,
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontStyle: "italic",
                color: state.quotationMarkColor,
                opacity: 0.8,
                lineHeight: 0.8,
              }}
            >
              "
            </div>
          )}

          {/* Quote Text */}
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "8%",
              right: "8%",
              textAlign: state.quoteTextAlign,
            }}
          >
            <p
              style={{
                fontSize: `${state.quoteFontSize * (isMobile ? 1.8 : 3)}px`,
                fontFamily: state.quoteFontFamily,
                fontStyle: state.quoteFontStyle,
                color: state.quoteFontColor,
                lineHeight: 1.4,
                textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                margin: 0,
              }}
            >
              {state.quoteText || "Your quote..."}
            </p>
          </div>

          {/* Author */}
          {state.authorName && (
            <div
              style={{
                position: "absolute",
                bottom: "15%",
                left: "8%",
                right: "8%",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: `${state.authorFontSize * (isMobile ? 1.8 : 3)}px`,
                  fontFamily: state.quoteFontFamily,
                  color: state.authorFontColor,
                  margin: 0,
                  textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                }}
              >
                — {state.authorName.toUpperCase()}
              </p>
              {state.authorTitle && (
                <p
                  style={{
                    fontSize: `${(state.authorFontSize - 0.5) * (isMobile ? 1.8 : 3)}px`,
                    color: "rgba(255,255,255,0.7)",
                    marginTop: isMobile ? 2 : 4,
                  }}
                >
                  {state.authorTitle}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // STEP RENDERERS
  // ============================================================================

  const renderContentStep = () => (
    <>
      <div style={styles.card}>
        <div style={styles.cardTitle}>✍️ Quote Content</div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Quote Text</label>
          <textarea
            style={styles.textarea}
            placeholder="Enter your inspirational quote here..."
            value={state.quoteText}
            onChange={(e) => updateState({ quoteText: e.target.value })}
            rows={4}
          />
          <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
            <button style={styles.sampleBtn} onClick={loadSampleQuote}>
              ✨ Load Sample
            </button>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.row}>
          <div style={styles.col}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Author Name</label>
              <input
                type="text"
                style={styles.input}
                placeholder="e.g., Albert Einstein"
                value={state.authorName}
                onChange={(e) => updateState({ authorName: e.target.value })}
              />
            </div>
          </div>
          <div style={styles.col}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Author Title (optional)</label>
              <input
                type="text"
                style={styles.input}
                placeholder="e.g., Physicist"
                value={state.authorTitle}
                onChange={(e) => updateState({ authorTitle: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderStyleStep = () => (
    <>
      <div style={styles.card}>
        <div style={styles.cardTitle}>🎨 Quote Style</div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Font Family</label>
          <div style={styles.pillGroup}>
            {FONT_FAMILIES.map((font) => (
              <button
                key={font.value}
                style={{
                  ...styles.pill,
                  ...(state.quoteFontFamily === font.value ? styles.pillActive : {}),
                  fontFamily: font.value,
                }}
                onClick={() => updateState({ quoteFontFamily: font.value })}
              >
                {font.label}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.col}>
            <label style={styles.label}>
              <span>Quote Size</span>
              <span style={styles.labelValue}>{state.quoteFontSize}%</span>
            </label>
            <input
              type="range"
              min="2"
              max="8"
              step="0.5"
              value={state.quoteFontSize}
              onChange={(e) => updateState({ quoteFontSize: parseFloat(e.target.value) })}
              style={styles.slider}
            />
          </div>
          <div style={styles.col}>
            <label style={styles.label}>Quote Color</label>
            <div style={styles.colorPicker}>
              <input
                type="color"
                value={state.quoteFontColor}
                onChange={(e) => updateState({ quoteFontColor: e.target.value })}
                style={{ ...styles.colorSwatch, backgroundColor: state.quoteFontColor }}
              />
              <input
                type="text"
                value={state.quoteFontColor}
                onChange={(e) => updateState({ quoteFontColor: e.target.value })}
                style={{ ...styles.input, width: isMobile ? 60 : 100 }}
              />
            </div>
          </div>
        </div>

        <div style={{ ...styles.row, marginTop: isMobile ? 8 : 16 }}>
          <div style={styles.col}>
            <label style={styles.label}>Font Style</label>
            <div style={styles.pillGroup}>
              {[
                { value: "normal", label: "Normal" },
                { value: "italic", label: "Italic" },
              ].map((style) => (
                <button
                  key={style.value}
                  style={{
                    ...styles.pill,
                    ...(state.quoteFontStyle === style.value ? styles.pillActive : {}),
                  }}
                  onClick={() => updateState({ quoteFontStyle: style.value as "normal" | "italic" })}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
          <div style={styles.col}>
            <label style={styles.label}>Text Align</label>
            <div style={styles.pillGroup}>
              {[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ].map((align) => (
                <button
                  key={align.value}
                  style={{
                    ...styles.pill,
                    ...(state.quoteTextAlign === align.value ? styles.pillActive : {}),
                  }}
                  onClick={() => updateState({ quoteTextAlign: align.value as "left" | "center" | "right" })}
                >
                  {align.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.cardTitle}>📝 Quotation Mark</div>
        
        <div style={styles.toggleRow}>
          <span style={{ color: colors.textPrimary, fontSize: isMobile ? 11 : 14 }}>Show Quotation Mark</span>
          <div
            style={{
              ...styles.toggle,
              ...(state.showQuotationMark ? styles.toggleActive : {}),
            }}
            onClick={() => updateState({ showQuotationMark: !state.showQuotationMark })}
          >
            <div
              style={{
                ...styles.toggleKnob,
                ...(state.showQuotationMark ? styles.toggleKnobActive : {}),
              }}
            />
          </div>
        </div>

        {state.showQuotationMark && (
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>
                <span>Size</span>
                <span style={styles.labelValue}>{state.quotationMarkSize}%</span>
              </label>
              <input
                type="range"
                min="4"
                max="15"
                step="1"
                value={state.quotationMarkSize}
                onChange={(e) => updateState({ quotationMarkSize: parseInt(e.target.value) })}
                style={styles.slider}
              />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Color</label>
              <input
                type="color"
                value={state.quotationMarkColor}
                onChange={(e) => updateState({ quotationMarkColor: e.target.value })}
                style={{ ...styles.colorSwatch, backgroundColor: state.quotationMarkColor }}
              />
            </div>
          </div>
        )}

        <div style={styles.divider} />

        <div style={styles.cardTitle}>✨ Animations</div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Quote Animation</label>
          <div style={styles.pillGroup}>
            {QUOTE_ANIMATIONS.map((anim) => (
              <button
                key={anim.value}
                style={{
                  ...styles.pill,
                  ...(state.quoteAnimation === anim.value ? styles.pillActive : {}),
                }}
                onClick={() => updateState({ quoteAnimation: anim.value as any })}
              >
                {anim.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderBackgroundStep = () => (
    <>
      <div style={styles.card}>
        <div style={styles.cardTitle}>🖼️ Background Type</div>
        
        <div style={styles.pillGroup}>
          {[
            { value: "image", label: "🖼️ Image" },
            { value: "video", label: "🎬 Video" },
            { value: "gradient", label: "🌈 Gradient" },
          ].map((type) => (
            <button
              key={type.value}
              style={{
                ...styles.pill,
                ...(state.backgroundType === type.value ? styles.pillActive : {}),
              }}
              onClick={() => updateState({ backgroundType: type.value as "image" | "video" | "gradient" })}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div style={styles.divider} />

        {state.backgroundType === "image" && (
          <>
            <label style={styles.label}>Choose Background Image</label>
            <div style={styles.imageGrid}>
              {BACKGROUND_IMAGES.map((img) => (
                <img
                  key={img.value}
                  src={img.value}
                  alt={img.label}
                  style={{
                    ...styles.imageThumbnail,
                    ...(state.backgroundImage === img.value ? styles.imageThumbnailActive : {}),
                  }}
                  onClick={() => updateState({ backgroundImage: img.value })}
                />
              ))}
            </div>
            <button 
              style={{ ...styles.uploadBtn, marginTop: isMobile ? 6 : 12 }} 
              onClick={() => imageInputRef.current?.click()}
            >
              📁 Upload Custom Image
            </button>
          </>
        )}

        {state.backgroundType === "video" && (
          <>
            <label style={styles.label}>Choose Background Video</label>
            <div style={styles.pillGroup}>
              {BACKGROUND_VIDEOS.map((vid) => (
                <button
                  key={vid.value}
                  style={{
                    ...styles.pill,
                    ...(state.backgroundVideo === vid.value ? styles.pillActive : {}),
                  }}
                  onClick={() => updateState({ backgroundVideo: vid.value })}
                >
                  {vid.label}
                </button>
              ))}
            </div>
            <button 
              style={{ ...styles.uploadBtn, marginTop: isMobile ? 6 : 12 }} 
              onClick={() => videoInputRef.current?.click()}
            >
              📁 Upload Custom Video
            </button>
          </>
        )}

        {state.backgroundType === "gradient" && (
          <>
            <label style={styles.label}>Choose Gradient</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: isMobile ? 4 : 10 }}>
              {BACKGROUND_GRADIENTS.map((grad) => (
                <div
                  key={grad.value}
                  style={{
                    height: isMobile ? 35 : 60,
                    borderRadius: isMobile ? 3 : 8,
                    background: grad.value,
                    cursor: "pointer",
                    border: state.backgroundGradient === grad.value 
                      ? "2px solid #8B5CF6" 
                      : "2px solid transparent",
                  }}
                  onClick={() => updateState({ backgroundGradient: grad.value })}
                />
              ))}
            </div>
          </>
        )}

        <div style={styles.divider} />

        <label style={styles.label}>
          <span>Overlay Darkness</span>
        </label>
        <input
          type="range"
          min="0"
          max="80"
          step="5"
          value={parseInt(state.backgroundOverlayColor.match(/[\d.]+(?=\))/)?.[0] || "50") * 100}
          onChange={(e) => updateState({ 
            backgroundOverlayColor: `rgba(0,0,0,${parseInt(e.target.value) / 100})` 
          })}
          style={styles.slider}
        />
      </div>
    </>
  );

  const renderAudioStep = () => (
    <>
      <div style={styles.card}>
        <div style={styles.cardTitle}>🎙️ Voiceover (Optional)</div>

        <div style={styles.toggleRow}>
          <span style={{ color: colors.textPrimary, fontSize: isMobile ? 11 : 14 }}>Enable AI Voiceover</span>
          <div
            style={{
              ...styles.toggle,
              ...(state.enableVoiceover ? styles.toggleActive : {}),
            }}
            onClick={() => updateState({ enableVoiceover: !state.enableVoiceover })}
          >
            <div
              style={{
                ...styles.toggleKnob,
                ...(state.enableVoiceover ? styles.toggleKnobActive : {}),
              }}
            />
          </div>
        </div>

        {state.enableVoiceover && (
          <>
            <div style={styles.divider} />

            <label style={styles.label}>Voice</label>
            <div style={styles.voiceGrid}>
              {AI_VOICES.map((voice) => (
                <div
                  key={voice.value}
                  style={{ ...styles.voiceCard, ...(state.aiVoice === voice.value ? styles.voiceCardActive : {}) }}
                  onClick={() => updateState({ aiVoice: voice.value, voiceoverGenerated: false, voiceoverUrl: "" })}
                >
                  <div style={styles.voiceName}>{voice.label}</div>
                  <div style={styles.voiceGender}>{voice.gender}</div>
                  <div style={styles.voiceDesc}>{voice.desc}</div>
                </div>
              ))}
            </div>

            <div style={styles.divider} />

            <label style={styles.label}>Emotion</label>
            <div style={styles.pillGroup}>
              {EMOTIONS.map((e) => (
                <button
                  key={e.value}
                  style={{ ...styles.pill, ...(state.emotion === e.value ? styles.pillActive : {}) }}
                  onClick={() => updateState({ emotion: e.value, voiceoverGenerated: false, voiceoverUrl: "" })}
                >
                  {e.icon} {e.label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: isMobile ? 8 : 16 }}>
              <label style={styles.label}>
                <span>Speed</span>
                <span style={styles.labelValue}>{state.speed.toFixed(1)}x</span>
              </label>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.1"
                value={state.speed}
                onChange={(e) => updateState({ speed: parseFloat(e.target.value), voiceoverGenerated: false, voiceoverUrl: "" })}
                style={styles.slider}
              />
            </div>

            <button
              style={{
                ...styles.generateBtn,
                ...(state.isGeneratingVoiceover || !state.quoteText.trim() ? styles.generateBtnDisabled : {}),
              }}
              onClick={handleGenerateVoiceover}
              disabled={state.isGeneratingVoiceover || !state.quoteText.trim()}
            >
              {state.isGeneratingVoiceover ? (
                <>
                  <div style={styles.spinner} />
                  Generating...
                </>
              ) : state.voiceoverGenerated && state.voiceoverUrl ? (
                <>✅ Regenerate Voiceover</>
              ) : (
                <>🎙️ Generate Voiceover</>
              )}
            </button>

            {state.voiceoverGenerated && state.voiceoverUrl && (
              <div style={styles.successBadge}>
                <span style={{ fontSize: isMobile ? 10 : 13, fontWeight: 500, color: "#8B5CF6" }}>
                  ✓ Voiceover Ready
                </span>
                <button style={styles.previewBtn} onClick={handlePreviewVoiceover}>
                  ▶️ Play
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>🎵 Background Music</div>

        <div style={styles.pillGroup}>
          {BACKGROUND_MUSIC.map((music) => (
            <button
              key={music.value}
              style={{ ...styles.pill, ...(state.backgroundMusicPath === music.value ? styles.pillActive : {}) }}
              onClick={() => updateState({ backgroundMusicPath: music.value })}
            >
              {music.icon} {music.label}
            </button>
          ))}
        </div>

        {state.backgroundMusicPath && (
          <div style={{ marginTop: isMobile ? 8 : 16 }}>
            <label style={styles.label}>Volume: {Math.round(state.musicVolume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={state.musicVolume * 100}
              onChange={(e) => updateState({ musicVolume: Number(e.target.value) / 100 })}
              style={styles.slider}
            />
          </div>
        )}
      </div>
    </>
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
      `}</style>
      
      <header style={styles.header}>
        <div style={styles.logo} onClick={() => navigate(-1)}>
          <span style={{ fontSize: isMobile ? 16 : 20 }}>←</span>
          <span style={{ color: "#8B5CF6" }}>Quote</span> Video
        </div>

        <div style={styles.stepNav}>
          {STEPS.map((step) => (
            <button
              key={step.id}
              style={{ ...styles.stepPill, ...(currentStep === step.id ? styles.stepPillActive : {}) }}
              onClick={() => setCurrentStep(step.id)}
            >
              {step.icon} {!isMobile && step.label}
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
        <div style={styles.controlsPanel}>
          {currentStep === "content" && renderContentStep()}
          {currentStep === "style" && renderStyleStep()}
          {currentStep === "background" && renderBackgroundStep()}
          {currentStep === "audio" && renderAudioStep()}
        </div>
      </main>

      {/* Hidden File Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        style={{ display: "none" }}
        onChange={handleVideoUpload}
      />
    </div>
  );
};

export default QuoteVideoWizard;