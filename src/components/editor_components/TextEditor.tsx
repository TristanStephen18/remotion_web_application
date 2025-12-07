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
}

/**
 * Modern TextEditor Component - Redesigned for compact, clean UI
 */
export const TextEditor: React.FC<TextEditorProps> = ({
  layer,
  onUpdate,
  onDelete,
}) => {
  const { colors } = useTheme();
  const [showPresets, setShowPresets] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [highlightInput, setHighlightInput] = useState(layer.highlightWords?.join(', ') || '');

  // Sync local state when layer changes (e.g., switching between layers)
  React.useEffect(() => {
    setHighlightInput(layer.highlightWords?.join(', ') || '');
  }, [layer.id]); // Only sync when switching to a different layer

  // Modern, compact styles
  const styles: Record<string, React.CSSProperties> = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "auto",
      backgroundColor: colors.bgPrimary,
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
      color: colors.textTertiary,
      fontWeight: "500",
    },
    // Delete Button
    deleteButton: {
      width: "100%",
      padding: "8px",
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
      marginTop: "8px",
    },
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(layer.id, { content: e.target.value });
  };


  const updateWithAutoResize = (updates: Partial<TextLayer>) => {
    const affectsDimensions = ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'textTransform', 'content'];
    const shouldResize = Object.keys(updates).some(key => affectsDimensions.includes(key));
    
    if (shouldResize) {
      const tempLayer = { ...layer, ...updates };
      const newSize = measureTextDimensions(tempLayer, 1080, 1920);
      onUpdate(layer.id, { ...updates, size: { width: newSize.width, height: newSize.height } });
    } else {
      onUpdate(layer.id, updates);
    }
  };

  const applyPreset = (preset: typeof DESIGN_PRESETS[0]) => {
    updateWithAutoResize({
      fontFamily: preset.style.fontFamily,
      fontSize: preset.style.fontSize,
      fontColor: preset.style.fontColor,
      fontWeight: preset.style.fontWeight,
      fontStyle: preset.style.fontStyle,
      textAlign: preset.style.textAlign as any,
      textTransform: preset.style.textTransform as any,
      letterSpacing: preset.style.letterSpacing,
      lineHeight: preset.style.lineHeight,
      textShadow: preset.style.textShadow,
      shadowX: preset.style.shadowX,
      shadowY: preset.style.shadowY,
      shadowBlur: preset.style.shadowBlur,
      shadowColor: preset.style.shadowColor,
      textOutline: preset.style.textOutline,
      outlineColor: preset.style.outlineColor,
    });
    toast.success(`Applied ${preset.name}`);
  };

  return (
    <div style={styles.container}>
      {/* Text Content */}
      <div style={styles.section}>
        <div style={styles.formGroup}>
          <label style={styles.label}>TEXT CONTENT</label>
          <textarea
            style={styles.textarea}
            value={layer.content}
            onChange={handleContentChange}
            placeholder="Enter your text..."
          />
        </div>
      </div>

      {/* Typography - Compact */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>TYPOGRAPHY</div>
        
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
              <option 
                key={font.value} 
                value={font.value}
                style={{ fontFamily: font.value }}
              >
                {font.label}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.grid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Size</label>
            <div style={styles.sliderWrapper}>
              <input
                type="range"
                style={styles.slider}
                min="2"
                max="30"
                step="0.5"
                value={layer.fontSize}
                onChange={(e) => updateWithAutoResize({ fontSize: parseFloat(e.target.value) })}
              />
              <span style={styles.sliderValue}>{layer.fontSize}</span>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Weight</label>
            <select
              style={styles.select}
              value={layer.fontWeight}
              onChange={(e) => updateWithAutoResize({ fontWeight: e.target.value })}
            >
              {FONT_WEIGHTS.map((weight) => (
                <option key={weight.value} value={weight.value}>{weight.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Alignment</label>
          <div style={styles.buttonGroup}>
            <button
              style={{
                ...styles.toggleButton,
                ...(layer.textAlign === "left" ? styles.toggleButtonActive : {}),
              }}
              onClick={() => onUpdate(layer.id, { textAlign: "left" })}
            >
              {AlignIcons.left}
            </button>
            <button
              style={{
                ...styles.toggleButton,
                ...(layer.textAlign === "center" ? styles.toggleButtonActive : {}),
              }}
              onClick={() => onUpdate(layer.id, { textAlign: "center" })}
            >
              {AlignIcons.center}
            </button>
            <button
              style={{
                ...styles.toggleButton,
                ...(layer.textAlign === "right" ? styles.toggleButtonActive : {}),
              }}
              onClick={() => onUpdate(layer.id, { textAlign: "right" })}
            >
              {AlignIcons.right}
            </button>
          </div>
        </div>
      </div>

      {/* Colors - Compact */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>COLOR</div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Text Color</label>
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

      {/* Animation - Collapsible */}
      <div style={styles.section}>
        <div
          style={styles.sectionHeader}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span style={styles.sectionTitle}>ANIMATION</span>
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
            <div style={styles.formGroup}>
              <label style={styles.label}>Entrance Effect</label>
              <select
                style={styles.select}
                value={layer.animation?.entrance || 'fade'}
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
                <option value="scale">Scale</option>
                <option value="bounce">Bounce</option>
                <option value="zoomPunch">Zoom Punch</option>
                <option value="popIn">Pop In</option>
                <option value="rotate">Rotate</option>
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
          </>
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
      <div style={styles.section}>
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
  );
};