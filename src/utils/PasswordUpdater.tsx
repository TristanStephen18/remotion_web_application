import toast from "react-hot-toast";
import { backendPrefix } from "../config";

interface PasswordUpdateResponse {
  success?: boolean;
  error?: string;
  requires2FA?: boolean;
}

export async function updatePassword(
  oldPassword: string, 
  newPassword: string,
  twoFactorCode?: string // ✅ NEW: Optional 2FA code
): Promise<string | { requires2FA: true }> {
  try {
    const response = await fetch(`${backendPrefix}/auth/update-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include", 
      body: JSON.stringify({ 
        oldPassword, 
        newPassword,
        ...(twoFactorCode && { twoFactorCode }) 
      }),
    });

    const data: PasswordUpdateResponse = await response.json();
    
    if (!response.ok) {
      // ✅ NEW: Check if 2FA is required
      if (data.requires2FA) {
        return { requires2FA: true };
      }
      
      throw new Error(data.error || "Failed to update password");
    }

    return "success";
  } catch (error: any) {
    if (error.message) {
      toast.error(error.message);
    } else {
      toast.error("Password update failed");
    }
    return "error";
  }
}