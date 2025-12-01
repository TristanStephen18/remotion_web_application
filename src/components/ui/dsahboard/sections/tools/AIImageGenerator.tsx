// src/components/ui/dashboard/sections/tools/AIImageGenerator.tsx
import React from "react";
import {
  Sparkles,
  Download,
  Wand2,
  ChevronDown,
  ImageIcon,
} from "lucide-react";
import type { Generation } from "../../../../../models/imagegenandbgremove";

interface AIImageGeneratorInterface {
  pollinationsModel: string;
  setPollinationsModel: React.Dispatch<React.SetStateAction<string>>;
  aspectRatio: "9:16" | "16:9" | "1:1" | "4:5";
  setAspectRatio: React.Dispatch<
    React.SetStateAction<"9:16" | "16:9" | "1:1" | "4:5">
  >;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  imageLoading: boolean;
  setImageLoading: React.Dispatch<React.SetStateAction<boolean>>;
  recentGenerations: Generation[];
  setRecentGenerations: React.Dispatch<React.SetStateAction<Generation[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  currentImage: string | null;
  setCurrentImage: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AIImageGenerator: React.FC<AIImageGeneratorInterface> = ({
  pollinationsModel,
  setPollinationsModel,
  aspectRatio,
  setAspectRatio,
  prompt,
  setPrompt,
  imageLoading,
  setImageLoading,
  recentGenerations,
  setRecentGenerations,
  loading,
  setLoading,
  error,
  setError,
  currentImage,
  setCurrentImage,
}) => {
  const pollinationsModels = [
    { id: "flux", name: "Flux (Best Quality)" },
    { id: "flux-realism", name: "Flux Realism (Photorealistic)" },
    { id: "flux-anime", name: "Flux Anime" },
    { id: "flux-3d", name: "Flux 3D" },
    { id: "turbo", name: "Turbo (Fastest)" },
  ];

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

    const { width, height } = ratioToSize();

    try {
      const imageUrl = await generateWithPollinations(prompt, width, height);

      if (!imageUrl) throw new Error("No image returned from model");

      setImageLoading(true);
      setCurrentImage(imageUrl);

      setRecentGenerations((prev) => [
        { url: imageUrl, aspectRatio, model: pollinationsModel },
        ...prev.slice(0, 8),
      ]);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
  const placeholderCount = Math.max(0, totalSlots - recentGenerations.length);

  const downloadImage = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-image.png";
    a.click();
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

                    <button
                      onClick={() => downloadImage(currentImage)}
                      className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                      <Download
                        size={18}
                        className="group-hover:animate-bounce"
                      />
                      Download Image
                    </button>
                  </div>
                )}

                {!loading && !currentImage && (
                  <div className="text-center z-10 animate-fadeIn">
                    <div className="relative inline-mb-4">
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
          </div>

          {/* RIGHT SECTION: RECENT */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 transition-all duration-300 hover:shadow-xl sticky top-6">
              <div className="flex items-center justify-between mb-5">
                <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <ImageIcon className="text-indigo-600" />
                  Recent Generations
                </label>
                {recentGenerations.length > 0 && (
                  <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-bold rounded-full">
                    {recentGenerations.length}
                  </span>
                )}
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 min-h-[500px]">
                {recentGenerations.length === 0 ? (
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
                  <div className={`grid ${getGridCols(aspectRatio)} gap-3`}>
                    {recentGenerations.map((item, i) => (
                      <div
                        key={i}
                        className={`${getAspectRatioClass(
                          item.aspectRatio
                        )} rounded-xl overflow-hidden border-2 border-indigo-200 relative group transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeIn`}
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <img
                          src={item.url}
                          crossOrigin="anonymous"
                          alt={`AI generation ${i}`}
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-3 py-1 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {item.model}
                        </div>

                        <button
                          onClick={() => downloadImage(item.url)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs px-3 py-2 rounded-full shadow-lg hover:bg-white font-semibold flex items-center gap-1"
                        >
                          <Download size={14} />
                          Save
                        </button>
                      </div>
                    ))}

                    {Array.from({ length: placeholderCount }).map((_, i) => (
                      <div
                        key={`placeholder-${i}`}
                        className={`${getAspectRatioClass(
                          aspectRatio
                        )} bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl border-2 border-dashed border-indigo-300 opacity-50`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animate-shake {
          animation: shake 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};
