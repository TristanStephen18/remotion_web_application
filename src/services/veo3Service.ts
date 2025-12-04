// src/services/veo3Service.ts
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

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
        `${API_BASE_URL}/api/veo3/generate`,
        formData,
        { headers }
      );
      return response.data;
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/veo3/generate`,
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
      `${API_BASE_URL}/api/veo3/generations?limit=${limit}&offset=${offset}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  async deleteGeneration(id: string) {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_BASE_URL}/api/veo3/generations/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
}

export const veo3Service = new VEO3Service();