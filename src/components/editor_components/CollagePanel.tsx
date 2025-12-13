import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export interface CollageLayout {
  id: string;
  name: string;
  description: string;
  slots: CollageSlot[];
  category: "grid" | "creative" | "split" | "polaroid" | "magazine" | "animated";
  animated?: boolean;
  animationConfig?: {
    photoDelay: number;
    photoDuration: number;
    textStartFrame: number;
  };
  textOverlay?: {
    mainText: string;
    subText: string;
    mainFont: string;
    subFont: string;
    mainSize: number;
    subSize: number;
  };
}

export interface CollageSlot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  borderRadius?: number;
  zIndex?: number;
  shadow?: boolean;
  slideDirection?: "left" | "right" | "up" | "down" | "none";
}

interface CollagePanelProps {
  onLayoutSelect?: (layout: CollageLayout) => void;
  selectedLayoutId?: string;
}

export const createAnimatedCollageStoriesLayers = (
  layout: CollageLayout,
  photos: string[],
  videoWidth: number = 1080,
  videoHeight: number = 1920,
  totalDuration: number = 180
): any[] => {
  const layers: any[] = [];
  
  const filledPhotos = [...photos];
  while (filledPhotos.length < layout.slots.length) {
    filledPhotos.push("https://via.placeholder.com/540x960/333333/FFFFFF?text=Photo");
  }

  const config = layout.animationConfig || {
    photoDelay: 8,
    photoDuration: 25,
    textStartFrame: 65,
  };

  layout.slots.forEach((slot, index) => {
    const startFrame = index * config.photoDelay;
    
    layers.push({
      id: `collage-photo-${slot.id}`,
      type: "image",
      name: `Photo ${index + 1}`,
      visible: true,
      locked: false,
      startFrame: startFrame,
      endFrame: totalDuration,
      position: {
        x: (slot.x / 100) * videoWidth,
        y: (slot.y / 100) * videoHeight,
      },
      size: {
        width: (slot.width / 100) * videoWidth,
        height: (slot.height / 100) * videoHeight,
      },
      rotation: slot.rotation || 0,
      opacity: 1,
      src: filledPhotos[index],
      objectFit: "cover" as const,
      animation: {
        entrance: slot.slideDirection === "left" 
          ? "slideLeft" 
          : slot.slideDirection === "right"
          ? "slideRight"
          : "fade",
        entranceDuration: config.photoDuration,
      },
    });
  });

  if (layout.textOverlay) {
    const textOverlay = layout.textOverlay;
    
    layers.push({
      id: "collage-text-main",
      type: "text",
      name: "Main Text",
      visible: true,
      locked: false,
      startFrame: config.textStartFrame,
      endFrame: totalDuration,
      position: {
        x: videoWidth / 2,
        y: videoHeight / 2 - 70,
      },
      size: {
        width: 900,
        height: 250,
      },
      rotation: 0,
      opacity: 1,
      content: textOverlay.mainText,
      fontFamily: textOverlay.mainFont,
      fontSize: textOverlay.mainSize,
      fontColor: "#FFFFFF",
      fontWeight: "bold",
      fontStyle: "normal",
      textAlign: "center" as const,
      lineHeight: 1,
      letterSpacing: 3,
      textTransform: "none" as const,
      textShadow: true,
      shadowColor: "#000000",
      shadowX: 4,
      shadowY: 4,
      shadowBlur: 12,
      textOutline: true,
      outlineColor: "rgba(0, 0, 0, 0.3)",
      animation: {
        entrance: "scale" as const,
        entranceDuration: 20,
      },
    });

    layers.push({
      id: "collage-text-sub",
      type: "text",
      name: "Subtitle",
      visible: true,
      locked: false,
      startFrame: config.textStartFrame + 5,
      endFrame: totalDuration,
      position: {
        x: videoWidth / 2,
        y: videoHeight / 2 + 100,
      },
      size: {
        width: 500,
        height: 120,
      },
      rotation: 0,
      opacity: 0.98,
      content: textOverlay.subText,
      fontFamily: textOverlay.subFont,
      fontSize: textOverlay.subSize,
      fontColor: "#FFFFFF",
      fontWeight: "normal",
      fontStyle: "italic",
      textAlign: "center" as const,
      lineHeight: 1.2,
      letterSpacing: 1,
      textTransform: "none" as const,
      textShadow: true,
      shadowColor: "#000000",
      shadowX: 3,
      shadowY: 3,
      shadowBlur: 10,
      animation: {
        entrance: "fade" as const,
        entranceDuration: 15,
      },
    });
  }

  return layers;
};

