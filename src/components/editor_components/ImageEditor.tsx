import React, { useState } from "react";
import { getThemedEditorStyles } from "../../styles/themedEditorStyles";
import type { ImageLayer } from "../remotion_compositions/DynamicLayerComposition";
import { FPS } from "../../data/editor_constants";
import { useTheme } from "../../contexts/ThemeContext";

interface ImageEditorProps {
  layer: ImageLayer;
  totalFrames: number;
  onUpdate: (layerId: string, updates: Partial<ImageLayer>) => void;
  onDelete: (layerId: string) => void;
  onReplace: () => void; 
  isMobile?: boolean;
}

/**
 * ============================================================================
 * IMAGE EDITOR WITH REAL PHOTO PREVIEWS
 * Desktop now uses same grid layouts as mobile - no dropdowns!
 * ============================================================================
 */
export const ImageEditor: React.FC<ImageEditorProps> = ({
  layer,
  totalFrames,
  onUpdate,
  onDelete,
  onReplace,
  isMobile = false,
}) => {
  const { colors } = useTheme();
  const styles = getThemedEditorStyles(colors);
  
  const [showFilters, setShowFilters] = useState(false);
  const [activeSection, setActiveSection] = useState<"layout" | "filters" | "animation" | "adjust">("layout");

  const duration = Math.round((layer.endFrame - layer.startFrame) / FPS);

  const LAYOUTS = [
    { name: "Full", icon: "⬜", position: { x: 50, y: 50 }, size: { width: 100, height: 100 } },
    { name: "Top", icon: "⬆️", position: { x: 50, y: 25 }, size: { width: 100, height: 50 } },
    { name: "Bottom", icon: "⬇️", position: { x: 50, y: 75 }, size: { width: 100, height: 50 } },
    { name: "Left", icon: "⬅️", position: { x: 25, y: 50 }, size: { width: 50, height: 100 } },
    { name: "Right", icon: "➡️", position: { x: 75, y: 50 }, size: { width: 50, height: 100 } },
    { name: "Center", icon: "🎯", position: { x: 50, y: 50 }, size: { width: 70, height: 70 } },
    { name: "Top Left", icon: "↖️", position: { x: 25, y: 25 }, size: { width: 50, height: 50 } },
    { name: "Top Right", icon: "↗️", position: { x: 75, y: 25 }, size: { width: 50, height: 50 } },
    { name: "Bottom Left", icon: "↙️", position: { x: 25, y: 75 }, size: { width: 50, height: 50 } },
    { name: "Bottom Right", icon: "↘️", position: { x: 75, y: 75 }, size: { width: 50, height: 50 } },
  ];

  const FILTERS = [
    { name: "None", value: "none", preview: "🔲" },       
    { name: "B&W", value: "grayscale(100%)", preview: "⬛" },
    { name: "Sepia", value: "sepia(100%)", preview: "🟫" },  
    { name: "Bright", value: "brightness(1.3)", preview: "☀️" },
    { name: "Dark", value: "brightness(0.7)", preview: "🌙" },
    { name: "Contrast", value: "contrast(1.3)", preview: "◾" },
    { name: "Blur", value: "blur(10px)", preview: "💫" },
    { name: "Vintage", value: "sepia(50%) contrast(1.2) brightness(0.9)", preview: "📷" },
    { name: "Warm", value: "sepia(30%) saturate(1.4)", preview: "🔥" },
    { name: "Cool", value: "hue-rotate(180deg) saturate(1.2)", preview: "❄️" },
  ];

  const ANIMATIONS = [
    { name: "None", value: "none" },
    { name: "Fade", value: "fade"},
    { name: "Slide Up", value: "slideUp"},
    { name: "Slide Down", value: "slideDown"},
    { name: "Scale", value: "scale"},
    { name: "Zoom", value: "zoom"},
  ];

  // ========================================
  // COMPACT MOBILE STYLES
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
      padding: "12px",
      paddingBottom: "20px",
    },
    
    // Section header - smaller
    sectionHeader: {
      fontSize: "10px",
      fontWeight: "600",
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "10px",
      marginTop: "16px",
    },
    
    sectionHeaderFirst: {
      marginTop: "0",
    },
    
    // Slider container - compact
    sliderRow: {
      marginBottom: "14px",
    },
    
    sliderTopRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "6px",
    },
    
    sliderLabel: {
      fontSize: "12px",
      fontWeight: "500",
      color: colors.textPrimary,
    },
    
    sliderValue: {
      fontSize: "12px",
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
    
    // Layout preview grid - 5 columns
    layoutGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "6px",
      marginBottom: "12px",
    },
    
    layoutPreviewButton: {
      aspectRatio: "1",
      backgroundColor: colors.bgSecondary,
      border: `2px solid ${colors.border}`,
      borderRadius: "6px",
      overflow: "hidden",
      cursor: "pointer",
      transition: "all 0.2s",
      position: "relative",
      padding: "3px",
    },
    
    layoutPreviewButtonActive: {
      backgroundColor: colors.accent + "20",
      borderColor: colors.accent,
      borderWidth: "2px",
    },
    
    layoutPreviewContainer: {
      position: "relative",
      width: "100%",
      height: "100%",
      backgroundColor: "#0a0a0a",
      borderRadius: "3px",
      overflow: "hidden",
    },
    
    layoutLabel: {
      position: "absolute",
      bottom: "0",
      left: "0",
      right: "0",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      color: "white",
      fontSize: "8px",
      fontWeight: "600",
      padding: "3px 2px",
      textAlign: "center",
    },
    
    // Object fit preview grid - 5 columns
    objectFitGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "6px",
      marginBottom: "12px",
    },
    
    objectFitButton: {
      aspectRatio: "1",
      backgroundColor: colors.bgSecondary,
      border: `2px solid ${colors.border}`,
      borderRadius: "6px",
      overflow: "hidden",
      cursor: "pointer",
      transition: "all 0.2s",
      position: "relative",
      padding: "3px",
    },
    
    objectFitButtonActive: {
      backgroundColor: colors.accent + "20",
      borderColor: colors.accent,
      borderWidth: "2px",
    },
    
    objectFitPreviewContainer: {
      width: "100%",
      height: "100%",
      backgroundColor: "#0a0a0a",
      borderRadius: "3px",
      overflow: "hidden",
    },
    
    objectFitLabel: {
      position: "absolute",
      bottom: "0",
      left: "0",
      right: "0",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      color: "white",
      fontSize: "8px",
      fontWeight: "600",
      padding: "3px 2px",
      textAlign: "center",
    },
    
    // Filter grid - 5 columns
    filterGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "6px",
      marginBottom: "12px",
    },
    
    filterButton: {
      aspectRatio: "1",
      backgroundColor: colors.bgSecondary,
      border: `2px solid ${colors.border}`,
      borderRadius: "6px",
      overflow: "hidden",
      cursor: "pointer",
      transition: "all 0.2s",
      position: "relative",
      padding: "0",
    },
    
    filterButtonActive: {
      backgroundColor: colors.accent + "20",
      borderColor: colors.accent,
      borderWidth: "2px",
    },
    
    filterLabel: {
      position: "absolute",
      bottom: "0",
      left: "0",
      right: "0",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      color: "white",
      fontSize: "8px",
      fontWeight: "600",
      padding: "3px 2px",
      textAlign: "center",
    },
    
    // Animation grid - 5 columns with animations
    animationGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "6px",
      marginBottom: "12px",
    },
    
    animationButton: {
      aspectRatio: "1",
      backgroundColor: colors.bgSecondary,
      border: `2px solid ${colors.border}`,
      borderRadius: "6px",
      overflow: "hidden",
      cursor: "pointer",
      transition: "all 0.2s",
      position: "relative",
      padding: "0",
    },
    
    animationButtonActive: {
      backgroundColor: colors.accent + "20",
      borderColor: colors.accent,
      borderWidth: "2px",
    },
    
    animationPreviewImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      position: "absolute",
      top: 0,
      left: 0,
    },
    
    animationIcon: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "20px",
      textShadow: "0 0 8px rgba(0,0,0,0.8)",
      zIndex: 2,
    },
    
    animationLabel: {
      position: "absolute",
      bottom: "0",
      left: "0",
      right: "0",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      color: "white",
      fontSize: "8px",
      fontWeight: "600",
      padding: "3px 2px",
      textAlign: "center",
      zIndex: 2,
    },
    
    // Action buttons - compact
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      color: colors.textPrimary,
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      marginBottom: "8px",
      transition: "all 0.2s",
    },
    
    buttonDanger: {
      backgroundColor: "#dc262615",
      borderColor: "#dc2626",
      color: "#dc2626",
    },
  };

  const isLayoutActive = (layout: typeof LAYOUTS[0]) => {
    return (
      layer.position?.x === layout.position.x &&
      layer.position?.y === layout.position.y &&
      layer.size?.width === layout.size.width &&
      layer.size?.height === layout.size.height
    );
  };

  // Helper to render layout preview (used by both mobile and desktop)
  const renderLayoutPreview = (layout: typeof LAYOUTS[0]) => {
    const imageStyle: React.CSSProperties = {
      position: "absolute",
      left: `${layout.position.x}%`,
      top: `${layout.position.y}%`,
      width: `${layout.size.width}%`,
      height: `${layout.size.height}%`,
      transform: "translate(-50%, -50%)",
      objectFit: "cover",
    };

    return (
      <div
        key={layout.name}
        style={{
          ...mobileStyles.layoutPreviewButton,
          ...(isLayoutActive(layout) ? mobileStyles.layoutPreviewButtonActive : {}),
        }}
        onClick={() => {
          onUpdate(layer.id, {
            position: layout.position,
            size: layout.size,
            objectFit: "cover",
          });
        }}
      >
        <div style={mobileStyles.layoutPreviewContainer}>
          <img
            src={layer.src}
            alt={layout.name}
            style={imageStyle}
          />
        </div>
        <div style={mobileStyles.layoutLabel}>{layout.name}</div>
      </div>
    );
  };

  // Helper to render object fit preview (used by both mobile and desktop)
  const renderObjectFitPreview = (fitValue: string, fitName: string) => {
    return (
      <div
        key={fitValue}
        style={{
          ...mobileStyles.objectFitButton,
          ...(layer.objectFit === fitValue ? mobileStyles.objectFitButtonActive : {}),
        }}
        onClick={() => onUpdate(layer.id, { objectFit: fitValue as any })}
      >
        <div style={mobileStyles.objectFitPreviewContainer}>
          <img
            src={layer.src}
            alt={fitName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: fitValue as any,
            }}
          />
        </div>
        <div style={mobileStyles.objectFitLabel}>{fitName}</div>
      </div>
    );
  };

  // ========================================
  // DESKTOP LAYOUT (NOW WITH SAME GRIDS AS MOBILE!)
  // ========================================
  if (!isMobile) {
    return (
      <div style={{...styles.container, overflow: "auto", height: "100%", paddingBottom: "80px"}}>
        <div style={styles.section}>
          <button
            style={styles.buttonSecondary}
            onClick={onReplace}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.bgHover;
              e.currentTarget.style.borderColor = colors.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.bgSecondary;
              e.currentTarget.style.borderColor = colors.border;
            }}
          >
            Replace Image
          </button>
        </div>
        
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

        {/* QUICK LAYOUT - Grid with photo previews like mobile */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>QUICK LAYOUT</div>
          <div style={mobileStyles.layoutGrid}>
            {LAYOUTS.map(renderLayoutPreview)}
          </div>
        </div>

        {/* OBJECT FIT - Grid with photo previews like mobile */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>OBJECT FIT</div>
          <div style={mobileStyles.objectFitGrid}>
            {renderObjectFitPreview("cover", "Cover")}
            {renderObjectFitPreview("contain", "Contain")}
            {renderObjectFitPreview("fill", "Fill")}
            {renderObjectFitPreview("none", "None")}
            {renderObjectFitPreview("scale-down", "Scale Down")}
          </div>
        </div>

        {/* DISPLAY - Opacity slider */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>DISPLAY</div>
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

        {/* TRANSFORM - Rotation */}
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

        {/* FILTERS - Grid with photo previews */}
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px" }}>
              {FILTERS.map((filter) => (
                <div
                  key={filter.value}
                  style={{
                    ...mobileStyles.filterButton,
                    ...(layer.filter === filter.value ? mobileStyles.filterButtonActive : {}),
                  }}
                  onClick={() => onUpdate(layer.id, { filter: filter.value })}
                >
                  <img
                    src={layer.src}
                    alt={filter.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: filter.value === "none" ? "none" : filter.value,
                    }}
                  />
                  <div style={mobileStyles.filterLabel}>{filter.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ANIMATION - Grid with animated photo previews like mobile */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>ANIMATION</div>
          <div style={mobileStyles.animationGrid}>
            {ANIMATIONS.map((anim) => {
              const animationClass = `anim-preview-${anim.value}`;
              
              return (
                <div
                  key={anim.value}
                  style={{
                    ...mobileStyles.animationButton,
                    ...(layer.animation?.entrance === anim.value ? mobileStyles.animationButtonActive : {}),
                  }}
                  onClick={() =>
                    onUpdate(layer.id, {
                      animation: { ...layer.animation, entrance: anim.value as any },
                    })
                  }
                >
                  <img
                    src={layer.src}
                    alt={anim.name}
                    className={animationClass}
                    style={mobileStyles.animationPreviewImage}
                  />
                  <div style={mobileStyles.animationLabel}>{anim.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DELETE BUTTON */}
        <div style={{...styles.section, marginBottom: "40px"}}>
          <button
            style={styles.deleteButton}
            onClick={() => {
              if (window.confirm("Delete this image layer?")) {
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
  }

  // ========================================
  // VERTICAL LIST MOBILE LAYOUT
  // ========================================
  return (
    <div style={mobileStyles.container}>
      {/* TOP TABS */}
      <div style={mobileStyles.topBar}>
        {[
          { id: "layout", label: "Layout" },
          { id: "filters", label: "Filters" },
          { id: "animation", label: "Animation" },
          { id: "adjust", label: "Adjust" },
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
        
        {/* ===== LAYOUT TAB ===== */}
        {activeSection === "layout" && (
          <>
            {/* QUICK LAYOUT with photo previews */}
            <div style={{ ...mobileStyles.sectionHeader, ...mobileStyles.sectionHeaderFirst }}>
              QUICK LAYOUT
            </div>
            <div style={mobileStyles.layoutGrid}>
              {LAYOUTS.map(renderLayoutPreview)}
            </div>

            {/* OBJECT FIT with photo previews */}
            <div style={mobileStyles.sectionHeader}>OBJECT FIT</div>
            <div style={mobileStyles.objectFitGrid}>
              {renderObjectFitPreview("cover", "Cover")}
              {renderObjectFitPreview("contain", "Contain")}
              {renderObjectFitPreview("fill", "Fill")}
              {renderObjectFitPreview("none", "None")}
              {renderObjectFitPreview("scale-down", "Scale Down")}
            </div>
          </>
        )}

        {/* ===== FILTERS TAB ===== */}
        {activeSection === "filters" && (
          <>
            <div style={{ ...mobileStyles.sectionHeader, ...mobileStyles.sectionHeaderFirst }}>
              FILTERS
            </div>
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
                  <img
                    src={layer.src}
                    alt={filter.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: filter.value === "none" ? "none" : filter.value,
                    }}
                  />
                  <div style={mobileStyles.filterLabel}>{filter.name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===== ANIMATION TAB ===== */}
        {activeSection === "animation" && (
          <>
            <div style={{ ...mobileStyles.sectionHeader, ...mobileStyles.sectionHeaderFirst }}>
              ENTRANCE ANIMATION
            </div>
            <div style={mobileStyles.animationGrid}>
              {ANIMATIONS.map((anim) => {
                const animationClass = `anim-preview-${anim.value}`;
                
                return (
                  <div
                    key={anim.value}
                    style={{
                      ...mobileStyles.animationButton,
                      ...(layer.animation?.entrance === anim.value ? mobileStyles.animationButtonActive : {}),
                    }}
                    onClick={() =>
                      onUpdate(layer.id, {
                        animation: { ...layer.animation, entrance: anim.value as any },
                      })
                    }
                  >
                    <img
                      src={layer.src}
                      alt={anim.name}
                      className={animationClass}
                      style={mobileStyles.animationPreviewImage}
                    />
                    <div style={mobileStyles.animationLabel}>{anim.name}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ===== ADJUST TAB ===== */}
        {activeSection === "adjust" && (
          <>
            {/* OPACITY */}
            <div style={{ ...mobileStyles.sectionHeader, ...mobileStyles.sectionHeaderFirst }}>
              OPACITY
            </div>
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

            {/* ROTATION */}
            <div style={mobileStyles.sectionHeader}>ROTATION</div>
            <div style={mobileStyles.sliderRow}>
              <div style={mobileStyles.sliderTopRow}>
                <span style={mobileStyles.sliderLabel}>Rotation</span>
                <span style={mobileStyles.sliderValue}>{layer.rotation}°</span>
              </div>
              <input
                type="range"
                style={mobileStyles.sliderInput}
                min="0"
                max="360"
                value={layer.rotation}
                onChange={(e) => onUpdate(layer.id, { rotation: parseInt(e.target.value) })}
              />
            </div>

            {/* DURATION */}
            <div style={mobileStyles.sectionHeader}>DURATION</div>
            <div style={mobileStyles.sliderRow}>
              <div style={mobileStyles.sliderTopRow}>
                <span style={mobileStyles.sliderLabel}>Duration</span>
                <span style={mobileStyles.sliderValue}>{duration}s</span>
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

            {/* ACTIONS */}
            <div style={mobileStyles.sectionHeader}>ACTIONS</div>
            
            <button style={mobileStyles.button} onClick={onReplace}>
              Replace Image
            </button>

            <button
              style={{
                ...mobileStyles.button,
                ...mobileStyles.buttonDanger,
              }}
              onClick={() => {
                if (window.confirm("Delete this image layer?")) {
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
        
        /* Animation Previews */
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes slideUpIn {
          0% { 
            opacity: 0;
            transform: translateY(20px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDownIn {
          0% { 
            opacity: 0;
            transform: translateY(-20px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          0% { 
            opacity: 0;
            transform: scale(0.5);
          }
          100% { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes zoomIn {
          0% { 
            opacity: 0;
            transform: scale(1.5);
          }
          100% { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Apply animations to preview images */
        .anim-preview-none {
          opacity: 1;
        }
        
        .anim-preview-fade {
          animation: fadeIn 2s ease-in-out infinite;
        }
        
        .anim-preview-slideUp {
          animation: slideUpIn 2s ease-in-out infinite;
        }
        
        .anim-preview-slideDown {
          animation: slideDownIn 2s ease-in-out infinite;
        }
        
        .anim-preview-scale {
          animation: scaleIn 2s ease-in-out infinite;
        }
        
        .anim-preview-zoom {
          animation: zoomIn 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};