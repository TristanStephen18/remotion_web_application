import toast from "react-hot-toast";
import { renderVideoUsingLambdaWithoutSaving } from "./lambdaRenderingwithoutdbsave";
import { backendPrefix } from "../config";

export async function saveNewDesign(
  templateId: number,
  props: any,
  title: string
) {
  try {
    const videourl = await renderVideoUsingLambdaWithoutSaving(
      { config: props.layers },
      "mp4"
    );
    if (videourl === "error") throw new Error("Error saving design");
    const saveResponse = await fetch(`${backendPrefix}/projects/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title,
        templateId,
        props,
        projectVidUrl: videourl,
      }),
    });
    if (!saveResponse.ok) throw new Error("Error saving design");
    return "success";
  } catch (error: any) {
    toast.error("Error saving project");
    return "error";
  }
}

export async function saveExistingProject(projectId: string, props: any, screenshot: string) {
  try {
    const saveResponse = await fetch(`${backendPrefix}/projects/update/${projectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        props,
        screenshot
      }),
    });
    if (!saveResponse.ok) throw new Error("Error saving design");
    return "success";
  } catch (error: any) {
    // throw new Error("Error")
    // toast.error("There was an error saving your project");
    return "error";
  }
}
