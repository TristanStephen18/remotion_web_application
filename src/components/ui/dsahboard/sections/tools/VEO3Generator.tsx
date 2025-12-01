// src/components/ui/dashboard/sections/tools/VEO3Generator.tsx
import React, { useState, useEffect } from "react";
import {
  FiChevronDown,
  FiFilm,
  FiBookOpen,
  FiImage,
  FiDownload,
  FiTrash2,
  FiVideo,
  FiPlay,
} from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { Sparkles, Wand2, ImageIcon } from "lucide-react";
import {
  veo3Service,
  type VEO3Generation,
} from "../../../../../services/veo3Service";
import type { CSSProperties } from "react";

export const VEO3Generator: React.FC = () => {
  const [model, setModel] = useState("veo-3.1-generate-preview");
  const [duration, setDuration] = useState("8");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generations, setGenerations] = useState<VEO3Generation[]>([]);
  const [loadingGenerations, setLoadingGenerations] = useState(false);
  const [activeGeneration, setActiveGeneration] =
    useState<VEO3Generation | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [allGenerations, setAllGenerations] = useState<VEO3Generation[]>([]);
  const [loadingAllGenerations, setLoadingAllGenerations] = useState(false);
  const MAX_RECENT = 6;

  useEffect(() => {
    fetchGenerations();
  }, []);

  useEffect(() => {
    const hasProcessing = generations.some(
      (gen) => gen.status === "pending" || gen.status === "processing"
    );
    if (hasProcessing) {
      const interval = setInterval(() => {
        fetchGenerations();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [generations]);

  const fetchGenerations = async () => {
    try {
      setLoadingGenerations(true);
      const response = await veo3Service.getGenerations(10, 0);
      if (response.success) {
        setGenerations(response.generations);
      }
    } catch (error) {
      console.error("Failed to fetch generations:", error);
    } finally {
      setLoadingGenerations(false);
    }
  };

  const fetchAllGenerations = async () => {
    try {
      setLoadingAllGenerations(true);
      const response = await veo3Service.getGenerations(50, 0);
      if (response.success) {
        setAllGenerations(response.generations);
      }
    } catch (error) {
      console.error("Failed to fetch all generations:", error);
    } finally {
      setLoadingAllGenerations(false);
    }
  };

  const handleOpenAll = async () => {
    setShowAll(true);
    if (allGenerations.length === 0) {
      await fetchAllGenerations();
    }
  };

  const handleCloseAll = () => {
    setShowAll(false);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    try {
      setLoading(true);
      const response = await veo3Service.generateVideo({
        prompt: prompt.trim(),
        model,
        duration,
        aspectRatio,
      });
      if (response.success) {
        fetchGenerations();
        setPrompt("");
      }
    } catch (error) {
      console.error("Failed to generate video:", error);
      alert("Failed to start video generation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      const response = await veo3Service.deleteGeneration(id);
      if (response.success) {
        setGenerations((prev) => prev.filter((gen) => gen.id !== id));
        setAllGenerations((prev) => prev.filter((gen) => gen.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete generation:", error);
      alert("Failed to delete video. Please try again.");
    }
  };

  const handlePreviewClick = (generation: VEO3Generation) => {
    if (
      generation.status === "completed" &&
      (generation.videoUrl || generation.thumbnailUrl)
    ) {
      setActiveGeneration(generation);
    }
  };

  const closeActiveGeneration = () => {
    setActiveGeneration(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-700 bg-green-50 ring-1 ring-green-100";
      case "processing":
        return "text-blue-700 bg-blue-50 ring-1 ring-blue-100";
      case "pending":
        return "text-amber-700 bg-amber-50 ring-1 ring-amber-100";
      case "failed":
        return "text-red-700 bg-red-50 ring-1 ring-red-100";
      default:
        return "text-gray-700 bg-gray-50 ring-1 ring-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "processing":
        return "Processing…";
      case "pending":
        return "Pending";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  };

  const getAspectRatioStyle = (ratio?: string): CSSProperties => {
    if (!ratio) return { aspectRatio: "16 / 9" };
    const [w, h] = ratio.split(":");
    if (!w || !h) return { aspectRatio: "16 / 9" };
    return { aspectRatio: `${w.trim()} / ${h.trim()}` };
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* HEADER - Outside main content */}
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

      {/* MAIN CONTENT */}
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* LEFT SECTION */}
          <div className="flex-1 space-y-5">
            {/* Model Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-5 transition-all duration-300 hover:shadow-xl">
              <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
                Model Style
              </label>
              <div className="relative">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 text-sm font-medium text-gray-800 appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 cursor-pointer pr-10"
                >
                  <option value="veo-3.1-generate-preview">Veo 3.1 (Best Quality)</option>
                  <option value="veo-3.1-fast-generate-preview">Veo 3.1 Fast (Faster)</option>
                </select>
                <FiChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                  size={20}
                />
              </div>
              <div className="mt-3 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-700 font-medium">
                  Powered by Google AI
                </p>
              </div>
            </div>

            {/* Duration & Aspect Ratio */}
            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-5 transition-all duration-300 hover:shadow-xl">
              <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                Video Settings
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Duration</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["4", "8"].map((dur) => (
                      <button
                        key={dur}
                        onClick={() => setDuration(dur)}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          duration === dur
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
                        }`}
                      >
                        {dur}s
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Aspect Ratio</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["16:9", "9:16", "1:1"].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          aspectRatio === ratio
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-5 transition-all duration-300 hover:shadow-xl">
              <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                Resources
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => console.log("Open Prompt Library")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 text-sm font-medium text-gray-800 hover:shadow-md transition-all duration-200"
                >
                  <FiBookOpen className="text-indigo-600" />
                  Prompt Library
                </button>
                <button
                  onClick={() => console.log("Open Prompt Docs")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 text-sm font-medium text-gray-800 hover:shadow-md transition-all duration-200"
                >
                  <HiOutlineDocumentText className="text-indigo-600" />
                  Prompt Docs
                </button>
                <button
                  disabled = {true}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 text-sm font-medium text-gray-800 hover:shadow-md transition-all duration-200"
                >
                  <FiImage className="text-indigo-600" />
                  Add Reference Image
                </button>
              </div>
            </div>

            {/* Prompt */}
            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-5 transition-all duration-300 hover:shadow-xl">
              <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                Your Prompt
              </label>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video you want to create... Be creative and detailed!"
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 text-sm text-gray-800 outline-none resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />

              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                className="mt-4 w-full py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Wand2
                      size={20}
                      className="group-hover:rotate-12 transition-transform"
                    />
                    Generate Video
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT SECTION: RECENT GENERATIONS */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 transition-all duration-300 hover:shadow-xl sticky top-6">
              <div className="flex items-center justify-between mb-5">
                <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <FiVideo className="text-indigo-600" />
                  Recent Generations
                </label>
                <div className="flex items-center gap-2">
                  {generations.length > 0 && (
                    <>
                      <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-bold rounded-full">
                        {generations.length}
                      </span>
                      <button
                        onClick={handleOpenAll}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        View all
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 min-h-[500px]">
                {generations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="relative mb-4">
                      <FiVideo className="text-indigo-300" size={64} />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-ping"></span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      Your generated videos will appear here
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Start creating to build your collection
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {generations.slice(0, MAX_RECENT).map((generation, i) => (
                      <div
                        key={generation.id}
                        className="bg-white rounded-xl p-4 border-2 border-indigo-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 animate-fadeIn"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => handlePreviewClick(generation)}
                            className="w-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative cursor-pointer group"
                            style={getAspectRatioStyle(generation.aspectRatio)}
                          >
                            {generation.status === "completed" &&
                            (generation.videoUrl || generation.thumbnailUrl) ? (
                              <>
                                {generation.videoUrl ? (
                                  <video
                                    src={generation.videoUrl}
                                    className="w-full h-full object-cover"
                                    muted
                                    loop
                                    playsInline
                                  />
                                ) : (
                                  <img
                                    src={generation.thumbnailUrl!}
                                    alt="Video thumbnail"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600/80 text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <FiPlay className="text-sm ml-0.5" />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                                {generation.status === "processing" ||
                                generation.status === "pending" ? (
                                  <>
                                    <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                    <span className="text-xs text-gray-500">
                                      {getStatusText(generation.status)}
                                    </span>
                                  </>
                                ) : generation.status === "failed" ? (
                                  <>
                                    <FiVideo className="text-red-400 text-3xl" />
                                    <span className="text-xs text-red-500">
                                      Failed
                                    </span>
                                  </>
                                ) : (
                                  <FiVideo className="text-gray-400 text-3xl" />
                                )}
                              </div>
                            )}
                          </button>

                          <div className="flex-1 min-w-0 flex flex-col">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                {generation.prompt}
                              </p>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(
                                  generation.status
                                )}`}
                              >
                                {getStatusText(generation.status)}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
                              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                                {generation.model.replace("-generate-preview", "")}
                              </span>
                              <span>•</span>
                              <span>{generation.duration}</span>
                              <span>•</span>
                              <span>{generation.aspectRatio}</span>
                            </div>

                            {generation.errorMessage && (
                              <p className="text-xs text-red-600 mb-2 line-clamp-1">
                                {generation.errorMessage}
                              </p>
                            )}

                            <div className="flex items-center gap-2 mt-auto">
                              {generation.status === "completed" &&
                                generation.videoUrl && (
                                  <>
                                    <a
                                      href={generation.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
                                    >
                                      <FiPlay className="text-xs" />
                                      View
                                    </a>
                                    <a
                                      href={generation.videoUrl}
                                      download
                                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
                                    >
                                      <FiDownload className="text-xs" />
                                      Download
                                    </a>
                                  </>
                                )}
                              <button
                                onClick={() => handleDelete(generation.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-all ml-auto border border-red-200"
                              >
                                <FiTrash2 className="text-xs" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End of main content container */}

      {/* ACTIVE GENERATION MODAL */}
      {activeGeneration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={closeActiveGeneration}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="min-w-0">
                <h4 className="text-base font-bold text-gray-900 line-clamp-1">
                  {activeGeneration.prompt || "VEO3 Video"}
                </h4>
                <p className="text-xs text-gray-600 mt-1 flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                    {activeGeneration.model.replace("-generate-preview", "")}
                  </span>
                  <span>{activeGeneration.duration}</span>
                  <span>•</span>
                  <span>{activeGeneration.aspectRatio}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={closeActiveGeneration}
                className="ml-4 text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-white/50 transition-all"
              >
                Close
              </button>
            </div>

            <div className="flex-1 bg-black flex items-center justify-center p-6">
              {activeGeneration.videoUrl ? (
                <video
                  src={activeGeneration.videoUrl}
                  controls
                  autoPlay
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                />
              ) : activeGeneration.thumbnailUrl ? (
                <img
                  src={activeGeneration.thumbnailUrl}
                  alt="Video"
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <div className="flex items-center justify-center text-gray-500">
                  <FiVideo className="text-5xl" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ALL GENERATIONS MODAL */}
      {showAll && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={handleCloseAll}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div>
                <h4 className="text-base font-bold text-gray-900">
                  All VEO3 Generations
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  {allGenerations.length || generations.length} total videos
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseAll}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-white/50 transition-all"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
              {loadingAllGenerations ? (
                <div className="flex items-center justify-center py-12 text-gray-600">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3" />
                  Loading all generations...
                </div>
              ) : (allGenerations.length || generations.length) === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FiVideo className="text-indigo-300 text-5xl mb-3" />
                  <span className="text-gray-600">No generations found.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {(allGenerations.length ? allGenerations : generations).map(
                    (generation, i) => (
                      <div
                        key={generation.id}
                        className="bg-white rounded-xl p-4 border-2 border-indigo-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 animate-fadeIn"
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => handlePreviewClick(generation)}
                            className="w-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative cursor-pointer group"
                            style={getAspectRatioStyle(generation.aspectRatio)}
                          >
                            {generation.status === "completed" &&
                            (generation.videoUrl || generation.thumbnailUrl) ? (
                              <>
                                {generation.videoUrl ? (
                                  <video
                                    src={generation.videoUrl}
                                    className="w-full h-full object-cover"
                                    muted
                                    loop
                                    playsInline
                                  />
                                ) : (
                                  <img
                                    src={generation.thumbnailUrl!}
                                    alt="Video thumbnail"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600/80 text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <FiPlay className="text-sm ml-0.5" />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FiVideo className="text-3xl" />
                              </div>
                            )}
                          </button>

                          <div className="flex-1 min-w-0 flex flex-col">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                {generation.prompt}
                              </p>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(
                                  generation.status
                                )}`}
                              >
                                {getStatusText(generation.status)}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
                              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                                {generation.model.replace("-generate-preview", "")}
                              </span>
                              <span>•</span>
                              <span>{generation.duration}</span>
                              <span>•</span>
                              <span>{generation.aspectRatio}</span>
                              <span>•</span>
                              <span>{formatDateTime(generation.createdAt)}</span>
                            </div>

                            {generation.errorMessage && (
                              <p className="text-xs text-red-600 mb-2 line-clamp-2">
                                {generation.errorMessage}
                              </p>
                            )}

                            <div className="flex items-center gap-2 mt-auto">
                              {generation.status === "completed" &&
                                generation.videoUrl && (
                                  <>
                                    <a
                                      href={generation.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
                                    >
                                      <FiPlay className="text-xs" />
                                      View
                                    </a>
                                    <a
                                      href={generation.videoUrl}
                                      download
                                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
                                    >
                                      <FiDownload className="text-xs" />
                                      Download
                                    </a>
                                  </>
                                )}
                              <button
                                onClick={() => handleDelete(generation.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-all ml-auto border border-red-200"
                              >
                                <FiTrash2 className="text-xs" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};