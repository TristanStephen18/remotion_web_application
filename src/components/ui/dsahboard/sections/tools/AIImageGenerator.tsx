import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { LuSparkles, LuImage } from "react-icons/lu";

export const AIImageGenerator: React.FC = () => {
  const [model, setModel] = useState("Seedream 3");
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9" | "1:1" | "4:5">("9:16");
  const [prompt, setPrompt] = useState("");

  const recentGenerations: Array<{ url: string; aspectRatio: string }> = [];

  const handleGenerate = () => {
    console.log("Generating image with prompt:", prompt, "Aspect ratio:", aspectRatio);
  };

  const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case "9:16":
        return "aspect-[9/16]";
      case "16:9":
        return "aspect-[16/9]";
      case "1:1":
        return "aspect-square";
      case "4:5":
        return "aspect-[4/5]";
      default:
        return "aspect-[9/16]";
    }
  };

  const getGridCols = (ratio: string) => {
    if (ratio === "16:9") return "grid-cols-1 sm:grid-cols-2";
    return "grid-cols-2 sm:grid-cols-3";
  };

  const totalSlots = aspectRatio === "16:9" ? 6 : 9;
  const placeholderCount = recentGenerations.length > 0 ? Math.max(0, totalSlots - recentGenerations.length) : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
      {/* LEFT SECTION - Form */}
      <div className="flex-1 space-y-4 sm:space-y-6">
        {/* Model & Aspect Ratio Row */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Model */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5 sm:mb-2">
              Model
            </label>
            <div className="relative">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-2.5 sm:px-3 py-2 pr-7 sm:pr-8 rounded-lg border border-gray-300 bg-white text-xs sm:text-sm appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="Seedream 3">Seedream 3 • Recommended</option>
                <option value="DALL-E 3">DALL-E 3</option>
                <option value="Midjourney">Midjourney</option>
              </select>
              <FiChevronDown className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5 sm:mb-2">
              Aspect Ratio
            </label>
            <div className="relative">
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as "9:16" | "16:9" | "1:1" | "4:5")}
                className="w-full px-2.5 sm:px-3 py-2 pr-7 sm:pr-8 rounded-lg border border-gray-300 bg-white text-xs sm:text-sm appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="9:16">9:16</option>
                <option value="16:9">16:9</option>
                <option value="1:1">1:1</option>
                <option value="4:5">4:5</option>
              </select>
              <FiChevronDown className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        {/* Preview/Placeholder Area */}
        <div className="bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 flex flex-col items-center justify-center min-h-[180px] sm:min-h-[280px]">
          <LuSparkles className="text-gray-400 text-3xl sm:text-4xl mb-3 sm:mb-4" />
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2 text-center px-4">
            Ready to create something amazing?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 text-center max-w-md px-4">
            Enter a prompt below and let AI bring your ideas to life
          </p>
        </div>

        {/* Prompt Section */}
        <div className="space-y-2 sm:space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5 sm:mb-2">
              Prompt
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to create..."
                rows={4}
                className="w-full px-3 py-2.5 pb-12 sm:pb-14 rounded-lg border border-gray-300 bg-white text-xs sm:text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              />
              <button className="absolute bottom-2.5 sm:bottom-3 right-2.5 sm:right-3 px-2.5 sm:px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-[10px] sm:text-xs font-medium text-gray-700 transition">
                Enhance Prompt
              </button>
            </div>
          </div>

          {/* Keyboard Shortcut - Hidden on mobile */}
          <p className="hidden sm:block text-xs text-gray-500">⌘+Enter to generate</p>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim()}
            className="w-full py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm active:scale-[0.98]"
          >
            Generate Image
          </button>
        </div>
      </div>

      {/* RIGHT SECTION - Recent Generations */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <label className="block text-xs font-medium text-gray-700">
            Recent Generations
          </label>
          <button className="text-[10px] sm:text-xs text-indigo-600 hover:text-indigo-700 font-medium">
            View All
          </button>
        </div>

        {/* Images Container */}
        <div className="bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 min-h-[350px] sm:min-h-[500px]">
          {recentGenerations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[320px] sm:min-h-[450px] text-center px-4 sm:px-6">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3 sm:mb-4">
                <LuImage className="text-gray-400 text-2xl sm:text-4xl" />
              </div>
              <h3 className="text-xs sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2">
                No generations yet
              </h3>
              <p className="text-[11px] sm:text-sm text-gray-600 mb-1">
                Your AI-generated images will appear here
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                Start by entering a prompt and clicking "Generate Image"
              </p>
            </div>
          ) : (
            <div className={`grid ${getGridCols(aspectRatio)} gap-2 sm:gap-2.5`}>
              {recentGenerations.map((item, idx) => (
                <div
                  key={`gen-${idx}`}
                  className={`${getAspectRatioClass(item.aspectRatio)} rounded-md sm:rounded-lg overflow-hidden border border-gray-200 hover:border-indigo-400 transition cursor-pointer shadow-sm active:scale-[0.98]`}
                >
                  <img
                    src={item.url}
                    alt={`Generation ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              
              {Array.from({ length: placeholderCount }).map((_, idx) => (
                <div
                  key={`placeholder-${idx}`}
                  className={`${getAspectRatioClass(aspectRatio)} rounded-md sm:rounded-lg bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center transition hover:bg-gray-250 hover:border-gray-400`}
                >
                  <LuImage className="text-gray-400 text-lg sm:text-2xl" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};