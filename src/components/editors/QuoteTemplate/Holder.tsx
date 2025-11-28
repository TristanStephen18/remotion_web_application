// import React, { useState, useRef, useEffect } from "react";
// import { SideNavTrial } from "./Sidenav";
// import { QuoteSecTrial } from "./sidenav_sections/Quote";
// import { BackgroundSecTrial } from "../Global/sidenav_sections/Backgrounds";
// import { QuoteSpotlightPreview } from "../../layout/EditorPreviews/QuoteTemplatePreview";
// import { TypographySectionQuote } from "./sidenav_sections/Typo";
// import { defaultpanelwidth } from "../../../data/DefaultValues";
// import {
//   quoteSpotlightDurationCalculator,
// } from "../../../utils/QuoteSpotlightHelpers";
// import { ExportModal } from "../../ui/modals/ExportModal";
// // import { TopNavWithoutBatchrendering } from "../../navigations/single_editors/withoutswitchmodesbutton";
// import { useProjectSave } from "../../../hooks/SaveProject";
// import { useParams } from "react-router-dom";
// import { TopNavWithSave } from "../../navigations/single_editors/WithSave";
// import { LoadingOverlay } from "../../ui/modals/LoadingProjectModal";
// import { SaveProjectModal } from "../../ui/modals/SaveModal";
// import { useFileUpload } from "../../../hooks/uploads/HandleImageUpload";
// import { useBackgroundImages } from "../../../hooks/datafetching/UserImagesAndOnlineImages";
// import toast from "react-hot-toast";
// import { backendPrefix } from "../../../config";

// export const QuoteTemplateEditor: React.FC = () => {
//   const { id } = useParams();
//   const { isUploading, uploadedUrl, uploadFile } = useFileUpload({
//     type: "image",
//   });

//   const [isGenerating, setIsGenerating] = useState(false);
//   const [previewSize, setPreviewSize] = useState(1);
//   const [templateName, setTemplateName] = useState(
//     "🎬 Quote Spotlight Template"
//   );

//   const [quote, setQuote] = useState("Your Quote");
//   const [author, setAuthor] = useState("Author");
//   const [backgroundImage, setBackgroundImage] = useState(
//     `https://res.cloudinary.com/dnxc1lw18/image/upload/v1760979566/bg11_deliyh.jpg`
//   );
//   const [backgroundSource, setBackgroundSource] = useState<
//     "upload" | "default"
//   >("default");

//   const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
//   const [fontColor, setFontColor] = useState("white");
//   const [fontSize, setFontSize] = useState(1);
//   const [showSafeMargins, setShowSafeMargins] = useState(true);
//   const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
//   const [activeSection, setActiveSection] = useState<
//     "quote" | "background" | "typography" | "ai"
//   >("quote");
//   const [collapsed, setCollapsed] = useState(false);

//   // const [isUploading, setIsUploading] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportUrl, setExportUrl] = useState<string | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   // const [autoSave, setAutoSave] = useState(false);

//   // 🔹 Resizable panel state
//   const [panelWidth, setPanelWidth] = useState(defaultpanelwidth); // default width
//   const [isResizing, setIsResizing] = useState(false);
//   const panelRef = useRef<HTMLDivElement | null>(null);
//   const [duration, setDuration] = useState(9);
//   const [isLoading, setIsLoading] = useState(false);

//  const {
//      userUploads,
//      loadingUploads,
//      fetchUserUploads,
//      onlineImages,
//      loadingOnline,
//      fetchOnlineImages,
//      searchQuery,
//      setSearchQuery,
//    } = useBackgroundImages();
 
//    useEffect(() => {
//      fetchUserUploads();
//      fetchOnlineImages("gradient");
//    }, []);
//   // 🔹 Drag handlers
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isResizing) return;
//       const newWidth =
//         e.clientX - (panelRef.current?.getBoundingClientRect().left || 0);
//       if (newWidth > 200 && newWidth < 600) {
//         setPanelWidth(newWidth);
//       }
//     };

//     const handleMouseUp = () => setIsResizing(false);

//     if (isResizing) {
//       window.addEventListener("mousemove", handleMouseMove);
//       window.addEventListener("mouseup", handleMouseUp);
//     }
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isResizing]);

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
//           // restore from backend
//           setTemplateName(data.title);

//           setQuote(data.props.quote);
//           setAuthor(data.props.author);
//           setBackgroundImage(data.props.imageurl);
//           setFontFamily(data.props.fontfamily ?? "Cormorant Garamond, serif");
//           setFontColor(data.props.fontcolor ?? "white");
//           setFontSize(data.props.fontsize ?? 1);
//           setDuration(data.props.duration);

//           lastSavedProps.current = data.props;
//         })
//         .catch((err) => console.error("❌ Project load failed:", err))
//         .finally(() => setIsLoading(false));
//     }
//   }, [id]);

//   const cycleBg = () => {
//     if (previewBg === "dark") setPreviewBg("light");
//     else if (previewBg === "light") setPreviewBg("grey");
//     else setPreviewBg("dark");
//   };

//   useEffect(() => {
//     setDuration(quoteSpotlightDurationCalculator(quote.length));
//     console.log(duration);
//   }, [quote]);

//   const handleAISuggestion = async () => {
//     setIsGenerating(true);
//     try {
//       const response = await fetch(`${backendPrefix}/api/generate-quote`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `HTTP error! status: ${response.status}, message: ${errorText}`
//         );
//       }

//       const data = await response.json();
//       setAuthor(data.author);
//       setQuote(data.quote);
//     } catch (error: any) {
//       console.error("error generating ai suggestion");
//       toast.error(error.message);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   useEffect(() => {
//     if (uploadedUrl) {
//       setBackgroundImage(uploadedUrl);
//       setBackgroundSource("upload");
//       fetchUserUploads();
//     }
//   }, [uploadedUrl]);

//   const handleExport = async (format: string) => {
//     setIsExporting(true);

//     try {
//       let finalImageUrl = backgroundImage;
//       const response = await fetch(`${backendPrefix}/generatevideo/quotetemplatewchoices`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           quote,
//           author,
//           imageurl: finalImageUrl,
//           fontsize: fontSize,
//           fontcolor: fontColor,
//           fontfamily: fontFamily,
//           format: format,
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `HTTP error! status: ${response.status}, message: ${errorText}`
//         );
//       }

//       const data = await response.json();
//       const renderUrl = data.url;
//       if (renderUrl) {
//         const saveResponse = await fetch(`${backendPrefix}/renders`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           body: JSON.stringify({
//             templateId: 1,
//             outputUrl: renderUrl,
//             type: format,
//           }),
//         });

//         if (!saveResponse.ok) {
//           throw new Error(
//             `Failed to save upload: ${
//               saveResponse.status
//             } ${await saveResponse.text()}`
//           );
//         }

//         const saveData = await saveResponse.json();
//         console.log("✅ Render saved to DB:", saveData);
//       }
//       setExportUrl(data.url);
//       setShowModal(true);
//     } catch (error) {
//       console.error("Export failed:", error);
//       alert(`Export failed: ${error || "Please try again."}`);
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const [messageIndex, setMessageIndex] = useState(0);

//   const messages = [
//     "⏳ Preparing your template...",

//     "🙇 Sorry for the wait, still working on it...",
//     "🚀 Almost there, thanks for your patience!",
//   ];

//   // 🟢 Cycle loader messages every 10s
//   useEffect(() => {
//     if (!isLoading) return;
//     const interval = setInterval(() => {
//       setMessageIndex((prev) => (prev + 1) % messages.length);
//     }, 10000); // every 10 seconds

//     return () => clearInterval(interval);
//   }, [isLoading]);

//   const {
//     setProjectId,
//     isSaving,
//     showSaveModal,
//     setShowSaveModal,
//     handleSave,
//     saveNewProject,
//     lastSavedProps,
//   } = useProjectSave({
//     templateId: 1,
//     buildProps: () => ({
//       quote,
//       author,
//       imageurl: backgroundImage,
//       fontsize: fontSize,
//       fontcolor: fontColor,
//       fontfamily: fontFamily,
//       duration,
//     }),
//     videoEndpoint: `${backendPrefix}/generatevideo/quotetemplatewchoices`,
//   });

//   useEffect(() => {
//     fetchUserUploads();
//     fetchOnlineImages("history");
//   },[]);

//   return (
//     <div style={{ display: "flex", height: "100%", flex: 1 }}>
//       {isLoading && <LoadingOverlay message={messages[messageIndex]} />}

//       {/* modal */}
//       <TopNavWithSave
//         templateName={templateName}
//         // onSwitchMode={onSwitchMode}
//         onSave={handleSave}
//         onExport={handleExport}
//         setTemplateName={setTemplateName}
//         onOpenExport={() => setShowModal(true)}
//         template={templateName}
//         isSaving={isSaving}
//       />

//       <SaveProjectModal
//         open={showSaveModal}
//         onClose={() => setShowSaveModal(false)}
//         onSave={saveNewProject}
//       />

//       <div style={{ display: "flex", flex: 1, marginTop: "60px" }}>
//         {showModal && (
//           <ExportModal
//             showExport={showModal}
//             setShowExport={setShowModal}
//             isExporting={isExporting}
//             exportUrl={exportUrl}
//             onExport={handleExport}
//           />
//         )}

//         {/* sidenav */}
//         <SideNavTrial
//           activeSection={activeSection}
//           collapsed={collapsed}
//           setActiveSection={setActiveSection}
//           setCollapsed={setCollapsed}
//         />

//         {/* Controls Panel */}
//         {!collapsed && (
//           <div
//             ref={panelRef}
//             style={{
//               width: `${panelWidth}px`,
//               padding: "1rem",
//               overflowY: "auto",
//               background: "#fff",
//               borderRight: "1px solid #eee",
//               position: "relative",
//               transition: isResizing ? "#add" : "width 0.2s",
//             }}
//           >
//             {/* Drag Handle */}
//             <div
//               onMouseDown={() => setIsResizing(true)}
//               style={{
//                 position: "absolute",
//                 right: 0,
//                 top: 0,
//                 bottom: 0,
//                 width: "6px",
//                 cursor: "col-resize",
//                 background: "#ddd",
//               }}
//             />

//             {activeSection === "quote" && (
//               <QuoteSecTrial
//                 author={author}
//                 quote={quote}
//                 setAuthor={setAuthor}
//                 setQuote={setQuote}
//                 handleAISuggestion={handleAISuggestion}
//                 isGenerating={isGenerating}
//               />
//             )}
//             {activeSection === "background" && (
//               <BackgroundSecTrial
//                 backgroundImage={backgroundImage}
//                 backgroundSource={backgroundSource}
//                 handleFileUpload={uploadFile}
//                 isUploading={isUploading}
//                 setBackgroundImage={setBackgroundImage}
//                 setBackgroundSource={setBackgroundSource}
//                 fetchOnlineImages={fetchOnlineImages}
//                 loadingOnline={loadingOnline}
//                 loadingUploads={loadingUploads}
//                 onlineImages={onlineImages}
//                 searchQuery={searchQuery}
//                 setSearchQuery={setSearchQuery}
//                 userUploads={userUploads}
//               />
//             )}
//             {activeSection === "typography" && (
//               <TypographySectionQuote
//                 fontColor={fontColor}
//                 fontFamily={fontFamily}
//                 fontSize={fontSize}
//                 setFontColor={setFontColor}
//                 setFontFamily={setFontFamily}
//                 setFontSize={setFontSize}
//               />
//             )}
//           </div>
//         )}

//         <QuoteSpotlightPreview
//           quote={quote}
//           author={author}
//           backgroundImage={backgroundImage}
//           fontSize={fontSize}
//           fontFamily={fontFamily}
//           fontColor={fontColor}
//           showSafeMargins={showSafeMargins}
//           previewBg={previewBg}
//           cycleBg={cycleBg}
//           previewScale={previewSize}
//           onPreviewScaleChange={setPreviewSize}
//           onToggleSafeMargins={setShowSafeMargins}
//           duration={duration}
//         />
//       </div>
//     </div>
//   );
// };


// import React, { useState, useRef, useEffect, useCallback, type JSX } from "react";
// import { QuoteSpotlightPreview } from "../../layout/EditorPreviews/QuoteTemplatePreview";
// import { TypographySectionQuote } from "./sidenav_sections/Typo";
// import { BackgroundSecTrial } from "../Global/sidenav_sections/Backgrounds";
// import { SideNavTrial } from "./Sidenav";
// import { TopNavWithSave } from "../../navigations/single_editors/WithSave";
// import { ExportModal } from "../../ui/modals/ExportModal";
// import { SaveProjectModal } from "../../ui/modals/SaveModal";
// import { LoadingOverlay } from "../../ui/modals/LoadingProjectModal";
// import { useProjectSave } from "../../../hooks/SaveProject";
// import { backendPrefix } from "../../../config";
// import toast from "react-hot-toast";
// import { useBackgroundImages } from "../../../hooks/datafetching/UserImagesAndOnlineImages";
// import { useFileUpload } from "../../../hooks/uploads/HandleImageUpload";
// import { useParams } from "react-router-dom";

// // ============================================
// // TYPE DEFINITIONS (all local)
// // ============================================

// interface Clip {
//   id: string;
//   start: number;
//   duration: number;
//   name: string;
//   color: string;
// }

// interface Track {
//   id: string;
//   name: string;
//   color: string;
//   clips: Clip[];
// }

// // Player handle type for controlling Remotion player
// interface PlayerHandle {
//   play: () => void;
//   pause: () => void;
//   toggle: () => void;
//   seekTo: (frame: number) => void;
//   seekToTime: (timeInSeconds: number) => void;
//   getCurrentFrame: () => number;
//   isPlaying: () => boolean;
// }

// interface InteractiveTimelineProps {
//   duration: number;
//   setDuration: (d: number) => void;
//   quote: string;
//   currentTime: number;
//   isPlaying: boolean;
//   onSeek: (time: number) => void;
//   onPlayPause: () => void;
//   onStop: () => void;
//   tracks: Track[];
//   setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
// }

// interface ClipComponentProps {
//   clip: Clip;
//   trackId: string;
//   pixelsPerSecond: number;
//   selectedClip: string | null;
//   setSelectedClip: (id: string | null) => void;
//   handleClipDrag: (trackId: string, clipId: string, deltaX: number) => void;
//   handleClipResize: (trackId: string, clipId: string, edge: "left" | "right", deltaX: number) => void;
// }

// // ============================================
// // HELPER FUNCTIONS
// // ============================================

// const quoteSpotlightDurationCalculator = (quote: string): number => {
//   let length = 0;
//   if (typeof quote === 'string') {
//     length = quote.length;
//   } else if (typeof quote === 'number' && isFinite(quote)) {
//     length = quote;
//   }
//   return 2.0 + (Math.floor(length / 10) * 0.1); 
// };

// // ============================================
// // CONSTANTS
// // ============================================

// const PROPERTIES_PANEL_WIDTH = 300; 
// const SIDENAV_WIDTH = 60; 
// const HORIZONTAL_TIMELINE_HEIGHT = 220;
// const TRACK_HEIGHT = 45;
// const RULER_HEIGHT = 32;
// const CONTROLS_HEIGHT = 48;
// const MAX_DURATION = 60;
// const MIN_DURATION = 1;
// const FPS = 30;

// // ============================================
// // CLIP COMPONENT
// // ============================================

// const ClipComponent: React.FC<ClipComponentProps> = ({
//   clip,
//   trackId,
//   pixelsPerSecond,
//   selectedClip,
//   setSelectedClip,
//   handleClipDrag,
//   handleClipResize,
// }) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [isResizing, setIsResizing] = useState<"left" | "right" | null>(null);
//   const [dragStart, setDragStart] = useState({ x: 0 });

//   const handleMouseDown = (e: React.MouseEvent, action: "drag" | "left" | "right") => {
//     e.stopPropagation();
//     setSelectedClip(clip.id);
//     if (action === "drag") {
//       setIsDragging(true);
//     } else {
//       setIsResizing(action);
//     }
//     setDragStart({ x: e.clientX });
//   };

//   useEffect(() => {
//     if (!isDragging && !isResizing) return;

//     const handleMouseMove = (e: MouseEvent) => {
//       const deltaX = e.clientX - dragStart.x;
//       if (isDragging) {
//         handleClipDrag(trackId, clip.id, deltaX);
//       } else if (isResizing) {
//         handleClipResize(trackId, clip.id, isResizing, deltaX);
//       }
//       setDragStart({ x: e.clientX });
//     };

//     const handleMouseUp = () => {
//       setIsDragging(false);
//       setIsResizing(null);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDragging, isResizing, dragStart, trackId, clip.id, handleClipDrag, handleClipResize]);

//   const isSelected = selectedClip === clip.id;

//   return (
//     <div
//       style={{
//         position: "absolute",
//         left: `${clip.start * pixelsPerSecond}px`,
//         width: `${Math.max(clip.duration * pixelsPerSecond, 30)}px`,
//         height: "calc(100% - 6px)",
//         top: "3px",
//         background: `linear-gradient(135deg, ${clip.color} 0%, ${clip.color}dd 100%)`,
//         borderRadius: "6px",
//         border: isSelected ? "2px solid #fff" : "1px solid rgba(255,255,255,0.2)",
//         boxShadow: isSelected
//           ? "0 0 12px rgba(255,255,255,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
//           : "inset 0 1px 0 rgba(255,255,255,0.2)",
//         cursor: isDragging ? "grabbing" : "grab",
//         display: "flex",
//         alignItems: "center",
//         overflow: "hidden",
//         userSelect: "none",
//         transition: "box-shadow 0.15s ease",
//       }}
//       onClick={(e) => {
//         e.stopPropagation();
//         setSelectedClip(clip.id);
//       }}
//       onMouseDown={(e) => handleMouseDown(e, "drag")}
//     >
//       <div
//         style={{
//           position: "absolute",
//           left: 0,
//           top: 0,
//           width: "10px",
//           height: "100%",
//           cursor: "ew-resize",
//           background: "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
//           borderRadius: "6px 0 0 6px",
//         }}
//         onMouseDown={(e) => handleMouseDown(e, "left")}
//       />

//       <span
//         style={{
//           padding: "0 14px",
//           color: "#fff",
//           fontSize: "11px",
//           fontWeight: 600,
//           whiteSpace: "nowrap",
//           overflow: "hidden",
//           textOverflow: "ellipsis",
//           textShadow: "0 1px 3px rgba(0,0,0,0.4)",
//           pointerEvents: "none",
//           letterSpacing: "0.3px",
//         }}
//       >
//         {clip.name} ({clip.duration.toFixed(1)}s)
//       </span>

//       <div
//         style={{
//           position: "absolute",
//           right: 0,
//           top: 0,
//           width: "10px",
//           height: "100%",
//           cursor: "ew-resize",
//           background: "linear-gradient(270deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
//           borderRadius: "0 6px 6px 0",
//         }}
//         onMouseDown={(e) => handleMouseDown(e, "right")}
//       />
//     </div>
//   );
// };

// // ============================================
// // INTERACTIVE TIMELINE COMPONENT
// // ============================================

// const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
//   duration,
//   setDuration,
//   quote,
//   currentTime,
//   isPlaying,
//   onSeek,
//   onPlayPause,
//   onStop,
//   tracks,
//   setTracks,
// }) => {
//   const [zoom, setZoom] = useState(1);
//   const [selectedClip, setSelectedClip] = useState<string | null>(null);
//   const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
//   const timelineRef = useRef<HTMLDivElement>(null);
//   const pixelsPerSecond = 50 * zoom;

//   useEffect(() => {
//     const textClipDuration = Math.min(quoteSpotlightDurationCalculator(quote), duration);
//     setTracks((prev) =>
//       prev.map((track) =>
//         track.id === "track-2"
//           ? {
//               ...track,
//               clips: track.clips.map((clip, idx) =>
//                 idx === 0 ? { ...clip, duration: textClipDuration } : clip
//               ),
//             }
//           : track
//       )
//     );
//   }, [quote, duration, setTracks]);

//   useEffect(() => {
//     setTracks((prev) =>
//       prev.map((track) =>
//         track.id === "track-1"
//           ? {
//               ...track,
//               clips: track.clips.map((clip, idx) =>
//                 idx === 0 ? { ...clip, duration: duration } : clip
//               ),
//             }
//           : track
//       )
//     );
//   }, [duration, setTracks]);

//   const formatTime = (time: number): string => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     const ms = Math.floor((time % 1) * 10);
//     return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms}`;
//   };

//   const handleTimelineClick = useCallback(
//     (e: React.MouseEvent) => {
//       if (!timelineRef.current || selectedClip) return;
//       const rect = timelineRef.current.getBoundingClientRect();
//       const scrollLeft = timelineRef.current.scrollLeft;
//       const x = e.clientX - rect.left + scrollLeft;
//       const time = Math.max(0, Math.min(duration, x / pixelsPerSecond));
//       onSeek(time);
//     },
//     [duration, pixelsPerSecond, selectedClip, onSeek]
//   );

//   const handlePlayheadMouseDown = useCallback((e: React.MouseEvent) => {
//     e.stopPropagation();
//     setIsDraggingPlayhead(true);
//   }, []);

//   useEffect(() => {
//     if (!isDraggingPlayhead) return;

//     const handleMouseMove = (e: MouseEvent) => {
//       if (!timelineRef.current) return;
//       const rect = timelineRef.current.getBoundingClientRect();
//       const scrollLeft = timelineRef.current.scrollLeft;
//       const x = e.clientX - rect.left + scrollLeft;
//       const time = Math.max(0, Math.min(duration, x / pixelsPerSecond));
//       onSeek(time);
//     };

//     const handleMouseUp = () => setIsDraggingPlayhead(false);

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDraggingPlayhead, duration, pixelsPerSecond, onSeek]);

//   const handleClipResize = useCallback(
//     (trackId: string, clipId: string, edge: "left" | "right", deltaX: number) => {
//       setTracks((prev) =>
//         prev.map((track) => {
//           if (track.id !== trackId) return track;
//           return {
//             ...track,
//             clips: track.clips.map((clip) => {
//               if (clip.id !== clipId) return clip;
//               const deltaTime = deltaX / pixelsPerSecond;
//               if (edge === "left") {
//                 const newStart = Math.max(0, clip.start + deltaTime);
//                 const newDuration = clip.duration - (newStart - clip.start);
//                 if (newDuration < 0.5) return clip;
//                 return { ...clip, start: newStart, duration: newDuration };
//               } else {
//                 const newDuration = Math.max(0.5, clip.duration + deltaTime);
//                 if (clip.start + newDuration > MAX_DURATION) return clip;
//                 return { ...clip, duration: newDuration };
//               }
//             }),
//           };
//         })
//       );
//     },
//     [pixelsPerSecond, setTracks]
//   );

//   const handleClipDrag = useCallback(
//     (trackId: string, clipId: string, deltaX: number) => {
//       setTracks((prev) =>
//         prev.map((track) => {
//           if (track.id !== trackId) return track;
//           return {
//             ...track,
//             clips: track.clips.map((clip) => {
//               if (clip.id !== clipId) return clip;
//               const deltaTime = deltaX / pixelsPerSecond;
//               const newStart = Math.max(
//                 0,
//                 Math.min(MAX_DURATION - clip.duration, clip.start + deltaTime)
//               );
//               return { ...clip, start: newStart };
//             }),
//           };
//         })
//       );
//     },
//     [pixelsPerSecond, setTracks]
//   );

//   const addTrack = () => {
//     const colors = ["#e74c3c", "#9b59b6", "#f39c12", "#1abc9c", "#34495e"];
//     setTracks((prev) => [
//       ...prev,
//       {
//         id: `track-${Date.now()}`,
//         name: `Track ${prev.length + 1}`,
//         color: colors[prev.length % colors.length],
//         clips: [],
//       },
//     ]);
//   };

//   const removeTrack = (trackId: string) => {
//     if (tracks.length <= 1) return;
//     setTracks((prev) => prev.filter((t) => t.id !== trackId));
//   };

//   const addClipToTrack = (trackId: string) => {
//     setTracks((prev) =>
//       prev.map((track) => {
//         if (track.id !== trackId) return track;
//         const lastClip = track.clips[track.clips.length - 1];
//         const startTime = lastClip ? lastClip.start + lastClip.duration + 0.5 : 0;
//         if (startTime >= MAX_DURATION) return track;
//         return {
//           ...track,
//           clips: [
//             ...track.clips,
//             {
//               id: `clip-${Date.now()}`,
//               start: startTime,
//               duration: Math.min(3, MAX_DURATION - startTime),
//               name: `Clip ${track.clips.length + 1}`,
//               color: track.color,
//             },
//           ],
//         };
//       })
//     );
//   };

//   const deleteSelectedClip = () => {
//     if (!selectedClip) return;
//     setTracks((prev) =>
//       prev.map((track) => ({
//         ...track,
//         clips: track.clips.filter((c) => c.id !== selectedClip),
//       }))
//     );
//     setSelectedClip(null);
//   };

//   const splitClipAtPlayhead = () => {
//     setTracks((prev) =>
//       prev.map((track) => {
//         const newClips: Clip[] = [];
//         track.clips.forEach((clip) => {
//           const clipEnd = clip.start + clip.duration;
//           if (currentTime > clip.start && currentTime < clipEnd) {
//             newClips.push({ ...clip, duration: currentTime - clip.start });
//             newClips.push({
//               ...clip,
//               id: `clip-${Date.now()}-split`,
//               start: currentTime,
//               duration: clipEnd - currentTime,
//               name: `${clip.name} (split)`,
//             });
//           } else {
//             newClips.push(clip);
//           }
//         });
//         return { ...track, clips: newClips };
//       })
//     );
//   };

//   const renderRuler = () => {
//     const marks: JSX.Element[] = [];
//     const majorInterval = zoom >= 2 ? 1 : zoom >= 1 ? 2 : 5;
//     const minorInterval = majorInterval / 5;

//     for (let t = 0; t <= Math.ceil(duration) + 5; t += minorInterval) {
//       const isMajor = t % majorInterval === 0;
//       marks.push(
//         <div
//           key={t}
//           style={{
//             position: "absolute",
//             left: `${t * pixelsPerSecond}px`,
//             height: isMajor ? "16px" : "8px",
//             width: "1px",
//             background: isMajor ? "#e0e0e0" : "#555",
//             bottom: 0,
//           }}
//         >
//           {isMajor && (
//             <span
//               style={{
//                 position: "absolute",
//                 bottom: "18px",
//                 left: "-15px",
//                 width: "30px",
//                 textAlign: "center",
//                 fontSize: "10px",
//                 color: "#aaa",
//                 fontWeight: 500,
//               }}
//             >
//               {t}s
//             </span>
//           )}
//         </div>
//       );
//     }
//     return marks;
//   };

//   const timelineContentWidth = Math.max(1200, (duration + 10) * pixelsPerSecond);

//   const btnStyle: React.CSSProperties = {
//     background: "linear-gradient(180deg, #2a3a5a 0%, #1f2940 100%)",
//     border: "1px solid #3a4a6a",
//     color: "#fff",
//     padding: "8px 12px",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "14px",
//   };

//   const smallBtnStyle: React.CSSProperties = {
//     background: "transparent",
//     border: "1px solid #3a4a5a",
//     color: "#8899aa",
//     cursor: "pointer",
//     fontSize: "14px",
//     width: "22px",
//     height: "22px",
//     borderRadius: "4px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   };

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: `${HORIZONTAL_TIMELINE_HEIGHT}px`,
//         minHeight: `${HORIZONTAL_TIMELINE_HEIGHT}px`,
//         background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
//         borderTop: "2px solid #0f3460",
//         display: "flex",
//         flexDirection: "column",
//         userSelect: "none",
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       }}
//     >
//       <div
//         style={{
//           height: `${CONTROLS_HEIGHT}px`,
//           background: "linear-gradient(180deg, #1f2940 0%, #16213e 100%)",
//           display: "flex",
//           alignItems: "center",
//           padding: "0 16px",
//           gap: "12px",
//           borderBottom: "1px solid #0f3460",
//           flexWrap: "wrap",
//         }}
//       >
//         <div style={{ display: "flex", gap: "6px" }}>
//           <button onClick={() => onSeek(0)} style={btnStyle} title="Go to start">⏮</button>
//           <button
//             onClick={onPlayPause}
//             style={{
//               ...btnStyle,
//               background: isPlaying
//                 ? "linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)"
//                 : "linear-gradient(180deg, #2ecc71 0%, #27ae60 100%)",
//               border: "none",
//               padding: "8px 16px",
//               fontWeight: 600,
//               boxShadow: isPlaying
//                 ? "0 2px 8px rgba(231, 76, 60, 0.4)"
//                 : "0 2px 8px rgba(46, 204, 113, 0.4)",
//             }}
//             title={isPlaying ? "Pause" : "Play"}
//           >
//             {isPlaying ? "⏸" : "▶"}
//           </button>
//           <button onClick={onStop} style={btnStyle} title="Stop">⏹</button>
//         </div>

//         <div
//           style={{
//             background: "#0a0a15",
//             padding: "6px 14px",
//             borderRadius: "6px",
//             fontFamily: "'JetBrains Mono', monospace",
//             fontSize: "15px",
//             color: "#00ff88",
//             minWidth: "100px",
//             textAlign: "center",
//             border: "1px solid #1a2a3a",
//             boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
//           }}
//         >
//           {formatTime(currentTime)}
//         </div>

//         <div style={{ width: "1px", height: "28px", background: "#2a3a5a" }} />

//         <div style={{ display: "flex", gap: "6px" }}>
//           <button onClick={splitClipAtPlayhead} style={btnStyle} title="Split at playhead">✂️ Split</button>
//           <button
//             onClick={deleteSelectedClip}
//             disabled={!selectedClip}
//             style={{
//               ...btnStyle,
//               background: selectedClip
//                 ? "linear-gradient(180deg, #c0392b 0%, #96281b 100%)"
//                 : "linear-gradient(180deg, #2a2a3a 0%, #1a1a2a 100%)",
//               border: selectedClip ? "none" : "1px solid #3a3a4a",
//               opacity: selectedClip ? 1 : 0.5,
//               cursor: selectedClip ? "pointer" : "not-allowed",
//             }}
//             title="Delete selected clip"
//           >
//             🗑️ Delete
//           </button>
//           <button onClick={addTrack} style={btnStyle} title="Add track">➕ Track</button>
//         </div>

//         <div style={{ width: "1px", height: "28px", background: "#2a3a5a" }} />

//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <span style={{ color: "#8899aa", fontSize: "12px", fontWeight: 500 }}>Zoom</span>
//           <button
//             onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
//             style={{ ...btnStyle, width: "28px", height: "28px", padding: 0 }}
//           >−</button>
//           <span style={{ color: "#fff", fontSize: "12px", minWidth: "45px", textAlign: "center", fontWeight: 500 }}>
//             {(zoom * 100).toFixed(0)}%
//           </span>
//           <button
//             onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
//             style={{ ...btnStyle, width: "28px", height: "28px", padding: 0 }}
//           >+</button>
//         </div>

//         <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
//           <span style={{ color: "#8899aa", fontSize: "12px", fontWeight: 500 }}>Duration</span>
//           <input
//             type="number"
//             value={duration.toFixed(1)}
//             onChange={(e) => {
//               let val = parseFloat(e.target.value);
//               if (isNaN(val)) val = MIN_DURATION;
//               setDuration(Math.max(MIN_DURATION, Math.min(MAX_DURATION, val)));
//             }}
//             step="0.5"
//             min={MIN_DURATION}
//             max={MAX_DURATION}
//             style={{
//               width: "65px",
//               background: "#0a0a15",
//               color: "#fff",
//               border: "1px solid #2a3a5a",
//               borderRadius: "6px",
//               padding: "6px 10px",
//               fontSize: "13px",
//               fontFamily: "'JetBrains Mono', monospace",
//             }}
//           />
//           <span style={{ color: "#8899aa", fontSize: "12px" }}>sec</span>
//         </div>
//       </div>

