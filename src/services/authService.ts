import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    name: string;
  };
  requires2FA?: boolean;
  tempToken?: string;
  error?: string;
}

interface RefreshTokenResponse {
  success: boolean;
  token: string;
}

// ✅ NEW: Token manager with auto-refresh
class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null;

  startAutoRefresh() {
    // Refresh token every 14 minutes (1 minute before expiry)
    this.refreshTimer = setInterval(() => {
      this.refreshAccessToken();
    }, 14 * 60 * 1000);
  }

  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  async refreshAccessToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include", // ✅ Send cookies
      });

      if (!response.ok) {
        // Refresh failed, redirect to login
        this.stopAutoRefresh();
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      const data: RefreshTokenResponse = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.stopAutoRefresh();
      window.location.href = "/login";
    }
  }
}

export const tokenManager = new TokenManager();

// ✅ Signup
export const signup = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Signup failed" };
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Network error. Please try again." };
  }
};

// ✅ Login
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ CRITICAL: Send/receive cookies
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Login failed" };
    }

    // ✅ Check if 2FA required
    if (data.requires2FA) {
      return {
        success: false,
        requires2FA: true,
        tempToken: data.tempToken,
        message: data.message,
      };
    }

    // ✅ Store token and start auto-refresh
    if (data.token) {
      localStorage.setItem("token", data.token);
      tokenManager.startAutoRefresh();
    }

    return { success: true, token: data.token, user: data.user };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Network error. Please try again." };
  }
};

// ✅ Verify 2FA
export const verify2FA = async (tempToken: string, code: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-2fa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ tempToken, code }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "2FA verification failed" };
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      tokenManager.startAutoRefresh();
    }

    return { success: true, token: data.token, user: data.user };
  } catch (error) {
    console.error("2FA verification error:", error);
    return { success: false, error: "Network error. Please try again." };
  }
};

// ✅ Logout
export const logout = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("token");

    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
    });

    // ✅ Clean up
    tokenManager.stopAutoRefresh();
    localStorage.removeItem("token");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    window.location.href = "/login";
  }
};

// ✅ Get current user
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
};

// ✅ Google login
export const googleLogin = async (email: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Google login failed" };
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      tokenManager.startAutoRefresh();
    }

    return { success: true, token: data.token, user: data.user };
  } catch (error) {
    console.error("Google login error:", error);
    return { success: false, error: "Network error. Please try again." };
  }
};

// ✅ Send OTP
export const sendOTP = async (email: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    return await response.json();
  } catch (error) {
    console.error("Send OTP error:", error);
    return { success: false, error: "Failed to send OTP" };
  }
};

// ✅ Verify OTP
export const verifyOTP = async (email: string, otp: string, otpToken: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, otp, otpToken }),
    });

    return await response.json();
  } catch (error) {
    console.error("Verify OTP error:", error);
    return { success: false, error: "Failed to verify OTP" };
  }
};

// ✅ Reset password
export const resetPassword = async (
  email: string,
  newPassword: string,
  resetToken: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, newPassword, resetToken }),
    });

    return await response.json();
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, error: "Failed to reset password" };
  }
};