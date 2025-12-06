import React, { useState, useEffect } from "react";
import { useUploadHooks } from "../../hooks/dashboardhooks/UploadHooks";

// ============================================================================
// TYPES
// ============================================================================

export type MediaType = "image" | "video" | "audio";

export interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  thumbnail?: string;
  url: string;
  duration?: string;
  size?: string;
}

export interface MediaPanelProps {
  activeMediaType?: "image" | "video" | "audio" | "all";
  onMediaSelect: (media: MediaItem) => void;
  onUploadClick: () => void;
}

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  Play: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  Music: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  Image: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  Cloud: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  ),
  Video: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  Refresh: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10"></polyline>
      <polyline points="1 20 1 14 7 14"></polyline>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
  ),
};

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    height: "100%",
    backgroundColor: "#0a0a0a",
  },
  uploadSection: {
    padding: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    gap: "8px",
  },
  uploadButton: {
    flex: 1,
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: "500" as const,
    color: "#e5e5e5",
    backgroundColor: "rgba(59, 130, 246, 0.12)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  refreshButton: {
    width: "44px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "500" as const,
    color: "#888",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  content: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "16px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    textAlign: "center" as const,
  },
  emptyIcon: {
    width: "72px",
    height: "72px",
    marginBottom: "16px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#444",
  },
  emptyTitle: {
    fontSize: "15px",
    fontWeight: "600" as const,
    color: "#e5e5e5",
    marginBottom: "8px",
  },
  emptyDescription: {
    fontSize: "12px",
    color: "#888",
    lineHeight: "1.5",
  },
  loadingState: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    textAlign: "center" as const,
    color: "#888",
  },
  mediaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  mediaItem: {
    position: "relative" as const,
    aspectRatio: "1",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.08)",
    backgroundColor: "#1a1a1a",
    transition: "all 0.2s",
  },
  mediaItemHover: {
    transform: "translateY(-2px)",
    borderColor: "rgba(59, 130, 246, 0.5)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
  },
  mediaThumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  },
  mediaOverlay: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: "10px",
    background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)",
  },
  mediaName: {
    fontSize: "11px",
    fontWeight: "500" as const,
    color: "#fff",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: "2px",
  },
  mediaDuration: {
    fontSize: "9px",
    color: "rgba(255,255,255,0.7)",
  },
  audioItem: {
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    cursor: "pointer",
    marginBottom: "10px",
    transition: "all 0.2s",
  },
  audioItemHover: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(245, 158, 11, 0.4)",
    transform: "translateX(2px)",
  },
  audioContent: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  audioIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#f59e0b",
    flexShrink: 0,
  },
  audioInfo: {
    flex: 1,
    minWidth: 0,
  },
  audioName: {
    fontSize: "13px",
    fontWeight: "500" as const,
    color: "#e5e5e5",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: "4px",
  },
  audioDuration: {
    fontSize: "11px",
    color: "#888",
  },
  playButton: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "rgba(0,0,0,0.75)",
    border: "2px solid rgba(255,255,255,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    opacity: 0,
    transition: "opacity 0.2s",
    paddingLeft: "3px",
  },
  durationBadge: {
    position: "absolute" as const,
    top: "8px",
    right: "8px",
    padding: "3px 8px",
    fontSize: "10px",
    fontWeight: "700" as const,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.85)",
    borderRadius: "4px",
    backdropFilter: "blur(4px)",
  },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: "600" as const,
    color: "#888",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    marginBottom: "12px",
    marginTop: "8px",
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

