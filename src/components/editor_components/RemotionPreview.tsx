import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { PreviewOverlay, type SelectableElement } from "./PreviewOverlay";
import type { ElementPositions } from "../remotion_compositions/QuoteTemplate";
import { useTheme } from "../../contexts/ThemeContext";

// ============================================================================
// TYPES
// ============================================================================

export interface RemotionPreviewHandle {
  play: () => void;
  pause: () => void;
  seekTo: (frame: number) => void;
  getCurrentFrame: () => number;
  toggle: () => void;
}

export interface RemotionPreviewProps<T extends Record<string, unknown>> {
  component: React.ComponentType<T>;
  inputProps: T;
  durationInFrames: number;
  compositionWidth?: number;
  compositionHeight?: number;
  fps?: number;
  currentFrame?: number;
  isPlaying?: boolean;
  onFrameUpdate?: (frame: number) => void;
  onPlayingChange?: (isPlaying: boolean) => void;
  containerWidth?: string;
  containerHeight?: string;
  phoneFrameWidth?: string;
  phoneFrameHeight?: string;
  // Interactive features
  selectedElement?: SelectableElement;
  onElementSelect?: (element: SelectableElement) => void;
  positions?: ElementPositions;
  onPositionChange?: (element: keyof ElementPositions, position: Partial<{ x: number; y: number; rotation: number; scale: number }>) => void;
  interactiveMode?: boolean;
}

// Re-export SelectableElement type
export type { SelectableElement } from "./PreviewOverlay";

// ============================================================================
// REMOTION PREVIEW COMPONENT
// ============================================================================

function RemotionPreviewInner<T extends Record<string, unknown>>(
  {
    component,
    inputProps,
    durationInFrames,
    compositionWidth = 1080,
    compositionHeight = 1920,
    fps = 30,
    currentFrame,
    isPlaying,
    onFrameUpdate,
    onPlayingChange,
    containerWidth = "100%",
    containerHeight = "100%",
    phoneFrameWidth = "270px",
    phoneFrameHeight = "480px",
    selectedElement,
    onElementSelect,
    positions,
    onPositionChange,
    interactiveMode = true,
  }: RemotionPreviewProps<T>,
  ref: React.ForwardedRef<RemotionPreviewHandle>
) {
  const playerRef = useRef<PlayerRef>(null);
  const lastKnownFrame = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const { colors } = useTheme();

  // Measure container size for interactive overlay
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setFrameSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Expose player controls via ref
  useImperativeHandle(ref, () => ({
    play: () => playerRef.current?.play(),
    pause: () => playerRef.current?.pause(),
    seekTo: (frame: number) => playerRef.current?.seekTo(frame),
    getCurrentFrame: () => lastKnownFrame.current,
    toggle: () => playerRef.current?.toggle(),
  }));

  // Sync external frame with player
  useEffect(() => {
    if (currentFrame !== undefined && playerRef.current) {
      const playerFrame = playerRef.current.getCurrentFrame();
      if (Math.abs(playerFrame - currentFrame) > 1) {
        playerRef.current.seekTo(currentFrame);
      }
    }
  }, [currentFrame]);

  // Sync external playing state
  useEffect(() => {
    if (isPlaying !== undefined && playerRef.current) {
      if (isPlaying) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Report frame updates
  useEffect(() => {
    if (!onFrameUpdate) return;

    const reportFrame = () => {
      if (playerRef.current) {
        const frame = playerRef.current.getCurrentFrame();
        if (frame !== lastKnownFrame.current) {
          lastKnownFrame.current = frame;
          onFrameUpdate(frame);
        }
      }
      animationFrameId.current = requestAnimationFrame(reportFrame);
    };

    animationFrameId.current = requestAnimationFrame(reportFrame);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [onFrameUpdate]);

  // Handle play state changes from player
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !onPlayingChange) return;

    const handlePlay = () => onPlayingChange(true);
    const handlePause = () => onPlayingChange(false);
    const handleEnded = () => onPlayingChange(false);

    player.addEventListener("play", handlePlay);
    player.addEventListener("pause", handlePause);
    player.addEventListener("ended", handleEnded);

    return () => {
      player.removeEventListener("play", handlePlay);
      player.removeEventListener("pause", handlePause);
      player.removeEventListener("ended", handleEnded);
    };
  }, [onPlayingChange]);

  // ============================================================================
  // STYLES
  // ============================================================================

  const styles: Record<string, React.CSSProperties> = {
    container: {
      width: containerWidth,
      height: containerHeight,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    phoneContainer: {
      width: phoneFrameWidth,
      height: phoneFrameHeight,
      overflow: "hidden",
      background: "#000",
      position: "relative",
      border: `2px solid ${colors.border}`,
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
    
    playerWrapper: {
      width: "100%",
      height: "100%",
      position: "relative",
    },
  };

  // Default positions if not provided
  const defaultPositions: ElementPositions = {
    quoteMark: { x: 10, y: 12 },
    quote: { x: 50, y: 40 },
    author: { x: 50, y: 80 },
  };

  const activePositions = positions || defaultPositions;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div style={styles.container}>
      <div ref={containerRef} style={styles.phoneContainer}>
        <div style={styles.playerWrapper}>
          <Player
            ref={playerRef}
            component={component}
            inputProps={inputProps}
            durationInFrames={durationInFrames}
            compositionWidth={compositionWidth}
            compositionHeight={compositionHeight}
            fps={fps}
            controls={false}
            autoPlay={false}
            loop={true}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
          
          {/* Interactive overlay for click-to-select and drag-to-move */}
          {interactiveMode && onElementSelect && onPositionChange && (
            <PreviewOverlay
              positions={activePositions}
              selectedElement={selectedElement || null}
              onSelectElement={onElementSelect}
              onPositionChange={onPositionChange}
              containerWidth={frameSize.width || 270}
              containerHeight={frameSize.height || 480}
              compositionWidth={compositionWidth}  // PASS COMPOSITION DIMENSIONS
              compositionHeight={compositionHeight}  // PASS COMPOSITION DIMENSIONS
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORT
// ============================================================================

export const RemotionPreview = forwardRef(RemotionPreviewInner) as <
  T extends Record<string, unknown>
>(
  props: RemotionPreviewProps<T> & { ref?: React.ForwardedRef<RemotionPreviewHandle> }
) => React.ReactElement;

export default RemotionPreview;