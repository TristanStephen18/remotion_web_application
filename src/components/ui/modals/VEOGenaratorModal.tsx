// import React, { useState } from "react";
// import toast from "react-hot-toast";

// interface VEOGeneratorModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onGenerate: (data: {
//     videoUrl: string;
//     prompt: string;
//     duration: number;
//   }) => void;
// }

// export const VEOGeneratorModal: React.FC<VEOGeneratorModalProps> = ({
//   isOpen,
//   onClose,
//   onGenerate,
// }) => {
//   const [prompt, setPrompt] = useState("");
//   const [duration, setDuration] = useState(5);
//   const [style, setStyle] = useState("cinematic");

//   const [motionIntensity, setMotionIntensity] = useState(5);
//   const [isGenerating, setIsGenerating] = useState(false);

//   const styles: Record<string, React.CSSProperties> = {
//     overlay: {
//       position: "fixed",
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: "rgba(0, 0, 0, 0.75)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 1000,
//       padding: "20px",
//     },
//     modal: {
//       backgroundColor: "#1a1a1a",
//       borderRadius: "16px",
//       width: "100%",
//       maxWidth: "520px",
//       maxHeight: "90vh",
//       overflow: "hidden",
//       display: "flex",
//       flexDirection: "column",
//       border: "1px solid rgba(255,255,255,0.1)",
//     },
//     header: {
//       padding: "24px 24px 20px",
//       borderBottom: "1px solid rgba(255,255,255,0.1)",
//       background: "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
//     },
//     title: {
//       fontSize: "20px",
//       fontWeight: "600",
//       color: "#e5e5e5",
//       margin: "0 0 8px 0",
//       display: "flex",
//       alignItems: "center",
//       gap: "8px",
//     },
//     badge: {
//       fontSize: "10px",
//       fontWeight: "700",
//       color: "#a855f7",
//       backgroundColor: "rgba(168, 85, 247, 0.2)",
//       padding: "4px 8px",
//       borderRadius: "4px",
//       textTransform: "uppercase" as const,
//     },
//     subtitle: {
//       fontSize: "13px",
//       color: "#888",
//       margin: 0,
//     },
//     content: {
//       padding: "24px",
//       overflowY: "auto" as const,
//       flex: 1,
//     },
//     section: {
//       marginBottom: "20px",
//     },
//     label: {
//       display: "block",
//       fontSize: "13px",
//       fontWeight: "600",
//       color: "#e5e5e5",
//       marginBottom: "8px",
//     },
//     textarea: {
//       width: "100%",
//       padding: "12px",
//       backgroundColor: "#0f0f0f",
//       border: "1px solid rgba(255,255,255,0.1)",
//       borderRadius: "8px",
//       color: "#e5e5e5",
//       fontSize: "14px",
//       fontFamily: "inherit",
//       resize: "vertical" as const,
//       minHeight: "100px",
//       outline: "none",
//     },
//     styleGrid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(2, 1fr)",
//       gap: "8px",
//     },
//     styleButton: {
//       padding: "12px",
//       backgroundColor: "#0f0f0f",
//       border: "1px solid rgba(255,255,255,0.1)",
//       borderRadius: "8px",
//       color: "#888",
//       fontSize: "13px",
//       fontWeight: "500",
//       cursor: "pointer",
//       transition: "all 0.2s",
//       textAlign: "center" as const,
//     },
//     styleButtonActive: {
//       backgroundColor: "rgba(168, 85, 247, 0.2)",
//       borderColor: "#a855f7",
//       color: "#a855f7",
//     },
//     sliderContainer: {
//       display: "flex",
//       alignItems: "center",
//       gap: "12px",
//     },
//     slider: {
//       flex: 1,
//       height: "4px",
//       borderRadius: "2px",
//       appearance: "none" as const,
//       backgroundColor: "rgba(255,255,255,0.1)",
//       cursor: "pointer",
//       outline: "none",
//     },
//     sliderValue: {
//       fontSize: "13px",
//       fontWeight: "600",
//       color: "#a855f7",
//       minWidth: "40px",
//       textAlign: "center" as const,
//     },
//     infoBox: {
//       padding: "12px 16px",
//       backgroundColor: "rgba(168, 85, 247, 0.1)",
//       border: "1px solid rgba(168, 85, 247, 0.3)",
//       borderRadius: "8px",
//       color: "#a855f7",
//       fontSize: "12px",
//       lineHeight: "1.5",
//     },
//     footer: {
//       padding: "16px 24px",
//       borderTop: "1px solid rgba(255,255,255,0.1)",
//       display: "flex",
//       gap: "12px",
//       justifyContent: "flex-end",
//     },
//     button: {
//       padding: "12px 24px",
//       borderRadius: "8px",
//       fontSize: "14px",
//       fontWeight: "600",
//       cursor: "pointer",
//       transition: "all 0.2s",
//       border: "none",
//       outline: "none",
//     },
//     cancelButton: {
//       backgroundColor: "transparent",
//       border: "1px solid rgba(255,255,255,0.1)",
//       color: "#888",
//     },
//     generateButton: {
//       background: "linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)",
//       color: "white",
//     },
//     generatingButton: {
//       background: "linear-gradient(135deg, #666 0%, #555 100%)",
//       cursor: "not-allowed",
//       opacity: 0.6,
//     },
//   };

