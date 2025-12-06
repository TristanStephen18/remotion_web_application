import { backendPrefix } from "../config";

// ============================================================================
// TYPES
// ============================================================================

export interface MediaUpload {
  id: number;
  user_id: number;
  filename: string;
  original_filename: string;
  file_type: string;
  media_category: "image" | "video" | "audio";
  file_size: number;
  storage_url: string;
  thumbnail_url?: string;
  public_id?: string;
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
  created_at: string;
  updated_at: string;
}

export interface MediaResponse {
  success: boolean;
  media?: MediaUpload | MediaUpload[];
  message?: string;
  error?: string;
  total?: number;
  limit?: number;
  offset?: number;
}

export interface MediaStats {
  by_category: Array<{
    media_category: string;
    count: string;
    total_size: string;
  }>;
  total_files: number;
  total_storage_bytes: number;
}

// ============================================================================
// MEDIA SERVICE
// ============================================================================

/**
 * Upload media files to the server
 */
export const uploadMedia = async (files: File[]): Promise<MediaResponse> => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return { success: false, error: "Not authenticated" };
    }

    // Create FormData for file upload
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch(`${backendPrefix}/media/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - browser will set it with boundary for FormData
      },
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Upload failed" };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Network error during upload" };
  }
};

/**
 * Get all media for the current user
 */
export const getUserMedia = async (
  category?: "image" | "video" | "audio",
  limit: number = 50,
  offset: number = 0
): Promise<MediaResponse> => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return { success: false, error: "Not authenticated" };
    }

    // Build query parameters
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());

    const response = await fetch(
      `${backendPrefix}/media?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Failed to fetch media" };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch media error:", error);
    return { success: false, error: "Network error while fetching media" };
  }
};

/**
 * Get specific media by ID
 */
export const getMediaById = async (id: number): Promise<MediaResponse> => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return { success: false, error: "Not authenticated" };
    }

    const response = await fetch(`${backendPrefix}/media/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Failed to fetch media" };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch media error:", error);
    return { success: false, error: "Network error while fetching media" };
  }
};

/**
 * Delete media by ID
 */
export const deleteMedia = async (id: number): Promise<MediaResponse> => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return { success: false, error: "Not authenticated" };
    }

    const response = await fetch(`${backendPrefix}/media/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Failed to delete media" };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Delete media error:", error);
    return { success: false, error: "Network error while deleting media" };
  }
};

/**
 * Get user's media statistics
 */
export const getMediaStats = async (): Promise<{
  success: boolean;
  stats?: MediaStats;
  error?: string;
}> => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return { success: false, error: "Not authenticated" };
    }

    const response = await fetch(`${backendPrefix}/media/stats/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Failed to fetch stats" };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch stats error:", error);
    return { success: false, error: "Network error while fetching stats" };
  }
};

/**
 * Convert MediaUpload to the format expected by the editor
 */
export const convertToEditorFormat = (media: MediaUpload) => {
  return {
    id: media.id.toString(),
    name: media.original_filename,
    type: media.file_type,
    url: media.storage_url,
    thumbnail: media.thumbnail_url || media.storage_url,
    duration: media.duration,
    preview: media.thumbnail_url || media.storage_url,
    width: media.width,
    height: media.height,
    mediaCategory: media.media_category,
    dbId: media.id, // Keep original DB ID for deletion
  };
};

/**
 * Batch upload with progress tracking
 */
export const uploadMediaWithProgress = async (
  files: File[],
  onProgress?: (progress: number, uploadedCount: number, total: number) => void
): Promise<MediaResponse> => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return { success: false, error: "Not authenticated" };
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress, 0, files.length);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } else {
          const error = JSON.parse(xhr.responseText);
          resolve({ success: false, error: error.error || "Upload failed" });
        }
      });

      xhr.addEventListener("error", () => {
        reject({ success: false, error: "Network error during upload" });
      });

      xhr.open("POST", `${backendPrefix}/media/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(formData);
    });
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Network error during upload" };
  }
};