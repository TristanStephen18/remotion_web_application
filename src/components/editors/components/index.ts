// ============================================================================
// COMPLETE index.ts WITH VIDEO SUPPORT
// ============================================================================

// Icons
export { EditorIcons } from "./EditorIcons";

// Timeline
export { Timeline } from "./Timeline";
export type { TimelineProps, TimelineTrack } from "./Timeline";

// Dynamic Preview Overlay (for layer-based editor)
export { DynamicPreviewOverlay } from "./DynamicPreviewOverlay";
export type { DynamicPreviewOverlayProps } from "./DynamicPreviewOverlay";

// Remotion Preview - ✅ UNCOMMENT THESE LINES
export { RemotionPreview } from "./RemotionPreview";
export type { RemotionPreviewProps, RemotionPreviewHandle } from "./RemotionPreview";

// Dynamic Layer Composition - WITH VIDEO SUPPORT
export { DynamicLayerComposition } from "../../remotion_compositions/DynamicLayerComposition";
export type { 
  Layer, 
  TextLayer, 
  ImageLayer, 
  VideoLayer,
  AudioLayer,
  LayerBase,
  DynamicCompositionProps 
} from "../../remotion_compositions/DynamicLayerComposition";
export { 
  isTextLayer, 
  isImageLayer, 
  isVideoLayer, 
  isAudioLayer 
} from "../../remotion_compositions/DynamicLayerComposition";