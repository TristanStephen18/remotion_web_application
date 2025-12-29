import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import toast from "react-hot-toast";

// ============================================================================
// TYPES
// ============================================================================

interface WizardState {
  // Videos
  upperVideoUrl: string;
  upperVideoFile: File | null;
  lowerVideoUrl: string;
  lowerVideoFile: File | null;

  // Layout Type
  layoutType: "split-screen" | "pic-in-pic";

  // Split Screen Layout
  splitLayout: "50-50" | "60-40" | "40-60" | "70-30" | "30-70";

  // Pic-in-Pic Settings
  pipPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  pipSize: number; // percentage (20-50)

  // Duration
  duration: number; // in seconds

  // Audio
  upperVolume: number;
  lowerVolume: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SPLIT_LAYOUTS = [
  { value: "50-50", label: "50/50", upper: 50, lower: 50 },
  { value: "60-40", label: "60/40", upper: 60, lower: 40 },
  { value: "40-60", label: "40/60", upper: 40, lower: 60 },
  { value: "70-30", label: "70/30", upper: 70, lower: 30 },
  { value: "30-70", label: "30/70", upper: 30, lower: 70 },
];

const SAMPLE_VIDEOS = [
  {
    value: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    label: "Big Buck Bunny",
  },
  {
    value: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    label: "Elephants Dream",
  },
  {
    value: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    label: "For Bigger Blazes",
  },
  {
    value: "https://res.cloudinary.com/dcu9xuof0/video/upload/v1765260195/Subway_Surfers_2024_-_Gameplay_4K_9x16_No_Copyright_n4ym8w.mp4",
    label: "Subway Surfers",
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

const SplitScreenWizard: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const isDark = colors.bgPrimary !== "#ffffff";
  const upperVideoInputRef = useRef<HTMLInputElement | null>(null);
  const lowerVideoInputRef = useRef<HTMLInputElement | null>(null);

  // Mobile responsiveness
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [state, setState] = useState<WizardState>({
    upperVideoUrl: SAMPLE_VIDEOS[0].value,
    upperVideoFile: null,
    lowerVideoUrl: SAMPLE_VIDEOS[1].value,
    lowerVideoFile: null,
    layoutType: "split-screen",
    splitLayout: "50-50",
    pipPosition: "bottom-left",
    pipSize: 30,
    duration: 20,
    upperVolume: 0.5,
    lowerVolume: 0.5,
  });

  const updateState = useCallback((updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // ============================================================================
  // VIDEO UPLOAD HANDLERS
  // ============================================================================

  const handleUpperVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("Please upload a valid video file");
        return;
      }
      const videoUrl = URL.createObjectURL(file);
      updateState({ upperVideoUrl: videoUrl, upperVideoFile: file });
      toast.success("Upper video uploaded!");
    }
  };

  const handleLowerVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("Please upload a valid video file");
        return;
      }
      const videoUrl = URL.createObjectURL(file);
      updateState({ lowerVideoUrl: videoUrl, lowerVideoFile: file });
      toast.success("Lower video uploaded!");
    }
  };

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  const canProceed = useCallback(() => {
    return state.upperVideoUrl && state.lowerVideoUrl;
  }, [state.upperVideoUrl, state.lowerVideoUrl]);

  const proceedToEditor = () => {
    const totalFrames = state.duration * 30;

    let config: any;

    if (state.layoutType === "split-screen") {
      const selectedLayout = SPLIT_LAYOUTS.find((l) => l.value === state.splitLayout) || SPLIT_LAYOUTS[0];
      config = {
        layoutType: "split-screen",
        upperVideo: {
          src: state.upperVideoUrl,
          volume: state.upperVolume,
        },
        lowerVideo: {
          src: state.lowerVideoUrl,
          volume: state.lowerVolume,
        },
        layout: {
          type: state.splitLayout,
          upperPercent: selectedLayout.upper,
          lowerPercent: selectedLayout.lower,
        },
        duration: state.duration,
        totalFrames: totalFrames,
      };
    } else {
      // Pic-in-Pic layout
      config = {
        layoutType: "pic-in-pic",
        mainVideo: {
          src: state.upperVideoUrl,
          volume: state.upperVolume,
        },
        pipVideo: {
          src: state.lowerVideoUrl,
          volume: state.lowerVolume,
        },
        pip: {
          position: state.pipPosition,
          size: state.pipSize,
        },
        duration: state.duration,
        totalFrames: totalFrames,
      };
    }

    console.log("📦 Saving split screen config to sessionStorage:", config);

    sessionStorage.setItem("splitScreenConfig", JSON.stringify(config));

    // Clear any persisted editor state for template 6
    localStorage.removeItem("editor_state_template_6");
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.includes("template_6")) {
        localStorage.removeItem(key);
      }
    }
    console.log("🧹 Cleared persisted state before navigating to editor");

    navigate("/editor?template=6&fromWizard=true");
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
      gap: isMobile ? 8 : 0,
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
    headerActions: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 8 : 12,
    },
    btnPrimary: {
      padding: isMobile ? "8px 14px" : "10px 24px",
      background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
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
      alignItems: isMobile ? "center" : "flex-start",
      justifyContent: isMobile ? "flex-start" : "flex-start",
      margin: "0 auto",
      width: isMobile ? "100%" : "90%",
      padding: isMobile ? "40px 10px 10px" : 24,
      gap: isMobile ? 10 : 32,
      overflow: isMobile ? "auto" : "hidden",
    },
    previewPanel: {
      width: isMobile ? "auto" : 340,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: isMobile ? 6 : 16,
      padding: isMobile ? "0" : 0,
    },
    phoneFrame: {
      width: isMobile ? 165 : 300,
      height: isMobile ? 295 : 600,
      backgroundColor: "#000",
      borderRadius: isMobile ? 20 : 36,
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
      borderRadius: isMobile ? 15 : 26,
      overflow: "hidden",
      position: "relative",
      backgroundColor: "#1a1a1a",
      display: "flex",
      flexDirection: "column",
    },
    previewLabel: {
      fontSize: isMobile ? 10 : 12,
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
      gap: isMobile ? 10 : 20,
      overflow: isMobile ? "auto" : "hidden",
      paddingBottom: isMobile ? 16 : 0,
    },
    card: {
      backgroundColor: isDark ? "#141416" : "#ffffff",
      borderRadius: isMobile ? 8 : 16,
      border: `1px solid ${isDark ? "#1f1f23" : "#e5e7eb"}`,
      padding: isMobile ? 8 : 16,
    },
    cardTitle: {
      fontSize: isMobile ? 11 : 14,
      fontWeight: 600,
      color: colors.textPrimary,
      marginBottom: isMobile ? 6 : 12,
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 4 : 8,
    },
    label: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: isMobile ? 10 : 12,
      fontWeight: 500,
      color: colors.textSecondary,
      marginBottom: isMobile ? 4 : 6,
      textTransform: "uppercase",
      letterSpacing: "0.03em",
    },
    labelValue: {
      color: "#8B5CF6",
      fontWeight: 600,
    },
    uploadZone: {
      border: `2px dashed ${isDark ? "#333" : "#e5e7eb"}`,
      borderRadius: isMobile ? 6 : 10,
      padding: isMobile ? 8 : 12,
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.2s",
      backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
    },
    uploadZoneActive: {
      borderColor: "#8B5CF6",
      backgroundColor: isDark ? "rgba(139, 92, 246, 0.1)" : "rgba(139, 92, 246, 0.05)",
    },
    videoPreviewThumb: {
      width: "100%",
      height: isMobile ? 45 : 60,
      objectFit: "cover",
      borderRadius: isMobile ? 4 : 6,
      marginBottom: isMobile ? 4 : 6,
    },
    videoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: isMobile ? 6 : 12,
      marginTop: isMobile ? 8 : 12,
    },
    videoCard: {
      aspectRatio: "16/9",
      borderRadius: isMobile ? 4 : 6,
      overflow: "hidden",
      cursor: "pointer",
      position: "relative",
      border: "2px solid transparent",
      transition: "all 0.2s",
    },
    videoCardActive: {
      borderColor: "#8B5CF6",
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
      padding: isMobile ? "8px 4px 2px" : "16px 8px 6px",
      background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
      fontSize: isMobile ? 7 : 10,
      fontWeight: 600,
      color: "#fff",
      textAlign: "center",
    },
    layoutGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "repeat(5, 1fr)" : "repeat(5, 1fr)",
      gap: isMobile ? 6 : 12,
    },
    layoutCard: {
      padding: isMobile ? 8 : 16,
      backgroundColor: isDark ? "#1a1a1d" : "#f9fafb",
      border: `2px solid ${isDark ? "#2d2d30" : "#e5e7eb"}`,
      borderRadius: isMobile ? 8 : 12,
      cursor: "pointer",
      textAlign: "center",
      transition: "all 0.2s",
    },
    layoutCardActive: {
      borderColor: "#8B5CF6",
      backgroundColor: isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(139, 92, 246, 0.1)",
    },
    layoutPreview: {
      width: "100%",
      height: isMobile ? 50 : 80,
      display: "flex",
      flexDirection: "column",
      borderRadius: isMobile ? 4 : 6,
      overflow: "hidden",
      marginBottom: isMobile ? 4 : 8,
    },
    layoutLabel: {
      fontSize: isMobile ? 10 : 13,
      fontWeight: 600,
      color: colors.textPrimary,
    },
    slider: {
      width: "100%",
      height: isMobile ? 5 : 6,
      borderRadius: 3,
      appearance: "none",
      background: isDark ? "#2d2d30" : "#e5e7eb",
      outline: "none",
      cursor: "pointer",
    },
    sliderRow: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 8 : 12,
    },
    sliderValue: {
      fontSize: isMobile ? 11 : 13,
      fontWeight: 600,
      color: colors.textPrimary,
      minWidth: isMobile ? 36 : 48,
      textAlign: "right",
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? "#1f1f23" : "#e5e7eb",
      margin: isMobile ? "10px 0" : "16px 0",
    },
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const selectedSplitLayout = SPLIT_LAYOUTS.find((l) => l.value === state.splitLayout) || SPLIT_LAYOUTS[0];

  // Get PIP position styles
  const getPipPositionStyle = (): React.CSSProperties => {
    const margin = 8;
    const size = state.pipSize;
    switch (state.pipPosition) {
      case "top-left":
        return { top: margin, left: margin, width: `${size}%`, height: `${size}%` };
      case "top-right":
        return { top: margin, right: margin, width: `${size}%`, height: `${size}%` };
      case "bottom-right":
        return { bottom: margin, right: margin, width: `${size}%`, height: `${size}%` };
      case "bottom-left":
      default:
        return { bottom: margin, left: margin, width: `${size}%`, height: `${size}%` };
    }
  };

  const renderPhonePreview = () => (
    <div style={styles.previewPanel}>
      <div style={styles.previewLabel}>Live Preview</div>
      <div style={styles.phoneFrame}>
        <div style={styles.phoneScreen}>
          {state.layoutType === "split-screen" ? (
            <>
              {/* Split Screen Layout */}
              <div style={{ height: `${selectedSplitLayout.upper}%`, position: "relative", overflow: "hidden" }}>
                <video
                  key={state.upperVideoUrl}
                  src={state.upperVideoUrl}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              </div>
              <div style={{ height: `${selectedSplitLayout.lower}%`, position: "relative", overflow: "hidden" }}>
                <video
                  key={state.lowerVideoUrl}
                  src={state.lowerVideoUrl}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              </div>
            </>
          ) : (
            <>
              {/* Pic-in-Pic Layout */}
              <video
                key={state.upperVideoUrl + "-main"}
                src={state.upperVideoUrl}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                muted
                loop
                autoPlay
                playsInline
              />
              <div
                style={{
                  position: "absolute",
                  ...getPipPositionStyle(),
                  borderRadius: isMobile ? 6 : 8,
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
              >
                <video
                  key={state.lowerVideoUrl + "-pip"}
                  src={state.lowerVideoUrl}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              </div>
            </>
          )}
        </div>
      </div>
      {/* Mobile info */}
      {isMobile && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: colors.textPrimary }}>
            {state.layoutType === "split-screen" ? "Split Screen" : "Pic-in-Pic"}
          </div>
          <div style={{ fontSize: 11, color: colors.textSecondary }}>
            • {state.duration}s • {state.layoutType === "split-screen" ? selectedSplitLayout.label : `${state.pipSize}%`}
          </div>
        </div>
      )}
      {/* Desktop info */}
      {!isMobile && (
        <div style={{ fontSize: 12, color: colors.textSecondary }}>
          Duration: {state.duration}s • {state.layoutType === "split-screen" ? `Split: ${selectedSplitLayout.label}` : "Pic-in-Pic"}
        </div>
      )}
    </div>
  );

  const renderVideosStep = () => {
    // Mobile: Compact horizontal layout with upload as first item in grid
    if (isMobile) {
      return (
        <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
          {/* Upper Video */}
          <div style={{ ...styles.card, flex: 1, display: "flex", flexDirection: "column", minWidth: 0, padding: 8 }}>
            <div style={{ ...styles.cardTitle, marginBottom: 6 }}>🎬 Video 1</div>
            <input
              type="file"
              ref={upperVideoInputRef}
              accept="video/*"
              style={{ display: "none" }}
              onChange={handleUpperVideoUpload}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
              {/* Upload as first grid item */}
              <div
                style={{
                  ...styles.videoCard,
                  aspectRatio: "16/9",
                  border: `2px dashed ${state.upperVideoFile ? "#8B5CF6" : (isDark ? "#333" : "#e5e7eb")}`,
                  backgroundColor: state.upperVideoFile 
                    ? (isDark ? "rgba(139, 92, 246, 0.1)" : "rgba(139, 92, 246, 0.05)")
                    : (isDark ? "#1a1a1d" : "#f9fafb"),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => upperVideoInputRef.current?.click()}
              >
                {state.upperVideoFile ? (
                  <video src={state.upperVideoUrl} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }} muted />
                ) : (
                  <>
                    <div style={{ fontSize: 12 }}>📤</div>
                    <div style={{ fontSize: 7, color: colors.textSecondary, fontWeight: 500 }}>Upload</div>
                  </>
                )}
              </div>
              {/* Sample videos */}
              {SAMPLE_VIDEOS.map((video) => (
                <div
                  key={video.value}
                  style={{
                    ...styles.videoCard,
                    aspectRatio: "16/9",
                    ...(state.upperVideoUrl === video.value && !state.upperVideoFile ? styles.videoCardActive : {}),
                  }}
                  onClick={() => updateState({ upperVideoUrl: video.value, upperVideoFile: null })}
                >
                  <video src={video.value} style={styles.videoThumb} muted />
                  <div style={{ ...styles.videoLabel, padding: "4px 2px 1px", fontSize: 5 }}>{video.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Lower Video */}
          <div style={{ ...styles.card, flex: 1, display: "flex", flexDirection: "column", minWidth: 0, padding: 8 }}>
            <div style={{ ...styles.cardTitle, marginBottom: 6 }}>🎬 Video 2</div>
            <input
              type="file"
              ref={lowerVideoInputRef}
              accept="video/*"
              style={{ display: "none" }}
              onChange={handleLowerVideoUpload}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
              {/* Upload as first grid item */}
              <div
                style={{
                  ...styles.videoCard,
                  aspectRatio: "16/9",
                  border: `2px dashed ${state.lowerVideoFile ? "#8B5CF6" : (isDark ? "#333" : "#e5e7eb")}`,
                  backgroundColor: state.lowerVideoFile 
                    ? (isDark ? "rgba(139, 92, 246, 0.1)" : "rgba(139, 92, 246, 0.05)")
                    : (isDark ? "#1a1a1d" : "#f9fafb"),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => lowerVideoInputRef.current?.click()}
              >
                {state.lowerVideoFile ? (
                  <video src={state.lowerVideoUrl} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }} muted />
                ) : (
                  <>
                    <div style={{ fontSize: 12 }}>📤</div>
                    <div style={{ fontSize: 7, color: colors.textSecondary, fontWeight: 500 }}>Upload</div>
                  </>
                )}
              </div>
              {/* Sample videos */}
              {SAMPLE_VIDEOS.map((video) => (
                <div
                  key={video.value}
                  style={{
                    ...styles.videoCard,
                    aspectRatio: "16/9",
                    ...(state.lowerVideoUrl === video.value && !state.lowerVideoFile ? styles.videoCardActive : {}),
                  }}
                  onClick={() => updateState({ lowerVideoUrl: video.value, lowerVideoFile: null })}
                >
                  <video src={video.value} style={styles.videoThumb} muted />
                  <div style={{ ...styles.videoLabel, padding: "4px 2px 1px", fontSize: 5 }}>{video.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Desktop: Original layout
    return (
      <div style={{ display: "flex", flexDirection: "row", gap: 16, height: "80%", flex: 1 }}>
        {/* Upper Video */}
        <div style={{ ...styles.card, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={styles.cardTitle}>🎬 Video 1</div>

          <input
            type="file"
            ref={upperVideoInputRef}
            accept="video/*"
            style={{ display: "none" }}
            onChange={handleUpperVideoUpload}
          />

          <div
            style={{
              ...styles.uploadZone,
              ...(state.upperVideoFile ? styles.uploadZoneActive : {}),
              padding: 12,
            }}
            onClick={() => upperVideoInputRef.current?.click()}
          >
            {state.upperVideoFile ? (
              <>
                <video
                  src={state.upperVideoUrl}
                  style={{ ...styles.videoPreviewThumb, height: 60 }}
                  muted
                />
                <div style={{ fontSize: 11, color: colors.textPrimary, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {state.upperVideoFile.name}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 20, marginBottom: 2 }}>📤</div>
                <div style={{ fontSize: 12, color: colors.textPrimary, fontWeight: 500 }}>
                  Upload
                </div>
              </>
            )}
          </div>

          <div style={{ fontSize: 10, color: colors.textSecondary, marginTop: 8, marginBottom: 4 }}>
            Or select sample:
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
            {SAMPLE_VIDEOS.map((video) => (
              <div
                key={video.value}
                style={{
                  ...styles.videoCard,
                  aspectRatio: "16/9",
                  ...(state.upperVideoUrl === video.value && !state.upperVideoFile
                    ? styles.videoCardActive
                    : {}),
                }}
                onClick={() => updateState({ upperVideoUrl: video.value, upperVideoFile: null })}
              >
                <video src={video.value} style={styles.videoThumb} muted />
                <div style={{ ...styles.videoLabel, padding: "10px 4px 3px", fontSize: 8 }}>{video.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lower Video */}
        <div style={{ ...styles.card, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={styles.cardTitle}>🎬 Video 2</div>

          <input
            type="file"
            ref={lowerVideoInputRef}
            accept="video/*"
            style={{ display: "none" }}
            onChange={handleLowerVideoUpload}
          />

          <div
            style={{
              ...styles.uploadZone,
              ...(state.lowerVideoFile ? styles.uploadZoneActive : {}),
              padding: 12,
            }}
            onClick={() => lowerVideoInputRef.current?.click()}
          >
            {state.lowerVideoFile ? (
              <>
                <video
                  src={state.lowerVideoUrl}
                  style={{ ...styles.videoPreviewThumb, height: 60 }}
                  muted
                />
                <div style={{ fontSize: 11, color: colors.textPrimary, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {state.lowerVideoFile.name}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 20, marginBottom: 2 }}>📤</div>
                <div style={{ fontSize: 12, color: colors.textPrimary, fontWeight: 500 }}>
                  Upload
                </div>
              </>
            )}
          </div>

          <div style={{ fontSize: 10, color: colors.textSecondary, marginTop: 8, marginBottom: 4 }}>
            Or select sample:
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
            {SAMPLE_VIDEOS.map((video) => (
              <div
                key={video.value}
                style={{
                  ...styles.videoCard,
                  aspectRatio: "16/9",
                  ...(state.lowerVideoUrl === video.value && !state.lowerVideoFile
                    ? styles.videoCardActive
                    : {}),
                }}
                onClick={() => updateState({ lowerVideoUrl: video.value, lowerVideoFile: null })}
              >
                <video src={video.value} style={styles.videoThumb} muted />
                <div style={{ ...styles.videoLabel, padding: "10px 4px 3px", fontSize: 8 }}>{video.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Layout & Settings section (separate for mobile)
  const renderSettingsSection = () => (
    <div style={{ ...styles.card, width: isMobile ? "auto" : 340, flex: isMobile ? 1 : "none", flexShrink: 0, display: "flex", flexDirection: "column", gap: isMobile ? 8 : 16 }}>
        {/* Choose Layout Type */}
        <div>
          <div style={{ fontSize: isMobile ? 9 : 10, fontWeight: 600, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: isMobile ? 6 : 10 }}>
            Choose Layout
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: isMobile ? 6 : 8 }}>
            {/* Split Screen Option */}
            <div
              style={{
                padding: isMobile ? 10 : 16,
                backgroundColor: state.layoutType === "split-screen" 
                  ? (isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(139, 92, 246, 0.1)")
                  : (isDark ? "#1a1a1d" : "#f9fafb"),
                border: `2px solid ${state.layoutType === "split-screen" ? "#8B5CF6" : (isDark ? "#2d2d30" : "#e5e7eb")}`,
                borderRadius: isMobile ? 6 : 10,
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
              }}
              onClick={() => updateState({ layoutType: "split-screen" })}
            >
              <div style={{ 
                width: isMobile ? 28 : 40, 
                height: isMobile ? 28 : 40, 
                margin: isMobile ? "0 auto 5px" : "0 auto 8px", 
                display: "flex", 
                flexDirection: "column",
                border: `2px solid ${state.layoutType === "split-screen" ? "#8B5CF6" : colors.textSecondary}`,
                borderRadius: isMobile ? 3 : 4,
              }}>
                <div style={{ flex: 1, borderBottom: `1px solid ${state.layoutType === "split-screen" ? "#8B5CF6" : colors.textSecondary}` }} />
                <div style={{ flex: 1 }} />
              </div>
              <div style={{ fontSize: isMobile ? 10 : 12, fontWeight: 600, color: colors.textPrimary }}>Split Screen</div>
            </div>

            {/* Pic-in-Pic Option */}
            <div
              style={{
                padding: isMobile ? 10 : 16,
                backgroundColor: state.layoutType === "pic-in-pic" 
                  ? (isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(139, 92, 246, 0.1)")
                  : (isDark ? "#1a1a1d" : "#f9fafb"),
                border: `2px solid ${state.layoutType === "pic-in-pic" ? "#8B5CF6" : (isDark ? "#2d2d30" : "#e5e7eb")}`,
                borderRadius: isMobile ? 6 : 10,
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
              }}
              onClick={() => updateState({ layoutType: "pic-in-pic" })}
            >
              <div style={{ 
                width: isMobile ? 28 : 40, 
                height: isMobile ? 28 : 40, 
                margin: isMobile ? "0 auto 5px" : "0 auto 8px", 
                position: "relative",
                border: `2px solid ${state.layoutType === "pic-in-pic" ? "#8B5CF6" : colors.textSecondary}`,
                borderRadius: isMobile ? 3 : 4,
              }}>
                <div style={{ 
                  position: "absolute", 
                  bottom: isMobile ? 2 : 3, 
                  right: isMobile ? 2 : 3, 
                  width: isMobile ? 8 : 12, 
                  height: isMobile ? 8 : 12, 
                  backgroundColor: state.layoutType === "pic-in-pic" ? "#8B5CF6" : colors.textSecondary,
                  borderRadius: isMobile ? 1 : 2,
                }} />
              </div>
              <div style={{ fontSize: isMobile ? 10 : 12, fontWeight: 600, color: colors.textPrimary }}>Pic-in-Pic</div>
            </div>
          </div>
        </div>

        <div>
          <div style={styles.cardTitle}>⏱️ Duration</div>
          <label style={{ ...styles.label, marginBottom: isMobile ? 3 : 4 }}>
            <span style={{ fontSize: isMobile ? 10 : 11 }}>Length</span>
            <span style={{ ...styles.labelValue, fontSize: isMobile ? 10 : 11 }}>{state.duration}s</span>
          </label>
          <input
            type="range"
            min="5"
            max="60"
            step="1"
            value={state.duration}
            onChange={(e) => updateState({ duration: parseInt(e.target.value) })}
            style={styles.slider}
          />
        </div>

        <div>
          <div style={styles.cardTitle}>🔊 Volume</div>
          <div style={{ marginBottom: isMobile ? 6 : 10 }}>
            <label style={{ ...styles.label, marginBottom: isMobile ? 3 : 4 }}>
              <span style={{ fontSize: isMobile ? 9 : 10 }}>Video 1</span>
              <span style={{ ...styles.labelValue, fontSize: isMobile ? 9 : 10 }}>{Math.round(state.upperVolume * 100)}%</span>
            </label> 
            <input
              type="range"
              min="0"
              max="100"
              value={state.upperVolume * 100}
              onChange={(e) => updateState({ upperVolume: Number(e.target.value) / 100 })}
              style={styles.slider}
            />
          </div>
          <div>
            <label style={{ ...styles.label, marginBottom: isMobile ? 3 : 4 }}>
              <span style={{ fontSize: isMobile ? 9 : 10 }}>Video 2</span>
              <span style={{ ...styles.labelValue, fontSize: isMobile ? 9 : 10 }}>{Math.round(state.lowerVolume * 100)}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={state.lowerVolume * 100}
              onChange={(e) => updateState({ lowerVolume: Number(e.target.value) / 100 })}
              style={styles.slider}
            />
          </div>
        </div>
      </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo} onClick={() => navigate(-1)}>
          <span style={{ fontSize: isMobile ? 16 : 20 }}>←</span>
          <span style={{ color: "#8B5CF6" }}>Split</span> Screen
        </div>

        <div style={{ fontSize: isMobile ? 11 : 14, fontWeight: 500, color: colors.textSecondary, display: isMobile ? "none" : "block" }}>
          🎬 Select videos and layout
        </div>

        <div style={styles.headerActions}>
          <button
            style={{ ...styles.btnPrimary, opacity: canProceed() ? 1 : 0.5 }}
            onClick={proceedToEditor}
            disabled={!canProceed()}
          >
            {isMobile ? "Create →" : "Create Video →"}
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {isMobile ? (
          <>
            {/* Mobile: Preview and Settings side by side at top, centered */}
            <div style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "flex-start", justifyContent: "center" }}>
              {renderPhonePreview()}
              {renderSettingsSection()}
            </div>
            {/* Mobile: Videos below, centered */}
            <div style={{ ...styles.controlsPanel, width: "100%", maxWidth: 500 }}>
              {renderVideosStep()}
            </div>
          </>
        ) : (
          <>
            {/* Desktop: Original layout */}
            {renderPhonePreview()}
            <div style={styles.controlsPanel}>
              {renderVideosStep()}
              {renderSettingsSection()}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SplitScreenWizard;