const COLLAGE_LAYOUTS: CollageLayout[] = [
  {
    id: "collage-stories-animated",
    name: "Collage Stories",
    description: "Animated 2x3 Instagram style",
    category: "animated",
    animated: true,
    animationConfig: {
      photoDelay: 8,
      photoDuration: 25,
      textStartFrame: 65,
    },
    textOverlay: {
      mainText: "Layout",
      subText: "stories",
      mainFont: "Pacifico, cursive",
      subFont: "Dancing Script, cursive",
      mainSize: 140,
      subSize: 56,
    },
    slots: [
      { id: "top-left", x: 0, y: 0, width: 50, height: 33.33, slideDirection: "left" },
      { id: "top-right", x: 50, y: 0, width: 50, height: 33.33, slideDirection: "right" },
      { id: "middle-left", x: 0, y: 33.33, width: 50, height: 33.33, slideDirection: "left" },
      { id: "middle-right", x: 50, y: 33.33, width: 50, height: 33.33, slideDirection: "right" },
      { id: "bottom-left", x: 0, y: 66.66, width: 50, height: 33.34, slideDirection: "left" },
      { id: "bottom-right", x: 50, y: 66.66, width: 50, height: 33.34, slideDirection: "right" },
    ],
  },

  {
    id: "original-3x2",
    name: "Classic Grid (3x2)",
    description: "6 photos in a horizontal grid",
    category: "grid",
    slots: [
      { id: "top-left", x: 0, y: 0, width: 33.33, height: 33.33 },
      { id: "top-center", x: 33.33, y: 0, width: 33.33, height: 33.33 },
      { id: "top-right", x: 66.66, y: 0, width: 33.34, height: 33.33 },
      { id: "bottom-left", x: 0, y: 66.67, width: 33.33, height: 33.33 },
      { id: "bottom-center", x: 33.33, y: 66.67, width: 33.33, height: 33.33 },
      { id: "bottom-right", x: 66.66, y: 66.67, width: 33.34, height: 33.33 },
    ],
  },

  {
    id: "grid-2x1",
    name: "Split (2x1)",
    description: "Two photos stacked vertically",
    category: "grid",
    slots: [
      { id: "top", x: 0, y: 0, width: 100, height: 50 },
      { id: "bottom", x: 0, y: 50, width: 100, height: 50 },
    ],
  },
  {
    id: "grid-2x2",
    name: "Grid (2x2)",
    description: "Four photos in a square grid",
    category: "grid",
    slots: [
      { id: "tl", x: 0, y: 0, width: 50, height: 25 },
      { id: "tr", x: 50, y: 0, width: 50, height: 25 },
      { id: "bl", x: 0, y: 25, width: 50, height: 25 },
      { id: "br", x: 50, y: 25, width: 50, height: 25 },
    ],
  },
  {
    id: "grid-3x3",
    name: "Grid (3x3)",
    description: "Nine photos in a grid",
    category: "grid",
    slots: [
      { id: "1", x: 0, y: 0, width: 33.33, height: 16.67 },
      { id: "2", x: 33.33, y: 0, width: 33.33, height: 16.67 },
      { id: "3", x: 66.66, y: 0, width: 33.33, height: 16.67 },
      { id: "4", x: 0, y: 16.67, width: 33.33, height: 16.67 },
      { id: "5", x: 33.33, y: 16.67, width: 33.33, height: 16.67 },
      { id: "6", x: 66.66, y: 16.67, width: 33.33, height: 16.67 },
      { id: "7", x: 0, y: 33.34, width: 33.33, height: 16.67 },
      { id: "8", x: 33.33, y: 33.34, width: 33.33, height: 16.67 },
      { id: "9", x: 66.66, y: 33.34, width: 33.33, height: 16.67 },
    ],
  },

  {
    id: "creative-hero",
    name: "Hero Shot",
    description: "One large photo with two smaller ones",
    category: "creative",
    slots: [
      { id: "hero", x: 0, y: 0, width: 100, height: 60 },
      { id: "left", x: 0, y: 60, width: 50, height: 40 },
      { id: "right", x: 50, y: 60, width: 50, height: 40 },
    ],
  },
  {
    id: "creative-spotlight",
    name: "Spotlight",
    description: "Center photo with side panels",
    category: "creative",
    slots: [
      { id: "left", x: 0, y: 0, width: 25, height: 100 },
      { id: "center", x: 25, y: 10, width: 50, height: 80, zIndex: 2, shadow: true },
      { id: "right", x: 75, y: 0, width: 25, height: 100 },
    ],
  },

  {
    id: "split-lr",
    name: "Left-Right Split",
    description: "Two photos side by side",
    category: "split",
    slots: [
      { id: "left", x: 0, y: 0, width: 50, height: 100 },
      { id: "right", x: 50, y: 0, width: 50, height: 100 },
    ],
  },
  {
    id: "split-thirds",
    name: "Thirds Split",
    description: "One large, two small in thirds",
    category: "split",
    slots: [
      { id: "main", x: 0, y: 0, width: 66.66, height: 100 },
      { id: "top", x: 66.66, y: 0, width: 33.34, height: 50 },
      { id: "bottom", x: 66.66, y: 50, width: 33.34, height: 50 },
    ],
  },

  {
    id: "polaroid-classic",
    name: "Classic Polaroid",
    description: "Polaroid style with borders",
    category: "polaroid",
    slots: [
      { id: "photo", x: 12.5, y: 15, width: 75, height: 60, shadow: true, borderRadius: 2 },
      { id: "header", x: 0, y: 0, width: 100, height: 35 },
      { id: "caption", x: 0, y: 75, width: 100, height: 25 },
    ],
  },
  {
    id: "polaroid-stack",
    name: "Stacked Polaroids",
    description: "Three overlapping polaroids",
    category: "polaroid",
    slots: [
      { id: "back", x: 5, y: 10, width: 60, height: 50, rotation: -5, zIndex: 1, shadow: true, borderRadius: 2 },
      { id: "middle", x: 20, y: 25, width: 60, height: 50, rotation: 3, zIndex: 2, shadow: true, borderRadius: 2 },
      { id: "front", x: 35, y: 40, width: 60, height: 50, rotation: -2, zIndex: 3, shadow: true, borderRadius: 2 },
    ],
  },

  {
    id: "magazine-cover",
    name: "Magazine Cover",
    description: "Full bleed with header and footer",
    category: "magazine",
    slots: [
      { id: "hero", x: 0, y: 0, width: 100, height: 100 },
      { id: "header", x: 0, y: 0, width: 100, height: 20 },
      { id: "footer", x: 0, y: 80, width: 100, height: 20 },
    ],
  },
  {
    id: "magazine-feature",
    name: "Feature Story",
    description: "Large image with text area",
    category: "magazine",
    slots: [
      { id: "main", x: 0, y: 0, width: 100, height: 70 },
      { id: "text", x: 0, y: 70, width: 100, height: 30 },
    ],
  },
];

