import React, { useEffect } from "react";
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
      width="20"
      height="20"
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
// STYLES - CANVA-STYLE
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
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: "600" as const,
    color: "#fff",
    backgroundColor: "#3b82f6",
    border: "none",
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
  // CANVA-STYLE GRID - Responsive, auto-fills based on container width
  mediaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "8px",
  },
  mediaItem: {
    position: "relative" as const,
    aspectRatio: "1",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.05)",
    backgroundColor: "#1a1a1a",
    transition: "all 0.2s ease",
  },
  mediaThumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  },
  playButton: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
    opacity: 0.9,
    transition: "all 0.2s",
  },
  videoOverlay: {
    position: "absolute" as const,
    inset: 0,
    background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7))",
    pointerEvents: "none" as const,
  },
  uploadBadge: {
    position: "absolute" as const,
    top: "6px",
    right: "6px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "600" as const,
    color: "#fff",
  },
  audioItem: {
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
    cursor: "pointer",
    marginBottom: "8px",
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  audioIcon: {
    width: "40px",
    height: "40px",
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
    fontSize: "12px",
    fontWeight: "500" as const,
    color: "#e5e5e5",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: "2px",
  },
  audioDuration: {
    fontSize: "10px",
    color: "#888",
  },
  sectionTitle: {
    fontSize: "11px",
    fontWeight: "600" as const,
    color: "#888",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    marginBottom: "12px",
    marginTop: "20px",
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
  // const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const {
    uploads,
    fetchUploads,
    loadingUploads,
  } = useUploadHooks();

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
                  style={styles.mediaItem}
                  onClick={() => onMediaSelect(item)}
                  onMouseEnter={(e) => {
                    // setHoveredItem(item.id);
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                    e.currentTarget.style.zIndex = "10";
                  }}
                  onMouseLeave={(e) => {
                    // setHoveredItem(null);
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.zIndex = "1";
                  }}
                >
                  {item.thumbnail && (
                    <video
                      src={item.url}
                      style={styles.mediaThumbnail}
                      muted
                    />
                  )}
                  {/* Gradient overlay */}
                  <div style={styles.videoOverlay} />
                  {/* Play button */}
                  <div style={styles.playButton}>
                    <Icons.Play />
                  </div>
                  {/* Upload badge */}
                  <div style={styles.uploadBadge}>✓</div>
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
                  style={styles.mediaItem}
                  onClick={() => onMediaSelect(item)}
                  onMouseEnter={(e) => {
                    // setHoveredItem(item.id);
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                    e.currentTarget.style.zIndex = "10";
                  }}
                  onMouseLeave={(e) => {
                    // setHoveredItem(null);
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.zIndex = "1";
                  }}
                >
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      style={styles.mediaThumbnail}
                    />
                  )}
                  {/* Upload badge */}
                  <div style={styles.uploadBadge}>✓</div>
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
            style={styles.audioItem}
            onClick={() => onMediaSelect(item)}
            onMouseEnter={(e) => {
              // setHoveredItem(item.id);
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "#3b82f6";
              e.currentTarget.style.transform = "translateX(2px)";
            }}
            onMouseLeave={(e) => {
              // setHoveredItem(null);
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <div style={styles.audioIcon}>
              <Icons.Music />
            </div>
            <div style={styles.audioInfo}>
              <div style={styles.audioName}>{item.name}</div>
              {item.duration && <div style={styles.audioDuration}>{item.duration}</div>}
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
            e.currentTarget.style.backgroundColor = "#2563eb";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#3b82f6";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
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