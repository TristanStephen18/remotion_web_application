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
  const MAX_RECENT = 5;

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleGenerate();
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

      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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
                    border: "1.5px solid #9CA3AF",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                  }}
                >
                  <option value="veo-3.1-generate-preview">Veo 3.1</option>
                  <option value="veo-3.1-fast-generate-preview">
                    Veo 3.1 Fast
                  </option>
                </select>
                <FiChevronDown
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                  size={16}
                />
                {model === "veo-3.1-generate-preview" && (
                  <span className="absolute left-24 sm:left-20 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs text-gray-500 pointer-events-none font-medium">
                    Popular
                  </span>
                )}
              </div>
            </div>

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
                    border: "1.5px solid #9CA3AF",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                  }}
                >
                  <option value="4">4s</option>
                  <option value="8">8s</option>
                </select>
                <FiChevronDown
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

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
                    border: "1.5px solid #9CA3AF",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                  }}
                >
                  <option value="16:9">16:9</option>
                  <option value="9:16">9:16</option>
                  <option value="1:1">1:1</option>
                </select>
                <FiChevronDown
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                  size={16}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => console.log("Open Prompt Library")}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-800 transition active:scale-[0.98]"
              style={{
                border: "1.5px solid #9CA3AF",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
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
                border: "1.5px solid #9CA3AF",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
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
                border: "1.5px solid #D1D5DB",
              }}
            >
              <FiImage className="text-sm sm:text-base" />
              <span className="hidden sm:inline">Add reference image</span>
              <span className="sm:hidden">Add image</span>
            </button>
          </div>

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
              style={{ border: "1.5px solid #9CA3AF" }}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
            className="w-full py-3 sm:py-3.5 rounded-lg text-xs sm:text-sm font-semibold text-white disabled:cursor-not-allowed transition flex items-center justify-center gap-2 relative active:scale-[0.98]"
            style={{
              background:
                !prompt.trim() || loading
                  ? "#9CA3AF"
                  : "linear-gradient(90deg, #ff5aa5 0%, #7c3aed 45%, #00c2d1 100%)",
              boxShadow:
                "0 8px 20px rgba(124, 58, 237, 0.18), 0 2px 6px rgba(0, 0, 0, 0.08) inset",
              opacity: !prompt.trim() || loading ? 0.6 : 1,
              border: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
            }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Video...
              </>
            ) : (
              <>
                <span>Generate Video</span>
                <span className="hidden sm:block absolute right-3 sm:right-4 text-[10px] sm:text-xs text-white/80">
                  ⌘+Enter
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
              Recent Generations
              {generations.length > 0 && (
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {Math.min(MAX_RECENT, generations.length)} shown
                </span>
              )}
            </h3>
            <p className="hidden sm:block text-xs text-gray-500 mt-0.5">
              Last {Math.min(MAX_RECENT, generations.length || MAX_RECENT)}{" "}
              generated videos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchGenerations}
              disabled={loadingGenerations}
              className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:text-gray-400"
            >
              {loadingGenerations ? "Refreshing…" : "Refresh"}
            </button>
            {generations.length > 0 && (
              <button
                onClick={handleOpenAll}
                className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                View all
              </button>
            )}
          </div>
        </div>

        {generations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-lg border border-dashed border-gray-200 bg-gray-50/60">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center mb-3 sm:mb-4 shadow-sm">
              <FiVideo className="text-gray-400 text-2xl sm:text-4xl" />
            </div>
            <h4 className="text-xs sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2">
              No videos generated yet
            </h4>
            <p className="text-[11px] sm:text-sm text-gray-600 max-w-xs">
              Your VEO3 video generations will appear here once you create them.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {generations.slice(0, MAX_RECENT).map((generation) => (
              <div
                key={generation.id}
                className="border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-indigo-300 hover:shadow-sm transition bg-white/60"
              >
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => handlePreviewClick(generation)}
                    className="w-full sm:w-48 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative cursor-pointer group"
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
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition pointer-events-none" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black/70 text-white shadow-md group-hover:scale-105 transition">
                            <FiPlay className="text-sm" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                        {generation.status === "processing" ||
                        generation.status === "pending" ? (
                          <>
                            <div className="w-7 h-7 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-[10px] sm:text-xs text-gray-500">
                              {getStatusText(generation.status)}
                            </span>
                          </>
                        ) : generation.status === "failed" ? (
                          <>
                            <FiVideo className="text-red-400 text-3xl" />
                            <span className="text-[10px] sm:text-xs text-red-500">
                              Failed
                            </span>
                          </>
                        ) : (
                          <>
                            <FiVideo className="text-gray-400 text-3xl" />
                            <span className="text-[10px] sm:text-xs text-gray-500">
                              No preview
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </button>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">
                        {generation.prompt}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium flex-shrink-0 ${getStatusColor(
                          generation.status
                        )}`}
                      >
                        {getStatusText(generation.status)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-gray-500 mb-2">
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
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
                      <p className="text-[10px] sm:text-xs text-red-600 mb-2 line-clamp-2">
                        {generation.errorMessage}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-auto pt-1">
                      {generation.status === "completed" &&
                        generation.videoUrl && (
                          <>
                            <a
                              href={generation.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-indigo-600 text-white rounded-md text-[10px] sm:text-xs font-medium hover:bg-indigo-700 transition shadow-sm"
                            >
                              <FiVideo className="text-xs" />
                              View
                            </a>
                            <a
                              href={generation.videoUrl}
                              download
                              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-emerald-600 text-white rounded-md text-[10px] sm:text-xs font-medium hover:bg-emerald-700 transition shadow-sm"
                            >
                              <FiDownload className="text-xs" />
                              Download
                            </a>
                          </>
                        )}
                      <button
                        onClick={() => handleDelete(generation.id)}
                        className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-[10px] sm:text-xs font-medium hover:bg-red-100 transition ml-auto border border-red-100"
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

      {activeGeneration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-2 sm:px-4"
          onClick={closeActiveGeneration}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/10">
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm md:text-base font-semibold text-white line-clamp-1">
                  {activeGeneration.prompt || "VEO3 Video"}
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-300 mt-0.5 flex flex-wrap gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-gray-100">
                    {activeGeneration.model.replace("-generate-preview", "")}
                  </span>
                  <span>{activeGeneration.duration}</span>
                  <span>{activeGeneration.aspectRatio}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={closeActiveGeneration}
                className="ml-3 text-[11px] sm:text-xs text-gray-300 hover:text-white px-2 py-1 rounded-md hover:bg_WHITE/10"
              >
                Close
              </button>
            </div>

            <div className="flex-1 bg-black flex items-center justify-center px-2 sm:px-3 py-3 sm:py-4">
              {activeGeneration.videoUrl ? (
                <video
                  src={activeGeneration.videoUrl}
                  controls
                  autoPlay
                  className="max-h-[80vh] w-full sm:w-auto max-w-full object-contain bg-black rounded-md"
                />
              ) : activeGeneration.thumbnailUrl ? (
                <img
                  src={activeGeneration.thumbnailUrl}
                  alt="Video"
                  className="max-h-[80vh] w-full sm:w-auto max-w-full object-contain bg-black rounded-md"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FiVideo className="text-4xl" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAll && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-2 sm:px-4"
          onClick={handleCloseAll}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                  All VEO3 Generations
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                  {allGenerations.length || generations.length} total videos
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseAll}
                className="ml-3 text-[11px] sm:text-xs text-gray-500 hover:text-gray-900 px-2 py-1 rounded-md hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 px-2 sm:px-3 py-3 sm:py-4">
              {loadingAllGenerations ? (
                <div className="flex items-center justify-center py-10 text-gray-500 text-sm">
                  <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3" />
                  Loading all generations...
                </div>
              ) : (allGenerations.length || generations.length) === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 text-sm">
                  <FiVideo className="text-3xl mb-2" />
                  <span>No generations found.</span>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {(allGenerations.length ? allGenerations : generations).map(
                    (generation) => (
                      <div
                        key={generation.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-indigo-300 hover:shadow-sm transition"
                      >
                        <div className="flex gap-3 sm:gap-4">
                          <button
                            type="button"
                            onClick={() => handlePreviewClick(generation)}
                            className="w-28 sm:w-32 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 relative cursor-pointer group"
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
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition pointer-events-none" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/70 text-white shadow-md group-hover:scale-105 transition">
                                    <FiPlay className="text-xs" />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FiVideo className="text-2xl" />
                              </div>
                            )}
                          </button>

                          <div className="flex-1 min-w-0 flex flex-col">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">
                                {generation.prompt}
                              </p>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium flex-shrink-0 ${getStatusColor(
                                  generation.status
                                )}`}
                              >
                                {getStatusText(generation.status)}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-gray-500 mb-1.5">
                              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                                {generation.model.replace(
                                  "-generate-preview",
                                  ""
                                )}
                              </span>
                              <span>•</span>
                              <span>{generation.duration}</span>
                              <span>•</span>
                              <span>{generation.aspectRatio}</span>
                              <span>•</span>
                              <span>
                                {formatDateTime(generation.createdAt)}
                              </span>
                            </div>

                            {generation.errorMessage && (
                              <p className="text-[10px] sm:text-xs text-red-600 mb-1.5 line-clamp-2">
                                {generation.errorMessage}
                              </p>
                            )}

                            <div className="flex items-center gap-2 mt-auto pt-1">
                              {generation.status === "completed" &&
                                generation.videoUrl && (
                                  <>
                                    <a
                                      href={generation.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-indigo-600 text-white rounded-md text-[10px] sm:text-xs font-medium hover:bg-indigo-700 transition shadow-sm"
                                    >
                                      <FiVideo className="text-xs" />
                                      View
                                    </a>
                                    <a
                                      href={generation.videoUrl}
                                      download
                                      className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-emerald-600 text-white rounded-md text-[10px] sm:text-xs font-medium hover:bg-emerald-700 transition shadow-sm"
                                    >
                                      <FiDownload className="text-xs" />
                                      Download
                                    </a>
                                  </>
                                )}
                              <button
                                onClick={() => handleDelete(generation.id)}
                                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-[10px] sm:text-xs font-medium hover:bg-red-100 transition ml-auto border border-red-100"
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
  );
};
