import React from 'react';
import { type NeonConfig } from '../../../remotion_compositions/neonConfig'; 
import { SliderInput } from '../../Global/SliderInput';
import { CheckboxInput } from '../../Global/CheckboxInput'; 

export interface NeonEffectsProps {
  effects: NeonConfig['effects'];
  setEffects: (effects: NeonConfig['effects']) => void;
}

export const NeonEffectsSection: React.FC<NeonEffectsProps> = ({
  effects,
  setEffects,
}) => {
  const handleEffectChange = (
    key: keyof NeonConfig['effects'],
    value: number | boolean
  ) => {
    setEffects({
      ...effects,
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
      <h3 style={{ marginBottom: '1rem', color: '#0077ff' }}>✨ Effects</h3>

      <SliderInput
        label="Font Size"
        value={effects.fontSize || 120}
        min={40}
        max={250}
        step={1}
        onChange={(v) => handleEffectChange('fontSize', v)}
        unit="px"
      />

      <SliderInput
        label="Glow Pulse Min"
        value={effects.glowPulseMin || 5}
        min={1}
        max={30}
        step={1}
        onChange={(v) => handleEffectChange('glowPulseMin', v)}
        unit="px"
      />

      <SliderInput
        label="Glow Pulse Max"
        value={effects.glowPulseMax || 20}
        min={10}
        max={100}
        step={1}
        onChange={(v) => handleEffectChange('glowPulseMax', v)}
        unit="px"
      />

      <CheckboxInput
        label="Show Grain Overlay"
        checked={effects.showGrain}
        onChange={(v) => handleEffectChange('showGrain', v)}
      />

      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem' }}>
        Adjust the visual flair of the neon text.
      </p>
    </div>
  );
};