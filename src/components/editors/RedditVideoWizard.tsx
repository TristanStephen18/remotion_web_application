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
  // Script
  postUrl: string;
  postTitle: string;
  postText: string;

  // Reddit Card Customization (NEW)
  subredditName: string;
  posterUsername: string;
  timePosted: string;
  upvotes: string;
  commentCount: string;
  awardsCount: string;
  avatarUrl: string;

  // Generated Data
  words: WordTiming[];
  voiceoverUrl: string;
  estimatedDuration: number;

  // Style
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  sentenceBgColor: string;
  backgroundOverlayColor: string;

  // Video
  backgroundVideo: string;

  // Audio
  aiVoice: string;
  emotion: string;
  speed: number;
  pitch: number;
  backgroundMusicPath: string;
  musicVolume: number;

  // UI State
  isGeneratingVoiceover: boolean;
  voiceoverGenerated: boolean;
  isImportingPost: boolean;
}

type WizardStep = "script" | "style" | "video" | "audio";

// ============================================================================
// CONSTANTS
// ============================================================================

const STEPS: { id: WizardStep; label: string; icon: string }[] = [
  { id: "script", label: "Script", icon: "📝" },
  { id: "style", label: "Style", icon: "🎨" },
  { id: "video", label: "Video", icon: "🎬" },
  { id: "audio", label: "Audio", icon: "🎵" },
];

const FONT_FAMILIES = [
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
  { value: "'Bebas Neue', sans-serif", label: "Bebas Neue" },
  { value: "'Oswald', sans-serif", label: "Oswald" },
  { value: "'Anton', sans-serif", label: "Anton" },
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "'Roboto Condensed', sans-serif", label: "Roboto" },
];

const AI_VOICES = [
  {
    value: "alloy",
    label: "Alloy",
    gender: "Neutral",
    desc: "Balanced, clear",
  },
  { value: "echo", label: "Echo", gender: "Male", desc: "Deep, authoritative" },
  {
    value: "fable",
    label: "Fable",
    gender: "Male",
    desc: "Warm, storytelling",
  },
  { value: "onyx", label: "Onyx", gender: "Male", desc: "Professional, news" },
  { value: "nova", label: "Nova", gender: "Female", desc: "Energetic, young" },
  {
    value: "shimmer",
    label: "Shimmer",
    gender: "Female",
    desc: "Soft, friendly",
  },
];

const EMOTIONS = [
  { value: "neutral", label: "Neutral", icon: "😐" },
  { value: "happy", label: "Happy", icon: "😊" },
  { value: "excited", label: "Excited", icon: "🤩" },
  { value: "calm", label: "Calm", icon: "😌" },
  { value: "sad", label: "Sad", icon: "😢" },
  { value: "angry", label: "Angry", icon: "😠" },
];

const BACKGROUND_VIDEOS = [
  {
    value:
      "https://res.cloudinary.com/dcu9xuof0/video/upload/v1765260195/Subway_Surfers_2024_-_Gameplay_4K_9x16_No_Copyright_n4ym8w.mp4",
    label: "Subway Surfers",
  },
  {
    value:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    label: "Abstract Fire",
  },
  {
    value:
      "https://res.cloudinary.com/djnyytyd0/video/upload/v1764558376/the_way_they_got_so_much_aura_so_tuff_song_ilyTOMMY_-_pretty_ho3_..._sar5qk.mp4",
    label: "Aura Dance",
  },
  {
    value:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    label: "Nature",
  },
];

const BACKGROUND_MUSIC = [
  { value: "", label: "None", icon: "🔇" },
  { value: "lofi", label: "Lo-Fi Chill", icon: "☕" },
  { value: "dramatic", label: "Dramatic", icon: "🎭" },
  { value: "upbeat", label: "Upbeat", icon: "⚡" },
];

const SAMPLE_REDDIT_DATA = {
  title:
    "AITA for refusing to help my grandparents close their summer house unless they pay me?",
  text: "Me (21F), a university student. My grandparents have a summer cabin which all of my family uses.",
  story: `Me, a 21 year old female, I am a university student. My grandparents have a summer cabin out in the country, which all of my family uses. Every year around this time, it needs to be "closed up" for the winter.

This year, I have exams coming up and I'm tight on money, so I wasn't planning on going. My grandma called me and begged me to come because they are getting too old to scrub the floors themselves.

A few hours later, I texted my cousin X (19M) to ask if we could drive up together. X texted back: "Yeah sure, Grandpa is transferring me $200 for gas and labor."

I was shocked. I called my grandma to ask about this. She said, "Well yes, we are paying X because he is doing the heavy work. We need you for the indoor work - that's just helping out."

I told her: "If you are paying X for his time, I expect to be compensated too."

My grandma said she was disappointed that I was being so "transactional" about family. AITA?`,
};

// ============================================================================
// HELPER: Estimate word timing for karaoke
// ============================================================================

function estimateWordTimings(text: string, speed: number = 1.0): WordTiming[] {
  const words = text.split(/\s+/).filter((w) => w.trim());
  const baseWordsPerSecond = 2.5 * speed;
  const avgWordDuration = 1 / baseWordsPerSecond;

  let currentTime = 0;

  return words.map((word) => {
    const wordLength = word.replace(/[^a-zA-Z]/g, "").length;
    const duration = avgWordDuration * (0.8 + (wordLength / 10) * 0.4);

    const timing: WordTiming = {
      word: word,
      start: currentTime,
      end: currentTime + duration,
    };

    currentTime += duration;

    if (/[.!?]$/.test(word)) {
      currentTime += 0.4 / speed;
    } else if (/[,;:]$/.test(word)) {
      currentTime += 0.2 / speed;
    }

    return timing;
  });
}

function calculateDuration(words: WordTiming[]): number {
  if (words.length === 0) return 0;
  return words[words.length - 1].end;
}

// ============================================================================
// COMPONENT
// ============================================================================

