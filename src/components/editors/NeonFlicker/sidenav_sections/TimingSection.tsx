/*
FILENAME: NeonTimingSection.tsx
(New section file, adapted from TimingSection.tsx)
*/
import React from 'react';
import { type NeonConfig } from '../../../remotion_compositions/neonConfig';  // Adjust path
import { SliderInput } from '../../Global/SliderInput'; // Assuming you have a reusable slider

export interface NeonTimingProps {
  timing: NeonConfig['timing'];
  setTiming: (timing: NeonConfig['timing']) => void;
}

export const NeonTimingSection: React.FC<NeonTimingProps> = ({
  timing,
  setTiming,
}) => {
  const handleTimingChange = (
    key: keyof NeonConfig['timing'],
    value: number
  ) => {
    setTiming({
      ...timing,
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
      <h3 style={{ marginBottom: '1rem', color: '#0077ff' }}>⏱️ Timing</h3>

      <SliderInput
        label="Flicker Duration"
        value={timing.flickerDurationInSeconds || 2}
        min={0.1}
        max={10}
        step={0.1}
        onChange={(v) => handleTimingChange('flickerDurationInSeconds', v)}
        unit="seconds"
      />

      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem' }}>
        How long the chaotic flicker effect lasts at the beginning.
      </p>
    </div>
  );
};