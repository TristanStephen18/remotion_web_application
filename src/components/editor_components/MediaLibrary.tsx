import React, { useEffect } from "react";
import { CLOUDINARY_VIDEOS, AUDIO_LIBRARY, CLOUD_UPLOADS } from "../../data/editor_constants";
import { useTheme } from "../../contexts/ThemeContext";
import { useUploadHooks } from "../../hooks/dashboardhooks/UploadHooks";

interface MediaLibraryProps {
  activeTab: "text" | "media" | "audio" | "video";
  projectAssets: any[];
  onAddLayer: (media: any) => void;
  onOpenGallery: (tab: string) => void;
  onAddText: () => void;
  currentFrame: number;
  totalFrames: number;
}

/**
 * MediaLibrary Component with Upload Buttons and Uploaded Files Display
 * Now integrates with useUploadHooks to fetch and display uploaded files
 */
export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  activeTab,
  onAddLayer,
  onOpenGallery,
  onAddText,
}) => {
  const { colors } = useTheme();
  
  // Use upload hooks to fetch uploaded files
  const {
    uploads,
    fetchUploads,
    loadingUploads,
  } = useUploadHooks();

  // Fetch uploads when component mounts
  useEffect(() => {
    fetchUploads();
  }, []);

  const handlePredefinedClick = (item: any, mediaType: "audio" | "video" | "image") => {
    const mediaObject = {
      id: item.id,
      name: item.name,
      type: mediaType,
      url: item.url,
      duration: item.duration,
      thumbnail: item.thumbnail,
    };
    
    console.log('📤 MediaLibrary passing:', mediaObject);
    onAddLayer(mediaObject);
  };

  const handleUploadedAssetClick = (asset: any) => {
    console.log('📤 MediaLibrary passing uploaded asset:', asset);
    
    // Convert the upload format to layer format
    const mediaObject = {
      id: asset.id,
      name: asset.url.split('/').pop() || 'Uploaded file',
      type: asset.type, // 'image' or 'video'
      url: asset.url,
      thumbnail: asset.url, // For images, use URL as thumbnail
      preview: asset.url,
    };
    
    onAddLayer(mediaObject);
  };

  const cardStyle: React.CSSProperties = {
    padding: "12px",
    marginBottom: "8px",
    background: colors.bgSecondary,
    borderRadius: "6px",
    cursor: "pointer",
    border: `1px solid ${colors.borderLight || 'rgba(255,255,255,0.08)'}`,
    transition: "all 0.2s",
  };

  const uploadButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "13px",
    transition: "all 0.2s",
    marginBottom: "16px",
  };

  const sectionHeaderStyle: React.CSSProperties = {
    color: "#888", 
    marginBottom: "12px", 
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "1px"
  };

  // Filter uploaded assets by type from useUploadHooks
  const getUploadedAssetsByType = (type: string) => {
    if (type === 'image') {
      // For images/media tab, only show image types
      return uploads.filter(upload => 
        upload.type === 'image' || 
        (upload.url && (
          upload.url.endsWith('.jpg') || 
          upload.url.endsWith('.jpeg') || 
          upload.url.endsWith('.png') || 
          upload.url.endsWith('.gif') || 
          upload.url.endsWith('.webp') ||
          upload.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        ))
      );
    } else if (type === 'video') {
      // For video tab, only show video types
      return uploads.filter(upload => 
        upload.type === 'video' || 
        (upload.url && (
          upload.url.endsWith('.mp4') || 
          upload.url.endsWith('.mov') || 
          upload.url.endsWith('.webm') || 
          upload.url.endsWith('.avi') ||
          upload.url.match(/\.(mp4|mov|webm|avi)$/i)
        ))
      );
    } else if (type === 'audio') {
      // For audio tab, only show audio types
      return uploads.filter(upload => 
        upload.type === 'audio' || 
        (upload.url && (
          upload.url.endsWith('.mp3') || 
          upload.url.endsWith('.wav') || 
          upload.url.endsWith('.aac') || 
          upload.url.endsWith('.ogg') ||
          upload.url.match(/\.(mp3|wav|aac|ogg)$/i)
        ))
      );
    }
    return uploads.filter(upload => upload.type === type);
  };

  // ============================================================================
  // AUDIO TAB
  // ============================================================================
  if (activeTab === "audio") {
    const uploadedAudio = getUploadedAssetsByType('audio');
    
    return (
      <div style={{ padding: "16px", overflowY: "auto", height: "100%" }}>
        {/* Upload Button */}
        <button
          onClick={() => onOpenGallery("audio")}
          style={uploadButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          📤 Upload Audio File
        </button>

        {/* My Uploads */}
        {loadingUploads ? (
          <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
            Loading uploads...
          </div>
        ) : uploadedAudio.length > 0 ? (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={sectionHeaderStyle}>My Uploads ({uploadedAudio.length})</h3>
            {uploadedAudio.map((audio) => (
              <div
                key={`uploaded-audio-${audio.id}`}
                onClick={() => handleUploadedAssetClick(audio)}
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#252525";
                  e.currentTarget.style.borderColor = "#3b82f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.bgTertiary;
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                <div style={{ 
                  color: "#e5e5e5", 
                  fontWeight: 500, 
                  fontSize: "13px", 
                  marginBottom: "4px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}>
                  🎵 {audio.url.split('/').pop()}
                </div>
                <div style={{ color: "#10b981", fontSize: "10px", fontWeight: 500 }}>
                  ✓ Uploaded
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Stock Music */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={sectionHeaderStyle}>Stock Music</h3>
          
          {AUDIO_LIBRARY.stockMusic.map((audio) => (
            <div
              key={audio.id}
              onClick={() => handlePredefinedClick(audio, "audio")}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.bgHover || 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = "#3b82f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.bgSecondary;
                e.currentTarget.style.borderColor = colors.borderLight || 'rgba(255,255,255,0.08)';
              }}
            >
              <div style={{ color: colors.textPrimary, fontWeight: 500, fontSize: "13px", marginBottom: "4px" }}>
                🎵 {audio.name}
              </div>
              <div style={{ color: colors.textMuted, fontSize: "11px" }}>
                {audio.duration}
              </div>
            </div>
          ))}
        </div>

        {/* Sound Effects */}
        <div>
          <h3 style={sectionHeaderStyle}>Sound Effects</h3>
          
          {AUDIO_LIBRARY.soundEffects.map((sfx) => (
            <div
              key={sfx.id}
              onClick={() => handlePredefinedClick(sfx, "audio")}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.bgHover || 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = "#3b82f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.bgSecondary;
                e.currentTarget.style.borderColor = colors.borderLight || 'rgba(255,255,255,0.08)';
              }}
            >
              <div style={{ color: colors.textPrimary, fontWeight: 500, fontSize: "13px", marginBottom: "4px" }}>
                🔊 {sfx.name}
              </div>
              <div style={{ color: colors.textMuted, fontSize: "11px" }}>
                {sfx.duration}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIDEO TAB
  // ============================================================================
  if (activeTab === "video") {
    const uploadedVideos = getUploadedAssetsByType('video');
    
    return (
      <div style={{ padding: "16px", overflowY: "auto", height: "100%" }}>
        {/* Upload Button */}
        <button
          onClick={() => onOpenGallery("video")}
          style={uploadButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          📤 Upload Video File
        </button>

        {/* My Uploads */}
        {loadingUploads ? (
          <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
            Loading uploads...
          </div>
        ) : uploadedVideos.length > 0 ? (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={sectionHeaderStyle}>My Uploads ({uploadedVideos.length})</h3>
            {uploadedVideos.map((video) => (
              <div
                key={`uploaded-video-${video.id}`}
                onClick={() => handleUploadedAssetClick(video)}
                style={{
                  ...cardStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#252525";
                  e.currentTarget.style.borderColor = "#3b82f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.bgTertiary;
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                <div style={{
                  width: "48px",
                  height: "36px",
                  flexShrink: 0,
                  borderRadius: "4px",
                  overflow: "hidden",
                  backgroundColor: "#000"
                }}>
                  <video 
                    src={video.url} 
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover",
                      display: "block"
                    }}
                  />
                </div>
                <div style={{ 
                  flex: 1, 
                  minWidth: 0,
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    color: "#e5e5e5", 
                    fontWeight: 500, 
                    fontSize: "13px", 
                    marginBottom: "4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    📹 {video.url.split('/').pop()}
                  </div>
                  <div style={{ color: "#10b981", fontSize: "10px", fontWeight: 500 }}>
                    ✓ Uploaded
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Stock Videos */}
        <h3 style={sectionHeaderStyle}>Stock Videos</h3>
        
        {CLOUDINARY_VIDEOS.backgroundVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => handlePredefinedClick(video, "video")}
            style={{
              ...cardStyle,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.bgHover || 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = "#3b82f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.bgSecondary;
              e.currentTarget.style.borderColor = colors.borderLight || 'rgba(255,255,255,0.08)';
            }}
          >
            {video.thumbnail && (
              <img 
                src={video.thumbnail} 
                alt={video.name}
                style={{ 
                  width: "48px",
                  height: "36px", 
                  objectFit: "cover", 
                  borderRadius: "4px",
                  backgroundColor: "#000",
                  border: `1px solid ${colors.borderLight}`
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ color: colors.textPrimary, fontWeight: 500, fontSize: "13px", marginBottom: "2px" }}>
                📹 {video.name}
              </div>
              <div style={{ color: "#666", fontSize: "11px" }}>
                {video.duration}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ============================================================================
  // MEDIA (IMAGES) TAB
  // ============================================================================
  if (activeTab === "media") {
    const uploadedImages = getUploadedAssetsByType('image');
    
    return (
      <div style={{ padding: "16px", overflowY: "auto", height: "100%" }}>
        {/* Upload Button */}
        <button
          onClick={() => onOpenGallery("media")}
          style={uploadButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          📤 Upload Image File
        </button>

        {/* My Uploads */}
        {loadingUploads ? (
          <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
            Loading uploads...
          </div>
        ) : uploadedImages.length > 0 ? (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={sectionHeaderStyle}>My Uploads ({uploadedImages.length})</h3>
            {uploadedImages.map((image) => (
              <div
                key={`uploaded-image-${image.id}`}
                onClick={() => handleUploadedAssetClick(image)}
                style={{
                  ...cardStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#252525";
                  e.currentTarget.style.borderColor = "#3b82f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.bgTertiary;
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                <div style={{
                  width: "60px",
                  height: "60px",
                  flexShrink: 0,
                  borderRadius: "4px",
                  overflow: "hidden",
                  backgroundColor: "#000"
                }}>
                  <img 
                    src={image.url} 
                    alt="Uploaded"
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover",
                      display: "block"
                    }}
                  />
                </div>
                <div style={{ 
                  flex: 1, 
                  minWidth: 0,
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    color: "#e5e5e5", 
                    fontWeight: 500, 
                    fontSize: "13px", 
                    marginBottom: "4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    🖼️ {image.url.split('/').pop()}
                  </div>
                  <div style={{ color: "#10b981", fontSize: "10px", fontWeight: 500 }}>
                    ✓ Uploaded
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Stock Images */}
        <h3 style={sectionHeaderStyle}>Stock Images</h3>
        
        {CLOUD_UPLOADS.filter(item => item.type === "image").map((image) => (
          <div
            key={image.id}
            onClick={() => handlePredefinedClick(image, "image")}
            style={{
              ...cardStyle,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.bgHover || 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = "#3b82f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.bgSecondary;
              e.currentTarget.style.borderColor = colors.borderLight || 'rgba(255,255,255,0.08)';
            }}
          >
            {image.thumbnail && (
              <img 
                src={image.thumbnail} 
                alt={image.name}
                style={{ 
                  width: "60px", 
                  height: "60px", 
                  objectFit: "cover", 
                  borderRadius: "4px",
                  backgroundColor: "#000"
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ color: colors.textPrimary, fontWeight: 500, fontSize: "13px" }}>
                🖼️ {image.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ============================================================================
  // TEXT TAB
  // ============================================================================
  if (activeTab === "text") {
    return (
      <div style={{ padding: "16px" }}>
        <h3 style={sectionHeaderStyle}>Add Text Layer</h3>
        
        <button
          onClick={onAddText}
          style={{
            width: "100%",
            padding: "14px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "13px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          ➕ Add Text Layer
        </button>

        <div style={{ 
          marginTop: "16px", 
          padding: "12px", 
          background: colors.bgTertiary, 
          borderRadius: "6px",
          fontSize: "11px",
          color: "#666"
        }}>
          💡 Click to add a new text layer
        </div>
      </div>
    );
  }

  return null;
};

export default MediaLibrary;