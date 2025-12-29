import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { EditorIcons } from "./EditorIcons";
import { useTheme } from "../../contexts/ThemeContext";

// ============================================================================
// TYPES
// ============================================================================

export interface TimelineTrack {
  id: string;
  type: "video" | "image" | "text" | "audio";
  label: string;
  color: string;
  startFrame: number;
  endFrame: number;
  locked?: boolean;
  visible?: boolean;
  muted?: boolean;
  data?: Record<string, unknown>;
}

export interface TimelineProps {
  tracks: TimelineTrack[];
  totalFrames: number;
  fps?: number;
  currentFrame: number;
  isPlaying: boolean;
  onFrameChange: (frame: number) => void;
  onPlayPause: () => void;
  onTracksChange?: (tracks: TimelineTrack[]) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  selectedTrackId?: string | null;
  onTrackSelect?: (trackId: string | null) => void;
  onDeleteTrack?: (trackId: string) => void;
  onCutTrack?: (trackId: string, frame: number) => void;
  onReorderTracks?: (fromIndex: number, toIndex: number) => void;
  onEdit?: () => void;
  height?: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatTime = (frames: number, fps: number): string => {
  const totalSeconds = frames / fps;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  } else {
    return `0:${seconds.toString().padStart(2, "0")}`;
  }
};

const getTrackIcon = (type: TimelineTrack["type"]) => {
  switch (type) {
    case "video": return <EditorIcons.Video />;
    case "image": return <EditorIcons.Image />;
    case "text": return <EditorIcons.Type />;
    case "audio": return <EditorIcons.Music />;
    default: return <EditorIcons.Layers />;
  }
};


// ============================================================================
// HELPER: UNIFIED EVENT COORDINATES
// ============================================================================

const getEventCoordinates = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent): { clientX: number; clientY: number; pageX: number; pageY: number } => {
  if ('touches' in e) {
    // Touch event
    const touch = e.touches[0] || e.changedTouches?.[0];
    return {
      clientX: touch?.clientX || 0,
      clientY: touch?.clientY || 0,
      pageX: touch?.pageX || 0,
      pageY: touch?.pageY || 0,
    };
  } else {
    // Mouse event
    return {
      clientX: e.clientX,
      clientY: e.clientY,
      pageX: e.pageX,
      pageY: e.pageY,
    };
  }
};

// ============================================================================
// CONFIGURATION
// ============================================================================

const TRACK_ROW_HEIGHT = 30; 
const TRACK_CLIP_HEIGHT = 24;
const TRACK_CLIP_TOP = (TRACK_ROW_HEIGHT - TRACK_CLIP_HEIGHT) / 2;

// ============================================================================
// TIMELINE COMPONENT
// ============================================================================