const RedditVideoWizard: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const isDark = colors.bgPrimary !== "#ffffff";
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const [currentStep, setCurrentStep] = useState<WizardStep>("script");
  const [state, setState] = useState<WizardState>({
    postUrl: "",
    postTitle: "",
    postText: "",
    subredditName: "AmItheAsshole",
    posterUsername: "throwaway",
    timePosted: "10h",
    upvotes: "12.4k",
    commentCount: "2.3k",
    awardsCount: "1",
    avatarUrl: "",
    words: [],
    voiceoverUrl: "",
    estimatedDuration: 0,
    fontSize: 48,
    fontFamily: "'Montserrat', sans-serif",
    fontColor: "#ffffff",
    sentenceBgColor: "#FF4500",
    backgroundOverlayColor: "rgba(0,0,0,0.5)",
    backgroundVideo: BACKGROUND_VIDEOS[0].value,
    aiVoice: "nova",
    emotion: "neutral",
    speed: 1.0,
    pitch: 1.0,
    backgroundMusicPath: "",
    musicVolume: 0.15,
    isGeneratingVoiceover: false,
    voiceoverGenerated: false,
    isImportingPost: false,
  });

  const updateState = useCallback((updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  // ============================================================================
  // VOICEOVER GENERATION - Uploads to get persistent URL
  // ============================================================================

  const handleGenerateVoiceover = async () => {
    if (!state.postText.trim()) {
      toast.error("Please enter story text first");
      return;
    }

    if (state.postText.length < 5) {
      toast.error("Text must be at least 5 characters");
      return;
    }

    if (state.postText.length > 4000) {
      toast.error("Text must be less than 4000 characters");
      return;
    }

    updateState({ isGeneratingVoiceover: true });

    try {
      // Step 1: Generate voiceover (returns raw MP3)
      const response = await fetch(
        `${backendPrefix}/sound/generate-voiceover`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: state.postText,
            voice: state.aiVoice,
            emotion: state.emotion,
            speed: state.speed,
            pitch: state.pitch,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate voiceover");

      const audioBlob = await response.blob();
      const persistentUrl = URL.createObjectURL(audioBlob);
      console.log("🎙️ Voiceover URL:", persistentUrl);

      const wordTimings = estimateWordTimings(state.postText, state.speed);
      const duration = calculateDuration(wordTimings);

      updateState({
        voiceoverUrl: persistentUrl,
        words: wordTimings,
        estimatedDuration: duration,
        isGeneratingVoiceover: false,
        voiceoverGenerated: true,
      });

      toast.success("Voiceover generated! 🎙️");
    } catch (error) {
      console.error("Generate voiceover error:", error);

      const wordTimings = estimateWordTimings(state.postText, state.speed);
      const duration = calculateDuration(wordTimings);

      updateState({
        words: wordTimings,
        estimatedDuration: duration,
        isGeneratingVoiceover: false,
        voiceoverGenerated: true,
        voiceoverUrl: "",
      });

      toast.error("Voiceover failed - using estimated timing only");
    }
  };

  // Preview the generated voiceover
  const handlePreviewVoiceover = () => {
    if (state.voiceoverUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(state.voiceoverUrl);
      audioRef.current = audio;

      // Debug the audio element
      audio.addEventListener("loadedmetadata", () => {
        console.log("🎵 Audio metadata:", {
          duration: audio.duration,
          readyState: audio.readyState,
          src: audio.src.substring(0, 60),
        });
      });

      audio.addEventListener("error", () => {
        console.error("❌ Audio error:", audio.error);
        toast.error("Audio load error");
      });

      audio.volume = 1.0;

      audio
        .play()
        .then(() => {
          console.log("✅ Audio playing:", {
            currentTime: audio.currentTime,
            duration: audio.duration,
            paused: audio.paused,
            volume: audio.volume,
            muted: audio.muted,
          });
          toast.success("Playing voiceover...");
        })
        .catch((err) => {
          console.error("❌ Play failed:", err);
          toast.error("Failed: " + err.message);
        });
    } else {
      toast.error("Generate voiceover first");
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
    updateState({ backgroundVideo: videoUrl });
    toast.success("Custom video uploaded!");
  }
};

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  const canProceed = useCallback(() => {
    if (currentStep === "script")
      return state.postTitle.trim() && state.postText.trim();
    return true;
  }, [currentStep, state.postTitle, state.postText]);

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

  const loadSampleData = () => {
    const estimatedWords = estimateWordTimings(
      SAMPLE_REDDIT_DATA.story,
      state.speed
    );
    const duration = calculateDuration(estimatedWords);

    updateState({
      postTitle: SAMPLE_REDDIT_DATA.title,
      postText: SAMPLE_REDDIT_DATA.story,
      words: estimatedWords,
      estimatedDuration: duration,
    });
    toast.success("Sample loaded!");
  };


  const handleImportFromUrl = async () => {
  if (!state.postUrl.trim()) {
    toast.error("Please enter a Reddit URL");
    return;
  }

  updateState({ isImportingPost: true });

  try {
    // Extract post ID from Reddit URL
    const urlMatch = state.postUrl.match(/comments\/([a-z0-9]+)/i);
    if (!urlMatch) {
      throw new Error("Invalid Reddit URL format");
    }

    const postId = urlMatch[1];
    const jsonUrl = `https://www.reddit.com/comments/${postId}.json`;

    const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(jsonUrl)}`);
    if (!response.ok) throw new Error("Failed to fetch post");

    const data = await response.json();
    const post = data[0]?.data?.children?.[0]?.data;

    if (!post) throw new Error("Post not found");

    const estimatedWords = estimateWordTimings(post.selftext || post.title, state.speed);
    const duration = calculateDuration(estimatedWords);

    updateState({
      postTitle: post.title,
      postText: post.selftext || post.title,
      subredditName: post.subreddit,
      posterUsername: post.author,
      upvotes: post.score >= 1000 ? `${(post.score / 1000).toFixed(1)}k` : String(post.score),
      commentCount: post.num_comments >= 1000 ? `${(post.num_comments / 1000).toFixed(1)}k` : String(post.num_comments),
      words: estimatedWords,
      estimatedDuration: duration,
      isImportingPost: false,
    });

    toast.success("Reddit post imported!");
  } catch (error) {
    console.error("Import error:", error);
    updateState({ isImportingPost: false });
    toast.error("Failed to import post. Check the URL and try again.");
  }
};

  const proceedToEditor = () => {
    let words = state.words;
    let duration = state.estimatedDuration;

    if (words.length === 0 && state.postText) {
      words = estimateWordTimings(state.postText, state.speed);
      duration = calculateDuration(words);
    }

    const config = {
      script: {
        title: state.postTitle,
        text: state.postText,
        story: state.postText,
        duration: duration,
        words: words,
      },
      redditCard: {
        subredditName: state.subredditName,
        posterUsername: state.posterUsername,
        timePosted: state.timePosted,
        upvotes: state.upvotes,
        commentCount: state.commentCount,
        awardsCount: state.awardsCount,
        avatarUrl: state.avatarUrl,
      },
      style: {
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        fontColor: state.fontColor,
        sentenceBgColor: state.sentenceBgColor,
        backgroundOverlayColor: state.backgroundOverlayColor,
      },
      video: {
        backgroundVideo: state.backgroundVideo,
      },
      audio: {
        aiVoice: state.aiVoice,
        voiceoverPath: state.voiceoverUrl, // Persistent URL (uploaded or base64)
        backgroundMusicPath: state.backgroundMusicPath,
        musicVolume: state.musicVolume,
      },
    };

    console.log("📦 Saving config to sessionStorage:", config);
    console.log(
      "🎙️ Voiceover URL:",
      state.voiceoverUrl ? state.voiceoverUrl.substring(0, 100) + "..." : "NONE"
    );

    sessionStorage.setItem("redditVideoConfig", JSON.stringify(config));

    // Clear any persisted editor state for template 10 so fresh layers are created
    localStorage.removeItem("editor_state_template_10");

    // Also clear any other possible keys
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.includes("template_10")) {
        localStorage.removeItem(key);
      }
    }
    console.log("🧹 Cleared persisted state before navigating to editor");

    navigate("/editor?template=10&fromWizard=true");
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
      padding: "16px 24px",
      borderBottom: `1px solid ${isDark ? "#1f1f23" : "#e5e7eb"}`,
      backgroundColor: isDark ? "#111113" : "#ffffff",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 18,
      fontWeight: 700,
      color: colors.textPrimary,
      cursor: "pointer",
    },
    stepNav: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      backgroundColor: isDark ? "#1a1a1d" : "#f3f4f6",
      padding: 4,
      borderRadius: 12,
    },
    stepPill: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 16px",
      borderRadius: 8,
      fontSize: 13,
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
      boxShadow: isDark
        ? "0 2px 8px rgba(0,0,0,0.3)"
        : "0 2px 8px rgba(0,0,0,0.08)",
    },
    headerActions: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    btnSecondary: {
      padding: "10px 20px",
      backgroundColor: "transparent",
      border: `1px solid ${isDark ? "#333" : "#e5e7eb"}`,
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 500,
      color: colors.textPrimary,
      cursor: "pointer",
    },
    btnPrimary: {
      padding: "10px 24px",
      background: "linear-gradient(135deg, #FF4500 0%, #FF5722 100%)",
      border: "none",
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 600,
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    main: {
      flex: 1,
      display: "flex",
      maxWidth: 1400,
      margin: "0 auto",
      width: "100%",
      padding: 24,
      gap: 32,
    },
    previewPanel: {
      width: 340,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
    },
    phoneFrame: {
      width: 300,
      height: 600,
      backgroundColor: "#000",
      borderRadius: 36,
      padding: 10,
      boxShadow: isDark
        ? "0 25px 50px rgba(0,0,0,0.5), inset 0 0 0 2px #333"
        : "0 25px 50px rgba(0,0,0,0.15), inset 0 0 0 2px #e5e7eb",
      position: "relative",
      overflow: "hidden",
    },
    phoneScreen: {
      width: "100%",
      height: "100%",
      borderRadius: 26,
      overflow: "hidden",
      position: "relative",
      backgroundColor: "#1a1a1a",
    },
    previewLabel: {
      fontSize: 12,
      fontWeight: 600,
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    controlsPanel: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 20,
    },
    card: {
      backgroundColor: isDark ? "#141416" : "#ffffff",
      borderRadius: 16,
      border: `1px solid ${isDark ? "#1f1f23" : "#e5e7eb"}`,
      padding: 24,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: 600,
      color: colors.textPrimary,
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 12,
      fontWeight: 500,
      color: colors.textSecondary,
      marginBottom: 6,
      textTransform: "uppercase",
      letterSpacing: "0.03em",
    },
    labelValue: {
      color: "#14b8a6",
      fontWeight: 600,
    },
    input: {
      width: "100%",
      padding: "12px 14px",
      backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
      border: `1px solid ${isDark ? "#2d2d30" : "#e5e7eb"}`,
      borderRadius: 10,
      fontSize: 14,
      color: colors.textPrimary,
      outline: "none",
    },
    textarea: {
      width: "100%",
      padding: "12px 14px",
      backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
      border: `1px solid ${isDark ? "#2d2d30" : "#e5e7eb"}`,
      borderRadius: 10,
      fontSize: 14,
      color: colors.textPrimary,
      outline: "none",
      resize: "vertical",
      minHeight: 140,
      lineHeight: 1.6,
      fontFamily: "inherit",
    },
    row: {
      display: "flex",
      gap: 12,
    },
    col: {
      flex: 1,
    },
    pillGroup: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
    },
    pill: {
      padding: "8px 14px",
      backgroundColor: isDark ? "#1a1a1d" : "#f3f4f6",
      border: `1px solid ${isDark ? "#2d2d30" : "#e5e7eb"}`,
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 500,
      color: colors.textSecondary,
      cursor: "pointer",
      transition: "all 0.2s",
    },
    pillActive: {
      backgroundColor: "#FF4500",
      borderColor: "#FF4500",
      color: "#fff",
    },
    videoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12,
    },
    videoCard: {
      aspectRatio: "9/16",
      borderRadius: 12,
      overflow: "hidden",
      cursor: "pointer",
      position: "relative",
      border: "3px solid transparent",
      transition: "all 0.2s",
    },
    videoCardActive: {
      borderColor: "#FF4500",
    },
    videoThumb: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    videoLabel: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: "20px 8px 8px",
      background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
      fontSize: 11,
      fontWeight: 600,
      color: "#fff",
      textAlign: "center",
    },
    colorPicker: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    colorSwatch: {
      width: 36,
      height: 36,
      borderRadius: 8,
      border: `2px solid ${isDark ? "#333" : "#e5e7eb"}`,
      cursor: "pointer",
      overflow: "hidden",
    },
    colorInput: {
      width: "100%",
      height: "100%",
      border: "none",
      cursor: "pointer",
    },
    slider: {
      width: "100%",
      height: 6,
      borderRadius: 3,
      appearance: "none",
      background: isDark ? "#2d2d30" : "#e5e7eb",
      outline: "none",
      cursor: "pointer",
    },
    sliderRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    sliderValue: {
      fontSize: 13,
      fontWeight: 600,
      color: colors.textPrimary,
      minWidth: 48,
      textAlign: "right",
    },
    voiceGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 10,
    },
    voiceCard: {
      padding: "14px 12px",
      backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
      border: `2px solid ${isDark ? "#2d2d30" : "#e5e7eb"}`,
      borderRadius: 12,
      cursor: "pointer",
      textAlign: "center",
      transition: "all 0.2s",
    },
    voiceCardActive: {
      borderColor: "#14b8a6",
      backgroundColor: isDark
        ? "rgba(20, 184, 166, 0.15)"
        : "rgba(20, 184, 166, 0.1)",
    },
    voiceName: {
      fontSize: 13,
      fontWeight: 600,
      color: colors.textPrimary,
    },
    voiceGender: {
      fontSize: 11,
      color: "#14b8a6",
      marginTop: 2,
    },
    voiceDesc: {
      fontSize: 10,
      color: colors.textSecondary,
      marginTop: 2,
    },
    emotionGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gap: 8,
    },
    emotionBtn: {
      padding: "10px 8px",
      backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
      border: `1px solid ${isDark ? "#2d2d30" : "#e5e7eb"}`,
      borderRadius: 10,
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      transition: "all 0.2s",
    },
    emotionBtnActive: {
      borderColor: "#14b8a6",
      backgroundColor: isDark
        ? "rgba(20, 184, 166, 0.15)"
        : "rgba(20, 184, 166, 0.1)",
    },
    generateBtn: {
      width: "100%",
      padding: "14px 20px",
      background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
      border: "none",
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 600,
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginTop: 16,
      transition: "all 0.2s",
    },
    generateBtnDisabled: {
      background: "#333",
      cursor: "not-allowed",
      opacity: 0.6,
    },
    successBadge: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 14px",
      backgroundColor: isDark
        ? "rgba(16, 185, 129, 0.15)"
        : "rgba(16, 185, 129, 0.1)",
      border: "1px solid rgba(16, 185, 129, 0.3)",
      borderRadius: 10,
      marginTop: 12,
    },
    previewBtn: {
      padding: "6px 12px",
      backgroundColor: "#10B981",
      border: "none",
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 600,
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 4,
    },
    stats: {
      display: "flex",
      gap: 20,
      marginTop: 16,
      padding: "16px",
      backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
      borderRadius: 12,
    },
    stat: {
      textAlign: "center",
      flex: 1,
    },
    statValue: {
      fontSize: 22,
      fontWeight: 700,
      color: colors.textPrimary,
    },
    statLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
      textTransform: "uppercase",
    },
    previewVideo: {
      position: "absolute",
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    previewOverlay: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    previewRedditCard: {
      backgroundColor: "#fff",
      borderRadius: 14,
      padding: 18,
      width: "92%",
      boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
    },
    quickAction: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 14px",
      backgroundColor: isDark ? "#1a1a1d" : "#f3f4f6",
      border: `1px solid ${isDark ? "#2d2d30" : "#e5e7eb"}`,
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 500,
      color: colors.textSecondary,
      cursor: "pointer",
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? "#1f1f23" : "#e5e7eb",
      margin: "16px 0",
    },
    estimateBox: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "12px 14px",
      backgroundColor: isDark
        ? "rgba(20, 184, 166, 0.1)"
        : "rgba(20, 184, 166, 0.05)",
      border: "1px solid rgba(20, 184, 166, 0.2)",
      borderRadius: 10,
      marginTop: 16,
    },
    spinner: {
      width: 16,
      height: 16,
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderTopColor: "white",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    },
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderPhonePreview = () => (
    <div style={styles.previewPanel}>
      <div style={styles.previewLabel}>Live Preview</div>
      <div style={styles.phoneFrame}>
        <div style={styles.phoneScreen}>
          <video
            key={state.backgroundVideo}
            src={state.backgroundVideo}
            style={styles.previewVideo}
            muted
            loop
            autoPlay
            playsInline
          />
          <div
            style={{
              ...styles.previewOverlay,
              backgroundColor: state.backgroundOverlayColor,
            }}
          >
            {currentStep === "script" || currentStep === "style" ? (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 8,
                  padding: "12px 14px",
                  width: "92%",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                }}
              >
                {/* Header Row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 6,
                    }}
                  >
                    {/* Avatar */}
                    {state.avatarUrl ? (
                      <img
                        src={state.avatarUrl}
                        alt="avatar"
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #00D8D6 0%, #0079D3 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <circle cx="12" cy="8" r="5" fill="white" />
                          <path d="M4 20c0-4 4-7 8-7s8 3 8 7" fill="white" />
                        </svg>
                      </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {/* Subreddit + Time */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: "#1a1a1b",
                          }}
                        >
                          r/{state.subredditName || "Advice"}
                        </span>
                        <span style={{ fontSize: 9, color: "#576f76" }}>•</span>
                        <span style={{ fontSize: 9, color: "#576f76" }}>
                          {state.timePosted || "1d ago"}
                        </span>
                      </div>
                      {/* Username */}
                      <span style={{ fontSize: 8, color: "#576f76" }}>
                        {state.posterUsername || "Superb_Community_339"}
                      </span>
                    </div>
                  </div>

                  {/* Three Dots */}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="#576f76"
                  >
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                  </svg>
                </div>

                {/* Title */}
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    margin: "0 0 6px 0",
                    lineHeight: 1.3,
                    color: "#1a1a1b",
                  }}
                >
                  {state.postTitle || "Your title will appear here..."}
                </div>

                {/* Body */}
                <div
                  style={{
                    fontSize: 9,
                    lineHeight: 1.5,
                    color: "#1a1a1b",
                  }}
                >
                  {(state.postText || "Your story preview text...").slice(
                    0,
                    80
                  )}
                  {(state.postText || "").length > 80 && "..."}
                </div>

                {/* Engagement Bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 10,
                    paddingTop: 8,
                  }}
                >
                  {/* Upvote Pill */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      backgroundColor: "#f6f7f8",
                      borderRadius: 12,
                      padding: "4px 8px",
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#576f76"
                      strokeWidth="2.5"
                    >
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                    <span
                      style={{ fontSize: 8, fontWeight: 600, color: "#1a1a1b" }}
                    >
                      {state.upvotes || "2.9K"}
                    </span>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#576f76"
                      strokeWidth="2.5"
                    >
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                  </div>

                  {/* Comments Pill */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      backgroundColor: "#f6f7f8",
                      borderRadius: 12,
                      padding: "4px 8px",
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#576f76"
                      strokeWidth="2"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span
                      style={{ fontSize: 8, fontWeight: 500, color: "#576f76" }}
                    >
                      {state.commentCount || "1.8K"}
                    </span>
                  </div>

                  {/* Awards Pill */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      backgroundColor: "#f6f7f8",
                      borderRadius: 12,
                      padding: "4px 8px",
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="#FFD700"
                    >
                      <circle cx="12" cy="9" r="6" />
                      <path d="M8 15l-2 6 6-3 6 3-2-6" />
                    </svg>
                    <span
                      style={{ fontSize: 8, fontWeight: 500, color: "#576f76" }}
                    >
                      {state.awardsCount || "1"}
                    </span>
                  </div>

                  {/* Share Pill */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      backgroundColor: "#f6f7f8",
                      borderRadius: 12,
                      padding: "4px 8px",
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#576f76"
                      strokeWidth="2"
                    >
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                    <span
                      style={{ fontSize: 8, fontWeight: 500, color: "#576f76" }}
                    >
                      Share
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "rgba(0,0,0,0.6)",
                  borderRadius: 12,
                  padding: 20,
                  width: "90%",
                }}
              >
                <p
                  style={{
                    textAlign: "center",
                    color: state.fontColor,
                    fontFamily: state.fontFamily,
                    fontSize: state.fontSize / 3.5,
                    fontWeight: 700,
                    textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {(state.postText || "Story text preview...").slice(0, 120)}...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {state.postText && (
        <div style={styles.stats}>
          <div style={styles.stat}>
            <div style={styles.statValue}>
              {Math.ceil(
                state.estimatedDuration ||
                  state.postText.split(" ").length / 2.5
              )}
              s
            </div>
            <div style={styles.statLabel}>Duration</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statValue}>
              {state.postText.split(" ").length}
            </div>
            <div style={styles.statLabel}>Words</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statValue}>
              {state.voiceoverGenerated ? "✓" : "—"}
            </div>
            <div style={styles.statLabel}>Voice</div>
          </div>
        </div>
      )}
    </div>
  );

  const renderScriptStep = () => (
    <div style={styles.card}>
      <div style={styles.cardTitle}>
        📝 Script Content
        <button style={styles.quickAction} onClick={loadSampleData}>
          ✨ Load Sample
        </button>
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Post Title</label>
        <input
          type="text"
          placeholder="AITA for refusing to help my grandparents..."
          value={state.postTitle}
          onChange={(e) => updateState({ postTitle: e.target.value })}
          style={styles.input}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>
          <span>Story Text</span>
          <span style={{ color: colors.textSecondary }}>
            {state.postText.length}/4000
          </span>
        </label>
        <textarea
          placeholder="Paste your Reddit story here or type it out..."
          value={state.postText}
          onChange={(e) =>
            updateState({
              postText: e.target.value,
              words: [],
              voiceoverGenerated: false,
              voiceoverUrl: "",
            })
          }
          style={{ ...styles.textarea, minHeight: 180 }}
          maxLength={4000}
        />

        <div style={styles.card}>
          <div style={styles.cardTitle}>👤 Reddit Card Settings</div>

          <div style={{ ...styles.row, gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Subreddit Name</label>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: colors.textSecondary, fontSize: 14 }}>
                  r/
                </span>
                <input
                  type="text"
                  value={state.subredditName}
                  onChange={(e) =>
                    updateState({ subredditName: e.target.value })
                  }
                  placeholder="AmItheAsshole"
                  style={styles.input}
                />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Username</label>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: colors.textSecondary, fontSize: 14 }}>
                  u/
                </span>
                <input
                  type="text"
                  value={state.posterUsername}
                  onChange={(e) =>
                    updateState({ posterUsername: e.target.value })
                  }
                  placeholder="throwaway"
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          <div style={{ ...styles.row, gap: 12, marginTop: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Time Posted</label>
              <input
                type="text"
                value={state.timePosted}
                onChange={(e) => updateState({ timePosted: e.target.value })}
                placeholder="1d ago"
                style={styles.input}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Upvotes</label>
              <input
                type="text"
                value={state.upvotes}
                onChange={(e) => updateState({ upvotes: e.target.value })}
                placeholder="2.9K"
                style={styles.input}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Comments</label>
              <input
                type="text"
                value={state.commentCount}
                onChange={(e) => updateState({ commentCount: e.target.value })}
                placeholder="1.8K"
                style={styles.input}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Awards</label>
              <input
                type="text"
                value={state.awardsCount}
                onChange={(e) => updateState({ awardsCount: e.target.value })}
                placeholder="1"
                style={styles.input}
              />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={styles.label}>Custom Avatar URL (optional)</label>
            <input
              type="text"
              value={state.avatarUrl}
              onChange={(e) => updateState({ avatarUrl: e.target.value })}
              placeholder="https://example.com/avatar.png (leave empty for default)"
              style={styles.input}
            />
          </div>
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.cardTitle}>🔗 Or Import from URL</div>
      <div style={styles.row}>
        <input
          type="text"
          placeholder="https://reddit.com/r/AmItheAsshole/..."
          value={state.postUrl}
          onChange={(e) => updateState({ postUrl: e.target.value })}
          style={{ ...styles.input, flex: 1 }}
        />
        <button 
          style={{ ...styles.btnSecondary, opacity: state.isImportingPost || !state.postUrl.trim() ? 0.5 : 1 }}
          onClick={handleImportFromUrl}
          disabled={state.isImportingPost || !state.postUrl.trim()}
        >
          {state.isImportingPost ? "Importing..." : "Import"}
        </button>
      </div>
    </div>
  );

  const renderStyleStep = () => (
    <>
      <div style={styles.card}>
        <div style={styles.cardTitle}>🔤 Typography</div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Font Family</label>
          <div style={styles.pillGroup}>
            {FONT_FAMILIES.map((font) => (
              <button
                key={font.value}
                style={{
                  ...styles.pill,
                  ...(state.fontFamily === font.value ? styles.pillActive : {}),
                  fontFamily: font.value,
                }}
                onClick={() => updateState({ fontFamily: font.value })}
              >
                {font.label}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Font Size: {state.fontSize}px</label>
          <div style={styles.sliderRow}>
            <input
              type="range"
              min="32"
              max="72"
              value={state.fontSize}
              onChange={(e) =>
                updateState({ fontSize: Number(e.target.value) })
              }
              style={styles.slider}
            />
            <span style={styles.sliderValue}>{state.fontSize}px</span>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>🎨 Colors</div>

        <div style={styles.row}>
          <div style={styles.col}>
            <label style={styles.label}>Text Color</label>
            <div style={styles.colorPicker}>
              <div style={styles.colorSwatch}>
                <input
                  type="color"
                  value={state.fontColor}
                  onChange={(e) => updateState({ fontColor: e.target.value })}
                  style={styles.colorInput}
                />
              </div>
              <input
                type="text"
                value={state.fontColor}
                onChange={(e) => updateState({ fontColor: e.target.value })}
                style={{ ...styles.input, flex: 1 }}
              />
            </div>
          </div>
          <div style={styles.col}>
            <label style={styles.label}>Highlight Color</label>
            <div style={styles.colorPicker}>
              <div style={styles.colorSwatch}>
                <input
                  type="color"
                  value={state.sentenceBgColor}
                  onChange={(e) =>
                    updateState({ sentenceBgColor: e.target.value })
                  }
                  style={styles.colorInput}
                />
              </div>
              <input
                type="text"
                value={state.sentenceBgColor}
                onChange={(e) =>
                  updateState({ sentenceBgColor: e.target.value })
                }
                style={{ ...styles.input, flex: 1 }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={styles.label}>Background Darkness</label>
          <div style={styles.pillGroup}>
            {[
              { value: "rgba(0,0,0,0)", label: "None" },
              { value: "rgba(0,0,0,0.3)", label: "Light" },
              { value: "rgba(0,0,0,0.5)", label: "Medium" },
              { value: "rgba(0,0,0,0.7)", label: "Dark" },
            ].map((opt) => (
              <button
                key={opt.value}
                style={{
                  ...styles.pill,
                  ...(state.backgroundOverlayColor === opt.value
                    ? styles.pillActive
                    : {}),
                }}
                onClick={() =>
                  updateState({ backgroundOverlayColor: opt.value })
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderVideoStep = () => (
    <div style={styles.card}>
      <div style={styles.cardTitle}>🎬 Background Video</div>
      <div style={styles.videoGrid}>
        {BACKGROUND_VIDEOS.map((video) => (
          <div
            key={video.value}
            style={{
              ...styles.videoCard,
              ...(state.backgroundVideo === video.value
                ? styles.videoCardActive
                : {}),
            }}
            onClick={() => updateState({ backgroundVideo: video.value })}
          >
            <video
              src={video.value}
              style={styles.videoThumb}
              muted
              loop
              autoPlay
              playsInline
            />
            <div style={styles.videoLabel}>
              {state.backgroundVideo === video.value && "✓ "}
              {video.label}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <input
          type="file"
          ref={videoInputRef}
          accept="video/*"
          style={{ display: 'none' }}
          onChange={handleVideoUpload}
        />
        <button 
          style={styles.quickAction} 
          onClick={() => videoInputRef.current?.click()}
        >
          📤 Upload Custom Video
        </button>
      </div>
    </div>
  );

  const renderAudioStep = () => (
    <>
      <div style={styles.card}>
        <div style={styles.cardTitle}>🎙️ AI Voice</div>

        <div style={styles.voiceGrid}>
          {AI_VOICES.map((voice) => (
            <div
              key={voice.value}
              style={{
                ...styles.voiceCard,
                ...(state.aiVoice === voice.value
                  ? styles.voiceCardActive
                  : {}),
              }}
              onClick={() =>
                updateState({
                  aiVoice: voice.value,
                  voiceoverGenerated: false,
                  voiceoverUrl: "",
                })
              }
            >
              <div style={styles.voiceName}>{voice.label}</div>
              <div style={styles.voiceGender}>{voice.gender}</div>
              <div style={styles.voiceDesc}>{voice.desc}</div>
            </div>
          ))}
        </div>

        <div style={styles.divider} />

        <label style={styles.label}>Emotion</label>
        <div style={styles.emotionGrid}>
          {EMOTIONS.map((e) => (
            <button
              key={e.value}
              style={{
                ...styles.emotionBtn,
                ...(state.emotion === e.value ? styles.emotionBtnActive : {}),
              }}
              onClick={() =>
                updateState({
                  emotion: e.value,
                  voiceoverGenerated: false,
                  voiceoverUrl: "",
                })
              }
            >
              <span style={{ fontSize: 18 }}>{e.icon}</span>
              <span style={{ fontSize: 10, color: colors.textSecondary }}>
                {e.label}
              </span>
            </button>
          ))}
        </div>

        <div style={{ ...styles.row, marginTop: 16 }}>
          <div style={styles.col}>
            <label style={styles.label}>
              <span>Speed</span>
              <span style={styles.labelValue}>{state.speed.toFixed(1)}x</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={state.speed}
              onChange={(e) =>
                updateState({
                  speed: parseFloat(e.target.value),
                  voiceoverGenerated: false,
                  voiceoverUrl: "",
                })
              }
              style={styles.slider}
            />
          </div>
          <div style={styles.col}>
            <label style={styles.label}>
              <span>Pitch</span>
              <span style={styles.labelValue}>{state.pitch.toFixed(1)}x</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={state.pitch}
              onChange={(e) =>
                updateState({
                  pitch: parseFloat(e.target.value),
                  voiceoverGenerated: false,
                  voiceoverUrl: "",
                })
              }
              style={styles.slider}
            />
          </div>
        </div>

        <div style={styles.estimateBox}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#14b8a6"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span style={{ fontSize: 13, color: "#5eead4" }}>
            Estimated duration: ~
            {Math.ceil(state.postText.length / 15 / state.speed)} seconds
          </span>
        </div>

        <button
          style={{
            ...styles.generateBtn,
            ...(state.isGeneratingVoiceover || !state.postText.trim()
              ? styles.generateBtnDisabled
              : {}),
          }}
          onClick={handleGenerateVoiceover}
          disabled={state.isGeneratingVoiceover || !state.postText.trim()}
        >
          {state.isGeneratingVoiceover ? (
            <>
              <div style={styles.spinner} />
              Generating...
            </>
          ) : state.voiceoverGenerated && state.voiceoverUrl ? (
            <>✅ Regenerate Voiceover</>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              </svg>
              Generate Voiceover
            </>
          )}
        </button>

        {state.voiceoverGenerated && state.voiceoverUrl && (
          <div style={styles.successBadge}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#10B981" }}>
              ✓ Voiceover Ready • {state.words.length} words synced
            </span>
            <button style={styles.previewBtn} onClick={handlePreviewVoiceover}>
              ▶️ Play
            </button>
            {/* ADD THIS DOWNLOAD BUTTON */}
            <button
              style={styles.previewBtn}
              onClick={() => {
                const a = document.createElement("a");
                a.href = state.voiceoverUrl;
                a.download = "voiceover.mp3";
                a.click();
              }}
            >
              ⬇️ Download
            </button>
          </div>
        )}

        {state.voiceoverGenerated && !state.voiceoverUrl && (
          <div
            style={{
              ...styles.successBadge,
              borderColor: "rgba(245, 158, 11, 0.3)",
              backgroundColor: isDark
                ? "rgba(245, 158, 11, 0.15)"
                : "rgba(245, 158, 11, 0.1)",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: "#F59E0B" }}>
              ⚠️ Word timing only (no audio) • {state.words.length} words
            </span>
          </div>
        )}
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>🎵 Background Music</div>

        <div style={styles.pillGroup}>
          {BACKGROUND_MUSIC.map((music) => (
            <button
              key={music.value}
              style={{
                ...styles.pill,
                ...(state.backgroundMusicPath === music.value
                  ? styles.pillActive
                  : {}),
              }}
              onClick={() => updateState({ backgroundMusicPath: music.value })}
            >
              {music.icon} {music.label}
            </button>
          ))}
        </div>

        {state.backgroundMusicPath && (
          <div style={{ marginTop: 16 }}>
            <label style={styles.label}>
              Volume: {Math.round(state.musicVolume * 100)}%
            </label>
            <div style={styles.sliderRow}>
              <input
                type="range"
                min="0"
                max="100"
                value={state.musicVolume * 100}
                onChange={(e) =>
                  updateState({ musicVolume: Number(e.target.value) / 100 })
                }
                style={styles.slider}
              />
              <span style={styles.sliderValue}>
                {Math.round(state.musicVolume * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );

  // ============================================================================
  // MOBILE LAYOUT
  // ============================================================================
  const renderMobileLayout = () => {
    const accent = "#FF4500";
    const text = isDark ? "#fff" : "#111";
    const textSoft = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
    const textMuted = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";
    const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

    return (
      <div style={{
        height: "100vh",
        maxHeight: "100vh",
        background: isDark ? "linear-gradient(180deg, #09090b 0%, #0d0d10 50%, #09090b 100%)" : "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)",
        color: text,
        display: "flex",
        flexDirection: "column",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}>
        {/* Hidden inputs */}
        <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} style={{ display: "none" }} />

        {/* Mobile Header */}
        <header style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderBottom: `1px solid ${border}`,
          background: isDark ? "rgba(24, 24, 27, 0.98)" : "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => navigate(-1)}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>←</span>
            <span style={{ fontSize: 16, fontWeight: 800 }}><span style={{ color: accent }}>Reddit</span> Video</span>
          </div>
          <button
            onClick={() => currentStep === "audio" ? proceedToEditor() : canProceed() && goToNextStep()}
            disabled={!canProceed()}
            style={{
              padding: "10px 20px",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 24,
              border: "none",
              background: canProceed() ? `linear-gradient(135deg, ${accent}, #FF5722)` : (isDark ? "#27272a" : "#e2e8f0"),
              color: canProceed() ? "#fff" : textSoft,
              cursor: canProceed() ? "pointer" : "default",
              boxShadow: canProceed() ? `0 4px 16px ${accent}40` : "none",
            }}
          >
            {currentStep === "audio" ? "Create" : "Next"} →
          </button>
        </header>

        {/* Step Pills */}
        <div style={{ display: "flex", gap: 4, padding: "10px 16px", overflowX: "auto", flexShrink: 0 }}>
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 12px",
                borderRadius: 16,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                background: currentStep === step.id ? `${accent}20` : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
                color: currentStep === step.id ? accent : textSoft,
                whiteSpace: "nowrap",
              }}
            >
              {step.icon} {step.label}
            </button>
          ))}
        </div>

        {/* Mobile Main Content */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "12px", gap: 12, overflow: "auto", minHeight: 0 }}>
          
          {/* Phone Preview */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 180,
              height: 360,
              backgroundColor: "#000",
              borderRadius: 24,
              padding: 6,
              boxShadow: isDark ? "0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255, 69, 0, 0.25)" : "0 12px 40px rgba(0,0,0,0.2)",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{ width: "100%", height: "100%", borderRadius: 18, overflow: "hidden", position: "relative", backgroundColor: "#1a1a1a" }}>
                <video key={state.backgroundVideo} src={state.backgroundVideo} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} muted loop autoPlay playsInline />
                <div style={{ position: "absolute", inset: 0, backgroundColor: state.backgroundOverlayColor, display: "flex", alignItems: "center", justifyContent: "center", padding: 8 }}>
                  {/* Mini Reddit Card */}
                  <div style={{ backgroundColor: "#fff", borderRadius: 6, padding: 8, width: "90%", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                      {state.avatarUrl ? (
                        <img src={state.avatarUrl} style={{ width: 12, height: 12, borderRadius: "50%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "linear-gradient(135deg, #00D8D6, #0079D3)" }} />
                      )}
                      <span style={{ fontSize: 7, fontWeight: 700, color: "#1a1a1b" }}>r/{state.subredditName || "Advice"}</span>
                      <span style={{ fontSize: 6, color: "#576f76" }}>• {state.timePosted}</span>
                    </div>
                    <div style={{ fontSize: 8, fontWeight: 600, color: "#1a1a1b", marginBottom: 4, lineHeight: 1.2 }}>
                      {state.postTitle || "Your title here..."}
                    </div>
                    <div style={{ fontSize: 6, color: "#576f76", lineHeight: 1.3, maxHeight: 40, overflow: "hidden" }}>
                      {state.postText?.substring(0, 100) || "Story text preview..."}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, fontSize: 6, color: "#576f76" }}>
                      <span>⬆ {state.upvotes}</span>
                      <span>💬 {state.commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Duration */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 14px", background: isDark ? "rgba(39, 39, 42, 0.8)" : "rgba(241, 245, 249, 0.9)", borderRadius: 16, backdropFilter: "blur(10px)" }}>
              <span style={{ fontSize: 11, color: textSoft }}>⏱️ {state.estimatedDuration.toFixed(1)}s</span>
              <span style={{ fontSize: 11, color: textMuted }}>•</span>
              <span style={{ fontSize: 11, color: state.voiceoverGenerated ? "#10B981" : textSoft }}>🎙️ {state.voiceoverGenerated ? "Ready" : "Pending"}</span>
            </div>
          </div>

          {/* ============== SCRIPT STEP ============== */}
          {currentStep === "script" && (
            <>
              {/* Story Content */}
              <div style={{ width: "100%", maxWidth: 400, background: isDark ? "rgba(30, 30, 35, 0.95)" : "rgba(255, 255, 255, 0.95)", borderRadius: 14, border: `1px solid ${isDark ? "rgba(255, 69, 0, 0.15)" : "rgba(255, 69, 0, 0.1)"}`, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: text, marginBottom: 10 }}>📝 Story Content</div>
                
                {/* Title */}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 4 }}>Title</label>
                  <input
                    value={state.postTitle}
                    onChange={e => updateState({ postTitle: e.target.value })}
                    placeholder="Enter title..."
                    style={{ width: "100%", padding: "8px 10px", fontSize: 12, borderRadius: 8, border: `1px solid ${border}`, background: isDark ? "rgba(0,0,0,0.3)" : "#fff", color: text, outline: "none" }}
                  />
                </div>

                {/* Story Text */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <label style={{ fontSize: 10, color: textMuted }}>Story</label>
                    <span style={{ fontSize: 10, color: textMuted }}>{state.postText.length}/4000</span>
                  </div>
                  <textarea
                    value={state.postText}
                    onChange={e => {
                      const newText = e.target.value;
                      updateState({ postText: newText, voiceoverGenerated: false, voiceoverUrl: "" });
                      const words = estimateWordTimings(newText, state.speed);
                      updateState({ words, estimatedDuration: calculateDuration(words) });
                    }}
                    placeholder="Enter your story..."
                    rows={4}
                    maxLength={4000}
                    style={{ width: "100%", padding: "8px 10px", fontSize: 12, borderRadius: 8, border: `1px solid ${border}`, background: isDark ? "rgba(0,0,0,0.3)" : "#fff", color: text, outline: "none", resize: "vertical" }}
                  />
                </div>

                {/* Use Sample */}
                <button onClick={loadSampleData} style={{ width: "100%", padding: "8px", fontSize: 11, fontWeight: 600, borderRadius: 8, border: `1px solid ${accent}40`, background: `${accent}10`, color: accent, cursor: "pointer" }}>
                  ✨ Use Sample Story
                </button>
              </div>

              {/* Reddit Card Details */}
              <div style={{ width: "100%", maxWidth: 400, background: isDark ? "rgba(30, 30, 35, 0.95)" : "rgba(255, 255, 255, 0.95)", borderRadius: 14, border: `1px solid ${isDark ? "rgba(255, 69, 0, 0.15)" : "rgba(255, 69, 0, 0.1)"}`, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: text, marginBottom: 10 }}>👤 Reddit Card Settings</div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                  <div>
                    <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 4 }}>Subreddit</label>
                    <input value={state.subredditName} onChange={e => updateState({ subredditName: e.target.value })} placeholder="AmItheAsshole" style={{ width: "100%", padding: "6px 8px", fontSize: 11, borderRadius: 6, border: `1px solid ${border}`, background: isDark ? "rgba(0,0,0,0.3)" : "#fff", color: text, outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 4 }}>Username</label>
                    <input value={state.posterUsername} onChange={e => updateState({ posterUsername: e.target.value })} placeholder="throwaway" style={{ width: "100%", padding: "6px 8px", fontSize: 11, borderRadius: 6, border: `1px solid ${border}`, background: isDark ? "rgba(0,0,0,0.3)" : "#fff", color: text, outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 4 }}>Time Posted</label>
                    <input value={state.timePosted} onChange={e => updateState({ timePosted: e.target.value })} placeholder="1d ago" style={{ width: "100%", padding: "6px 8px", fontSize: 11, borderRadius: 6, border: `1px solid ${border}`, background: isDark ? "rgba(0,0,0,0.3)" : "#fff", color: text, outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 4 }}>Upvotes</label>
                    <input value={state.upvotes} onChange={e => updateState({ upvotes: e.target.value })} placeholder="2.9K" style={{ width: "100%", padding: "6px 8px", fontSize: 11, borderRadius: 6, border: `1px solid ${border}`, background: isDark ? "rgba(0,0,0,0.3)" : "#fff", color: text, outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 4 }}>Comments</label>
                    <input value={state.commentCount} onChange={e => updateState({ commentCount: e.target.value })} placeholder="1.8K" style={{ width: "100%", padding: "6px 8px", fontSize: 11, borderRadius: 6, border: `1px solid ${border}`, background: isDark ? "rgba(0,0,0,0.3)" : "#fff", color: text, outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 4 }}>Awards</label>
                    <input value={state.awardsCount} onChange={e => updateState({ awardsCount: e.target.value })} placeholder="1" style={{ width: "100%", padding: "6px 8px", fontSize: 11, borderRadius: 6, border: `1px solid ${border}`, background: isDark ? "rgba(0,0,0,0.3)" : "#fff", color: text, outline: "none" }} />
                  </div>
                </div>
                
                <div>
                  <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 4 }}>Avatar URL (optional)</label>
                  <input value={state.avatarUrl} onChange={e => updateState({ avatarUrl: e.target.value })} placeholder="https://example.com/avatar.png" style={{ width: "100%", padding: "6px 8px", fontSize: 11, borderRadius: 6, border: `1px solid ${border}`, background: isDark ? "rgba(0,0,0,0.3)" : "#fff", color: text, outline: "none" }} />
                </div>
              </div>

              {/* Import from URL */}
              <div style={{ width: "100%", maxWidth: 400, background: isDark ? "rgba(30, 30, 35, 0.95)" : "rgba(255, 255, 255, 0.95)", borderRadius: 14, border: `1px solid ${isDark ? "rgba(255, 69, 0, 0.15)" : "rgba(255, 69, 0, 0.1)"}`, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: text, marginBottom: 10 }}>🔗 Import from URL</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={state.postUrl}
                    onChange={e => updateState({ postUrl: e.target.value })}
                    placeholder="https://reddit.com/r/..."
                    style={{ flex: 1, padding: "8px 10px", fontSize: 11, borderRadius: 8, border: `1px solid ${border}`, background: isDark ? "rgba(0,0,0,0.3)" : "#fff", color: text, outline: "none" }}
                  />
                  <button
                    onClick={handleImportFromUrl}
                    disabled={state.isImportingPost || !state.postUrl.trim()}
                    style={{ padding: "8px 12px", fontSize: 11, fontWeight: 600, borderRadius: 8, border: "none", background: state.postUrl.trim() ? `linear-gradient(135deg, ${accent}, #FF5722)` : (isDark ? "#27272a" : "#e2e8f0"), color: state.postUrl.trim() ? "#fff" : textSoft, cursor: state.postUrl.trim() ? "pointer" : "default" }}
                  >
                    {state.isImportingPost ? "..." : "Import"}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ============== STYLE STEP ============== */}
          {currentStep === "style" && (
            <>
              {/* Typography */}
              <div style={{ width: "100%", maxWidth: 400, background: isDark ? "rgba(30, 30, 35, 0.95)" : "rgba(255, 255, 255, 0.95)", borderRadius: 14, border: `1px solid ${isDark ? "rgba(255, 69, 0, 0.15)" : "rgba(255, 69, 0, 0.1)"}`, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: text, marginBottom: 10 }}>🔤 Typography</div>
                
                {/* Font Family */}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 6 }}>Font Family</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {FONT_FAMILIES.map(f => (
                      <button key={f.value} onClick={() => updateState({ fontFamily: f.value })} style={{
                        padding: "6px 10px",
                        fontSize: 10,
                        fontWeight: 600,
                        fontFamily: f.value,
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                        background: state.fontFamily === f.value ? `linear-gradient(135deg, ${accent}, #FF5722)` : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
                        color: state.fontFamily === f.value ? "#fff" : textSoft,
                      }}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: textMuted }}>Font Size</span>
                    <span style={{ fontSize: 10, color: accent }}>{state.fontSize}px</span>
                  </div>
                  <input type="range" min={32} max={72} value={state.fontSize} onChange={e => updateState({ fontSize: +e.target.value })} style={{ width: "100%", accentColor: accent }} />
                </div>
              </div>

              {/* Colors */}
              <div style={{ width: "100%", maxWidth: 400, background: isDark ? "rgba(30, 30, 35, 0.95)" : "rgba(255, 255, 255, 0.95)", borderRadius: 14, border: `1px solid ${isDark ? "rgba(255, 69, 0, 0.15)" : "rgba(255, 69, 0, 0.1)"}`, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: text, marginBottom: 10 }}>🎨 Colors</div>
                
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 4 }}>Text Color</label>
                    <input type="color" value={state.fontColor} onChange={e => updateState({ fontColor: e.target.value })} style={{ width: "100%", height: 32, borderRadius: 6, border: `1px solid ${border}`, cursor: "pointer" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 4 }}>Highlight</label>
                    <input type="color" value={state.sentenceBgColor} onChange={e => updateState({ sentenceBgColor: e.target.value })} style={{ width: "100%", height: 32, borderRadius: 6, border: `1px solid ${border}`, cursor: "pointer" }} />
                  </div>
                </div>

                {/* Background Darkness */}
                <div>
                  <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 6 }}>Background Darkness</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      { value: "rgba(0,0,0,0)", label: "None" },
                      { value: "rgba(0,0,0,0.3)", label: "Light" },
                      { value: "rgba(0,0,0,0.5)", label: "Medium" },
                      { value: "rgba(0,0,0,0.7)", label: "Dark" },
                    ].map(opt => (
                      <button key={opt.value} onClick={() => updateState({ backgroundOverlayColor: opt.value })} style={{
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: 10,
                        fontWeight: 600,
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                        background: state.backgroundOverlayColor === opt.value ? `linear-gradient(135deg, ${accent}, #FF5722)` : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
                        color: state.backgroundOverlayColor === opt.value ? "#fff" : textSoft,
                      }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ============== VIDEO STEP ============== */}
          {currentStep === "video" && (
            <div style={{ width: "100%", maxWidth: 400, background: isDark ? "rgba(30, 30, 35, 0.95)" : "rgba(255, 255, 255, 0.95)", borderRadius: 14, border: `1px solid ${isDark ? "rgba(255, 69, 0, 0.15)" : "rgba(255, 69, 0, 0.1)"}`, padding: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: text, marginBottom: 10 }}>🎬 Background Video</div>
              
              {/* Video Grid - 4 columns, smaller */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 10 }}>
                {BACKGROUND_VIDEOS.map(v => (
                  <div
                    key={v.value}
                    onClick={() => updateState({ backgroundVideo: v.value })}
                    style={{
                      aspectRatio: "9/16",
                      borderRadius: 8,
                      overflow: "hidden",
                      cursor: "pointer",
                      border: `2px solid ${state.backgroundVideo === v.value ? accent : "transparent"}`,
                      position: "relative",
                      boxShadow: state.backgroundVideo === v.value ? `0 0 8px ${accent}40` : "none",
                    }}
                  >
                    <video src={v.value} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted loop autoPlay playsInline />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 2, background: "linear-gradient(transparent, rgba(0,0,0,0.8))", fontSize: 7, color: "#fff", fontWeight: 600, textAlign: "center" }}>{v.label}</div>
                  </div>
                ))}
              </div>

              {/* Upload Custom */}
              <button onClick={() => videoInputRef.current?.click()} style={{ width: "100%", padding: "8px", fontSize: 11, fontWeight: 600, borderRadius: 8, border: `1px dashed ${border}`, background: "transparent", color: textSoft, cursor: "pointer" }}>
                📁 Upload Custom
              </button>
            </div>
          )}

          {/* ============== AUDIO STEP ============== */}
          {currentStep === "audio" && (
            <>
              {/* Voice Settings */}
              <div style={{ width: "100%", maxWidth: 400, background: isDark ? "rgba(30, 30, 35, 0.95)" : "rgba(255, 255, 255, 0.95)", borderRadius: 14, border: `1px solid ${isDark ? "rgba(255, 69, 0, 0.15)" : "rgba(255, 69, 0, 0.1)"}`, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: text, marginBottom: 10 }}>🎙️ AI Voice</div>
                
                {/* Voice Selection */}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 6 }}>Voice</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                    {AI_VOICES.map(v => (
                      <button
                        key={v.value}
                        onClick={() => updateState({ aiVoice: v.value, voiceoverGenerated: false, voiceoverUrl: "" })}
                        style={{
                          padding: "8px 6px",
                          fontSize: 10,
                          fontWeight: 600,
                          borderRadius: 6,
                          border: "none",
                          cursor: "pointer",
                          background: state.aiVoice === v.value ? `linear-gradient(135deg, ${accent}, #FF5722)` : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
                          color: state.aiVoice === v.value ? "#fff" : textSoft,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <span>{v.label}</span>
                        <span style={{ fontSize: 8, opacity: 0.7 }}>{v.gender}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Emotion */}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 6 }}>Emotion</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {EMOTIONS.map(e => (
                      <button
                        key={e.value}
                        onClick={() => updateState({ emotion: e.value, voiceoverGenerated: false, voiceoverUrl: "" })}
                        style={{
                          padding: "6px 10px",
                          fontSize: 10,
                          fontWeight: 600,
                          borderRadius: 6,
                          border: "none",
                          cursor: "pointer",
                          background: state.emotion === e.value ? `linear-gradient(135deg, ${accent}, #FF5722)` : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
                          color: state.emotion === e.value ? "#fff" : textSoft,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <span>{e.icon}</span>
                        <span>{e.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Speed & Pitch */}
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: textMuted }}>Speed</span>
                      <span style={{ fontSize: 10, color: accent }}>{state.speed.toFixed(1)}x</span>
                    </div>
                    <input type="range" min={0.5} max={2.0} step={0.1} value={state.speed} onChange={e => updateState({ speed: +e.target.value, voiceoverGenerated: false, voiceoverUrl: "" })} style={{ width: "100%", accentColor: accent }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: textMuted }}>Pitch</span>
                      <span style={{ fontSize: 10, color: accent }}>{state.pitch.toFixed(1)}x</span>
                    </div>
                    <input type="range" min={0.5} max={1.5} step={0.1} value={state.pitch} onChange={e => updateState({ pitch: +e.target.value, voiceoverGenerated: false, voiceoverUrl: "" })} style={{ width: "100%", accentColor: accent }} />
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateVoiceover}
                  disabled={state.isGeneratingVoiceover || !state.postText}
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 8,
                    border: "none",
                    cursor: state.isGeneratingVoiceover ? "wait" : "pointer",
                    background: state.voiceoverGenerated ? "#10B981" : `linear-gradient(135deg, ${accent}, #FF5722)`,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  {state.isGeneratingVoiceover ? "⏳ Generating..." : state.voiceoverGenerated ? "✓ Regenerate Voiceover" : "🎙️ Generate Voiceover"}
                </button>

                {/* Preview/Download */}
                {state.voiceoverGenerated && state.voiceoverUrl && (
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button onClick={handlePreviewVoiceover} style={{ flex: 1, padding: "8px", fontSize: 11, fontWeight: 600, borderRadius: 8, border: `1px solid #10B981`, background: "rgba(16, 185, 129, 0.1)", color: "#10B981", cursor: "pointer" }}>
                      ▶️ Play
                    </button>
                    <button onClick={() => { const a = document.createElement("a"); a.href = state.voiceoverUrl; a.download = "voiceover.mp3"; a.click(); }} style={{ flex: 1, padding: "8px", fontSize: 11, fontWeight: 600, borderRadius: 8, border: `1px solid ${accent}`, background: `${accent}10`, color: accent, cursor: "pointer" }}>
                      ⬇️ Download
                    </button>
                  </div>
                )}
              </div>

              {/* Background Music */}
              <div style={{ width: "100%", maxWidth: 400, background: isDark ? "rgba(30, 30, 35, 0.95)" : "rgba(255, 255, 255, 0.95)", borderRadius: 14, border: `1px solid ${isDark ? "rgba(255, 69, 0, 0.15)" : "rgba(255, 69, 0, 0.1)"}`, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: text, marginBottom: 10 }}>🎵 Background Music</div>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: state.backgroundMusicPath ? 10 : 0 }}>
                  {BACKGROUND_MUSIC.map(m => (
                    <button
                      key={m.value}
                      onClick={() => updateState({ backgroundMusicPath: m.value })}
                      style={{
                        padding: "8px 12px",
                        fontSize: 10,
                        fontWeight: 600,
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                        background: state.backgroundMusicPath === m.value ? `linear-gradient(135deg, ${accent}, #FF5722)` : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
                        color: state.backgroundMusicPath === m.value ? "#fff" : textSoft,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>

                {/* Volume Slider */}
                {state.backgroundMusicPath && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: textMuted }}>Volume</span>
                      <span style={{ fontSize: 10, color: accent }}>{Math.round(state.musicVolume * 100)}%</span>
                    </div>
                    <input type="range" min={0} max={100} value={state.musicVolume * 100} onChange={e => updateState({ musicVolume: +e.target.value / 100 })} style={{ width: "100%", accentColor: accent }} />
                  </div>
                )}
              </div>
            </>
          )}
        </main>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  // Mobile: return mobile layout
  if (isMobile) {
    return renderMobileLayout();
  }

  // Desktop: return original layout
  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <header style={styles.header}>
        <div style={styles.logo} onClick={() => navigate(-1)}>
          <span style={{ fontSize: 20 }}>←</span>
          <span style={{ color: "#FF4500" }}>Reddit</span> Video
        </div>

        <div style={styles.stepNav}>
          {STEPS.map((step) => (
            <button
              key={step.id}
              style={{
                ...styles.stepPill,
                ...(currentStep === step.id ? styles.stepPillActive : {}),
              }}
              onClick={() => setCurrentStep(step.id)}
            >
              {step.icon} {step.label}
            </button>
          ))}
        </div>

        <div style={styles.headerActions}>
          {currentStepIndex > 0 && (
            <button style={styles.btnSecondary} onClick={goToPrevStep}>
              ← Back
            </button>
          )}
          <button
            style={{ ...styles.btnPrimary, opacity: canProceed() ? 1 : 0.5 }}
            onClick={() =>
              currentStep === "audio"
                ? proceedToEditor()
                : canProceed() && goToNextStep()
            }
            disabled={!canProceed()}
          >
            {currentStep === "audio" ? "Create Video" : "Next"} →
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {renderPhonePreview()}
        <div style={styles.controlsPanel}>
          {currentStep === "script" && renderScriptStep()}
          {currentStep === "style" && renderStyleStep()}
          {currentStep === "video" && renderVideoStep()}
          {currentStep === "audio" && renderAudioStep()}
        </div>
      </main>
    </div>
  );
};

export default RedditVideoWizard;