import React, { useState } from "react";
import { FiChevronDown, FiFilm, FiBookOpen, FiImage } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";

export const VEO3Generator: React.FC = () => {
  const [model, setModel] = useState("VEO3 Standard");
  const [duration, setDuration] = useState("8s");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    console.log("Generating video with:", { model, duration, aspectRatio, prompt });
    
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleGenerate();
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="pt-2 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <FiFilm className="text-purple-600 text-lg sm:text-xl" />
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            VEO3 Video Generator
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 px-11 sm:px-0">
          Create professional videos with cutting-edge VEO3 AI technology.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Model, Duration, Aspect Ratio Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Model */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Model
              </label>
              <div className="relative">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 pr-7 sm:pr-8 rounded-lg bg-white text-xs sm:text-sm appearance-none focus:ring-2 focus:ring-indigo-500 outline-none"
                  style={{ 
                    border: '1.5px solid #9CA3AF',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                >
                  <option value="VEO3 Standard">VEO3 Standard</option>
                  <option value="VEO3 Pro">VEO3 Pro</option>
                  <option value="VEO3 Ultra">VEO3 Ultra</option>
                </select>
                <FiChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={16} />
                {model === "VEO3 Standard" && (
                  <span className="absolute left-24 sm:left-32 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs text-gray-500 pointer-events-none font-medium">
                    Popular
                  </span>
                )}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Duration
              </label>
              <div className="relative">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 pr-7 sm:pr-8 rounded-lg bg-white text-xs sm:text-sm appearance-none focus:ring-2 focus:ring-indigo-500 outline-none"
                  style={{ 
                    border: '1.5px solid #9CA3AF',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                >
                  <option value="5s">5s</option>
                  <option value="8s">8s</option>
                  <option value="10s">10s</option>
                  <option value="15s">15s</option>
                  <option value="30s">30s</option>
                </select>
                <FiChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Aspect Ratio
              </label>
              <div className="relative">
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 pr-7 sm:pr-8 rounded-lg bg-white text-xs sm:text-sm appearance-none focus:ring-2 focus:ring-indigo-500 outline-none"
                  style={{ 
                    border: '1.5px solid #9CA3AF',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                >
                  <option value="16:9">16:9</option>
                  <option value="9:16">9:16</option>
                  <option value="1:1">1:1</option>
                  <option value="4:5">4:5</option>
                </select>
                <FiChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Action Buttons Row - FIXED FOR MOBILE */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => console.log("Open Prompt Library")}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-800 transition active:scale-[0.98]"
              style={{
                border: '1.5px solid #9CA3AF',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            >
              <FiBookOpen className="text-sm sm:text-base text-gray-700" />
              <span className="hidden xs:inline">Prompt Library</span>
              <span className="xs:hidden">Library</span>
            </button>
            <button
              onClick={() => console.log("Open Prompt Docs")}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-800 transition active:scale-[0.98]"
              style={{
                border: '1.5px solid #9CA3AF',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            >
              <HiOutlineDocumentText className="text-sm sm:text-base text-gray-700" />
              <span className="hidden xs:inline">Prompt Docs</span>
              <span className="xs:hidden">Docs</span>
            </button>
            <button
              onClick={() => console.log("Add reference image")}
              disabled
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-gray-100 text-xs sm:text-sm font-medium text-gray-500 cursor-not-allowed"
              style={{
                border: '1.5px solid #D1D5DB'
              }}
            >
              <FiImage className="text-sm sm:text-base" />
              <span className="hidden sm:inline">Add reference image</span>
              <span className="sm:hidden">Add image</span>
            </button>
          </div>

          {/* Prompt Section */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Describe the video you want to create..."
              rows={8}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white text-xs sm:text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              style={{ border: '1.5px solid #9CA3AF' }}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
            className="w-full py-3 sm:py-3.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 relative active:scale-[0.98]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Video...
              </>
            ) : (
              <>
                <span>Generate Video</span>
                <span className="hidden sm:block absolute right-3 sm:right-4 text-[10px] sm:text-xs text-white/80">⌘+Enter</span>
              </>
            )}
          </button>

          {/* Loading State Card */}
          {loading && (
            <div className="p-6 sm:p-8 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3 sm:mb-4" />
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">
                Creating your video...
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 px-4">
                This may take a few moments. Please wait while we generate your video.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};