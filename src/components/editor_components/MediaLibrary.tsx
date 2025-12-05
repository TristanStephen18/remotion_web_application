import React from "react";
import { CLOUDINARY_VIDEOS, AUDIO_LIBRARY, CLOUD_UPLOADS } from "../../data/editor_constants";
import { useTheme } from "../../contexts/ThemeContext";

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
 */
export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  activeTab,
  projectAssets,
  onAddLayer,
  onOpenGallery,
  onAddText,
}) => {
  const { colors } = useTheme(); 
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
    onAddLayer(asset);
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

  // Filter uploaded assets by type
  const getUploadedAssets = (type: string) => {
    return projectAssets.filter(asset => {
      if (type === 'audio') return asset.type?.startsWith('audio/');
      if (type === 'video') return asset.type?.startsWith('video/');
      if (type === 'image') return asset.type?.startsWith('image/');
      return false;
    });
  };

  // ============================================================================
  // AUDIO TAB
  // ============================================================================
  if (activeTab === "audio") {
    const uploadedAudio = getUploadedAssets('audio');
    
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
        {uploadedAudio.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={sectionHeaderStyle}>My Uploads ({uploadedAudio.length})</h3>
            {uploadedAudio.map((audio, index) => (
              <div
                key={`uploaded-audio-${index}`}
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
                  🎵 {audio.name}
                </div>
                <div style={{ color: "#10b981", fontSize: "10px", fontWeight: 500 }}>
                  ✓ Uploaded
                </div>
              </div>
            ))}
          </div>
        )}

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
              <div style={{ color: colors.textPrimary,fontWeight: 500, fontSize: "13px", marginBottom: "4px" }}>
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
    const uploadedVideos = getUploadedAssets('video');
    
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
        {uploadedVideos.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={sectionHeaderStyle}>My Uploads ({uploadedVideos.length})</h3>
            {uploadedVideos.map((video, index) => (
              <div
                key={`uploaded-video-${index}`}
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
                {video.preview ? (
                  <div style={{
                    width: "60px",
                    height: "45px",
                    flexShrink: 0,
                    borderRadius: "4px",
                    overflow: "hidden",
                    backgroundColor: "#000"
                  }}>
                    <img 
                      src={video.preview} 
                      alt={video.name}
                      style={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover",
                        display: "block"
                      }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: "60px",
                    height: "45px",
                    flexShrink: 0,
                    borderRadius: "4px",
                    backgroundColor: "#0a0a0a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px"
                  }}>
                    🎬
                  </div>
                )}
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
                    📹 {video.name}
                  </div>
                  <div style={{ color: "#10b981", fontSize: "10px", fontWeight: 500 }}>
                    ✓ Uploaded
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Background Videos */}
        <h3 style={sectionHeaderStyle}>Background Videos</h3>
        
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
          width: "48px", // Slightly smaller to match compact UI
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
    const uploadedImages = getUploadedAssets('image');
    
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
        {uploadedImages.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={sectionHeaderStyle}>My Uploads ({uploadedImages.length})</h3>
            {uploadedImages.map((image, index) => (
              <div
                key={`uploaded-image-${index}`}
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
                {image.preview && (
                  <div style={{
                    width: "60px",
                    height: "60px",
                    flexShrink: 0,
                    borderRadius: "4px",
                    overflow: "hidden",
                    backgroundColor: "#000"
                  }}>
                    <img 
                      src={image.preview} 
                      alt={image.name}
                      style={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover",
                        display: "block"
                      }}
                    />
                  </div>
                )}
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
                    🖼️ {image.name}
                  </div>
                  <div style={{ color: "#10b981", fontSize: "10px", fontWeight: 500 }}>
                    ✓ Uploaded
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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