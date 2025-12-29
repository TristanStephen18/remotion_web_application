import React, { useEffect } from "react";
import { CLOUDINARY_VIDEOS, AUDIO_LIBRARY, CLOUD_UPLOADS } from "../../data/editor_constants";
import { useTheme } from "../../contexts/ThemeContext";
import { useUploadHooks } from "../../hooks/dashboardhooks/UploadHooks";

interface MediaLibraryProps {
  activeTab: "text" | "media" | "audio" | "video";
  projectAssets: any[];
  onAddLayer: (media: any) => void;
  onOpenGallery: (tab: string) => void;
  onAddText: (preset?: 'heading' | 'subheading' | 'body') => void;
  currentFrame: number;
  totalFrames: number;
}

/**
 * MediaLibrary Component with Canva-style Grid Layout
 */
export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  activeTab,
  onAddLayer,
  onOpenGallery,
  onAddText,
}) => {
  const { colors } = useTheme();
  
  const {
    uploads,
    fetchUploads,
    loadingUploads,
  } = useUploadHooks();

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
    
    const mediaObject = {
      id: asset.id,
      name: asset.url.split('/').pop() || 'Uploaded file',
      type: asset.type,
      url: asset.url,
      thumbnail: asset.url,
      preview: asset.url,
    };
    
    onAddLayer(mediaObject);
  };

  // Canva-style grid container
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
    gap: "8px",
    padding: "0",
  };

  // Grid item style
  const gridItemStyle: React.CSSProperties = {
    position: "relative",
    aspectRatio: "1",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    backgroundColor: colors.bgSecondary,
    border: "1px solid rgba(255,255,255,0.05)",
    transition: "all 0.2s ease",
  };

  const uploadButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
    transition: "all 0.2s",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  };

  const sectionHeaderStyle: React.CSSProperties = {
    color: colors.textMuted,
    marginBottom: "12px",
    marginTop: "24px",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  const getUploadedAssetsByType = (type: string) => {
    if (type === 'image') {
      return uploads.filter(upload => 
        upload.type === 'image' || 
        (upload.url && upload.url.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      );
    } else if (type === 'video') {
      return uploads.filter(upload => 
        upload.type === 'video' || 
        (upload.url && upload.url.match(/\.(mp4|mov|webm|avi)$/i))
      );
    } else if (type === 'audio') {
      return uploads.filter(upload => 
        upload.type === 'audio' || 
        (upload.url && upload.url.match(/\.(mp3|wav|aac|ogg)$/i))
      );
    }
    return uploads.filter(upload => upload.type === type);
  };

  // ============================================================================
  // AUDIO TAB (List style - better for audio)
  // ============================================================================
  if (activeTab === "audio") {
    const uploadedAudio = getUploadedAssetsByType('audio');
    
    return (
      <div style={{ padding: "16px", overflowY: "auto", height: "100%" }}>
        <button
          onClick={() => onOpenGallery("audio")}
          style={uploadButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span>📤</span>
          <span>Upload Audio</span>
        </button>

        {loadingUploads ? (
          <div style={{ textAlign: 'center', color: colors.textMuted, padding: '40px 20px' }}>
            Loading uploads...
          </div>
        ) : uploadedAudio.length > 0 ? (
          <>
            <h3 style={sectionHeaderStyle}>My Uploads ({uploadedAudio.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
              {uploadedAudio.map((audio) => (
                <div
                  key={`uploaded-audio-${audio.id}`}
                  onClick={() => handleUploadedAssetClick(audio)}
                  style={{
                    padding: "10px 12px",
                    background: colors.bgSecondary,
                    borderRadius: "6px",
                    cursor: "pointer",
                    border: "1px solid rgba(255,255,255,0.05)",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.bgTertiary;
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.transform = "translateX(2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.bgSecondary;
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div style={{ 
                    color: colors.textPrimary,
                    fontWeight: 500,
                    fontSize: "12px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginBottom: "2px"
                  }}>
                    🎵 {audio.url.split('/').pop()}
                  </div>
                  <div style={{ color: "#10b981", fontSize: "10px", fontWeight: 500 }}>
                    ✓ Uploaded
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}

        <h3 style={sectionHeaderStyle}>Stock Music</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {AUDIO_LIBRARY.stockMusic.map((audio) => (
            <div
              key={audio.id}
              onClick={() => handlePredefinedClick(audio, "audio")}
              style={{
                padding: "10px 12px",
                background: colors.bgSecondary,
                borderRadius: "6px",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.05)",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.bgTertiary;
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.transform = "translateX(2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.bgSecondary;
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div style={{ color: colors.textPrimary, fontWeight: 500, fontSize: "12px", marginBottom: "2px" }}>
                🎵 {audio.name}
              </div>
              <div style={{ color: colors.textMuted, fontSize: "10px" }}>
                {audio.duration}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIDEO TAB - CANVA STYLE GRID
  // ============================================================================
  if (activeTab === "video") {
    const uploadedVideos = getUploadedAssetsByType('video');
    
    return (
      <div style={{ padding: "16px", overflowY: "auto", height: "100%" }}>
        <button
          onClick={() => onOpenGallery("video")}
          style={uploadButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span>📤</span>
          <span>Upload Video</span>
        </button>

        {loadingUploads ? (
          <div style={{ textAlign: 'center', color: colors.textMuted, padding: '40px 20px' }}>
            Loading uploads...
          </div>
        ) : uploadedVideos.length > 0 ? (
          <>
            <h3 style={sectionHeaderStyle}>My Uploads ({uploadedVideos.length})</h3>
            <div style={gridStyle}>
              {uploadedVideos.map((video) => (
                <div
                  key={`uploaded-video-${video.id}`}
                  onClick={() => handleUploadedAssetClick(video)}
                  style={gridItemStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                    e.currentTarget.style.zIndex = "10";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.zIndex = "1";
                  }}
                >
                  <video
                    src={video.url}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {/* Overlay with play icon */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <div style={{
                        width: 0,
                        height: 0,
                        borderLeft: "8px solid #000",
                        borderTop: "5px solid transparent",
                        borderBottom: "5px solid transparent",
                        marginLeft: "2px",
                      }} />
                    </div>
                  </div>
                  {/* Green checkmark badge */}
                  <div style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    background: "#10b981",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                  }}>
                    ✓
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}

        <h3 style={sectionHeaderStyle}>Stock Videos</h3>
        <div style={gridStyle}>
          {[...CLOUDINARY_VIDEOS.backgroundVideos, ...CLOUDINARY_VIDEOS.visualEffects].map((video: any) => ( 
            <div
              key={video.id}
              onClick={() => handlePredefinedClick(video, "video")}
              style={gridItemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                e.currentTarget.style.zIndex = "10";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.zIndex = "1";
              }}
            >
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "24px",
                }}>
                  📹
                </div>
              )}
              {/* Overlay with play icon */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <div style={{
                    width: 0,
                    height: 0,
                    borderLeft: "8px solid #000",
                    borderTop: "5px solid transparent",
                    borderBottom: "5px solid transparent",
                    marginLeft: "2px",
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // IMAGES TAB - CANVA STYLE GRID (Separate from Videos)
  // ============================================================================
  if (activeTab === "media") {
    const uploadedImages = getUploadedAssetsByType('image');
    
    return (
      <div style={{ padding: "16px", overflowY: "auto", height: "100%" }}>
        <button
          onClick={() => onOpenGallery("media")}
          style={uploadButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span>📤</span>
          <span>Upload Image</span>
        </button>

        {loadingUploads ? (
          <div style={{ textAlign: 'center', color: colors.textMuted, padding: '40px 20px' }}>
            Loading uploads...
          </div>
        ) : uploadedImages.length > 0 ? (
          <>
            <h3 style={sectionHeaderStyle}>My Uploads ({uploadedImages.length})</h3>
            <div style={gridStyle}>
              {uploadedImages.map((image) => (
                <div
                  key={`uploaded-image-${image.id}`}
                  onClick={() => handleUploadedAssetClick(image)}
                  style={gridItemStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                    e.currentTarget.style.zIndex = "10";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.zIndex = "1";
                  }}
                >
                  <img
                    src={image.url}
                    alt="Uploaded"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {/* Green checkmark badge */}
                  <div style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    background: "#10b981",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    color: "#fff",
                  }}>
                    ✓
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}

        <h3 style={sectionHeaderStyle}>Stock Images</h3>
        <div style={gridStyle}>
          {CLOUD_UPLOADS.filter(item => item.type === "image").map((image) => (
            <div
              key={image.id}
              onClick={() => handlePredefinedClick(image, "image")}
              style={gridItemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                e.currentTarget.style.zIndex = "10";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.zIndex = "1";
              }}
            >
              {image.thumbnail ? (
                <img
                  src={image.thumbnail}
                  alt={image.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "24px",
                }}>
                  🖼️
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // TEXT TAB - CANVA STYLE
  // ============================================================================
  if (activeTab === "text") {
    const textPresetStyle: React.CSSProperties = {
      padding: '20px 16px',
      background: colors.bgSecondary,
      borderRadius: '8px',
      cursor: 'pointer',
      border: '1px solid rgba(255,255,255,0.05)',
      transition: 'all 0.2s ease',
      marginBottom: '8px',
    };

    return (
      <div style={{ padding: "16px", overflowY: "auto", height: "100%" }}>
        <h3 style={{ ...sectionHeaderStyle, marginTop: 0 }}>Click text to add to page</h3>
        
        {/* Add a text box button */}
        <button
          onClick={() => onAddText('body')}
          style={{
            ...uploadButtonStyle,
            background: 'transparent',
            border: `2px dashed ${colors.textMuted}`,
            color: colors.textPrimary,
            marginBottom: '24px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = colors.textMuted;
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <span style={{ fontSize: '18px' }}>T</span>
          <span>Add a text box</span>
        </button>

        <h3 style={sectionHeaderStyle}>Default text styles</h3>

        {/* Heading Preset */}
        <div
          onClick={() => onAddText('heading')}
          style={textPresetStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.bgTertiary;
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.bgSecondary;
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <span style={{ 
            fontSize: '24px', 
            fontWeight: 700, 
            color: colors.textPrimary,
            fontFamily: 'Inter, sans-serif',
          }}>
            Add a heading
          </span>
        </div>

        {/* Subheading Preset */}
        <div
          onClick={() => onAddText('subheading')}
          style={textPresetStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.bgTertiary;
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.bgSecondary;
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <span style={{ 
            fontSize: '18px', 
            fontWeight: 600, 
            color: colors.textPrimary,
            fontFamily: 'Inter, sans-serif',
          }}>
            Add a subheading
          </span>
        </div>

        {/* Body Text Preset */}
        <div
          onClick={() => onAddText('body')}
          style={textPresetStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.bgTertiary;
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.bgSecondary;
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <span style={{ 
            fontSize: '14px', 
            fontWeight: 400, 
            color: colors.textMuted,
            fontFamily: 'Inter, sans-serif',
          }}>
            Add a little bit of body text
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default MediaLibrary;