//       <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         <div
//           style={{
//             width: "130px",
//             minWidth: "130px",
//             background: "#16213e",
//             borderRight: "1px solid #0f3460",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <div
//             style={{
//               height: `${RULER_HEIGHT}px`,
//               borderBottom: "1px solid #0f3460",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "#667788",
//               fontSize: "10px",
//               fontWeight: 600,
//               letterSpacing: "1px",
//             }}
//           >
//             TRACKS
//           </div>

//           {tracks.map((track) => (
//             <div
//               key={track.id}
//               style={{
//                 height: `${TRACK_HEIGHT}px`,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 padding: "0 10px",
//                 borderBottom: "1px solid #0f3460",
//                 background: "#1a1a2e",
//               }}
//             >
//               <span style={{ color: track.color, fontSize: "12px", fontWeight: 600 }}>
//                 {track.name}
//               </span>
//               <div style={{ display: "flex", gap: "6px" }}>
//                 <button onClick={() => addClipToTrack(track.id)} style={smallBtnStyle} title="Add clip">+</button>
//                 {tracks.length > 1 && (
//                   <button onClick={() => removeTrack(track.id)} style={smallBtnStyle} title="Remove track">×</button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div
//           ref={timelineRef}
//           style={{ flex: 1, overflowX: "auto", overflowY: "hidden", position: "relative" }}
//           onClick={handleTimelineClick}
//         >
//           <div style={{ minWidth: `${timelineContentWidth}px`, position: "relative" }}>
//             <div
//               style={{
//                 height: `${RULER_HEIGHT}px`,
//                 background: "linear-gradient(180deg, #1a2a3a 0%, #0f1a2a 100%)",
//                 position: "relative",
//                 borderBottom: "1px solid #2a3a5a",
//               }}
//             >
//               {renderRuler()}
//             </div>

//             {tracks.map((track, i) => (
//               <div
//                 key={track.id}
//                 style={{
//                   height: `${TRACK_HEIGHT}px`,
//                   background: i % 2 === 0 ? "#1a1a2e" : "#181828",
//                   borderBottom: "1px solid #0f3460",
//                   position: "relative",
//                 }}
//               >
//                 {track.clips.map((clip) => (
//                   <ClipComponent
//                     key={clip.id}
//                     clip={clip}
//                     trackId={track.id}
//                     pixelsPerSecond={pixelsPerSecond}
//                     selectedClip={selectedClip}
//                     setSelectedClip={setSelectedClip}
//                     handleClipDrag={handleClipDrag}
//                     handleClipResize={handleClipResize}
//                   />
//                 ))}
//               </div>
//             ))}

//             <div
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 left: `${currentTime * pixelsPerSecond}px`,
//                 width: "2px",
//                 height: "100%",
//                 background: "linear-gradient(180deg, #ff4757 0%, #ff6b7a 100%)",
//                 zIndex: 100,
//                 pointerEvents: "none",
//                 boxShadow: "0 0 8px rgba(255, 71, 87, 0.6)",
//               }}
//             >
//               <div
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: "-9px",
//                   width: "20px",
//                   height: "20px",
//                   background: "linear-gradient(180deg, #ff4757 0%, #e63946 100%)",
//                   borderRadius: "3px 3px 10px 10px",
//                   cursor: "ew-resize",
//                   pointerEvents: "auto",
//                   boxShadow: "0 2px 6px rgba(255, 71, 87, 0.5)",
//                   border: "1px solid rgba(255,255,255,0.3)",
//                 }}
//                 onMouseDown={handlePlayheadMouseDown}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============================================
// // MAIN EDITOR COMPONENT
// // ============================================

// export const QuoteTemplateEditor: React.FC = () => {
//   const { id } = useParams();
//   const { isUploading, uploadedUrl, uploadFile } = useFileUpload({ type: "image" });

//   // Player ref - using 'any' to avoid type issues
//   const playerRef = useRef<any>(null);
  
//   // Timeline playback state
//   const [currentTime, setCurrentTime] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const [isGenerating, setIsGenerating] = useState(false);
//   const [previewSize, setPreviewSize] = useState(1);
//   const [templateName, setTemplateName] = useState("🎬 Quote Spotlight Template");

//   const [quote, setQuote] = useState("Hello World"); 
//   const [author, setAuthor] = useState("Steve Job"); 
//   const [backgroundImage, setBackgroundImage] = useState(
//     `https://res.cloudinary.com/dnxc1lw18/image/upload/v1760979566/bg11_deliyh.jpg`
//   );
//   const [backgroundSource, setBackgroundSource] = useState<"upload" | "default">("default");

//   const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
//   const [fontColor, setFontColor] = useState("white");
//   const [fontSize, setFontSize] = useState(1);
//   const [showSafeMargins, setShowSafeMargins] = useState(true);
//   const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
//   const [activeSection, setActiveSection] = useState<"quote" | "background" | "typography" | "ai">("quote");
//   const [collapsed, setCollapsed] = useState(false);

//   const [isExporting, setIsExporting] = useState(false);
//   const [exportUrl, setExportUrl] = useState<string | null>(null);
//   const [showModal, setShowModal] = useState(false);

//   const [duration, setDuration] = useState(9); 
//   const [isLoading, setIsLoading] = useState(false);

//   // Track state
//   const [tracks, setTracks] = useState<Track[]>([
//     {
//       id: "track-1",
//       name: "Video",
//       color: "#27ae60",
//       clips: [{ id: "clip-1", start: 0, duration: 9, name: "Main Clip", color: "#27ae60" }],
//     },
//     {
//       id: "track-2",
//       name: "Text",
//       color: "#3498db",
//       clips: [{
//         id: "clip-2",
//         start: 0,
//         duration: quoteSpotlightDurationCalculator("Hello World"),
//         name: "Text Overlay",
//         color: "#3498db",
//       }],
//     },
//   ]);

//   const {
//     userUploads, loadingUploads, fetchUserUploads,
//     onlineImages, loadingOnline, fetchOnlineImages,
//     searchQuery, setSearchQuery,
//   } = useBackgroundImages();

//   useEffect(() => {
//     fetchUserUploads();
//     fetchOnlineImages("history");
//   }, []); 

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
//           setTemplateName(data.title);
//           setQuote(data.props.quote);
//           setAuthor(data.props.author);
//           setBackgroundImage(data.props.imageurl);
//           setFontFamily(data.props.fontfamily ?? "Cormorant Garamond, serif");
//           setFontColor(data.props.fontcolor ?? "white");
//           setFontSize(data.props.fontsize ?? 1);
//           setDuration(data.props.duration);
//         })
//         .catch((err) => console.error("❌ Project load failed:", err))
//         .finally(() => setIsLoading(false));
//     }
//   }, [id]);

//   const cycleBg = () => {
//     if (previewBg === "dark") setPreviewBg("light");
//     else if (previewBg === "light") setPreviewBg("grey");
//     else setPreviewBg("dark");
//   };

//   // Timeline Control Handlers
//   const handleSeek = useCallback((time: number) => {
//     setCurrentTime(time);
//     playerRef.current?.seekToTime(time);
//   }, []);

//   const handlePlayPause = useCallback(() => {
//     if (isPlaying) {
//       playerRef.current?.pause();
//     } else {
//       playerRef.current?.play();
//     }
//   }, [isPlaying]);

//   const handleStop = useCallback(() => {
//     playerRef.current?.pause();
//     playerRef.current?.seekToTime(0);
//     setCurrentTime(0);
//     setIsPlaying(false);
//   }, []);

//   const handleFrameUpdate = useCallback((frame: number) => {
//     const time = frame / FPS;
//     setCurrentTime(time);
//   }, []);

//   const handlePlayingChange = useCallback((playing: boolean) => {
//     setIsPlaying(playing);
//   }, []);

//   const handleAISuggestion = async () => {
//     setIsGenerating(true);
//     try {
//       const response = await fetch(`${backendPrefix}/api/generate-quote`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }
//       const data = await response.json();
//       setAuthor(data.author);
//       setQuote(data.quote);
//       setDuration(quoteSpotlightDurationCalculator(data.quote)); 
//     } catch (error: any) {
//       console.error("error generating ai suggestion");
//       toast.error(error.message);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   useEffect(() => {
//     if (uploadedUrl) {
//       setBackgroundImage(uploadedUrl);
//       setBackgroundSource("upload");
//       fetchUserUploads();
//     }
//   }, [uploadedUrl]);

//   const handleExport = async (format: string) => {
//     setIsExporting(true);
//     try {
//       const response = await fetch(`${backendPrefix}/generatevideo/quotetemplatewchoices`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ quote, author, imageurl: backgroundImage, fontsize: fontSize, fontcolor: fontColor, fontfamily: fontFamily, format, duration }),
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}, message: ${await response.text()}`);
//       }
//       const data = await response.json();
//       setExportUrl(data.url);
//       setShowModal(true);
//     } catch (error) {
//       console.error("Export failed:", error);
//       alert(`Export failed: ${error || "Please try again."}`);
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const [messageIndex, setMessageIndex] = useState(0);
//   const messages = ["⏳ Preparing your template...", "🙇 Sorry for the wait, still working on it...", "🚀 Almost there, thanks for your patience!"];
  
//   useEffect(() => {
//     if (!isLoading) return;
//     const interval = setInterval(() => {
//       setMessageIndex((prev) => (prev + 1) % messages.length);
//     }, 10000); 
//     return () => clearInterval(interval);
//   }, [isLoading]);

//   const {
//     isSaving, showSaveModal, setShowSaveModal, handleSave, saveNewProject,
//   } = useProjectSave({
//     templateId: 1,
//     buildProps: () => ({ quote, author, imageurl: backgroundImage, fontsize: fontSize, fontcolor: fontColor, fontfamily: fontFamily, duration }),
//     videoEndpoint: `${backendPrefix}/generatevideo/quotetemplatewchoices`,
//   });
  
//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f7f7f7" }}>
//       {isLoading && <LoadingOverlay message={messages[messageIndex]} />}

//       <SaveProjectModal open={showSaveModal} onClose={() => setShowSaveModal(false)} onSave={saveNewProject} />
//       {showModal && (
//         <ExportModal
//           showExport={showModal}
//           setShowExport={setShowModal}
//           isExporting={isExporting}
//           exportUrl={exportUrl}
//           onExport={handleExport}
//         />
//       )}
      
//       <TopNavWithSave
//         templateName={templateName}
//         onSave={handleSave}
//         onExport={handleExport}
//         setTemplateName={setTemplateName}
//         onOpenExport={() => setShowModal(true)}
//         template={templateName}
//         isSaving={isSaving}
//       />
      
//       <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         <div style={{ display: "flex", flexDirection: "row", minWidth: `${SIDENAV_WIDTH}px` }}>
//           <SideNavTrial
//             activeSection={activeSection}
//             collapsed={collapsed}
//             setActiveSection={setActiveSection}
//             setCollapsed={setCollapsed}
//           />
//         </div>
        
//         <div style={{ display: "flex", flexDirection: "column", flex: 1, background: "#f0f0f0", overflow: "hidden" }}>
//           <div style={{ display: "flex", flexDirection: "row", flex: 1, overflow: "hidden" }}>
//             {!collapsed && (
//               <div
//                 style={{
//                   flex: 1,
//                   minWidth: `${PROPERTIES_PANEL_WIDTH}px`,
//                   padding: "1rem",
//                   overflowY: "auto",
//                   background: "#fff",
//                   borderRight: "1px solid #eee",
//                   position: "relative",
//                   boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
//                   display: 'flex',
//                   flexDirection: 'column',
//                   gap: '20px'
//                 }}
//               >
//                 <div 
//                   style={{ 
//                     background: '#e0e0e0', 
//                     padding: '20px', 
//                     textAlign: 'center', 
//                     borderRadius: '4px',
//                     minHeight: '200px', 
//                     border: '2px dashed #bbb',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     color: '#666'
//                   }}
//                 >
//                   <h4 style={{ margin: '0 0 10px 0', color: '#444' }}>Upload your Videos/ Images</h4>
//                   {isUploading ? (
//                     <p>Uploading...</p>
//                   ) : (
//                     <>
//                       <input
//                         type="file"
//                         accept="image/*,video/*"
//                         onChange={(e) => {
//                           if (e.target.files && e.target.files.length > 0) {
//                             uploadFile(e.target.files[0]);
//                             setBackgroundSource("upload");
//                             setActiveSection("quote"); 
//                           }
//                         }}
//                         style={{ display: 'none' }}
//                         id="file-upload"
//                       />
//                       <label htmlFor="file-upload" 
//                         style={{ background: '#5cb85c', color: 'white', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9em' }}
//                       >
//                         Choose File
//                       </label>
//                       <p style={{ fontSize: '0.8em', margin: '10px 0 0 0' }}>{backgroundSource === 'upload' ? 'Using custom image' : 'Using default image'}</p>
//                     </>
//                   )}
//                 </div>

//                 {activeSection === "quote" && (
//                   <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//                     <h4 style={{ marginTop: 0, marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Quote Content</h4>
                    
//                     <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>Quote</label>
//                     <textarea
//                       value={quote}
//                       onChange={(e) => setQuote(e.target.value)}
//                       style={{ width: '100%', minHeight: '100px', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '15px', resize: 'none' }}
//                       placeholder="Enter your quote here"
//                     />
                    
//                     <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>Author</label>
//                     <input
//                       type="text"
//                       value={author}
//                       onChange={(e) => setAuthor(e.target.value)}
//                       style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px' }}
//                       placeholder="Enter author name"
//                     />
                    
//                     <div style={{ display: 'flex', gap: '10px' }}>
//                       <button
//                         onClick={handleAISuggestion}
//                         disabled={isGenerating}
//                         style={{ flex: 1, padding: '10px', background: isGenerating ? '#666' : '#222', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
//                       >
//                         {isGenerating ? 'Generating...' : 'Generate Using AI'}
//                       </button>
//                       <button
//                         onClick={handleSave}
//                         disabled={isSaving}
//                         style={{ flex: 1, padding: '10px', background: isSaving ? '#666' : '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
//                       >
//                         Save
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {activeSection === "background" && (
//                   <BackgroundSecTrial
//                     backgroundImage={backgroundImage}
//                     backgroundSource={backgroundSource}
//                     handleFileUpload={uploadFile}
//                     isUploading={isUploading}
//                     setBackgroundImage={setBackgroundImage}
//                     setBackgroundSource={setBackgroundSource}
//                     fetchOnlineImages={fetchOnlineImages}
//                     loadingOnline={loadingOnline}
//                     loadingUploads={loadingUploads}
//                     onlineImages={onlineImages}
//                     searchQuery={searchQuery}
//                     setSearchQuery={setSearchQuery}
//                     userUploads={userUploads}
//                   />
//                 )}
//                 {activeSection === "typography" && (
//                   <TypographySectionQuote
//                     fontColor={fontColor}
//                     fontFamily={fontFamily}
//                     fontSize={fontSize}
//                     setFontColor={setFontColor}
//                     setFontFamily={setFontFamily}
//                     setFontSize={setFontSize}
//                   />
//                 )}
//                 {activeSection === "ai" && (
//                   <div style={{ padding: '1rem', border: '1px dashed #ccc', textAlign: 'center' }}>
//                     **AI Content Generation** (Future Feature)
//                     <p style={{ fontSize: '0.9em', color: '#666' }}>Controls for generating quotes or images will appear here.</p>
//                   </div>
//                 )}
//               </div>
//             )}
          
//             <div 
//               style={{ 
//                 flex: 1,
//                 minWidth: '400px', 
//                 display: "flex", 
//                 alignItems: "center", 
//                 justifyContent: "center",
//                 overflow: "auto",
//                 padding: "20px", 
//                 background: "#2c3e50" 
//               }}
//             >
//               <div style={{ background: "#222", display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', borderRadius: '4px', overflow: 'hidden' }}>
//                 <QuoteSpotlightPreview
//                   ref={playerRef}
//                   quote={quote}
//                   author={author}
//                   backgroundImage={backgroundImage}
//                   fontSize={fontSize}
//                   fontFamily={fontFamily}
//                   fontColor={fontColor}
//                   showSafeMargins={showSafeMargins}
//                   previewBg={previewBg}
//                   cycleBg={cycleBg}
//                   previewScale={previewSize}
//                   onPreviewScaleChange={setPreviewSize}
//                   onToggleSafeMargins={setShowSafeMargins}
//                   duration={duration}
//                   onFrameUpdate={handleFrameUpdate}
//                   onPlayingChange={handlePlayingChange}
//                   tracks={tracks}
//                 />
//               </div>
//             </div>
//           </div>

//           <InteractiveTimeline 
//             duration={duration} 
//             setDuration={setDuration}
//             quote={quote}
//             currentTime={currentTime}
//             isPlaying={isPlaying}
//             onSeek={handleSeek}
//             onPlayPause={handlePlayPause}
//             onStop={handleStop}
//             tracks={tracks}
//             setTracks={setTracks}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };




// import React, { useState, useRef, useEffect, useCallback, type JSX } from "react";
// import { QuoteSpotlightPreview } from "../../layout/EditorPreviews/QuoteTemplatePreview";
// import { TypographySectionQuote } from "./sidenav_sections/Typo";
// import { BackgroundSecTrial } from "../Global/sidenav_sections/Backgrounds";
// import { SideNavTrial } from "./Sidenav";
// import { TopNavWithSave } from "../../navigations/single_editors/WithSave";
// import { ExportModal } from "../../ui/modals/ExportModal";
// import { SaveProjectModal } from "../../ui/modals/SaveModal";
// import { LoadingOverlay } from "../../ui/modals/LoadingProjectModal";
// import { useProjectSave } from "../../../hooks/SaveProject";
// import { backendPrefix } from "../../../config";
// import toast from "react-hot-toast";
// import { useBackgroundImages } from "../../../hooks/datafetching/UserImagesAndOnlineImages";
// import { useFileUpload } from "../../../hooks/uploads/HandleImageUpload";
// import { useParams } from "react-router-dom";

// // ============================================
// // TYPE DEFINITIONS
// // ============================================

// interface Clip {
//   id: string;
//   start: number;
//   duration: number;
//   name: string;
//   color: string;
//   type?: "video" | "text" | "audio" | "effect";
// }

// interface Track {
//   id: string;
//   name: string;
//   color: string;
//   clips: Clip[];
//   type: "video" | "text" | "audio" | "effect";
//   muted?: boolean;
//   locked?: boolean;
//   visible?: boolean;
// }

// interface PlayerHandle {
//   play: () => void;
//   pause: () => void;
//   toggle: () => void;
//   seekTo: (frame: number) => void;
//   seekToTime: (timeInSeconds: number) => void;
//   getCurrentFrame: () => number;
//   isPlaying: () => boolean;
// }

// interface InteractiveTimelineProps {
//   duration: number;
//   setDuration: (d: number) => void;
//   quote: string;
//   currentTime: number;
//   isPlaying: boolean;
//   onSeek: (time: number) => void;
//   onPlayPause: () => void;
//   onStop: () => void;
//   tracks: Track[];
//   setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
// }

// interface ClipComponentProps {
//   clip: Clip;
//   trackId: string;
//   pixelsPerSecond: number;
//   selectedClip: string | null;
//   setSelectedClip: (id: string | null) => void;
//   handleClipDrag: (trackId: string, clipId: string, deltaX: number) => void;
//   handleClipResize: (trackId: string, clipId: string, edge: "left" | "right", deltaX: number) => void;
// }

// // ============================================
// // HELPER FUNCTIONS
// // ============================================

// const quoteSpotlightDurationCalculator = (quote: string): number => {
//   let length = 0;
//   if (typeof quote === "string") {
//     length = quote.length;
//   } else if (typeof quote === "number" && isFinite(quote)) {
//     length = quote;
//   }
//   return 2.0 + Math.floor(length / 10) * 0.1;
// };

// const formatTimeCode = (time: number): string => {
//   const minutes = Math.floor(time / 60);
//   const seconds = Math.floor(time % 60);
//   const frames = Math.floor((time % 1) * 30);
//   return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`;
// };

// // ============================================
// // CONSTANTS
// // ============================================

// const PROPERTIES_PANEL_WIDTH = 320;
// const SIDENAV_WIDTH = 72;
// const HORIZONTAL_TIMELINE_HEIGHT = 280;
// const TRACK_HEIGHT = 56;
// const RULER_HEIGHT = 36;
// const CONTROLS_HEIGHT = 56;
// const MAX_DURATION = 60;
// const MIN_DURATION = 1;
// const FPS = 30;

// // ============================================
// // ICON COMPONENTS
// // ============================================

// const PlayIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M8 5v14l11-7z" />
//   </svg>
// );

// const PauseIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
//   </svg>
// );

// const StopIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M6 6h12v12H6z" />
//   </svg>
// );

// const SkipBackIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
//   </svg>
// );

// const SkipForwardIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M6 18l8.5-6L6 6v12zm10.5-12v12h2V6z" />
//   </svg>
// );

// const ScissorsIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="6" cy="6" r="3" />
//     <circle cx="6" cy="18" r="3" />
//     <line x1="20" y1="4" x2="8.12" y2="15.88" />
//     <line x1="14.47" y1="14.48" x2="20" y2="20" />
//     <line x1="8.12" y1="8.12" x2="12" y2="12" />
//   </svg>
// );

// const TrashIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <polyline points="3,6 5,6 21,6" />
//     <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" />
//   </svg>
// );

// const PlusIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//     <line x1="12" y1="5" x2="12" y2="19" />
//     <line x1="5" y1="12" x2="19" y2="12" />
//   </svg>
// );

// const EyeIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//     <circle cx="12" cy="12" r="3" />
//   </svg>
// );

// const LockIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
//     <path d="M7 11V7a5 5 0 0110 0v4" />
//   </svg>
// );

// const VolumeIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
//     <path d="M15.54 8.46a5 5 0 010 7.07" />
//   </svg>
// );

// const MuteIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
//     <line x1="23" y1="9" x2="17" y2="15" />
//     <line x1="17" y1="9" x2="23" y2="15" />
//   </svg>
// );

// const ZoomInIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="11" cy="11" r="8" />
//     <line x1="21" y1="21" x2="16.65" y2="16.65" />
//     <line x1="11" y1="8" x2="11" y2="14" />
//     <line x1="8" y1="11" x2="14" y2="11" />
//   </svg>
// );

// const ZoomOutIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="11" cy="11" r="8" />
//     <line x1="21" y1="21" x2="16.65" y2="16.65" />
//     <line x1="8" y1="11" x2="14" y2="11" />
//   </svg>
// );

// const SparkleIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
//   </svg>
// );

// const VideoIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <rect x="2" y="4" width="20" height="16" rx="2" />
//     <path d="M10 9l5 3-5 3V9z" />
//   </svg>
// );

// const TextIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <polyline points="4,7 4,4 20,4 20,7" />
//     <line x1="9" y1="20" x2="15" y2="20" />
//     <line x1="12" y1="4" x2="12" y2="20" />
//   </svg>
// );

// // ============================================
// // CLIP COMPONENT
// // ============================================

// const ClipComponent: React.FC<ClipComponentProps> = ({
//   clip,
//   trackId,
//   pixelsPerSecond,
//   selectedClip,
//   setSelectedClip,
//   handleClipDrag,
//   handleClipResize,
// }) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [isResizing, setIsResizing] = useState<"left" | "right" | null>(null);
//   const [dragStart, setDragStart] = useState({ x: 0 });
//   const [isHovered, setIsHovered] = useState(false);

//   const handleMouseDown = (e: React.MouseEvent, action: "drag" | "left" | "right") => {
//     e.stopPropagation();
//     setSelectedClip(clip.id);
//     if (action === "drag") {
//       setIsDragging(true);
//     } else {
//       setIsResizing(action);
//     }
//     setDragStart({ x: e.clientX });
//   };

//   useEffect(() => {
//     if (!isDragging && !isResizing) return;

//     const handleMouseMove = (e: MouseEvent) => {
//       const deltaX = e.clientX - dragStart.x;
//       if (isDragging) {
//         handleClipDrag(trackId, clip.id, deltaX);
//       } else if (isResizing) {
//         handleClipResize(trackId, clip.id, isResizing, deltaX);
//       }
//       setDragStart({ x: e.clientX });
//     };

//     const handleMouseUp = () => {
//       setIsDragging(false);
//       setIsResizing(null);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDragging, isResizing, dragStart, trackId, clip.id, handleClipDrag, handleClipResize]);

//   const isSelected = selectedClip === clip.id;
//   const clipWidth = Math.max(clip.duration * pixelsPerSecond, 40);

//   return (
//     <div
//       style={{
//         position: "absolute",
//         left: `${clip.start * pixelsPerSecond}px`,
//         width: `${clipWidth}px`,
//         height: "calc(100% - 8px)",
//         top: "4px",
//         background: isSelected
//           ? `linear-gradient(180deg, ${clip.color} 0%, ${clip.color}cc 100%)`
//           : `linear-gradient(180deg, ${clip.color}dd 0%, ${clip.color}99 100%)`,
//         borderRadius: "4px",
//         border: isSelected ? "2px solid #00d4ff" : "1px solid rgba(255,255,255,0.15)",
//         boxShadow: isSelected
//           ? "0 0 0 1px rgba(0,212,255,0.5), 0 4px 12px rgba(0,0,0,0.4)"
//           : isHovered
//             ? "0 2px 8px rgba(0,0,0,0.3)"
//             : "none",
//         cursor: isDragging ? "grabbing" : "grab",
//         display: "flex",
//         alignItems: "center",
//         overflow: "hidden",
//         userSelect: "none",
//         transition: "box-shadow 0.15s ease, border 0.15s ease",
//       }}
//       onClick={(e) => {
//         e.stopPropagation();
//         setSelectedClip(clip.id);
//       }}
//       onMouseDown={(e) => handleMouseDown(e, "drag")}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Left resize handle */}
//       <div
//         style={{
//           position: "absolute",
//           left: 0,
//           top: 0,
//           width: "8px",
//           height: "100%",
//           cursor: "ew-resize",
//           background: isHovered || isSelected ? "rgba(255,255,255,0.2)" : "transparent",
//           borderRadius: "4px 0 0 4px",
//           transition: "background 0.15s ease",
//         }}
//         onMouseDown={(e) => handleMouseDown(e, "left")}
//       />

//       {/* Clip content */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           alignItems: "center",
//           padding: "0 12px",
//           gap: "6px",
//           pointerEvents: "none",
//         }}
//       >
//         {clip.type === "video" ? <VideoIcon /> : <TextIcon />}
//         <span
//           style={{
//             color: "#fff",
//             fontSize: "11px",
//             fontWeight: 600,
//             whiteSpace: "nowrap",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             textShadow: "0 1px 2px rgba(0,0,0,0.5)",
//             letterSpacing: "0.2px",
//           }}
//         >
//           {clip.name}
//         </span>
//         <span
//           style={{
//             color: "rgba(255,255,255,0.7)",
//             fontSize: "10px",
//             fontWeight: 500,
//             marginLeft: "auto",
//           }}
//         >
//           {clip.duration.toFixed(1)}s
//         </span>
//       </div>

//       {/* Waveform/thumbnail representation */}
//       <div
//         style={{
//           position: "absolute",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: "12px",
//           background: "rgba(0,0,0,0.2)",
//           display: "flex",
//           alignItems: "flex-end",
//           gap: "1px",
//           padding: "0 2px",
//           pointerEvents: "none",
//         }}
//       >
//         {Array.from({ length: Math.min(Math.floor(clipWidth / 4), 50) }).map((_, i) => (
//           <div
//             key={i}
//             style={{
//               flex: 1,
//               height: `${Math.random() * 8 + 2}px`,
//               background: "rgba(255,255,255,0.3)",
//               borderRadius: "1px 1px 0 0",
//             }}
//           />
//         ))}
//       </div>

//       {/* Right resize handle */}
//       <div
//         style={{
//           position: "absolute",
//           right: 0,
//           top: 0,
//           width: "8px",
//           height: "100%",
//           cursor: "ew-resize",
//           background: isHovered || isSelected ? "rgba(255,255,255,0.2)" : "transparent",
//           borderRadius: "0 4px 4px 0",
//           transition: "background 0.15s ease",
//         }}
//         onMouseDown={(e) => handleMouseDown(e, "right")}
//       />
//     </div>
//   );
// };

// // ============================================
// // TRACK HEADER COMPONENT
// // ============================================

// interface TrackHeaderProps {
//   track: Track;
//   onAddClip: () => void;
//   onRemove: () => void;
//   onToggleMute: () => void;
//   onToggleLock: () => void;
//   onToggleVisibility: () => void;
//   canRemove: boolean;
// }

// const TrackHeader: React.FC<TrackHeaderProps> = ({
//   track,
//   onAddClip,
//   onRemove,
//   onToggleMute,
//   onToggleLock,
//   onToggleVisibility,
//   canRemove,
// }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       style={{
//         height: `${TRACK_HEIGHT}px`,
//         display: "flex",
//         alignItems: "center",
//         padding: "0 12px",
//         borderBottom: "1px solid #1a1a2e",
//         background: isHovered ? "#1e2a45" : "#171c2e",
//         transition: "background 0.15s ease",
//       }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Track color indicator */}
//       <div
//         style={{
//           width: "4px",
//           height: "32px",
//           background: track.color,
//           borderRadius: "2px",
//           marginRight: "10px",
//         }}
//       />

//       {/* Track info */}
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div
//           style={{
//             color: "#fff",
//             fontSize: "12px",
//             fontWeight: 600,
//             whiteSpace: "nowrap",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//           }}
//         >
//           {track.name}
//         </div>
//         <div style={{ color: "#6b7a99", fontSize: "10px", textTransform: "uppercase" }}>
//           {track.type}
//         </div>
//       </div>

//       {/* Track controls */}
//       <div style={{ display: "flex", gap: "4px", opacity: isHovered ? 1 : 0.6, transition: "opacity 0.15s ease" }}>
//         <button
//           onClick={onToggleVisibility}
//           style={{
//             width: "24px",
//             height: "24px",
//             background: track.visible === false ? "rgba(255,255,255,0.1)" : "transparent",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             color: track.visible === false ? "#ff6b6b" : "#6b7a99",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           title={track.visible === false ? "Show track" : "Hide track"}
//         >
//           <EyeIcon />
//         </button>
//         <button
//           onClick={onToggleMute}
//           style={{
//             width: "24px",
//             height: "24px",
//             background: track.muted ? "rgba(255,255,255,0.1)" : "transparent",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             color: track.muted ? "#ff6b6b" : "#6b7a99",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           title={track.muted ? "Unmute" : "Mute"}
//         >
//           {track.muted ? <MuteIcon /> : <VolumeIcon />}
//         </button>
//         <button
//           onClick={onToggleLock}
//           style={{
//             width: "24px",
//             height: "24px",
//             background: track.locked ? "rgba(255,255,255,0.1)" : "transparent",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             color: track.locked ? "#ffd93d" : "#6b7a99",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           title={track.locked ? "Unlock" : "Lock"}
//         >
//           <LockIcon />
//         </button>
//         <button
//           onClick={onAddClip}
//           style={{
//             width: "24px",
//             height: "24px",
//             background: "transparent",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             color: "#00d4ff",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           title="Add clip"
//         >
//           <PlusIcon />
//         </button>
//         {canRemove && (
//           <button
//             onClick={onRemove}
//             style={{
//               width: "24px",
//               height: "24px",
//               background: "transparent",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//               color: "#ff6b6b",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//             title="Remove track"
//           >
//             <TrashIcon />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// // ============================================
// // INTERACTIVE TIMELINE COMPONENT
// // ============================================

// const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
//   duration,
//   setDuration,
//   quote,
//   currentTime,
//   isPlaying,
//   onSeek,
//   onPlayPause,
//   onStop,
//   tracks,
//   setTracks,
// }) => {
//   const [zoom, setZoom] = useState(1);
//   const [selectedClip, setSelectedClip] = useState<string | null>(null);
//   const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
//   const timelineRef = useRef<HTMLDivElement>(null);
//   const pixelsPerSecond = 60 * zoom;

//   useEffect(() => {
//     const textClipDuration = Math.min(quoteSpotlightDurationCalculator(quote), duration);
//     setTracks((prev) =>
//       prev.map((track) =>
//         track.id === "track-2"
//           ? {
//               ...track,
//               clips: track.clips.map((clip, idx) =>
//                 idx === 0 ? { ...clip, duration: textClipDuration } : clip
//               ),
//             }
//           : track
//       )
//     );
//   }, [quote, duration, setTracks]);

//   useEffect(() => {
//     setTracks((prev) =>
//       prev.map((track) =>
//         track.id === "track-1"
//           ? {
//               ...track,
//               clips: track.clips.map((clip, idx) =>
//                 idx === 0 ? { ...clip, duration: duration } : clip
//               ),
//             }
//           : track
//       )
//     );
//   }, [duration, setTracks]);

//   const handleTimelineClick = useCallback(
//     (e: React.MouseEvent) => {
//       if (!timelineRef.current || selectedClip) return;
//       const rect = timelineRef.current.getBoundingClientRect();
//       const scrollLeft = timelineRef.current.scrollLeft;
//       const x = e.clientX - rect.left + scrollLeft;
//       const time = Math.max(0, Math.min(duration, x / pixelsPerSecond));
//       onSeek(time);
//     },
//     [duration, pixelsPerSecond, selectedClip, onSeek]
//   );

//   const handlePlayheadMouseDown = useCallback((e: React.MouseEvent) => {
//     e.stopPropagation();
//     setIsDraggingPlayhead(true);
//   }, []);

//   useEffect(() => {
//     if (!isDraggingPlayhead) return;

//     const handleMouseMove = (e: MouseEvent) => {
//       if (!timelineRef.current) return;
//       const rect = timelineRef.current.getBoundingClientRect();
//       const scrollLeft = timelineRef.current.scrollLeft;
//       const x = e.clientX - rect.left + scrollLeft;
//       const time = Math.max(0, Math.min(duration, x / pixelsPerSecond));
//       onSeek(time);
//     };

//     const handleMouseUp = () => setIsDraggingPlayhead(false);

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDraggingPlayhead, duration, pixelsPerSecond, onSeek]);

//   const handleClipResize = useCallback(
//     (trackId: string, clipId: string, edge: "left" | "right", deltaX: number) => {
//       setTracks((prev) =>
//         prev.map((track) => {
//           if (track.id !== trackId || track.locked) return track;
//           return {
//             ...track,
//             clips: track.clips.map((clip) => {
//               if (clip.id !== clipId) return clip;
//               const deltaTime = deltaX / pixelsPerSecond;
//               if (edge === "left") {
//                 const newStart = Math.max(0, clip.start + deltaTime);
//                 const newDuration = clip.duration - (newStart - clip.start);
//                 if (newDuration < 0.5) return clip;
//                 return { ...clip, start: newStart, duration: newDuration };
//               } else {
//                 const newDuration = Math.max(0.5, clip.duration + deltaTime);
//                 if (clip.start + newDuration > MAX_DURATION) return clip;
//                 return { ...clip, duration: newDuration };
//               }
//             }),
//           };
//         })
//       );
//     },
//     [pixelsPerSecond, setTracks]
//   );

//   const handleClipDrag = useCallback(
//     (trackId: string, clipId: string, deltaX: number) => {
//       setTracks((prev) =>
//         prev.map((track) => {
//           if (track.id !== trackId || track.locked) return track;
//           return {
//             ...track,
//             clips: track.clips.map((clip) => {
//               if (clip.id !== clipId) return clip;
//               const deltaTime = deltaX / pixelsPerSecond;
//               const newStart = Math.max(
//                 0,
//                 Math.min(MAX_DURATION - clip.duration, clip.start + deltaTime)
//               );
//               return { ...clip, start: newStart };
//             }),
//           };
//         })
//       );
//     },
//     [pixelsPerSecond, setTracks]
//   );

//   const addTrack = () => {
//     const colors = ["#e74c3c", "#9b59b6", "#f39c12", "#1abc9c", "#34495e", "#e91e63", "#00bcd4"];
//     const types: Track["type"][] = ["video", "text", "audio", "effect"];
//     setTracks((prev) => [
//       ...prev,
//       {
//         id: `track-${Date.now()}`,
//         name: `Track ${prev.length + 1}`,
//         color: colors[prev.length % colors.length],
//         clips: [],
//         type: types[prev.length % types.length],
//         muted: false,
//         locked: false,
//         visible: true,
//       },
//     ]);
//   };

//   const removeTrack = (trackId: string) => {
//     if (tracks.length <= 1) return;
//     setTracks((prev) => prev.filter((t) => t.id !== trackId));
//   };

//   const toggleTrackMute = (trackId: string) => {
//     setTracks((prev) =>
//       prev.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t))
//     );
//   };

//   const toggleTrackLock = (trackId: string) => {
//     setTracks((prev) =>
//       prev.map((t) => (t.id === trackId ? { ...t, locked: !t.locked } : t))
//     );
//   };

//   const toggleTrackVisibility = (trackId: string) => {
//     setTracks((prev) =>
//       prev.map((t) => (t.id === trackId ? { ...t, visible: t.visible === false } : t))
//     );
//   };

//   const addClipToTrack = (trackId: string) => {
//     setTracks((prev) =>
//       prev.map((track) => {
//         if (track.id !== trackId || track.locked) return track;
//         const lastClip = track.clips[track.clips.length - 1];
//         const startTime = lastClip ? lastClip.start + lastClip.duration + 0.5 : 0;
//         if (startTime >= MAX_DURATION) return track;
//         return {
//           ...track,
//           clips: [
//             ...track.clips,
//             {
//               id: `clip-${Date.now()}`,
//               start: startTime,
//               duration: Math.min(3, MAX_DURATION - startTime),
//               name: `Clip ${track.clips.length + 1}`,
//               color: track.color,
//               type: track.type,
//             },
//           ],
//         };
//       })
//     );
//   };

//   const deleteSelectedClip = () => {
//     if (!selectedClip) return;
//     setTracks((prev) =>
//       prev.map((track) => ({
//         ...track,
//         clips: track.clips.filter((c) => c.id !== selectedClip),
//       }))
//     );
//     setSelectedClip(null);
//   };

//   const splitClipAtPlayhead = () => {
//     setTracks((prev) =>
//       prev.map((track) => {
//         if (track.locked) return track;
//         const newClips: Clip[] = [];
//         track.clips.forEach((clip) => {
//           const clipEnd = clip.start + clip.duration;
//           if (currentTime > clip.start && currentTime < clipEnd) {
//             newClips.push({ ...clip, duration: currentTime - clip.start });
//             newClips.push({
//               ...clip,
//               id: `clip-${Date.now()}-split`,
//               start: currentTime,
//               duration: clipEnd - currentTime,
//               name: `${clip.name} (B)`,
//             });
//           } else {
//             newClips.push(clip);
//           }
//         });
//         return { ...track, clips: newClips };
//       })
//     );
//   };

//   const renderRuler = () => {
//     const marks: JSX.Element[] = [];
//     const majorInterval = zoom >= 2 ? 1 : zoom >= 1 ? 2 : 5;
//     const minorInterval = majorInterval / 5;

//     for (let t = 0; t <= Math.ceil(duration) + 5; t += minorInterval) {
//       const isMajor = Math.abs(t % majorInterval) < 0.001 || Math.abs((t % majorInterval) - majorInterval) < 0.001;
//       marks.push(
//         <div
//           key={t}
//           style={{
//             position: "absolute",
//             left: `${t * pixelsPerSecond}px`,
//             height: isMajor ? "14px" : "6px",
//             width: "1px",
//             background: isMajor ? "#5a6a8a" : "#2a3a5a",
//             bottom: 0,
//           }}
//         >
//           {isMajor && (
//             <span
//               style={{
//                 position: "absolute",
//                 bottom: "16px",
//                 left: "-18px",
//                 width: "36px",
//                 textAlign: "center",
//                 fontSize: "10px",
//                 color: "#7a8a9a",
//                 fontWeight: 500,
//                 fontFamily: "'JetBrains Mono', monospace",
//               }}
//             >
//               {t.toFixed(0)}s
//             </span>
//           )}
//         </div>
//       );
//     }
//     return marks;
//   };

//   const timelineContentWidth = Math.max(1200, (duration + 10) * pixelsPerSecond);

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: `${HORIZONTAL_TIMELINE_HEIGHT}px`,
//         minHeight: `${HORIZONTAL_TIMELINE_HEIGHT}px`,
//         background: "#0d1117",
//         borderTop: "1px solid #21262d",
//         display: "flex",
//         flexDirection: "column",
//         userSelect: "none",
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       }}
//     >
//       {/* Transport Controls */}
//       <div
//         style={{
//           height: `${CONTROLS_HEIGHT}px`,
//           background: "linear-gradient(180deg, #161b22 0%, #0d1117 100%)",
//           display: "flex",
//           alignItems: "center",
//           padding: "0 16px",
//           gap: "8px",
//           borderBottom: "1px solid #21262d",
//         }}
//       >
//         {/* Playback controls */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "4px",
//             background: "#21262d",
//             borderRadius: "8px",
//             padding: "4px",
//           }}
//         >
//           <button
//             onClick={() => onSeek(0)}
//             style={{
//               width: "32px",
//               height: "32px",
//               background: "transparent",
//               border: "none",
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: "#c9d1d9",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               transition: "background 0.15s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.background = "#30363d")}
//             onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//             title="Go to start"
//           >
//             <SkipBackIcon />
//           </button>
//           <button
//             onClick={onPlayPause}
//             style={{
//               width: "40px",
//               height: "40px",
//               background: isPlaying
//                 ? "linear-gradient(180deg, #ff6b6b 0%, #ee5253 100%)"
//                 : "linear-gradient(180deg, #00d4ff 0%, #00a8cc 100%)",
//               border: "none",
//               borderRadius: "8px",
//               cursor: "pointer",
//               color: "#fff",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               boxShadow: isPlaying
//                 ? "0 2px 8px rgba(255, 107, 107, 0.4)"
//                 : "0 2px 8px rgba(0, 212, 255, 0.4)",
//               transition: "transform 0.1s ease",
//             }}
//             onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
//             onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
//             onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//             title={isPlaying ? "Pause" : "Play"}
//           >
//             {isPlaying ? <PauseIcon /> : <PlayIcon />}
//           </button>
//           <button
//             onClick={onStop}
//             style={{
//               width: "32px",
//               height: "32px",
//               background: "transparent",
//               border: "none",
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: "#c9d1d9",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               transition: "background 0.15s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.background = "#30363d")}
//             onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//             title="Stop"
//           >
//             <StopIcon />
//           </button>
//           <button
//             onClick={() => onSeek(duration)}
//             style={{
//               width: "32px",
//               height: "32px",
//               background: "transparent",
//               border: "none",
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: "#c9d1d9",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               transition: "background 0.15s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.background = "#30363d")}
//             onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//             title="Go to end"
//           >
//             <SkipForwardIcon />
//           </button>
//         </div>

//         {/* Timecode display */}
//         <div
//           style={{
//             background: "#000",
//             padding: "8px 16px",
//             borderRadius: "6px",
//             fontFamily: "'JetBrains Mono', monospace",
//             fontSize: "14px",
//             color: "#00d4ff",
//             minWidth: "110px",
//             textAlign: "center",
//             border: "1px solid #21262d",
//             letterSpacing: "0.5px",
//           }}
//         >
//           {formatTimeCode(currentTime)}
//         </div>

//         {/* Divider */}
//         <div style={{ width: "1px", height: "24px", background: "#30363d" }} />

//         {/* Edit controls */}
//         <div style={{ display: "flex", gap: "4px" }}>
//           <button
//             onClick={splitClipAtPlayhead}
//             style={{
//               height: "32px",
//               padding: "0 12px",
//               background: "#21262d",
//               border: "1px solid #30363d",
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: "#c9d1d9",
//               fontSize: "12px",
//               fontWeight: 500,
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//               transition: "all 0.15s ease",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#30363d";
//               e.currentTarget.style.borderColor = "#8b949e";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#21262d";
//               e.currentTarget.style.borderColor = "#30363d";
//             }}
//             title="Split clip at playhead (S)"
//           >
//             <ScissorsIcon />
//             Split
//           </button>
//           <button
//             onClick={deleteSelectedClip}
//             disabled={!selectedClip}
//             style={{
//               height: "32px",
//               padding: "0 12px",
//               background: selectedClip ? "#21262d" : "#161b22",
//               border: `1px solid ${selectedClip ? "#ff6b6b" : "#21262d"}`,
//               borderRadius: "6px",
//               cursor: selectedClip ? "pointer" : "not-allowed",
//               color: selectedClip ? "#ff6b6b" : "#484f58",
//               fontSize: "12px",
//               fontWeight: 500,
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//               transition: "all 0.15s ease",
//               opacity: selectedClip ? 1 : 0.5,
//             }}
//             title="Delete selected clip (Del)"
//           >
//             <TrashIcon />
//             Delete
//           </button>
//           <button
//             onClick={addTrack}
//             style={{
//               height: "32px",
//               padding: "0 12px",
//               background: "#21262d",
//               border: "1px solid #30363d",
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: "#58a6ff",
//               fontSize: "12px",
//               fontWeight: 500,
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//               transition: "all 0.15s ease",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#30363d";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#21262d";
//             }}
//             title="Add new track"
//           >
//             <PlusIcon />
//             Track
//           </button>
//         </div>

//         {/* Divider */}
//         <div style={{ width: "1px", height: "24px", background: "#30363d" }} />

//         {/* Zoom controls */}
//         <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//           <button
//             onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
//             style={{
//               width: "28px",
//               height: "28px",
//               background: "#21262d",
//               border: "1px solid #30363d",
//               borderRadius: "4px",
//               cursor: "pointer",
//               color: "#c9d1d9",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <ZoomOutIcon />
//           </button>
//           <div
//             style={{
//               background: "#21262d",
//               borderRadius: "4px",
//               padding: "4px 8px",
//               minWidth: "50px",
//               textAlign: "center",
//             }}
//           >
//             <span style={{ color: "#c9d1d9", fontSize: "11px", fontWeight: 500 }}>
//               {(zoom * 100).toFixed(0)}%
//             </span>
//           </div>
//           <button
//             onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
//             style={{
//               width: "28px",
//               height: "28px",
//               background: "#21262d",
//               border: "1px solid #30363d",
//               borderRadius: "4px",
//               cursor: "pointer",
//               color: "#c9d1d9",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <ZoomInIcon />
//           </button>
//         </div>

//         {/* Duration control - right side */}
//         <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
//           <span style={{ color: "#6e7681", fontSize: "12px", fontWeight: 500 }}>Duration</span>
//           <input
//             type="number"
//             value={duration.toFixed(1)}
//             onChange={(e) => {
//               let val = parseFloat(e.target.value);
//               if (isNaN(val)) val = MIN_DURATION;
//               setDuration(Math.max(MIN_DURATION, Math.min(MAX_DURATION, val)));
//             }}
//             step="0.5"
//             min={MIN_DURATION}
//             max={MAX_DURATION}
//             style={{
//               width: "70px",
//               background: "#0d1117",
//               color: "#c9d1d9",
//               border: "1px solid #30363d",
//               borderRadius: "6px",
//               padding: "6px 10px",
//               fontSize: "12px",
//               fontFamily: "'JetBrains Mono', monospace",
//               textAlign: "center",
//             }}
//           />
//           <span style={{ color: "#6e7681", fontSize: "12px" }}>sec</span>
//         </div>
//       </div>

//       {/* Timeline area */}
//       <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         {/* Track headers */}
//         <div
//           style={{
//             width: "180px",
//             minWidth: "180px",
//             background: "#0d1117",
//             borderRight: "1px solid #21262d",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <div
//             style={{
//               height: `${RULER_HEIGHT}px`,
//               borderBottom: "1px solid #21262d",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "#6e7681",
//               fontSize: "10px",
//               fontWeight: 600,
//               letterSpacing: "1px",
//               textTransform: "uppercase",
//             }}
//           >
//             Tracks
//           </div>

//           <div style={{ flex: 1, overflowY: "auto" }}>
//             {tracks.map((track) => (
//               <TrackHeader
//                 key={track.id}
//                 track={track}
//                 onAddClip={() => addClipToTrack(track.id)}
//                 onRemove={() => removeTrack(track.id)}
//                 onToggleMute={() => toggleTrackMute(track.id)}
//                 onToggleLock={() => toggleTrackLock(track.id)}
//                 onToggleVisibility={() => toggleTrackVisibility(track.id)}
//                 canRemove={tracks.length > 1}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Timeline content */}
//         <div
//           ref={timelineRef}
//           style={{ flex: 1, overflowX: "auto", overflowY: "hidden", position: "relative" }}
//           onClick={handleTimelineClick}
//         >
//           <div style={{ minWidth: `${timelineContentWidth}px`, position: "relative" }}>
//             {/* Ruler */}
//             <div
//               style={{
//                 height: `${RULER_HEIGHT}px`,
//                 background: "#161b22",
//                 position: "relative",
//                 borderBottom: "1px solid #21262d",
//               }}
//             >
//               {renderRuler()}
//             </div>

//             {/* Tracks */}
//             {tracks.map((track, i) => (
//               <div
//                 key={track.id}
//                 style={{
//                   height: `${TRACK_HEIGHT}px`,
//                   background: i % 2 === 0 ? "#0d1117" : "#161b22",
//                   borderBottom: "1px solid #21262d",
//                   position: "relative",
//                   opacity: track.visible === false ? 0.4 : 1,
//                 }}
//               >
//                 {/* Track grid lines */}
//                 <div
//                   style={{
//                     position: "absolute",
//                     inset: 0,
//                     backgroundImage: `repeating-linear-gradient(90deg, #21262d 0px, #21262d 1px, transparent 1px, transparent ${pixelsPerSecond}px)`,
//                     pointerEvents: "none",
//                   }}
//                 />

//                 {/* Clips */}
//                 {track.clips.map((clip) => (
//                   <ClipComponent
//                     key={clip.id}
//                     clip={clip}
//                     trackId={track.id}
//                     pixelsPerSecond={pixelsPerSecond}
//                     selectedClip={selectedClip}
//                     setSelectedClip={setSelectedClip}
//                     handleClipDrag={handleClipDrag}
//                     handleClipResize={handleClipResize}
//                   />
//                 ))}
//               </div>
//             ))}

//             {/* Playhead */}
//             <div
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 left: `${currentTime * pixelsPerSecond}px`,
//                 width: "2px",
//                 height: "100%",
//                 background: "#00d4ff",
//                 zIndex: 100,
//                 pointerEvents: "none",
//                 boxShadow: "0 0 8px rgba(0, 212, 255, 0.6), 0 0 16px rgba(0, 212, 255, 0.3)",
//               }}
//             >
//               {/* Playhead handle */}
//               <div
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: "-8px",
//                   width: "18px",
//                   height: "18px",
//                   background: "#00d4ff",
//                   borderRadius: "0 0 50% 50%",
//                   cursor: "ew-resize",
//                   pointerEvents: "auto",
//                   boxShadow: "0 2px 6px rgba(0, 212, 255, 0.5)",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//                 onMouseDown={handlePlayheadMouseDown}
//               >
//                 <div
//                   style={{
//                     width: "4px",
//                     height: "4px",
//                     background: "#fff",
//                     borderRadius: "50%",
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============================================
// // SIDEBAR PANEL COMPONENT
// // ============================================

// interface SidebarPanelProps {
//   title: string;
//   children: React.ReactNode;
//   icon?: React.ReactNode;
// }

// const SidebarPanel: React.FC<SidebarPanelProps> = ({ title, children, icon }) => (
//   <div
//     style={{
//       background: "#161b22",
//       borderRadius: "12px",
//       border: "1px solid #21262d",
//       overflow: "hidden",
//     }}
//   >
//     <div
//       style={{
//         padding: "14px 16px",
//         borderBottom: "1px solid #21262d",
//         display: "flex",
//         alignItems: "center",
//         gap: "10px",
//         background: "linear-gradient(180deg, #1f2937 0%, #161b22 100%)",
//       }}
//     >
//       {icon && <span style={{ color: "#00d4ff" }}>{icon}</span>}
//       <h3
//         style={{
//           margin: 0,
//           fontSize: "13px",
//           fontWeight: 600,
//           color: "#e6edf3",
//           letterSpacing: "0.3px",
//         }}
//       >
//         {title}
//       </h3>
//     </div>
//     <div style={{ padding: "16px" }}>{children}</div>
//   </div>
// );

// // ============================================
// // MAIN EDITOR COMPONENT
// // ============================================

// export const QuoteTemplateEditor: React.FC = () => {
//   const { id } = useParams();
//   const { isUploading, uploadedUrl, uploadFile } = useFileUpload({ type: "image" });

//   const playerRef = useRef<any>(null);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const [isGenerating, setIsGenerating] = useState(false);
//   const [previewSize, setPreviewSize] = useState(1);
//   const [templateName, setTemplateName] = useState("🎬 Quote Spotlight Template");

//   const [quote, setQuote] = useState("Hello World");
//   const [author, setAuthor] = useState("Steve Job");
//   const [backgroundImage, setBackgroundImage] = useState(
//     `https://res.cloudinary.com/dnxc1lw18/image/upload/v1760979566/bg11_deliyh.jpg`
//   );
//   const [backgroundSource, setBackgroundSource] = useState<"upload" | "default">("default");

//   const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
//   const [fontColor, setFontColor] = useState("white");
//   const [fontSize, setFontSize] = useState(1);
//   const [showSafeMargins, setShowSafeMargins] = useState(true);
//   const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
//   const [activeSection, setActiveSection] = useState<"quote" | "background" | "typography" | "ai">("quote");
//   const [collapsed, setCollapsed] = useState(false);

//   const [isExporting, setIsExporting] = useState(false);
//   const [exportUrl, setExportUrl] = useState<string | null>(null);
//   const [showModal, setShowModal] = useState(false);

//   const [duration, setDuration] = useState(9);
//   const [isLoading, setIsLoading] = useState(false);

//   const [tracks, setTracks] = useState<Track[]>([
//     {
//       id: "track-1",
//       name: "Video",
//       color: "#10b981",
//       clips: [{ id: "clip-1", start: 0, duration: 9, name: "Main Clip", color: "#10b981", type: "video" }],
//       type: "video",
//       muted: false,
//       locked: false,
//       visible: true,
//     },
//     {
//       id: "track-2",
//       name: "Text",
//       color: "#3b82f6",
//       clips: [
//         {
//           id: "clip-2",
//           start: 0,
//           duration: quoteSpotlightDurationCalculator("Hello World"),
//           name: "Quote Text",
//           color: "#3b82f6",
//           type: "text",
//         },
//       ],
//       type: "text",
//       muted: false,
//       locked: false,
//       visible: true,
//     },
//   ]);

//   const {
//     userUploads,
//     loadingUploads,
//     fetchUserUploads,
//     onlineImages,
//     loadingOnline,
//     fetchOnlineImages,
//     searchQuery,
//     setSearchQuery,
//   } = useBackgroundImages();

//   useEffect(() => {
//     fetchUserUploads();
//     fetchOnlineImages("history");
//   }, []);

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
//           setTemplateName(data.title);
//           setQuote(data.props.quote);
//           setAuthor(data.props.author);
//           setBackgroundImage(data.props.imageurl);
//           setFontFamily(data.props.fontfamily ?? "Cormorant Garamond, serif");
//           setFontColor(data.props.fontcolor ?? "white");
//           setFontSize(data.props.fontsize ?? 1);
//           setDuration(data.props.duration);
//         })
//         .catch((err) => console.error("❌ Project load failed:", err))
//         .finally(() => setIsLoading(false));
//     }
//   }, [id]);

//   const cycleBg = () => {
//     if (previewBg === "dark") setPreviewBg("light");
//     else if (previewBg === "light") setPreviewBg("grey");
//     else setPreviewBg("dark");
//   };

//   const handleSeek = useCallback((time: number) => {
//     setCurrentTime(time);
//     playerRef.current?.seekToTime(time);
//   }, []);

//   const handlePlayPause = useCallback(() => {
//     if (isPlaying) {
//       playerRef.current?.pause();
//     } else {
//       playerRef.current?.play();
//     }
//   }, [isPlaying]);

//   const handleStop = useCallback(() => {
//     playerRef.current?.pause();
//     playerRef.current?.seekToTime(0);
//     setCurrentTime(0);
//     setIsPlaying(false);
//   }, []);

//   const handleFrameUpdate = useCallback((frame: number) => {
//     const time = frame / FPS;
//     setCurrentTime(time);
//   }, []);

//   const handlePlayingChange = useCallback((playing: boolean) => {
//     setIsPlaying(playing);
//   }, []);

//   const handleAISuggestion = async () => {
//     setIsGenerating(true);
//     try {
//       const response = await fetch(`${backendPrefix}/api/generate-quote`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }
//       const data = await response.json();
//       setAuthor(data.author);
//       setQuote(data.quote);
//       setDuration(quoteSpotlightDurationCalculator(data.quote));
//     } catch (error: any) {
//       console.error("error generating ai suggestion");
//       toast.error(error.message);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   useEffect(() => {
//     if (uploadedUrl) {
//       setBackgroundImage(uploadedUrl);
//       setBackgroundSource("upload");
//       fetchUserUploads();
//     }
//   }, [uploadedUrl]);

