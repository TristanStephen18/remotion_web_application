


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
      display: "flex",
      alignItems: "center",
      gap: "10px",
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
      transition: "border-color 0.2s",
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
    infoBox: {
      backgroundColor: "rgba(236, 72, 153, 0.1)",
      border: "1px solid rgba(236, 72, 153, 0.3)",
      borderRadius: "8px",
      padding: "12px",
      marginBottom: "20px",
      fontSize: "13px",
      color: "#ec4899",
      display: "flex",
      alignItems: "flex-start",
      gap: "8px",
    },
    loadingSpinner: {
      display: "inline-block",
      width: "16px",
      height: "16px",
      border: "2px solid rgba(255,255,255,0.3)",
      borderTopColor: "white",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    },
  };

  // Convert aspect ratio to dimensions
  const getImageDimensions = (ratio: string): { width: number; height: number } => {
    const dimensionMap: Record<string, { width: number; height: number }> = {
      "9:16": { width: 768, height: 1365 },
      "16:9": { width: 1365, height: 768 },
      "1:1": { width: 1024, height: 1024 },
      "4:5": { width: 819, height: 1024 },
    };
    return dimensionMap[ratio] || { width: 1024, height: 1024 };
  };

  // Build enhanced prompt based on style
  const buildEnhancedPrompt = (basePrompt: string, selectedStyle: string): string => {
    const styleModifiers: Record<string, string> = {
      realistic: "photorealistic, highly detailed, professional photography, 8k quality",
      artistic: "artistic painting, expressive, vibrant colors, masterpiece",
      anime: "anime style, manga art, vibrant anime aesthetic, high quality anime illustration",
      "3drender": "3D render, CGI, octane render, professional 3D graphics, detailed textures",
    };

    const modifier = styleModifiers[selectedStyle] || "";
    return `${basePrompt}, ${modifier}`;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading("Generating your image...");

    try {
      console.log("🚀 Generating image with Pollinations AI...");
      console.log("📝 Prompt:", prompt);
      console.log("🎨 Style:", style);
      console.log("📐 Aspect Ratio:", aspectRatio);

      const dimensions = getImageDimensions(aspectRatio);
      const enhancedPrompt = buildEnhancedPrompt(prompt, style);
      
      // Encode the prompt for URL
      const encodedPrompt = encodeURIComponent(enhancedPrompt);
      
      // Build Pollinations AI URL
      // Format: https://image.pollinations.ai/prompt/{prompt}?width={width}&height={height}&seed={seed}&nologo=true
      const seed = Math.floor(Math.random() * 1000000); // Random seed for variation
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${dimensions.width}&height=${dimensions.height}&seed=${seed}&nologo=true&enhance=true`;

      console.log("🔗 Generated URL:", imageUrl);

      // Preload the image to ensure it's ready
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      console.log("✅ Image loaded successfully");

      toast.success("Image generated successfully!");

      // Pass the image URL to the parent component
      onGenerate(imageUrl);

      // Reset form and close modal
      setPrompt("");
      setStyle("realistic");
      setAspectRatio("9:16");
      onClose();
    } catch (error) {
      console.error("❌ Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      toast.dismiss(loadingToast);
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            <span>🎨</span> AI Image Generator
          </h2>
          <p style={styles.subtitle}>
            Powered by Pollinations AI • Free & unlimited image generation
          </p>
        </div>

        <div style={styles.content}>
          {/* Info box */}
          <div style={styles.infoBox}>
            <span>💡</span>
            <div>
              <strong>Tip:</strong> Be descriptive! Include details about style,
              lighting, colors, and mood for best results.
            </div>
          </div>

          {/* Prompt input */}
          <div style={styles.section}>
            <label style={styles.label}>
              Prompt <span style={{ color: "#ec4899" }}>*</span>
            </label>
            <textarea
              style={styles.textarea}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'A golden retriever playing in a sunny park with flowers'"
              disabled={isGenerating}
              onFocus={(e) =>
                (e.target.style.borderColor = "#ec4899")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
          </div>

          {/* Style selector */}
          <div style={styles.section}>
            <label style={styles.label}>Style</label>
            <div style={styles.styleGrid}>
              {[
                { value: "realistic", label: "📷 Realistic" },
                { value: "artistic", label: "🎨 Artistic" },
                { value: "anime", label: "🌸 Anime" },
                { value: "3drender", label: "🎮 3D Render" },
              ].map((s) => (
                <button
                  key={s.value}
                  style={{
                    ...styles.styleButton,
                    ...(style === s.value ? styles.styleButtonActive : {}),
                  }}
                  onClick={() => setStyle(s.value)}
                  disabled={isGenerating}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect ratio selector */}
          <div style={styles.section}>
            <label style={styles.label}>Aspect Ratio</label>
            <select
              style={styles.select}
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              disabled={isGenerating}
            >
              <option value="9:16">📱 9:16 (Vertical - 768×1365)</option>
              <option value="16:9">🖥️ 16:9 (Horizontal - 1365×768)</option>
              <option value="1:1">⬜ 1:1 (Square - 1024×1024)</option>
              <option value="4:5">🖼️ 4:5 (Portrait - 819×1024)</option>
            </select>
          </div>

          {/* Character count */}
          <div style={{ fontSize: "12px", color: "#666", textAlign: "right" }}>
            {prompt.length} characters
          </div>
        </div>

        {/* Footer with buttons */}
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
              ...(isGenerating
                ? styles.generatingButton
                : styles.generateButton),
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating && (
              <span style={styles.loadingSpinner}></span>
            )}
            {isGenerating ? "Generating..." : "✨ Generate Image"}
          </button>
        </div>
      </div>

      {/* Add keyframe animation for spinner */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};