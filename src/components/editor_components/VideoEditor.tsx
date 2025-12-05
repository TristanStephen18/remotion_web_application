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
}

/**
 * Modern VideoEditor - Redesigned for compact, clean UI
 */
export const VideoEditor: React.FC<VideoEditorProps> = ({
  layer,
  totalFrames,
  onUpdate,
  onDelete,
  onReplace,
}) => {
  const { colors } = useTheme();
  const styles = getThemedEditorStyles(colors); 
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  // Helper for layout button styles
  const layoutBtnStyle: React.CSSProperties = {
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
            e.currentTarget.style.borderColor = "#3b82f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.bgTertiary;
            e.currentTarget.style.borderColor = colors.border;
          }}
        >
          {/* {EditorIcons.video} */}
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
                objectFit: "cover" // ✅ Force fill
              });
            }}
            style={layoutBtnStyle}
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
                objectFit: "cover" // ✅ Force fill
              });
            }}
            style={layoutBtnStyle}
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
                objectFit: "cover" // ✅ Force fill
              });
            }}
            style={layoutBtnStyle}
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
          </div>
        </div>
      </div>

      {/* Filters - Collapsible */}
      <div style={styles.section}>
        <div
          style={styles.sectionHeader}
          onClick={() => setShowFilters(!showFilters)}
        >
          <span style={styles.sectionTitle}>FILTERS</span>
          <span
            style={{
              ...styles.collapseIcon,
              transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </div>

        {showFilters && (
          <div style={styles.grid3}>
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                style={{
                  ...styles.card,
                  ...(layer.filter === filter.value ? styles.iconButtonActive : {}),
                }}
                onClick={() => onUpdate(layer.id, { filter: filter.value })}
                onMouseEnter={(e) => {
                  if (layer.filter !== filter.value) {
                    e.currentTarget.style.backgroundColor = colors.bgTertiary;
                    e.currentTarget.style.borderColor = "#3b82f6";
                  }
                }}
                onMouseLeave={(e) => {
                  if (layer.filter !== filter.value) {
                    e.currentTarget.style.backgroundColor = colors.bgSecondary;
                    e.currentTarget.style.borderColor = colors.border;
                  }
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: "600" }}>
                  {filter.name}
                </div>
              </button>
            ))}
          </div>
        )}
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

      {/* Animation */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>ANIMATION</div>

        <div style={styles.formGroupCompact}>
          <label style={styles.label}>Entrance</label>
          <select
            style={styles.select}
            value={layer.animation?.entrance || "fade"}
            onChange={(e) =>
              onUpdate(layer.id, {
                animation: { ...layer.animation, entrance: e.target.value as any },
              })
            }
          >
            <option value="none">None</option>
            <option value="fade">Fade In</option>
            <option value="slideUp">Slide Up</option>
            <option value="slideDown">Slide Down</option>
            <option value="scale">Scale In</option>
          </select>
        </div>
      </div>

      {/* Delete Button */}
      <div style={styles.section}>
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
          {/* {EditorIcons.trash} */}
          Delete Layer
        </button>
      </div>
    </div>
  );
};