import React, { useState, useCallback, useEffect } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface MediaGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: 'text' | 'audio' | 'media' | 'video';
  preselectedItem?: any;
  onConfirm: (selectedItem: any) => void;
  replaceMode?: boolean; // NEW: Indicates if we're replacing existing media
  replaceLayerId?: string; // NEW: ID of layer being replaced
}

type SidebarTab = 'home' | 'giphy' | 'viewFiles' | 'addMedia';

interface FilePreview {
  file: File;
  preview: string;
  name: string;
  type: string;
}

// ============================================================================
// MEDIA GALLERY MODAL COMPONENT
// ============================================================================

export const MediaGalleryModal: React.FC<MediaGalleryModalProps> = ({
  isOpen,
  onClose,
  activeTab = 'media',
  onConfirm,
  replaceMode = false,
  replaceLayerId,
}) => {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('addMedia');
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);

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

  // Reset selected files when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFiles([]);
    }
  }, [isOpen]);

  // ============================================================================
  // FILE UPLOAD HANDLING
  // ============================================================================

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      // Filter based on active tab
      if (activeTab === 'audio') {
        return file.type.startsWith('audio/');
      } else if (activeTab === 'video') {
        return file.type.startsWith('video/');
      } else if (activeTab === 'media') {
        return file.type.startsWith('image/');
      }
      return true;
    });
    
    // Create previews for each file
    const newFiles: FilePreview[] = validFiles.map(file => ({
      file,
      name: file.name,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
    }));

    // In replace mode, only allow single file selection
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

  const handleAddToProject = useCallback(() => {
    console.log('🚀 handleAddToProject called, selectedFiles:', selectedFiles.length, 'replaceMode:', replaceMode);
    if (selectedFiles.length > 0) {
      // Convert all files to base64 first
      const processedFiles: any[] = [];
      let processedCount = 0;
      
      selectedFiles.forEach((filePreview, index) => {
        console.log(`📄 Processing file ${index + 1}/${selectedFiles.length}:`, filePreview.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (result) {
            console.log(`✅ File ${index + 1} converted to base64, length:`, (result as string).length);
            const mediaData = {
              name: filePreview.name,
              type: filePreview.type,
              data: result,
              file: filePreview.file,
              preview: filePreview.preview,
              replaceMode,
              replaceLayerId,
            };
            processedFiles.push(mediaData);
          }
          processedCount++;
          
          // When all files are processed, pass them all at once
          if (processedCount === selectedFiles.length) {
            console.log('✅ All files processed, calling onConfirm with', processedFiles.length, 'files');
            if (replaceMode) {
              // In replace mode, only send the first file
              onConfirm(processedFiles[0]);
            } else {
              // In add mode, send all files at once
              onConfirm(processedFiles);
            }
            onClose();
          }
        };
        reader.readAsDataURL(filePreview.file);
      });
    }
  }, [selectedFiles, onConfirm, onClose, replaceMode, replaceLayerId]);

  if (!isOpen) return null;

  const getAcceptedFormats = () => {
    if (activeTab === 'audio') return 'MP3, WAV, AAC, OGG';
    if (activeTab === 'video') return 'MP4, MOV, WEBM, AVI';
    if (activeTab === 'media') return 'JPG, PNG, GIF, WEBP';
    return 'All formats';
  };

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
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    },
    header: {
      padding: '20px 24px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    headerTitle: {
      fontSize: '18px',
      fontWeight: '600' as const,
      color: '#e5e5e5',
    },
    headerTab: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#888',
      fontSize: '13px',
      fontWeight: '500' as const,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    headerTabActive: {
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
      color: '#6366f1',
    },
    closeButton: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#888',
      fontSize: '20px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentArea: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
    },
    sidebar: {
      width: '200px',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column' as const,
      padding: '16px 0',
    },
    sidebarButton: {
      padding: '12px 24px',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#888',
      fontSize: '13px',
      fontWeight: '500' as const,
      cursor: 'pointer',
      textAlign: 'left' as const,
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    sidebarButtonActive: {
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
      color: '#6366f1',
      borderLeft: '3px solid #6366f1',
      paddingLeft: '21px',
    },
    mainArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
    },
    uploadArea: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
    },
    uploadBox: {
      width: '100%',
      maxWidth: '500px',
      padding: '60px 40px',
      border: '2px dashed rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.3s',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
    uploadBoxDragging: {
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.05)',
      transform: 'scale(1.02)',
    },
    uploadIcon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
    uploadTitle: {
      fontSize: '18px',
      fontWeight: '600' as const,
      color: '#e5e5e5',
      marginBottom: '8px',
    },
    uploadSubtitle: {
      fontSize: '14px',
      color: '#888',
      marginBottom: '16px',
    },
    uploadFormats: {
      fontSize: '12px',
      color: '#666',
    },
    previewArea: {
      flex: 1,
      padding: '24px',
      overflowY: 'auto' as const,
    },
    previewGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
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
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: '#e5e5e5',
      fontSize: '11px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    },
    removeButton: {
      position: 'absolute' as const,
      top: '8px',
      right: '8px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      fontSize: '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    fileItem: {
      padding: '16px',
      marginBottom: '12px',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#e5e5e5',
      fontSize: '13px',
    },
    footer: {
      padding: '16px 24px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#0a0a0a',
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
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backgroundColor: 'transparent',
      color: '#e5e5e5',
      fontSize: '13px',
      fontWeight: '500' as const,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    addButton: {
      padding: '10px 24px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#6366f1',
      color: '#fff',
      fontSize: '13px',
      fontWeight: '600' as const,
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
    },
    addButtonDisabled: {
      backgroundColor: '#444',
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={styles.headerTitle}>
              {replaceMode ? `Replace ${activeTab === 'media' ? 'Image' : activeTab === 'video' ? 'Video' : 'Audio'}` : 'Media Library'}
            </span>
          </div>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={styles.contentArea}>
          {/* Sidebar */}
          <div style={styles.sidebar}>
            <button
              style={{
                ...styles.sidebarButton,
                ...(sidebarTab === 'addMedia' ? styles.sidebarButtonActive : {}),
              }}
              onClick={() => setSidebarTab('addMedia')}
              onMouseOver={(e) => {
                if (sidebarTab !== 'addMedia') {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseOut={(e) => {
                if (sidebarTab !== 'addMedia') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>➕</span> {replaceMode ? 'Upload new' : 'Add media'}
            </button>
          </div>

          {/* Main Area */}
          <div style={styles.mainArea}>
            {sidebarTab === 'addMedia' ? (
              <>
                {selectedFiles.length === 0 ? (
                  <div style={styles.uploadArea}>
                    <label htmlFor="file-upload">
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
                    {/* Image Previews Grid */}
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
                        {/* Add more button - only in add mode */}
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
                      // Audio/Video file list
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
                  </div>
                )}
              </>
            ) : (
              <div style={styles.uploadArea}>
                <div style={{ textAlign: 'center', color: '#888' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    {sidebarTab === 'home' && '🏠'}
                    {sidebarTab === 'giphy' && '🎬'}
                    {sidebarTab === 'viewFiles' && '📂'}
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    {sidebarTab === 'home' && 'Home content coming soon'}
                    {sidebarTab === 'giphy' && 'Giphy library coming soon'}
                    {sidebarTab === 'viewFiles' && 'Your files will appear here'}
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            {selectedFiles.length > 0 && (
              <div style={styles.footer}>
                <div style={styles.fileCount}>
                  {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected
                </div>
                <div style={styles.buttonGroup}>
                  <button
                    style={styles.cancelButton}
                    onClick={onClose}
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
                      ...(selectedFiles.length === 0 ? styles.addButtonDisabled : {}),
                    }}
                    onClick={handleAddToProject}
                    disabled={selectedFiles.length === 0}
                    onMouseOver={(e) => {
                      if (selectedFiles.length > 0) {
                        e.currentTarget.style.backgroundColor = '#5558e3';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedFiles.length > 0) {
                        e.currentTarget.style.backgroundColor = '#6366f1';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {replaceMode ? 'Replace' : `Add ${selectedFiles.length} to project`}
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