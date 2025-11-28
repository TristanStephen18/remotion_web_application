// import React, { useState, useRef, useEffect } from "react";
// import { KenBurnsSideNav } from "./Sidenav";
// import { KenBurnsCarouselPreview } from "../../layout/EditorPreviews/KenBurnsCarouselPreview";
// import { KenBurnsImagesPanel } from "./sidenav_sections/Images";
// import { ProportionsPanel } from "./sidenav_sections/Proportions";
// import { defaultpanelwidth } from "../../../data/DefaultValues";
// import { ExportModal } from "../../ui/modals/ExportModal";
// import { TopNavWithSave } from "../../navigations/single_editors/WithSave";
// import { SaveProjectModal } from "../../ui/modals/SaveModal";
// import { LoadingOverlay } from "../../ui/modals/LoadingProjectModal";
// import { useProjectSave } from "../../../hooks/SaveProject";
// import { useParams } from "react-router-dom";
// import { backendPrefix } from "../../../config";


// export const KenBurnsEditor: React.FC = () => {
//   const { id } = useParams();

//   // 🟢 Core States
//   const [templateName, setTemplateName] = useState(
//     "🎬 Ken Burns Swipe Template"
//   );
//   const [previewSize, setPreviewSize] = useState(1);
//   const [images, setImages] = useState<string[]>(["https://res.cloudinary.com/dnxc1lw18/image/upload/v1761129583/landscape-placeholder_vmykjj.svg"]);
//   const [duration, setDuration] = useState<number>(15);
//   const [cardWidthRatio, setCardWidthRatio] = useState<number>(0.75);
//   const [cardHeightRatio, setCardHeightRatio] = useState<number>(0.75);
//   const blurBgOpacity = 0.0;

//   // 🟢 UI States
//   const [showSafeMargins, setShowSafeMargins] = useState(true);
//   const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
//   const [activeSection, setActiveSection] = useState<"images" | "proportions">(
//     "images"
//   );
//   const [collapsed, setCollapsed] = useState(false);

//   // 🟢 Export
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportUrl, setExportUrl] = useState<string | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   // const [showUploadsModal, setShowUploadsModal] = useState<boolean>(false);
//   const [userUploads, setUserUploads] = useState<any[]>();

//   const fetchUploads = () => {
//     fetch(`${backendPrefix}/useruploads/images`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch uploads");
//         return res.json();
//       })
//       .then((data) => {
//         console.log("fetched user uploads successfully");
//         setUserUploads(data);
//       })
//       .catch((err) => console.error("❌ Failed to fetch uploads:", err));
//   };

//   // 🟢 Loading overlay
//   const [isLoading, setIsLoading] = useState(false);
//   const [messageIndex, setMessageIndex] = useState(0);
//   const messages = [
//     "⏳ Preparing your template...",

//     "🙇 Sorry for the wait, still working on it...",
//     "🚀 Almost there, thanks for your patience!",
//   ];
//   useEffect(() => {
//     if (!isLoading) return;
//     const interval = setInterval(
//       () => setMessageIndex((prev) => (prev + 1) % messages.length),
//       10000
//     );
//     return () => clearInterval(interval);
//   }, [isLoading]);

//   // 🟢 Resizable Panel
//   const [panelWidth, setPanelWidth] = useState(defaultpanelwidth);
//   const [isResizing, setIsResizing] = useState(false);
//   const panelRef = useRef<HTMLDivElement | null>(null);
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isResizing) return;
//       const newWidth =
//         e.clientX - (panelRef.current?.getBoundingClientRect().left || 0);
//       if (newWidth > 200 && newWidth < 600) setPanelWidth(newWidth);
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

//   // 🟢 Background cycle
//   const cycleBg = () => {
//     if (previewBg === "dark") setPreviewBg("light");
//     else if (previewBg === "light") setPreviewBg("grey");
//     else setPreviewBg("dark");
//   };

//   // 🟢 Export Handler
//   const handleExport = async (format: string) => {
//     if (images.length <= 1) {
//       alert("This template does not allow one image only");
//     } else {

