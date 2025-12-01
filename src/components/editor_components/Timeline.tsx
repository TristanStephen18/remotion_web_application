

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { EditorIcons } from "./EditorIcons";

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
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatTime = (frames: number, fps: number): string => {
  const totalSeconds = frames / fps;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const remainingFrames = Math.floor(frames % fps);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${remainingFrames.toString().padStart(2, "0")}`;
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

// ✅ Define height constants here to ensure logic and styles match
const TRACK_ROW_HEIGHT = 36; 
const TRACK_CLIP_HEIGHT = 28;
const TRACK_CLIP_TOP = (TRACK_ROW_HEIGHT - TRACK_CLIP_HEIGHT) / 2; // Centers the clip

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
}) => {
  const [zoom, setZoom] = useState(1);
  
  const trackAreaRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  
  const isDraggingPlayhead = useRef(false);
  
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

  const timelineWidth = useMemo(() => Math.max(totalFrames * zoom * 2, 800), [totalFrames, zoom]);

  const frameToPixel = useCallback((frame: number) => (frame / totalFrames) * timelineWidth, [totalFrames, timelineWidth]);
  const pixelToFrame = useCallback((pixel: number) => Math.round((pixel / timelineWidth) * totalFrames), [totalFrames, timelineWidth]);

  // Scroll Sync
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    if (labelsRef.current) labelsRef.current.scrollTop = scrollTop;
    if (rulerRef.current) rulerRef.current.scrollLeft = scrollLeft;
  }, []);

  const handleLabelsWheel = useCallback((e: React.WheelEvent) => {
    if (trackAreaRef.current) trackAreaRef.current.scrollTop += e.deltaY;
  }, []);

  // Playhead Logic
  const handlePlayheadMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    isDraggingPlayhead.current = true;
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingPlayhead.current || !trackAreaRef.current) return;
      const rect = trackAreaRef.current.getBoundingClientRect();
      const x = moveEvent.clientX - rect.left + trackAreaRef.current.scrollLeft;
      const frame = Math.max(0, Math.min(totalFrames, pixelToFrame(x)));
      onFrameChange(frame);
    };
    const handleMouseUp = () => {
      isDraggingPlayhead.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [totalFrames, pixelToFrame, onFrameChange]);

  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    if (!trackAreaRef.current || isDraggingPlayhead.current || dragState || reorderState) return;
    const rect = trackAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + trackAreaRef.current.scrollLeft;
    const frame = Math.max(0, Math.min(totalFrames, pixelToFrame(x)));
    onFrameChange(frame);
  }, [totalFrames, pixelToFrame, onFrameChange, dragState, reorderState]);

  // Track Drag Logic
  const handleTrackMouseDown = useCallback((e: React.MouseEvent, track: TimelineTrack, type: "move" | "resize-left" | "resize-right", trackIndex: number) => {
    if (track.locked) return;
    e.stopPropagation(); e.preventDefault();
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setDragDirection(null);
    if (type === "move") {
      setDragState({ trackId: track.id, type, startX: e.clientX, startFrame: track.startFrame, endFrame: track.endFrame });
      setReorderState({ trackId: track.id, startY: e.clientY, startIndex: trackIndex, currentIndex: trackIndex, isDragging: false });
    } else {
      setDragDirection("horizontal");
      setDragState({ trackId: track.id, type, startX: e.clientX, startFrame: track.startFrame, endFrame: track.endFrame });
    }
    onTrackSelect?.(track.id);
  }, [onTrackSelect]);

  useEffect(() => {
    if (!dragState || !onTracksChange) return;
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragState.startX;
      const deltaY = dragStartPos.current ? e.clientY - dragStartPos.current.y : 0;
      
      if (dragDirection === null && dragState.type === "move") {
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
          if (Math.abs(deltaY) > Math.abs(deltaX) && onReorderTracks) {
            setDragDirection("vertical");
            setDragState(null);
            if (reorderState) setReorderState({ ...reorderState, isDragging: true });
            return;
          } else {
            setDragDirection("horizontal");
            setReorderState(null);
          }
        } else return;
      }
      
      if (dragDirection !== "horizontal") return;
      
      const deltaFrames = pixelToFrame(deltaX);
      const updatedTracks = tracks.map((t) => {
        if (t.id !== dragState.trackId) return t;
        let newStart = t.startFrame;
        let newEnd = t.endFrame;
        const minDuration = 15; 

        if (dragState.type === "move") {
          const duration = dragState.endFrame - dragState.startFrame;
          newStart = Math.max(0, dragState.startFrame + deltaFrames);
          newEnd = Math.min(totalFrames, newStart + duration);
          if (newEnd === totalFrames) newStart = totalFrames - duration;
        } else if (dragState.type === "resize-left") {
          newStart = Math.max(0, Math.min(dragState.endFrame - minDuration, dragState.startFrame + deltaFrames));
          newEnd = dragState.endFrame;
        } else if (dragState.type === "resize-right") {
          newStart = dragState.startFrame;
          newEnd = Math.min(totalFrames, Math.max(dragState.startFrame + minDuration, dragState.endFrame + deltaFrames));
        }
        return { ...t, startFrame: newStart, endFrame: newEnd };
      });
      onTracksChange(updatedTracks);
    };
    const handleMouseUp = () => { setDragState(null); setDragDirection(null); setReorderState(null); dragStartPos.current = null; };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => { document.removeEventListener("mousemove", handleMouseMove); document.removeEventListener("mouseup", handleMouseUp); };
  }, [dragState, dragDirection, reorderState, tracks, pixelToFrame, totalFrames, onTracksChange, onReorderTracks]);

  // Reorder Logic
  const handleReorderMouseDown = useCallback((e: React.MouseEvent, track: TimelineTrack, index: number) => {
    if (track.locked) return;
    e.stopPropagation(); e.preventDefault();
    setReorderState({ trackId: track.id, startY: e.clientY, startIndex: index, currentIndex: index, isDragging: false });
    onTrackSelect?.(track.id);
  }, [onTrackSelect]);

  useEffect(() => {
    if (!reorderState?.isDragging || !onReorderTracks) return;
    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - reorderState.startY;
      // ✅ UPDATED: Use constant for calculation
      const indexDelta = Math.round(deltaY / TRACK_ROW_HEIGHT);
      const newIndex = Math.max(0, Math.min(tracks.length - 1, reorderState.startIndex + indexDelta));
      if (newIndex !== reorderState.currentIndex) setReorderState(prev => prev ? { ...prev, currentIndex: newIndex } : null);
    };
    const handleMouseUp = () => {
      if (reorderState.startIndex !== reorderState.currentIndex) onReorderTracks(reorderState.startIndex, reorderState.currentIndex);
      setReorderState(null); setDragDirection(null); setDragState(null); dragStartPos.current = null;
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => { document.removeEventListener("mousemove", handleMouseMove); document.removeEventListener("mouseup", handleMouseUp); };
  }, [reorderState, tracks.length, onReorderTracks]);

  const handleDeleteTrack = useCallback(() => {
    if (!selectedTrackId) return;
    if (onDeleteTrack) onDeleteTrack(selectedTrackId);
    else if (onTracksChange) onTracksChange(tracks.filter((t) => t.id !== selectedTrackId));
    onTrackSelect?.(null);
  }, [selectedTrackId, tracks, onTracksChange, onTrackSelect, onDeleteTrack]);

  const handleCutTrack = useCallback(() => {
    if (!selectedTrackId) return;
    const track = tracks.find((t) => t.id === selectedTrackId);
    if (!track || currentFrame <= track.startFrame || currentFrame >= track.endFrame) return;
    if (onCutTrack) onCutTrack(selectedTrackId, currentFrame);
    else if (onTracksChange) {
      const newTrack: TimelineTrack = { ...track, id: `${track.id}-cut-${Date.now()}`, startFrame: currentFrame, endFrame: track.endFrame };
      const updatedTracks = tracks.map((t) => t.id === selectedTrackId ? { ...t, endFrame: currentFrame } : t);
      onTracksChange([...updatedTracks, newTrack]);
    }
  }, [selectedTrackId, tracks, currentFrame, onTracksChange, onCutTrack]);

  const handleToggleVisibility = useCallback((trackId: string) => {
    if (!onTracksChange) return;
    onTracksChange(tracks.map((t) => t.id === trackId ? { ...t, visible: t.visible === false ? true : false } : t));
  }, [tracks, onTracksChange]);

  const handleToggleLock = useCallback((trackId: string) => {
    if (!onTracksChange) return;
    onTracksChange(tracks.map((t) => t.id === trackId ? { ...t, locked: !t.locked } : t));
  }, [tracks, onTracksChange]);

  const timeMarkers = useMemo(() => {
    const markers: { frame: number; label: string }[] = [];
    const interval = Math.max(fps, Math.floor(totalFrames / (10 * zoom)));
    for (let frame = 0; frame <= totalFrames; frame += interval) markers.push({ frame, label: formatTime(frame, fps) });
    return markers;
  }, [totalFrames, fps, zoom]);

  const canCut = useMemo(() => {
    if (!selectedTrackId) return false;
    const track = tracks.find((t) => t.id === selectedTrackId);
    if (!track || track.locked) return false;
    return currentFrame > track.startFrame && currentFrame < track.endFrame;
  }, [selectedTrackId, tracks, currentFrame]);

  const canDelete = useMemo(() => selectedTrackId && tracks.find((t) => t.id === selectedTrackId), [selectedTrackId, tracks]);

  const getDisplayTracks = useCallback(() => {
    if (!reorderState?.isDragging) return tracks;
    const result = [...tracks];
    const [removed] = result.splice(reorderState.startIndex, 1);
    result.splice(reorderState.currentIndex, 0, removed);
    return result;
  }, [tracks, reorderState]);

  const displayTracks = getDisplayTracks();

  // ============================================================================
  // STYLES
  // ============================================================================

  const styles: Record<string, React.CSSProperties> = {
    container: {
      backgroundColor: "#1a1a1a",
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      flexDirection: "column",
      flex: 1,
      marginBottom: "16px",
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      // ✅ UPDATED: Reduced padding for shorter toolbar
      padding: "6px 12px",
      backgroundColor: "#141414",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      gap: "8px",
    },
    toolGroup: {
      display: "flex",
      alignItems: "center",
      gap: "2px",
    },
    toolButton: {
      // ✅ UPDATED: Smaller buttons
      width: "28px",
      height: "28px",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      color: "#888",
      transition: "all 0.15s",
    },
    toolButtonActive: {
      backgroundColor: "#3b82f6",
      color: "white",
    },
    toolButtonDisabled: {
      opacity: 0.3,
      cursor: "not-allowed",
    },
    divider: {
      width: "1px",
      height: "20px", // ✅ Slightly shorter
      backgroundColor: "rgba(255,255,255,0.1)",
      margin: "0 8px",
    },
    timeDisplay: {
      fontFamily: "'SF Mono', 'Monaco', 'Consolas', monospace",
      fontSize: "12px",
      color: "#3b82f6",
      backgroundColor: "#0f0f0f",
      padding: "4px 10px", // ✅ Slightly more compact
      borderRadius: "6px",
      border: "1px solid rgba(255,255,255,0.1)",
      minWidth: "100px",
      textAlign: "center",
    },
    zoomControl: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginLeft: "auto",
    },
    zoomSlider: {
      width: "80px",
      height: "4px",
      appearance: "none",
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: "2px",
      outline: "none",
      cursor: "pointer",
    },
    timelineWrapper: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      position: "relative",
      overflow: "hidden",
    },
    rulerRow: {
      display: "flex",
      height: "29px",
    },
    rulerSpacer: {
      width: "250px",
      minWidth: "250px",
      backgroundColor: "#141414",
      borderRight: "1px solid rgba(255,255,255,0.08)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      height: "100%",
    },
    rulerContent: {
      flex: 1,
      overflow: "hidden",
    },
    ruler: {
      height: "28px",
      backgroundColor: "#0f0f0f",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      position: "relative",
      overflow: "hidden",
    },
    rulerInner: {
      height: "100%",
      position: "relative",
    },
    rulerMarker: {
      position: "absolute",
      top: "8px",
      fontSize: "9px",
      color: "#666",
      fontFamily: "'SF Mono', 'Monaco', 'Consolas', monospace",
      transform: "translateX(-50%)",
      whiteSpace: "nowrap",
    },
    contentWrapper: {
      display: "flex",
      flex: 1,
      overflow: "hidden",
    },
    trackLabels: {
      width: "250px",
      minWidth: "250px",
      backgroundColor: "#141414",
      borderRight: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    trackLabel: {
      // ✅ UPDATED: Matches constant
      height: `${TRACK_ROW_HEIGHT}px`,
      minHeight: `${TRACK_ROW_HEIGHT}px`,
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "0 12px",
      fontSize: "12px",
      fontWeight: 500,
      color: "#888",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      cursor: "pointer",
      transition: "all 0.15s",
      boxSizing: "border-box",
    },
    trackLabelSelected: {
      backgroundColor: "rgba(59, 130, 246, 0.15)",
      color: "#3b82f6",
    },
    trackLabelHidden: { opacity: 0.4 },
    trackLabelReordering: { backgroundColor: "rgba(59, 130, 246, 0.25)", boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)" },
    trackLabelIcon: { opacity: 0.6 },
    trackLabelControls: { marginLeft: "auto", display: "flex", gap: "2px" },
    trackLabelButton: { width: "22px", height: "22px", border: "none", backgroundColor: "transparent", color: "#666", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", transition: "all 0.15s" },
    dragHandle: { width: "16px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "grab", color: "#444", transition: "color 0.15s" },
    dragHandleActive: { cursor: "grabbing", color: "#3b82f6" },
    trackArea: { flex: 1, position: "relative", overflow: "auto", backgroundColor: "#0a0a0a" },
    trackAreaInner: { position: "relative", minHeight: "100%" },
    trackRow: {
      // ✅ UPDATED: Matches constant
      height: `${TRACK_ROW_HEIGHT}px`,
      position: "relative",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      boxSizing: "border-box",
    },
    trackRowReordering: { backgroundColor: "rgba(59, 130, 246, 0.1)" },
    dropIndicator: { position: "absolute", left: 0, right: 0, height: "2px", backgroundColor: "#3b82f6", zIndex: 100 },
    trackClip: {
      position: "absolute",
      // ✅ UPDATED: Matches constants for perfect centering
      top: `${TRACK_CLIP_TOP}px`,
      height: `${TRACK_CLIP_HEIGHT}px`,
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "11px",
      fontWeight: 600,
      cursor: "grab",
      transition: "box-shadow 0.15s, opacity 0.15s",
      userSelect: "none",
      overflow: "hidden",
    },
    trackClipSelected: { boxShadow: "0 0 0 2px #3b82f6, 0 4px 12px rgba(59, 130, 246, 0.3)" },
    trackClipLocked: { cursor: "not-allowed" },
    trackClipHidden: { opacity: 0.3 },
    trackClipHandle: { position: "absolute", top: 0, bottom: 0, width: "10px", cursor: "ew-resize", display: "flex", alignItems: "center", justifyContent: "center" },
    trackClipHandleBar: { width: "3px", height: "16px", backgroundColor: "rgba(255,255,255,0.4)", borderRadius: "2px" },
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
    <div style={styles.container}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolGroup}>
          <button style={{ ...styles.toolButton, ...(canUndo ? {} : styles.toolButtonDisabled) }} onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)" onMouseOver={(e) => canUndo && (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}><EditorIcons.Undo /></button>
          <button style={{ ...styles.toolButton, ...(canRedo ? {} : styles.toolButtonDisabled) }} onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)" onMouseOver={(e) => canRedo && (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}><EditorIcons.Redo /></button>
        </div>
        <div style={styles.divider} />
        <div style={styles.toolGroup}>
          <button style={{ ...styles.toolButton, ...(!canCut ? styles.toolButtonDisabled : {}) }} onClick={handleCutTrack} disabled={!canCut} title="Cut at Playhead (C)" onMouseOver={(e) => canCut && (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}><EditorIcons.Split /></button>
          <button style={{ ...styles.toolButton, ...(!canDelete ? styles.toolButtonDisabled : {}) }} onClick={handleDeleteTrack} disabled={!canDelete} title="Delete Track (Del)" onMouseOver={(e) => canDelete && (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}><EditorIcons.Trash /></button>
        </div>
        <div style={styles.divider} />
        <div style={styles.toolGroup}>
          <button style={styles.toolButton} onClick={() => onFrameChange(0)} title="Go to Start (Home)" onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}><EditorIcons.SkipBack /></button>
          <button style={{ ...styles.toolButton, ...(isPlaying ? styles.toolButtonActive : {}) }} onClick={onPlayPause} title={isPlaying ? "Pause (Space)" : "Play (Space)"} onMouseOver={(e) => !isPlaying && (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")} onMouseOut={(e) => !isPlaying && (e.currentTarget.style.backgroundColor = "transparent")}>{isPlaying ? <EditorIcons.Pause /> : <EditorIcons.Play />}</button>
          <button style={styles.toolButton} onClick={() => onFrameChange(totalFrames)} title="Go to End (End)" onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}><EditorIcons.SkipForward /></button>
        </div>
        <div style={styles.timeDisplay}>{formatTime(currentFrame, fps)} / {formatTime(totalFrames, fps)}</div>
        <div style={styles.zoomControl}><EditorIcons.ZoomOut /><input type="range" min="0.5" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={styles.zoomSlider} /><EditorIcons.ZoomIn /></div>
      </div>

      <div style={styles.timelineWrapper}>
        <div style={styles.rulerRow}>
          <div style={styles.rulerSpacer} />
          <div style={styles.rulerContent} ref={rulerRef}>
            <div style={styles.ruler}><div style={{ ...styles.rulerInner, width: `${timelineWidth}px` }}>{timeMarkers.map(({ frame, label }) => (<div key={frame} style={{ ...styles.rulerMarker, left: `${frameToPixel(frame)}px` }}>{label}</div>))}</div></div>
          </div>
        </div>

        <div style={styles.contentWrapper}>
          <div style={styles.trackLabels} ref={labelsRef} onWheel={handleLabelsWheel}>
            {displayTracks.map((track, index) => {
              const isBeingReordered = reorderState?.isDragging && reorderState?.trackId === track.id;
              return (
                <div key={track.id} style={{ ...styles.trackLabel, ...(selectedTrackId === track.id ? styles.trackLabelSelected : {}), ...(track.visible === false ? styles.trackLabelHidden : {}), ...(isBeingReordered ? styles.trackLabelReordering : {}) }} onClick={() => onTrackSelect?.(track.id)}>
                  {onReorderTracks && !track.locked && (<div style={{ ...styles.dragHandle, ...(isBeingReordered ? styles.dragHandleActive : {}) }} onMouseDown={(e) => handleReorderMouseDown(e, track, index)} onMouseOver={(e) => (e.currentTarget.style.color = "#888")} onMouseOut={(e) => (e.currentTarget.style.color = isBeingReordered ? "#3b82f6" : "#444")} title="Drag to reorder"><DragHandleIcon /></div>)}
                  <span style={styles.trackLabelIcon}>{getTrackIcon(track.type)}</span>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.label}</span>
                  <div style={styles.trackLabelControls}>
                    <button style={{ ...styles.trackLabelButton, color: track.visible === false ? "#ef4444" : "#666" }} onClick={(e) => { e.stopPropagation(); handleToggleVisibility(track.id); }} title={track.visible === false ? "Show" : "Hide"} onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>{track.visible === false ? <EditorIcons.EyeOff /> : <EditorIcons.Eye />}</button>
                    <button style={{ ...styles.trackLabelButton, color: track.locked ? "#f59e0b" : "#666" }} onClick={(e) => { e.stopPropagation(); handleToggleLock(track.id); }} title={track.locked ? "Unlock" : "Lock"} onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>{track.locked ? <EditorIcons.Lock /> : <EditorIcons.Unlock />}</button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={styles.trackArea} ref={trackAreaRef} onClick={handleTimelineClick} onScroll={handleScroll}>
            <div style={{ ...styles.trackAreaInner, width: `${timelineWidth}px` }}>
              {displayTracks.map((track, index) => {
                const isBeingReordered = reorderState?.isDragging && reorderState?.trackId === track.id;
                return (
                  <div key={track.id} style={{ ...styles.trackRow, ...(isBeingReordered ? styles.trackRowReordering : {}) }}>
                    <div style={{
                        ...styles.trackClip, backgroundColor: track.color, left: `${frameToPixel(track.startFrame)}px`, width: `${Math.max(20, frameToPixel(track.endFrame - track.startFrame))}px`,
                        ...(selectedTrackId === track.id ? styles.trackClipSelected : {}), ...(track.locked ? styles.trackClipLocked : {}), ...(track.visible === false ? styles.trackClipHidden : {}),
                        ...(isBeingReordered ? { opacity: 0.7, boxShadow: "0 4px 12px rgba(0,0,0,0.4)" } : {}), cursor: track.locked ? "not-allowed" : (reorderState?.isDragging ? "grabbing" : (dragState?.trackId === track.id ? "grabbing" : "grab")),
                      }} onMouseDown={(e) => handleTrackMouseDown(e, track, "move", index)}>
                      {!track.locked && (<div style={{ ...styles.trackClipHandle, left: 0 }} onMouseDown={(e) => handleTrackMouseDown(e, track, "resize-left", index)}><div style={styles.trackClipHandleBar} /></div>)}
                      <span style={{ color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.5)", pointerEvents: "none", padding: "0 16px" }}>{track.label}</span>
                      {!track.locked && (<div style={{ ...styles.trackClipHandle, right: 0 }} onMouseDown={(e) => handleTrackMouseDown(e, track, "resize-right", index)}><div style={styles.trackClipHandleBar} /></div>)}
                    </div>
                  </div>
                );
              })}
              <div style={{ ...styles.playhead, left: `${frameToPixel(currentFrame)}px` }}><div style={styles.playheadHead} onMouseDown={handlePlayheadMouseDown} /><div style={styles.playheadLine} /></div>
              {reorderState?.isDragging && reorderState.currentIndex !== reorderState.startIndex && (<div style={{ ...styles.dropIndicator, top: `${reorderState.currentIndex * TRACK_ROW_HEIGHT}px` }} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;