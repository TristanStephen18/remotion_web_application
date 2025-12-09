
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
  FiEdit3,
} from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { Wand2 } from "lucide-react";
import {
  veo3Service,
  type VEO3Generation,
} from "../../../../../services/veo3Service";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

// Sample prompts for the library
const samplePrompts = [
  {
    category: "Nature & Landscapes",
    prompts: [
      "A serene lake at sunrise with mountains in the background, gentle mist rising from the water, cinematic drone shot",
      "A drone shot flying through a dense forest canopy, rays of sunlight breaking through the leaves, particles floating in the air",
      "Ocean waves crashing against rocky cliffs at golden hour, seagulls flying overhead, dramatic slow motion",
      "A peaceful waterfall in a lush tropical rainforest, surrounded by vibrant green vegetation and exotic birds",
      "Time-lapse of clouds moving over a vast desert landscape with rolling sand dunes, golden hour lighting",
    ],
  },
  {
    category: "Urban & Architecture",
    prompts: [
      "A bustling city street at night with neon signs reflecting on wet pavement, people walking with umbrellas",
      "Time-lapse of traffic flowing through a modern cityscape at dusk, lights coming on as day turns to night",
      "A rooftop view of a city skyline transitioning from day to night, with buildings lighting up one by one",
      "Slow motion walk through a modern glass-walled skyscraper lobby, sunlight creating geometric patterns",
      "Aerial shot circling around a historic cathedral at sunset, shadows lengthening across the ancient stones",
    ],
  },
  {
    category: "Action & Sports",
    prompts: [
      "A sports car drifting around a corner on a winding mountain road, tire smoke and motion blur",
      "A skateboarder performing tricks in a concrete skate park, dynamic camera following the action",
      "A drone racing through an abandoned warehouse, weaving between pillars and obstacles at high speed",
      "Surfer catching a perfect wave at sunset, slow motion water spray with warm golden lighting",
      "Mountain biker riding down a steep forest trail, POV camera showing the intense downhill action",
    ],
  },
  {
    category: "Abstract & Artistic",
    prompts: [
      "Colorful ink drops dispersing in crystal clear water, macro shot with dramatic lighting and vibrant colors",
      "Abstract geometric shapes morphing and rotating in space, with vibrant gradient colors and smooth transitions",
      "Slow motion of paint splashing against a white canvas, creating an explosion of vivid colors",
      "Light particles flowing and swirling in a dark void, creating mesmerizing patterns and trails",
      "Macro shot of soap bubbles reflecting rainbow colors, floating gracefully with soft bokeh background",
    ],
  },
  {
    category: "Food & Lifestyle",
    prompts: [
      "Overhead shot of fresh ingredients being chopped and arranged on a wooden cutting board, natural lighting",
      "Steam rising from a freshly brewed cup of coffee in a cozy cafe, warm morning light through windows",
      "Slow motion of honey being drizzled over a stack of pancakes, golden and appetizing",
      "Hands kneading dough on a flour-dusted surface in a rustic kitchen, warm and inviting atmosphere",
      "Close-up of a chef plating a gourmet dish with precision, restaurant kitchen ambiance",
    ],
  },
];

