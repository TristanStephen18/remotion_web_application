import React, { useState } from "react";
import { FiDownload, FiVideo, FiArrowRight } from "react-icons/fi";
import { LuVideo } from "react-icons/lu";

interface VideoInfo {
  thumbnail: string;
  title: string;
  duration: string;
  likes: string;
  views: string;
}

export const YoutubeDownloader: React.FC = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  const handleFetchVideo = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setVideoInfo({
        thumbnail: "https://via.placeholder.com/120x90/1a1a1a/ffffff?text=Video",
        title: "When Your Gf Is Hungry",
        duration: "41s",
        likes: "254,833 likes",
        views: "4,312,106 views",
      });
      setLoading(false);
    }, 1000);
  };

  const handleDownload = (quality: string) => {
    console.log(`Downloading video in ${quality}...`);
  };

  const qualities = ["1080p", "720p", "480p"];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="pt-2 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <FiVideo className="text-red-600 text-lg sm:text-xl" />
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            Youtube Downloader
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 px-11 sm:px-0">
          Download Youtube videos in high quality for your content creation needs.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          {/* Title Section */}
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <FiVideo className="text-red-600 text-lg sm:text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">
                Youtube Downloader
              </h3>
              <p className="text-[11px] sm:text-xs lg:text-sm text-gray-600 mt-0.5 sm:mt-1">
                Download Youtube videos in MP4 format
              </p>
            </div>
          </div>

          {/* URL Input */}
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleFetchVideo()}
              placeholder="https://youtube.com/shorts/..."
              className="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2.5 sm:py-3 rounded-lg border border-gray-300 bg-white text-xs sm:text-sm 
              placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <button
              onClick={handleFetchVideo}
              disabled={!url.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-md 
              bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed
              flex items-center justify-center transition active:scale-[0.95]"
            >
              <FiArrowRight className="text-white text-sm sm:text-base" />
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-6 sm:p-8 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
              <p className="text-xs sm:text-sm text-gray-600">Fetching video information...</p>
            </div>
          )}

          {/* Video Info & Download Options */}
          {!loading && videoInfo && (
            <div className="space-y-3 sm:space-y-4">
              {/* Video Preview Card */}
              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-12 sm:w-28 sm:h-20 rounded-md sm:rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center">
                    <img
                      src={videoInfo.thumbnail}
                      alt={videoInfo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Video Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 mb-0.5 sm:mb-1 line-clamp-2">
                    {videoInfo.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-gray-600">
                    {videoInfo.duration} • {videoInfo.likes} • {videoInfo.views}
                  </p>
                </div>

                {/* Delete/Clear Button */}
                <button
                  onClick={() => {
                    setVideoInfo(null);
                    setUrl("");
                  }}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition p-1"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Quality & Download Options */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-b border-gray-200">
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-700">Quality</div>
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-700">Actions</div>
                </div>

                {/* Quality Rows */}
                {qualities.map((quality, idx) => (
                  <div
                    key={quality}
                    className={`grid grid-cols-2 gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 ${
                      idx !== qualities.length - 1 ? "border-b border-gray-200" : ""
                    } hover:bg-gray-50 transition`}
                  >
                    {/* Quality */}
                    <div className="text-xs sm:text-sm text-gray-900 font-medium">{quality}</div>

                    {/* Download Button */}
                    <div>
                      <button
                        onClick={() => handleDownload(quality)}
                        className="inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-700 hover:text-indigo-600 transition font-medium active:scale-[0.95]"
                      >
                        Download
                        <FiDownload className="text-[10px] sm:text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !videoInfo && (
            <div className="p-6 sm:p-8 lg:p-12 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3 sm:mb-4">
                <LuVideo className="text-gray-400 text-2xl sm:text-3xl lg:text-4xl" />
              </div>
              <h4 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-800 mb-1 sm:mb-2 px-4">
                Ready to download?
              </h4>
              <p className="text-[11px] sm:text-xs lg:text-sm text-gray-600 max-w-md px-4">
                Paste a YouTube video URL above and click the arrow to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};