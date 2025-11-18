import type React from "react";

export interface LogoTextProps {
  text: string;
  setText: (text: string) => void;
}

export const LogoTextSection: React.FC<LogoTextProps> = ({
  text,
  setText,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
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
      }}
    >
      <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>
        📝 Text Content
      </h3>

      <label style={{ display: "block", marginBottom: "1rem" }}>
        <div style={{ marginBottom: "0.3rem", color: "#333", fontWeight: 600 }}>
          Logo Text
        </div>
        <input
          type="text"
          value={text}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#fafafa",
            fontSize: 16,
          }}
        />
      </label>
      <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "-0.5rem" }}>
        This text will be used for the animation.
      </p>
    </div>
  );
};