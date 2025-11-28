import React, { useState } from "react";
import toast from "react-hot-toast";

interface RemixShortsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (settings: {
    style: string;
    duration: number;
    variations: number;
    effects: string[];
  }) => void;
}

const REMIX_STYLES = [
  { id: "viral", name: "Viral", icon: "🔥", description: "Trending viral format" },
  { id: "meme", name: "Meme", icon: "😂", description: "Meme-style remix" },
  { id: "educational", name: "Educational", icon: "📚", description: "Clear and informative" },
  { id: "cinematic", name: "Cinematic", icon: "🎬", description: "Professional look" },
  { id: "funny", name: "Funny", icon: "🤣", description: "Comedy-focused" },
  { id: "dramatic", name: "Dramatic", icon: "🎭", description: "Dramatic impact" },
];

const EFFECTS = [
  { id: "captions", name: "Auto Captions", icon: "💬" },
  { id: "music", name: "Trending Music", icon: "🎵" },
  { id: "transitions", name: "Dynamic Transitions", icon: "✨" },
  { id: "zoom", name: "Auto Zoom", icon: "🔍" },
  { id: "emoji", name: "Emoji Reactions", icon: "😊" },
  { id: "sound", name: "Sound Effects", icon: "🔊" },
];

export const RemixShortsModal: React.FC<RemixShortsModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [selectedStyle, setSelectedStyle] = useState("viral");
  const [duration, setDuration] = useState(30);
  const [variations, setVariations] = useState(3);
  const [selectedEffects, setSelectedEffects] = useState<string[]>(["captions", "music"]);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleEffect = (effectId: string) => {
    setSelectedEffects((prev) =>
      prev.includes(effectId)
        ? prev.filter((id) => id !== effectId)
        : [...prev, effectId]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      onGenerate({
        style: selectedStyle,
        duration,
        variations,
        effects: selectedEffects,
      });
      
      toast.success(`Generating ${variations} remix variations!`);
      onClose();
    } catch (error) {
      console.error("Error generating remix:", error);
      toast.error("Failed to generate remix");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      overflowY: "auto" as const,
      padding: "20px",
    },
    modal: {
      backgroundColor: "#1a1a1a",
      borderRadius: "12px",
      padding: "24px",
      width: "90%",
      maxWidth: "700px",
      maxHeight: "90vh",
      overflowY: "auto" as const,
      border: "1px solid rgba(255,255,255,0.1)",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "20px",
    },
    title: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#e5e5e5",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    closeButton: {
      background: "none",
      border: "none",
      color: "#888",
      fontSize: "24px",
      cursor: "pointer",
      padding: "4px",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      transition: "all 0.2s",
    },
    section: {
      marginBottom: "24px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: "#e5e5e5",
      marginBottom: "12px",
    },
    styleGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "12px",
    },
    styleCard: {
      padding: "16px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s",
      textAlign: "center" as const,
    },
    styleCardActive: {
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "#3b82f6",
    },
    styleIcon: {
      fontSize: "32px",
      marginBottom: "8px",
    },
    styleName: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#e5e5e5",
      marginBottom: "4px",
    },
    styleDescription: {
      fontSize: "11px",
      color: "#888",
    },
    sliderContainer: {
      marginTop: "12px",
    },
    sliderLabel: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px",
      fontSize: "13px",
      color: "#888",
    },
    slider: {
      width: "100%",
      height: "4px",
      borderRadius: "2px",
      appearance: "none" as const,
      backgroundColor: "rgba(255,255,255,0.1)",
      outline: "none",
    },
    effectsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "12px",
    },
    effectCard: {
      padding: "14px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    effectCardActive: {
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "#3b82f6",
    },
    effectIcon: {
      fontSize: "24px",
    },
    effectName: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#e5e5e5",
    },
    infoBox: {
      padding: "16px",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      border: "1px solid rgba(59, 130, 246, 0.3)",
      borderRadius: "8px",
      marginBottom: "20px",
    },
    infoTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#3b82f6",
      marginBottom: "8px",
    },
    infoText: {
      fontSize: "13px",
      color: "#888",
      lineHeight: "1.5",
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      marginTop: "24px",
    },
    button: {
      flex: 1,
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      border: "none",
    },
    cancelButton: {
      backgroundColor: "transparent",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#888",
    },
    generateButton: {
      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      color: "white",
    },
  };

  const selectedStyleData = REMIX_STYLES.find((s) => s.id === selectedStyle);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.title}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
            Remix Shorts with AI
          </div>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            ×
          </button>
        </div>

        <div style={styles.infoBox}>
          <div style={styles.infoTitle}>🤖 AI-Powered Remix</div>
          <div style={styles.infoText}>
            Our AI will analyze your video and create multiple viral-ready versions with trending
            effects, music, and optimizations. Each variation is unique and ready to post!
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Remix Style</label>
          <div style={styles.styleGrid}>
            {REMIX_STYLES.map((style) => (
              <div
                key={style.id}
                style={{
                  ...styles.styleCard,
                  ...(selectedStyle === style.id ? styles.styleCardActive : {}),
                }}
                onClick={() => setSelectedStyle(style.id)}
              >
                <div style={styles.styleIcon}>{style.icon}</div>
                <div style={styles.styleName}>{style.name}</div>
                <div style={styles.styleDescription}>{style.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Target Duration: {duration}s</label>
          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabel}>
              <span>15s</span>
              <span>60s</span>
            </div>
            <input
              type="range"
              min="15"
              max="60"
              step="5"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              style={styles.slider}
            />
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Variations: {variations}</label>
          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabel}>
              <span>1</span>
              <span>Generate {variations} unique versions</span>
              <span>5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={variations}
              onChange={(e) => setVariations(parseInt(e.target.value))}
              style={styles.slider}
            />
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Effects to Include</label>
          <div style={styles.effectsGrid}>
            {EFFECTS.map((effect) => (
              <div
                key={effect.id}
                style={{
                  ...styles.effectCard,
                  ...(selectedEffects.includes(effect.id) ? styles.effectCardActive : {}),
                }}
                onClick={() => toggleEffect(effect.id)}
              >
                <div style={styles.effectIcon}>{effect.icon}</div>
                <div style={styles.effectName}>{effect.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={onClose}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            Cancel
          </button>
          <button
            style={{ ...styles.button, ...styles.generateButton }}
            onClick={handleGenerate}
            disabled={isGenerating}
            onMouseOver={(e) => {
              if (!isGenerating) {
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isGenerating ? "Generating..." : `Generate ${variations} Remixes`}
          </button>
        </div>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};