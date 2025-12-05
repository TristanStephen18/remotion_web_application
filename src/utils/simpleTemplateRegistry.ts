import React from 'react';
import type { Layer, VideoLayer, ImageLayer } from '../components/remotion_compositions/DynamicLayerComposition';
import { DynamicLayerComposition } from '../components/remotion_compositions/DynamicLayerComposition';
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
  duration: number; // duration in seconds
}

export const TEMPLATES: Record<number, TemplateDefinition> = {
  // ... [Keep Templates 1, 2, 6 as they were] ...
  1: {
    id: 1,
    name: 'quotetemplate',
    displayName: 'Quote Spotlight',
    description: 'Beautiful quote graphics - Fully Editable!',
    category: 'Text',
    thumbnailUrl: '/template_previews/QuoteSpotlight.mp4',
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
        src: 'https://res.cloudinary.com/dcu9xuof0/image/upload/v1764429657/OIP_fchw6q.png',
        isBackground: true,
        objectFit: 'cover',
        filter: 'brightness(0.6)',
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'fade', entranceDuration: 60 },
      },
      {
        id: 'quote-mark',
        type: 'text',
        name: 'Quotation Mark',
        startFrame: 30,
        endFrame: 270,
        visible: true,
        locked: false,
        content: '"',
        fontFamily: 'Libre Baskerville, Baskerville, Georgia, serif',
        fontSize: 8,
        fontColor: '#FFFFFF',
        fontWeight: '400',
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 0.8,
        position: { x: 50, y: 22 }, 
        size: { width: 15, height: 15 }, 
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'scale', entranceDuration: 45 },
      },
      {
        id: 'quote-text',
        type: 'text',
        name: 'Quote',
        startFrame: 30,
        endFrame: 270,
        visible: true,
        locked: false,
        content: 'Life is like riding a bicycle. To keep your balance, you must keep movin.',
        fontFamily: 'Libre Baskerville, Baskerville, Georgia, serif',
        fontSize: 4,
        fontColor: '#ffffff',
        fontWeight: '400',
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 1.5,
        textShadow: true,
        shadowColor: 'rgba(0, 0, 0, 0.9)',
        shadowBlur: 10,
        position: { x: 50, y: 45 },
        size: { width: 70, height: 30 }, 
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'bounce', entranceDuration: 60 },
      },
      {
        id: 'author-text',
        type: 'text',
        name: 'Author',
        startFrame: 180,
        endFrame: 270,
        visible: true,
        locked: false,
        content: '— ALBERT EINSTEIN',
        fontFamily: 'Libre Baskerville, Baskerville, Georgia, serif',
        fontSize: 2.5,
        fontColor: '#ffffff',
        fontWeight: '400',
        textAlign: 'center',
        position: { x: 50, y: 80 },
        size: { width: 60, height: 8 }, 
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'fade', entranceDuration: 45 },
      }
    ] as Layer[],
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
    description: 'Upper/Lower split screen - Fully editable',
    category: 'Media',
    thumbnailUrl: '/template_previews/SplitScreen.mp4',
    composition: DynamicLayerComposition,
    compositionId: 'DynamicLayerComposition',
    createDefaultLayers: () => [
      {
        id: 'upper-panel',
        type: 'video',
        name: 'Upper Panel',
        startFrame: 0,
        endFrame: 600,
        visible: true,
        locked: false,
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        position: { x: 50, y: 25 },
        size: { width: 100, height: 50 },
        rotation: 0,
        opacity: 1,
        volume: 0.5,
        loop: true,
        playbackRate: 1,
        objectFit: 'cover',
        animation: { entrance: 'none', entranceDuration: 0 },
      },
      {
        id: 'lower-panel',
        type: 'video',
        name: 'Lower Panel',
        startFrame: 0,
        endFrame: 600,
        visible: true,
        locked: false,
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        position: { x: 50, y: 75 },
        size: { width: 100, height: 50 },
        rotation: 0,
        opacity: 1,
        volume: 0.5,
        loop: true,
        playbackRate: 1,
        objectFit: 'cover',
        animation: { entrance: 'none', entranceDuration: 0 },
      },
      {
        id: 'divider',
        type: 'image',
        name: 'Divider',
        startFrame: 0,
        endFrame: 600,
        visible: true,
        locked: false,
        src: 'data:image/svg+xml,%3Csvg width="1080" height="10" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="1080" height="10" fill="white"/%3E%3C/svg%3E',
        position: { x: 50, y: 50 },
        size: { width: 100, height: 0.5 },
        rotation: 0,
        opacity: 0.8,
        objectFit: 'fill',
        isBackground: false,
        animation: { entrance: 'none', entranceDuration: 0 },
      },
    ] as Layer[],
    layersToProps: (layers) => ({ layers }),
    calculateDuration: (layers) => Math.max(...layers.map(l => l.endFrame)),
  },

  // ========================================
  // TEMPLATE 8: BLURRED BACKGROUND STYLE (Updated)
  // ========================================
  8: {
    id: 8,
    name: 'kenburnscarousel',
    displayName: 'Ken Burns Carousel',
    description: 'Slideshow center with blurred background',
    category: 'Media',
    thumbnailUrl: '/template_previews/KenBurnsCarousel.mp4',
    composition: DynamicLayerComposition,
    compositionId: 'DynamicLayerComposition',
    createDefaultLayers: (layout = 'layout1', sequence = []) => {
      const FPS = 30;
      const TRANSITION_DURATION = 15; // frames for slide transition

      // Default sequence if none is provided
      const defaultSequence: MediaItem[] = sequence.length > 0 ? sequence : [
        {
          id: generateId(),
          type: 'video',
          src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          duration: 5
        },
        {
          id: generateId(),
          type: 'image',
          src: 'https://images.unsplash.com/photo-1516961642265-531546e84af2?w=600&q=80',
          duration: 5
        }
      ];

      // 1. Background Layer (uses the first item's source, muted, blurred)
      const bgLayer: VideoLayer | ImageLayer = {
        id: 'bg-layer',
        type: defaultSequence[0].type,
        name: 'Background Blur',
        startFrame: 0,
        endFrame: 0, // Will be updated
        visible: true,
        locked: true,
        src: defaultSequence[0].src,
        objectFit: 'cover',
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        rotation: 0,
        opacity: 1,
        filter: 'blur(30px) brightness(0.6)',
        animation: { entrance: 'none', entranceDuration: 0 },
        ...(defaultSequence[0].type === 'video' ? { volume: 0, playbackRate: 1, loop: true } : {})
      } as any;

      const foregroundLayers: Layer[] = [];
      let currentStartFrame = 0;

      // Define layout properties
      const layoutProps = layout === 'layout1'
        ? { width: 100, height: 100, objectFit: 'contain' as const } // Layout 1: Full Center
        : { width: 80, height: 60, objectFit: 'cover' as const };    // Layout 2: Small Square

      // 2. Generate Foreground Layers from Sequence
      defaultSequence.forEach((item, index) => {
        const durationInFrames = item.duration * FPS;
        const endFrame = currentStartFrame + durationInFrames;
        
        // Apply slide transition to all but the first layer
        const animation = index === 0 ? { entrance: 'fade' as const, entranceDuration: 30 } : { entrance: 'slideUp' as const, entranceDuration: TRANSITION_DURATION };

        const layer: VideoLayer | ImageLayer = {
          id: item.id,
          type: item.type,
          name: `Slide ${index + 1}`,
          startFrame: currentStartFrame,
          endFrame: endFrame,
          visible: true,
          locked: false,
          src: item.src,
          objectFit: layoutProps.objectFit,
          position: { x: 50, y: 50 },
          size: { width: layoutProps.width, height: layoutProps.height },
          rotation: 0,
          opacity: 1,
          filter: '',
          animation: animation,
          ...(item.type === 'video' ? { volume: 1, playbackRate: 1, loop: false } : {})
        } as any;

        foregroundLayers.push(layer);
        // Overlap for transition
        currentStartFrame = endFrame - (index < defaultSequence.length - 1 ? TRANSITION_DURATION : 0);
      });

      // Update background layer duration
      const totalDuration = Math.max(...foregroundLayers.map(l => l.endFrame));
      bgLayer.endFrame = totalDuration;

      return [bgLayer, ...foregroundLayers];
    },
    layersToProps: (layers) => ({ layers, templateId: 8 }),
    calculateDuration: (layers) => Math.max(...layers.map(l => l.endFrame)),
  },

  // ... [Keep Templates 19, 9, 30 as they were] ...
  19: {
    id: 19,
    name: 'photocollage',
    displayName: 'Photo Collage',
    description: '6-photo collage transition into slideshow',
    category: 'Media',
    thumbnailUrl: '/template_previews/PhotoCollage.mp4',
    composition: DynamicLayerComposition,
    compositionId: 'DynamicLayerComposition',

    createDefaultLayers: () => {
      const images = [
        'https://images.unsplash.com/photo-1516961642265-531546e84af2?w=600&q=80',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
        'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=600&q=80',
        'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=600&q=80',
        'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80'
      ];

      const COLLAGE_END_FRAME = 120;
      const SLIDE_DURATION = 60;

      return [
        {
          id: 'col-1', type: 'image', name: 'Collage 1 (Top L)',
          startFrame: 0, endFrame: COLLAGE_END_FRAME,
          src: images[0], objectFit: 'cover',
          position: { x: 16.67, y: 16.67 }, size: { width: 33.33, height: 33.33 },
          animation: { entrance: 'slideDown', entranceDuration: 20 },
          visible: true, locked: false, opacity: 1, rotation: 0
        },
        {
          id: 'col-2', type: 'image', name: 'Collage 2 (Top C)',
          startFrame: 5, endFrame: COLLAGE_END_FRAME,
          src: images[1], objectFit: 'cover',
          position: { x: 50, y: 16.67 }, size: { width: 33.33, height: 33.33 },
          animation: { entrance: 'slideDown', entranceDuration: 20 },
          visible: true, locked: false, opacity: 1, rotation: 0
        },
        {
          id: 'col-3', type: 'image', name: 'Collage 3 (Top R)',
          startFrame: 10, endFrame: COLLAGE_END_FRAME,
          src: images[2], objectFit: 'cover',
          position: { x: 83.33, y: 16.67 }, size: { width: 33.33, height: 33.33 },
          animation: { entrance: 'slideDown', entranceDuration: 20 },
          visible: true, locked: false, opacity: 1, rotation: 0
        },
        {
          id: 'collage-title', type: 'text', name: 'Center Title',
          startFrame: 0, endFrame: COLLAGE_END_FRAME,
          content: 'MY MEMORIES',
          fontFamily: 'Anton, sans-serif',
          fontSize: 8,
          fontColor: '#ffffff',
          fontWeight: '900',
          textAlign: 'center',
          lineHeight: 1,
          textTransform: 'uppercase',
          textShadow: true,
          shadowColor: 'rgba(0,0,0,1)',
          shadowBlur: 20,
          position: { x: 50, y: 50 }, size: { width: 100, height: 33.33 },
          animation: { entrance: 'zoomPunch', entranceDuration: 25 },
          visible: true, locked: false, opacity: 1, rotation: 0,
          textOutline: true, outlineColor: 'black'
        },
        {
          id: 'col-4', type: 'image', name: 'Collage 4 (Bot L)',
          startFrame: 0, endFrame: COLLAGE_END_FRAME,
          src: images[3], objectFit: 'cover',
          position: { x: 16.67, y: 83.33 }, size: { width: 33.33, height: 33.33 },
          animation: { entrance: 'slideUp', entranceDuration: 20 },
          visible: true, locked: false, opacity: 1, rotation: 0
        },
        {
          id: 'col-5', type: 'image', name: 'Collage 5 (Bot C)',
          startFrame: 5, endFrame: COLLAGE_END_FRAME,
          src: images[4], objectFit: 'cover',
          position: { x: 50, y: 83.33 }, size: { width: 33.33, height: 33.33 },
          animation: { entrance: 'slideUp', entranceDuration: 20 },
          visible: true, locked: false, opacity: 1, rotation: 0
        },
        {
          id: 'col-6', type: 'image', name: 'Collage 6 (Bot R)',
          startFrame: 10, endFrame: COLLAGE_END_FRAME,
          src: images[5], objectFit: 'cover',
          position: { x: 83.33, y: 83.33 }, size: { width: 33.33, height: 33.33 },
          animation: { entrance: 'slideUp', entranceDuration: 20 },
          visible: true, locked: false, opacity: 1, rotation: 0
        },
        {
          id: 'slide-1', type: 'image', name: 'Slide 1',
          startFrame: COLLAGE_END_FRAME, endFrame: COLLAGE_END_FRAME + SLIDE_DURATION,
          src: images[0], objectFit: 'contain',
          position: { x: 50, y: 50 }, size: { width: 100, height: 100 },
          animation: { entrance: 'fade', entranceDuration: 15 },
          visible: true, locked: false, opacity: 1, rotation: 0
        },
        {
          id: 'slide-2', type: 'image', name: 'Slide 2',
          startFrame: COLLAGE_END_FRAME + SLIDE_DURATION, endFrame: COLLAGE_END_FRAME + (SLIDE_DURATION * 2),
          src: images[1], objectFit: 'contain',
          position: { x: 50, y: 50 }, size: { width: 100, height: 100 },
          animation: { entrance: 'fade', entranceDuration: 15 },
          visible: true, locked: false, opacity: 1, rotation: 0
        },
        {
          id: 'slide-3', type: 'image', name: 'Slide 3',
          startFrame: COLLAGE_END_FRAME + (SLIDE_DURATION * 2), endFrame: COLLAGE_END_FRAME + (SLIDE_DURATION * 3),
          src: images[2], objectFit: 'contain',
          position: { x: 50, y: 50 }, size: { width: 100, height: 100 },
          animation: { entrance: 'fade', entranceDuration: 15 },
          visible: true, locked: false, opacity: 1, rotation: 0
        },
        {
          id: 'slide-4', type: 'image', name: 'Slide 4',
          startFrame: COLLAGE_END_FRAME + (SLIDE_DURATION * 3), endFrame: COLLAGE_END_FRAME + (SLIDE_DURATION * 4),
          src: images[3], objectFit: 'contain',
          position: { x: 50, y: 50 }, size: { width: 100, height: 100 },
          animation: { entrance: 'fade', entranceDuration: 15 },
          visible: true, locked: false, opacity: 1, rotation: 0
        },
        {
          id: 'slide-5', type: 'image', name: 'Slide 5',
          startFrame: COLLAGE_END_FRAME + (SLIDE_DURATION * 4), endFrame: COLLAGE_END_FRAME + (SLIDE_DURATION * 5),
          src: images[4], objectFit: 'contain',
          position: { x: 50, y: 50 }, size: { width: 100, height: 100 },
          animation: { entrance: 'fade', entranceDuration: 15 },
          visible: true, locked: false, opacity: 1, rotation: 0
        },
        {
          id: 'slide-6', type: 'image', name: 'Slide 6',
          startFrame: COLLAGE_END_FRAME + (SLIDE_DURATION * 5), endFrame: COLLAGE_END_FRAME + (SLIDE_DURATION * 6),
          src: images[5], objectFit: 'contain',
          position: { x: 50, y: 50 }, size: { width: 100, height: 100 },
          animation: { entrance: 'fade', entranceDuration: 15 },
          visible: true, locked: false, opacity: 1, rotation: 0
        },
      ] as Layer[];
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
    createDefaultLayers: () => [
      {
        id: 'chat-bg',
        type: 'image',
        name: 'Wallpaper',
        startFrame: 0,
        endFrame: 300,
        visible: true,
        locked: true,
        src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&q=80',
        isBackground: true,
        objectFit: 'cover',
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        rotation: 0,
        opacity: 1,
      },
      {
        id: 'msg-1',
        type: 'chat-bubble',
        name: 'Them: Hello',
        startFrame: 10,
        endFrame: 300,
        visible: true,
        locked: false,
        message: "Hey! Did you see the new update?",
        isSender: false,
        chatStyle: 'instagram',
        senderName: 'Sarah_Smith',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        position: { x: 50, y: 20 },
        size: { width: 100, height: 10 },
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'slideUp', entranceDuration: 20 },
      },
      {
        id: 'msg-2',
        type: 'chat-bubble',
        name: 'Typing...',
        startFrame: 40,
        endFrame: 70, // Short duration for typing
        visible: true,
        locked: false,
        message: "",
        isSender: true,
        isTyping: true,
        chatStyle: 'instagram',
        senderName: 'Sarah_Smith',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        position: { x: 50, y: 32 },
        size: { width: 100, height: 10 },
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'slideUp', entranceDuration: 15 },
      },
      {
        id: 'msg-3',
        type: 'chat-bubble',
        name: 'Me: Reply',
        startFrame: 70,
        endFrame: 300,
        visible: true,
        locked: false,
        message: "Yeah, it looks exactly like the real thing now! 🔥",
        isSender: true,
        chatStyle: 'instagram',
        senderName: 'Sarah_Smith',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        position: { x: 50, y: 32 },
        size: { width: 100, height: 10 },
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'slideUp', entranceDuration: 20 },
      }
    ] as any[], 
    layersToProps: (layers) => ({ layers, templateId: 9 }),
    calculateDuration: () => 300,
  },

  30: {
    id: 30,
    name: 'watchshowcase',
    displayName: 'Viral POV Showcase',
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
        locked: true,
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
  'Dancing People':  30
};

export const TEMPLATE_ID_TO_NAME: Record<number, string> = Object.fromEntries(
  Object.entries(TEMPLATE_NAME_TO_ID).map(([name, id]) => [id, name])
);