import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import type { RedditCardLayer } from "../remotion_compositions/DynamicLayerComposition";

interface RedditCardEditorProps {
  layer: RedditCardLayer;
  onUpdate: (id: string, updates: Partial<RedditCardLayer>) => void;
  onDelete: (id: string) => void;
}

export const RedditCardEditor: React.FC<RedditCardEditorProps> = ({
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
      overflowY: "auto",
      overflowX: "hidden",
      flex: 1,
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
      minWidth: 0,
    },
    label: {
      fontSize: "12px",
      color: colors.textSecondary,
      fontWeight: 500,
    },
    input: {
      padding: "8px 10px",
      borderRadius: "6px",
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.bgSecondary,
      color: colors.textPrimary,
      fontSize: "13px",
      outline: "none",
      width: "100%",
      boxSizing: "border-box" as const,
      minWidth: 0,
    },
    row: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px",
      minWidth: 0,
    },
    slider: {
      width: "100%",
      cursor: "pointer",
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
      flexShrink: 0,
    },
  };

  return (
    <div style={styles.container}>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Preview Length: {layer.textMaxLength || layer.text?.length || 280} / {layer.text?.length || 0} chars</label>
        <input
          type="range"
          min="50"
          max={layer.text?.length || 280}
          value={layer.textMaxLength ?? layer.text?.length ?? 280}
          onChange={(e) => onUpdate(layer.id, { textMaxLength: parseInt(e.target.value) })}
          style={styles.slider}
        />
      </div>

      <div style={styles.row}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Username</label>
          <input
            type="text"
            style={styles.input}
            value={layer.posterUsername}
            onChange={(e) => onUpdate(layer.id, { posterUsername: e.target.value })}
            placeholder="throwaway123"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Time Posted</label>
          <input
            type="text"
            style={styles.input}
            value={layer.timePosted}
            onChange={(e) => onUpdate(layer.id, { timePosted: e.target.value })}
            placeholder="10h"
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Upvotes</label>
          <input
            type="text"
            style={styles.input}
            value={layer.upvotes}
            onChange={(e) => onUpdate(layer.id, { upvotes: e.target.value })}
            placeholder="12.4k"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Comments</label>
          <input
            type="text"
            style={styles.input}
            value={layer.commentCount}
            onChange={(e) => onUpdate(layer.id, { commentCount: e.target.value })}
            placeholder="2.3k"
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Title Font Size: {layer.titleFontSize || 16}px</label>
          <input
            type="range"
            min="12"
            max="40"
            value={layer.titleFontSize || 16}
            onChange={(e) => onUpdate(layer.id, { titleFontSize: parseInt(e.target.value) })}
            style={styles.slider}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Text Font Size: {layer.textFontSize || 14}px</label>
          <input
            type="range"
            min="10"
            max="40"
            value={layer.textFontSize || 14}
            onChange={(e) => onUpdate(layer.id, { textFontSize: parseInt(e.target.value) })}
            style={styles.slider}
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Header Size: {layer.headerFontSize || 20}px</label>
          <input
            type="range"
            min="14"
            max="40"
            value={layer.headerFontSize || 20}
            onChange={(e) => onUpdate(layer.id, { headerFontSize: parseInt(e.target.value) })}
            style={styles.slider}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Metrics Size: {layer.metricsFontSize || 18}px</label>
          <input
            type="range"
            min="12"
            max="40"
            value={layer.metricsFontSize || 18}
            onChange={(e) => onUpdate(layer.id, { metricsFontSize: parseInt(e.target.value) })}
            style={styles.slider}
          />
        </div>
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Display Duration: {layer.displayDuration || 5}s</label>
        <input
          type="range"
          min="2"
          max="15"
          step="0.5"
          value={layer.displayDuration || 5}
          onChange={(e) => {
  const newDuration = parseFloat(e.target.value);
  const fps = 30;
  const newEndFrame = layer.startFrame + Math.round(newDuration * fps);
  onUpdate(layer.id, { 
    displayDuration: newDuration,
    endFrame: newEndFrame 
  });
}}
          style={styles.slider}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Awards Count</label>
        <input
          type="text"
          style={styles.input}
          value={layer.awardsCount}
          onChange={(e) => onUpdate(layer.id, { awardsCount: e.target.value })}
          placeholder="1"
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Post Title</label>
        <input
          type="text"
          style={styles.input}
          value={layer.title}
          onChange={(e) => onUpdate(layer.id, { title: e.target.value })}
          placeholder="AITA for..."
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Post Preview Text</label>
        <textarea
          style={{ ...styles.input, minHeight: "120px", resize: "vertical" }}
          value={layer.text}
          onChange={(e) => onUpdate(layer.id, { text: e.target.value })}
          placeholder="Post content preview..."
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Preview Length: {layer.textMaxLength || 280} chars</label>
        <input
          type="range"
          min="50"
          max={Math.max(layer.text?.length || 500, 500)}
          value={layer.textMaxLength || 280}
          onChange={(e) => onUpdate(layer.id, { textMaxLength: parseInt(e.target.value) })}
          style={styles.slider}
        />
      </div>

      <button style={styles.deleteBtn} onClick={() => onDelete(layer.id)}>
        🗑️ Delete Reddit Card
      </button>
    </div>
  );
};