//   const handleExport = async (format: string) => {
//     setIsExporting(true);
//     try {
//       const response = await fetch(`${backendPrefix}/generatevideo/quotetemplatewchoices`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           quote,
//           author,
//           imageurl: backgroundImage,
//           fontsize: fontSize,
//           fontcolor: fontColor,
//           fontfamily: fontFamily,
//           format,
//           duration,
//         }),
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}, message: ${await response.text()}`);
//       }
//       const data = await response.json();
//       setExportUrl(data.url);
//       setShowModal(true);
//     } catch (error) {
//       console.error("Export failed:", error);
//       alert(`Export failed: ${error || "Please try again."}`);
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const [messageIndex, setMessageIndex] = useState(0);
//   const messages = [
//     "⏳ Preparing your template...",
//     "🙇 Sorry for the wait, still working on it...",
//     "🚀 Almost there, thanks for your patience!",
//   ];

//   useEffect(() => {
//     if (!isLoading) return;
//     const interval = setInterval(() => {
//       setMessageIndex((prev) => (prev + 1) % messages.length);
//     }, 10000);
//     return () => clearInterval(interval);
//   }, [isLoading]);

//   const { isSaving, showSaveModal, setShowSaveModal, handleSave, saveNewProject } = useProjectSave({
//     templateId: 1,
//     buildProps: () => ({
//       quote,
//       author,
//       imageurl: backgroundImage,
//       fontsize: fontSize,
//       fontcolor: fontColor,
//       fontfamily: fontFamily,
//       duration,
//     }),
//     videoEndpoint: `${backendPrefix}/generatevideo/quotetemplatewchoices`,
//   });

//   // Input styling
//   const inputStyle: React.CSSProperties = {
//     width: "100%",
//     background: "#0d1117",
//     color: "#e6edf3",
//     border: "1px solid #30363d",
//     borderRadius: "8px",
//     padding: "10px 12px",
//     fontSize: "13px",
//     boxSizing: "border-box",
//     transition: "border-color 0.15s ease, box-shadow 0.15s ease",
//     outline: "none",
//   };

//   const labelStyle: React.CSSProperties = {
//     display: "block",
//     marginBottom: "6px",
//     fontWeight: 500,
//     fontSize: "12px",
//     color: "#8b949e",
//     textTransform: "uppercase",
//     letterSpacing: "0.5px",
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100vh",
//         background: "#0d1117",
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       }}
//     >
//       {isLoading && <LoadingOverlay message={messages[messageIndex]} />}

//       <SaveProjectModal open={showSaveModal} onClose={() => setShowSaveModal(false)} onSave={saveNewProject} />
//       {showModal && (
//         <ExportModal
//           showExport={showModal}
//           setShowExport={setShowModal}
//           isExporting={isExporting}
//           exportUrl={exportUrl}
//           onExport={handleExport}
//         />
//       )}

//       <TopNavWithSave
//         templateName={templateName}
//         onSave={handleSave}
//         onExport={handleExport}
//         setTemplateName={setTemplateName}
//         onOpenExport={() => setShowModal(true)}
//         template={templateName}
//         isSaving={isSaving}
//       />

//       <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         {/* Side Navigation */}
//         <div style={{ display: "flex", flexDirection: "row", minWidth: `${SIDENAV_WIDTH}px` }}>
//           <SideNavTrial
//             activeSection={activeSection}
//             collapsed={collapsed}
//             setActiveSection={setActiveSection}
//             setCollapsed={setCollapsed}
//           />
//         </div>

//         <div
//           style={{ display: "flex", flexDirection: "column", flex: 1, background: "#0d1117", overflow: "hidden" }}
//         >
//           <div style={{ display: "flex", flexDirection: "row", flex: 1, overflow: "hidden" }}>
//             {/* Properties Panel */}
//             {!collapsed && (
//               <div
//                 style={{
//                   width: `${PROPERTIES_PANEL_WIDTH}px`,
//                   minWidth: `${PROPERTIES_PANEL_WIDTH}px`,
//                   padding: "16px",
//                   overflowY: "auto",
//                   background: "#0d1117",
//                   borderRight: "1px solid #21262d",
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "16px",
//                 }}
//               >
//                 {/* Upload Section */}
//                 <SidebarPanel
//                   title="Media Upload"
//                   icon={
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
//                       <polyline points="17,8 12,3 7,8" />
//                       <line x1="12" y1="3" x2="12" y2="15" />
//                     </svg>
//                   }
//                 >
//                   <div
//                     style={{
//                       background: "#161b22",
//                       border: "2px dashed #30363d",
//                       borderRadius: "8px",
//                       padding: "24px",
//                       textAlign: "center",
//                       transition: "all 0.2s ease",
//                       cursor: "pointer",
//                     }}
//                     onDragOver={(e) => {
//                       e.preventDefault();
//                       e.currentTarget.style.borderColor = "#00d4ff";
//                       e.currentTarget.style.background = "#1f2937";
//                     }}
//                     onDragLeave={(e) => {
//                       e.currentTarget.style.borderColor = "#30363d";
//                       e.currentTarget.style.background = "#161b22";
//                     }}
//                     onDrop={(e) => {
//                       e.preventDefault();
//                       e.currentTarget.style.borderColor = "#30363d";
//                       e.currentTarget.style.background = "#161b22";
//                       if (e.dataTransfer.files?.[0]) {
//                         uploadFile(e.dataTransfer.files[0]);
//                         setBackgroundSource("upload");
//                       }
//                     }}
//                   >
//                     {isUploading ? (
//                       <div style={{ color: "#00d4ff" }}>
//                         <div
//                           style={{
//                             width: "32px",
//                             height: "32px",
//                             border: "3px solid #30363d",
//                             borderTopColor: "#00d4ff",
//                             borderRadius: "50%",
//                             animation: "spin 1s linear infinite",
//                             margin: "0 auto 12px",
//                           }}
//                         />
//                         Uploading...
//                       </div>
//                     ) : (
//                       <>
//                         <div style={{ color: "#6e7681", marginBottom: "12px" }}>
//                           <svg
//                             width="32"
//                             height="32"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="1.5"
//                             style={{ margin: "0 auto" }}
//                           >
//                             <path d="M4 14.899A7 7 0 1115.71 8h1.79a4.5 4.5 0 012.5 8.242" />
//                             <path d="M12 12v9" />
//                             <path d="M8 17l4-5 4 5" />
//                           </svg>
//                         </div>
//                         <p style={{ color: "#8b949e", fontSize: "12px", margin: "0 0 12px" }}>
//                           Drag & drop or click to upload
//                         </p>
//                         <input
//                           type="file"
//                           accept="image/*,video/*"
//                           onChange={(e) => {
//                             if (e.target.files?.[0]) {
//                               uploadFile(e.target.files[0]);
//                               setBackgroundSource("upload");
//                               setActiveSection("quote");
//                             }
//                           }}
//                           style={{ display: "none" }}
//                           id="file-upload"
//                         />
//                         <label
//                           htmlFor="file-upload"
//                           style={{
//                             display: "inline-block",
//                             background: "linear-gradient(180deg, #00d4ff 0%, #00a8cc 100%)",
//                             color: "#000",
//                             padding: "8px 20px",
//                             borderRadius: "6px",
//                             cursor: "pointer",
//                             fontSize: "12px",
//                             fontWeight: 600,
//                             transition: "transform 0.1s ease",
//                           }}
//                         >
//                           Choose File
//                         </label>
//                       </>
//                     )}
//                   </div>
//                 </SidebarPanel>

//                 {/* Quote Section */}
//                 {activeSection === "quote" && (
//                   <SidebarPanel
//                     title="Quote Content"
//                     icon={
//                       <svg
//                         width="16"
//                         height="16"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       >
//                         <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21c0 1 0 1 1 1z" />
//                         <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
//                       </svg>
//                     }
//                   >
//                     <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//                       <div>
//                         <label style={labelStyle}>Quote</label>
//                         <textarea
//                           value={quote}
//                           onChange={(e) => setQuote(e.target.value)}
//                           style={{
//                             ...inputStyle,
//                             minHeight: "100px",
//                             resize: "vertical",
//                             lineHeight: "1.5",
//                           }}
//                           placeholder="Enter your quote here"
//                           onFocus={(e) => {
//                             e.target.style.borderColor = "#00d4ff";
//                             e.target.style.boxShadow = "0 0 0 3px rgba(0, 212, 255, 0.1)";
//                           }}
//                           onBlur={(e) => {
//                             e.target.style.borderColor = "#30363d";
//                             e.target.style.boxShadow = "none";
//                           }}
//                         />
//                       </div>

//                       <div>
//                         <label style={labelStyle}>Author</label>
//                         <input
//                           type="text"
//                           value={author}
//                           onChange={(e) => setAuthor(e.target.value)}
//                           style={inputStyle}
//                           placeholder="Enter author name"
//                           onFocus={(e) => {
//                             e.target.style.borderColor = "#00d4ff";
//                             e.target.style.boxShadow = "0 0 0 3px rgba(0, 212, 255, 0.1)";
//                           }}
//                           onBlur={(e) => {
//                             e.target.style.borderColor = "#30363d";
//                             e.target.style.boxShadow = "none";
//                           }}
//                         />
//                       </div>

//                       <div style={{ display: "flex", gap: "8px" }}>
//                         <button
//                           onClick={handleAISuggestion}
//                           disabled={isGenerating}
//                           style={{
//                             flex: 1,
//                             padding: "12px",
//                             background: isGenerating
//                               ? "#21262d"
//                               : "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
//                             color: isGenerating ? "#6e7681" : "#fff",
//                             border: "none",
//                             borderRadius: "8px",
//                             cursor: isGenerating ? "not-allowed" : "pointer",
//                             fontSize: "13px",
//                             fontWeight: 600,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             gap: "8px",
//                             transition: "all 0.15s ease",
//                           }}
//                         >
//                           <SparkleIcon />
//                           {isGenerating ? "Generating..." : "AI Generate"}
//                         </button>
//                         <button
//                           onClick={handleSave}
//                           disabled={isSaving}
//                           style={{
//                             flex: 1,
//                             padding: "12px",
//                             background: isSaving ? "#21262d" : "#21262d",
//                             color: isSaving ? "#6e7681" : "#e6edf3",
//                             border: "1px solid #30363d",
//                             borderRadius: "8px",
//                             cursor: isSaving ? "not-allowed" : "pointer",
//                             fontSize: "13px",
//                             fontWeight: 600,
//                             transition: "all 0.15s ease",
//                           }}
//                         >
//                           {isSaving ? "Saving..." : "Save"}
//                         </button>
//                       </div>
//                     </div>
//                   </SidebarPanel>
//                 )}

//                 {activeSection === "background" && (
//                   <BackgroundSecTrial
//                     backgroundImage={backgroundImage}
//                     backgroundSource={backgroundSource}
//                     handleFileUpload={uploadFile}
//                     isUploading={isUploading}
//                     setBackgroundImage={setBackgroundImage}
//                     setBackgroundSource={setBackgroundSource}
//                     fetchOnlineImages={fetchOnlineImages}
//                     loadingOnline={loadingOnline}
//                     loadingUploads={loadingUploads}
//                     onlineImages={onlineImages}
//                     searchQuery={searchQuery}
//                     setSearchQuery={setSearchQuery}
//                     userUploads={userUploads}
//                   />
//                 )}

//                 {activeSection === "typography" && (
//                   <TypographySectionQuote
//                     fontColor={fontColor}
//                     fontFamily={fontFamily}
//                     fontSize={fontSize}
//                     setFontColor={setFontColor}
//                     setFontFamily={setFontFamily}
//                     setFontSize={setFontSize}
//                   />
//                 )}

//                 {activeSection === "ai" && (
//                   <SidebarPanel
//                     title="AI Features"
//                     icon={<SparkleIcon />}
//                   >
//                     <div
//                       style={{
//                         textAlign: "center",
//                         padding: "24px",
//                         color: "#6e7681",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: "48px",
//                           height: "48px",
//                           background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
//                           borderRadius: "12px",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           margin: "0 auto 16px",
//                         }}
//                       >
//                         <SparkleIcon />
//                       </div>
//                       <p style={{ fontSize: "13px", margin: "0 0 8px", color: "#e6edf3" }}>
//                         AI Content Generation
//                       </p>
//                       <p style={{ fontSize: "12px", margin: 0 }}>
//                         Coming soon - Generate quotes, images, and more with AI
//                       </p>
//                     </div>
//                   </SidebarPanel>
//                 )}
//               </div>
//             )}

//             {/* Preview Area */}
//             <div
//               style={{
//                 flex: 1,
//                 minWidth: "400px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 overflow: "auto",
//                 padding: "24px",
//                 background: "linear-gradient(180deg, #0d1117 0%, #161b22 100%)",
//                 position: "relative",
//               }}
//             >
//               {/* Checkerboard pattern for transparency indication */}
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   backgroundImage: `
//                     linear-gradient(45deg, #1a1a2e 25%, transparent 25%),
//                     linear-gradient(-45deg, #1a1a2e 25%, transparent 25%),
//                     linear-gradient(45deg, transparent 75%, #1a1a2e 75%),
//                     linear-gradient(-45deg, transparent 75%, #1a1a2e 75%)
//                   `,
//                   backgroundSize: "20px 20px",
//                   backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
//                   opacity: 0.3,
//                 }}
//               />

//               <div
//                 style={{
//                   position: "relative",
//                   background: "#000",
//                   borderRadius: "8px",
//                   overflow: "hidden",
//                   boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
//                 }}
//               >
//                 <QuoteSpotlightPreview
//                   ref={playerRef}
//                   quote={quote}
//                   author={author}
//                   backgroundImage={backgroundImage}
//                   fontSize={fontSize}
//                   fontFamily={fontFamily}
//                   fontColor={fontColor}
//                   showSafeMargins={showSafeMargins}
//                   previewBg={previewBg}
//                   cycleBg={cycleBg}
//                   previewScale={previewSize}
//                   onPreviewScaleChange={setPreviewSize}
//                   onToggleSafeMargins={setShowSafeMargins}
//                   duration={duration}
//                   onFrameUpdate={handleFrameUpdate}
//                   onPlayingChange={handlePlayingChange}
//                   tracks={tracks}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Timeline */}
//           <InteractiveTimeline
//             duration={duration}
//             setDuration={setDuration}
//             quote={quote}
//             currentTime={currentTime}
//             isPlaying={isPlaying}
//             onSeek={handleSeek}
//             onPlayPause={handlePlayPause}
//             onStop={handleStop}
//             tracks={tracks}
//             setTracks={setTracks}
//           />
//         </div>
//       </div>

//       {/* Global styles for animations */}
//       <style>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
        
//         ::-webkit-scrollbar {
//           width: 8px;
//           height: 8px;
//         }
        
//         ::-webkit-scrollbar-track {
//           background: #0d1117;
//         }
        
//         ::-webkit-scrollbar-thumb {
//           background: #30363d;
//           border-radius: 4px;
//         }
        
//         ::-webkit-scrollbar-thumb:hover {
//           background: #484f58;
//         }
        
//         input::-webkit-outer-spin-button,
//         input::-webkit-inner-spin-button {
//           -webkit-appearance: none;
//           margin: 0;
//         }
        
//         input[type=number] {
//           -moz-appearance: textfield;
//         }
//       `}</style>
//     </div>
//   );
// };





//src/components/qouteeditor.tsx


// import React, { useState, useRef, useEffect, useCallback, type JSX } from "react";
// import { QuoteSpotlightPreview } from "../../layout/EditorPreviews/QuoteTemplatePreview";
// import { TypographySectionQuote } from "./sidenav_sections/Typo";
// import { BackgroundSecTrial } from "../Global/sidenav_sections/Backgrounds";
// import { SideNavTrial } from "./Sidenav";
// import { TopNavWithSave } from "../../navigations/single_editors/WithSave";
// import { ExportModal } from "../../ui/modals/ExportModal";
// import { SaveProjectModal } from "../../ui/modals/SaveModal";
// import { LoadingOverlay } from "../../ui/modals/LoadingProjectModal";
// import { useProjectSave } from "../../../hooks/SaveProject";
// import { backendPrefix } from "../../../config";
// import toast from "react-hot-toast";
// import { useBackgroundImages } from "../../../hooks/datafetching/UserImagesAndOnlineImages";
// import { useFileUpload } from "../../../hooks/uploads/HandleImageUpload";
// import { useParams } from "react-router-dom";

// // ============================================
// // TYPE DEFINITIONS
// // ============================================
// interface Clip {
//   id: string;
//   start: number;
//   duration: number;
//   name: string;
//   color: string;
//   type?: "video" | "text" | "audio" | "effect";
//   audioUrl?: string;
// }

// interface Track {
//   id: string;
//   name: string;
//   color: string;
//   clips: Clip[];
//   type: "video" | "text" | "audio" | "effect";
//   muted?: boolean;
//   locked?: boolean;
//   visible?: boolean;
// }

// interface PlayerHandle {
//   play: () => void;
//   pause: () => void;
//   toggle: () => void;
//   seekTo: (frame: number) => void;
//   seekToTime: (timeInSeconds: number) => void;
//   getCurrentFrame: () => number;
//   isPlaying: () => boolean;
// }

// interface InteractiveTimelineProps {
//   duration: number;
//   setDuration: (d: number) => void;
//   quote: string;
//   currentTime: number;
//   isPlaying: boolean;
//   onSeek: (time: number) => void;
//   onPlayPause: () => void;
//   onStop: () => void;
//   tracks: Track[];
//   setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
// }

// interface ClipComponentProps {
//   clip: Clip;
//   trackId: string;
//   pixelsPerSecond: number;
//   selectedClip: string | null;
//   setSelectedClip: (id: string | null) => void;
//   handleClipDrag: (trackId: string, clipId: string, deltaX: number) => void;
//   handleClipResize: (trackId: string, clipId: string, edge: "left" | "right", deltaX: number) => void;
// }

// // ============================================
// // HELPER FUNCTIONS
// // ============================================
// const quoteSpotlightDurationCalculator = (quote: string): number => {
//   let length = 0;
//   if (typeof quote === "string") {
//     length = quote.length;
//   } else if (typeof quote === "number" && isFinite(quote)) {
//     length = quote;
//   }
//   return 2.0 + Math.floor(length / 10) * 0.1;
// };

// const formatTimeCode = (time: number): string => {
//   const minutes = Math.floor(time / 60);
//   const seconds = Math.floor(time % 60);
//   const frames = Math.floor((time % 1) * 30);
//   return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`;
// };

// // ============================================
// // CONSTANTS
// // ============================================
// const PROPERTIES_PANEL_WIDTH = 320;
// const SIDENAV_WIDTH = 72;
// const HORIZONTAL_TIMELINE_HEIGHT = 280;
// const TRACK_HEIGHT = 56;
// const RULER_HEIGHT = 36;
// const CONTROLS_HEIGHT = 56;
// const MAX_DURATION = 60;
// const MIN_DURATION = 1;
// const FPS = 30;

// // ============================================
// // ICON COMPONENTS
// // ============================================
// const PlayIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M8 5v14l11-7z" />
//   </svg>
// );

// const PauseIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
//   </svg>
// );

// const StopIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M6 6h12v12H6z" />
//   </svg>
// );

// const SkipBackIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
//   </svg>
// );

// const SkipForwardIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M6 18l8.5-6L6 6v12zm10.5-12v12h2V6z" />
//   </svg>
// );

// const ScissorsIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="6" cy="6" r="3" />
//     <circle cx="6" cy="18" r="3" />
//     <line x1="20" y1="4" x2="8.12" y2="15.88" />
//     <line x1="14.47" y1="14.48" x2="20" y2="20" />
//     <line x1="8.12" y1="8.12" x2="12" y2="12" />
//   </svg>
// );

// const TrashIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <polyline points="3,6 5,6 21,6" />
//     <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" />
//   </svg>
// );

// const PlusIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//     <line x1="12" y1="5" x2="12" y2="19" />
//     <line x1="5" y1="12" x2="19" y2="12" />
//   </svg>
// );

// const EyeIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//     <circle cx="12" cy="12" r="3" />
//   </svg>
// );

// const LockIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
//     <path d="M7 11V7a5 5 0 0110 0v4" />
//   </svg>
// );

// const VolumeIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
//     <path d="M15.54 8.46a5 5 0 010 7.07" />
//   </svg>
// );

// const MuteIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
//     <line x1="23" y1="9" x2="17" y2="15" />
//     <line x1="17" y1="9" x2="23" y2="15" />
//   </svg>
// );

// const ZoomInIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="11" cy="11" r="8" />
//     <line x1="21" y1="21" x2="16.65" y2="16.65" />
//     <line x1="11" y1="8" x2="11" y2="14" />
//     <line x1="8" y1="11" x2="14" y2="11" />
//   </svg>
// );

// const ZoomOutIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="11" cy="11" r="8" />
//     <line x1="21" y1="21" x2="16.65" y2="16.65" />
//     <line x1="8" y1="11" x2="14" y2="11" />
//   </svg>
// );

// const SparkleIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
//   </svg>
// );

// const VideoIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <rect x="2" y="4" width="20" height="16" rx="2" />
//     <path d="M10 9l5 3-5 3V9z" />
//   </svg>
// );

// const TextIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <polyline points="4,7 4,4 20,4 20,7" />
//     <line x1="9" y1="20" x2="15" y2="20" />
//     <line x1="12" y1="4" x2="12" y2="20" />
//   </svg>
// );

// const AudioIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M9 18V5l12-2v13" />
//     <circle cx="6" cy="18" r="3" />
//     <circle cx="18" cy="16" r="3" />
//   </svg>
// );

// const UploadIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
//     <polyline points="17,8 12,3 7,8" />
//     <line x1="12" y1="3" x2="12" y2="15" />
//   </svg>
// );

// // ============================================
// // CLIP COMPONENT
// // ============================================
// const ClipComponent: React.FC<ClipComponentProps> = ({
//   clip,
//   trackId,
//   pixelsPerSecond,
//   selectedClip,
//   setSelectedClip,
//   handleClipDrag,
//   handleClipResize,
// }) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [isResizing, setIsResizing] = useState<"left" | "right" | null>(null);
//   const [dragStart, setDragStart] = useState({ x: 0 });
//   const [isHovered, setIsHovered] = useState(false);

//   const handleMouseDown = (e: React.MouseEvent, action: "drag" | "left" | "right") => {
//     e.stopPropagation();
//     setSelectedClip(clip.id);
//     if (action === "drag") {
//       setIsDragging(true);
//     } else {
//       setIsResizing(action);
//     }
//     setDragStart({ x: e.clientX });
//   };

//   useEffect(() => {
//     if (!isDragging && !isResizing) return;

//     const handleMouseMove = (e: MouseEvent) => {
//       const deltaX = e.clientX - dragStart.x;
//       if (isDragging) {
//         handleClipDrag(trackId, clip.id, deltaX);
//       } else if (isResizing) {
//         handleClipResize(trackId, clip.id, isResizing, deltaX);
//       }
//       setDragStart({ x: e.clientX });
//     };

//     const handleMouseUp = () => {
//       setIsDragging(false);
//       setIsResizing(null);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDragging, isResizing, dragStart, trackId, clip.id, handleClipDrag, handleClipResize]);

//   const isSelected = selectedClip === clip.id;
//   const clipWidth = Math.max(clip.duration * pixelsPerSecond, 40);

//   const getClipIcon = () => {
//     switch (clip.type) {
//       case "video":
//         return <VideoIcon />;
//       case "audio":
//         return <AudioIcon />;
//       case "text":
//         return <TextIcon />;
//       default:
//         return <VideoIcon />;
//     }
//   };

//   return (
//     <div
//       style={{
//         position: "absolute",
//         left: `${clip.start * pixelsPerSecond}px`,
//         width: `${clipWidth}px`,
//         height: "calc(100% - 8px)",
//         top: "4px",
//         background: isSelected
//           ? `linear-gradient(180deg, ${clip.color}15 0%, ${clip.color}25 100%)`
//           : `linear-gradient(180deg, ${clip.color}10 0%, ${clip.color}20 100%)`,
//         borderRadius: "6px",
//         border: isSelected ? `2px solid ${clip.color}` : `1px solid ${clip.color}40`,
//         boxShadow: isSelected
//           ? `0 0 0 1px ${clip.color}30, 0 2px 8px rgba(0,0,0,0.08)`
//           : isHovered
//             ? "0 2px 6px rgba(0,0,0,0.06)"
//             : "none",
//         cursor: isDragging ? "grabbing" : "grab",
//         display: "flex",
//         alignItems: "center",
//         overflow: "hidden",
//         userSelect: "none",
//         transition: "box-shadow 0.15s ease, border 0.15s ease",
//       }}
//       onClick={(e) => {
//         e.stopPropagation();
//         setSelectedClip(clip.id);
//       }}
//       onMouseDown={(e) => handleMouseDown(e, "drag")}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Left resize handle */}
//       <div
//         style={{
//           position: "absolute",
//           left: 0,
//           top: 0,
//           width: "8px",
//           height: "100%",
//           cursor: "ew-resize",
//           background: isHovered || isSelected ? clip.color + "30" : "transparent",
//           borderRadius: "6px 0 0 6px",
//           transition: "background 0.15s ease",
//         }}
//         onMouseDown={(e) => handleMouseDown(e, "left")}
//       />

//       {/* Clip content */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           alignItems: "center",
//           padding: "0 12px",
//           gap: "6px",
//           pointerEvents: "none",
//         }}
//       >
//         <span style={{ color: clip.color }}>{getClipIcon()}</span>
//         <span
//           style={{
//             color: "#1a1a1a",
//             fontSize: "11px",
//             fontWeight: 600,
//             whiteSpace: "nowrap",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             letterSpacing: "0.2px",
//           }}
//         >
//           {clip.name}
//         </span>
//         <span
//           style={{
//             color: "#64748b",
//             fontSize: "10px",
//             fontWeight: 500,
//             marginLeft: "auto",
//           }}
//         >
//           {clip.duration.toFixed(1)}s
//         </span>
//       </div>

//       {/* Waveform/thumbnail representation */}
//       <div
//         style={{
//           position: "absolute",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: "12px",
//           background: clip.color + "15",
//           display: "flex",
//           alignItems: "flex-end",
//           gap: "1px",
//           padding: "0 2px",
//           pointerEvents: "none",
//         }}
//       >
//         {Array.from({ length: Math.min(Math.floor(clipWidth / 4), 50) }).map((_, i) => (
//           <div
//             key={i}
//             style={{
//               flex: 1,
//               height: `${Math.random() * 8 + 2}px`,
//               background: clip.color + "40",
//               borderRadius: "1px 1px 0 0",
//             }}
//           />
//         ))}
//       </div>

//       {/* Right resize handle */}
//       <div
//         style={{
//           position: "absolute",
//           right: 0,
//           top: 0,
//           width: "8px",
//           height: "100%",
//           cursor: "ew-resize",
//           background: isHovered || isSelected ? clip.color + "30" : "transparent",
//           borderRadius: "0 6px 6px 0",
//           transition: "background 0.15s ease",
//         }}
//         onMouseDown={(e) => handleMouseDown(e, "right")}
//       />
//     </div>
//   );
// };

// // ============================================
// // TRACK HEADER COMPONENT
// // ============================================
// interface TrackHeaderProps {
//   track: Track;
//   onAddClip: () => void;
//   onRemove: () => void;
//   onToggleMute: () => void;
//   onToggleLock: () => void;
//   onToggleVisibility: () => void;
//   canRemove: boolean;
// }

// const TrackHeader: React.FC<TrackHeaderProps> = ({
//   track,
//   onAddClip,
//   onRemove,
//   onToggleMute,
//   onToggleLock,
//   onToggleVisibility,
//   canRemove,
// }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       style={{
//         height: `${TRACK_HEIGHT}px`,
//         display: "flex",
//         alignItems: "center",
//         padding: "0 12px",
//         borderBottom: "1px solid #f1f5f9",
//         background: isHovered ? "#f8fafc" : "#ffffff",
//         transition: "background 0.15s ease",
//       }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Track color indicator */}
//       <div
//         style={{
//           width: "4px",
//           height: "32px",
//           background: track.color,
//           borderRadius: "2px",
//           marginRight: "10px",
//         }}
//       />

//       {/* Track info */}
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div
//           style={{
//             color: "#0f172a",
//             fontSize: "12px",
//             fontWeight: 600,
//             whiteSpace: "nowrap",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//           }}
//         >
//           {track.name}
//         </div>
//         <div style={{ color: "#94a3b8", fontSize: "10px", textTransform: "uppercase" }}>
//           {track.type}
//         </div>
//       </div>

//       {/* Track controls */}
//       <div style={{ display: "flex", gap: "4px", opacity: isHovered ? 1 : 0.6, transition: "opacity 0.15s ease" }}>
//         <button
//           onClick={onToggleVisibility}
//           style={{
//             width: "24px",
//             height: "24px",
//             background: track.visible === false ? "#fee2e2" : "transparent",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             color: track.visible === false ? "#ef4444" : "#64748b",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           title={track.visible === false ? "Show track" : "Hide track"}
//         >
//           <EyeIcon />
//         </button>
//         <button
//           onClick={onToggleMute}
//           style={{
//             width: "24px",
//             height: "24px",
//             background: track.muted ? "#fee2e2" : "transparent",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             color: track.muted ? "#ef4444" : "#64748b",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           title={track.muted ? "Unmute" : "Mute"}
//         >
//           {track.muted ? <MuteIcon /> : <VolumeIcon />}
//         </button>
//         <button
//           onClick={onToggleLock}
//           style={{
//             width: "24px",
//             height: "24px",
//             background: track.locked ? "#fef3c7" : "transparent",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             color: track.locked ? "#f59e0b" : "#64748b",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           title={track.locked ? "Unlock" : "Lock"}
//         >
//           <LockIcon />
//         </button>
//         <button
//           onClick={onAddClip}
//           style={{
//             width: "24px",
//             height: "24px",
//             background: "transparent",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             color: "#6366f1",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           title="Add clip"
//         >
//           <PlusIcon />
//         </button>
//         {canRemove && (
//           <button
//             onClick={onRemove}
//             style={{
//               width: "24px",
//               height: "24px",
//               background: "transparent",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//               color: "#ef4444",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//             title="Remove track"
//           >
//             <TrashIcon />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// // ============================================
// // INTERACTIVE TIMELINE COMPONENT
// // ============================================
// const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
//   duration,
//   setDuration,
//   quote,
//   currentTime,
//   isPlaying,
//   onSeek,
//   onPlayPause,
//   onStop,
//   tracks,
//   setTracks,
// }) => {
//   const [zoom, setZoom] = useState(1);
//   const [selectedClip, setSelectedClip] = useState<string | null>(null);
//   const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
//   const [showAudioUploadModal, setShowAudioUploadModal] = useState(false);
//   const [targetTrackId, setTargetTrackId] = useState<string | null>(null);
//   const [isUploadingAudio, setIsUploadingAudio] = useState(false);

//   const timelineRef = useRef<HTMLDivElement>(null);
//   const audioInputRef = useRef<HTMLInputElement>(null);

//   const pixelsPerSecond = 60 * zoom;

//   // Update quote text clip duration
//   useEffect(() => {
//     const textClipDuration = Math.min(quoteSpotlightDurationCalculator(quote), duration);
//     setTracks((prev) =>
//       prev.map((track) =>
//         track.id === "track-2"
//           ? {
//               ...track,
//               clips: track.clips.map((clip, idx) =>
//                 idx === 0 ? { ...clip, duration: textClipDuration } : clip
//               ),
//             }
//           : track
//       )
//     );
//   }, [quote, duration, setTracks]);

//   // Update author text clip duration
//   useEffect(() => {
//     const textClipDuration = Math.min(quoteSpotlightDurationCalculator(quote), duration);
//     setTracks((prev) =>
//       prev.map((track) =>
//         track.id === "track-3"
//           ? {
//               ...track,
//               clips: track.clips.map((clip, idx) =>
//                 idx === 0 ? { ...clip, duration: textClipDuration } : clip
//               ),
//             }
//           : track
//       )
//     );
//   }, [quote, duration, setTracks]);

//   // Update video clip duration
//   useEffect(() => {
//     setTracks((prev) =>
//       prev.map((track) =>
//         track.id === "track-1"
//           ? {
//               ...track,
//               clips: track.clips.map((clip, idx) =>
//                 idx === 0 ? { ...clip, duration: duration } : clip
//               ),
//             }
//           : track
//       )
//     );
//   }, [duration, setTracks]);

//   const handleTimelineClick = useCallback(
//     (e: React.MouseEvent) => {
//       if (!timelineRef.current || selectedClip) return;
//       const rect = timelineRef.current.getBoundingClientRect();
//       const scrollLeft = timelineRef.current.scrollLeft;
//       const x = e.clientX - rect.left + scrollLeft;
//       const time = Math.max(0, Math.min(duration, x / pixelsPerSecond));
//       onSeek(time);
//     },
//     [duration, pixelsPerSecond, selectedClip, onSeek]
//   );

//   const handlePlayheadMouseDown = useCallback((e: React.MouseEvent) => {
//     e.stopPropagation();
//     setIsDraggingPlayhead(true);
//   }, []);

//   useEffect(() => {
//     if (!isDraggingPlayhead) return;

//     const handleMouseMove = (e: MouseEvent) => {
//       if (!timelineRef.current) return;
//       const rect = timelineRef.current.getBoundingClientRect();
//       const scrollLeft = timelineRef.current.scrollLeft;
//       const x = e.clientX - rect.left + scrollLeft;
//       const time = Math.max(0, Math.min(duration, x / pixelsPerSecond));
//       onSeek(time);
//     };

//     const handleMouseUp = () => setIsDraggingPlayhead(false);

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDraggingPlayhead, duration, pixelsPerSecond, onSeek]);

//   const handleClipResize = useCallback(
//     (trackId: string, clipId: string, edge: "left" | "right", deltaX: number) => {
//       setTracks((prev) =>
//         prev.map((track) => {
//           if (track.id !== trackId || track.locked) return track;
//           return {
//             ...track,
//             clips: track.clips.map((clip) => {
//               if (clip.id !== clipId) return clip;
//               const deltaTime = deltaX / pixelsPerSecond;
//               if (edge === "left") {
//                 const newStart = Math.max(0, clip.start + deltaTime);
//                 const newDuration = clip.duration - (newStart - clip.start);
//                 if (newDuration < 0.5) return clip;
//                 return { ...clip, start: newStart, duration: newDuration };
//               } else {
//                 const newDuration = Math.max(0.5, clip.duration + deltaTime);
//                 if (clip.start + newDuration > MAX_DURATION) return clip;
//                 return { ...clip, duration: newDuration };
//               }
//             }),
//           };
//         })
//       );
//     },
//     [pixelsPerSecond, setTracks]
//   );

//   const handleClipDrag = useCallback(
//     (trackId: string, clipId: string, deltaX: number) => {
//       setTracks((prev) =>
//         prev.map((track) => {
//           if (track.id !== trackId || track.locked) return track;
//           return {
//             ...track,
//             clips: track.clips.map((clip) => {
//               if (clip.id !== clipId) return clip;
//               const deltaTime = deltaX / pixelsPerSecond;
//               const newStart = Math.max(
//                 0,
//                 Math.min(MAX_DURATION - clip.duration, clip.start + deltaTime)
//               );
//               return { ...clip, start: newStart };
//             }),
//           };
//         })
//       );
//     },
//     [pixelsPerSecond, setTracks]
//   );

//   const addTrack = () => {
//     const colors = ["#ef4444", "#8b5cf6", "#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#06b6d4"];
//     const types: Track["type"][] = ["audio", "video", "text", "effect"];
//     setTracks((prev) => [
//       ...prev,
//       {
//         id: `track-${Date.now()}`,
//         name: `Track ${prev.length + 1}`,
//         color: colors[prev.length % colors.length],
//         clips: [],
//         type: types[prev.length % types.length],
//         muted: false,
//         locked: false,
//         visible: true,
//       },
//     ]);
//   };

//   const removeTrack = (trackId: string) => {
//     if (tracks.length <= 1) return;
//     setTracks((prev) => prev.filter((t) => t.id !== trackId));
//   };

//   const toggleTrackMute = (trackId: string) => {
//     setTracks((prev) =>
//       prev.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t))
//     );
//   };

//   const toggleTrackLock = (trackId: string) => {
//     setTracks((prev) =>
//       prev.map((t) => (t.id === trackId ? { ...t, locked: !t.locked } : t))
//     );
//   };

//   const toggleTrackVisibility = (trackId: string) => {
//     setTracks((prev) =>
//       prev.map((t) => (t.id === trackId ? { ...t, visible: t.visible === false } : t))
//     );
//   };

//   const handleAudioFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) {
//       toast.error("No file selected");
//       return;
//     }
//     if (!targetTrackId) {
//       toast.error("No target track");
//       return;
//     }

//     console.log('🎵 Processing audio file:', file.name);
//     setIsUploadingAudio(true);

//     try {
//       const audioUrl = URL.createObjectURL(file);
//       console.log('✅ Created local audio URL');

//       const audio = new Audio(audioUrl);
//       audio.addEventListener("loadedmetadata", () => {
//         const audioDuration = Math.min(audio.duration, MAX_DURATION);
//         console.log('✅ Audio duration:', audioDuration, 'seconds');

//         setTracks((prev) =>
//           prev.map((track) => {
//             if (track.id !== targetTrackId || track.locked) return track;
//             const lastClip = track.clips[track.clips.length - 1];
//             const startTime = lastClip ? lastClip.start + lastClip.duration + 0.5 : 0;
//             if (startTime >= MAX_DURATION) {
//               toast.error("Track is full");
//               return track;
//             }
//             return {
//               ...track,
//               clips: [
//                 ...track.clips,
//                 {
//                   id: `clip-${Date.now()}`,
//                   start: startTime,
//                   duration: Math.min(audioDuration, MAX_DURATION - startTime),
//                   name: file.name.replace(/\.[^/.]+$/, ""),
//                   color: track.color,
//                   type: "audio",
//                   audioUrl: audioUrl,
//                 },
//               ],
//             };
//           })
//         );

//         toast.success(`🎵 Audio added: ${file.name}`);
//         setTargetTrackId(null);
//         setIsUploadingAudio(false);
//       });

