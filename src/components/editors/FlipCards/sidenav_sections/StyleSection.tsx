import React from 'react';

interface StyleConfig {
  flipDuration: number;
  spacing: number;
  cardWidth: number;
  backgroundGradient: string[];
}

export interface FlipCardsStyleProps {
  style: StyleConfig;
  setStyle: (style: StyleConfig) => void;
}

// Reusable Slider Component
const SliderInput: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
  tooltip?: string;
}> = ({ label, value, min, max, step, onChange, unit = '', tooltip }) => (
  <label style={{ display: 'block', marginBottom: '1rem' }} title={tooltip}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
      <span style={{ fontWeight: 600, color: '#333' }}>{label}</span>
      <span style={{ color: '#0077ff', fontVariantNumeric: 'tabular-nums' }}>
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
      style={{ width: '100%' }}
    />
  </label>
);

// Reusable Color Input
const ColorInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
    <label style={{ fontWeight: 600, color: '#333' }}>{label}</label>
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '100px', height: '30px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
    />
  </div>
);

export const FlipCardsStyleSection: React.FC<FlipCardsStyleProps> = ({
  style,
  setStyle,
}) => {
  const handleStyleChange = (
    key: keyof StyleConfig,
    value: number | string | string[]
  ) => {
    setStyle({ ...style, [key]: value });
  };

  const handleGradientChange = (index: number, color: string) => {
    const newGradient = [...style.backgroundGradient];
    newGradient[index] = color;
    handleStyleChange('backgroundGradient', newGradient);
  };

  return (
    <div
      style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        border: '1px solid #eee',
      }}
    >
      <h3 style={{ marginBottom: '1rem', color: '#0077ff' }}>✨ Style</h3>

      <SliderInput
        label="Flip Duration"
        value={style.flipDuration || 0.8}
        min={0.1}
        max={5}
        step={0.1}
        onChange={(v) => handleStyleChange('flipDuration', v)}
        unit="s"
      />

      <SliderInput
        label="Card Spacing"
        value={style.spacing || 20}
        min={0}
        max={100}
        step={1}
        onChange={(v) => handleStyleChange('spacing', v)}
        unit="px"
      />

      <SliderInput
        label="Card Width (0 = Auto)"
        value={style.cardWidth || 0}
        min={0}
        max={1000}
        step={10}
        onChange={(v) => handleStyleChange('cardWidth', v)}
        unit="px"
        tooltip="Set to 0 for automatic width calculation"
      />
      
      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

      <div style={{ marginBottom: '0.3rem', color: '#333', fontWeight: 600 }}>
        Background Gradient
      </div>
      <ColorInput
        label="Start"
        value={style.backgroundGradient[0] || '#0f0f23'}
        onChange={(v) => handleGradientChange(0, v)}
      />
      <ColorInput
        label="Mid"
        value={style.backgroundGradient[1] || '#1a1a2e'}
        onChange={(v) => handleGradientChange(1, v)}
      />
      <ColorInput
        label="End"
        value={style.backgroundGradient[2] || '#16213e'}
        onChange={(v) => handleGradientChange(2, v)}
      />

      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem' }}>
        Control card animations, layout, and background.
      </p>
    </div>
  );
};