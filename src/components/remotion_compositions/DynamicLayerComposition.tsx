
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
  entrance?:
    | "fade"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scale"
    | "zoomPunch"
    | "none"
    | "typewriter"
    | "kinetic";
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
  highlightWords?: string[];
  highlightColor?: string;
}

export interface ImageLayer extends LayerBase {
  type: "image";
  src: string;
  isBackground?: boolean;
  objectFit?: "cover" | "contain" | "fill";
  filter?: string;
  crop?: CropData;
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

export type ChatStyle =
  | "imessage"
  | "whatsapp"
  | "instagram"
  | "messenger"
  | "fakechatconversation";

export interface ChatBubbleLayer extends LayerBase {
  type: "chat-bubble";
  message: string;
  isSender: boolean;
  chatStyle: ChatStyle;
  avatarUrl?: string;
  senderName?: string;
  isTyping?: boolean;

  avatarScale?: number;
  bubbleFontSize?: number;
  fontFamily?: string;
}

export interface RedditCardLayer {
  id: string;
  type: "reddit-card";
  name: string;
  startFrame: number;
  endFrame: number;
  visible: boolean;
  locked: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation?: number;
  opacity?: number;
  animation?: {
    entrance?: string;
    entranceDuration?: number;
    exit?: string;
    exitDuration?: number;
  };
  // Reddit-specific
  subredditName: string;
  posterUsername: string;
  timePosted: string;
  upvotes: string;
  commentCount: string;
  awardsCount: string;
  avatarUrl: string;
  title: string;
  text: string;
  titleFontSize?: number;
  textFontSize?: number;
  displayDuration?: number;
  headerFontSize?: number;
  metricsFontSize?: number;
  titleMaxLength?: number;
  textMaxLength?: number;
}

export interface RedditStoryLayer {
  id: string;
  type: "reddit-story";
  name: string;
  startFrame: number;
  endFrame: number;
  visible: boolean;
  locked: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation?: number;
  opacity?: number;
  animation?: {
    entrance?: string;
    entranceDuration?: number;
    exit?: string;
    exitDuration?: number;
  };
  // Story-specific
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  sentenceBgColor: string;
  story: string;
  words: { word: string; start: number; end: number }[];
}


export function isRedditCardLayer(layer: Layer): layer is RedditCardLayer {
  return layer.type === "reddit-card";
}

export function isRedditStoryLayer(layer: Layer): layer is RedditStoryLayer {
  return layer.type === "reddit-story";
}


export type Layer = TextLayer | ImageLayer | AudioLayer | VideoLayer | ChatBubbleLayer | RedditCardLayer | RedditStoryLayer;

// Type Guards
export const isChatBubbleLayer = (l: Layer): l is ChatBubbleLayer =>
  l.type === "chat-bubble";
export const isTextLayer = (l: Layer): l is TextLayer => l.type === "text";
export const isImageLayer = (l: Layer): l is ImageLayer => l.type === "image";
export const isAudioLayer = (l: Layer): l is AudioLayer => l.type === "audio";
export const isVideoLayer = (l: Layer): l is VideoLayer => l.type === "video";

export interface DynamicCompositionProps {
  layers: Layer[];
  backgroundColor?: string;
  editingLayerId?: string | null;
  templateId?: number;
}

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ============================================================================
// ICONS & UI ASSETS
// ============================================================================

const Icons = {
  // iMessage
  BackChevronBlue: () => (
    <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 19l-7-7 7-7"
        stroke="#007AFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  VideoBlue: () => (
    <svg width="66" height="66" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        stroke="#007AFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  AppStore: () => (
    <svg width="68" height="68" viewBox="0 0 24 24" fill="#8E8E93">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  ),
  CameraGrey: () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
      <path
        d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
        stroke="#8E8E93"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="13"
        r="4"
        stroke="#8E8E93"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  MicGrey: () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"
        stroke="#8E8E93"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 10v2a7 7 0 01-14 0v-2"
        stroke="#8E8E93"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="12"
        y1="19"
        x2="12"
        y2="23"
        stroke="#8E8E93"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="8"
        y1="23"
        x2="16"
        y2="23"
        stroke="#8E8E93"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  // WhatsApp
  BackArrowWhite: () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
      <path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  VideoWhite: () => (
    <svg width="58" height="58" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  PhoneWhite: () => (
    <svg width="54" height="54" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
        fill="white"
      />
    </svg>
  ),
  PlusGrey: () => (
    <svg
      width="60"
      height="60"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8E8E93"
      strokeWidth="2"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  MicWhite: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 10v2a7 7 0 01-14 0v-2"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="12"
        y1="19"
        x2="12"
        y2="23"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="8"
        y1="23"
        x2="16"
        y2="23"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  // Instagram
  BackArrowBlack: () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
      <path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke="black"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  VideoBlack: () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  PhoneBlack: () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
        stroke="black"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  ),
  InfoBlack: () => (
    <svg
      width="52"
      height="52"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  ),
  ImageSquare: () => (
    <svg
      width="54"
      height="54"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  Sticker: () => (
    <svg
      width="52"
      height="52"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
    >
      <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10z" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),

  // Messenger
  PlusBlue: () => (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#0084FF" />
      <path
        d="M12 8v8M8 12h8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  PhonePurple: () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
        fill="#A855F7"
      />
    </svg>
  ),
  VideoPurple: () => (
    <svg width="58" height="58" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        fill="#A855F7"
      />
    </svg>
  ),
};

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

  if (animation === "none") return { opacity: 1, transform: "" };

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

    case "slideLeft":
  return {
    opacity: interpolate(relativeFrame, [0, duration], [0, 1]),
    transform: `translateX(${interpolate(
      progress,
      [0, 1],
      [100, 0]
    )}%)`,
  };
case "slideRight":
  return {
    opacity: interpolate(relativeFrame, [0, duration], [0, 1]),
    transform: `translateX(${interpolate(
      progress,
      [0, 1],
      [-100, 0]
    )}%)`,
  };
  
    case "scale":
      return {
        opacity,
        transform: `scale(${interpolate(progress, [0, 1], [0.8, 1])})`,
      };
    case "zoomPunch":
      return {
        opacity,
        transform: `scale(${interpolate(progress, [0, 1], [1.5, 1])})`,
      };
    default:
      return { opacity, transform: "" };
  }
};

// ============================================================================
// KEN BURNS CAROUSEL (TEMPLATE 8)
// ============================================================================

type KenBurnsConfig = {
  zoomStart: number;
  zoomEnd: number;
  panX: number;
  panY: number;
};

const generateKenBurnsConfigs = (count: number): KenBurnsConfig[] => {
  return Array.from({ length: count }, (_, i) => ({
    zoomStart: i % 2 === 0 ? 1.0 : 1.15,
    zoomEnd: i % 2 === 0 ? 1.15 : 1.0,
    panX: Math.round(Math.cos(((i % 4) * Math.PI) / 2) * 80),
    panY: Math.round(Math.sin(((i % 4) * Math.PI) / 2) * 80),
  }));
};

const KenBurnsMedia: React.FC<{
  src: string;
  type: "image" | "video";
  config: KenBurnsConfig;
  progress: number;
  stageW: number;
  stageH: number;
}> = ({ src, type, config, progress }) => {
  const scale = interpolate(
    progress,
    [0, 1],
    [config.zoomStart, config.zoomEnd]
  );
  const tx = interpolate(
    progress,
    [0, 1],
    [0, Math.sign(config.panX) * Math.min(Math.abs(config.panX) * 0.15, 16)]
  );
  const ty = interpolate(
    progress,
    [0, 1],
    [0, Math.sign(config.panY) * Math.min(Math.abs(config.panY) * 0.15, 16)]
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
          transformOrigin: "center center",
        }}
      >
        {type === "video" ? (
          <Video
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            volume={0}
            muted
            loop
          />
        ) : (
          <img
            src={src}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "contrast(1.07) saturate(1.08) brightness(1.02)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(80% 80% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.35) 100%)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const KenBurnsCarouselRenderer: React.FC<{
  layers: (ImageLayer | VideoLayer)[];
  frame: number;
  fps: number;
  width: number;
  height: number;
}> = ({ layers, frame, fps, width, height }) => {
  const configs = React.useMemo(
    () => generateKenBurnsConfigs(layers.length),
    [layers.length]
  );

  let currentLayer: (ImageLayer | VideoLayer) | null = null;
  let nextLayer: (ImageLayer | VideoLayer) | null = null;
  let currentIndex = -1;
  let nextIndex = -1;

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    if (frame >= layer.startFrame && frame <= layer.endFrame) {
      if (currentLayer === null) {
        currentLayer = layer;
        currentIndex = i;
      } else {
        nextLayer = layer;
        nextIndex = i;
        break;
      }
    }
  }

  if (!currentLayer && layers.length > 0) {
    currentIndex = layers.length - 1;
    currentLayer = layers[currentIndex];
  }

  let slideProgress = 0;
  if (currentLayer && nextLayer && frame >= nextLayer.startFrame) {
    const transitionStart = nextLayer.startFrame;
    const transitionFrame = frame - transitionStart;
    const springValue = spring({
      frame: transitionFrame,
      fps,
      config: { damping: 20, stiffness: 120 },
    });

    slideProgress = interpolate(springValue, [0, 1], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  let kbProgress = 0;
  if (currentLayer) {
    const layerDuration = currentLayer.endFrame - currentLayer.startFrame;
    const layerFrame = frame - currentLayer.startFrame;
    kbProgress = interpolate(layerFrame, [0, layerDuration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  const kbNext = slideProgress > 0 ? slideProgress * 0.001 : 0;

  if (!currentLayer) return null;

  const layerSize = currentLayer.size || { width: 75, height: 75 };
const layerPosition = currentLayer.position || { x: 50, y: 50 };

const cardWidth = Math.round((layerSize.width / 100) * width);
const cardHeight = Math.round((layerSize.height / 100) * height);
const cardLeft = Math.round(((layerPosition.x / 100) * width) - (cardWidth / 2));
const cardTop = Math.round(((layerPosition.y / 100) * height) - (cardHeight / 2));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Blurred backgrounds */}
      <AbsoluteFill
        style={{
          opacity: nextLayer ? interpolate(slideProgress, [0, 1], [1, 0]) : 1,
        }}
      >
        {currentLayer.type === "video" ? (
          <Video
            src={currentLayer.src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(28px) saturate(1.2) brightness(0.95)",
              transform: "scale(1.1)",
            }}
            volume={0}
            muted
            loop
          />
        ) : (
          <img
            src={currentLayer.src}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(28px) saturate(1.2) brightness(0.95)",
              transform: "scale(1.1)",
            }}
          />
        )}
      </AbsoluteFill>

      {nextLayer && (
        <AbsoluteFill style={{ opacity: slideProgress }}>
          {nextLayer.type === "video" ? (
            <Video
              src={nextLayer.src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "blur(28px) saturate(1.2) brightness(0.95)",
                transform: "scale(1.1)",
              }}
              volume={0}
              muted
              loop
            />
          ) : (
            <img
              src={nextLayer.src}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "blur(28px) saturate(1.2) brightness(0.95)",
                transform: "scale(1.1)",
              }}
            />
          )}
        </AbsoluteFill>
      )}

