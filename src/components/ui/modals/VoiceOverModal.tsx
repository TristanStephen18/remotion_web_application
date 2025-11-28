import React, { useState } from "react";
import toast from "react-hot-toast";

interface VoiceoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (audioData: {
    text: string;
    voice: string;
    speed: number;
    audioUrl: string;
  }) => void;
}

const VOICES = [
  { id: "alloy", name: "Alloy (Neutral)", gender: "Neutral" },
  { id: "echo", name: "Echo (Male)", gender: "Male" },
  { id: "fable", name: "Fable (British Male)", gender: "Male" },
  { id: "onyx", name: "Onyx (Deep Male)", gender: "Male" },
  { id: "nova", name: "Nova (Female)", gender: "Female" },
  { id: "shimmer", name: "Shimmer (Soft Female)", gender: "Female" },
];

export const VoiceoverModal: React.FC<VoiceoverModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("alloy");
  const [speed, setSpeed] = useState(1.0);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text");
      return;
    }

    setIsGenerating(true);
    try {
      console.log("🎤 Generating voiceover...", { text: text.substring(0, 50), voice: selectedVoice, speed });
      
      const response = await fetch("/openai/generate-voiceover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          voice: selectedVoice,
          speed: speed,
        }),
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        // Try to parse error as JSON first, fallback to text
        let errorMessage = "Failed to generate voiceover";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (e) {
          // If JSON parse fails, try to get text
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            console.error("Could not parse error response");
          }
        }
        throw new Error(errorMessage);
      }

      console.log("✅ Getting audio blob...");
      const audioBlob = await response.blob();
      console.log("✅ Blob size:", audioBlob.size, "bytes");
      
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log("✅ Audio URL created");

      onGenerate({
        text,
        voice: selectedVoice,
        speed,
        audioUrl,
      });

      toast.success("Voiceover generated!");
      onClose();
      
      // Clear the text after successful generation
      setText("");
    } catch (error) {
      console.error("❌ Error generating voiceover:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate voiceover. Please try again.");
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
    },
    modal: {
      backgroundColor: "#1a1a1a",
      borderRadius: "12px",
      padding: "24px",
      width: "90%",
      maxWidth: "500px",
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
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "13px",
      fontWeight: "600",
      color: "#888",
      marginBottom: "8px",
    },
    textarea: {
      width: "100%",
      minHeight: "120px",
      padding: "12px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#e5e5e5",
      fontSize: "14px",
      fontFamily: "inherit",
      resize: "vertical" as const,
      outline: "none",
    },
    select: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#e5e5e5",
      fontSize: "14px",
      outline: "none",
      cursor: "pointer",
    },
    sliderContainer: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    slider: {
      flex: 1,
      height: "4px",
      borderRadius: "2px",
      appearance: "none" as const,
      backgroundColor: "rgba(255,255,255,0.1)",
      outline: "none",
    },
    sliderValue: {
      fontSize: "14px",
      color: "#e5e5e5",
      fontWeight: "600",
      minWidth: "40px",
      textAlign: "center" as const,
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
      background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      color: "white",
    },
    characterCount: {
      fontSize: "12px",
      color: "#666",
      marginTop: "4px",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.title}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            Create Voiceover
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

        <div style={styles.section}>
          <label style={styles.label}>Text</label>
          <textarea
            style={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to convert to speech..."
            maxLength={4000}
          />
          <div style={styles.characterCount}>{text.length} / 4000 characters</div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Voice</label>
          <select
            style={styles.select}
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
          >
            {VOICES.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Speed: {speed.toFixed(1)}x</label>
          <div style={styles.sliderContainer}>
            <span style={{ color: "#666", fontSize: "12px" }}>0.5x</span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              style={styles.slider}
            />
            <span style={{ color: "#666", fontSize: "12px" }}>2.0x</span>
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
            disabled={isGenerating || !text.trim()}
            onMouseOver={(e) => {
              if (!isGenerating && text.trim()) {
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isGenerating ? "Generating..." : "Generate Voiceover"}
          </button>
        </div>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #8b5cf6;
          border-radius: 50%;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #8b5cf6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};