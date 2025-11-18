import React from "react";

export const SliderInput: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
}> = ({ label, value, min, max, step, onChange, unit = "" }) => (
  <label style={{ display: "block", marginBottom: "1rem" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "0.3rem",
      }}
    >
      <span style={{ fontWeight: 600, color: "#333" }}>{label}</span>
      <span style={{ color: "#0077ff", fontVariantNumeric: "tabular-nums" }}>
        {value} {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: "100%" }}
    />
  </label>
);

export default SliderInput;