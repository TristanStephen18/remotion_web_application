import React, { useState, useEffect } from "react";
import { FiImage, FiFilm, FiArrowRight } from "react-icons/fi";
import { AIToolsPanel } from "./tools/AIToolsPanel";
import { YoutubeDownloader } from "./tools/YoutubeDownloader";
import { VEO3Generator } from "./tools/VEO3Generator";

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  onGetStarted: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({
  icon,
  title,
  description,
  badge,
  onGetStarted,
}) => {
  return (
    <div
      className="relative group bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl sm:rounded-2xl
      shadow-[0_6px_16px_rgba(17,25,40,0.08)] hover:shadow-[0_12px_30px_rgba(80,63,205,0.18)]
      overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-pointer
      p-4 sm:p-6 flex flex-col h-full"
    >
      {/* Futuristic glow layer */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-offset-2 ring-indigo-400/50" />

      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Icon & Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 
            flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-300">
            <div className="text-xl sm:text-2xl">{icon}</div>
          </div>
          {badge && (
            <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 sm:py-1 rounded-full 
              bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-md">
              {badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300 leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed flex-1 mb-4">
          {description}
        </p>

        {/* Button - ENHANCED FOR MOBILE */}
        <button
          onClick={onGetStarted}
          className="relative inline-flex items-center justify-center w-full py-2.5 sm:py-3
          font-semibold text-xs sm:text-sm rounded-lg text-white overflow-hidden
          bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-sky-600
          hover:from-fuchsia-700 hover:via-indigo-700 hover:to-sky-700
          shadow-lg hover:shadow-xl
          active:scale-[0.97] transition-all duration-300"
        >
          <span className="relative z-10 flex items-center gap-2">
            Get Started
            <FiArrowRight className="text-sm" />
          </span>
        </button>
      </div>

      {/* Border overlay */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none border border-white/20" />
    </div>
  );
};

type ActiveView = "tools" | "ai-tools" | "youtube-downloader" | "veo3-generator";

export const ToolsSection: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>("tools");

  // Reset to main tools grid when component mounts
  useEffect(() => {
    setActiveView("tools");
  }, []);

  // Render AI Tools Panel
  if (activeView === "ai-tools") {
    return <AIToolsPanel />;
  }

  // Render Youtube Downloader
  if (activeView === "youtube-downloader") {
    return <YoutubeDownloader />;
  }

  // Render VEO3 Generator
  if (activeView === "veo3-generator") {
    return <VEO3Generator />;
  }

  const tools = [
    {
      icon: <FiImage />,
      title: "AI Image & Background Remover",
      description: "Generate stunning AI images and remove backgrounds instantly with advanced AI technology.",
      badge: "Popular",
      action: () => {
        setActiveView("ai-tools");
      },
    },
    // {
    //   icon: <FiVideo />,
    //   title: "Youtube Video Downloader",
    //   description: "Download Youtube videos in high quality for your content creation needs.",
    //   action: () => {
    //     setActiveView("youtube-downloader");
    //   },
    // },
    {
      icon: <FiFilm />,
      title: "VEO3 Video Generator",
      description: "Create professional videos with cutting-edge VEO3 AI technology.",
      badge: "New",
      action: () => {
        setActiveView("veo3-generator");
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="pt-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          ✨ Tools
        </h2>
        <p className="text-sm text-gray-600">
          Powerful AI tools to enhance your content creation workflow. Generate images, download videos, and create stunning content with ease.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {tools.map((tool, index) => (
          <ToolCard
            key={index}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            badge={tool.badge}
            onGetStarted={tool.action}
          />
        ))}
      </div>

      {/* Coming Soon Section */}
      <div className="mt-8 p-5 sm:p-6 rounded-xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
          Coming Soon
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span>YouTube Video Downloader - Download videos in high quality</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span>More AI-powered tools to enhance your content creation</span>
          </li>
        </ul>
      </div>
    </div>
  );
};