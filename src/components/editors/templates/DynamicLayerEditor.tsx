// import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import toast from "react-hot-toast";

// // ============================================================================
// // EDITOR COMPONENTS - Update these paths to match your project structure
// // ============================================================================


// // Import the new dynamic composition
// import { 
//   DynamicLayerComposition, 
//   type Layer, 
//   type TextLayer, 
//   type ImageLayer,
//   type AudioLayer,
//   type VideoLayer,
//   isTextLayer,
//   isImageLayer,
//   isAudioLayer,
//   isVideoLayer,
// } from "../../remotion_compositions/DynamicLayerComposition";

// // Your existing hooks - update paths as needed
// import { useProjectSave } from "../../../hooks/SaveProject";
// import { useFileUpload } from "../../../hooks/uploads/HandleImageUpload";
// import { renderVideo } from "../../../utils/VideoRenderer";
// import { backendPrefix } from "../../../config";

// import { ExportModal } from "../../ui/modals/ExportModal";
// import { SaveProjectModal } from "../../ui/modals/SaveModal";
// import { LoadingOverlay } from "../../ui/modals/LoadingProjectModal";
// import { DynamicPreviewOverlay, EditorIcons, RemotionPreview, Timeline, type RemotionPreviewHandle } from "../components";
// import type { TimelineTrack } from "../components/Timeline";

// // ============================================================================
// // CONSTANTS
// // ============================================================================

// const FPS = 30;
// const DEFAULT_BACKGROUND = "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1080";
// const MAX_HISTORY_SIZE = 50;

// const FONTS = [
//   { label: "Roboto", value: "Roboto, sans-serif" },
//   { label: "Cormorant Garamond", value: "Cormorant Garamond, serif" },
//   { label: "Playfair Display", value: "Playfair Display, serif" },
//   { label: "Inter", value: "Inter, sans-serif" },
//   { label: "Montserrat", value: "Montserrat, sans-serif" },
//   { label: "Lora", value: "Lora, serif" },
//   { label: "Open Sans", value: "Open Sans, sans-serif" },
//   { label: "Poppins", value: "Poppins, sans-serif" },
// ];

// const FONT_WEIGHTS = [
//   { label: "Regular", value: "normal" },
//   { label: "Medium", value: "500" },
//   { label: "Semi Bold", value: "600" },
//   { label: "Bold", value: "bold" },
// ];

// const LAYER_COLORS: Record<string, string> = {
//   text: "#3b82f6",
//   image: "#10b981",
//   audio: "#f59e0b",
//   video: "#8b5cf6",
// };

// // Cloudinary video library - placeholder videos
// const CLOUDINARY_VIDEOS = {
//   backgroundVideos: [
//     {
//       id: "bg_video_1",
//       name: "City Sunset",
//       thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/dog.jpg",
//       url: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
//       duration: "3m 0s",
//     },
//     {
//       id: "bg_video_2",
//       name: "Ocean Waves",
//       thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/sea_turtle.jpg",
//       url: "https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4",
//       duration: "1m 0s",
//     },
//     {
//       id: "bg_video_3",
//       name: "Forest Path",
//       thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/docs/folder_preview.jpg",
//       url: "https://res.cloudinary.com/demo/video/upload/docs/walking_talking.mp4",
//       duration: "8m 0s",
//     },
//     {
//       id: "bg_video_4",
//       name: "Mountain View",
//       thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/cld-sample-video.jpg",
//       url: "https://res.cloudinary.com/demo/video/upload/cld-sample-video.mp4",
//       duration: "2m 30s",
//     },
//   ],
//   visualEffects: [
//     {
//       id: "vfx_video_1",
//       name: "Glitch Effect",
//       thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/dog.jpg",
//       url: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
//       duration: "15s",
//     },
//     {
//       id: "vfx_video_2",
//       name: "Text Overlay",
//       thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/sea_turtle.jpg",
//       url: "https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4",
//       duration: "30s",
//     },
//     {
//       id: "vfx_video_3",
//       name: "Transition",
//       thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/cld-sample-video.jpg",
//       url: "https://res.cloudinary.com/demo/video/upload/cld-sample-video.mp4",
//       duration: "10s",
//     },
//   ],
// };

// // Sidebar tab types
// type SidebarTab = "layers" | "text" | "media" | "audio" | "video" | null;

// const generateId = () => `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// const createDefaultLayers = (duration: number): Layer[] => [
//   {
//     id: "bg_default",
//     type: "image",
//     name: "Background",
//     visible: true,
//     locked: false,
//     startFrame: 0,
//     endFrame: duration * FPS,
//     position: { x: 50, y: 50 },
//     size: { width: 100, height: 100 },
//     rotation: 0,
//     opacity: 1,
//     src: DEFAULT_BACKGROUND,
//     isBackground: true,
//     objectFit: "cover",
//     filter: "brightness(0.6)",
//   } as ImageLayer,
//   {
//     id: "text_quote",
//     type: "text",
//     name: "Quote",
//     visible: true,
//     locked: false,
//     startFrame: Math.round(duration * FPS * 0.1),
//     endFrame: duration * FPS,
//     position: { x: 50, y: 40 },
//     size: { width: 80, height: 25 },
//     rotation: 0,
//     opacity: 1,
//     content: "Your inspiring quote goes here",
//     fontFamily: "Roboto, sans-serif",
//     fontSize: 5,
//     fontColor: "#ffffff",
//     fontWeight: "normal",
//     fontStyle: "normal",
//     textAlign: "center",
//     lineHeight: 1.5,
//     textOutline: true,
//     outlineColor: "#000000",
//     textShadow: true,
//     shadowColor: "#000000",
//     shadowX: 2,
//     shadowY: 2,
//     shadowBlur: 4,
//     animation: { entrance: "slideUp", entranceDuration: 45 },
//   } as TextLayer,
//   {
//     id: "text_author",
//     type: "text",
//     name: "Author",
//     visible: true,
//     locked: false,
//     startFrame: Math.round(duration * FPS * 0.5),
//     endFrame: duration * FPS,
//     position: { x: 50, y: 75 },
//     size: { width: 60, height: 10 },
//     rotation: 0,
//     opacity: 1,
//     content: "— Author Name",
//     fontFamily: "Roboto, sans-serif",
//     fontSize: 2.5,
//     fontColor: "#ffffff",
//     fontWeight: "600",
//     fontStyle: "normal",
//     textAlign: "center",
//     lineHeight: 1.4,
//     textTransform: "uppercase",
//     letterSpacing: 2,
//     textOutline: false,
//     outlineColor: "#000000",
//     textShadow: false,
//     shadowColor: "#000000",
//     shadowX: 0,
//     shadowY: 0,
//     shadowBlur: 0,
//     animation: { entrance: "fade", entranceDuration: 30 },
//   } as TextLayer,
// ];

// // ============================================================================
// // ICONS
// // ============================================================================

// const Icons = {
//   ChevronLeft: () => (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M15 18l-6-6 6-6" />
//     </svg>
//   ),
//   ChevronRight: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M9 18l6-6-6-6" />
//     </svg>
//   ),
//   Underline: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3" />
//       <line x1="4" y1="21" x2="20" y2="21" />
//     </svg>
//   ),
//   Strikethrough: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <line x1="4" y1="12" x2="20" y2="12" />
//       <path d="M17.5 6.5c-.83-1.5-2.5-2.5-4.5-2.5-3 0-5 2-5 4.5 0 2.5 2 3.5 5 4.5 3 1 5 2 5 4.5 0 2.5-2 4.5-5 4.5-2.5 0-4.5-1.5-5-3.5" />
//     </svg>
//   ),
//   AllCaps: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <text x="2" y="17" fontSize="14" fontWeight="bold" fill="currentColor" stroke="none">Aa</text>
//     </svg>
//   ),
//   Spacing: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M3 6h18M3 12h18M3 18h18" />
//     </svg>
//   ),
//   Plus: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M12 5v14M5 12h14" />
//     </svg>
//   ),
//   Layers: () => (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <polygon points="12 2 2 7 12 12 22 7 12 2" />
//       <polyline points="2 17 12 22 22 17" />
//       <polyline points="2 12 12 17 22 12" />
//     </svg>
//   ),
//   Close: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M18 6L6 18M6 6l12 12" />
//     </svg>
//   ),
//   Music: () => (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M9 18V5l12-2v13" />
//       <circle cx="6" cy="18" r="3" />
//       <circle cx="18" cy="16" r="3" />
//     </svg>
//   ),
//   Volume: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
//       <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
//       <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
//     </svg>
//   ),
// };

// // ============================================================================
// // HISTORY HOOK FOR UNDO/REDO
// // ============================================================================

// function useHistory(initialLayers: Layer[]) {
//   const [historyState, setHistoryState] = useState({
//     history: [initialLayers],
//     currentIndex: 0,
//   });
  
//   const canUndo = historyState.currentIndex > 0;
//   const canRedo = historyState.currentIndex < historyState.history.length - 1;
  
//   // Safely get current layers
//   const currentLayers = historyState.history[historyState.currentIndex] || initialLayers;
  
//   const pushState = useCallback((newLayers: Layer[]) => {
//     setHistoryState(prev => {
//       // Remove any future history if we're not at the end
//       const newHistory = prev.history.slice(0, prev.currentIndex + 1);
//       newHistory.push(newLayers);
      
//       // Limit history size
//       if (newHistory.length > MAX_HISTORY_SIZE) {
//         newHistory.shift();
//         return {
//           history: newHistory,
//           currentIndex: newHistory.length - 1,
//         };
//       }
      
//       return {
//         history: newHistory,
//         currentIndex: prev.currentIndex + 1,
//       };
//     });
//   }, []);
  
//   const undo = useCallback(() => {
//     setHistoryState(prev => ({
//       ...prev,
//       currentIndex: Math.max(0, prev.currentIndex - 1),
//     }));
//   }, []);
  
//   const redo = useCallback(() => {
//     setHistoryState(prev => ({
//       ...prev,
//       currentIndex: Math.min(prev.history.length - 1, prev.currentIndex + 1),
//     }));
//   }, []);
  
//   const resetHistory = useCallback((newLayers: Layer[]) => {
//     setHistoryState({
//       history: [newLayers],
//       currentIndex: 0,
//     });
//   }, []);
  
//   return {
//     layers: currentLayers,
//     pushState,
//     undo,
//     redo,
//     canUndo,
//     canRedo,
//     resetHistory,
//   };
// }

// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================

// export const DynamicLayerEditor: React.FC = () => {
//   const { id } = useParams();
//   const { isUploading, uploadedUrl, uploadFile } = useFileUpload({ type: "image" });

//   // ============================================================================
//   // STATE WITH HISTORY
//   // ============================================================================

//   const initialLayers = createDefaultLayers(9);
//   const {
//     layers,
//     pushState,
//     undo,
//     redo,
//     canUndo,
//     canRedo,
//     resetHistory,
//   } = useHistory(initialLayers);

//   const [duration, setDuration] = useState(9);
//   const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<SidebarTab>(null);
//   const [editingLayerId, setEditingLayerId] = useState<string | null>(null);

//   // Playback state
//   const [currentFrame, setCurrentFrame] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);

//   // UI State
//   const [isExporting, setIsExporting] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [exportUrl, setExportUrl] = useState<string | null>(null);

//   // Preview container dimensions for overlay
//   const [previewDimensions, setPreviewDimensions] = useState({ width: 0, height: 0 });
//   const previewContainerRef = useRef<HTMLDivElement>(null);

//   // Refs
//   const previewRef = useRef<RemotionPreviewHandle>(null);
//   const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const audioInputRef = useRef<HTMLInputElement>(null);

//   // Derived values
//   const totalFrames = duration * FPS;
//   const selectedLayer = layers.find((l) => l.id === selectedLayerId);
//   const selectedTextLayer = selectedLayer && isTextLayer(selectedLayer) ? selectedLayer : null;
//   const selectedImageLayer = selectedLayer && isImageLayer(selectedLayer) && !selectedLayer.isBackground ? selectedLayer : null;
//   const selectedAudioLayer = selectedLayer && isAudioLayer(selectedLayer) ? selectedLayer : null;
//   const selectedVideoLayer = selectedLayer && isVideoLayer(selectedLayer) ? selectedLayer : null;

//   // Update preview dimensions on resize
//   useEffect(() => {
//     const updateDimensions = () => {
//       if (previewContainerRef.current) {
//         const rect = previewContainerRef.current.getBoundingClientRect();
//         setPreviewDimensions({ width: rect.width, height: rect.height });
//       }
//     };

//     updateDimensions();
//     window.addEventListener("resize", updateDimensions);
//     const timeout = setTimeout(updateDimensions, 100);
    
//     return () => {
//       window.removeEventListener("resize", updateDimensions);
//       clearTimeout(timeout);
//     };
//   }, []);

//   // ============================================================================
//   // TIMELINE TRACKS (derived from layers)
//   // ============================================================================

//   const timelineTracks: TimelineTrack[] = useMemo(() => {
//     return layers.map((layer) => ({
//       id: layer.id,
//       type: layer.type === "text" ? "text" : layer.type === "audio" ? "audio" : "image",
//       label: layer.name,
//       color: LAYER_COLORS[layer.type] || "#666",
//       startFrame: layer.startFrame,
//       endFrame: layer.endFrame,
//       locked: layer.locked,
//       visible: layer.visible,
//     }));
//   }, [layers]);

//   // ============================================================================
//   // SIDEBAR TAB HANDLING
//   // ============================================================================

//   const handleTabClick = useCallback((tab: SidebarTab) => {
//     if (activeTab === tab) {
//       setActiveTab(null);
//     } else {
//       setActiveTab(tab);
//     }
//   }, [activeTab]);

//   // ============================================================================
//   // LAYER MANAGEMENT
//   // ============================================================================

//   const addTextLayer = useCallback(() => {
//     const newLayer: TextLayer = {
//       id: generateId(),
//       type: "text",
//       name: `Text ${layers.filter((l) => l.type === "text").length + 1}`,
//       visible: true,
//       locked: false,
//       startFrame: currentFrame,
//       endFrame: Math.min(currentFrame + 90, totalFrames),
//       position: { x: 50, y: 50 },
//       size: { width: 70, height: 15 },
//       rotation: 0,
//       opacity: 1,
//       content: "New Text",
//       fontFamily: "Roboto, sans-serif",
//       fontSize: 4,
//       fontColor: "#ffffff",
//       fontWeight: "normal",
//       fontStyle: "normal",
//       textAlign: "center",
//       lineHeight: 1.4,
//       textOutline: false,
//       outlineColor: "#000000",
//       textShadow: false,
//       shadowColor: "#000000",
//       shadowX: 0,
//       shadowY: 0,
//       shadowBlur: 0,
//       animation: { entrance: "fade", entranceDuration: 30 },
//     };
//     pushState([...layers, newLayer]);
//     setSelectedLayerId(newLayer.id);
//   }, [currentFrame, totalFrames, layers, pushState]);

//   const addImageLayer = useCallback(() => {
//     fileInputRef.current?.click();
//   }, []);

//   const handleImageUpload = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const file = e.target.files?.[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//           const newLayer: ImageLayer = {
//             id: generateId(),
//             type: "image",
//             name: `Image ${layers.filter((l) => l.type === "image").length + 1}`,
//             visible: true,
//             locked: false,
//             startFrame: currentFrame,
//             endFrame: Math.min(currentFrame + 90, totalFrames),
//             position: { x: 50, y: 50 },
//             size: { width: 40, height: 25 },
//             rotation: 0,
//             opacity: 1,
//             src: event.target?.result as string,
//             isBackground: false,
//             objectFit: "contain",
//           };
//           pushState([...layers, newLayer]);
//           setSelectedLayerId(newLayer.id);
//         };
//         reader.readAsDataURL(file);
//       }
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//     },
//     [currentFrame, totalFrames, layers, pushState]
//   );

//   const addAudioLayer = useCallback(() => {
//     audioInputRef.current?.click();
//   }, []);

//   const handleAudioUpload = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const file = e.target.files?.[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//           const newLayer: AudioLayer = {
//             id: generateId(),
//             type: "audio",
//             name: file.name.replace(/\.[^/.]+$/, "") || `Audio ${layers.filter((l) => l.type === "audio").length + 1}`,
//             visible: true,
//             locked: false,
//             startFrame: currentFrame,
//             endFrame: Math.min(currentFrame + 150, totalFrames), // 5 seconds default
//             position: { x: 50, y: 50 },
//             size: { width: 100, height: 10 },
//             rotation: 0,
//             opacity: 1,
//             src: event.target?.result as string,
//             volume: 1,
//             loop: false,
//             fadeIn: 0,
//             fadeOut: 0,
//           };
//           pushState([...layers, newLayer]);
//           setSelectedLayerId(newLayer.id);
//           toast.success("Audio added");
//         };
//         reader.readAsDataURL(file);
//       }
//       if (audioInputRef.current) {
//         audioInputRef.current.value = "";
//       }
//     },
//     [currentFrame, totalFrames, layers, pushState]
//   );

//   // Video layer functions
//   const videoInputRef = useRef<HTMLInputElement>(null);

//   const addVideoLayer = useCallback(() => {
//     videoInputRef.current?.click();
//   }, []);

//   const handleVideoUpload = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const file = e.target.files?.[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//           const newLayer: VideoLayer = {
//             id: generateId(),
//             type: "video",
//             name: file.name.replace(/\.[^/.]+$/, "") || `Video ${layers.filter((l) => l.type === "video").length + 1}`,
//             visible: true,
//             locked: false,
//             startFrame: currentFrame,
//             endFrame: Math.min(currentFrame + 150, totalFrames), // 5 seconds default
//             position: { x: 50, y: 50 },
//             size: { width: 60, height: 45 },
//             rotation: 0,
//             opacity: 1,
//             src: event.target?.result as string,
//             volume: 0.8,
//             loop: false,
//             playbackRate: 1,
//             objectFit: "contain",
//             filter: "",
//             fadeIn: 0,
//             fadeOut: 0,
//             animation: {
//               entrance: "fade",
//               entranceDuration: 30,
//             },
//           };
//           pushState([newLayer, ...layers]);
//           setSelectedLayerId(newLayer.id);
//           setActiveTab("video");
//           toast.success("Video added");
//         };
//         reader.readAsDataURL(file);
//       }
//       if (videoInputRef.current) {
//         videoInputRef.current.value = "";
//       }
//     },
//     [currentFrame, totalFrames, layers, pushState]
//   );

//   const updateLayer = useCallback((layerId: string, updates: Partial<Layer>) => {
//     const newLayers = layers.map((layer): Layer => {
//       if (layer.id !== layerId) return layer;
//       return { ...layer, ...updates } as Layer;
//     });
//     pushState(newLayers);
//   }, [layers, pushState]);

//   const deleteLayer = useCallback(
//     (layerId: string) => {
//       const layer = layers.find((l) => l.id === layerId);
//       if (layer && isImageLayer(layer) && layer.isBackground) {
//         toast.error("Cannot delete background layer");
//         return;
//       }
//       const newLayers = layers.filter((l) => l.id !== layerId);
//       pushState(newLayers);
//       if (selectedLayerId === layerId) {
//         setSelectedLayerId(null);
//       }
//       toast.success("Layer deleted");
//     },
//     [selectedLayerId, layers, pushState]
//   );

//   // ============================================================================
//   // CUT LAYER AT PLAYHEAD
//   // ============================================================================

//   const cutLayerAtPlayhead = useCallback((layerId: string, frame: number) => {
//     const layer = layers.find((l) => l.id === layerId);
//     if (!layer) return;
    
//     if (frame <= layer.startFrame || frame >= layer.endFrame) {
//       toast.error("Playhead must be within the layer to cut");
//       return;
//     }

//     if (layer.locked) {
//       toast.error("Cannot cut a locked layer");
//       return;
//     }

//     const newLayerId = generateId();
//     const newLayer: Layer = layer.type === "text" 
//       ? {
//           ...layer,
//           id: newLayerId,
//           name: `${layer.name} (cut)`,
//           startFrame: frame,
//           endFrame: layer.endFrame,
//         } as TextLayer
//       : {
//           ...layer,
//           id: newLayerId,
//           name: `${layer.name} (cut)`,
//           startFrame: frame,
//           endFrame: layer.endFrame,
//         } as ImageLayer;

//     const updatedLayers = layers.map((l): Layer => {
//       if (l.id === layerId) {
//         if (l.type === "text") {
//           return { ...l, endFrame: frame } as TextLayer;
//         }
//         return { ...l, endFrame: frame } as ImageLayer;
//       }
//       return l;
//     });

//     const originalIndex = updatedLayers.findIndex(l => l.id === layerId);
//     updatedLayers.splice(originalIndex + 1, 0, newLayer);

//     pushState(updatedLayers);
//     setSelectedLayerId(newLayerId);
//     toast.success("Layer cut at playhead");
//   }, [layers, pushState]);

//   // ============================================================================
//   // REORDER LAYERS
//   // ============================================================================

//   const reorderLayers = useCallback((fromIndex: number, toIndex: number) => {
//     const newLayers = [...layers];
//     const [removed] = newLayers.splice(fromIndex, 1);
//     newLayers.splice(toIndex, 0, removed);
//     pushState(newLayers);
//   }, [layers, pushState]);

//   const handleLayerUpdateFromOverlay = useCallback((layerId: string, updates: Partial<Layer>) => {
//     updateLayer(layerId, updates as Partial<TextLayer> | Partial<ImageLayer>);
//   }, [updateLayer]);

//   // ============================================================================
//   // TRACK CHANGE HANDLER (from Timeline)
//   // ============================================================================

//   const handleTracksChange = useCallback((newTracks: TimelineTrack[]) => {
//     const newLayers = layers.map((layer): Layer => {
//       const track = newTracks.find((t) => t.id === layer.id);
//       if (track) {
//         const updates = {
//           startFrame: track.startFrame,
//           endFrame: track.endFrame,
//           locked: track.locked,
//           visible: track.visible,
//         };
//         if (layer.type === "text") {
//           return { ...layer, ...updates } as TextLayer;
//         }
//         return { ...layer, ...updates } as ImageLayer;
//       }
//       return layer;
//     });
//     pushState(newLayers);
//   }, [layers, pushState]);

//   // Handle delete from timeline
//   const handleDeleteTrack = useCallback((trackId: string) => {
//     deleteLayer(trackId);
//   }, [deleteLayer]);

//   // Handle cut from timeline
//   const handleCutTrack = useCallback((trackId: string, frame: number) => {
//     cutLayerAtPlayhead(trackId, frame);
//   }, [cutLayerAtPlayhead]);

//   // Handle reorder from timeline
//   const handleReorderTracks = useCallback((fromIndex: number, toIndex: number) => {
//     reorderLayers(fromIndex, toIndex);
//   }, [reorderLayers]);

//   // ============================================================================
//   // PLAYBACK CONTROL
//   // ============================================================================

//   const handlePlayPause = useCallback(() => {
//     if (isPlaying) {
//       setIsPlaying(false);
//       previewRef.current?.pause();
//       if (playbackIntervalRef.current) {
//         clearInterval(playbackIntervalRef.current);
//         playbackIntervalRef.current = null;
//       }
//     } else {
//       setIsPlaying(true);
//       previewRef.current?.play();
//       playbackIntervalRef.current = setInterval(() => {
//         const frame = previewRef.current?.getCurrentFrame() ?? 0;
//         setCurrentFrame(frame);
//       }, 1000 / 30);
//     }
//   }, [isPlaying]);

