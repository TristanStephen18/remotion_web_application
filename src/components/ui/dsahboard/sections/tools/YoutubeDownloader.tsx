import React, { useState, useEffect } from "react";
import {
  FiDownload,
  FiVideo,
  FiArrowRight,
  FiX,
  FiTrash2,
} from "react-icons/fi";
import { LuVideo } from "react-icons/lu";
import { Play } from "lucide-react";
import {
  youtubeService,
  type YouTubeVideoInfo,
  type YouTubeDownload,
} from "../../../../../services/youtubeService";

export const YoutubeDownloader: React.FC = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<YouTubeVideoInfo | null>(null);
  const [downloads, setDownloads] = useState<YouTubeDownload[]>([]);
  // const [loadingDownloads, setLoadingDownloads] = useState(false);
  const [downloadingQualities, setDownloadingQualities] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchDownloads();
  }, []);

  // Poll for processing downloads
  useEffect(() => {
    const hasProcessing = downloads.some(
      (download) =>
        download.status === "pending" || download.status === "processing"
    );
    if (hasProcessing) {
      const interval = setInterval(() => {
        fetchDownloads();
      }, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [downloads]);

  const fetchDownloads = async () => {
    try {
      const response = await youtubeService.getDownloads(10, 0);
      if (response.success && response.downloads) {
        setDownloads(response.downloads);
      }
    } catch (error) {
      console.error("Failed to fetch downloads:", error);
    }
  };

  const handleFetchVideo = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setVideoInfo(null);

    try {
      const response = await youtubeService.getVideoInfo(url);
      if (response.success && response.video) {
        setVideoInfo(response.video);
      } else {
        alert("Failed to fetch video information. Please check the URL.");
      }
    } catch (error) {
      console.error("Failed to fetch video info:", error);
      alert(
        "Failed to fetch video information. Please check the URL and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (quality: string) => {
    // Log everything before sending
    console.log("=== DOWNLOAD DEBUG ===");
    console.log("1. Quality received:", quality);
    console.log("2. URL from state:", url);
    console.log("3. Video Info:", videoInfo);
    console.log("4. Has token:", !!localStorage.getItem("token"));
    console.log("=====================");

    if (!url.trim() || !videoInfo) {
      console.error("❌ Missing URL or video info");
      return;
    }

    setDownloadingQualities((prev) => new Set(prev).add(quality));

    try {
      console.log("📤 Sending download request...");
      const response = await youtubeService.downloadVideo(url, quality);
      console.log("✅ Download response:", response);

      if (response.success) {
        await fetchDownloads();
        alert(
          `Download started! Video will be available in your history soon.`
        );
      } else {
        console.error("❌ Backend returned success: false");
        alert("Failed to start download. Please try again.");
      }
    } catch (error) {
      console.error("❌ Failed to download video:", error);

      // ✅ Log the actual error from backend
      const axiosError = error as any;
      if (axiosError.response) {
        console.error("Backend error details:", axiosError.response.data);
        console.error("Status code:", axiosError.response.status);
      }

      alert("Failed to start download. Please try again.");
    } finally {
      setDownloadingQualities((prev) => {
        const newSet = new Set(prev);
        newSet.delete(quality);
        return newSet;
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this download?")) return;

    try {
      const response = await youtubeService.deleteDownload(id);
      if (response.success) {
        setDownloads((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete download:", error);
      alert("Failed to delete download. Please try again.");
    }
  };

  const handleClear = () => {
    setVideoInfo(null);
    setUrl("");
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

  const formatFilesize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    const mb = bytes / (1024 * 1024);
    return `~${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* HEADER */}
      <div className="pt-2 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
            <FiVideo className="text-red-600 text-lg sm:text-xl" />
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            YouTube Downloader
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 px-11 sm:px-0">
          Download YouTube videos in high quality for your content creation
          needs.
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-3 sm:p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* LEFT SECTION - Downloader */}
            <div className="flex-1 space-y-6">
              {/* Input Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl">
                <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  Enter YouTube URL
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleFetchVideo()}
                    placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                    className="w-full pl-4 pr-14 py-3.5 rounded-xl bg-gray-50 border-2 border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                  <button
                    onClick={handleFetchVideo}
                    disabled={!url.trim() || loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg 
                    bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
                    disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
                    flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg
                    hover:scale-105 active:scale-95 group"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiArrowRight className="text-white text-base group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </button>
                </div>

                <div className="mt-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-700 font-medium">
                    ✓ Supports YouTube videos, Shorts, and playlists
                  </p>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-12 transition-all duration-300 animate-fadeIn">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                      <span className="absolute -bottom-2 -right-2 w-6 h-6 bg-purple-400 rounded-full animate-ping"></span>
                    </div>
                    <h4 className="text-base font-bold text-gray-800 mb-2">
                      Fetching Video Information
                    </h4>
                    <p className="text-sm text-gray-600">
                      Please wait while we retrieve the video details...
                    </p>
                  </div>
                </div>
              )}

              {/* Video Info & Download Options */}
              {!loading && videoInfo && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Video Preview Card */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 sm:p-6 transition-all duration-300 hover:shadow-xl">
                    <div className="flex items-start gap-4">
                      {/* Thumbnail with Play Overlay */}
                      <div className="flex-shrink-0 relative group">
                        <div className="w-32 sm:w-40 md:w-48 rounded-xl overflow-hidden bg-gray-900 shadow-md">
                          <img
                            src={videoInfo.thumbnail}
                            alt={videoInfo.title}
                            className="w-full aspect-video object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center">
                              <Play
                                className="text-white ml-1"
                                size={20}
                                fill="white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Video Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h4 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 leading-snug">
                            {videoInfo.title}
                          </h4>
                          <button
                            onClick={handleClear}
                            className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
                          >
                            <FiX size={16} />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                            {videoInfo.duration}
                          </span>
                          <span>•</span>
                          <span>{videoInfo.views}</span>
                          <span>•</span>
                          <span>{videoInfo.likes}</span>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-4 flex gap-2">
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Available
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quality & Download Options */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
                    <div className="px-5 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                        Select Quality & Download
                      </h4>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {videoInfo.formats.map((format) => (
                        <div
                          key={format.quality}
                          className="px-5 sm:px-6 py-4 hover:bg-gray-50 transition-all duration-200 group"
                        >
                          <div className="flex items-center justify-between gap-4">
                            {/* Quality Info */}
                            <div className="flex items-center gap-4 flex-1">
                              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-red-100 to-pink-100 flex-shrink-0 group-hover:scale-110 transition-transform">
                                <FiVideo className="text-red-600 text-lg" />
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-gray-900">
                                    {format.quality}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                                    {format.type}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 mt-0.5">
                                  Estimated size:{" "}
                                  {formatFilesize(format.filesize)}
                                </p>
                              </div>
                            </div>

                            {/* Download Button */}
                            <button
                              onClick={() => handleDownload(format.quality)}
                              disabled={downloadingQualities.has(
                                format.quality
                              )}
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 group/btn"
                            >
                              {downloadingQualities.has(format.quality) ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span className="hidden sm:inline">
                                    Starting...
                                  </span>
                                </>
                              ) : (
                                <>
                                  <FiDownload className="text-sm group-hover/btn:animate-bounce" />
                                  <span className="hidden sm:inline">
                                    Download
                                  </span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && !videoInfo && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-12 lg:p-16 transition-all duration-300 hover:shadow-xl">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
                        <LuVideo className="text-red-600 text-4xl sm:text-5xl" />
                      </div>
                      <span className="absolute -bottom-2 -right-2 w-6 h-6 bg-purple-400 rounded-full animate-ping"></span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                      Ready to Download
                    </h4>
                    <p className="text-sm text-gray-600 max-w-md mb-6">
                      Paste a YouTube video URL above and click the arrow to
                      fetch video information and download options
                    </p>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Multiple Qualities
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Fast Processing
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        High Quality
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SECTION - Download History */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 sm:p-6 transition-all duration-300 hover:shadow-xl lg:sticky lg:top-6">
                <div className="flex items-center justify-between mb-5">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <FiVideo className="text-red-600" />
                    <span>Download History</span>
                  </label>
                  {downloads.length > 0 && (
                    <span className="px-2.5 sm:px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-100 text-gray-700 text-xs font-bold rounded-full">
                      {downloads.length}
                    </span>
                  )}
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-xl p-4 sm:p-5 min-h-[450px] sm:min-h-[500px] max-h-[600px] overflow-y-auto">
                  {downloads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <div className="relative mb-4">
                        <FiVideo className="text-gray-300" size={56} />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-ping"></span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium px-4">
                        Your download history will appear here
                      </p>
                      <p className="text-xs text-gray-500 mt-1 px-4">
                        Start downloading videos to build your collection
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {downloads.map((download, i) => (
                        <div
                          key={download.id}
                          className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 animate-fadeIn"
                          style={{ animationDelay: `${i * 50}ms` }}
                        >
                          <div className="flex items-start gap-3">
                            {/* Thumbnail */}
                            <div className="w-20 sm:w-24 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                              {download.thumbnail ? (
                                <img
                                  src={download.thumbnail}
                                  alt={download.title}
                                  className="w-full aspect-video object-cover"
                                />
                              ) : (
                                <div className="w-full aspect-video flex items-center justify-center">
                                  <FiVideo className="text-gray-400 text-2xl" />
                                </div>
                              )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                                  {download.title}
                                </p>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(
                                    download.status
                                  )}`}
                                >
                                  {getStatusText(download.status)}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-600 mb-2">
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                                  {download.quality}
                                </span>
                                {download.duration && (
                                  <>
                                    <span>•</span>
                                    <span>{download.duration}</span>
                                  </>
                                )}
                              </div>

                              {download.errorMessage && (
                                <p className="text-xs text-red-600 mb-2 line-clamp-1">
                                  {download.errorMessage}
                                </p>
                              )}

                              {/* Actions */}
                              <div className="flex items-center gap-2 mt-2">
                                {download.status === "completed" &&
                                  download.downloadedVideoUrl && (
                                    <>
                                      <a
                                        href={download.downloadedVideoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
                                      >
                                        <FiDownload className="text-xs" />
                                        <span className="hidden sm:inline">
                                          View
                                        </span>
                                      </a>
                                    </>
                                  )}
                                <button
                                  onClick={() => handleDelete(download.id)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-all ml-auto border border-red-200"
                                >
                                  <FiTrash2 className="text-xs" />
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
      </div>
    </div>
  );
};
