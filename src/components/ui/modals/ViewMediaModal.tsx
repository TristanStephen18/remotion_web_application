import React, { useState, useEffect } from "react";
import { FiX, FiDownload, FiFilm, FiCalendar } from "react-icons/fi";

interface MediaItem {
  id?: string;
  type?: string;
  outputUrl?: string;
  projectVidUrl?: string;
  templateId?: number;
  title?: string;
  renderedAt?: string;
  createdAt?: string;
  aspectRatio?: number;
  [key: string]: any;
}

interface ViewMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MediaItem | null;
  itemType: "project" | "render";
  templateName?: string;
  formattedDate?: string;
}

export const ViewMediaModal: React.FC<ViewMediaModalProps> = ({
  isOpen,
  onClose,
  item,
  itemType,
  templateName,
  formattedDate,
}) => {
  const [isPortrait, setIsPortrait] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  useEffect(() => {
    if (!isOpen || !item) {
      setMediaLoaded(false);
      return;
    }

    const getVideoUrl = () => {
      if (itemType === "project") {
        return item.projectVidUrl;
      }
      return item.outputUrl;
    };

    const videoUrl = getVideoUrl();
    if (!videoUrl) return;

    // Create a video element to detect actual aspect ratio
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      const aspectRatio = video.videoWidth / video.videoHeight;
      setIsPortrait(aspectRatio <= 1); // Portrait or square
      setMediaLoaded(true);
    };
    
    video.onerror = () => {
      // Fallback to provided aspect ratio or assume landscape
      if (item.aspectRatio) {
        setIsPortrait(item.aspectRatio <= 1);
      } else {
        setIsPortrait(false); // Default to landscape
      }
      setMediaLoaded(true);
    };
    
    video.src = videoUrl;
    
    return () => {
      video.src = '';
    };
  }, [isOpen, item, itemType]);
  
  if (!isOpen || !item) return null;

  const getVideoUrl = () => {
    if (itemType === "project") {
      return item.projectVidUrl;
    }
    return item.outputUrl;
  };

  const getTitle = () => {
    if (itemType === "project") {
      return item.title || "Template Preview";
    }
    return templateName || "Rendered Video";
  };

  const videoUrl = getVideoUrl();
  const title = getTitle();

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Mobile Layout */}
      <div
        className="lg:hidden bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col w-full max-w-2xl max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media Container - Mobile */}
        <div className="flex-shrink-0 bg-black flex items-center justify-center">
          <div className="w-full h-[50vh] flex items-center justify-center">
            {itemType === "project" || item.type === "mp4" || item.type === "webm" ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : item.type === "gif" ? (
              <img
                src={item.outputUrl}
                alt="GIF preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-white text-center">
                <p>No preview available</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Panel - Mobile */}
        <div className="flex flex-col bg-white overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between p-4 border-b border-gray-200">
            <div className="flex-1 min-w-0 pr-3">
              <h3 className="text-lg font-bold text-gray-800 mb-2 break-words leading-tight">
                {title}
              </h3>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <FiFilm size={16} className="text-gray-400" />
                  <span className="font-semibold">
                    {itemType === "project" ? "TEMPLATE" : (item.type?.toUpperCase() || "VIDEO")}
                  </span>
                </span>
                {formattedDate && (
                  <span className="flex items-center gap-2">
                    <FiCalendar size={16} className="text-gray-400" />
                    <span className="text-gray-500">{formattedDate}</span>
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0"
            >
              <FiX size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col gap-3">
              {videoUrl && (
                <a
                  href={videoUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition shadow-md"
                >
                  <FiDownload size={18} />
                  Download
                </a>
              )}
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition font-semibold text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Portrait/Square Video */}
      {mediaLoaded && isPortrait && (
        <div
          className="hidden lg:flex bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh]"
          style={{ maxWidth: '1100px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Media Container - Desktop Portrait */}
          <div className="flex-shrink-0 bg-black flex items-center justify-center p-4">
            {itemType === "project" || item.type === "mp4" || item.type === "webm" ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="max-h-[90vh] w-auto h-auto"
                style={{
                  maxWidth: '500px',
                }}
              />
            ) : item.type === "gif" ? (
              <img
                src={item.outputUrl}
                alt="GIF preview"
                className="max-h-[90vh] w-auto h-auto"
                style={{
                  maxWidth: '500px',
                }}
              />
            ) : (
              <div className="text-white text-center p-8">
                <p className="text-lg">No preview available</p>
              </div>
            )}
          </div>

          {/* Info Panel - Desktop Portrait */}
          <div className="flex flex-col bg-white w-[420px] min-w-[360px] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-200 flex-shrink-0 sticky top-0 bg-white z-10">
              <div className="flex-1 min-w-0 pr-3">
                <h3 className="text-xl font-bold text-gray-800 mb-3 break-words leading-tight">
                  {title}
                </h3>
                <div className="flex flex-col gap-2.5 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <FiFilm size={16} className="text-gray-400" />
                    <span className="font-semibold">
                      {itemType === "project" ? "TEMPLATE" : (item.type?.toUpperCase() || "VIDEO")}
                    </span>
                  </span>
                  {formattedDate && (
                    <span className="flex items-center gap-2">
                      <FiCalendar size={16} className="text-gray-400" />
                      <span className="text-gray-500">{formattedDate}</span>
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0"
              >
                <FiX size={22} className="text-gray-600" />
              </button>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0 sticky bottom-0">
              <div className="flex flex-col gap-3">
                {videoUrl && (
                  <a
                    href={videoUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition shadow-md"
                  >
                    <FiDownload size={18} />
                    Download
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition font-semibold text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout - Landscape Video */}
      {mediaLoaded && !isPortrait && (
        <div
          className="hidden lg:flex bg-white rounded-2xl shadow-2xl overflow-hidden flex-col max-h-[85vh]"
          style={{
            width: '60vw',
            maxWidth: '1400px',
            minWidth: '900px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Media Container - Desktop Landscape */}
          <div className="flex-shrink-0 bg-black flex items-center justify-center p-6">
            {itemType === "project" || item.type === "mp4" || item.type === "webm" ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-auto rounded-lg"
                style={{
                  maxHeight: '65vh',
                }}
              />
            ) : item.type === "gif" ? (
              <img
                src={item.outputUrl}
                alt="GIF preview"
                className="w-full h-auto rounded-lg"
                style={{
                  maxHeight: '65vh',
                }}
              />
            ) : (
              <div className="text-white text-center p-8">
                <p className="text-lg">No preview available</p>
              </div>
            )}
          </div>

          {/* Info Panel - Desktop Landscape (Bottom) */}
          <div className="flex items-center justify-between bg-white border-t border-gray-200 p-6">
            <div className="flex-1 min-w-0 pr-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                {title}
              </h3>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <FiFilm size={16} className="text-gray-400" />
                  <span className="font-semibold">
                    {itemType === "project" ? "TEMPLATE" : (item.type?.toUpperCase() || "VIDEO")}
                  </span>
                </span>
                {formattedDate && (
                  <span className="flex items-center gap-2">
                    <FiCalendar size={16} className="text-gray-400" />
                    <span className="text-gray-500">{formattedDate}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {videoUrl && (
                <a
                  href={videoUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition shadow-md"
                >
                  <FiDownload size={16} />
                  Download
                </a>
              )}
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-gray-100 rounded-full transition"
              >
                <FiX size={22} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State for Desktop */}
      {!mediaLoaded && (
        <div className="hidden lg:flex bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] w-[800px] items-center justify-center p-12"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading media...</p>
          </div>
        </div>
      )}
    </div>
  );
};