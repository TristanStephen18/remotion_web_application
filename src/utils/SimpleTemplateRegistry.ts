import React from 'react';
import type { Layer } from '../components/remotion_compositions/DynamicLayerComposition';
import { DynamicLayerComposition } from '../components/remotion_compositions/DynamicLayerComposition';

export interface TemplateDefinition {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  category?: string;
  thumbnailUrl?: string;
  composition: React.FC<any>;
  compositionId: string;
  createDefaultLayers: () => Layer[];
  layersToProps: (layers: Layer[]) => any;
  calculateDuration?: (layers: Layer[]) => number;
}

export const TEMPLATES: Record<number, TemplateDefinition> = {
  // ========================================
  // TEMPLATE 1: QUOTE SPOTLIGHT
  // ========================================
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

  // ========================================
  // TEMPLATE 2: TYPING ANIMATION
  // ========================================
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

  // ========================================
  // TEMPLATE 6: SPLIT SCREEN
  // ========================================
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
  // TEMPLATE 8: BLURRED BACKGROUND VIDEO
  // ========================================
  8: {
    id: 8,
    name: 'kenburnscarousel',
    displayName: 'Blurred Background Video',
    description: 'Vertical video with auto-generated blurred background',
    category: 'Media',
    thumbnailUrl: '/template_previews/KenBurnsCarousel.mp4',
    composition: DynamicLayerComposition,
    compositionId: 'DynamicLayerComposition',
    createDefaultLayers: () => [
      {
        id: 'video-1',
        type: 'video',
        name: 'Video Clip 1',
        startFrame: 0,
        endFrame: 150,
        visible: true,
        locked: false,
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 
        objectFit: 'cover',
        position: { x: 50, y: 50 },
        size: { width: 50, height: 70 },
        rotation: 0,
        opacity: 1,
        volume: 1,
        playbackRate: 1,
        loop: false,
        animation: { entrance: 'fade', entranceDuration: 30 },
      },
    ] as Layer[],
    layersToProps: (layers) => ({ layers, templateId: 8 }),
    calculateDuration: (layers) => Math.max(...layers.map(l => l.endFrame)),
  },

  // ========================================
  // TEMPLATE 19: PHOTO COLLAGE (6 PHOTOS + SLIDESHOW)
  // ========================================
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
      // Define images once to reuse in both collage and slideshow
      const images = [
        'https://images.unsplash.com/photo-1516961642265-531546e84af2?w=600&q=80',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
        'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=600&q=80',
        'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=600&q=80',
        'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80'
      ];

      const COLLAGE_END_FRAME = 120; // 4 seconds of collage
      const SLIDE_DURATION = 60;     // 2 seconds per slide

      return [
        // ============================
        // PART 1: THE COLLAGE (Frames 0-120)
        // ============================
        
        // --- TOP ROW (3 Images) ---
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

        // --- CENTER TITLE ---
        {
          id: 'collage-title', type: 'text', name: 'Center Title',
          startFrame: 0, endFrame: COLLAGE_END_FRAME,
          content: 'MY MEMORIES',
          fontFamily: 'Anton, sans-serif', // ✅ Bold Font
          fontSize: 8,
          fontColor: '#ffffff',
          fontWeight: '900',
          textAlign: 'center',
          lineHeight: 1,
          textTransform: 'uppercase',
          textShadow: true,
          shadowColor: 'rgba(0,0,0,1)', // ✅ Strong Shadow
          shadowBlur: 20,
          position: { x: 50, y: 50 }, size: { width: 100, height: 33.33 },
          animation: { entrance: 'zoomPunch', entranceDuration: 25 },
          visible: true, locked: false, opacity: 1, rotation: 0,
          textOutline: true, outlineColor: 'black'
        },

        // --- BOTTOM ROW (3 Images) ---
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

        // ============================
        // PART 2: SLIDESHOW (Frames 120+)
        // ============================
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

// Map template names to IDs
export const TEMPLATE_NAME_TO_ID: Record<string, number> = {
  'Quote Spotlight': 1,
  'Typing Animation': 2,
  'Split Screen': 6,
  'Blurred Background Video': 8,
  'Photo Collage': 19,
};

// Reverse mapping
export const TEMPLATE_ID_TO_NAME: Record<number, string> = Object.fromEntries(
  Object.entries(TEMPLATE_NAME_TO_ID).map(([name, id]) => [id, name])
);