      {/* Main card */}
      <div
        style={{
          position: "absolute",
          left: cardLeft,
          top: cardTop,
          width: cardWidth,
          height: cardHeight,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
          outline: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Current media */}
        <AbsoluteFill style={{ zIndex: 1 }}>
          <KenBurnsMedia
            src={currentLayer.src}
            type={currentLayer.type}
            config={configs[currentIndex % configs.length]}
            progress={kbProgress}
            stageW={cardWidth}
            stageH={cardHeight}
          />
        </AbsoluteFill>

        {/* Next media (slides in) */}
        {nextLayer && (
          <AbsoluteFill
            style={{
              zIndex: 2,
              clipPath: `inset(0% 0% 0% ${interpolate(
                slideProgress,
                [0, 1],
                [100, 0]
              )}%)`,
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0px, black 12px)",
            }}
          >
            <KenBurnsMedia
              src={nextLayer.src}
              type={nextLayer.type}
              config={configs[nextIndex % configs.length]}
              progress={kbNext}
              stageW={cardWidth}
              stageH={cardHeight}
            />
          </AbsoluteFill>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// CHAT INTERFACE OVERLAYS
// ============================================================================

const ChatInterface: React.FC<{
  style: ChatStyle;
  name: string;
  avatar?: string;
}> = ({ style, name, avatar }) => {
  const paddingTop = "40px";

  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 100,
    pointerEvents: "none",
  };

  const headerStyle: React.CSSProperties = {
    ...overlayStyle,
    top: 0,
    height: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: `0 35px 25px 35px`,
    background:
      style === "imessage"
        ? "rgba(242, 242, 247, 0.95)"
        : style === "whatsapp"
        ? "#008069"
        : style === "instagram"
        ? "#ffffff"
        : "#ffffff",
    borderBottom:
      style === "imessage" || style === "instagram"
        ? "1px solid #E5E5EA"
        : "none",
    boxShadow:
      style === "whatsapp" || style === "messenger"
        ? "0 1px 3px rgba(0,0,0,0.1)"
        : "none",
    backdropFilter: style === "imessage" ? "blur(20px)" : "none",
  };

  const footerStyle: React.CSSProperties = {
    ...overlayStyle,
    bottom: 0,
    height: "240px",
    background: style === "whatsapp" ? "#ffffff" : "#ffffff",
    display: "flex",
    alignItems: "flex-start",
    padding: "40px 30px",
    borderTop: style === "messenger" ? "none" : "1px solid #E5E5EA",
  };

  const renderHeader = () => {
    const displayAvatar =
      avatar ||
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100";

    if (style === "imessage") {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: "5px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#007AFF",
              gap: "8px",
            }}
          >
            <Icons.BackChevronBlue />
            <span
              style={{
                fontSize: "52px",
                fontWeight: "400",
                letterSpacing: "-0.5px",
              }}
            >
              24
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "12px",
            }}
          >
            <div
              style={{
                width: "95px",
                height: "95px",
                borderRadius: "50%",
                background: "#ccc",
                marginBottom: "10px",
                overflow: "hidden",
              }}
            >
              <img
                src={displayAvatar}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <span
              style={{ fontSize: "32px", fontWeight: "600", color: "black" }}
            >
              {name}{" "}
              <span style={{ color: "#8E8E93", fontWeight: "400" }}>&gt;</span>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "60px",
            }}
          >
            <Icons.VideoBlue />
          </div>
        </div>
      );
    }
    if (style === "whatsapp") {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            width: "100%",
            paddingBottom: "16px",
            marginTop: paddingTop,
          }}
        >
          <Icons.BackArrowWhite />
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "#ccc",
              overflow: "hidden",
            }}
          >
            <img
              src={displayAvatar}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <span
              style={{ fontSize: "42px", fontWeight: "500", color: "white" }}
            >
              {name}
            </span>
            <span style={{ fontSize: "36px", color: "rgba(255,255,255,0.8)" }}>
              online
            </span>
          </div>
          <div style={{ display: "flex", gap: "32px", color: "white" }}>
            <Icons.VideoWhite />
            <Icons.PhoneWhite />
          </div>
        </div>
      );
    }
    if (style === "instagram") {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingBottom: "16px",
            marginTop: paddingTop,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
            <Icons.BackArrowBlack />
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: "#ccc",
                overflow: "hidden",
              }}
            >
              <img
                src={displayAvatar}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{ fontSize: "44px", fontWeight: "600", color: "black" }}
              >
                {name}
              </span>
              <span style={{ fontSize: "22px", color: "#8E8E93" }}>
                Active 2h ago
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "35px", alignItems: "center" }}>
            <Icons.PhoneBlack />
            <Icons.VideoBlack />
            <Icons.InfoBlack />
          </div>
        </div>
      );
    }
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingBottom: "16px",
          marginTop: paddingTop,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <Icons.BackChevronBlue />
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "#ccc",
              overflow: "hidden",
            }}
          >
            <img
              src={displayAvatar}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontSize: "42px", fontWeight: "700", color: "black" }}
            >
              {name}
            </span>
            <span style={{ fontSize: "26px", color: "#8E8E93" }}>
              Active 2m ago
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "32px" }}>
          <Icons.PhonePurple />
          <Icons.VideoPurple />
        </div>
      </div>
    );
  };

  const renderFooter = () => {
    if (style === "imessage") {
      return (
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <div
            style={{
              padding: "12px",
              background: "#E9E9EB",
              borderRadius: "50%",
              marginRight: "16px",
            }}
          >
            <Icons.CameraGrey />
          </div>
          <div style={{ marginRight: "16px" }}>
            <Icons.AppStore />
          </div>
          <div
            style={{
              flex: 1,
              height: "90px",
              border: "1px solid #C7C7CC",
              borderRadius: "45px",
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              color: "#C7C7CC",
              fontSize: "36px",
              background: "white",
            }}
          >
            iMessage
          </div>
          <div style={{ marginLeft: "16px" }}>
            <Icons.MicGrey />
          </div>
        </div>
      );
    }
    if (style === "whatsapp") {
      return (
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <div style={{ paddingRight: "16px" }}>
            <Icons.PlusGrey />
          </div>
          <div
            style={{
              flex: 1,
              height: "90px",
              background: "white",
              borderRadius: "45px",
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              border: "1px solid #f0f0f0",
            }}
          >
            <span style={{ fontSize: "36px", color: "#C7C7CC", flex: 1 }}>
              Message
            </span>
            <div style={{ display: "flex", gap: "22px" }}>
              <Icons.CameraGrey />
            </div>
          </div>
          <div
            style={{
              width: "95px",
              height: "95px",
              background: "#00a884",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "16px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            <Icons.MicWhite />
          </div>
        </div>
      );
    }
    if (style === "instagram") {
      return (
        <div
          style={{
            width: "100%",
            height: "100px",
            background: "#f0f0f0",
            borderRadius: "50px",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              background: "#3b82f6",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "18px",
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="white">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "38px",
              color: "#8E8E93",
              flex: 1,
              fontWeight: 400,
            }}
          >
            Message...
          </span>
          <div style={{ display: "flex", gap: "26px", alignItems: "center" }}>
            <Icons.MicGrey />
            <Icons.ImageSquare />
            <Icons.Sticker />
          </div>
        </div>
      );
    }
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: "24px",
        }}
      >
        <Icons.PlusBlue />
        <Icons.CameraGrey />
        <Icons.ImageSquare />
        <Icons.MicGrey />
        <div
          style={{
            flex: 1,
            height: "90px",
            background: "#f0f0f0",
            borderRadius: "45px",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
          }}
        >
          <span style={{ fontSize: "36px", color: "#8E8E93" }}>Aa</span>
          <span style={{ marginLeft: "auto", fontSize: "30px" }}>😊</span>
        </div>
        <span style={{ color: "#0084FF", fontSize: "52px" }}>👍</span>
      </div>
    );
  };

  return (
    <>
      <div style={headerStyle}>{renderHeader()}</div>
      <div style={footerStyle}>{renderFooter()}</div>
    </>
  );
};

