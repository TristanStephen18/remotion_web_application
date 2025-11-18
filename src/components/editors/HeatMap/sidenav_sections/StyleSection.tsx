import React from 'react';

interface StyleConfig {
  maxValue: number;
  backgroundStyle: 'gradient' | 'radial';
}

export interface HeatmapStyleProps {
  style: StyleConfig;
  setStyle: (style: StyleConfig) => void;
}

const SliderInput: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
}> = ({ label, value, min, max, step, onChange, unit = '' }) => (
  <label style={{ display: 'block', marginBottom: '1rem' }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.3rem',
      }}
    >
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

export const HeatmapStyleSection: React.FC<HeatmapStyleProps> = ({
  style,
  setStyle,
}) => {
  const handleStyleChange = (
    key: keyof StyleConfig,
    value: number | string
  ) => {
    setStyle({
      ...style,
      [key]: value,
    });
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
        label="Max Scale Value"
        value={style.maxValue || 100}
        min={10}
        max={1000}
        step={10}
        onChange={(v) => handleStyleChange('maxValue', v)}
        unit="%"
      />

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '0.3rem', color: '#333', fontWeight: 600 }}>
          Background Style
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <input
              type="radio"
              name="bgStyle"
              value="gradient"
              checked={style.backgroundStyle === 'gradient'}
              onChange={() => handleStyleChange('backgroundStyle', 'gradient')}
            />
            Gradient
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <input
              type="radio"
              name="bgStyle"
              value="radial"
              checked={style.backgroundStyle === 'radial'}
              onChange={() => handleStyleChange('backgroundStyle', 'radial')}
            />
            Radial
          </label>
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem' }}>
        Control the color scale's maximum value and the background appearance.
      </p>
    </div>
  );
};