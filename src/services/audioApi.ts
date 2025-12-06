import { backendPrefix } from "../config";

interface EnhanceAudioResponse {
  success: boolean;
  audioUrl: string;
  transcript?: string;
  confidence?: number;
}

export async function enhanceAudio(
  audioBlob: Blob,
  options: {
    denoiseLevel: number;
    enhanceClarity: boolean;
    removeEcho: boolean;
  }
): Promise<EnhanceAudioResponse> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "audio.mp3"); // matches upload.single("audio")
  formData.append("denoiseLevel", options.denoiseLevel.toString());
  formData.append("enhanceClarity", options.enhanceClarity.toString());
  formData.append("removeEcho", options.removeEcho.toString());

  try {
    // ✅ correct backend path that uses enhanceSpeech.ts
    const url = `${backendPrefix}/api/tools/speech-enhancement/enhance-speech`;
    console.log("🎙️ Sending request to:", url);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.details ||
          errorData.error ||
          `HTTP ${response.status}`
      );
    }

    const data = await response.json();
    console.log("✅ Enhancement successful", data);
    return data as EnhanceAudioResponse;
  } catch (error: any) {
    console.error("❌ API Error:", error);
    if (error.message === "Failed to fetch") {
      throw new Error(
        "Cannot connect to backend. Make sure it's running on http://localhost:3000"
      );
    }
    throw new Error(error.message || "Audio enhancement failed");
  }
}