export const MediaPanel: React.FC<MediaPanelProps> = ({
  activeMediaType = "all",
  onMediaSelect,
  onUploadClick,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Use upload hooks for project uploads
  const {
    uploads,
    fetchUploads,
    loadingUploads,
  } = useUploadHooks();

  // Fetch uploads when component mounts
  useEffect(() => {
    fetchUploads();
  }, []);

  // Convert uploads to MediaItem format and filter by type
  const projectUploads: MediaItem[] = uploads
    .map((upload) => ({
      id: upload.id.toString(),
      name: upload.url.split('/').pop() || 'Uploaded file',
      type: upload.type as MediaType,
      url: upload.url,
      thumbnail: upload.url,
    }))
    .filter((item) => {
      if (activeMediaType === "all") return true;
      if (activeMediaType === "image") {
        return item.type === "image" || 
          item.url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
      }
      if (activeMediaType === "video") {
        return item.type === "video" || 
          item.url.match(/\.(mp4|mov|webm|avi)$/i);
      }
      if (activeMediaType === "audio") {
        return item.type === "audio" || 
          item.url.match(/\.(mp3|wav|aac|ogg)$/i);
      }
      return item.type === activeMediaType;
    });

  const visualMedia = projectUploads.filter((item) => item.type === "image" || item.type === "video");
  const audioMedia = projectUploads.filter((item) => item.type === "audio");

  const handleRefresh = () => {
    fetchUploads();
  };

  const renderVisualMedia = () => {
    if (visualMedia.length === 0) return null;

    const videos = visualMedia.filter(item => item.type === "video");
    const images = visualMedia.filter(item => item.type === "image");

    return (
      <>
        {videos.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <div style={styles.sectionTitle}>Videos ({videos.length})</div>
            <div style={styles.mediaGrid}>
              {videos.map((item) => (
                <div
                  key={item.id}
                  style={{
                    ...styles.mediaItem,
                    ...(hoveredItem === item.id ? styles.mediaItemHover : {}),
                  }}
                  onClick={() => onMediaSelect(item)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {item.thumbnail && (
                    <video
                      src={item.url}
                      style={styles.mediaThumbnail}
                      muted
                    />
                  )}
                  <div
                    style={{
                      ...styles.playButton,
                      ...(hoveredItem === item.id ? { opacity: 1 } : {}),
                    }}
                  >
                    <Icons.Play />
                  </div>
                  {item.duration && (
                    <div style={styles.durationBadge}>{item.duration}</div>
                  )}
                  <div style={styles.mediaOverlay}>
                    <div style={styles.mediaName}>{item.name}</div>
                    {item.duration && <div style={styles.mediaDuration}>{item.duration}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {images.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <div style={styles.sectionTitle}>Images ({images.length})</div>
            <div style={styles.mediaGrid}>
              {images.map((item) => (
                <div
                  key={item.id}
                  style={{
                    ...styles.mediaItem,
                    ...(hoveredItem === item.id ? styles.mediaItemHover : {}),
                  }}
                  onClick={() => onMediaSelect(item)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      style={styles.mediaThumbnail}
                    />
                  )}
                  <div style={styles.mediaOverlay}>
                    <div style={styles.mediaName}>{item.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderAudioMedia = () => {
    if (audioMedia.length === 0) return null;

    return (
      <div>
        <div style={styles.sectionTitle}>Audio ({audioMedia.length})</div>
        {audioMedia.map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.audioItem,
              ...(hoveredItem === item.id ? styles.audioItemHover : {}),
            }}
            onClick={() => onMediaSelect(item)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div style={styles.audioContent}>
              <div style={styles.audioIcon}>
                <Icons.Music />
              </div>
              <div style={styles.audioInfo}>
                <div style={styles.audioName}>{item.name}</div>
                {item.duration && <div style={styles.audioDuration}>{item.duration}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderEmptyState = () => (
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>
        <Icons.Cloud />
      </div>
      <div style={styles.emptyTitle}>
        No uploads yet
      </div>
      <div style={styles.emptyDescription}>
        Click the upload button to add your first file
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div style={styles.loadingState}>
      <div style={{ fontSize: "32px", marginBottom: "16px" }}>⏳</div>
      <div>Loading your uploads...</div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Upload Button */}
      <div style={styles.uploadSection}>
        <button
          style={styles.uploadButton}
          onClick={onUploadClick}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.22)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.12)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Icons.Cloud />
          Upload files
        </button>
        <button
          style={styles.refreshButton}
          onClick={handleRefresh}
          disabled={loadingUploads}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
        >
          <Icons.Refresh />
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {loadingUploads ? (
          renderLoadingState()
        ) : projectUploads.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {renderVisualMedia()}
            {renderAudioMedia()}
          </>
        )}
      </div>

      <style>{`
        div[style*="overflowY: auto"]::-webkit-scrollbar {
          width: 6px;
        }
        div[style*="overflowY: auto"]::-webkit-scrollbar-track {
          background: transparent;
        }
        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 3px;
        }
        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
};

export default MediaPanel;