export const VEO3Generator: React.FC = () => {
  const navigate = useNavigate();
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

  // New states for Prompt Library and Docs
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [showPromptDocs, setShowPromptDocs] = useState(false);


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
    console.log(loadingGenerations);
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
  const handleEdit = (generation: VEO3Generation) => {
    // Navigate to editor with video data as state
    navigate('/editor', {
      state: {
        fromVEO: true,
        videoData: {
          url: generation.videoUrl,
          prompt: generation.prompt,
          duration: parseInt(generation.duration),
          aspectRatio: generation.aspectRatio,
          model: generation.model,
        }
      }
    });
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
      {/* HEADER */}
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-3 sm:p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* LEFT SECTION */}
            <div className="flex-1 space-y-4 lg:space-y-5">
              {/* Model Selection */}
              <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-4 sm:p-5 transition-all duration-300 hover:shadow-xl">
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
                    <option value="veo-3.1-generate-preview">
                      Veo 3.1 (Best Quality)
                    </option>
                    <option value="veo-3.1-fast-generate-preview">
                      Veo 3.1 Fast (Faster)
                    </option>
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
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-4 sm:p-5 transition-all duration-300 hover:shadow-xl">
                <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                  Video Settings
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {["4", "8"].map((dur) => (
                        <button
                          key={dur}
                          onClick={() => setDuration(dur)}
                          className={`px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
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
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Aspect Ratio
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {["16:9", "9:16", "1:1"].map((ratio) => (
                        <button
                          key={ratio}
                          onClick={() => setAspectRatio(ratio)}
                          className={`px-2 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
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

              {/* Resources */}
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-4 sm:p-5 transition-all duration-300 hover:shadow-xl">
                <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                  Resources
                </label>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 items-stretch sm:items-center">
                  <button
                    onClick={() => setShowPromptLibrary(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 text-xs sm:text-sm font-medium text-gray-800 hover:shadow-md transition-all duration-200"
                  >
                    <FiBookOpen className="text-indigo-600" />
                    Prompt Library
                  </button>
                  <button
                    onClick={() => setShowPromptDocs(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 text-xs sm:text-sm font-medium text-gray-800 hover:shadow-md transition-all duration-200"
                  >
                    <HiOutlineDocumentText className="text-indigo-600" />
                    Prompt Docs
                  </button>
                </div>
              </div>

              {/* Prompt */}
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-4 sm:p-5 transition-all duration-300 hover:shadow-xl">
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
                  className="mt-4 w-full py-3 sm:py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Wand2
                        size={20}
                        className="group-hover:rotate-12 transition-transform"
                      />
                      <span>Generate Video</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT SECTION: RECENT GENERATIONS */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-5 sm:p-6 transition-all duration-300 hover:shadow-xl lg:sticky lg:top-6">
                <div className="flex items-center justify-between mb-5">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <FiVideo className="text-indigo-600" />
                    <span>Recent Generations</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {generations.length > 0 && (
                      <>
                        <span className="px-2.5 sm:px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-bold rounded-full">
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
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-5 min-h-[450px] sm:min-h-[500px]">
                  {generations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <div className="relative mb-4">
                        <FiVideo className="text-indigo-300" size={56} />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-ping"></span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium px-4">
                        Your generated videos will appear here
                      </p>
                      <p className="text-xs text-gray-500 mt-1 px-4">
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
                              className="w-28 sm:w-32 md:w-36 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative cursor-pointer group"
                              style={getAspectRatioStyle(
                                generation.aspectRatio
                              )}
                            >
                              {generation.status === "completed" &&
                              (generation.videoUrl ||
                                generation.thumbnailUrl) ? (
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
                                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-600/80 text-white shadow-lg group-hover:scale-110 transition-transform">
                                      <FiPlay className="text-sm sm:text-base ml-0.5" />
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
                                <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
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
                              <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 mb-2.5">
                                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                                  {generation.model.replace(
                                    "-generate-preview",
                                    ""
                                  )}
                                </span>
                                <span>•</span>
                                <span>{generation.duration}</span>
                                <span>•</span>
                                <span>{generation.aspectRatio}</span>
                                {generation.referenceImageUrl && (
                                  <>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="inline-flex items-center gap-1">
                                      <FiImage className="text-indigo-500" />
                                      <span className="hidden sm:inline">
                                        Ref
                                      </span>
                                    </span>
                                  </>
                                )}
                              </div>
                              {generation.errorMessage && (
                                <p className="text-xs text-red-600 mb-2 line-clamp-1">
                                  {generation.errorMessage}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-auto flex-wrap">
                                {generation.status === "completed" &&
                                  generation.videoUrl && (
                                    <>
                                      <a
                                        href={generation.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
                                      >
                                        <FiPlay className="text-sm" />
                                        <span className="hidden sm:inline">
                                          View
                                        </span>
                                      </a>
                                      <a
                                        href={generation.videoUrl}
                                        download
                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
                                      >
                                        <FiDownload className="text-sm" />
                                        <span className="hidden sm:inline">
                                          Download
                                        </span>
                                      </a>
                                      <button
                                        onClick={() => handleEdit(generation)}
                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
                                      >
                                        <FiEdit3 className="text-sm" />
                                        <span className="hidden sm:inline">
                                          Edit
                                        </span>
                                      </button>
                                    </>
                                  )}
                                <button
                                  onClick={() => handleDelete(generation.id)}
                                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-all border border-red-200 ml-auto"
                                >
                                  <FiTrash2 className="text-sm" />
                                  <span className="hidden sm:inline">
                                    Delete
                                  </span>
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

        {/* PROMPT LIBRARY MODAL */}
        {showPromptLibrary && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm"
            onClick={() => setShowPromptLibrary(false)}
          >
            <div
              className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Prompt Library
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Click any prompt to use it
                  </p>
                </div>
                <button
                  onClick={() => setShowPromptLibrary(false)}
                  className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-white/50 transition-all"
                >
                  Close
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {samplePrompts.map((category) => (
                  <div key={category.category}>
                    <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                      {category.category}
                    </h4>
                    <div className="space-y-3">
                      {category.prompts.map((promptText, idx) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200 hover:border-indigo-300 transition-all group cursor-pointer"
                          onClick={() => {
                            setPrompt(promptText);
                            setShowPromptLibrary(false);
                          }}
                        >
                          <p className="text-sm text-gray-700 mb-3">
                            {promptText}
                          </p>
                          <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 group-hover:text-indigo-700">
                            <Wand2 size={14} />
                            <span>Use This Prompt</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROMPT DOCS MODAL */}
        {showPromptDocs && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm"
            onClick={() => setShowPromptDocs(false)}
          >
            <div
              className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Prompt Writing Guide
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Tips for creating better video prompts
                  </p>
                </div>
                <button
                  onClick={() => setShowPromptDocs(false)}
                  className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-white/50 transition-all"
                >
                  Close
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Best Practices */}
                <div>
                  <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    Best Practices
                  </h4>
                  <ul className="space-y-2.5 text-sm text-gray-700">
                    <li className="flex gap-2.5">
                      <span className="text-indigo-600 font-bold flex-shrink-0">
                        ✓
                      </span>
                      <span>
                        <strong>Be Specific:</strong> Include details about
                        camera angles, lighting, and movement for better results
                      </span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-indigo-600 font-bold flex-shrink-0">
                        ✓
                      </span>
                      <span>
                        <strong>Set the Scene:</strong> Describe the
                        environment, time of day, and atmospheric conditions
                      </span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-indigo-600 font-bold flex-shrink-0">
                        ✓
                      </span>
                      <span>
                        <strong>Include Motion:</strong> Specify camera movement
                        (pan, zoom, dolly) or subject action for dynamic videos
                      </span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-indigo-600 font-bold flex-shrink-0">
                        ✓
                      </span>
                      <span>
                        <strong>Visual Style:</strong> Mention aesthetic
                        preferences (cinematic, documentary, vintage, etc.)
                      </span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-indigo-600 font-bold flex-shrink-0">
                        ✓
                      </span>
                      <span>
                        <strong>Use Descriptive Language:</strong> Rich
                        adjectives help the AI understand the mood and quality
                        you want
                      </span>
                    </li>
                  </ul>
                </div>
                {/* Example Structure */}
                <div>
                  <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    Prompt Structure Formula
                  </h4>
                  <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-200">
                    <p className="text-sm text-gray-700 mb-2 font-medium">
                      Recommended Formula:
                    </p>
                    <p className="text-xs text-gray-600 font-mono bg-white p-3 rounded-lg border border-indigo-200">
                      [Camera Movement] + [Subject/Scene] + [Environment] +
                      [Lighting] + [Mood/Style]
                    </p>
                    <div className="mt-4 pt-4 border-t border-indigo-200">
                      <p className="text-sm text-gray-700 font-medium mb-2">
                        Example:
                      </p>
                      <p className="text-sm text-gray-600 italic bg-white p-3 rounded-lg border border-indigo-200">
                        "A slow drone shot revealing a serene mountain lake
                        surrounded by pine trees, golden hour lighting with warm
                        orange and pink tones, cinematic style with shallow
                        depth of field"
                      </p>
                    </div>
                  </div>
                </div>
                {/* Quick Tips Grid */}
                <div>
                  <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    Quick Reference Guide
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <p className="text-xs font-bold text-purple-700 mb-1.5">
                        Camera Movements
                      </p>
                      <p className="text-xs text-gray-600">
                        Aerial, drone shot, close-up, wide shot, POV, tracking
                        shot, pan, tilt, zoom, dolly, crane shot, steady cam
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <p className="text-xs font-bold text-purple-700 mb-1.5">
                        Lighting Conditions
                      </p>
                      <p className="text-xs text-gray-600">
                        Golden hour, blue hour, harsh sunlight, soft diffused
                        light, backlighting, rim lighting, dramatic shadows
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <p className="text-xs font-bold text-purple-700 mb-1.5">
                        Motion Types
                      </p>
                      <p className="text-xs text-gray-600">
                        Slow motion, time-lapse, smooth glide, fast-paced,
                        dynamic movement, gentle drift, quick cuts
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <p className="text-xs font-bold text-purple-700 mb-1.5">
                        Mood & Atmosphere
                      </p>
                      <p className="text-xs text-gray-600">
                        Peaceful, dramatic, energetic, mysterious, joyful,
                        melancholic, uplifting, intense, serene
                      </p>
                    </div>
                  </div>
                </div>
                {/* Common Mistakes */}
                <div>
                  <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Common Mistakes to Avoid
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex gap-2.5">
                      <span className="text-red-600 font-bold flex-shrink-0">
                        ✗
                      </span>
                      <span>
                        Being too vague: "a nice video" → Instead: "a serene
                        beach sunset with gentle waves"
                      </span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-red-600 font-bold flex-shrink-0">
                        ✗
                      </span>
                      <span>
                        Overcomplicating: Avoid extremely long prompts with too
                        many elements
                      </span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-red-600 font-bold flex-shrink-0">
                        ✗
                      </span>
                      <span>
                        Conflicting instructions: "dark night scene with bright
                        sunshine"
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE GENERATION MODAL */}
        {activeGeneration && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm"
            onClick={closeActiveGeneration}
          >
            <div
              className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-shrink-0 flex items-start sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 gap-3 rounded-t-2xl">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2">
                    {activeGeneration.prompt || "VEO3 Video"}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                      {activeGeneration.model.replace(
                        "-generate-preview",
                        ""
                      )}
                    </span>
                    <span>{activeGeneration.duration}</span>
                    <span>•</span>
                    <span>{activeGeneration.aspectRatio}</span>
                    {activeGeneration.referenceImageUrl && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                          <FiImage className="text-[10px]" />
                          <span className="text-[10px]">Ref image</span>
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeActiveGeneration}
                  className="flex-shrink-0 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-white/50 transition-all"
                >
                  Close
                </button>
              </div>
              <div className="flex-1 min-h-0 bg-black flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-auto rounded-b-2xl">
                {activeGeneration.videoUrl ? (
                  <video
                    src={activeGeneration.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg shadow-2xl"
                  />
                ) : activeGeneration.thumbnailUrl ? (
                  <img
                    src={activeGeneration.thumbnailUrl}
                    alt="Video"
                    className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg shadow-2xl"
                  />
                ) : (
                  <div className="flex items-center justify-center text-gray-500">
                    <FiVideo className="text-4xl sm:text-5xl" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ALL GENERATIONS MODAL */}
        {showAll && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm"
            onClick={handleCloseAll}
          >
            <div
              className="relative w-full max-w-5xl max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-gray-900">
                    All VEO3 Generations
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {allGenerations.length || generations.length} total videos
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseAll}
                  className="flex-shrink-0 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-white/50 transition-all"
                >
                  Close
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 rounded-b-2xl">
                {loadingAllGenerations ? (
                  <div className="flex items-center justify-center py-12 text-gray-600">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3" />
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : (allGenerations.length || generations.length) === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FiVideo className="text-indigo-300 text-4xl sm:text-5xl mb-3" />
                    <span className="text-sm text-gray-600">
                      No generations found.
                    </span>
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
                              className="w-28 sm:w-32 md:w-36 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative cursor-pointer group"
                              style={getAspectRatioStyle(
                                generation.aspectRatio
                              )}
                            >
                              {generation.status === "completed" &&
                              (generation.videoUrl ||
                                generation.thumbnailUrl) ? (
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
                                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-600/80 text-white shadow-lg group-hover:scale-110 transition-transform">
                                      <FiPlay className="text-sm sm:text-base ml-0.5" />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <FiVideo className="text-2xl sm:text-3xl" />
                                </div>
                              )}
                            </button>
                            <div className="flex-1 min-w-0 flex flex-col">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
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
                              <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 mb-2.5">
                                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                                  {generation.model.replace(
                                    "-generate-preview",
                                    ""
                                  )}
                                </span>
                                <span>•</span>
                                <span>{generation.duration}</span>
                                <span>•</span>
                                <span>{generation.aspectRatio}</span>
                                <span className="hidden sm:inline">•</span>
                                <span className="hidden sm:inline text-xs">
                                  {formatDateTime(generation.createdAt)}
                                </span>
                                {generation.referenceImageUrl && (
                                  <>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                                      <FiImage className="text-[10px]" />
                                      <span className="hidden sm:inline text-[10px]">
                                        Ref
                                      </span>
                                    </span>
                                  </>
                                )}
                              </div>
                              {generation.errorMessage && (
                                <p className="text-xs text-red-600 mb-2 line-clamp-2">
                                  {generation.errorMessage}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-auto flex-wrap">
                                {generation.status === "completed" &&
                                  generation.videoUrl && (
                                    <>
                                      <a
                                        href={generation.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
                                      >
                                        <FiPlay className="text-sm" />
                                        <span className="hidden sm:inline">
                                          View
                                        </span>
                                      </a>
                                      <a
                                        href={generation.videoUrl}
                                        download
                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
                                      >
                                        <FiDownload className="text-sm" />
                                        <span className="hidden sm:inline">
                                          Download
                                        </span>
                                      </a>
                                      <button
                                        onClick={() => handleEdit(generation)}
                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
                                      >
                                        <FiEdit3 className="text-sm" />
                                        <span className="hidden sm:inline">
                                          Edit
                                        </span>
                                      </button>
                                    </>
                                  )}
                                <button
                                  onClick={() => handleDelete(generation.id)}
                                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-all border border-red-200 ml-auto"
                                >
                                  <FiTrash2 className="text-sm" />
                                  <span className="hidden sm:inline">
                                    Delete
                                  </span>
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