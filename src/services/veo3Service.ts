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
}

export interface VEO3GenerateRequest {
  prompt: string;
  model: string;
  duration: string;
  aspectRatio: string;
}

class VEO3Service {
  async generateVideo(data: VEO3GenerateRequest) {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${backendPrefix}/api/veo3-video-generation/generate`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
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