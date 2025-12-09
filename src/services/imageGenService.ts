import axios from "axios";
import { backendPrefix } from "../config";

export interface ImageGeneration {
  id: string;
  prompt: string;
  model: string;
  aspectRatio: string;
  imageUrl: string;
  status: "completed" | "failed";
  errorMessage: string | null;
  createdAt: string;
  metadata?: any;
}

export interface SaveImageGenerationRequest {
  prompt: string;
  model: string;
  aspectRatio: string;
  imageUrl: string;
}

class ImageGenService {
  async saveGeneration(data: SaveImageGenerationRequest) {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${backendPrefix}/api/image-generation/save`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  async getGenerations(limit = 20, offset = 0) {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${backendPrefix}/api/image-generation/generations?limit=${limit}&offset=${offset}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  async deleteGeneration(id: string) {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${backendPrefix}/api/image-generation/generations/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
}

export const imageGenService = new ImageGenService();