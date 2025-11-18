/*
FILENAME: NeonColorSection.tsx
(New section file, adapted from ColorSection.tsx for a color array)
*/
import type React from 'react';
import { type NeonConfig } from '../../../remotion_compositions/neonConfig'; 

export interface NeonColorProps {
  colors: NeonConfig['colors'];
  setColors: (colors: NeonConfig['colors']) => void;
}

export const NeonColorSection: React.FC<NeonColorProps> = ({
  colors,
  setColors,
}) => {
  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  const addColor = () => {
    setColors([...colors, '#FFFFFF']); // Add white as default
  };

  const removeColor = (index: number) => {
    if (colors.length <= 1) return; // Don't allow removing the last color
    setColors(colors.filter((_, i) => i !== index));
  };

  const colorInputStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
    padding: '0.5rem',
    background: '#fafafa',
    borderRadius: '8px',
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 600,
    color: '#333',
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
      <h3 style={{ marginBottom: '1rem', color: '#0077ff' }}>🎨 Flicker Colors</h3>

      {colors.map((color, index) => (
        <div key={index} style={colorInputStyle}>
          <label style={labelStyle}>Color {index + 1}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(index, e.target.value)}
              style={{
                width: '100px',
                height: '30px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            />
            <button
              onClick={() => removeColor(index)}
              disabled={colors.length <= 1}
              style={{
                background: '#ffcdd2',
                border: 'none',
                borderRadius: '4px',
                cursor: colors.length <= 1 ? 'not-allowed' : 'pointer',
                color: '#b71c1c',
                padding: '4px 8px',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addColor}
        style={{
          width: '100%',
          padding: '0.6rem',
          background: '#e8f5e9',
          color: '#2e7d32',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 600,
          marginTop: '0.5rem',
        }}
      >
        + Add Color
      </button>

      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem' }}>
        The flicker will randomly pick from these colors.
      </p>
    </div>
  );
};