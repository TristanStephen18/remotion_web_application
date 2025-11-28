//main renderer of videos using Lambda
import toast from "react-hot-toast";
import { backendPrefix } from "../config";
import { saveRender } from "./RenderSaver";

export async function renderVideo(
  inputProps: any,
  templateId: number,
  compositionId: string,
  format: string
) {
  let toastId: string | undefined;

  try {
    // Step 1: Start the Lambda render
    console.log('🚀 Starting Lambda render...');
    toastId = toast.loading('Starting render...');

    const startResponse = await fetch(
      `${backendPrefix}/generatevideo/lambda-render`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputProps,
          compositionId,
          format,
        }),
      }
    );

    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      throw new Error(`Failed to start render: ${errorText}`);
    }

    const { renderId, bucketName, statusUrl } = await startResponse.json();
    console.log('✅ Render started:', renderId);

    // Step 2: Poll for completion
    return await new Promise<string>((resolve, reject) => {
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(
            `${backendPrefix}${statusUrl}`
          );

          if (!statusResponse.ok) {
            throw new Error('Failed to check render status');
          }

          const status = await statusResponse.json();

          if (status.done) {
            clearInterval(pollInterval);

            if (status.success) {
              console.log('✅ Render complete!', status.url);
              
              // Update toast to success
              if (toastId) {
                toast.success('Video rendered successfully!', { id: toastId });
              }

              // Save the render
              const saveResponse = await saveRender(templateId, status.url, format);

              if (saveResponse === "error") {
                toast.error("There was an error saving your export...");
              } else {
                toast.success("Export saved to your renders");
              }

              resolve(status.url);
            } else {
              console.error('❌ Render failed:', status.error);
              if (toastId) {
                toast.error(`Render failed: ${status.error}`, { id: toastId });
              }
              reject(new Error(status.error || 'Render failed'));
            }
          } else {
            // Update progress
            const percent = Math.round((status.progress || 0) * 100);
            console.log(`⏳ Rendering: ${percent}%`);
            
            if (toastId) {
              toast.loading(`Rendering: ${percent}%`, { id: toastId });
            }
          }
        } catch (error: any) {
          clearInterval(pollInterval);
          console.error('❌ Error checking status:', error);
          if (toastId) {
            toast.error('Error checking render status', { id: toastId });
          }
          reject(error);
        }
      }, 2000); // Poll every 2 seconds

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (toastId) {
          toast.error('Render timeout - took too long', { id: toastId });
        }
        reject(new Error('Render timeout'));
      }, 300000);
    });

  } catch (error: any) {
    console.error("Error rendering video:", error.message);
    if (toastId) {
      toast.error(`Render error: ${error.message}`, { id: toastId });
    }
    return "error";
  }
}