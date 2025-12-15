import React, { useRef } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import type { ChatBubbleLayer } from "../remotion_compositions/DynamicLayerComposition";
import { FONTS } from "../../data/editor_constants/fonts";

interface ChatEditorProps {
  layer: ChatBubbleLayer;
  onUpdate: (layerId: string, updates: Partial<ChatBubbleLayer>) => void;
  onDelete: (layerId: string) => void;
  isMobile?: boolean;
}

export const ChatEditor: React.FC<ChatEditorProps> = ({ 
  layer, 
  onUpdate, 
  onDelete,
  isMobile = false 
}) => {
  const { colors } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdate(layer.id, { avatarUrl: url });
    }
  };

  const styles = {
    container: {
      padding: isMobile ? "12px" : "16px",
      display: "flex",
      flexDirection: "column" as const,
      gap: isMobile ? "10px" : "16px",
      height: "100%",
      overflowY: "auto" as const,
    },
    formGroup: {
      display: "flex",
      flexDirection: "column" as const,
      gap: isMobile ? "6px" : "8px",
    },
    label: {
      fontSize: isMobile ? "11px" : "12px",
      fontWeight: "600" as const,
      color: colors.textPrimary,
      textTransform: "uppercase" as const,
      letterSpacing: "0.5px",
    },
    textarea: {
      width: "100%",
      minHeight: isMobile ? "80px" : "100px",
      padding: isMobile ? "8px" : "10px",
      fontSize: isMobile ? "13px" : "14px",
      borderRadius: "6px",
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.bgSecondary,
      color: colors.textPrimary,
      resize: "vertical" as const,
      fontFamily: "inherit",
    },
    input: {
      width: "100%",
      padding: isMobile ? "8px" : "10px",
      fontSize: isMobile ? "13px" : "14px",
      borderRadius: "6px",
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.bgSecondary,
      color: colors.textPrimary,
    },
    select: {
      width: "100%",
      padding: isMobile ? "8px" : "10px",
      fontSize: isMobile ? "13px" : "14px",
      borderRadius: "6px",
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.bgSecondary,
      color: colors.textPrimary,
      cursor: "pointer",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: isMobile ? "8px" : "10px",
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: isMobile ? "12px" : "13px",
      fontWeight: "500" as const,
      color: colors.textPrimary,
    },
    checkbox: {
      width: "16px",
      height: "16px",
      cursor: "pointer",
    },
    deleteButton: {
      width: "100%",
      padding: isMobile ? "10px" : "12px",
      backgroundColor: "#dc2626",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: isMobile ? "12px" : "14px",
      fontWeight: "600" as const,
      cursor: "pointer",
      transition: "all 0.2s",
      marginTop: isMobile ? "4px" : "8px",
    },
    // Styles for avatar section
    avatarContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px',
      backgroundColor: colors.bgSecondary,
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
    },
    avatarPreview: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#ccc',
      objectFit: 'cover' as const,
      flexShrink: 0,
    },
    uploadButton: {
      padding: '6px 12px',
      fontSize: '12px',
      backgroundColor: colors.bgTertiary,
      border: `1px solid ${colors.border}`,
      borderRadius: '4px',
      color: colors.textPrimary,
      cursor: 'pointer',
    },
    row: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    value: {
      fontSize: isMobile ? "11px" : "12px",
      color: colors.textSecondary,
    },
    rangeInput: {
      width: "100%",
      height: "6px",
      borderRadius: "3px",
      backgroundColor: colors.bgTertiary,
      outline: "none",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Message</label>
        <textarea
          value={layer.message}
          onChange={(e) => onUpdate(layer.id, { message: e.target.value })}
          placeholder="Type message..."
          style={styles.textarea}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Sender Name</label>
        <input
          type="text"
          value={layer.senderName || ""}
          onChange={(e) => onUpdate(layer.id, { senderName: e.target.value })}
          placeholder="Username"
          style={styles.input}
        />
      </div>

      {/* Individual Avatar Uploader */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Message Avatar</label>
        <div style={styles.avatarContainer}>
          {layer.avatarUrl ? (
            <img src={layer.avatarUrl} style={styles.avatarPreview} alt="avatar" />
          ) : (
            <div style={styles.avatarPreview} />
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button 
            style={styles.uploadButton}
            onClick={() => fileInputRef.current?.click()}
          >
            Change Image
          </button>
        </div>
      </div>

      {/* Font Family Selection */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Font Family</label>
       <select
          value={layer.fontFamily || ""}
          onChange={(e) => onUpdate(layer.id, { fontFamily: e.target.value })}
          style={{
            ...styles.select,
            fontFamily: layer.fontFamily || "inherit"
          }}
        >
          <option value="">Default (Style Based)</option>
          {FONTS.map((font) => (
            <option 
              key={font.value} 
              value={font.value}
              style={{ fontFamily: font.value, fontSize: "16px", padding: "4px" }} 
            >
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <div style={styles.row}>
          <label style={styles.label}>Avatar Scale</label>
          <span style={styles.value}>{(layer.avatarScale || 1).toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={layer.avatarScale || 1.0}
          onChange={(e) => onUpdate(layer.id, { avatarScale: parseFloat(e.target.value) })}
          style={styles.rangeInput}
        />
      </div>

      <div style={styles.formGroup}>
        <div style={styles.row}>
          <label style={styles.label}>Text Size</label>
          <span style={styles.value}>{layer.bubbleFontSize || 30}px</span>
        </div>
        <input
          type="range"
          min="10"
          max="60"
          step="1"
          value={layer.bubbleFontSize || 30}
          onChange={(e) => onUpdate(layer.id, { bubbleFontSize: parseInt(e.target.value) })}
          style={styles.rangeInput}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={layer.isSender}
            onChange={(e) => onUpdate(layer.id, { isSender: e.target.checked })}
            style={styles.checkbox}
          />
          This is your message (Right Side)
        </label>
      </div>

      <button
        onClick={() => { 
          if (window.confirm("Delete this message?")) {
            onDelete(layer.id);
          }
        }}
        style={styles.deleteButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#b91c1c";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#dc2626";
        }}
      >
        Delete Message
      </button>
    </div>
  );
};