export const CollagePanel: React.FC<CollagePanelProps> = ({
  onLayoutSelect,
  selectedLayoutId,
}) => {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categories = [
    { id: "all", label: "All Layouts" },
    { id: "animated", label: "Animated ⚡" },
    { id: "grid", label: "Grid" },
    { id: "creative", label: "Creative" },
    { id: "split", label: "Split" },
    { id: "polaroid", label: "Polaroid" },
    { id: "magazine", label: "Magazine" },
  ];

  const filteredLayouts =
    selectedCategory === "all"
      ? COLLAGE_LAYOUTS
      : COLLAGE_LAYOUTS.filter((layout) => layout.category === selectedCategory);

  const styles: Record<string, React.CSSProperties> = {
    container: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    header: {
      padding: isMobile ? "12px 16px" : "20px",
      borderBottom: `1px solid ${colors.border}`,
      flexShrink: 0,
    },
    title: {
      fontSize: isMobile ? "16px" : "18px",
      fontWeight: 600,
      color: colors.textPrimary,
      marginBottom: isMobile ? "4px" : "8px",
    },
    subtitle: {
      fontSize: isMobile ? "11px" : "13px",
      color: colors.textSecondary,
      marginBottom: isMobile ? "8px" : "16px",
    },
    categoryButtons: {
      display: "flex",
      gap: isMobile ? "6px" : "8px",
      flexWrap: "wrap",
    },
    categoryButton: {
      padding: isMobile ? "4px 10px" : "6px 12px",
      fontSize: isMobile ? "11px" : "12px",
      fontWeight: 500,
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      backgroundColor: colors.bgSecondary,
      color: colors.textSecondary,
      cursor: "pointer",
      transition: "all 0.2s",
    },
    categoryButtonActive: {
      backgroundColor: colors.accent,
      color: "white",
      borderColor: colors.accent,
    },
    content: {
      flex: 1,
      overflowY: "auto",
      padding: isMobile ? "12px" : "20px",
    },
    layoutGrid: {
      display: "grid",
      gridTemplateColumns: isMobile 
        ? "repeat(auto-fill, minmax(80px, 1fr))" 
        : "repeat(auto-fill, minmax(100px, 1fr))",
      gap: isMobile ? "8px" : "12px",
    },
    layoutCard: {
      position: "relative",
      aspectRatio: "9/16",
      backgroundColor: colors.bgSecondary,
      border: `2px solid ${colors.border}`,
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s",
      overflow: "hidden",
    },
    layoutCardSelected: {
      borderColor: colors.accent,
      boxShadow: `0 0 0 2px ${colors.accent}40`,
    },
    layoutPreview: {
      position: "absolute",
      top: "6px",
      left: "6px",
      right: "6px",
      bottom: "30px",
      backgroundColor: "#000",
      borderRadius: "4px",
      overflow: "hidden",
    },
    slot: {
      position: "absolute",
      backgroundColor: "#444",
      border: "1px solid #666",
    },
    animatedBadge: {
      position: "absolute",
      top: "8px",
      right: "8px",
      backgroundColor: "#ffb800",
      color: "#000",
      padding: "2px 6px",
      borderRadius: "4px",
      fontSize: "10px",
      fontWeight: "bold",
      zIndex: 10,
    },
    layoutInfo: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: "6px",
      backgroundColor: colors.bgPrimary,
      textAlign: "center",
    },
    layoutName: {
      fontSize: "10px",
      fontWeight: 600,
      color: colors.textPrimary,
      marginBottom: "2px",
    },
    layoutDescription: {
      fontSize: "8px",
      color: colors.textMuted,
    },
    previewMainText: {
      position: "absolute",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#FFF",
      textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
      zIndex: 5,
    },
    previewSubText: {
      position: "absolute",
      top: "55%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "10px",
      fontStyle: "italic",
      color: "#FFF",
      textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
      zIndex: 5,
    },
  };

  const renderLayoutPreview = (layout: CollageLayout, isSelected: boolean) => {
    return (
      <div
        key={layout.id}
        style={{
          ...styles.layoutCard,
          ...(isSelected ? styles.layoutCardSelected : {}),
        }}
        onClick={() => onLayoutSelect?.(layout)}
        onMouseOver={(e) => {
          if (!isSelected) {
            e.currentTarget.style.borderColor = colors.accent;
            e.currentTarget.style.transform = "scale(1.05)";
          }
        }}
        onMouseOut={(e) => {
          if (!isSelected) {
            e.currentTarget.style.borderColor = colors.border;
            e.currentTarget.style.transform = "scale(1)";
          }
        }}
      >
        {layout.animated && (
          <div style={styles.animatedBadge}>ANIMATED</div>
        )}

        <div style={styles.layoutPreview}>
          {layout.slots.map((slot) => (
            <div
              key={slot.id}
              style={{
                ...styles.slot,
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                width: `${slot.width}%`,
                height: `${slot.height}%`,
                transform: slot.rotation ? `rotate(${slot.rotation}deg)` : undefined,
                borderRadius: slot.borderRadius ? `${slot.borderRadius}%` : undefined,
                zIndex: slot.zIndex || 1,
                boxShadow: slot.shadow ? "0 4px 8px rgba(0,0,0,0.3)" : undefined,
              }}
            />
          ))}

          {layout.textOverlay && (
            <>
              <div style={styles.previewMainText}>
                {layout.textOverlay.mainText}
              </div>
              <div style={styles.previewSubText}>
                {layout.textOverlay.subText}
              </div>
            </>
          )}
        </div>

        <div style={styles.layoutInfo}>
          <div style={styles.layoutName}>{layout.name}</div>
          <div style={styles.layoutDescription}>{layout.description}</div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Collage Layouts</h2>
        <p style={styles.subtitle}>
          Choose a layout for your photos and videos • ⚡ = Animated
        </p>
        <div style={styles.categoryButtons}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === cat.id
                  ? styles.categoryButtonActive
                  : {}),
              }}
              onClick={() => setSelectedCategory(cat.id)}
              onMouseOver={(e) => {
                if (selectedCategory !== cat.id) {
                  e.currentTarget.style.backgroundColor = colors.bgHover;
                }
              }}
              onMouseOut={(e) => {
                if (selectedCategory !== cat.id) {
                  e.currentTarget.style.backgroundColor = colors.bgSecondary;
                }
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.layoutGrid}>
          {filteredLayouts.map((layout) =>
            renderLayoutPreview(layout, layout.id === selectedLayoutId)
          )}
        </div>
      </div>
    </div>
  );
};

export { COLLAGE_LAYOUTS };
export default CollagePanel;