//       audio.addEventListener("error", (err) => {
//         console.error('❌ Error loading audio:', err);
//         toast.error("Invalid audio file");
//         setIsUploadingAudio(false);
//       });
//     } catch (error: any) {
//       console.error("❌ Error:", error);
//       toast.error("Failed to add audio");
//       setIsUploadingAudio(false);
//     } finally {
//       if (e.target) e.target.value = "";
//     }
//   };

//   const addClipToTrack = (trackId: string) => {
//     const track = tracks.find((t) => t.id === trackId);
//     if (!track) return;

//     if (track.type === "audio") {
//       setTargetTrackId(trackId);
//       audioInputRef.current?.click();
//     } else {
//       setTracks((prev) =>
//         prev.map((track) => {
//           if (track.id !== trackId || track.locked) return track;
//           const lastClip = track.clips[track.clips.length - 1];
//           const startTime = lastClip ? lastClip.start + lastClip.duration + 0.5 : 0;
//           if (startTime >= MAX_DURATION) return track;
//           return {
//             ...track,
//             clips: [
//               ...track.clips,
//               {
//                 id: `clip-${Date.now()}`,
//                 start: startTime,
//                 duration: Math.min(3, MAX_DURATION - startTime),
//                 name: `Clip ${track.clips.length + 1}`,
//                 color: track.color,
//                 type: track.type,
//               },
//             ],
//           };
//         })
//       );
//     }
//   };

//   const deleteSelectedClip = () => {
//     if (!selectedClip) return;
//     setTracks((prev) =>
//       prev.map((track) => ({
//         ...track,
//         clips: track.clips.filter((c) => c.id !== selectedClip),
//       }))
//     );
//     setSelectedClip(null);
//   };

//   const splitClipAtPlayhead = () => {
//     setTracks((prev) =>
//       prev.map((track) => {
//         if (track.locked) return track;
//         const newClips: Clip[] = [];
//         track.clips.forEach((clip) => {
//           const clipEnd = clip.start + clip.duration;
//           if (currentTime > clip.start && currentTime < clipEnd) {
//             newClips.push({ ...clip, duration: currentTime - clip.start });
//             newClips.push({
//               ...clip,
//               id: `clip-${Date.now()}-split`,
//               start: currentTime,
//               duration: clipEnd - currentTime,
//               name: `${clip.name} (B)`,
//             });
//           } else {
//             newClips.push(clip);
//           }
//         });
//         return { ...track, clips: newClips };
//       })
//     );
//   };

//   const renderRuler = () => {
//     const marks: JSX.Element[] = [];
//     const majorInterval = zoom >= 2 ? 1 : zoom >= 1 ? 2 : 5;
//     const minorInterval = majorInterval / 5;

//     for (let t = 0; t <= Math.ceil(duration) + 5; t += minorInterval) {
//       const isMajor = Math.abs(t % majorInterval) < 0.001 || Math.abs((t % majorInterval) - majorInterval) < 0.001;
//       marks.push(
//         <div
//           key={t}
//           style={{
//             position: "absolute",
//             left: `${t * pixelsPerSecond}px`,
//             height: isMajor ? "14px" : "6px",
//             width: "1px",
//             background: isMajor ? "#cbd5e1" : "#e2e8f0",
//             bottom: 0,
//           }}
//         >
//           {isMajor && (
//             <span
//               style={{
//                 position: "absolute",
//                 bottom: "16px",
//                 left: "-18px",
//                 width: "36px",
//                 textAlign: "center",
//                 fontSize: "10px",
//                 color: "#64748b",
//                 fontWeight: 500,
//                 fontFamily: "'Inter', -apple-system, sans-serif",
//               }}
//             >
//               {t.toFixed(0)}s
//             </span>
//           )}
//         </div>
//       );
//     }
//     return marks;
//   };

//   const timelineContentWidth = Math.max(1200, (duration + 10) * pixelsPerSecond);

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: `${HORIZONTAL_TIMELINE_HEIGHT}px`,
//         minHeight: `${HORIZONTAL_TIMELINE_HEIGHT}px`,
//         background: "#ffffff",
//         borderTop: "1px solid #e2e8f0",
//         display: "flex",
//         flexDirection: "column",
//         userSelect: "none",
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       }}
//     >
//       {/* Hidden audio file input */}
//       <input
//         ref={audioInputRef}
//         type="file"
//         accept="audio/*"
//         onChange={handleAudioFileSelect}
//         style={{ display: "none" }}
//       />

//       {/* Transport Controls */}
//       <div
//         style={{
//           height: `${CONTROLS_HEIGHT}px`,
//           background: "#fafafa",
//           display: "flex",
//           alignItems: "center",
//           padding: "0 16px",
//           gap: "8px",
//           borderBottom: "1px solid #e2e8f0",
//         }}
//       >
//         {/* Playback controls */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "4px",
//             background: "#ffffff",
//             borderRadius: "8px",
//             padding: "4px",
//             border: "1px solid #e2e8f0",
//           }}
//         >
//           <button
//             onClick={() => onSeek(0)}
//             style={{
//               width: "32px",
//               height: "32px",
//               background: "transparent",
//               border: "none",
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: "#64748b",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               transition: "background 0.15s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
//             onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//             title="Go to start"
//           >
//             <SkipBackIcon />
//           </button>
//           <button
//             onClick={onPlayPause}
//             style={{
//               width: "40px",
//               height: "40px",
//               background: isPlaying
//                 ? "linear-gradient(180deg, #ef4444 0%, #dc2626 100%)"
//                 : "linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)",
//               border: "none",
//               borderRadius: "8px",
//               cursor: "pointer",
//               color: "#fff",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               boxShadow: isPlaying
//                 ? "0 2px 8px rgba(239, 68, 68, 0.3)"
//                 : "0 2px 8px rgba(99, 102, 241, 0.3)",
//               transition: "transform 0.1s ease",
//             }}
//             onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
//             onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
//             onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//             title={isPlaying ? "Pause" : "Play"}
//           >
//             {isPlaying ? <PauseIcon /> : <PlayIcon />}
//           </button>
//           <button
//             onClick={onStop}
//             style={{
//               width: "32px",
//               height: "32px",
//               background: "transparent",
//               border: "none",
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: "#64748b",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               transition: "background 0.15s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
//             onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//             title="Stop"
//           >
//             <StopIcon />
//           </button>
//           <button
//             onClick={() => onSeek(duration)}
//             style={{
//               width: "32px",
//               height: "32px",
//               background: "transparent",
//               border: "none",
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: "#64748b",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               transition: "background 0.15s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
//             onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//             title="Go to end"
//           >
//             <SkipForwardIcon />
//           </button>
//         </div>

//         {/* Timecode display */}
//         <div
//           style={{
//             background: "#0f172a",
//             padding: "8px 16px",
//             borderRadius: "6px",
//             fontFamily: "'JetBrains Mono', monospace",
//             fontSize: "14px",
//             color: "#ffffff",
//             minWidth: "110px",
//             textAlign: "center",
//             border: "1px solid #1e293b",
//             letterSpacing: "0.5px",
//           }}
//         >
//           {formatTimeCode(currentTime)}
//         </div>

//         {/* Divider */}
//         <div style={{ width: "1px", height: "24px", background: "#e2e8f0" }} />

//         {/* Edit controls */}
//         <div style={{ display: "flex", gap: "4px" }}>
//           <button
//             onClick={splitClipAtPlayhead}
//             style={{
//               height: "32px",
//               padding: "0 12px",
//               background: "#ffffff",
//               border: "1px solid #e2e8f0",
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: "#475569",
//               fontSize: "12px",
//               fontWeight: 500,
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//               transition: "all 0.15s ease",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#f8fafc";
//               e.currentTarget.style.borderColor = "#cbd5e1";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#ffffff";
//               e.currentTarget.style.borderColor = "#e2e8f0";
//             }}
//             title="Split clip at playhead (S)"
//           >
//             <ScissorsIcon />
//             Split
//           </button>
//           <button
//             onClick={deleteSelectedClip}
//             disabled={!selectedClip}
//             style={{
//               height: "32px",
//               padding: "0 12px",
//               background: selectedClip ? "#ffffff" : "#f8fafc",
//               border: `1px solid ${selectedClip ? "#fecaca" : "#e2e8f0"}`,
//               borderRadius: "6px",
//               cursor: selectedClip ? "pointer" : "not-allowed",
//               color: selectedClip ? "#ef4444" : "#cbd5e1",
//               fontSize: "12px",
//               fontWeight: 500,
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//               transition: "all 0.15s ease",
//               opacity: selectedClip ? 1 : 0.5,
//             }}
//             title="Delete selected clip (Del)"
//           >
//             <TrashIcon />
//             Delete
//           </button>
//           <button
//             onClick={addTrack}
//             style={{
//               height: "32px",
//               padding: "0 12px",
//               background: "#ffffff",
//               border: "1px solid #e2e8f0",
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: "#6366f1",
//               fontSize: "12px",
//               fontWeight: 500,
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//               transition: "all 0.15s ease",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#f8fafc";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#ffffff";
//             }}
//             title="Add new track"
//           >
//             <PlusIcon />
//             Track
//           </button>
//           <button
//             onClick={() => {
//               const colors = ["#ef4444", "#8b5cf6", "#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#06b6d4"];
//               setTracks((prev) => [
//                 ...prev,
//                 {
//                   id: `track-audio-${Date.now()}`,
//                   name: `Audio ${prev.filter(t => t.type === 'audio').length + 1}`,
//                   color: "#f59e0b",
//                   clips: [],
//                   type: "audio",
//                   muted: false,
//                   locked: false,
//                   visible: true,
//                 },
//               ]);
//             }}
//             style={{
//               height: "32px",
//               padding: "0 12px",
//               background: "#ffffff",
//               border: "1px solid #e2e8f0",
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: "#f59e0b",
//               fontSize: "12px",
//               fontWeight: 500,
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//               transition: "all 0.15s ease",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#f8fafc";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#ffffff";
//             }}
//             title="Add audio track"
//           >
//             <AudioIcon />
//             Audio
//           </button>
//         </div>

//         {/* Divider */}
//         <div style={{ width: "1px", height: "24px", background: "#e2e8f0" }} />

//         {/* Zoom controls */}
//         <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//           <button
//             onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
//             style={{
//               width: "28px",
//               height: "28px",
//               background: "#ffffff",
//               border: "1px solid #e2e8f0",
//               borderRadius: "4px",
//               cursor: "pointer",
//               color: "#64748b",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <ZoomOutIcon />
//           </button>
//           <div
//             style={{
//               background: "#ffffff",
//               borderRadius: "4px",
//               padding: "4px 8px",
//               minWidth: "50px",
//               textAlign: "center",
//               border: "1px solid #e2e8f0",
//             }}
//           >
//             <span style={{ color: "#475569", fontSize: "11px", fontWeight: 500 }}>
//               {(zoom * 100).toFixed(0)}%
//             </span>
//           </div>
//           <button
//             onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
//             style={{
//               width: "28px",
//               height: "28px",
//               background: "#ffffff",
//               border: "1px solid #e2e8f0",
//               borderRadius: "4px",
//               cursor: "pointer",
//               color: "#64748b",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <ZoomInIcon />
//           </button>
//         </div>

//         {/* Duration control - right side */}
//         <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
//           <span style={{ color: "#64748b", fontSize: "12px", fontWeight: 500 }}>Duration</span>
//           <input
//             type="number"
//             value={duration.toFixed(1)}
//             onChange={(e) => {
//               let val = parseFloat(e.target.value);
//               if (isNaN(val)) val = MIN_DURATION;
//               setDuration(Math.max(MIN_DURATION, Math.min(MAX_DURATION, val)));
//             }}
//             step="0.5"
//             min={MIN_DURATION}
//             max={MAX_DURATION}
//             style={{
//               width: "70px",
//               background: "#ffffff",
//               color: "#0f172a",
//               border: "1px solid #e2e8f0",
//               borderRadius: "6px",
//               padding: "6px 10px",
//               fontSize: "12px",
//               fontFamily: "'Inter', -apple-system, sans-serif",
//               textAlign: "center",
//             }}
//           />
//           <span style={{ color: "#64748b", fontSize: "12px" }}>sec</span>
//         </div>
//       </div>

//       {/* Timeline area */}
//       <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         {/* Track headers */}
//         <div
//           style={{
//             width: "180px",
//             minWidth: "180px",
//             background: "#fafafa",
//             borderRight: "1px solid #e2e8f0",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <div
//             style={{
//               height: `${RULER_HEIGHT}px`,
//               borderBottom: "1px solid #e2e8f0",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "#64748b",
//               fontSize: "10px",
//               fontWeight: 600,
//               letterSpacing: "1px",
//               textTransform: "uppercase",
//             }}
//           >
//             Tracks
//           </div>
//           <div style={{ flex: 1, overflowY: "auto" }}>
//             {tracks.map((track) => (
//               <TrackHeader
//                 key={track.id}
//                 track={track}
//                 onAddClip={() => addClipToTrack(track.id)}
//                 onRemove={() => removeTrack(track.id)}
//                 onToggleMute={() => toggleTrackMute(track.id)}
//                 onToggleLock={() => toggleTrackLock(track.id)}
//                 onToggleVisibility={() => toggleTrackVisibility(track.id)}
//                 canRemove={tracks.length > 1}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Timeline content */}
//         <div
//           ref={timelineRef}
//           style={{ flex: 1, overflowX: "auto", overflowY: "hidden", position: "relative" }}
//           onClick={handleTimelineClick}
//         >
//           <div style={{ minWidth: `${timelineContentWidth}px`, position: "relative" }}>
//             {/* Ruler */}
//             <div
//               style={{
//                 height: `${RULER_HEIGHT}px`,
//                 background: "#fafafa",
//                 position: "relative",
//                 borderBottom: "1px solid #e2e8f0",
//               }}
//             >
//               {renderRuler()}
//             </div>

//             {/* Tracks */}
//             {tracks.map((track, i) => (
//               <div
//                 key={track.id}
//                 style={{
//                   height: `${TRACK_HEIGHT}px`,
//                   background: i % 2 === 0 ? "#ffffff" : "#fafafa",
//                   borderBottom: "1px solid #e2e8f0",
//                   position: "relative",
//                   opacity: track.visible === false ? 0.4 : 1,
//                 }}
//               >
//                 {/* Track grid lines */}
//                 <div
//                   style={{
//                     position: "absolute",
//                     inset: 0,
//                     backgroundImage: `repeating-linear-gradient(90deg, #e2e8f0 0px, #e2e8f0 1px, transparent 1px, transparent ${pixelsPerSecond}px)`,
//                     pointerEvents: "none",
//                   }}
//                 />

//                 {/* Clips */}
//                 {track.clips.map((clip) => (
//                   <ClipComponent
//                     key={clip.id}
//                     clip={clip}
//                     trackId={track.id}
//                     pixelsPerSecond={pixelsPerSecond}
//                     selectedClip={selectedClip}
//                     setSelectedClip={setSelectedClip}
//                     handleClipDrag={handleClipDrag}
//                     handleClipResize={handleClipResize}
//                   />
//                 ))}
//               </div>
//             ))}

//             {/* Playhead */}
//             <div
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 left: `${currentTime * pixelsPerSecond}px`,
//                 width: "2px",
//                 height: "100%",
//                 background: "#6366f1",
//                 zIndex: 100,
//                 pointerEvents: "none",
//                 boxShadow: "0 0 8px rgba(99, 102, 241, 0.4)",
//               }}
//             >
//               {/* Playhead handle */}
//               <div
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: "-8px",
//                   width: "18px",
//                   height: "18px",
//                   background: "#6366f1",
//                   borderRadius: "0 0 50% 50%",
//                   cursor: "ew-resize",
//                   pointerEvents: "auto",
//                   boxShadow: "0 2px 6px rgba(99, 102, 241, 0.3)",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//                 onMouseDown={handlePlayheadMouseDown}
//               >
//                 <div
//                   style={{
//                     width: "4px",
//                     height: "4px",
//                     background: "#fff",
//                     borderRadius: "50%",
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Upload status toast */}
//       {isUploadingAudio && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: "20px",
//             right: "20px",
//             background: "#ffffff",
//             border: "1px solid #e2e8f0",
//             borderRadius: "8px",
//             padding: "12px 16px",
//             display: "flex",
//             alignItems: "center",
//             gap: "12px",
//             boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             style={{
//               width: "20px",
//               height: "20px",
//               border: "2px solid #e2e8f0",
//               borderTopColor: "#6366f1",
//               borderRadius: "50%",
//               animation: "spin 1s linear infinite",
//             }}
//           />
//           <span style={{ color: "#0f172a", fontSize: "13px", fontWeight: 500 }}>
//             Uploading audio...
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// // ============================================
// // SIDEBAR PANEL COMPONENT
// // ============================================
// interface SidebarPanelProps {
//   title: string;
//   children: React.ReactNode;
//   icon?: React.ReactNode;
// }

// const SidebarPanel: React.FC<SidebarPanelProps> = ({ title, children, icon }) => (
//   <div
//     style={{
//       background: "#ffffff",
//       borderRadius: "12px",
//       border: "1px solid #e2e8f0",
//       overflow: "hidden",
//     }}
//   >
//     <div
//       style={{
//         padding: "14px 16px",
//         borderBottom: "1px solid #e2e8f0",
//         display: "flex",
//         alignItems: "center",
//         gap: "10px",
//         background: "#fafafa",
//       }}
//     >
//       {icon && <span style={{ color: "#6366f1" }}>{icon}</span>}
//       <h3
//         style={{
//           margin: 0,
//           fontSize: "13px",
//           fontWeight: 600,
//           color: "#0f172a",
//           letterSpacing: "0.3px",
//         }}
//       >
//         {title}
//       </h3>
//     </div>
//     <div style={{ padding: "16px" }}>{children}</div>
//   </div>
// );

// // ============================================
// // MAIN EDITOR COMPONENT
// // ============================================
// export const QuoteTemplateEditor: React.FC = () => {
//   const { id } = useParams();
//   const { isUploading, uploadedUrl, uploadFile } = useFileUpload({ type: "image" });
//   const playerRef = useRef<any>(null);

//   const [currentTime, setCurrentTime] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [previewSize, setPreviewSize] = useState(1);
//   const [templateName, setTemplateName] = useState("🎬 Quote Spotlight Template");
//   const [quote, setQuote] = useState("Hello World");
//   const [author, setAuthor] = useState("Steve Job");
//   const [backgroundImage, setBackgroundImage] = useState(
//     `https://res.cloudinary.com/dnxc1lw18/image/upload/v1760979566/bg11_deliyh.jpg`
//   );
//   const [backgroundSource, setBackgroundSource] = useState<"upload" | "default">("default");
//   const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
//   const [fontColor, setFontColor] = useState("white");
//   const [fontSize, setFontSize] = useState(1);
//   const [showSafeMargins, setShowSafeMargins] = useState(false);
//   const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
//   const [activeSection, setActiveSection] = useState<"quote" | "background" | "typography" | "ai">("quote");
//   const [collapsed, setCollapsed] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportUrl, setExportUrl] = useState<string | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [duration, setDuration] = useState(9);
//   const [isLoading, setIsLoading] = useState(false);

//   const [tracks, setTracks] = useState<Track[]>([
//     {
//       id: "track-1",
//       name: "Video",
//       color: "#10b981",
//       clips: [{ id: "clip-1", start: 0, duration: 9, name: "Main Clip", color: "#10b981", type: "video" }],
//       type: "video",
//       muted: false,
//       locked: false,
//       visible: true,
//     },
//     {
//       id: "track-2",
//       name: "Quote Text",
//       color: "#3b82f6",
//       clips: [
//         {
//           id: "clip-2",
//           start: 0,
//           duration: quoteSpotlightDurationCalculator("Hello World"),
//           name: "Quote",
//           color: "#3b82f6",
//           type: "text",
//         },
//       ],
//       type: "text",
//       muted: false,
//       locked: false,
//       visible: true,
//     },
//     {
//       id: "track-3",
//       name: "Author Text",
//       color: "#f59e0b",
//       clips: [
//         {
//           id: "clip-3",
//           start: 0,
//           duration: quoteSpotlightDurationCalculator("Hello World"),
//           name: "Author",
//           color: "#f59e0b",
//           type: "text",
//         },
//       ],
//       type: "text",
//       muted: false,
//       locked: false,
//       visible: true,
//     },
//   ]);

//   const {
//     userUploads,
//     loadingUploads,
//     fetchUserUploads,
//     onlineImages,
//     loadingOnline,
//     fetchOnlineImages,
//     searchQuery,
//     setSearchQuery,
//   } = useBackgroundImages();

//   useEffect(() => {
//     fetchUserUploads();
//     fetchOnlineImages("history");
//   }, []);

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
//           setTemplateName(data.title);
//           setQuote(data.props.quote);
//           setAuthor(data.props.author);
//           setBackgroundImage(data.props.imageurl);
//           setFontFamily(data.props.fontfamily ?? "Cormorant Garamond, serif");
//           setFontColor(data.props.fontcolor ?? "white");
//           setFontSize(data.props.fontsize ?? 1);
//           setDuration(data.props.duration);
//         })
//         .catch((err) => console.error("❌ Project load failed:", err))
//         .finally(() => setIsLoading(false));
//     }
//   }, [id]);

//   const cycleBg = () => {
//     if (previewBg === "dark") setPreviewBg("light");
//     else if (previewBg === "light") setPreviewBg("grey");
//     else setPreviewBg("dark");
//   };

//   const handleSeek = useCallback((time: number) => {
//     setCurrentTime(time);
//     playerRef.current?.seekToTime(time);
//   }, []);

//   const handlePlayPause = useCallback(() => {
//     if (isPlaying) {
//       playerRef.current?.pause();
//     } else {
//       playerRef.current?.play();
//     }
//   }, [isPlaying]);

//   const handleStop = useCallback(() => {
//     playerRef.current?.pause();
//     playerRef.current?.seekToTime(0);
//     setCurrentTime(0);
//     setIsPlaying(false);
//   }, []);

//   const handleFrameUpdate = useCallback((frame: number) => {
//     const time = frame / FPS;
//     setCurrentTime(time);
//   }, []);

//   const handlePlayingChange = useCallback((playing: boolean) => {
//     setIsPlaying(playing);
//   }, []);

//   const handleAISuggestion = async () => {
//     setIsGenerating(true);
//     try {
//       const response = await fetch(`${backendPrefix}/api/generate-quote`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }
//       const data = await response.json();
//       setAuthor(data.author);
//       setQuote(data.quote);
//       setDuration(quoteSpotlightDurationCalculator(data.quote));
//     } catch (error: any) {
//       console.error("error generating ai suggestion");
//       toast.error(error.message);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   useEffect(() => {
//     if (uploadedUrl) {
//       setBackgroundImage(uploadedUrl);
//       setBackgroundSource("upload");
//       fetchUserUploads();
//     }
//   }, [uploadedUrl]);

//   const handleExport = async (format: string) => {
//     setIsExporting(true);
//     try {
//       const response = await fetch(`${backendPrefix}/generatevideo/quotetemplatewchoices`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           quote,
//           author,
//           imageurl: backgroundImage,
//           fontsize: fontSize,
//           fontcolor: fontColor,
//           fontfamily: fontFamily,
//           format,
//           duration,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}, message: ${await response.text()}`);
//       }

//       const data = await response.json();
//       setExportUrl(data.url);
//       setShowModal(true);
//     } catch (error) {
//       console.error("Export failed:", error);
//       alert(`Export failed: ${error || "Please try again."}`);
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const [messageIndex, setMessageIndex] = useState(0);
//   const messages = [
//     "⏳ Preparing your template...",
//     "🙇 Sorry for the wait, still working on it...",
//     "🚀 Almost there, thanks for your patience!",
//   ];

//   useEffect(() => {
//     if (!isLoading) return;
//     const interval = setInterval(() => {
//       setMessageIndex((prev) => (prev + 1) % messages.length);
//     }, 10000);
//     return () => clearInterval(interval);
//   }, [isLoading]);

//   const { isSaving, showSaveModal, setShowSaveModal, handleSave, saveNewProject } = useProjectSave({
//     templateId: 1,
//     buildProps: () => ({
//       quote,
//       author,
//       imageurl: backgroundImage,
//       fontsize: fontSize,
//       fontcolor: fontColor,
//       fontfamily: fontFamily,
//       duration,
//     }),
//     videoEndpoint: `${backendPrefix}/generatevideo/quotetemplatewchoices`,
//   });

//   // Input styling
//   const inputStyle: React.CSSProperties = {
//     width: "100%",
//     background: "#ffffff",
//     color: "#0f172a",
//     border: "1px solid #e2e8f0",
//     borderRadius: "8px",
//     padding: "10px 12px",
//     fontSize: "13px",
//     boxSizing: "border-box",
//     transition: "border-color 0.15s ease, box-shadow 0.15s ease",
//     outline: "none",
//   };

//   const labelStyle: React.CSSProperties = {
//     display: "block",
//     marginBottom: "6px",
//     fontWeight: 500,
//     fontSize: "12px",
//     color: "#64748b",
//     textTransform: "uppercase",
//     letterSpacing: "0.5px",
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100vh",
//         background: "#fafafa",
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       }}
//     >
//       {isLoading && <LoadingOverlay message={messages[messageIndex]} />}

//       <SaveProjectModal open={showSaveModal} onClose={() => setShowSaveModal(false)} onSave={saveNewProject} />

//       {showModal && (
//         <ExportModal
//           showExport={showModal}
//           setShowExport={setShowModal}
//           isExporting={isExporting}
//           exportUrl={exportUrl}
//           onExport={handleExport}
//         />
//       )}

//       <TopNavWithSave
//         templateName={templateName}
//         onSave={handleSave}
//         onExport={handleExport}
//         setTemplateName={setTemplateName}
//         onOpenExport={() => setShowModal(true)}
//         template={templateName}
//         isSaving={isSaving}
//       />

//       <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         {/* Side Navigation */}
//         <div style={{ display: "flex", flexDirection: "row", minWidth: `${SIDENAV_WIDTH}px` }}>
//           <SideNavTrial
//             activeSection={activeSection}
//             collapsed={collapsed}
//             setActiveSection={setActiveSection}
//             setCollapsed={setCollapsed}
//           />
//         </div>

//         <div
//           style={{ display: "flex", flexDirection: "column", flex: 1, background: "#fafafa", overflow: "hidden" }}
//         >
//           <div style={{ display: "flex", flexDirection: "row", flex: 1, overflow: "hidden" }}>
//             {/* Properties Panel */}
//             {!collapsed && (
//               <div
//                 style={{
//                   width: `${PROPERTIES_PANEL_WIDTH}px`,
//                   minWidth: `${PROPERTIES_PANEL_WIDTH}px`,
//                   padding: "16px",
//                   overflowY: "auto",
//                   background: "#fafafa",
//                   borderRight: "1px solid #e2e8f0",
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "16px",
//                 }}
//               >
//                 {/* Upload Section */}
//                 <SidebarPanel title="Media Upload" icon={<UploadIcon />}>
//                   <div
//                     style={{
//                       background: "#ffffff",
//                       border: "2px dashed #cbd5e1",
//                       borderRadius: "8px",
//                       padding: "24px",
//                       textAlign: "center",
//                       transition: "all 0.2s ease",
//                       cursor: "pointer",
//                     }}
//                     onDragOver={(e) => {
//                       e.preventDefault();
//                       e.currentTarget.style.borderColor = "#6366f1";
//                       e.currentTarget.style.background = "#f8fafc";
//                     }}
//                     onDragLeave={(e) => {
//                       e.currentTarget.style.borderColor = "#cbd5e1";
//                       e.currentTarget.style.background = "#ffffff";
//                     }}
//                     onDrop={(e) => {
//                       e.preventDefault();
//                       e.currentTarget.style.borderColor = "#cbd5e1";
//                       e.currentTarget.style.background = "#ffffff";
//                       if (e.dataTransfer.files?.[0]) {
//                         uploadFile(e.dataTransfer.files[0]);
//                         setBackgroundSource("upload");
//                       }
//                     }}
//                   >
//                     {isUploading ? (
//                       <div style={{ color: "#6366f1" }}>
//                         <div
//                           style={{
//                             width: "32px",
//                             height: "32px",
//                             border: "3px solid #e2e8f0",
//                             borderTopColor: "#6366f1",
//                             borderRadius: "50%",
//                             animation: "spin 1s linear infinite",
//                             margin: "0 auto 12px",
//                           }}
//                         />
//                         Uploading...
//                       </div>
//                     ) : (
//                       <>
//                         <div style={{ color: "#94a3b8", marginBottom: "12px" }}>
//                           <svg
//                             width="32"
//                             height="32"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="1.5"
//                             style={{ margin: "0 auto" }}
//                           >
//                             <path d="M4 14.899A7 7 0 1115.71 8h1.79a4.5 4.5 0 012.5 8.242" />
//                             <path d="M12 12v9" />
//                             <path d="M8 17l4-5 4 5" />
//                           </svg>
//                         </div>
//                         <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 12px" }}>
//                           Drag & drop or click to upload
//                         </p>
//                         <input
//                           type="file"
//                           accept="image/*,video/*"
//                           onChange={(e) => {
//                             if (e.target.files?.[0]) {
//                               uploadFile(e.target.files[0]);
//                               setBackgroundSource("upload");
//                               setActiveSection("quote");
//                             }
//                           }}
//                           style={{ display: "none" }}
//                           id="file-upload"
//                         />
//                         <label
//                           htmlFor="file-upload"
//                           style={{
//                             display: "inline-block",
//                             background: "linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)",
//                             color: "#fff",
//                             padding: "8px 20px",
//                             borderRadius: "6px",
//                             cursor: "pointer",
//                             fontSize: "12px",
//                             fontWeight: 600,
//                             transition: "transform 0.1s ease",
//                           }}
//                         >
//                           Choose File
//                         </label>
//                       </>
//                     )}
//                   </div>
//                 </SidebarPanel>

//                 {/* Quote Section */}
//                 {activeSection === "quote" && (
//                   <SidebarPanel
//                     title="Quote Content"
//                     icon={
//                       <svg
//                         width="16"
//                         height="16"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       >
//                         <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21c0 1 0 1 1 1z" />
//                         <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
//                       </svg>
//                     }
//                   >
//                     <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//                       <div>
//                         <label style={labelStyle}>Quote</label>
//                         <textarea
//                           value={quote}
//                           onChange={(e) => setQuote(e.target.value)}
//                           style={{
//                             ...inputStyle,
//                             minHeight: "100px",
//                             resize: "vertical",
//                             lineHeight: "1.5",
//                           }}
//                           placeholder="Enter your quote here"
//                           onFocus={(e) => {
//                             e.target.style.borderColor = "#6366f1";
//                             e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
//                           }}
//                           onBlur={(e) => {
//                             e.target.style.borderColor = "#e2e8f0";
//                             e.target.style.boxShadow = "none";
//                           }}
//                         />
//                       </div>
//                       <div>
//                         <label style={labelStyle}>Author</label>
//                         <input
//                           type="text"
//                           value={author}
//                           onChange={(e) => setAuthor(e.target.value)}
//                           style={inputStyle}
//                           placeholder="Enter author name"
//                           onFocus={(e) => {
//                             e.target.style.borderColor = "#6366f1";
//                             e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
//                           }}
//                           onBlur={(e) => {
//                             e.target.style.borderColor = "#e2e8f0";
//                             e.target.style.boxShadow = "none";
//                           }}
//                         />
//                       </div>
//                       <div style={{ display: "flex", gap: "8px" }}>
//                         <button
//                           onClick={handleAISuggestion}
//                           disabled={isGenerating}
//                           style={{
//                             flex: 1,
//                             padding: "12px",
//                             background: isGenerating
//                               ? "#f1f5f9"
//                               : "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
//                             color: isGenerating ? "#cbd5e1" : "#fff",
//                             border: "none",
//                             borderRadius: "8px",
//                             cursor: isGenerating ? "not-allowed" : "pointer",
//                             fontSize: "13px",
//                             fontWeight: 600,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             gap: "8px",
//                             transition: "all 0.15s ease",
//                           }}
//                         >
//                           <SparkleIcon />
//                           {isGenerating ? "Generating..." : "AI Generate"}
//                         </button>
//                         <button
//                           onClick={handleSave}
//                           disabled={isSaving}
//                           style={{
//                             flex: 1,
//                             padding: "12px",
//                             background: isSaving ? "#f1f5f9" : "#ffffff",
//                             color: isSaving ? "#cbd5e1" : "#0f172a",
//                             border: "1px solid #e2e8f0",
//                             borderRadius: "8px",
//                             cursor: isSaving ? "not-allowed" : "pointer",
//                             fontSize: "13px",
//                             fontWeight: 600,
//                             transition: "all 0.15s ease",
//                           }}
//                         >
//                           {isSaving ? "Saving..." : "Save"}
//                         </button>
//                       </div>
//                     </div>
//                   </SidebarPanel>
//                 )}