//   const handleFrameChange = useCallback((frame: number) => {
//     setCurrentFrame(frame);
//     previewRef.current?.seekTo(frame);
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (playbackIntervalRef.current) {
//         clearInterval(playbackIntervalRef.current);
//       }
//     };
//   }, []);

//   // ============================================================================
//   // KEYBOARD SHORTCUTS
//   // ============================================================================

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (
//         e.target instanceof HTMLInputElement ||
//         e.target instanceof HTMLTextAreaElement ||
//         (e.target as HTMLElement).contentEditable === "true"
//       ) {
//         return;
//       }

//       // Undo: Ctrl+Z or Cmd+Z
//       if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
//         e.preventDefault();
//         undo();
//         return;
//       }

//       // Redo: Ctrl+Shift+Z or Cmd+Shift+Z or Ctrl+Y
//       if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
//         e.preventDefault();
//         redo();
//         return;
//       }

//       // Cut: C key
//       if (e.code === "KeyC" && !e.ctrlKey && !e.metaKey && selectedLayerId) {
//         e.preventDefault();
//         cutLayerAtPlayhead(selectedLayerId, currentFrame);
//         return;
//       }

//       if (e.code === "Space") {
//         e.preventDefault();
//         handlePlayPause();
//       } else if (e.code === "Delete" || e.code === "Backspace") {
//         if (selectedLayerId) {
//           e.preventDefault();
//           deleteLayer(selectedLayerId);
//         }
//       } else if (e.code === "Escape") {
//         setSelectedLayerId(null);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [handlePlayPause, selectedLayerId, deleteLayer, undo, redo, cutLayerAtPlayhead, currentFrame]);

//   // ============================================================================
//   // PROJECT SAVE
//   // ============================================================================

//   const {
//     isSaving,
//     showSaveModal,
//     setShowSaveModal,
//     handleSave,
//     saveNewProject,
//     lastSavedProps,
//     setProjectId,
//   } = useProjectSave({
//     templateId: 2,
//     buildProps: () => ({
//       layers,
//       duration,
//     }),
//     videoEndpoint: `${backendPrefix}/generatevideo/dynamiclayer`,
//   });

//   // ============================================================================
//   // EXPORT
//   // ============================================================================

//   const handleExport = async (format: string) => {
//     setIsExporting(true);
//     const props = { layers, duration };
//     const exportResponse = await renderVideo(props, 2, "DynamicLayerComposition", format);
//     if (exportResponse === "error") {
//       toast.error("There was an error exporting your video");
//     } else {
//       setExportUrl(exportResponse);
//     }
//     setShowExportModal(true);
//     setIsExporting(false);
//   };

//   // ============================================================================
//   // LOAD PROJECT
//   // ============================================================================

//   useEffect(() => {
//     if (id) {
//       setIsLoading(true);
//       fetch(`${backendPrefix}/projects/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       })
//         .then((res) => {
//           if (!res.ok) throw new Error("Failed to load project");
//           return res.json();
//         })
//         .then((data) => {
//           setProjectId(data.id);
//           if (data.props.layers) {
//             resetHistory(data.props.layers);
//           }
//           if (data.props.duration) setDuration(data.props.duration);
//           lastSavedProps.current = data.props;
//         })
//         .catch((err) => console.error("Project load failed:", err))
//         .finally(() => setIsLoading(false));
//     }
//   }, [id, resetHistory]);

//   // ============================================================================
//   // STYLES
//   // ============================================================================

//   const styles: Record<string, React.CSSProperties> = {
//     container: {
//       display: "flex",
//       height: "100vh",
//       width: "100%",
//       backgroundColor: "#0f0f0f",
//       fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       color: "#e5e5e5",
//       overflow: "hidden",
//     },
//     leftSidebar: {
//       width: "60px",
//       minWidth: "60px",
//       backgroundColor: "#0a0a0a",
//       borderRight: "1px solid rgba(255,255,255,0.08)",
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       paddingTop: "16px",
//       gap: "8px",
//     },
//     sidebarButton: {
//       width: "44px",
//       height: "44px",
//       border: "none",
//       backgroundColor: "transparent",
//       color: "#666",
//       cursor: "pointer",
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       gap: "4px",
//       borderRadius: "8px",
//       transition: "all 0.15s",
//       fontSize: "9px",
//       fontWeight: 500,
//     },
//     sidebarButtonActive: {
//       color: "#3b82f6",
//       backgroundColor: "rgba(59, 130, 246, 0.1)",
//     },
//     layersPanel: {
//       width: "320px",
//       minWidth: "320px",
//       backgroundColor: "#141414",
//       borderRight: "1px solid rgba(255,255,255,0.08)",
//       display: "flex",
//       flexDirection: "column",
//       overflow: "hidden",
//       transition: "width 0.2s ease, min-width 0.2s ease, opacity 0.2s ease",
//     },
//     layersPanelClosed: {
//       width: "0px",
//       minWidth: "0px",
//       borderRight: "none",
//       opacity: 0,
//     },
//     layersPanelHeader: {
//       padding: "16px",
//       borderBottom: "1px solid rgba(255,255,255,0.08)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//     },
//     layersPanelTitle: {
//       fontSize: "13px",
//       fontWeight: "600",
//       color: "#e5e5e5",
//     },
//     headerButtons: {
//       display: "flex",
//       gap: "4px",
//     },
//     addLayerButton: {
//       width: "28px",
//       height: "28px",
//       border: "1px solid rgba(255,255,255,0.1)",
//       backgroundColor: "transparent",
//       color: "#888",
//       cursor: "pointer",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       borderRadius: "6px",
//       transition: "all 0.15s",
//     },
//     closeButton: {
//       width: "28px",
//       height: "28px",
//       border: "none",
//       backgroundColor: "transparent",
//       color: "#666",
//       cursor: "pointer",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       borderRadius: "6px",
//       transition: "all 0.15s",
//     },
//     layersList: {
//       flex: 1,
//       overflowY: "auto",
//       padding: "8px",
//     },
//     layerItem: {
//       padding: "10px 12px",
//       borderRadius: "6px",
//       cursor: "pointer",
//       display: "flex",
//       alignItems: "center",
//       gap: "10px",
//       marginBottom: "4px",
//       transition: "all 0.15s",
//       backgroundColor: "transparent",
//       border: "1px solid transparent",
//     },
//     layerItemActive: {
//       backgroundColor: "rgba(59, 130, 246, 0.15)",
//       border: "1px solid rgba(59, 130, 246, 0.3)",
//     },
//     layerIcon: {
//       width: "24px",
//       height: "24px",
//       borderRadius: "4px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       flexShrink: 0,
//     },
//     layerName: {
//       fontSize: "12px",
//       fontWeight: "500",
//       color: "#e5e5e5",
//       flex: 1,
//       overflow: "hidden",
//       textOverflow: "ellipsis",
//       whiteSpace: "nowrap",
//     },
//     layerType: {
//       fontSize: "10px",
//       color: "#666",
//       textTransform: "uppercase",
//     },
//     editPanel: {
//       width: "320px",
//       minWidth: "320px",
//       backgroundColor: "#141414",
//       borderRight: "1px solid rgba(255,255,255,0.08)",
//       display: "flex",
//       flexDirection: "column",
//       overflow: "hidden",
//       transition: "width 0.2s ease, min-width 0.2s ease, opacity 0.2s ease",
//     },
//     editPanelHidden: {
//       width: 0,
//       minWidth: 0,
//       opacity: 0,
//       overflow: "hidden",
//     },
//     editPanelHeader: {
//       padding: "16px",
//       borderBottom: "1px solid rgba(255,255,255,0.08)",
//       display: "flex",
//       alignItems: "center",
//       gap: "12px",
//     },
//     backButton: {
//       width: "32px",
//       height: "32px",
//       border: "none",
//       backgroundColor: "transparent",
//       color: "#888",
//       cursor: "pointer",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       borderRadius: "6px",
//       transition: "all 0.15s",
//     },
//     editPanelTitle: {
//       fontSize: "14px",
//       fontWeight: "600",
//       color: "#e5e5e5",
//     },
//     editPanelContent: {
//       flex: 1,
//       overflowY: "auto",
//       padding: "16px",
//       display: "flex",
//       flexDirection: "column",
//       gap: "20px",
//     },
//     textInput: {
//       width: "100%",
//       padding: "12px",
//       backgroundColor: "#1a1a1a",
//       border: "1px solid rgba(255,255,255,0.1)",
//       borderRadius: "8px",
//       color: "#e5e5e5",
//       fontSize: "14px",
//       outline: "none",
//       resize: "none",
//       minHeight: "80px",
//       fontFamily: "inherit",
//     },
//     styleSection: {
//       display: "flex",
//       flexDirection: "column",
//       gap: "12px",
//     },
//     styleLabel: {
//       fontSize: "12px",
//       fontWeight: "600",
//       color: "#888",
//     },
//     fontSelect: {
//       flex: 1,
//       padding: "10px 12px",
//       backgroundColor: "#1a1a1a",
//       border: "1px solid rgba(255,255,255,0.1)",
//       borderRadius: "8px",
//       color: "#e5e5e5",
//       fontSize: "13px",
//       outline: "none",
//       cursor: "pointer",
//       appearance: "none",
//       backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
//       backgroundRepeat: "no-repeat",
//       backgroundPosition: "right 12px center",
//     },
//     weightSizeRow: {
//       display: "flex",
//       gap: "8px",
//       alignItems: "center",
//     },
//     weightSelect: {
//       flex: 1,
//       padding: "10px 12px",
//       backgroundColor: "#1a1a1a",
//       border: "1px solid rgba(255,255,255,0.1)",
//       borderRadius: "8px",
//       color: "#e5e5e5",
//       fontSize: "13px",
//       outline: "none",
//       cursor: "pointer",
//       appearance: "none",
//       backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
//       backgroundRepeat: "no-repeat",
//       backgroundPosition: "right 12px center",
//     },
//     sizeInput: {
//       width: "70px",
//       padding: "10px 12px",
//       backgroundColor: "#1a1a1a",
//       border: "1px solid rgba(255,255,255,0.1)",
//       borderRadius: "8px",
//       color: "#e5e5e5",
//       fontSize: "13px",
//       outline: "none",
//       textAlign: "center",
//     },
//     colorCircle: {
//       width: "36px",
//       height: "36px",
//       borderRadius: "50%",
//       border: "2px solid rgba(255,255,255,0.2)",
//       cursor: "pointer",
//       position: "relative",
//       overflow: "hidden",
//       flexShrink: 0,
//     },
//     colorInput: {
//       position: "absolute",
//       inset: 0,
//       opacity: 0,
//       cursor: "pointer",
//       width: "100%",
//       height: "100%",
//     },
//     styleButtonsRow: {
//       display: "flex",
//       gap: "4px",
//       alignItems: "center",
//     },
//     styleButton: {
//       width: "36px",
//       height: "36px",
//       border: "1px solid rgba(255,255,255,0.1)",
//       backgroundColor: "#1a1a1a",
//       color: "#888",
//       cursor: "pointer",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       borderRadius: "6px",
//       transition: "all 0.15s",
//     },
//     styleButtonActive: {
//       backgroundColor: "rgba(59, 130, 246, 0.2)",
//       borderColor: "#3b82f6",
//       color: "#3b82f6",
//     },
//     toggleRow: {
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       padding: "8px 0",
//     },
//     toggleLabel: {
//       fontSize: "13px",
//       color: "#e5e5e5",
//     },
//     toggle: {
//       width: "44px",
//       height: "24px",
//       borderRadius: "12px",
//       backgroundColor: "rgba(255,255,255,0.1)",
//       border: "none",
//       cursor: "pointer",
//       position: "relative",
//       transition: "background-color 0.2s",
//     },
//     toggleActive: {
//       backgroundColor: "#3b82f6",
//     },
//     toggleKnob: {
//       position: "absolute",
//       top: "2px",
//       left: "2px",
//       width: "20px",
//       height: "20px",
//       borderRadius: "50%",
//       backgroundColor: "white",
//       transition: "transform 0.2s",
//     },
//     toggleKnobActive: {
//       transform: "translateX(20px)",
//     },
//     colorRow: {
//       display: "flex",
//       alignItems: "center",
//       gap: "12px",
//     },
//     sliderRow: {
//       display: "flex",
//       alignItems: "center",
//       gap: "12px",
//     },
//     sliderLabel: {
//       width: "40px",
//       fontSize: "12px",
//       color: "#666",
//     },
//     slider: {
//       flex: 1,
//       height: "4px",
//       borderRadius: "2px",
//       appearance: "none",
//       backgroundColor: "rgba(255,255,255,0.1)",
//       cursor: "pointer",
//       outline: "none",
//     },
//     sliderValue: {
//       width: "50px",
//       padding: "6px 8px",
//       backgroundColor: "#1a1a1a",
//       border: "1px solid rgba(255,255,255,0.1)",
//       borderRadius: "6px",
//       color: "#e5e5e5",
//       fontSize: "12px",
//       textAlign: "center",
//       outline: "none",
//     },
//     deleteButton: {
//       width: "100%",
//       padding: "12px",
//       backgroundColor: "transparent",
//       border: "1px solid rgba(255,255,255,0.1)",
//       borderRadius: "8px",
//       color: "#888",
//       fontSize: "13px",
//       cursor: "pointer",
//       transition: "all 0.15s",
//       marginTop: "auto",
//     },
//     mainArea: {
//       flex: 1,
//       display: "flex",
//       flexDirection: "column",
//       overflow: "hidden",
//     },
//     header: {
//       height: "56px",
//       padding: "0 20px",
//       borderBottom: "1px solid rgba(255,255,255,0.08)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       backgroundColor: "#0f0f0f",
//     },
//     headerTitle: {
//       fontSize: "14px",
//       fontWeight: "600",
//       color: "#e5e5e5",
//     },
//     headerButtonsRight: {
//       display: "flex",
//       gap: "8px",
//     },
//     addButton: {
//       padding: "8px 16px",
//       backgroundColor: "rgba(59, 130, 246, 0.1)",
//       border: "1px solid rgba(59, 130, 246, 0.3)",
//       borderRadius: "8px",
//       color: "#3b82f6",
//       fontSize: "13px",
//       fontWeight: "500",
//       cursor: "pointer",
//       display: "flex",
//       alignItems: "center",
//       gap: "6px",
//       transition: "all 0.2s",
//     },
//     exportButton: {
//       padding: "8px 16px",
//       background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
//       border: "none",
//       borderRadius: "8px",
//       color: "white",
//       fontSize: "13px",
//       fontWeight: "600",
//       cursor: "pointer",
//       transition: "all 0.2s",
//     },
//     previewArea: {
//       flex: 1,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: "#0a0a0a",
//       position: "relative",
//     },
//     previewWrapper: {
//       position: "relative",
//       width: "calc(65vh * 0.5625)",
//       height: "65vh",
//     },
//     // Video Library Styles
//     videoLibraryContainer: {
//       padding: "16px",
//       overflowY: "auto" as const,
//       height: "100%",
//     },
//     videoLibraryHeader: {
//       display: "flex",
//       gap: "12px",
//       marginBottom: "20px",
//     },
//     viewAssetsButton: {
//       flex: 1,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       gap: "8px",
//       padding: "12px",
//       background: "#3b82f6",
//       color: "white",
//       border: "none",
//       borderRadius: "8px",
//       cursor: "pointer",
//       fontSize: "14px",
//       fontWeight: "500",
//       transition: "all 0.2s",
//     },
//     uploadFileButton: {
//       flex: 1,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       gap: "8px",
//       padding: "12px",
//       background: "white",
//       color: "#333",
//       border: "1px solid #e5e7eb",
//       borderRadius: "8px",
//       cursor: "pointer",
//       fontSize: "14px",
//       fontWeight: "500",
//       transition: "all 0.2s",
//     },
//     videoSection: {
//       marginBottom: "32px",
//     },
//     videoSectionHeader: {
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: "12px",
//     },
//     videoSectionTitle: {
//       fontSize: "16px",
//       fontWeight: "600",
//       color: "#e5e5e5",
//       margin: 0,
//     },
//     viewMoreLink: {
//       background: "none",
//       border: "none",
//       color: "#3b82f6",
//       cursor: "pointer",
//       fontSize: "12px",
//       padding: "0",
//       textDecoration: "none",
//     },
//     videoGridVertical: {
//       display: "grid",
//       gridTemplateColumns: "1fr 1fr",
//       gap: "12px",
//       marginBottom: "8px",
//     },
//     videoCardVertical: {
//       cursor: "pointer",
//       transition: "opacity 0.2s",
//     },
//     videoThumbnailVertical: {
//       position: "relative" as const,
//       width: "100%",
//       height: "100px",
//       borderRadius: "6px",
//       overflow: "hidden",
//       marginBottom: "8px",
//       backgroundColor: "#1a1a1a",
//     },
//     videoThumbnailImage: {
//       width: "100%",
//       height: "100%",
//       objectFit: "cover" as const,
//     },
//     videoDurationBadge: {
//       position: "absolute" as const,
//       bottom: "6px",
//       left: "6px",
//       background: "rgba(0, 0, 0, 0.8)",
//       color: "white",
//       padding: "2px 6px",
//       borderRadius: "3px",
//       fontSize: "11px",
//       fontWeight: "500",
//     },
//     videoNameText: {
//       fontSize: "12px",
//       color: "#e5e5e5",
//       marginBottom: "6px",
//       overflow: "hidden",
//       textOverflow: "ellipsis",
//       whiteSpace: "nowrap" as const,
//     },
//     videoProgressSlider: {
//       width: "100%",
//       height: "3px",
//       cursor: "pointer",
//       appearance: "none" as const,
//       backgroundColor: "#333",
//       borderRadius: "2px",
//       outline: "none",
//     },
//     // Video Edit Panel Styles
//     propertyRow: {
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: "10px",
//     },
//     propertyValue: {
//       fontSize: "13px",
//       fontWeight: "600",
//       color: "#3b82f6",
//       backgroundColor: "rgba(59,130,246,0.1)",
//       padding: "4px 10px",
//       borderRadius: "6px",
//     },
//     propertyGroup: {
//       marginBottom: "20px",
//     },
//     propertyLabel: {
//       fontSize: "14px",
//       fontWeight: "600",
//       color: "#e5e5e5",
//       display: "flex",
//       alignItems: "center",
//       gap: "6px",
//     },
//     speedButtons: {
//       display: "flex",
//       gap: "8px",
//     },
//     speedButton: {
//       flex: 1,
//       padding: "10px 8px",
//       background: "linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)",
//       color: "#e5e5e5",
//       border: "1px solid #404040",
//       borderRadius: "8px",
//       cursor: "pointer",
//       fontSize: "13px",
//       fontWeight: "600",
//       transition: "all 0.2s",
//       boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//     },
//     speedButtonActive: {
//       background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
//       borderColor: "#3b82f6",
//       color: "white",
//       boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
//     },
//     checkboxLabel: {
//       display: "flex",
//       alignItems: "center",
//       gap: "8px",
//       color: "#e5e5e5",
//       fontSize: "14px",
//       cursor: "pointer",
//     },
//     rotationControls: {
//       display: "flex",
//       alignItems: "center",
//       gap: "6px",
//     },
//     rotationInput: {
//       width: "60px",
//       padding: "8px",
//       background: "linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)",
//       border: "1px solid #404040",
//       borderRadius: "6px",
//       color: "#e5e5e5",
//       fontSize: "14px",
//       fontWeight: "600",
//       textAlign: "center" as const,
//       boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
//     },
//     degreeSymbol: {
//       color: "#999",
//       fontSize: "14px",
//       fontWeight: "600",
//     },
//     flipButton: {
//       padding: "8px 12px",
//       background: "linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)",
//       border: "1px solid #404040",
//       borderRadius: "6px",
//       color: "#e5e5e5",
//       cursor: "pointer",
//       fontSize: "18px",
//       transition: "all 0.2s",
//       boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//     },
//     resetButtons: {
//       display: "flex",
//       gap: "8px",
//     },
//     resetButton: {
//       padding: "6px 14px",
//       background: "linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)",
//       border: "1px solid #404040",
//       borderRadius: "6px",
//       color: "#999",
//       cursor: "pointer",
//       fontSize: "12px",
//       fontWeight: "600",
//       transition: "all 0.2s",
//       boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//     },
//     filterPresets: {
//       display: "flex",
//       gap: "8px",
//     },
//     filterPresetButton: {
//       flex: 1,
//       padding: "10px 12px",
//       background: "linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)",
//       border: "1px solid #404040",
//       borderRadius: "8px",
//       color: "#e5e5e5",
//       cursor: "pointer",
//       fontSize: "13px",
//       fontWeight: "600",
//       transition: "all 0.2s",
//       boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//     },
//     filterPresetActive: {
//       background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
//       borderColor: "#f59e0b",
//       color: "white",
//       boxShadow: "0 4px 12px rgba(245,158,11,0.4)",
//     },
//     positionGrid: {
//       display: "grid",
//       gridTemplateColumns: "1fr 1fr",
//       gap: "8px",
//     },
//     positionButton: {
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       gap: "6px",
//       padding: "12px 10px",
//       background: "linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)",
//       border: "1px solid #404040",
//       borderRadius: "8px",
//       color: "#e5e5e5",
//       cursor: "pointer",
//       fontSize: "12px",
//       fontWeight: "600",
//       transition: "all 0.2s",
//       boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//     },
//     positionButtonActive: {
//       background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
//       borderColor: "#3b82f6",
//       color: "white",
//       boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
//     },
//     replaceVideoButton: {
//       width: "100%",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       gap: "8px",
//       padding: "14px 12px",
//       background: "linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)",
//       border: "1px solid #404040",
//       borderRadius: "8px",
//       color: "#e5e5e5",
//       cursor: "pointer",
//       fontSize: "14px",
//       fontWeight: "600",
//       marginTop: "16px",
//       transition: "all 0.2s",
//       boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//     },
//     deleteVideoButton: {
//       width: "48px",
//       height: "48px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
//       border: "none",
//       borderRadius: "8px",
//       color: "white",
//       cursor: "pointer",
//       marginTop: "12px",
//       marginLeft: "auto",
//       transition: "all 0.2s",
//       boxShadow: "0 4px 12px rgba(220,38,38,0.4)",
//     },
//   };

//   // ============================================================================
//   // RENDER
//   // ============================================================================

//   const showEditPanel = selectedTextLayer !== null || selectedImageLayer !== null || selectedAudioLayer !== null || selectedVideoLayer !== null;
//   const isPanelOpen = activeTab !== null;

//   const getFilteredLayers = () => {
//     const editableLayers = layers.filter(l => !(isImageLayer(l) && l.isBackground));
    
//     if (activeTab === "text") {
//       return editableLayers.filter(l => l.type === "text");
//     } else if (activeTab === "media") {
//       return editableLayers.filter(l => l.type === "image");
//     } else if (activeTab === "audio") {
//       return editableLayers.filter(l => l.type === "audio");
//     } else if (activeTab === "video") {
//       return editableLayers.filter(l => l.type === "video");
//     }
//     return editableLayers;
//   };

//   const filteredLayers = getFilteredLayers();

//   return (
//     <>
//       <style>{`
//         /* Custom Scrollbar Styling */
//         .video-edit-panel::-webkit-scrollbar {
//           width: 8px;
//         }
        
//         .video-edit-panel::-webkit-scrollbar-track {
//           background: #0a0a0a;
//           border-radius: 4px;
//         }
        
//         .video-edit-panel::-webkit-scrollbar-thumb {
//           background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
//           border-radius: 4px;
//           transition: all 0.3s;
//         }
        
//         .video-edit-panel::-webkit-scrollbar-thumb:hover {
//           background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
//         }
        
//         /* Firefox Scrollbar */
//         .video-edit-panel {
//           scrollbar-width: thin;
//           scrollbar-color: #3b82f6 #0a0a0a;
//         }
        
//         /* Smooth transitions for all buttons */
//         button {
//           transition: all 0.2s ease;
//         }
        
//         button:hover:not(:disabled) {
//           transform: translateY(-1px);
//         }
        
//         button:active:not(:disabled) {
//           transform: translateY(0px);
//         }
        
//         /* Input range styling */
//         input[type="range"] {
//           cursor: pointer;
//         }
        
//         input[type="range"]::-webkit-slider-thumb {
//           transition: all 0.2s;
//         }
        
//         input[type="range"]::-webkit-slider-thumb:hover {
//           transform: scale(1.2);
//         }
//       `}</style>
//       <div style={styles.container}>
//       {isLoading && <LoadingOverlay message="Loading project..." />}

//       <SaveProjectModal
//         open={showSaveModal}
//         onClose={() => setShowSaveModal(false)}
//         onSave={saveNewProject}
//       />

//       {showExportModal && (
//         <ExportModal
//           showExport={showExportModal}
//           setShowExport={setShowExportModal}
//           isExporting={isExporting}
//           exportUrl={exportUrl}
//           onExport={handleExport}
//         />
//       )}

//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         onChange={handleImageUpload}
//         style={{ display: "none" }}
//       />
      
//       <input
//         ref={audioInputRef}
//         type="file"
//         accept="audio/*"
//         onChange={handleAudioUpload}
//         style={{ display: "none" }}
//       />
      
//       <input
//         ref={videoInputRef}
//         type="file"
//         accept="video/*"
//         onChange={handleVideoUpload}
//         style={{ display: "none" }}
//       />

//       {/* Left Sidebar */}
//       <div style={styles.leftSidebar}>
//         <button
//           style={{
//             ...styles.sidebarButton,
//             ...(activeTab === "layers" ? styles.sidebarButtonActive : {}),
//           }}
//           onClick={() => handleTabClick("layers")}
//           onMouseOver={(e) => {
//             if (activeTab !== "layers") {
//               e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
//               e.currentTarget.style.color = "#888";
//             }
//           }}
//           onMouseOut={(e) => {
//             if (activeTab !== "layers") {
//               e.currentTarget.style.backgroundColor = "transparent";
//               e.currentTarget.style.color = "#666";
//             }
//           }}
//         >
//           <Icons.Layers />
//           <span>Layers</span>
//         </button>
//         <button
//           style={{
//             ...styles.sidebarButton,
//             ...(activeTab === "text" ? styles.sidebarButtonActive : {}),
//           }}
//           onClick={() => handleTabClick("text")}
//           onMouseOver={(e) => {
//             if (activeTab !== "text") {
//               e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
//               e.currentTarget.style.color = "#888";
//             }
//           }}
//           onMouseOut={(e) => {
//             if (activeTab !== "text") {
//               e.currentTarget.style.backgroundColor = "transparent";
//               e.currentTarget.style.color = "#666";
//             }
//           }}
//         >
//           <EditorIcons.Type />
//           <span>Text</span>
//         </button>
//         <button
//           style={{
//             ...styles.sidebarButton,
//             ...(activeTab === "media" ? styles.sidebarButtonActive : {}),
//           }}
//           onClick={() => handleTabClick("media")}
//           onMouseOver={(e) => {
//             if (activeTab !== "media") {
//               e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
//               e.currentTarget.style.color = "#888";
//             }
//           }}
//           onMouseOut={(e) => {
//             if (activeTab !== "media") {
//               e.currentTarget.style.backgroundColor = "transparent";
//               e.currentTarget.style.color = "#666";
//             }
//           }}
//         >
//           <EditorIcons.Image />
//           <span>Media</span>
//         </button>
//         <button
//           style={{
//             ...styles.sidebarButton,
//             ...(activeTab === "audio" ? styles.sidebarButtonActive : {}),
//           }}
//           onClick={() => handleTabClick("audio")}
//           onMouseOver={(e) => {
//             if (activeTab !== "audio") {
//               e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
//               e.currentTarget.style.color = "#888";
//             }
//           }}
//           onMouseOut={(e) => {
//             if (activeTab !== "audio") {
//               e.currentTarget.style.backgroundColor = "transparent";
//               e.currentTarget.style.color = "#666";
//             }
//           }}
//         >
//           <Icons.Music />
//           <span>Audio</span>
//         </button>
//         <button
//           style={{
//             ...styles.sidebarButton,
//             ...(activeTab === "video" ? styles.sidebarButtonActive : {}),
//           }}
//           onClick={() => handleTabClick("video")}
//           onMouseOver={(e) => {
//             if (activeTab !== "video") {
//               e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
//               e.currentTarget.style.color = "#888";
//             }
//           }}
//           onMouseOut={(e) => {
//             if (activeTab !== "video") {
//               e.currentTarget.style.backgroundColor = "transparent";
//               e.currentTarget.style.color = "#666";
//             }
//           }}
//         >
//           <EditorIcons.Video />
//           <span>Video</span>
//         </button>
//       </div>

//       {/* Layers Panel */}
//       <div style={{
//         ...styles.layersPanel,
//         ...(isPanelOpen ? {} : styles.layersPanelClosed),
//       }}>
//         {isPanelOpen && (
//           <>
//             <div style={styles.layersPanelHeader}>
//               <span style={styles.layersPanelTitle}>
//                 {activeTab === "layers" 
//                   ? "Layers" 
//                   : activeTab === "text" 
//                   ? "Text Layers" 
//                   : activeTab === "audio" 
//                   ? "Audio" 
//                   : activeTab === "video"
//                   ? "Video"
//                   : "Media"}
//               </span>
//               <div style={styles.headerButtons}>
//                 <button
//                   style={styles.addLayerButton}
//                   onClick={
//                     activeTab === "media" 
//                       ? addImageLayer 
//                       : activeTab === "audio" 
//                       ? addAudioLayer 
//                       : activeTab === "video"
//                       ? addVideoLayer
//                       : addTextLayer
//                   }
//                   onMouseOver={(e) => {
//                     e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
//                     e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
//                     e.currentTarget.style.color = "#3b82f6";
//                   }}
//                   onMouseOut={(e) => {
//                     e.currentTarget.style.backgroundColor = "transparent";
//                     e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
//                     e.currentTarget.style.color = "#888";
//                   }}
//                   title={
//                     activeTab === "media" 
//                       ? "Add Image" 
//                       : activeTab === "audio" 
//                       ? "Add Audio" 
//                       : activeTab === "video"
//                       ? "Add Video"
//                       : "Add Text"
//                   }
//                 >
//                   <Icons.Plus />
//                 </button>
//                 <button
//                   style={styles.closeButton}
//                   onClick={() => setActiveTab(null)}
//                   onMouseOver={(e) => {
//                     e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
//                     e.currentTarget.style.color = "#888";
//                   }}
//                   onMouseOut={(e) => {
//                     e.currentTarget.style.backgroundColor = "transparent";
//                     e.currentTarget.style.color = "#666";
//                   }}
//                   title="Close panel"
//                 >
//                   <Icons.Close />
//                 </button>
//               </div>
//             </div>

//             {/* Video Library - When video tab is active and no layer selected */}
//             {activeTab === "video" && !selectedLayerId ? (
//               <div style={styles.videoLibraryContainer}>
//                 {/* Header Buttons */}
//                 <div style={styles.videoLibraryHeader}>
//                   <button
//                     style={styles.viewAssetsButton}
//                     onClick={() => {
//                       toast.info("View Assets - Coming soon");
//                     }}
//                   >
//                     <EditorIcons.Image />
//                     View Assets
//                   </button>
//                   <button
//                     style={styles.uploadFileButton}
//                     onClick={addVideoLayer}
//                   >
//                     <EditorIcons.Upload />
//                     Upload a File
//                   </button>
//                 </div>

//                 {/* Background Videos Section */}
//                 <div style={styles.videoSection}>
//                   <div style={styles.videoSectionHeader}>
//                     <h3 style={styles.videoSectionTitle}>Background Videos</h3>
//                     <button
//                       style={styles.viewMoreLink}
//                       onClick={() => toast.info("View more - Coming soon")}
//                     >
//                       View more
//                     </button>
//                   </div>
//                   <div style={styles.videoGridVertical}>
//                     {CLOUDINARY_VIDEOS.backgroundVideos.map((video) => (
//                       <div
//                         key={video.id}
//                         style={styles.videoCardVertical}
//                         onClick={() => {
//                           const newLayer: VideoLayer = {
//                             id: generateId(),
//                             type: "video",
//                             name: video.name,
//                             visible: true,
//                             locked: false,
//                             startFrame: currentFrame,
//                             endFrame: Math.min(currentFrame + 150, totalFrames),
//                             position: { x: 50, y: 50 },
//                             size: { width: 60, height: 45 },
//                             rotation: 0,
//                             opacity: 1,
//                             src: video.url,
//                             volume: 0.8,
//                             loop: false,
//                             playbackRate: 1,
//                             objectFit: "contain",
//                             filter: "",
//                             fadeIn: 0,
//                             fadeOut: 0,
//                             animation: {
//                               entrance: "fade",
//                               entranceDuration: 30,
//                             },
//                           };
//                           pushState([newLayer, ...layers]);
//                           setSelectedLayerId(newLayer.id);
//                           toast.success(`Added ${video.name}`);
//                         }}
//                       >
//                         <div style={styles.videoThumbnailVertical}>
//                           <img
//                             src={video.thumbnail}
//                             alt={video.name}
//                             style={styles.videoThumbnailImage}
//                           />
//                           <div style={styles.videoDurationBadge}>{video.duration}</div>
//                         </div>
//                         <div style={styles.videoNameText}>{video.name}</div>
//                         <input
//                           type="range"
//                           min="0"
//                           max="100"
//                           defaultValue="0"
//                           style={styles.videoProgressSlider}
//                           onClick={(e) => e.stopPropagation()}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Visual Effects Section */}
//                 <div style={styles.videoSection}>
//                   <div style={styles.videoSectionHeader}>
//                     <h3 style={styles.videoSectionTitle}>Visual Effects</h3>
//                     <button
//                       style={styles.viewMoreLink}
//                       onClick={() => toast.info("View more - Coming soon")}
//                     >
//                       View more
//                     </button>
//                   </div>
//                   <div style={styles.videoGridVertical}>
//                     {CLOUDINARY_VIDEOS.visualEffects.map((video) => (
//                       <div
//                         key={video.id}
//                         style={styles.videoCardVertical}
//                         onClick={() => {
//                           const newLayer: VideoLayer = {
//                             id: generateId(),
//                             type: "video",
//                             name: video.name,
//                             visible: true,
//                             locked: false,
//                             startFrame: currentFrame,
//                             endFrame: Math.min(currentFrame + 90, totalFrames),
//                             position: { x: 50, y: 50 },
//                             size: { width: 50, height: 40 },
//                             rotation: 0,
//                             opacity: 1,
//                             src: video.url,
//                             volume: 0.5,
//                             loop: false,
//                             playbackRate: 1,
//                             objectFit: "contain",
//                             filter: "",
//                             fadeIn: 0,
//                             fadeOut: 0,
//                             animation: {
//                               entrance: "fade",
//                               entranceDuration: 20,
//                             },
//                           };
//                           pushState([newLayer, ...layers]);
//                           setSelectedLayerId(newLayer.id);
//                           toast.success(`Added ${video.name}`);
//                         }}
//                       >
//                         <div style={styles.videoThumbnailVertical}>
//                           <img
//                             src={video.thumbnail}
//                             alt={video.name}
//                             style={styles.videoThumbnailImage}
//                           />
//                           <div style={styles.videoDurationBadge}>{video.duration}</div>
//                         </div>
//                         <div style={styles.videoNameText}>{video.name}</div>
//                         <input
//                           type="range"
//                           min="0"
//                           max="100"
//                           defaultValue="0"
//                           style={styles.videoProgressSlider}
//                           onClick={(e) => e.stopPropagation()}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               // Regular layers list for all other tabs
//               <div style={styles.layersList}>
//               {filteredLayers.map((layer) => (
//                 <div
//                   key={layer.id}
//                   style={{
//                     ...styles.layerItem,
//                     ...(selectedLayerId === layer.id ? styles.layerItemActive : {}),
//                   }}
//                   onClick={() => setSelectedLayerId(layer.id)}
//                   onMouseOver={(e) => {
//                     if (selectedLayerId !== layer.id) {
//                       e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
//                     }
//                   }}
//                   onMouseOut={(e) => {
//                     if (selectedLayerId !== layer.id) {
//                       e.currentTarget.style.backgroundColor = "transparent";
//                     }
//                   }}
//                 >
//                   <div
//                     style={{
//                       ...styles.layerIcon,
//                       backgroundColor: layer.type === "text" 
//                         ? "rgba(59, 130, 246, 0.2)" 
//                         : layer.type === "audio"
//                         ? "rgba(245, 158, 11, 0.2)"
//                         : "rgba(16, 185, 129, 0.2)",
//                       color: layer.type === "text" ? "#3b82f6" : layer.type === "audio" ? "#f59e0b" : "#10b981",
//                     }}
//                   >
//                     {layer.type === "text" ? (
//                       <EditorIcons.Type />
//                     ) : layer.type === "audio" ? (
//                       <Icons.Music />
//                     ) : layer.type === "video" ? (
//                       <EditorIcons.Video />
//                     ) : (
//                       <EditorIcons.Image />
//                     )}
//                   </div>
//                   <div style={{ flex: 1, overflow: "hidden" }}>
//                     <div style={styles.layerName}>{layer.name}</div>
//                     <div style={styles.layerType}>
//                       {layer.type === "text" 
//                         ? (layer as TextLayer).content.substring(0, 20) + ((layer as TextLayer).content.length > 20 ? "..." : "")
//                         : layer.type === "audio"
//                         ? "Audio"
//                         : "Image"
//                       }
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {filteredLayers.length === 0 && (
//                 <div style={{ 
//                   padding: "20px", 
//                   textAlign: "center", 
//                   color: "#666",
//                   fontSize: "12px" 
//                 }}>
//                   No {activeTab === "text" ? "text" : activeTab === "media" ? "media" : activeTab === "audio" ? "audio" : ""} layers yet.
//                   <br />
//                   Click + to add one.
//                 </div>
//               )}
//             </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Edit Panel */}
//       <div
//         style={{
//           ...styles.editPanel,
//           ...(showEditPanel ? {} : styles.editPanelHidden),
//         }}
//       >
//         {showEditPanel && selectedTextLayer && (
//           <>
//             <div style={styles.editPanelHeader}>
//               <button
//                 style={styles.backButton}
//                 onClick={() => setSelectedLayerId(null)}
//                 onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
//                 onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
//               >
//                 <Icons.ChevronLeft />
//               </button>
//               <span style={styles.editPanelTitle}>Edit Text</span>
//             </div>

//             <div style={styles.editPanelContent}>
//               <textarea
//                 style={styles.textInput}
//                 value={selectedTextLayer.content}
//                 onChange={(e) => updateLayer(selectedLayerId!, { content: e.target.value })}
//                 placeholder="Enter text..."
//               />

//               <div style={styles.styleSection}>
//                 <span style={styles.styleLabel}>Style</span>

//                 <select
//                   style={styles.fontSelect}
//                   value={selectedTextLayer.fontFamily}
//                   onChange={(e) => updateLayer(selectedLayerId!, { fontFamily: e.target.value })}
//                 >
//                   {FONTS.map((font) => (
//                     <option key={font.value} value={font.value}>
//                       {font.label}
//                     </option>
//                   ))}
//                 </select>

//                 <div style={styles.weightSizeRow}>
//                   <select
//                     style={styles.weightSelect}
//                     value={selectedTextLayer.fontWeight}
//                     onChange={(e) => updateLayer(selectedLayerId!, { fontWeight: e.target.value })}
//                   >
//                     {FONT_WEIGHTS.map((w) => (
//                       <option key={w.value} value={w.value}>
//                         {w.label}
//                       </option>
//                     ))}
//                   </select>
//                   <input
//                     type="number"
//                     style={styles.sizeInput}
//                     value={Math.round(selectedTextLayer.fontSize * 20)}
//                     onChange={(e) => updateLayer(selectedLayerId!, { fontSize: Number(e.target.value) / 20 })}
//                     min="10"
//                     max="200"
//                   />
//                   <div
//                     style={{
//                       ...styles.colorCircle,
//                       backgroundColor: selectedTextLayer.fontColor,
//                     }}
//                   >
//                     <input
//                       type="color"
//                       style={styles.colorInput}
//                       value={selectedTextLayer.fontColor}
//                       onChange={(e) => updateLayer(selectedLayerId!, { fontColor: e.target.value })}
//                     />
//                   </div>
//                 </div>

//                 <div style={styles.styleButtonsRow}>
//                   <button
//                     style={{
//                       ...styles.styleButton,
//                       ...(selectedTextLayer.fontStyle === "italic" ? styles.styleButtonActive : {}),
//                     }}
//                     onClick={() =>
//                       updateLayer(selectedLayerId!, {
//                         fontStyle: selectedTextLayer.fontStyle === "italic" ? "normal" : "italic",
//                       })
//                     }
//                     title="Italic"
//                   >
//                     <span style={{ fontStyle: "italic", fontWeight: "bold" }}>I</span>
//                   </button>
//                   <button
//                     style={{
//                       ...styles.styleButton,
//                       ...(selectedTextLayer.fontWeight === "bold" || selectedTextLayer.fontWeight === "600" ? styles.styleButtonActive : {}),
//                     }}
//                     onClick={() =>
//                       updateLayer(selectedLayerId!, {
//                         fontWeight: selectedTextLayer.fontWeight === "bold" ? "normal" : "bold",
//                       })
//                     }
//                     title="Bold"
//                   >
//                     <span style={{ fontWeight: "bold" }}>B</span>
//                   </button>
//                   <button style={styles.styleButton} title="Underline">
//                     <Icons.Underline />
//                   </button>
//                   <button style={styles.styleButton} title="Strikethrough">
//                     <Icons.Strikethrough />
//                   </button>
//                   <button
//                     style={{
//                       ...styles.styleButton,
//                       ...(selectedTextLayer.textTransform === "uppercase" ? styles.styleButtonActive : {}),
//                     }}
//                     onClick={() =>
//                       updateLayer(selectedLayerId!, {
//                         textTransform: selectedTextLayer.textTransform === "uppercase" ? "none" : "uppercase",
//                       })
//                     }
//                     title="All Caps"
//                   >
//                     <Icons.AllCaps />
//                   </button>
//                   <button style={styles.styleButton} title="Letter Spacing">
//                     <Icons.Spacing />
//                   </button>
//                 </div>
//               </div>

//               <div style={styles.styleSection}>
//                 <span style={styles.styleLabel}>Opacity</span>
//                 <div style={styles.sliderRow}>
//                   <input
//                     type="range"
//                     min="0"
//                     max="100"
//                     value={selectedTextLayer.opacity * 100}
//                     onChange={(e) => updateLayer(selectedLayerId!, { opacity: Number(e.target.value) / 100 })}
//                     style={styles.slider}
//                   />
//                   <input
//                     type="number"
//                     style={styles.sliderValue}
//                     value={Math.round(selectedTextLayer.opacity * 100)}
//                     onChange={(e) => updateLayer(selectedLayerId!, { opacity: Number(e.target.value) / 100 })}
//                     min="0"
//                     max="100"
//                   />
//                 </div>
//               </div>

//               <div style={styles.styleSection}>
//                 <div style={styles.toggleRow}>
//                   <span style={styles.toggleLabel}>Text Outline</span>
//                   <button
//                     style={{
//                       ...styles.toggle,
//                       ...((selectedTextLayer as any).textOutline ? styles.toggleActive : {}),
//                     }}
//                     onClick={() => updateLayer(selectedLayerId!, { textOutline: !(selectedTextLayer as any).textOutline } as any)}
//                   >
//                     <div
//                       style={{
//                         ...styles.toggleKnob,
//                         ...((selectedTextLayer as any).textOutline ? styles.toggleKnobActive : {}),
//                       }}
//                     />
//                   </button>
//                 </div>
//                 {(selectedTextLayer as any).textOutline && (
//                   <div style={styles.colorRow}>
//                     <span style={{ fontSize: "12px", color: "#666", width: "50px" }}>Color</span>
//                     <div
//                       style={{
//                         ...styles.colorCircle,
//                         backgroundColor: (selectedTextLayer as any).outlineColor || "#000000",
//                       }}
//                     >
//                       <input
//                         type="color"
//                         style={styles.colorInput}
//                         value={(selectedTextLayer as any).outlineColor || "#000000"}
//                         onChange={(e) => updateLayer(selectedLayerId!, { outlineColor: e.target.value } as any)}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div style={styles.styleSection}>
//                 <div style={styles.toggleRow}>
//                   <span style={styles.toggleLabel}>Text Shadow</span>
//                   <button
//                     style={{
//                       ...styles.toggle,
//                       ...((selectedTextLayer as any).textShadow ? styles.toggleActive : {}),
//                     }}
//                     onClick={() => updateLayer(selectedLayerId!, { textShadow: !(selectedTextLayer as any).textShadow } as any)}
//                   >
//                     <div
//                       style={{
//                         ...styles.toggleKnob,
//                         ...((selectedTextLayer as any).textShadow ? styles.toggleKnobActive : {}),
//                       }}
//                     />
//                   </button>
//                 </div>
//                 {(selectedTextLayer as any).textShadow && (
//                   <>
//                     <div style={styles.colorRow}>
//                       <span style={{ fontSize: "12px", color: "#666", width: "50px" }}>Color</span>
//                       <div
//                         style={{
//                           ...styles.colorCircle,
//                           backgroundColor: (selectedTextLayer as any).shadowColor || "#000000",
//                         }}
//                       >
//                         <input
//                           type="color"
//                           style={styles.colorInput}
//                           value={(selectedTextLayer as any).shadowColor || "#000000"}
//                           onChange={(e) => updateLayer(selectedLayerId!, { shadowColor: e.target.value } as any)}
//                         />
//                       </div>
//                     </div>
//                     <div style={styles.sliderRow}>
//                       <span style={styles.sliderLabel}>X</span>
//                       <input
//                         type="range"
//                         min="-20"
//                         max="20"
//                         value={(selectedTextLayer as any).shadowX || 0}
//                         onChange={(e) => updateLayer(selectedLayerId!, { shadowX: Number(e.target.value) } as any)}
//                         style={styles.slider}
//                       />
//                       <input
//                         type="number"
//                         style={styles.sliderValue}
//                         value={(selectedTextLayer as any).shadowX || 0}
//                         onChange={(e) => updateLayer(selectedLayerId!, { shadowX: Number(e.target.value) } as any)}
//                       />
//                     </div>
//                     <div style={styles.sliderRow}>
//                       <span style={styles.sliderLabel}>Y</span>
//                       <input
//                         type="range"
//                         min="-20"
//                         max="20"
//                         value={(selectedTextLayer as any).shadowY || 0}
//                         onChange={(e) => updateLayer(selectedLayerId!, { shadowY: Number(e.target.value) } as any)}
//                         style={styles.slider}
//                       />
//                       <input
//                         type="number"
//                         style={styles.sliderValue}
//                         value={(selectedTextLayer as any).shadowY || 0}
//                         onChange={(e) => updateLayer(selectedLayerId!, { shadowY: Number(e.target.value) } as any)}
//                       />
//                     </div>
//                     <div style={styles.sliderRow}>
//                       <span style={styles.sliderLabel}>Blur</span>
//                       <input
//                         type="range"
//                         min="0"
//                         max="30"
//                         value={(selectedTextLayer as any).shadowBlur || 0}
//                         onChange={(e) => updateLayer(selectedLayerId!, { shadowBlur: Number(e.target.value) } as any)}
//                         style={styles.slider}
//                       />
//                       <input
//                         type="number"
//                         style={styles.sliderValue}
//                         value={(selectedTextLayer as any).shadowBlur || 0}
//                         onChange={(e) => updateLayer(selectedLayerId!, { shadowBlur: Number(e.target.value) } as any)}
//                       />
//                     </div>
//                   </>
//                 )}
//               </div>

//               <button
//                 style={styles.deleteButton}
//                 onClick={() => deleteLayer(selectedLayerId!)}
//                 onMouseOver={(e) => {
//                   e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
//                   e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
//                   e.currentTarget.style.color = "#ef4444";
//                 }}
//                 onMouseOut={(e) => {
//                   e.currentTarget.style.backgroundColor = "transparent";
//                   e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
//                   e.currentTarget.style.color = "#888";
//                 }}
//               >
//                 Delete Text
//               </button>
//             </div>
//           </>
//         )}

//         {showEditPanel && selectedImageLayer && (
//           <>
//             <div style={styles.editPanelHeader}>
//               <button
//                 style={styles.backButton}
//                 onClick={() => setSelectedLayerId(null)}
//                 onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
//                 onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
//               >
//                 <Icons.ChevronLeft />
//               </button>
//               <span style={styles.editPanelTitle}>Edit Image</span>
//             </div>
//             <div style={styles.editPanelContent}>
//               <div style={{
//                 width: "100%",
//                 height: "120px",
//                 backgroundColor: "#1a1a1a",
//                 borderRadius: "8px",
//                 overflow: "hidden",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}>
//                 <img 
//                   src={selectedImageLayer.src} 
//                   alt="Layer preview"
//                   style={{
//                     maxWidth: "100%",
//                     maxHeight: "100%",
//                     objectFit: "contain",
//                   }}
//                 />
//               </div>

//               <div style={styles.styleSection}>
//                 <span style={styles.styleLabel}>Opacity</span>
//                 <div style={styles.sliderRow}>
//                   <input
//                     type="range"
//                     min="0"
//                     max="100"
//                     value={selectedImageLayer.opacity * 100}
//                     onChange={(e) => updateLayer(selectedLayerId!, { opacity: Number(e.target.value) / 100 })}
//                     style={styles.slider}
//                   />
//                   <input
//                     type="number"
//                     style={styles.sliderValue}
//                     value={Math.round(selectedImageLayer.opacity * 100)}
//                     onChange={(e) => updateLayer(selectedLayerId!, { opacity: Number(e.target.value) / 100 })}
//                     min="0"
//                     max="100"
//                   />
//                 </div>
//               </div>

//               <div style={styles.styleSection}>
//                 <span style={styles.styleLabel}>Fit Mode</span>
//                 <select
//                   style={styles.fontSelect}
//                   value={selectedImageLayer.objectFit || "contain"}
//                   onChange={(e) => updateLayer(selectedLayerId!, { objectFit: e.target.value as "cover" | "contain" | "fill" })}
//                 >
//                   <option value="contain">Contain</option>
//                   <option value="cover">Cover</option>
//                   <option value="fill">Fill</option>
//                 </select>
//               </div>

//               <button
//                 style={styles.deleteButton}
//                 onClick={() => deleteLayer(selectedLayerId!)}
//                 onMouseOver={(e) => {
//                   e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
//                   e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
//                   e.currentTarget.style.color = "#ef4444";
//                 }}
//                 onMouseOut={(e) => {
//                   e.currentTarget.style.backgroundColor = "transparent";
//                   e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
//                   e.currentTarget.style.color = "#888";
//                 }}
//               >
//                 Delete Image
//               </button>
//             </div>
//           </>
//         )}

//         {/* Audio Edit Panel */}
//         {showEditPanel && selectedAudioLayer && (
//           <>
//             <div style={styles.editPanelHeader}>
//               <button
//                 style={styles.backButton}
//                 onClick={() => setSelectedLayerId(null)}
//                 onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
//                 onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
//               >
//                 <Icons.ChevronLeft />
//               </button>
//               <span style={styles.editPanelTitle}>Edit Audio</span>
//             </div>
//             <div style={styles.editPanelContent}>
//               {/* Audio Info */}
//               <div style={{
//                 padding: "16px",
//                 backgroundColor: "#1a1a1a",
//                 borderRadius: "8px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "12px",
//               }}>
//                 <div style={{
//                   width: "48px",
//                   height: "48px",
//                   backgroundColor: "rgba(245, 158, 11, 0.2)",
//                   borderRadius: "8px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   color: "#f59e0b",
//                 }}>
//                   <Icons.Music />
//                 </div>
//                 <div style={{ flex: 1, overflow: "hidden" }}>
//                   <div style={{ fontSize: "13px", fontWeight: 500, color: "#e5e5e5", marginBottom: "4px" }}>
//                     {selectedAudioLayer.name}
//                   </div>
//                   <div style={{ fontSize: "11px", color: "#666" }}>
//                     Audio Track
//                   </div>
//                 </div>
//               </div>

//               {/* Volume */}
//               <div style={styles.styleSection}>
//                 <span style={styles.styleLabel}>Volume</span>
//                 <div style={styles.sliderRow}>
//                   <Icons.Volume />
//                   <input
//                     type="range"
//                     min="0"
//                     max="100"
//                     value={(selectedAudioLayer as AudioLayer).volume * 100}
//                     onChange={(e) => updateLayer(selectedLayerId!, { volume: Number(e.target.value) / 100 })}
//                     style={styles.slider}
//                   />
//                   <input
//                     type="number"
//                     style={styles.sliderValue}
//                     value={Math.round((selectedAudioLayer as AudioLayer).volume * 100)}
//                     onChange={(e) => updateLayer(selectedLayerId!, { volume: Number(e.target.value) / 100 })}
//                     min="0"
//                     max="100"
//                   />
//                 </div>
//               </div>

//               {/* Fade In */}
//               <div style={styles.styleSection}>
//                 <span style={styles.styleLabel}>Fade In (frames)</span>
//                 <div style={styles.sliderRow}>
//                   <input
//                     type="range"
//                     min="0"
//                     max="60"
//                     value={(selectedAudioLayer as AudioLayer).fadeIn || 0}
//                     onChange={(e) => updateLayer(selectedLayerId!, { fadeIn: Number(e.target.value) })}
//                     style={styles.slider}
//                   />
//                   <input
//                     type="number"
//                     style={styles.sliderValue}
//                     value={(selectedAudioLayer as AudioLayer).fadeIn || 0}
//                     onChange={(e) => updateLayer(selectedLayerId!, { fadeIn: Number(e.target.value) })}
//                     min="0"
//                     max="60"
//                   />
//                 </div>
//               </div>

//               {/* Fade Out */}
//               <div style={styles.styleSection}>
//                 <span style={styles.styleLabel}>Fade Out (frames)</span>
//                 <div style={styles.sliderRow}>
//                   <input
//                     type="range"
//                     min="0"
//                     max="60"
//                     value={(selectedAudioLayer as AudioLayer).fadeOut || 0}
//                     onChange={(e) => updateLayer(selectedLayerId!, { fadeOut: Number(e.target.value) })}
//                     style={styles.slider}
//                   />
//                   <input
//                     type="number"
//                     style={styles.sliderValue}
//                     value={(selectedAudioLayer as AudioLayer).fadeOut || 0}
//                     onChange={(e) => updateLayer(selectedLayerId!, { fadeOut: Number(e.target.value) })}
//                     min="0"
//                     max="60"
//                   />
//                 </div>
//               </div>

//               {/* Loop Toggle */}
//               <div style={styles.styleSection}>
//                 <div style={styles.toggleRow}>
//                   <span style={styles.toggleLabel}>Loop Audio</span>
//                   <button
//                     style={{
//                       ...styles.toggle,
//                       ...((selectedAudioLayer as AudioLayer).loop ? styles.toggleActive : {}),
//                     }}
//                     onClick={() => updateLayer(selectedLayerId!, { loop: !(selectedAudioLayer as AudioLayer).loop })}
//                   >
//                     <div
//                       style={{
//                         ...styles.toggleKnob,
//                         ...((selectedAudioLayer as AudioLayer).loop ? styles.toggleKnobActive : {}),
//                       }}
//                     />
//                   </button>
//                 </div>
//               </div>

//               {/* Delete Button */}
//               <button
//                 style={styles.deleteButton}
//                 onClick={() => deleteLayer(selectedLayerId!)}
//                 onMouseOver={(e) => {
//                   e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
//                   e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
//                   e.currentTarget.style.color = "#ef4444";
//                 }}
//                 onMouseOut={(e) => {
//                   e.currentTarget.style.backgroundColor = "transparent";
//                   e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
//                   e.currentTarget.style.color = "#888";
//                 }}
//               >
//                 Delete Audio
//               </button>
//             </div>
//           </>
//         )}

//         {/* Video Edit Panel */}
//         {showEditPanel && selectedVideoLayer && (
//           <>
//             <div style={styles.editPanelHeader}>
//               <button
//                 style={styles.backButton}
//                 onClick={() => setSelectedLayerId(null)}
//                 onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
//                 onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
//               >
//                 <Icons.ChevronLeft />
//               </button>
//               <span style={styles.editPanelTitle}>Edit video</span>
//             </div>

//             <div style={styles.editPanelContent} className="video-edit-panel">
//               {/* Duration Slider */}
//               <div style={styles.propertyGroup}>
//                 <div style={styles.propertyRow}>
//                   <span style={styles.propertyLabel}>Duration</span>
//                   <span style={styles.propertyValue}>
//                     {Math.round((selectedVideoLayer.endFrame - selectedVideoLayer.startFrame) / FPS)}s
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min={selectedVideoLayer.startFrame}
//                   max={totalFrames}
//                   style={styles.slider}
//                   value={selectedVideoLayer.endFrame}
//                   onChange={(e) =>
//                     updateLayer(selectedVideoLayer.id, { endFrame: parseInt(e.target.value) })
//                   }
//                 />
//               </div>

//               {/* Speed Controls */}
//               <div style={styles.propertyGroup}>
//                 <div style={styles.speedButtons}>
//                   {[0.5, 1, 1.5, 2].map((speed) => (
//                     <button
//                       key={speed}
//                       style={{
//                         ...styles.speedButton,
//                         ...(selectedVideoLayer.playbackRate === speed ? styles.speedButtonActive : {}),
//                       }}
//                       onClick={() => updateLayer(selectedVideoLayer.id, { playbackRate: speed })}
//                     >
//                       {speed}x
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Crop Video Checkbox */}
//               <div style={styles.propertyGroup}>
//                 <label style={styles.checkboxLabel}>
//                   <input
//                     type="checkbox"
//                     checked={selectedVideoLayer.objectFit === "cover"}
//                     onChange={(e) =>
//                       updateLayer(selectedVideoLayer.id, {
//                         objectFit: e.target.checked ? "cover" : "contain",
//                       })
//                     }
//                   />
//                   <span>Crop Video</span>
//                 </label>
//               </div>

//               {/* Rotation */}
//               <div style={styles.propertyGroup}>
//                 <div style={styles.propertyRow}>
//                   <label style={styles.propertyLabel}>
//                     <EditorIcons.Move />
//                     Rotation
//                   </label>
//                   <div style={styles.rotationControls}>
//                     <input
//                       type="number"
//                       style={styles.rotationInput}
//                       value={selectedVideoLayer.rotation}
//                       onChange={(e) =>
//                         updateLayer(selectedVideoLayer.id, { rotation: parseInt(e.target.value) || 0 })
//                       }
//                     />
//                     <span style={styles.degreeSymbol}>°</span>
//                     <button
//                       style={styles.flipButton}
//                       onClick={() =>
//                         updateLayer(selectedVideoLayer.id, {
//                           rotation: (selectedVideoLayer.rotation + 90) % 360,
//                         })
//                       }
//                       title="Rotate 90°"
//                     >
//                       ↻
//                     </button>
//                     <button
//                       style={styles.flipButton}
//                       onClick={() =>
//                         updateLayer(selectedVideoLayer.id, {
//                           rotation: selectedVideoLayer.rotation === 0 ? 180 : 0,
//                         })
//                       }
//                       title="Flip"
//                     >
//                       ⇄
//                     </button>
//                   </div>
//                 </div>
//                 <input
//                   type="range"
//                   min="-180"
//                   max="180"
//                   style={styles.slider}
//                   value={selectedVideoLayer.rotation}
//                   onChange={(e) =>
//                     updateLayer(selectedVideoLayer.id, { rotation: parseInt(e.target.value) })
//                   }
//                 />
//               </div>

//               {/* Volume */}
//               <div style={styles.propertyGroup}>
//                 <div style={styles.propertyRow}>
//                   <label style={styles.propertyLabel}>
//                     <EditorIcons.Volume />
//                     Volume
//                   </label>
//                   <span style={styles.propertyValue}>
//                     {Math.round(selectedVideoLayer.volume * 100)} %
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="1"
//                   step="0.01"
//                   style={styles.slider}
//                   value={selectedVideoLayer.volume}
//                   onChange={(e) =>
//                     updateLayer(selectedVideoLayer.id, { volume: parseFloat(e.target.value) })
//                   }
//                 />
//               </div>

//               {/* Fade In */}
//               <div style={styles.propertyGroup}>
//                 <div style={styles.propertyRow}>
//                   <label style={styles.propertyLabel}>Fade In</label>
//                   <span style={styles.propertyValue}>{selectedVideoLayer.fadeIn || 0} px</span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="60"
//                   style={styles.slider}
//                   value={selectedVideoLayer.fadeIn || 0}
//                   onChange={(e) =>
//                     updateLayer(selectedVideoLayer.id, { fadeIn: parseInt(e.target.value) })
//                   }
//                 />
//               </div>

//               {/* Fade Out */}
//               <div style={styles.propertyGroup}>
//                 <div style={styles.propertyRow}>
//                   <label style={styles.propertyLabel}>Fade Out</label>
//                   <span style={styles.propertyValue}>
//                     {Math.round((selectedVideoLayer.fadeOut || 0) * 100)} %
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="60"
//                   style={styles.slider}
//                   value={selectedVideoLayer.fadeOut || 0}
//                   onChange={(e) =>
//                     updateLayer(selectedVideoLayer.id, { fadeOut: parseInt(e.target.value) })
//                   }
//                 />
//               </div>

//               {/* Saturation */}
//               <div style={styles.propertyGroup}>
//                 <div style={styles.propertyRow}>
//                   <label style={styles.propertyLabel}>Saturation</label>
//                   <div style={styles.resetButtons}>
//                     <button
//                       style={styles.resetButton}
//                       onClick={() => updateLayer(selectedVideoLayer.id, { filter: "" })}
//                     >
//                       Reset
//                     </button>
//                     <button
//                       style={styles.resetButton}
//                       onClick={() =>
//                         updateLayer(selectedVideoLayer.id, {
//                           filter: "",
//                           opacity: 1,
//                           playbackRate: 1,
//                         })
//                       }
//                     >
//                       Reset All
//                     </button>
//                   </div>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="200"
//                   style={styles.slider}
//                   value={
//                     selectedVideoLayer.filter?.includes("saturate")
//                       ? parseInt(selectedVideoLayer.filter.match(/saturate\((\d+)\)/)?.[1] || "100")
//                       : 100
//                   }
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     const otherFilters = selectedVideoLayer.filter
//                       ?.split(" ")
//                       .filter((f) => !f.includes("saturate"))
//                       .join(" ");
//                     updateLayer(selectedVideoLayer.id, {
//                       filter: `${otherFilters} saturate(${value}%)`.trim(),
//                     });
//                   }}
//                 />
//                 <span style={styles.propertyValue}>
//                   {selectedVideoLayer.filter?.includes("saturate")
//                     ? selectedVideoLayer.filter.match(/saturate\((\d+)\)/)?.[1]
//                     : "100"}{" "}
//                   %
//                 </span>
//               </div>

//               {/* Filter Presets */}
//               <div style={styles.propertyGroup}>
//                 <div style={styles.filterPresets}>
//                   <button
//                     style={{
//                       ...styles.filterPresetButton,
//                       ...(selectedVideoLayer.filter?.includes("saturate(150)")
//                         ? styles.filterPresetActive
//                         : {}),
//                     }}
//                     onClick={() =>
//                       updateLayer(selectedVideoLayer.id, {
//                         filter: "saturate(150%) contrast(110%) brightness(105%)",
//                       })
//                     }
//                   >
//                     Vibrant
//                   </button>
//                   <button
//                     style={{
//                       ...styles.filterPresetButton,
//                       ...(selectedVideoLayer.filter?.includes("saturate(200)")
//                         ? styles.filterPresetActive
//                         : {}),
//                     }}
//                     onClick={() =>
//                       updateLayer(selectedVideoLayer.id, {
//                         filter: "saturate(200%) contrast(200%) brightness(80%) hue-rotate(10deg)",
//                       })
//                     }
//                   >
//                     Deep Fry
//                   </button>
//                 </div>
//               </div>

//               {/* Position Options */}
//               <div style={styles.propertyGroup}>
//                 <div style={styles.positionGrid}>
//                   <button
//                     style={{
//                       ...styles.positionButton,
//                       ...(selectedVideoLayer.position.y === 25 ? styles.positionButtonActive : {}),
//                     }}
//                     onClick={() =>
//                       updateLayer(selectedVideoLayer.id, {
//                         position: { x: 50, y: 25 },
//                         size: { width: 100, height: 50 },
//                       })
//                     }
//                   >
//                     <EditorIcons.Move />
//                     Half Top
//                   </button>
//                   <button
//                     style={{
//                       ...styles.positionButton,
//                       ...(selectedVideoLayer.position.y === 75 ? styles.positionButtonActive : {}),
//                     }}
//                     onClick={() =>
//                       updateLayer(selectedVideoLayer.id, {
//                         position: { x: 50, y: 75 },
//                         size: { width: 100, height: 50 },
//                       })
//                     }
//                   >
//                     <EditorIcons.Move />
//                     Half Bottom
//                   </button>
//                   <button
//                     style={{
//                       ...styles.positionButton,
//                       ...(selectedVideoLayer.objectFit === "fill" ? styles.positionButtonActive : {}),
//                     }}
//                     onClick={() =>
//                       updateLayer(selectedVideoLayer.id, {
//                         objectFit: "fill",
//                         position: { x: 50, y: 50 },
//                         size: { width: 100, height: 100 },
//                       })
//                     }
//                   >
//                     <EditorIcons.ZoomOut />
//                     Scale Fill
//                   </button>
//                   <button
//                     style={{
//                       ...styles.positionButton,
//                       ...(selectedVideoLayer.position.x === 50 &&
//                       selectedVideoLayer.position.y === 50 &&
//                       selectedVideoLayer.size.width === 60
//                         ? styles.positionButtonActive
//                         : {}),
//                     }}
//                     onClick={() =>
//                       updateLayer(selectedVideoLayer.id, {
//                         position: { x: 50, y: 50 },
//                         size: { width: 60, height: 45 },
//                         objectFit: "contain",
//                       })
//                     }
//                   >
//                     <EditorIcons.Move />
//                     Original
//                   </button>
//                 </div>
//               </div>

//               {/* Replace Video Button */}
//               <button
//                 style={styles.replaceVideoButton}
//                 onClick={addVideoLayer}
//               >
//                 <EditorIcons.Upload />
//                 Replace Video
//               </button>

//               {/* Delete Button */}
//               <button
//                 style={styles.deleteVideoButton}
//                 onClick={() => {
//                   deleteLayer(selectedVideoLayer.id);
//                   setSelectedLayerId(null);
//                 }}
//               >
//                 <EditorIcons.Trash />
//               </button>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Main Area */}
//       <div style={styles.mainArea}>
//         <div style={styles.header}>
//           <span style={styles.headerTitle}>Dynamic Layer Editor</span>
//           <div style={styles.headerButtonsRight}>
//             <button
//               style={styles.addButton}
//               onClick={addTextLayer}
//               onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.2)")}
//               onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.1)")}
//             >
//               <EditorIcons.Type />
//               Text
//             </button>
//             <button
//               style={styles.addButton}
//               onClick={addImageLayer}
//               onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.2)")}
//               onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.1)")}
//             >
//               <EditorIcons.Image />
//               Image
//             </button>
//             <button
//               style={styles.addButton}
//               onClick={addAudioLayer}
//               onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.2)")}
//               onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.1)")}
//             >
//               <Icons.Music />
//               Audio
//             </button>
//             <button
//               style={styles.addButton}
//               onClick={addVideoLayer}
//               onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(139, 92, 246, 0.2)")}
//               onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(139, 92, 246, 0.1)")}
//             >
//               <EditorIcons.Video />
//               Video
//             </button>
//             <button
//               style={styles.exportButton}
//               onClick={() => setShowExportModal(true)}
//               onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
//               onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
//             >
//               Export Video
//             </button>
//           </div>
//         </div>

//         <div style={styles.previewArea}>
//           <div 
//             ref={previewContainerRef}
//             style={styles.previewWrapper}
//           >
//             <RemotionPreview
//               ref={previewRef}
//               component={DynamicLayerComposition}
//               inputProps={{ layers, editingLayerId }}
//               durationInFrames={totalFrames}
//               compositionWidth={1080}
//               compositionHeight={1920}
//               fps={FPS}
//               currentFrame={currentFrame}
//               isPlaying={isPlaying}
//               onFrameUpdate={setCurrentFrame}
//               onPlayingChange={setIsPlaying}
//               showPhoneFrame={true}
//               phoneFrameWidth="100%"
//               phoneFrameHeight="100%"
//               interactiveMode={false}
//             />
//             <DynamicPreviewOverlay
//               layers={layers}
//               onLayerUpdate={handleLayerUpdateFromOverlay}
//               selectedLayerId={selectedLayerId}
//               onSelectLayer={setSelectedLayerId}
//               containerWidth={previewDimensions.width || 300}
//               containerHeight={previewDimensions.height || 533}
//               currentFrame={currentFrame}
//               editingLayerId={editingLayerId}
//               onEditingLayerChange={setEditingLayerId}
//             />
//           </div>
//         </div>

//         {/* Timeline with all new features */}
//         <Timeline
//           tracks={timelineTracks}
//           totalFrames={totalFrames}
//           fps={FPS}
//           currentFrame={currentFrame}
//           isPlaying={isPlaying}
//           onFrameChange={handleFrameChange}
//           onPlayPause={handlePlayPause}
//           onTracksChange={handleTracksChange}
//           onUndo={undo}
//           onRedo={redo}
//           canUndo={canUndo}
//           canRedo={canRedo}
//           selectedTrackId={selectedLayerId}
//           onTrackSelect={setSelectedLayerId}
//           onDeleteTrack={handleDeleteTrack}
//           onCutTrack={handleCutTrack}
//           onReorderTracks={handleReorderTracks}
//         />
//       </div>

//       <style>{`
//         input[type="range"] {
//           -webkit-appearance: none;
//           appearance: none;
//           height: 4px;
//           background: rgba(255,255,255,0.1);
//           border-radius: 2px;
//           outline: none;
//         }
//         input[type="range"]::-webkit-slider-thumb {
//           -webkit-appearance: none;
//           appearance: none;
//           width: 14px;
//           height: 14px;
//           background: #3b82f6;
//           border-radius: 50%;
//           cursor: pointer;
//           border: 2px solid white;
//         }
//         select option {
//           background-color: #1a1a1a;
//           color: #e5e5e5;
//         }
//       `}</style>
//     </div>
//     </>
//   );
// };

// export default DynamicLayerEditor;



import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

// ============================================================================
// EDITOR COMPONENTS - Update these paths to match your project structure
// ============================================================================


// Import the new dynamic composition
import { 
  DynamicLayerComposition, 
  type Layer, 
  type TextLayer, 
  type ImageLayer,
  type AudioLayer,
  type VideoLayer,
  isTextLayer,
  isImageLayer,
  isAudioLayer,
  isVideoLayer,
} from "../../remotion_compositions/DynamicLayerComposition";

// Your existing hooks - update paths as needed
import { useProjectSave } from "../../../hooks/SaveProject";
import { useFileUpload } from "../../../hooks/uploads/HandleImageUpload";
import { renderVideo } from "../../../utils/VideoRenderer";
import { backendPrefix } from "../../../config";

import { ExportModal } from "../../ui/modals/ExportModal";
import { SaveProjectModal } from "../../ui/modals/SaveModal";
import { LoadingOverlay } from "../../ui/modals/LoadingProjectModal";
import { DynamicPreviewOverlay, EditorIcons, RemotionPreview, Timeline, type RemotionPreviewHandle } from "../components";
import type { TimelineTrack } from "../components/Timeline";


// AI Tool Modals ✨
import { VoiceoverModal } from "../../ui/modals/VoiceoverModal";
import { RedditPostModal } from "../../ui/modals/RedditPostModal";
import { MagicCropModal } from "../../ui/modals/MagicCropModal";
import { EmojiPickerModal } from "../../ui/modals/EmojiPickerModal";
import { RemixShortsModal } from "../../ui/modals/RemixShortsModal";
import { AIImageModal } from "../../ui/modals/AIImagemodal";
import { VEOGeneratorModal } from "../../ui/modals/VEOGenaratorModal";
import { YoutubeDownloaderModal } from "../../ui/modals/Youtubedownloadermodal";
import { EnhanceSpeechModal } from "../../ui/modals/Enhancespeechmodal";
import { RemoveBackgroundModal } from "../../ui/modals/Removebackgroundmodal";




// ============================================================================
// CONSTANTS
// ============================================================================

const FPS = 30;
const DEFAULT_BACKGROUND = "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1080";
const MAX_HISTORY_SIZE = 50;

const FONTS = [
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Cormorant Garamond", value: "Cormorant Garamond, serif" },
  { label: "Playfair Display", value: "Playfair Display, serif" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Montserrat", value: "Montserrat, sans-serif" },
  { label: "Lora", value: "Lora, serif" },
  { label: "Open Sans", value: "Open Sans, sans-serif" },
  { label: "Poppins", value: "Poppins, sans-serif" },
];

const FONT_WEIGHTS = [
  { label: "Regular", value: "normal" },
  { label: "Medium", value: "500" },
  { label: "Semi Bold", value: "600" },
  { label: "Bold", value: "bold" },
];

const LAYER_COLORS: Record<string, string> = {
  text: "#3b82f6",
  image: "#10b981",
  audio: "#f59e0b",
  video: "#8b5cf6",
};

// Cloudinary video library - placeholder videos
const CLOUDINARY_VIDEOS = {
  backgroundVideos: [
    {
      id: "bg_video_1",
      name: "City Sunset",
      thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/dog.jpg",
      url: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
      duration: "3m 0s",
    },
    {
      id: "bg_video_2",
      name: "Ocean Waves",
      thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/sea_turtle.jpg",
      url: "https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4",
      duration: "1m 0s",
    },
    {
      id: "bg_video_3",
      name: "Forest Path",
      thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/docs/folder_preview.jpg",
      url: "https://res.cloudinary.com/demo/video/upload/docs/walking_talking.mp4",
      duration: "8m 0s",
    },
    {
      id: "bg_video_4",
      name: "Mountain View",
      thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/cld-sample-video.jpg",
      url: "https://res.cloudinary.com/demo/video/upload/cld-sample-video.mp4",
      duration: "2m 30s",
    },
  ],
  visualEffects: [
    {
      id: "vfx_video_1",
      name: "Glitch Effect",
      thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/dog.jpg",
      url: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
      duration: "15s",
    },
    {
      id: "vfx_video_2",
      name: "Text Overlay",
      thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/sea_turtle.jpg",
      url: "https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4",
      duration: "30s",
    },
    {
      id: "vfx_video_3",
      name: "Transition",
      thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/cld-sample-video.jpg",
      url: "https://res.cloudinary.com/demo/video/upload/cld-sample-video.mp4",
      duration: "10s",
    },
  ],
};

// Sidebar tab types
type SidebarTab = "layers" | "text" | "media" | "audio" | "video" | "tools" | null;

const generateId = () => `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const createDefaultLayers = (duration: number): Layer[] => [
  {
    id: "bg_default",
    type: "image",
    name: "Background",
    visible: true,
    locked: false,
    startFrame: 0,
    endFrame: duration * FPS,
    position: { x: 50, y: 50 },
    size: { width: 100, height: 100 },
    rotation: 0,
    opacity: 1,
    src: DEFAULT_BACKGROUND,
    isBackground: true,
    objectFit: "cover",
    filter: "brightness(0.6)",
  } as ImageLayer,
  {
    id: "text_quote",
    type: "text",
    name: "Quote",
    visible: true,
    locked: false,
    startFrame: Math.round(duration * FPS * 0.1),
    endFrame: duration * FPS,
    position: { x: 50, y: 40 },
    size: { width: 80, height: 25 },
    rotation: 0,
    opacity: 1,
    content: "Your inspiring quote goes here",
    fontFamily: "Roboto, sans-serif",
    fontSize: 5,
    fontColor: "#ffffff",
    fontWeight: "normal",
    fontStyle: "normal",
    textAlign: "center",
    lineHeight: 1.5,
    textOutline: true,
    outlineColor: "#000000",
    textShadow: true,
    shadowColor: "#000000",
    shadowX: 2,
    shadowY: 2,
    shadowBlur: 4,
    animation: { entrance: "slideUp", entranceDuration: 45 },
  } as TextLayer,
  {
    id: "text_author",
    type: "text",
    name: "Author",
    visible: true,
    locked: false,
    startFrame: Math.round(duration * FPS * 0.5),
    endFrame: duration * FPS,
    position: { x: 50, y: 75 },
    size: { width: 60, height: 10 },
    rotation: 0,
    opacity: 1,
    content: "— Author Name",
    fontFamily: "Roboto, sans-serif",
    fontSize: 2.5,
    fontColor: "#ffffff",
    fontWeight: "600",
    fontStyle: "normal",
    textAlign: "center",
    lineHeight: 1.4,
    textTransform: "uppercase",
    letterSpacing: 2,
    textOutline: false,
    outlineColor: "#000000",
    textShadow: false,
    shadowColor: "#000000",
    shadowX: 0,
    shadowY: 0,
    shadowBlur: 0,
    animation: { entrance: "fade", entranceDuration: 30 },
  } as TextLayer,
];

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  ChevronLeft: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  Underline: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  ),
  Strikethrough: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="12" x2="20" y2="12" />
      <path d="M17.5 6.5c-.83-1.5-2.5-2.5-4.5-2.5-3 0-5 2-5 4.5 0 2.5 2 3.5 5 4.5 3 1 5 2 5 4.5 0 2.5-2 4.5-5 4.5-2.5 0-4.5-1.5-5-3.5" />
    </svg>
  ),
  AllCaps: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <text x="2" y="17" fontSize="14" fontWeight="bold" fill="currentColor" stroke="none">Aa</text>
    </svg>
  ),
  Spacing: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Layers: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Close: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Music: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  Volume: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  ),
  Tools: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  Sparkles: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M19 12l.75 2.25L22 15l-2.25.75L19 18l-.75-2.25L16 15l2.25-.75L19 12z" />
    </svg>
  ),
  Mic: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  Reddit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="10" r="1" />
      <circle cx="15" cy="10" r="1" />
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.5 11.5c0 2.21-1.79 4-4 4h-3c-2.21 0-4-1.79-4-4v-.5c0-.28.22-.5.5-.5s.5.22.5.5v.5c0 1.66 1.34 3 3 3h3c1.66 0 3-1.34 3-3v-.5c0-.28.22-.5.5-.5s.5.22.5.5v.5z" />
    </svg>
  ),
  Crop: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15" />
      <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15" />
    </svg>
  ),
  Smile: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  Shuffle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  ),

   Image: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  
  Eraser: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 20H7L3 16 7.5 11.5 16.5 2.5C17.5 1.5 19 1.5 20 2.5L21.5 4C22.5 5 22.5 6.5 21.5 7.5L12.5 16.5L8 21" />
      <line x1="8.5" y1="13.5" x2="15.5" y2="6.5" />
    </svg>
  ),
  
  Waveform: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 10v4M6 6v12M10 3v18M14 8v8M18 5v14M22 10v4" />
    </svg>
  ),
  
  Download: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  
  Video: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),

};

// ============================================================================
// HISTORY HOOK FOR UNDO/REDO
// ============================================================================

function useHistory(initialLayers: Layer[]) {
  const [historyState, setHistoryState] = useState({
    history: [initialLayers],
    currentIndex: 0,
  });
  
  const canUndo = historyState.currentIndex > 0;
  const canRedo = historyState.currentIndex < historyState.history.length - 1;
  
  // Safely get current layers
  const currentLayers = historyState.history[historyState.currentIndex] || initialLayers;
  
  const pushState = useCallback((newLayers: Layer[]) => {
    setHistoryState(prev => {
      // Remove any future history if we're not at the end
      const newHistory = prev.history.slice(0, prev.currentIndex + 1);
      newHistory.push(newLayers);
      
      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
        return {
          history: newHistory,
          currentIndex: newHistory.length - 1,
        };
      }
      
      return {
        history: newHistory,
        currentIndex: prev.currentIndex + 1,
      };
    });
  }, []);
  
  const undo = useCallback(() => {
    setHistoryState(prev => ({
      ...prev,
      currentIndex: Math.max(0, prev.currentIndex - 1),
    }));
  }, []);
  
  const redo = useCallback(() => {
    setHistoryState(prev => ({
      ...prev,
      currentIndex: Math.min(prev.history.length - 1, prev.currentIndex + 1),
    }));
  }, []);
  
  const resetHistory = useCallback((newLayers: Layer[]) => {
    setHistoryState({
      history: [newLayers],
      currentIndex: 0,
    });
  }, []);
  
  return {
    layers: currentLayers,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const DynamicLayerEditor: React.FC = () => {
  const { id } = useParams();
  const { isUploading, uploadedUrl, uploadFile } = useFileUpload({ type: "image" });

  // ============================================================================
  // STATE WITH HISTORY
  // ============================================================================

  const initialLayers = createDefaultLayers(9);
  const {
    layers,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  } = useHistory(initialLayers);

  const [duration, setDuration] = useState(9);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SidebarTab>(null);
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);

  // Playback state
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // UI State
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
// AI Tool Modals State ✨
const [showVoiceoverModal, setShowVoiceoverModal] = useState(false);
const [showRedditModal, setShowRedditModal] = useState(false);
const [showMagicCropModal, setShowMagicCropModal] = useState(false);
const [showEmojiPickerModal, setShowEmojiPickerModal] = useState(false);
const [showRemixShortsModal, setShowRemixShortsModal] = useState(false);
const [showAIImageModal, setShowAIImageModal] = useState(false);
const [showRemoveBackgroundModal, setShowRemoveBackgroundModal] = useState(false);
const [showEnhanceSpeechModal, setShowEnhanceSpeechModal] = useState(false);
const [showYoutubeDownloaderModal, setShowYoutubeDownloaderModal] = useState(false);
const [showVEOGeneratorModal, setShowVEOGeneratorModal] = useState(false);






  // Preview container dimensions for overlay
  const [previewDimensions, setPreviewDimensions] = useState({ width: 0, height: 0 });
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Refs
  const previewRef = useRef<RemotionPreviewHandle>(null);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Derived values
  const totalFrames = duration * FPS;
  const selectedLayer = layers.find((l) => l.id === selectedLayerId);
  const selectedTextLayer = selectedLayer && isTextLayer(selectedLayer) ? selectedLayer : null;
  const selectedImageLayer = selectedLayer && isImageLayer(selectedLayer) && !selectedLayer.isBackground ? selectedLayer : null;
  const selectedAudioLayer = selectedLayer && isAudioLayer(selectedLayer) ? selectedLayer : null;
  const selectedVideoLayer = selectedLayer && isVideoLayer(selectedLayer) ? selectedLayer : null;

  // Update preview dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (previewContainerRef.current) {
        const rect = previewContainerRef.current.getBoundingClientRect();
        setPreviewDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    const timeout = setTimeout(updateDimensions, 100);
    
    return () => {
      window.removeEventListener("resize", updateDimensions);
      clearTimeout(timeout);
    };
  }, []);

  // ============================================================================
  // TIMELINE TRACKS (derived from layers)
  // ============================================================================

  const timelineTracks: TimelineTrack[] = useMemo(() => {
    return layers.map((layer) => ({
      id: layer.id,
      type: layer.type === "text" ? "text" : layer.type === "audio" ? "audio" : "image",
      label: layer.name,
      color: LAYER_COLORS[layer.type] || "#666",
      startFrame: layer.startFrame,
      endFrame: layer.endFrame,
      locked: layer.locked,
      visible: layer.visible,
    }));
  }, [layers]);


  // ============================================================================
  // AI TOOL HANDLERS ✨
  // ============================================================================
  // ✅ 1. VOICEOVER MODAL - Expects ONE object with 4 properties
  const handleVoiceoverGenerate = useCallback((audioData: {
    text: string;
    voice: string;
    speed: number;
    audioUrl: string;
  }) => {
    const newLayer: AudioLayer = {
      id: generateId(),
      type: "audio",
      name: `Voiceover (${audioData.voice})`,
      visible: true,
      locked: false,
      startFrame: currentFrame,
      endFrame: Math.min(currentFrame + 300, totalFrames),
      position: { x: 50, y: 50 },
      size: { width: 100, height: 10 },
      rotation: 0,
      opacity: 1,
      src: audioData.audioUrl,
      volume: 1,
      loop: false,
      fadeIn: 0,
      fadeOut: 0,
    };
    pushState([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
    toast.success("Voiceover added to timeline");
  }, [currentFrame, totalFrames, layers, pushState]);

  // ✅ 2. REDDIT POST MODAL - Expects single string (imageUrl)
  const handleRedditPostGenerate = useCallback((imageUrl: string) => {
    const newLayer: ImageLayer = {
      id: generateId(),
      type: "image",
      name: "Reddit Post",
      visible: true,
      locked: false,
      startFrame: currentFrame,
      endFrame: Math.min(currentFrame + 150, totalFrames),
      position: { x: 50, y: 50 },
      size: { width: 60, height: 40 },
      rotation: 0,
      opacity: 1,
      src: imageUrl,
      isBackground: false,
      objectFit: "contain",
    };
    pushState([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
    toast.success("Reddit post added to timeline");
  }, [currentFrame, totalFrames, layers, pushState]);

  // ✅ 3. MAGIC CROP MODAL - Expects ONE object with 4 properties
  const handleMagicCropApply = useCallback((settings: {
    cropType: string;
    intensity: number;
    focusPoint: string;
    enableAutoZoom: boolean;
  }) => {
    if (!selectedVideoLayer) {
      toast.error("Please select a video layer first");
      return;
    }

    const newLayers = layers.map((layer): Layer => {
      if (layer.id !== selectedVideoLayer.id) return layer;
      return {
        ...layer,
        objectFit: settings.cropType === "smart" || settings.cropType === "face" ? "cover" : "contain",
      } as VideoLayer;
    });
    pushState(newLayers);
    toast.success("Magic crop applied to video");
  }, [selectedVideoLayer, layers, pushState]);

  // ✅ 4. EMOJI PICKER MODAL - Expects single string (emoji)
  const handleEmojiSelect = useCallback((emoji: string) => {
    const newLayer: TextLayer = {
      id: generateId(),
      type: "text",
      name: `Emoji ${emoji}`,
      visible: true,
      locked: false,
      startFrame: currentFrame,
      endFrame: Math.min(currentFrame + 90, totalFrames),
      position: { x: 50, y: 50 },
      size: { width: 20, height: 20 },
      rotation: 0,
      opacity: 1,
      content: emoji,
      fontFamily: "Arial, sans-serif",
      fontSize: 6,
      fontColor: "#ffffff",
      fontWeight: "normal",
      fontStyle: "normal",
      textAlign: "center",
      lineHeight: 1,
      textOutline: false,
      outlineColor: "#000000",
      textShadow: false,
      shadowColor: "#000000",
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      animation: { entrance: "fade", entranceDuration: 20 },
    };
    pushState([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
    toast.success("Emoji added to timeline");
  }, [currentFrame, totalFrames, layers, pushState]);

  // ✅ 5. REMIX SHORTS MODAL - Expects ONE object with 4 properties
  const handleRemixGenerate = useCallback((settings: {
    style: string;
    duration: number;
    variations: number;
    effects: string[];
  }) => {
    console.log("Remix settings:", settings);
    toast.success(`Generating ${settings.variations} remix variation(s)...`);
    // This would call your backend AI service
  }, []);

  // ✅ 6. AI IMAGE MODAL - Expects single string (imageUrl)
const handleAIImageGenerate = useCallback((imageUrl: string) => {
  const newLayer: ImageLayer = {
    id: generateId(),
    type: "image",
    name: "AI Generated Image",
    visible: true,
    locked: false,
    startFrame: currentFrame,
    endFrame: Math.min(currentFrame + 150, totalFrames),
    position: { x: 50, y: 50 },
    size: { width: 60, height: 40 },
    rotation: 0,
    opacity: 1,
    src: imageUrl,
    isBackground: false,
    objectFit: "contain",
  };
  pushState([...layers, newLayer]);
  setSelectedLayerId(newLayer.id);
  toast.success("AI image added to timeline");
}, [currentFrame, totalFrames, layers, pushState]);

// ✅ 9. YOUTUBE DOWNLOADER MODAL - Expects ONE object with videoUrl and metadata
const handleYoutubeDownload = useCallback((data: {
  videoUrl: string;
  title: string;
  duration: number;
  format: string;
}) => {
  // Calculate layer duration based on video duration (in seconds)
  const durationInFrames = Math.round(data.duration * FPS);
  const layerEndFrame = Math.min(currentFrame + durationInFrames, totalFrames);
  
  const newLayer: VideoLayer = {
    id: generateId(),
    type: "video",
    name: `${data.title} (${data.format.toUpperCase()})`,
    visible: true,
    locked: false,
    startFrame: currentFrame,
    endFrame: layerEndFrame,
    // Center the video in the canvas
    position: { x: 50, y: 50 },
    // Full width, auto height to maintain aspect ratio
    size: { width: 100, height: 100 },
    rotation: 0,
    opacity: 1,
    src: data.videoUrl,
    volume: 1.0, // Full volume by default
    loop: false,
    playbackRate: 1,
    objectFit: "contain", // Show full video without cropping
    filter: "",
    fadeIn: 15, // Subtle fade in (0.5 seconds at 30fps)
    fadeOut: 15, // Subtle fade out (0.5 seconds at 30fps)
    animation: {
      entrance: "none", // No animation for downloaded videos
      entranceDuration: 0,
    },
  };
  
  // Add layer and select it
  pushState([newLayer, ...layers]);
  setSelectedLayerId(newLayer.id);
  
  // Show success notification with duration
  const durationText = data.duration > 60 
    ? `${Math.floor(data.duration / 60)}:${String(data.duration % 60).padStart(2, '0')}` 
    : `${data.duration}s`;
  toast.success(`Added: ${data.title} (${durationText})`);
}, [currentFrame, totalFrames, layers, pushState, FPS]);



// ✅ 10. VEO GENERATOR MODAL - Expects ONE object with generated video data
const handleVEOGenerate = useCallback((data: {
  videoUrl: string;
  prompt: string;
  duration: number;
}) => {
  const newLayer: VideoLayer = {
    id: generateId(),
    type: "video",
    name: `VEO: ${data.prompt.substring(0, 30)}...`,
    visible: true,
    locked: false,
    startFrame: currentFrame,
    endFrame: Math.min(currentFrame + Math.round(data.duration * FPS), totalFrames),
    position: { x: 50, y: 50 },
    size: { width: 100, height: 100 },
    rotation: 0,
    opacity: 1,
    src: data.videoUrl,
    volume: 0.8,
    loop: false,
    playbackRate: 1,
    objectFit: "cover",
    filter: "",
    fadeIn: 0,
    fadeOut: 0,
    animation: {
      entrance: "fade",
      entranceDuration: 30,
    },
  };
  pushState([newLayer, ...layers]);
  setSelectedLayerId(newLayer.id);
  toast.success("VEO video generated successfully");
}, [currentFrame, totalFrames, layers, pushState, FPS]);

  // ============================================================================
  // SIDEBAR TAB HANDLING
  // ============================================================================

  const handleTabClick = useCallback((tab: SidebarTab) => {
    if (activeTab === tab) {
      setActiveTab(null);
    } else {
      setActiveTab(tab);
    }
  }, [activeTab]);

  // ============================================================================
  // LAYER MANAGEMENT
  // ============================================================================

  const addTextLayer = useCallback(() => {
    const newLayer: TextLayer = {
      id: generateId(),
      type: "text",
      name: `Text ${layers.filter((l) => l.type === "text").length + 1}`,
      visible: true,
      locked: false,
      startFrame: currentFrame,
      endFrame: Math.min(currentFrame + 90, totalFrames),
      position: { x: 50, y: 50 },
      size: { width: 70, height: 15 },
      rotation: 0,
      opacity: 1,
      content: "New Text",
      fontFamily: "Roboto, sans-serif",
      fontSize: 4,
      fontColor: "#ffffff",
      fontWeight: "normal",
      fontStyle: "normal",
      textAlign: "center",
      lineHeight: 1.4,
      textOutline: false,
      outlineColor: "#000000",
      textShadow: false,
      shadowColor: "#000000",
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      animation: { entrance: "fade", entranceDuration: 30 },
    };
    pushState([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
  }, [currentFrame, totalFrames, layers, pushState]);

  const addImageLayer = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newLayer: ImageLayer = {
            id: generateId(),
            type: "image",
            name: `Image ${layers.filter((l) => l.type === "image").length + 1}`,
            visible: true,
            locked: false,
            startFrame: currentFrame,
            endFrame: Math.min(currentFrame + 90, totalFrames),
            position: { x: 50, y: 50 },
            size: { width: 40, height: 25 },
            rotation: 0,
            opacity: 1,
            src: event.target?.result as string,
            isBackground: false,
            objectFit: "contain",
          };
          pushState([...layers, newLayer]);
          setSelectedLayerId(newLayer.id);
        };
        reader.readAsDataURL(file);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [currentFrame, totalFrames, layers, pushState]
  );

  const addAudioLayer = useCallback(() => {
    audioInputRef.current?.click();
  }, []);

  const handleAudioUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newLayer: AudioLayer = {
            id: generateId(),
            type: "audio",
            name: file.name.replace(/\.[^/.]+$/, "") || `Audio ${layers.filter((l) => l.type === "audio").length + 1}`,
            visible: true,
            locked: false,
            startFrame: currentFrame,
            endFrame: Math.min(currentFrame + 150, totalFrames), // 5 seconds default
            position: { x: 50, y: 50 },
            size: { width: 100, height: 10 },
            rotation: 0,
            opacity: 1,
            src: event.target?.result as string,
            volume: 1,
            loop: false,
            fadeIn: 0,
            fadeOut: 0,
          };
          pushState([...layers, newLayer]);
          setSelectedLayerId(newLayer.id);
          toast.success("Audio added");
        };
        reader.readAsDataURL(file);
      }
      if (audioInputRef.current) {
        audioInputRef.current.value = "";
      }
    },
    [currentFrame, totalFrames, layers, pushState]
  );

  // Video layer functions
  const videoInputRef = useRef<HTMLInputElement>(null);

  const addVideoLayer = useCallback(() => {
    videoInputRef.current?.click();
  }, []);

  const handleVideoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newLayer: VideoLayer = {
            id: generateId(),
            type: "video",
            name: file.name.replace(/\.[^/.]+$/, "") || `Video ${layers.filter((l) => l.type === "video").length + 1}`,
            visible: true,
            locked: false,
            startFrame: currentFrame,
            endFrame: Math.min(currentFrame + 150, totalFrames), // 5 seconds default
            position: { x: 50, y: 50 },
            size: { width: 60, height: 45 },
            rotation: 0,
            opacity: 1,
            src: event.target?.result as string,
            volume: 0.8,
            loop: false,
            playbackRate: 1,
            objectFit: "contain",
            filter: "",
            fadeIn: 0,
            fadeOut: 0,
            animation: {
              entrance: "fade",
              entranceDuration: 30,
            },
          };
          pushState([newLayer, ...layers]);
          setSelectedLayerId(newLayer.id);
          setActiveTab("video");
          toast.success("Video added");
        };
        reader.readAsDataURL(file);
      }
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    },
    [currentFrame, totalFrames, layers, pushState]
  );

  const updateLayer = useCallback((layerId: string, updates: Partial<Layer>) => {
    const newLayers = layers.map((layer): Layer => {
      if (layer.id !== layerId) return layer;
      return { ...layer, ...updates } as Layer;
    });
    pushState(newLayers);
  }, [layers, pushState]);

  // ✅ 7. REMOVE BACKGROUND MODAL - Expects single string (processedImageUrl)
  const handleRemoveBackground = useCallback((processedImageUrl: string) => {
    if (!selectedImageLayer && !selectedVideoLayer) {
      toast.error("Please select an image or video layer first");
      return;
    }

    if (selectedImageLayer) {
      updateLayer(selectedImageLayer.id, { src: processedImageUrl });
      toast.success("Background removed from image");
    } else if (selectedVideoLayer) {
      updateLayer(selectedVideoLayer.id, { src: processedImageUrl });
      toast.success("Background removed from video");
    }
  }, [selectedImageLayer, selectedVideoLayer, updateLayer]);

  // ✅ 8. ENHANCE SPEECH MODAL - Expects ONE object with audioUrl and settings
  const handleEnhanceSpeech = useCallback((data: {
    audioUrl: string;
    denoiseLevel: number;
    enhanceClarity: boolean;
  }) => {
    if (!selectedAudioLayer) {
      toast.error("Please select an audio layer first");
      return;
    }

    updateLayer(selectedAudioLayer.id, { src: data.audioUrl });
    toast.success("Speech enhanced successfully");
  }, [selectedAudioLayer, updateLayer]);



  const deleteLayer = useCallback(
    (layerId: string) => {
      const layer = layers.find((l) => l.id === layerId);
      if (layer && isImageLayer(layer) && layer.isBackground) {
        toast.error("Cannot delete background layer");
        return;
      }
      const newLayers = layers.filter((l) => l.id !== layerId);
      pushState(newLayers);
      if (selectedLayerId === layerId) {
        setSelectedLayerId(null);
      }
      toast.success("Layer deleted");
    },
    [selectedLayerId, layers, pushState]
  );

  // ============================================================================
  // CUT LAYER AT PLAYHEAD
  // ============================================================================

  const cutLayerAtPlayhead = useCallback((layerId: string, frame: number) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer) return;
    
    if (frame <= layer.startFrame || frame >= layer.endFrame) {
      toast.error("Playhead must be within the layer to cut");
      return;
    }

    if (layer.locked) {
      toast.error("Cannot cut a locked layer");
      return;
    }

    const newLayerId = generateId();
    const newLayer: Layer = layer.type === "text" 
      ? {
          ...layer,
          id: newLayerId,
          name: `${layer.name} (cut)`,
          startFrame: frame,
          endFrame: layer.endFrame,
        } as TextLayer
      : {
          ...layer,
          id: newLayerId,
          name: `${layer.name} (cut)`,
          startFrame: frame,
          endFrame: layer.endFrame,
        } as ImageLayer;

    const updatedLayers = layers.map((l): Layer => {
      if (l.id === layerId) {
        if (l.type === "text") {
          return { ...l, endFrame: frame } as TextLayer;
        }
        return { ...l, endFrame: frame } as ImageLayer;
      }
      return l;
    });

    const originalIndex = updatedLayers.findIndex(l => l.id === layerId);
    updatedLayers.splice(originalIndex + 1, 0, newLayer);

    pushState(updatedLayers);
    setSelectedLayerId(newLayerId);
    toast.success("Layer cut at playhead");
  }, [layers, pushState]);

  // ============================================================================
  // REORDER LAYERS
  // ============================================================================

  const reorderLayers = useCallback((fromIndex: number, toIndex: number) => {
    const newLayers = [...layers];
    const [removed] = newLayers.splice(fromIndex, 1);
    newLayers.splice(toIndex, 0, removed);
    pushState(newLayers);
  }, [layers, pushState]);

  const handleLayerUpdateFromOverlay = useCallback((layerId: string, updates: Partial<Layer>) => {
    updateLayer(layerId, updates as Partial<TextLayer> | Partial<ImageLayer>);
  }, [updateLayer]);

  // ============================================================================
  // TRACK CHANGE HANDLER (from Timeline)
  // ============================================================================

  const handleTracksChange = useCallback((newTracks: TimelineTrack[]) => {
    const newLayers = layers.map((layer): Layer => {
      const track = newTracks.find((t) => t.id === layer.id);
      if (track) {
        const updates = {
          startFrame: track.startFrame,
          endFrame: track.endFrame,
          locked: track.locked,
          visible: track.visible,
        };
        if (layer.type === "text") {
          return { ...layer, ...updates } as TextLayer;
        }
        return { ...layer, ...updates } as ImageLayer;
      }
      return layer;
    });
    pushState(newLayers);
  }, [layers, pushState]);

  // Handle delete from timeline
  const handleDeleteTrack = useCallback((trackId: string) => {
    deleteLayer(trackId);
  }, [deleteLayer]);

  // Handle cut from timeline
  const handleCutTrack = useCallback((trackId: string, frame: number) => {
    cutLayerAtPlayhead(trackId, frame);
  }, [cutLayerAtPlayhead]);

  // Handle reorder from timeline
  const handleReorderTracks = useCallback((fromIndex: number, toIndex: number) => {
    reorderLayers(fromIndex, toIndex);
  }, [reorderLayers]);

  // ============================================================================
  // PLAYBACK CONTROL
  // ============================================================================

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      previewRef.current?.pause();
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
    } else {
      setIsPlaying(true);
      previewRef.current?.play();
      playbackIntervalRef.current = setInterval(() => {
        const frame = previewRef.current?.getCurrentFrame() ?? 0;
        setCurrentFrame(frame);
      }, 1000 / 30);
    }
  }, [isPlaying]);

  const handleFrameChange = useCallback((frame: number) => {
    setCurrentFrame(frame);
    previewRef.current?.seekTo(frame);
  }, []);

  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, []);

  // ============================================================================
  // KEYBOARD SHORTCUTS
  // ============================================================================

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).contentEditable === "true"
      ) {
        return;
      }

      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Shift+Z or Cmd+Shift+Z or Ctrl+Y
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
        return;
      }

      // Cut: C key
      if (e.code === "KeyC" && !e.ctrlKey && !e.metaKey && selectedLayerId) {
        e.preventDefault();
        cutLayerAtPlayhead(selectedLayerId, currentFrame);
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === "Delete" || e.code === "Backspace") {
        if (selectedLayerId) {
          e.preventDefault();
          deleteLayer(selectedLayerId);
        }
      } else if (e.code === "Escape") {
        setSelectedLayerId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePlayPause, selectedLayerId, deleteLayer, undo, redo, cutLayerAtPlayhead, currentFrame]);

  // ============================================================================
  // PROJECT SAVE
  // ============================================================================

  const {
    isSaving,
    showSaveModal,
    setShowSaveModal,
    handleSave,
    saveNewProject,
    lastSavedProps,
    setProjectId,
  } = useProjectSave({
    templateId: 2,
    buildProps: () => ({
      layers,
      duration,
    }),
    videoEndpoint: `${backendPrefix}/generatevideo/dynamiclayer`,
  });

  // ============================================================================
  // EXPORT
  // ============================================================================

  const handleExport = async (format: string) => {
    setIsExporting(true);
    const props = { layers, duration };
    const exportResponse = await renderVideo(props, 2, "DynamicLayerComposition", format);
    if (exportResponse === "error") {
      toast.error("There was an error exporting your video");
    } else {
      setExportUrl(exportResponse);
    }
    setShowExportModal(true);
    setIsExporting(false);
  };

  // ============================================================================
  // LOAD PROJECT
  // ============================================================================

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetch(`${backendPrefix}/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load project");
          return res.json();
        })
        .then((data) => {
          setProjectId(data.id);
          if (data.props.layers) {
            resetHistory(data.props.layers);
          }
          if (data.props.duration) setDuration(data.props.duration);
          lastSavedProps.current = data.props;
        })
        .catch((err) => console.error("Project load failed:", err))
        .finally(() => setIsLoading(false));
    }
  }, [id, resetHistory]);

  // ============================================================================
  // STYLES
  // ============================================================================

  const styles: Record<string, React.CSSProperties> = {
    container: {
      display: "flex",
      height: "100vh",
      width: "100%",
      backgroundColor: "#0f0f0f",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#e5e5e5",
      overflow: "hidden",
    },
    leftSidebar: {
      width: "60px",
      minWidth: "60px",
      backgroundColor: "#0a0a0a",
      borderRight: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "16px",
      gap: "8px",
    },
    sidebarButton: {
      width: "44px",
      height: "44px",
      border: "none",
      backgroundColor: "transparent",
      color: "#666",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
      borderRadius: "8px",
      transition: "all 0.15s",
      fontSize: "9px",
      fontWeight: 500,
    },
    sidebarButtonActive: {
      color: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
    },
    layersPanel: {
      width: "320px",
      minWidth: "320px",
      backgroundColor: "#141414",
      borderRight: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      transition: "width 0.2s ease, min-width 0.2s ease, opacity 0.2s ease",
    },
    layersPanelClosed: {
      width: "0px",
      minWidth: "0px",
      borderRight: "none",
      opacity: 0,
    },
    layersPanelHeader: {
      padding: "16px",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    layersPanelTitle: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#e5e5e5",
    },
    headerButtons: {
      display: "flex",
      gap: "4px",
    },
    addLayerButton: {
      width: "28px",
      height: "28px",
      border: "1px solid rgba(255,255,255,0.1)",
      backgroundColor: "transparent",
      color: "#888",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      transition: "all 0.15s",
    },
    closeButton: {
      width: "28px",
      height: "28px",
      border: "none",
      backgroundColor: "transparent",
      color: "#666",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      transition: "all 0.15s",
    },
    layersList: {
      flex: 1,
      overflowY: "auto",
      padding: "8px",
    },
    layerItem: {
      padding: "10px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "4px",
      transition: "all 0.15s",
      backgroundColor: "transparent",
      border: "1px solid transparent",
    },
    layerItemActive: {
      backgroundColor: "rgba(59, 130, 246, 0.15)",
      border: "1px solid rgba(59, 130, 246, 0.3)",
    },
    layerIcon: {
      width: "24px",
      height: "24px",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    layerName: {
      fontSize: "12px",
      fontWeight: "500",
      color: "#e5e5e5",
      flex: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    layerType: {
      fontSize: "10px",
      color: "#666",
      textTransform: "uppercase",
    },
    editPanel: {
      width: "320px",
      minWidth: "320px",
      backgroundColor: "#141414",
      borderRight: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      transition: "width 0.2s ease, min-width 0.2s ease, opacity 0.2s ease",
    },
    editPanelHidden: {
      width: 0,
      minWidth: 0,
      opacity: 0,
      overflow: "hidden",
    },
    editPanelHeader: {
      padding: "16px",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    backButton: {
      width: "32px",
      height: "32px",
      border: "none",
      backgroundColor: "transparent",
      color: "#888",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      transition: "all 0.15s",
    },
    editPanelTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#e5e5e5",
    },
    editPanelContent: {
      flex: 1,
      overflowY: "auto",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    textInput: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#1a1a1a",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#e5e5e5",
      fontSize: "14px",
      outline: "none",
      resize: "none",
      minHeight: "80px",
      fontFamily: "inherit",
    },
    styleSection: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    styleLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#888",
    },
    fontSelect: {
      flex: 1,
      padding: "10px 12px",
      backgroundColor: "#1a1a1a",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#e5e5e5",
      fontSize: "13px",
      outline: "none",
      cursor: "pointer",
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
    },
    weightSizeRow: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
    },
    weightSelect: {
      flex: 1,
      padding: "10px 12px",
      backgroundColor: "#1a1a1a",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#e5e5e5",
      fontSize: "13px",
      outline: "none",
      cursor: "pointer",
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
    },
    sizeInput: {
      width: "70px",
      padding: "10px 12px",
      backgroundColor: "#1a1a1a",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#e5e5e5",
      fontSize: "13px",
      outline: "none",
      textAlign: "center",
    },
    colorCircle: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      border: "2px solid rgba(255,255,255,0.2)",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      flexShrink: 0,
    },
    colorInput: {
      position: "absolute",
      inset: 0,
      opacity: 0,
      cursor: "pointer",
      width: "100%",
      height: "100%",
    },
    styleButtonsRow: {
      display: "flex",
      gap: "4px",
      alignItems: "center",
    },
    styleButton: {
      width: "36px",
      height: "36px",
      border: "1px solid rgba(255,255,255,0.1)",
      backgroundColor: "#1a1a1a",
      color: "#888",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      transition: "all 0.15s",
    },
    styleButtonActive: {
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      borderColor: "#3b82f6",
      color: "#3b82f6",
    },
    toggleRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px 0",
    },
    toggleLabel: {
      fontSize: "13px",
      color: "#e5e5e5",
    },
    toggle: {
      width: "44px",
      height: "24px",
      borderRadius: "12px",
      backgroundColor: "rgba(255,255,255,0.1)",
      border: "none",
      cursor: "pointer",
      position: "relative",
      transition: "background-color 0.2s",
    },
    toggleActive: {
      backgroundColor: "#3b82f6",
    },
    toggleKnob: {
      position: "absolute",
      top: "2px",
      left: "2px",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      backgroundColor: "white",
      transition: "transform 0.2s",
    },
    toggleKnobActive: {
      transform: "translateX(20px)",
    },
    colorRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    sliderRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    sliderLabel: {
      width: "40px",
      fontSize: "12px",
      color: "#666",
    },
    slider: {
      flex: 1,
      height: "4px",
      borderRadius: "2px",
      appearance: "none",
      backgroundColor: "rgba(255,255,255,0.1)",
      cursor: "pointer",
      outline: "none",
    },
    sliderValue: {
      width: "50px",
      padding: "6px 8px",
      backgroundColor: "#1a1a1a",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "6px",
      color: "#e5e5e5",
      fontSize: "12px",
      textAlign: "center",
      outline: "none",
    },
    deleteButton: {
      width: "100%",
      padding: "12px",
      backgroundColor: "transparent",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#888",
      fontSize: "13px",
      cursor: "pointer",
      transition: "all 0.15s",
      marginTop: "auto",
    },
    mainArea: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    header: {
      height: "56px",
      padding: "0 20px",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#0f0f0f",
    },
    headerTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#e5e5e5",
    },
    headerButtonsRight: {
      display: "flex",
      gap: "8px",
    },
    addButton: {
      padding: "8px 16px",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      border: "1px solid rgba(59, 130, 246, 0.3)",
      borderRadius: "8px",
      color: "#3b82f6",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.2s",
    },
    exportButton: {
      padding: "8px 16px",
      background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
      border: "none",
      borderRadius: "8px",
      color: "white",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    previewArea: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0a0a0a",
      position: "relative",
    },
    previewWrapper: {
      position: "relative",
      width: "calc(65vh * 0.5625)",
      height: "65vh",
    },
    // Video Library Styles
    videoLibraryContainer: {
      padding: "16px",
      overflowY: "auto" as const,
      height: "100%",
    },
    videoLibraryHeader: {
      display: "flex",
      gap: "12px",
      marginBottom: "20px",
    },
    viewAssetsButton: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "12px",
      background: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s",
    },
    uploadFileButton: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "12px",
      background: "white",
      color: "#333",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s",
    },
    videoSection: {
      marginBottom: "32px",
    },
    videoSectionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },
    videoSectionTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#e5e5e5",
      margin: 0,
    },
    viewMoreLink: {
      background: "none",
      border: "none",
      color: "#3b82f6",
      cursor: "pointer",
      fontSize: "12px",
      padding: "0",
      textDecoration: "none",
    },
    videoGridVertical: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      marginBottom: "8px",
    },
    videoCardVertical: {
      cursor: "pointer",
      transition: "opacity 0.2s",
    },
    videoThumbnailVertical: {
      position: "relative" as const,
      width: "100%",
      height: "100px",
      borderRadius: "6px",
      overflow: "hidden",
      marginBottom: "8px",
      backgroundColor: "#1a1a1a",
    },
    videoThumbnailImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover" as const,
    },
    videoDurationBadge: {
      position: "absolute" as const,
      bottom: "6px",
      left: "6px",
      background: "rgba(0, 0, 0, 0.8)",
      color: "white",
      padding: "2px 6px",
      borderRadius: "3px",
      fontSize: "11px",
      fontWeight: "500",
    },
    videoNameText: {
      fontSize: "12px",
      color: "#e5e5e5",
      marginBottom: "6px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap" as const,
    },
    videoProgressSlider: {
      width: "100%",
      height: "3px",
      cursor: "pointer",
      appearance: "none" as const,
      backgroundColor: "#333",
      borderRadius: "2px",
      outline: "none",
    },
    // Tools Panel Styles
    toolsContainer: {
      padding: "16px",
      overflowY: "auto" as const,
      height: "100%",
    },
    toolItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      padding: "14px",
      backgroundColor: "transparent",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "8px",
      marginBottom: "10px",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    toolIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      backgroundColor: "#1a1a1a",
    },
    toolInfo: {
      flex: 1,
      overflow: "hidden",
    },
    toolName: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#e5e5e5",
      marginBottom: "4px",
    },
    toolDescription: {
      fontSize: "11px",
      color: "#666",
      lineHeight: "1.4",
    },
    // Video Edit Panel Styles
    propertyRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    },
    propertyValue: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#3b82f6",
      backgroundColor: "rgba(59,130,246,0.1)",
      padding: "4px 10px",
      borderRadius: "6px",
    },
    propertyGroup: {
      marginBottom: "20px",
    },
    propertyLabel: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#e5e5e5",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    speedButtons: {
      display: "flex",
      gap: "8px",
    },
    speedButton: {
      flex: 1,
      padding: "10px 8px",
      background: "linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)",
      color: "#e5e5e5",
      border: "1px solid #404040",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "600",
      transition: "all 0.2s",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    speedButtonActive: {
      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      borderColor: "#3b82f6",
      color: "white",
      boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#e5e5e5",
      fontSize: "14px",
      cursor: "pointer",
    },
    rotationControls: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    rotationInput: {
      width: "60px",
      padding: "8px",
      background: "linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)",
      border: "1px solid #404040",
      borderRadius: "6px",
      color: "#e5e5e5",
      fontSize: "14px",
      fontWeight: "600",
      textAlign: "center" as const,
      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
    },
    degreeSymbol: {
      color: "#999",
      fontSize: "14px",
      fontWeight: "600",
    },
    flipButton: {
      padding: "8px 12px",
      background: "linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)",
      border: "1px solid #404040",
      borderRadius: "6px",
      color: "#e5e5e5",
      cursor: "pointer",
      fontSize: "18px",
      transition: "all 0.2s",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    resetButtons: {
      display: "flex",
      gap: "8px",
    },
    resetButton: {
      padding: "6px 14px",
      background: "linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)",
      border: "1px solid #404040",
      borderRadius: "6px",
      color: "#999",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600",
      transition: "all 0.2s",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    filterPresets: {
      display: "flex",
      gap: "8px",
    },
    filterPresetButton: {
      flex: 1,
      padding: "10px 12px",
      background: "linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)",
      border: "1px solid #404040",
      borderRadius: "8px",
      color: "#e5e5e5",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "600",
      transition: "all 0.2s",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    filterPresetActive: {
      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      borderColor: "#f59e0b",
      color: "white",
      boxShadow: "0 4px 12px rgba(245,158,11,0.4)",
    },
    positionGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px",
    },
    positionButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      padding: "12px 10px",
      background: "linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)",
      border: "1px solid #404040",
      borderRadius: "8px",
      color: "#e5e5e5",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600",
      transition: "all 0.2s",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    positionButtonActive: {
      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      borderColor: "#3b82f6",
      color: "white",
      boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
    },
    replaceVideoButton: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "14px 12px",
      background: "linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)",
      border: "1px solid #404040",
      borderRadius: "8px",
      color: "#e5e5e5",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      marginTop: "16px",
      transition: "all 0.2s",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    deleteVideoButton: {
      width: "48px",
      height: "48px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
      border: "none",
      borderRadius: "8px",
      color: "white",
      cursor: "pointer",
      marginTop: "12px",
      marginLeft: "auto",
      transition: "all 0.2s",
      boxShadow: "0 4px 12px rgba(220,38,38,0.4)",
    },
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const showEditPanel = selectedTextLayer !== null || selectedImageLayer !== null || selectedAudioLayer !== null || selectedVideoLayer !== null;
  const isPanelOpen = activeTab !== null;

  const getFilteredLayers = () => {
    const editableLayers = layers.filter(l => !(isImageLayer(l) && l.isBackground));
    
    if (activeTab === "text") {
      return editableLayers.filter(l => l.type === "text");
    } else if (activeTab === "media") {
      return editableLayers.filter(l => l.type === "image");
    } else if (activeTab === "audio") {
      return editableLayers.filter(l => l.type === "audio");
    } else if (activeTab === "video") {
      return editableLayers.filter(l => l.type === "video");
    }
    return editableLayers;
  };

  const filteredLayers = getFilteredLayers();

  return (
    <>
      <style>{`
        /* Custom Scrollbar Styling */
        .video-edit-panel::-webkit-scrollbar {
          width: 8px;
        }
        
        .video-edit-panel::-webkit-scrollbar-track {
          background: #0a0a0a;
          border-radius: 4px;
        }
        
        .video-edit-panel::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 4px;
          transition: all 0.3s;
        }
        
        .video-edit-panel::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
        }
        
        /* Firefox Scrollbar */
        .video-edit-panel {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 #0a0a0a;
        }
        
        /* Smooth transitions for all buttons */
        button {
          transition: all 0.2s ease;
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        
        button:active:not(:disabled) {
          transform: translateY(0px);
        }
        
        /* Input range styling */
        input[type="range"] {
          cursor: pointer;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          transition: all 0.2s;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
      <div style={styles.container}>
      {isLoading && <LoadingOverlay message="Loading project..." />}

      <SaveProjectModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={saveNewProject}
      />

      {showExportModal && (
        <ExportModal
          showExport={showExportModal}
          setShowExport={setShowExportModal}
          isExporting={isExporting}
          exportUrl={exportUrl}
          onExport={handleExport}
        />
      )}

{/* AI Tool Modals ✨ */}
<VoiceoverModal
  isOpen={showVoiceoverModal}
  onClose={() => setShowVoiceoverModal(false)}
  onGenerate={handleVoiceoverGenerate}
/>

<RedditPostModal
  isOpen={showRedditModal}
  onClose={() => setShowRedditModal(false)}
  onGenerate={handleRedditPostGenerate}
/>

<MagicCropModal
  isOpen={showMagicCropModal}
  onClose={() => setShowMagicCropModal(false)}
  onApply={handleMagicCropApply}
  selectedLayerId={selectedLayerId}
/>

<EmojiPickerModal
  isOpen={showEmojiPickerModal}
  onClose={() => setShowEmojiPickerModal(false)}
  onSelect={handleEmojiSelect}
/>

<RemixShortsModal
  isOpen={showRemixShortsModal}
  onClose={() => setShowRemixShortsModal(false)}
  onGenerate={handleRemixGenerate}
/>

{/* NEW AI TOOL MODALS ✨ */}
<AIImageModal
  isOpen={showAIImageModal}
  onClose={() => setShowAIImageModal(false)}
  onGenerate={handleAIImageGenerate}
/>

<RemoveBackgroundModal
  isOpen={showRemoveBackgroundModal}
  onClose={() => setShowRemoveBackgroundModal(false)}
  onProcess={handleRemoveBackground}
  selectedLayerId={selectedLayerId}
/>

<EnhanceSpeechModal
  isOpen={showEnhanceSpeechModal}
  onClose={() => setShowEnhanceSpeechModal(false)}
  onEnhance={handleEnhanceSpeech}
  selectedLayerId={selectedLayerId}
/>

<YoutubeDownloaderModal
  isOpen={showYoutubeDownloaderModal}
  onClose={() => setShowYoutubeDownloaderModal(false)}
  onDownload={handleYoutubeDownload}
/>

<VEOGeneratorModal
  isOpen={showVEOGeneratorModal}
  onClose={() => setShowVEOGeneratorModal(false)}
  onGenerate={handleVEOGenerate}
/>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        onChange={handleAudioUpload}
        style={{ display: "none" }}
      />
      
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        style={{ display: "none" }}
      />

      {/* Left Sidebar */}
      <div style={styles.leftSidebar}>
        <button
          style={{
            ...styles.sidebarButton,
            ...(activeTab === "layers" ? styles.sidebarButtonActive : {}),
          }}
          onClick={() => handleTabClick("layers")}
          onMouseOver={(e) => {
            if (activeTab !== "layers") {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "#888";
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== "layers") {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#666";
            }
          }}
        >
          <Icons.Layers />
          <span>Layers</span>
        </button>
        <button
          style={{
            ...styles.sidebarButton,
            ...(activeTab === "text" ? styles.sidebarButtonActive : {}),
          }}
          onClick={() => handleTabClick("text")}
          onMouseOver={(e) => {
            if (activeTab !== "text") {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "#888";
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== "text") {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#666";
            }
          }}
        >
          <EditorIcons.Type />
          <span>Text</span>
        </button>
        <button
          style={{
            ...styles.sidebarButton,
            ...(activeTab === "media" ? styles.sidebarButtonActive : {}),
          }}
          onClick={() => handleTabClick("media")}
          onMouseOver={(e) => {
            if (activeTab !== "media") {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "#888";
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== "media") {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#666";
            }
          }}
        >
          <EditorIcons.Image />
          <span>Media</span>
        </button>
        <button
          style={{
            ...styles.sidebarButton,
            ...(activeTab === "audio" ? styles.sidebarButtonActive : {}),
          }}
          onClick={() => handleTabClick("audio")}
          onMouseOver={(e) => {
            if (activeTab !== "audio") {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "#888";
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== "audio") {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#666";
            }
          }}
        >
          <Icons.Music />
          <span>Audio</span>
        </button>
        <button
          style={{
            ...styles.sidebarButton,
            ...(activeTab === "video" ? styles.sidebarButtonActive : {}),
          }}
          onClick={() => handleTabClick("video")}
          onMouseOver={(e) => {
            if (activeTab !== "video") {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "#888";
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== "video") {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#666";
            }
          }}
        >
          <EditorIcons.Video />
          <span>Video</span>
        </button>
        <button
          style={{
            ...styles.sidebarButton,
            ...(activeTab === "tools" ? styles.sidebarButtonActive : {}),
          }}
          onClick={() => handleTabClick("tools")}
          onMouseOver={(e) => {
            if (activeTab !== "tools") {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "#888";
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== "tools") {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#666";
            }
          }}
        >
          <Icons.Tools />
          <span>Tools</span>
        </button>
      </div>

      {/* Layers Panel */}
      <div style={{
        ...styles.layersPanel,
        ...(isPanelOpen ? {} : styles.layersPanelClosed),
      }}>
        {isPanelOpen && (
          <>
            <div style={styles.layersPanelHeader}>
              <span style={styles.layersPanelTitle}>
                {activeTab === "layers" 
                  ? "Layers" 
                  : activeTab === "text" 
                  ? "Text Layers" 
                  : activeTab === "audio" 
                  ? "Audio" 
                  : activeTab === "video"
                  ? "Video"
                  : activeTab === "tools"
                  ? "AI Tools"
                  : "Media"}
              </span>
              <div style={styles.headerButtons}>
                {activeTab !== "tools" && (
                  <button
                    style={styles.addLayerButton}
                    onClick={
                      activeTab === "media" 
                        ? addImageLayer 
                        : activeTab === "audio" 
                        ? addAudioLayer 
                        : activeTab === "video"
                        ? addVideoLayer
                        : addTextLayer
                    }
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
                      e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
                      e.currentTarget.style.color = "#3b82f6";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.color = "#888";
                    }}
                    title={
                      activeTab === "media" 
                        ? "Add Image" 
                        : activeTab === "audio" 
                        ? "Add Audio" 
                        : activeTab === "video"
                        ? "Add Video"
                        : "Add Text"
                    }
                  >
                    <Icons.Plus />
                  </button>
                )}
                <button
                  style={styles.closeButton}
                  onClick={() => setActiveTab(null)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "#888";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#666";
                  }}
                  title="Close panel"
                >
                  <Icons.Close />
                </button>
              </div>
            </div>

{/* Tools Panel Content */}
{activeTab === "tools" ? (
  <div style={styles.toolsContainer}>
    {/* AI Generation Tools */}
    <div
      style={styles.toolItem}
      onClick={() => setShowAIImageModal(true)}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div style={{ ...styles.toolIcon, color: "#ec4899" }}>
        <Icons.Image />
      </div>
      <div style={styles.toolInfo}>
        <div style={styles.toolName}>AI Image Generator</div>
        <div style={styles.toolDescription}>Create images from text prompts</div>
      </div>
    </div>

    <div
      style={styles.toolItem}
      onClick={() => setShowVEOGeneratorModal(true)}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div style={{ ...styles.toolIcon, color: "#a855f7" }}>
        <Icons.Video />
      </div>
      <div style={styles.toolInfo}>
        <div style={styles.toolName}>VEO# Generator</div>
        <div style={styles.toolDescription}>Generate videos with Google VEO AI</div>
      </div>
    </div>

    <div
      style={styles.toolItem}
      onClick={() => setShowVoiceoverModal(true)}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div style={{ ...styles.toolIcon, color: "#8b5cf6" }}>
        <Icons.Mic />
      </div>
      <div style={styles.toolInfo}>
        <div style={styles.toolName}>AI Voiceover</div>
        <div style={styles.toolDescription}>Generate AI voiceovers with multiple voices</div>
      </div>
    </div>

    <div
      style={styles.toolItem}
      onClick={() => setShowRedditModal(true)}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div style={{ ...styles.toolIcon, color: "#ff4500" }}>
        <Icons.Reddit />
      </div>
      <div style={styles.toolInfo}>
        <div style={styles.toolName}>Reddit Post Generator</div>
        <div style={styles.toolDescription}>Generate Reddit post screenshots</div>
      </div>
    </div>

    {/* Enhancement Tools */}
    <div
      style={styles.toolItem}
      onClick={() => setShowRemoveBackgroundModal(true)}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div style={{ ...styles.toolIcon, color: "#06b6d4" }}>
        <Icons.Eraser />
      </div>
      <div style={styles.toolInfo}>
        <div style={styles.toolName}>Remove Background</div>
        <div style={styles.toolDescription}>AI-powered background removal</div>
      </div>
    </div>

    <div
      style={styles.toolItem}
      onClick={() => setShowEnhanceSpeechModal(true)}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div style={{ ...styles.toolIcon, color: "#14b8a6" }}>
        <Icons.Waveform />
      </div>
      <div style={styles.toolInfo}>
        <div style={styles.toolName}>Enhance Speech</div>
        <div style={styles.toolDescription}>Remove noise and improve audio clarity</div>
      </div>
    </div>

    <div
      style={styles.toolItem}
      onClick={() => setShowMagicCropModal(true)}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div style={{ ...styles.toolIcon, color: "#10b981" }}>
        <Icons.Crop />
      </div>
      <div style={styles.toolInfo}>
        <div style={styles.toolName}>Magic Crop</div>
        <div style={styles.toolDescription}>Smart cropping & auto-zoom</div>
      </div>
    </div>

    {/* Utility Tools */}
    <div
      style={styles.toolItem}
      onClick={() => setShowYoutubeDownloaderModal(true)}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div style={{ ...styles.toolIcon, color: "#ef4444" }}>
        <Icons.Download />
      </div>
      <div style={styles.toolInfo}>
        <div style={styles.toolName}>YouTube Downloader</div>
        <div style={styles.toolDescription}>Download videos from YouTube</div>
      </div>
    </div>

    <div
      style={styles.toolItem}
      onClick={() => setShowEmojiPickerModal(true)}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div style={{ ...styles.toolIcon, color: "#f59e0b" }}>
        <Icons.Smile />
      </div>
      <div style={styles.toolInfo}>
        <div style={styles.toolName}>Emoji Picker</div>
        <div style={styles.toolDescription}>Add emojis with smart search</div>
      </div>
    </div>

    <div
      style={styles.toolItem}
      onClick={() => setShowRemixShortsModal(true)}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div style={{ ...styles.toolIcon, color: "#3b82f6" }}>
        <Icons.Shuffle />
      </div>
      <div style={styles.toolInfo}>
        <div style={styles.toolName}>Remix Shorts</div>
        <div style={styles.toolDescription}>Create viral short videos with AI</div>
      </div>
    </div>
  </div>
) : activeTab === "video" && !selectedLayerId ? (
              /* Video Library - When video tab is active and no layer selected */
              <div style={styles.videoLibraryContainer}>
                {/* Header Buttons */}
                <div style={styles.videoLibraryHeader}>
                  <button
                    style={styles.viewAssetsButton}
                    onClick={() => {
                      toast.info("View Assets - Coming soon");
                    }}
                  >
                    <EditorIcons.Image />
                    View Assets
                  </button>
                  <button
                    style={styles.uploadFileButton}
                    onClick={addVideoLayer}
                  >
                    <EditorIcons.Upload />
                    Upload a File
                  </button>
                </div>

                {/* Background Videos Section */}
                <div style={styles.videoSection}>
                  <div style={styles.videoSectionHeader}>
                    <h3 style={styles.videoSectionTitle}>Background Videos</h3>
                    <button
                      style={styles.viewMoreLink}
                      onClick={() => toast.info("View more - Coming soon")}
                    >
                      View more
                    </button>
                  </div>
                  <div style={styles.videoGridVertical}>
                    {CLOUDINARY_VIDEOS.backgroundVideos.map((video) => (
                      <div
                        key={video.id}
                        style={styles.videoCardVertical}
                        onClick={() => {
                          const newLayer: VideoLayer = {
                            id: generateId(),
                            type: "video",
                            name: video.name,
                            visible: true,
                            locked: false,
                            startFrame: currentFrame,
                            endFrame: Math.min(currentFrame + 150, totalFrames),
                            position: { x: 50, y: 50 },
                            size: { width: 60, height: 45 },
                            rotation: 0,
                            opacity: 1,
                            src: video.url,
                            volume: 0.8,
                            loop: false,
                            playbackRate: 1,
                            objectFit: "contain",
                            filter: "",
                            fadeIn: 0,
                            fadeOut: 0,
                            animation: {
                              entrance: "fade",
                              entranceDuration: 30,
                            },
                          };
                          pushState([newLayer, ...layers]);
                          setSelectedLayerId(newLayer.id);
                          toast.success(`Added ${video.name}`);
                        }}
                      >
                        <div style={styles.videoThumbnailVertical}>
                          <img
                            src={video.thumbnail}
                            alt={video.name}
                            style={styles.videoThumbnailImage}
                          />
                          <div style={styles.videoDurationBadge}>{video.duration}</div>
                        </div>
                        <div style={styles.videoNameText}>{video.name}</div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue="0"
                          style={styles.videoProgressSlider}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Effects Section */}
                <div style={styles.videoSection}>
                  <div style={styles.videoSectionHeader}>
                    <h3 style={styles.videoSectionTitle}>Visual Effects</h3>
                    <button
                      style={styles.viewMoreLink}
                      onClick={() => toast.info("View more - Coming soon")}
                    >
                      View more
                    </button>
                  </div>
                  <div style={styles.videoGridVertical}>
                    {CLOUDINARY_VIDEOS.visualEffects.map((video) => (
                      <div
                        key={video.id}
                        style={styles.videoCardVertical}
                        onClick={() => {
                          const newLayer: VideoLayer = {
                            id: generateId(),
                            type: "video",
                            name: video.name,
                            visible: true,
                            locked: false,
                            startFrame: currentFrame,
                            endFrame: Math.min(currentFrame + 90, totalFrames),
                            position: { x: 50, y: 50 },
                            size: { width: 50, height: 40 },
                            rotation: 0,
                            opacity: 1,
                            src: video.url,
                            volume: 0.5,
                            loop: false,
                            playbackRate: 1,
                            objectFit: "contain",
                            filter: "",
                            fadeIn: 0,
                            fadeOut: 0,
                            animation: {
                              entrance: "fade",
                              entranceDuration: 20,
                            },
                          };
                          pushState([newLayer, ...layers]);
                          setSelectedLayerId(newLayer.id);
                          toast.success(`Added ${video.name}`);
                        }}
                      >
                        <div style={styles.videoThumbnailVertical}>
                          <img
                            src={video.thumbnail}
                            alt={video.name}
                            style={styles.videoThumbnailImage}
                          />
                          <div style={styles.videoDurationBadge}>{video.duration}</div>
                        </div>
                        <div style={styles.videoNameText}>{video.name}</div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue="0"
                          style={styles.videoProgressSlider}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Regular layers list for all other tabs
              <div style={styles.layersList}>
              {filteredLayers.map((layer) => (
                <div
                  key={layer.id}
                  style={{
                    ...styles.layerItem,
                    ...(selectedLayerId === layer.id ? styles.layerItemActive : {}),
                  }}
                  onClick={() => setSelectedLayerId(layer.id)}
                  onMouseOver={(e) => {
                    if (selectedLayerId !== layer.id) {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedLayerId !== layer.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <div
                    style={{
                      ...styles.layerIcon,
                      backgroundColor: layer.type === "text" 
                        ? "rgba(59, 130, 246, 0.2)" 
                        : layer.type === "audio"
                        ? "rgba(245, 158, 11, 0.2)"
                        : "rgba(16, 185, 129, 0.2)",
                      color: layer.type === "text" ? "#3b82f6" : layer.type === "audio" ? "#f59e0b" : "#10b981",
                    }}
                  >
                    {layer.type === "text" ? (
                      <EditorIcons.Type />
                    ) : layer.type === "audio" ? (
                      <Icons.Music />
                    ) : layer.type === "video" ? (
                      <EditorIcons.Video />
                    ) : (
                      <EditorIcons.Image />
                    )}
                  </div>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={styles.layerName}>{layer.name}</div>
                    <div style={styles.layerType}>
                      {layer.type === "text" 
                        ? (layer as TextLayer).content.substring(0, 20) + ((layer as TextLayer).content.length > 20 ? "..." : "")
                        : layer.type === "audio"
                        ? "Audio"
                        : "Image"
                      }
                    </div>
                  </div>
                </div>
              ))}
              {filteredLayers.length === 0 && (
                <div style={{ 
                  padding: "20px", 
                  textAlign: "center", 
                  color: "#666",
                  fontSize: "12px" 
                }}>
                  No {activeTab === "text" ? "text" : activeTab === "media" ? "media" : activeTab === "audio" ? "audio" : ""} layers yet.
                  <br />
                  Click + to add one.
                </div>
              )}
            </div>
            )}
          </>
        )}
      </div>

      {/* Edit Panel */}
      <div
        style={{
          ...styles.editPanel,
          ...(showEditPanel ? {} : styles.editPanelHidden),
        }}
      >
        {showEditPanel && selectedTextLayer && (
          <>
            <div style={styles.editPanelHeader}>
              <button
                style={styles.backButton}
                onClick={() => setSelectedLayerId(null)}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <Icons.ChevronLeft />
              </button>
              <span style={styles.editPanelTitle}>Edit Text</span>
            </div>

            <div style={styles.editPanelContent}>
              <textarea
                style={styles.textInput}
                value={selectedTextLayer.content}
                onChange={(e) => updateLayer(selectedLayerId!, { content: e.target.value })}
                placeholder="Enter text..."
              />

              <div style={styles.styleSection}>
                <span style={styles.styleLabel}>Style</span>

                <select
                  style={styles.fontSelect}
                  value={selectedTextLayer.fontFamily}
                  onChange={(e) => updateLayer(selectedLayerId!, { fontFamily: e.target.value })}
                >
                  {FONTS.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>

                <div style={styles.weightSizeRow}>
                  <select
                    style={styles.weightSelect}
                    value={selectedTextLayer.fontWeight}
                    onChange={(e) => updateLayer(selectedLayerId!, { fontWeight: e.target.value })}
                  >
                    {FONT_WEIGHTS.map((w) => (
                      <option key={w.value} value={w.value}>
                        {w.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    style={styles.sizeInput}
                    value={Math.round(selectedTextLayer.fontSize * 20)}
                    onChange={(e) => updateLayer(selectedLayerId!, { fontSize: Number(e.target.value) / 20 })}
                    min="10"
                    max="200"
                  />
                  <div
                    style={{
                      ...styles.colorCircle,
                      backgroundColor: selectedTextLayer.fontColor,
                    }}
                  >
                    <input
                      type="color"
                      style={styles.colorInput}
                      value={selectedTextLayer.fontColor}
                      onChange={(e) => updateLayer(selectedLayerId!, { fontColor: e.target.value })}
                    />
                  </div>
                </div>

                <div style={styles.styleButtonsRow}>
                  <button
                    style={{
                      ...styles.styleButton,
                      ...(selectedTextLayer.fontStyle === "italic" ? styles.styleButtonActive : {}),
                    }}
                    onClick={() =>
                      updateLayer(selectedLayerId!, {
                        fontStyle: selectedTextLayer.fontStyle === "italic" ? "normal" : "italic",
                      })
                    }
                    title="Italic"
                  >
                    <span style={{ fontStyle: "italic", fontWeight: "bold" }}>I</span>
                  </button>
                  <button
                    style={{
                      ...styles.styleButton,
                      ...(selectedTextLayer.fontWeight === "bold" || selectedTextLayer.fontWeight === "600" ? styles.styleButtonActive : {}),
                    }}
                    onClick={() =>
                      updateLayer(selectedLayerId!, {
                        fontWeight: selectedTextLayer.fontWeight === "bold" ? "normal" : "bold",
                      })
                    }
                    title="Bold"
                  >
                    <span style={{ fontWeight: "bold" }}>B</span>
                  </button>
                  <button style={styles.styleButton} title="Underline">
                    <Icons.Underline />
                  </button>
                  <button style={styles.styleButton} title="Strikethrough">
                    <Icons.Strikethrough />
                  </button>
                  <button
                    style={{
                      ...styles.styleButton,
                      ...(selectedTextLayer.textTransform === "uppercase" ? styles.styleButtonActive : {}),
                    }}
                    onClick={() =>
                      updateLayer(selectedLayerId!, {
                        textTransform: selectedTextLayer.textTransform === "uppercase" ? "none" : "uppercase",
                      })
                    }
                    title="All Caps"
                  >
                    <Icons.AllCaps />
                  </button>
                  <button style={styles.styleButton} title="Letter Spacing">
                    <Icons.Spacing />
                  </button>
                </div>
              </div>

              <div style={styles.styleSection}>
                <span style={styles.styleLabel}>Opacity</span>
                <div style={styles.sliderRow}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedTextLayer.opacity * 100}
                    onChange={(e) => updateLayer(selectedLayerId!, { opacity: Number(e.target.value) / 100 })}
                    style={styles.slider}
                  />
                  <input
                    type="number"
                    style={styles.sliderValue}
                    value={Math.round(selectedTextLayer.opacity * 100)}
                    onChange={(e) => updateLayer(selectedLayerId!, { opacity: Number(e.target.value) / 100 })}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div style={styles.styleSection}>
                <div style={styles.toggleRow}>
                  <span style={styles.toggleLabel}>Text Outline</span>
                  <button
                    style={{
                      ...styles.toggle,
                      ...((selectedTextLayer as any).textOutline ? styles.toggleActive : {}),
                    }}
                    onClick={() => updateLayer(selectedLayerId!, { textOutline: !(selectedTextLayer as any).textOutline } as any)}
                  >
                    <div
                      style={{
                        ...styles.toggleKnob,
                        ...((selectedTextLayer as any).textOutline ? styles.toggleKnobActive : {}),
                      }}
                    />
                  </button>
                </div>
                {(selectedTextLayer as any).textOutline && (
                  <div style={styles.colorRow}>
                    <span style={{ fontSize: "12px", color: "#666", width: "50px" }}>Color</span>
                    <div
                      style={{
                        ...styles.colorCircle,
                        backgroundColor: (selectedTextLayer as any).outlineColor || "#000000",
                      }}
                    >
                      <input
                        type="color"
                        style={styles.colorInput}
                        value={(selectedTextLayer as any).outlineColor || "#000000"}
                        onChange={(e) => updateLayer(selectedLayerId!, { outlineColor: e.target.value } as any)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div style={styles.styleSection}>
                <div style={styles.toggleRow}>
                  <span style={styles.toggleLabel}>Text Shadow</span>
                  <button
                    style={{
                      ...styles.toggle,
                      ...((selectedTextLayer as any).textShadow ? styles.toggleActive : {}),
                    }}
                    onClick={() => updateLayer(selectedLayerId!, { textShadow: !(selectedTextLayer as any).textShadow } as any)}
                  >
                    <div
                      style={{
                        ...styles.toggleKnob,
                        ...((selectedTextLayer as any).textShadow ? styles.toggleKnobActive : {}),
                      }}
                    />
                  </button>
                </div>
                {(selectedTextLayer as any).textShadow && (
                  <>
                    <div style={styles.colorRow}>
                      <span style={{ fontSize: "12px", color: "#666", width: "50px" }}>Color</span>
                      <div
                        style={{
                          ...styles.colorCircle,
                          backgroundColor: (selectedTextLayer as any).shadowColor || "#000000",
                        }}
                      >
                        <input
                          type="color"
                          style={styles.colorInput}
                          value={(selectedTextLayer as any).shadowColor || "#000000"}
                          onChange={(e) => updateLayer(selectedLayerId!, { shadowColor: e.target.value } as any)}
                        />
                      </div>
                    </div>
                    <div style={styles.sliderRow}>
                      <span style={styles.sliderLabel}>X</span>
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        value={(selectedTextLayer as any).shadowX || 0}
                        onChange={(e) => updateLayer(selectedLayerId!, { shadowX: Number(e.target.value) } as any)}
                        style={styles.slider}
                      />
                      <input
                        type="number"
                        style={styles.sliderValue}
                        value={(selectedTextLayer as any).shadowX || 0}
                        onChange={(e) => updateLayer(selectedLayerId!, { shadowX: Number(e.target.value) } as any)}
                      />
                    </div>
                    <div style={styles.sliderRow}>
                      <span style={styles.sliderLabel}>Y</span>
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        value={(selectedTextLayer as any).shadowY || 0}
                        onChange={(e) => updateLayer(selectedLayerId!, { shadowY: Number(e.target.value) } as any)}
                        style={styles.slider}
                      />
                      <input
                        type="number"
                        style={styles.sliderValue}
                        value={(selectedTextLayer as any).shadowY || 0}
                        onChange={(e) => updateLayer(selectedLayerId!, { shadowY: Number(e.target.value) } as any)}
                      />
                    </div>
                    <div style={styles.sliderRow}>
                      <span style={styles.sliderLabel}>Blur</span>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={(selectedTextLayer as any).shadowBlur || 0}
                        onChange={(e) => updateLayer(selectedLayerId!, { shadowBlur: Number(e.target.value) } as any)}
                        style={styles.slider}
                      />
                      <input
                        type="number"
                        style={styles.sliderValue}
                        value={(selectedTextLayer as any).shadowBlur || 0}
                        onChange={(e) => updateLayer(selectedLayerId!, { shadowBlur: Number(e.target.value) } as any)}
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                style={styles.deleteButton}
                onClick={() => deleteLayer(selectedLayerId!)}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
                  e.currentTarget.style.color = "#ef4444";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "#888";
                }}
              >
                Delete Text
              </button>
            </div>
          </>
        )}

        {showEditPanel && selectedImageLayer && (
          <>
            <div style={styles.editPanelHeader}>
              <button
                style={styles.backButton}
                onClick={() => setSelectedLayerId(null)}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <Icons.ChevronLeft />
              </button>
              <span style={styles.editPanelTitle}>Edit Image</span>
            </div>
            <div style={styles.editPanelContent}>
              <div style={{
                width: "100%",
                height: "120px",
                backgroundColor: "#1a1a1a",
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <img 
                  src={selectedImageLayer.src} 
                  alt="Layer preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              <div style={styles.styleSection}>
                <span style={styles.styleLabel}>Opacity</span>
                <div style={styles.sliderRow}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedImageLayer.opacity * 100}
                    onChange={(e) => updateLayer(selectedLayerId!, { opacity: Number(e.target.value) / 100 })}
                    style={styles.slider}
                  />
                  <input
                    type="number"
                    style={styles.sliderValue}
                    value={Math.round(selectedImageLayer.opacity * 100)}
                    onChange={(e) => updateLayer(selectedLayerId!, { opacity: Number(e.target.value) / 100 })}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div style={styles.styleSection}>
                <span style={styles.styleLabel}>Fit Mode</span>
                <select
                  style={styles.fontSelect}
                  value={selectedImageLayer.objectFit || "contain"}
                  onChange={(e) => updateLayer(selectedLayerId!, { objectFit: e.target.value as "cover" | "contain" | "fill" })}
                >
                  <option value="contain">Contain</option>
                  <option value="cover">Cover</option>
                  <option value="fill">Fill</option>
                </select>
              </div>

              <button
                style={styles.deleteButton}
                onClick={() => deleteLayer(selectedLayerId!)}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
                  e.currentTarget.style.color = "#ef4444";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "#888";
                }}
              >
                Delete Image
              </button>
            </div>
          </>
        )}

        {/* Audio Edit Panel */}
        {showEditPanel && selectedAudioLayer && (
          <>
            <div style={styles.editPanelHeader}>
              <button
                style={styles.backButton}
                onClick={() => setSelectedLayerId(null)}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <Icons.ChevronLeft />
              </button>
              <span style={styles.editPanelTitle}>Edit Audio</span>
            </div>
            <div style={styles.editPanelContent}>
              {/* Audio Info */}
              <div style={{
                padding: "16px",
                backgroundColor: "#1a1a1a",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "rgba(245, 158, 11, 0.2)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#f59e0b",
                }}>
                  <Icons.Music />
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#e5e5e5", marginBottom: "4px" }}>
                    {selectedAudioLayer.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#666" }}>
                    Audio Track
                  </div>
                </div>
              </div>

              {/* Volume */}
              <div style={styles.styleSection}>
                <span style={styles.styleLabel}>Volume</span>
                <div style={styles.sliderRow}>
                  <Icons.Volume />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(selectedAudioLayer as AudioLayer).volume * 100}
                    onChange={(e) => updateLayer(selectedLayerId!, { volume: Number(e.target.value) / 100 })}
                    style={styles.slider}
                  />
                  <input
                    type="number"
                    style={styles.sliderValue}
                    value={Math.round((selectedAudioLayer as AudioLayer).volume * 100)}
                    onChange={(e) => updateLayer(selectedLayerId!, { volume: Number(e.target.value) / 100 })}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {/* Fade In */}
              <div style={styles.styleSection}>
                <span style={styles.styleLabel}>Fade In (frames)</span>
                <div style={styles.sliderRow}>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={(selectedAudioLayer as AudioLayer).fadeIn || 0}
                    onChange={(e) => updateLayer(selectedLayerId!, { fadeIn: Number(e.target.value) })}
                    style={styles.slider}
                  />
                  <input
                    type="number"
                    style={styles.sliderValue}
                    value={(selectedAudioLayer as AudioLayer).fadeIn || 0}
                    onChange={(e) => updateLayer(selectedLayerId!, { fadeIn: Number(e.target.value) })}
                    min="0"
                    max="60"
                  />
                </div>
              </div>

              {/* Fade Out */}
              <div style={styles.styleSection}>
                <span style={styles.styleLabel}>Fade Out (frames)</span>
                <div style={styles.sliderRow}>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={(selectedAudioLayer as AudioLayer).fadeOut || 0}
                    onChange={(e) => updateLayer(selectedLayerId!, { fadeOut: Number(e.target.value) })}
                    style={styles.slider}
                  />
                  <input
                    type="number"
                    style={styles.sliderValue}
                    value={(selectedAudioLayer as AudioLayer).fadeOut || 0}
                    onChange={(e) => updateLayer(selectedLayerId!, { fadeOut: Number(e.target.value) })}
                    min="0"
                    max="60"
                  />
                </div>
              </div>

              {/* Loop Toggle */}
              <div style={styles.styleSection}>
                <div style={styles.toggleRow}>
                  <span style={styles.toggleLabel}>Loop Audio</span>
                  <button
                    style={{
                      ...styles.toggle,
                      ...((selectedAudioLayer as AudioLayer).loop ? styles.toggleActive : {}),
                    }}
                    onClick={() => updateLayer(selectedLayerId!, { loop: !(selectedAudioLayer as AudioLayer).loop })}
                  >
                    <div
                      style={{
                        ...styles.toggleKnob,
                        ...((selectedAudioLayer as AudioLayer).loop ? styles.toggleKnobActive : {}),
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* Delete Button */}
              <button
                style={styles.deleteButton}
                onClick={() => deleteLayer(selectedLayerId!)}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
                  e.currentTarget.style.color = "#ef4444";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "#888";
                }}
              >
                Delete Audio
              </button>
            </div>
          </>
        )}

        {/* Video Edit Panel */}
        {showEditPanel && selectedVideoLayer && (
          <>
            <div style={styles.editPanelHeader}>
              <button
                style={styles.backButton}
                onClick={() => setSelectedLayerId(null)}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <Icons.ChevronLeft />
              </button>
              <span style={styles.editPanelTitle}>Edit video</span>
            </div>

            <div style={styles.editPanelContent} className="video-edit-panel">
              {/* Duration Slider */}
              <div style={styles.propertyGroup}>
                <div style={styles.propertyRow}>
                  <span style={styles.propertyLabel}>Duration</span>
                  <span style={styles.propertyValue}>
                    {Math.round((selectedVideoLayer.endFrame - selectedVideoLayer.startFrame) / FPS)}s
                  </span>
                </div>
                <input
                  type="range"
                  min={selectedVideoLayer.startFrame}
                  max={totalFrames}
                  style={styles.slider}
                  value={selectedVideoLayer.endFrame}
                  onChange={(e) =>
                    updateLayer(selectedVideoLayer.id, { endFrame: parseInt(e.target.value) })
                  }
                />
              </div>

              {/* Speed Controls */}
              <div style={styles.propertyGroup}>
                <div style={styles.speedButtons}>
                  {[0.5, 1, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      style={{
                        ...styles.speedButton,
                        ...(selectedVideoLayer.playbackRate === speed ? styles.speedButtonActive : {}),
                      }}
                      onClick={() => updateLayer(selectedVideoLayer.id, { playbackRate: speed })}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Crop Video Checkbox */}
              <div style={styles.propertyGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedVideoLayer.objectFit === "cover"}
                    onChange={(e) =>
                      updateLayer(selectedVideoLayer.id, {
                        objectFit: e.target.checked ? "cover" : "contain",
                      })
                    }
                  />
                  <span>Crop Video</span>
                </label>
              </div>

              {/* Rotation */}
              <div style={styles.propertyGroup}>
                <div style={styles.propertyRow}>
                  <label style={styles.propertyLabel}>
                    <EditorIcons.Move />
                    Rotation
                  </label>
                  <div style={styles.rotationControls}>
                    <input
                      type="number"
                      style={styles.rotationInput}
                      value={selectedVideoLayer.rotation}
                      onChange={(e) =>
                        updateLayer(selectedVideoLayer.id, { rotation: parseInt(e.target.value) || 0 })
                      }
                    />
                    <span style={styles.degreeSymbol}>°</span>
                    <button
                      style={styles.flipButton}
                      onClick={() =>
                        updateLayer(selectedVideoLayer.id, {
                          rotation: (selectedVideoLayer.rotation + 90) % 360,
                        })
                      }
                      title="Rotate 90°"
                    >
                      ↻
                    </button>
                    <button
                      style={styles.flipButton}
                      onClick={() =>
                        updateLayer(selectedVideoLayer.id, {
                          rotation: selectedVideoLayer.rotation === 0 ? 180 : 0,
                        })
                      }
                      title="Flip"
                    >
                      ⇄
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  style={styles.slider}
                  value={selectedVideoLayer.rotation}
                  onChange={(e) =>
                    updateLayer(selectedVideoLayer.id, { rotation: parseInt(e.target.value) })
                  }
                />
              </div>

              {/* Volume */}
              <div style={styles.propertyGroup}>
                <div style={styles.propertyRow}>
                  <label style={styles.propertyLabel}>
                    <EditorIcons.Volume />
                    Volume
                  </label>
                  <span style={styles.propertyValue}>
                    {Math.round(selectedVideoLayer.volume * 100)} %
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  style={styles.slider}
                  value={selectedVideoLayer.volume}
                  onChange={(e) =>
                    updateLayer(selectedVideoLayer.id, { volume: parseFloat(e.target.value) })
                  }
                />
              </div>

              {/* Fade In */}
              <div style={styles.propertyGroup}>
                <div style={styles.propertyRow}>
                  <label style={styles.propertyLabel}>Fade In</label>
                  <span style={styles.propertyValue}>{selectedVideoLayer.fadeIn || 0} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  style={styles.slider}
                  value={selectedVideoLayer.fadeIn || 0}
                  onChange={(e) =>
                    updateLayer(selectedVideoLayer.id, { fadeIn: parseInt(e.target.value) })
                  }
                />
              </div>

              {/* Fade Out */}
              <div style={styles.propertyGroup}>
                <div style={styles.propertyRow}>
                  <label style={styles.propertyLabel}>Fade Out</label>
                  <span style={styles.propertyValue}>
                    {Math.round((selectedVideoLayer.fadeOut || 0) * 100)} %
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  style={styles.slider}
                  value={selectedVideoLayer.fadeOut || 0}
                  onChange={(e) =>
                    updateLayer(selectedVideoLayer.id, { fadeOut: parseInt(e.target.value) })
                  }
                />
              </div>

              {/* Saturation */}
              <div style={styles.propertyGroup}>
                <div style={styles.propertyRow}>
                  <label style={styles.propertyLabel}>Saturation</label>
                  <div style={styles.resetButtons}>
                    <button
                      style={styles.resetButton}
                      onClick={() => updateLayer(selectedVideoLayer.id, { filter: "" })}
                    >
                      Reset
                    </button>
                    <button
                      style={styles.resetButton}
                      onClick={() =>
                        updateLayer(selectedVideoLayer.id, {
                          filter: "",
                          opacity: 1,
                          playbackRate: 1,
                        })
                      }
                    >
                      Reset All
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  style={styles.slider}
                  value={
                    selectedVideoLayer.filter?.includes("saturate")
                      ? parseInt(selectedVideoLayer.filter.match(/saturate\((\d+)\)/)?.[1] || "100")
                      : 100
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    const otherFilters = selectedVideoLayer.filter
                      ?.split(" ")
                      .filter((f) => !f.includes("saturate"))
                      .join(" ");
                    updateLayer(selectedVideoLayer.id, {
                      filter: `${otherFilters} saturate(${value}%)`.trim(),
                    });
                  }}
                />
                <span style={styles.propertyValue}>
                  {selectedVideoLayer.filter?.includes("saturate")
                    ? selectedVideoLayer.filter.match(/saturate\((\d+)\)/)?.[1]
                    : "100"}{" "}
                  %
                </span>
              </div>

              {/* Filter Presets */}
              <div style={styles.propertyGroup}>
                <div style={styles.filterPresets}>
                  <button
                    style={{
                      ...styles.filterPresetButton,
                      ...(selectedVideoLayer.filter?.includes("saturate(150)")
                        ? styles.filterPresetActive
                        : {}),
                    }}
                    onClick={() =>
                      updateLayer(selectedVideoLayer.id, {
                        filter: "saturate(150%) contrast(110%) brightness(105%)",
                      })
                    }
                  >
                    Vibrant
                  </button>
                  <button
                    style={{
                      ...styles.filterPresetButton,
                      ...(selectedVideoLayer.filter?.includes("saturate(200)")
                        ? styles.filterPresetActive
                        : {}),
                    }}
                    onClick={() =>
                      updateLayer(selectedVideoLayer.id, {
                        filter: "saturate(200%) contrast(200%) brightness(80%) hue-rotate(10deg)",
                      })
                    }
                  >
                    Deep Fry
                  </button>
                </div>
              </div>

              {/* Position Options */}
              <div style={styles.propertyGroup}>
                <div style={styles.positionGrid}>
                  <button
                    style={{
                      ...styles.positionButton,
                      ...(selectedVideoLayer.position.y === 25 ? styles.positionButtonActive : {}),
                    }}
                    onClick={() =>
                      updateLayer(selectedVideoLayer.id, {
                        position: { x: 50, y: 25 },
                        size: { width: 100, height: 50 },
                      })
                    }
                  >
                    <EditorIcons.Move />
                    Half Top
                  </button>
                  <button
                    style={{
                      ...styles.positionButton,
                      ...(selectedVideoLayer.position.y === 75 ? styles.positionButtonActive : {}),
                    }}
                    onClick={() =>
                      updateLayer(selectedVideoLayer.id, {
                        position: { x: 50, y: 75 },
                        size: { width: 100, height: 50 },
                      })
                    }
                  >
                    <EditorIcons.Move />
                    Half Bottom
                  </button>
                  <button
                    style={{
                      ...styles.positionButton,
                      ...(selectedVideoLayer.objectFit === "fill" ? styles.positionButtonActive : {}),
                    }}
                    onClick={() =>
                      updateLayer(selectedVideoLayer.id, {
                        objectFit: "fill",
                        position: { x: 50, y: 50 },
                        size: { width: 100, height: 100 },
                      })
                    }
                  >
                    <EditorIcons.ZoomOut />
                    Scale Fill
                  </button>
                  <button
                    style={{
                      ...styles.positionButton,
                      ...(selectedVideoLayer.position.x === 50 &&
                      selectedVideoLayer.position.y === 50 &&
                      selectedVideoLayer.size.width === 60
                        ? styles.positionButtonActive
                        : {}),
                    }}
                    onClick={() =>
                      updateLayer(selectedVideoLayer.id, {
                        position: { x: 50, y: 50 },
                        size: { width: 60, height: 45 },
                        objectFit: "contain",
                      })
                    }
                  >
                    <EditorIcons.Move />
                    Original
                  </button>
                </div>
              </div>

              {/* Replace Video Button */}
              <button
                style={styles.replaceVideoButton}
                onClick={addVideoLayer}
              >
                <EditorIcons.Upload />
                Replace Video
              </button>

              {/* Delete Button */}
              <button
                style={styles.deleteVideoButton}
                onClick={() => {
                  deleteLayer(selectedVideoLayer.id);
                  setSelectedLayerId(null);
                }}
              >
                <EditorIcons.Trash />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Main Area */}
      <div style={styles.mainArea}>
        <div style={styles.header}>
          <span style={styles.headerTitle}>Dynamic Layer Editor</span>
          <div style={styles.headerButtonsRight}>
            <button
              style={styles.addButton}
              onClick={addTextLayer}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.2)")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.1)")}
            >
              <EditorIcons.Type />
              Text
            </button>
            <button
              style={styles.addButton}
              onClick={addImageLayer}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.2)")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.1)")}
            >
              <EditorIcons.Image />
              Image
            </button>
            <button
              style={styles.addButton}
              onClick={addAudioLayer}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.2)")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.1)")}
            >
              <Icons.Music />
              Audio
            </button>
            <button
              style={styles.addButton}
              onClick={addVideoLayer}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(139, 92, 246, 0.2)")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(139, 92, 246, 0.1)")}
            >
              <EditorIcons.Video />
              Video
            </button>
            <button
              style={styles.exportButton}
              onClick={() => setShowExportModal(true)}
              onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Export Video
            </button>
          </div>
        </div>

        <div style={styles.previewArea}>
          <div 
            ref={previewContainerRef}
            style={styles.previewWrapper}
          >
            <RemotionPreview
              ref={previewRef}
              component={DynamicLayerComposition}
              inputProps={{ layers, editingLayerId }}
              durationInFrames={totalFrames}
              compositionWidth={1080}
              compositionHeight={1920}
              fps={FPS}
              currentFrame={currentFrame}
              isPlaying={isPlaying}
              onFrameUpdate={setCurrentFrame}
              onPlayingChange={setIsPlaying}
              showPhoneFrame={true}
              phoneFrameWidth="100%"
              phoneFrameHeight="100%"
              interactiveMode={false}
            />
            <DynamicPreviewOverlay
              layers={layers}
              onLayerUpdate={handleLayerUpdateFromOverlay}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
              containerWidth={previewDimensions.width || 300}
              containerHeight={previewDimensions.height || 533}
              currentFrame={currentFrame}
              editingLayerId={editingLayerId}
              onEditingLayerChange={setEditingLayerId}
            />
          </div>
        </div>

        {/* Timeline with all new features */}
        <Timeline
          tracks={timelineTracks}
          totalFrames={totalFrames}
          fps={FPS}
          currentFrame={currentFrame}
          isPlaying={isPlaying}
          onFrameChange={handleFrameChange}
          onPlayPause={handlePlayPause}
          onTracksChange={handleTracksChange}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          selectedTrackId={selectedLayerId}
          onTrackSelect={setSelectedLayerId}
          onDeleteTrack={handleDeleteTrack}
          onCutTrack={handleCutTrack}
          onReorderTracks={handleReorderTracks}
        />
      </div>

      <style>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
        }
        select option {
          background-color: #1a1a1a;
          color: #e5e5e5;
        }
      `}</style>
    </div>
    </>
  );
};

export default DynamicLayerEditor;