export const Timeline: React.FC<TimelineProps> = ({
  tracks,
  totalFrames,
  fps = 30,
  currentFrame,
  isPlaying,
  onFrameChange,
  onPlayPause,
  onTracksChange,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  selectedTrackId,
  onTrackSelect,
  onDeleteTrack,
  onCutTrack,
  onReorderTracks,
  onEdit,
  height = "200px",
}) => {
  const [zoom, setZoom] = useState(1);
  const { colors } = useTheme();  
  
  // Mobile detection & Label Width adjustment
  const [isMobile, setIsMobile] = useState(false);
  const [labelWidth, setLabelWidth] = useState(180); 

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setLabelWidth(mobile ? 85 : 180);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const trackAreaRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  
  const isDraggingPlayhead = useRef(false);
  const tracksRef = useRef<TimelineTrack[]>(tracks);

  const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
  
  const [dragState, setDragState] = useState<{
    trackId: string;
    type: "move" | "resize-left" | "resize-right";
    startX: number;
    startFrame: number;
    endFrame: number;
  } | null>(null);

  const [reorderState, setReorderState] = useState<{
    trackId: string;
    startY: number;
    startIndex: number;
    currentIndex: number;
    isDragging: boolean;
  } | null>(null);
  
  const [dragDirection, setDragDirection] = useState<"horizontal" | "vertical" | null>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  
  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  const [hoveredTrackId, setHoveredTrackId] = useState<string | null>(null);

  // Snap guide state
  const [snapGuide, setSnapGuide] = useState<{
    frame: number;
    visible: boolean;
  } | null>(null);
  
  const SNAP_THRESHOLD_FRAMES = 5; // Snap when within 5 frames

  const effectiveTotalFrames = useMemo(() => {
  const maxTrackEnd = Math.max(...tracks.map(t => t.endFrame), 0);
  return Math.max(totalFrames, maxTrackEnd);
}, [tracks, totalFrames]);

  const timelineWidth = useMemo(() => {
  const multiplier = isMobile ? 0.5 : 2;
  const minWidth = isMobile ? 300 : 800;
  return Math.max(effectiveTotalFrames * zoom * multiplier, minWidth);
}, [effectiveTotalFrames, zoom, isMobile]);

  const frameToPixel = useCallback((frame: number) => (frame / effectiveTotalFrames) * timelineWidth, [effectiveTotalFrames, timelineWidth]);
const pixelToFrame = useCallback((pixel: number) => Math.round((pixel / timelineWidth) * effectiveTotalFrames), [effectiveTotalFrames, timelineWidth]);

  // Get all snap points from other tracks
  const getSnapPoints = useCallback((excludeTrackId: string) => {
    const points: number[] = [0]; // Always snap to frame 0
    tracks.forEach(track => {
      if (track.id !== excludeTrackId) {
        points.push(track.startFrame);
        points.push(track.endFrame);
      }
    });
    // Also add total frames as snap point
    points.push(totalFrames);
    return [...new Set(points)].sort((a, b) => a - b);
  }, [tracks, totalFrames]);

  // Find nearest snap point
  const findSnapPoint = useCallback((frame: number, excludeTrackId: string): { snapped: number; shouldSnap: boolean } => {
    const snapPoints = getSnapPoints(excludeTrackId);
    let nearestPoint = frame;
    let minDistance = Infinity;
    
    for (const point of snapPoints) {
      const distance = Math.abs(frame - point);
      if (distance < minDistance && distance <= SNAP_THRESHOLD_FRAMES) {
        minDistance = distance;
        nearestPoint = point;
      }
    }
    
    return {
      snapped: nearestPoint,
      shouldSnap: minDistance <= SNAP_THRESHOLD_FRAMES
    };
  }, [getSnapPoints, SNAP_THRESHOLD_FRAMES]);

  // Scroll Sync
  useEffect(() => {
    const trackArea = trackAreaRef.current;
    const labels = labelsRef.current;
    const ruler = rulerRef.current;
    if (!trackArea || !labels || !ruler) return;

    const handleScroll = () => {
      labels.scrollTop = trackArea.scrollTop;
      ruler.scrollLeft = trackArea.scrollLeft;
    };

    trackArea.addEventListener("scroll", handleScroll);
    return () => trackArea.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.shiftKey && trackAreaRef.current) {
        // Optional shift scroll handling
    }
  }, []);

  const handleRulerWheel = useCallback((e: React.WheelEvent) => {
    if (trackAreaRef.current) {
      trackAreaRef.current.scrollLeft += e.deltaY;
    }
  }, []);

  const handleLabelsWheel = useCallback((e: React.WheelEvent) => {
    const trackArea = trackAreaRef.current;
    if (trackArea) {
      trackArea.scrollTop += e.deltaY;
    }
  }, []);

  const handleScroll = useCallback((_e: React.UIEvent<HTMLDivElement>) => {
    const trackArea = trackAreaRef.current;
    const labels = labelsRef.current;
    const ruler = rulerRef.current;
    if (!trackArea || !labels || !ruler) return;

    labels.scrollTop = trackArea.scrollTop;
    ruler.scrollLeft = trackArea.scrollLeft;
  }, []);

  const displayTracks = useMemo(() => {
    if (!reorderState?.isDragging) return tracks;
    const result = [...tracks];
    const [movedTrack] = result.splice(reorderState.startIndex, 1);
    result.splice(reorderState.currentIndex, 0, movedTrack);
    return result;
  }, [tracks, reorderState]);

  const canCut = selectedTrackId !== null && !tracks.find(t => t.id === selectedTrackId)?.locked;
  const canDelete = selectedTrackId !== null;

  const handleCutTrack = useCallback(() => {
    if (!canCut || !selectedTrackId) return;
    onCutTrack?.(selectedTrackId, currentFrame);
  }, [canCut, selectedTrackId, currentFrame, onCutTrack]);

  const handleDeleteTrack = useCallback(() => {
    if (!canDelete || !selectedTrackId) return;
    onDeleteTrack?.(selectedTrackId);
  }, [canDelete, selectedTrackId, onDeleteTrack]);

  const handleTrackSelect = useCallback((trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTrackSelect) {
      onTrackSelect(trackId);
    }
  }, [onTrackSelect]);

  

  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
  const rect = trackAreaRef.current?.getBoundingClientRect();
  if (rect) {
    const x = e.clientX - rect.left + (trackAreaRef.current?.scrollLeft || 0);
    const frame = pixelToFrame(x);
    onFrameChange(Math.max(0, Math.min(totalFrames, frame)));
  }
  if (onTrackSelect) {
    onTrackSelect(null);
  }
}, [onTrackSelect, pixelToFrame, totalFrames, onFrameChange]);



  const handleRulerClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const rect = rulerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const coords = getEventCoordinates(e);
    const x = coords.clientX - rect.left + (rulerRef.current?.scrollLeft || 0);
    const frame = pixelToFrame(x);
    onFrameChange(Math.max(0, Math.min(totalFrames, frame)));
  }, [pixelToFrame, totalFrames, onFrameChange]);

  // Playhead Dragging
  const handlePlayheadPointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isDraggingPlayhead.current = true;
  }, []);

