import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import type { RedditStoryLayer } from "../remotion_compositions/DynamicLayerComposition";

const FONT_FAMILIES = [
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
  { value: "'Bebas Neue', sans-serif", label: "Bebas Neue" },
  { value: "'Oswald', sans-serif", label: "Oswald" },
  { value: "'Anton', sans-serif", label: "Anton" },
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "'Roboto Condensed', sans-serif", label: "Roboto" },
];

interface RedditStoryEditorProps {
  layer: RedditStoryLayer;
  onUpdate: (id: string, updates: Partial<RedditStoryLayer>) => void;
  onDelete: (id: string) => void;
}

export const RedditStoryEditor: React.FC<RedditStoryEditorProps> = ({
  layer,
  onUpdate,
  onDelete,
}) => {
  const { colors } = useTheme();

  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    title: {
      fontSize: "14px",
      fontWeight: 600,
      color: colors.textPrimary,
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    label: {
      fontSize: "12px",
      color: colors.textSecondary,
      fontWeight: 500,
    },
    input: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.bgSecondary,
      color: colors.textPrimary,
      fontSize: "13px",
      outline: "none",
    },
    select: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.bgSecondary,
      color: colors.textPrimary,
      fontSize: "13px",
      outline: "none",
    },
    row: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
    },
    colorInput: {
      width: "100%",
      height: "36px",
      borderRadius: "6px",
      border: `1px solid ${colors.border}`,
      cursor: "pointer",
    },
    slider: {
      width: "100%",
    },
    deleteBtn: {
      marginTop: "12px",
      padding: "10px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      color: "#ef4444",
      fontSize: "13px",
      fontWeight: 500,
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>


      <div style={styles.inputGroup}>
        <label style={styles.label}>Font Family</label>
        <select
          style={styles.select}
          value={layer.fontFamily}
          onChange={(e) => onUpdate(layer.id, { fontFamily: e.target.value })}
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Font Size: {layer.fontSize}px</label>
        <input
          type="range"
          min="24"
          max="72"
          value={layer.fontSize}
          onChange={(e) => onUpdate(layer.id, { fontSize: parseInt(e.target.value) })}
          style={styles.slider}
        />
      </div>

      <div style={styles.row}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Text Color</label>
          <input
            type="color"
            style={styles.colorInput}
            value={layer.fontColor}
            onChange={(e) => onUpdate(layer.id, { fontColor: e.target.value })}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Highlight Color</label>
          <input
            type="color"
            style={styles.colorInput}
            value={layer.sentenceBgColor}
            onChange={(e) => onUpdate(layer.id, { sentenceBgColor: e.target.value })}
          />
        </div>
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Story Text</label>
        <textarea
          style={{ ...styles.input, minHeight: "120px", resize: "vertical" }}
          value={layer.story}
          onChange={(e) => onUpdate(layer.id, { story: e.target.value })}
          placeholder="The full story narration..."
        />
      </div>

      <button style={styles.deleteBtn} onClick={() => onDelete(layer.id)}>
        🗑️ Delete Story Layer
      </button>
    </div>
  );
};