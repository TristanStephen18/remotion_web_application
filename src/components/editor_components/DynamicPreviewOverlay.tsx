import React, { useState, useRef, useCallback, useEffect } from "react";
import type {
  Layer,
  ImageLayer,
  TextLayer,
} from "../remotion_compositions/DynamicLayerComposition";
import { measureTextDimensions } from "../../utils/textAutoResize";

type DragMode =
  | "move"
  | "rotate"
  | "resize-tl"
  | "resize-tr"
  | "resize-bl"
  | "resize-br"
  | "crop-n"
  | "crop-s"
  | "crop-e"
  | "crop-w"
  | "crop-nw"
  | "crop-ne"
  | "crop-sw"
  | "crop-se"
  | "crop-move"
  | "resize-t"
  | "resize-r"
  | "resize-b"
  | "resize-l"
  | null;

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

function isImageLayer(layer: Layer): layer is ImageLayer {
  return layer.type === "image";
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
  onPlayingChange,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  const [cropModeLayerId, setCropModeLayerId] = useState<string | null>(null);
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [dragLayerId, setDragLayerId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rotation: 0,
    fontSize: 0,
  });
  const [elementCenter, setElementCenter] = useState({ x: 0, y: 0 });

  // NEW: Store the offset from element center to where user clicked
  const [grabOffset, setGrabOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!overlayRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
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
      if (layer.locked) return false; // ✅ FILTER OUT LOCKED LAYERS
      if (layer.type === "audio") return false;
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

  const handleClick = useCallback(
    (e: React.MouseEvent, layer: Layer) => {
      if (layer.locked || (layer as ImageLayer).isBackground) return;
      if (editingLayerId === layer.id) return;
      e.stopPropagation();
      onSelectLayer(layer.id);
    },
    [onSelectLayer, editingLayerId]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent, layer: Layer) => {
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
    },
    [onSelectLayer, onEditingLayerChange]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>, layerId: string) => {
      const layer = layers.find((l) => l.id === layerId);
      if (!layer || !isTextLayer(layer)) return;

      const newContent = e.target.value;
      const tempLayer = { ...layer, content: newContent };
      const newSize = measureTextDimensions(tempLayer, 1080, 1920);

      onLayerUpdate(layerId, {
        content: newContent,
        size: {
          width: newSize.width,
          height: newSize.height,
        },
      } as Partial<TextLayer>);
    },
    [layers, onLayerUpdate]
  );

  const handleEditBlur = useCallback(
    () => onEditingLayerChange(null),
    [onEditingLayerChange]
  );

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onEditingLayerChange(null);
      }
    },
    [onEditingLayerChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, layer: Layer) => {
      if (layer.locked || (layer as ImageLayer).isBackground) return;
      if (editingLayerId === layer.id) return;
      if (!layer.position) return;

      e.stopPropagation();
      e.preventDefault();
      if (isPlaying && onPlayingChange) onPlayingChange(false);

      const rect = overlayRef.current?.getBoundingClientRect();
      if (!rect) return;

      // KEY FIX: Calculate element's center in screen coordinates
      const centerX = rect.left + (layer.position.x / 100) * actualWidth;
      const centerY = rect.top + (layer.position.y / 100) * actualHeight;

      // Calculate offset from element center to mouse position
      const offsetX = e.clientX - centerX;
      const offsetY = e.clientY - centerY;

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
        fontSize,
      });

      // Store the grab offset
      setGrabOffset({ x: offsetX, y: offsetY });

      onSelectLayer(layer.id);
    },
    [
      onSelectLayer,
      editingLayerId,
      isPlaying,
      onPlayingChange,
      actualWidth,
      actualHeight,
    ]
  );

  const handleRotateStart = useCallback(
    (e: React.MouseEvent, layer: Layer) => {
      if (layer.locked) return;
      e.stopPropagation();
      e.preventDefault();
      if (isPlaying && onPlayingChange) onPlayingChange(false);

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
        fontSize,
      });
      setElementCenter(center);
    },
    [actualWidth, actualHeight, isPlaying, onPlayingChange]
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, layer: Layer, corner: any) => {
      if (layer.locked) return;
      e.stopPropagation();
      e.preventDefault();
      if (isPlaying && onPlayingChange) onPlayingChange(false);
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
        fontSize,
      });
    },
    [isPlaying, onPlayingChange]
  );

  const handleCropStart = useCallback(
    (e: React.MouseEvent, layer: Layer, direction: string) => {
      if (!isImageLayer(layer)) return;
      e.stopPropagation();
      e.preventDefault();

      const crop = layer.crop || { x: 0, y: 0, width: 100, height: 100 };
      setDragMode(`crop-${direction}` as DragMode);
      setDragLayerId(layer.id);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragStartPos({
        x: crop.x,
        y: crop.y,
        width: crop.width,
        height: crop.height,
        rotation: 0,
        fontSize: 0,
      });
    },
    []
  );

  const handleCropMove = useCallback((e: React.MouseEvent, layer: Layer) => {
    if (!isImageLayer(layer)) return;
    e.stopPropagation();
    e.preventDefault();

    const crop = layer.crop || { x: 0, y: 0, width: 100, height: 100 };
    setDragMode("crop-move");
    setDragLayerId(layer.id);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragStartPos({
      x: crop.x,
      y: crop.y,
      width: crop.width,
      height: crop.height,
      rotation: 0,
      fontSize: 0,
    });
  }, []);

  const toggleCropMode = useCallback((e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Just toggle crop mode - don't modify the layer
    // The crop data remains and continues to be applied visually
    setCropModeLayerId(prev => prev === layerId ? null : layerId);
  }, []);


  useEffect(() => {
    if (!dragMode || !dragLayerId) return;
    const layer = layers.find((l) => l.id === dragLayerId);
    if (!layer || !layer.position) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = overlayRef.current?.getBoundingClientRect();
      if (!rect) return;

      if (dragMode === "move") {
        // KEY FIX: Account for the grab offset
        // Current mouse position minus grab offset = where the element center should be
        const targetCenterX = e.clientX - grabOffset.x;
        const targetCenterY = e.clientY - grabOffset.y;

        // Convert to container-relative coordinates
        const relativeX = targetCenterX - rect.left;
        const relativeY = targetCenterY - rect.top;

        // Convert to percentage
        const newX = (relativeX / actualWidth) * 100;
        const newY = (relativeY / actualHeight) * 100;

        // Apply bounds
        const boundedX = Math.max(0, Math.min(100, newX));
        const boundedY = Math.max(0, Math.min(100, newY));

        onLayerUpdate(dragLayerId, { position: { x: boundedX, y: boundedY } });
      } else if (dragMode === "rotate") {
        const startAngle = Math.atan2(
          dragStart.y - (rect.top + elementCenter.y),
          dragStart.x - (rect.left + elementCenter.x)
        );
        const currentAngle = Math.atan2(
          e.clientY - (rect.top + elementCenter.y),
          e.clientX - (rect.left + elementCenter.x)
        );
        const deltaAngle = (currentAngle - startAngle) * (180 / Math.PI);
        const newRotation = dragStartPos.rotation + deltaAngle;
        onLayerUpdate(dragLayerId, { rotation: newRotation });
      } else if (dragMode?.startsWith("resize-")) {
        const corner = dragMode.split("-")[1];
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        const rotation = dragStartPos.rotation || 0;
        const rotationRad = (rotation * Math.PI) / 180;
        const cos = Math.cos(-rotationRad);
        const sin = Math.sin(-rotationRad);
        const localDeltaX = deltaX * cos - deltaY * sin;
        const localDeltaY = deltaX * sin + deltaY * cos;
        const deltaWidthPercent = (localDeltaX / actualWidth) * 100;
        const deltaHeightPercent = (localDeltaY / actualHeight) * 100;

        let newWidth = dragStartPos.width;
        let newHeight = dragStartPos.height;
        let newX = dragStartPos.x;
        let newY = dragStartPos.y;
        let newFontSize = dragStartPos.fontSize;

        if (corner === "br") {
          newWidth = Math.max(5, dragStartPos.width + deltaWidthPercent);
          newHeight = Math.max(5, dragStartPos.height + deltaHeightPercent);
        } else if (corner === "bl") {
          newWidth = Math.max(5, dragStartPos.width - deltaWidthPercent);
          newHeight = Math.max(5, dragStartPos.height + deltaHeightPercent);
          newX = dragStartPos.x + deltaWidthPercent / 2;
        } else if (corner === "tr") {
          newWidth = Math.max(5, dragStartPos.width + deltaWidthPercent);
          newHeight = Math.max(5, dragStartPos.height - deltaHeightPercent);
          newY = dragStartPos.y + deltaHeightPercent / 2;
        } else if (corner === "tl") {
          newWidth = Math.max(5, dragStartPos.width - deltaWidthPercent);
          newHeight = Math.max(5, dragStartPos.height - deltaHeightPercent);
          newX = dragStartPos.x + deltaWidthPercent / 2;
          newY = dragStartPos.y + deltaHeightPercent / 2;
        } else if (corner === "r") {
          // Right edge
          newWidth = Math.max(5, dragStartPos.width + deltaWidthPercent);
        } else if (corner === "l") {
          // Left edge
          newWidth = Math.max(5, dragStartPos.width - deltaWidthPercent);
          newX = dragStartPos.x + deltaWidthPercent / 2;
        } else if (corner === "b") {
          // Bottom edge
          newHeight = Math.max(5, dragStartPos.height + deltaHeightPercent);
        } else if (corner === "t") {
          // Top edge
          newHeight = Math.max(5, dragStartPos.height - deltaHeightPercent);
          newY = dragStartPos.y + deltaHeightPercent / 2;
        }
        

        if (isTextLayer(layer)) {
          const scale = Math.sqrt(
            (newWidth / dragStartPos.width) * (newHeight / dragStartPos.height)
          );
          newFontSize = Math.max(1, dragStartPos.fontSize * scale);
          onLayerUpdate(dragLayerId, {
            position: { x: newX, y: newY },
            size: { width: newWidth, height: newHeight },
            fontSize: newFontSize,
          } as Partial<TextLayer>);
        } else {
          // Update position for edges that change it (left/top)
          if (newX !== dragStartPos.x || newY !== dragStartPos.y) {
            onLayerUpdate(dragLayerId, {
              position: { x: newX, y: newY },
              size: { width: newWidth, height: newHeight },
            });
          } else {
            onLayerUpdate(dragLayerId, {
              size: { width: newWidth, height: newHeight },
            });
          }
        }
      } else if (dragMode && dragMode.startsWith("crop-") && dragLayerId) {
        // CROP LOGIC - NOW AT THE CORRECT LEVEL
        const layer = layers.find((l) => l.id === dragLayerId);
        if (!layer || !isImageLayer(layer)) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        const deltaXPercent = (deltaX / actualWidth) * 100;
        const deltaYPercent = (deltaY / actualHeight) * 100;

        const newCrop = {
          x: dragStartPos.x,
          y: dragStartPos.y,
          width: dragStartPos.width,
          height: dragStartPos.height,
        };

        switch (dragMode) {
          case "crop-move":
            newCrop.x = Math.max(
              0,
              Math.min(100 - dragStartPos.width, dragStartPos.x + deltaXPercent)
            );
            newCrop.y = Math.max(
              0,
              Math.min(
                100 - dragStartPos.height,
                dragStartPos.y + deltaYPercent
              )
            );
            break;
          case "crop-nw":
            newCrop.x = Math.max(
              0,
              Math.min(
                dragStartPos.x + dragStartPos.width - 10,
                dragStartPos.x + deltaXPercent
              )
            );
            newCrop.y = Math.max(
              0,
              Math.min(
                dragStartPos.y + dragStartPos.height - 10,
                dragStartPos.y + deltaYPercent
              )
            );
            newCrop.width = Math.max(10, dragStartPos.width - deltaXPercent);
            newCrop.height = Math.max(10, dragStartPos.height - deltaYPercent);
            break;
          case "crop-ne":
            newCrop.y = Math.max(
              0,
              Math.min(
                dragStartPos.y + dragStartPos.height - 10,
                dragStartPos.y + deltaYPercent
              )
            );
            newCrop.width = Math.max(
              10,
              Math.min(100 - dragStartPos.x, dragStartPos.width + deltaXPercent)
            );
            newCrop.height = Math.max(10, dragStartPos.height - deltaYPercent);
            break;
          case "crop-sw":
            newCrop.x = Math.max(
              0,
              Math.min(
                dragStartPos.x + dragStartPos.width - 10,
                dragStartPos.x + deltaXPercent
              )
            );
            newCrop.width = Math.max(10, dragStartPos.width - deltaXPercent);
            newCrop.height = Math.max(
              10,
              Math.min(
                100 - dragStartPos.y,
                dragStartPos.height + deltaYPercent
              )
            );
            break;
          case "crop-se":
            newCrop.width = Math.max(
              10,
              Math.min(100 - dragStartPos.x, dragStartPos.width + deltaXPercent)
            );
            newCrop.height = Math.max(
              10,
              Math.min(
                100 - dragStartPos.y,
                dragStartPos.height + deltaYPercent
              )
            );
            break;
          case "crop-n":
            newCrop.y = Math.max(
              0,
              Math.min(
                dragStartPos.y + dragStartPos.height - 10,
                dragStartPos.y + deltaYPercent
              )
            );
            newCrop.height = Math.max(10, dragStartPos.height - deltaYPercent);
            break;
          case "crop-s":
            newCrop.height = Math.max(
              10,
              Math.min(
                100 - dragStartPos.y,
                dragStartPos.height + deltaYPercent
              )
            );
            break;
          case "crop-e":
            newCrop.width = Math.max(
              10,
              Math.min(100 - dragStartPos.x, dragStartPos.width + deltaXPercent)
            );
            break;
          case "crop-w":
            newCrop.x = Math.max(
              0,
              Math.min(
                dragStartPos.x + dragStartPos.width - 10,
                dragStartPos.x + deltaXPercent
              )
            );
            newCrop.width = Math.max(10, dragStartPos.width - deltaXPercent);
            break;
        }

        if (newCrop.x + newCrop.width > 100) newCrop.width = 100 - newCrop.x;
        if (newCrop.y + newCrop.height > 100) newCrop.height = 100 - newCrop.y;

        onLayerUpdate(dragLayerId, { crop: newCrop });
      }
    };

    const handleMouseUp = () => {
      setDragMode(null);
      setDragLayerId(null);
      setGrabOffset({ x: 0, y: 0 }); // Reset grab offset
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    dragMode,
    dragLayerId,
    dragStart,
    dragStartPos,
    elementCenter,
    grabOffset, // Add grabOffset to dependencies
    actualWidth,
    actualHeight,
    onLayerUpdate,
    layers,
  ]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        onEditingLayerChange(null);
        onSelectLayer(null);
      }
    },
    [onSelectLayer, onEditingLayerChange]
  );

  // Styles
  const styles: Record<string, React.CSSProperties> = {
    overlay: { position: "absolute", inset: 0, cursor: "default", zIndex: 10 },
    elementBox: {
      position: "absolute",
      borderRadius: "2px",
      cursor: "pointer",
      boxSizing: "border-box",
    },
    elementBoxSelected: {
      border: "1px solid #3b82f6",
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
      width: "8px",
      height: "8px",
      backgroundColor: "#3b82f6",
      border: "1px solid white",
      borderRadius: "50%",
      zIndex: 20,
    },
    rotateHandle: {
      position: "absolute",
      top: "-30px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "16px",
      height: "16px",
      backgroundColor: "#3b82f6",
      border: "2px solid white",
      borderRadius: "50%",
      cursor: "grab",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    rotateLine: {
      position: "absolute",
      top: "-15px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "1px",
      height: "15px",
      backgroundColor: "#3b82f6",
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
          visibility: "hidden",
          pointerEvents: "none",
          width: "100%",
          padding: 0,
          margin: 0,
        }}
      >
        {layer.content}
        {layer.content.endsWith("\n") ? <br /> : null}
        &#8203;
      </div>
    );
  };

  const renderEditableText = (layer: TextLayer) => {
    const scaledFontSize = (layer.fontSize / 100) * actualHeight;
    const strokeStyle: React.CSSProperties = layer.textOutline
      ? {
          WebkitTextStroke: `1px ${layer.outlineColor || "#000000"}`,
          paintOrder: "stroke fill",
        }
      : {};

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
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          fontFamily: layer.fontFamily,
          fontSize: scaledFontSize,
          fontWeight: layer.fontWeight,
          fontStyle: layer.fontStyle,
          color: layer.fontColor,
          textAlign: layer.textAlign,
          lineHeight: layer.lineHeight,
          letterSpacing: layer.letterSpacing || 0,
          textTransform: layer.textTransform || "none",
          textShadow: layer.textShadow
            ? `${layer.shadowX || 0}px ${layer.shadowY || 0}px ${
                layer.shadowBlur || 0
              }px ${layer.shadowColor || "#000000"}`
            : undefined,
          ...strokeStyle,
          background: "transparent",
          border: "none",
          outline: "none",
          resize: "none",
          padding: 0,
          margin: 0,
          boxSizing: "border-box",
          overflow: "hidden",
          opacity: layer.opacity,
          cursor: "text",
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

        // CALCULATE DIMENSIONS AND POSITION - ACCOUNTING FOR CROP
        let displayWidth = layer.size.width;
        let displayHeight = layer.size.height;
        let adjustedCenterX = layer.position.x;
        let adjustedCenterY = layer.position.y;
        let transformOrigin = "center center";
        
        // If this is an image layer with crop data, adjust dimensions AND position
        // If this is an image layer with crop data, adjust dimensions AND position
        if (isImageLayer(layer) && layer.crop && cropModeLayerId !== layer.id) {
          const crop = layer.crop;
          displayWidth = layer.size.width * (crop.width / 100);
          displayHeight = layer.size.height * (crop.height / 100);
          
          // Calculate the center of the cropped region as percentage (0-100)
          const cropCenterX = crop.x + crop.width / 2;  // Center X of crop in %
          const cropCenterY = crop.y + crop.height / 2;  // Center Y of crop in %
          
          // Calculate offset from image center (50%) in percentage points
          const cropCenterOffsetX = ((cropCenterX - 50) / 100) * layer.size.width;
          const cropCenterOffsetY = ((cropCenterY - 50) / 100) * layer.size.height;
          
          // Adjust the center position
          adjustedCenterX = layer.position.x + cropCenterOffsetX;
          adjustedCenterY = layer.position.y + cropCenterOffsetY;
          const originOffsetX = ((layer.position.x - adjustedCenterX) / displayWidth) * 100;
          const originOffsetY = ((layer.position.y - adjustedCenterY) / displayHeight) * 100;
          transformOrigin = `${50 + originOffsetX}% ${50 + originOffsetY}%`;
        }

        // --- PRECISE POSITIONING MATCHING COMPOSITION ---
        // Top-Left Coordinate = Adjusted Center - Half Display Size
        const left = `${adjustedCenterX - displayWidth / 2}%`;
        const top = `${adjustedCenterY - displayHeight / 2}%`;

        // --- STRICT SIZING ---
        // Overlay Box Size MUST match cropped size
        const width = `${displayWidth}%`;
        const height = `${displayHeight}%`;

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
              zIndex: isSelected ? 100 : baseZIndex,
              ...(isSelected ? styles.elementBoxSelected : {}),
              cursor: isEditing
                ? "text"
                : isSelected
                ? dragMode === "move"
                  ? "grabbing"
                  : "move"
                : "pointer",
              transform: `rotate(${rotation}deg)`,
              transformOrigin: transformOrigin,

              // --- CENTER CONTENT ---
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={(e) => handleClick(e, layer)}
            onDoubleClick={(e) => handleDoubleClick(e, layer)}
            onMouseDown={(e) => !isEditing && handleMouseDown(e, layer)}
          >
            {isText && renderGhostText(layer as TextLayer)}
            {isEditing && isText && renderEditableText(layer as TextLayer)}

            {isSelected && !isEditing && (
              <span
                style={{
                  ...styles.elementLabel,
                  transform: `translateX(-50%) rotate(${-rotation}deg)`,
                }}
              >
                {layer.name}
              </span>
            )}
            {isSelected && !isEditing && isText && (
              <span
                style={{
                  ...styles.clickHint,
                  transform: `translateX(-50%) rotate(${-rotation}deg)`,
                }}
              >
                Double-click to edit
              </span>
            )}

            {isSelected && !isEditing && cropModeLayerId !== layer.id && (
              <>
                {/* Normal resize handles */}
                <div style={styles.rotateLine} />
                <div
                  style={{
                    ...styles.rotateHandle,
                    cursor: dragMode === "rotate" ? "grabbing" : "grab",
                  }}
                  onMouseDown={(e) => handleRotateStart(e, layer)}
                />
                <div
                  style={{
                    ...styles.resizeHandle,
                    top: -4,
                    left: -4,
                    cursor: "nw-resize",
                  }}
                  onMouseDown={(e) => handleResizeStart(e, layer, "tl")}
                />
                <div
                  style={{
                    ...styles.resizeHandle,
                    top: -4,
                    right: -4,
                    cursor: "ne-resize",
                  }}
                  onMouseDown={(e) => handleResizeStart(e, layer, "tr")}
                />
                <div
                  style={{
                    ...styles.resizeHandle,
                    bottom: -4,
                    left: -4,
                    cursor: "sw-resize",
                  }}
                  onMouseDown={(e) => handleResizeStart(e, layer, "bl")}
                />
                <div
                  style={{
                    ...styles.resizeHandle,
                    bottom: -4,
                    right: -4,
                    cursor: "se-resize",
                  }}
                  onMouseDown={(e) => handleResizeStart(e, layer, "br")}
                />
                {/* Edge handles */}
                <div
                  style={{
                    ...styles.resizeHandle,
                    top: -4,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "40px",
                    height: "8px",
                    borderRadius: "2px",
                    cursor: "ns-resize",
                  }}
                  onMouseDown={(e) => handleResizeStart(e, layer, "t")}
                />
                <div
                  style={{
                    ...styles.resizeHandle,
                    bottom: -4,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "40px",
                    height: "8px",
                    borderRadius: "2px",
                    cursor: "ns-resize",
                  }}
                  onMouseDown={(e) => handleResizeStart(e, layer, "b")}
                />
                <div
                  style={{
                    ...styles.resizeHandle,
                    left: -4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "8px",
                    height: "40px",
                    borderRadius: "2px",
                    cursor: "ew-resize",
                  }}
                  onMouseDown={(e) => handleResizeStart(e, layer, "l")}
                />
                <div
                  style={{
                    ...styles.resizeHandle,
                    right: -4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "8px",
                    height: "40px",
                    borderRadius: "2px",
                    cursor: "ew-resize",
                  }}
                  onMouseDown={(e) => handleResizeStart(e, layer, "r")}
                />
                <span
                  style={{
                    ...styles.infoOverlay,
                    transform: `translateX(-50%) rotate(${-rotation}deg)`,
                  }}
                >
                  {Math.round(layer.size.width)}% ×{" "}
                  {Math.round(layer.size.height)}%
                </span>

                {/* Crop icon button for images */}
                {isImageLayer(layer) && (
                  <button
                    onClick={(e) => toggleCropMode(e, layer.id)}
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-40px",
                      width: "32px",
                      height: "32px",
                      backgroundColor: "#3b82f6",
                      border: "2px solid white",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      transition: "all 0.2s",
                      zIndex: 1000,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2563eb";
                      e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#3b82f6";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                    title="Crop Image"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15" />
                      <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15" />
                    </svg>
                  </button>
                )}
              </>
            )}

            {isSelected &&
              !isEditing &&
              cropModeLayerId === layer.id &&
              isImageLayer(layer) &&
              (() => {
                // CROP MODE - Show crop handles
                const crop = layer.crop || {
                  x: 0,
                  y: 0,
                  width: 100,
                  height: 100,
                };
                const cropBoxStyle: React.CSSProperties = {
                  position: "absolute",
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.width}%`,
                  height: `${crop.height}%`,
                  border: "2px solid #10b981",
                  boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.6)",
                  pointerEvents: "all",
                  cursor: "move",
                };

                const handleStyle: React.CSSProperties = {
                  position: "absolute",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#10b981",
                  border: "2px solid white",
                  borderRadius: "50%",
                  zIndex: 30,
                };

                const edgeHandleStyle: React.CSSProperties = {
                  position: "absolute",
                  backgroundColor: "#10b981",
                  border: "1px solid white",
                  borderRadius: "2px",
                  zIndex: 30,
                };

                return (
                  <>
                    {/* Exit crop mode button */}
                    <button
                      onClick={(e) => toggleCropMode(e, layer.id)}
                      style={{
                        position: "absolute",
                        top: "-4px",
                        right: "-40px",
                        width: "32px",
                        height: "32px",
                        backgroundColor: "#10b981",
                        border: "2px solid white",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        zIndex: 1000,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#059669";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#10b981";
                      }}
                      title="Exit Crop Mode"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </button>

                    {/* Crop box with handles */}
                    <div
                      style={cropBoxStyle}
                      onMouseDown={(e) => handleCropMove(e, layer)}
                    >
                      {/* Corner handles */}
                      <div
                        style={{
                          ...handleStyle,
                          top: "-6px",
                          left: "-6px",
                          cursor: "nwse-resize",
                        }}
                        onMouseDown={(e) => handleCropStart(e, layer, "nw")}
                      />
                      <div
                        style={{
                          ...handleStyle,
                          top: "-6px",
                          right: "-6px",
                          cursor: "nesw-resize",
                        }}
                        onMouseDown={(e) => handleCropStart(e, layer, "ne")}
                      />
                      <div
                        style={{
                          ...handleStyle,
                          bottom: "-6px",
                          left: "-6px",
                          cursor: "nesw-resize",
                        }}
                        onMouseDown={(e) => handleCropStart(e, layer, "sw")}
                      />
                      <div
                        style={{
                          ...handleStyle,
                          bottom: "-6px",
                          right: "-6px",
                          cursor: "nwse-resize",
                        }}
                        onMouseDown={(e) => handleCropStart(e, layer, "se")}
                      />

                      {/* Edge handles */}
                      <div
                        style={{
                          ...edgeHandleStyle,
                          top: "-4px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "40px",
                          height: "8px",
                          cursor: "ns-resize",
                        }}
                        onMouseDown={(e) => handleCropStart(e, layer, "n")}
                      />
                      <div
                        style={{
                          ...edgeHandleStyle,
                          bottom: "-4px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "40px",
                          height: "8px",
                          cursor: "ns-resize",
                        }}
                        onMouseDown={(e) => handleCropStart(e, layer, "s")}
                      />
                      <div
                        style={{
                          ...edgeHandleStyle,
                          left: "-4px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "8px",
                          height: "40px",
                          cursor: "ew-resize",
                        }}
                        onMouseDown={(e) => handleCropStart(e, layer, "w")}
                      />
                      <div
                        style={{
                          ...edgeHandleStyle,
                          right: "-4px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "8px",
                          height: "40px",
                          cursor: "ew-resize",
                        }}
                        onMouseDown={(e) => handleCropStart(e, layer, "e")}
                      />

                      {/* Grid lines (rule of thirds) */}
                      <div
                        style={{
                          position: "absolute",
                          top: "33.333%",
                          left: 0,
                          right: 0,
                          height: "1px",
                          backgroundColor: "rgba(255, 255, 255, 0.4)",
                          pointerEvents: "none",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "66.666%",
                          left: 0,
                          right: 0,
                          height: "1px",
                          backgroundColor: "rgba(255, 255, 255, 0.4)",
                          pointerEvents: "none",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: "33.333%",
                          top: 0,
                          bottom: 0,
                          width: "1px",
                          backgroundColor: "rgba(255, 255, 255, 0.4)",
                          pointerEvents: "none",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: "66.666%",
                          top: 0,
                          bottom: 0,
                          width: "1px",
                          backgroundColor: "rgba(255, 255, 255, 0.4)",
                          pointerEvents: "none",
                        }}
                      />

                      {/* Crop dimensions */}
                      <span
                        style={{
                          position: "absolute",
                          top: "-28px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          backgroundColor: "#10b981",
                          color: "white",
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: "4px",
                          whiteSpace: "nowrap",
                          pointerEvents: "none",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        }}
                      >
                        Crop: {Math.round(crop.width)}% ×{" "}
                        {Math.round(crop.height)}%
                      </span>
                    </div>
                  </>
                );
              })()}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicPreviewOverlay;
