export interface Generation {
  url: string;
  aspectRatio: string;
  model: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  preview: string;
  status: "uploading" | "processing" | "complete" | "error";
  progress: number;
  processedUrl?: string;
  error?: string;
}