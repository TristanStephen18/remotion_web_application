import React, { useState } from "react";
import { type VideoLayer } from "../remotion_compositions/DynamicLayerComposition";
import { getThemedEditorStyles } from "../../styles/themedEditorStyles";
import { FPS } from "../../data/editor_constants";
import { useTheme } from "../../contexts/ThemeContext";
// import { EditorIcons } from "./EditorIcons";

interface VideoEditorProps {
  layer: VideoLayer;
  totalFrames: number;
  onUpdate: (layerId: string, updates: Partial<VideoLayer>) => void;
  onDelete: (layerId: string) => void;
  onReplace: () => void;
  isMobile?: boolean;
}

/**
 * Modern VideoEditor - Redesigned for compact, clean UI with mobile support
 */
export const VideoEditor: React.FC<VideoEditorProps> = ({
  layer,
  totalFrames,
  onUpdate,
  onDelete,
  onReplace,
  isMobile = false,
}) => {
  const { colors } = useTheme();
  // const [showFilters, setShowFilters] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAdjustPanel, setShowAdjustPanel] = useState(false);
  const [activeSection, setActiveSection] = useState<"video" | "display" | "effects">("video");

  const duration = Math.round((layer.endFrame - layer.startFrame) / FPS);

  const FILTERS = [
    { name: "None", value: "none" },
    { name: "B&W", value: "grayscale(100%)" },
    { name: "Sepia", value: "sepia(100%)" },
    { name: "Bright", value: "brightness(1.3)" },
    { name: "Dark", value: "brightness(0.7)" },
    { name: "Contrast", value: "contrast(1.3)" },
    { name: "Blur", value: "blur(10px)" },
    { name: "Cinematic", value: "contrast(1.1) brightness(0.9) saturate(1.2)" },
  ];

  const ANIMATIONS = [
    { name: "None", value: "none", icon: "○" },
    { name: "Fade", value: "fade", icon: "◐" },
    { name: "Slide Up", value: "slideUp", icon: "↑" },
    { name: "Slide Down", value: "slideDown", icon: "↓" },
    { name: "Scale", value: "scale", icon: "◎" },
  ];

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
    select: {
      width: "100%",
      padding: "8px",
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      color: colors.textPrimary,
      fontSize: "12px",
      cursor: "pointer",
      marginBottom: "10px",
    },

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

    // Button groups
    buttonGroup: {
      display: "flex",
      gap: "4px",
      backgroundColor: colors.bgSecondary,
      padding: "3px",
      borderRadius: "6px",
      border: `1px solid ${colors.border}`,
      marginBottom: "12px",
    },

    toggleButton: {
      flex: 1,
      padding: "8px",
      backgroundColor: "transparent",
      border: "none",
      borderRadius: "4px",
      color: colors.textMuted,
      fontSize: "10px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.15s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    toggleButtonActive: {
      backgroundColor: colors.accent,
      color: "white",
    },

    // Grid layouts
    grid2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
      marginBottom: "12px",
    },

    grid3: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "12px",
      marginBottom: "12px",
    },

    gridItem: {
      display: "flex",
      flexDirection: "column",
    },

    // Layout buttons (Quick Layout)
    layoutGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "8px",
      marginBottom: "12px",
    },

    layoutButton: {
      padding: "12px 8px",
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      color: colors.textPrimary,
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.2s",
    },

    layoutIcon: {
      width: "16px",
      height: "16px",
      border: `1px solid ${colors.border}`,
      borderRadius: "2px",
      position: "relative",
    },

    layoutLabel: {
      fontSize: "9px",
      color: colors.textMuted,
      fontWeight: "600",
    },

    // Filter grid
    filterGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "8px",
      marginBottom: "12px",
    },

    filterButton: {
      position: "relative",
      aspectRatio: "1",
      backgroundColor: colors.bgSecondary,
      border: `2px solid ${colors.border}`,
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s",
      overflow: "hidden",
    },

    filterButtonActive: {
      borderColor: colors.accent,
      boxShadow: `0 0 0 2px ${colors.accent}40`,
    },

    filterPreview: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      overflow: "hidden",
    },

    filterImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },

    filterLabel: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: "6px 4px",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      color: "white",
      fontSize: "9px",
      fontWeight: "600",
      textAlign: "center",
      textTransform: "uppercase",
    },

    // Animation grid
    animationGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "8px",
      marginBottom: "12px",
    },

    animationButton: {
      position: "relative",
      aspectRatio: "1",
      backgroundColor: colors.bgSecondary,
      border: `2px solid ${colors.border}`,
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s",
      overflow: "hidden",
    },

    animationButtonActive: {
      borderColor: colors.accent,
      boxShadow: `0 0 0 2px ${colors.accent}40`,
    },

    animationPreview: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      color: "white",
      transition: "all 0.3s",
      overflow: "hidden",
    },

    animationBackground: {
      width: "100%",
      height: "100%",
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    animationLabel: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: "6px 4px",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      color: "white",
      fontSize: "9px",
      fontWeight: "600",
      textAlign: "center",
      textTransform: "uppercase",
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

    // Icon button group
    iconButtonGroup: {
      display: "flex",
      gap: "6px",
      alignItems: "center",
    },

    iconButton: {
      padding: "8px 12px",
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      color: colors.textMuted,
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
    },
  };

  // Desktop styles  
  const styles = getThemedEditorStyles(colors);

  // ========================================
  // ADJUST PANEL (Canva-like full panel)
  // ========================================
  const renderAdjustPanel = () => {
    const adjustments = layer.adjustments || {};

    const updateAdjustment = (key: string, value: number) => {
      onUpdate(layer.id, {
        adjustments: { ...adjustments, [key]: value },
      });
    };

    const resetAllAdjustments = () => {
      onUpdate(layer.id, {
        adjustments: {
          brightness: 100,
          contrast: 100,
          saturation: 100,
          temperature: 0,
          tint: 0,
          fade: 0,
          highlights: 0,
          shadows: 0,
          vignette: 0,
          blur: 0,
        },
      });
    };

    const getFilterPreview = () => {
      const a = adjustments;
      const f: string[] = [];
      let bright = (a.brightness ?? 100) / 100;
      bright *= (1 + (a.highlights ?? 0) / 400);
      if ((a.fade ?? 0) > 0) bright *= (1 + (a.fade ?? 0) / 400);
      f.push(`brightness(${bright.toFixed(3)})`);
      let cont = (a.contrast ?? 100) / 100;
      cont *= (1 + (a.shadows ?? 0) / 200);
      if ((a.fade ?? 0) > 0) cont *= (1 - (a.fade ?? 0) / 200);
      f.push(`contrast(${cont.toFixed(3)})`);
      f.push(`saturate(${(a.saturation ?? 100) / 100})`);
      const temp = a.temperature ?? 0;
      if (temp > 0) f.push(`sepia(${temp * 0.5}%)`);
      else if (temp < 0) f.push(`hue-rotate(${temp * 2}deg)`);
      if ((a.tint ?? 0) !== 0) f.push(`hue-rotate(${(a.tint ?? 0) * 1.2}deg)`);
      if ((a.blur ?? 0) > 0) f.push(`blur(${a.blur}px)`);
      return f.join(' ');
    };

    const renderSlider = (
      label: string,
      key: string,
      min: number,
      max: number,
      defaultVal: number,
      formatValue?: (v: number) => string
    ) => {
      const value = (adjustments as any)[key] ?? defaultVal;
      const displayValue = formatValue ? formatValue(value) : value;
      const isDefault = value === defaultVal;

      return (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: colors.textPrimary, fontWeight: 500 }}>{label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, color: isDefault ? colors.textMuted : colors.accent, minWidth: 36, textAlign: "right" }}>{displayValue}</span>
              {!isDefault && (
                <button
                  onClick={() => updateAdjustment(key, defaultVal)}
                  style={{ background: "none", border: "none", color: colors.textMuted, cursor: "pointer", fontSize: 14, padding: 2 }}
                  title="Reset"
                >↺</button>
              )}
            </div>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => updateAdjustment(key, parseInt(e.target.value))}
            style={{
              width: "100%",
              height: 6,
              borderRadius: 3,
              appearance: "none",
              WebkitAppearance: "none",
              background: `linear-gradient(to right, ${colors.accent} 0%, ${colors.accent} ${((value - min) / (max - min)) * 100}%, ${colors.bgSecondary} ${((value - min) / (max - min)) * 100}%, ${colors.bgSecondary} 100%)`,
              cursor: "pointer",
              outline: "none",
            }}
          />
        </div>
      );
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: colors.bgPrimary }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${colors.border}`, gap: 12, flexShrink: 0 }}>
          <button
            onClick={() => setShowAdjustPanel(false)}
            style={{ background: "none", border: "none", color: colors.textPrimary, fontSize: 20, cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
          >←</button>
          <span style={{ fontSize: 16, fontWeight: 600, color: colors.textPrimary }}>Adjust</span>
          <div style={{ flex: 1 }} />
          <button onClick={resetAllAdjustments} style={{ background: "none", border: "none", color: colors.accent, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Reset all</button>
        </div>

        {/* Preview */}
        <div style={{ padding: 16, display: "flex", justifyContent: "center", borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.bgSecondary, flexShrink: 0 }}>
          <div style={{
            width: 120,
            height: 120,
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            filter: getFilterPreview(),
          }}>
            <span style={{ fontSize: 48 }}>🎬</span>
          </div>
        </div>

        {/* Sliders */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "16px", minHeight: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Light</div>
          {renderSlider("Brightness", "brightness", 0, 200, 100, (v) => `${v - 100}`)}
          {renderSlider("Contrast", "contrast", 0, 200, 100, (v) => `${v - 100}`)}
          {renderSlider("Highlights", "highlights", -100, 100, 0)}
          {renderSlider("Shadows", "shadows", -100, 100, 0)}

          <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 12, marginTop: 20, textTransform: "uppercase", letterSpacing: 1 }}>Color</div>
          {renderSlider("Saturation", "saturation", 0, 200, 100, (v) => `${v - 100}`)}
          {renderSlider("Temperature", "temperature", -100, 100, 0)}
          {renderSlider("Tint", "tint", -100, 100, 0)}

          <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 12, marginTop: 20, textTransform: "uppercase", letterSpacing: 1 }}>Effects</div>
          {renderSlider("Fade", "fade", 0, 100, 0)}
          {renderSlider("Vignette", "vignette", 0, 100, 0)}
          {renderSlider("Blur", "blur", 0, 20, 0, (v) => `${v}px`)}

          <div style={{ height: 100 }} />
        </div>

        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            border: 2px solid ${colors.accent};
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          }
        `}</style>
      </div>
    );
  };<button
                style={styles.iconButton}
                onClick={() => onUpdate(layer.id, { rotation: layer.rotation === 0 ? 180 : 0 })}
                title="Flip"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#3b82f6";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.bgSecondary;
                  e.currentTarget.style.color = colors.textMuted;
                }}
              >
                ⇄
              </button>

  // ========================================
  // DESKTOP LAYOUT
  // ========================================
  if (!isMobile) {
    if (showAdjustPanel) {
      return renderAdjustPanel();
    }

    return (
      <div style={styles.container}>
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: "20px" }}>
        {/* Replace Button */}
        <div style={styles.section}>
          <button
            style={styles.buttonSecondary}
            onClick={onReplace}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.bgHover;
              e.currentTarget.style.borderColor = "#3b82f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.bgTertiary;
              e.currentTarget.style.borderColor = colors.border;
            }}
          >
            Replace Video
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

        {/* QUICK LAYOUT (Split Screen) */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>QUICK LAYOUT</div>
          <div style={{ display: "flex", gap: "8px" }}>
            
            {/* TOP HALF */}
            <button
              title="Top Half"
              onClick={() => {
                onUpdate(layer.id, {
                  position: { x: 50, y: 25 },
                  size: { width: 100, height: 50 },
                  objectFit: "cover"
                });
              }}
              style={{
                flex: 1,
                height: "40px",
                backgroundColor: colors.borderLight,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: colors.textPrimary,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.border}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.borderLight}
            >
              <div style={{ width: 14, height: 14, border: "1px solid #888", borderRadius: 2, position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "#3b82f6" }} />
              </div>
              <span style={{ fontSize: "9px", marginTop: "4px", color: colors.textMuted }}>Top</span>
            </button>

            {/* FULL SCREEN */}
            <button
              title="Full Screen"
              onClick={() => {
                onUpdate(layer.id, {
                  position: { x: 50, y: 50 },
                  size: { width: 100, height: 100 },
                  objectFit: "cover"
                });
              }}
              style={{
                flex: 1,
                height: "40px",
                backgroundColor: colors.borderLight,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: colors.textPrimary,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.border}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.borderLight}
            >
              <div style={{ width: 14, height: 14, border: "1px solid #888", borderRadius: 2, background: "#3b82f6" }} />
              <span style={{ fontSize: "9px", marginTop: "4px", color: colors.textMuted }}>Full</span>
            </button>

            {/* BOTTOM HALF */}
            <button
              title="Bottom Half"
              onClick={() => {
                onUpdate(layer.id, {
                  position: { x: 50, y: 75 },
                  size: { width: 100, height: 50 },
                  objectFit: "cover"
                });
              }}
              style={{
                flex: 1,
                height: "40px",
                backgroundColor: colors.borderLight,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: colors.textPrimary,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.border}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.borderLight}
            >
              <div style={{ width: 14, height: 14, border: "1px solid #888", borderRadius: 2, position: "relative" }}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "#3b82f6" }} />
              </div>
              <span style={{ fontSize: "9px", marginTop: "4px", color: colors.textMuted }}>Bottom</span>
            </button>

          </div>
        </div>

        {/* Display */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>DISPLAY</div>

          <div style={styles.formGroupCompact}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={layer.objectFit === "cover"}
                onChange={(e) =>
                  onUpdate(layer.id, { objectFit: e.target.checked ? "cover" : "contain" })
                }
              />
              <span>Crop to fit</span>
            </label>
          </div>

          <div style={styles.formGroupCompact}>
            <label style={styles.label}>Opacity</label>
            <div style={styles.sliderWrapper}>
              <input
                type="range"
                style={styles.slider}
                min="0"
                max="1"
                step="0.01"
                value={layer.opacity}
                onChange={(e) => onUpdate(layer.id, { opacity: parseFloat(e.target.value) })}
              />
              <span style={styles.sliderValue}>{Math.round(layer.opacity * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Audio */}
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
              <span>Loop video</span>
            </label>
          </div>
        </div>

        {/* Transform */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>TRANSFORM</div>

          <div style={styles.formGroupCompact}>
            <label style={styles.label}>Rotation</label>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <input
                type="number"
                style={{ ...styles.input, flex: 1 }}
                value={layer.rotation}
                onChange={(e) => onUpdate(layer.id, { rotation: parseInt(e.target.value) || 0 })}
              />
              <button
                style={styles.iconButton}
                onClick={() => onUpdate(layer.id, { rotation: (layer.rotation + 90) % 360 })}
                title="Rotate 90°"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#3b82f6";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.bgSecondary;
                  e.currentTarget.style.color = colors.textMuted;
                }}
              >
                ↻
              </button>
              <button
                style={{
                  ...styles.iconButton,
                  backgroundColor: layer.flipX ? '#3b82f6' : colors.bgSecondary,
                  color: layer.flipX ? 'white' : colors.textMuted,
                }}
                onClick={() => onUpdate(layer.id, { flipX: !layer.flipX })}
                title="Flip Horizontal"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#3b82f6";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = layer.flipX ? '#3b82f6' : colors.bgSecondary;
                  e.currentTarget.style.color = layer.flipX ? 'white' : colors.textMuted;
                }}
              >
                ⇄
              </button>
              <button
                style={{
                  ...styles.iconButton,
                  backgroundColor: layer.flipY ? '#3b82f6' : colors.bgSecondary,
                  color: layer.flipY ? 'white' : colors.textMuted,
                }}
                onClick={() => onUpdate(layer.id, { flipY: !layer.flipY })}
                title="Flip Vertical"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#3b82f6";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = layer.flipY ? '#3b82f6' : colors.bgSecondary;
                  e.currentTarget.style.color = layer.flipY ? 'white' : colors.textMuted;
                }}
              >
                ⇅
              </button>
            </div>
          </div>
        </div>



        {/* BORDER */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>BORDER</div>
          <div style={styles.formGroupCompact}>
            <label style={styles.label}>Border Width</label>
            <div style={styles.sliderWrapper}>
              <input
                type="range"
                style={styles.slider}
                min="0"
                max="20"
                value={layer.borderWidth || 0}
                onChange={(e) => onUpdate(layer.id, { borderWidth: parseInt(e.target.value) })}
              />
              <span style={styles.sliderValue}>{layer.borderWidth || 0}px</span>
            </div>
          </div>
          <div style={styles.formGroupCompact}>
            <label style={styles.label}>Border Radius</label>
            <div style={styles.sliderWrapper}>
              <input
                type="range"
                style={styles.slider}
                min="0"
                max="100"
                value={layer.borderRadius || 0}
                onChange={(e) => onUpdate(layer.id, { borderRadius: parseInt(e.target.value) })}
              />
              <span style={styles.sliderValue}>{layer.borderRadius || 0}px</span>
            </div>
          </div>
          <div style={styles.formGroupCompact}>
            <label style={styles.label}>Border Color</label>
            <input
              type="color"
              value={layer.borderColor || "#ffffff"}
              onChange={(e) => onUpdate(layer.id, { borderColor: e.target.value })}
              style={{ width: "100%", height: 32, border: "none", borderRadius: 6, cursor: "pointer" }}
            />
          </div>
        </div>

        {/* ADJUST - Clickable to open panel */}
        <div
          style={{
            margin: "0 0 12px 0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            backgroundColor: colors.bgSecondary,
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
            transition: "all 0.15s ease",
          }}
          onClick={() => setShowAdjustPanel(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.bgHover;
            e.currentTarget.style.borderColor = colors.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.bgSecondary;
            e.currentTarget.style.borderColor = colors.border;
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>🎨</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>Adjust</div>
              <div style={{ fontSize: 11, color: colors.textMuted }}>Brightness, contrast, saturation...</div>
            </div>
          </div>
          <span style={{ color: colors.textMuted, fontSize: 20, fontWeight: 300 }}>›</span>
        </div>

        {/* FILTERS - Visual Grid (like mobile) */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>FILTERS</div>
          <div style={mobileStyles.filterGrid}>
            {FILTERS.map((filter) => (
              <div
                key={filter.value}
                style={{
                  ...mobileStyles.filterButton,
                  ...(layer.filter === filter.value ? mobileStyles.filterButtonActive : {}),
                }}
                onClick={() => onUpdate(layer.id, { filter: filter.value })}
              >
                <div style={mobileStyles.filterPreview}>
                  {/* Colorful sample image to show filter effect */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      filter: filter.value === "none" ? "none" : filter.value,
                    }}
                  >
                    <div style={{
                      fontSize: "32px",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                    }}>
                      🎬
                    </div>
                  </div>
                </div>
                <div style={mobileStyles.filterLabel}>{filter.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ANIMATION - Visual Grid (like mobile) */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>ANIMATION</div>
          <div style={mobileStyles.animationGrid}>
            {ANIMATIONS.map((anim) => (
              <div
                key={anim.value}
                style={{
                  ...mobileStyles.animationButton,
                  ...((layer.animation?.entrance || "fade") === anim.value ? mobileStyles.animationButtonActive : {}),
                }}
                onClick={() =>
                  onUpdate(layer.id, {
                    animation: { ...layer.animation, entrance: anim.value as any },
                  })
                }
              >
                <div style={mobileStyles.animationPreview}>
                  <div 
                    style={mobileStyles.animationBackground}
                    className={`anim-preview-${anim.value}`}
                  >
                    <div style={{ fontSize: "32px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>
                      📹
                    </div>
                  </div>
                </div>
                <div style={mobileStyles.animationLabel}>{anim.name}</div>
              </div>
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
            <>
              <div style={styles.formGroupCompact}>
                <label style={styles.label}>Playback Speed</label>
                <div style={styles.sliderWrapper}>
                  <input
                    type="range"
                    style={styles.slider}
                    min="0.25"
                    max="2"
                    step="0.25"
                    value={layer.playbackRate || 1}
                    onChange={(e) =>
                      onUpdate(layer.id, { playbackRate: parseFloat(e.target.value) })
                    }
                  />
                  <span style={styles.sliderValue}>{layer.playbackRate || 1}x</span>
                </div>
              </div>

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
            </>
          )}
        </div>

        {/* Delete Button */}
        <div style={{ ...styles.section, paddingBottom: "50px" }}>
          <button
            style={styles.deleteButton}
            onClick={() => {
              if (window.confirm("Delete this video layer?")) {
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
          { id: "video", label: "Video" },
          { id: "display", label: "Display" },
          { id: "effects", label: "Effects" },
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
        
        {/* ===== VIDEO TAB ===== */}
        {activeSection === "video" && (
          <>
            {/* REPLACE VIDEO */}
            <div style={{ ...mobileStyles.sectionHeader, ...mobileStyles.sectionHeaderFirst }}>
              REPLACE VIDEO
            </div>
            <button
              style={{ ...mobileStyles.button, ...mobileStyles.buttonPrimary }}
              onClick={onReplace}
            >
              Replace Video
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

            {/* QUICK LAYOUT */}
            <div style={mobileStyles.sectionHeader}>QUICK LAYOUT</div>
            <div style={mobileStyles.layoutGrid}>
              {/* Top Half */}
              <button
                style={mobileStyles.layoutButton}
                onClick={() => {
                  onUpdate(layer.id, {
                    position: { x: 50, y: 25 },
                    size: { width: 100, height: 50 },
                    objectFit: "cover"
                  });
                }}
              >
                <div style={mobileStyles.layoutIcon}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: colors.accent }} />
                </div>
                <span style={mobileStyles.layoutLabel}>Top</span>
              </button>

              {/* Full Screen */}
              <button
                style={mobileStyles.layoutButton}
                onClick={() => {
                  onUpdate(layer.id, {
                    position: { x: 50, y: 50 },
                    size: { width: 100, height: 100 },
                    objectFit: "cover"
                  });
                }}
              >
                <div style={{ ...mobileStyles.layoutIcon, background: colors.accent }} />
                <span style={mobileStyles.layoutLabel}>Full</span>
              </button>

              {/* Bottom Half */}
              <button
                style={mobileStyles.layoutButton}
                onClick={() => {
                  onUpdate(layer.id, {
                    position: { x: 50, y: 75 },
                    size: { width: 100, height: 50 },
                    objectFit: "cover"
                  });
                }}
              >
                <div style={mobileStyles.layoutIcon}>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: colors.accent }} />
                </div>
                <span style={mobileStyles.layoutLabel}>Bottom</span>
              </button>
            </div>
          </>
        )}

        {/* ===== DISPLAY TAB ===== */}
        {activeSection === "display" && (
          <>
            {/* CROP TO FIT & OPACITY - 2 COLUMNS */}
            <div style={{ ...mobileStyles.sectionHeader, ...mobileStyles.sectionHeaderFirst }}>
              DISPLAY OPTIONS
            </div>
            <div style={mobileStyles.grid2}>
              <div style={mobileStyles.gridItem}>
                <label style={mobileStyles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    checked={layer.objectFit === "cover"}
                    onChange={(e) =>
                      onUpdate(layer.id, { objectFit: e.target.checked ? "cover" : "contain" })
                    }
                  />
                  <span style={mobileStyles.checkboxLabel}>Crop to fit</span>
                </label>
              </div>
              <div style={mobileStyles.gridItem}>
                <div style={mobileStyles.sliderRow}>
                  <div style={mobileStyles.sliderTopRow}>
                    <span style={mobileStyles.sliderLabel}>Opacity</span>
                    <span style={mobileStyles.sliderValue}>{Math.round(layer.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    style={mobileStyles.sliderInput}
                    min="0"
                    max="1"
                    step="0.01"
                    value={layer.opacity}
                    onChange={(e) => onUpdate(layer.id, { opacity: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            {/* ROTATION */}
            <div style={mobileStyles.sectionHeader}>ROTATION</div>
            <div style={mobileStyles.iconButtonGroup}>
              <input
                type="number"
                style={{ ...mobileStyles.input, flex: 1, marginBottom: 0 }}
                value={layer.rotation}
                onChange={(e) => onUpdate(layer.id, { rotation: parseInt(e.target.value) || 0 })}
              />
              <button
                style={mobileStyles.iconButton}
                onClick={() => onUpdate(layer.id, { rotation: (layer.rotation + 90) % 360 })}
              >
                ↻
              </button>
              <button
                style={{
                  ...mobileStyles.iconButton,
                  backgroundColor: layer.flipX ? '#3b82f6' : undefined,
                  color: layer.flipX ? 'white' : undefined,
                }}
                onClick={() => onUpdate(layer.id, { flipX: !layer.flipX })}
              >
                ⇄
              </button>
              <button
                style={{
                  ...mobileStyles.iconButton,
                  backgroundColor: layer.flipY ? '#3b82f6' : undefined,
                  color: layer.flipY ? 'white' : undefined,
                }}
                onClick={() => onUpdate(layer.id, { flipY: !layer.flipY })}
              >
                ⇅
              </button>
            </div>


            {/* BORDER */}
            <div style={mobileStyles.sectionHeader}>BORDER</div>
            <div style={mobileStyles.sliderRow}>
              <div style={mobileStyles.sliderTopRow}>
                <span style={mobileStyles.sliderLabel}>Border Width</span>
                <span style={mobileStyles.sliderValue}>{layer.borderWidth || 0}px</span>
              </div>
              <input
                type="range"
                style={mobileStyles.sliderInput}
                min="0"
                max="20"
                value={layer.borderWidth || 0}
                onChange={(e) => onUpdate(layer.id, { borderWidth: parseInt(e.target.value) })}
              />
            </div>
            <div style={mobileStyles.sliderRow}>
              <div style={mobileStyles.sliderTopRow}>
                <span style={mobileStyles.sliderLabel}>Border Radius</span>
                <span style={mobileStyles.sliderValue}>{layer.borderRadius || 0}px</span>
              </div>
              <input
                type="range"
                style={mobileStyles.sliderInput}
                min="0"
                max="100"
                value={layer.borderRadius || 0}
                onChange={(e) => onUpdate(layer.id, { borderRadius: parseInt(e.target.value) })}
              />
            </div>
            <div style={mobileStyles.sliderRow}>
              <div style={mobileStyles.sliderTopRow}>
                <span style={mobileStyles.sliderLabel}>Border Color</span>
              </div>
              <input
                type="color"
                value={layer.borderColor || "#ffffff"}
                onChange={(e) => onUpdate(layer.id, { borderColor: e.target.value })}
                style={{ width: "100%", height: 36, border: "none", borderRadius: 6, cursor: "pointer" }}
              />
            </div>

            {/* FILTERS */}
            <div style={mobileStyles.sectionHeader}>FILTERS</div>
            <div style={mobileStyles.filterGrid}>
              {FILTERS.map((filter) => (
                <div
                  key={filter.value}
                  style={{
                    ...mobileStyles.filterButton,
                    ...(layer.filter === filter.value ? mobileStyles.filterButtonActive : {}),
                  }}
                  onClick={() => onUpdate(layer.id, { filter: filter.value })}
                >
                  <div style={mobileStyles.filterPreview}>
                    {/* Colorful sample image to show filter effect */}
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        filter: filter.value === "none" ? "none" : filter.value,
                      }}
                    >
                      <div style={{
                        fontSize: "32px",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                      }}>
                        🎬
                      </div>
                    </div>
                  </div>
                  <div style={mobileStyles.filterLabel}>{filter.name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===== EFFECTS TAB ===== */}
        {activeSection === "effects" && (
          <>
            {/* ANIMATION */}
            <div style={{ ...mobileStyles.sectionHeader, ...mobileStyles.sectionHeaderFirst }}>
              ENTRANCE ANIMATION
            </div>
            <div style={mobileStyles.animationGrid}>
              {ANIMATIONS.map((anim) => (
                <div
                  key={anim.value}
                  style={{
                    ...mobileStyles.animationButton,
                    ...((layer.animation?.entrance || "fade") === anim.value ? mobileStyles.animationButtonActive : {}),
                  }}
                  onClick={() =>
                    onUpdate(layer.id, {
                      animation: { ...layer.animation, entrance: anim.value as any },
                    })
                  }
                >
                  <div style={mobileStyles.animationPreview}>
                    <div 
                      style={mobileStyles.animationBackground}
                      className={`anim-preview-${anim.value}`}
                    >
                      <div style={{ fontSize: "32px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>
                        📹
                      </div>
                    </div>
                  </div>
                  <div style={mobileStyles.animationLabel}>{anim.name}</div>
                </div>
              ))}
            </div>

            {/* AUDIO - VOLUME & LOOP - 2 COLUMNS */}
            <div style={mobileStyles.sectionHeader}>AUDIO</div>
            <div style={mobileStyles.grid2}>
              <div style={mobileStyles.gridItem}>
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
              </div>
              <div style={mobileStyles.gridItem}>
                <label style={mobileStyles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    checked={layer.loop || false}
                    onChange={(e) => onUpdate(layer.id, { loop: e.target.checked })}
                  />
                  <span style={mobileStyles.checkboxLabel}>Loop video</span>
                </label>
              </div>
            </div>

            {/* PLAYBACK SPEED */}
            <div style={mobileStyles.sectionHeader}>PLAYBACK SPEED</div>
            <div style={mobileStyles.sliderRow}>
              <div style={mobileStyles.sliderTopRow}>
                <span style={mobileStyles.sliderLabel}>Speed</span>
                <span style={mobileStyles.sliderValue}>{layer.playbackRate || 1}x</span>
              </div>
              <input
                type="range"
                style={mobileStyles.sliderInput}
                min="0.25"
                max="2"
                step="0.25"
                value={layer.playbackRate || 1}
                onChange={(e) => onUpdate(layer.id, { playbackRate: parseFloat(e.target.value) })}
              />
            </div>

            {/* FADE IN & FADE OUT - 2 COLUMNS */}
            <div style={mobileStyles.sectionHeader}>FADES</div>
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

            {/* ACTIONS */}
            <div style={mobileStyles.sectionHeader}>ACTIONS</div>
            <button
              style={{ ...mobileStyles.button, ...mobileStyles.buttonDanger }}
              onClick={() => {
                if (window.confirm("Delete this video layer?")) {
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

        /* Animation previews - hover to see live demo */
        .anim-preview-none {
          /* No animation */
        }
        
        .anim-preview-fade:hover {
          animation: fadeAnim 1s ease-in-out infinite;
        }
        
        .anim-preview-slideUp:hover {
          animation: slideUpAnim 0.8s ease-out infinite;
        }
        
        .anim-preview-slideDown:hover {
          animation: slideDownAnim 0.8s ease-out infinite;
        }
        
        .anim-preview-scale:hover {
          animation: scaleAnim 0.8s ease-in-out infinite;
        }

        @keyframes fadeAnim {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        @keyframes slideUpAnim {
          0% { transform: translateY(40px); opacity: 0; }
          50% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(40px); opacity: 0; }
        }
        
        @keyframes slideDownAnim {
          0% { transform: translateY(-40px); opacity: 0; }
          50% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-40px); opacity: 0; }
        }
        
        @keyframes scaleAnim {
          0%, 100% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};