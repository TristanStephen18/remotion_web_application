import { useState } from "react";
import type { Generation } from "../../../models/imagegenandbgremove";
import type { UploadedFile } from "../../../models/brremover";

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
      const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[] | []>([]);
        const [isDragging, setIsDragging] = useState(false);
        const [originalFile, setOriginalFile] = useState<Map<string, File>>(new Map());

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
        uploadedFiles,
        setUploadedFiles,
        isDragging,
        setIsDragging,
        originalFile,
        setOriginalFile
      }
}