import { useCallback, useRef } from "react";
import toast from "react-hot-toast";
import {
  type Layer,
  type TextLayer,
  type ImageLayer,
  type AudioLayer,
  type VideoLayer,
  isImageLayer,
} from "../../components/remotion_compositions/DynamicLayerComposition";
import { generateId } from "../../utils/layerHelper";

interface UseLayerManagementProps {
  layers: Layer[];
  pushState: (layers: Layer[]) => void;
  currentFrame: number;
  totalFrames: number;
  setSelectedLayerId: (id: string | null) => void;
  setActiveTab?: (tab: string | null) => void;
}

export const useLayerManagement = ({
  layers,
  pushState,
  currentFrame,
  totalFrames,
  setSelectedLayerId,
  setActiveTab,
}: UseLayerManagementProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const addTextLayer = useCallback(() => {
    const newLayer: TextLayer = {
      id: generateId(),
      type: "text",
      name: `Text ${layers.filter((l) => l.type === "text").length + 1}`,
      visible: true,
      locked: false,
      startFrame: currentFrame,
      endFrame: Math.min(currentFrame + 90, totalFrames),
      position: { x: 50, y: 50 },
      size: { width: 70, height: 15 },
      rotation: 0,
      opacity: 1,
      content: "New Text",
      fontFamily: "Roboto, sans-serif",
      fontSize: 4,
      fontColor: "#ffffff",
      fontWeight: "normal",
      fontStyle: "normal",
      textAlign: "center",
      lineHeight: 1.4,
      textOutline: false,
      outlineColor: "#000000",
      textShadow: false,
      shadowColor: "#000000",
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      animation: { entrance: "fade", entranceDuration: 30 },
    };
    pushState([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
  }, [currentFrame, totalFrames, layers, pushState, setSelectedLayerId]);

  const addImageLayer = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newLayer: ImageLayer = {
            id: generateId(),
            type: "image",
            name: `Image ${layers.filter((l) => l.type === "image").length + 1}`,
            visible: true,
            locked: false,
            startFrame: currentFrame,
            endFrame: Math.min(currentFrame + 90, totalFrames),
            position: { x: 50, y: 50 },
            size: { width: 40, height: 25 },
            rotation: 0,
            opacity: 1,
            src: event.target?.result as string,
            isBackground: false,
            objectFit: "contain",
          };
          pushState([...layers, newLayer]);
          setSelectedLayerId(newLayer.id);
        };
        reader.readAsDataURL(file);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [currentFrame, totalFrames, layers, pushState, setSelectedLayerId]
  );

  const addAudioLayer = useCallback(() => {
    audioInputRef.current?.click();
  }, []);

  const handleAudioUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newLayer: AudioLayer = {
            id: generateId(),
            type: "audio",
            name: file.name.replace(/\.[^/.]+$/, "") || `Audio ${layers.filter((l) => l.type === "audio").length + 1}`,
            visible: true,
            locked: false,
            startFrame: currentFrame,
            endFrame: Math.min(currentFrame + 150, totalFrames),
            position: { x: 50, y: 50 },
            size: { width: 100, height: 10 },
            rotation: 0,
            opacity: 1,
            src: event.target?.result as string,
            volume: 1,
            loop: false,
            fadeIn: 0,
            fadeOut: 0,
          };
          pushState([...layers, newLayer]);
          setSelectedLayerId(newLayer.id);
          toast.success("Audio added");
        };
        reader.readAsDataURL(file);
      }
      if (audioInputRef.current) {
        audioInputRef.current.value = "";
      }
    },
    [currentFrame, totalFrames, layers, pushState, setSelectedLayerId]
  );

  const addVideoLayer = useCallback(() => {
    videoInputRef.current?.click();
  }, []);

  const handleVideoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newLayer: VideoLayer = {
            id: generateId(),
            type: "video",
            name: file.name.replace(/\.[^/.]+$/, "") || `Video ${layers.filter((l) => l.type === "video").length + 1}`,
            visible: true,
            locked: false,
            startFrame: currentFrame,
            endFrame: Math.min(currentFrame + 150, totalFrames),
            position: { x: 50, y: 50 },
            size: { width: 60, height: 45 },
            rotation: 0,
            opacity: 1,
            src: event.target?.result as string,
            volume: 0.8,
            loop: false,
            playbackRate: 1,
            objectFit: "contain",
            filter: "",
            fadeIn: 0,
            fadeOut: 0,
            animation: {
              entrance: "fade",
              entranceDuration: 30,
            },
          };
          pushState([newLayer, ...layers]);
          setSelectedLayerId(newLayer.id);
          setActiveTab?.("video");
          toast.success("Video added");
        };
        reader.readAsDataURL(file);
      }
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    },
    [currentFrame, totalFrames, layers, pushState, setSelectedLayerId, setActiveTab]
  );

  const updateLayer = useCallback(
    (layerId: string, updates: Partial<Layer>) => {
      console.log('🔍 updateLayer called:', { layerId, updates });
      
      const newLayers = layers.map((layer): Layer => {
        if (layer.id !== layerId) return layer;
        const updated = { ...layer, ...updates } as Layer;
        console.log('  ↳ Layer updated:', layer.name, updated);
        return updated;
      });
      
      console.log('🔍 Pushing new state with', newLayers.length, 'layers');
      pushState(newLayers);
    },
    [layers, pushState]
  );

  const deleteLayer = useCallback(
    (layerId: string) => {
      const layer = layers.find((l) => l.id === layerId);
      if (layer && isImageLayer(layer) && layer.isBackground) {
        toast.error("Cannot delete background layer");
        return;
      }
      const newLayers = layers.filter((l) => l.id !== layerId);
      pushState(newLayers);
      setSelectedLayerId(null);
      toast.success("Layer deleted");
    },
    [layers, pushState, setSelectedLayerId]
  );

  /**
   * Reorder a layer in the stack
   * @param layerId - ID of the layer to move
   * @param direction - Direction to move: "up" (forward one), "down" (back one), "top" (to front), "bottom" (to back)
   */
  const reorderLayer = useCallback(
    (layerId: string, direction: "up" | "down" | "top" | "bottom") => {
      const currentIndex = layers.findIndex((l) => l.id === layerId);
      if (currentIndex === -1) return;

      let newLayers = [...layers];
      const [movedLayer] = newLayers.splice(currentIndex, 1);

      switch (direction) {
        case "up":
          // Move forward one position (higher z-index)
          if (currentIndex > 0) {
            newLayers.splice(currentIndex - 1, 0, movedLayer);
            toast.success("Layer moved up");
          }
          break;
        case "down":
          // Move back one position (lower z-index)
          if (currentIndex < layers.length - 1) {
            newLayers.splice(currentIndex + 1, 0, movedLayer);
            toast.success("Layer moved down");
          }
          break;
        case "top":
          // Move to front (highest z-index)
          newLayers.unshift(movedLayer);
          toast.success("Layer moved to top");
          break;
        case "bottom":
          // Move to back (lowest z-index)
          newLayers.push(movedLayer);
          toast.success("Layer moved to bottom");
          break;
      }

      pushState(newLayers);
    },
    [layers, pushState]
  );

  /**
   * Move a layer from one index to another
   * @param fromIndex - Current index of the layer
   * @param toIndex - Target index for the layer
   */
  const moveLayerToIndex = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex || fromIndex < 0 || fromIndex >= layers.length || toIndex < 0 || toIndex >= layers.length) {
        return;
      }

      const newLayers = [...layers];
      const [movedLayer] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, movedLayer);
      
      pushState(newLayers);
      toast.success("Layer reordered");
    },
    [layers, pushState]
  );

  return {
    fileInputRef,
    audioInputRef,
    videoInputRef,
    addTextLayer,
    addImageLayer,
    handleImageUpload,
    addAudioLayer,
    handleAudioUpload,
    addVideoLayer,
    handleVideoUpload,
    updateLayer,
    deleteLayer,
    reorderLayer,
    moveLayerToIndex,
  };
};