//       setIsExporting(true);
//       try {
//         const response = await fetch(`${backendPrefix}/generatevideo/kenburnsswipe`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             images,
//             cardHeightRatio,
//             cardWidthRatio,
//             duration,
//             format,
//           }),
//         });
//         if (!response.ok) throw new Error(await response.text());
//         const data = await response.json();
//         const renderUrl = data.url;
//         if (renderUrl) {
//           const saveResponse = await fetch(`${backendPrefix}/renders`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//             body: JSON.stringify({
//               templateId: 8,
//               outputUrl: renderUrl,
//               type: format,
//             }),
//           });

//           if (!saveResponse.ok) {
//             throw new Error(
//               `Failed to save upload: ${
//                 saveResponse.status
//               } ${await saveResponse.text()}`
//             );
//           }

//           const saveData = await saveResponse.json();
//           console.log("✅ Render saved to DB:", saveData);
//         }
//         setExportUrl(data.url);
//         setShowModal(true);
//       } catch (error) {
//         console.error("Export failed:", error);
//         alert(`Export failed: ${error}`);
//       } finally {
//         setIsExporting(false);
//       }
//     }
//   };

//   // 🟢 Project Save Hook
//   const {
//     setProjectId,
//     isSaving,
//     showSaveModal,
//     setShowSaveModal,
//     handleSave,
//     saveNewProject,
//     lastSavedProps,
//   } = useProjectSave({
//     templateId: 8, // 👈 unique ID for Ken Burns
//     buildProps: () => ({
//       images,
//       duration,
//       cardWidthRatio,
//       cardHeightRatio,
//     }),
//     videoEndpoint: `${backendPrefix}/generatevideo/kenburnsswipe`,
//   });

//   // 🟢 Load project if editing existing
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

//           setProjectId(data.id);
//           setImages(data.props.images);
//           setDuration(data.props.duration);
//           setCardHeightRatio(data.props.cardHeightRatio);
//           setCardWidthRatio(data.props.cardWidthRatio);
//           lastSavedProps.current = data.props;
//         })
//         .catch((err) => console.error("❌ Project load failed:", err))
//         .finally(() => setIsLoading(false));
//     }
//   }, [id]);

//   useEffect(() => {
//     fetchUploads();
//   }, []);

//   return (
//     <div style={{ display: "flex", height: "100%", flex: 1 }}>
//       {isLoading && <LoadingOverlay message={messages[messageIndex]} />}

//       {/* 🔹 Top Navigation */}
//       <TopNavWithSave
//         templateName={templateName}
//         onSave={handleSave}
//         onExport={handleExport}
//         setTemplateName={setTemplateName}
//         onOpenExport={() => setShowModal(true)}
//         template={templateName}
//         isSaving={isSaving}
//       />

//       {/* 🔹 Save Modal */}
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

//         {/* 🔹 Side Navigation */}
//         <KenBurnsSideNav
//           activeSection={activeSection}
//           collapsed={collapsed}
//           setActiveSection={setActiveSection}
//           setCollapsed={setCollapsed}
//         />

//         {/* 🔹 Side Panel */}
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
//               transition: isResizing ? "none" : "width 0.2s",
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

//             {activeSection === "images" && (
//               <KenBurnsImagesPanel
//                 images={images}
//                 setImages={setImages}
//                 setDuration={setDuration}
//                 userUploads={userUploads}
//               />
//             )}

//             {activeSection === "proportions" && (
//               <ProportionsPanel
//                 cardHeightRatio={cardHeightRatio}
//                 cardWidthRatio={cardWidthRatio}
//                 setCardHeightRatio={setCardHeightRatio}
//                 setCardWidthRatio={setCardWidthRatio}
//               />
//             )}
//           </div>
//         )}

