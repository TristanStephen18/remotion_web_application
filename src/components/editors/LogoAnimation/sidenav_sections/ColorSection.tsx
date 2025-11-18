import type React from "react";

export interface LogoColorProps {
  color: string;
  setColor: (color: string) => void;
}

export const LogoColorSection: React.FC<LogoColorProps> = ({
  color,
  setColor,
}) => {
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
      <h3 style={{ marginBottom: "1rem", color: "#0077ff" }}>🎨 Base Color</h3>

      <div style={colorInputStyle}>
        <label style={labelStyle}>Base Color</label>
        <input
          type="color"
          value={color || "#FFD700"}
          onChange={(e) => setColor(e.target.value)}
          style={inputStyle}
        />
      </div>

      <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "1rem" }}>
        Adjust the primary color for the liquid fill and glow.
      </p>
    </div>
  );
};