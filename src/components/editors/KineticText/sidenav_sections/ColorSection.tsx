import type React from "react";

interface ColorConfig {
  primary: string;
  secondary: string;
  accent: string;
}

export interface KineticColorProps {
  colors: ColorConfig;
  setColors: React.Dispatch<React.SetStateAction<ColorConfig>>;
}

export const KineticColorSection: React.FC<KineticColorProps> = ({
  colors,
  setColors,
}) => {
  const handleColorChange = (
    key: keyof ColorConfig,
    value: string
  ) => {
    // Pass the new complete colors object to the setColors prop
    setColors({
      ...colors,
      [key]: value,
    });
  };

  const colorInputStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem",
    padding: "0.5rem",
    background: "#fafafa",
    borderRadius: "8px",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 600,
    color: "#333",
  };

  const inputStyle: React.CSSProperties = {
    width: "100px",
    height: "30px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        marginBottom: "1.5rem",
        padding: "1rem",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        border: "1px solid #eee",
        overflow: "visible",
      }}
    >
      <h3 style={{ marginBottom: "1rem", color: "#0077ff" }}>🎨 Colors</h3>

      <div style={colorInputStyle}>
        <label style={labelStyle}>Primary Color</label>
        <input
          type="color"
          value={colors.primary || "#00f2ff"}
          onChange={(e) => handleColorChange("primary", e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* --- THIS IS THE FIX --- */}
      {/* It was 'colorInputInputStyle', now it is 'colorInputStyle' */}
      <div style={colorInputStyle}>
        <label style={labelStyle}>Secondary Color</label>
        <input
          type="color"
          value={colors.secondary || "#ff4fa3"}
          onChange={(e) => handleColorChange("secondary", e.target.value)}
          style={inputStyle}
        />
      </div>
      {/* --------------------- */}

      <div style={colorInputStyle}>
        <label style={labelStyle}>Accent Color</label>
        <input
          type="color"
          value={colors.accent || "#ffffff"}
          onChange={(e) => handleColorChange("accent", e.target.value)}
          style={inputStyle}
        />
      </div>

      <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "1rem" }}>
        Adjust the main colors for the text gradient, energy ball, and
        particles.
      </p>
    </div>
  );
};