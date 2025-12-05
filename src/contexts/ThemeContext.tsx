import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: ThemeColors;
}

export interface ThemeColors {
  // Backgrounds
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgHover: string;
  bgActive: string;
  
  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  
  // Borders
  border: string;
  borderLight: string;
  borderHeavy: string;
  
  // Accent
  accent: string;
  accentHover: string;
  
  // Status
  success: string;
  warning: string;
  danger: string;
  dangerHover: string;
  
  // UI Elements
  inputBg: string;
  inputBorder: string;
  sliderTrack: string;
  sliderThumb: string;
}

const darkTheme: ThemeColors = {
  bgPrimary: '#0a0a0a',
  bgSecondary: '#141414',
  bgTertiary: '#1f1f1f',
  bgHover: 'rgba(255,255,255,0.05)',
  bgActive: 'rgba(255,255,255,0.1)',
  
  textPrimary: '#e5e5e5',
  textSecondary: '#ccc',
  textTertiary: '#aaa',
  textMuted: '#888',
  
  border: 'rgba(255,255,255,0.08)',
  borderLight: 'rgba(255,255,255,0.06)',
  borderHeavy: 'rgba(255,255,255,0.1)',
  
  accent: '#3b82f6',
  accentHover: '#2563eb',
  
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#dc2626',
  dangerHover: '#b91c1c',
  
  inputBg: '#141414',
  inputBorder: 'rgba(255,255,255,0.08)',
  sliderTrack: '#3b82f6',
  sliderThumb: '#3b82f6',
};

const lightTheme: ThemeColors = {
  bgPrimary: '#ffffff',
  bgSecondary: '#f5f5f5',
  bgTertiary: '#e5e5e5',
  bgHover: 'rgba(0,0,0,0.05)',
  bgActive: 'rgba(0,0,0,0.1)',
  
  textPrimary: '#1a1a1a',
  textSecondary: '#333',
  textTertiary: '#555',
  textMuted: '#777',
  
  border: 'rgba(0,0,0,0.12)',
  borderLight: 'rgba(0,0,0,0.08)',
  borderHeavy: 'rgba(0,0,0,0.16)',
  
  accent: '#3b82f6',
  accentHover: '#2563eb',
  
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#dc2626',
  dangerHover: '#b91c1c',
  
  inputBg: '#ffffff',
  inputBorder: 'rgba(0,0,0,0.12)',
  sliderTrack: '#3b82f6',
  sliderThumb: '#3b82f6',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize theme from localStorage or default to 'dark'
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('editor-theme') as Theme;
    return savedTheme || 'dark';
  });

  const colors = theme === 'dark' ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('editor-theme', newTheme);
      return newTheme;
    });
  };

  // Apply theme to document root for global styles
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};