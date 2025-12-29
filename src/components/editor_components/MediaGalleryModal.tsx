import React, { useState, useCallback, useEffect } from 'react';
import { useFileUpload } from '../../hooks/uploads/HandleImageUpload';
import { useVideoUpload } from '../../hooks/uploads/HandleVideoUploads';
import { useUploadHooks } from '../../hooks/dashboardhooks/UploadHooks';

//lipat mo to sa ennv
const GIPHY_API_KEY = 'O5BtxgjjpsBjF4TAo83JWbPBoBadmqvz';
const PEXELS_API_KEY = 'crciZF0CfmUY5TD8TfGOwgLm0MGzcNUqJhDlSSqNBNdXQ15NYKLmDTnx';
const FREESOUND_API_KEY = 'RPEEJeFpRxSepvK0mXJvpcq3KluQaTmglpQylUDp';

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

type SidebarTab = 'home' | 'giphy' | 'pexels' | 'music' | 'sfx' | 'viewFiles' | 'addMedia';

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
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Giphy states
  const [giphySearchQuery, setGiphySearchQuery] = useState('');
  const [giphyResults, setGiphyResults] = useState<any[]>([]);
  const [giphyLoading, setGiphyLoading] = useState(false);
  const [selectedGiphyIds, setSelectedGiphyIds] = useState<string[]>([]);
  
  // Pexels states
  const [pexelsSearchQuery, setPexelsSearchQuery] = useState('');
  const [pexelsResults, setPexelsResults] = useState<any[]>([]);
  const [pexelsLoading, setPexelsLoading] = useState(false);
  const [selectedPexelsIds, setSelectedPexelsIds] = useState<number[]>([]);

  // Pixabay Music states
  const [musicSearchQuery, setMusicSearchQuery] = useState('');
  const [musicResults, setMusicResults] = useState<any[]>([]);
  const [musicLoading, setMusicLoading] = useState(false);
  const [selectedMusicIds, setSelectedMusicIds] = useState<number[]>([]);
  const [playingMusicId, setPlayingMusicId] = useState<number | null>(null);
  
  // Pixabay SFX states
  const [sfxSearchQuery, setSfxSearchQuery] = useState('');
  const [sfxResults, setSfxResults] = useState<any[]>([]);
  const [sfxLoading, setSfxLoading] = useState(false);
  const [selectedSfxIds, setSelectedSfxIds] = useState<number[]>([]);
  const [playingSfxId, setPlayingSfxId] = useState<number | null>(null);
  
  const [isMobile, setIsMobile] = useState(false);

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

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('editor-theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

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
      setSelectedPexelsIds([]);
      setSelectedMusicIds([]);
      setSelectedSfxIds([]);
      setPlayingMusicId(null);
      setPlayingSfxId(null);
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
  // PEXELS FUNCTIONS
  // ============================================================================

  const searchPexels = useCallback(async (query: string = '') => {
    if (!query.trim()) {
      // Load curated photos if no query
      setPexelsLoading(true);
      try {
        const response = await fetch(
          'https://api.pexels.com/v1/curated?per_page=30',
          { headers: { Authorization: PEXELS_API_KEY  as string} }
        );
        const data = await response.json();
        if (data.photos) {
          setPexelsResults(data.photos);
          console.log('✅ Pexels: Loaded', data.photos.length, 'curated photos');
        }
      } catch (error) {
        console.error('❌ Pexels curated failed:', error);
      } finally {
        setPexelsLoading(false);
      }
      return;
    }

    setPexelsLoading(true);
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=30`,
        { headers: { Authorization: PEXELS_API_KEY as string} }
      );
      const data = await response.json();
      if (data.photos) {
        setPexelsResults(data.photos);
        console.log('✅ Pexels: Found', data.photos.length, 'photos');
      }
    } catch (error) {
      console.error('❌ Pexels search failed:', error);
    } finally {
      setPexelsLoading(false);
    }
  }, []);

  // Load curated photos when Pexels tab opens
  useEffect(() => {
    if (sidebarTab === 'pexels' && pexelsResults.length === 0) {
      searchPexels();
    }
  }, [sidebarTab, searchPexels]);

  const handlePexelsSelect = useCallback((photoId: number) => {
    setSelectedPexelsIds(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId);
      } else {
        if (replaceMode) {
          return [photoId];
        }
        return [...prev, photoId];
      }
    });
  }, [replaceMode]);

  const handleAddSelectedPexels = useCallback(() => {
    const selectedPhotos = pexelsResults.filter(photo => 
      selectedPexelsIds.includes(photo.id)
    );

    if (selectedPhotos.length === 0) return;

    const mediaData = selectedPhotos.map(photo => ({
      id: photo.id.toString(),
      name: photo.alt || `Pexels Photo ${photo.id}`,
      type: 'image',
      source: photo.src.large2x || photo.src.large,
      url: photo.src.large2x || photo.src.large,
      preview: photo.src.medium,
      thumbnail: photo.src.small,
      width: photo.width,
      height: photo.height,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      replaceMode,
      replaceLayerId,
    }));

    console.log('✅ Adding selected Pexels photos:', mediaData.length);
    if (replaceMode) {
      onConfirm(mediaData[0]);
    } else {
      onConfirm(mediaData);
    }
    onClose();
  }, [pexelsResults, selectedPexelsIds, onConfirm, onClose, replaceMode, replaceLayerId]);

// ============================================================================
  // PIXABAY MUSIC FUNCTIONS
  // ============================================================================

  const searchMusic = useCallback(async (query: string = '') => {
    setMusicLoading(true);
    try {
      const searchQuery = query.trim() || 'Background';
      const response = await fetch(
        `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(searchQuery)}&filter=duration:[30 TO 300]&fields=id,name,duration,username,previews&page_size=20&token=${FREESOUND_API_KEY}`
      );
      const data = await response.json();
      if (data.results) {
        const tracks = data.results.map((s: any) => ({
          id: s.id,
          tags: s.name,
          duration: Math.round(s.duration),
          user: s.username,
          audio: s.previews?.['preview-hq-mp3'] || s.previews?.['preview-lq-mp3'],
        }));
        setMusicResults(tracks);
      }
    } catch (error) {
      console.error('Freesound search failed:', error);
    } finally {
      setMusicLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sidebarTab === 'music' && musicResults.length === 0) {
      searchMusic();
    }
  }, [sidebarTab, searchMusic]);

  const handleMusicSelect = useCallback((trackId: number) => {
    setSelectedMusicIds(prev => 
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : replaceMode ? [trackId] : [...prev, trackId]
    );
  }, [replaceMode]);

  const handleAddSelectedMusic = useCallback(() => {
    const selectedTracks = musicResults.filter(track => selectedMusicIds.includes(track.id));
    if (selectedTracks.length === 0) return;
    const mediaData = selectedTracks.map(track => ({
      id: track.id.toString(),
      name: track.tags || `Music ${track.id}`,
      type: 'audio',
      source: track.audio,
      url: track.audio,
      preview: track.audio,
      duration: track.duration,
      replaceMode,
      replaceLayerId,
    }));
    console.log('Adding music:', mediaData);
    onConfirm(replaceMode ? mediaData[0] : mediaData);
    onClose();
  }, [musicResults, selectedMusicIds, onConfirm, onClose, replaceMode, replaceLayerId]);

  // ============================================================================
  // PIXABAY SFX FUNCTIONS
  // ============================================================================

 const searchSfx = useCallback(async (query: string = '') => {
    setSfxLoading(true);
    try {
      const searchQuery = query.trim() || 'sound effect';
      const response = await fetch(
        `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(searchQuery)}&filter=duration:[0 TO 10]&fields=id,name,duration,username,previews&page_size=20&token=${FREESOUND_API_KEY}`
      );
      const data = await response.json();
      if (data.results) {
        const effects = data.results.map((s: any) => ({
          id: s.id,
          tags: s.name,
          duration: Math.round(s.duration),
          user: s.username,
          audio: s.previews?.['preview-hq-mp3'] || s.previews?.['preview-lq-mp3'],
        }));
        setSfxResults(effects);
      }
    } catch (error) {
      console.error('Freesound SFX search failed:', error);
    } finally {
      setSfxLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sidebarTab === 'sfx' && sfxResults.length === 0) {
      searchSfx();
    }
  }, [sidebarTab, searchSfx]);

  const handleSfxSelect = useCallback((sfxId: number) => {
    setSelectedSfxIds(prev => 
      prev.includes(sfxId) ? prev.filter(id => id !== sfxId) : replaceMode ? [sfxId] : [...prev, sfxId]
    );
  }, [replaceMode]);

  const handleAddSelectedSfx = useCallback(() => {
    const selectedEffects = sfxResults.filter(sfx => selectedSfxIds.includes(sfx.id));
    if (selectedEffects.length === 0) return;
    const mediaData = selectedEffects.map(sfx => ({
      id: sfx.id.toString(),
      name: sfx.tags?.split(',')[0]?.trim() || `SFX ${sfx.id}`,
      type: 'audio',
      source: sfx.audio,
      url: sfx.audio,
      duration: sfx.duration,
      replaceMode,
      replaceLayerId,
    }));
    onConfirm(replaceMode ? mediaData[0] : mediaData);
    onClose();
  }, [sfxResults, selectedSfxIds, onConfirm, onClose, replaceMode, replaceLayerId]);

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
          const result = await videoUpload.uploadVideo(filePreview.file);
          if (result) {
            uploadedUrl = result.url;
          }
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
  // THEME COLORS
  // ============================================================================

  const colors = {
    light: {
      overlay: 'rgba(0, 0, 0, 0.4)',
      modalBg: '#ffffff',
      border: 'rgba(0, 0, 0, 0.1)',
      title: '#1a1a1a',
      text: '#333333',
      textSecondary: '#666666',
      textTertiary: '#999999',
      buttonHover: 'rgba(0, 0, 0, 0.05)',
      cardBg: '#f5f5f5',
      inputBg: 'rgba(0, 0, 0, 0.05)',
      inputBorder: 'rgba(0, 0, 0, 0.1)',
    },
    dark: {
      overlay: 'rgba(0, 0, 0, 0.8)',
      modalBg: '#0f0f0f',
      border: 'rgba(255, 255, 255, 0.1)',
      title: '#e5e5e5',
      text: '#e5e5e5',
      textSecondary: '#888',
      textTertiary: '#666',
      buttonHover: 'rgba(255, 255, 255, 0.05)',
      cardBg: '#1a1a1a',
      inputBg: 'rgba(255, 255, 255, 0.05)',
      inputBorder: 'rgba(255, 255, 255, 0.1)',
    },
  };

  const c = colors[theme];

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
      backgroundColor: c.overlay,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)',
      padding: isMobile ? '0' : '20px',
    },
    modal: {
      width: isMobile ? '100%' : '90%',
      maxWidth: isMobile ? '100%' : '900px',
      height: isMobile ? '100%' : '80vh',
      backgroundColor: c.modalBg,
      borderRadius: isMobile ? '0' : '16px',
      border: isMobile ? 'none' : `1px solid ${c.border}`,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
    },
    header: {
      padding: isMobile ? '16px' : '24px 28px',
      borderBottom: `1px solid ${c.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0,
    },
    title: {
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: 600,
      color: c.title,
    },
    closeButton: {
      width: isMobile ? '32px' : '36px',
      height: isMobile ? '32px' : '36px',
      borderRadius: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      color: c.textSecondary,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    body: {
      display: 'flex',
      flexDirection: isMobile ? 'column' as const : 'row' as const,
      flex: 1,
      overflow: 'hidden',
    },
    sidebar: {
      width: isMobile ? '100%' : '200px',
      borderRight: isMobile ? 'none' : `1px solid ${c.border}`,
      borderBottom: isMobile ? `1px solid ${c.border}` : 'none',
      padding: isMobile ? '12px' : '16px',
      display: 'flex',
      flexDirection: isMobile ? 'row' as const : 'column' as const,
      gap: '8px',
      overflowX: (isMobile ? 'auto' : 'visible') as 'auto' | 'visible',
      flexShrink: 0,
    },
    sidebarButton: {
      padding: isMobile ? '10px 16px' : '12px 16px',
      borderRadius: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      color: c.textSecondary,
      fontSize: isMobile ? '12px' : '13px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'left' as const,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      whiteSpace: isMobile ? 'nowrap' as const : 'normal' as const,
      flexShrink: isMobile ? 0 : 1,
    },
    sidebarButtonActive: {
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      color: '#3b82f6',
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      minHeight: 0,
      overflow: 'hidden',
    },
    uploadArea: {
      flex: 1,
      padding: isMobile ? '16px' : '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflowY: 'auto' as const,
    },
    uploadBox: {
      width: '100%',
      maxWidth: isMobile ? '100%' : '600px',
      padding: isMobile ? '40px 20px' : '60px 40px',
      border: `2px dashed ${c.border}`,
      borderRadius: '12px',
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: c.inputBg,
    },
    uploadBoxDragging: {
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
    },
    uploadIcon: {
      fontSize: isMobile ? '40px' : '48px',
      marginBottom: isMobile ? '16px' : '20px',
    },
    uploadTitle: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: 600,
      color: c.text,
      marginBottom: '8px',
    },
    uploadSubtitle: {
      fontSize: isMobile ? '12px' : '13px',
      color: c.textSecondary,
      marginBottom: '12px',
    },
    uploadFormats: {
      fontSize: isMobile ? '10px' : '11px',
      color: c.textTertiary,
    },
    previewArea: {
      flex: 1,
      padding: isMobile ? '16px' : '28px',
      overflowY: 'auto' as const,
    },
    previewGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: isMobile ? '12px' : '16px',
    },
    previewCard: {
      position: 'relative' as const,
      aspectRatio: '1',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: c.cardBg,
      border: `1px solid ${c.border}`,
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
      padding: isMobile ? '6px' : '8px',
      fontSize: isMobile ? '10px' : '11px',
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
      width: isMobile ? '28px' : '24px',
      height: isMobile ? '28px' : '24px',
      borderRadius: '50%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: 'none',
      color: '#fff',
      fontSize: isMobile ? '18px' : '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    fileItem: {
      padding: isMobile ? '10px' : '12px',
      marginBottom: '10px',
      backgroundColor: c.inputBg,
      border: `1px solid ${c.border}`,
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: isMobile ? '12px' : '13px',
      color: c.text,
    },
    footer: {
      padding: isMobile ? '16px' : '20px 28px',
      borderTop: `1px solid ${c.border}`,
      display: 'flex',
      flexDirection: isMobile ? 'column' as const : 'row' as const,
      justifyContent: 'space-between',
      alignItems: isMobile ? 'stretch' : 'center',
      gap: isMobile ? '12px' : '0',
      flexShrink: 0,
    },
    fileCount: {
      fontSize: isMobile ? '12px' : '13px',
      color: c.textSecondary,
      textAlign: isMobile ? 'center' as const : 'left' as const,
    },
    buttonGroup: {
      display: 'flex',
      gap: isMobile ? '8px' : '12px',
      width: isMobile ? '100%' : 'auto',
    },
    cancelButton: {
      padding: isMobile ? '12px 20px' : '10px 20px',
      borderRadius: '8px',
      backgroundColor: 'transparent',
      border: `1px solid ${c.border}`,
      color: c.text,
      fontSize: isMobile ? '14px' : '13px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      flex: isMobile ? 1 : 'none',
    },
    addButton: {
      padding: isMobile ? '12px 20px' : '10px 24px',
      borderRadius: '8px',
      backgroundColor: '#6366f1',
      border: 'none',
      color: '#fff',
      fontSize: isMobile ? '14px' : '13px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      flex: isMobile ? 1 : 'none',
    },
    addButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    errorMessage: {
      marginTop: '12px',
      padding: isMobile ? '10px' : '12px',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '8px',
      color: '#ef4444',
      fontSize: isMobile ? '11px' : '12px',
    },
    uploadsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: isMobile ? '12px' : '16px',
      padding: isMobile ? '16px' : '20px',
    },
    uploadCard: {
      position: 'relative' as const,
      aspectRatio: '1',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: c.cardBg,
      border: `2px solid ${c.border}`,
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
      padding: isMobile ? '6px' : '8px',
      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)',
    },
    uploadName: {
      fontSize: isMobile ? '10px' : '11px',
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
      width: isMobile ? '28px' : '24px',
      height: isMobile ? '28px' : '24px',
      borderRadius: '50%',
      backgroundColor: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: isMobile ? '16px' : '14px',
      fontWeight: 'bold',
    },
    audioUploadItem: {
      padding: isMobile ? '10px' : '12px',
      marginBottom: '10px',
      backgroundColor: c.inputBg,
      border: `2px solid ${c.border}`,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '10px' : '12px',
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
      padding: isMobile ? '30px' : '40px',
      color: c.textSecondary,
    },
    giphyContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      flex: 1,
      minHeight: 0,
    },
    giphySearch: {
      padding: isMobile ? '16px' : '20px',
      borderBottom: `1px solid ${c.border}`,
    },
    searchInput: {
      width: '100%',
      padding: isMobile ? '10px 14px' : '12px 16px',
      backgroundColor: c.inputBg,
      border: `1px solid ${c.inputBorder}`,
      borderRadius: '8px',
      color: c.text,
      fontSize: isMobile ? '13px' : '14px',
      outline: 'none',
      transition: 'all 0.2s',
    },
   giphyGrid: {
      columnCount: isMobile ? 2 : 4,
      columnGap: isMobile ? '12px' : '16px',
      padding: isMobile ? '16px' : '20px',
      overflowY: 'auto' as const,
      flex: 1,
    },
    giphyItem: {
      position: 'relative' as const,
      borderRadius: '8px',
      overflow: 'hidden',
      cursor: 'pointer',
      border: `2px solid ${c.border}`,
      transition: 'all 0.2s',
      backgroundColor: c.cardBg,
      marginBottom: isMobile ? '12px' : '16px',
      breakInside: 'avoid' as const,
    },
    giphyItemSelected: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)',
    },
    giphyImage: {
      width: '100%',
      height: 'auto',
      display: 'block',
    },
    giphyAttribution: {
      padding: isMobile ? '10px 16px' : '12px 20px',
      borderTop: `1px solid ${c.border}`,
      textAlign: 'center' as const,
      fontSize: isMobile ? '9px' : '10px',
      color: c.textTertiary,
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
              e.currentTarget.style.backgroundColor = c.buttonHover;
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
                ...(sidebarTab === 'pexels' ? styles.sidebarButtonActive : {}),
              }}
              onClick={() => setSidebarTab('pexels')}
            >
              📷 Pexels
            </button>
            <button
              style={{
                ...styles.sidebarButton,
                ...(sidebarTab === 'music' ? styles.sidebarButtonActive : {}),
              }}
              onClick={() => setSidebarTab('music')}
            >
              🎵 Music
            </button>
            <button
              style={{
                ...styles.sidebarButton,
                ...(sidebarTab === 'sfx' ? styles.sidebarButtonActive : {}),
              }}
              onClick={() => setSidebarTab('sfx')}
            >
              🔊 Sound FX
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
                                border: `2px dashed ${c.border}`,
                                backgroundColor: 'transparent',
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = '#3b82f6';
                                e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = c.border;
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <div style={{ textAlign: 'center', color: c.textSecondary }}>
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
              <div style={styles.giphyContainer}>
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
                      e.currentTarget.style.backgroundColor = theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = c.inputBorder;
                      e.currentTarget.style.backgroundColor = c.inputBg;
                    }}
                  />
                  <div style={{ 
                    fontSize: '11px', 
                    color: c.textTertiary, 
                    marginTop: '8px',
                    textAlign: 'center'
                  }}>
                    {giphySearchQuery ? 'Press Enter to search' : 'Showing trending GIFs'}
                  </div>
                </div>

                {giphyLoading ? (
                  <div style={styles.loadingSpinner}>
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
                    <div>Loading GIFs...</div>
                  </div>
                ) : !GIPHY_API_KEY ? (
                  <div style={{ textAlign: 'center', color: c.textSecondary, padding: '40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔑</div>
                    <div style={{ fontSize: '14px', marginBottom: '8px', color: c.text }}>
                      Giphy API Key Required
                    </div>
                    <div style={{ fontSize: '12px', marginBottom: '16px' }}>
                      Get your free key from developers.giphy.com
                    </div>
                    <div style={{ fontSize: '11px', color: c.textTertiary, maxWidth: '300px', margin: '0 auto' }}>
                      Add it to line 11 of this file:<br/>
                      <code style={{ color: '#3b82f6' }}>const GIPHY_API_KEY = 'your_key';</code>
                    </div>
                  </div>
                ) : giphyResults.length === 0 ? (
                  <div style={{ textAlign: 'center', color: c.textSecondary, padding: '40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
                    <div style={{ fontSize: '14px', marginBottom: '8px', color: c.text }}>
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
                              e.currentTarget.style.borderColor = c.border;
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
                    <div style={styles.giphyAttribution}>
                      Powered by <a href="https://giphy.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>GIPHY</a>
                    </div>
                  </>
                )}
              </div>
            ) : sidebarTab === 'pexels' ? (
              <div style={styles.giphyContainer}>
                <div style={styles.giphySearch}>
                  <input
                    type="text"
                    placeholder="Search free photos..."
                    value={pexelsSearchQuery}
                    onChange={(e) => setPexelsSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        searchPexels(pexelsSearchQuery);
                      }
                    }}
                    style={styles.searchInput}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.backgroundColor = theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = c.inputBorder;
                      e.currentTarget.style.backgroundColor = c.inputBg;
                    }}
                  />
                  <div style={{ 
                    fontSize: '11px', 
                    color: c.textTertiary, 
                    marginTop: '8px',
                    textAlign: 'center'
                  }}>
                    {pexelsSearchQuery ? 'Press Enter to search' : 'Showing curated photos'}
                  </div>
                </div>

                {pexelsLoading ? (
                  <div style={styles.loadingSpinner}>
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
                    <div>Loading photos...</div>
                  </div>
                ) : !PEXELS_API_KEY ? (
                  <div style={{ textAlign: 'center', color: c.textSecondary, padding: '40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔑</div>
                    <div style={{ fontSize: '14px', marginBottom: '8px', color: c.text }}>
                      Pexels API Key Required
                    </div>
                    <div style={{ fontSize: '12px', marginBottom: '16px' }}>
                      Get your free key from pexels.com/api
                    </div>
                    <div style={{ fontSize: '11px', color: c.textTertiary, maxWidth: '300px', margin: '0 auto' }}>
                      Add it to line 8 of this file:<br/>
                      <code style={{ color: '#3b82f6' }}>const PEXELS_API_KEY = 'your_key';</code>
                    </div>
                  </div>
                ) : pexelsResults.length === 0 ? (
                  <div style={{ textAlign: 'center', color: c.textSecondary, padding: '40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📷</div>
                    <div style={{ fontSize: '14px', marginBottom: '8px', color: c.text }}>
                      No photos found
                    </div>
                    <div style={{ fontSize: '12px' }}>
                      Try a different search term
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={styles.giphyGrid}>
                      {pexelsResults.map((photo) => (
                        <div
                          key={photo.id}
                          style={{
                            ...styles.giphyItem,
                            ...(selectedPexelsIds.includes(photo.id) 
                              ? styles.giphyItemSelected 
                              : {}),
                          }}
                          onClick={() => handlePexelsSelect(photo.id)}
                          onMouseOver={(e) => {
                            if (!selectedPexelsIds.includes(photo.id)) {
                              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                              e.currentTarget.style.transform = 'scale(1.02)';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!selectedPexelsIds.includes(photo.id)) {
                              e.currentTarget.style.borderColor = c.border;
                              e.currentTarget.style.transform = 'scale(1)';
                            }
                          }}
                        >
                          <img
                            src={photo.src.medium}
                            alt={photo.alt || 'Pexels photo'}
                            style={styles.giphyImage}
                          />
                          {selectedPexelsIds.includes(photo.id) && (
                            <div style={styles.selectedBadge}>✓</div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div style={styles.giphyAttribution}>
                      Photos by <a href="https://pexels.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>Pexels</a>
                    </div>
                  </>
                )}
              </div>
            ) : sidebarTab === 'music' ? (
              <div style={styles.giphyContainer}>
                <div style={styles.giphySearch}>
                  <input
                    type="text"
                    placeholder="Search music... (happy, cinematic, lofi)"
                    value={musicSearchQuery}
                    onChange={(e) => setMusicSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchMusic(musicSearchQuery)}
                    style={styles.searchInput}
                  />
                </div>
                {musicLoading ? (
                  <div style={styles.loadingSpinner}>⏳ Loading...</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', overflowY: 'auto', flex: 1 }}>
                    {musicResults.map((track) => (
                      <div
                        key={track.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px',
                          backgroundColor: selectedMusicIds.includes(track.id) ? 'rgba(59,130,246,0.2)' : c.inputBg,
                          border: `2px solid ${selectedMusicIds.includes(track.id) ? '#3b82f6' : 'transparent'}`,
                          cursor: 'pointer',
                        }}
                        onClick={() => handleMusicSelect(track.id)}
                      >
                        <button
                          onClick={(e) => {
  e.stopPropagation();
  document.querySelectorAll('audio').forEach(a => a.pause());
  if (playingMusicId === track.id) {
    setPlayingMusicId(null);
  } else {
    setPlayingMusicId(track.id);
    setPlayingSfxId(null);
    const audio = document.getElementById(`audio-${track.id}`) as HTMLAudioElement;
    if (audio) audio.play().catch(() => {});
  }
}}
                          style={{
                            width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                            backgroundColor: playingMusicId === track.id ? '#ef4444' : '#3b82f6',
                            color: '#fff', cursor: 'pointer', fontSize: '14px',
                          }}
                        >
                          {playingMusicId === track.id ? '⏹' : '▶'}
                        </button>
                        <audio id={`audio-${track.id}`} src={track.audio || track.previewURL || track.music} preload="none" />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: c.text }}>{track.tags?.split(',')[0] || 'Track'}</div>
                          <div style={{ fontSize: '11px', color: c.textTertiary }}>{Math.floor(track.duration/60)}:{String(track.duration%60).padStart(2,'0')} • {track.user}</div>
                        </div>
                        {selectedMusicIds.includes(track.id) && <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</div>}
                      </div>
                    ))}
                  </div>
                )}
                <div style={styles.giphyAttribution}>Sounds by <a href="https://freesound.org" target="_blank" style={{ color: '#3b82f6' }}>Freesound</a> • CC Licensed</div>
              </div>
            ) : sidebarTab === 'sfx' ? (
              <div style={styles.giphyContainer}>
                <div style={styles.giphySearch}>
                  <input
                    type="text"
                    placeholder="Search sounds... (whoosh, click, explosion)"
                    value={sfxSearchQuery}
                    onChange={(e) => setSfxSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchSfx(sfxSearchQuery)}
                    style={styles.searchInput}
                  />
                </div>
                {sfxLoading ? (
                  <div style={styles.loadingSpinner}>⏳ Loading...</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', overflowY: 'auto', flex: 1 }}>
                    {sfxResults.map((sfx) => (
                      <div
                        key={sfx.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px',
                          backgroundColor: selectedSfxIds.includes(sfx.id) ? 'rgba(59,130,246,0.2)' : c.inputBg,
                          border: `2px solid ${selectedSfxIds.includes(sfx.id) ? '#3b82f6' : 'transparent'}`,
                          cursor: 'pointer',
                        }}
                        onClick={() => handleSfxSelect(sfx.id)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            document.querySelectorAll('audio').forEach(a => a.pause());
                            if (playingSfxId === sfx.id) {
                              setPlayingSfxId(null);
                            } else {
                              setPlayingSfxId(sfx.id);
                              setPlayingMusicId(null);
                              const audio = document.getElementById(`sfx-${sfx.id}`) as HTMLAudioElement;
if (audio) audio.play().catch(() => {});
                            }
                          }}
                          style={{
                            width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                            backgroundColor: playingSfxId === sfx.id ? '#ef4444' : '#10b981',
                            color: '#fff', cursor: 'pointer', fontSize: '14px',
                          }}
                        >
                          {playingSfxId === sfx.id ? '⏹' : '▶'}
                        </button>
                        <audio id={`sfx-${sfx.id}`} src={sfx.audio} preload="none" />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: c.text }}>{sfx.tags?.split(',')[0] || 'Sound'}</div>
                          <div style={{ fontSize: '11px', color: c.textTertiary }}>{sfx.duration}s • {sfx.user}</div>
                        </div>
                        {selectedSfxIds.includes(sfx.id) && <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</div>}
                      </div>
                    ))}
                  </div>
                )}
                <div style={styles.giphyAttribution}>Sound effects by <a href="https://freesound.org" target="_blank" style={{ color: '#3b82f6' }}>Freesound</a> • CC Licensed</div>
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
                    <div style={{ textAlign: 'center', color: c.textSecondary, padding: '40px' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
                      <div style={{ fontSize: '14px', marginBottom: '8px', color: c.text }}>
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
                                  color: c.text,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}>
                                  {upload.url.split('/').pop()}
                                </div>
                                <div style={{ fontSize: '11px', color: c.textSecondary, marginTop: '4px' }}>
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
                                  e.currentTarget.style.borderColor = c.border;
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
                  <div style={{ textAlign: 'center', color: c.textSecondary }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
                    <div style={{ fontSize: '14px' }}>Home content coming soon</div>
                  </div>
                )}
              </div>
            )}

            {(selectedFiles.length > 0 || selectedUploadIds.length > 0 || selectedGiphyIds.length > 0 || selectedPexelsIds.length > 0 || selectedMusicIds.length > 0 || selectedSfxIds.length > 0) && (
              <div style={styles.footer}>
                <div style={styles.fileCount}>
                  {selectedFiles.length > 0 
                    ? `${selectedFiles.length} ${selectedFiles.length === 1 ? 'file' : 'files'} selected`
                    : selectedUploadIds.length > 0
                      ? `${selectedUploadIds.length} ${selectedUploadIds.length === 1 ? 'upload' : 'uploads'} selected`
                      : selectedGiphyIds.length > 0
                        ? `${selectedGiphyIds.length} ${selectedGiphyIds.length === 1 ? 'GIF' : 'GIFs'} selected`
                        : selectedPexelsIds.length > 0
                          ? `${selectedPexelsIds.length} ${selectedPexelsIds.length === 1 ? 'photo' : 'photos'} selected`
                          : selectedMusicIds.length > 0
                            ? `${selectedMusicIds.length} ${selectedMusicIds.length === 1 ? 'track' : 'tracks'} selected`
                            : `${selectedSfxIds.length} ${selectedSfxIds.length === 1 ? 'sound' : 'sounds'} selected`
                  }
                </div>
                <div style={styles.buttonGroup}>
                  <button
                    style={styles.cancelButton}
                    onClick={onClose}
                    disabled={isUploading}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = c.buttonHover;
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
                      ...((selectedFiles.length === 0 && selectedUploadIds.length === 0 && selectedGiphyIds.length === 0 && selectedPexelsIds.length === 0 && selectedMusicIds.length === 0 && selectedSfxIds.length === 0) || isUploading 
                        ? styles.addButtonDisabled 
                        : {}),
                    }}
                    onClick={
  selectedFiles.length > 0 
    ? handleAddToProject 
    : selectedUploadIds.length > 0
      ? handleAddSelectedUploads
      : selectedGiphyIds.length > 0
        ? handleAddSelectedGiphys
        : selectedPexelsIds.length > 0
          ? handleAddSelectedPexels
          : selectedMusicIds.length > 0
            ? handleAddSelectedMusic
            : handleAddSelectedSfx
}
                    disabled={(selectedFiles.length === 0 && selectedUploadIds.length === 0 && selectedGiphyIds.length === 0 && selectedPexelsIds.length === 0 && selectedMusicIds.length === 0 && selectedSfxIds.length === 0) || isUploading}
                    onMouseOver={(e) => {
                      if ((selectedFiles.length > 0 || selectedUploadIds.length > 0 || selectedGiphyIds.length > 0 || selectedPexelsIds.length > 0 || selectedMusicIds.length > 0 || selectedSfxIds.length > 0) && !isUploading) {
                        e.currentTarget.style.backgroundColor = '#5558e3';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if ((selectedFiles.length > 0 || selectedUploadIds.length > 0 || selectedGiphyIds.length > 0 || selectedPexelsIds.length > 0 || selectedMusicIds.length > 0 || selectedSfxIds.length > 0) && !isUploading) {
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
                            : selectedGiphyIds.length > 0
                              ? `Add ${selectedGiphyIds.length} to project`
                              : selectedPexelsIds.length > 0
                                ? `Add ${selectedPexelsIds.length} to project`
                                : selectedMusicIds.length > 0
                                  ? `Add ${selectedMusicIds.length} to project`
                                  : `Add ${selectedSfxIds.length} to project`
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