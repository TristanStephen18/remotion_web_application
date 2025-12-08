import React, { useState, useRef, useCallback, useEffect } from "react";
import type { ImageLayer } from "../remotion_compositions//DynamicLayerComposition";

// ============================================================================
// TYPES
// ============================================================================

export interface CropData {
  x: number;      // Left position as percentage (0-100)
  y: number;      // Top position as percentage (0-100)
  width: number;  // Width as percentage (0-100)
  height: number; // Height as percentage (0-100)
}

interface CropOverlayProps {
  layer: ImageLayer;
  containerWidth: number;
  containerHeight: number;
  compositionWidth: number;
  compositionHeight: number;
  onCropChange: (crop: CropData) => void;
  onCropComplete: () => void;
}

type ResizeHandle = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | "move" | null;

// ============================================================================
// CROP OVERLAY COMPONENT
// ============================================================================

export const CropOverlay: React.FC<CropOverlayProps> = ({
  layer,
  containerWidth,
  containerHeight,
  compositionWidth,
  compositionHeight,
  onCropChange,
  onCropComplete,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Initialize crop area (default to full image)
  const [crop, setCrop] = useState<CropData>(
    layer.crop || { x: 0, y: 0, width: 100, height: 100 }
  );
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<ResizeHandle>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialCrop, setInitialCrop] = useState<CropData>(crop);

  // Calculate actual rendered dimensions (accounting for aspect ratio)
  const calculateRenderedDimensions = useCallback(() => {
    const containerAspect = containerWidth / containerHeight;
    const compositionAspect = compositionWidth / compositionHeight;

    let renderedWidth: number;
    let renderedHeight: number;
    let offsetX = 0;
    let offsetY = 0;

    if (containerAspect > compositionAspect) {
      renderedHeight = containerHeight;
      renderedWidth = renderedHeight * compositionAspect;
      offsetX = (containerWidth - renderedWidth) / 2;
    } else {
      renderedWidth = containerWidth;
      renderedHeight = renderedWidth / compositionAspect;
      offsetY = (containerHeight - renderedHeight) / 2;
    }

    return { width: renderedWidth, height: renderedHeight, offsetX, offsetY };
  }, [containerWidth, containerHeight, compositionWidth, compositionHeight]);

  const rendered = calculateRenderedDimensions();

  // Convert percentage to pixels
  const cropToPixels = useCallback((c: CropData) => {
    return {
      x: rendered.offsetX + (c.x / 100) * rendered.width,
      y: rendered.offsetY + (c.y / 100) * rendered.height,
      width: (c.width / 100) * rendered.width,
      height: (c.height / 100) * rendered.height,
    };
  }, [rendered]);


  // Handle mouse down on resize handles
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, handle: ResizeHandle) => {
      e.preventDefault();
      e.stopPropagation();
      
      setIsDragging(true);
      setDragHandle(handle);
      setDragStart({ x: e.clientX, y: e.clientY });
      setInitialCrop(crop);
    },
    [crop]
  );

  // Handle mouse move for dragging
  useEffect(() => {
    if (!isDragging || !dragHandle) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      // Convert to percentage
      const deltaXPercent = (deltaX / rendered.width) * 100;
      const deltaYPercent = (deltaY / rendered.height) * 100;

      let newCrop = { ...initialCrop };

      switch (dragHandle) {
        case "move":
          // Move entire crop area
          newCrop.x = Math.max(0, Math.min(100 - initialCrop.width, initialCrop.x + deltaXPercent));
          newCrop.y = Math.max(0, Math.min(100 - initialCrop.height, initialCrop.y + deltaYPercent));
          break;

        case "nw":
          // Resize from top-left corner
          newCrop.x = Math.max(0, Math.min(initialCrop.x + initialCrop.width - 10, initialCrop.x + deltaXPercent));
          newCrop.y = Math.max(0, Math.min(initialCrop.y + initialCrop.height - 10, initialCrop.y + deltaYPercent));
          newCrop.width = Math.max(10, initialCrop.width - deltaXPercent);
          newCrop.height = Math.max(10, initialCrop.height - deltaYPercent);
          break;

        case "ne":
          // Resize from top-right corner
          newCrop.y = Math.max(0, Math.min(initialCrop.y + initialCrop.height - 10, initialCrop.y + deltaYPercent));
          newCrop.width = Math.max(10, Math.min(100 - initialCrop.x, initialCrop.width + deltaXPercent));
          newCrop.height = Math.max(10, initialCrop.height - deltaYPercent);
          break;

        case "sw":
          // Resize from bottom-left corner
          newCrop.x = Math.max(0, Math.min(initialCrop.x + initialCrop.width - 10, initialCrop.x + deltaXPercent));
          newCrop.width = Math.max(10, initialCrop.width - deltaXPercent);
          newCrop.height = Math.max(10, Math.min(100 - initialCrop.y, initialCrop.height + deltaYPercent));
          break;

        case "se":
          // Resize from bottom-right corner
          newCrop.width = Math.max(10, Math.min(100 - initialCrop.x, initialCrop.width + deltaXPercent));
          newCrop.height = Math.max(10, Math.min(100 - initialCrop.y, initialCrop.height + deltaYPercent));
          break;

        case "n":
          // Resize from top edge
          newCrop.y = Math.max(0, Math.min(initialCrop.y + initialCrop.height - 10, initialCrop.y + deltaYPercent));
          newCrop.height = Math.max(10, initialCrop.height - deltaYPercent);
          break;

        case "s":
          // Resize from bottom edge
          newCrop.height = Math.max(10, Math.min(100 - initialCrop.y, initialCrop.height + deltaYPercent));
          break;

        case "e":
          // Resize from right edge
          newCrop.width = Math.max(10, Math.min(100 - initialCrop.x, initialCrop.width + deltaXPercent));
          break;

        case "w":
          // Resize from left edge
          newCrop.x = Math.max(0, Math.min(initialCrop.x + initialCrop.width - 10, initialCrop.x + deltaXPercent));
          newCrop.width = Math.max(10, initialCrop.width - deltaXPercent);
          break;
      }

      // Ensure crop stays within bounds
      if (newCrop.x + newCrop.width > 100) {
        newCrop.width = 100 - newCrop.x;
      }
      if (newCrop.y + newCrop.height > 100) {
        newCrop.height = 100 - newCrop.y;
      }

      setCrop(newCrop);
      onCropChange(newCrop);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragHandle(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragHandle, dragStart, initialCrop, rendered, onCropChange]);

  const cropPx = cropToPixels(crop);

  // ============================================================================
  // STYLES
  // ============================================================================

  const styles: Record<string, React.CSSProperties> = {
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "all",
      zIndex: 1000,
    },
    darkOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      pointerEvents: "none",
    },
    cropArea: {
      position: "absolute",
      left: `${cropPx.x}px`,
      top: `${cropPx.y}px`,
      width: `${cropPx.width}px`,
      height: `${cropPx.height}px`,
      border: "2px solid #3b82f6",
      boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.6)",
      cursor: isDragging && dragHandle === "move" ? "grabbing" : "move",
      pointerEvents: "all",
    },
    handle: {
      position: "absolute",
      width: "12px",
      height: "12px",
      backgroundColor: "#3b82f6",
      border: "2px solid white",
      borderRadius: "50%",
      pointerEvents: "all",
      zIndex: 10,
    },
    edgeHandle: {
      position: "absolute",
      backgroundColor: "#3b82f6",
      border: "1px solid white",
      borderRadius: "2px",
      pointerEvents: "all",
      zIndex: 10,
    },
    toolbar: {
      position: "absolute",
      top: `${cropPx.y - 50}px`,
      left: `${cropPx.x}px`,
      display: "flex",
      gap: "8px",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: "8px 12px",
      borderRadius: "6px",
      zIndex: 1001,
    },
    toolbarButton: {
      padding: "6px 12px",
      backgroundColor: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600",
    },
    cropInfo: {
      position: "absolute",
      bottom: `${containerHeight - cropPx.y}px`,
      left: `${cropPx.x}px`,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      color: "white",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "11px",
      fontFamily: "monospace",
      pointerEvents: "none",
      zIndex: 1001,
    },
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div ref={overlayRef} style={styles.overlay}>
      {/* Crop area with border and shadow overlay */}
      <div
        style={styles.cropArea}
        onMouseDown={(e) => handleMouseDown(e, "move")}
      >
        {/* Corner handles */}
        <div
          style={{ ...styles.handle, top: "-6px", left: "-6px", cursor: "nwse-resize" }}
          onMouseDown={(e) => handleMouseDown(e, "nw")}
        />
        <div
          style={{ ...styles.handle, top: "-6px", right: "-6px", cursor: "nesw-resize" }}
          onMouseDown={(e) => handleMouseDown(e, "ne")}
        />
        <div
          style={{ ...styles.handle, bottom: "-6px", left: "-6px", cursor: "nesw-resize" }}
          onMouseDown={(e) => handleMouseDown(e, "sw")}
        />
        <div
          style={{ ...styles.handle, bottom: "-6px", right: "-6px", cursor: "nwse-resize" }}
          onMouseDown={(e) => handleMouseDown(e, "se")}
        />

        {/* Edge handles */}
        <div
          style={{
            ...styles.edgeHandle,
            top: "-4px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "40px",
            height: "8px",
            cursor: "ns-resize",
          }}
          onMouseDown={(e) => handleMouseDown(e, "n")}
        />
        <div
          style={{
            ...styles.edgeHandle,
            bottom: "-4px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "40px",
            height: "8px",
            cursor: "ns-resize",
          }}
          onMouseDown={(e) => handleMouseDown(e, "s")}
        />
        <div
          style={{
            ...styles.edgeHandle,
            left: "-4px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "8px",
            height: "40px",
            cursor: "ew-resize",
          }}
          onMouseDown={(e) => handleMouseDown(e, "w")}
        />
        <div
          style={{
            ...styles.edgeHandle,
            right: "-4px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "8px",
            height: "40px",
            cursor: "ew-resize",
          }}
          onMouseDown={(e) => handleMouseDown(e, "e")}
        />

        {/* Grid lines (rule of thirds) */}
        <div style={{
          position: "absolute",
          top: "33.333%",
          left: 0,
          right: 0,
          height: "1px",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          top: "66.666%",
          left: 0,
          right: 0,
          height: "1px",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          left: "33.333%",
          top: 0,
          bottom: 0,
          width: "1px",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          left: "66.666%",
          top: 0,
          bottom: 0,
          width: "1px",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Crop info */}
      {cropPx.y > 30 && (
        <div style={styles.cropInfo}>
          {Math.round(crop.width)}% × {Math.round(crop.height)}%
        </div>
      )}

      {/* Toolbar */}
      {cropPx.y > 60 && (
        <div style={styles.toolbar}>
          <button
            style={styles.toolbarButton}
            onClick={() => {
              setCrop({ x: 0, y: 0, width: 100, height: 100 });
              onCropChange({ x: 0, y: 0, width: 100, height: 100 });
            }}
          >
            Reset
          </button>
          <button
            style={{ ...styles.toolbarButton, backgroundColor: "#10b981" }}
            onClick={onCropComplete}
          >
            Apply Crop
          </button>
        </div>
      )}
    </div>
  );
};

export default CropOverlay;