// ============================================================================
// COMPLETE DynamicLayerComposition.tsx WITH VIDEO SUPPORT
// ============================================================================

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  Audio,
  Video,
  Sequence,
} from "remotion";

// ============================================================================
// TYPES
// ============================================================================

export interface LayerBase {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  startFrame: number;
  endFrame: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  opacity: number;
  animation?: {
    entrance?: "fade" | "slideUp" | "slideDown" | "scale" | "none";
    entranceDuration?: number;
  };
}

export interface TextLayer extends LayerBase {
  type: "text";
  content: string;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontWeight: string;
  fontStyle: string;
  textAlign: "left" | "center" | "right";
  lineHeight: number;
  letterSpacing?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textOutline?: boolean;
  outlineColor?: string;
  textShadow?: boolean;
  shadowColor?: string;
  shadowX?: number;
  shadowY?: number;
  shadowBlur?: number;
}

export interface ImageLayer extends LayerBase {
  type: "image";
  src: string;
  isBackground?: boolean;
  objectFit?: "cover" | "contain" | "fill";
  filter?: string;
}

export interface AudioLayer extends LayerBase {
  type: "audio";
  src: string;
  volume: number;
  loop?: boolean;
  fadeIn?: number;
  fadeOut?: number;
}

export interface VideoLayer extends LayerBase {
  type: "video";
  src: string;
  volume: number;
  loop?: boolean;
  playbackRate?: number;
  objectFit?: "cover" | "contain" | "fill";
  filter?: string;
  fadeIn?: number;
  fadeOut?: number;
}

export type Layer = TextLayer | ImageLayer | AudioLayer | VideoLayer;

export function isTextLayer(layer: Layer): layer is TextLayer {
  return layer.type === "text";
}

export function isImageLayer(layer: Layer): layer is ImageLayer {
  return layer.type === "image";
}

export function isAudioLayer(layer: Layer): layer is AudioLayer {
  return layer.type === "audio";
}

export function isVideoLayer(layer: Layer): layer is VideoLayer {
  return layer.type === "video";
}