// Track Dragging Logic
  const handleTrackPointerDown = useCallback((
    e: React.MouseEvent | React.TouchEvent,
    track: TimelineTrack,
    type: "move" | "resize-left" | "resize-right",
    // index: number
  ) => {
    if (track.locked) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    const coords = getEventCoordinates(e);
    const rect = trackAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = coords.clientX - rect.left + (trackAreaRef.current?.scrollLeft || 0);
    
    setDragState({
      trackId: track.id,
      type,
      startX: x,
      startFrame: track.startFrame,
      endFrame: track.endFrame,
    });
    
    if (onTrackSelect) {
      onTrackSelect(track.id);
    }
    
    dragStartPos.current = { x: coords.clientX, y: coords.clientY };
    setDragDirection(null);
  }, [onTrackSelect]);

  // Reorder Handle logic
  const handleReorderPointerDown = useCallback((e: React.MouseEvent | React.TouchEvent, track: TimelineTrack, index: number) => {
    if (track.locked || !onReorderTracks) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    const coords = getEventCoordinates(e);
    
    setReorderState({
      trackId: track.id,
      startY: coords.clientY,
      startIndex: index,
      currentIndex: index,
      isDragging: true,
    });
    
    dragStartPos.current = { x: coords.clientX, y: coords.clientY };
    setDragDirection(null);
  }, [onReorderTracks]);

  const handleHorizontalResizePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizingHorizontal(true);
  }, []);

  // Global event handlers for all drag operations
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const coords = getEventCoordinates(e);
      
      // Horizontal Resize
      if (isResizingHorizontal) {
        const newWidth = Math.max(70, Math.min(300, coords.clientX));
        setLabelWidth(newWidth);
        return;
      }
      
      // Playhead Dragging
      if (isDraggingPlayhead.current) {
        const rect = trackAreaRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = coords.clientX - rect.left + (trackAreaRef.current?.scrollLeft || 0);
        const frame = pixelToFrame(x);
        onFrameChange(Math.max(0, Math.min(effectiveTotalFrames, frame)));
        return;
      }
      
      // Track Reordering
      if (reorderState?.isDragging && onReorderTracks) {
        if (!dragDirection && dragStartPos.current) {
          const dx = Math.abs(coords.clientX - dragStartPos.current.x);
          const dy = Math.abs(coords.clientY - dragStartPos.current.y);
          if (dx > 5 || dy > 5) {
            setDragDirection(dy > dx ? "vertical" : "horizontal");
          }
        }
        
        if (dragDirection === "vertical" || !dragDirection) {
          const deltaY = coords.clientY - reorderState.startY;
          const newIndex = Math.max(0, Math.min(tracks.length - 1, reorderState.startIndex + Math.round(deltaY / TRACK_ROW_HEIGHT)));
          
          if (newIndex !== reorderState.currentIndex) {
            setReorderState({ ...reorderState, currentIndex: newIndex });
          }
        }
        return;
      }
      
      // Track Clip Dragging/Resizing
      if (dragState) {
        if (!dragDirection && dragStartPos.current) {
          const dx = Math.abs(coords.clientX - dragStartPos.current.x);
          const dy = Math.abs(coords.clientY - dragStartPos.current.y);
          if (dx > 5 || dy > 5) {
            setDragDirection(dy > dx ? "vertical" : "horizontal");
          }
        }
        
        if (dragDirection === "horizontal" || !dragDirection) {
          const rect = trackAreaRef.current?.getBoundingClientRect();
          if (!rect) return;
          
          const x = coords.clientX - rect.left + (trackAreaRef.current?.scrollLeft || 0);
          const deltaX = x - dragState.startX;
          const deltaFrames = pixelToFrame(deltaX);
          
          let snapFrame: number | null = null;
          
          const updatedTracks = tracksRef.current.map((t) => {
            if (t.id !== dragState.trackId) return t;
            
            let newStart = dragState.startFrame;
            let newEnd = dragState.endFrame;
            
            if (dragState.type === "move") {
              const duration = dragState.endFrame - dragState.startFrame;
              newStart = dragState.startFrame + deltaFrames;
              newEnd = dragState.endFrame + deltaFrames;
              
              // Check snap for start edge
              const startSnap = findSnapPoint(newStart, dragState.trackId);
              // Check snap for end edge
              const endSnap = findSnapPoint(newEnd, dragState.trackId);
              
              // Prefer the closer snap
              if (startSnap.shouldSnap && (!endSnap.shouldSnap || Math.abs(newStart - startSnap.snapped) <= Math.abs(newEnd - endSnap.snapped))) {
                const snapDelta = startSnap.snapped - newStart;
                newStart = startSnap.snapped;
                newEnd = newStart + duration;
                snapFrame = startSnap.snapped;
              } else if (endSnap.shouldSnap) {
                const snapDelta = endSnap.snapped - newEnd;
                newEnd = endSnap.snapped;
                newStart = newEnd - duration;
                snapFrame = endSnap.snapped;
              }
              
              // Only clamp to start (preserve duration), allow extending past end
              if (newStart < 0) {
                newStart = 0;
                newEnd = duration;
                snapFrame = 0;
              }
            } else if (dragState.type === "resize-left") {
              newStart = Math.max(0, Math.min(dragState.endFrame - 1, dragState.startFrame + deltaFrames));
              
              // Snap the left edge
              const startSnap = findSnapPoint(newStart, dragState.trackId);
              if (startSnap.shouldSnap) {
                newStart = Math.max(0, Math.min(dragState.endFrame - 1, startSnap.snapped));
                snapFrame = startSnap.snapped;
              }
            } else if (dragState.type === "resize-right") {
              newEnd = Math.max(dragState.startFrame + 1, dragState.endFrame + deltaFrames);
              
              // Snap the right edge
              const endSnap = findSnapPoint(newEnd, dragState.trackId);
              if (endSnap.shouldSnap) {
                newEnd = Math.max(dragState.startFrame + 1, endSnap.snapped);
                snapFrame = endSnap.snapped;
              }
            }
            
            return { ...t, startFrame: newStart, endFrame: newEnd };
          });
          
          // Update snap guide
          if (snapFrame !== null) {
            setSnapGuide({ frame: snapFrame, visible: true });
          } else {
            setSnapGuide(null);
          }
          
          if (onTracksChange) {
            onTracksChange(updatedTracks);
          }
        }
      }
    };

    const handleEnd = () => {
      if (isResizingHorizontal) {
        setIsResizingHorizontal(false);
      }
      
      if (isDraggingPlayhead.current) {
        isDraggingPlayhead.current = false;
      }
      
      if (reorderState?.isDragging && onReorderTracks) {
        if (reorderState.startIndex !== reorderState.currentIndex) {
          onReorderTracks(reorderState.startIndex, reorderState.currentIndex);
        }
        setReorderState(null);
      }
      
      if (dragState) {
        setDragState(null);
        setSnapGuide(null);
      }
      
      setDragDirection(null);
      dragStartPos.current = null;
    };

    // 🔥 CRITICAL: Add both mouse AND touch events
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
    window.addEventListener("touchcancel", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("touchcancel", handleEnd);
    };
  }, [dragState, reorderState, isResizingHorizontal, onTracksChange, onReorderTracks, pixelToFrame, totalFrames, onFrameChange, tracks.length, dragDirection, findSnapPoint]);

  const handleToggleLock = useCallback((trackId: string) => {
    const updatedTracks = tracks.map(t =>
      t.id === trackId ? { ...t, locked: !t.locked } : t
    );
    onTracksChange?.(updatedTracks);
  }, [tracks, onTracksChange]);

  const handleToggleVisibility = useCallback((trackId: string) => {
    const updatedTracks = tracks.map(t =>
      t.id === trackId ? { ...t, visible: t.visible === false ? true : false } : t
    );
    onTracksChange?.(updatedTracks);
  }, [tracks, onTracksChange]);

  const handleToggleMute = useCallback((trackId: string) => {
    const updatedTracks = tracks.map(t =>
      t.id === trackId ? { ...t, muted: t.muted === true ? false : true } : t
    );
    onTracksChange?.(updatedTracks);
  }, [tracks, onTracksChange]);

  const timeMarkers = useMemo(() => {
  const markers: { frame: number; label: string; isMajor: boolean }[] = [];
  const pixelsPerSecond = (timelineWidth / effectiveTotalFrames) * fps;
  let majorInterval: number;
  if (pixelsPerSecond > 100) majorInterval = fps;
  else if (pixelsPerSecond > 40) majorInterval = fps * 2;
  else if (pixelsPerSecond > 20) majorInterval = fps * 5;
  else majorInterval = fps * 10;
  
  for (let f = 0; f <= effectiveTotalFrames; f += majorInterval) {
    markers.push({ frame: f, label: formatTime(f, fps), isMajor: true });
  }
  
  // Always include exact end marker
  const lastMarkerFrame = markers[markers.length - 1]?.frame;
  if (lastMarkerFrame !== effectiveTotalFrames) {
    markers.push({ frame: effectiveTotalFrames, label: formatTime(effectiveTotalFrames, fps), isMajor: true });
  }
  
  return markers;
}, [effectiveTotalFrames, fps, timelineWidth]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " && e.target === document.body) {
        e.preventDefault();
        onPlayPause();
      } else if (e.key === "Delete" && selectedTrackId) {
        handleDeleteTrack();
      } else if (e.key === "Home") {
        onFrameChange(0);
     } else if (e.key === "End") {
  onFrameChange(effectiveTotalFrames);
}
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPlayPause, selectedTrackId, handleDeleteTrack, handleCutTrack, onFrameChange, totalFrames]);

  const styles: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column", height: height || (isMobile ? "40vh" : "300px"), backgroundColor: colors.bgSecondary, borderTop: `1px solid ${colors.borderLight}`, fontFamily: "system-ui, -apple-system, sans-serif", userSelect: "none", flexShrink: 0, WebkitTouchCallout: 'none', WebkitUserSelect: 'none' },
    toolbar: { display: "flex", alignItems: "center", gap: isMobile ? "4px" : "8px", padding: isMobile ? "4px 8px" : "4px 16px", flexWrap: isMobile ? "wrap" : "nowrap", borderBottom: `1px solid ${colors.borderLight}`, backgroundColor: colors.bgPrimary },
    toolGroup: { display: "flex", gap: isMobile ? "4px" : "6px" },
    divider: { width: "1px", height: isMobile ? "20px" : "24px", backgroundColor: colors.borderLight },
    toolButton: { width: isMobile ? "26px" : "28px", height: isMobile ? "28px" : "30px", border: "none", backgroundColor: "transparent", color: colors.textPrimary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", transition: "all 0.15s" },
    toolButtonActive: { backgroundColor: "#3b82f6", color: "white" },
    toolButtonDisabled: { opacity: 0.3, cursor: "not-allowed" },
    timeDisplay: { marginLeft: "auto", marginRight: isMobile ? "6px" : "12px", fontSize: isMobile ? "11px" : "13px", color: colors.textSecondary, fontVariantNumeric: "tabular-nums" },
    zoomControl: { display: "flex", alignItems: "center", gap: isMobile ? "4px" : "8px", color: colors.textMuted },
    zoomSlider: { width: isMobile ? "60px" : "80px", cursor: "pointer" },
    timelineWrapper: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
    rulerRow: { display: "flex", borderBottom: `1px solid ${colors.borderLight}`, backgroundColor: colors.bgPrimary },
    rulerSpacer: { width: `${labelWidth}px`, flexShrink: 0, backgroundColor: colors.bgSecondary },
    rulerContent: { flex: 1, overflow: "hidden", position: "relative" },
   ruler: { position: "relative", height: isMobile ? "22px" : "25px", backgroundColor: colors.bgPrimary, borderBottom: `1px solid ${colors.borderLight}`, cursor: "pointer", touchAction: "none" },
    rulerInner: { position: "relative", height: "100%", borderLeft: `1px solid ${colors.borderLight}`, borderRight: `1px solid ${colors.borderLight}` },
    rulerMarker: { 
      position: "absolute", 
      top: "0px", 
      transform: "translateX(-50%)", 
      fontSize: isMobile ? "7px" : "8px", 
      fontWeight: 500,
      color: colors.textSecondary,
      whiteSpace: "nowrap",
      padding: isMobile ? "1px 4px" : "2px 6px",
      backgroundColor: colors.bgPrimary,
      borderRadius: "3px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2px"
    },
    rulerTick: {
      position: "absolute",
      bottom: 0,
      width: "1px",
      backgroundColor: colors.borderLight,
      height: isMobile ? "6px" : "8px"
    },
    rulerTickMajor: {
      height: isMobile ? "10px" : "12px",
      backgroundColor: colors.textMuted,
      width: "2px"
    },
    contentWrapper: { flex: 1, display: "flex", overflow: "hidden" },
    trackLabels: { width: `${labelWidth}px`, flexShrink: 0, overflow: "hidden", backgroundColor: colors.bgSecondary, borderRight: `1px solid ${colors.borderLight}`, position: 'relative' },
    trackLabel: { 
      height: `${TRACK_ROW_HEIGHT}px`, 
      display: "flex", 
      alignItems: "center", 
      gap: isMobile ? "4px" : "8px", 
      padding: isMobile ? "0 4px" : "0 8px", 
      borderBottom: `1px solid ${colors.borderLight}`, 
      cursor: "pointer", 
      transition: "all 0.15s", 
      fontSize: isMobile ? "11px" : "13px", 
      fontWeight: 500, 
      color: colors.textSecondary,
      backgroundColor: colors.bgSecondary,
      // On mobile, justify "space-between" to fit Icon + Buttons. On desktop, standard flex-start.
      justifyContent: isMobile ? "space-between" : "flex-start",
    },
    trackLabelSelected: { 
      backgroundColor: "rgba(59, 130, 246, 0.15)", 
      borderLeft: "3px solid #3b82f6",
      color: colors.textPrimary,
    },
    trackLabelHidden: { opacity: 0.5 },
    trackLabelReordering: { backgroundColor: "rgba(59, 130, 246, 0.25)", boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)" },
    trackLabelIcon: { opacity: 0.6, fontSize: isMobile ? "14px" : "16px" },
    trackLabelControls: { marginLeft: "auto", display: "flex", gap: isMobile ? "4px" : "2px", minWidth: isMobile ? "60px" : "auto" },
    trackLabelButton: { width: isMobile ? "20px" : "22px", height: isMobile ? "20px" : "22px", border: "none", backgroundColor: "transparent", color: colors.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", transition: "all 0.15s", touchAction: "none", WebkitTouchCallout: 'none', WebkitUserSelect: 'none' },
    dragHandle: { width: isMobile ? "20px" : "16px", height: isMobile ? "24px" : "22px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "grab", color: colors.textMuted, transition: "color 0.15s", touchAction: "none", WebkitTouchCallout: 'none', WebkitUserSelect: 'none' },
    dragHandleActive: { cursor: "grabbing", color: "#3b82f6" },
    trackArea: { 
      flex: 1, 
      position: "relative", 
      overflowX: "auto", 
      overflowY: "auto", 
      backgroundColor: colors.bgPrimary 
    },
    trackAreaInner: { position: "relative", minHeight: "100%", minWidth: "100%", borderLeft: `1px solid ${colors.borderLight}`, borderRight: `1px solid ${colors.borderLight}` },
    trackRow: {
      height: `${TRACK_ROW_HEIGHT}px`,
      position: "relative",
      borderBottom: `1px solid ${colors.borderLight}`,
      boxSizing: "border-box",
    },
    trackRowReordering: { backgroundColor: "rgba(59, 130, 246, 0.1)" },
    dropIndicator: { position: "absolute", left: 0, right: 0, height: "2px", backgroundColor: "#3b82f6", zIndex: 100 },
    trackClip: {
      position: "absolute",
      top: `${TRACK_CLIP_TOP}px`,
      height: `${TRACK_CLIP_HEIGHT}px`,
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: isMobile ? "10px" : "11px",
      fontWeight: 600,
      cursor: "grab",
      transition: "box-shadow 0.15s, opacity 0.15s, transform 0.1s",
      userSelect: "none",
      overflow: "hidden",
      touchAction: "none",
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
    },
    trackClipSelected: { 
      boxShadow: "0 0 0 2px #3b82f6, 0 4px 12px rgba(59, 130, 246, 0.3)",
      transform: "translateY(-1px)",
    },
    trackClipHovered: {
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      transform: "translateY(-1px)",
      
    },
    trackClipLocked: { cursor: "not-allowed" },
    trackClipHidden: { opacity: 0.3 },
    trackClipHandle: { position: "absolute", top: 0, bottom: 0, width: isMobile ? "16px" : "10px", cursor: "ew-resize", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, touchAction: "none", WebkitTouchCallout: 'none', WebkitUserSelect: 'none' },
    trackClipHandleBar: { width: isMobile ? "4px" : "3px", height: isMobile ? "20px" : "16px", backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "2px" },
    playhead: { position: "absolute", top: 0, bottom: 0, width: "2px", backgroundColor: "#ef4444", zIndex: 20, pointerEvents: "none" },
    playheadHead: { position: "sticky", top: "-14px", left: "50%", transform: "translateX(-50%)", width: isMobile ? "20px" : "16px", height: isMobile ? "20px" : "16px", backgroundColor: "#ef4444", borderRadius: "3px 3px 50% 50%", cursor: "grab", pointerEvents: "auto", display: "flex", alignItems: "center", justifyContent: "center", touchAction: "none", WebkitTouchCallout: 'none', WebkitUserSelect: 'none' },
    playheadLine: { position: "absolute", top: "10px", left: "0", width: "2px", bottom: "0", backgroundColor: "#ef4444" },
  };

  const DragHandleIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="6" r="2" /><circle cx="15" cy="6" r="2" />
      <circle cx="9" cy="12" r="2" /><circle cx="15" cy="12" r="2" />
      <circle cx="9" cy="18" r="2" /><circle cx="15" cy="18" r="2" />
    </svg>
  );

  const ExpandHorizontalIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 8l-4 4 4 4" />
    <path d="M15 8l4 4-4 4" />
  </svg>
);

  return (
    <div style={styles.container} data-timeline="true">
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolGroup}>
          <button style={{ ...styles.toolButton, ...(canUndo ? {} : styles.toolButtonDisabled) }} onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)" onMouseOver={(e) => canUndo && (e.currentTarget.style.backgroundColor = colors.bgHover)} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}><EditorIcons.Undo /></button>
          <button style={{ ...styles.toolButton, ...(canRedo ? {} : styles.toolButtonDisabled) }} onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)" onMouseOver={(e) => canRedo && (e.currentTarget.style.backgroundColor = colors.bgHover)} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}><EditorIcons.Redo /></button>
        </div>
        <div style={styles.divider} />
        <div style={styles.toolGroup}>
          {isMobile && selectedTrackId && onEdit && (
            <button 
              style={{ 
                ...styles.toolButton, 
                backgroundColor: colors.accent,
                color: colors.bgPrimary 
              }} 
              onClick={onEdit} 
              title="Edit Layer" 
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = colors.accentHover || colors.accent;
              }} 
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = colors.accent;
              }}
            >
              <EditorIcons.Edit />
            </button>
          )}
          <button style={{ ...styles.toolButton, ...(!canCut ? styles.toolButtonDisabled : {}) }} onClick={handleCutTrack} disabled={!canCut} title="Cut at Playhead (C)" onMouseOver={(e) => canCut && (e.currentTarget.style.backgroundColor = colors.bgHover)} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}><EditorIcons.Split /></button>
          <button style={{ ...styles.toolButton, ...(!canDelete ? styles.toolButtonDisabled : {}) }} onClick={handleDeleteTrack} disabled={!canDelete} title="Delete Track (Del)" onMouseOver={(e) => canDelete && (e.currentTarget.style.backgroundColor = colors.bgHover)} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}><EditorIcons.Trash /></button>
        </div>
        <div style={styles.divider} />
        <div style={styles.toolGroup}>
          <button style={styles.toolButton} onClick={() => onFrameChange(0)} title="Go to Start (Home)" onMouseOver={(e) => (e.currentTarget.style.backgroundColor = colors.bgHover)} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}><EditorIcons.SkipBack /></button>
          <button style={{ ...styles.toolButton, ...(isPlaying ? styles.toolButtonActive : {}) }} onClick={onPlayPause} title={isPlaying ? "Pause (Space)" : "Play (Space)"} onMouseOver={(e) => !isPlaying && (e.currentTarget.style.backgroundColor = colors.bgHover)} onMouseOut={(e) => !isPlaying && (e.currentTarget.style.backgroundColor = "transparent")}>{isPlaying ? <EditorIcons.Pause /> : <EditorIcons.Play />}</button>
          <button style={styles.toolButton} onClick={() => onFrameChange(effectiveTotalFrames)} title="Go to End (End)" onMouseOver={(e) => (e.currentTarget.style.backgroundColor = colors.bgHover)} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}><EditorIcons.SkipForward /></button>
        </div>
        <div style={styles.timeDisplay}>{formatTime(currentFrame, fps)} / {formatTime(effectiveTotalFrames, fps)}</div>
        <div style={styles.zoomControl}><EditorIcons.ZoomOut /><input type="range" min="0.5" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={styles.zoomSlider} /><EditorIcons.ZoomIn /></div>
      </div>

      <div style={styles.timelineWrapper}>
        <div style={styles.rulerRow}>
          <div style={styles.rulerSpacer} />
          {/* Add wheel handler to ruler for horizontal scrolling */}
          <div style={styles.rulerContent} ref={rulerRef} onWheel={handleRulerWheel}>
            <div style={styles.ruler} onClick={handleRulerClick} onTouchStart={handleRulerClick}>
              <div style={{ ...styles.rulerInner, width: `${Math.max(timelineWidth, 1500)}px` }}>
                {timeMarkers.map(({ frame, label, isMajor }) => (
                  <React.Fragment key={frame}>
                    <div 
                      style={{ 
                        ...styles.rulerTick, 
                        ...(isMajor ? styles.rulerTickMajor : {}),
                        left: `${frameToPixel(frame)}px` 
                      }} 
                    />
                    <div 
                      style={{ 
                        ...styles.rulerMarker, 
                        left: `${frameToPixel(frame)}px` 
                      }}
                    >
                      {label}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.contentWrapper}>
          <div style={styles.trackLabels} ref={labelsRef} onWheel={handleLabelsWheel}>
            <div
  style={{
    position: "absolute",
    top: 0,
    bottom: 0,
    right: isMobile ? -10 : 0, 
width: isMobile ? "12px" : "6px", 
cursor: "ew-resize",
    zIndex: 10,
    backgroundColor: isResizingHorizontal ? 'rgba(59, 130, 246, 0.4)' : 'transparent',
    transition: 'background-color 0.15s',
    touchAction: 'none',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
  onMouseDown={handleHorizontalResizePointerDown}
  onTouchStart={handleHorizontalResizePointerDown}
  onMouseOver={(e) => {
    if (!isResizingHorizontal) e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
  }}
  onMouseOut={(e) => {
    if (!isResizingHorizontal) e.currentTarget.style.backgroundColor = 'transparent';
  }}
>
  {/* Arrow indicator - only show on mobile */}
  {isMobile && (
    <div
      style={{
        color: colors.textMuted,
        opacity: isResizingHorizontal ? 1 : 0.5,
        transition: 'opacity 0.2s',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ExpandHorizontalIcon />
    </div>
  )}
</div>
            {displayTracks.map((track, index) => {
              const isBeingReordered = reorderState?.isDragging && reorderState?.trackId === track.id;
              const isSelected = selectedTrackId === track.id;
              
              return (
                <div 
                  key={track.id} 
                  style={{ 
                    ...styles.trackLabel, 
                    ...(isSelected ? styles.trackLabelSelected : {}), 
                    ...(track.visible === false ? styles.trackLabelHidden : {}), 
                    ...(isBeingReordered ? styles.trackLabelReordering : {}) 
                  }} 
                  onClick={(e) => handleTrackSelect(track.id, e)}
                  onMouseEnter={() => setHoveredTrackId(track.id)}
                  onMouseLeave={() => setHoveredTrackId(null)}
                >
                  {onReorderTracks && !track.locked && (
                    <div 
                      style={{ ...styles.dragHandle, ...(isBeingReordered ? styles.dragHandleActive : {}) }} 
                      onMouseDown={(e) => handleReorderPointerDown(e, track, index)}
                      onTouchStart={(e) => handleReorderPointerDown(e, track, index)} 
                      onMouseOver={(e) => (e.currentTarget.style.color = colors.textSecondary)} 
                      onMouseOut={(e) => (e.currentTarget.style.color = isBeingReordered ? "#3b82f6" : colors.textMuted)} 
                      title="Drag to reorder"
                    >
                      <DragHandleIcon />
                    </div>
                  )}
                  <span style={styles.trackLabelIcon}>{getTrackIcon(track.type)}</span>
                  
                  {/* ✅ SHOW LABEL TEXT ONLY ON DESKTOP */}
                  {!isMobile && (
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.label}</span>
                  )}

                  {/* ✅ ALWAYS SHOW CONTROLS (LOCK/VISIBILITY) */}
                  <div style={styles.trackLabelControls}>
                    <button 
                      style={{ ...styles.trackLabelButton, color: track.visible === false ? "#ef4444" : colors.textMuted }} 
                      onClick={(e) => { e.stopPropagation(); handleToggleVisibility(track.id); }} 
                      title={track.visible === false ? "Show" : "Hide"} 
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = colors.bgHover)} 
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      {track.visible === false ? <EditorIcons.EyeOff /> : <EditorIcons.Eye />}
                    </button>
                    {(track.type === "video" || track.type === "audio") && (
                      <button 
                        style={{ ...styles.trackLabelButton, color: track.muted ? "#ef4444" : colors.textMuted }} 
                        onClick={(e) => { e.stopPropagation(); handleToggleMute(track.id); }} 
                        title={track.muted ? "Unmute" : "Mute"} 
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = colors.bgHover)} 
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {track.muted ? (
                            <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></>
                          ) : (
                            <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></>
                          )}
                        </svg>
                      </button>
                    )}
                    <button 
                      style={{ ...styles.trackLabelButton, color: track.locked ? "#f59e0b" : colors.textMuted }} 
                      onClick={(e) => { e.stopPropagation(); handleToggleLock(track.id); }} 
                      title={track.locked ? "Unlock" : "Lock"} 
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = colors.bgHover)} 
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      {track.locked ? <EditorIcons.Lock /> : <EditorIcons.Unlock />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={styles.trackArea} ref={trackAreaRef} onClick={handleTimelineClick} onScroll={handleScroll} onWheel={handleWheel}>
            <div style={{ ...styles.trackAreaInner, width: `${Math.max(timelineWidth, 1500)}px` }}>
              {displayTracks.map((track) => {
                const isBeingReordered = reorderState?.isDragging && reorderState?.trackId === track.id;
                const isSelected = selectedTrackId === track.id;
                const isHovered = hoveredTrackId === track.id;
                
                return (
                  <div key={track.id} style={{ ...styles.trackRow, ...(isBeingReordered ? styles.trackRowReordering : {}) }}>
                    <div 
                      style={{
                        ...styles.trackClip, 
                        backgroundColor: track.color, 
                        left: `${frameToPixel(track.startFrame)}px`, 
                        width: `${Math.max(20, frameToPixel(track.endFrame - track.startFrame))}px`,
                        ...(isSelected ? styles.trackClipSelected : {}),
                        ...(isHovered && !isSelected ? styles.trackClipHovered : {}),
                        ...(track.locked ? styles.trackClipLocked : {}), 
                        ...(track.visible === false ? styles.trackClipHidden : {}),
                        ...(isBeingReordered ? { opacity: 0.7, boxShadow: "0 4px 12px rgba(0,0,0,0.4)" } : {}), 
                        cursor: track.locked ? "not-allowed" : (reorderState?.isDragging ? "grabbing" : (dragState?.trackId === track.id ? "grabbing" : "grab")),
                      }} 
                      onMouseDown={(e) => handleTrackPointerDown(e, track, "move")}
                      onTouchStart={(e) => handleTrackPointerDown(e, track, "move")}
                      onMouseEnter={() => setHoveredTrackId(track.id)}
                      onMouseLeave={() => setHoveredTrackId(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackSelect(track.id, e);
                      }}
                    >
                      {!track.locked && (
                        <div 
                          style={{ ...styles.trackClipHandle, left: 0 }} 
                          onMouseDown={(e) => handleTrackPointerDown(e, track, "resize-left")}
                          onTouchStart={(e) => handleTrackPointerDown(e, track, "resize-left")}
                        >
                          <div style={styles.trackClipHandleBar} />
                        </div>
                      )}
                      <span style={{ color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.5)", pointerEvents: "none", padding: "0 16px" }}>
                        {track.label}
                      </span>
                      {!track.locked && (
                        <div 
                          style={{ ...styles.trackClipHandle, right: 0 }} 
                          onMouseDown={(e) => handleTrackPointerDown(e, track, "resize-right")}
                          onTouchStart={(e) => handleTrackPointerDown(e, track, "resize-right")}
                        >
                          <div style={styles.trackClipHandleBar} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div style={{ ...styles.playhead, left: `${frameToPixel(currentFrame)}px` }}>
                <div 
                  style={styles.playheadHead} 
                  onMouseDown={handlePlayheadPointerDown}
                  onTouchStart={handlePlayheadPointerDown}
                />
                <div style={styles.playheadLine} />
              </div>
              
              {/* Snap Guide Line */}
              {snapGuide?.visible && (
                <div
                  style={{
                    position: "absolute",
                    left: `${frameToPixel(snapGuide.frame)}px`,
                    top: 0,
                    bottom: 0,
                    width: "2px",
                    backgroundColor: "#f43f5e",
                    boxShadow: "0 0 8px rgba(244, 63, 94, 0.8)",
                    zIndex: 100,
                    pointerEvents: "none",
                  }}
                />
              )}
              
              {reorderState?.isDragging && reorderState.currentIndex !== reorderState.startIndex && (
                <div style={{ ...styles.dropIndicator, top: `${reorderState.currentIndex * TRACK_ROW_HEIGHT}px` }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;