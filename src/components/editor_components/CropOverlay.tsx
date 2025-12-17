import React, { useState, useRef, useCallback, useEffect } from "react";
import type { ImageLayer } from "../remotion_compositions/DynamicLayerComposition";

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
// HELPER: Get coordinates from mouse or touch event
// ============================================================================

const getEventCoordinates = (e: MouseEvent | TouchEvent): { clientX: number; clientY: number } => {
  if ("touches" in e) {
    // Touch event - use touches for move, changedTouches for end
    const touch = e.touches[0] || e.changedTouches[0];
    return {
      clientX: touch?.clientX ?? 0,
      clientY: touch?.clientY ?? 0,
    };
  }
  // Mouse event
  return {
    clientX: e.clientX,
    clientY: e.clientY,
  };
};

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

  // Handle mouse/touch down on resize handles
  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent, handle: ResizeHandle) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Get coordinates from mouse or touch
      const { clientX, clientY } = "touches" in e 
        ? { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }
        : { clientX: e.clientX, clientY: e.clientY };
      
      setIsDragging(true);
      setDragHandle(handle);
      setDragStart({ x: clientX, y: clientY });
      setInitialCrop(crop);
    },
    [crop]
  );

  // Handle mouse/touch move for dragging
  useEffect(() => {
    if (!isDragging || !dragHandle) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      // Prevent scrolling on mobile
      e.preventDefault();
      
      const { clientX, clientY } = getEventCoordinates(e);
      
      const deltaX = clientX - dragStart.x;
      const deltaY = clientY - dragStart.y;

      // Convert to percentage
      const deltaXPercent = (deltaX / rendered.width) * 100;
      const deltaYPercent = (deltaY / rendered.height) * 100;

      const newCrop = { ...initialCrop };

      switch (dragHandle) {
        case "move":
          newCrop.x = Math.max(0, Math.min(100 - initialCrop.width, initialCrop.x + deltaXPercent));
          newCrop.y = Math.max(0, Math.min(100 - initialCrop.height, initialCrop.y + deltaYPercent));
          break;

        case "nw":
          newCrop.x = Math.max(0, Math.min(initialCrop.x + initialCrop.width - 10, initialCrop.x + deltaXPercent));
          newCrop.y = Math.max(0, Math.min(initialCrop.y + initialCrop.height - 10, initialCrop.y + deltaYPercent));
          newCrop.width = Math.max(10, initialCrop.width - deltaXPercent);
          newCrop.height = Math.max(10, initialCrop.height - deltaYPercent);
          break;

        case "ne":
          newCrop.y = Math.max(0, Math.min(initialCrop.y + initialCrop.height - 10, initialCrop.y + deltaYPercent));
          newCrop.width = Math.max(10, Math.min(100 - initialCrop.x, initialCrop.width + deltaXPercent));
          newCrop.height = Math.max(10, initialCrop.height - deltaYPercent);
          break;

        case "sw":
          newCrop.x = Math.max(0, Math.min(initialCrop.x + initialCrop.width - 10, initialCrop.x + deltaXPercent));
          newCrop.width = Math.max(10, initialCrop.width - deltaXPercent);
          newCrop.height = Math.max(10, Math.min(100 - initialCrop.y, initialCrop.height + deltaYPercent));
          break;

        case "se":
          newCrop.width = Math.max(10, Math.min(100 - initialCrop.x, initialCrop.width + deltaXPercent));
          newCrop.height = Math.max(10, Math.min(100 - initialCrop.y, initialCrop.height + deltaYPercent));
          break;

        case "n":
          newCrop.y = Math.max(0, Math.min(initialCrop.y + initialCrop.height - 10, initialCrop.y + deltaYPercent));
          newCrop.height = Math.max(10, initialCrop.height - deltaYPercent);
          break;

        case "s":
          newCrop.height = Math.max(10, Math.min(100 - initialCrop.y, initialCrop.height + deltaYPercent));
          break;

        case "e":
          newCrop.width = Math.max(10, Math.min(100 - initialCrop.x, initialCrop.width + deltaXPercent));
          break;

        case "w":
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

    const handleEnd = () => {
      setIsDragging(false);
      setDragHandle(null);
    };

    // Add listeners with { passive: false } to allow preventDefault
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleEnd);
    document.addEventListener("touchcancel", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
      document.removeEventListener("touchcancel", handleEnd);
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
      touchAction: "none",
      zIndex: 1000,
      userSelect: "none",
      WebkitUserSelect: "none",
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
      touchAction: "none",
      userSelect: "none",
      WebkitUserSelect: "none",
    },
    handle: {
      position: "absolute",
      width: "20px",  // Larger for mobile
      height: "20px", // Larger for mobile
      backgroundColor: "#3b82f6",
      border: "2px solid white",
      borderRadius: "50%",
      pointerEvents: "all",
      touchAction: "none",
      zIndex: 10,
      userSelect: "none",
      WebkitUserSelect: "none",
    },
    edgeHandle: {
      position: "absolute",
      backgroundColor: "#3b82f6",
      border: "1px solid white",
      borderRadius: "2px",
      pointerEvents: "all",
      touchAction: "none",
      zIndex: 10,
      userSelect: "none",
      WebkitUserSelect: "none",
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
      padding: "10px 16px", // Larger for mobile
      backgroundColor: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      touchAction: "manipulation",
      userSelect: "none",
      WebkitUserSelect: "none",
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
        onMouseDown={(e) => handlePointerDown(e, "move")}
        onTouchStart={(e) => handlePointerDown(e, "move")}
      >
        {/* Corner handles - larger touch targets */}
        <div
          style={{ ...styles.handle, top: "-10px", left: "-10px", cursor: "nwse-resize" }}
          onMouseDown={(e) => handlePointerDown(e, "nw")}
          onTouchStart={(e) => handlePointerDown(e, "nw")}
        />
        <div
          style={{ ...styles.handle, top: "-10px", right: "-10px", cursor: "nesw-resize" }}
          onMouseDown={(e) => handlePointerDown(e, "ne")}
          onTouchStart={(e) => handlePointerDown(e, "ne")}
        />
        <div
          style={{ ...styles.handle, bottom: "-10px", left: "-10px", cursor: "nesw-resize" }}
          onMouseDown={(e) => handlePointerDown(e, "sw")}
          onTouchStart={(e) => handlePointerDown(e, "sw")}
        />
        <div
          style={{ ...styles.handle, bottom: "-10px", right: "-10px", cursor: "nwse-resize" }}
          onMouseDown={(e) => handlePointerDown(e, "se")}
          onTouchStart={(e) => handlePointerDown(e, "se")}
        />

        {/* Edge handles - larger for mobile */}
        <div
          style={{
            ...styles.edgeHandle,
            top: "-6px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "50px",
            height: "12px",
            cursor: "ns-resize",
          }}
          onMouseDown={(e) => handlePointerDown(e, "n")}
          onTouchStart={(e) => handlePointerDown(e, "n")}
        />
        <div
          style={{
            ...styles.edgeHandle,
            bottom: "-6px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "50px",
            height: "12px",
            cursor: "ns-resize",
          }}
          onMouseDown={(e) => handlePointerDown(e, "s")}
          onTouchStart={(e) => handlePointerDown(e, "s")}
        />
        <div
          style={{
            ...styles.edgeHandle,
            left: "-6px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "12px",
            height: "50px",
            cursor: "ew-resize",
          }}
          onMouseDown={(e) => handlePointerDown(e, "w")}
          onTouchStart={(e) => handlePointerDown(e, "w")}
        />
        <div
          style={{
            ...styles.edgeHandle,
            right: "-6px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "12px",
            height: "50px",
            cursor: "ew-resize",
          }}
          onMouseDown={(e) => handlePointerDown(e, "e")}
          onTouchStart={(e) => handlePointerDown(e, "e")}
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