//         {/* 🔹 Preview */}
//         <KenBurnsCarouselPreview
//           cycleBg={cycleBg}
//           duration={duration}
//           images={images}
//           previewBg={previewBg}
//           cardHeightRatio={cardHeightRatio}
//           blurBgOpacity={blurBgOpacity}
//           cardWidthRatio={cardWidthRatio}
//           previewScale={previewSize}
//           showSafeMargins={showSafeMargins}
//           onPreviewScaleChange={setPreviewSize}
//           onToggleSafeMargins={setShowSafeMargins}
//         />
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Image,
  Ratio,
  Settings,
  Wand2,
  Undo2,
  Redo2,
  Scissors,
  Trash2,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Minus,
  Plus,
  Film,
  Download,
  Save,
  Clock,
  Layers,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Upload,
  GripVertical,
  MoreHorizontal,
  Volume2,
  Maximize2,
} from "lucide-react";
import { KenBurnsCarouselPreview } from "../../layout/EditorPreviews/KenBurnsCarouselPreview";
import { KenBurnsImagesPanel } from "./sidenav_sections/Images";
import { ProportionsPanel } from "./sidenav_sections/Proportions";
import { ExportModal } from "../../ui/modals/ExportModal";
import { SaveProjectModal } from "../../ui/modals/SaveModal";
import { LoadingOverlay } from "../../ui/modals/LoadingProjectModal";
import { useProjectSave } from "../../../hooks/SaveProject";
import { backendPrefix } from "../../../config";

type EditorTabType = "images" | "proportions" | "settings" | "tools";

export const KenBurnsEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🟢 Core States
  const [templateName, setTemplateName] = useState("Ken Burns Swipe Template");
  const [images, setImages] = useState<string[]>([
    "https://res.cloudinary.com/dnxc1lw18/image/upload/v1761129583/landscape-placeholder_vmykjj.svg",
  ]);
  const [duration, setDuration] = useState<number>(15);
  const [cardWidthRatio, setCardWidthRatio] = useState<number>(0.75);
  const [cardHeightRatio, setCardHeightRatio] = useState<number>(0.75);
  const blurBgOpacity = 0.0;

  // 🟢 UI States
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeTab, setActiveTab] = useState<EditorTabType>("images");
  const [previewSize, setPreviewSize] = useState(1);

  // 🟢 Timeline States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(50);
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);

  // 🟢 Export
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userUploads, setUserUploads] = useState<any[]>();

  // 🟢 Loading overlay
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "⏳ Preparing your template...",
    "🙇 Sorry for the wait, still working on it...",
    "🚀 Almost there, thanks for your patience!",
  ];

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(
      () => setMessageIndex((prev) => (prev + 1) % messages.length),
      10000
    );
    return () => clearInterval(interval);
  }, [isLoading]);

  // 🟢 Editor Tabs Configuration
  const editorTabs = [
    { id: "images" as EditorTabType, icon: Image, label: "Images" },
    { id: "proportions" as EditorTabType, icon: Ratio, label: "Size" },
    { id: "settings" as EditorTabType, icon: Settings, label: "Settings" },
    { id: "tools" as EditorTabType, icon: Wand2, label: "Tools" },
  ];

  // 🟢 Fetch User Uploads
  const fetchUploads = () => {
    fetch(`${backendPrefix}/useruploads/images`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch uploads");
        return res.json();
      })
      .then((data) => {
        console.log("fetched user uploads successfully");
        setUserUploads(data);
      })
      .catch((err) => console.error("❌ Failed to fetch uploads:", err));
  };

  // 🟢 Background cycle
  const cycleBg = () => {
    if (previewBg === "dark") setPreviewBg("light");
    else if (previewBg === "light") setPreviewBg("grey");
    else setPreviewBg("dark");
  };

  // 🟢 Export Handler
  const handleExport = async (format: string) => {
    if (images.length <= 1) {
      alert("This template does not allow one image only");
    } else {
      setIsExporting(true);
      try {
        const response = await fetch(
          `${backendPrefix}/generatevideo/kenburnsswipe`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              images,
              cardHeightRatio,
              cardWidthRatio,
              duration,
              format,
            }),
          }
        );
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        const renderUrl = data.url;
        if (renderUrl) {
          const saveResponse = await fetch(`${backendPrefix}/renders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              templateId: 8,
              outputUrl: renderUrl,
              type: format,
            }),
          });

          if (!saveResponse.ok) {
            throw new Error(
              `Failed to save upload: ${saveResponse.status} ${await saveResponse.text()}`
            );
          }

          const saveData = await saveResponse.json();
          console.log("✅ Render saved to DB:", saveData);
        }
        setExportUrl(data.url);
        setShowModal(true);
      } catch (error) {
        console.error("Export failed:", error);
        alert(`Export failed: ${error}`);
      } finally {
        setIsExporting(false);
      }
    }
  };

  // 🟢 Project Save Hook
  const {
    setProjectId,
    isSaving,
    showSaveModal,
    setShowSaveModal,
    handleSave,
    saveNewProject,
    lastSavedProps,
  } = useProjectSave({
    templateId: 8,
    buildProps: () => ({
      images,
      duration,
      cardWidthRatio,
      cardHeightRatio,
    }),
    videoEndpoint: `${backendPrefix}/generatevideo/kenburnsswipe`,
  });

  // 🟢 Load project if editing existing
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
          setTemplateName(data.title);
          setProjectId(data.id);
          setImages(data.props.images);
          setDuration(data.props.duration);
          setCardHeightRatio(data.props.cardHeightRatio);
          setCardWidthRatio(data.props.cardWidthRatio);
          lastSavedProps.current = data.props;
        })
        .catch((err) => console.error("❌ Project load failed:", err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  useEffect(() => {
    fetchUploads();
  }, []);

  // 🟢 Format Time for Timeline
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}:${ms.toString().padStart(2, "0")}`;
  };

  // 🟢 Time markers for timeline
  const visibleDuration = Math.max(duration, 30);
  const timeMarkers = Array.from(
    { length: Math.ceil(visibleDuration / 5) + 1 },
    (_, i) => i * 5
  );

  // 🟢 Handle Back Navigation
  const handleBack = () => {
    navigate("/dashboard");
  };

  // 🟢 Render Panel Content Based on Active Tab
  const renderPanelContent = () => {
    switch (activeTab) {
      case "images":
        return (
          <div className="p-5">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Images</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {images.length} image{images.length !== 1 ? "s" : ""} added
                </p>
              </div>
              <button className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all">
                <Upload size={18} />
              </button>
            </div>

            <KenBurnsImagesPanel
              images={images}
              setImages={setImages}
              setDuration={setDuration}
              userUploads={userUploads}
            />
          </div>
        );
      case "proportions":
        return (
          <div className="p-5">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Card Size</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Adjust the card dimensions
              </p>
            </div>
            <ProportionsPanel
              cardHeightRatio={cardHeightRatio}
              cardWidthRatio={cardWidthRatio}
              setCardHeightRatio={setCardHeightRatio}
              setCardWidthRatio={setCardWidthRatio}
            />
          </div>
        );
      case "settings":
        return (
          <div className="p-5">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Configure your video
              </p>
            </div>

            <div className="space-y-4">
              {/* Duration Setting */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Clock size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800">
                      Duration
                    </label>
                    <span className="text-xs text-gray-500">{duration} seconds</span>
                  </div>
                </div>
                <input
                  type="range"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={5}
                  max={60}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>5s</span>
                  <span>60s</span>
                </div>
              </div>

              {/* Preview Background */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Sun size={18} className="text-amber-600" />
                  </div>
                  <label className="text-sm font-medium text-gray-800">
                    Preview Background
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "dark", icon: Moon, label: "Dark" },
                    { id: "light", icon: Sun, label: "Light" },
                    { id: "grey", icon: Monitor, label: "Grey" },
                  ].map((bg) => {
                    const Icon = bg.icon;
                    return (
                      <button
                        key={bg.id}
                        onClick={() => setPreviewBg(bg.id as "dark" | "light" | "grey")}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all ${
                          previewBg === bg.id
                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <Icon size={18} />
                        <span className="text-xs">{bg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Safe Margins Toggle */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                      {showSafeMargins ? (
                        <Eye size={18} className="text-emerald-600" />
                      ) : (
                        <EyeOff size={18} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-800">
                        Safe Margins
                      </label>
                      <p className="text-xs text-gray-500">Show guide overlay</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSafeMargins(!showSafeMargins)}
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                      showSafeMargins
                        ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        showSafeMargins ? "translate-x-7" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case "tools":
        return (
          <div className="p-5">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Tools</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Advanced editing options
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Crop", icon: Maximize2, color: "bg-blue-100 text-blue-600" },
                { name: "Trim", icon: Scissors, color: "bg-purple-100 text-purple-600" },
                { name: "Effects", icon: Sparkles, color: "bg-pink-100 text-pink-600" },
                { name: "Layers", icon: Layers, color: "bg-amber-100 text-amber-600" },
              ].map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.name}
                    className="group p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl cursor-pointer hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
                  >
                    <div className={`w-10 h-10 rounded-xl ${tool.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon size={20} />
                    </div>
                    <p className="font-medium text-gray-800 text-sm">{tool.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#fafafa] font-['Inter',system-ui,sans-serif] overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay message={messages[messageIndex]} />}

      {/* Save Modal */}
      <SaveProjectModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={saveNewProject}
      />

      {/* Export Modal */}
      {showModal && (
        <ExportModal
          showExport={showModal}
          setShowExport={setShowModal}
          isExporting={isExporting}
          exportUrl={exportUrl}
          onExport={handleExport}
        />
      )}

      {/* Left Sidebar - Editor Navigation */}
      <div className="w-[72px] bg-white border-r border-gray-200/80 flex flex-col items-center py-4 shadow-sm">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-200 mb-6 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Editor Tabs */}
        <nav className="flex flex-col items-center gap-2 flex-1">
          {editorTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                }`}
              >
                <Icon size={20} />
                <span className="text-[9px] font-medium">{tab.label}</span>
                {isActive && (
                  <div className="absolute -right-[1px] top-1/2 -translate-y-1/2 w-[3px] h-6 bg-indigo-500 rounded-l-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-emerald-100 hover:text-emerald-600 transition-all disabled:opacity-50"
            title="Save Project"
          >
            <Save size={18} />
          </button>
        </div>
      </div>

      {/* Left Panel - Content */}
      <div className="w-[320px] bg-white border-r border-gray-200/80 overflow-y-auto shadow-sm">
        {renderPanelContent()}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-gray-200/80 flex items-center justify-between px-5 shadow-sm">
          {/* Left - Project Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Film size={16} className="text-white" />
            </div>
            <div>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="text-gray-900 font-semibold bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-64"
              />
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{images.length} images</span>
                <span>•</span>
                <span>{duration}s</span>
                {isSaving && (
                  <>
                    <span>•</span>
                    <span className="text-indigo-500">Saving...</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-400 hover:bg-sky-500 text-white font-medium text-sm rounded-xl transition-all shadow-md"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Video Preview Area */}
        <div className="flex-1 bg-gray-50 flex overflow-hidden">
          {/* Left Panel - Image Management */}
          <div className="flex-1 px-4 py-2 self-start">
            {/* Top Row - Images indicator */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[10px] text-gray-500 font-medium">Images:</span>
              <div className="flex items-center gap-1">
                {images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedTrack(index)}
                    className={`h-5 w-5 rounded flex-shrink-0 cursor-pointer transition-all border overflow-hidden ${
                      selectedTrack === index
                        ? "border-indigo-500 ring-1 ring-indigo-200"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {image && !image.includes('placeholder') ? (
                      <img src={image} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Image size={8} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
                <button className="h-5 w-5 rounded border border-dashed border-gray-300 flex items-center justify-center hover:border-indigo-400 hover:bg-indigo-50 transition-all">
                  <Plus size={10} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
              {/* KenBurns Images Section */}
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Film size={12} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-900">KenBurns Images</h3>
                </div>
                <button className="ml-0.5 text-gray-400 hover:text-gray-600">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4M12 8h.01"/>
                  </svg>
                </button>
              </div>

              {/* Image Grid */}
              <div className="flex gap-2 flex-wrap">
                {/* Existing Image Slots */}
                {images.map((image, index) => (
                  <div key={index} className="flex flex-col relative group">
                    <span className="text-[10px] text-gray-500 mb-1 flex items-center gap-1">
                      <Image size={8} />
                      Image {index + 1}
                    </span>
                    <div
                      className={`w-20 h-24 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all overflow-hidden relative ${
                        selectedTrack === index
                          ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200"
                          : "border-dashed border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedTrack(index)}
                    >
                      {image && !image.includes('placeholder') ? (
                        <img src={image} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <Image size={24} className="text-gray-300" />
                      )}
                      {/* Delete Button */}
                      {images.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newImages = images.filter((_, i) => i !== index);
                            setImages(newImages);
                            if (selectedTrack === index) {
                              setSelectedTrack(Math.max(0, index - 1));
                            } else if (selectedTrack !== null && selectedTrack > index) {
                              setSelectedTrack(selectedTrack - 1);
                            }
                          }}
                          className="absolute top-1 right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
                        >
                          <Trash2 size={8} />
                        </button>
                      )}
                    </div>
                    <button 
                      onClick={() => setSelectedTrack(index)}
                      className="mt-1.5 px-2 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-medium rounded-md transition-all"
                    >
                      Replace
                    </button>
                  </div>
                ))}

                {/* Add More Images Button */}
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 mb-1 invisible">Add</span>
                  <div
                    onClick={() => {
                      const newImages = [...images, ""];
                      setImages(newImages);
                      setSelectedTrack(newImages.length - 1);
                    }}
                    className="w-20 h-24 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                  >
                    <Plus size={20} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-80 flex flex-col self-stretch">
            <div className="px-3 pt-2 pb-1.5 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium">Preview</span>
              <div className="flex items-center gap-2">
                {/* Show Margins */}
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSafeMargins}
                    onChange={() => setShowSafeMargins(!showSafeMargins)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="text-[10px] text-gray-500">Show margins</span>
                </label>

                {/* Background Toggle */}
                <button
                  onClick={cycleBg}
                  className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all flex items-center gap-1 ${
                    previewBg === 'light' 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm' 
                      : previewBg === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {previewBg === 'dark' ? <Moon size={10} /> : previewBg === 'light' ? <Sun size={10} /> : <Monitor size={10} />}
                  {previewBg.charAt(0).toUpperCase() + previewBg.slice(1)}
                </button>
              </div>
            </div>
            
            {/* Preview Frame - Full size */}
            <div className="flex-1 overflow-hidden">
              <KenBurnsCarouselPreview
                cycleBg={cycleBg}
                duration={duration}
                images={images}
                previewBg={previewBg}
                cardHeightRatio={cardHeightRatio}
                blurBgOpacity={blurBgOpacity}
                cardWidthRatio={cardWidthRatio}
                previewScale={1}
                showSafeMargins={showSafeMargins}
                onPreviewScaleChange={setPreviewSize}
                onToggleSafeMargins={setShowSafeMargins}
              />
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white border-t border-gray-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          {/* Timeline Controls */}
          <div className="h-12 flex items-center justify-between px-4 border-b border-gray-100">
            {/* Left Controls */}
            <div className="flex items-center gap-0.5">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                title="Undo"
              >
                <Undo2 size={16} />
              </button>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                title="Redo"
              >
                <Redo2 size={16} />
              </button>
              <div className="w-px h-5 bg-gray-200 mx-2" />
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                title="Cut"
              >
                <Scissors size={16} />
              </button>
              <button
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Center - Playback Controls */}
            <div className="flex items-center gap-1">
              <button
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                title="Previous"
              >
                <SkipBack size={18} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-3 rounded-full transition-all ${
                  isPlaying
                    ? "bg-gray-200 text-gray-700"
                    : "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
                }`}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
              </button>
              <button
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                title="Next"
              >
                <SkipForward size={18} />
              </button>

              {/* Timestamp */}
              <div className="ml-4 px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-mono text-gray-600">
                <span className="text-gray-900 font-semibold">{formatTime(currentTime)}</span>
                <span className="mx-1 text-gray-400">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right - Zoom & Volume */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Volume2 size={16} className="text-gray-400" />
                <div className="w-16 h-1 bg-gray-200 rounded-full" />
              </div>
              <div className="w-px h-5 bg-gray-200" />
              <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-lg">
                <button
                  onClick={() => setZoom(Math.max(0, zoom - 10))}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-xs text-gray-600 w-8 text-center">{zoom}%</span>
                <button
                  onClick={() => setZoom(Math.min(100, zoom + 10))}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Ruler */}
          <div className="h-6 bg-gray-50 border-b border-gray-100 relative" style={{ marginLeft: "140px" }}>
            {timeMarkers.map((time) => (
              <div
                key={time}
                className="absolute bottom-0 flex flex-col items-center"
                style={{ left: `${(time / visibleDuration) * 100}%` }}
              >
                <span className="text-[10px] text-gray-400 mb-0.5">{time}s</span>
                <div className="w-px h-1.5 bg-gray-300" />
              </div>
            ))}

            {/* Playhead on ruler */}
            <div
              className="absolute top-0 bottom-0 z-10"
              style={{ left: `${(currentTime / visibleDuration) * 100}%` }}
            >
              <div className="w-3 h-3 bg-indigo-500 rounded-sm rotate-45 transform -translate-x-1/2 -translate-y-1" />
            </div>
          </div>

          {/* Timeline Tracks */}
          <div className="relative" style={{ minHeight: "120px" }}>
            {/* Track Labels Column */}
            <div className="absolute left-0 top-0 bottom-0 w-[140px] bg-gray-50/50 border-r border-gray-100 z-10">
              {images.slice(0, 2).map((_, index) => (
                <div
                  key={index}
                  className="h-10 flex items-center px-3 border-b border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical size={12} className="text-gray-300" />
                    <Image size={14} className="text-indigo-500" />
                    <span className="text-xs text-gray-600 font-medium">
                      Image {index + 1}
                    </span>
                  </div>
                </div>
              ))}
              <div className="h-10 flex items-center px-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <GripVertical size={12} className="text-gray-300" />
                  <Film size={14} className="text-purple-500" />
                  <span className="text-xs text-gray-600 font-medium">Output</span>
                </div>
              </div>
            </div>

            {/* Tracks Content */}
            <div style={{ marginLeft: "140px" }}>
              {images.slice(0, 2).map((image, index) => (
                <div
                  key={index}
                  className={`h-10 border-b border-gray-100 relative cursor-pointer ${
                    selectedTrack === index ? "bg-indigo-50/50" : "hover:bg-gray-50/50"
                  }`}
                  onClick={() => setSelectedTrack(index)}
                >
                  <div className="absolute inset-y-1 mx-1" style={{ left: `${(index / images.length) * 50}%`, right: `${100 - ((index + 1) / images.length) * 100 + 50}%` }}>
                    <div
                      className={`h-full rounded-lg flex items-center px-3 transition-all ${
                        selectedTrack === index
                          ? "bg-gradient-to-r from-indigo-500 to-indigo-400 text-white shadow-lg"
                          : "bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 hover:from-indigo-200"
                      }`}
                      style={{ borderLeft: "3px solid #6366F1" }}
                    >
                      <Image size={12} className="mr-2 shrink-0 opacity-70" />
                      <span className="text-[11px] font-medium truncate">
                        {image.split("/").pop()?.substring(0, 20) || `Image ${index + 1}`}
                      </span>
                      <button className="ml-auto p-1 opacity-0 group-hover:opacity-100 hover:bg-white/20 rounded transition-all">
                        <MoreHorizontal size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Output Track */}
              <div className="h-10 border-b border-gray-100 relative">
                <div className="absolute inset-y-1 left-1 right-1">
                  <div
                    className="h-full rounded-lg bg-gradient-to-r from-purple-100 to-purple-50 flex items-center px-3 text-purple-700 hover:from-purple-200 transition-all"
                    style={{ borderLeft: "3px solid #A855F7" }}
                  >
                    <Film size={12} className="mr-2 shrink-0 opacity-70" />
                    <span className="text-[11px] font-medium">
                      Ken Burns Swipe • {duration}s
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Playhead Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-indigo-500 z-20 pointer-events-none shadow-lg shadow-indigo-500/50"
              style={{
                left: `calc(140px + (100% - 140px) * ${currentTime / visibleDuration})`,
              }}
            >
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white shadow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};