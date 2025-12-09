import React, { useState, useRef } from "react";

interface Project {
  id: string;
  name: string;
  thumbnail: string | null;
}

const VideoEditorDemo: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    { id: "1", name: "My First Project", thumbnail: null },
    { id: "2", name: "Summer Vacation", thumbnail: null },
  ]);
  const [currentProject, setCurrentProject] = useState<Project>(projects[0]);
  const [isCapturing, setIsCapturing] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Simulate video editor content
  const [bgColor, setBgColor] = useState("#1a1a2e");
  const [textContent, setTextContent] = useState("Hello World");
  const [textColor, setTextColor] = useState("#ffffff");

  const captureScreenshot = async (): Promise<string | null> => {
    if (!previewRef.current) return null;

    setIsCapturing(true);

    try {
      // Load html2canvas from CDN
      if (!(window as any).html2canvas) {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Small delay to ensure styles are fully rendered
      await new Promise((resolve) => setTimeout(resolve, 100));

      const html2canvas = (window as any).html2canvas;

      const canvas = await html2canvas(previewRef.current, {
        scale: 0.5,
        backgroundColor: bgColor,
        logging: true, // Enable logging to debug
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
      });

      // Convert canvas to base64 data URL
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      console.log(dataUrl);
      return dataUrl;
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSaveProject = async () => {
    const thumbnail = await captureScreenshot();

    if (thumbnail) {
      // Update the current project with the thumbnail
      setProjects((prev) =>
        prev.map((p) => (p.id === currentProject.id ? { ...p, thumbnail } : p))
      );

      setCurrentProject((prev) => ({ ...prev, thumbnail }));

      alert("Project saved with thumbnail!");
    }
  };

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project);
    // In a real app, you'd load the project's saved state here
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Video Editor - Screenshot Demo
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{currentProject.name}</h2>
                <button
                  onClick={handleSaveProject}
                  disabled={isCapturing}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {isCapturing ? "Capturing..." : "Save Project"}
                </button>
              </div>

              {/* Video Preview Area (This is what gets captured) */}
              <div
                ref={previewRef}
                id="video-preview"
                style={{
                  backgroundColor: bgColor,
                  width: "100%",
                  aspectRatio: "16/9",
                  borderRadius: "8px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div style={{ textAlign: "center", padding: "32px" }}>
                  <h3
                    style={{
                      color: textColor,
                      fontSize: "36px",
                      fontWeight: "bold",
                      marginBottom: "16px",
                    }}
                  >
                    {textContent}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "#a855f7",
                        borderRadius: "8px",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "#ec4899",
                        borderRadius: "8px",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "#3b82f6",
                        borderRadius: "8px",
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Editor Controls */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Text Content
                  </label>
                  <input
                    type="text"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleProjectSelect(project)}
                    className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
                      currentProject.id === project.id
                        ? "ring-2 ring-blue-500"
                        : "hover:ring-2 hover:ring-gray-600"
                    }`}
                  >
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        className="w-full aspect-video object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-video bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500">No thumbnail</span>
                      </div>
                    )}
                    <div className="p-3 bg-gray-750">
                      <p className="font-medium text-sm">{project.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-700 rounded-lg text-sm">
                <p className="font-semibold mb-2">💡 How it works:</p>
                <ul className="space-y-1 text-gray-300">
                  <li>• Edit your content in the canvas</li>
                  <li>• Click "Save Project"</li>
                  <li>• Screenshot is captured instantly</li>
                  <li>• Thumbnail appears in sidebar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditorDemo;
