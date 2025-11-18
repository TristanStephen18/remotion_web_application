import React from "react";

interface TimingConfig {
  durationOutline: number;
  durationFill: number;
}

export interface LogoTimingProps {
  timing: TimingConfig;
  setTiming: (newTiming: Partial<TimingConfig>) => void;
}

// Re-usable SliderInput component
const SliderInput: React.FC<{
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

export const LogoTimingSection: React.FC<LogoTimingProps> = ({
  timing,
  setTiming,
}) => {
  const handleTimingChange = (
    key: keyof TimingConfig,
    value: number
  ) => {
    setTiming({ [key]: value });
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
      <h3 style={{ marginBottom: "1rem", color: "#0077ff" }}>⏱️ Animation Timing</h3>

      <SliderInput
        label="Outline Duration"
        value={timing.durationOutline || 2}
        min={0.5}
        max={10}
        step={0.1}
        onChange={(v) => handleTimingChange("durationOutline", v)}
        unit="seconds"
      />

      <SliderInput
        label="Fill Duration"
        value={timing.durationFill || 2.5}
        min={0.5}
        max={10}
        step={0.1}
        onChange={(v) => handleTimingChange("durationFill", v)}
        unit="seconds"
      />

      <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "1rem" }}>
        Control the duration of each animation phase in seconds.
      </p>
    </div>
  );
};