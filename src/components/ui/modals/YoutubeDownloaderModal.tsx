import React, { useState } from "react";
import toast from "react-hot-toast";

interface YoutubeDownloaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (data: {
    videoUrl: string;
    title: string;
    duration: number;
  }) => void;
}

export const YoutubeDownloaderModal: React.FC<YoutubeDownloaderModalProps> = ({
  isOpen,
  onClose,
  onDownload,
}) => {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("1080p");
  const [format, setFormat] = useState("mp4");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState<{title: string; thumbnail: string; duration: number} | null>(null);

  const styles: Record<string, React.CSSProperties> = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      backgroundColor: "#1a1a1a",
      borderRadius: "16px",
      width: "100%",
      maxWidth: "500px",
      maxHeight: "90vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    header: {
      padding: "24px 24px 20px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    },
    title: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#e5e5e5",
      margin: "0 0 8px 0",
    },
    subtitle: {
      fontSize: "13px",
      color: "#888",
      margin: 0,
    },
    content: {
      padding: "24px",
      overflowY: "auto" as const,
      flex: 1,
    },
    section: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "13px",
      fontWeight: "600",
      color: "#e5e5e5",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#e5e5e5",
      fontSize: "14px",
      outline: "none",
    },
    select: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#e5e5e5",
      fontSize: "14px",
      outline: "none",
      cursor: "pointer",
    },
    infoBox: {
      padding: "12px 16px",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      border: "1px solid rgba(239, 68, 68, 0.3)",
      borderRadius: "8px",
      color: "#ef4444",
      fontSize: "12px",
      lineHeight: "1.5",
    },
    videoPreview: {
      display: "flex",
      gap: "12px",
      padding: "12px",
      backgroundColor: "#0f0f0f",
      borderRadius: "8px",
      marginBottom: "20px",
    },
    thumbnail: {
      width: "120px",
      height: "90px",
      borderRadius: "6px",
      objectFit: "cover" as const,
      backgroundColor: "#1a1a1a",
    },
    videoDetails: {
      flex: 1,
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center",
    },
    videoTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#e5e5e5",
      marginBottom: "8px",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical" as any,
      overflow: "hidden",
    },
    videoDuration: {
      fontSize: "12px",
      color: "#888",
    },
    qualityGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "8px",
    },
    qualityButton: {
      padding: "12px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#888",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s",
      textAlign: "center" as const,
    },
    qualityButtonActive: {
      backgroundColor: "rgba(239, 68, 68, 0.2)",
      borderColor: "#ef4444",
      color: "#ef4444",
    },
    progressBar: {
      width: "100%",
      height: "6px",
      backgroundColor: "#0f0f0f",
      borderRadius: "3px",
      overflow: "hidden",
      marginBottom: "8px",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#ef4444",
      transition: "width 0.3s ease",
    },
    progressText: {
      fontSize: "12px",
      color: "#888",
      textAlign: "center" as const,
    },
    footer: {
      padding: "16px 24px",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },
    button: {
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      border: "none",
      outline: "none",
    },
    cancelButton: {
      backgroundColor: "transparent",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#888",
    },
    downloadButton: {
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      color: "white",
    },
    downloadingButton: {
      background: "linear-gradient(135deg, #666 0%, #555 100%)",
      cursor: "not-allowed",
      opacity: 0.6,
    },
    fetchButton: {
      padding: "12px 24px",
      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      marginTop: "8px",
    },
  };

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Fetch video info
  const handleFetchInfo = async () => {
    if (!url.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      toast.error("Invalid YouTube URL");
      return;
    }

    try {
      const response = await fetch(`/api/youtube/info?videoId=${videoId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch video info");
      }

      setVideoInfo({
        title: data.title,
        thumbnail: data.thumbnail,
        duration: data.duration,
      });
      toast.success("Video info loaded!");
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch video info");
      setVideoInfo(null);
    }
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      toast.error("Invalid YouTube URL");
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const response = await fetch("/api/youtube/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          quality,
          format,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Download failed");
      }

      // Simulate progress (in real implementation, use SSE or WebSocket)
      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Wait for the download to complete
      await new Promise((resolve) => setTimeout(resolve, 3000));
      clearInterval(progressInterval);
      setDownloadProgress(100);

      // Pass the downloaded video to the editor
      onDownload({
        videoUrl: data.url,
        title: videoInfo?.title || data.title || "Downloaded YouTube Video",
        duration: videoInfo?.duration || data.duration || 120,
      });

      toast.success("Video downloaded successfully!");
      onClose();
      setUrl("");
      setVideoInfo(null);
      setDownloadProgress(0);
    } catch (error: any) {
      toast.error(error.message || "Failed to download video");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>YouTube Downloader</h2>
          <p style={styles.subtitle}>Download videos from YouTube</p>
        </div>

        <div style={styles.content}>
          <div style={styles.section}>
            <label style={styles.label}>YouTube URL *</label>
            <input
              type="text"
              style={styles.input}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={isDownloading}
            />
            <button
              style={styles.fetchButton}
              onClick={handleFetchInfo}
              disabled={isDownloading}
            >
              Fetch Video Info
            </button>
          </div>

          {videoInfo && (
            <div style={styles.videoPreview}>
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                style={styles.thumbnail}
              />
              <div style={styles.videoDetails}>
                <div style={styles.videoTitle}>{videoInfo.title}</div>
                <div style={styles.videoDuration}>
                  Duration: {Math.floor(videoInfo.duration / 60)}:{(videoInfo.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          )}

          <div style={styles.section}>
            <label style={styles.label}>Quality</label>
            <div style={styles.qualityGrid}>
              {["720p", "1080p", "4K"].map((q) => (
                <button
                  key={q}
                  style={{
                    ...styles.qualityButton,
                    ...(quality === q ? styles.qualityButtonActive : {}),
                  }}
                  onClick={() => setQuality(q)}
                  disabled={isDownloading}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Format</label>
            <select
              style={styles.select}
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              disabled={isDownloading}
            >
              <option value="mp4">MP4 (Video)</option>
              <option value="webm">WebM (Video)</option>
              <option value="mp3">MP3 (Audio Only)</option>
            </select>
          </div>

          {isDownloading && (
            <div style={styles.section}>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${downloadProgress}%`,
                  }}
                />
              </div>
              <div style={styles.progressText}>
                Downloading... {downloadProgress}%
              </div>
            </div>
          )}

          <div style={styles.infoBox}>
            ⚠️ Please respect copyright laws and YouTube's Terms of Service. Only download videos you have permission to use.
          </div>
        </div>

        <div style={styles.footer}>
          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={onClose}
            disabled={isDownloading}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.button,
              ...(isDownloading ? styles.downloadingButton : styles.downloadButton),
            }}
            onClick={handleDownload}
            disabled={isDownloading || !videoInfo}
          >
            {isDownloading ? "Downloading..." : "Download Video"}
          </button>
        </div>
      </div>
    </div>
  );
};