//                 {activeSection === "background" && (
//                   <BackgroundSecTrial
//                     backgroundImage={backgroundImage}
//                     backgroundSource={backgroundSource}
//                     handleFileUpload={uploadFile}
//                     isUploading={isUploading}
//                     setBackgroundImage={setBackgroundImage}
//                     setBackgroundSource={setBackgroundSource}
//                     fetchOnlineImages={fetchOnlineImages}
//                     loadingOnline={loadingOnline}
//                     loadingUploads={loadingUploads}
//                     onlineImages={onlineImages}
//                     searchQuery={searchQuery}
//                     setSearchQuery={setSearchQuery}
//                     userUploads={userUploads}
//                   />
//                 )}

//                 {activeSection === "typography" && (
//                   <TypographySectionQuote
//                     fontColor={fontColor}
//                     fontFamily={fontFamily}
//                     fontSize={fontSize}
//                     setFontColor={setFontColor}
//                     setFontFamily={setFontFamily}
//                     setFontSize={setFontSize}
//                   />
//                 )}

//                 {activeSection === "ai" && (
//                   <SidebarPanel title="AI Features" icon={<SparkleIcon />}>
//                     <div
//                       style={{
//                         textAlign: "center",
//                         padding: "24px",
//                         color: "#64748b",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: "48px",
//                           height: "48px",
//                           background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
//                           borderRadius: "12px",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           margin: "0 auto 16px",
//                         }}
//                       >
//                         <SparkleIcon />
//                       </div>
//                       <p style={{ fontSize: "13px", margin: "0 0 8px", color: "#0f172a" }}>
//                         AI Content Generation
//                       </p>
//                       <p style={{ fontSize: "12px", margin: 0 }}>
//                         Coming soon - Generate quotes, images, and more with AI
//                       </p>
//                     </div>
//                   </SidebarPanel>
//                 )}
//               </div>
//             )}

//             {/* Preview Area */}
//             <div
//               style={{
//                 flex: 1,
//                 minWidth: "400px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 overflow: "auto",
//                 padding: "24px",
//                 background: "#f1f5f9",
//                 position: "relative",
//               }}
//             >
//               {/* Subtle grid pattern */}
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   backgroundImage: `
//                     linear-gradient(to right, #e2e8f020 1px, transparent 1px),
//                     linear-gradient(to bottom, #e2e8f020 1px, transparent 1px)
//                   `,
//                   backgroundSize: "20px 20px",
//                   opacity: 0.5,
//                 }}
//               />

//               <div
//                 style={{
//                   position: "relative",
//                   background: "#ffffff",
//                   borderRadius: "12px",
//                   overflow: "hidden",
//                   boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)",
//                 }}
//               >
//                 <QuoteSpotlightPreview
//                   ref={playerRef}
//                   quote={quote}
//                   author={author}
//                   backgroundImage={backgroundImage}
//                   fontSize={fontSize}
//                   fontFamily={fontFamily}
//                   fontColor={fontColor}
//                   showSafeMargins={showSafeMargins}
//                   previewBg={previewBg}
//                   cycleBg={cycleBg}
//                   previewScale={previewSize}
//                   onPreviewScaleChange={setPreviewSize}
//                   onToggleSafeMargins={setShowSafeMargins}
//                   duration={duration}
//                   onFrameUpdate={handleFrameUpdate}
//                   onPlayingChange={handlePlayingChange}
//                   tracks={tracks}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Timeline */}
//           <InteractiveTimeline
//             duration={duration}
//             setDuration={setDuration}
//             quote={quote}
//             currentTime={currentTime}
//             isPlaying={isPlaying}
//             onSeek={handleSeek}
//             onPlayPause={handlePlayPause}
//             onStop={handleStop}
//             tracks={tracks}
//             setTracks={setTracks}
//           />
//         </div>
//       </div>

//       {/* Global styles for animations */}
//       <style>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
        
//         ::-webkit-scrollbar {
//           width: 8px;
//           height: 8px;
//         }
        
//         ::-webkit-scrollbar-track {
//           background: #f1f5f9;
//         }
        
//         ::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 4px;
//         }
        
//         ::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }
        
//         input::-webkit-outer-spin-button,
//         input::-webkit-inner-spin-button {
//           -webkit-appearance: none;
//           margin: 0;
//         }
        
//         input[type=number] {
//           -moz-appearance: textfield;
//         }
//       `}</style>
//     </div>
//   );
// };





// import React, { useState, useRef, useEffect, useCallback, type JSX } from "react";
// import { QuoteSpotlightPreview } from "../../layout/EditorPreviews/QuoteTemplatePreview";
// import { TypographySectionQuote } from "./sidenav_sections/Typo";
// import { BackgroundSecTrial } from "../Global/sidenav_sections/Backgrounds";
// import { SideNavTrial } from "./Sidenav";
// import { TopNavWithSave } from "../../navigations/single_editors/WithSave";
// import { ExportModal } from "../../ui/modals/ExportModal";
// import { SaveProjectModal } from "../../ui/modals/SaveModal";
// import { LoadingOverlay } from "../../ui/modals/LoadingProjectModal";
// import { useProjectSave } from "../../../hooks/SaveProject";
// import { backendPrefix } from "../../../config";
// import toast from "react-hot-toast";
// import { useBackgroundImages } from "../../../hooks/datafetching/UserImagesAndOnlineImages";
// import { useFileUpload } from "../../../hooks/uploads/HandleImageUpload";
// import { useParams } from "react-router-dom";

// // ============================================
// // TYPE DEFINITIONS
// // ============================================
// interface Clip {
//   id: string;
//   start: number;
//   duration: number;
//   name: string;
//   color: string;
//   type?: "video" | "text" | "audio" | "effect";
//   audioUrl?: string;
// }

// interface Track {
//   id: string;
//   name: string;
//   color: string;
//   clips: Clip[];
//   type: "video" | "text" | "audio" | "effect";
//   muted?: boolean;
//   locked?: boolean;
//   visible?: boolean;
// }

// interface PlayerHandle {
//   play: () => void;
//   pause: () => void;
//   toggle: () => void;
//   seekTo: (frame: number) => void;
//   seekToTime: (timeInSeconds: number) => void;
//   getCurrentFrame: () => number;
//   isPlaying: () => boolean;
// }

// interface InteractiveTimelineProps {
//   duration: number;
//   setDuration: (d: number) => void;
//   quote: string;
//   currentTime: number;
//   isPlaying: boolean;
//   onSeek: (time: number) => void;
//   onPlayPause: () => void;
//   onStop: () => void;
//   tracks: Track[];
//   setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
// }

// interface ClipComponentProps {
//   clip: Clip;
//   trackId: string;
//   pixelsPerSecond: number;
//   selectedClip: string | null;
//   setSelectedClip: (id: string | null) => void;
//   handleClipDrag: (trackId: string, clipId: string, deltaX: number) => void;
//   handleClipResize: (trackId: string, clipId: string, edge: "left" | "right", deltaX: number) => void;
// }

// // ============================================
// // HELPER FUNCTIONS
// // ============================================
// const quoteSpotlightDurationCalculator = (quote: string): number => {
//   let length = 0;
//   if (typeof quote === "string") {
//     length = quote.length;
//   } else if (typeof quote === "number" && isFinite(quote)) {
//     length = quote;
//   }
//   return 2.0 + Math.floor(length / 10) * 0.1;
// };

// const formatTimeCode = (time: number): string => {
//   const minutes = Math.floor(time / 60);
//   const seconds = Math.floor(time % 60);
//   const frames = Math.floor((time % 1) * 30);
//   return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`;
// };

// // ============================================
// // CONSTANTS
// // ============================================
// const PROPERTIES_PANEL_WIDTH = 320;
// const SIDENAV_WIDTH = 72;
// const HORIZONTAL_TIMELINE_HEIGHT = 280;
// const TRACK_HEIGHT = 56;
// const RULER_HEIGHT = 36;
// const CONTROLS_HEIGHT = 56;
// const MAX_DURATION = 60;
// const MIN_DURATION = 1;
// const FPS = 30;
// const PREVIEW_CONTAINER_WIDTH = 800;

// // ============================================
// // ICON COMPONENTS
// // ============================================
// const PlayIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M8 5v14l11-7z" />
//   </svg>
// );

// const PauseIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
//   </svg>
// );

// const StopIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M6 6h12v12H6z" />
//   </svg>
// );

// const SkipBackIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
//   </svg>
// );

// const SkipForwardIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M6 18l8.5-6L6 6v12zm10.5-12v12h2V6z" />
//   </svg>
// );

// const ScissorsIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="6" cy="6" r="3" />
//     <circle cx="6" cy="18" r="3" />
//     <line x1="20" y1="4" x2="8.12" y2="15.88" />
//     <line x1="14.47" y1="14.48" x2="20" y2="20" />
//     <line x1="8.12" y1="8.12" x2="12" y2="12" />
//   </svg>
// );

// const TrashIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <polyline points="3,6 5,6 21,6" />
//     <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" />
//   </svg>
// );

// const PlusIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//     <line x1="12" y1="5" x2="12" y2="19" />
//     <line x1="5" y1="12" x2="19" y2="12" />
//   </svg>
// );

// const EyeIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//     <circle cx="12" cy="12" r="3" />
//   </svg>
// );

// const LockIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
//     <path d="M7 11V7a5 5 0 0110 0v4" />
//   </svg>
// );

// const VolumeIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
//     <path d="M15.54 8.46a5 5 0 010 7.07" />
//   </svg>
// );

// const MuteIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
//     <line x1="23" y1="9" x2="17" y2="15" />
//     <line x1="17" y1="9" x2="23" y2="15" />
//   </svg>
// );

// const ZoomInIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="11" cy="11" r="8" />
//     <line x1="21" y1="21" x2="16.65" y2="16.65" />
//     <line x1="11" y1="8" x2="11" y2="14" />
//     <line x1="8" y1="11" x2="14" y2="11" />
//   </svg>
// );

// const ZoomOutIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="11" cy="11" r="8" />
//     <line x1="21" y1="21" x2="16.65" y2="16.65" />
//     <line x1="8" y1="11" x2="14" y2="11" />
//   </svg>
// );

// const SparkleIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
//   </svg>
// );

// const VideoIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <rect x="2" y="4" width="20" height="16" rx="2" />
//     <path d="M10 9l5 3-5 3V9z" />
//   </svg>
// );

// const TextIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <polyline points="4,7 4,4 20,4 20,7" />
//     <line x1="9" y1="20" x2="15" y2="20" />
//     <line x1="12" y1="4" x2="12" y2="20" />
//   </svg>
// );

// const AudioIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M9 18V5l12-2v13" />
//     <circle cx="6" cy="18" r="3" />
//     <circle cx="18" cy="16" r="3" />
//   </svg>
// );

// const UploadIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
//     <polyline points="17,8 12,3 7,8" />
//     <line x1="12" y1="3" x2="12" y2="15" />
//   </svg>
// );

// const ImageIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
//     <circle cx="8.5" cy="8.5" r="1.5" />
//     <polyline points="21 15 16 10 5 21" />
//   </svg>
// );

// const SubtitlesIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <rect x="2" y="6" width="20" height="12" rx="2" />
//     <line x1="6" y1="12" x2="10" y2="12" />
//     <line x1="14" y1="12" x2="18" y2="12" />
//     <line x1="6" y1="15" x2="18" y2="15" />
//   </svg>
// );

// const ToolsIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
//   </svg>
// );

// // ============================================
// // CLIP COMPONENT
// // ============================================
// const ClipComponent: React.FC<ClipComponentProps> = ({
//   clip,
//   trackId,
//   pixelsPerSecond,
//   selectedClip,
//   setSelectedClip,
//   handleClipDrag,
//   handleClipResize,
// }) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [isResizing, setIsResizing] = useState<"left" | "right" | null>(null);
//   const [dragStart, setDragStart] = useState({ x: 0 });
//   const [isHovered, setIsHovered] = useState(false);

//   const handleMouseDown = (e: React.MouseEvent, action: "drag" | "left" | "right") => {
//     e.stopPropagation();
//     setSelectedClip(clip.id);
//     if (action === "drag") {
//       setIsDragging(true);
//     } else {
//       setIsResizing(action);
//     }
//     setDragStart({ x: e.clientX });
//   };

//   useEffect(() => {
//     if (!isDragging && !isResizing) return;

//     const handleMouseMove = (e: MouseEvent) => {
//       const deltaX = e.clientX - dragStart.x;
//       if (isDragging) {
//         handleClipDrag(trackId, clip.id, deltaX);
//       } else if (isResizing) {
//         handleClipResize(trackId, clip.id, isResizing, deltaX);
//       }
//       setDragStart({ x: e.clientX });
//     };

//     const handleMouseUp = () => {
//       setIsDragging(false);
//       setIsResizing(null);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDragging, isResizing, dragStart, trackId, clip.id, handleClipDrag, handleClipResize]);

//   const isSelected = selectedClip === clip.id;
//   const clipWidth = Math.max(clip.duration * pixelsPerSecond, 40);

//   const getClipIcon = () => {
//     switch (clip.type) {
//       case "video":
//         return <VideoIcon />;
//       case "audio":
//         return <AudioIcon />;
//       case "text":
//         return <TextIcon />;
//       default:
//         return <VideoIcon />;
//     }
//   };

//   return (
//     <div
//       style={{
//         position: "absolute",
//         left: `${clip.start * pixelsPerSecond}px`,
//         width: `${clipWidth}px`,
//         height: "calc(100% - 8px)",
//         top: "4px",
//         background: isSelected
//           ? `linear-gradient(180deg, ${clip.color}15 0%, ${clip.color}25 100%)`
//           : `linear-gradient(180deg, ${clip.color}10 0%, ${clip.color}20 100%)`,
//         borderRadius: "6px",
//         border: isSelected ? `2px solid ${clip.color}` : `1px solid ${clip.color}40`,
//         boxShadow: isSelected
//           ? `0 0 0 1px ${clip.color}30, 0 2px 8px rgba(0,0,0,0.08)`
//           : isHovered
//             ? "0 2px 6px rgba(0,0,0,0.06)"
//             : "none",
//         cursor: isDragging ? "grabbing" : "grab",
//         display: "flex",
//         alignItems: "center",
//         overflow: "hidden",
//         userSelect: "none",
//         transition: "box-shadow 0.15s ease, border 0.15s ease",
//       }}
//       onClick={(e) => {
//         e.stopPropagation();
//         setSelectedClip(clip.id);
//       }}
//       onMouseDown={(e) => handleMouseDown(e, "drag")}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Left resize handle */}
//       <div
//         style={{
//           position: "absolute",
//           left: 0,
//           top: 0,
//           width: "8px",
//           height: "100%",
//           cursor: "ew-resize",
//           background: isHovered || isSelected ? clip.color + "30" : "transparent",
//           borderRadius: "6px 0 0 6px",
//           transition: "background 0.15s ease",
//         }}
//         onMouseDown={(e) => handleMouseDown(e, "left")}
//       />

//       {/* Clip content */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           alignItems: "center",
//           padding: "0 12px",
//           gap: "6px",
//           pointerEvents: "none",
//         }}
//       >
//         <span style={{ color: clip.color }}>{getClipIcon()}</span>
//         <span
//           style={{
//             color: "#1a1a1a",
//             fontSize: "11px",
//             fontWeight: 600,
//             whiteSpace: "nowrap",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             letterSpacing: "0.2px",
//           }}
//         >
//           {clip.name}
//         </span>
//         <span
//           style={{
//             color: "#64748b",
//             fontSize: "10px",
//             fontWeight: 500,
//             marginLeft: "auto",
//           }}
//         >
//           {clip.duration.toFixed(1)}s
//         </span>
//       </div>

//       {/* Waveform/thumbnail representation */}
//       <div
//         style={{
//           position: "absolute",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: "12px",
//           background: clip.color + "15",
//           display: "flex",
//           alignItems: "flex-end",
//           gap: "1px",
//           padding: "0 2px",
//           pointerEvents: "none",
//         }}
//       >
//         {Array.from({ length: Math.min(Math.floor(clipWidth / 4), 50) }).map((_, i) => (
//           <div
//             key={i}
//             style={{
//               flex: 1,
//               height: `${Math.random() * 8 + 2}px`,
//               background: clip.color + "40",
//               borderRadius: "1px 1px 0 0",
//             }}
//           />
//         ))}
//       </div>

//       {/* Right resize handle */}
//       <div
//         style={{
//           position: "absolute",
//           right: 0,
//           top: 0,
//           width: "8px",
//           height: "100%",
//           cursor: "ew-resize",
//           background: isHovered || isSelected ? clip.color + "30" : "transparent",
//           borderRadius: "0 6px 6px 0",
//           transition: "background 0.15s ease",
//         }}
//         onMouseDown={(e) => handleMouseDown(e, "right")}
//       />
//     </div>
//   );
// };

// // ============================================
// // TRACK HEADER COMPONENT
// // ============================================
// interface TrackHeaderProps {
//   track: Track;
//   onAddClip: () => void;
//   onRemove: () => void;
//   onToggleMute: () => void;
//   onToggleLock: () => void;
//   onToggleVisibility: () => void;
//   canRemove: boolean;
// }

// const TrackHeader: React.FC<TrackHeaderProps> = ({
//   track,
//   onAddClip,
//   onRemove,
//   onToggleMute,
//   onToggleLock,
//   onToggleVisibility,
//   canRemove,
// }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       style={{
//         height: `${TRACK_HEIGHT}px`,
//         display: "flex",
//         alignItems: "center",
//         padding: "0 12px",
//         borderBottom: "1px solid #f1f5f9",
//         background: isHovered ? "#f8fafc" : "#ffffff",
//         transition: "background 0.15s ease",
//       }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Track color indicator */}
//       <div
//         style={{
//           width: "4px",
//           height: "32px",
//           background: track.color,
//           borderRadius: "2px",
//           marginRight: "10px",
//         }}
//       />

//       {/* Track info */}
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div
//           style={{
//             color: "#0f172a",
//             fontSize: "12px",
//             fontWeight: 600,
//             whiteSpace: "nowrap",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//           }}
//         >
//           {track.name}
//         </div>
//         <div style={{ color: "#94a3b8", fontSize: "10px", textTransform: "uppercase" }}>
//           {track.type}
//         </div>
//       </div>

//       {/* Track controls */}
//       <div style={{ display: "flex", gap: "4px", opacity: isHovered ? 1 : 0.6, transition: "opacity 0.15s ease" }}>
//         <button
//           onClick={onToggleVisibility}
//           style={{
//             width: "24px",
//             height: "24px",
//             background: track.visible === false ? "#fee2e2" : "transparent",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             color: track.visible === false ? "#ef4444" : "#64748b",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           title={track.visible === false ? "Show track" : "Hide track"}
//         >
//           <EyeIcon />
//         </button>
//         <button
//           onClick={onToggleMute}
//           style={{
//             width: "24px",
//             height: "24px",
//             background: track.muted ? "#fee2e2" : "transparent",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             color: track.muted ? "#ef4444" : "#64748b",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           title={track.muted ? "Unmute" : "Mute"}
//         >
//           {track.muted ? <MuteIcon /> : <VolumeIcon />}
//         </button>
//         <button
//           onClick={onToggleLock}
//           style={{
//             width: "24px",
//             height: "24px",
//             background: track.locked ? "#fef3c7" : "transparent",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             color: track.locked ? "#f59e0b" : "#64748b",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           title={track.locked ? "Unlock" : "Lock"}
//         >
//           <LockIcon />
//         </button>
//         <button
//           onClick={onAddClip}
//           style={{
//             width: "24px",
//             height: "24px",
//             background: "transparent",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             color: "#6366f1",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           title="Add clip"
//         >
//           <PlusIcon />
//         </button>
//         {canRemove && (
//           <button
//             onClick={onRemove}
//             style={{
//               width: "24px",
//               height: "24px",
//               background: "transparent",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//               color: "#ef4444",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//             title="Remove track"
//           >
//             <TrashIcon />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// // ============================================
// // INTERACTIVE TIMELINE COMPONENT
// // ============================================
// const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
//   duration,
//   setDuration,
//   quote,
//   currentTime,
//   isPlaying,
//   onSeek,
//   onPlayPause,
//   onStop,
//   tracks,
//   setTracks,
// }) => {
//   const [zoom, setZoom] = useState(1);
//   const [selectedClip, setSelectedClip] = useState<string | null>(null);
//   const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
//   const [showAudioUploadModal, setShowAudioUploadModal] = useState(false);
//   const [targetTrackId, setTargetTrackId] = useState<string | null>(null);
//   const [isUploadingAudio, setIsUploadingAudio] = useState(false);

//   const timelineRef = useRef<HTMLDivElement>(null);
//   const audioInputRef = useRef<HTMLInputElement>(null);

//   const pixelsPerSecond = 60 * zoom;

//   // Update quote text clip duration
//   useEffect(() => {
//     const textClipDuration = Math.min(quoteSpotlightDurationCalculator(quote), duration);
//     setTracks((prev) =>
//       prev.map((track) =>
//         track.id === "track-2"
//           ? {
//               ...track,
//               clips: track.clips.map((clip, idx) =>
//                 idx === 0 ? { ...clip, duration: textClipDuration } : clip
//               ),
//             }
//           : track
//       )
//     );
//   }, [quote, duration, setTracks]);

//   // Update author text clip duration
//   useEffect(() => {
//     const textClipDuration = Math.min(quoteSpotlightDurationCalculator(quote), duration);
//     setTracks((prev) =>
//       prev.map((track) =>
//         track.id === "track-3"
//           ? {
//               ...track,
//               clips: track.clips.map((clip, idx) =>
//                 idx === 0 ? { ...clip, duration: textClipDuration } : clip
//               ),
//             }
//           : track
//       )
//     );
//   }, [quote, duration, setTracks]);

//   // Update video clip duration
//   useEffect(() => {
//     setTracks((prev) =>
//       prev.map((track) =>
//         track.id === "track-1"
//           ? {
//               ...track,
//               clips: track.clips.map((clip, idx) =>
//                 idx === 0 ? { ...clip, duration: duration } : clip
//               ),
//             }
//           : track
//       )
//     );
//   }, [duration, setTracks]);

//   const handleTimelineClick = useCallback(
//     (e: React.MouseEvent) => {
//       if (!timelineRef.current || selectedClip) return;
//       const rect = timelineRef.current.getBoundingClientRect();
//       const scrollLeft = timelineRef.current.scrollLeft;
//       const x = e.clientX - rect.left + scrollLeft;
//       const time = Math.max(0, Math.min(duration, x / pixelsPerSecond));
//       onSeek(time);
//     },
//     [duration, pixelsPerSecond, selectedClip, onSeek]
//   );

//   const handlePlayheadMouseDown = useCallback((e: React.MouseEvent) => {
//     e.stopPropagation();
//     setIsDraggingPlayhead(true);
//   }, []);

//   useEffect(() => {
//     if (!isDraggingPlayhead) return;

//     const handleMouseMove = (e: MouseEvent) => {
//       if (!timelineRef.current) return;
//       const rect = timelineRef.current.getBoundingClientRect();
//       const scrollLeft = timelineRef.current.scrollLeft;
//       const x = e.clientX - rect.left + scrollLeft;
//       const time = Math.max(0, Math.min(duration, x / pixelsPerSecond));
//       onSeek(time);
//     };

//     const handleMouseUp = () => setIsDraggingPlayhead(false);

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDraggingPlayhead, duration, pixelsPerSecond, onSeek]);

//   const handleClipResize = useCallback(
//     (trackId: string, clipId: string, edge: "left" | "right", deltaX: number) => {
//       setTracks((prev) =>
//         prev.map((track) => {
//           if (track.id !== trackId || track.locked) return track;
//           return {
//             ...track,
//             clips: track.clips.map((clip) => {
//               if (clip.id !== clipId) return clip;
//               const deltaTime = deltaX / pixelsPerSecond;
//               if (edge === "left") {
//                 const newStart = Math.max(0, clip.start + deltaTime);
//                 const newDuration = clip.duration - (newStart - clip.start);
//                 if (newDuration < 0.5) return clip;
//                 return { ...clip, start: newStart, duration: newDuration };
//               } else {
//                 const newDuration = Math.max(0.5, clip.duration + deltaTime);
//                 if (clip.start + newDuration > MAX_DURATION) return clip;
//                 return { ...clip, duration: newDuration };
//               }
//             }),
//           };
//         })
//       );
//     },
//     [pixelsPerSecond, setTracks]
//   );

//   const handleClipDrag = useCallback(
//     (trackId: string, clipId: string, deltaX: number) => {
//       setTracks((prev) =>
//         prev.map((track) => {
//           if (track.id !== trackId || track.locked) return track;
//           return {
//             ...track,
//             clips: track.clips.map((clip) => {
//               if (clip.id !== clipId) return clip;
//               const deltaTime = deltaX / pixelsPerSecond;
//               const newStart = Math.max(
//                 0,
//                 Math.min(MAX_DURATION - clip.duration, clip.start + deltaTime)
//               );
//               return { ...clip, start: newStart };
//             }),
//           };
//         })
//       );
//     },
//     [pixelsPerSecond, setTracks]
//   );

//   const addTrack = () => {
//     const colors = ["#ef4444", "#8b5cf6", "#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#06b6d4"];
//     const types: Track["type"][] = ["audio", "video", "text", "effect"];
//     setTracks((prev) => [
//       ...prev,
//       {
//         id: `track-${Date.now()}`,
//         name: `Track ${prev.length + 1}`,
//         color: colors[prev.length % colors.length],
//         clips: [],
//         type: types[prev.length % types.length],
//         muted: false,
//         locked: false,
//         visible: true,
//       },
//     ]);
//   };

//   const removeTrack = (trackId: string) => {
//     if (tracks.length <= 1) return;
//     setTracks((prev) => prev.filter((t) => t.id !== trackId));
//   };

//   const toggleTrackMute = (trackId: string) => {
//     setTracks((prev) =>
//       prev.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t))
//     );
//   };

//   const toggleTrackLock = (trackId: string) => {
//     setTracks((prev) =>
//       prev.map((t) => (t.id === trackId ? { ...t, locked: !t.locked } : t))
//     );
//   };

//   const toggleTrackVisibility = (trackId: string) => {
//     setTracks((prev) =>
//       prev.map((t) => (t.id === trackId ? { ...t, visible: t.visible === false } : t))
//     );
//   };

//   const handleAudioFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) {
//       toast.error("No file selected");
//       return;
//     }
//     if (!targetTrackId) {
//       toast.error("No target track");
//       return;
//     }

//     console.log('🎵 Processing audio file:', file.name);
//     setIsUploadingAudio(true);

//     try {
//       const audioUrl = URL.createObjectURL(file);
//       console.log('✅ Created local audio URL');

//       const audio = new Audio(audioUrl);
//       audio.addEventListener("loadedmetadata", () => {
//         const audioDuration = Math.min(audio.duration, MAX_DURATION);
//         console.log('✅ Audio duration:', audioDuration, 'seconds');

//         setTracks((prev) =>
//           prev.map((track) => {
//             if (track.id !== targetTrackId || track.locked) return track;
//             const lastClip = track.clips[track.clips.length - 1];
//             const startTime = lastClip ? lastClip.start + lastClip.duration + 0.5 : 0;
//             if (startTime >= MAX_DURATION) {
//               toast.error("Track is full");
//               return track;
//             }
//             return {
//               ...track,
//               clips: [
//                 ...track.clips,
//                 {
//                   id: `clip-${Date.now()}`,
//                   start: startTime,
//                   duration: Math.min(audioDuration, MAX_DURATION - startTime),
//                   name: file.name.replace(/\.[^/.]+$/, ""),
//                   color: track.color,
//                   type: "audio",
//                   audioUrl: audioUrl,
//                 },
//               ],
//             };
//           })
//         );

//         toast.success(`🎵 Audio added: ${file.name}`);
//         setTargetTrackId(null);
//         setIsUploadingAudio(false);
//       });

//       audio.addEventListener("error", (err) => {
//         console.error('❌ Error loading audio:', err);
//         toast.error("Invalid audio file");
//         setIsUploadingAudio(false);
//       });
//     } catch (error: any) {
//       console.error("❌ Error:", error);
//       toast.error("Failed to add audio");
//       setIsUploadingAudio(false);
//     } finally {
//       if (e.target) e.target.value = "";
//     }
//   };

//   const addClipToTrack = (trackId: string) => {
//     const track = tracks.find((t) => t.id === trackId);
//     if (!track) return;

//     if (track.type === "audio") {
//       setTargetTrackId(trackId);
//       audioInputRef.current?.click();
//     } else {
//       setTracks((prev) =>
//         prev.map((track) => {
//           if (track.id !== trackId || track.locked) return track;
//           const lastClip = track.clips[track.clips.length - 1];
//           const startTime = lastClip ? lastClip.start + lastClip.duration + 0.5 : 0;
//           if (startTime >= MAX_DURATION) return track;
//           return {
//             ...track,
//             clips: [
//               ...track.clips,
//               {
//                 id: `clip-${Date.now()}`,
//                 start: startTime,
//                 duration: Math.min(3, MAX_DURATION - startTime),
//                 name: `Clip ${track.clips.length + 1}`,
//                 color: track.color,
//                 type: track.type,
//               },
//             ],
//           };
//         })
//       );
//     }
//   };

//   const deleteSelectedClip = () => {
//     if (!selectedClip) return;
//     setTracks((prev) =>
//       prev.map((track) => ({
//         ...track,
//         clips: track.clips.filter((c) => c.id !== selectedClip),
//       }))
//     );
//     setSelectedClip(null);
//   };

//   const splitClipAtPlayhead = () => {
//     setTracks((prev) =>
//       prev.map((track) => {
//         if (track.locked) return track;
//         const newClips: Clip[] = [];
//         track.clips.forEach((clip) => {
//           const clipEnd = clip.start + clip.duration;
//           if (currentTime > clip.start && currentTime < clipEnd) {
//             newClips.push({ ...clip, duration: currentTime - clip.start });
//             newClips.push({
//               ...clip,
//               id: `clip-${Date.now()}-split`,
//               start: currentTime,
//               duration: clipEnd - currentTime,
//               name: `${clip.name} (B)`,
//             });
//           } else {
//             newClips.push(clip);
//           }
//         });
//         return { ...track, clips: newClips };
//       })
//     );
//   };

//   const renderRuler = () => {
//     const marks: JSX.Element[] = [];
//     const majorInterval = zoom >= 2 ? 1 : zoom >= 1 ? 2 : 5;
//     const minorInterval = majorInterval / 5;

//     for (let t = 0; t <= Math.ceil(duration) + 5; t += minorInterval) {
//       const isMajor = Math.abs(t % majorInterval) < 0.001 || Math.abs((t % majorInterval) - majorInterval) < 0.001;
//       marks.push(
//         <div
//           key={t}
//           style={{
//             position: "absolute",
//             left: `${t * pixelsPerSecond}px`,
//             height: isMajor ? "14px" : "6px",
//             width: "1px",
//             background: isMajor ? "#cbd5e1" : "#e2e8f0",
//             bottom: 0,
//           }}
//         >
//           {isMajor && (
//             <span
//               style={{
//                 position: "absolute",
//                 bottom: "16px",
//                 left: "-18px",
//                 width: "36px",
//                 textAlign: "center",
//                 fontSize: "10px",
//                 color: "#64748b",
//                 fontWeight: 500,
//                 fontFamily: "'Inter', -apple-system, sans-serif",
//               }}
//             >
//               {t.toFixed(0)}s
//             </span>
//           )}
//         </div>
//       );
//     }
//     return marks;
//   };

