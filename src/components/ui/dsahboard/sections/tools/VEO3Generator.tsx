import React, { useState, useEffect } from "react";
import { User, Video, Download, Check, AlertCircle } from "lucide-react";
import { backendPrefix } from "../../../../../config";

const API_BASE = `${backendPrefix}/api/video-generation/tavus`;

interface Replica {
  replica_id: string;
  replica_name: string;
  status: string;
  thumbnail_video_url?: string;
}

interface VideoStatus {
  video_id: string;
  status: 'queued' | 'generating' | 'ready' | 'error';
  hosted_url: string;
  download_url?: string;
}

export  const  VEO3Generator: React.FC = () => {
  const [replicas, setReplicas] = useState<Replica[]>([]);
  const [selectedReplica, setSelectedReplica] = useState("");
  const [topic, setTopic] = useState("");
  const [scriptLength, setScriptLength] = useState<"short" | "medium" | "long">("medium");
  const [videoName, setVideoName] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoStatus | null>(null);
  const [generatedScript, setGeneratedScript] = useState("");
  const [error, setError] = useState("");
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Load replicas on mount
  useEffect(() => {
    loadReplicas();
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [pollingInterval]);

  const loadReplicas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/replicas`);
      const data = await response.json();
      
      if (data.success && data.replicas?.data) {
        const completedReplicas = data.replicas.data.filter(
          (r: Replica) => r.status === "completed"
        );
        setReplicas(completedReplicas);
        if (completedReplicas.length > 0) {
          setSelectedReplica(completedReplicas[0].replica_id);
        }
      }
    } catch (err) {
      setError("Failed to load avatars. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  const checkVideoStatus = async (videoId: string) => {
    try {
      const response = await fetch(`${API_BASE}/status/${videoId}`);
      const data = await response.json();
      
      if (data.success) {
        setCurrentVideo(data);
        
        if (data.status === "ready") {
          setGeneratingVideo(false);
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
        } else if (data.status === "error") {
          setError("Video generation failed");
          setGeneratingVideo(false);
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
        }
      }
    } catch (err) {
      console.error("Status check failed:", err);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim() || !selectedReplica) {
      setError("Please enter a topic and select an avatar");
      return;
    }

    setError("");
    setGeneratingVideo(true);
    setCurrentVideo(null);
    setGeneratedScript("");

    try {
      const response = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic,
          replica_id: selectedReplica,
          script_length: scriptLength,
          video_name: videoName || `Video about ${topic}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentVideo({
          video_id: data.video_id,
          status: data.status,
          hosted_url: data.hosted_url,
        });
        setGeneratedScript(data.generated_script || "");

        // Start polling for status
        const interval = setInterval(() => {
          checkVideoStatus(data.video_id);
        }, 5000);
        setPollingInterval(interval);
      } else {
        setError(data.error || "Failed to generate video");
        setGeneratingVideo(false);
      }
    } catch (err) {
      setError("Failed to connect to backend. Is your server running?");
      setGeneratingVideo(false);
    }
  };

  const handleDownload = async () => {
    if (!currentVideo?.video_id) return;

    try {
      const response = await fetch(`${API_BASE}/download/${currentVideo.video_id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tavus_${currentVideo.video_id}.mp4`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download video");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleGenerate();
    }
  };

  const getStatusIcon = () => {
    if (!currentVideo) return null;
    
    switch (currentVideo.status) {
      case "queued":
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case "generating":
        return <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />;
      case "ready":
        return <Check className="text-green-500" size={20} />;
      case "error":
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    if (!currentVideo) return "";
    
    switch (currentVideo.status) {
      case "queued":
        return "Video queued...";
      case "generating":
        return "Generating video...";
      case "ready":
        return "Video ready!";
      case "error":
        return "Generation failed";
      default:
        return currentVideo.status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
          <div className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-medium">Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
                <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 text-xl font-bold leading-none">
                  ×
                </button>
              </div>
            )}

            {/* Avatar Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Choose AI Avatar
              </label>
              <div className="relative">
                <select
                  value={selectedReplica}
                  onChange={(e) => setSelectedReplica(e.target.value)}
                  disabled={loading || generatingVideo}
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-white border-2 border-gray-200 text-sm appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? (
                    <option>Loading avatars...</option>
                  ) : replicas.length === 0 ? (
                    <option>No avatars available</option>
                  ) : (
                    replicas.map((replica) => (
                      <option key={replica.replica_id} value={replica.replica_id}>
                        {replica.replica_name}
                      </option>
                    ))
                  )}
                </select>
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Script Length */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Video Length
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "short", label: "Short", time: "15-20s" },
                  { value: "medium", label: "Medium", time: "30-45s" },
                  { value: "long", label: "Long", time: "60-90s" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setScriptLength(option.value as any)}
                    disabled={generatingVideo}
                    className={`p-3 rounded-xl border-2 transition text-center ${
                      scriptLength === option.value
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="font-semibold text-sm">{option.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{option.time}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Name (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Video Name <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={videoName}
                onChange={(e) => setVideoName(e.target.value)}
                disabled={generatingVideo}
                placeholder="My Amazing Video"
                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed transition"
              />
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Video Topic
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={generatingVideo}
                placeholder="E.g., 'fascinating facts about dolphins', 'benefits of meditation', 'introduction to quantum physics'..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed transition"
              />
              <p className="mt-2 text-xs text-gray-500">
                Describe what you want your AI avatar to talk about. The script will be generated automatically!
              </p>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || !selectedReplica || generatingVideo || loading}
              className="w-full py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 relative active:scale-[0.98]"
            >
              {generatingVideo ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Video size={18} />
                  <span>Generate Video</span>
                  <span className="hidden sm:block absolute right-4 text-xs text-white/70">⌘+Enter</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Video Status Card */}
        {currentVideo && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <div className="space-y-6">
              {/* Status Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon()}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{getStatusText()}</h3>
                    <p className="text-sm text-gray-500">Video ID: {currentVideo.video_id}</p>
                  </div>
                </div>
                {currentVideo.status === "ready" && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold transition"
                  >
                    <Download size={16} />
                    Download
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              {(currentVideo.status === "queued" || currentVideo.status === "generating") && (
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: "75%" }} />
                </div>
              )}

              {/* Generated Script */}
              {generatedScript && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Generated Script:</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{generatedScript}</p>
                </div>
              )}

              {/* Video Preview */}
              {currentVideo.status === "ready" && currentVideo.hosted_url && (
                <div className="bg-black rounded-xl overflow-hidden">
                  <video
                    controls
                    className="w-full"
                    src={currentVideo.hosted_url}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* Loading Animation */}
              {(currentVideo.status === "queued" || currentVideo.status === "generating") && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                  <p className="text-sm text-gray-600">
                    {currentVideo.status === "queued" 
                      ? "Your video is in the queue. This usually takes 1-3 minutes..."
                      : "Generating your video. Almost there..."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}