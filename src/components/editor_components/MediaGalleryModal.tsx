import React, { useState, useCallback, useEffect } from 'react';
import { useFileUpload } from '../../hooks/uploads/HandleImageUpload';
import { useVideoUpload } from '../../hooks/uploads/HandleVideoUploads';
import { useUploadHooks } from '../../hooks/dashboardhooks/UploadHooks';

//lipat mo to sa ennv
const GIPHY_API_KEY = 'O5BtxgjjpsBjF4TAo83JWbPBoBadmqvz';


// ============================================================================
// TYPES
// ============================================================================

interface MediaGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: 'text' | 'audio' | 'media' | 'video';
  preselectedItem?: any;
  onConfirm: (selectedItem: any) => void;
  replaceMode?: boolean;
  replaceLayerId?: string;
  onUploadComplete?: () => void;
}

type SidebarTab = 'home' | 'giphy' | 'viewFiles' | 'addMedia';

interface FilePreview {
  file: File;
  preview: string;
  name: string;
  type: string;
}

// ============================================================================
// MEDIA GALLERY MODAL COMPONENT WITH GIPHY
// ============================================================================

export const MediaGalleryModal: React.FC<MediaGalleryModalProps> = ({
  isOpen,
  onClose,
  activeTab = 'media',
  onConfirm,
  replaceMode = false,
  replaceLayerId,
  onUploadComplete,
}) => {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('addMedia');
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedUploadIds, setSelectedUploadIds] = useState<string[]>([]);

  // Giphy states
  const [giphySearchQuery, setGiphySearchQuery] = useState('');
  const [giphyResults, setGiphyResults] = useState<any[]>([]);
  const [giphyLoading, setGiphyLoading] = useState(false);
  const [selectedGiphyIds, setSelectedGiphyIds] = useState<string[]>([]);

  // Upload hooks
  const imageUpload = useFileUpload({
    type: 'image',
    saveRecord: true,
  });

  const videoUpload = useVideoUpload();

  // Fetch user uploads
  const {
    uploads,
    fetchUploads,
    loadingUploads,
  } = useUploadHooks();

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => {
        if (file.preview.startsWith('blob:')) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [selectedFiles]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFiles([]);
      setSelectedUploadIds([]);
      setSelectedGiphyIds([]);
      fetchUploads();
    }
  }, [isOpen]);

  // Fetch uploads when viewFiles tab is selected
  useEffect(() => {
    if (sidebarTab === 'viewFiles') {
      fetchUploads();
    }
  }, [sidebarTab]);

  // ============================================================================
  // GIPHY FUNCTIONS
  // ============================================================================

  const searchGiphy = useCallback(async (query: string = '') => {
    if (!GIPHY_API_KEY || GIPHY_API_KEY === 'YOUR_GIPHY_API_KEY_HERE') {
      console.error('❌ Please add your Giphy API key!');
      setGiphyResults([]);
      return;
    }

    setGiphyLoading(true);
    try {
      const endpoint = query 
        ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=20&rating=g`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=20&rating=g`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.data) {
        setGiphyResults(data.data);
        console.log('✅ Giphy: Found', data.data.length, 'GIFs');
      }
    } catch (error) {
      console.error('❌ Giphy search failed:', error);
    } finally {
      setGiphyLoading(false);
    }
  }, []);

  // Load trending GIFs when Giphy tab opens
  useEffect(() => {
    if (sidebarTab === 'giphy' && giphyResults.length === 0) {
      searchGiphy();
    }
  }, [sidebarTab, searchGiphy]);

  const handleGiphySelect = useCallback((gifId: string) => {
    setSelectedGiphyIds(prev => {
      if (prev.includes(gifId)) {
        return prev.filter(id => id !== gifId);
      } else {
        if (replaceMode) {
          return [gifId];
        }
        return [...prev, gifId];
      }
    });
  }, [replaceMode]);

  const handleAddSelectedGiphys = useCallback(() => {
    const selectedGifs = giphyResults.filter(gif => 
      selectedGiphyIds.includes(gif.id)
    );

    if (selectedGifs.length === 0) return;

    const mediaData = selectedGifs.map(gif => ({
      id: gif.id,
      name: gif.title || 'Giphy GIF',
      type: 'image', // GIFs are treated as images
      source: gif.images.original.url, // High quality
      url: gif.images.original.url,
      preview: gif.images.fixed_width.url, // Preview
      thumbnail: gif.images.fixed_width_small.url,
      width: parseInt(gif.images.original.width),
      height: parseInt(gif.images.original.height),
      replaceMode,
      replaceLayerId,
    }));

    console.log('✅ Adding selected GIFs:', mediaData.length);
    console.log('📋 First GIF data:', JSON.stringify(mediaData[0], null, 2));
    if (replaceMode) {
      onConfirm(mediaData[0]);
    } else {
      onConfirm(mediaData);
    }
    onClose();
  }, [giphyResults, selectedGiphyIds, onConfirm, onClose, replaceMode, replaceLayerId]);

  // ============================================================================
  // FILE UPLOAD HANDLING
  // ============================================================================

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if (activeTab === 'audio') {
        return file.type.startsWith('audio/');
      } else if (activeTab === 'video') {
        return file.type.startsWith('video/');
      } else if (activeTab === 'media') {
        return file.type.startsWith('image/');
      }
      return true;
    });
    
    const newFiles: FilePreview[] = validFiles.map(file => ({
      file,
      name: file.name,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
    }));

    if (replaceMode) {
      setSelectedFiles([newFiles[0]]);
    } else {
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  }, [activeTab, replaceMode]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles(prev => {
      const file = prev[index];
      if (file.preview.startsWith('blob:')) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleSelectUpload = useCallback((uploadId: string) => {
    setSelectedUploadIds(prev => {
      if (prev.includes(uploadId)) {
        return prev.filter(id => id !== uploadId);
      } else {
        if (replaceMode) {
          return [uploadId];
        }
        return [...prev, uploadId];
      }
    });
  }, [replaceMode]);

  const handleAddSelectedUploads = useCallback(() => {
    const selectedUploads = uploads.filter(upload => 
      selectedUploadIds.includes(upload.id.toString())
    );

    if (selectedUploads.length === 0) return;

    const mediaData = selectedUploads.map(upload => {
      let mediaType = upload.type;
      if (typeof mediaType === 'string') {
        if (mediaType.startsWith('image/') || mediaType === 'image') {
          mediaType = 'image';
        } else if (mediaType.startsWith('video/') || mediaType === 'video') {
          mediaType = 'video';
        } else if (mediaType.startsWith('audio/') || mediaType === 'audio') {
          mediaType = 'audio';
        }
      }
      
      return {
        id: upload.id,
        name: upload.url.split('/').pop() || 'Uploaded file',
        type: mediaType,
        source: upload.url,
        url: upload.url,
        preview: upload.url,
        replaceMode,
        replaceLayerId,
      };
    });

    console.log('✅ Adding selected uploads:', mediaData.length);
    if (replaceMode) {
      onConfirm(mediaData[0]);
    } else {
      onConfirm(mediaData);
    }
    onClose();
  }, [uploads, selectedUploadIds, onConfirm, onClose, replaceMode, replaceLayerId]);

  const handleAddToProject = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    
    setIsProcessing(true);
    console.log('🚀 Starting upload process for', selectedFiles.length, 'files');

    try {
      const uploadedFiles: any[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const filePreview = selectedFiles[i];
        
        console.log(`📤 Uploading file ${i + 1}/${selectedFiles.length}:`, filePreview.name);

        let uploadedUrl: string | null = null;
        let duration: number | undefined;

        if (filePreview.type.startsWith('image/')) {
          uploadedUrl = await imageUpload.uploadFile(filePreview.file);
        } else if (filePreview.type.startsWith('video/')) {
          const result = await videoUpload.uploadVideo(filePreview.file);
          if (result) {
            uploadedUrl = result.url;
            duration = result.duration;
          }
        } else if (filePreview.type.startsWith('audio/')) {
          uploadedUrl = await imageUpload.uploadFile(filePreview.file);
        }

        if (uploadedUrl) {
          console.log('✅ Upload successful:', uploadedUrl);
          
          let mediaType = 'image';
          if (filePreview.type.startsWith('video/')) {
            mediaType = 'video';
          } else if (filePreview.type.startsWith('audio/')) {
            mediaType = 'audio';
          } else if (filePreview.type.startsWith('image/')) {
            mediaType = 'image';
          }
          
          const mediaData = {
            name: filePreview.name,
            type: mediaType,
            source: uploadedUrl,
            url: uploadedUrl,
            preview: filePreview.preview || uploadedUrl,
            duration,
            file: filePreview.file,
            replaceMode,
            replaceLayerId,
          };
          
          uploadedFiles.push(mediaData);
        } else {
          console.error('❌ Upload failed for:', filePreview.name);
        }
      }

      if (onUploadComplete) {
        onUploadComplete();
      }

      if (uploadedFiles.length > 0) {
        console.log('✅ All uploads complete, passing', uploadedFiles.length, 'files to parent');
        if (replaceMode) {
          onConfirm(uploadedFiles[0]);
        } else {
          onConfirm(uploadedFiles);
        }
        onClose();
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFiles, onConfirm, onClose, replaceMode, replaceLayerId, imageUpload, videoUpload, onUploadComplete]);

  if (!isOpen) return null;

  const getAcceptedFormats = () => {
    if (activeTab === 'audio') return 'MP3, WAV, AAC, OGG';
    if (activeTab === 'video') return 'MP4, MOV, WEBM, AVI';
    if (activeTab === 'media') return 'JPG, PNG, GIF, WEBP';
    return 'All formats';
  };

  const getFilteredUploads = () => {
    if (activeTab === 'audio') {
      return uploads.filter(upload => 
        upload.type === 'audio' || 
        upload.url.match(/\.(mp3|wav|aac|ogg)$/i)
      );
    } else if (activeTab === 'video') {
      return uploads.filter(upload => 
        upload.type === 'video' || 
        upload.url.match(/\.(mp4|mov|webm|avi)$/i)
      );
    } else if (activeTab === 'media') {
      return uploads.filter(upload => 
        upload.type === 'image' || 
        upload.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)
      );
    }
    return uploads;
  };

  const filteredUploads = getFilteredUploads();
  const isUploading = imageUpload.isUploading || videoUpload.isUploading || isProcessing;
  const uploadError = imageUpload.error || videoUpload.error;

  // ============================================================================
  // STYLES
  // ============================================================================

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)',
    },
    modal: {
      width: '90%',
      maxWidth: '900px',
      height: '80vh',
      backgroundColor: '#0f0f0f',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
    },
    header: {
      padding: '24px 28px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: '18px',
      fontWeight: 600,
      color: '#e5e5e5',
    },
    closeButton: {
      width: '36px',
      height: '36px',
      borderRadius: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      color: '#888',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    body: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
    },
    sidebar: {
      width: '200px',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    sidebarButton: {
      padding: '12px 16px',
      borderRadius: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      color: '#888',
      fontSize: '13px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'left' as const,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    sidebarButtonActive: {
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      color: '#3b82f6',
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    uploadArea: {
      flex: 1,
      padding: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflowY: 'auto' as const,
    },
    uploadBox: {
      width: '100%',
      maxWidth: '600px',
      padding: '60px 40px',
      border: '2px dashed rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
    uploadBoxDragging: {
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
    },
    uploadIcon: {
      fontSize: '48px',
      marginBottom: '20px',
    },
    uploadTitle: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#e5e5e5',
      marginBottom: '8px',
    },
    uploadSubtitle: {
      fontSize: '13px',
      color: '#888',
      marginBottom: '12px',
    },
    uploadFormats: {
      fontSize: '11px',
      color: '#666',
    },
    previewArea: {
      flex: 1,
      padding: '28px',
      overflowY: 'auto' as const,
    },
    previewGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: '16px',
    },
    previewCard: {
      position: 'relative' as const,
      aspectRatio: '1',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#1a1a1a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    previewImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    },
    previewName: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      padding: '8px',
      fontSize: '11px',
      color: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    removeButton: {
      position: 'absolute' as const,
      top: '6px',
      right: '6px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: 'none',
      color: '#fff',
      fontSize: '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    fileItem: {
      padding: '12px',
      marginBottom: '10px',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '13px',
      color: '#e5e5e5',
    },
    footer: {
      padding: '20px 28px',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    fileCount: {
      fontSize: '13px',
      color: '#888',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
    },
    cancelButton: {
      padding: '10px 20px',
      borderRadius: '8px',
      backgroundColor: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#e5e5e5',
      fontSize: '13px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    addButton: {
      padding: '10px 24px',
      borderRadius: '8px',
      backgroundColor: '#6366f1',
      border: 'none',
      color: '#fff',
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    addButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    errorMessage: {
      marginTop: '12px',
      padding: '12px',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '8px',
      color: '#ef4444',
      fontSize: '12px',
    },
    uploadsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: '16px',
      padding: '20px',
    },
    uploadCard: {
      position: 'relative' as const,
      aspectRatio: '1',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#1a1a1a',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    uploadCardSelected: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)',
    },
    uploadThumbnail: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    },
    uploadOverlay: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      padding: '8px',
      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)',
    },
    uploadName: {
      fontSize: '11px',
      fontWeight: '500' as const,
      color: '#fff',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    selectedBadge: {
      position: 'absolute' as const,
      top: '8px',
      right: '8px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    audioUploadItem: {
      padding: '12px',
      marginBottom: '10px',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    audioUploadItemSelected: {
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    loadingSpinner: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      color: '#888',
    },
    // Giphy-specific styles
    giphyContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
    },
    giphySearch: {
      padding: '20px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    },
    searchInput: {
      width: '100%',
      padding: '12px 16px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      color: '#e5e5e5',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s',
    },
    giphyGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '12px',
      padding: '20px',
      overflowY: 'auto' as const,
      flex: 1,
    },
    giphyItem: {
      position: 'relative' as const,
      aspectRatio: '1',
      borderRadius: '8px',
      overflow: 'hidden',
      cursor: 'pointer',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.2s',
      backgroundColor: '#1a1a1a',
    },
    giphyItemSelected: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)',
    },
    giphyImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    },
    giphyAttribution: {
      padding: '12px 20px',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      textAlign: 'center' as const,
      fontSize: '10px',
      color: '#666',
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>
            {replaceMode ? `Replace ${activeTab}` : `Add ${activeTab}`}
          </h2>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          {/* Sidebar */}
          <div style={styles.sidebar}>
            <button
              style={{
                ...styles.sidebarButton,
                ...(sidebarTab === 'addMedia' ? styles.sidebarButtonActive : {}),
              }}
              onClick={() => setSidebarTab('addMedia')}
            >
              ☁️ Upload Files
            </button>
            <button
              style={{
                ...styles.sidebarButton,
                ...(sidebarTab === 'viewFiles' ? styles.sidebarButtonActive : {}),
              }}
              onClick={() => setSidebarTab('viewFiles')}
            >
              📂 Your Files
            </button>
            <button
              style={{
                ...styles.sidebarButton,
                ...(sidebarTab === 'giphy' ? styles.sidebarButtonActive : {}),
              }}
              onClick={() => setSidebarTab('giphy')}
            >
              🎬 Giphy
            </button>
            <button
              style={{
                ...styles.sidebarButton,
                ...(sidebarTab === 'home' ? styles.sidebarButtonActive : {}),
              }}
              onClick={() => setSidebarTab('home')}
            >
              🏠 Home
            </button>
          </div>

          {/* Content Area */}
          <div style={styles.content}>
            {sidebarTab === 'addMedia' ? (
              <>
                {selectedFiles.length === 0 ? (
                  <div style={styles.uploadArea}>
                    <label htmlFor="file-upload" style={{ width: '100%', maxWidth: '600px' }}>
                      <div
                        style={{
                          ...styles.uploadBox,
                          ...(isDragging ? styles.uploadBoxDragging : {}),
                        }}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                      >
                        <div style={styles.uploadIcon}>☁️</div>
                        <div style={styles.uploadTitle}>
                          {replaceMode ? 'Upload replacement file' : 'Upload files'}
                        </div>
                        <div style={styles.uploadSubtitle}>
                          Drag and drop or click to browse
                        </div>
                        <div style={styles.uploadFormats}>
                          {getAcceptedFormats()}
                        </div>
                        {replaceMode && (
                          <div style={{ marginTop: '12px', fontSize: '11px', color: '#f59e0b' }}>
                            ⚠️ This will replace the current {activeTab === 'media' ? 'image' : activeTab}
                          </div>
                        )}
                      </div>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      multiple={!replaceMode}
                      accept={
                        activeTab === 'audio' ? 'audio/*' :
                        activeTab === 'video' ? 'video/*' :
                        activeTab === 'media' ? 'image/*' : '*'
                      }
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileSelect(e.target.files)}
                    />
                  </div>
                ) : (
                  <div style={styles.previewArea}>
                    {activeTab === 'media' ? (
                      <div style={styles.previewGrid}>
                        {selectedFiles.map((filePreview, index) => (
                          <div
                            key={index}
                            style={styles.previewCard}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <img
                              src={filePreview.preview}
                              alt={filePreview.name}
                              style={styles.previewImage}
                            />
                            <div style={styles.previewName}>
                              {filePreview.name}
                            </div>
                            <button
                              style={styles.removeButton}
                              onClick={() => handleRemoveFile(index)}
                              onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#dc2626';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {!replaceMode && (
                          <label htmlFor="file-upload-more">
                            <div
                              style={{
                                ...styles.previewCard,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px dashed rgba(255, 255, 255, 0.2)',
                                backgroundColor: 'transparent',
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = '#3b82f6';
                                e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <div style={{ textAlign: 'center', color: '#888' }}>
                                <div style={{ fontSize: '24px', marginBottom: '4px' }}>+</div>
                                <div style={{ fontSize: '10px' }}>Add more</div>
                              </div>
                            </div>
                          </label>
                        )}
                        <input
                          id="file-upload-more"
                          type="file"
                          multiple
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileSelect(e.target.files)}
                        />
                      </div>
                    ) : (
                      <div>
                        {selectedFiles.map((filePreview, index) => (
                          <div key={index} style={styles.fileItem}>
                            <span>{filePreview.name}</span>
                            <button
                              style={styles.removeButton}
                              onClick={() => handleRemoveFile(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {uploadError && (
                      <div style={styles.errorMessage}>
                        ❌ Upload failed: {uploadError}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : sidebarTab === 'giphy' ? (
              // GIPHY TAB
              <div style={styles.giphyContainer}>
                {/* Search Bar */}
                <div style={styles.giphySearch}>
                  <input
                    type="text"
                    placeholder="Search Giphy..."
                    value={giphySearchQuery}
                    onChange={(e) => setGiphySearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        searchGiphy(giphySearchQuery);
                      }
                    }}
                    style={styles.searchInput}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                  />
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#666', 
                    marginTop: '8px',
                    textAlign: 'center'
                  }}>
                    {giphySearchQuery ? 'Press Enter to search' : 'Showing trending GIFs'}
                  </div>
                </div>

                {/* GIF Grid */}
                {giphyLoading ? (
                  <div style={styles.loadingSpinner}>
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
                    <div>Loading GIFs...</div>
                  </div>
                ) : !GIPHY_API_KEY || GIPHY_API_KEY === 'YOUR_GIPHY_API_KEY_HERE' ? (
                  <div style={{ textAlign: 'center', color: '#888', padding: '40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔑</div>
                    <div style={{ fontSize: '14px', marginBottom: '8px', color: '#e5e5e5' }}>
                      Giphy API Key Required
                    </div>
                    <div style={{ fontSize: '12px', marginBottom: '16px' }}>
                      Get your free key from developers.giphy.com
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', maxWidth: '300px', margin: '0 auto' }}>
                      Add it to line 11 of this file:<br/>
                      <code style={{ color: '#3b82f6' }}>const GIPHY_API_KEY = 'your_key';</code>
                    </div>
                  </div>
                ) : giphyResults.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#888', padding: '40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
                    <div style={{ fontSize: '14px', marginBottom: '8px', color: '#e5e5e5' }}>
                      No GIFs found
                    </div>
                    <div style={{ fontSize: '12px' }}>
                      Try a different search term
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={styles.giphyGrid}>
                      {giphyResults.map((gif) => (
                        <div
                          key={gif.id}
                          style={{
                            ...styles.giphyItem,
                            ...(selectedGiphyIds.includes(gif.id) 
                              ? styles.giphyItemSelected 
                              : {}),
                          }}
                          onClick={() => handleGiphySelect(gif.id)}
                          onMouseOver={(e) => {
                            if (!selectedGiphyIds.includes(gif.id)) {
                              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                              e.currentTarget.style.transform = 'scale(1.02)';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!selectedGiphyIds.includes(gif.id)) {
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                              e.currentTarget.style.transform = 'scale(1)';
                            }
                          }}
                        >
                          <img
                            src={gif.images.fixed_width.url}
                            alt={gif.title}
                            style={styles.giphyImage}
                          />
                          {selectedGiphyIds.includes(gif.id) && (
                            <div style={styles.selectedBadge}>✓</div>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Giphy Attribution */}
                    <div style={styles.giphyAttribution}>
                      Powered by <a href="https://giphy.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>GIPHY</a>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={styles.uploadArea}>
                {sidebarTab === 'viewFiles' ? (
                  loadingUploads ? (
                    <div style={styles.loadingSpinner}>
                      <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
                      <div>Loading your uploads...</div>
                    </div>
                  ) : filteredUploads.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#888', padding: '40px' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
                      <div style={{ fontSize: '14px', marginBottom: '8px', color: '#e5e5e5' }}>
                        No {activeTab === 'media' ? 'images' : activeTab === 'video' ? 'videos' : 'audio files'} uploaded yet
                      </div>
                      <div style={{ fontSize: '12px' }}>
                        Upload your first file to see it here
                      </div>
                    </div>
                  ) : (
                    <div style={{ flex: 1, overflowY: 'auto', width: '100%' }}>
                      {activeTab === 'audio' ? (
                        <div style={{ padding: '20px' }}>
                          {filteredUploads.map((upload) => (
                            <div
                              key={upload.id}
                              style={{
                                ...styles.audioUploadItem,
                                ...(selectedUploadIds.includes(upload.id.toString()) 
                                  ? styles.audioUploadItemSelected 
                                  : {}),
                              }}
                              onClick={() => handleSelectUpload(upload.id.toString())}
                            >
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#f59e0b',
                                fontSize: '20px',
                              }}>
                                🎵
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: '13px',
                                  fontWeight: '500',
                                  color: '#e5e5e5',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}>
                                  {upload.url.split('/').pop()}
                                </div>
                                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                                  Click to select
                                </div>
                              </div>
                              {selectedUploadIds.includes(upload.id.toString()) && (
                                <div style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  backgroundColor: '#3b82f6',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#fff',
                                  fontSize: '14px',
                                }}>
                                  ✓
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={styles.uploadsGrid}>
                          {filteredUploads.map((upload) => (
                            <div
                              key={upload.id}
                              style={{
                                ...styles.uploadCard,
                                ...(selectedUploadIds.includes(upload.id.toString()) 
                                  ? styles.uploadCardSelected 
                                  : {}),
                              }}
                              onClick={() => handleSelectUpload(upload.id.toString())}
                              onMouseOver={(e) => {
                                if (!selectedUploadIds.includes(upload.id.toString())) {
                                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                                }
                              }}
                              onMouseOut={(e) => {
                                if (!selectedUploadIds.includes(upload.id.toString())) {
                                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                }
                              }}
                            >
                              {activeTab === 'video' ? (
                                <video
                                  src={upload.url}
                                  style={styles.uploadThumbnail}
                                  muted
                                />
                              ) : (
                                <img
                                  src={upload.url}
                                  alt={upload.url.split('/').pop()}
                                  style={styles.uploadThumbnail}
                                />
                              )}
                              {selectedUploadIds.includes(upload.id.toString()) && (
                                <div style={styles.selectedBadge}>✓</div>
                              )}
                              <div style={styles.uploadOverlay}>
                                <div style={styles.uploadName}>
                                  {upload.url.split('/').pop()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div style={{ textAlign: 'center', color: '#888' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
                    <div style={{ fontSize: '14px' }}>Home content coming soon</div>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            {(selectedFiles.length > 0 || selectedUploadIds.length > 0 || selectedGiphyIds.length > 0) && (
              <div style={styles.footer}>
                <div style={styles.fileCount}>
                  {selectedFiles.length > 0 
                    ? `${selectedFiles.length} ${selectedFiles.length === 1 ? 'file' : 'files'} selected`
                    : selectedUploadIds.length > 0
                      ? `${selectedUploadIds.length} ${selectedUploadIds.length === 1 ? 'upload' : 'uploads'} selected`
                      : `${selectedGiphyIds.length} ${selectedGiphyIds.length === 1 ? 'GIF' : 'GIFs'} selected`
                  }
                </div>
                <div style={styles.buttonGroup}>
                  <button
                    style={styles.cancelButton}
                    onClick={onClose}
                    disabled={isUploading}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    style={{
                      ...styles.addButton,
                      ...((selectedFiles.length === 0 && selectedUploadIds.length === 0 && selectedGiphyIds.length === 0) || isUploading 
                        ? styles.addButtonDisabled 
                        : {}),
                    }}
                    onClick={
                      selectedFiles.length > 0 
                        ? handleAddToProject 
                        : selectedUploadIds.length > 0
                          ? handleAddSelectedUploads
                          : handleAddSelectedGiphys
                    }
                    disabled={(selectedFiles.length === 0 && selectedUploadIds.length === 0 && selectedGiphyIds.length === 0) || isUploading}
                    onMouseOver={(e) => {
                      if ((selectedFiles.length > 0 || selectedUploadIds.length > 0 || selectedGiphyIds.length > 0) && !isUploading) {
                        e.currentTarget.style.backgroundColor = '#5558e3';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if ((selectedFiles.length > 0 || selectedUploadIds.length > 0 || selectedGiphyIds.length > 0) && !isUploading) {
                        e.currentTarget.style.backgroundColor = '#6366f1';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {isUploading 
                      ? 'Uploading...' 
                      : replaceMode 
                        ? 'Replace' 
                        : selectedFiles.length > 0
                          ? `Add ${selectedFiles.length} to project`
                          : selectedUploadIds.length > 0
                            ? `Add ${selectedUploadIds.length} to project`
                            : `Add ${selectedGiphyIds.length} to project`
                    }
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaGalleryModal;