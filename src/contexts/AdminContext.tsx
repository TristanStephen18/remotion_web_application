import React, { createContext, useContext, useState, useEffect } from "react";
import { backendPrefix } from "../config";

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AdminContextType {
  admin: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin token exists in localStorage
    const savedToken = localStorage.getItem("admin_token");
    const savedAdmin = localStorage.getItem("admin_user");

    if (savedToken && savedAdmin) {
      setToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
    }

    setIsLoading(false);
  }, []);

   // ✅ NEW: Cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      console.log("🔄 Storage change detected:", e.key);

      // ✅ Detect logout in another tab
      if (e.key === "admin_token" && e.newValue === null) {
        console.log("🚪 Logout detected in another tab");
        setToken(null);
        setAdmin(null);
        window.location.href = "/admin/login";
      }

      // ✅ Detect login in another tab
      if (e.key === "admin_token" && e.newValue !== null) {
        console.log("✅ Login detected in another tab");
        const savedAdmin = localStorage.getItem("admin_user");
        if (savedAdmin) {
          try {
            setToken(e.newValue);
            setAdmin(JSON.parse(savedAdmin));
            
            // Only redirect to dashboard if not already there
            if (!window.location.pathname.startsWith("/admin/dashboard")) {
              window.location.href = "/admin/dashboard";
            }
          } catch (error) {
            console.error("Failed to parse admin user:", error);
          }
        }
      }
    };

    // ✅ Listen for storage changes in other tabs
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${backendPrefix}/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Login failed");
    }

    setToken(data.token);
    setAdmin(data.admin);

    localStorage.setItem("admin_token", data.token);
    localStorage.setItem("admin_user", JSON.stringify(data.admin));
  };

  const logout = () => {
    console.log("🚪 Admin logging out");
    setToken(null);
    setAdmin(null);
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  };

  return (
    <AdminContext.Provider value={{ admin, token, login, logout, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};