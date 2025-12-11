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
  isMobile?: boolean; // NEW PROP for mobile detection
}

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  Play: ({ size = 20 }: { size?: number }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  Music: ({ size = 16 }: { size?: number }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
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
  Cloud: ({ size = 24 }: { size?: number }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
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
  Refresh: ({ size = 16 }: { size?: number }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
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
// STYLES - RESPONSIVE MOBILE-FIRST
// ============================================================================

const getStyles = (isMobile: boolean = false) => ({
  container: {
    display: "flex",
    flexDirection: "column" as const,
    height: "100%",
    backgroundColor: "#0a0a0a",
  },
  uploadSection: {
    padding: isMobile ? "8px" : "16px", // EXTRA REDUCED: 12px → 8px for mobile
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    gap: isMobile ? "4px" : "8px", // EXTRA REDUCED: 6px → 4px for mobile
  },
  uploadButton: {
    flex: 1,
    padding: isMobile ? "8px 10px" : "14px 16px", // EXTRA REDUCED: 10px 12px → 8px 10px for mobile
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: isMobile ? "4px" : "8px", // EXTRA REDUCED: 6px → 4px for mobile
    fontSize: isMobile ? "11px" : "13px", // EXTRA REDUCED: 12px → 11px for mobile
    fontWeight: "600" as const,
    color: "#fff",
    backgroundColor: "#3b82f6",
    border: "none",
    borderRadius: isMobile ? "5px" : "8px", // EXTRA REDUCED: 6px → 5px for mobile
    cursor: "pointer",
    transition: "all 0.2s",
  },
  refreshButton: {
    width: isMobile ? "32px" : "44px", // EXTRA REDUCED: 36px → 32px for mobile
    padding: isMobile ? "6px" : "12px", // EXTRA REDUCED: 8px → 6px for mobile
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: isMobile ? "11px" : "13px", // EXTRA REDUCED: 12px → 11px for mobile
    fontWeight: "500" as const,
    color: "#888",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: isMobile ? "5px" : "8px", // EXTRA REDUCED: 6px → 5px for mobile
    cursor: "pointer",
    transition: "all 0.2s",
  },
  content: {
    flex: 1,
    overflowY: "auto" as const,
    padding: isMobile ? "8px" : "16px", // EXTRA REDUCED: 12px → 8px for mobile
  },
  emptyState: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: isMobile ? "24px 12px" : "60px 20px", // EXTRA REDUCED: 40px 16px → 24px 12px for mobile
    textAlign: "center" as const,
  },
  emptyIcon: {
    width: isMobile ? "40px" : "72px", // EXTRA REDUCED: 56px → 40px for mobile
    height: isMobile ? "40px" : "72px", // EXTRA REDUCED: 56px → 40px for mobile
    marginBottom: isMobile ? "8px" : "16px", // EXTRA REDUCED: 12px → 8px for mobile
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#444",
  },
  emptyTitle: {
    fontSize: isMobile ? "12px" : "15px", // EXTRA REDUCED: 14px → 12px for mobile
    fontWeight: "600" as const,
    color: "#e5e5e5",
    marginBottom: isMobile ? "4px" : "8px", // EXTRA REDUCED: 6px → 4px for mobile
  },
  emptyDescription: {
    fontSize: isMobile ? "10px" : "12px", // EXTRA REDUCED: 11px → 10px for mobile
    color: "#888",
    lineHeight: "1.5",
  },
  loadingState: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: isMobile ? "20px 12px" : "40px 20px", // EXTRA REDUCED: 32px 16px → 20px 12px for mobile
    textAlign: "center" as const,
    color: "#888",
  },
  // RESPONSIVE GRID - much smaller on mobile
  mediaGrid: {
    display: "grid",
    gridTemplateColumns: isMobile 
      ? "repeat(auto-fill, minmax(85px, 1fr))"  // EXTRA SMALLER: 100px → 85px for mobile
      : "repeat(auto-fill, minmax(140px, 1fr))",
    gap: isMobile ? "4px" : "8px", // EXTRA REDUCED: 6px → 4px for mobile
  },
  mediaItem: {
    position: "relative" as const,
    aspectRatio: "1",
    borderRadius: isMobile ? "4px" : "8px", // EXTRA REDUCED: 6px → 4px for mobile
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
    width: isMobile ? "24px" : "40px", // EXTRA REDUCED: 32px → 24px for mobile
    height: isMobile ? "24px" : "40px", // EXTRA REDUCED: 32px → 24px for mobile
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
    top: isMobile ? "3px" : "6px", // EXTRA REDUCED: 4px → 3px for mobile
    right: isMobile ? "3px" : "6px", // EXTRA REDUCED: 4px → 3px for mobile
    width: isMobile ? "14px" : "20px", // EXTRA REDUCED: 16px → 14px for mobile
    height: isMobile ? "14px" : "20px", // EXTRA REDUCED: 16px → 14px for mobile
    borderRadius: "50%",
    backgroundColor: "#10b981",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: isMobile ? "8px" : "11px", // EXTRA REDUCED: 9px → 8px for mobile
    fontWeight: "600" as const,
    color: "#fff",
  },
  audioItem: {
    padding: isMobile ? "8px" : "12px", // EXTRA REDUCED: 10px → 8px for mobile
    borderRadius: isMobile ? "4px" : "8px", // EXTRA REDUCED: 6px → 4px for mobile
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
    cursor: "pointer",
    marginBottom: isMobile ? "4px" : "8px", // EXTRA REDUCED: 6px → 4px for mobile
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "8px" : "12px", // EXTRA REDUCED: 10px → 8px for mobile
  },
  audioIcon: {
    width: isMobile ? "32px" : "40px", // EXTRA REDUCED: 36px → 32px for mobile
    height: isMobile ? "32px" : "40px", // EXTRA REDUCED: 36px → 32px for mobile
    borderRadius: isMobile ? "4px" : "8px", // EXTRA REDUCED: 6px → 4px for mobile
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
    fontSize: isMobile ? "11px" : "13px", // EXTRA REDUCED: 12px → 11px for mobile
    fontWeight: "500" as const,
    color: "#e5e5e5",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
    marginBottom: "3px",
  },
  audioDuration: {
    fontSize: isMobile ? "9px" : "11px", // EXTRA REDUCED: 10px → 9px for mobile
    color: "#888",
  },
  sectionTitle: {
    fontSize: isMobile ? "10px" : "12px", // EXTRA REDUCED: 11px → 10px for mobile
    fontWeight: "600" as const,
    color: "#888",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    marginBottom: isMobile ? "6px" : "12px", // EXTRA REDUCED: 8px → 6px for mobile
  },
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const MediaPanel: React.FC<MediaPanelProps> = ({
  activeMediaType = "all",
  onMediaSelect,
  onUploadClick,
  isMobile = false, // Default to desktop
}) => {
  const {
    uploads,
    loadingUploads,
    fetchUploads,
  } = useUploadHooks();

  useEffect(() => {
    fetchUploads();
  }, []);

  const styles = getStyles(isMobile); // Get responsive styles

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
          <div style={{ marginBottom: isMobile ? "12px" : "24px" }}>
            <div style={styles.sectionTitle}>Videos ({videos.length})</div>
            <div style={styles.mediaGrid}>
              {videos.map((item) => (
                <div
                  key={item.id}
                  style={styles.mediaItem}
                  onClick={() => onMediaSelect(item)}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.borderColor = "#3b82f6";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                      e.currentTarget.style.zIndex = "10";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.zIndex = "1";
                    }
                  }}
                >
                  {item.thumbnail && (
                    <video
                      src={item.url}
                      style={styles.mediaThumbnail}
                      muted
                    />
                  )}
                  <div style={styles.videoOverlay} />
                  <div style={styles.playButton}>
                    <Icons.Play size={isMobile ? 14 : 20} />
                  </div>
                  <div style={styles.uploadBadge}>✓</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {images.length > 0 && (
          <div style={{ marginBottom: isMobile ? "12px" : "24px" }}>
            <div style={styles.sectionTitle}>Images ({images.length})</div>
            <div style={styles.mediaGrid}>
              {images.map((item) => (
                <div
                  key={item.id}
                  style={styles.mediaItem}
                  onClick={() => onMediaSelect(item)}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.borderColor = "#3b82f6";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                      e.currentTarget.style.zIndex = "10";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.zIndex = "1";
                    }
                  }}
                >
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      style={styles.mediaThumbnail}
                    />
                  )}
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
              if (!isMobile) {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.transform = "translateX(2px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.transform = "translateX(0)";
              }
            }}
          >
            <div style={styles.audioIcon}>
              <Icons.Music size={isMobile ? 12 : 16} />
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
        <Icons.Cloud size={isMobile ? 28 : 40} />
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
      <div style={{ fontSize: isMobile ? "20px" : "32px", marginBottom: isMobile ? "8px" : "16px" }}>⏳</div>
      <div style={{ fontSize: isMobile ? "11px" : "13px" }}>Loading your uploads...</div>
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
          <Icons.Cloud size={isMobile ? 18 : 24} />
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
          <Icons.Refresh size={isMobile ? 12 : 16} />
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
          width: ${isMobile ? "3px" : "6px"};
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