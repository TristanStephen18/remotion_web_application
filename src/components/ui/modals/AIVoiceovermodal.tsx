import React, { useState } from "react";
import toast from "react-hot-toast";
import { backendPrefix } from "../../../config";

interface AIVoiceoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: {
    text: string;
    voice: string;
    emotion: string;
    speed: number;
    audioUrl: string;
  }) => void;
}

export const AIVoiceoverModal: React.FC<AIVoiceoverModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [emotion, setEmotion] = useState("neutral");
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [isGenerating, setIsGenerating] = useState(false);

  const voices = [
    { value: "alloy", label: "Alloy", gender: "Neutral", desc: "Balanced, clear" },
    { value: "echo", label: "Echo", gender: "Male", desc: "Deep, authoritative" },
    { value: "fable", label: "Fable", gender: "Male", desc: "Warm, storytelling" },
    { value: "onyx", label: "Onyx", gender: "Male", desc: "Professional, news" },
    { value: "nova", label: "Nova", gender: "Female", desc: "Energetic, young" },
    { value: "shimmer", label: "Shimmer", gender: "Female", desc: "Soft, friendly" },
  ];

  const emotions = [
    { value: "neutral", label: "Neutral", icon: "😐" },
    { value: "happy", label: "Happy", icon: "😊" },
    { value: "excited", label: "Excited", icon: "🤩" },
    { value: "calm", label: "Calm", icon: "😌" },
    { value: "sad", label: "Sad", icon: "😢" },
    { value: "angry", label: "Angry", icon: "😠" },
  ];

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please enter text for voiceover");
      return;
    }

    if (text.length < 5) {
      toast.error("Text must be at least 5 characters");
      return;
    }

    if (text.length > 4000) {
      toast.error("Text must be less than 4000 characters");
      return;
    }

    setIsGenerating(true);
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch(`${backendPrefix}/sound/generate-voiceover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voice,
          emotion,
          speed,
          pitch,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate voiceover");

      const data = await response.json();

      onGenerate({
        text,
        voice,
        emotion,
        speed,
        audioUrl: data.audioUrl,
      });

      toast.success("Voiceover generated successfully!");
      setText("");
      onClose();
    } catch (error) {
      console.error("Generate voiceover error:", error);
      toast.error("Failed to generate voiceover. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      setText("");
      setVoice("alloy");
      setEmotion("neutral");
      setSpeed(1.0);
      setPitch(1.0);
      onClose();
    }
  };

  if (!isOpen) return null;

  const selectedVoice = voices.find((v) => v.value === voice);

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.titleRow}>
            <div style={{ ...styles.iconCircle, backgroundColor: "rgba(20, 184, 166, 0.2)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <h2 style={styles.title}>AI Voiceover</h2>
          </div>
          <button
            style={styles.closeBtn}
            onClick={handleClose}
            disabled={isGenerating}
            onMouseOver={(e) => !isGenerating && (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Script <span style={styles.required}>*</span>
            </label>
            <textarea
              style={styles.textarea}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to convert to speech..."
              rows={5}
              disabled={isGenerating}
              maxLength={4000}
            />
            <div style={styles.hint}>
              {text.length}/4000 characters
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Voice Selection</label>
            <div style={styles.voiceGrid}>
              {voices.map((v) => (
                <button
                  key={v.value}
                  style={{
                    ...styles.voiceCard,
                    ...(voice === v.value ? styles.voiceCardActive : {}),
                  }}
                  onClick={() => setVoice(v.value)}
                  disabled={isGenerating}
                >
                  <div style={styles.voiceLabel}>{v.label}</div>
                  <div style={styles.voiceGender}>{v.gender}</div>
                  <div style={styles.voiceDesc}>{v.desc}</div>
                </button>
              ))}
            </div>
            {selectedVoice && (
              <div style={styles.selectedVoiceInfo}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>
                  {selectedVoice.label} - {selectedVoice.gender} - {selectedVoice.desc}
                </span>
              </div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Emotion</label>
            <div style={styles.emotionGrid}>
              {emotions.map((e) => (
                <button
                  key={e.value}
                  style={{
                    ...styles.emotionButton,
                    ...(emotion === e.value ? styles.emotionButtonActive : {}),
                  }}
                  onClick={() => setEmotion(e.value)}
                  disabled={isGenerating}
                >
                  <span style={styles.emotionIcon}>{e.icon}</span>
                  <span style={styles.emotionLabel}>{e.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={styles.slidersRow}>
            <div style={styles.sliderGroup}>
              <label style={styles.label}>
                Speed
                <span style={styles.labelValue}>{speed.toFixed(1)}x</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                disabled={isGenerating}
                style={styles.slider}
              />
              <div style={styles.sliderLabels}>
                <span>0.5x</span>
                <span>2.0x</span>
              </div>
            </div>

            <div style={styles.sliderGroup}>
              <label style={styles.label}>
                Pitch
                <span style={styles.labelValue}>{pitch.toFixed(1)}x</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                disabled={isGenerating}
                style={styles.slider}
              />
              <div style={styles.sliderLabels}>
                <span>Lower</span>
                <span>Higher</span>
              </div>
            </div>
          </div>

          <div style={styles.estimateBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={styles.estimateText}>
              Estimated duration: ~{Math.ceil(text.length / 15)} seconds
            </span>
          </div>

          <button
            style={{
              ...styles.button,
              ...(isGenerating || !text.trim() ? styles.buttonDisabled : {}),
            }}
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
            onMouseOver={(e) => {
              if (!isGenerating && text.trim()) {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(20, 184, 166, 0.4)";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {isGenerating ? (
              <span style={styles.buttonContent}>
                <span style={styles.spinner} />
                Generating...
              </span>
            ) : (
              <span style={styles.buttonContent}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                </svg>
                Generate Voiceover
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    backdropFilter: "blur(4px)",
  },
  modal: {
    backgroundColor: "#1a1a1a",
    borderRadius: "16px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  header: {
    padding: "24px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  iconCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#e5e5e5",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "#888",
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
  content: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#e5e5e5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  required: {
    color: "#ef4444",
  },
  labelValue: {
    color: "#14b8a6",
    fontWeight: "600",
  },
  textarea: {
    padding: "12px",
    backgroundColor: "#0f0f0f",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    color: "#e5e5e5",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: "1.6",
  },
  hint: {
    fontSize: "12px",
    color: "#666",
  },
  voiceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
  },
  voiceCard: {
    padding: "12px",
    backgroundColor: "#0f0f0f",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "center",
  },
  voiceCardActive: {
    backgroundColor: "rgba(20, 184, 166, 0.2)",
    borderColor: "#14b8a6",
  },
  voiceLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#e5e5e5",
    marginBottom: "4px",
  },
  voiceGender: {
    fontSize: "11px",
    color: "#14b8a6",
    marginBottom: "4px",
  },
  voiceDesc: {
    fontSize: "10px",
    color: "#666",
  },
  selectedVoiceInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#14b8a6",
    padding: "8px 12px",
    backgroundColor: "rgba(20, 184, 166, 0.1)",
    borderRadius: "6px",
  },
  emotionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "8px",
  },
  emotionButton: {
    padding: "12px 8px",
    backgroundColor: "#0f0f0f",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  emotionButtonActive: {
    backgroundColor: "rgba(20, 184, 166, 0.2)",
    borderColor: "#14b8a6",
  },
  emotionIcon: {
    fontSize: "20px",
  },
  emotionLabel: {
    fontSize: "11px",
    color: "#e5e5e5",
  },
  slidersRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  sliderGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  slider: {
    width: "100%",
    height: "6px",
    borderRadius: "3px",
    background: "rgba(255, 255, 255, 0.1)",
    outline: "none",
    cursor: "pointer",
  },
  sliderLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#666",
  },
  estimateBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px",
    backgroundColor: "rgba(20, 184, 166, 0.1)",
    border: "1px solid rgba(20, 184, 166, 0.2)",
    borderRadius: "8px",
  },
  estimateText: {
    fontSize: "13px",
    color: "#5eead4",
  },
  button: {
    padding: "14px 20px",
    background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    marginTop: "8px",
  },
  buttonDisabled: {
    background: "#333",
    cursor: "not-allowed",
    opacity: 0.6,
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};