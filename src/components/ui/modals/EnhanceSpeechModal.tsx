import React, { useState } from "react";
import toast from "react-hot-toast";

interface EnhanceSpeechModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnhance: (data: {
    audioUrl: string;
    denoiseLevel: number;
    enhanceClarity: boolean;
  }) => void;
  selectedLayerId: string | null;
}

export const EnhanceSpeechModal: React.FC<EnhanceSpeechModalProps> = ({
  isOpen,
  onClose,
  onEnhance,
  selectedLayerId,
}) => {
  const [denoiseLevel, setDenoiseLevel] = useState(7);
  const [enhanceClarity, setEnhanceClarity] = useState(true);
  const [removeEcho, setRemoveEcho] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const styles: Record<string, React.CSSProperties> = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      backgroundColor: "#1a1a1a",
      borderRadius: "16px",
      width: "100%",
      maxWidth: "480px",
      maxHeight: "90vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    header: {
      padding: "24px 24px 20px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    },
    title: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#e5e5e5",
      margin: "0 0 8px 0",
    },
    subtitle: {
      fontSize: "13px",
      color: "#888",
      margin: 0,
    },
    content: {
      padding: "24px",
      overflowY: "auto" as const,
      flex: 1,
    },
    section: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "13px",
      fontWeight: "600",
      color: "#e5e5e5",
      marginBottom: "8px",
    },
    warning: {
      padding: "12px 16px",
      backgroundColor: "rgba(20, 184, 166, 0.1)",
      border: "1px solid rgba(20, 184, 166, 0.3)",
      borderRadius: "8px",
      color: "#14b8a6",
      fontSize: "13px",
      marginBottom: "20px",
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
      cursor: "pointer",
      outline: "none",
    },
    sliderValue: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#14b8a6",
      minWidth: "30px",
      textAlign: "center" as const,
    },
    toggleContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px",
      backgroundColor: "#0f0f0f",
      borderRadius: "8px",
      marginBottom: "12px",
    },
    toggleLabel: {
      fontSize: "14px",
      color: "#e5e5e5",
    },
    toggle: {
      width: "44px",
      height: "24px",
      borderRadius: "12px",
      backgroundColor: "rgba(255,255,255,0.1)",
      border: "none",
      cursor: "pointer",
      position: "relative" as const,
      transition: "background-color 0.2s",
    },
    toggleActive: {
      backgroundColor: "#14b8a6",
    },
    toggleKnob: {
      position: "absolute" as const,
      top: "2px",
      left: "2px",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      backgroundColor: "white",
      transition: "transform 0.2s",
    },
    toggleKnobActive: {
      transform: "translateX(20px)",
    },
    footer: {
      padding: "16px 24px",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },
    button: {
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      border: "none",
      outline: "none",
    },
    cancelButton: {
      backgroundColor: "transparent",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#888",
    },
    enhanceButton: {
      background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
      color: "white",
    },
    enhancingButton: {
      background: "linear-gradient(135deg, #666 0%, #555 100%)",
      cursor: "not-allowed",
      opacity: 0.6,
    },
  };

  const handleEnhance = async () => {
    if (!selectedLayerId) {
      toast.error("Please select an audio layer first");
      return;
    }

    setIsEnhancing(true);
    try {
      // Simulate API call - replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock enhanced audio URL - replace with actual API response
      const mockEnhancedUrl = `https://example.com/enhanced-audio-${Date.now()}.mp3`;
      
      onEnhance({
        audioUrl: mockEnhancedUrl,
        denoiseLevel,
        enhanceClarity,
      });
      toast.success("Speech enhanced successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to enhance speech");
    } finally {
      setIsEnhancing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Enhance Speech</h2>
          <p style={styles.subtitle}>Remove noise and improve audio clarity</p>
        </div>

        <div style={styles.content}>
          {!selectedLayerId && (
            <div style={styles.warning}>
              ⚠️ Please select an audio layer before using this tool
            </div>
          )}

          <div style={styles.section}>
            <label style={styles.label}>Noise Reduction Level</label>
            <div style={styles.sliderContainer}>
              <input
                type="range"
                min="0"
                max="10"
                value={denoiseLevel}
                onChange={(e) => setDenoiseLevel(Number(e.target.value))}
                style={styles.slider}
                disabled={isEnhancing || !selectedLayerId}
              />
              <span style={styles.sliderValue}>{denoiseLevel}</span>
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Enhancement Options</label>
            
            <div style={styles.toggleContainer}>
              <span style={styles.toggleLabel}>Enhance Clarity</span>
              <button
                style={{
                  ...styles.toggle,
                  ...(enhanceClarity ? styles.toggleActive : {}),
                }}
                onClick={() => setEnhanceClarity(!enhanceClarity)}
                disabled={isEnhancing || !selectedLayerId}
              >
                <div
                  style={{
                    ...styles.toggleKnob,
                    ...(enhanceClarity ? styles.toggleKnobActive : {}),
                  }}
                />
              </button>
            </div>

            <div style={styles.toggleContainer}>
              <span style={styles.toggleLabel}>Remove Echo</span>
              <button
                style={{
                  ...styles.toggle,
                  ...(removeEcho ? styles.toggleActive : {}),
                }}
                onClick={() => setRemoveEcho(!removeEcho)}
                disabled={isEnhancing || !selectedLayerId}
              >
                <div
                  style={{
                    ...styles.toggleKnob,
                    ...(removeEcho ? styles.toggleKnobActive : {}),
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={onClose}
            disabled={isEnhancing}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.button,
              ...(isEnhancing || !selectedLayerId ? styles.enhancingButton : styles.enhanceButton),
            }}
            onClick={handleEnhance}
            disabled={isEnhancing || !selectedLayerId}
          >
            {isEnhancing ? "Enhancing..." : "Enhance Speech"}
          </button>
        </div>
      </div>
    </div>
  );
};