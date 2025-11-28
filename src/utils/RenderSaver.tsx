import { backendPrefix } from "../config";

export async function saveRender(
  templateId: number,
  outputUrl: string,
  type: string
) {
  try {
    const response = await fetch(`${backendPrefix}/renders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        templateId,
        outputUrl,
        type,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    return "success";
  } catch (error: any) {
    console.log("error saving render: ", error.message);
    return "error";
  }
}
