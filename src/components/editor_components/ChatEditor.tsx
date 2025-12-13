import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import type { ChatBubbleLayer } from "../remotion_compositions/DynamicLayerComposition";

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

      <div style={styles.formGroup}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={layer.isSender}
            onChange={(e) => onUpdate(layer.id, { isSender: e.target.checked })}
            style={styles.checkbox}
          />
          This is your message
        </label>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Chat Style</label>
        <select
          value={layer.chatStyle}
          onChange={(e) => onUpdate(layer.id, { chatStyle: e.target.value as any })}
          style={styles.select}
        >
          <option value="fakechatconversation">Fake Chat</option>
          <option value="imessage">iMessage</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="instagram">Instagram</option>
          <option value="messenger">Messenger</option>
        </select>
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