export interface DynamicCompositionProps {
  layers: Layer[];
  backgroundColor?: string;
  editingLayerId?: string | null;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getEntranceAnimation = (
  layer: Layer,
  relativeFrame: number,
  fps: number
) => {
  const animation = layer.animation?.entrance || "fade";
  const duration = layer.animation?.entranceDuration || 30;

  if (animation === "none") {
    return { opacity: 1, transform: "none" };
  }

  const progress = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 15, stiffness: 80 },
    durationInFrames: duration,
  });

  const opacity = interpolate(relativeFrame, [0, duration * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  switch (animation) {
    case "slideUp":
      return {
        opacity,
        transform: `translateY(${interpolate(progress, [0, 1], [50, 0])}px)`,
      };
    case "slideDown":
      return {
        opacity,
        transform: `translateY(${interpolate(progress, [0, 1], [-50, 0])}px)`,
      };
    case "scale":
      return {
        opacity,
        transform: `scale(${interpolate(progress, [0, 1], [0.8, 1])})`,
      };
    case "fade":
    default:
      return {
        opacity,
        transform: "none",
      };
  }
};

const buildTextShadow = (layer: TextLayer): string => {
  if (!layer.textShadow) return "none";
  
  const x = layer.shadowX || 0;
  const y = layer.shadowY || 0;
  const blur = layer.shadowBlur || 0;
  const color = layer.shadowColor || "#000000";
  
  return `${x}px ${y}px ${blur}px ${color}`;
};

const buildTextStroke = (layer: TextLayer): React.CSSProperties => {
  if (!layer.textOutline) return {};
  
  const outlineColor = layer.outlineColor || "#000000";
  
  return {
    WebkitTextStroke: `1px ${outlineColor}`,
    paintOrder: "stroke fill",
  };
};

// ============================================================================
// TEXT LAYER COMPONENT
// ============================================================================

const TextLayerComponent: React.FC<{
  layer: TextLayer;
  relativeFrame: number;
  fps: number;
  width: number;
  height: number;
}> = ({ layer, relativeFrame, fps, width, height }) => {
  const entrance = getEntranceAnimation(layer, relativeFrame, fps);
  const scaledFontSize = (layer.fontSize / 100) * height;
  const words = layer.content.split(" ");
  const wordDelay = 3;
  const textShadowStyle = buildTextShadow(layer);
  const textStrokeStyle = buildTextStroke(layer);

  return (
    <div
      style={{
        position: "absolute",
        left: `${layer.position.x - layer.size.width / 2}%`,
        top: `${layer.position.y - layer.size.height / 2}%`,
        width: `${layer.size.width}%`,
        minHeight: `${layer.size.height}%`,
        fontFamily: layer.fontFamily,
        fontSize: scaledFontSize,
        fontWeight: layer.fontWeight,
        fontStyle: layer.fontStyle,
        color: layer.fontColor,
        textAlign: layer.textAlign,
        lineHeight: layer.lineHeight,
        letterSpacing: layer.letterSpacing || 0,
        textTransform: layer.textTransform || "none",
        textShadow: textShadowStyle,
        ...textStrokeStyle,
        transform: `rotate(${layer.rotation}deg) ${entrance.transform}`,
        transformOrigin: "center center",
        display: "flex",
        alignItems: "center",
        justifyContent:
          layer.textAlign === "center"
            ? "center"
            : layer.textAlign === "right"
            ? "flex-end"
            : "flex-start",
        flexWrap: "wrap",
        gap: "0.3em",
      }}
    >
      {words.map((word, i) => {
        const wordOpacity = interpolate(
          relativeFrame - i * wordDelay,
          [0, 20],
          [0, 1],
          { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
        );
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: wordOpacity * layer.opacity * entrance.opacity,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// ============================================================================
// IMAGE LAYER COMPONENT
// ============================================================================

const ImageLayerComponent: React.FC<{
  layer: ImageLayer;
  relativeFrame: number;
  fps: number;
}> = ({ layer, relativeFrame, fps }) => {
  const entrance = getEntranceAnimation(layer, relativeFrame, fps);

  if (layer.isBackground) {
    const bgOpacity = interpolate(relativeFrame, [0, 60], [0, 1], {
      extrapolateRight: "clamp",
    });

    return (
      <AbsoluteFill style={{ opacity: bgOpacity * layer.opacity }}>
        <Img
          src={layer.src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: layer.objectFit || "cover",
            filter: layer.filter || "brightness(0.6)",
          }}
        />
      </AbsoluteFill>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: `${layer.position.x - layer.size.width / 2}%`,
        top: `${layer.position.y - layer.size.height / 2}%`,
        width: `${layer.size.width}%`,
        height: `${layer.size.height}%`,
        opacity: layer.opacity * entrance.opacity,
        transform: `rotate(${layer.rotation}deg) ${entrance.transform}`,
        transformOrigin: "center center",
      }}
    >
      <Img
        src={layer.src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: layer.objectFit || "contain",
          filter: layer.filter || "none",
        }}
      />
    </div>
  );
};

// ============================================================================
// AUDIO LAYER COMPONENT
// ============================================================================

const AudioLayerComponent: React.FC<{
  layer: AudioLayer;
  relativeFrame: number;
  fps: number;
}> = ({ layer, relativeFrame, fps }) => {
  const duration = layer.endFrame - layer.startFrame;
  
  let volume = layer.volume;
  
  if (layer.fadeIn && relativeFrame < layer.fadeIn) {
    volume = interpolate(relativeFrame, [0, layer.fadeIn], [0, layer.volume], {
      extrapolateRight: "clamp",
    });
  }
  
  if (layer.fadeOut && relativeFrame > duration - layer.fadeOut) {
    volume = interpolate(
      relativeFrame,
      [duration - layer.fadeOut, duration],
      [layer.volume, 0],
      { extrapolateLeft: "clamp" }
    );
  }

  return (
    <Audio
      src={layer.src}
      volume={volume}
      loop={layer.loop}
    />
  );
};

// ============================================================================
// VIDEO LAYER COMPONENT
// ============================================================================

const VideoLayerComponent: React.FC<{
  layer: VideoLayer;
  relativeFrame: number;
  fps: number;
}> = ({ layer, relativeFrame, fps }) => {
  const entrance = getEntranceAnimation(layer, relativeFrame, fps);
  const duration = layer.endFrame - layer.startFrame;
  
  let volume = layer.volume;
  
  if (layer.fadeIn && relativeFrame < layer.fadeIn) {
    volume = interpolate(relativeFrame, [0, layer.fadeIn], [0, layer.volume], {
      extrapolateRight: "clamp",
    });
  }
  
  if (layer.fadeOut && relativeFrame > duration - layer.fadeOut) {
    volume = interpolate(
      relativeFrame,
      [duration - layer.fadeOut, duration],
      [layer.volume, 0],
      { extrapolateLeft: "clamp" }
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: `${layer.position.x - layer.size.width / 2}%`,
        top: `${layer.position.y - layer.size.height / 2}%`,
        width: `${layer.size.width}%`,
        height: `${layer.size.height}%`,
        opacity: layer.opacity * entrance.opacity,
        transform: `rotate(${layer.rotation}deg) ${entrance.transform}`,
        transformOrigin: "center center",
      }}
    >
      <Video
        src={layer.src}
        volume={volume}
        loop={layer.loop}
        playbackRate={layer.playbackRate || 1}
        style={{
          width: "100%",
          height: "100%",
          objectFit: layer.objectFit || "contain",
          filter: layer.filter || "none",
        }}
      />
    </div>
  );
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================

export const DynamicLayerComposition: React.FC<DynamicCompositionProps> = ({
  layers,
  backgroundColor = "#000",
  editingLayerId = null,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const visibleLayers = layers
    .map((layer, index) => ({ layer, originalIndex: index }))
    .filter(({ layer }) => {
      if (!layer.visible) return false;
      if (layer.id === editingLayerId) return false;
      return frame >= layer.startFrame && frame <= layer.endFrame;
    })
    .sort((a, b) => {
      if (isImageLayer(a.layer) && a.layer.isBackground) return -1;
      if (isImageLayer(b.layer) && b.layer.isBackground) return 1;
      return b.originalIndex - a.originalIndex;
    });

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {visibleLayers.map(({ layer }) => {
        const relativeFrame = Math.max(0, frame - layer.startFrame);

        if (isImageLayer(layer)) {
          return (
            <ImageLayerComponent
              key={layer.id}
              layer={layer}
              relativeFrame={relativeFrame}
              fps={fps}
            />
          );
        }

        if (isTextLayer(layer)) {
          return (
            <TextLayerComponent
              key={layer.id}
              layer={layer}
              relativeFrame={relativeFrame}
              fps={fps}
              width={width}
              height={height}
            />
          );
        }

        if (isVideoLayer(layer)) {
          return (
            <VideoLayerComponent
              key={layer.id}
              layer={layer}
              relativeFrame={relativeFrame}
              fps={fps}
            />
          );
        }

        return null;
      })}
      
      {layers
        .filter((layer): layer is AudioLayer => 
          isAudioLayer(layer) && layer.visible && layer.id !== editingLayerId
        )
        .map((layer) => (
          <Sequence
            key={layer.id}
            from={layer.startFrame}
            durationInFrames={layer.endFrame - layer.startFrame}
          >
            <AudioLayerComponent
              layer={layer}
              relativeFrame={Math.max(0, frame - layer.startFrame)}
              fps={fps}
            />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};

export default DynamicLayerComposition;