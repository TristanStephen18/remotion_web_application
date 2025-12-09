// src/components/ui/dashboard/sections/tools/AIImageGenerator.tsx
import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Download,
  Wand2,
  ChevronDown,
  ImageIcon,
  Trash2,
} from "lucide-react";
import {
  imageGenService,
  type ImageGeneration,
} from "../../../../../services/imageGenService";

interface AIImageGeneratorProps {
  pollinationsModel: string;
  setPollinationsModel: React.Dispatch<React.SetStateAction<string>>;
  aspectRatio: "9:16" | "16:9" | "1:1" | "4:5";
  setAspectRatio: React.Dispatch<
    React.SetStateAction<"9:16" | "16:9" | "1:1" | "4:5">
  >;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}

export const AIImageGenerator: React.FC<AIImageGeneratorProps> = ({
  pollinationsModel,
  setPollinationsModel,
  aspectRatio,
  setAspectRatio,
  prompt,
  setPrompt,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [generations, setGenerations] = useState<ImageGeneration[]>([]);
  const [loadingGenerations, setLoadingGenerations] = useState(false);
  const [showGenerateNew, setShowGenerateNew] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [allGenerations, setAllGenerations] = useState<ImageGeneration[]>([]);
  const [loadingAllGenerations, setLoadingAllGenerations] = useState(false);
  const [viewingImage, setViewingImage] = useState<ImageGeneration | null>(
    null
  );

  const pollinationsModels = [
    { id: "flux", name: "Flux (Best Quality)" },
    { id: "flux-realism", name: "Flux Realism (Photorealistic)" },
    { id: "flux-anime", name: "Flux Anime" },
  ];

  const MAX_RECENT = 9;

  // Fetch generations on mount
  useEffect(() => {
    fetchGenerations();
  }, []);

  const fetchGenerations = async () => {
    try {
      setLoadingGenerations(true);
      const response = await imageGenService.getGenerations(20, 0);
      if (response.success) {
        setGenerations(response.generations);
      }
    } catch (error) {
      console.error("Failed to fetch generations:", error);
    } finally {
      setLoadingGenerations(false);
    }
  };

  const ratioToSize = () => {
    switch (aspectRatio) {
      case "9:16":
        return { width: 512, height: 912 };
      case "16:9":
        return { width: 912, height: 512 };
      case "1:1":
        return { width: 1024, height: 1024 };
      case "4:5":
        return { width: 720, height: 900 };
      default:
        return { width: 512, height: 912 };
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setCurrentImage(null);
    setShowGenerateNew(false); // Reset state

    const { width, height } = ratioToSize();

    try {
      const imageUrl = await generateWithPollinations(prompt, width, height);

      if (!imageUrl) throw new Error("No image returned from model");

      setImageLoading(true);
      setCurrentImage(imageUrl);
      setShowGenerateNew(true); // Show "Generate New" button

      // Save to database
      try {
        const saveResponse = await imageGenService.saveGeneration({
          prompt: prompt.trim(),
          model: pollinationsModel,
          aspectRatio,
          imageUrl,
        });

        if (saveResponse.success) {
          setGenerations((prev) => [saveResponse.generation, ...prev]);
          console.log("✅ Image generation saved:", saveResponse.generation.id);
        }
      } catch (saveError) {
        console.error("❌ Failed to save generation:", saveError);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setShowGenerateNew(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNew = () => {
    setCurrentImage(null);
    setShowGenerateNew(false);
    setPrompt("");
    setError(null);
  };

  const generateWithPollinations = async (
    prompt: string,
    width: number,
    height: number
  ): Promise<string> => {
    const seed = Math.floor(Math.random() * 1_000_000);
    const encodedPrompt = encodeURIComponent(prompt);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=${pollinationsModel}&nologo=true&enhance=false`;
  };

  const fetchAllGenerations = async () => {
    try {
      setLoadingAllGenerations(true);
      const response = await imageGenService.getGenerations(50, 0);
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await imageGenService.deleteGeneration(id);
      if (response.success) {
        setGenerations((prev) => prev.filter((gen) => gen.id !== id));
        setAllGenerations((prev) => prev.filter((gen) => gen.id !== id));
        console.log("✅ Image deleted:", id);
      }
    } catch (error) {
      console.error("❌ Failed to delete image:", error);
      alert("Failed to delete image. Please try again.");
    }
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

  const handleDownload = async (url: string, prompt: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${prompt.slice(0, 30).replace(/[^a-z0-9]/gi, "_")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to direct link
      const a = document.createElement("a");
      a.href = url;
      a.download = "ai-image.png";
      a.click();
    }
  };

  const handleView = (generation: ImageGeneration) => {
    setViewingImage(generation);
  };

  const closeViewer = () => {
    setViewingImage(null);
  };

  return (
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
                  value={pollinationsModel}
                  onChange={(e) => setPollinationsModel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 text-sm font-medium text-gray-800 appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 cursor-pointer pr-10"
                >
                  {pollinationsModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                  size={20}
                />
              </div>
              <div className="mt-3 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-700 font-medium">
                  Powered by Pollinations.ai
                </p>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-5 transition-all duration-300 hover:shadow-xl">
              <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["9:16", "16:9", "1:1", "4:5"] as const).map((ratio) => (
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

            {/* CURRENT IMAGE PREVIEW */}
            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 transition-all duration-300 hover:shadow-xl">
              <label className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="text-indigo-600 animate-pulse" />
                Preview
              </label>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl animate-blob"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                </div>

                {loading && (
                  <div className="flex flex-col items-center z-10 animate-fadeIn">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
                      <div className="w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent absolute top-0 left-0 animate-spin"></div>
                    </div>
                    <p className="text-sm text-gray-700 mt-4 font-medium">
                      Creating magic with AI...
                    </p>
                    <div className="flex gap-1 mt-2">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce animation-delay-200"></span>
                      <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce animation-delay-400"></span>
                    </div>
                  </div>
                )}

                {!loading && currentImage && (
                  <div className="w-full relative z-10 animate-fadeIn">
                    {imageLoading && (
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <div className="relative">
                          <div className="w-12 h-12 border-4 border-indigo-200 rounded-full"></div>
                          <div className="w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent absolute top-0 left-0 animate-spin"></div>
                        </div>
                      </div>
                    )}

                    <img
                      src={currentImage}
                      crossOrigin="anonymous"
                      onLoad={() => setImageLoading(false)}
                      alt="current generation"
                      className={`rounded-xl w-full h-auto mx-auto shadow-2xl ${getAspectRatioClass(
                        aspectRatio
                      )} object-cover transition-all duration-500 hover:scale-[1.02]`}
                    />

                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => handleDownload(currentImage, prompt)}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                      >
                        <Download
                          size={18}
                          className="group-hover:animate-bounce"
                        />
                        Download Image
                      </button>

                      <button
                        onClick={handleGenerateNew}
                        className="w-full py-3 bg-white border-2 border-indigo-200 text-indigo-600 text-sm font-semibold rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 flex items-center justify-center gap-2 group"
                      >
                        <Wand2
                          size={18}
                          className="group-hover:rotate-12 transition-transform"
                        />
                        Generate New Image
                      </button>
                    </div>
                  </div>
                )}

                {!loading && !currentImage && (
                  <div className="text-center z-10 animate-fadeIn">
                    <div className="relative inline-block mb-4">
                      <Sparkles
                        className="text-indigo-400 animate-pulse"
                        size={48}
                      />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-ping"></span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Ready to create something amazing?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Enter a prompt below and let AI bring your ideas to life.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Prompt */}
            {!showGenerateNew ? (
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-5 transition-all duration-300 hover:shadow-xl">
                <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                  Your Prompt
                </label>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to create... Be creative!"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 text-sm text-gray-800 outline-none resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />

                {error && (
                  <div className="mt-3 bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-shake">
                    <p className="text-sm text-red-700 font-medium flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      {error}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || loading}
                  className="mt-4 w-full py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2
                        size={20}
                        className="group-hover:rotate-12 transition-transform"
                      />
                      Generate Image
                    </>
                  )}
                </button>
              </div>
            ) : null}
          </div>

          {/* RIGHT SECTION: RECENT */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 transition-all duration-300 hover:shadow-xl sticky top-6">
              <div className="flex items-center justify-between mb-5">
                <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <ImageIcon className="text-indigo-600" />
                  Recent Generations
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

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 min-h-[500px]">
                {loadingGenerations ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : generations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="relative mb-4">
                      <ImageIcon className="text-indigo-300" size={64} />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-ping"></span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      Your generated images will appear here
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Start creating to build your gallery
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {generations.slice(0, MAX_RECENT).map((item, i) => (
                      <div
                        key={item.id}
                        className="relative rounded-xl overflow-hidden border-2 border-indigo-200 group transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeIn bg-white"
                        style={{
                          animationDelay: `${i * 50}ms`,
                          paddingBottom: "100%", // Square container
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          crossOrigin="anonymous"
                          alt={item.prompt}
                          className="absolute inset-0 w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-xs text-white font-medium line-clamp-2 mb-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                            {item.prompt}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleView(item)}
                              title="View Image"
                              className="flex-1 flex items-center justify-center px-2 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
                            >
                              <ImageIcon size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleDownload(item.imageUrl, item.prompt)
                              }
                              title="Download Image"
                              className="flex-1 flex items-center justify-center px-2 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              title="Delete"
                              className="flex items-center justify-center px-2 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {item.model}
                        </div>

                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {item.aspectRatio}
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

      {viewingImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={closeViewer}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 flex items-start justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl">
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-bold text-gray-900 line-clamp-2">
                  {viewingImage.prompt}
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                    {viewingImage.model}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                    {viewingImage.aspectRatio}
                  </span>
                  <span className="text-xs text-gray-600">
                    {formatDateTime(viewingImage.createdAt)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeViewer}
                className="flex-shrink-0 text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-white/50 transition-all ml-4"
              >
                Close
              </button>
            </div>

            <div className="flex-1 min-h-0 bg-gray-50 flex items-center justify-center p-6 overflow-auto">
              <img
                src={viewingImage.imageUrl}
                crossOrigin="anonymous"
                alt={viewingImage.prompt}
                className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg shadow-2xl"
              />
            </div>

            <div className="flex-shrink-0 flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() =>
                  handleDownload(viewingImage.imageUrl, viewingImage.prompt)
                }
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download Image
              </button>
              <button
                onClick={() => {
                  handleDelete(viewingImage.id);
                  closeViewer();
                }}
                className="px-6 py-3 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
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
                  All Image Generations
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  {allGenerations.length || generations.length} total images
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
                  <ImageIcon className="text-indigo-300 text-4xl sm:text-5xl mb-3" />
                  <span className="text-sm text-gray-600">
                    No generations found.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {(allGenerations.length ? allGenerations : generations).map(
                    (item, i) => (
                      <div
                        key={item.id}
                        className="relative rounded-xl overflow-hidden border-2 border-indigo-200 group transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeIn bg-white"
                        style={{
                          animationDelay: `${i * 30}ms`,
                          paddingBottom: "100%",
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          crossOrigin="anonymous"
                          alt={item.prompt}
                          className="absolute inset-0 w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-xs text-white font-medium line-clamp-2 mb-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                            {item.prompt}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                handleView(item);
                                handleCloseAll();
                              }}
                              title="View Image"
                              className="flex-1 flex items-center justify-center px-2 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
                            >
                              <ImageIcon size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleDownload(item.imageUrl, item.prompt)
                              }
                              title="Download Image"
                              className="flex-1 flex items-center justify-center px-2 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(item.id);
                                // Update both lists
                                setAllGenerations((prev) =>
                                  prev.filter((gen) => gen.id !== item.id)
                                );
                              }}
                              title="Delete"
                              className="flex items-center justify-center px-2 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {item.model}
                        </div>

                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {item.aspectRatio}
                        </div>

                        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {formatDateTime(item.createdAt)}
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