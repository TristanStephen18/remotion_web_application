import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

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
      `${API_BASE_URL}/api/veo3/generate`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
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