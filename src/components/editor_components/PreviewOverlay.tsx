import React, { useState, useRef, useCallback, useEffect } from "react";
import type { ElementPosition, ElementPositions } from "../remotion_compositions/QuoteTemplate";

// ============================================================================
// TYPES
// ============================================================================

export type SelectableElement = "quote" | "author" | "quoteMark" | "image" | null;

type DragMode = "move" | "rotate" | "resize" | null;
type ResizeDirection = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | null;

// Extended position with size
export interface ElementPositionWithSize extends ElementPosition {
  width: number;  // percentage width
  height: number; // percentage height
}

export interface ElementPositionsWithSize {
  [key: string]: ElementPositionWithSize;
}

export interface PreviewOverlayProps {
  positions: ElementPositionsWithSize;
  onPositionChange: (
    element: keyof ElementPositions,
    position: Partial<ElementPositionWithSize>
  ) => void;
  selectedElement: SelectableElement;
  onSelectElement: (element: SelectableElement) => void;
  containerWidth: number;
  containerHeight: number;
  compositionWidth?: number;   // NEW: actual composition dimensions
  compositionHeight?: number;  // NEW: actual composition dimensions
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate the actual rendered dimensions of the player within the container
 * The player maintains aspect ratio, so it might not fill the entire container
 */
function calculateRenderedDimensions(
  containerWidth: number,
  containerHeight: number,
  compositionWidth: number,
  compositionHeight: number
): { width: number; height: number; offsetX: number; offsetY: number } {
  const containerAspect = containerWidth / containerHeight;
  const compositionAspect = compositionWidth / compositionHeight;

  let renderedWidth: number;
  let renderedHeight: number;
  let offsetX = 0;
  let offsetY = 0;

  if (containerAspect > compositionAspect) {
    // Container is wider - player will be pillarboxed (black bars on sides)
    renderedHeight = containerHeight;
    renderedWidth = renderedHeight * compositionAspect;
    offsetX = (containerWidth - renderedWidth) / 2;
  } else {
    // Container is taller - player will be letterboxed (black bars on top/bottom)
    renderedWidth = containerWidth;
    renderedHeight = renderedWidth / compositionAspect;
    offsetY = (containerHeight - renderedHeight) / 2;
  }

  return { width: renderedWidth, height: renderedHeight, offsetX, offsetY };
}

// ============================================================================
// PREVIEW OVERLAY COMPONENT
// ============================================================================

export const PreviewOverlay: React.FC<PreviewOverlayProps> = ({
  positions,
  onPositionChange,
  selectedElement,
  onSelectElement,
  containerWidth,
  containerHeight,
  compositionWidth = 1080,   // Default to standard mobile dimensions
  compositionHeight = 1920,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [dragElement, setDragElement] = useState<keyof ElementPositions | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState<ElementPositionWithSize>({ 
    x: 0, y: 0, rotation: 0, scale: 1, width: 0, height: 0 
  });
  
  const [grabOffset, setGrabOffset] = useState({ x: 0, y: 0 });
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(null);

  // Calculate actual rendered dimensions
  const rendered = calculateRenderedDimensions(
    containerWidth,
    containerHeight,
    compositionWidth,
    compositionHeight
  );

  // Element definitions with labels
  const elements: {
    id: keyof ElementPositions;
    label: string;
  }[] = [
    { id: "quoteMark", label: 'Quote Mark "' },
    { id: "quote", label: "Quote Text" },
    { id: "author", label: "Author" },
  ];

  // Handle mouse down for move
  const handleMouseDown = useCallback(
  (e: React.MouseEvent | React.TouchEvent, elementId: keyof ElementPositions) => {
    e.stopPropagation();
    e.preventDefault();

    const pos = positions[elementId];
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Get coordinates from mouse or touch
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    // Calculate element's center in screen coordinates
    const centerX = rect.left + rendered.offsetX + (pos.x / 100) * rendered.width;
    const centerY = rect.top + rendered.offsetY + (pos.y / 100) * rendered.height;

    // Calculate offset from element center to mouse/touch position
    const offsetX = clientX - centerX;
    const offsetY = clientY - centerY;

    setDragMode("move");
    setDragElement(elementId);
    setDragStart({ x: clientX, y: clientY });
    setDragStartPos({ 
      x: pos.x, 
      y: pos.y, 
      rotation: pos.rotation || 0, 
      scale: pos.scale || 1,
      width: pos.width,
      height: pos.height
    });
    
    setGrabOffset({ x: offsetX, y: offsetY });
    onSelectElement(elementId as SelectableElement);
  },
  [positions, onSelectElement, rendered]
);

  // Handle rotation start
  const handleRotateStart = useCallback(
  (e: React.MouseEvent | React.TouchEvent, elementId: keyof ElementPositions) => {
    e.stopPropagation();
    e.preventDefault();

    const pos = positions[elementId];
    
    // Get coordinates from mouse or touch
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDragMode("rotate");
    setDragElement(elementId);
    setDragStart({ x: clientX, y: clientY });
    setDragStartPos({ 
      x: pos.x, 
      y: pos.y, 
      rotation: pos.rotation || 0, 
      scale: pos.scale || 1,
      width: pos.width,
      height: pos.height
    });
    onSelectElement(elementId as SelectableElement);
  },
  [positions, onSelectElement]
);

  // Handle resize start
  const handleResizeStart = useCallback(
  (e: React.MouseEvent | React.TouchEvent, elementId: keyof ElementPositions, direction: ResizeDirection) => {
    e.stopPropagation();
    e.preventDefault();

    const pos = positions[elementId];
    
    // Get coordinates from mouse or touch
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setDragMode("resize");
    setDragElement(elementId);
    setResizeDirection(direction);
    setDragStart({ x: clientX, y: clientY });
    setDragStartPos({ 
      x: pos.x, 
      y: pos.y, 
      rotation: pos.rotation || 0, 
      scale: pos.scale || 1,
      width: pos.width,
      height: pos.height
    });
    onSelectElement(elementId as SelectableElement);
  },
  [positions, onSelectElement]
);

  // Handle mouse move
  useEffect(() => {
  if (!dragMode || !dragElement) return;

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Get coordinates from mouse or touch
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (dragMode === "move") {
      // FIXED: Account for grab offset and rendered dimensions
      const targetCenterX = clientX - grabOffset.x;
      const targetCenterY = clientY - grabOffset.y;

      // Convert to container-relative coordinates (accounting for offset)
      const relativeX = targetCenterX - rect.left - rendered.offsetX;
      const relativeY = targetCenterY - rect.top - rendered.offsetY;

      // Convert to percentage based on RENDERED dimensions
      const newX = (relativeX / rendered.width) * 100;
      const newY = (relativeY / rendered.height) * 100;

      // Apply bounds
      const boundedX = Math.max(0, Math.min(100, newX));
      const boundedY = Math.max(0, Math.min(100, newY));

      onPositionChange(dragElement, { x: boundedX, y: boundedY });
    } else if (dragMode === "rotate") {
      const pos = positions[dragElement];
      const centerX = rect.left + rendered.offsetX + (pos.x / 100) * rendered.width;
      const centerY = rect.top + rendered.offsetY + (pos.y / 100) * rendered.height;

      const angle1 = Math.atan2(dragStart.y - centerY, dragStart.x - centerX);
      const angle2 = Math.atan2(clientY - centerY, clientX - centerX);
      const deltaAngle = ((angle2 - angle1) * 180) / Math.PI;

      const newRotation = (dragStartPos.rotation || 0) + deltaAngle;
      onPositionChange(dragElement, { rotation: newRotation });
    } else if (dragMode === "resize" && resizeDirection) {
      const deltaX = clientX - dragStart.x;
      const deltaY = clientY - dragStart.y;

      const deltaXPercent = (deltaX / rendered.width) * 100;
      const deltaYPercent = (deltaY / rendered.height) * 100;

      let newWidth = dragStartPos.width;
      let newHeight = dragStartPos.height;
      let newX = dragStartPos.x;
      let newY = dragStartPos.y;

      const rotation = (dragStartPos.rotation || 0) * (Math.PI / 180);
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);

      const rotatedDeltaX = deltaXPercent * cos + deltaYPercent * sin;
      const rotatedDeltaY = -deltaXPercent * sin + deltaYPercent * cos;

      switch (resizeDirection) {
        case "se":
          newWidth = Math.max(10, dragStartPos.width + rotatedDeltaX);
          newHeight = Math.max(10, dragStartPos.height + rotatedDeltaY);
          break;
        case "sw":
          newWidth = Math.max(10, dragStartPos.width - rotatedDeltaX);
          newHeight = Math.max(10, dragStartPos.height + rotatedDeltaY);
          newX = dragStartPos.x + (rotatedDeltaX / 2);
          break;
        case "ne":
          newWidth = Math.max(10, dragStartPos.width + rotatedDeltaX);
          newHeight = Math.max(10, dragStartPos.height - rotatedDeltaY);
          newY = dragStartPos.y + (rotatedDeltaY / 2);
          break;
        case "nw":
          newWidth = Math.max(10, dragStartPos.width - rotatedDeltaX);
          newHeight = Math.max(10, dragStartPos.height - rotatedDeltaY);
          newX = dragStartPos.x + (rotatedDeltaX / 2);
          newY = dragStartPos.y + (rotatedDeltaY / 2);
          break;
        case "e":
          newWidth = Math.max(10, dragStartPos.width + rotatedDeltaX);
          break;
        case "w":
          newWidth = Math.max(10, dragStartPos.width - rotatedDeltaX);
          newX = dragStartPos.x + (rotatedDeltaX / 2);
          break;
        case "s":
          newHeight = Math.max(10, dragStartPos.height + rotatedDeltaY);
          break;
        case "n":
          newHeight = Math.max(10, dragStartPos.height - rotatedDeltaY);
          newY = dragStartPos.y + (rotatedDeltaY / 2);
          break;
      }

      onPositionChange(dragElement, {
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
      });
    }
  };

  const handleMouseUp = () => {
    setDragMode(null);
    setDragElement(null);
    setResizeDirection(null);
  };

  // Add both mouse and touch event listeners
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("touchmove", handleMouseMove);
  document.addEventListener("touchend", handleMouseUp);

  return () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("touchmove", handleMouseMove);
    document.removeEventListener("touchend", handleMouseUp);
  };
}, [
  dragMode,
  dragElement, dragStart, dragStartPos, grabOffset, rendered, onPositionChange, positions, resizeDirection]);

  // Deselect when clicking overlay background
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onSelectElement(null);
    }
  }, [onSelectElement]);

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
  pointerEvents: "auto",
  touchAction: "none",
  zIndex: 1000,
},
    elementBox: {
  position: "absolute",
  border: "2px solid rgba(59, 130, 246, 0.6)",
  background: "rgba(59, 130, 246, 0.05)",
  pointerEvents: "auto",
  touchAction: "none",
  transition: dragMode ? "none" : "border-color 0.2s, box-shadow 0.2s",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
},
    elementBoxSelected: {
      border: "2px solid #3b82f6",
      background: "rgba(59, 130, 246, 0.1)",
      boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
    },
    elementLabel: {
      position: "absolute",
      top: -24,
      left: "50%",
      fontSize: "11px",
      fontWeight: 600,
      color: "#3b82f6",
      background: "rgba(255, 255, 255, 0.95)",
      padding: "2px 8px",
      borderRadius: "4px",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      transformOrigin: "center bottom",
      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    },
    rotateLine: {
      position: "absolute",
      top: -30,
      left: "50%",
      width: "2px",
      height: "24px",
      background: "linear-gradient(to bottom, transparent, #10b981)",
      pointerEvents: "none",
      transformOrigin: "bottom center",
    },
    rotateHandle: {
  position: "absolute",
  top: -36,
  left: "50%",
  width: "24px",
  height: "24px",
  background: "white",
  border: "2px solid #10b981",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  touchAction: "none",
  transformOrigin: "center center",
},
    resizeHandle: {
  position: "absolute",
  width: "12px",
  height: "12px",
  background: "white",
  border: "2px solid #3b82f6",
  borderRadius: "50%",
  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
  touchAction: "none",
  transformOrigin: "center center",
},
    edgeHandle: {
  position: "absolute",
  background: "rgba(59, 130, 246, 0.3)",
  border: "1px solid #3b82f6",
  borderRadius: "2px",
  touchAction: "none",
  transformOrigin: "center center",
},
    sizeIndicator: {
      position: "absolute",
      bottom: -24,
      left: "50%",
      fontSize: "10px",
      fontWeight: 500,
      color: "#64748b",
      background: "rgba(255, 255, 255, 0.95)",
      padding: "2px 6px",
      borderRadius: "3px",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      transformOrigin: "center top",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div
  ref={overlayRef}
  style={styles.overlay}
  onClick={handleOverlayClick}
  onTouchStart={(e) => {
    // Prevent scrolling when touching the overlay
    if ((e.target as HTMLElement).closest('[data-draggable]')) {
      e.preventDefault();
    }
  }}
>
      {elements.map((element) => {
        const pos = positions[element.id];
        if (!pos) return null;

        const isSelected = selectedElement === element.id;
        const rotation = pos.rotation || 0;
        const scale = pos.scale || 1;

        // ============================================================================
        // POSITIONING LOGIC - FIXED
        // ============================================================================
        // Convert center percentage to pixels using RENDERED dimensions
        const centerXPx = rendered.offsetX + (pos.x / 100) * rendered.width;
        const centerYPx = rendered.offsetY + (pos.y / 100) * rendered.height;
        
        // Box dimensions in pixels (using rendered dimensions)
        const boxWidthPx = (pos.width / 100) * rendered.width;
        const boxHeightPx = (pos.height / 100) * rendered.height;
        
        // Top-left corner position in pixels
        const leftPx = centerXPx - (boxWidthPx / 2);
        const topPx = centerYPx - (boxHeightPx / 2);
        
        const left = `${leftPx}px`;
        const top = `${topPx}px`;
        const width = `${boxWidthPx}px`;
        const height = `${boxHeightPx}px`;

        const zIndex = isSelected ? 100 : 10;

        return (
  <div
    key={element.id}
    data-draggable="true"
    style={{
      ...styles.elementBox,
      left,
      top,
      width,
      height,
      zIndex,
      ...(isSelected ? styles.elementBoxSelected : {}),
      cursor: dragMode === "move" ? "grabbing" : "move",
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transformOrigin: "center center",
    }}
    onMouseDown={(e) => handleMouseDown(e, element.id)}
    onTouchStart={(e) => handleMouseDown(e, element.id)}
  >
            {/* Label */}
            {isSelected && (
              <span 
                style={{
                  ...styles.elementLabel,
                  transform: `translateX(-50%) rotate(${-rotation}deg) scale(${1/scale})`,
                }}
              >
                {element.label}
              </span>
            )}

            {/* Rotation handle */}
            {isSelected && (
              <>
                <div 
                  style={{
                    ...styles.rotateLine,
                    transform: `translateX(-50%)`,
                  }}
                />
                <div
                  style={{
                    ...styles.rotateHandle,
                    transform: `translateX(-50%) rotate(${-rotation}deg) scale(${1/scale})`,
                    cursor: dragMode === "rotate" ? "grabbing" : "grab",
                  }}
                  onMouseDown={(e) => handleRotateStart(e, element.id)}
onTouchStart={(e) => handleRotateStart(e, element.id)}
                >
                  <svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 4v6h-6M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                  </svg>
                </div>
              </>
            )}

            {/* Corner resize handles */}
            {isSelected && (
              <>
                <div
                  style={{ 
                    ...styles.resizeHandle, 
                    top: -6, 
                    left: -6, 
                    cursor: "nwse-resize",
                    transform: `rotate(${-rotation}deg) scale(${1/scale})`,
                  }}
                  onMouseDown={(e) => handleResizeStart(e, element.id, "nw")}
onTouchStart={(e) => handleResizeStart(e, element.id, "nw")}
                />
                <div
  style={{ 
    ...styles.resizeHandle, 
    top: -6, 
    right: -6, 
    cursor: "nesw-resize",
    transform: `rotate(${-rotation}deg) scale(${1/scale})`,
  }}
  onMouseDown={(e) => handleResizeStart(e, element.id, "ne")}
  onTouchStart={(e) => handleResizeStart(e, element.id, "ne")}
/>
                <div
  style={{ 
    ...styles.resizeHandle, 
    bottom: -6, 
    left: -6, 
    cursor: "nesw-resize",
    transform: `rotate(${-rotation}deg) scale(${1/scale})`,
  }}
  onMouseDown={(e) => handleResizeStart(e, element.id, "sw")}
  onTouchStart={(e) => handleResizeStart(e, element.id, "sw")}
/>
                <div
  style={{ 
    ...styles.resizeHandle, 
    bottom: -6, 
    right: -6, 
    cursor: "nwse-resize",
    transform: `rotate(${-rotation}deg) scale(${1/scale})`,
  }}
  onMouseDown={(e) => handleResizeStart(e, element.id, "se")}
  onTouchStart={(e) => handleResizeStart(e, element.id, "se")}
/>

                {/* Edge handles */}
                <div
  style={{ 
    ...styles.edgeHandle, 
    top: -4, 
    left: "50%",
    width: "30px",
    height: "8px",
    transform: `translateX(-50%) rotate(${-rotation}deg) scale(${1/scale})`,
    cursor: "ns-resize",
  }}
  onMouseDown={(e) => handleResizeStart(e, element.id, "n")}
  onTouchStart={(e) => handleResizeStart(e, element.id, "n")}
/>
                <div
  style={{ 
    ...styles.edgeHandle, 
    bottom: -4, 
    left: "50%",
    width: "30px",
    height: "8px",
    transform: `translateX(-50%) rotate(${-rotation}deg) scale(${1/scale})`,
    cursor: "ns-resize",
  }}
  onMouseDown={(e) => handleResizeStart(e, element.id, "s")}
  onTouchStart={(e) => handleResizeStart(e, element.id, "s")}
/>
                <div
  style={{ 
    ...styles.edgeHandle, 
    left: -4, 
    top: "50%",
    width: "8px",
    height: "30px",
    transform: `translateY(-50%) rotate(${-rotation}deg) scale(${1/scale})`,
    cursor: "ew-resize",
  }}
  onMouseDown={(e) => handleResizeStart(e, element.id, "w")}
  onTouchStart={(e) => handleResizeStart(e, element.id, "w")}
/>
               <div
  style={{ 
    ...styles.edgeHandle, 
    right: -4, 
    top: "50%",
    width: "8px",
    height: "30px",
    transform: `translateY(-50%) rotate(${-rotation}deg) scale(${1/scale})`,
    cursor: "ew-resize",
  }}
  onMouseDown={(e) => handleResizeStart(e, element.id, "e")}
  onTouchStart={(e) => handleResizeStart(e, element.id, "e")}
/>
              </>
            )}

            {/* Size indicator */}
            {isSelected && (
              <span 
                style={{
                  ...styles.sizeIndicator,
                  transform: `translateX(-50%) rotate(${-rotation}deg) scale(${1/scale})`,
                }}
              >
                {Math.round(pos.width)}% × {Math.round(pos.height)}% • {Math.round(scale * 100)}% • {Math.round(rotation)}°
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PreviewOverlay;