import React, { useState } from "react";
import toast from "react-hot-toast";

interface RemoveBackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcess: (processedImageUrl: string) => void;
  selectedLayerId: string | null;
}

export const RemoveBackgroundModal: React.FC<RemoveBackgroundModalProps> = ({
  isOpen,
  onClose,
  onProcess,
  selectedLayerId,
}) => {
  const [quality, setQuality] = useState("high");
  const [edgeSmoothing, setEdgeSmoothing] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);

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
      backgroundColor: "rgba(6, 182, 212, 0.1)",
      border: "1px solid rgba(6, 182, 212, 0.3)",
      borderRadius: "8px",
      color: "#06b6d4",
      fontSize: "13px",
      marginBottom: "20px",
    },
    qualityGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "8px",
    },
    qualityButton: {
      padding: "12px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#888",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s",
      textAlign: "center" as const,
    },
    qualityButtonActive: {
      backgroundColor: "rgba(6, 182, 212, 0.2)",
      borderColor: "#06b6d4",
      color: "#06b6d4",
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
      color: "#06b6d4",
      minWidth: "30px",
      textAlign: "center" as const,
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
    processButton: {
      background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      color: "white",
    },
    processingButton: {
      background: "linear-gradient(135deg, #666 0%, #555 100%)",
      cursor: "not-allowed",
      opacity: 0.6,
    },
  };

  const handleProcess = async () => {
    if (!selectedLayerId) {
      toast.error("Please select a layer first");
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call - replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock processed image URL - replace with actual API response
      const mockProcessedUrl = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&h=1920&fit=crop&bg-remove=true`;
      
      onProcess(mockProcessedUrl);
      toast.success("Background removed successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to remove background");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Remove Background</h2>
          <p style={styles.subtitle}>AI-powered background removal</p>
        </div>

        <div style={styles.content}>
          {!selectedLayerId && (
            <div style={styles.warning}>
              ⚠️ Please select an image or video layer before using this tool
            </div>
          )}

          <div style={styles.section}>
            <label style={styles.label}>Quality</label>
            <div style={styles.qualityGrid}>
              {["Fast", "Balanced", "High"].map((q) => (
                <button
                  key={q}
                  style={{
                    ...styles.qualityButton,
                    ...(quality === q.toLowerCase() ? styles.qualityButtonActive : {}),
                  }}
                  onClick={() => setQuality(q.toLowerCase())}
                  disabled={isProcessing || !selectedLayerId}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Edge Smoothing</label>
            <div style={styles.sliderContainer}>
              <input
                type="range"
                min="0"
                max="10"
                value={edgeSmoothing}
                onChange={(e) => setEdgeSmoothing(Number(e.target.value))}
                style={styles.slider}
                disabled={isProcessing || !selectedLayerId}
              />
              <span style={styles.sliderValue}>{edgeSmoothing}</span>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.button,
              ...(isProcessing || !selectedLayerId ? styles.processingButton : styles.processButton),
            }}
            onClick={handleProcess}
            disabled={isProcessing || !selectedLayerId}
          >
            {isProcessing ? "Processing..." : "Remove Background"}
          </button>
        </div>
      </div>
    </div>
  );
};