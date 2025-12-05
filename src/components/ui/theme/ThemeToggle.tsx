import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

/**
 * ThemeToggle Component - Professional Button Style
 * 
 * A clean, button-style theme toggle that matches the editor's design system
 */
export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, colors } = useTheme();

  const isDark = theme === "dark";

  const styles = {
    button: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: "8px",
      color: colors.textPrimary,
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "500" as const,
      transition: "all 0.2s ease",
      height: "36px",
      whiteSpace: "nowrap" as const,
    },
    icon: {
      fontSize: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  return (
    <button
      onClick={toggleTheme}
      style={styles.button}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = colors.bgHover;
        e.currentTarget.style.borderColor = colors.borderHeavy;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = colors.bgSecondary;
        e.currentTarget.style.borderColor = colors.border;
      }}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span style={styles.icon}>
        {isDark ? "🌙" : "☀️"}
      </span>
      <span>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
};