import React from 'react';
import type { Layer, VideoLayer, ImageLayer, AudioLayer, RedditCardLayer, RedditStoryLayer } from '../components/remotion_compositions/DynamicLayerComposition';
import { DynamicLayerComposition } from '../components/remotion_compositions/DynamicLayerComposition';
import { MyRedditVideo } from '../components/remotion_compositions/RedditTemplate';
import { generateId } from '../utils/layerHelper';

export interface TemplateDefinition {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  category?: string;
  thumbnailUrl?: string;
  composition: React.FC<any>;
  compositionId: string;
  // Updated to accept layout and sequence
  createDefaultLayers: (layout?: 'layout1' | 'layout2', sequence?: MediaItem[]) => Layer[];
  layersToProps: (layers: Layer[]) => any;
  calculateDuration?: (layers: Layer[]) => number;
}

// Define the MediaItem type for the sequence
export interface MediaItem {
  id: string;
  type: 'video' | 'image';
  src: string;
  duration: number;
}

export const TEMPLATES: Record<number, TemplateDefinition> = {
  1: {
    id: 1,
    name: 'quotetemplate',
    displayName: 'Quote Spotlight',
    description: 'Beautiful quote graphics - Fully Editable!',
    category: 'Text',
    thumbnailUrl: '/template_previews/QuoteSpotlight.mp4',
    composition: DynamicLayerComposition,
    compositionId: 'DynamicLayerComposition',
    
    createDefaultLayers: () => {
  // Check if coming from wizard
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const fromWizard = urlParams.get('fromWizard') === 'true';
    
    if (fromWizard) {
      // Clear persisted layers for template 1 to force fresh creation
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('template-1') || key.includes('editor-layers-1') || key.includes('persisted') && key.includes('1'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log("🧹 Cleared persisted layers for template 1 (fromWizard)");
    }
  }

  // Get config from wizard
  const storedConfig = typeof window !== 'undefined' 
    ? sessionStorage.getItem('quoteVideoConfig') 
    : null;
  
  let config: any = null;
  if (storedConfig) {
    try {
      config = JSON.parse(storedConfig);
      console.log("📦 Template 1 loaded quote config:", config);
    } catch (e) {
      console.error('Failed to parse quote config:', e);
    }
  }

  // Calculate duration (in frames, 30fps)
  const durationSeconds = config?.content?.duration || 9;
  const totalFrames = durationSeconds * 30;
  
  // Determine background layer based on config
  const bgType = config?.background?.type || 'image';
  const bgSrc = bgType === 'video' 
    ? (config?.background?.video || 'https://res.cloudinary.com/dcu9xuof0/image/upload/v1764429657/OIP_fchw6q.png')
    : (config?.background?.image || 'https://res.cloudinary.com/dcu9xuof0/image/upload/v1764429657/OIP_fchw6q.png');
  
  // Animation mapping
  const animationMap: Record<string, any> = {
    fade: { entrance: 'fade', entranceDuration: 60 },
    scale: { entrance: 'scale', entranceDuration: 45 },
    bounce: { entrance: 'bounce', entranceDuration: 60 },
    slideUp: { entrance: 'slideUp', entranceDuration: 45 },
    typewriter: { entrance: 'typewriter', entranceDuration: 90 },
    none: { entrance: 'none', entranceDuration: 0 },
  };
  
  const quoteAnim = animationMap[config?.animation?.quote || 'bounce'];
  const authorAnim = animationMap[config?.animation?.author || 'fade'];
  const markAnim = animationMap[config?.animation?.quotationMark || 'scale'];

  const layers: Layer[] = [];

  // Background layer (image or video)
  if (bgType === 'video') {
    layers.push({
      id: 'background',
      type: 'video',
      name: 'Background',
      startFrame: 0,
      endFrame: totalFrames,
      visible: true,
      locked: false,
      src: bgSrc,
      objectFit: 'cover',
      filter: config?.background?.filter || 'brightness(0.6)',
      position: { x: 50, y: 50 },
      size: { width: 100, height: 100 },
      rotation: 0,
      opacity: 1,
      volume: 0,
      loop: true,
      animation: { entrance: 'fade', entranceDuration: 60 },
    } as VideoLayer);
  } else if (bgType === 'gradient') {
    layers.push({
      id: 'background',
      type: 'image',
      name: 'Background',
      startFrame: 0,
      endFrame: totalFrames,
      visible: true,
      locked: false,
      src: '', 
    isBackground: true,
    gradient: config?.background?.gradient || 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    objectFit: 'cover',
      filter: config?.background?.filter || 'brightness(0.6)',
      position: { x: 50, y: 50 },
      size: { width: 100, height: 100 },
      rotation: 0,
      opacity: 1,
      animation: { entrance: 'fade', entranceDuration: 60 },
    } as ImageLayer);
  } else {
    layers.push({
      id: 'background',
      type: 'image',
      name: 'Background',
      startFrame: 0,
      endFrame: totalFrames,
      visible: true,
      locked: false,
      src: bgSrc,
      isBackground: true,
      objectFit: 'cover',
      filter: config?.background?.filter || 'brightness(0.6)',
      position: { x: 50, y: 50 },
      size: { width: 100, height: 100 },
      rotation: 0,
      opacity: 1,
      animation: { entrance: 'fade', entranceDuration: 60 },
    } as ImageLayer);
  }

  // Quotation Mark layer (optional)
  if (config?.style?.showQuotationMark !== false) {
    layers.push({
      id: 'quote-mark',
      type: 'text',
      name: 'Quotation Mark',
      startFrame: 30,
      endFrame: totalFrames,
      visible: true,
      locked: false,
      content: '"',
      fontFamily: config?.style?.quoteFontFamily || 'Libre Baskerville, Baskerville, Georgia, serif',
      fontSize: config?.style?.quotationMarkSize || 8,
      fontColor: config?.style?.quotationMarkColor || '#FFFFFF',
      fontWeight: '400',
      fontStyle: 'italic',
      textAlign: 'center',
      lineHeight: 0.8,
      position: { x: 50, y: 22 }, 
      size: { width: 15, height: 15 }, 
      rotation: 0,
      opacity: 1,
      animation: markAnim,
    } as Layer);
  }

  // Quote Text layer
  layers.push({
    id: 'quote-text',
    type: 'text',
    name: 'Quote',
    startFrame: 30,
    endFrame: totalFrames,
    visible: true,
    locked: false,
    content: config?.content?.quoteText || 'Life is like riding a bicycle. To keep your balance, you must keep moving.',
    fontFamily: config?.style?.quoteFontFamily || 'Libre Baskerville, Baskerville, Georgia, serif',
    fontSize: config?.style?.quoteFontSize || 4,
    fontColor: config?.style?.quoteFontColor || '#ffffff',
    fontWeight: '400',
    fontStyle: config?.style?.quoteFontStyle || 'italic',
    textAlign: config?.style?.quoteTextAlign || 'center',
    lineHeight: 1.5,
    textShadow: true,
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowBlur: 10,
    position: { x: 50, y: 45 },
    size: { width: 70, height: 30 }, 
    rotation: 0,
    opacity: 1,
    animation: quoteAnim,
  } as Layer);

  // Author Text layer
  const authorContent = config?.content?.authorName 
    ? `— ${config.content.authorName.toUpperCase()}`
    : '— ALBERT EINSTEIN';
  
  layers.push({
    id: 'author-text',
    type: 'text',
    name: 'Author',
    startFrame: Math.floor(totalFrames * 0.6), // Appear at 60% of video
    endFrame: totalFrames,
    visible: true,
    locked: false,
    content: authorContent,
    fontFamily: config?.style?.quoteFontFamily || 'Libre Baskerville, Baskerville, Georgia, serif',
    fontSize: config?.style?.authorFontSize || 2.5,
    fontColor: config?.style?.authorFontColor || '#ffffff',
    fontWeight: '400',
    textAlign: 'center',
    position: { x: 50, y: 80 },
    size: { width: 60, height: 8 }, 
    rotation: 0,
    opacity: 1,
    animation: authorAnim,
  } as Layer);

  // Voiceover audio layer (if enabled)
  if (config?.audio?.enableVoiceover && config?.audio?.voiceoverPath) {
    layers.push({
      id: 'quote-voiceover',
      type: 'audio',
      name: '🎙️ Voiceover',
      startFrame: 30, // Start after intro animation
      endFrame: totalFrames,
      visible: true,
      locked: false,
      src: config.audio.voiceoverPath,
      volume: 1,
    } as AudioLayer);
  }

  // Background music (if enabled)
  if (config?.audio?.backgroundMusicPath && config.audio.backgroundMusicPath !== '') {
    layers.push({
      id: 'quote-bgmusic',
      type: 'audio',
      name: '🎵 Background Music',
      startFrame: 0,
      endFrame: totalFrames,
      visible: true,
      locked: false,
      src: config.audio.backgroundMusicPath,
      volume: config.audio.musicVolume || 0.2,
      loop: true,
    } as AudioLayer);
  }

  console.log("✅ Template 1 layers created:", layers.map(l => l.name));
  return layers;
},
    layersToProps: (layers) => ({ layers }),
    calculateDuration: (layers) => Math.max(...layers.map(l => l.endFrame)),
  },

  2: {
    id: 2,
    name: 'typinganimation',
    displayName: 'Typing Animation',
    description: 'Animated typing effect with cursor',
    category: 'Text',
    thumbnailUrl: '/template_previews/TypingAnimation.mp4',
    composition: DynamicLayerComposition,
    compositionId: 'DynamicLayerComposition',
    createDefaultLayers: () => [
      {
        id: 'background',
        type: 'image',
        name: 'Background',
        startFrame: 0,
        endFrame: 270,
        visible: true,
        locked: false,
        src: 'https://res.cloudinary.com/dnxc1lw18/image/upload/v1760979566/bg11_deliyh.jpg',
        isBackground: true,
        objectFit: 'cover',
        filter: 'brightness(0.4)',
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'fade', entranceDuration: 30 },
      },
      {
        id: 'typing-text',
        type: 'text',
        name: 'Typing Text',
        startFrame: 30,
        endFrame: 270,
        visible: true,
        locked: false,
        content: 'Your text appears here with typing animation',
        fontFamily: 'Courier New, monospace',
        fontSize: 42,
        fontColor: '#00ff00',
        fontWeight: 'normal',
        textAlign: 'left',
        lineHeight: 1.4,
        position: { x: 50, y: 50 },
        size: { width: 80, height: 40 },
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'fade', entranceDuration: 30 },
      },
    ] as Layer[],
    layersToProps: (layers) => ({ layers }),
    calculateDuration: (layers) => Math.max(...layers.map(l => l.endFrame)),
  },

 6: {
    id: 6,
    name: 'splitscreen',
    displayName: 'Split Screen',
    description: 'Split screen or Picture-in-Picture layout',
    category: 'Media',
    thumbnailUrl: '/template_previews/SplitScreen.mp4',
    composition: DynamicLayerComposition,
    compositionId: 'DynamicLayerComposition',
    createDefaultLayers: () => {
      // Check if coming from wizard
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const fromWizard = urlParams.get('fromWizard') === 'true';
        
        if (fromWizard) {
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('template-6') || key.includes('template_6') || key.includes('editor-layers-6'))) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
          console.log("🧹 Cleared persisted layers for template 6 (fromWizard)");
        }
      }

      // Get config from wizard
      const storedConfig = typeof window !== 'undefined' 
        ? sessionStorage.getItem('splitScreenConfig') 
        : null;
      
      let config: any = null;
      if (storedConfig) {
        try {
          config = JSON.parse(storedConfig);
          console.log("📦 Template 6 loaded config:", config);
        } catch (e) {
          console.error('Failed to parse split screen config:', e);
        }
      }

      const totalFrames = config?.totalFrames || 600;
      const layoutType = config?.layoutType || 'split-screen';
      
      let layers: Layer[] = [];

      if (layoutType === 'pic-in-pic') {
        // ==========================================
        // PIC-IN-PIC LAYOUT
        // ==========================================
        const pipPosition = config?.pip?.position || 'bottom-left';
        const pipSize = config?.pip?.size || 30;

        // Calculate PiP position (x, y are center points in percentage)
        let pipX = 50;
        let pipY = 50;
        const margin = 5; // margin from edge in percentage

        switch (pipPosition) {
          case 'top-left':
            pipX = margin + (pipSize / 2);
            pipY = margin + (pipSize / 2);
            break;
          case 'top-right':
            pipX = 100 - margin - (pipSize / 2);
            pipY = margin + (pipSize / 2);
            break;
          case 'bottom-left':
            pipX = margin + (pipSize / 2);
            pipY = 100 - margin - (pipSize / 2);
            break;
          case 'bottom-right':
            pipX = 100 - margin - (pipSize / 2);
            pipY = 100 - margin - (pipSize / 2);
            break;
        }

        // Main video (full screen, behind)
        layers.push({
          id: 'main-video',
          type: 'video',
          name: 'Main Video',
          startFrame: 0,
          endFrame: totalFrames,
          visible: true,
          locked: false,
          src: config?.mainVideo?.src || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          position: { x: 50, y: 50 },
          size: { width: 100, height: 100 },
          rotation: 0,
          opacity: 1,
          volume: config?.mainVideo?.volume ?? 0.5,
          loop: true,
          playbackRate: 1,
          objectFit: 'cover',
          animation: { entrance: 'none', entranceDuration: 0 },
        } as VideoLayer);

        // PiP video (smaller, on top)
        layers.push({
          id: 'pip-video',
          type: 'video',
          name: 'PiP Video',
          startFrame: 0,
          endFrame: totalFrames,
          visible: true,
          locked: false,
          src: config?.pipVideo?.src || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          position: { x: pipX, y: pipY },
          size: { width: pipSize, height: pipSize },
          rotation: 0,
          opacity: 1,
          volume: config?.pipVideo?.volume ?? 0.5,
          loop: true,
          playbackRate: 1,
          objectFit: 'cover',
          animation: { entrance: 'none', entranceDuration: 0 },
          borderRadius: 8,
        } as VideoLayer);

      } else {
        // ==========================================
        // SPLIT SCREEN LAYOUT (default)
        // ==========================================
        const upperPercent = config?.layout?.upperPercent || 50;
        const lowerPercent = config?.layout?.lowerPercent || 50;

        // Calculate positions based on layout
        // Position Y is center of each panel
        const upperY = upperPercent / 2;
        const lowerY = upperPercent + (lowerPercent / 2);

        layers.push({
          id: 'upper-panel',
          type: 'video',
          name: 'Upper Panel',
          startFrame: 0,
          endFrame: totalFrames,
          visible: true,
          locked: false,
          src: config?.upperVideo?.src || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          position: { x: 50, y: upperY },
          size: { width: 100, height: upperPercent },
          rotation: 0,
          opacity: 1,
          volume: config?.upperVideo?.volume ?? 0.5,
          loop: true,
          playbackRate: 1,
          objectFit: 'cover',
          animation: { entrance: 'none', entranceDuration: 0 },
        } as VideoLayer);

        layers.push({
          id: 'lower-panel',
          type: 'video',
          name: 'Lower Panel',
          startFrame: 0,
          endFrame: totalFrames,
          visible: true,
          locked: false,
          src: config?.lowerVideo?.src || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          position: { x: 50, y: lowerY },
          size: { width: 100, height: lowerPercent },
          rotation: 0,
          opacity: 1,
          volume: config?.lowerVideo?.volume ?? 0.5,
          loop: true,
          playbackRate: 1,
          objectFit: 'cover',
          animation: { entrance: 'none', entranceDuration: 0 },
        } as VideoLayer);
      }

      // Clear config after use
      if (typeof window !== 'undefined' && storedConfig) {
        setTimeout(() => {
          sessionStorage.removeItem('splitScreenConfig');
        }, 1000);
      }

      console.log("✅ Template 6 layers created:", layers.map(l => l.name), "Layout:", layoutType);
      return layers;
    },
    layersToProps: (layers) => ({ layers, templateId: 6 }),
    calculateDuration: (layers) => Math.max(...layers.map(l => l.endFrame)),
  },

  // ========================================
  // TEMPLATE 8: BLURRED BACKGROUND STYLE (Updated)
  // ========================================
  8: {
  id: 8,
  name: 'kenburnscarousel',
  displayName: 'Ken Burns Carousel',
  description: 'Photo slideshow with Ken Burns effect',
  category: 'Photo',
  thumbnailUrl: '/template_previews/KenBurnsCarousel.mp4',
  composition: DynamicLayerComposition,
  compositionId: 'DynamicLayerComposition',
  
  createDefaultLayers: () => {
    // Check if coming from wizard
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const fromWizard = urlParams.get('fromWizard') === 'true';
      
      if (fromWizard) {
        // Clear persisted layers for template 8 to force fresh creation
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('template-8') || key.includes('template_8') || key.includes('editor-layers-8'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log("🧹 Cleared persisted layers for template 8 (fromWizard)");
      }
    }

    // Get config from wizard
    const storedConfig = typeof window !== 'undefined' 
      ? sessionStorage.getItem('kenBurnsConfig') 
      : null;
    
    let config: any = null;
    if (storedConfig) {
      try {
        config = JSON.parse(storedConfig);
        console.log("📦 Template 8 loaded Ken Burns config:", config);
      } catch (e) {
        console.error('Failed to parse Ken Burns config:', e);
      }
    }

    // Default images if no wizard config
    const defaultImages = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1080&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1080&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080&q=80',
    ];

    // Use wizard sequence or defaults
    const sequence = config?.sequence || defaultImages.map((src, _i) => ({
      id: generateId(),
      type: 'image' as const,
      src,
      duration: 3,
    }));

    const layout = config?.layout || 'layout1';
    const transitionDuration = config?.transitionDuration || 15;

    // Calculate frames
    let currentFrame = 0;
    const fps = 30;
    const layers: Layer[] = [];

    // For layout2, add background blur layer
    if (layout === 'layout2') {
      // Add a blurred background that spans entire video
      const totalDuration = sequence.reduce((acc: number, item: any) => acc + item.duration, 0);
      const totalFrames = totalDuration * fps;
      
      layers.push({
        id: 'blur-bg',
        type: 'image',
        name: '🔲 Blurred Background',
        startFrame: 0,
        endFrame: totalFrames,
        visible: true,
        locked: true,
        src: sequence[0].src,
        isBackground: true,
        objectFit: 'cover',
        filter: 'blur(30px) brightness(0.5)',
        position: { x: 50, y: 50 },
        size: { width: 120, height: 120 },
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'none', entranceDuration: 0 },
      } as ImageLayer);
    }

    // Create layers for each slide
    sequence.forEach((item: any, index: number) => {
      const durationFrames = item.duration * fps;
      const startFrame = currentFrame;
      const endFrame = currentFrame + durationFrames;

      const isVideo = item.type === 'video';
      
      // Position and size based on layout
      const position = layout === 'layout1' 
        ? { x: 50, y: 50 } 
        : { x: 50, y: 50 };
      
      const size = layout === 'layout1'
        ? { width: 100, height: 100 }
        : { width: 80, height: 60 };

      const objectFit = layout === 'layout1' ? 'cover' : 'contain';

      if (isVideo) {
        layers.push({
          id: `slide-${index}`,
          type: 'video',
          name: `📹 Slide ${index + 1}`,
          startFrame,
          endFrame,
          visible: true,
          locked: false,
          src: item.src,
          objectFit,
          position,
          size,
          rotation: 0,
          opacity: 1,
          volume: 0,
          loop: false,
          animation: {
            entrance: 'fade',
            entranceDuration: transitionDuration,
            exit: 'fade',
            exitDuration: transitionDuration,
          },
          // Ken Burns effect - slight zoom and pan
          kenBurns: {
            enabled: true,
            startScale: 1.0,
            endScale: 1.15,
            startPosition: { x: 50, y: 50 },
            endPosition: { x: 48 + (index % 2) * 4, y: 48 + (index % 2) * 4 },
          },
        } as VideoLayer);
      } else {
        layers.push({
          id: `slide-${index}`,
          type: 'image',
          name: `🖼️ Slide ${index + 1}`,
          startFrame,
          endFrame,
          visible: true,
          locked: false,
          src: item.src,
          isBackground: false,
          objectFit,
          position,
          size,
          rotation: 0,
          opacity: 1,
          animation: {
            entrance: 'fade',
            entranceDuration: transitionDuration,
            exit: 'fade',
            exitDuration: transitionDuration,
          },
          // Ken Burns effect
          kenBurns: {
            enabled: true,
            startScale: 1.0,
            endScale: 1.15,
            startPosition: { x: 50, y: 50 },
            endPosition: { x: 48 + (index % 2) * 4, y: 48 + (index % 2) * 4 },
          },
        } as ImageLayer);
      }

      currentFrame = endFrame;
    });

    // Add background music if configured
    if (config?.audio?.backgroundMusicPath && config.audio.backgroundMusicPath !== '') {
      const totalDuration = sequence.reduce((acc: number, item: any) => acc + item.duration, 0);
      const totalFrames = totalDuration * fps;

      layers.push({
        id: 'bg-music',
        type: 'audio',
        name: '🎵 Background Music',
        startFrame: 0,
        endFrame: totalFrames,
        visible: true,
        locked: false,
        src: config.audio.backgroundMusicPath,
        volume: config.audio.musicVolume || 0.3,
        loop: true,
      } as AudioLayer);
    }

    console.log("✅ Template 8 layers created:", layers.map(l => l.name));
    return layers;
  },
  
  layersToProps: (layers) => ({ layers }),
  calculateDuration: (layers) => Math.max(...layers.map(l => l.endFrame)),
},


 9: {
  id: 9,
  name: 'fakechat',
  displayName: 'Fake Text Conversation',
  description: 'Realistic messaging conversations (IG, iMessage, WhatsApp)',
  category: 'Social',
  thumbnailUrl: '', 
  composition: DynamicLayerComposition,
  compositionId: 'DynamicLayerComposition',
  
  createDefaultLayers: () => {
    // Check if coming from wizard
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const fromWizard = urlParams.get('fromWizard') === 'true';
      
      if (fromWizard) {
        console.log("🧹 Clearing persisted layers for template 9 (fromWizard)");
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.includes('template-9') ||
            key.includes('template9') ||
            key.includes('fakechat') ||
            key.includes('editor_state_') && key.includes('9')
          )) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => {
          console.log("  Removing:", key);
          localStorage.removeItem(key);
        });
        
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('fromWizard');
        newUrl.searchParams.delete('t');
        window.history.replaceState({}, '', newUrl.toString());
      }
    }

    // Get wizard config
    const storedConfig = typeof window !== 'undefined' 
      ? sessionStorage.getItem('fakeChatConfig') 
      : null;
    
    let config: any = null;
    if (storedConfig) {
      try {
        config = JSON.parse(storedConfig);
        console.log("📦 Template 9 loaded fake chat config:", config);
      } catch (e) {
        console.error('Failed to parse fake chat config:', e);
      }
    }

    // Defaults
    const chatStyle = config?.chatStyle || 'fakechatconversation';
    const senderName = config?.senderName || 'Sarah_Smith';
    const senderAvatarUrl = config?.senderAvatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100';
    const receiverAvatarUrl = config?.receiverAvatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100';
    const backgroundVideoUrl = config?.backgroundVideoUrl || 'https://res.cloudinary.com/dcu9xuof0/video/upload/v1765260195/Subway_Surfers_2024_-_Gameplay_4K_9x16_No_Copyright_n4ym8w.mp4';
    const backgroundOpacity = config?.backgroundOpacity || 0.4;
    const totalFrames = config?.totalFrames || 300;

    const layers: any[] = [];

    // Background Video Layer
    layers.push({
      id: 'chat-bg',
      type: 'video',
      name: 'Background Video',
      startFrame: 0,
      endFrame: totalFrames,
      visible: true,
      locked: false,
      src: backgroundVideoUrl,
      position: { x: 50, y: 50 },
      size: { width: 100, height: 100 },
      rotation: 0,
      opacity: backgroundOpacity,
      volume: 0,
      loop: true,
      playbackRate: 1,
      objectFit: 'cover',
      filter: 'brightness(0.5)',
    });

    // Create message layers from config
    if (config?.messages && config.messages.length > 0) {
      let currentFrame = 0;
      
      config.messages.forEach((msg: any, index: number) => {
        currentFrame += msg.delay || 30;
        
        if (!msg.isTyping) {
          // Regular message (skip typing indicators)
          layers.push({
            id: `msg-${index}`,
            type: 'chat-bubble',
            name: msg.isSender ? `Me: ${msg.message.substring(0, 15)}...` : `Them: ${msg.message.substring(0, 15)}...`,
            startFrame: msg.startFrame ?? currentFrame,
            endFrame: msg.endFrame ?? totalFrames,
            visible: true,
            locked: false,
            message: msg.message,
            isSender: msg.isSender,
            chatStyle: chatStyle,
            senderName: senderName,
            avatarUrl: msg.isSender ? senderAvatarUrl : receiverAvatarUrl,
            position: msg.position || { x: msg.isSender ? 65 : 35, y: 25 + (index * 12) },
            size: { width: 45, height: 8 },
            rotation: 0,
            opacity: 1,
            animation: { entrance: 'slideUp', entranceDuration: 20 },
          });
        }
      });
    } else {
      // Default messages if no config
      layers.push(
        {
          id: 'msg-1',
          type: 'chat-bubble',
          name: 'Them: Hello',
          startFrame: 10,
          endFrame: totalFrames,
          visible: true,
          locked: false,
          message: "Hey! Did you see the new update?",
          isSender: false,
          chatStyle: chatStyle,
          senderName: senderName,
          avatarUrl: receiverAvatarUrl,
          position: { x: 35, y: 25 },
          size: { width: 45, height: 8 },
          rotation: 0,
          opacity: 1,
          animation: { entrance: 'slideUp', entranceDuration: 20 },
        },
        {
          id: 'msg-3',
          type: 'chat-bubble',
          name: 'Me: Reply',
          startFrame: 70,
          endFrame: totalFrames,
          visible: true,
          locked: false,
          message: "Yeah, it looks exactly like the real thing now! 🔥",
          isSender: true,
          chatStyle: chatStyle,
          senderName: senderName,
          avatarUrl: senderAvatarUrl,
          position: { x: 65, y: 37 },
          size: { width: 48, height: 8 },
          rotation: 0,
          opacity: 1,
          animation: { entrance: 'slideUp', entranceDuration: 20 },
        }
      );
    }

    // Background Music Layer (if configured)
    if (config?.backgroundMusicPath && config.backgroundMusicPath !== '') {
      layers.push({
        id: 'chat-audio',
        type: 'audio',
        name: 'Background Music',
        startFrame: 0,
        endFrame: totalFrames,
        visible: true,
        locked: false,
        src: config.backgroundMusicPath,
        volume: config.musicVolume || 0.3,
        loop: true,
      });
      console.log("🎵 Added audio layer:", config.backgroundMusicPath);
    }

    // Clear config after use
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        sessionStorage.removeItem('fakeChatConfig');
      }, 1000);
    }

    console.log("✅ Template 9 layers created:", layers.map(l => l.name));
    return layers;
  },
  
  layersToProps: (layers) => ({ layers, templateId: 9 }),
  calculateDuration: (layers) => {
    if (!layers || layers.length === 0) return 300;
    return Math.max(...layers.map(l => l.endFrame || 0));
  },
},

  10: {
    id: 10,
    name: 'redditnarration',
    displayName: 'Reddit Post Narration',
    description: 'Convert Reddit posts into AI narrated videos with karaoke text',
    category: 'Voiceover',
    thumbnailUrl: '/template_previews/RedditNarration.mp4',
    
    // Use MyRedditVideo composition
    composition: MyRedditVideo,
    compositionId: 'MyRedditVideo',
    
    createDefaultLayers: () => {
      // Check if coming from wizard - clear any persisted layers
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const fromWizard = urlParams.get('fromWizard') === 'true';
        
        if (fromWizard) {
          // Clear persisted layers for template 10 to force fresh creation
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('template-10') || key.includes('editor-layers-10') || key.includes('persisted') && key.includes('10'))) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
          console.log("🧹 Cleared persisted layers for template 10 (fromWizard)");
        }
      }

      // Get config from wizard
      const storedConfig = typeof window !== 'undefined' 
        ? sessionStorage.getItem('redditVideoConfig') 
        : null;
      
      let config: any = null;
      if (storedConfig) {
        try {
          config = JSON.parse(storedConfig);
          console.log("📦 Template 10 loaded config:", {
            hasVoiceover: !!config?.audio?.voiceoverPath,
            voiceoverLength: config?.audio?.voiceoverPath?.length || 0,
            wordsCount: config?.script?.words?.length || 0,
          });
        } catch (e) {
          console.error('Failed to parse reddit config:', e);
        }
      }

      // Calculate duration
      const scriptDuration = config?.script?.duration || 30;
      const introDuration = 3;
      const totalDuration = introDuration + scriptDuration;
      const totalFrames = Math.ceil(totalDuration * 30);

      // Create timeline layers
      const layers: Layer[] = [
        {
          id: 'reddit-bg-video',
          type: 'video',
          name: '🎬 Background Video',
          startFrame: 0,
          endFrame: totalFrames,
          visible: true,
          locked: false,
          src: config?.video?.backgroundVideo || 'https://res.cloudinary.com/dcu9xuof0/video/upload/v1765260195/Subway_Surfers_2024_-_Gameplay_4K_9x16_No_Copyright_n4ym8w.mp4',
          position: { x: 50, y: 50 },
          size: { width: 100, height: 100 },
          rotation: 0,
          opacity: 1,
          volume: 0,
          loop: true,
          objectFit: 'cover',
        } as VideoLayer,

       {
          id: 'reddit-card-intro',
          type: 'reddit-card',
          name: '📋 Reddit Card',
          startFrame: 0,
          endFrame: introDuration * 30,
          visible: true,
          locked: false,
          position: { x: 50, y: 35 },
          size: { width: 85, height: 25 },
          rotation: 0,
          opacity: 1,
          animation: { entrance: 'scale', entranceDuration: 20 },
          // Reddit card props
          subredditName: config?.redditCard?.subredditName || 'AmItheAsshole',
          posterUsername: config?.redditCard?.posterUsername || 'throwaway',
          timePosted: config?.redditCard?.timePosted || '10h',
          upvotes: config?.redditCard?.upvotes || '12.4k',
          commentCount: config?.redditCard?.commentCount || '2.3k',
          awardsCount: config?.redditCard?.awardsCount || '1',
          avatarUrl: config?.redditCard?.avatarUrl || '',
          title: config?.script?.title || 'Reddit Post Title',
          text: config?.script?.story || config?.script?.text || 'Post preview text...',
          textMaxLength: 280,
        } as RedditCardLayer,

        {
          id: 'reddit-karaoke-story',
          type: 'reddit-story',
          name: '📖 Story Narration',
          startFrame: introDuration * 30,
          endFrame: totalFrames,
          visible: true,
          locked: false,
          position: { x: 50, y: 50 },
          size: { width: 85, height: 15 },
          rotation: 0,
          opacity: 1,
          animation: { entrance: 'fade', entranceDuration: 15 },
          // Story props
          fontSize: config?.style?.fontSize || 48,
          fontFamily: config?.style?.fontFamily || "'Montserrat', sans-serif",
          fontColor: config?.style?.fontColor || '#ffffff',
          sentenceBgColor: config?.style?.sentenceBgColor || '#FF4500',
          story: config?.script?.story || 'Story text goes here...',
          words: config?.script?.words || [],
        } as RedditStoryLayer,


        ];

      // VOICEOVER - Only add if generated
      if (config?.audio?.voiceoverPath && config.audio.voiceoverPath !== '') {
        layers.push({
          id: 'reddit-voiceover',
          type: 'audio',
          name: '🎙️ AI Voiceover',
          startFrame: introDuration * 30,
          endFrame: totalFrames,
          visible: true,
          locked: false,
          src: config.audio.voiceoverPath,
          volume: 1,
        } as AudioLayer);
      }

      // Background music (optional)
      if (config?.audio?.backgroundMusicPath && config.audio.backgroundMusicPath !== '') {
        layers.push({
          id: 'reddit-bgmusic',
          type: 'audio',
          name: '🎵 Background Music',
          startFrame: 0,
          endFrame: totalFrames,
          visible: true,
          locked: false,
          src: config.audio.backgroundMusicPath,
          volume: config.audio.musicVolume || 0.15,
          loop: true,
        } as AudioLayer);
      }

      console.log("✅ Template 10 layers created:", layers.map(l => l.name));
      return layers;
    },
    
    layersToProps: (layers) => {
      // Get layers by type
      const redditCardLayer = layers.find(l => l.type === 'reddit-card') as RedditCardLayer | undefined;
      const redditStoryLayer = layers.find(l => l.type === 'reddit-story') as RedditStoryLayer | undefined;
      const audioLayer = layers.find(l => l.type === 'audio' && l.name?.includes('Voiceover')) as AudioLayer | undefined;
      const videoLayer = layers.find(l => l.type === 'video') as VideoLayer | undefined;
      const musicLayer = layers.find(l => l.type === 'audio' && l.name?.includes('Music')) as AudioLayer | undefined;

      const voiceoverPath = audioLayer?.src || '';
      const voiceoverStartFrame = audioLayer?.startFrame ?? (3 * 30);

      // Build script from story layer
      const script = {
        title: redditCardLayer?.title || 'AITA for refusing to help my grandparents?',
        text: redditCardLayer?.text || 'Me, a 21 year old female, I am a university student.',
        story: redditStoryLayer?.story || 'Story text goes here...',
        duration: redditStoryLayer ? Math.ceil((redditStoryLayer.endFrame - redditStoryLayer.startFrame) / 30) : 30,
        words: redditStoryLayer?.words || [],
      };

      // Build redditCard from card layer
      const redditCard = {
        subredditName: redditCardLayer?.subredditName || 'AmItheAsshole',
        posterUsername: redditCardLayer?.posterUsername || 'throwaway',
        timePosted: redditCardLayer?.timePosted || '10h',
        upvotes: redditCardLayer?.upvotes || '12.4k',
        commentCount: redditCardLayer?.commentCount || '2.3k',
        awardsCount: redditCardLayer?.awardsCount || '1',
        avatarUrl: redditCardLayer?.avatarUrl || '',
        titleFontSize: redditCardLayer?.titleFontSize,
  textFontSize: redditCardLayer?.textFontSize,
  displayDuration: redditCardLayer?.displayDuration,
  headerFontSize: redditCardLayer?.headerFontSize,
        metricsFontSize: redditCardLayer?.metricsFontSize,
        textMaxLength: redditCardLayer?.textMaxLength,
      };

      const props = {
        script,
        redditCard,
        voiceoverPath,
        voiceoverStartFrame,
        duration: script.duration,
        fontSize: redditStoryLayer?.fontSize || 48,
        fontFamily: redditStoryLayer?.fontFamily || 'Montserrat, sans-serif',
        fontColor: redditStoryLayer?.fontColor || '#ffffff',
        sentenceBgColor: redditStoryLayer?.sentenceBgColor || '#FF4500',
        backgroundOverlayColor: 'rgba(0,0,0,0.5)',
        backgroundVideo: videoLayer?.src || 'https://res.cloudinary.com/dcu9xuof0/video/upload/v1765260195/Subway_Surfers_2024_-_Gameplay_4K_9x16_No_Copyright_n4ym8w.mp4',
        backgroundMusicPath: musicLayer?.src || '',
        musicVolume: musicLayer?.volume || 0.15,
        cardPosition: redditCardLayer?.position || { x: 50, y: 50 },
        cardSize: redditCardLayer?.size || { width: 90, height: 45 },
        storyPosition: redditStoryLayer?.position || { x: 50, y: 50 },
        storySize: redditStoryLayer?.size || { width: 90, height: 60 },
      };

      console.log("📤 layersToProps returning:", {
        hasVoiceover: !!props.voiceoverPath,
        hasWords: props.script.words.length,
        cardTitle: props.script.title?.substring(0, 30),
      });

      return props;
    },
    
    calculateDuration: (layers) => {
      if (layers.length === 0) return 990;
      return Math.max(...layers.map(l => l.endFrame));
    },
  },

 19: {
    id: 19,
    name: 'photocollage',
    displayName: 'Photo Collage',
    description: 'Photo collage with multiple layouts',
    category: 'Media',
    thumbnailUrl: '/template_previews/PhotoCollage.mp4',
    composition: DynamicLayerComposition,
    compositionId: 'DynamicLayerComposition',

    createDefaultLayers: () => {
  // Check if coming from wizard - ALWAYS clear persisted layers
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const fromWizard = urlParams.get('fromWizard') === 'true';
    
    if (fromWizard) {
      console.log("🧹 Clearing persisted layers for template 19 (fromWizard)");
      
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('template-19') ||
          key.includes('template19') ||
          key.includes('editor-layers-19') ||
          key.includes('layers-19') ||
          key.includes('photocollage') ||
          key.includes('Photo Collage') ||
          key.includes('remotion-19') ||
          key.includes('dynamic-19') ||
          key.includes('editor_state_') && key.includes('19')
        )) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => {
        console.log("  Removing:", key);
        localStorage.removeItem(key);
      });
      
      const sessionKeysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key !== 'collageWizardConfig' && (
          key.includes('template-19') ||
          key.includes('template19') ||
          key.includes('layers-19') ||
          key.includes('photocollage')
        )) {
          sessionKeysToRemove.push(key);
        }
      }
      sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('fromWizard');
      newUrl.searchParams.delete('t');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }

  // Get wizard config
  const storedConfig = typeof window !== 'undefined' 
    ? sessionStorage.getItem('collageWizardConfig') 
    : null;
  
  let config: any = null;
  if (storedConfig) {
    try {
      config = JSON.parse(storedConfig);
      console.log("📦 Template 19 loaded config:", config);
    } catch (e) {
      console.error('Failed to parse collage config:', e);
    }
  }

  // ========================================================================
  // ALL LAYOUTS - EXACT COPY FROM CollagePanel.tsx
  // ========================================================================
  const LAYOUTS: Record<string, any> = {
    'collage-stories-animated': {
      animated: true,
      animationConfig: { photoDelay: 8, photoDuration: 25, textStartFrame: 65 },
      textOverlay: { mainText: 'Layout', subText: 'stories', mainFont: 'Pacifico, cursive', subFont: 'Dancing Script, cursive', mainSize: 7, subSize: 4 },
      slots: [
        { id: 'top-left', x: 0, y: 0, width: 50, height: 33.33, slideDirection: 'left' },
        { id: 'top-right', x: 50, y: 0, width: 50, height: 33.33, slideDirection: 'right' },
        { id: 'middle-left', x: 0, y: 33.33, width: 50, height: 33.33, slideDirection: 'left' },
        { id: 'middle-right', x: 50, y: 33.33, width: 50, height: 33.33, slideDirection: 'right' },
        { id: 'bottom-left', x: 0, y: 66.66, width: 50, height: 33.34, slideDirection: 'left' },
        { id: 'bottom-right', x: 50, y: 66.66, width: 50, height: 33.34, slideDirection: 'right' },
      ],
    },
    'original-3x2': {
      textOverlay: { mainText: 'GRID', subText: 'classic collection', mainFont: 'Montserrat, sans-serif', subFont: 'Lato, sans-serif', mainSize: 6, subSize: 3 },
      slots: [
        { id: 'top-left', x: 0, y: 0, width: 33.33, height: 33.33 },
        { id: 'top-center', x: 33.33, y: 0, width: 33.33, height: 33.33 },
        { id: 'top-right', x: 66.66, y: 0, width: 33.34, height: 33.33 },
        { id: 'bottom-left', x: 0, y: 66.67, width: 33.33, height: 33.33 },
        { id: 'bottom-center', x: 33.33, y: 66.67, width: 33.33, height: 33.33 },
        { id: 'bottom-right', x: 66.66, y: 66.67, width: 33.34, height: 33.33 },
      ],
    },
    'grid-2x1': {
      textOverlay: { mainText: 'DUO', subText: 'stack', mainFont: 'Oswald, sans-serif', subFont: 'Roboto, sans-serif', mainSize: 8, subSize: 4 },
      slots: [
        { id: 'top', x: 0, y: 0, width: 100, height: 50 },
        { id: 'bottom', x: 0, y: 50, width: 100, height: 50 },
      ],
    },
    'grid-2x2': {
      textOverlay: { mainText: 'QUAD', subText: 'squares', mainFont: 'Montserrat, sans-serif', subFont: 'Lato, sans-serif', mainSize: 7, subSize: 3.5 },
      slots: [
        { id: 'tl', x: 0, y: 0, width: 50, height: 25 },
        { id: 'tr', x: 50, y: 0, width: 50, height: 25 },
        { id: 'bl', x: 0, y: 25, width: 50, height: 25 },
        { id: 'br', x: 50, y: 25, width: 50, height: 25 },
      ],
    },
    'grid-3x3': {
      textOverlay: { mainText: 'NINE', subText: 'grid layout', mainFont: 'Montserrat, sans-serif', subFont: 'Lato, sans-serif', mainSize: 7, subSize: 3.5 },
      slots: [
        { id: '1', x: 0, y: 0, width: 33.33, height: 16.67 },
        { id: '2', x: 33.33, y: 0, width: 33.33, height: 16.67 },
        { id: '3', x: 66.66, y: 0, width: 33.33, height: 16.67 },
        { id: '4', x: 0, y: 16.67, width: 33.33, height: 16.67 },
        { id: '5', x: 33.33, y: 16.67, width: 33.33, height: 16.67 },
        { id: '6', x: 66.66, y: 16.67, width: 33.33, height: 16.67 },
        { id: '7', x: 0, y: 33.34, width: 33.33, height: 16.67 },
        { id: '8', x: 33.33, y: 33.34, width: 33.33, height: 16.67 },
        { id: '9', x: 66.66, y: 33.34, width: 33.33, height: 16.67 },
      ],
    },
    'creative-hero': {
      textOverlay: { mainText: 'HERO', subText: 'focus', mainFont: 'Playfair Display, serif', subFont: 'Lora, serif', mainSize: 8, subSize: 4 },
      slots: [
        { id: 'hero', x: 0, y: 0, width: 100, height: 60 },
        { id: 'left', x: 0, y: 60, width: 50, height: 40 },
        { id: 'right', x: 50, y: 60, width: 50, height: 40 },
      ],
    },
    'creative-spotlight': {
      textOverlay: { mainText: 'FOCUS', subText: 'center stage', mainFont: 'Oswald, sans-serif', subFont: 'Roboto, sans-serif', mainSize: 8, subSize: 4 },
      slots: [
        { id: 'left', x: 0, y: 0, width: 25, height: 100 },
        { id: 'center', x: 25, y: 10, width: 50, height: 80, zIndex: 2, shadow: true },
        { id: 'right', x: 75, y: 0, width: 25, height: 100 },
      ],
    },
    'split-lr': {
      textOverlay: { mainText: 'VS', subText: 'comparison', mainFont: 'Impact, sans-serif', subFont: 'Arial, sans-serif', mainSize: 10, subSize: 4 },
      slots: [
        { id: 'left', x: 0, y: 0, width: 50, height: 100 },
        { id: 'right', x: 50, y: 0, width: 50, height: 100 },
      ],
    },
    'split-thirds': {
      textOverlay: { mainText: 'SPLIT', subText: 'thirds', mainFont: 'Oswald, sans-serif', subFont: 'Roboto, sans-serif', mainSize: 8, subSize: 4 },
      slots: [
        { id: 'main', x: 0, y: 0, width: 66.66, height: 100 },
        { id: 'top', x: 66.66, y: 0, width: 33.34, height: 50 },
        { id: 'bottom', x: 66.66, y: 50, width: 33.34, height: 50 },
      ],
    },
    'polaroid-classic': {
      textOverlay: { mainText: 'MEMORIES', subText: 'captured moments', mainFont: 'Permanent Marker, cursive', subFont: 'Caveat, cursive', mainSize: 7, subSize: 4 },
      slots: [
        { id: 'photo', x: 12.5, y: 15, width: 75, height: 60, shadow: true, borderRadius: 2 },
      ],
    },
    'polaroid-stack': {
      textOverlay: { mainText: 'SNAP', subText: 'shots', mainFont: 'Permanent Marker, cursive', subFont: 'Caveat, cursive', mainSize: 8, subSize: 4 },
      slots: [
        { id: 'back', x: 5, y: 10, width: 60, height: 50, rotation: -5, zIndex: 1, shadow: true, borderRadius: 2 },
        { id: 'middle', x: 20, y: 25, width: 60, height: 50, rotation: 3, zIndex: 2, shadow: true, borderRadius: 2 },
        { id: 'front', x: 35, y: 40, width: 60, height: 50, rotation: -2, zIndex: 3, shadow: true, borderRadius: 2 },
      ],
    },
    'magazine-cover': {
      textOverlay: { mainText: 'VOGUE', subText: 'fashion edition', mainFont: 'Playfair Display, serif', subFont: 'Lora, serif', mainSize: 12, subSize: 4 },
      slots: [
        { id: 'hero', x: 0, y: 0, width: 100, height: 100 },
      ],
    },
    'magazine-feature': {
      textOverlay: { mainText: 'FEATURE', subText: 'exclusive story', mainFont: 'Playfair Display, serif', subFont: 'Lora, serif', mainSize: 9, subSize: 4 },
      slots: [
        { id: 'main', x: 0, y: 0, width: 100, height: 70 },
        { id: 'text', x: 0, y: 70, width: 100, height: 30 },
      ],
    },
  };

  // Default photos
  const defaultPhotos = [
    'https://images.unsplash.com/photo-1516961642265-531546e84af2?w=600&q=80',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
    'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=600&q=80',
    'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=600&q=80',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80'
  ];

  // Get layout from config or use default
  const layoutId = config?.layoutId || 'collage-stories-animated';
  const layoutDef = LAYOUTS[layoutId] || LAYOUTS['collage-stories-animated'];
  
  // Get photos - fill with placeholders if needed
  const photos = [...(config?.photos || defaultPhotos)];
  while (photos.length < layoutDef.slots.length) {
    photos.push('https://via.placeholder.com/540x960/333333/FFFFFF?text=Photo');
  }

  // Get text settings
  const textOverlay = layoutDef.textOverlay || {};
  const mainText = config?.mainText || textOverlay.mainText || 'MEMORIES';
  const subText = config?.subText || textOverlay.subText || '2024';
  const mainFont = config?.mainFont || textOverlay.mainFont || 'Pacifico, cursive';
  const subFont = config?.subFont || textOverlay.subFont || 'Dancing Script, cursive';
  const textColor = config?.textColor || '#FFFFFF';
  const showTextOverlay = config?.showTextOverlay !== false;
  const backgroundColor = config?.backgroundColor || '#000000';

  // Animation config
  const animConfig = layoutDef.animationConfig || {
    photoDelay: 8,
    photoDuration: 25,
    textStartFrame: 65,
  };

  // Font sizes
  const mainSize = config?.mainSize || textOverlay.mainSize || 7;
  const subSize = config?.subSize || textOverlay.subSize || 4;

  // ========================================================================
  // DURATION CALCULATION - Match wizard preview
  // ========================================================================
  const photoCount = config?.photoCount || Math.min(photos.length, layoutDef.slots.length);
  const collageDurationFrames = config?.collageDurationFrames || 180;
  const showcaseDurationPerPhotoFrames = config?.photoDuration ? config.photoDuration * 30 : (config?.showcaseDurationPerPhotoFrames || 30);
  const showcaseTotalFrames = config?.showcaseTotalFrames || (photoCount * showcaseDurationPerPhotoFrames);
  const totalDuration = config?.totalDurationFrames || (collageDurationFrames + showcaseTotalFrames);

  console.log("📐 Duration calculation:", {
    photoCount,
    collageDurationFrames,
    showcaseDurationPerPhotoFrames,
    showcaseTotalFrames,
    totalDuration
  });

  const layers: any[] = [];