// ============================================================================
// CHAT BUBBLE COMPONENT
// ============================================================================

const ChatBubbleComponent: React.FC<{
  layer: ChatBubbleLayer;
  relativeFrame: number;
  fps: number;
}> = ({ layer, relativeFrame, fps}) => {
  const entrance = getEntranceAnimation(layer, relativeFrame, fps);
  const rotation = layer.rotation || 0;

  const defaultFont = layer.chatStyle === "imessage"
      ? "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
      : "Helvetica, Arial, sans-serif";

  const activeFontFamily = layer.fontFamily || defaultFont;
  
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: `${layer.position.x}%`, 
    top: `${layer.position.y}%`,
    width: `${layer.size.width}%`,
    
    height: "auto", 
    minHeight: "0px",
    
    transform: `translate(${layer.isSender ? -45 : -70}%, -50%) rotate(${rotation}deg) ${entrance.transform}`,
    opacity: layer.opacity * entrance.opacity,
    display: "flex",
    flexDirection: layer.isSender ? "row-reverse" : "row",
    alignItems: "flex-end", 
    justifyContent: "flex-start",
    fontFamily: activeFontFamily,
    boxSizing: "border-box",
    padding: "0", 
  };

  const showAvatar =
    !layer.isSender &&
    (layer.chatStyle === "messenger" || layer.chatStyle === "instagram");
    
  const avatarStyle: React.CSSProperties = {
    width: `${Math.min(layer.size.height, 65)}px`, 
    height: `${Math.min(layer.size.height, 65)}px`,
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
    marginLeft: layer.isSender ? "8px" : "0",
    marginRight: layer.isSender ? "0" : "8px",
  };

  let bubbleStyle: React.CSSProperties = {
    maxWidth: "80%", 
    width: "fit-content",
    height: "auto",
    // minHeight: "100%",
    display: "flex",
    alignItems: "center",
    padding: "12px 20px", 
    fontSize: `${layer.bubbleFontSize || 30}px`, 
    lineHeight: "1.2",
    position: "relative",
    wordWrap: "break-word",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    boxSizing: "border-box",
  };

  if (layer.chatStyle === "imessage") {
    bubbleStyle = {
      ...bubbleStyle,
      borderRadius: "32px",
      padding: "22px 34px",
      backgroundColor: layer.isSender ? "#007AFF" : "#E9E9EB",
      color: layer.isSender ? "#FFFFFF" : "#000000",
      background: layer.isSender
        ? "linear-gradient(180deg, #3593FF 0%, #007AFF 100%)"
        : "#E9E9EB",
      borderBottomRightRadius: layer.isSender ? "6px" : "32px",
      borderBottomLeftRadius: layer.isSender ? "32px" : "6px",
    };
  } else if (layer.chatStyle === "whatsapp") {
    bubbleStyle = {
      ...bubbleStyle,
      display: "block", 
      borderRadius: "18px",
      padding: "16px 24px",
      backgroundColor: layer.isSender ? "#E7FFDB" : "#FFFFFF",
      color: "#111b21",
      fontSize: "38px",
      boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
      borderTopLeftRadius: layer.isSender ? "18px" : "0px",
      borderTopRightRadius: layer.isSender ? "0px" : "18px",
    };
  } else if (layer.chatStyle === "instagram") {
    bubbleStyle = {
      ...bubbleStyle,
      borderRadius: "44px",
      padding: "24px 34px",
      backgroundColor: layer.isSender ? "#EFEFEF" : "#FFFFFF",
      border: layer.isSender ? "none" : "1px solid #dbdbdb",
      color: "#000000",
    };
  } else if (layer.chatStyle === "messenger") {
    bubbleStyle = {
      ...bubbleStyle,
      borderRadius: "32px",
      padding: "20px 30px",
      backgroundColor: layer.isSender ? "#0084FF" : "#E4E6EB",
      color: layer.isSender ? "#FFFFFF" : "#050505",
    };
  } else if (layer.chatStyle === "fakechatconversation") {
    const avatarScale = layer.avatarScale || 1.0;
    const AVATAR_SIZE = 80 * avatarScale ;
    const baseFontSize = layer.bubbleFontSize || 30;
    const fontSize = baseFontSize || 32;

    const message = layer.message || "";
    const baseDuration = message.length * 0.08;
    const typeDur = Math.max(1.5, Math.min(baseDuration, 5));
    const rawProgress = relativeFrame / (typeDur * fps);
    const typingProgress = Math.min(
      rawProgress * (1 + Math.sin(rawProgress * Math.PI) * 0.1),
      1
    );
    const charsToShow = Math.floor(message.length * typingProgress);
    const visibleText = message.slice(0, charsToShow);
    const isTyping = typingProgress < 1;

    const bubbleColor = layer.isSender ? "#0EA5E9" : "#E5E5EA";
    const textColor = layer.isSender ? "#fff" : "#000";
    const avatarColor = layer.isSender ? "#7C3AED" : "#0EA5E9";

    return (
      <div
        style={{
          position: "absolute",
          left: `${layer.position.x}%`,
          top: `${layer.position.y}%`,
          width: `${layer.size.width}%`, 
          minHeight: `${layer.size.height}%`, 
          transform: `translate(-50%, -50%) rotate(${rotation}deg) ${entrance.transform}`,
          display: "flex",
          flexDirection: layer.isSender ? "row-reverse" : "row",
          alignItems: "flex-end",
          gap: 18,
          opacity: layer.opacity * entrance.opacity,
          padding: "0",
        }}
      >
        <div
            style={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              minWidth: AVATAR_SIZE,
              minHeight: AVATAR_SIZE,
              aspectRatio: "1 / 1",
              borderRadius: "50%",
              flex: "0 0 auto", 
              
              overflow: "hidden",
              border: `4px solid ${avatarColor}`,
              backgroundColor: "#fff",
              boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
            }}
          >
          {layer.avatarUrl ? (
            <img
              src={layer.avatarUrl}
              alt={layer.senderName || "Avatar"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: avatarColor,
              }}
            />
          )}
        </div>

        <div
          style={{
            width: "fit-content",
            maxWidth: "80%",
            backgroundColor: bubbleColor,
            color: textColor,
            borderRadius: 28,
            padding: "20px 28px",
            fontSize: fontSize,
            lineHeight: 1.6,
            fontFamily: layer.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: 600,
            boxShadow: "0 8px 22px rgba(0,0,0,0.18)",
            position: "relative",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
              wordBreak: "break-word",
          }}
        >
          {layer.isTyping ? (
            <div
              style={{
                display: "flex",
                gap: "5px",
                padding: "10px 0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: textColor,
                    animation: `typingBounce 1.4s infinite ease-in-out both`,
                    animationDelay: `${i * 0.16}s`,
                  }}
                />
              ))}
              <style>{`
                @keyframes typingBounce { 
                  0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; } 
                  40% { transform: scale(1); opacity: 1; } 
                }
              `}</style>
            </div>
          ) : (
            <>
              <span>{visibleText}</span>
              {isTyping && (
                <span
                  style={{
                    display: "inline-block",
                    width: 12,
                    marginLeft: 4,
                    borderBottom: `3px solid ${textColor}`,
                    animation: "blink 1s step-end infinite",
                    transform: "translateY(-2px)",
                  }}
                />
              )}
            </>
          )}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              width: 0,
              height: 0,
              borderTop: `20px solid ${bubbleColor}`,
              ...(layer.isSender
                ? {
                    right: -12,
                    borderLeft: "20px solid transparent",
                  }
                : {
                    left: -12,
                    borderRight: "20px solid transparent",
                  }),
            }}
          />
        </div>
        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 0 }
            50% { opacity: 1 }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {showAvatar && layer.avatarUrl && (
        <img src={layer.avatarUrl} style={avatarStyle} alt="avatar" />
      )}

      <div style={bubbleStyle}>
        {layer.isTyping ? (
          <div
            style={{
              display: "flex",
              gap: "10px",
              padding: "14px 8px",
              alignItems: "center",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor:
                    layer.isSender && layer.chatStyle !== "instagram"
                      ? "rgba(255,255,255,0.7)"
                      : "#8E8E93",
                  animation: `typingBounce 1.4s infinite ease-in-out both`,
                  animationDelay: `${i * 0.16}s`,
                }}
              />
            ))}
            <style>{`
                @keyframes typingBounce { 
                  0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; } 
                  40% { transform: scale(1); opacity: 1; } 
                }
              `}</style>
          </div>
        ) : (
          <>
            {layer.message}
            {layer.chatStyle === "whatsapp" && (
              <div
                style={{
                  float: "right",
                  marginLeft: "16px",
                  marginTop: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "20px",
                }}
              >
                <span style={{ fontSize: "20px", color: "rgba(0,0,0,0.45)" }}>
                  10:42
                </span>
                {layer.isSender && (
                  <svg width="22" height="22" viewBox="0 0 16 11" fill="none">
                    <path
                      d="M4 6L2 8"
                      stroke="#53bdeb"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M14 1L5 10L2 7"
                      stroke="#53bdeb"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// OTHER LAYERS (Standard)
// ============================================================================

const TextLayerComponent: React.FC<{
  layer: TextLayer;
  relativeFrame: number;
  fps: number;
  width: number;
  height: number;
}> = ({ layer, relativeFrame, fps, height }) => {
  const animationType = layer.animation?.entrance || "fade";
  const duration = layer.animation?.entranceDuration || 30;
  const scaledFontSize = (layer.fontSize / 100) * height;
  const rotation = layer.rotation || 0;

  // Common base styles (keeps original text properties)
  const baseStyle: React.CSSProperties = {
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
    letterSpacing: layer.letterSpacing,
    textTransform: layer.textTransform,
    textShadow: layer.textShadow
      ? `${layer.shadowX}px ${layer.shadowY}px ${layer.shadowBlur}px ${layer.shadowColor}`
      : "none",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    display: "block",
    padding: "0",
  };

  // ========== TYPEWRITER ANIMATION ==========
  if (animationType === "typewriter") {
    const typewriterProgress = interpolate(relativeFrame, [0, duration * 1.5], [0, 1], {
      extrapolateRight: "clamp",
    });
    const entranceOpacity = interpolate(relativeFrame, [0, duration * 0.1], [0, 1], {
      extrapolateRight: "clamp",
    });
    const entranceScale = interpolate(relativeFrame, [0, 15], [0.98, 1], {
      extrapolateRight: "clamp",
    });
    
    const totalChars = layer.content.length;
    const charsToShow = Math.floor(typewriterProgress * totalChars);
    const visibleText = layer.content.substring(0, charsToShow);
    const isComplete = charsToShow >= totalChars;
    const cursorVisible = relativeFrame % 30 < 15 && !isComplete;

    const highlightColor = layer.highlightColor || "rgba(255, 215, 0, 0.4)";
    const hasHighlights = layer.highlightWords && layer.highlightWords.length > 0;
    
    const shouldHighlightWord = (word: string): boolean => {
      if (!layer.highlightWords || layer.highlightWords.length === 0) return false;
      const cleanWord = word.toLowerCase().replace(/[.,!?;:'"]/g, "");
      return layer.highlightWords.some((hw) => hw.toLowerCase() === cleanWord);
    };

    // Render visible text with highlights
    const renderTypewriterText = () => {
      if (!hasHighlights) {
        return visibleText;
      }
      
      const result: React.ReactNode[] = [];
      let currentWord = "";
      let currentIndex = 0;
      
      for (let i = 0; i < visibleText.length; i++) {
        const char = visibleText[i];
        if (char === " " || char === "\n" || char === "\t") {
          if (currentWord) {
            const highlighted = shouldHighlightWord(currentWord);
            result.push(
              <span
                key={currentIndex}
                style={{
                  backgroundColor: highlighted ? highlightColor : "transparent",
                  padding: highlighted ? "2px 4px" : "0",
                  borderRadius: highlighted ? "3px" : "0",
                }}
              >
                {currentWord}
              </span>
            );
            currentIndex++;
            currentWord = "";
          }
          result.push(<span key={`space-${i}`}>{char}</span>);
        } else {
          currentWord += char;
        }
      }
      
      if (currentWord) {
        const highlighted = shouldHighlightWord(currentWord);
        result.push(
          <span
            key={currentIndex}
            style={{
              backgroundColor: highlighted ? highlightColor : "transparent",
              padding: highlighted ? "2px 4px" : "0",
              borderRadius: highlighted ? "3px" : "0",
            }}
          >
            {currentWord}
          </span>
        );
      }
      
      return result;
    };

    return (
      <div
        style={{
          ...baseStyle,
          transform: `rotate(${rotation}deg) scale(${entranceScale})`,
          transformOrigin: "center center",
          opacity: layer.opacity * entranceOpacity,
        }}
      >
        {renderTypewriterText()}
        {cursorVisible && (
          <span style={{ color: layer.fontColor, fontWeight: "100" }}>|</span>
        )}
      </div>
    );
  }

  // ========== KINETIC ANIMATION ==========
  if (animationType === "kinetic") {
    const words = layer.content.split(/\s+/).filter(Boolean);
    const staggerDelay = Math.max(4, Math.floor(duration / (words.length + 2)));

    const highlightColor = layer.highlightColor || "rgba(255, 215, 0, 0.4)";
    const hasHighlights = layer.highlightWords && layer.highlightWords.length > 0;
    
    const shouldHighlightWord = (word: string): boolean => {
      if (!layer.highlightWords || layer.highlightWords.length === 0) return false;
      const cleanWord = word.toLowerCase().replace(/[.,!?;:'"]/g, "");
      return layer.highlightWords.some((hw) => hw.toLowerCase() === cleanWord);
    };

    return (
      <div
        style={{
          ...baseStyle,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center center",
          opacity: layer.opacity,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: layer.textAlign === "center" ? "center" : 
                         layer.textAlign === "right" ? "flex-end" : "flex-start",
          gap: `0 ${scaledFontSize * 0.3}px`,
        }}
      >
        {words.map((word, index) => {
          const wordStartFrame = index * staggerDelay;
          const wordFrame = Math.max(0, relativeFrame - wordStartFrame);
          
          const springProgress = spring({
            frame: wordFrame,
            fps,
            config: { damping: 12, stiffness: 100 },
            durationInFrames: staggerDelay * 2,
          });
          
          // Entry directions based on word index
          const directions = [
            { x: 0, y: -80 },    // top
            { x: 80, y: 0 },     // right
            { x: 0, y: 80 },     // bottom
            { x: -80, y: 0 },    // left
            { x: -60, y: -60 },  // top-left
            { x: 60, y: -60 },   // top-right
          ];
          const dir = directions[index % directions.length];
          
          const translateX = interpolate(springProgress, [0, 1], [dir.x, 0]);
          const translateY = interpolate(springProgress, [0, 1], [dir.y, 0]);
          const wordScale = interpolate(springProgress, [0, 0.5, 0.75, 1], [0.3, 1.15, 0.95, 1]);
          const wordOpacity = interpolate(springProgress, [0, 0.25], [0, 1], {
            extrapolateRight: "clamp",
          });
          const wordRotation = interpolate(springProgress, [0, 1], [index % 2 === 0 ? -12 : 12, 0]);
          const highlighted = hasHighlights && shouldHighlightWord(word);

          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                transform: `translate(${translateX}px, ${translateY}px) scale(${wordScale}) rotate(${wordRotation}deg)`,
                opacity: wordOpacity,
                transformOrigin: "center center",
                backgroundColor: highlighted ? highlightColor : "transparent",
                padding: highlighted ? "2px 4px" : "0",
                borderRadius: highlighted ? "3px" : "0",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  // ========== ALL OTHER ANIMATIONS (fade, slideUp, scale, etc.) ==========
  const entrance = getEntranceAnimation(layer, relativeFrame, fps);
  const words = layer.content.split(/\s+/).filter(Boolean);

  const shouldHighlight = (word: string): boolean => {
    if (!layer.highlightWords || layer.highlightWords.length === 0) return false;
    const cleanWord = word.toLowerCase().replace(/[.,!?;:'"]/g, "");
    return layer.highlightWords.some((hw) => hw.toLowerCase() === cleanWord);
  };

  const highlightColor = layer.highlightColor || "rgba(255, 215, 0, 0.4)";
  const hasHighlights = layer.highlightWords && layer.highlightWords.length > 0;

  return (
    <div
      style={{
        ...baseStyle,
        transform: `rotate(${rotation}deg) ${entrance.transform}`,
        transformOrigin: "center center",
        opacity: layer.opacity * entrance.opacity,
      }}
    >
      {hasHighlights
        ? words.map((word, i) => (
            <React.Fragment key={i}>
              <span
                style={{
                  backgroundColor: shouldHighlight(word) ? highlightColor : "transparent",
                  padding: shouldHighlight(word) ? "2px 4px" : "0",
                  borderRadius: shouldHighlight(word) ? "3px" : "0",
                }}
              >
                {word}
              </span>
              {i < words.length - 1 && " "}
            </React.Fragment>
          ))
        : layer.content}
    </div>
  );
};

const ImageLayerComponent: React.FC<{
  layer: ImageLayer;
  relativeFrame: number;
  fps: number;
}> = ({ layer, relativeFrame, fps }) => {
  const entrance = getEntranceAnimation(layer, relativeFrame, fps);
  const rotation = layer.rotation || 0;
  const crop = layer.crop;

  const cropStyle = crop
    ? {
        clipPath: `inset(${crop.y}% ${100 - crop.x - crop.width}% ${
          100 - crop.y - crop.height
        }% ${crop.x}%)`,
      }
    : {};

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
            objectFit: layer.objectFit,
            filter: layer.filter,
            ...cropStyle,
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
        transform: `rotate(${rotation}deg) ${entrance.transform}`,
        transformOrigin: "center center",
        overflow: "hidden",
      }}
    >
      <Img
        src={layer.src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: layer.objectFit,
          filter: layer.filter,
          ...cropStyle,
        }}
      />
    </div>
  );
};

const VideoLayerComponent: React.FC<{
  layer: VideoLayer;
  relativeFrame: number;
  fps: number;
}> = ({ layer, relativeFrame, fps }) => {
  const entrance = getEntranceAnimation(layer, relativeFrame, fps);
  const duration = layer.endFrame - layer.startFrame;
  const rotation = layer.rotation || 0;

  let volume = layer.volume;
  if (layer.fadeIn)
    volume = interpolate(relativeFrame, [0, layer.fadeIn], [0, layer.volume], {
      extrapolateRight: "clamp",
    });
  if (layer.fadeOut)
    volume = interpolate(
      relativeFrame,
      [duration - layer.fadeOut, duration],
      [layer.volume, 0],
      { extrapolateLeft: "clamp" }
    );
  return (
    <div
      style={{
        position: "absolute",
        left: `${layer.position.x - layer.size.width / 2}%`,
        top: `${layer.position.y - layer.size.height / 2}%`,
        width: `${layer.size.width}%`,
        height: `${layer.size.height}%`,
        opacity: layer.opacity * entrance.opacity,
        transform: `rotate(${rotation}deg) ${entrance.transform}`,
        transformOrigin: "center center",
      }}
    >
      <Video
        src={layer.src}
        volume={volume}
        loop={layer.loop}
        playbackRate={layer.playbackRate}
        style={{
          width: "100%",
          height: "100%",
          objectFit: layer.objectFit,
          filter: layer.filter,
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
  templateId,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const firstChatLayer = layers.find(isChatBubbleLayer);
  const activeChatStyle = firstChatLayer ? firstChatLayer.chatStyle : null;
  const chatName = firstChatLayer?.senderName || "User";
  const chatAvatar = firstChatLayer?.avatarUrl;

  const getChatBackground = (style: ChatStyle | null) => {
    if (!style) return backgroundColor;
    switch (style) {
      case "whatsapp":
        return "linear-gradient(180deg, #128C7E 0%, #075E54 100%)";
      case "imessage":
        return "linear-gradient(180deg, #5AC8FA 0%, #007AFF 100%)";
      case "instagram":
        return "linear-gradient(180deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)";
      case "messenger":
        return "linear-gradient(180deg, #00B2FF 0%, #006AFF 100%)";
      case "fakechatconversation":
        return "#0b0b0b";
      default:
        return backgroundColor;
    }
  };

  const currentBackground =
    templateId === 9 || activeChatStyle
      ? getChatBackground(activeChatStyle)
      : backgroundColor;

  // Ken Burns Template State
  const kenBurnsLayers =
    templateId === 8
      ? (layers.filter(
          (l) =>
            (l.type === "image" || l.type === "video") &&
            !(l as ImageLayer).isBackground &&
            l.id !== "bg-layer" &&
            !l.name.includes("Background") &&
            !l.name.includes("(BG)")
        ) as (ImageLayer | VideoLayer)[])
      : [];

  // Render Layers
  const visibleLayers = layers
    .map((layer, index) => ({ layer, originalIndex: index }))
    .filter(({ layer }) => {
      if (!layer.visible) return false;
      if (layer.id === editingLayerId) return false;
      if (
        (layer as any).id === "chat-bg" &&
        activeChatStyle !== "fakechatconversation"
      )
        return false;
      return frame >= layer.startFrame && frame <= layer.endFrame;
    })
    .sort((a, b) => {
      if (isImageLayer(a.layer) && a.layer.isBackground) return -1;
      if (isImageLayer(b.layer) && b.layer.isBackground) return 1;
      return a.originalIndex - b.originalIndex;
    });

  // ✅ Filter for non-media layers (text, chat, audio) for Template 8
  const nonMediaLayers =
    templateId === 8
      ? visibleLayers.filter(
          ({ layer }) =>
            layer.type === "text" ||
            layer.type === "chat-bubble" ||
            layer.type === "audio"
        )
      : [];

  // 🔍 DEBUG LOGGING
  if (templateId === 8 && frame % 30 === 0) {
    console.log("🎬 Template 8 Rendering - Frame:", frame);
    console.log("📊 Total visible layers:", visibleLayers.length);
    console.log("📝 Non-media layers (text/emoji):", nonMediaLayers.length);
    nonMediaLayers.forEach(({ layer }) => {
      console.log(`  - ${layer.type}: ${layer.name} (${layer.startFrame}-${layer.endFrame})`);
    });
  }

  return (
    <AbsoluteFill style={{ background: currentBackground }}>
      {/* Ken Burns Carousel (Template 8) - z-index: 1 */}
      {templateId === 8 && kenBurnsLayers.length > 0 && !editingLayerId && (
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <KenBurnsCarouselRenderer
            layers={kenBurnsLayers}
            frame={frame}
            fps={fps}
            width={width}
            height={height}
          />
        </div>
      )}

      {/* ✅ Text/Emoji/Chat layers ON TOP - z-index: 100 */}
      {templateId === 8 &&
        !editingLayerId &&
        nonMediaLayers.length > 0 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 100, pointerEvents: "none" }}>
            {nonMediaLayers.map(({ layer }) => {
              const relativeFrame = Math.max(0, frame - layer.startFrame);

              // 🔍 DEBUG: Log when rendering text
              if (isTextLayer(layer) && frame % 30 === 0) {
                console.log("✏️ Rendering text layer:", layer.name, {
                  position: layer.position,
                  size: layer.size,
                  content: layer.content,
                  opacity: layer.opacity,
                });
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
              if (isChatBubbleLayer(layer)) {
                return (
                  <ChatBubbleComponent
                    key={layer.id}
                    layer={layer}
                    relativeFrame={relativeFrame}
                    fps={fps}
                  />
                );
              }
              return null;
            })}
          </div>
        )}

      {/* Normal Layer Rendering (All other templates OR editing mode) */}
      {(templateId !== 8 || editingLayerId) &&
        visibleLayers.map(({ layer }) => {
          if (layer.type === 'reddit-card' || layer.type === 'reddit-story') {
            return null;
          }
          const relativeFrame = Math.max(0, frame - layer.startFrame);

          if (
            (isVideoLayer(layer) || isImageLayer(layer)) &&
            layer.id === "chat-bg" &&
            activeChatStyle !== "fakechatconversation"
          ) {
            return null;
          }

          if (isImageLayer(layer))
            return (
              <ImageLayerComponent
                key={layer.id}
                layer={layer}
                relativeFrame={relativeFrame}
                fps={fps}
              />
            );
          if (isTextLayer(layer))
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
          if (isVideoLayer(layer))
            return (
              <VideoLayerComponent
                key={layer.id}
                layer={layer}
                relativeFrame={relativeFrame}
                fps={fps}
              />
            );
          if (isChatBubbleLayer(layer))
            return (
              <ChatBubbleComponent
                key={layer.id}
                layer={layer}
                relativeFrame={relativeFrame}
                fps={fps}
              />
            );
          return null;
        })}

      {/* Chat Interface Overlay */}
      {(templateId === 9 || activeChatStyle) &&
        activeChatStyle &&
        activeChatStyle !== "fakechatconversation" && (
          <ChatInterface
            style={activeChatStyle}
            name={chatName}
            avatar={chatAvatar}
          />
        )}

      {/* Audio Layers (All templates) */}
      {layers
        .filter(
          (l): l is AudioLayer =>
            l.type === "audio" && l.visible && l.id !== editingLayerId
        )
        .map((layer) => (
          <Sequence
            key={layer.id}
            from={layer.startFrame}
            durationInFrames={layer.endFrame - layer.startFrame}
          >
            <Audio
              src={(layer as AudioLayer).src}
              volume={(layer as AudioLayer).volume}
            />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};

export default DynamicLayerComposition;