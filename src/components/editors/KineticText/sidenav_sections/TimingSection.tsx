import React from "react";

interface TimingConfig {
  staggerDelay: number;
  collisionFrame: number;
  explosionDelay: number;
}

export interface KineticTimingProps {
  timing: TimingConfig;
  setTiming: React.Dispatch<React.SetStateAction<TimingConfig>>;
}

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

export const KineticTimingSection: React.FC<KineticTimingProps> = ({
  timing,
  setTiming,
}) => {
  // --- FIX #1: Corrected handler logic ---
  const handleTimingChange = (
    key: keyof TimingConfig,
    value: number
  ) => {
    // Pass a new object based on the props, not an updater function
    setTiming({
      ...timing,
      [key]: value,
    });
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
      <h3 style={{ marginBottom: "1rem", color: "#0077ff" }}>⏱️ Timing</h3>

      {/* --- FIX #2: Added fallbacks to 'value' props --- */}
      <SliderInput
        label="Stagger Delay"
        value={timing.staggerDelay || 5}
        min={0}
        max={20}
        step={1}
        onChange={(v) => handleTimingChange("staggerDelay", v)}
        unit="frames"
      />

      <SliderInput
        label="Collision Frame"
        value={timing.collisionFrame || 45}
        min={10}
        max={150}
        step={1}
        onChange={(v) => handleTimingChange("collisionFrame", v)}
        unit="frames"
      />

      <SliderInput
        label="Explosion Delay"
        value={timing.explosionDelay || 20}
        min={5}
        max={50}
        step={1}
        onChange={(v) => handleTimingChange("explosionDelay", v)}
        unit="frames"
      />

      <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "1rem" }}>
        Control the keyframes of the animation. All values are in frames (30
        frames = 1 second).
      </p>
    </div>
  );
};