//   const timelineContentWidth = Math.max(1200, (duration + 10) * pixelsPerSecond);

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: `${HORIZONTAL_TIMELINE_HEIGHT}px`,
//         minHeight: `${HORIZONTAL_TIMELINE_HEIGHT}px`,
//         background: "#ffffff",
//         borderTop: "1px solid #e2e8f0",
//         display: "flex",
//         flexDirection: "column",
//         userSelect: "none",
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       }}
//     >
//       {/* Hidden audio file input */}
//       <input
//         ref={audioInputRef}
//         type="file"
//         accept="audio/*"
//         onChange={handleAudioFileSelect}
//         style={{ display: "none" }}
//       />

//       {/* Transport Controls */}
//       <div
//         style={{
//           height: `${CONTROLS_HEIGHT}px`,
//           background: "#fafafa",
//           display: "flex",
//           alignItems: "center",
//           padding: "0 16px",
//           gap: "8px",
//           borderBottom: "1px solid #e2e8f0",
//         }}
//       >
//         {/* Playback controls */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "4px",
//             background: "#ffffff",
//             borderRadius: "8px",
//             padding: "4px",
//             border: "1px solid #e2e8f0",
//           }}
//         >
//           <button
//             onClick={() => onSeek(0)}
//             style={{
//               width: "32px",
//               height: "32px",
//               background: "transparent",
//               border: "none",
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: "#64748b",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               transition: "background 0.15s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
//             onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//             title="Go to start"
//           >
//             <SkipBackIcon />
//           </button>
//           <button
//             onClick={onPlayPause}
//             style={{
//               width: "40px",
//               height: "40px",
//               background: isPlaying
//                 ? "linear-gradient(180deg, #ef4444 0%, #dc2626 100%)"
//                 : "linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)",
//               border: "none",
//               borderRadius: "8px",
//               cursor: "pointer",
//               color: "#fff",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               boxShadow: isPlaying
//                 ? "0 2px 8px rgba(239, 68, 68, 0.3)"
//                 : "0 2px 8px rgba(99, 102, 241, 0.3)",
//               transition: "transform 0.1s ease",
//             }}
//             onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
//             onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
//             onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//             title={isPlaying ? "Pause" : "Play"}
//           >
//             {isPlaying ? <PauseIcon /> : <PlayIcon />}
//           </button>
//           <button
//             onClick={onStop}
//             style={{
//               width: "32px",
//               height: "32px",
//               background: "transparent",
//               border: "none",
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: "#64748b",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               transition: "background 0.15s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
//             onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//             title="Stop"
//           >
//             <StopIcon />
//           </button>
//           <button
//             onClick={() => onSeek(duration)}
//             style={{
//               width: "32px",
//               height: "32px",
//               background: "transparent",
//               border: "none",
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: "#64748b",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               transition: "background 0.15s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
//             onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//             title="Go to end"
//           >
//             <SkipForwardIcon />
//           </button>
//         </div>

//         {/* Timecode display */}
//         <div
//           style={{
//             background: "#0f172a",
//             padding: "8px 16px",
//             borderRadius: "6px",
//             fontFamily: "'JetBrains Mono', monospace",
//             fontSize: "14px",
//             color: "#ffffff",
//             minWidth: "110px",
//             textAlign: "center",
//             border: "1px solid #1e293b",
//             letterSpacing: "0.5px",
//           }}
//         >
//           {formatTimeCode(currentTime)}
//         </div>

//         {/* Divider */}
//         <div style={{ width: "1px", height: "24px", background: "#e2e8f0" }} />

//         {/* Edit controls */}
//         <div style={{ display: "flex", gap: "4px" }}>
//           <button
//             onClick={splitClipAtPlayhead}
//             style={{
//               height: "32px",
//               padding: "0 12px",
//               background: "#ffffff",
//               border: "1px solid #e2e8f0",
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: "#475569",
//               fontSize: "12px",
//               fontWeight: 500,
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//               transition: "all 0.15s ease",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#f8fafc";
//               e.currentTarget.style.borderColor = "#cbd5e1";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#ffffff";
//               e.currentTarget.style.borderColor = "#e2e8f0";
//             }}
//             title="Split clip at playhead (S)"
//           >
//             <ScissorsIcon />
//             Split
//           </button>
//           <button
//             onClick={deleteSelectedClip}
//             disabled={!selectedClip}
//             style={{
//               height: "32px",
//               padding: "0 12px",
//               background: selectedClip ? "#ffffff" : "#f8fafc",
//               border: `1px solid ${selectedClip ? "#fecaca" : "#e2e8f0"}`,
//               borderRadius: "6px",
//               cursor: selectedClip ? "pointer" : "not-allowed",
//               color: selectedClip ? "#ef4444" : "#cbd5e1",
//               fontSize: "12px",
//               fontWeight: 500,
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//               transition: "all 0.15s ease",
//               opacity: selectedClip ? 1 : 0.5,
//             }}
//             title="Delete selected clip (Del)"
//           >
//             <TrashIcon />
//             Delete
//           </button>
//           <button
//             onClick={addTrack}
//             style={{
//               height: "32px",
//               padding: "0 12px",
//               background: "#ffffff",
//               border: "1px solid #e2e8f0",
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: "#6366f1",
//               fontSize: "12px",
//               fontWeight: 500,
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//               transition: "all 0.15s ease",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#f8fafc";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#ffffff";
//             }}
//             title="Add new track"
//           >
//             <PlusIcon />
//             Track
//           </button>
//           <button
//             onClick={() => {
//               const colors = ["#ef4444", "#8b5cf6", "#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#06b6d4"];
//               setTracks((prev) => [
//                 ...prev,
//                 {
//                   id: `track-audio-${Date.now()}`,
//                   name: `Audio ${prev.filter(t => t.type === 'audio').length + 1}`,
//                   color: "#f59e0b",
//                   clips: [],
//                   type: "audio",
//                   muted: false,
//                   locked: false,
//                   visible: true,
//                 },
//               ]);
//             }}
//             style={{
//               height: "32px",
//               padding: "0 12px",
//               background: "#ffffff",
//               border: "1px solid #e2e8f0",
//               borderRadius: "6px",
//               cursor: "pointer",
//               color: "#f59e0b",
//               fontSize: "12px",
//               fontWeight: 500,
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//               transition: "all 0.15s ease",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#f8fafc";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#ffffff";
//             }}
//             title="Add audio track"
//           >
//             <AudioIcon />
//             Audio
//           </button>
//         </div>

//         {/* Divider */}
//         <div style={{ width: "1px", height: "24px", background: "#e2e8f0" }} />

//         {/* Zoom controls */}
//         <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//           <button
//             onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
//             style={{
//               width: "28px",
//               height: "28px",
//               background: "#ffffff",
//               border: "1px solid #e2e8f0",
//               borderRadius: "4px",
//               cursor: "pointer",
//               color: "#64748b",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <ZoomOutIcon />
//           </button>
//           <div
//             style={{
//               background: "#ffffff",
//               borderRadius: "4px",
//               padding: "4px 8px",
//               minWidth: "50px",
//               textAlign: "center",
//               border: "1px solid #e2e8f0",
//             }}
//           >
//             <span style={{ color: "#475569", fontSize: "11px", fontWeight: 500 }}>
//               {(zoom * 100).toFixed(0)}%
//             </span>
//           </div>
//           <button
//             onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
//             style={{
//               width: "28px",
//               height: "28px",
//               background: "#ffffff",
//               border: "1px solid #e2e8f0",
//               borderRadius: "4px",
//               cursor: "pointer",
//               color: "#64748b",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <ZoomInIcon />
//           </button>
//         </div>

//         {/* Duration control - right side */}
//         <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
//           <span style={{ color: "#64748b", fontSize: "12px", fontWeight: 500 }}>Duration</span>
//           <input
//             type="number"
//             value={duration.toFixed(1)}
//             onChange={(e) => {
//               let val = parseFloat(e.target.value);
//               if (isNaN(val)) val = MIN_DURATION;
//               setDuration(Math.max(MIN_DURATION, Math.min(MAX_DURATION, val)));
//             }}
//             step="0.5"
//             min={MIN_DURATION}
//             max={MAX_DURATION}
//             style={{
//               width: "70px",
//               background: "#ffffff",
//               color: "#0f172a",
//               border: "1px solid #e2e8f0",
//               borderRadius: "6px",
//               padding: "6px 10px",
//               fontSize: "12px",
//               fontFamily: "'Inter', -apple-system, sans-serif",
//               textAlign: "center",
//             }}
//           />
//           <span style={{ color: "#64748b", fontSize: "12px" }}>sec</span>
//         </div>
//       </div>

//       {/* Timeline area */}
//       <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         {/* Track headers */}
//         <div
//           style={{
//             width: "180px",
//             minWidth: "180px",
//             background: "#fafafa",
//             borderRight: "1px solid #e2e8f0",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <div
//             style={{
//               height: `${RULER_HEIGHT}px`,
//               borderBottom: "1px solid #e2e8f0",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "#64748b",
//               fontSize: "10px",
//               fontWeight: 600,
//               letterSpacing: "1px",
//               textTransform: "uppercase",
//             }}
//           >
//             Tracks
//           </div>
//           <div style={{ flex: 1, overflowY: "auto" }}>
//             {tracks.map((track) => (
//               <TrackHeader
//                 key={track.id}
//                 track={track}
//                 onAddClip={() => addClipToTrack(track.id)}
//                 onRemove={() => removeTrack(track.id)}
//                 onToggleMute={() => toggleTrackMute(track.id)}
//                 onToggleLock={() => toggleTrackLock(track.id)}
//                 onToggleVisibility={() => toggleTrackVisibility(track.id)}
//                 canRemove={tracks.length > 1}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Timeline content */}
//         <div
//           ref={timelineRef}
//           style={{ flex: 1, overflowX: "auto", overflowY: "hidden", position: "relative" }}
//           onClick={handleTimelineClick}
//         >
//           <div style={{ minWidth: `${timelineContentWidth}px`, position: "relative" }}>
//             {/* Ruler */}
//             <div
//               style={{
//                 height: `${RULER_HEIGHT}px`,
//                 background: "#fafafa",
//                 position: "relative",
//                 borderBottom: "1px solid #e2e8f0",
//               }}
//             >
//               {renderRuler()}
//             </div>

//             {/* Tracks */}
//             {tracks.map((track, i) => (
//               <div
//                 key={track.id}
//                 style={{
//                   height: `${TRACK_HEIGHT}px`,
//                   background: i % 2 === 0 ? "#ffffff" : "#fafafa",
//                   borderBottom: "1px solid #e2e8f0",
//                   position: "relative",
//                   opacity: track.visible === false ? 0.4 : 1,
//                 }}
//               >
//                 {/* Track grid lines */}
//                 <div
//                   style={{
//                     position: "absolute",
//                     inset: 0,
//                     backgroundImage: `repeating-linear-gradient(90deg, #e2e8f0 0px, #e2e8f0 1px, transparent 1px, transparent ${pixelsPerSecond}px)`,
//                     pointerEvents: "none",
//                   }}
//                 />

//                 {/* Clips */}
//                 {track.clips.map((clip) => (
//                   <ClipComponent
//                     key={clip.id}
//                     clip={clip}
//                     trackId={track.id}
//                     pixelsPerSecond={pixelsPerSecond}
//                     selectedClip={selectedClip}
//                     setSelectedClip={setSelectedClip}
//                     handleClipDrag={handleClipDrag}
//                     handleClipResize={handleClipResize}
//                   />
//                 ))}
//               </div>
//             ))}

//             {/* Playhead */}
//             <div
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 left: `${currentTime * pixelsPerSecond}px`,
//                 width: "2px",
//                 height: "100%",
//                 background: "#6366f1",
//                 zIndex: 100,
//                 pointerEvents: "none",
//                 boxShadow: "0 0 8px rgba(99, 102, 241, 0.4)",
//               }}
//             >
//               {/* Playhead handle */}
//               <div
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: "-8px",
//                   width: "18px",
//                   height: "18px",
//                   background: "#6366f1",
//                   borderRadius: "0 0 50% 50%",
//                   cursor: "ew-resize",
//                   pointerEvents: "auto",
//                   boxShadow: "0 2px 6px rgba(99, 102, 241, 0.3)",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//                 onMouseDown={handlePlayheadMouseDown}
//               >
//                 <div
//                   style={{
//                     width: "4px",
//                     height: "4px",
//                     background: "#fff",
//                     borderRadius: "50%",
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Upload status toast */}
//       {isUploadingAudio && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: "20px",
//             right: "20px",
//             background: "#ffffff",
//             border: "1px solid #e2e8f0",
//             borderRadius: "8px",
//             padding: "12px 16px",
//             display: "flex",
//             alignItems: "center",
//             gap: "12px",
//             boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             style={{
//               width: "20px",
//               height: "20px",
//               border: "2px solid #e2e8f0",
//               borderTopColor: "#6366f1",
//               borderRadius: "50%",
//               animation: "spin 1s linear infinite",
//             }}
//           />
//           <span style={{ color: "#0f172a", fontSize: "13px", fontWeight: 500 }}>
//             Uploading audio...
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// // ============================================
// // SIDEBAR PANEL COMPONENT
// // ============================================
// interface SidebarPanelProps {
//   title: string;
//   children: React.ReactNode;
//   icon?: React.ReactNode;
// }

// const SidebarPanel: React.FC<SidebarPanelProps> = ({ title, children, icon }) => (
//   <div
//     style={{
//       background: "#ffffff",
//       borderRadius: "12px",
//       border: "1px solid #e2e8f0",
//       overflow: "hidden",
//     }}
//   >
//     <div
//       style={{
//         padding: "14px 16px",
//         borderBottom: "1px solid #e2e8f0",
//         display: "flex",
//         alignItems: "center",
//         gap: "10px",
//         background: "#fafafa",
//       }}
//     >
//       {icon && <span style={{ color: "#6366f1" }}>{icon}</span>}
//       <h3
//         style={{
//           margin: 0,
//           fontSize: "13px",
//           fontWeight: 600,
//           color: "#0f172a",
//           letterSpacing: "0.3px",
//         }}
//       >
//         {title}
//       </h3>
//     </div>
//     <div style={{ padding: "16px" }}>{children}</div>
//   </div>
// );

// // ============================================
// // SIDEBAR MENU ITEM COMPONENT
// // ============================================
// interface SidebarMenuItemProps {
//   icon: React.ReactNode;
//   label: string;
//   isActive: boolean;
//   onClick: () => void;
// }

// const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ icon, label, isActive, onClick }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <button
//       onClick={onClick}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       style={{
//         width: "100%",
//         display: "flex",
//         alignItems: "center",
//         gap: "12px",
//         padding: "12px 16px",
//         background: isActive ? "#f0f4ff" : isHovered ? "#f8fafc" : "transparent",
//         border: "none",
//         borderLeft: isActive ? "3px solid #6366f1" : "3px solid transparent",
//         cursor: "pointer",
//         transition: "all 0.15s ease",
//         textAlign: "left",
//       }}
//     >
//       <span style={{ color: isActive ? "#6366f1" : "#64748b", display: "flex", alignItems: "center" }}>
//         {icon}
//       </span>
//       <span
//         style={{
//           color: isActive ? "#6366f1" : "#475569",
//           fontSize: "13px",
//           fontWeight: isActive ? 600 : 500,
//         }}
//       >
//         {label}
//       </span>
//     </button>
//   );
// };

// // ============================================
// // MAIN EDITOR COMPONENT
// // ============================================
// export const QuoteTemplateEditor: React.FC = () => {
//   const { id } = useParams();
//   const { isUploading, uploadedUrl, uploadFile } = useFileUpload({ type: "image" });
//   const playerRef = useRef<any>(null);

//   const [currentTime, setCurrentTime] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [previewSize, setPreviewSize] = useState(1);
//   const [templateName, setTemplateName] = useState("🎬 Quote Spotlight Template");
//   const [quote, setQuote] = useState("Hello World");
//   const [author, setAuthor] = useState("Steve Job");
//   const [backgroundImage, setBackgroundImage] = useState(
//     `https://res.cloudinary.com/dnxc1lw18/image/upload/v1760979566/bg11_deliyh.jpg`
//   );
//   const [backgroundSource, setBackgroundSource] = useState<"upload" | "default">("default");
//   const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
//   const [fontColor, setFontColor] = useState("white");
//   const [fontSize, setFontSize] = useState(1);
//   const [showSafeMargins, setShowSafeMargins] = useState(true);
//   const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
//   const [activeSection, setActiveSection] = useState<"media" | "text" | "subtitles" | "audio" | "video" | "tools">("media");
//   const [collapsed, setCollapsed] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportUrl, setExportUrl] = useState<string | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [duration, setDuration] = useState(9);
//   const [isLoading, setIsLoading] = useState(false);

//   const [tracks, setTracks] = useState<Track[]>([
//     {
//       id: "track-1",
//       name: "Video",
//       color: "#10b981",
//       clips: [{ id: "clip-1", start: 0, duration: 9, name: "Main Clip", color: "#10b981", type: "video" }],
//       type: "video",
//       muted: false,
//       locked: false,
//       visible: true,
//     },
//     {
//       id: "track-2",
//       name: "Quote Text",
//       color: "#3b82f6",
//       clips: [
//         {
//           id: "clip-2",
//           start: 0,
//           duration: quoteSpotlightDurationCalculator("Hello World"),
//           name: "Quote",
//           color: "#3b82f6",
//           type: "text",
//         },
//       ],
//       type: "text",
//       muted: false,
//       locked: false,
//       visible: true,
//     },
//     {
//       id: "track-3",
//       name: "Author Text",
//       color: "#f59e0b",
//       clips: [
//         {
//           id: "clip-3",
//           start: 0,
//           duration: quoteSpotlightDurationCalculator("Hello World"),
//           name: "Author",
//           color: "#f59e0b",
//           type: "text",
//         },
//       ],
//       type: "text",
//       muted: false,
//       locked: false,
//       visible: true,
//     },
//   ]);

//   const {
//     userUploads,
//     loadingUploads,
//     fetchUserUploads,
//     onlineImages,
//     loadingOnline,
//     fetchOnlineImages,
//     searchQuery,
//     setSearchQuery,
//   } = useBackgroundImages();

//   useEffect(() => {
//     fetchUserUploads();
//     fetchOnlineImages("history");
//   }, []);

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
//           setTemplateName(data.title);
//           setQuote(data.props.quote);
//           setAuthor(data.props.author);
//           setBackgroundImage(data.props.imageurl);
//           setFontFamily(data.props.fontfamily ?? "Cormorant Garamond, serif");
//           setFontColor(data.props.fontcolor ?? "white");
//           setFontSize(data.props.fontsize ?? 1);
//           setDuration(data.props.duration);
//         })
//         .catch((err) => console.error("❌ Project load failed:", err))
//         .finally(() => setIsLoading(false));
//     }
//   }, [id]);

//   const cycleBg = () => {
//     if (previewBg === "dark") setPreviewBg("light");
//     else if (previewBg === "light") setPreviewBg("grey");
//     else setPreviewBg("dark");
//   };

//   const handleSeek = useCallback((time: number) => {
//     setCurrentTime(time);
//     playerRef.current?.seekToTime(time);
//   }, []);

//   const handlePlayPause = useCallback(() => {
//     if (isPlaying) {
//       playerRef.current?.pause();
//     } else {
//       playerRef.current?.play();
//     }
//   }, [isPlaying]);

//   const handleStop = useCallback(() => {
//     playerRef.current?.pause();
//     playerRef.current?.seekToTime(0);
//     setCurrentTime(0);
//     setIsPlaying(false);
//   }, []);

//   const handleFrameUpdate = useCallback((frame: number) => {
//     const time = frame / FPS;
//     setCurrentTime(time);
//   }, []);

//   const handlePlayingChange = useCallback((playing: boolean) => {
//     setIsPlaying(playing);
//   }, []);

//   const handleAISuggestion = async () => {
//     setIsGenerating(true);
//     try {
//       const response = await fetch(`${backendPrefix}/api/generate-quote`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }
//       const data = await response.json();
//       setAuthor(data.author);
//       setQuote(data.quote);
//       setDuration(quoteSpotlightDurationCalculator(data.quote));
//     } catch (error: any) {
//       console.error("error generating ai suggestion");
//       toast.error(error.message);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   useEffect(() => {
//     if (uploadedUrl) {
//       setBackgroundImage(uploadedUrl);
//       setBackgroundSource("upload");
//       fetchUserUploads();
//     }
//   }, [uploadedUrl]);

//   const handleExport = async (format: string) => {
//     setIsExporting(true);
//     try {
//       const response = await fetch(`${backendPrefix}/generatevideo/quotetemplatewchoices`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           quote,
//           author,
//           imageurl: backgroundImage,
//           fontsize: fontSize,
//           fontcolor: fontColor,
//           fontfamily: fontFamily,
//           format,
//           duration,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}, message: ${await response.text()}`);
//       }

//       const data = await response.json();
//       setExportUrl(data.url);
//       setShowModal(true);
//     } catch (error) {
//       console.error("Export failed:", error);
//       alert(`Export failed: ${error || "Please try again."}`);
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const [messageIndex, setMessageIndex] = useState(0);
//   const messages = [
//     "⏳ Preparing your template...",
//     "🙇 Sorry for the wait, still working on it...",
//     "🚀 Almost there, thanks for your patience!",
//   ];

//   useEffect(() => {
//     if (!isLoading) return;
//     const interval = setInterval(() => {
//       setMessageIndex((prev) => (prev + 1) % messages.length);
//     }, 10000);
//     return () => clearInterval(interval);
//   }, [isLoading]);

//   const { isSaving, showSaveModal, setShowSaveModal, handleSave, saveNewProject } = useProjectSave({
//     templateId: 1,
//     buildProps: () => ({
//       quote,
//       author,
//       imageurl: backgroundImage,
//       fontsize: fontSize,
//       fontcolor: fontColor,
//       fontfamily: fontFamily,
//       duration,
//     }),
//     videoEndpoint: `${backendPrefix}/generatevideo/quotetemplatewchoices`,
//   });

//   // Input styling
//   const inputStyle: React.CSSProperties = {
//     width: "100%",
//     background: "#ffffff",
//     color: "#0f172a",
//     border: "1px solid #e2e8f0",
//     borderRadius: "8px",
//     padding: "10px 12px",
//     fontSize: "13px",
//     boxSizing: "border-box",
//     transition: "border-color 0.15s ease, box-shadow 0.15s ease",
//     outline: "none",
//   };

//   const labelStyle: React.CSSProperties = {
//     display: "block",
//     marginBottom: "6px",
//     fontWeight: 500,
//     fontSize: "12px",
//     color: "#64748b",
//     textTransform: "uppercase",
//     letterSpacing: "0.5px",
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100vh",
//         background: "#fafafa",
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       }}
//     >
//       {isLoading && <LoadingOverlay message={messages[messageIndex]} />}

//       <SaveProjectModal open={showSaveModal} onClose={() => setShowSaveModal(false)} onSave={saveNewProject} />

//       {showModal && (
//         <ExportModal
//           showExport={showModal}
//           setShowExport={setShowModal}
//           isExporting={isExporting}
//           exportUrl={exportUrl}
//           onExport={handleExport}
//         />
//       )}

//       <TopNavWithSave
//         templateName={templateName}
//         onSave={handleSave}
//         onExport={handleExport}
//         setTemplateName={setTemplateName}
//         onOpenExport={() => setShowModal(true)}
//         template={templateName}
//         isSaving={isSaving}
//       />

//       <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         <div
//           style={{ display: "flex", flexDirection: "column", flex: 1, background: "#fafafa", overflow: "hidden" }}
//         >
//           <div style={{ display: "flex", flexDirection: "row", flex: 1, overflow: "hidden" }}>
//             {/* Left Sidebar with Menu Items */}
//             <div
//               style={{
//                 width: "240px",
//                 minWidth: "240px",
//                 background: "#ffffff",
//                 borderRight: "1px solid #e2e8f0",
//                 display: "flex",
//                 flexDirection: "column",
//                 overflowY: "auto",
//               }}
//             >
//               <div
//                 style={{
//                   padding: "16px",
//                   borderBottom: "1px solid #e2e8f0",
//                 }}
//               >
//                 <h2
//                   style={{
//                     margin: 0,
//                     fontSize: "14px",
//                     fontWeight: 600,
//                     color: "#0f172a",
//                     textTransform: "uppercase",
//                     letterSpacing: "0.5px",
//                   }}
//                 >
//                   Editor
//                 </h2>
//               </div>
//               <div style={{ flex: 1 }}>
//                 <SidebarMenuItem
//                   icon={<ImageIcon />}
//                   label="Media"
//                   isActive={activeSection === "media"}
//                   onClick={() => setActiveSection("media")}
//                 />
//                 <SidebarMenuItem
//                   icon={<TextIcon />}
//                   label="Text"
//                   isActive={activeSection === "text"}
//                   onClick={() => setActiveSection("text")}
//                 />
//                 <SidebarMenuItem
//                   icon={<SubtitlesIcon />}
//                   label="Subtitles"
//                   isActive={activeSection === "subtitles"}
//                   onClick={() => setActiveSection("subtitles")}
//                 />
//                 <SidebarMenuItem
//                   icon={<AudioIcon />}
//                   label="Audio"
//                   isActive={activeSection === "audio"}
//                   onClick={() => setActiveSection("audio")}
//                 />
//                 <SidebarMenuItem
//                   icon={<VideoIcon />}
//                   label="Video"
//                   isActive={activeSection === "video"}
//                   onClick={() => setActiveSection("video")}
//                 />
//                 <SidebarMenuItem
//                   icon={<ToolsIcon />}
//                   label="Tools"
//                   isActive={activeSection === "tools"}
//                   onClick={() => setActiveSection("tools")}
//                 />
//               </div>
//             </div>

//             {/* Properties Panel */}
//             <div
//               style={{
//                 width: `${PROPERTIES_PANEL_WIDTH}px`,
//                 minWidth: `${PROPERTIES_PANEL_WIDTH}px`,
//                 padding: "16px",
//                 overflowY: "auto",
//                 background: "#fafafa",
//                 borderRight: "1px solid #e2e8f0",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "16px",
//               }}
//             >
//               {/* Media Section */}
//               {activeSection === "media" && (
//                 <>
//                   <SidebarPanel title="Media Upload" icon={<UploadIcon />}>
//                     <div
//                       style={{
//                         background: "#ffffff",
//                         border: "2px dashed #cbd5e1",
//                         borderRadius: "8px",
//                         padding: "24px",
//                         textAlign: "center",
//                         transition: "all 0.2s ease",
//                         cursor: "pointer",
//                       }}
//                       onDragOver={(e) => {
//                         e.preventDefault();
//                         e.currentTarget.style.borderColor = "#6366f1";
//                         e.currentTarget.style.background = "#f8fafc";
//                       }}
//                       onDragLeave={(e) => {
//                         e.currentTarget.style.borderColor = "#cbd5e1";
//                         e.currentTarget.style.background = "#ffffff";
//                       }}
//                       onDrop={(e) => {
//                         e.preventDefault();
//                         e.currentTarget.style.borderColor = "#cbd5e1";
//                         e.currentTarget.style.background = "#ffffff";
//                         if (e.dataTransfer.files?.[0]) {
//                           uploadFile(e.dataTransfer.files[0]);
//                           setBackgroundSource("upload");
//                         }
//                       }}
//                     >
//                       {isUploading ? (
//                         <div style={{ color: "#6366f1" }}>
//                           <div
//                             style={{
//                               width: "32px",
//                               height: "32px",
//                               border: "3px solid #e2e8f0",
//                               borderTopColor: "#6366f1",
//                               borderRadius: "50%",
//                               animation: "spin 1s linear infinite",
//                               margin: "0 auto 12px",
//                             }}
//                           />
//                           Uploading...
//                         </div>
//                       ) : (
//                         <>
//                           <div style={{ color: "#94a3b8", marginBottom: "12px" }}>
//                             <svg
//                               width="32"
//                               height="32"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeWidth="1.5"
//                               style={{ margin: "0 auto" }}
//                             >
//                               <path d="M4 14.899A7 7 0 1115.71 8h1.79a4.5 4.5 0 012.5 8.242" />
//                               <path d="M12 12v9" />
//                               <path d="M8 17l4-5 4 5" />
//                             </svg>
//                           </div>
//                           <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 12px" }}>
//                             Drag & drop or click to upload
//                           </p>
//                           <input
//                             type="file"
//                             accept="image/*,video/*"
//                             onChange={(e) => {
//                               if (e.target.files?.[0]) {
//                                 uploadFile(e.target.files[0]);
//                                 setBackgroundSource("upload");
//                               }
//                             }}
//                             style={{ display: "none" }}
//                             id="file-upload"
//                           />
//                           <label
//                             htmlFor="file-upload"
//                             style={{
//                               display: "inline-block",
//                               background: "linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)",
//                               color: "#fff",
//                               padding: "8px 20px",
//                               borderRadius: "6px",
//                               cursor: "pointer",
//                               fontSize: "12px",
//                               fontWeight: 600,
//                               transition: "transform 0.1s ease",
//                             }}
//                           >
//                             Choose File
//                           </label>
//                         </>
//                       )}
//                     </div>
//                   </SidebarPanel>

//                   <BackgroundSecTrial
//                     backgroundImage={backgroundImage}
//                     backgroundSource={backgroundSource}
//                     handleFileUpload={uploadFile}
//                     isUploading={isUploading}
//                     setBackgroundImage={setBackgroundImage}
//                     setBackgroundSource={setBackgroundSource}
//                     fetchOnlineImages={fetchOnlineImages}
//                     loadingOnline={loadingOnline}
//                     loadingUploads={loadingUploads}
//                     onlineImages={onlineImages}
//                     searchQuery={searchQuery}
//                     setSearchQuery={setSearchQuery}
//                     userUploads={userUploads}
//                   />
//                 </>
//               )}

//               {/* Text Section */}
//               {activeSection === "text" && (
//                 <>
//                   <SidebarPanel
//                     title="Quote Content"
//                     icon={<TextIcon />}
//                   >
//                     <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//                       <div>
//                         <label style={labelStyle}>Quote</label>
//                         <textarea
//                           value={quote}
//                           onChange={(e) => setQuote(e.target.value)}
//                           style={{
//                             ...inputStyle,
//                             minHeight: "100px",
//                             resize: "vertical",
//                             lineHeight: "1.5",
//                           }}
//                           placeholder="Enter your quote here"
//                           onFocus={(e) => {
//                             e.target.style.borderColor = "#6366f1";
//                             e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
//                           }}
//                           onBlur={(e) => {
//                             e.target.style.borderColor = "#e2e8f0";
//                             e.target.style.boxShadow = "none";
//                           }}
//                         />
//                       </div>
//                       <div>
//                         <label style={labelStyle}>Author</label>
//                         <input
//                           type="text"
//                           value={author}
//                           onChange={(e) => setAuthor(e.target.value)}
//                           style={inputStyle}
//                           placeholder="Enter author name"
//                           onFocus={(e) => {
//                             e.target.style.borderColor = "#6366f1";
//                             e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
//                           }}
//                           onBlur={(e) => {
//                             e.target.style.borderColor = "#e2e8f0";
//                             e.target.style.boxShadow = "none";
//                           }}
//                         />
//                       </div>
//                       <div style={{ display: "flex", gap: "8px" }}>
//                         <button
//                           onClick={handleAISuggestion}
//                           disabled={isGenerating}
//                           style={{
//                             flex: 1,
//                             padding: "12px",
//                             background: isGenerating
//                               ? "#f1f5f9"
//                               : "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
//                             color: isGenerating ? "#cbd5e1" : "#fff",
//                             border: "none",
//                             borderRadius: "8px",
//                             cursor: isGenerating ? "not-allowed" : "pointer",
//                             fontSize: "13px",
//                             fontWeight: 600,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             gap: "8px",
//                             transition: "all 0.15s ease",
//                           }}
//                         >
//                           <SparkleIcon />
//                           {isGenerating ? "Generating..." : "AI Generate"}
//                         </button>
//                         <button
//                           onClick={handleSave}
//                           disabled={isSaving}
//                           style={{
//                             flex: 1,
//                             padding: "12px",
//                             background: isSaving ? "#f1f5f9" : "#ffffff",
//                             color: isSaving ? "#cbd5e1" : "#0f172a",
//                             border: "1px solid #e2e8f0",
//                             borderRadius: "8px",
//                             cursor: isSaving ? "not-allowed" : "pointer",
//                             fontSize: "13px",
//                             fontWeight: 600,
//                             transition: "all 0.15s ease",
//                           }}
//                         >
//                           {isSaving ? "Saving..." : "Save"}
//                         </button>
//                       </div>
//                     </div>
//                   </SidebarPanel>

