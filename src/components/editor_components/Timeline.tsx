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
      // ✅ Adjusted to 70px to fit Icon + Eye + Lock comfortably
      setLabelWidth(mobile ? 70 : 180);
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

  const timelineWidth = useMemo(() => {
    const multiplier = isMobile ? 0.5 : 2;
    const minWidth = isMobile ? 300 : 800;
    return Math.max(totalFrames * zoom * multiplier, minWidth);
  }, [totalFrames, zoom, isMobile]);

  const frameToPixel = useCallback((frame: number) => (frame / totalFrames) * timelineWidth, [totalFrames, timelineWidth]);
  const pixelToFrame = useCallback((pixel: number) => Math.round((pixel / timelineWidth) * totalFrames), [totalFrames, timelineWidth]);

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

  const handleScroll = useCallback(() => {
    const trackArea = trackAreaRef.current;
    const labels = labelsRef.current;
    const ruler = rulerRef.current;
    if (!trackArea || !labels || !ruler) return;
    
    labels.scrollTop = trackArea.scrollTop;
    ruler.scrollLeft = trackArea.scrollLeft;
  }, []);

  const displayTracks = useMemo(() => [...tracks], [tracks]);

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

  const handleTrackSelect = useCallback((trackId: string | null, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onTrackSelect?.(trackId);
  }, [onTrackSelect]);

  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    if (isDraggingPlayhead.current || dragState || reorderState?.isDragging) return;
    const rect = trackAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left + (trackAreaRef.current?.scrollLeft || 0);
    const newFrame = Math.max(0, Math.min(totalFrames, pixelToFrame(x)));
    onFrameChange(newFrame);
  }, [dragState, reorderState, pixelToFrame, totalFrames, onFrameChange]);

  const handleRulerClick = useCallback((e: React.MouseEvent) => {
    if (isDraggingPlayhead.current || dragState || reorderState?.isDragging) return;
    const rect = rulerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left + (rulerRef.current?.scrollLeft || 0);
    const newFrame = Math.max(0, Math.min(totalFrames, pixelToFrame(x)));
    onFrameChange(newFrame);
  }, [dragState, reorderState, pixelToFrame, totalFrames, onFrameChange]);

  // Playhead Dragging
  const handlePlayheadMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    isDraggingPlayhead.current = true;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingPlayhead.current) return;
      const rect = trackAreaRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = moveEvent.clientX - rect.left + (trackAreaRef.current?.scrollLeft || 0);
      const newFrame = Math.max(0, Math.min(totalFrames, pixelToFrame(x)));
      onFrameChange(newFrame);
    };

    const handleMouseUp = () => {
      isDraggingPlayhead.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [pixelToFrame, totalFrames, onFrameChange]);

  // Track Dragging Logic
  const handleTrackMouseDown = useCallback((
    e: React.MouseEvent,
    track: TimelineTrack,
    type: "move" | "resize-left" | "resize-right",
    trackIndex: number
  ) => {
    if (track.locked) return;
    e.stopPropagation();
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setDragDirection(null);
    handleTrackSelect(track.id, e);

    const rect = trackAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const startX = e.clientX - rect.left + (trackAreaRef.current?.scrollLeft || 0);

    setDragState({
      trackId: track.id,
      type,
      startX,
      startFrame: track.startFrame,
      endFrame: track.endFrame,
    });

    let isReordering = false;
    const reorderStartIndex = trackIndex;
    let reorderCurrentIndex = trackIndex;
    let tempStartFrame = track.startFrame;
    let tempEndFrame = track.endFrame;
    let animationFrameId: number | null = null;
    let hasPendingUpdate = false;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!trackAreaRef.current || !rect) return;

      if (!dragDirection && dragStartPos.current) {
        const deltaX = Math.abs(moveEvent.clientX - dragStartPos.current.x);
        const deltaY = Math.abs(moveEvent.clientY - dragStartPos.current.y);
        
        if (deltaX > 5 || deltaY > 5) {
          if (deltaX > deltaY) {
            setDragDirection("horizontal");
          } else {
            setDragDirection("vertical");
          }
        }
      }

      if (dragDirection === "horizontal" || dragDirection === null) {
        const x = moveEvent.clientX - rect.left + trackAreaRef.current.scrollLeft;
        const deltaFrames = pixelToFrame(x - startX);
        let newStartFrame = track.startFrame;
        let newEndFrame = track.endFrame;

        if (type === "move") {
          newStartFrame = Math.max(0, track.startFrame + deltaFrames);
          newEndFrame = Math.min(totalFrames, track.endFrame + deltaFrames);
          if (newEndFrame === totalFrames) {
            newStartFrame = totalFrames - (track.endFrame - track.startFrame);
          }
        } else if (type === "resize-left") {
          newStartFrame = Math.max(0, Math.min(track.endFrame - 5, track.startFrame + deltaFrames));
        } else if (type === "resize-right") {
          newEndFrame = Math.min(totalFrames, Math.max(track.startFrame + 5, track.endFrame + deltaFrames));
        }

        tempStartFrame = newStartFrame;
        tempEndFrame = newEndFrame;

        if (!hasPendingUpdate) {
          hasPendingUpdate = true;
          animationFrameId = requestAnimationFrame(() => {
            const currentTracks = tracksRef.current;
            const updatedTracks = currentTracks.map(t =>
              t.id === track.id ? { ...t, startFrame: tempStartFrame, endFrame: tempEndFrame } : t
            );
            onTracksChange?.(updatedTracks);
            hasPendingUpdate = false;
          });
        }
      }
      
      if (dragDirection === "vertical" && onReorderTracks) {
        const y = moveEvent.clientY - rect.top + trackAreaRef.current.scrollTop;
        const newIndex = Math.max(0, Math.min(tracks.length - 1, Math.floor(y / TRACK_ROW_HEIGHT)));
        isReordering = true;
        reorderCurrentIndex = newIndex;
        setReorderState({
          trackId: track.id,
          startY: dragStartPos.current?.y || 0,
          startIndex: trackIndex,
          currentIndex: newIndex,
          isDragging: true,
        });
      }
    };

    const handleMouseUp = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        if (dragDirection === "horizontal" || (!dragDirection && !isReordering)) {
          const currentTracks = tracksRef.current;
          const updatedTracks = currentTracks.map(t =>
            t.id === track.id ? { ...t, startFrame: tempStartFrame, endFrame: tempEndFrame } : t
          );
          onTracksChange?.(updatedTracks);
        }
      }
      if (isReordering && reorderCurrentIndex !== reorderStartIndex) {
        onReorderTracks?.(reorderStartIndex, reorderCurrentIndex);
      }
      setDragState(null);
      setReorderState(null);
      setDragDirection(null);
      dragStartPos.current = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [tracks, totalFrames, pixelToFrame, onTracksChange, onReorderTracks, dragDirection, handleTrackSelect]);

  // Reorder Handle logic
  const handleReorderMouseDown = useCallback((e: React.MouseEvent, track: TimelineTrack, trackIndex: number) => {
    if (track.locked) return;
    e.stopPropagation();
    handleTrackSelect(track.id, e);
    const rect = trackAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    setReorderState({
      trackId: track.id,
      startY: e.clientY,
      startIndex: trackIndex,
      currentIndex: trackIndex,
      isDragging: true,
    });
    let currentDragIndex = trackIndex;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!trackAreaRef.current || !rect) return;
      const y = moveEvent.clientY - rect.top + trackAreaRef.current.scrollTop;
      const newIndex = Math.max(0, Math.min(tracks.length - 1, Math.floor(y / TRACK_ROW_HEIGHT)));
      currentDragIndex = newIndex; 
      setReorderState(prev => prev ? { ...prev, currentIndex: newIndex } : null);
    };

    const handleMouseUp = () => {
      if (currentDragIndex !== trackIndex) {
        onReorderTracks?.(trackIndex, currentDragIndex);
      }
      setReorderState(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [tracks, onReorderTracks, handleTrackSelect]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingHorizontal) return;
      e.preventDefault();
      const labelsRect = labelsRef.current?.getBoundingClientRect();
      if (!labelsRect) return;
      const minWidth = 50;
      const maxWidth = 300;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX - labelsRect.left));
      setLabelWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizingHorizontal) {
        setIsResizingHorizontal(false);
        document.body.style.cursor = "default";
      }
    };

    if (isResizingHorizontal) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingHorizontal]);

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

  const timeMarkers = useMemo(() => {
    const markers: { frame: number; label: string; isMajor: boolean }[] = [];
    const pixelsPerSecond = (timelineWidth / totalFrames) * fps;
    let majorInterval: number;
    if (pixelsPerSecond > 100) majorInterval = fps;
    else if (pixelsPerSecond > 40) majorInterval = fps * 2;
    else if (pixelsPerSecond > 20) majorInterval = fps * 5;
    else majorInterval = fps * 10;
    
    for (let f = 0; f <= totalFrames; f += majorInterval) {
      markers.push({ frame: f, label: formatTime(f, fps), isMajor: true });
    }
    return markers;
  }, [totalFrames, fps, timelineWidth]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " && e.target === document.body) {
        e.preventDefault();
        onPlayPause();
      } else if (e.key === "Delete" && selectedTrackId) {
        handleDeleteTrack();
      } else if (e.key.toLowerCase() === "c" && selectedTrackId && !e.ctrlKey && !e.metaKey) {
        handleCutTrack();
      } else if (e.key === "Home") {
        onFrameChange(0);
      } else if (e.key === "End") {
        onFrameChange(totalFrames);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPlayPause, selectedTrackId, handleDeleteTrack, handleCutTrack, onFrameChange, totalFrames]);

  const styles: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column", height: height, backgroundColor: colors.bgSecondary, borderTop: `1px solid ${colors.borderLight}`, fontFamily: "system-ui, -apple-system, sans-serif", userSelect: "none", flexShrink: 0, },
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
   ruler: { position: "relative", height: isMobile ? "22px" : "25px", backgroundColor: colors.bgPrimary, borderBottom: `1px solid ${colors.borderLight}`, cursor: "pointer" },
    rulerInner: { position: "relative", height: "100%", borderLeft: `1px solid ${colors.borderLight}` },
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
    trackLabelControls: { marginLeft: "auto", display: "flex", gap: isMobile ? "1px" : "2px" },
    trackLabelButton: { width: isMobile ? "20px" : "22px", height: isMobile ? "20px" : "22px", border: "none", backgroundColor: "transparent", color: colors.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", transition: "all 0.15s" },
    dragHandle: { width: isMobile ? "14px" : "16px", height: isMobile ? "20px" : "22px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "grab", color: colors.textMuted, transition: "color 0.15s" },
    dragHandleActive: { cursor: "grabbing", color: "#3b82f6" },
    trackArea: { 
      flex: 1, 
      position: "relative", 
      overflowX: "auto", 
      overflowY: "auto", 
      backgroundColor: colors.bgPrimary 
    },
    trackAreaInner: { position: "relative", minHeight: "100%" },
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
    trackClipHandle: { position: "absolute", top: 0, bottom: 0, width: "10px", cursor: "ew-resize", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 },
    trackClipHandleBar: { width: "3px", height: "16px", backgroundColor: "rgba(255, 255, 255, 0.7)", borderRadius: "2px" },
    playhead: { position: "absolute", top: 0, bottom: 0, width: "2px", backgroundColor: "#ef4444", zIndex: 20, pointerEvents: "none" },
    playheadHead: { position: "absolute", top: "-6px", left: "-7px", width: "16px", height: "16px", backgroundColor: "#ef4444", borderRadius: "3px 3px 50% 50%", cursor: "grab", pointerEvents: "auto", display: "flex", alignItems: "center", justifyContent: "center" },
    playheadLine: { position: "absolute", top: "10px", left: "0", width: "2px", bottom: "0", backgroundColor: "#ef4444" },
  };

  const DragHandleIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="6" r="2" /><circle cx="15" cy="6" r="2" />
      <circle cx="9" cy="12" r="2" /><circle cx="15" cy="12" r="2" />
      <circle cx="9" cy="18" r="2" /><circle cx="15" cy="18" r="2" />
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
          <button style={styles.toolButton} onClick={() => onFrameChange(totalFrames)} title="Go to End (End)" onMouseOver={(e) => (e.currentTarget.style.backgroundColor = colors.bgHover)} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}><EditorIcons.SkipForward /></button>
        </div>
        <div style={styles.timeDisplay}>{formatTime(currentFrame, fps)} / {formatTime(totalFrames, fps)}</div>
        <div style={styles.zoomControl}><EditorIcons.ZoomOut /><input type="range" min="0.5" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={styles.zoomSlider} /><EditorIcons.ZoomIn /></div>
      </div>

      <div style={styles.timelineWrapper}>
        <div style={styles.rulerRow}>
          <div style={styles.rulerSpacer} />
          {/* Add wheel handler to ruler for horizontal scrolling */}
          <div style={styles.rulerContent} ref={rulerRef} onWheel={handleRulerWheel}>
            <div style={styles.ruler} onClick={handleRulerClick}>
              <div style={{ ...styles.rulerInner, width: `${timelineWidth}px` }}>
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
                right: 0,
                width: "6px",
                cursor: "ew-resize",
                zIndex: 10,
                backgroundColor: isResizingHorizontal ? 'rgba(59, 130, 246, 0.4)' : 'transparent',
                transition: 'background-color 0.15s',
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsResizingHorizontal(true);
              }}
              onMouseOver={(e) => {
                if (!isResizingHorizontal) e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
              }}
              onMouseOut={(e) => {
                if (!isResizingHorizontal) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            />
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
                      onMouseDown={(e) => handleReorderMouseDown(e, track, index)} 
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
            <div style={{ ...styles.trackAreaInner, width: `${timelineWidth}px` }}>
              {displayTracks.map((track, index) => {
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
                      onMouseDown={(e) => handleTrackMouseDown(e, track, "move", index)}
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
                          onMouseDown={(e) => handleTrackMouseDown(e, track, "resize-left", index)}
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
                          onMouseDown={(e) => handleTrackMouseDown(e, track, "resize-right", index)}
                        >
                          <div style={styles.trackClipHandleBar} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div style={{ ...styles.playhead, left: `${frameToPixel(currentFrame)}px` }}>
                <div style={styles.playheadHead} onMouseDown={handlePlayheadMouseDown} />
                <div style={styles.playheadLine} />
              </div>
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