import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { FPS } from "../../data/editor_constants";
import type { AudioLayer } from "../remotion_compositions/DynamicLayerComposition";

interface AudioEditorProps {
  layer: AudioLayer;
  totalFrames: number;
  onUpdate: (layerId: string, updates: Partial<AudioLayer>) => void;
  onDelete: (layerId: string) => void;
  onReplace: () => void;
}

/**
 * Modern AudioEditor - Themed for Dark/Light modes
 */
export const AudioEditor: React.FC<AudioEditorProps> = ({
  layer,
  totalFrames,
  onUpdate,
  onDelete,
  onReplace,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { colors } = useTheme();

  const duration = Math.round((layer.endFrame - layer.startFrame) / FPS);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      height: "100%",
      overflow: "auto" as const,
      backgroundColor: colors.bgSecondary,
    },
    section: {
      padding: "10px 12px",
      borderBottom: `1px solid ${colors.borderLight}`,
    },
    sectionCompact: {
      padding: "8px 12px",
      borderBottom: `1px solid ${colors.borderLight}`,
    },
    sectionHeader: {
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      marginBottom: "8px",
      cursor: "pointer" as const,
      userSelect: "none" as const,
    },
    sectionTitle: {
      fontSize: "11px",
      fontWeight: "600" as const,
      color: colors.textMuted,
      textTransform: "uppercase" as const,
      letterSpacing: "0.8px",
    },
    collapseIcon: {
      fontSize: "10px",
      color: colors.textMuted,
      transition: "transform 0.2s",
    },
    propertyRow: {
      display: "flex" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: "6px",
    },
    propertyLabel: {
      fontSize: "10px",
      color: colors.textTertiary,
      fontWeight: "500" as const,
    },
    propertyValue: {
      fontSize: "12px",
      color: colors.textPrimary,
      fontWeight: "600" as const,
    },
    formGroupCompact: {
      marginBottom: "8px",
    },
    label: {
      display: "block" as const,
      fontSize: "10px",
      color: colors.textTertiary,
      marginBottom: "4px",
      fontWeight: "500" as const,
      textTransform: "uppercase" as const,
      letterSpacing: "0.5px",
    },
    checkboxLabel: {
      display: "flex" as const,
      alignItems: "center" as const,
      gap: "8px",
      fontSize: "12px",
      color: colors.textPrimary,
      cursor: "pointer" as const,
    },
    checkbox: {
      width: "16px",
      height: "16px",
      cursor: "pointer" as const,
    },
    sliderWrapper: {
      display: "flex" as const,
      alignItems: "center" as const,
      gap: "10px",
    },
    slider: {
      flex: 1,
      height: "4px",
      borderRadius: "2px",
      cursor: "pointer" as const,
    },
    sliderValue: {
      minWidth: "40px",
      fontSize: "11px",
      color: colors.textSecondary,
      textAlign: "right" as const,
    },
    input: {
      width: "100%",
      padding: "6px 8px",
      backgroundColor: colors.inputBg,
      border: `1px solid ${colors.inputBorder}`,
      borderRadius: "6px",
      color: colors.textPrimary,
      fontSize: "12px",
      height: "28px",
    },
    buttonSecondary: {
      width: "100%",
      padding: "10px",
      backgroundColor: colors.bgTertiary,
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      color: colors.textPrimary,
      fontSize: "12px",
      fontWeight: "600" as const,
      cursor: "pointer" as const,
      transition: "all 0.2s",
    },
    grid4: {
      display: "grid" as const,
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "6px",
    },
    grid2: {
      display: "grid" as const,
      gridTemplateColumns: "1fr 1fr",
      gap: "8px",
    },
    card: {
      padding: "10px",
      backgroundColor: colors.bgTertiary,
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      cursor: "pointer" as const,
      transition: "all 0.2s",
      fontSize: "11px",
      fontWeight: "600" as const,
      color: colors.textPrimary,
      textAlign: "center" as const,
    },
    iconButtonActive: {
      backgroundColor: colors.bgActive,
      borderColor: colors.accent,
      color: colors.accent,
    },
    helpText: {
      fontSize: "11px",
      color: colors.textMuted,
      lineHeight: "1.4",
    },
    deleteButton: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#dc2626",
      border: "none",
      borderRadius: "6px",
      color: "white",
      fontSize: "12px",
      fontWeight: "600" as const,
      cursor: "pointer" as const,
      transition: "all 0.2s",
    },
  };

  return (
    <div style={styles.container}>
      {/* Replace Button */}
      <div style={styles.section}>
        <button
          style={styles.buttonSecondary}
          onClick={onReplace}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.bgHover;
            e.currentTarget.style.borderColor = colors.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.bgTertiary;
            e.currentTarget.style.borderColor = colors.border;
          }}
        >
          Replace Audio
        </button>
      </div>

      {/* Duration */}
      <div style={styles.sectionCompact}>
        <div style={styles.propertyRow}>
          <span style={styles.propertyLabel}>Duration</span>
          <span style={styles.propertyValue}>{duration}s</span>
        </div>
        <div style={styles.sliderWrapper}>
          <input
            type="range"
            style={styles.slider}
            min={layer.startFrame}
            max={totalFrames}
            value={layer.endFrame}
            onChange={(e) => onUpdate(layer.id, { endFrame: parseInt(e.target.value) })}
          />
          <span style={styles.sliderValue}>{layer.endFrame}f</span>
        </div>
      </div>

      {/* Audio Controls */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>AUDIO</div>

        <div style={styles.formGroupCompact}>
          <label style={styles.label}>Volume</label>
          <div style={styles.sliderWrapper}>
            <input
              type="range"
              style={styles.slider}
              min="0"
              max="1"
              step="0.01"
              value={layer.volume}
              onChange={(e) => onUpdate(layer.id, { volume: parseFloat(e.target.value) })}
            />
            <span style={styles.sliderValue}>{Math.round(layer.volume * 100)}%</span>
          </div>
        </div>

        <div style={styles.formGroupCompact}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={layer.loop || false}
              onChange={(e) => onUpdate(layer.id, { loop: e.target.checked })}
            />
            <span>Loop audio</span>
          </label>
        </div>
      </div>

      {/* Quick Volume Presets */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>PRESETS</div>
        <div style={styles.grid4}>
          {[0.25, 0.5, 0.75, 1].map((vol) => (
            <button
              key={vol}
              style={{
                ...styles.card,
                padding: "8px 4px",
                ...(layer.volume === vol ? styles.iconButtonActive : {}),
              }}
              onClick={() => onUpdate(layer.id, { volume: vol })}
              onMouseEnter={(e) => {
                if (layer.volume !== vol) {
                  e.currentTarget.style.backgroundColor = colors.bgHover;
                }
              }}
              onMouseLeave={(e) => {
                if (layer.volume !== vol) {
                  e.currentTarget.style.backgroundColor = colors.bgTertiary;
                }
              }}
            >
              <div style={{ fontSize: "10px", fontWeight: "600" }}>{Math.round(vol * 100)}%</div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced - Collapsible */}
      <div style={styles.section}>
        <div
          style={styles.sectionHeader}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span style={styles.sectionTitle}>ADVANCED</span>
          <span
            style={{
              ...styles.collapseIcon,
              transform: showAdvanced ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </div>

        {showAdvanced && (
          <div style={styles.grid2}>
            <div style={styles.formGroupCompact}>
              <label style={styles.label}>Fade In (frames)</label>
              <input
                type="number"
                style={styles.input}
                value={layer.fadeIn || 0}
                min="0"
                max="60"
                onChange={(e) => onUpdate(layer.id, { fadeIn: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div style={styles.formGroupCompact}>
              <label style={styles.label}>Fade Out (frames)</label>
              <input
                type="number"
                style={styles.input}
                value={layer.fadeOut || 0}
                min="0"
                max="60"
                onChange={(e) => onUpdate(layer.id, { fadeOut: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={styles.section}>
        <div style={{ ...styles.helpText, textAlign: "center" }}>
          🎵 Audio plays throughout the timeline
        </div>
      </div>

      {/* Delete Button */}
      <div style={styles.section}>
        <button
          style={styles.deleteButton}
          onClick={() => {
            if (window.confirm("Delete this audio layer?")) {
              onDelete(layer.id);
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#b91c1c";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#dc2626";
          }}
        >
          Delete Layer
        </button>
      </div>
    </div>
  );
};