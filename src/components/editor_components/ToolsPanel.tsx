import React from "react";
import { EditorIcons } from "./EditorIcons";
import { useTheme } from "../../contexts/ThemeContext";
import type { ThemeColors } from "../../contexts/ThemeContext";

interface ToolsPanelProps {
  onVoiceoverClick: () => void;
  onRedditPostClick: () => void;
  onMagicCropClick: () => void;
  onEmojiPickerClick: () => void;
  onRemixShortsClick: () => void;
  onAIImageClick: () => void;
  onVEOGeneratorClick: () => void;
  onYoutubeDownloaderClick: () => void;
  onEnhanceSpeechClick: () => void;
  onRemoveBackgroundClick: () => void;
}

const getStyles = (colors: ThemeColors): Record<string, React.CSSProperties> => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflowY: "auto",
    backgroundColor: colors.bgPrimary,
  },
  header: {
    padding: "16px",
    borderBottom: `1px solid ${colors.border}`,
  },
  title: {
    fontSize: "14px",
    fontWeight: "600",
    color: colors.textPrimary,
    margin: "0 0 4px 0",
  },
  subtitle: {
    fontSize: "11px",
    color: colors.textMuted,
    margin: 0,
  },
  toolsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
    padding: "16px",
  },
  toolCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    padding: "16px 12px",
    backgroundColor: colors.bgSecondary,
    border: `1px solid ${colors.borderHeavy}`,
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "center",
  },
  iconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
  toolInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  toolName: {
    fontSize: "12px",
    fontWeight: "600",
    color: colors.textPrimary,
  },
  toolDescription: {
    fontSize: "10px",
    color: colors.textMuted,
  },
});

/**
 * ToolsPanel Component
 * 
 * Displays all AI-powered tools in a grid layout
 * Each tool opens its respective modal when clicked
 */
export const ToolsPanel: React.FC<ToolsPanelProps> = ({
  onVoiceoverClick,
  onRedditPostClick,
  onMagicCropClick,
  onEmojiPickerClick,
  // onRemixShortsClick,
  onAIImageClick,
  onVEOGeneratorClick,
  // onYoutubeDownloaderClick,
  onEnhanceSpeechClick,
  onRemoveBackgroundClick,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const tools = [
    {
      id: "voiceover",
      name: "AI Voiceover",
      description: "Text to speech",
      icon: <EditorIcons.Volume />,
      color: "#10b981",
      onClick: onVoiceoverClick,
    },
    {
      id: "reddit",
      name: "Reddit Post",
      description: "Import from Reddit",
      icon: <EditorIcons.Download />,
      color: "#ff4500",
      onClick: onRedditPostClick,
    },
    {
      id: "magic-crop",
      name: "Magic Crop",
      description: "Smart cropping",
      // icon: <EditorIcons.Crop />,
      color: "#8b5cf6",
      onClick: onMagicCropClick,
    },
    {
      id: "emoji",
      name: "Emoji Picker",
      description: "Add emojis",
      icon: <span style={{ fontSize: "20px" }}>😊</span>,
      color: "#f59e0b",
      onClick: onEmojiPickerClick,
    },
    // {
    //   id: "remix",
    //   name: "Remix Shorts",
    //   description: "AI video remix",
    //   icon: <EditorIcons.Video />,
    //   color: "#ec4899",
    //   onClick: onRemixShortsClick,
    // },
    {
      id: "ai-image",
      name: "AI Image",
      description: "Generate images",
      icon: <EditorIcons.Image />,
      color: "#3b82f6",
      onClick: onAIImageClick,
    },
    {
      id: "veo",
      name: "VEO Generator",
      description: "AI video creation",
      icon: <EditorIcons.Video />,
      color: "#06b6d4",
      onClick: onVEOGeneratorClick,
    },
    // {
    //   id: "youtube",
    //   name: "YouTube",
    //   description: "Download videos",
    //   icon: <EditorIcons.Download />,
    //   color: "#ef4444",
    //   onClick: onYoutubeDownloaderClick,
    // },
    {
      id: "enhance-speech",
      name: "Enhance Speech",
      description: "Improve audio",
      icon: <EditorIcons.Volume />,
      color: "#14b8a6",
      onClick: onEnhanceSpeechClick,
    },
    {
      id: "remove-bg",
      name: "Remove BG",
      description: "Background removal",
      icon: <EditorIcons.Image />,
      color: "#a855f7",
      onClick: onRemoveBackgroundClick,
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>AI Tools</h3>
        <p style={styles.subtitle}>Enhance your content with AI-powered features</p>
      </div>

      <div style={styles.toolsGrid}>
        {tools.map((tool) => (
          <button
            key={tool.id}
            style={{
              ...styles.toolCard,
              borderColor: `${tool.color}20`,
            }}
            onClick={tool.onClick}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = `${tool.color}15`;
              e.currentTarget.style.borderColor = `${tool.color}40`;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.bgSecondary;
              e.currentTarget.style.borderColor = `${tool.color}20`;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                ...styles.iconWrapper,
                backgroundColor: `${tool.color}20`,
                color: tool.color,
              }}
            >
              {tool.icon}
            </div>
            <div style={styles.toolInfo}>
              <div style={styles.toolName}>{tool.name}</div>
              <div style={styles.toolDescription}>{tool.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};