//                   <TypographySectionQuote
//                     fontColor={fontColor}
//                     fontFamily={fontFamily}
//                     fontSize={fontSize}
//                     setFontColor={setFontColor}
//                     setFontFamily={setFontFamily}
//                     setFontSize={setFontSize}
//                   />
//                 </>
//               )}

//               {/* Subtitles Section */}
//               {activeSection === "subtitles" && (
//                 <SidebarPanel title="Subtitles" icon={<SubtitlesIcon />}>
//                   <div
//                     style={{
//                       textAlign: "center",
//                       padding: "24px",
//                       color: "#64748b",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "48px",
//                         height: "48px",
//                         background: "#f1f5f9",
//                         borderRadius: "12px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         margin: "0 auto 16px",
//                       }}
//                     >
//                       <SubtitlesIcon />
//                     </div>
//                     <p style={{ fontSize: "13px", margin: "0 0 8px", color: "#0f172a" }}>
//                       Subtitle Tools
//                     </p>
//                     <p style={{ fontSize: "12px", margin: 0 }}>
//                       Add auto-generated or custom subtitles
//                     </p>
//                   </div>
//                 </SidebarPanel>
//               )}

//               {/* Audio Section */}
//               {activeSection === "audio" && (
//                 <SidebarPanel title="Audio Settings" icon={<AudioIcon />}>
//                   <div
//                     style={{
//                       textAlign: "center",
//                       padding: "24px",
//                       color: "#64748b",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "48px",
//                         height: "48px",
//                         background: "#fef3c7",
//                         borderRadius: "12px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         margin: "0 auto 16px",
//                       }}
//                     >
//                       <AudioIcon />
//                     </div>
//                     <p style={{ fontSize: "13px", margin: "0 0 8px", color: "#0f172a" }}>
//                       Audio Controls
//                     </p>
//                     <p style={{ fontSize: "12px", margin: 0 }}>
//                       Upload background music or voiceover
//                     </p>
//                   </div>
//                 </SidebarPanel>
//               )}

//               {/* Video Section */}
//               {activeSection === "video" && (
//                 <SidebarPanel title="Video Settings" icon={<VideoIcon />}>
//                   <div
//                     style={{
//                       textAlign: "center",
//                       padding: "24px",
//                       color: "#64748b",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "48px",
//                         height: "48px",
//                         background: "#dbeafe",
//                         borderRadius: "12px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         margin: "0 auto 16px",
//                       }}
//                     >
//                       <VideoIcon />
//                     </div>
//                     <p style={{ fontSize: "13px", margin: "0 0 8px", color: "#0f172a" }}>
//                       Video Controls
//                     </p>
//                     <p style={{ fontSize: "12px", margin: 0 }}>
//                       Adjust video properties and effects
//                     </p>
//                   </div>
//                 </SidebarPanel>
//               )}

//               {/* Tools Section */}
//               {activeSection === "tools" && (
//                 <SidebarPanel title="Additional Tools" icon={<ToolsIcon />}>
//                   <div
//                     style={{
//                       textAlign: "center",
//                       padding: "24px",
//                       color: "#64748b",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "48px",
//                         height: "48px",
//                         background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
//                         borderRadius: "12px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         margin: "0 auto 16px",
//                       }}
//                     >
//                       <SparkleIcon />
//                     </div>
//                     <p style={{ fontSize: "13px", margin: "0 0 8px", color: "#0f172a" }}>
//                       AI & Advanced Tools
//                     </p>
//                     <p style={{ fontSize: "12px", margin: 0 }}>
//                       Coming soon - AI generation, filters, and more
//                     </p>
//                   </div>
//                 </SidebarPanel>
//               )}
//             </div>

//             {/* Preview Area - Now with fixed width */}
//             <div
//               style={{
//                 width: collapsed ? "100%" : `${PREVIEW_CONTAINER_WIDTH}px`,
//                 minWidth: collapsed ? "400px" : `${PREVIEW_CONTAINER_WIDTH}px`,
//                 maxWidth: collapsed ? "none" : `${PREVIEW_CONTAINER_WIDTH}px`,
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 overflow: "auto",
//                 padding: "24px",
//                 background: "#f1f5f9",
//                 position: "relative",
//               }}
//             >
//               {/* Subtle grid pattern */}
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   backgroundImage: `
//                     linear-gradient(to right, #e2e8f020 1px, transparent 1px),
//                     linear-gradient(to bottom, #e2e8f020 1px, transparent 1px)
//                   `,
//                   backgroundSize: "20px 20px",
//                   opacity: 0.5,
//                 }}
//               />

//               <div
//                 style={{
//                   position: "relative",
//                   background: "#ffffff",
//                   borderRadius: "12px",
//                   overflow: "hidden",
//                   boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)",
//                 }}
//               >
//                 <QuoteSpotlightPreview
//                   ref={playerRef}
//                   quote={quote}
//                   author={author}
//                   backgroundImage={backgroundImage}
//                   fontSize={fontSize}
//                   fontFamily={fontFamily}
//                   fontColor={fontColor}
//                   showSafeMargins={showSafeMargins}
//                   previewBg={previewBg}
//                   cycleBg={cycleBg}
//                   previewScale={previewSize}
//                   onPreviewScaleChange={setPreviewSize}
//                   onToggleSafeMargins={setShowSafeMargins}
//                   duration={duration}
//                   onFrameUpdate={handleFrameUpdate}
//                   onPlayingChange={handlePlayingChange}
//                   tracks={tracks}
//                 />
//               </div>
//             </div>

//             {/* Right side properties panel placeholder (if needed in future) */}
//             <div style={{ flex: 1, minWidth: 0, background: "#fafafa" }} />
//           </div>

//           {/* Timeline */}
//           <InteractiveTimeline
//             duration={duration}
//             setDuration={setDuration}
//             quote={quote}
//             currentTime={currentTime}
//             isPlaying={isPlaying}
//             onSeek={handleSeek}
//             onPlayPause={handlePlayPause}
//             onStop={handleStop}
//             tracks={tracks}
//             setTracks={setTracks}
//           />
//         </div>
//       </div>

//       {/* Global styles for animations */}
//       <style>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
        
//         ::-webkit-scrollbar {
//           width: 8px;
//           height: 8px;
//         }
        
//         ::-webkit-scrollbar-track {
//           background: #f1f5f9;
//         }
        
//         ::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 4px;
//         }
        
//         ::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }
        
//         input::-webkit-outer-spin-button,
//         input::-webkit-inner-spin-button {
//           -webkit-appearance: none;
//           margin: 0;
//         }
        
//         input[type=number] {
//           -moz-appearance: textfield;
//         }
//       `}</style>
//     </div>
//   );
// };


// import React, { useState, useRef, useEffect, useCallback, type JSX } from "react";
// import { QuoteSpotlightPreview } from "../../layout/EditorPreviews/QuoteTemplatePreview";
// import { TypographySectionQuote } from "./sidenav_sections/Typo";
// import { defaultpanelwidth } from "../../../data/DefaultValues";
// import { quoteSpotlightDurationCalculator } from "../../../utils/QuoteSpotlightHelpers";
// import { ExportModal } from "../../ui/modals/ExportModal";
// // import { TopNavWithoutBatchrendering } from "../../navigations/single_editors/withoutswitchmodesbutton";
// // import { useProjectSave } from "../../../hooks/SaveProject";
// import { useParams } from "react-router-dom";
// import { TopNavWithSave } from "../../navigations/single_editors/WithSave";
// import { ExportModal } from "../../ui/modals/ExportModal";
// import { SaveProjectModal } from "../../ui/modals/SaveModal";
// import { LoadingOverlay } from "../../ui/modals/LoadingProjectModal";
// import { useProjectSave } from "../../../hooks/SaveProject";
// import { backendPrefix } from "../../../config";
// // import { renderVideo } from "../../../utils/VideoRenderer";
// import { useProjectSave2 } from "../../../hooks/saveProjectVersion2";
// import { renderVideoUsingLambda } from "../../../utils/lambdarendering";
// import { SubtitlesIcon } from "lucide-react";
// import { QuoteEditor } from "./sidenav_sections/Text";
// import { BackgroundSecTrial } from "../Global/sidenav_sections/Backgrounds";

// // ============================================
// // SIDEBAR MENU ITEM COMPONENT
// // ============================================
// interface SidebarMenuItemProps {
//   icon: React.ReactNode;
//   label: string;
//   isActive: boolean;
//   onClick: () => void;
// }

// const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ icon, label, isActive, onClick }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <button
//       onClick={onClick}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       style={{
//         width: "100%",
//         display: "flex",
//         alignItems: "center",
//         gap: "12px",
//         padding: "12px 16px",
//         background: isActive ? "#f0f4ff" : isHovered ? "#f8fafc" : "transparent",
//         border: "none",
//         borderLeft: isActive ? "3px solid #6366f1" : "3px solid transparent",
//         cursor: "pointer",
//         transition: "all 0.15s ease",
//         textAlign: "left",
//       }}
//     >
//       <span style={{ color: isActive ? "#6366f1" : "#64748b", display: "flex", alignItems: "center" }}>
//         {icon}
//       </span>
//       <span
//         style={{
//           color: isActive ? "#6366f1" : "#475569",
//           fontSize: "13px",
//           fontWeight: isActive ? 600 : 500,
//         }}
//       >
//         {label}
//       </span>
//     </button>
//   );
// };

// // ============================================
// // MAIN EDITOR COMPONENT
// // ============================================
// export const QuoteTemplateEditor: React.FC = () => {
//   const { id } = useParams();
//   const { isUploading, uploadedUrl, uploadFile } = useFileUpload({ type: "image" });

//   const playerRef = useRef<any>(null);

//   const [currentTime, setCurrentTime] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [previewSize, setPreviewSize] = useState(1);
//   const [templateName, setTemplateName] = useState("🎬 Quote Spotlight Template");
//   const [quote, setQuote] = useState("Hello World");
//   const [author, setAuthor] = useState("Steve Job");
//   const [backgroundImage, setBackgroundImage] = useState(
//     `https://res.cloudinary.com/dnxc1lw18/image/upload/v1760979566/bg11_deliyh.jpg`
//   );
//   const [backgroundSource, setBackgroundSource] = useState<"upload" | "default">("default");
//   const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
//   const [fontColor, setFontColor] = useState("white");
//   const [fontSize, setFontSize] = useState(1);
//   const [showSafeMargins, setShowSafeMargins] = useState(true);
//   const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
//   const [activeSection, setActiveSection] = useState<"media" | "text" | "subtitles" | "audio" | "video" | "tools">("media");
//   const [collapsed, setCollapsed] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportUrl, setExportUrl] = useState<string | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [duration, setDuration] = useState(9);
//   const [isLoading, setIsLoading] = useState(false);

//   const {
//     userUploads,
//     loadingUploads,
//     fetchUserUploads,
//     onlineImages,
//     loadingOnline,
//     fetchOnlineImages,
//     searchQuery,
//     setSearchQuery,
//   } = useBackgroundImages();

//   useEffect(() => {
//     fetchUserUploads();
//     fetchOnlineImages("gradient");
//   }, []);
//   // 🔹 Drag handlers
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isResizing) return;
//       const newWidth =
//         e.clientX - (panelRef.current?.getBoundingClientRect().left || 0);
//       if (newWidth > 200 && newWidth < 600) {
//         setPanelWidth(newWidth);
//       }
//     };

//   const {
//     userUploads,
//     loadingUploads,
//     fetchUserUploads,
//     onlineImages,
//     loadingOnline,
//     fetchOnlineImages,
//     searchQuery,
//     setSearchQuery,
//   } = useBackgroundImages();

//   useEffect(() => {
//     fetchUserUploads();
//     fetchOnlineImages("history");
//   }, []);

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
//           setTemplateName(data.title);
//           setQuote(data.props.quote);
//           setAuthor(data.props.author);
//           setBackgroundImage(data.props.imageurl);
//           setFontFamily(data.props.fontfamily ?? "Cormorant Garamond, serif");
//           setFontColor(data.props.fontcolor ?? "white");
//           setFontSize(data.props.fontsize ?? 1);
//           setDuration(data.props.duration);
//         })
//         .catch((err) => console.error("❌ Project load failed:", err))
//         .finally(() => setIsLoading(false));
//     }
//   }, [id]);

//   const cycleBg = () => {
//     if (previewBg === "dark") setPreviewBg("light");
//     else if (previewBg === "light") setPreviewBg("grey");
//     else setPreviewBg("dark");
//   };

//   const handleSeek = useCallback((time: number) => {
//     setCurrentTime(time);
//     playerRef.current?.seekToTime(time);
//   }, []);

//   const handlePlayPause = useCallback(() => {
//     if (isPlaying) {
//       playerRef.current?.pause();
//     } else {
//       playerRef.current?.play();
//     }
//   }, [isPlaying]);

//   const handleStop = useCallback(() => {
//     playerRef.current?.pause();
//     playerRef.current?.seekToTime(0);
//     setCurrentTime(0);
//     setIsPlaying(false);
//   }, []);

//   const handleFrameUpdate = useCallback((frame: number) => {
//     const time = frame / FPS;
//     setCurrentTime(time);
//   }, []);

//   const handlePlayingChange = useCallback((playing: boolean) => {
//     setIsPlaying(playing);
//   }, []);

//   const handleAISuggestion = async () => {
//     setIsGenerating(true);
//     try {
//       const response = await fetch(`${backendPrefix}/api/generate-quote`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }

//       const data = await response.json();
//       setAuthor(data.author);
//       setQuote(data.quote);
//       setDuration(quoteSpotlightDurationCalculator(data.quote));
//     } catch (error: any) {
//       console.error("error generating ai suggestion");
//       toast.error(error.message);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   useEffect(() => {
//     if (uploadedUrl) {
//       setBackgroundImage(uploadedUrl);
//       setBackgroundSource("upload");
//       fetchUserUploads();
//     }
//   }, [uploadedUrl]);

//   const handleExport = async (format: string) => {
//     setIsExporting(true);

//     const props = {
//       quote,
//       author,
//       fontColor,
//       fontSize,
//       fontFamily,
//       backgroundImage,
//     };

//     const exportResponse = await renderVideoUsingLambda(props, "QuoteComposition", format);

//     if(exportResponse === "error"){
//       toast.error("There was an error exporting your video")
//     }else{
//       setExportUrl(exportResponse);
//     }
//     setShowModal(true);
//     setIsExporting(false);

//     // try {
//     //   const response = await fetch(
//     //     `${backendPrefix}/generatevideo/render-video`,
//     //     {
//     //       method: "POST",
//     //       headers: { "Content-Type": "application/json" },
//     //       body: JSON.stringify({
//     //         props: {
//     //           quote,
//     //           author,
//     //           fontColor,
//     //           fontSize,
//     //           fontFamily,
//     //           backgroundImage,
//     //         },
//     //         compositionId: "QuoteComposition",
//     //         format: format,
//     //       }),
//     //     }
//     //   );

//     //   if (!response.ok) {
//     //     const errorText = await response.text();
//     //     throw new Error(
//     //       `HTTP error! status: ${response.status}, message: ${errorText}`
//     //     );
//     //   }

//     //   const data = await response.json();
//     //   const renderUrl = data.url;
//     //   if (renderUrl) {
//     //     const saveResponse = await fetch(`${backendPrefix}/renders`, {
//     //       method: "POST",
//     //       headers: {
//     //         "Content-Type": "application/json",
//     //         Authorization: `Bearer ${localStorage.getItem("token")}`,
//     //       },
//     //       body: JSON.stringify({
//     //         templateId: 1,
//     //         outputUrl: renderUrl,
//     //         type: format,
//     //       }),
//     //     });

//     //     if (!saveResponse.ok) {
//     //       throw new Error(
//     //         `Failed to save upload: ${
//     //           saveResponse.status
//     //         } ${await saveResponse.text()}`
//     //       );
//     //     }

//     //     const saveData = await saveResponse.json();
//     //     console.log("✅ Render saved to DB:", saveData);
//     //   }
//     //   setExportUrl(data.url);
//     //   setShowModal(true);
//     // } catch (error) {
//     //   console.error("Export failed:", error);
//     //   alert(`Export failed: ${error || "Please try again."}`);
//     // } finally {
//     //   setIsExporting(false);
//     // }
//   };

//   const [messageIndex, setMessageIndex] = useState(0);
//   const messages = [
//     "⏳ Preparing your template...",
//     "🙇 Sorry for the wait, still working on it...",
//     "🚀 Almost there, thanks for your patience!",
//   ];

//   useEffect(() => {
//     if (!isLoading) return;
//     const interval = setInterval(() => {
//       setMessageIndex((prev) => (prev + 1) % messages.length);
//     }, 10000);
//     return () => clearInterval(interval);
//   }, [isLoading]);

//   const {
//     setProjectId,
//     isSaving,
//     showSaveModal,
//     setShowSaveModal,
//     handleSave,
//     saveNewProject,
//     lastSavedProps,
//   } = useProjectSave2({
//     templateId: 1,
//     buildProps: () => ({
//       quote,
//       author,
//       imageurl: backgroundImage,
//       fontsize: fontSize,
//       fontcolor: fontColor,
//       fontfamily: fontFamily,
//       duration,
//     }),
//     compositionId: "QuoteComposition"
//   });

//   useEffect(() => {
//     fetchUserUploads();
//     fetchOnlineImages("history");
//   }, []);

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100vh",
//         background: "#fafafa",
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       }}
//     >
//       {isLoading && <LoadingOverlay message={messages[messageIndex]} />}
//       <SaveProjectModal open={showSaveModal} onClose={() => setShowSaveModal(false)} onSave={saveNewProject} />
//       {showModal && (
//         <ExportModal
//           showExport={showModal}
//           setShowExport={setShowModal}
//           isExporting={isExporting}
//           exportUrl={exportUrl}
//           onExport={handleExport}
//         />
//       )}

//       <TopNavWithSave
//         templateName={templateName}
//         onSave={handleSave}
//         onExport={handleExport}
//         setTemplateName={setTemplateName}
//         onOpenExport={() => setShowModal(true)}
//         template={templateName}
//         isSaving={isSaving}
//       />

//       <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         <div
//           style={{ display: "flex", flexDirection: "column", flex: 1, background: "#fafafa", overflow: "hidden" }}
//         >
//           <div style={{ display: "flex", flexDirection: "row", flex: 1, overflow: "hidden" }}>
//             {/* Left Sidebar with Menu Items */}
//             <div
//               style={{
//                 width: "240px",
//                 minWidth: "240px",
//                 background: "#ffffff",
//                 borderRight: "1px solid #e2e8f0",
//                 display: "flex",
//                 flexDirection: "column",
//                 overflowY: "auto",
//               }}
//             >
//               <div
//                 style={{
//                   padding: "16px",
//                   borderBottom: "1px solid #e2e8f0",
//                 }}
//               >
//                 <h2
//                   style={{
//                     margin: 0,
//                     fontSize: "14px",
//                     fontWeight: 600,
//                     color: "#0f172a",
//                     textTransform: "uppercase",
//                     letterSpacing: "0.5px",
//                   }}
//                 >
//                   Editor
//                 </h2>
//               </div>
//               <div style={{ flex: 1 }}>
//                 <SidebarMenuItem
//                   icon={<ImageIcon />}
//                   label="Media"
//                   isActive={activeSection === "media"}
//                   onClick={() => setActiveSection("media")}
//                 />
//                 <SidebarMenuItem
//                   icon={<TextIcon />}
//                   label="Text"
//                   isActive={activeSection === "text"}
//                   onClick={() => setActiveSection("text")}
//                 />
//                 <SidebarMenuItem
//                   icon={<SubtitlesIcon />}
//                   label="Subtitles"
//                   isActive={activeSection === "subtitles"}
//                   onClick={() => setActiveSection("subtitles")}
//                 />
//                 <SidebarMenuItem
//                   icon={<AudioIcon />}
//                   label="Audio"
//                   isActive={activeSection === "audio"}
//                   onClick={() => setActiveSection("audio")}
//                 />
//                 <SidebarMenuItem
//                   icon={<VideoIcon />}
//                   label="Video"
//                   isActive={activeSection === "video"}
//                   onClick={() => setActiveSection("video")}
//                 />
//                 <SidebarMenuItem
//                   icon={<ToolsIcon />}
//                   label="Tools"
//                   isActive={activeSection === "tools"}
//                   onClick={() => setActiveSection("tools")}
//                 />
//               </div>
//             </div>

//             {/* Properties Panel - 800px wide */}
//             <div
//               style={{
//                 width: `${PROPERTIES_PANEL_WIDTH}px`,
//                 minWidth: `${PROPERTIES_PANEL_WIDTH}px`,
//                 padding: "16px",
//                 overflowY: "auto",
//                 background: "#fafafa",
//                 borderRight: "1px solid #e2e8f0",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "16px",
//               }}
//             >
//               {/* Media Section */}
//               {activeSection === "media" && (
//                 <>
//                   <SidebarPanel title="Media Upload" icon={<UploadIcon />}>
//                     <div
//                       style={{
//                         background: "#ffffff",
//                         border: "2px dashed #cbd5e1",
//                         borderRadius: "8px",
//                         padding: "24px",
//                         textAlign: "center",
//                         transition: "all 0.2s ease",
//                         cursor: "pointer",
//                       }}
//                       onDragOver={(e) => {
//                         e.preventDefault();
//                         e.currentTarget.style.borderColor = "#6366f1";
//                         e.currentTarget.style.background = "#f8fafc";
//                       }}
//                       onDragLeave={(e) => {
//                         e.currentTarget.style.borderColor = "#cbd5e1";
//                         e.currentTarget.style.background = "#ffffff";
//                       }}
//                       onDrop={(e) => {
//                         e.preventDefault();
//                         e.currentTarget.style.borderColor = "#cbd5e1";
//                         e.currentTarget.style.background = "#ffffff";
//                         if (e.dataTransfer.files?.[0]) {
//                           uploadFile(e.dataTransfer.files[0]);
//                           setBackgroundSource("upload");
//                         }
//                       }}
//                     >
//                       {isUploading ? (
//                         <div style={{ color: "#6366f1" }}>
//                           <div
//                             style={{
//                               width: "32px",
//                               height: "32px",
//                               border: "3px solid #e2e8f0",
//                               borderTopColor: "#6366f1",
//                               borderRadius: "50%",
//                               animation: "spin 1s linear infinite",
//                               margin: "0 auto 12px",
//                             }}
//                           />
//                           Uploading...
//                         </div>
//                       ) : (
//                         <>
//                           <div style={{ color: "#94a3b8", marginBottom: "12px" }}>
//                             <svg
//                               width="32"
//                               height="32"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeWidth="1.5"
//                               style={{ margin: "0 auto" }}
//                             >
//                               <path d="M4 14.899A7 7 0 1115.71 8h1.79a4.5 4.5 0 012.5 8.242" />
//                               <path d="M12 12v9" />
//                               <path d="M8 17l4-5 4 5" />
//                             </svg>
//                           </div>
//                           <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 12px" }}>
//                             Drag & drop or click to upload
//                           </p>
//                           <input
//                             type="file"
//                             accept="image/*,video/*"
//                             onChange={(e) => {
//                               if (e.target.files?.[0]) {
//                                 uploadFile(e.target.files[0]);
//                                 setBackgroundSource("upload");
//                               }
//                             }}
//                             style={{ display: "none" }}
//                             id="file-upload"
//                           />
//                           <label
//                             htmlFor="file-upload"
//                             style={{
//                               display: "inline-block",
//                               background: "linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)",
//                               color: "#fff",
//                               padding: "8px 20px",
//                               borderRadius: "6px",
//                               cursor: "pointer",
//                               fontSize: "12px",
//                               fontWeight: 600,
//                               transition: "transform 0.1s ease",
//                             }}
//                           >
//                             Choose File
//                           </label>
//                         </>
//                       )}
//                     </div>
//                   </SidebarPanel>
//                   <BackgroundSecTrial
//                     backgroundImage={backgroundImage}
//                     backgroundSource={backgroundSource}
//                     handleFileUpload={uploadFile}
//                     isUploading={isUploading}
//                     setBackgroundImage={setBackgroundImage}
//                     setBackgroundSource={setBackgroundSource}
//                     fetchOnlineImages={fetchOnlineImages}
//                     loadingOnline={loadingOnline}
//                     loadingUploads={loadingUploads}
//                     onlineImages={onlineImages}
//                     searchQuery={searchQuery}
//                     setSearchQuery={setSearchQuery}
//                     userUploads={userUploads}
//                   />
//                 </>
//               )}

//               {/* Text Section */}
//               {activeSection === "text" && (
//                 <QuoteEditor
//                   quote={quote}
//                   author={author}
//                   setQuote={setQuote}
//                   setAuthor={setAuthor}
//                   handleAISuggestion={handleAISuggestion}
//                   isGenerating={isGenerating}
//                   fontFamily={fontFamily}
//                   setFontFamily={setFontFamily}
//                   fontColor={fontColor}
//                   setFontColor={setFontColor}
//                   fontSize={fontSize}
//                   setFontSize={setFontSize}
//                 />
//               )}

//               {/* Subtitles Section */}
//               {activeSection === "subtitles" && (
//                 <SidebarPanel title="Subtitles" icon={<SubtitlesIcon />}>
//                   <div
//                     style={{
//                       textAlign: "center",
//                       padding: "24px",
//                       color: "#64748b",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "48px",
//                         height: "48px",
//                         background: "#f1f5f9",
//                         borderRadius: "12px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         margin: "0 auto 16px",
//                       }}
//                     >
//                       <SubtitlesIcon />
//                     </div>
//                     <p style={{ fontSize: "13px", margin: "0 0 8px", color: "#0f172a" }}>
//                       Subtitle Tools
//                     </p>
//                     <p style={{ fontSize: "12px", margin: 0 }}>
//                       Add auto-generated or custom subtitles
//                     </p>
//                   </div>
//                 </SidebarPanel>
//               )}

//               {/* Audio Section */}
//               {activeSection === "audio" && (
//                 <SidebarPanel title="Audio Settings" icon={<AudioIcon />}>
//                   <div
//                     style={{
//                       textAlign: "center",
//                       padding: "24px",
//                       color: "#64748b",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "48px",
//                         height: "48px",
//                         background: "#fef3c7",
//                         borderRadius: "12px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         margin: "0 auto 16px",
//                       }}
//                     >
//                       <AudioIcon />
//                     </div>
//                     <p style={{ fontSize: "13px", margin: "0 0 8px", color: "#0f172a" }}>
//                       Audio Controls
//                     </p>
//                     <p style={{ fontSize: "12px", margin: 0 }}>
//                       Upload background music or voiceover
//                     </p>
//                   </div>
//                 </SidebarPanel>
//               )}

//               {/* Video Section */}
//               {activeSection === "video" && (
//                 <SidebarPanel title="Video Settings" icon={<VideoIcon />}>
//                   <div
//                     style={{
//                       textAlign: "center",
//                       padding: "24px",
//                       color: "#64748b",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "48px",
//                         height: "48px",
//                         background: "#dbeafe",
//                         borderRadius: "12px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         margin: "0 auto 16px",
//                       }}
//                     >
//                       <VideoIcon />
//                     </div>
//                     <p style={{ fontSize: "13px", margin: "0 0 8px", color: "#0f172a" }}>
//                       Video Controls
//                     </p>
//                     <p style={{ fontSize: "12px", margin: 0 }}>
//                       Adjust video properties and effects
//                     </p>
//                   </div>
//                 </SidebarPanel>
//               )}

//               {/* Tools Section */}
//               {activeSection === "tools" && (
//                 <SidebarPanel title="Additional Tools" icon={<ToolsIcon />}>
//                   <div
//                     style={{
//                       textAlign: "center",
//                       padding: "24px",
//                       color: "#64748b",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "48px",
//                         height: "48px",
//                         background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
//                         borderRadius: "12px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         margin: "0 auto 16px",
//                       }}
//                     >
//                       <SparkleIcon />
//                     </div>
//                     <p style={{ fontSize: "13px", margin: "0 0 8px", color: "#0f172a" }}>
//                       AI & Advanced Tools
//                     </p>
//                     <p style={{ fontSize: "12px", margin: 0 }}>
//                       Coming soon - AI generation, filters, and more
//                     </p>
//                   </div>
//                 </SidebarPanel>
//               )}
//             </div>

//             {/* FIXED: Preview Area - Now flexible instead of fixed width */}
//             <div
//               style={{
//                 flex: 1,
//                 minWidth: "400px",
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 overflow: "auto",
//                 padding: "24px",
//                 background: "#f1f5f9",
//                 position: "relative",
//               }}
//             >
//               {/* Subtle grid pattern */}
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   backgroundImage: `
//                     linear-gradient(to right, #e2e8f020 1px, transparent 1px),
//                     linear-gradient(to bottom, #e2e8f020 1px, transparent 1px)
//                   `,
//                   backgroundSize: "20px 20px",
//                   opacity: 0.5,
//                 }}
//               />
//               <div
//                 style={{
//                   position: "relative",
//                   background: "#ffffff",
//                   borderRadius: "12px",
//                   overflow: "hidden",
//                   boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)",
//                 }}
//               >
//                 <QuoteSpotlightPreview
//                   ref={playerRef}
//                   quote={quote}
//                   author={author}
//                   backgroundImage={backgroundImage}
//                   fontSize={fontSize}
//                   fontFamily={fontFamily}
//                   fontColor={fontColor}
//                   showSafeMargins={showSafeMargins}
//                   previewBg={previewBg}
//                   cycleBg={cycleBg}
//                   previewScale={previewSize}
//                   onPreviewScaleChange={setPreviewSize}
//                   onToggleSafeMargins={setShowSafeMargins}
//                   duration={duration}
//                   onFrameUpdate={handleFrameUpdate}
//                   onPlayingChange={handlePlayingChange}
//                   tracks={tracks}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Timeline */}
//           <InteractiveTimeline
//             duration={duration}
//             setDuration={setDuration}
//             quote={quote}
//             currentTime={currentTime}
//             isPlaying={isPlaying}
//             onSeek={handleSeek}
//             onPlayPause={handlePlayPause}
//             onStop={handleStop}
//             tracks={tracks}
//             setTracks={setTracks}
//           />
//         </div>
//       </div>

//       {/* Global styles for animations */}
//       <style>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         ::-webkit-scrollbar {
//           width: 8px;
//           height: 8px;
//         }
//         ::-webkit-scrollbar-track {
//           background: #f1f5f9;
//         }
//         ::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 4px;
//         }
//         ::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }
//         input::-webkit-outer-spin-button,
//         input::-webkit-inner-spin-button {
//           -webkit-appearance: none;
//           margin: 0;
//         }
//         input[type=number] {
//           -moz-appearance: textfield;
//         }
//       `}</style>
//     </div>
//   );
// };