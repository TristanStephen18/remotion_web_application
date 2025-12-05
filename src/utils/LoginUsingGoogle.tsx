import { googleLogin } from "../services/authService";

export async function loginWithGoogle(email: string) {
  try {
    const response = await googleLogin(email);
    if (!response.success) {
      throw new Error(response.error || "Login failed");
    }
    return { success: true, user: response.user };
  } catch (error: any) {
    console.error("Google login error:", error);
    throw error;
  }
}