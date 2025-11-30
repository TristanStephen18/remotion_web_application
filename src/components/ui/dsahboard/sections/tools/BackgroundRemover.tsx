import React from "react";
import { FiUploadCloud, FiX, FiDownload } from "react-icons/fi";
import { LuImage } from "react-icons/lu";
import { backendPrefix } from "../../../../../config";
import type { UploadedFile } from "../../../../../models/imagegenandbgremove";

interface BackgroundRemoverInterface {
  uploadedFile: UploadedFile | null;
  setUploadedFile: React.Dispatch<React.SetStateAction<UploadedFile | null>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  originalFile: File | null;
  setOriginalFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export const BackgroundRemover: React.FC<BackgroundRemoverInterface> = ({
  uploadedFile,
  setUploadedFile,
  isDragging,
  setIsDragging,
  originalFile,
  setOriginalFile
}) => {

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const newFile: UploadedFile = {
        name: file.name,
        size: file.size,
        preview: e.target?.result as string,
        status: "uploading",
        progress: 0,
      };
      setUploadedFile(newFile);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadedFile((prev) =>
          prev ? { ...prev, progress, status: progress >= 100 ? "complete" : "uploading" } : null
        );
        if (progress >= 100) clearInterval(interval);
      }, 200);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!originalFile) return;

    setUploadedFile((prev) =>
      prev ? { ...prev, status: "processing", progress: 0 } : null
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
      
      setUploadedFile((prev) =>
        prev
          ? {
              ...prev,
              status: "complete",
              progress: 100,
              processedUrl: data.url,
            }
          : null
      );
    } catch (error) {
      console.error("Error removing background:", error);
      setUploadedFile((prev) =>
        prev
          ? {
              ...prev,
              status: "error",
              error: (error as Error).message,
            }
          : null
      );
    }
  };

  const handleDownload = async () => {
    if (!uploadedFile?.processedUrl) return;

    try {
      const response = await fetch(uploadedFile.processedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bg-removed-${uploadedFile.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg sm:rounded-xl p-6 sm:p-12 text-center transition ${
          isDragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        }`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />
        
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-3 sm:mb-4">
            <FiUploadCloud className="text-indigo-600 text-2xl sm:text-3xl" />
          </div>
          
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">
            Drop your file here, or{" "}
            <label htmlFor="file-upload" className="text-indigo-600 hover:text-indigo-700 cursor-pointer underline">
              browse
            </label>
          </h3>
          
          <p className="text-[11px] sm:text-sm text-gray-500 mb-3 sm:mb-4 px-4">
            Supports: PNG, JPG, JPEG, WEBP (Max 10MB)
          </p>
          
          <label
            htmlFor="file-upload"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer active:scale-[0.98]"
          >
            <FiUploadCloud className="text-base" />
            Select File
          </label>
        </div>
      </div>

      {/* Uploaded File Info */}
      {uploadedFile && (
        <div className="space-y-3 sm:space-y-4">
          {/* Uploading State */}
          {uploadedFile.status === "uploading" && (
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {uploadedFile.preview ? (
                    <img src={uploadedFile.preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <LuImage className="w-full h-full text-gray-400 p-3" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {formatFileSize(uploadedFile.size)} • Uploading...
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                <div
                  className="bg-indigo-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadedFile.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Ready to Process State */}
          {uploadedFile.status === "complete" && !uploadedFile.processedUrl && (
            <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-green-200">
                  {uploadedFile.preview ? (
                    <img src={uploadedFile.preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <LuImage className="w-full h-full text-gray-400 p-3" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-green-900 truncate">
                        {uploadedFile.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-green-700">
                        {formatFileSize(uploadedFile.size)} • Upload complete
                      </p>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-green-600 hover:text-green-700 flex-shrink-0"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleRemoveBackground}
                    className="w-full mt-3 sm:mt-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 hover:opacity-90 transition shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <FiDownload className="text-sm" />
                    Remove Background
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Processing State */}
          {uploadedFile.status === "processing" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-blue-200">
                  {uploadedFile.preview ? (
                    <img src={uploadedFile.preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <LuImage className="w-full h-full text-gray-400 p-3" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-blue-900 truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-blue-700">
                    Removing background...
                  </p>
                  <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                    <div className="bg-blue-600 h-1.5 rounded-full animate-pulse w-2/3" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processed State */}
          {uploadedFile.status === "complete" && uploadedFile.processedUrl && (
            <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-green-200">
                  <img src={uploadedFile.processedUrl} alt="Processed" className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-green-900 truncate">
                        Background Removed!
                      </p>
                      <p className="text-[10px] sm:text-xs text-green-700">
                        Ready to download
                      </p>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-green-600 hover:text-green-700 flex-shrink-0"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleDownload}
                    className="w-full mt-3 sm:mt-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 transition shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <FiDownload className="text-sm" />
                    Download Image
                  </button>
                </div>
              </div>
              
              {/* Preview of processed image */}
              <div className="mt-4 rounded-lg overflow-hidden border border-green-200">
                <img 
                  src={uploadedFile.processedUrl} 
                  alt="Background removed" 
                  className="w-full h-auto"
                  style={{ backgroundColor: '#f0f0f0' }}
                />
              </div>
            </div>
          )}

          {/* Error State */}
          {uploadedFile.status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-red-200">
                  {uploadedFile.preview ? (
                    <img src={uploadedFile.preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <LuImage className="w-full h-full text-gray-400 p-3" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-red-900 truncate">
                        Processing Failed
                      </p>
                      <p className="text-[10px] sm:text-xs text-red-700">
                        {uploadedFile.error || "An error occurred"}
                      </p>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-red-600 hover:text-red-700 flex-shrink-0"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleRemoveBackground}
                    className="w-full mt-3 sm:mt-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!uploadedFile && (
        <div className="p-8 sm:p-12 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3 sm:mb-4">
            <LuImage className="text-gray-400 text-2xl sm:text-4xl" />
          </div>
          <h3 className="text-xs sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2 px-4">
            No file uploaded yet
          </h3>
          <p className="text-[11px] sm:text-sm text-gray-600 max-w-md px-4">
            Upload an image to remove its background instantly
          </p>
        </div>
      )}
    </div>
  );
};