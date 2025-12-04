import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface YouTubeVideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  formats: Array<{
    quality: string;
    filesize: number;
    type: string;
  }>;
}

export interface YouTubeDownload {
  id: string;
  userId: number;
  videoId: string;
  videoUrl: string;
  title: string;
  thumbnail: string | null;
  duration: string | null;
  views: string | null;
  likes: string | null;
  quality: string;
  filesize: number | null;
  downloadedVideoUrl: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  errorMessage: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  completedAt: string | null;
}

export interface YouTubeAPIResponse {
  success: boolean;
  video?: YouTubeVideoInfo;
  download?: YouTubeDownload;
  downloads?: YouTubeDownload[];
  downloadUrl?: string;
  error?: string;
  message?: string;
}

class YouTubeService {
  /**
   * Get video information from YouTube URL
   */
  async getVideoInfo(url: string): Promise<YouTubeAPIResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/api/youtube-v2/info`,
      { url }
    );
    return response.data;
  }

  /**
   * Download video at specified quality
   */
  async downloadVideo(url: string, quality: string): Promise<YouTubeAPIResponse> {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/api/youtube-v2/download`,
      { url, quality },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get user's download history
   */
  async getDownloads(limit = 20, offset = 0): Promise<YouTubeAPIResponse> {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/api/youtube-v2/downloads?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get single download by ID
   */
  async getDownloadById(id: string): Promise<YouTubeAPIResponse> {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/api/youtube-v2/downloads/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete download from history and Cloudinary
   */
  async deleteDownload(id: string): Promise<YouTubeAPIResponse> {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_BASE_URL}/api/youtube-v2/downloads/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

export const youtubeService = new YouTubeService();