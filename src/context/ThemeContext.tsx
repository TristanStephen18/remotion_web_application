import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Define your Color Palettes
export const themeColors = {
  dark: {
    bg: "#0a0a0a",
    surface: "#141414",
    surfaceHighlight: "#1f1f1f",
    border: "rgba(255,255,255,0.08)",
    text: "#e5e5e5",
    textSecondary: "#888888",
    accent: "#3b82f6",
    danger: "#ef4444",
    rulerBg: "#0f0f0f",
    trackBg: "#0a0a0a",
  },
  light: {
    bg: "#f3f4f6",           // Light gray background
    surface: "#ffffff",      // White panels
    surfaceHighlight: "#e5e7eb",
    border: "rgba(0,0,0,0.1)",
    text: "#111827",         // Dark text
    textSecondary: "#6b7280",
    accent: "#2563eb",       // Slightly darker blue for contrast
    danger: "#dc2626",
    rulerBg: "#f9fafb",
    trackBg: "#f3f4f6",
  }
};

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  mode: ThemeMode;
  colors: typeof themeColors.dark;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  // Optional: Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('editor-theme') as ThemeMode;
    if (saved) setMode(saved);
  }, []);

  const toggleTheme = () => {
    setMode(prev => {
      const newMode = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('editor-theme', newMode);
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, colors: themeColors[mode], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook for easy access
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};