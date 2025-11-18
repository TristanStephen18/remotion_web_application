import React from "react";

export const CheckboxInput: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <label
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: "1rem",
      cursor: "pointer",
      fontWeight: 600,
      color: "#333",
    }}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{ marginRight: "0.5rem", width: "16px", height: "16px" }}
    />
    {label}
  </label>
);

export default CheckboxInput;