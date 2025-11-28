import React, { useState, useRef, useCallback, useEffect } from "react";
import type { Layer, ImageLayer, TextLayer } from "../../remotion_compositions/DynamicLayerComposition";

// ============================================================================
// TYPES
// ============================================================================

type DragMode = "move" | "rotate" | "resize-tl" | "resize-tr" | "resize-bl" | "resize-br" | null;

export interface DynamicPreviewOverlayProps {
  layers: Layer[];
  onLayerUpdate: (layerId: string, updates: Partial<Layer>) => void;
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string | null) => void;
  containerWidth: number;
  containerHeight: number;
  currentFrame: number;
  editingLayerId: string | null;
  onEditingLayerChange: (layerId: string | null) => void;
}

// Type guard
function isTextLayer(layer: Layer): layer is TextLayer {
  return layer.type === "text";
}

// ============================================================================
// PREVIEW OVERLAY COMPONENT
// ============================================================================

export const DynamicPreviewOverlay: React.FC<DynamicPreviewOverlayProps> = ({
  layers,
  onLayerUpdate,
  selectedLayerId,
  onSelectLayer,
  containerWidth,
  containerHeight,
  currentFrame,
  editingLayerId,
  onEditingLayerChange,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [dragLayerId, setDragLayerId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0, width: 0, height: 0, rotation: 0, fontSize: 0 });
  const [elementCenter, setElementCenter] = useState({ x: 0, y: 0 });
  
  const editDivRef = useRef<HTMLDivElement>(null);

  // Filter visible layers at current frame (exclude background)
  // Reverse order so that layers at top of timeline (index 0) appear on top in the overlay
  const visibleLayers = layers
    .map((layer, index) => ({ layer, originalIndex: index }))
    .filter(({ layer }) => {
      if ((layer as ImageLayer).isBackground) return false;
      if (!layer.visible) return false;
      return currentFrame >= layer.startFrame && currentFrame <= layer.endFrame;
    })
    .sort((a, b) => b.originalIndex - a.originalIndex)
    .map(({ layer }) => layer);

  const getElementCenter = (layer: Layer) => {
    const centerX = (layer.position.x / 100) * containerWidth;
    const centerY = (layer.position.y / 100) * containerHeight;
    return { x: centerX, y: centerY };
  };

  // Handle single click to select
  const handleClick = useCallback(
    (e: React.MouseEvent, layer: Layer) => {
      if (layer.locked || (layer as ImageLayer).isBackground) return;
      if (editingLayerId === layer.id) return;
      
      e.stopPropagation();
      onSelectLayer(layer.id);
    },
    [onSelectLayer, editingLayerId]
  );

  // Handle double click to edit text
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent, layer: Layer) => {
      if (layer.locked || (layer as ImageLayer).isBackground) return;
      if (!isTextLayer(layer)) return;
      
      e.stopPropagation();
      e.preventDefault();
      
      onEditingLayerChange(layer.id);
      onSelectLayer(layer.id);
      
      setTimeout(() => {
        if (editDivRef.current) {
          editDivRef.current.focus();
          // Place cursor at end
          const range = document.createRange();
          range.selectNodeContents(editDivRef.current);
          range.collapse(false);
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 50);
    },
    [onSelectLayer, onEditingLayerChange]
  );

  // Handle text input
  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>, layerId: string) => {
      const newText = e.currentTarget.innerText || "";
      onLayerUpdate(layerId, { content: newText } as Partial<TextLayer>);
    },
    [onLayerUpdate]
  );

  // Handle blur to finish editing
  const handleEditBlur = useCallback(() => {
    onEditingLayerChange(null);
  }, [onEditingLayerChange]);

  // Handle key press in edit mode
  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onEditingLayerChange(null);
      }
    },
    [onEditingLayerChange]
  );

  // Handle mouse down for move
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, layer: Layer) => {
      if (layer.locked || (layer as ImageLayer).isBackground) return;
      if (editingLayerId === layer.id) return;
      
      e.stopPropagation();
      e.preventDefault();

      const fontSize = isTextLayer(layer) ? layer.fontSize : 0;

      setDragMode("move");
      setDragLayerId(layer.id);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragStartPos({ 
        x: layer.position.x, 
        y: layer.position.y, 
        width: layer.size.width,
        height: layer.size.height,
        rotation: layer.rotation || 0,
        fontSize
      });
      onSelectLayer(layer.id);
    },
    [onSelectLayer, editingLayerId]
  );

  // Handle rotation start
  const handleRotateStart = useCallback(
    (e: React.MouseEvent, layer: Layer) => {
      if (layer.locked) return;
      
      e.stopPropagation();
      e.preventDefault();

      const center = getElementCenter(layer);
      const fontSize = isTextLayer(layer) ? layer.fontSize : 0;
      
      setDragMode("rotate");
      setDragLayerId(layer.id);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragStartPos({ 
        x: layer.position.x, 
        y: layer.position.y, 
        width: layer.size.width,
        height: layer.size.height,
        rotation: layer.rotation || 0,
        fontSize
      });
      setElementCenter(center);
    },
    [containerWidth, containerHeight]
  );

  // Handle resize start
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, layer: Layer, corner: "tl" | "tr" | "bl" | "br") => {
      if (layer.locked) return;
      
      e.stopPropagation();
      e.preventDefault();

      const center = getElementCenter(layer);
      const fontSize = isTextLayer(layer) ? layer.fontSize : 0;
      
      setDragMode(`resize-${corner}` as DragMode);
      setDragLayerId(layer.id);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragStartPos({ 
        x: layer.position.x, 
        y: layer.position.y,
        width: layer.size.width, 
        height: layer.size.height, 
        rotation: layer.rotation || 0,
        fontSize
      });
      setElementCenter(center);
    },
    [containerWidth, containerHeight]
  );

  // Mouse move handler
  useEffect(() => {
    if (!dragMode || !dragLayerId) return;

    const layer = layers.find(l => l.id === dragLayerId);
    if (!layer) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (dragMode === "move") {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        const deltaXPercent = (deltaX / containerWidth) * 100;
        const deltaYPercent = (deltaY / containerHeight) * 100;

        const newX = Math.max(0, Math.min(100, dragStartPos.x + deltaXPercent));
        const newY = Math.max(0, Math.min(100, dragStartPos.y + deltaYPercent));

        onLayerUpdate(dragLayerId, { position: { x: newX, y: newY } });
      } else if (dragMode === "rotate") {
        const rect = overlayRef.current?.getBoundingClientRect();
        if (!rect) return;

        const centerX = rect.left + elementCenter.x;
        const centerY = rect.top + elementCenter.y;

        const startAngle = Math.atan2(dragStart.y - centerY, dragStart.x - centerX);
        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const deltaDegrees = (currentAngle - startAngle) * (180 / Math.PI);
        const newRotation = dragStartPos.rotation + deltaDegrees;

        onLayerUpdate(dragLayerId, { rotation: newRotation });
      } else if (dragMode?.startsWith("resize-")) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        const deltaWidthPercent = (deltaX / containerWidth) * 100;
        const deltaHeightPercent = (deltaY / containerHeight) * 100;

        let newWidth = dragStartPos.width;
        let newHeight = dragStartPos.height;

        const corner = dragMode.replace("resize-", "");
        
        if (corner === "br") {
          newWidth = Math.max(10, dragStartPos.width + deltaWidthPercent);
          newHeight = Math.max(5, dragStartPos.height + deltaHeightPercent);
        } else if (corner === "bl") {
          newWidth = Math.max(10, dragStartPos.width - deltaWidthPercent);
          newHeight = Math.max(5, dragStartPos.height + deltaHeightPercent);
        } else if (corner === "tr") {
          newWidth = Math.max(10, dragStartPos.width + deltaWidthPercent);
          newHeight = Math.max(5, dragStartPos.height - deltaHeightPercent);
        } else if (corner === "tl") {
          newWidth = Math.max(10, dragStartPos.width - deltaWidthPercent);
          newHeight = Math.max(5, dragStartPos.height - deltaHeightPercent);
        }

        newWidth = Math.min(100, newWidth);
        newHeight = Math.min(100, newHeight);

        if (isTextLayer(layer) && dragStartPos.fontSize > 0) {
          const scaleRatio = newWidth / dragStartPos.width;
          const newFontSize = Math.max(0.5, Math.min(20, dragStartPos.fontSize * scaleRatio));
          
          onLayerUpdate(dragLayerId, { 
            size: { width: newWidth, height: newHeight },
            fontSize: newFontSize
          } as Partial<TextLayer>);
        } else {
          onLayerUpdate(dragLayerId, { 
            size: { width: newWidth, height: newHeight } 
          });
        }
      }
    };

    const handleMouseUp = () => {
      setDragMode(null);
      setDragLayerId(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragMode, dragLayerId, dragStart, dragStartPos, elementCenter, containerWidth, containerHeight, onLayerUpdate, layers]);

  // Click on empty area to deselect
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        onEditingLayerChange(null);
        onSelectLayer(null);
      }
    },
    [onSelectLayer, onEditingLayerChange]
  );

  // ============================================================================
  // STYLES
  // ============================================================================

  const styles: Record<string, React.CSSProperties> = {
    overlay: {
      position: "absolute",
      inset: 0,
      cursor: "default",
      zIndex: 10,
    },
    elementBox: {
      position: "absolute",
      borderRadius: "4px",
      cursor: "pointer",
    },
    elementBoxSelected: {
      border: "2px solid #3b82f6",
      boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)",
    },
    elementLabel: {
      position: "absolute",
      top: "-24px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#3b82f6",
      color: "white",
      fontSize: "10px",
      fontWeight: 600,
      padding: "3px 8px",
      borderRadius: "4px",
      whiteSpace: "nowrap",
      pointerEvents: "none",
    },
    resizeHandle: {
      position: "absolute",
      width: "10px",
      height: "10px",
      backgroundColor: "#3b82f6",
      border: "2px solid white",
      borderRadius: "2px",
    },
    rotateHandle: {
      position: "absolute",
      top: "-40px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "20px",
      height: "20px",
      backgroundColor: "#10b981",
      border: "2px solid white",
      borderRadius: "50%",
      cursor: "grab",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    rotateLine: {
      position: "absolute",
      top: "-22px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "2px",
      height: "20px",
      backgroundColor: "#10b981",
      pointerEvents: "none",
    },
    infoOverlay: {
      position: "absolute",
      bottom: "-20px",
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "9px",
      color: "#888",
      backgroundColor: "rgba(0,0,0,0.7)",
      padding: "2px 6px",
      borderRadius: "3px",
      whiteSpace: "nowrap",
      pointerEvents: "none",
    },
    clickHint: {
      position: "absolute",
      bottom: "4px",
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "9px",
      color: "rgba(255,255,255,0.8)",
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: "2px 6px",
      borderRadius: "3px",
      whiteSpace: "nowrap",
      pointerEvents: "none",
    },
  };

  // Render editable text layer - MUST match Remotion composition exactly
  const renderEditableText = (layer: TextLayer) => {
    const scaledFontSize = (layer.fontSize / 100) * containerHeight;
    
    // Build text shadow exactly like composition
    let textShadow: string | undefined = undefined;
    if (layer.textShadow) {
      const x = layer.shadowX || 0;
      const y = layer.shadowY || 0;
      const blur = layer.shadowBlur || 0;
      const color = layer.shadowColor || "#000000";
      textShadow = `${x}px ${y}px ${blur}px ${color}`;
    }

    // Build text stroke exactly like composition
    const strokeStyle: React.CSSProperties = layer.textOutline ? {
      WebkitTextStroke: `1px ${layer.outlineColor || "#000000"}`,
      paintOrder: "stroke fill",
    } : {};

    const textStyle: React.CSSProperties = {
      position: "absolute",
      inset: 0,
      fontFamily: layer.fontFamily,
      fontSize: scaledFontSize,
      fontWeight: layer.fontWeight,
      fontStyle: layer.fontStyle,
      color: layer.fontColor,
      textAlign: layer.textAlign,
      lineHeight: layer.lineHeight,
      letterSpacing: layer.letterSpacing || 0,
      textTransform: layer.textTransform || "none",
      textShadow,
      ...strokeStyle,
      display: "flex",
      alignItems: "center",
      justifyContent: layer.textAlign === "center" ? "center" : layer.textAlign === "right" ? "flex-end" : "flex-start",
      flexWrap: "wrap",
      gap: "0.3em",
      opacity: layer.opacity,
      outline: "none",
      cursor: "text",
      wordBreak: "break-word",
      padding: 0,
      margin: 0,
      background: "transparent",
      border: "none",
    };

    return (
      <div
        ref={editDivRef}
        contentEditable
        suppressContentEditableWarning
        style={textStyle}
        onInput={(e) => handleInput(e, layer.id)}
        onBlur={handleEditBlur}
        onKeyDown={handleEditKeyDown}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {layer.content}
      </div>
    );
  };

  return (
    <div ref={overlayRef} style={styles.overlay} onClick={handleOverlayClick}>
      {visibleLayers.map((layer, renderIndex) => {
        const isSelected = selectedLayerId === layer.id;
        const isEditing = editingLayerId === layer.id;
        const rotation = layer.rotation || 0;
        const isText = isTextLayer(layer);

        const left = `${layer.position.x - layer.size.width / 2}%`;
        const top = `${layer.position.y - layer.size.height / 2}%`;
        const width = `${layer.size.width}%`;
        const height = `${layer.size.height}%`;
        
        // z-index: selected items go on top, otherwise use render order
        // renderIndex 0 = top layer (should have highest z-index)
        const baseZIndex = visibleLayers.length - renderIndex;

        return (
          <div
            key={layer.id}
            style={{
              ...styles.elementBox,
              left,
              top,
              width,
              height,
              minHeight: isText ? "30px" : undefined,
              zIndex: isSelected ? 100 : baseZIndex,
              ...(isSelected ? styles.elementBoxSelected : {}),
              cursor: isEditing ? "text" : isSelected ? (dragMode === "move" ? "grabbing" : "move") : "pointer",
              transform: `rotate(${rotation}deg)`,
              transformOrigin: "center center",
            }}
            onClick={(e) => handleClick(e, layer)}
            onDoubleClick={(e) => handleDoubleClick(e, layer)}
            onMouseDown={(e) => !isEditing && handleMouseDown(e, layer)}
          >
            {/* When editing, show editable text that replaces the Remotion-rendered text */}
            {isEditing && isText && renderEditableText(layer as TextLayer)}

            {/* Label */}
            {isSelected && !isEditing && (
              <span style={{
                ...styles.elementLabel,
                transform: `translateX(-50%) rotate(${-rotation}deg)`,
              }}>
                {layer.name}
              </span>
            )}

            {/* Double-click hint */}
            {isSelected && !isEditing && isText && (
              <span style={{
                ...styles.clickHint,
                transform: `translateX(-50%) rotate(${-rotation}deg)`,
              }}>
                Double-click to edit
              </span>
            )}

            {/* Rotation handle */}
            {isSelected && !isEditing && (
              <>
                <div style={styles.rotateLine} />
                <div
                  style={{
                    ...styles.rotateHandle,
                    cursor: dragMode === "rotate" ? "grabbing" : "grab",
                  }}
                  onMouseDown={(e) => handleRotateStart(e, layer)}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M23 4v6h-6M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                  </svg>
                </div>
              </>
            )}

            {/* Resize handles */}
            {isSelected && !isEditing && (
              <>
                <div
                  style={{ ...styles.resizeHandle, top: -6, left: -6, cursor: "nw-resize" }}
                  onMouseDown={(e) => handleResizeStart(e, layer, "tl")}
                />
                <div
                  style={{ ...styles.resizeHandle, top: -6, right: -6, cursor: "ne-resize" }}
                  onMouseDown={(e) => handleResizeStart(e, layer, "tr")}
                />
                <div
                  style={{ ...styles.resizeHandle, bottom: -6, left: -6, cursor: "sw-resize" }}
                  onMouseDown={(e) => handleResizeStart(e, layer, "bl")}
                />
                <div
                  style={{ ...styles.resizeHandle, bottom: -6, right: -6, cursor: "se-resize" }}
                  onMouseDown={(e) => handleResizeStart(e, layer, "br")}
                />
              </>
            )}

            {/* Info overlay */}
            {isSelected && !isEditing && (
              <span style={{
                ...styles.infoOverlay,
                transform: `translateX(-50%) rotate(${-rotation}deg)`,
              }}>
                {Math.round(layer.size.width)}% × {Math.round(layer.size.height)}% • {Math.round(rotation)}°
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicPreviewOverlay;