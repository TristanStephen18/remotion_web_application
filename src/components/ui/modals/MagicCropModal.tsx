import React, { useState } from "react";
import toast from "react-hot-toast";

interface MagicCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (settings: {
    cropType: string;
    intensity: number;
    focusPoint: string;
    enableAutoZoom: boolean;
  }) => void;
  selectedLayerId: string | null;
}

const CROP_TYPES = [
  { id: "smart", name: "Smart Crop", description: "AI detects main subject" },
  { id: "face", name: "Face Focus", description: "Follows faces in video" },
  { id: "center", name: "Center Focus", description: "Keeps center in frame" },
  { id: "action", name: "Action Focus", description: "Follows movement" },
];

const FOCUS_POINTS = [
  { id: "auto", name: "Auto" },
  { id: "center", name: "Center" },
  { id: "top", name: "Top" },
  { id: "bottom", name: "Bottom" },
  { id: "left", name: "Left" },
  { id: "right", name: "Right" },
];

export const MagicCropModal: React.FC<MagicCropModalProps> = ({
  isOpen,
  onClose,
  onApply,
  selectedLayerId,
}) => {
  const [cropType, setCropType] = useState("smart");
  const [intensity, setIntensity] = useState(75);
  const [focusPoint, setFocusPoint] = useState("auto");
  const [enableAutoZoom, setEnableAutoZoom] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApply = async () => {
    if (!selectedLayerId) {
      toast.error("Please select a video layer first");
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onApply({
        cropType,
        intensity,
        focusPoint,
        enableAutoZoom,
      });
      
      toast.success("Magic crop applied!");
      onClose();
    } catch (error) {
      console.error("Error applying magic crop:", error);
      toast.error("Failed to apply magic crop");
    } finally {
      setIsProcessing(false);
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
      maxWidth: "600px",
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
    cropGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
    },
    cropCard: {
      padding: "16px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    cropCardActive: {
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      borderColor: "#10b981",
    },
    cropCardTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#e5e5e5",
      marginBottom: "4px",
    },
    cropCardDescription: {
      fontSize: "12px",
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
    focusGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "8px",
    },
    focusButton: {
      padding: "10px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "6px",
      color: "#888",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    focusButtonActive: {
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      borderColor: "#10b981",
      color: "#10b981",
    },
    toggleContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
    },
    toggleLabel: {
      fontSize: "14px",
      color: "#e5e5e5",
    },
    toggleDescription: {
      fontSize: "12px",
      color: "#888",
      marginTop: "2px",
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
      backgroundColor: "#10b981",
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
    warningBox: {
      padding: "12px",
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      border: "1px solid rgba(245, 158, 11, 0.3)",
      borderRadius: "8px",
      fontSize: "13px",
      color: "#f59e0b",
      marginBottom: "20px",
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
    applyButton: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "white",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.title}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15" />
              <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15" />
            </svg>
            Magic Crop
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

        {!selectedLayerId && (
          <div style={styles.warningBox}>
            ⚠️ Please select a video layer to apply magic crop
          </div>
        )}

        <div style={styles.section}>
          <label style={styles.label}>Crop Type</label>
          <div style={styles.cropGrid}>
            {CROP_TYPES.map((type) => (
              <div
                key={type.id}
                style={{
                  ...styles.cropCard,
                  ...(cropType === type.id ? styles.cropCardActive : {}),
                }}
                onClick={() => setCropType(type.id)}
              >
                <div style={styles.cropCardTitle}>{type.name}</div>
                <div style={styles.cropCardDescription}>{type.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Crop Intensity</label>
          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabel}>
              <span>Subtle</span>
              <span>{intensity}%</span>
              <span>Aggressive</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              style={styles.slider}
            />
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Focus Point</label>
          <div style={styles.focusGrid}>
            {FOCUS_POINTS.map((point) => (
              <button
                key={point.id}
                style={{
                  ...styles.focusButton,
                  ...(focusPoint === point.id ? styles.focusButtonActive : {}),
                }}
                onClick={() => setFocusPoint(point.id)}
              >
                {point.name}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.toggleContainer}>
            <div>
              <div style={styles.toggleLabel}>Auto Zoom</div>
              <div style={styles.toggleDescription}>
                Automatically zoom in on important moments
              </div>
            </div>
            <button
              style={{
                ...styles.toggle,
                ...(enableAutoZoom ? styles.toggleActive : {}),
              }}
              onClick={() => setEnableAutoZoom(!enableAutoZoom)}
            >
              <div
                style={{
                  ...styles.toggleKnob,
                  ...(enableAutoZoom ? styles.toggleKnobActive : {}),
                }}
              />
            </button>
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
            style={{ ...styles.button, ...styles.applyButton }}
            onClick={handleApply}
            disabled={isProcessing || !selectedLayerId}
            onMouseOver={(e) => {
              if (!isProcessing && selectedLayerId) {
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isProcessing ? "Processing..." : "Apply Magic Crop"}
          </button>
        </div>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #10b981;
          border-radius: 50%;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #10b981;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};