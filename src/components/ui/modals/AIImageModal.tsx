import React, { useState } from "react";
import toast from "react-hot-toast";

interface AIImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (imageUrl: string) => void;
}

export const AIImageModal: React.FC<AIImageModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [isGenerating, setIsGenerating] = useState(false);

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
      maxWidth: "500px",
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
    textarea: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#e5e5e5",
      fontSize: "14px",
      fontFamily: "inherit",
      resize: "vertical" as const,
      minHeight: "100px",
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
    styleGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "8px",
    },
    styleButton: {
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
    styleButtonActive: {
      backgroundColor: "rgba(236, 72, 153, 0.2)",
      borderColor: "#ec4899",
      color: "#ec4899",
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
    generateButton: {
      background: "linear-gradient(135deg, #ec4899 0%, #d946ef 100%)",
      color: "white",
    },
    generatingButton: {
      background: "linear-gradient(135deg, #666 0%, #555 100%)",
      cursor: "not-allowed",
      opacity: 0.6,
    },
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate API call - replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock generated image URL - replace with actual API response
      const mockImageUrl = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&h=1920&fit=crop`;
      
      onGenerate(mockImageUrl);
      toast.success("Image generated successfully!");
      onClose();
      setPrompt("");
      setStyle("realistic");
      setAspectRatio("9:16");
    } catch (error) {
      toast.error("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>AI Image Generator</h2>
          <p style={styles.subtitle}>Create stunning images from text descriptions</p>
        </div>

        <div style={styles.content}>
          <div style={styles.section}>
            <label style={styles.label}>Prompt *</label>
            <textarea
              style={styles.textarea}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create... (e.g., 'A serene mountain landscape at sunset with purple skies')"
              disabled={isGenerating}
            />
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Style</label>
            <div style={styles.styleGrid}>
              {["Realistic", "Artistic", "Anime", "3D Render"].map((s) => (
                <button
                  key={s}
                  style={{
                    ...styles.styleButton,
                    ...(style === s.toLowerCase() ? styles.styleButtonActive : {}),
                  }}
                  onClick={() => setStyle(s.toLowerCase())}
                  disabled={isGenerating}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Aspect Ratio</label>
            <select
              style={styles.select}
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              disabled={isGenerating}
            >
              <option value="9:16">9:16 (Vertical)</option>
              <option value="16:9">16:9 (Horizontal)</option>
              <option value="1:1">1:1 (Square)</option>
              <option value="4:5">4:5 (Portrait)</option>
            </select>
          </div>
        </div>

        <div style={styles.footer}>
          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={onClose}
            disabled={isGenerating}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.button,
              ...(isGenerating ? styles.generatingButton : styles.generateButton),
            }}
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Image"}
          </button>
        </div>
      </div>
    </div>
  );
};