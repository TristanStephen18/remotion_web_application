import React, { useState } from "react";
import toast from "react-hot-toast";
import { type TextLayer } from "../remotion_compositions/DynamicLayerComposition";
import { FONTS, FONT_WEIGHTS, DESIGN_PRESETS } from "../../data/editor_constants";
import { EditorIcons } from "./EditorIcons";
import { useTheme } from "../../contexts/ThemeContext";
import { measureTextDimensions } from "../../utils/textAutoResize";

// Simple alignment icons
const AlignIcons = {
  left: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="15" y2="12" />
    <line x1="3" y1="18" x2="18" y2="18" />
  </svg>,
  center: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="6" y1="12" x2="18" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>,
  right: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="9" y1="12" x2="21" y2="12" />
    <line x1="6" y1="18" x2="21" y2="18" />
  </svg>,
};

interface TextEditorProps {
  layer: TextLayer;
  onUpdate: (layerId: string, updates: Partial<TextLayer>) => void;
  onDelete: (layerId: string) => void;
  isMobile?: boolean;
}

/**
 * Modern TextEditor Component - With Mobile Layout from ImageEditor
 */
export const TextEditor: React.FC<TextEditorProps> = ({
  layer,
  onUpdate,
  onDelete,
  isMobile = false,
}) => {
  const { colors } = useTheme();
  const [showPresets, setShowPresets] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [highlightInput, setHighlightInput] = useState(layer.highlightWords?.join(', ') || '');
  const [activeSection, setActiveSection] = useState<"text" | "style" | "effects">("text");

  // Sync local state when layer changes (e.g., switching between layers)
  React.useEffect(() => {
    setHighlightInput(layer.highlightWords?.join(', ') || '');
  }, [layer.id]); // Only sync when switching to a different layer

  // ========================================
  // COMPACT MOBILE STYLES (copied from ImageEditor)
  // ========================================
  const mobileStyles: Record<string, React.CSSProperties> = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      backgroundColor: colors.bgPrimary,
      overflow: "hidden",
    },
    
    // Top tabs - compact
    topBar: {
      display: "flex",
      gap: "0px",
      padding: "0",
      borderBottom: `1px solid ${colors.border}`,
      flexShrink: 0,
    },
    
    tabButton: {
      flex: 1,
      padding: "10px 6px",
      backgroundColor: "transparent",
      border: "none",
      borderBottom: "2px solid transparent",
      color: colors.textMuted,
      fontSize: "12px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    
    tabButtonActive: {
      color: colors.textPrimary,
      borderBottomColor: colors.accent,
      fontWeight: "600",
    },
    
    // Scrollable content - compact
    content: {
      flex: 1,
      overflow: "auto",
      padding: "14px",
      paddingBottom: "20px",
    },
    
    // Section header - smaller
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
    
    // Slider container - compact
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
      WebkitAppearance: "none",
      background: colors.bgSecondary,
    },
    
    // Action buttons - compact
    button: {
      width: "100%",
      padding: "8px",
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      color: colors.textPrimary,
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
      marginBottom: "6px",
      transition: "all 0.2s",
    },
    
    buttonDanger: {
      backgroundColor: "#dc262615",
      borderColor: "#dc2626",
      color: "#dc2626",
    },
    
    // Form elements - compact
    textarea: {
      width: "100%",
      minHeight: "60px",
      padding: "8px",
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      color: colors.textPrimary,
      fontSize: "12px",
      fontFamily: "inherit",
      resize: "vertical",
      lineHeight: "1.4",
      marginBottom: "12px",
    },
    
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
    
    // Color picker
    colorWrapper: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      marginBottom: "12px",
    },
    
    colorPreview: {
      width: "36px",
      height: "36px",
      borderRadius: "6px",
      border: `2px solid ${colors.border}`,
      cursor: "pointer",
      flexShrink: 0,
    },
    
    colorInput: {
      flex: 1,
      height: "36px",
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      cursor: "pointer",
      backgroundColor: colors.bgSecondary,
    },
    
    // Preset grid - compact (5 columns)
    presetGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "6px",
      marginBottom: "12px",
    },
    
    presetCard: {
      aspectRatio: "1",
      backgroundColor: colors.bgSecondary,
      border: `2px solid ${colors.border}`,
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "4px",
    },
    
    presetCardActive: {
      backgroundColor: colors.accent + "20",
      borderColor: colors.accent,
    },
    
    presetText: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "2px",
    },
    
    presetName: {
      fontSize: "8px",
      color: colors.textMuted,
      fontWeight: "500",
      textAlign: "center",
      lineHeight: "1.1",
    },
  };

  // Modern, compact styles (for desktop - keeping original)
  const styles: Record<string, React.CSSProperties> = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      backgroundColor: colors.bgPrimary,
      overflow: "hidden",
    },
    scrollContent: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      paddingBottom: "20px",
    },
    section: {
      padding: "10px 12px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "8px",
      cursor: "pointer",
      userSelect: "none",
    },
    sectionTitle: {
      fontSize: "11px",
      fontWeight: "600",
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: "0.8px",
    },
    collapseIcon: {
      fontSize: "10px",
      color: colors.textTertiary,
      transition: "transform 0.2s",
    },
    // Form Controls - Compact
    formGroup: {
      marginBottom: "8px",
    },
    label: {
      display: "block",
      fontSize: "10px",
      color: "#777",
      marginBottom: "4px",
      fontWeight: "500",
    },
    textarea: {
      width: "100%",
      minHeight: "60px",
      padding: "8px",
      backgroundColor: colors.bgSecondary,
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "6px",
      color: colors.textPrimary,
      fontSize: "13px",
      fontFamily: "inherit",
      resize: "vertical",
      lineHeight: "1.4",
    },
    select: {
      width: "100%",
      padding: "6px 8px",
      backgroundColor: colors.bgSecondary,
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "6px",
      color: colors.textPrimary,
      fontSize: "12px",
      cursor: "pointer",
      height: "28px",
    },
    input: {
      width: "100%",
      padding: "6px 8px",
      backgroundColor: colors.bgSecondary,
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "6px",
      color: colors.textPrimary,
      fontSize: "12px",
      height: "28px",
    },
    // Grid Layouts for compact controls
    grid2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px",
    },
    grid3: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "6px",
    },
    // Button Groups
    buttonGroup: {
      display: "flex",
      gap: "4px",
      backgroundColor: colors.bgSecondary,
      padding: "3px",
      borderRadius: "6px",
      border: "1px solid rgba(255,255,255,0.06)",
    },
    toggleButton: {
      flex: 1,
      padding: "6px 8px",
      backgroundColor: "transparent",
      border: "none",
      borderRadius: "4px",
      color: colors.textMuted,
      fontSize: "11px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.15s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
    },
    toggleButtonActive: {
      backgroundColor: "#3b82f6",
      color: "white",
    },
    iconButton: {
      padding: "6px",
      backgroundColor: colors.bgSecondary,
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "6px",
      color: colors.textMuted,
      cursor: "pointer",
      transition: "all 0.15s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "32px",
      height: "28px",
    },
    // Color Picker - Compact
    colorWrapper: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
    },
    colorPreview: {
      width: "32px",
      height: "28px",
      borderRadius: "6px",
      border: "1px solid rgba(255,255,255,0.1)",
      cursor: "pointer",
      flexShrink: 0,
    },
    colorInput: {
      flex: 1,
      height: "28px",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "6px",
      cursor: "pointer",
      backgroundColor: colors.bgSecondary,
    },
    // Slider - Compact
    sliderWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    slider: {
      flex: 1,
      height: "3px",
      accentColor: "#3b82f6",
    },
    sliderValue: {
      fontSize: "11px",
      color: colors.textMuted,
      minWidth: "32px",
      textAlign: "right",
      fontWeight: "500",
    },
    // Presets - Compact Grid
    presetGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "6px",
      maxHeight: "300px",
      overflowY: "auto",
      paddingRight: "4px",
    },
    presetCard: {
      padding: "10px 8px",
      backgroundColor: colors.bgSecondary,
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.15s",
      textAlign: "center",
    },
    presetText: {
      fontSize: "13px",
      marginBottom: "4px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    presetName: {
      fontSize: "9px",
      color: colors.textMuted,
      fontWeight: "500",
    },
    // Delete Button
    deleteButton: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#dc2626",
      border: "none",
      borderRadius: "6px",
      color: "white",
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      transition: "all 0.15s",
    },
  };

  // Helper: Apply a design preset
  const applyPreset = (preset: typeof DESIGN_PRESETS[number]) => {
    onUpdate(layer.id, {
      fontFamily: preset.style.fontFamily,
      fontSize: preset.style.fontSize,
      fontColor: preset.style.fontColor,
      fontWeight: preset.style.fontWeight as any,
      textOutline: preset.style.textOutline || false,
      outlineColor: preset.style.outlineColor || "transparent",
      textShadow: preset.style.textShadow || false,
      shadowBlur: preset.style.shadowBlur || 0,
      shadowColor: preset.style.shadowColor || "transparent",
      shadowX: preset.style.shadowX || 0,
      shadowY: preset.style.shadowY || 0,
    });
    toast.success(`Applied ${preset.name}!`);
  };

  // Helper: Update with auto-resize
  const updateWithAutoResize = (updates: Partial<TextLayer>) => {
    const dims = measureTextDimensions({ ...layer, ...updates });
    onUpdate(layer.id, {
      ...updates,
      size: { width: dims.width, height: dims.height },
    });
  };

  // ========================================
  // DESKTOP LAYOUT (unchanged from original)
  // ========================================
  if (!isMobile) {
    return (
      <div style={styles.container}>
        <div style={styles.scrollContent}>
        {/* Text Content */}
        <div style={styles.section}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Text Content</label>
            <textarea
              style={styles.textarea}
              value={layer.content}
              onChange={(e) => updateWithAutoResize({ content: e.target.value })}
              placeholder="Enter your text..."
            />
          </div>

          <div style={styles.grid2}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Font</label>
              <select
                style={{
                  ...styles.select,
                  fontFamily: layer.fontFamily,
                }}
                value={layer.fontFamily}
                onChange={(e) => updateWithAutoResize({ fontFamily: e.target.value })}
              >
                {FONTS.map((font) => (
                  <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Size</label>
              <input
                type="number"
                style={styles.input}
                value={layer.fontSize}
                onChange={(e) => updateWithAutoResize({ fontSize: parseInt(e.target.value) || 16 })}
                min="8"
                max="200"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Color</label>
            <div style={styles.colorWrapper}>
              <div
                style={{
                  ...styles.colorPreview,
                  backgroundColor: layer.fontColor,
                }}
              />
              <input
                type="color"
                style={styles.colorInput}
                value={layer.fontColor}
                onChange={(e) => onUpdate(layer.id, { fontColor: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Style Controls */}
        <div style={styles.section}>
          <div style={styles.grid3}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Weight</label>
              <select
                style={styles.select}
                value={layer.fontWeight || "normal"}
                onChange={(e) => updateWithAutoResize({ fontWeight: e.target.value as any })}
              >
                {FONT_WEIGHTS.map((weight) => (
                  <option key={weight.value} value={weight.value}>
                    {weight.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Align</label>
              <div style={styles.buttonGroup}>
                {(["left", "center", "right"] as const).map((align) => (
                  <button
                    key={align}
                    style={{
                      ...styles.toggleButton,
                      ...(layer.textAlign === align ? styles.toggleButtonActive : {}),
                    }}
                    onClick={() => onUpdate(layer.id, { textAlign: align })}
                  >
                    {AlignIcons[align]}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
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
                <span style={styles.sliderValue}>
                  {Math.round(layer.opacity * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div style={styles.grid2}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Shadow Blur</label>
              <input
                type="number"
                style={styles.input}
                value={layer.shadowBlur || 0}
                onChange={(e) => onUpdate(layer.id, { shadowBlur: parseInt(e.target.value) })}
                min="0"
                max="50"
              />
            </div>

            {(layer.shadowBlur ?? 0) > 0 && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Shadow Color</label>
                <div style={styles.colorWrapper}>
                  <div
                    style={{
                      ...styles.colorPreview,
                      backgroundColor: layer.shadowColor || "transparent",
                    }}
                  />
                  <input
                    type="color"
                    style={styles.colorInput}
                    value={layer.shadowColor || "#000000"}
                    onChange={(e) => onUpdate(layer.id, { shadowColor: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Animation & Effects - Collapsible */}
        <div style={styles.section}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Entrance Animation</label>
            <select
              style={styles.select}
              value={layer.animation?.entrance || "none"}
              onChange={(e) => onUpdate(layer.id, { 
                animation: { 
                  ...layer.animation, 
                  entrance: e.target.value as any 
                } 
              })}
            >
              <option value="none">None</option>
              <option value="fade">Fade In</option>
              <option value="slideUp">Slide Up</option>
              <option value="slideDown">Slide Down</option>
              <option value="slideLeft">Slide Left</option>
              <option value="slideRight">Slide Right</option>
              <option value="scale">Scale</option>
              <option value="bounce">Bounce</option>
              <option value="zoomPunch">Zoom Punch</option>
              <option value="popIn">Pop In</option>
              <option value="rotate">Rotate</option>
              <option value="typewriter">Typewriter</option>
              <option value="kinetic">Kinetic</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Animation Speed</label>
            <div style={styles.sliderWrapper}>
              <input
                type="range"
                style={styles.slider}
                min="15"
                max="120"
                step="15"
                value={layer.animation?.entranceDuration || 60}
                onChange={(e) => onUpdate(layer.id, { 
                  animation: { 
                    ...layer.animation, 
                    entranceDuration: parseInt(e.target.value) 
                  } 
                })}
              />
              <span style={styles.sliderValue}>
                {Math.round((layer.animation?.entranceDuration || 60) / 30 * 10) / 10}s
              </span>
            </div>
          </div>

          {/* TEXT CURVE / BEND */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Text Curve</label>
            <div style={styles.sliderWrapper}>
              <input
                type="range"
                style={styles.slider}
                min="-100"
                max="100"
                step="5"
                value={layer.textBend || 0}
                onChange={(e) => onUpdate(layer.id, { textBend: parseInt(e.target.value) })}
              />
              <span style={styles.sliderValue}>
                {layer.textBend || 0}%
              </span>
            </div>
          </div>
          
          {/* Curve preset buttons */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <button
              style={{
                ...styles.toggleButton,
                flex: 1,
                padding: '6px 8px',
                fontSize: '11px',
                ...(layer.textBend === -50 ? styles.toggleButtonActive : {}),
              }}
              onClick={() => onUpdate(layer.id, { textBend: -50 })}
            >
              ⌒ Down
            </button>
            <button
              style={{
                ...styles.toggleButton,
                flex: 1,
                padding: '6px 8px',
                fontSize: '11px',
                ...((layer.textBend === 0 || !layer.textBend) ? styles.toggleButtonActive : {}),
              }}
              onClick={() => onUpdate(layer.id, { textBend: 0 })}
            >
              — Flat
            </button>
            <button
              style={{
                ...styles.toggleButton,
                flex: 1,
                padding: '6px 8px',
                fontSize: '11px',
                ...(layer.textBend === 50 ? styles.toggleButtonActive : {}),
              }}
              onClick={() => onUpdate(layer.id, { textBend: 50 })}
            >
              ⌣ Up
            </button>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Highlight Words (comma separated)</label>
            <input
              type="text"
              style={{
                ...styles.select,
                fontFamily: 'inherit',
              }}
              placeholder="e.g. balance, moving"
              value={highlightInput}
              onChange={(e) => {
                setHighlightInput(e.target.value);
              }}
              onBlur={() => {
                const words = highlightInput
                  .split(',')
                  .map(w => w.trim())
                  .filter(w => w.length > 0);
                console.log('Highlight words being saved:', words);
                onUpdate(layer.id, { 
                  highlightWords: words.length > 0 ? words : undefined 
                });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
            />
            {layer.highlightWords && layer.highlightWords.length > 0 && (
              <div style={{ 
                fontSize: '10px', 
                color: '#666', 
                marginTop: '4px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px'
              }}>
                {layer.highlightWords.map((word, idx) => (
                  <span key={idx} style={{
                    backgroundColor: '#1a1a1a',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    border: '1px solid #333'
                  }}>
                    {word}
                  </span>
                ))}
              </div>
            )}
          </div>

          {layer.highlightWords && layer.highlightWords.length > 0 && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Highlight Color</label>
              <div style={styles.colorWrapper}>
                <div
                  style={{
                    ...styles.colorPreview,
                    backgroundColor: layer.highlightColor || 'rgba(255, 215, 0, 0.4)',
                  }}
                />
                <input
                  type="color"
                  style={styles.colorInput}
                  value={layer.highlightColor?.replace(/rgba?\([^)]+\)/, '#FFD700') || '#FFD700'}
                  onChange={(e) => {
                    const hex = e.target.value;
                    const r = parseInt(hex.slice(1, 3), 16);
                    const g = parseInt(hex.slice(3, 5), 16);
                    const b = parseInt(hex.slice(5, 7), 16);
                    onUpdate(layer.id, { 
                      highlightColor: `rgba(${r}, ${g}, ${b}, 0.4)` 
                    });
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Design Presets - Collapsible */}
        <div style={styles.section}>
          <div
            style={styles.sectionHeader}
            onClick={() => setShowPresets(!showPresets)}
          >
            <span style={styles.sectionTitle}>DESIGN PRESETS</span>
            <span
              style={{
                ...styles.collapseIcon,
                transform: showPresets ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▼
            </span>
          </div>
          
          {showPresets && (
            <div style={styles.presetGrid}>
              {DESIGN_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  style={styles.presetCard}
                  onClick={() => applyPreset(preset)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.bgTertiary;
                    e.currentTarget.style.borderColor = "#3b82f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.bgSecondary;
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                >
                  <div
                    style={{
                      ...styles.presetText,
                      fontFamily: preset.style.fontFamily,
                      color: preset.style.fontColor,
                    }}
                  >
                    Aa
                  </div>
                  <div style={styles.presetName}>{preset.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Advanced Options - Collapsible */}
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
              <div style={styles.grid2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Line Height</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={layer.lineHeight}
                    step="0.1"
                    min="0.5"
                    max="3"
                    onChange={(e) => updateWithAutoResize({ lineHeight: parseFloat(e.target.value) })}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Letter Spacing</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={layer.letterSpacing || 0}
                    step="0.5"
                    onChange={(e) => updateWithAutoResize({ letterSpacing: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Transform</label>
                <select
                  style={styles.select}
                  value={layer.textTransform || "none"}
                  onChange={(e) => updateWithAutoResize({ textTransform: e.target.value as any })}
                >
                  <option value="none">None</option>
                  <option value="uppercase">UPPERCASE</option>
                  <option value="lowercase">lowercase</option>
                  <option value="capitalize">Capitalize</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Delete Button */}
        <div style={{ ...styles.section, paddingBottom: "50px" }}>
          <button
            style={styles.deleteButton}
            onClick={() => {
              if (window.confirm("Delete this text layer?")) {
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
            <EditorIcons.Trash />
            Delete Layer
          </button>
        </div>
        </div>
      </div>
    );
  }

  // ========================================
  // MOBILE LAYOUT (copied from ImageEditor)
  // ========================================
  return (
    <div style={mobileStyles.container}>
      {/* TOP TABS */}
      <div style={mobileStyles.topBar}>
        {[
          { id: "text", label: "Text" },
          { id: "style", label: "Style" },
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
        
        {/* ===== TEXT TAB ===== */}
        {activeSection === "text" && (
          <>
            {/* TEXT CONTENT */}
            <div style={{ ...mobileStyles.sectionHeader, ...mobileStyles.sectionHeaderFirst }}>
              TEXT CONTENT
            </div>
            <textarea
              style={mobileStyles.textarea}
              value={layer.content}
              onChange={(e) => updateWithAutoResize({ content: e.target.value })}
              placeholder="Enter your text..."
            />

            {/* FONT & SIZE - 2 COLUMNS */}
            <div style={mobileStyles.grid2}>
              <div style={mobileStyles.gridItem}>
                <div style={mobileStyles.sectionHeader}>FONT</div>
                <select
                  style={{
                    ...mobileStyles.select,
                    fontFamily: layer.fontFamily,
                  }}
                  value={layer.fontFamily}
                  onChange={(e) => updateWithAutoResize({ fontFamily: e.target.value })}
                >
                  {FONTS.map((font) => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={mobileStyles.gridItem}>
                <div style={mobileStyles.sectionHeader}>SIZE</div>
                <div style={mobileStyles.sliderRow}>
                  <div style={mobileStyles.sliderTopRow}>
                    <span style={mobileStyles.sliderLabel}>Size</span>
                    <span style={mobileStyles.sliderValue}>{layer.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    style={mobileStyles.sliderInput}
                    min="8"
                    max="200"
                    value={layer.fontSize}
                    onChange={(e) => updateWithAutoResize({ fontSize: parseInt(e.target.value) || 16 })}
                  />
                </div>
              </div>
            </div>

            {/* COLOR */}
            <div style={mobileStyles.sectionHeader}>COLOR</div>
            <div style={mobileStyles.colorWrapper}>
              <div
                style={{
                  ...mobileStyles.colorPreview,
                  backgroundColor: layer.fontColor,
                }}
              />
              <input
                type="color"
                style={mobileStyles.colorInput}
                value={layer.fontColor}
                onChange={(e) => onUpdate(layer.id, { fontColor: e.target.value })}
              />
            </div>

            {/* ALIGNMENT & WEIGHT - 2 COLUMNS */}
            <div style={mobileStyles.grid2}>
              <div style={mobileStyles.gridItem}>
                <div style={mobileStyles.sectionHeader}>ALIGNMENT</div>
                <div style={mobileStyles.buttonGroup}>
                  {(["left", "center", "right"] as const).map((align) => (
                    <button
                      key={align}
                      style={{
                        ...mobileStyles.toggleButton,
                        ...(layer.textAlign === align ? mobileStyles.toggleButtonActive : {}),
                      }}
                      onClick={() => onUpdate(layer.id, { textAlign: align })}
                    >
                      {AlignIcons[align]}
                    </button>
                  ))}
                </div>
              </div>

              <div style={mobileStyles.gridItem}>
                <div style={mobileStyles.sectionHeader}>WEIGHT</div>
                <select
                  style={mobileStyles.select}
                  value={layer.fontWeight || "normal"}
                  onChange={(e) => updateWithAutoResize({ fontWeight: e.target.value as any })}
                >
                  {FONT_WEIGHTS.map((weight) => (
                    <option key={weight.value} value={weight.value}>
                      {weight.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {/* ===== STYLE TAB ===== */}
        {activeSection === "style" && (
          <>
            {/* DESIGN PRESETS */}
            <div style={{ ...mobileStyles.sectionHeader, ...mobileStyles.sectionHeaderFirst }}>
              DESIGN PRESETS
            </div>
            <div style={mobileStyles.presetGrid}>
              {DESIGN_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  style={mobileStyles.presetCard}
                  onClick={() => applyPreset(preset)}
                >
                  <div
                    style={{
                      ...mobileStyles.presetText,
                      fontFamily: preset.style.fontFamily,
                      color: preset.style.fontColor,
                    }}
                  >
                    Aa
                  </div>
                  <div style={mobileStyles.presetName}>{preset.name}</div>
                </div>
              ))}
            </div>

            {/* SHADOW BLUR & COLOR - 2 COLUMNS */}
            <div style={mobileStyles.grid2}>
              <div style={mobileStyles.gridItem}>
                <div style={mobileStyles.sectionHeader}>SHADOW BLUR</div>
                <div style={mobileStyles.sliderRow}>
                  <div style={mobileStyles.sliderTopRow}>
                    <span style={mobileStyles.sliderLabel}>Blur</span>
                    <span style={mobileStyles.sliderValue}>{layer.shadowBlur || 0}px</span>
                  </div>
                  <input
                    type="range"
                    style={mobileStyles.sliderInput}
                    min="0"
                    max="50"
                    value={layer.shadowBlur || 0}
                    onChange={(e) => onUpdate(layer.id, { shadowBlur: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div style={mobileStyles.gridItem}>
                <div style={mobileStyles.sectionHeader}>SHADOW COLOR</div>
                <div style={mobileStyles.colorWrapper}>
                  <div
                    style={{
                      ...mobileStyles.colorPreview,
                      backgroundColor: layer.shadowColor || "transparent",
                    }}
                  />
                  <input
                    type="color"
                    style={mobileStyles.colorInput}
                    value={layer.shadowColor || "#000000"}
                    onChange={(e) => onUpdate(layer.id, { shadowColor: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* LINE HEIGHT & LETTER SPACING - 2 COLUMNS */}
            <div style={mobileStyles.grid2}>
              <div style={mobileStyles.gridItem}>
                <div style={mobileStyles.sectionHeader}>LINE HEIGHT</div>
                <div style={mobileStyles.sliderRow}>
                  <div style={mobileStyles.sliderTopRow}>
                    <span style={mobileStyles.sliderLabel}>Height</span>
                    <span style={mobileStyles.sliderValue}>{layer.lineHeight}</span>
                  </div>
                  <input
                    type="range"
                    style={mobileStyles.sliderInput}
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={layer.lineHeight}
                    onChange={(e) => updateWithAutoResize({ lineHeight: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div style={mobileStyles.gridItem}>
                <div style={mobileStyles.sectionHeader}>SPACING</div>
                <div style={mobileStyles.sliderRow}>
                  <div style={mobileStyles.sliderTopRow}>
                    <span style={mobileStyles.sliderLabel}>Letters</span>
                    <span style={mobileStyles.sliderValue}>{layer.letterSpacing || 0}px</span>
                  </div>
                  <input
                    type="range"
                    style={mobileStyles.sliderInput}
                    min="-5"
                    max="20"
                    step="0.5"
                    value={layer.letterSpacing || 0}
                    onChange={(e) => updateWithAutoResize({ letterSpacing: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            {/* TRANSFORM */}
            <div style={mobileStyles.sectionHeader}>TEXT TRANSFORM</div>
            <select
              style={mobileStyles.select}
              value={layer.textTransform || "none"}
              onChange={(e) => updateWithAutoResize({ textTransform: e.target.value as any })}
            >
              <option value="none">None</option>
              <option value="uppercase">UPPERCASE</option>
              <option value="lowercase">lowercase</option>
              <option value="capitalize">Capitalize</option>
            </select>
          </>
        )}

        {/* ===== EFFECTS TAB ===== */}
        {activeSection === "effects" && (
          <>
            {/* ENTRANCE ANIMATION */}
            <div style={{ ...mobileStyles.sectionHeader, ...mobileStyles.sectionHeaderFirst }}>
              ENTRANCE ANIMATION
            </div>
            <select
              style={mobileStyles.select}
              value={layer.animation?.entrance || "none"}
              onChange={(e) => onUpdate(layer.id, { 
                animation: { 
                  ...layer.animation, 
                  entrance: e.target.value as any 
                } 
              })}
            >
              <option value="none">None</option>
              <option value="fade">Fade In</option>
              <option value="slideUp">Slide Up</option>
              <option value="slideDown">Slide Down</option>
              <option value="slideLeft">Slide Left</option>
              <option value="slideRight">Slide Right</option>
              <option value="scale">Scale</option>
              <option value="bounce">Bounce</option>
              <option value="zoomPunch">Zoom Punch</option>
              <option value="popIn">Pop In</option>
              <option value="rotate">Rotate</option>
              <option value="typewriter">Typewriter</option>
              <option value="kinetic">Kinetic (Word Burst)</option>
            </select>

            {/* ANIMATION SPEED */}
            <div style={mobileStyles.sectionHeader}>ANIMATION SPEED</div>
            <div style={mobileStyles.sliderRow}>
              <div style={mobileStyles.sliderTopRow}>
                <span style={mobileStyles.sliderLabel}>Speed</span>
                <span style={mobileStyles.sliderValue}>
                  {Math.round((layer.animation?.entranceDuration || 60) / 30 * 10) / 10}s
                </span>
              </div>
              <input
                type="range"
                style={mobileStyles.sliderInput}
                min="15"
                max="120"
                step="15"
                value={layer.animation?.entranceDuration || 60}
                onChange={(e) => onUpdate(layer.id, { 
                  animation: { 
                    ...layer.animation, 
                    entranceDuration: parseInt(e.target.value) 
                  } 
                })}
              />
            </div>

            {/* TEXT CURVE / BEND */}
            <div style={mobileStyles.sectionHeader}>TEXT CURVE</div>
            <div style={mobileStyles.sliderRow}>
              <div style={mobileStyles.sliderTopRow}>
                <span style={mobileStyles.sliderLabel}>Bend</span>
                <span style={mobileStyles.sliderValue}>{layer.textBend || 0}%</span>
              </div>
              <input
                type="range"
                style={mobileStyles.sliderInput}
                min="-100"
                max="100"
                step="5"
                value={layer.textBend || 0}
                onChange={(e) => onUpdate(layer.id, { textBend: parseInt(e.target.value) })}
              />
            </div>
            {/* Curve preset buttons */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
              <button
                style={{
                  ...mobileStyles.button,
                  flex: 1,
                  marginBottom: 0,
                  backgroundColor: layer.textBend === -50 ? colors.accent + '30' : colors.bgSecondary,
                  borderColor: layer.textBend === -50 ? colors.accent : colors.border,
                }}
                onClick={() => onUpdate(layer.id, { textBend: -50 })}
              >
                ⌒ Down
              </button>
              <button
                style={{
                  ...mobileStyles.button,
                  flex: 1,
                  marginBottom: 0,
                  backgroundColor: (layer.textBend === 0 || !layer.textBend) ? colors.accent + '30' : colors.bgSecondary,
                  borderColor: (layer.textBend === 0 || !layer.textBend) ? colors.accent : colors.border,
                }}
                onClick={() => onUpdate(layer.id, { textBend: 0 })}
              >
                — Flat
              </button>
              <button
                style={{
                  ...mobileStyles.button,
                  flex: 1,
                  marginBottom: 0,
                  backgroundColor: layer.textBend === 50 ? colors.accent + '30' : colors.bgSecondary,
                  borderColor: layer.textBend === 50 ? colors.accent : colors.border,
                }}
                onClick={() => onUpdate(layer.id, { textBend: 50 })}
              >
                ⌣ Up
              </button>
            </div>

            {/* HIGHLIGHT WORDS */}
            <div style={mobileStyles.sectionHeader}>HIGHLIGHT WORDS</div>
            <input
              type="text"
              style={mobileStyles.input}
              placeholder="e.g. balance, moving"
              value={highlightInput}
              onChange={(e) => {
                setHighlightInput(e.target.value);
              }}
              onBlur={() => {
                const words = highlightInput
                  .split(',')
                  .map(w => w.trim())
                  .filter(w => w.length > 0);
                onUpdate(layer.id, { 
                  highlightWords: words.length > 0 ? words : undefined 
                });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
            />

            {layer.highlightWords && layer.highlightWords.length > 0 && (
              <>
                <div style={mobileStyles.sectionHeader}>HIGHLIGHT COLOR</div>
                <div style={mobileStyles.colorWrapper}>
                  <div
                    style={{
                      ...mobileStyles.colorPreview,
                      backgroundColor: layer.highlightColor || 'rgba(255, 215, 0, 0.4)',
                    }}
                  />
                  <input
                    type="color"
                    style={mobileStyles.colorInput}
                    value={layer.highlightColor?.replace(/rgba?\([^)]+\)/, '#FFD700') || '#FFD700'}
                    onChange={(e) => {
                      const hex = e.target.value;
                      const r = parseInt(hex.slice(1, 3), 16);
                      const g = parseInt(hex.slice(3, 5), 16);
                      const b = parseInt(hex.slice(5, 7), 16);
                      onUpdate(layer.id, { 
                        highlightColor: `rgba(${r}, ${g}, ${b}, 0.4)` 
                      });
                    }}
                  />
                </div>
              </>
            )}

            {/* OPACITY & ROTATION - 2 COLUMNS */}
            <div style={mobileStyles.grid2}>
              <div style={mobileStyles.gridItem}>
                <div style={mobileStyles.sectionHeader}>OPACITY</div>
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

              <div style={mobileStyles.gridItem}>
                <div style={mobileStyles.sectionHeader}>ROTATION</div>
                <div style={mobileStyles.sliderRow}>
                  <div style={mobileStyles.sliderTopRow}>
                    <span style={mobileStyles.sliderLabel}>Rotation</span>
                    <span style={mobileStyles.sliderValue}>{layer.rotation || 0}°</span>
                  </div>
                  <input
                    type="range"
                    style={mobileStyles.sliderInput}
                    min="0"
                    max="360"
                    value={layer.rotation || 0}
                    onChange={(e) => onUpdate(layer.id, { rotation: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div style={mobileStyles.sectionHeader}>ACTIONS</div>
            
            <button
              style={{
                ...mobileStyles.button,
                ...mobileStyles.buttonDanger,
              }}
              onClick={() => {
                if (window.confirm("Delete this text layer?")) {
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