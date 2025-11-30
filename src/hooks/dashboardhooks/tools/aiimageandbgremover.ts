import { useState } from "react";
import type { Generation, UploadedFile } from "../../../models/imagegenandbgremove";

export function useAiImageAndBgRemoveHooks ()  {
    //aiimagegeneratorhooks
     const [pollinationsModel, setPollinationsModel] = useState<string>("flux");
      const [aspectRatio, setAspectRatio] = useState<
        "9:16" | "16:9" | "1:1" | "4:5"
      >("9:16");
      const [prompt, setPrompt] = useState("");
      const [imageLoading, setImageLoading] = useState(false);
    
      const [recentGenerations, setRecentGenerations] = useState<Generation[]>([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const [currentImage, setCurrentImage] = useState<string | null>(null);

      //bgremovehooks
      const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
        const [isDragging, setIsDragging] = useState(false);
        const [originalFile, setOriginalFile] = useState<File | null>(null);

      return {
        pollinationsModel,
        setPollinationsModel,
        aspectRatio,
        setAspectRatio,
        prompt,
        setPrompt,
        imageLoading,
        setImageLoading,
        recentGenerations,
        setRecentGenerations,
        loading,
        setLoading,
        error,
        setError, 
        currentImage,
        setCurrentImage,
        uploadedFile,
        setUploadedFile,
        isDragging,
        setIsDragging,
        originalFile,
        setOriginalFile
      }
}