//   const handleGenerate = async () => {
//     if (!prompt.trim()) {
//       toast.error("Please enter a prompt");
//       return;
//     }

//     setIsGenerating(true);
//     try {
//       // Simulate API call - replace with your actual VEO API endpoint
//       await new Promise(resolve => setTimeout(resolve, 5000));
      
//       // Mock generated video data - replace with actual API response
//       const mockVideoData = {
//         videoUrl: `https://example.com/veo-generated-${Date.now()}.mp4`,
//         prompt: prompt,
//         duration: duration,
//       };
      
//       onGenerate(mockVideoData);
//       toast.success("VEO video generated successfully!");
//       onClose();
//       setPrompt("");
//       setDuration(5);
//     } catch (error) {
//       toast.error("Failed to generate video");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div style={styles.overlay} onClick={onClose}>
//       <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
//         <div style={styles.header}>
//           <h2 style={styles.title}>
//             VEO# Generator
//             <span style={styles.badge}>AI Powered</span>
//           </h2>
//           <p style={styles.subtitle}>Generate high-quality videos with Google VEO AI</p>
//         </div>

//         <div style={styles.content}>
//           <div style={styles.section}>
//             <label style={styles.label}>Video Prompt *</label>
//             <textarea
//               style={styles.textarea}
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               placeholder="Describe the video you want to create... (e.g., 'A person walking through a neon-lit city at night, cinematic camera movement')"
//               disabled={isGenerating}
//             />
//           </div>

//           <div style={styles.section}>
//             <label style={styles.label}>Duration (seconds)</label>
//             <div style={styles.sliderContainer}>
//               <input
//                 type="range"
//                 min="2"
//                 max="10"
//                 value={duration}
//                 onChange={(e) => setDuration(Number(e.target.value))}
//                 style={styles.slider}
//                 disabled={isGenerating}
//               />
//               <span style={styles.sliderValue}>{duration}s</span>
//             </div>
//           </div>

//           <div style={styles.section}>
//             <label style={styles.label}>Style</label>
//             <div style={styles.styleGrid}>
//               {["Cinematic", "Realistic", "Artistic", "Abstract"].map((s) => (
//                 <button
//                   key={s}
//                   style={{
//                     ...styles.styleButton,
//                     ...(style === s.toLowerCase() ? styles.styleButtonActive : {}),
//                   }}
//                   onClick={() => setStyle(s.toLowerCase())}
//                   disabled={isGenerating}
//                 >
//                   {s}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div style={styles.section}>
//             <label style={styles.label}>Motion Intensity</label>
//             <div style={styles.sliderContainer}>
//               <input
//                 type="range"
//                 min="0"
//                 max="10"
//                 value={motionIntensity}
//                 onChange={(e) => setMotionIntensity(Number(e.target.value))}
//                 style={styles.slider}
//                 disabled={isGenerating}
//               />
//               <span style={styles.sliderValue}>{motionIntensity}</span>
//             </div>
//           </div>

//           <div style={styles.infoBox}>
//             ✨ VEO generates videos with advanced AI understanding of physics, lighting, and camera motion. Generation may take 30-60 seconds.
//           </div>
//         </div>

//         <div style={styles.footer}>
//           <button
//             style={{ ...styles.button, ...styles.cancelButton }}
//             onClick={onClose}
//             disabled={isGenerating}
//           >
//             Cancel
//           </button>
//           <button
//             style={{
//               ...styles.button,
//               ...(isGenerating ? styles.generatingButton : styles.generateButton),
//             }}
//             onClick={handleGenerate}
//             disabled={isGenerating}
//           >
//             {isGenerating ? "Generating..." : "Generate Video"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { backendPrefix } from "../../../config";

