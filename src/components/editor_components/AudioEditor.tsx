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
  isMobile?: boolean;
}

/**
 * Modern AudioEditor - Redesigned for compact, clean UI with mobile support
 */
export const AudioEditor: React.FC<AudioEditorProps> = ({
  layer,
  totalFrames,
  onUpdate,
  onDelete,
  onReplace,
  isMobile = false,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeSection, setActiveSection] = useState<"audio" | "effects" | "presets">("audio");
  const { colors } = useTheme();

  const duration = Math.round((layer.endFrame - layer.startFrame) / FPS);

  // Mobile styles
  const mobileStyles: Record<string, React.CSSProperties> = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      backgroundColor: colors.bgPrimary,
      overflow: "hidden",
    },

    // Top tabs
    topBar: {
      display: "flex",
      backgroundColor: colors.bgSecondary,
      borderBottom: `1px solid ${colors.border}`,
      flexShrink: 0,
    },

    tabButton: {
      flex: 1,
      padding: "12px",
      backgroundColor: "transparent",
      border: "none",
      borderBottom: "2px solid transparent",
      color: colors.textMuted,
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },

    tabButtonActive: {
      color: colors.accent,
      borderBottomColor: colors.accent,
      backgroundColor: colors.bgPrimary,
    },

    // Scrollable content
    content: {
      flex: 1,
      overflow: "auto",
      padding: "14px",
      paddingBottom: "20px",
    },

    // Section header
    sectionHeader: {
      fontSize: "9px",
      fontWeight: "600",
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "8px",
      marginTop: "16px",
    },

    sectionHeaderFirst: {
      marginTop: "0",
    },

    // Slider container
    sliderRow: {
      marginBottom: "12px",
    },

    sliderTopRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "6px",
    },

    sliderLabel: {
      fontSize: "11px",
      fontWeight: "500",
      color: colors.textPrimary,
    },

    sliderValue: {
      fontSize: "11px",
      fontWeight: "600",
      color: colors.accent,
    },

    sliderInput: {
      width: "100%",
      height: "4px",
      borderRadius: "2px",
      outline: "none",
      background: colors.bgSecondary,
      cursor: "pointer",
    },

    // Form elements
    input: {
      width: "100%",
      padding: "8px",
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      color: colors.textPrimary,
      fontSize: "12px",
      marginBottom: "10px",
    },

    // Checkbox
    checkboxWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px",
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      marginBottom: "12px",
      cursor: "pointer",
    },

    checkboxLabel: {
      fontSize: "12px",
      fontWeight: "500",
      color: colors.textPrimary,
      cursor: "pointer",
    },

    // Grid layouts
    grid2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
      marginBottom: "12px",
    },

    grid4: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "8px",
      marginBottom: "12px",
    },

    gridItem: {
      display: "flex",
      flexDirection: "column",
    },

    // Preset buttons
    presetButton: {
      position: "relative",
      aspectRatio: "1",
      backgroundColor: colors.bgSecondary,
      border: `2px solid ${colors.border}`,
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px",
    },

    presetButtonActive: {
      borderColor: colors.accent,
      boxShadow: `0 0 0 2px ${colors.accent}40`,
      backgroundColor: colors.accent + "20",
    },

    presetIcon: {
      fontSize: "24px",
      marginBottom: "4px",
    },

    presetLabel: {
      fontSize: "11px",
      fontWeight: "600",
      color: colors.textPrimary,
    },

    // Action buttons
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      color: colors.textPrimary,
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
      marginBottom: "8px",
      transition: "all 0.2s",
    },

    buttonPrimary: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
      color: "white",
    },

    buttonDanger: {
      backgroundColor: "#dc2626",
      borderColor: "#dc2626",
      color: "white",
    },

    helpText: {
      fontSize: "11px",
      color: colors.textMuted,
      textAlign: "center",
      padding: "12px",
      backgroundColor: colors.bgSecondary,
      borderRadius: "6px",
      marginBottom: "12px",
    },
  };

  // Desktop styles
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      height: "100%",
      overflow: "hidden",
      backgroundColor: colors.bgSecondary,
    },
    scrollContent: {
      flex: 1,
      overflowY: "auto" as const,
      paddingBottom: "20px",
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

  // ========================================
  // DESKTOP LAYOUT
  // ========================================
  if (!isMobile) {
    return (
      <div style={styles.container}>
        <div style={styles.scrollContent}>
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
          <div style={{ ...styles.section, paddingBottom: "50px" }}>
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
      </div>
    );
  }

  // ========================================
  // MOBILE LAYOUT
  // ========================================
  return (
    <div style={mobileStyles.container}>
      {/* TOP TABS */}
      <div style={mobileStyles.topBar}>
        {[
          { id: "audio", label: "Audio" },
          { id: "effects", label: "Effects" },
          { id: "presets", label: "Presets" },
        ].map((tab) => (
          <button
            key={tab.id}
            style={{
              ...mobileStyles.tabButton,
              ...(activeSection === tab.id ? mobileStyles.tabButtonActive : {}),
            }}
            onClick={() => setActiveSection(tab.id as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SCROLLABLE CONTENT */}
      <div style={mobileStyles.content}>
        
        {/* ===== AUDIO TAB ===== */}
        {activeSection === "audio" && (
          <>
            {/* REPLACE AUDIO */}
            <div style={{ ...mobileStyles.sectionHeader, ...mobileStyles.sectionHeaderFirst }}>
              REPLACE AUDIO
            </div>
            <button
              style={{ ...mobileStyles.button, ...mobileStyles.buttonPrimary }}
              onClick={onReplace}
            >
              Replace Audio
            </button>

            {/* DURATION */}
            <div style={mobileStyles.sectionHeader}>DURATION</div>
            <div style={mobileStyles.sliderRow}>
              <div style={mobileStyles.sliderTopRow}>
                <span style={mobileStyles.sliderLabel}>Duration</span>
                <span style={mobileStyles.sliderValue}>{duration}s ({layer.endFrame}f)</span>
              </div>
              <input
                type="range"
                style={mobileStyles.sliderInput}
                min={layer.startFrame}
                max={totalFrames}
                value={layer.endFrame}
                onChange={(e) => onUpdate(layer.id, { endFrame: parseInt(e.target.value) })}
              />
            </div>

            {/* VOLUME */}
            <div style={mobileStyles.sectionHeader}>VOLUME</div>
            <div style={mobileStyles.sliderRow}>
              <div style={mobileStyles.sliderTopRow}>
                <span style={mobileStyles.sliderLabel}>Volume</span>
                <span style={mobileStyles.sliderValue}>{Math.round(layer.volume * 100)}%</span>
              </div>
              <input
                type="range"
                style={mobileStyles.sliderInput}
                min="0"
                max="1"
                step="0.01"
                value={layer.volume}
                onChange={(e) => onUpdate(layer.id, { volume: parseFloat(e.target.value) })}
              />
            </div>

            {/* LOOP */}
            <div style={mobileStyles.sectionHeader}>OPTIONS</div>
            <label style={mobileStyles.checkboxWrapper}>
              <input
                type="checkbox"
                checked={layer.loop || false}
                onChange={(e) => onUpdate(layer.id, { loop: e.target.checked })}
              />
              <span style={mobileStyles.checkboxLabel}>Loop audio</span>
            </label>

            {/* INFO */}
            <div style={mobileStyles.helpText}>
              🎵 Audio plays throughout the timeline
            </div>
          </>
        )}

        {/* ===== EFFECTS TAB ===== */}
        {activeSection === "effects" && (
          <>
            {/* FADE IN & FADE OUT - 2 COLUMNS */}
            <div style={{ ...mobileStyles.sectionHeader, ...mobileStyles.sectionHeaderFirst }}>
              FADES
            </div>
            <div style={mobileStyles.grid2}>
              <div style={mobileStyles.gridItem}>
                <div style={mobileStyles.sectionHeader}>FADE IN</div>
                <input
                  type="number"
                  style={mobileStyles.input}
                  value={layer.fadeIn || 0}
                  min="0"
                  max="60"
                  placeholder="Frames"
                  onChange={(e) => onUpdate(layer.id, { fadeIn: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div style={mobileStyles.gridItem}>
                <div style={mobileStyles.sectionHeader}>FADE OUT</div>
                <input
                  type="number"
                  style={mobileStyles.input}
                  value={layer.fadeOut || 0}
                  min="0"
                  max="60"
                  placeholder="Frames"
                  onChange={(e) => onUpdate(layer.id, { fadeOut: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* INFO */}
            <div style={mobileStyles.helpText}>
              💫 Control how audio fades in and out
            </div>
          </>
        )}

        {/* ===== PRESETS TAB ===== */}
        {activeSection === "presets" && (
          <>
            {/* VOLUME PRESETS */}
            <div style={{ ...mobileStyles.sectionHeader, ...mobileStyles.sectionHeaderFirst }}>
              QUICK VOLUME
            </div>
            <div style={mobileStyles.grid4}>
              {[
                { vol: 0.25, icon: "🔈", label: "Low" },
                { vol: 0.5, icon: "🔉", label: "Medium" },
                { vol: 0.75, icon: "🔊", label: "High" },
                { vol: 1, icon: "📢", label: "Max" },
              ].map((preset) => (
                <button
                  key={preset.vol}
                  style={{
                    ...mobileStyles.presetButton,
                    ...(layer.volume === preset.vol ? mobileStyles.presetButtonActive : {}),
                  }}
                  onClick={() => onUpdate(layer.id, { volume: preset.vol })}
                >
                  <div style={mobileStyles.presetIcon}>{preset.icon}</div>
                  <div style={mobileStyles.presetLabel}>{Math.round(preset.vol * 100)}%</div>
                  <div style={{ fontSize: "8px", color: colors.textMuted, marginTop: "2px" }}>
                    {preset.label}
                  </div>
                </button>
              ))}
            </div>

            {/* INFO */}
            <div style={mobileStyles.helpText}>
              🎚️ Tap a preset to quickly adjust volume
            </div>

            {/* ACTIONS */}
            <div style={mobileStyles.sectionHeader}>ACTIONS</div>
            <button
              style={{ ...mobileStyles.button, ...mobileStyles.buttonDanger }}
              onClick={() => {
                if (window.confirm("Delete this audio layer?")) {
                  onDelete(layer.id);
                }
              }}
            >
              Delete Layer
            </button>
          </>
        )}
      </div>

      {/* CUSTOM CSS */}
      <style>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${colors.accent};
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${colors.accent};
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        input[type="range"]:active::-webkit-slider-thumb {
          transform: scale(1.15);
        }
        
        input[type="range"]:active::-moz-range-thumb {
          transform: scale(1.15);
        }
      `}</style>
    </div>
  );
};