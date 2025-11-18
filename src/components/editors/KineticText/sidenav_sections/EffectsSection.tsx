import React from "react";

interface EffectsConfig {
  shakeIntensity: number;
  particleCount: number;
  ballSize: number;
}

export interface KineticEffectsProps {
  effects: EffectsConfig;
  setEffects: React.Dispatch<React.SetStateAction<EffectsConfig>>;
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

export const KineticEffectsSection: React.FC<KineticEffectsProps> = ({
  effects,
  setEffects,
}) => {
  // --- FIX #1: Corrected handler logic ---
  const handleEffectChange = (
    key: keyof EffectsConfig,
    value: number
  ) => {
    // Pass a new object based on the props, not an updater function
    setEffects({
      ...effects,
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
      <h3 style={{ marginBottom: "1rem", color: "#0077ff" }}>✨ Effects</h3>

      {/* --- FIX #2: Added fallbacks to 'value' props --- */}
      <SliderInput
        label="Shake Intensity"
        value={effects.shakeIntensity || 12}
        min={0}
        max={50}
        step={1}
        onChange={(v) => handleEffectChange("shakeIntensity", v)}
        unit="px"
      />

      <SliderInput
        label="Particle Count"
        value={effects.particleCount || 70}
        min={0}
        max={200}
        step={5}
        onChange={(v) => handleEffectChange("particleCount", v)}
      />

      <SliderInput
        label="Energy Ball Size"
        value={effects.ballSize || 120}
        min={20}
        max={300}
        step={5}
        onChange={(v) => handleEffectChange("ballSize", v)}
        unit="px"
      />

      <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "1rem" }}>
        Adjust the visual flair of the collision and explosion.
      </p>
    </div>
  );
};