interface VEOGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: {
    videoUrl: string;
    prompt: string;
    duration: number;
  }) => void;
}

interface GenerationStatus {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  prompt: string;
  model: string;
  duration: number;
  aspectRatio: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export const VEOGeneratorModal: React.FC<VEOGeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(5);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [model, setModel] = useState("veo-3.1-generate-preview");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus | null>(null);

  const styles: Record<string, React.CSSProperties> = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      backgroundColor: "#1a1a1a",
      borderRadius: "16px",
      width: "100%",
      maxWidth: "520px",
      maxHeight: "90vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    header: {
      padding: "24px 24px 20px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      background: "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
    },
    title: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#e5e5e5",
      margin: "0 0 8px 0",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    badge: {
      fontSize: "10px",
      fontWeight: "700",
      color: "#a855f7",
      backgroundColor: "rgba(168, 85, 247, 0.2)",
      padding: "4px 8px",
      borderRadius: "4px",
      textTransform: "uppercase" as const,
    },
    subtitle: {
      fontSize: "13px",
      color: "#888",
      margin: 0,
    },
    content: {
      padding: "24px",
      overflowY: "auto" as const,
      flex: 1,
    },
    section: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "13px",
      fontWeight: "600",
      color: "#e5e5e5",
      marginBottom: "8px",
    },
    textarea: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#e5e5e5",
      fontSize: "14px",
      fontFamily: "inherit",
      resize: "vertical" as const,
      minHeight: "100px",
      outline: "none",
    },
    styleGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "8px",
    },
    styleButton: {
      padding: "12px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#888",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s",
      textAlign: "center" as const,
    },
    styleButtonActive: {
      backgroundColor: "rgba(168, 85, 247, 0.2)",
      borderColor: "#a855f7",
      color: "#a855f7",
    },
    sliderContainer: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    slider: {
      flex: 1,
      height: "4px",
      borderRadius: "2px",
      appearance: "none" as const,
      backgroundColor: "rgba(255,255,255,0.1)",
      cursor: "pointer",
      outline: "none",
    },
    sliderValue: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#a855f7",
      minWidth: "40px",
      textAlign: "center" as const,
    },
    infoBox: {
      padding: "12px 16px",
      backgroundColor: "rgba(168, 85, 247, 0.1)",
      border: "1px solid rgba(168, 85, 247, 0.3)",
      borderRadius: "8px",
      color: "#a855f7",
      fontSize: "12px",
      lineHeight: "1.5",
    },
    statusBox: {
      padding: "16px",
      backgroundColor: "rgba(168, 85, 247, 0.05)",
      border: "1px solid rgba(168, 85, 247, 0.2)",
      borderRadius: "8px",
      marginBottom: "20px",
    },
    statusTitle: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#e5e5e5",
      marginBottom: "8px",
    },
    statusText: {
      fontSize: "12px",
      color: "#888",
      marginBottom: "12px",
    },
    progressBar: {
      width: "100%",
      height: "4px",
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: "2px",
      overflow: "hidden",
      marginBottom: "8px",
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(90deg, #a855f7 0%, #8b5cf6 100%)",
      animation: "progress 2s ease-in-out infinite",
    },
    videoPreview: {
      width: "100%",
      borderRadius: "8px",
      marginTop: "12px",
    },
    footer: {
      padding: "16px 24px",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },
    button: {
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      border: "none",
      outline: "none",
    },
    cancelButton: {
      backgroundColor: "transparent",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#888",
    },
    generateButton: {
      background: "linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)",
      color: "white",
    },
    generatingButton: {
      background: "linear-gradient(135deg, #666 0%, #555 100%)",
      cursor: "not-allowed",
      opacity: 0.6,
    },
  };

  // Poll for generation status
  const pollStatus = useCallback(async (generationId: string) => {
    try {
      const response = await fetch(`/api/veo3/status/${generationId}`);
      const data = await response.json();

      if (data.success && data.generation) {
        setGenerationStatus(data.generation);

        if (data.generation.status === "completed") {
          toast.success("Video generation completed!");
          
          // Call the onGenerate callback with the completed video
          onGenerate({
            videoUrl: data.generation.videoUrl!,
            prompt: data.generation.prompt,
            duration: data.generation.duration,
          });

          setIsGenerating(false);
          setCurrentGenerationId(null);
          
          // Don't close automatically, let user see the result
          setTimeout(() => {
            setPrompt("");
            setDuration(5);
            setGenerationStatus(null);
          }, 3000);
        } else if (data.generation.status === "failed") {
          toast.error(data.generation.errorMessage || "Video generation failed");
          setIsGenerating(false);
          setCurrentGenerationId(null);
        }
      }
    } catch (error) {
      console.error("Status polling error:", error);
    }
  }, [onGenerate]);

  // Set up polling interval
  useEffect(() => {
    if (!currentGenerationId || !isGenerating) return;

    const interval = setInterval(() => {
      pollStatus(currentGenerationId);
    }, 5000); // Poll every 5 seconds

    // Initial poll
    pollStatus(currentGenerationId);

    return () => clearInterval(interval);
  }, [currentGenerationId, isGenerating, pollStatus]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setGenerationStatus(null);

    try {
      const response = await fetch(`${backendPrefix}/api/veo3/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model: model,
          duration: duration,
          aspectRatio: aspectRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate video");
      }

      if (data.success && data.generation) {
        setCurrentGenerationId(data.generation.id);
        toast.success("Video generation started! Processing...");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate video"
      );
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      onClose();
      setPrompt("");
      setDuration(5);
      setGenerationStatus(null);
      setCurrentGenerationId(null);
    }
  };

  if (!isOpen) return null;

  const getStatusMessage = () => {
    if (!generationStatus) return "Initializing...";
    
    switch (generationStatus.status) {
      case "pending":
        return "Queued for processing...";
      case "processing":
        return "Generating your video... This may take 5-10 minutes.";
      case "completed":
        return "Video generation completed!";
      case "failed":
        return `Failed: ${generationStatus.errorMessage || "Unknown error"}`;
      default:
        return "Processing...";
    }
  };

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            VEO 3.1 Generator
            <span style={styles.badge}>AI Powered</span>
          </h2>
          <p style={styles.subtitle}>Generate high-quality videos with Google VEO AI</p>
        </div>

        <div style={styles.content}>
          {isGenerating && (
            <div style={styles.statusBox}>
              <div style={styles.statusTitle}>Generation Status</div>
              <div style={styles.statusText}>{getStatusMessage()}</div>
              <div style={styles.progressBar}>
                <div style={styles.progressFill} />
              </div>
              {generationStatus?.status === "completed" && generationStatus.videoUrl && (
                <video
                  src={generationStatus.videoUrl}
                  controls
                  style={styles.videoPreview}
                  autoPlay
                />
              )}
            </div>
          )}

          <div style={styles.section}>
            <label style={styles.label}>Video Prompt *</label>
            <textarea
              style={styles.textarea}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the video you want to create... (e.g., 'A person walking through a neon-lit city at night, cinematic camera movement')"
              disabled={isGenerating}
            />
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Duration (4-8 seconds)</label>
            <div style={styles.sliderContainer}>
              <input
                type="range"
                min="4"
                max="8"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                style={styles.slider}
                disabled={isGenerating}
              />
              <span style={styles.sliderValue}>{duration}s</span>
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Model</label>
            <div style={styles.styleGrid}>
              <button
                style={{
                  ...styles.styleButton,
                  ...(model === "veo-3.1-generate-preview"
                    ? styles.styleButtonActive
                    : {}),
                }}
                onClick={() => setModel("veo-3.1-generate-preview")}
                disabled={isGenerating}
              >
                Standard
              </button>
              <button
                style={{
                  ...styles.styleButton,
                  ...(model === "veo-3.1-fast-generate-preview"
                    ? styles.styleButtonActive
                    : {}),
                }}
                onClick={() => setModel("veo-3.1-fast-generate-preview")}
                disabled={isGenerating}
              >
                Fast
              </button>
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Aspect Ratio</label>
            <div style={styles.styleGrid}>
              {["16:9", "9:16", "1:1", "4:3"].map((ratio) => (
                <button
                  key={ratio}
                  style={{
                    ...styles.styleButton,
                    ...(aspectRatio === ratio ? styles.styleButtonActive : {}),
                  }}
                  onClick={() => setAspectRatio(ratio)}
                  disabled={isGenerating}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.infoBox}>
            ✨ VEO generates videos with advanced AI understanding of physics, lighting,
            and camera motion. Generation takes 5-10 minutes.
          </div>
        </div>

        <div style={styles.footer}>
          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={handleClose}
            disabled={isGenerating}
          >
            {isGenerating ? "Processing..." : "Cancel"}
          </button>
          <button
            style={{
              ...styles.button,
              ...(isGenerating ? styles.generatingButton : styles.generateButton),
            }}
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Video"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};