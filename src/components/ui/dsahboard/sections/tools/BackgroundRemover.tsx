import React, { useState } from "react";
import { FiUploadCloud, FiX, FiDownload } from "react-icons/fi";
import { LuImage } from "react-icons/lu";

interface UploadedFile {
  name: string;
  size: number;
  preview: string;
  status: "uploading" | "complete";
  progress: number;
}

export const BackgroundRemover: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
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
    if (file) handleFileSelect(file);
  };

  const handleRemoveBackground = () => {
    console.log("Removing background...");
    // TODO: Call API to remove background
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
          accept="image/png,image/svg+xml,image/jpeg,image/jpg,image/gif,image/webp,video/mp4,video/webm"
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
            Supports: PNG, SVG, JPG, JPEG, GIF, WEBP, MP4, WEBM
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

          {uploadedFile.status === "complete" && (
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