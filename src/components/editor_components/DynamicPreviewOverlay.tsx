import React, { useState, useRef, useCallback, useEffect } from "react";
import type { Layer, ImageLayer, TextLayer } from "../remotion_compositions/DynamicLayerComposition";

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
  isPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}

function isTextLayer(layer: Layer): layer is TextLayer {
  return layer.type === "text";
}

export const DynamicPreviewOverlay: React.FC<DynamicPreviewOverlayProps> = ({
  layers,
  onLayerUpdate,
  selectedLayerId,
  onSelectLayer,
  containerWidth: initialWidth,
  containerHeight: initialHeight,
  currentFrame,
  editingLayerId,
  onEditingLayerChange,
  isPlaying,         
  onPlayingChange
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [dragLayerId, setDragLayerId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0, width: 0, height: 0, rotation: 0, fontSize: 0 });
  const [elementCenter, setElementCenter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!overlayRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(overlayRef.current);
    return () => observer.disconnect();
  }, []);

  const { width: actualWidth, height: actualHeight } = dimensions;

  const visibleLayers = layers
    .map((layer, index) => ({ layer, originalIndex: index }))
    .filter(({ layer }) => {
      if ((layer as ImageLayer).isBackground) return false;
      if (!layer.visible) return false;
      if (layer.type === 'audio') return false; 
      if (!layer.position) return false; 
      return currentFrame >= layer.startFrame && currentFrame <= layer.endFrame;
    })
    .sort((a, b) => b.originalIndex - a.originalIndex)
    .map(({ layer }) => layer);

  // Helper: Get visual center of element in pixels
  const getElementCenter = (layer: Layer) => {
    if (!layer.position) return { x: 0, y: 0 };
    const centerX = (layer.position.x / 100) * actualWidth;
    const centerY = (layer.position.y / 100) * actualHeight;
    return { x: centerX, y: centerY };
  };

  const handleClick = useCallback((e: React.MouseEvent, layer: Layer) => {
    if (layer.locked || (layer as ImageLayer).isBackground) return;
    if (editingLayerId === layer.id) return;
    e.stopPropagation();
    onSelectLayer(layer.id);
  }, [onSelectLayer, editingLayerId]);

  const handleDoubleClick = useCallback((e: React.MouseEvent, layer: Layer) => {
    if (layer.locked || (layer as ImageLayer).isBackground) return;
    if (!isTextLayer(layer)) return;
    e.stopPropagation();
    e.preventDefault();
    onEditingLayerChange(layer.id);
    onSelectLayer(layer.id);
    
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        const len = textAreaRef.current.value.length;
        textAreaRef.current.setSelectionRange(len, len);
      }
    }, 10);
  }, [onSelectLayer, onEditingLayerChange]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>, layerId: string) => {
    onLayerUpdate(layerId, { content: e.target.value } as Partial<TextLayer>);
  }, [onLayerUpdate]);

  const handleEditBlur = useCallback(() => onEditingLayerChange(null), [onEditingLayerChange]);

  const handleEditKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onEditingLayerChange(null);
    }
  }, [onEditingLayerChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent, layer: Layer) => {
    if (layer.locked || (layer as ImageLayer).isBackground) return;
    if (editingLayerId === layer.id) return;
    if (!layer.position) return;

    e.stopPropagation(); e.preventDefault();
    if (isPlaying && onPlayingChange) onPlayingChange(false);
  
    const fontSize = isTextLayer(layer) ? layer.fontSize : 0;
    setDragMode("move");
    setDragLayerId(layer.id);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragStartPos({ x: layer.position.x, y: layer.position.y, width: layer.size.width, height: layer.size.height, rotation: layer.rotation || 0, fontSize });
    onSelectLayer(layer.id);
  }, [onSelectLayer, editingLayerId, isPlaying, onPlayingChange]);

  const handleRotateStart = useCallback((e: React.MouseEvent, layer: Layer) => {
    if (layer.locked) return;
    e.stopPropagation(); e.preventDefault();
    if (isPlaying && onPlayingChange) onPlayingChange(false);

    const center = getElementCenter(layer);
    const fontSize = isTextLayer(layer) ? layer.fontSize : 0;
    setDragMode("rotate");
    setDragLayerId(layer.id);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragStartPos({ x: layer.position.x, y: layer.position.y, width: layer.size.width, height: layer.size.height, rotation: layer.rotation || 0, fontSize });
    setElementCenter(center);
  }, [actualWidth, actualHeight, isPlaying, onPlayingChange]);

  const handleResizeStart = useCallback((e: React.MouseEvent, layer: Layer, corner: any) => {
    if (layer.locked) return;
    e.stopPropagation(); e.preventDefault();
    if (isPlaying && onPlayingChange) onPlayingChange(false);
    const fontSize = isTextLayer(layer) ? layer.fontSize : 0;
    setDragMode(`resize-${corner}` as DragMode);
    setDragLayerId(layer.id);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragStartPos({ x: layer.position.x, y: layer.position.y, width: layer.size.width, height: layer.size.height, rotation: layer.rotation || 0, fontSize });
  }, [isPlaying, onPlayingChange]);

  useEffect(() => {
    if (!dragMode || !dragLayerId) return;
    const layer = layers.find(l => l.id === dragLayerId);
    if (!layer || !layer.position) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (dragMode === "move") {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        const deltaXPercent = (deltaX / actualWidth) * 100;
        const deltaYPercent = (deltaY / actualHeight) * 100;
        onLayerUpdate(dragLayerId, { position: { x: dragStartPos.x + deltaXPercent, y: dragStartPos.y + deltaYPercent } });
      } else if (dragMode === "rotate") {
        const rect = overlayRef.current?.getBoundingClientRect();
        if (!rect) return;
        const centerX = rect.left + elementCenter.x;
        const centerY = rect.top + elementCenter.y;
        const startAngle = Math.atan2(dragStart.y - centerY, dragStart.x - centerX);
        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const deltaDegrees = (currentAngle - startAngle) * (180 / Math.PI);
        onLayerUpdate(dragLayerId, { rotation: dragStartPos.rotation + deltaDegrees });
      } else if (dragMode?.startsWith("resize-")) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        const deltaWidthPercent = (deltaX / actualWidth) * 100;
        const deltaHeightPercent = (deltaY / actualHeight) * 100;
        let newWidth = dragStartPos.width;
        let newHeight = dragStartPos.height;
        const corner = dragMode.replace("resize-", "");
        
        if (corner === "br") { newWidth += (deltaWidthPercent * 2); newHeight += (deltaHeightPercent * 2); } 
        else if (corner === "bl") { newWidth -= (deltaWidthPercent * 2); newHeight += (deltaHeightPercent * 2); } 
        else if (corner === "tr") { newWidth += (deltaWidthPercent * 2); newHeight -= (deltaHeightPercent * 2); } 
        else if (corner === "tl") { newWidth -= (deltaWidthPercent * 2); newHeight -= (deltaHeightPercent * 2); }

        newWidth = Math.max(2, newWidth);
        newHeight = Math.max(2, newHeight);

        if (isTextLayer(layer) && dragStartPos.fontSize > 0) {
          const scaleRatio = newWidth / dragStartPos.width;
          const newFontSize = Math.max(0.5, Math.min(50, dragStartPos.fontSize * scaleRatio));
          onLayerUpdate(dragLayerId, { size: { width: newWidth, height: newHeight }, fontSize: newFontSize } as Partial<TextLayer>);
        } else {
          onLayerUpdate(dragLayerId, { size: { width: newWidth, height: newHeight } });
        }
      }
    };

    const handleMouseUp = () => { setDragMode(null); setDragLayerId(null); };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => { document.removeEventListener("mousemove", handleMouseMove); document.removeEventListener("mouseup", handleMouseUp); };
  }, [dragMode, dragLayerId, dragStart, dragStartPos, elementCenter, actualWidth, actualHeight, onLayerUpdate, layers]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onEditingLayerChange(null);
      onSelectLayer(null);
    }
  }, [onSelectLayer, onEditingLayerChange]);

  // Styles
  const styles: Record<string, React.CSSProperties> = {
    overlay: { position: "absolute", inset: 0, cursor: "default", zIndex: 10 },
    elementBox: { position: "absolute", borderRadius: "2px", cursor: "pointer", boxSizing: "border-box" },
    elementBoxSelected: { border: "1px solid #3b82f6", boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)" },
    elementLabel: { position: "absolute", top: "-24px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#3b82f6", color: "white", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "4px", whiteSpace: "nowrap", pointerEvents: "none" },
    resizeHandle: { position: "absolute", width: "8px", height: "8px", backgroundColor: "#3b82f6", border: "1px solid white", borderRadius: "50%", zIndex: 20 },
    rotateHandle: { position: "absolute", top: "-30px", left: "50%", transform: "translateX(-50%)", width: "16px", height: "16px", backgroundColor: "#3b82f6", border: "2px solid white", borderRadius: "50%", cursor: "grab", display: "flex", alignItems: "center", justifyContent: "center" },
    rotateLine: { position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", width: "1px", height: "15px", backgroundColor: "#3b82f6", pointerEvents: "none" },
    infoOverlay: { position: "absolute", bottom: "-20px", left: "50%", transform: "translateX(-50%)", fontSize: "9px", color: "#888", backgroundColor: "rgba(0,0,0,0.7)", padding: "2px 6px", borderRadius: "3px", whiteSpace: "nowrap", pointerEvents: "none" },
    clickHint: { position: "absolute", bottom: "4px", left: "50%", transform: "translateX(-50%)", fontSize: "9px", color: "rgba(255,255,255,0.8)", backgroundColor: "rgba(0,0,0,0.6)", padding: "2px 6px", borderRadius: "3px", whiteSpace: "nowrap", pointerEvents: "none" },
  };

  const renderGhostText = (layer: TextLayer) => {
    const scaledFontSize = (layer.fontSize / 100) * actualHeight;
    return (
      <div
        style={{
          fontFamily: layer.fontFamily,
          fontSize: scaledFontSize,
          fontWeight: layer.fontWeight,
          fontStyle: layer.fontStyle,
          lineHeight: layer.lineHeight,
          letterSpacing: layer.letterSpacing || 0,
          textTransform: layer.textTransform || "none",
          textAlign: layer.textAlign,
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          visibility: "hidden", // Invisible, just for sizing the flex container if needed
          pointerEvents: "none",
          // The ghost text size doesn't determine box size anymore, 
          // but we keep it here in case we want to re-enable auto-size later.
          // For now, it just sits inside.
          width: "100%",
          padding: 0,
          margin: 0,
        }}
      >
        {layer.content}
        {layer.content.endsWith('\n') ? <br /> : null} 
        &#8203; 
      </div>
    );
  };

  const renderEditableText = (layer: TextLayer) => {
    const scaledFontSize = (layer.fontSize / 100) * actualHeight;
    const strokeStyle: React.CSSProperties = layer.textOutline ? { WebkitTextStroke: `1px ${layer.outlineColor || "#000000"}`, paintOrder: "stroke fill" } : {};
    
    return (
      <textarea
        ref={textAreaRef}
        value={layer.content}
        onChange={(e) => handleInput(e, layer.id)}
        onBlur={handleEditBlur}
        onKeyDown={handleEditKeyDown}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          fontFamily: layer.fontFamily, fontSize: scaledFontSize, fontWeight: layer.fontWeight, fontStyle: layer.fontStyle, color: layer.fontColor,
          textAlign: layer.textAlign, lineHeight: layer.lineHeight, letterSpacing: layer.letterSpacing || 0,
          textTransform: layer.textTransform || "none", textShadow: layer.textShadow ? `${layer.shadowX || 0}px ${layer.shadowY || 0}px ${layer.shadowBlur || 0}px ${layer.shadowColor || "#000000"}` : undefined,
          ...strokeStyle,
          background: "transparent", border: "none", outline: "none", resize: "none",
          padding: 0, margin: 0, boxSizing: "border-box", overflow: "hidden", opacity: layer.opacity, cursor: "text"
        }}
      />
    );
  };

  return (
    <div ref={overlayRef} style={styles.overlay} onClick={handleOverlayClick}>
      {visibleLayers.map((layer, renderIndex) => {
        if (!layer.position) return null;

        const isSelected = selectedLayerId === layer.id;
        const isEditing = editingLayerId === layer.id;
        const rotation = layer.rotation || 0;
        const isText = isTextLayer(layer);
        
        // --- PRECISE POSITIONING MATCHING COMPOSITION ---
        // Top-Left Coordinate = Center (Position) - Half Size
        const left = `${layer.position.x - layer.size.width / 2}%`;
        const top = `${layer.position.y - layer.size.height / 2}%`;
        
        // --- STRICT SIZING ---
        // Overlay Box Size MUST match Layer State Size exactly.
        const width = `${layer.size.width}%`;
        const height = `${layer.size.height}%`;

        const baseZIndex = visibleLayers.length - renderIndex;

        return (
          <div
            key={layer.id}
            style={{
              ...styles.elementBox,
              left, top, width, height,
              zIndex: isSelected ? 100 : baseZIndex,
              ...(isSelected ? styles.elementBoxSelected : {}),
              cursor: isEditing ? "text" : isSelected ? (dragMode === "move" ? "grabbing" : "move") : "pointer",
              transform: `rotate(${rotation}deg)`, 
              transformOrigin: "center center", 
              
              // --- CENTER CONTENT ---
              // This ensures that if the box is larger than the element (e.g. text), 
              // the element sits perfectly in the middle of the box.
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={(e) => handleClick(e, layer)}
            onDoubleClick={(e) => handleDoubleClick(e, layer)}
            onMouseDown={(e) => !isEditing && handleMouseDown(e, layer)}
          >
            {/* For Text: We center the ghost/edit text inside the box.
               For Images: Since there's no child <img> here (it's in Composition), 
               the empty box just frames the area perfectly. 
            */}
            
            {isText && renderGhostText(layer as TextLayer)}
            {isEditing && isText && renderEditableText(layer as TextLayer)}
            
            {isSelected && !isEditing && <span style={{ ...styles.elementLabel, transform: `translateX(-50%) rotate(${-rotation}deg)` }}>{layer.name}</span>}
            {isSelected && !isEditing && isText && <span style={{ ...styles.clickHint, transform: `translateX(-50%) rotate(${-rotation}deg)` }}>Double-click to edit</span>}
            
            {isSelected && !isEditing && (
              <>
                <div style={styles.rotateLine} />
                <div style={{ ...styles.rotateHandle, cursor: dragMode === "rotate" ? "grabbing" : "grab" }} onMouseDown={(e) => handleRotateStart(e, layer)} />
                <div style={{ ...styles.resizeHandle, top: -4, left: -4, cursor: "nw-resize" }} onMouseDown={(e) => handleResizeStart(e, layer, "tl")} />
                <div style={{ ...styles.resizeHandle, top: -4, right: -4, cursor: "ne-resize" }} onMouseDown={(e) => handleResizeStart(e, layer, "tr")} />
                <div style={{ ...styles.resizeHandle, bottom: -4, left: -4, cursor: "sw-resize" }} onMouseDown={(e) => handleResizeStart(e, layer, "bl")} />
                <div style={{ ...styles.resizeHandle, bottom: -4, right: -4, cursor: "se-resize" }} onMouseDown={(e) => handleResizeStart(e, layer, "br")} />
                <span style={{ ...styles.infoOverlay, transform: `translateX(-50%) rotate(${-rotation}deg)` }}>{Math.round(layer.size.width)}% × {Math.round(layer.size.height)}%</span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicPreviewOverlay;