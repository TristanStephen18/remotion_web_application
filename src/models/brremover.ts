export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  preview: string;
  status: "uploading" | "complete" | "processing" | "error";
  progress: number;
  processedUrl?: string;
  error?: string;
}