// ========================================================================
// BACKGROUND LAYER - Using placehold.co for reliable solid color
// ========================================================================
const bgHex = backgroundColor.replace('#', '');
const bgUrl = `https://placehold.co/1080x1920/${bgHex}/${bgHex}.png`;
console.log("🎨 Background URL:", bgUrl, "for color:", backgroundColor);

layers.push({
  id: 'collage-bg',
  type: 'image',
  name: 'Background',
  visible: true,
  locked: true,
  startFrame: 0,
  endFrame: totalDuration,
  position: { x: 50, y: 50 },
  size: { width: 100, height: 100 },
  rotation: 0,
  opacity: 1,
  src: bgUrl,
  objectFit: 'cover',
  isBackground: true,
});

  // ========================================================================
  // COLLAGE PHOTO LAYERS
  // ========================================================================
  const wizardTransition = config?.transitionEffect;

  layoutDef.slots.forEach((slot: any, index: number) => {
    const startFrame = index * animConfig.photoDelay;

    let entranceAnim = 'fade';
    if (wizardTransition && wizardTransition !== 'fade') {
      entranceAnim = wizardTransition;
    } else if (slot.slideDirection === 'left') {
      entranceAnim = 'slideLeft';
    } else if (slot.slideDirection === 'right') {
      entranceAnim = 'slideRight';
    } else if (slot.slideDirection === 'up') {
      entranceAnim = 'slideUp';
    } else if (slot.slideDirection === 'down') {
      entranceAnim = 'slideDown';
    }

    const centerX = slot.x + (slot.width / 2);
    const centerY = slot.y + (slot.height / 2);

    layers.push({
      id: `collage-photo-${slot.id}`,
      type: 'image',
      name: `Photo ${index + 1}`,
      visible: true,
      locked: false,
      startFrame: startFrame,
      endFrame: totalDuration,
      position: { x: centerX, y: centerY },
      size: { width: slot.width, height: slot.height },
      rotation: slot.rotation || 0,
      opacity: 1,
      src: photos[index],
      objectFit: 'cover',
      zIndex: slot.zIndex || (index + 1),
      animation: {
        entrance: entranceAnim,
        entranceDuration: animConfig.photoDuration,
      },
    });
  });

  // ========================================================================
  // TEXT LAYERS
  // ========================================================================
  if (showTextOverlay && textOverlay) {
    layers.push({
      id: 'collage-text-main',
      type: 'text',
      name: 'Main Text',
      visible: true,
      locked: false,
      startFrame: animConfig.textStartFrame,
      endFrame: collageDurationFrames, // Only show during collage phase
      position: { x: 50, y: 46.35 },
      size: { width: 83.33, height: 13 },
      rotation: 0,
      opacity: 1,
      content: mainText,
      fontFamily: mainFont,
      fontSize: mainSize,
      fontColor: textColor,
      fontWeight: 'bold',
      fontStyle: 'normal',
      textAlign: 'center',
      lineHeight: 1,
      letterSpacing: 3,
      textTransform: 'none',
      textShadow: true,
      shadowColor: '#000000',
      shadowX: 4,
      shadowY: 4,
      shadowBlur: 12,
      textOutline: true,
      outlineColor: 'rgba(0, 0, 0, 0.3)',
      animation: { entrance: 'scale', entranceDuration: 20 },
    });

    layers.push({
      id: 'collage-text-sub',
      type: 'text',
      name: 'Subtitle',
      visible: true,
      locked: false,
      startFrame: animConfig.textStartFrame + 5,
      endFrame: collageDurationFrames, 
      position: { x: 50, y: 55.2 },
      size: { width: 46.3, height: 6.25 },
      rotation: 0,
      opacity: 0.98,
      content: subText,
      fontFamily: subFont,
      fontSize: subSize,
      fontColor: textColor,
      fontWeight: 'normal',
      fontStyle: 'italic',
      textAlign: 'center',
      lineHeight: 1.2,
      letterSpacing: 1,
      textTransform: 'none',
      textShadow: true,
      shadowColor: '#000000',
      shadowX: 3,
      shadowY: 3,
      shadowBlur: 10,
      animation: { entrance: 'fade', entranceDuration: 15 },
    });
  }

  // ========================================================================
  // INDIVIDUAL SHOWCASE PHOTO LAYERS (after collage)
  // ========================================================================
  for (let i = 0; i < photoCount; i++) {
    const showcaseStartFrame = collageDurationFrames + (i * showcaseDurationPerPhotoFrames);
    const showcaseEndFrame = showcaseStartFrame + showcaseDurationPerPhotoFrames;
    
    layers.push({
      id: `showcase-photo-${i}`,
      type: 'image',
      name: `Showcase ${i + 1}`,
      visible: true,
      locked: false,
      startFrame: showcaseStartFrame,
      endFrame: showcaseEndFrame,
      position: { x: 50, y: 50 },
      size: { width: 100, height: 100 },
      rotation: 0,
      opacity: 1,
      src: photos[i],
      objectFit: 'cover',
      zIndex: 100 + i,
      animation: {
        entrance: 'fade',
        entranceDuration: 8,
      },
    });
  }

  // ========================================================================
  // BACKGROUND MUSIC LAYER
  // ========================================================================
  if (config?.backgroundMusicPath && config.backgroundMusicPath !== '') {
    layers.push({
      id: 'collage-audio',
      type: 'audio',
      name: 'Background Music',
      visible: true,
      locked: false,
      startFrame: 0,
      endFrame: totalDuration,
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
      rotation: 0,
      opacity: 1,
      src: config.backgroundMusicPath,
      volume: config.musicVolume || 0.3,
      loop: true,
      fadeIn: 15,
      fadeOut: 15,
    });
    console.log("🎵 Added audio layer:", config.backgroundMusicPath);
  }

  // Clear config after use
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('collageWizardConfig');
  }

  return layers as Layer[];
},

    layersToProps: (layers) => ({ layers }),

    calculateDuration: (layers) => {
      if (!layers || layers.length === 0) return 180;
      return Math.max(...layers.map(l => l.endFrame || 0));
    },
  },



  30: {
    id: 30,
    name: 'watchshowcase',
    displayName: 'Dancing People',
    description: 'POV text top, Product bottom - Viral Style',
    category: 'Showcase',
    thumbnailUrl: '',
    composition: DynamicLayerComposition,
    compositionId: 'DynamicLayerComposition',
    createDefaultLayers: () => [
      {
        id: 'watch-bg',
        type: 'video',
        name: 'Background Video',
        startFrame: 0,
        endFrame: 300,
        visible: true,
        locked: false,
        src: 'https://res.cloudinary.com/djnyytyd0/video/upload/v1764558376/the_way_they_got_so_much_aura_so_tuff_song_ilyTOMMY_-_pretty_ho3_..._sar5qk.mp4', 
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        rotation: 0,
        opacity: 1,
        volume: 0,
        objectFit: 'cover',
        filter: 'brightness(0.8)', 
      },
      {
        id: 'watch-caption',
        type: 'text',
        name: 'POV Caption',
        startFrame: 0,
        endFrame: 300,
        visible: true,
        locked: false,
        content: "POV: You're dancing while your BPC-157 kicks in and you feel invincible 🧪💃",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSize: 3.2, 
        fontColor: '#FFFFFF',
        fontWeight: '700', 
        textAlign: 'center',
        lineHeight: 1.2,
        textShadow: true,
        shadowColor: 'rgba(0,0,0,1)',
        shadowBlur: 8,
        shadowY: 2,
        position: { x: 50, y: 15 },
        size: { width: 90, height: 20 },
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'slideDown', entranceDuration: 20 },
      },
      {
        id: 'watch-name',
        type: 'text',
        name: 'Product Name',
        startFrame: 0,
        endFrame: 300,
        visible: true,
        locked: false,
        content: 'Montres\nBreguet',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSize: 2.5, 
        fontColor: '#FFFFFF',
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 1.1,
        textShadow: true,
        shadowColor: 'rgba(0,0,0,0.8)',
        shadowBlur: 4,
        position: { x: 25, y: 66 }, 
        size: { width: 40, height: 15 },
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'fade', entranceDuration: 30 },
      },
      {
        id: 'watch-image',
        type: 'image',
        name: 'Product Image',
        startFrame: 0,
        endFrame: 300,
        visible: true,
        locked: false,
        src: 'https://res.cloudinary.com/djnyytyd0/image/upload/v1764558518/Audemars_Piguet_wtijtf.png',
        objectFit: 'contain',
        position: { x: 25, y: 85 }, 
        size: { width: 28, height: 25 },
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'slideUp', entranceDuration: 30 },
      },
      {
        id: 'watch-audio',
        type: 'audio',
        name: 'Background Music',
        startFrame: 0,
        endFrame: 300,
        visible: true,
        locked: false,
        src: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
        volume: 0.6,
        loop: true,
        fadeIn: 30,
      }
    ] as Layer[],
    layersToProps: (layers) => ({ layers, templateId: 30 }),
    calculateDuration: (layers) => Math.max(...layers.map(l => l.endFrame)),
  },
};

// Helper functions
export const getTemplate = (id: number): TemplateDefinition | undefined => {
  return TEMPLATES[id];
};

export const getAllTemplates = (): TemplateDefinition[] => {
  return Object.values(TEMPLATES);
};

export const getTemplatesByCategory = (category: string): TemplateDefinition[] => {
  return Object.values(TEMPLATES).filter(t => t.category === category);
};

export const TEMPLATE_NAME_TO_ID: Record<string, number> = {
  'Quote Spotlight': 1,
  'Typing Animation': 2,
  'Split Screen': 6,
  'Ken Burns Carousel': 8,
  'Photo Collage': 19,
  'Fake Text Conversation' : 9,
  'Reddit Post Narration': 10,
  'Dancing People':  30
};

export const TEMPLATE_ID_TO_NAME: Record<number, string> = Object.fromEntries(
  Object.entries(TEMPLATE_NAME_TO_ID).map(([name, id]) => [id, name])
);