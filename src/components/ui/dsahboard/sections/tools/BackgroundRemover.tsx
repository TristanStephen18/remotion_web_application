
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Download, Trash2, Image, Edit3 } from "lucide-react";
import { backendPrefix } from "../../../../../config";
import type { UploadedFile } from "../../../../../models/brremover";

interface BackgroundRemoverInterface {
  uploadedFiles: UploadedFile[] | [];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[] | []>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  originalFiles: Map<string, File>;
  setOriginalFiles: React.Dispatch<React.SetStateAction<Map<string, File>>>;
}

export const BackgroundRemover: React.FC<BackgroundRemoverInterface> = ({
  uploadedFiles,
  setUploadedFiles,
  isDragging,
  setIsDragging,
  originalFiles,
  setOriginalFiles
}) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<UploadedFile | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) return;

      const id = `${Date.now()}-${Math.random()}`;
      setOriginalFiles(prev => new Map(prev).set(id, file));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile: UploadedFile = {
          id,
          name: file.name,
          size: file.size,
          preview: e.target?.result as string,
          status: "uploading",
          progress: 0,
        };
        setUploadedFiles(prev => [...prev, newFile]);

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadedFiles((prev) =>
            prev.map(f => f.id === id 
              ? { ...f, progress, status: progress >= 100 ? "complete" : "uploading" }
              : f
            )
          );
          if (progress >= 100) clearInterval(interval);
        }, 200);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveBackground = async (fileId: string) => {
    const originalFile = originalFiles.get(fileId);
    if (!originalFile) return;

    setUploadedFiles(prev =>
      prev.map(f => f.id === fileId ? { ...f, status: "processing", progress: 0 } : f)
    );

    const formData = new FormData();
    formData.append("image", originalFile);

    try {
      const response = await fetch(`${backendPrefix}/api/picture/remove-background`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove background");
      }

      const data = await response.json();
      
      setUploadedFiles(prev =>
        prev.map(f => f.id === fileId 
          ? { ...f, status: "complete", progress: 100, processedUrl: data.url }
          : f
        )
      );
    } catch (error) {
      console.error("Error removing background:", error);
      setUploadedFiles(prev =>
        prev.map(f => f.id === fileId 
          ? { ...f, status: "error", error: (error as Error).message }
          : f
        )
      );
    }
  };

  const handleEdit = (imageUrl: string, fileName: string) => {
    navigate('/editor', {
      state: {
        fromBgRemoval: true,
        imageData: {
          url: imageUrl,
          name: fileName,
        }
      }
    });
  };

  const handleDownload = async (file: UploadedFile) => {
    if (!file.processedUrl) return;

    try {
      const response = await fetch(file.processedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bg-removed-${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleDownloadAll = () => {
    uploadedFiles
      .filter(f => f.processedUrl)
      .forEach(file => handleDownload(file));
  };

  const handleStartAll = () => {
    uploadedFiles
      .filter(f => f.status === "complete" && !f.processedUrl)
      .forEach(file => handleRemoveBackground(file.id));
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setOriginalFiles(prev => {
      const newMap = new Map(prev);
      newMap.delete(fileId);
      return newMap;
    });
    if (selectedImage?.id === fileId) {
      setSelectedImage(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  const processedCount = uploadedFiles?.filter(f => f.processedUrl).length || 0;
  const pendingCount = uploadedFiles?.filter(f => f.status === "complete" && !f.processedUrl).length || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-4">
      {/* Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-12 text-center transition-all duration-300 ${
          isDragging
            ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 scale-[1.02] shadow-lg"
            : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-indigo-50/30"
        }`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          multiple
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        />
        
        <div className="flex flex-col items-center">
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 ${isDragging ? 'scale-110' : 'hover:scale-105'}`}>
            <Upload className="text-indigo-600 text-2xl sm:text-3xl" />
          </div>
          
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">
            Drop your files here, or{" "}
            <label htmlFor="file-upload" className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 cursor-pointer underline decoration-2 underline-offset-2">
              browse
            </label>
          </h3>
          
          <p className="text-[11px] sm:text-sm text-gray-500 mb-3 sm:mb-4 px-4">
            Supports: PNG, JPG, JPEG, WEBP (Max 10MB per file)
          </p>
          
          <label
            htmlFor="file-upload"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-white border-2 border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 cursor-pointer active:scale-95 shadow-sm hover:shadow"
          >
            <Upload className="text-base" />
            Select Files
          </label>
        </div>
      </div>

      {/* Image Grid */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Uploaded Images ({uploadedFiles.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {pendingCount > 0 && (
                <button
                  onClick={handleStartAll}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                >
                  Start All ({pendingCount})
                </button>
              )}
              {processedCount > 0 && (
                <button
                  onClick={handleDownloadAll}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                >
                  <Download size={14} />
                  Download All ({processedCount})
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {uploadedFiles.map((file, index) => (
              <div
                key={file.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Preview Section */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <img
                    src={file.processedUrl || file.preview}
                    alt={file.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Status Overlays */}
                  {file.status === "processing" && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
                      <div className="text-white text-center">
                        <div className="relative w-12 h-12 mx-auto mb-2">
                          <div className="absolute inset-0 rounded-full border-4 border-indigo-200/30"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-purple-500 animate-spin"></div>
                        </div>
                        <p className="text-xs font-medium">Processing...</p>
                      </div>
                    </div>
                  )}

                  {file.status === "uploading" && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="relative w-16 h-16 mb-2">
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="rgba(255,255,255,0.2)"
                              strokeWidth="4"
                              fill="none"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="url(#gradient)"
                              strokeWidth="4"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 28}`}
                              strokeDashoffset={`${2 * Math.PI * 28 * (1 - file.progress / 100)}`}
                              className="transition-all duration-300"
                            />
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#818cf8" />
                                <stop offset="100%" stopColor="#a855f7" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-sm font-bold">{file.progress}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 active:scale-90 shadow-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* File Info & Actions */}
                <div className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                        {formatFileSize(file.size)}
                        {file.status === "uploading" && " • Uploading..."}
                        {file.status === "processing" && " • Processing..."}
                        {file.processedUrl && " • Ready"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {file.status === "complete" && !file.processedUrl && (
                    <button
                      onClick={() => handleRemoveBackground(file.id)}
                      className="w-full py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                      Remove Background
                    </button>
                  )}

                  {file.processedUrl && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setSelectedImage(file)}
                          className="py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                        >
                          Compare
                        </button>
                        <button
                          onClick={() => handleEdit(file.processedUrl!, file.name)}
                          className="py-2 sm:py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center gap-1 shadow-sm hover:shadow-md active:scale-95"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDownload(file)}
                          className="py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center gap-1 shadow-sm hover:shadow-md active:scale-95"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {file.status === "error" && (
                    <div>
                      <p className="text-xs text-red-600 mb-2">{file.error || "Processing failed"}</p>
                      <button
                        onClick={() => handleRemoveBackground(file.id)}
                        className="w-full py-2 sm:py-2.5 bg-red-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Before/After Slider Modal */}
      {selectedImage && selectedImage.processedUrl && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl animate-in slide-in-from-bottom-8 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
              <div className="flex-1 min-w-0 mr-2">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{selectedImage.name}</h3>
                <p className="text-xs sm:text-sm text-gray-500">Drag the slider to compare</p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-3 sm:p-6">
              <div
                ref={sliderRef}
                className="relative w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden cursor-ew-resize select-none shadow-inner"
                onMouseDown={(e) => {
                  handleSliderMove(e);
                  const handleMove = (e: MouseEvent) => handleSliderMove(e as any);
                  const handleUp = () => {
                    document.removeEventListener('mousemove', handleMove);
                    document.removeEventListener('mouseup', handleUp);
                  };
                  document.addEventListener('mousemove', handleMove);
                  document.addEventListener('mouseup', handleUp);
                }}
                onTouchStart={(e) => {
                  handleSliderMove(e);
                  const handleMove = (e: TouchEvent) => handleSliderMove(e as any);
                  const handleEnd = () => {
                    document.removeEventListener('touchmove', handleMove);
                    document.removeEventListener('touchend', handleEnd);
                  };
                  document.addEventListener('touchmove', handleMove);
                  document.addEventListener('touchend', handleEnd);
                }}
              >
                {/* After Image (Processed) */}
                <img
                  src={selectedImage.processedUrl}
                  alt="After"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ backgroundColor: '#f0f0f0' }}
                />

                {/* Before Image (Original) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={selectedImage.preview}
                    alt="Before"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ 
                      width: `${(sliderRef.current?.offsetWidth || 0)}px`,
                      maxWidth: 'none'
                    }}
                  />
                </div>

                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl transition-opacity duration-200 hover:opacity-100"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full shadow-xl flex items-center justify-center transition-transform duration-200 hover:scale-110">
                    <div className="flex gap-0.5">
                      <div className="w-0.5 h-4 bg-white rounded"></div>
                      <div className="w-0.5 h-4 bg-white rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium shadow-lg">
                  Before
                </div>
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium shadow-lg">
                  After
                </div>
              </div>

              <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleEdit(selectedImage.processedUrl!, selectedImage.name)}
                  className="py-2 sm:py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                >
                  <Edit3 size={18} />
                  Edit in Editor
                </button>
                <button
                  onClick={() => handleDownload(selectedImage)}
                  className="py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                >
                  <Download size={18} />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {uploadedFiles.length === 0 && (
        <div className="p-8 sm:p-12 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-3 sm:mb-4 animate-pulse">
            <Image className="text-indigo-400 text-3xl sm:text-4xl" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2 px-4">
            No files uploaded yet
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md px-4">
            Upload images to remove their backgrounds and compare results with the interactive slider
          </p>
        </div>
      )}
    </div>
  );
};