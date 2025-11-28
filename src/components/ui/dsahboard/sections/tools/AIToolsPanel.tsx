import React, { useState } from "react";
import { FiImage } from "react-icons/fi";
import { AIImageGenerator } from "./AIImageGenerator";
import { BackgroundRemover } from "./BackgroundRemover";

type TabType = "ai-images" | "remove-bg";

export const AIToolsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("ai-images");

  return (
    <div className="space-y-6">
      {/* Header Section - Matching other tools */}
      <div className="pt-2 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <FiImage className="text-indigo-600 text-xl" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            AI Image & Background Remover
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Generate stunning AI images and remove backgrounds instantly with advanced AI technology.
        </p>
      </div>

      {/* Tabs - Responsive with scroll on mobile */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-4 sm:gap-8 min-w-max sm:min-w-0">
          <button
            onClick={() => setActiveTab("ai-images")}
            className={`pb-3 px-1 text-sm sm:text-base font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === "ai-images"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            AI Images
          </button>
          <button
            onClick={() => setActiveTab("remove-bg")}
            className={`pb-3 px-1 text-sm sm:text-base font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === "remove-bg"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            Remove Background
          </button>
        </div>
      </div>

      {/* Content Area - Responsive padding */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        {activeTab === "ai-images" ? <AIImageGenerator /> : <BackgroundRemover />}
      </div>
    </div>
  );
};