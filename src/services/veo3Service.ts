// src/services/veo3Service.ts
import axios from "axios";
import { backendPrefix } from "../config";

export interface VEO3Generation {
  id: string;
  prompt: string;
  model: string;
  duration: string;
  aspectRatio: string;
  status: "pending" | "processing" | "completed" | "failed";
  videoUrl: string | null;
  thumbnailUrl: string | null;
  errorMessage: string | null;
  createdAt: string;
  referenceImageUrl?: string | null;
  referenceType?: string | null; 
}

export interface VEO3GenerateRequest {
  prompt: string;
  model: string;
  duration: string;
  aspectRatio: string;
  referenceImage?: File | null;
  referenceType?: 'ASSET' | 'STYLE'; 
}

class VEO3Service {
  async generateVideo(data: VEO3GenerateRequest) {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (data.referenceImage) {
      const formData = new FormData();
      formData.append("prompt", data.prompt);
      formData.append("model", data.model);
      formData.append("duration", data.duration);
      formData.append("aspectRatio", data.aspectRatio);
      formData.append("referenceImage", data.referenceImage);
      formData.append("referenceType", data.referenceType || 'ASSET'); 

      const response = await axios.post(
        `${backendPrefix}/api/veo3-video-generation/generate`,
        formData,
        { headers }
      );
      return response.data;
    }

    const response = await axios.post(
      `${backendPrefix}/api/veo3-video-generation/generate`,
      {
        prompt: data.prompt,
        model: data.model,
        duration: data.duration,
        aspectRatio: data.aspectRatio,
      },
      { headers: { ...headers, "Content-Type": "application/json" } }
    );
    return response.data;
  }

  async getGenerations(limit = 20, offset = 0) {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${backendPrefix}/api/veo3-video-generation/generations?limit=${limit}&offset=${offset}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  async deleteGeneration(id: string) {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${backendPrefix}/api/veo3-video-generation/generations/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
}

export const veo3Service = new VEO3Service();