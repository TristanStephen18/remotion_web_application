import React from 'react';
import type { LanguageData } from '../../../remotion_compositions/HeatMap'; // Import type

export interface HeatmapDataProps {
  languages: LanguageData[];
  setLanguages: (languages: LanguageData[]) => void;
}

const TrashIconSvg = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const StyledFieldInput: React.FC<{
  label: string;
  type: 'text' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}> = ({ label, type, value, onChange, placeholder }) => (
  <label style={{ display: 'block', width: '100%' }}>
    <div
      style={{
        marginBottom: '4px',
        color: '#333',
        fontWeight: 500,
        fontSize: '13px',
      }}
    >
      {label}
    </div>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '8px 10px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        background: '#fff',
        fontSize: '14px',
        boxSizing: 'border-box', 
      }}
      {...(type === 'number' && { min: 0 })}
    />
  </label>
);


export const HeatmapDataSection: React.FC<HeatmapDataProps> = ({
  languages,
  setLanguages,
}) => {
  const handleItemChange = (
    index: number,
    field: keyof LanguageData,
    value: string
  ) => {
    const newLanguages = [...languages];
    const item = { ...newLanguages[index] };

    if (field === 'usage' || field === 'squares') {
      const numValue = Number(value);
      item[field] = isNaN(numValue) ? 0 : numValue;
    } else {
      item[field] = value as string;
    }

    newLanguages[index] = item;
    setLanguages(newLanguages);
  };

  const handleRemoveItem = (index: number) => {
    const newLanguages = languages.filter((_, i) => i !== index);
    setLanguages(newLanguages);
  };

  const handleAddItem = () => {
    const newItem: LanguageData = {
      name: '',
      usage: 0,
      squares: 0,
      logo: '',
    };
    setLanguages([...languages, newItem]);
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
      <h3 style={{ marginBottom: '0.25rem', color: '#0077ff' }}>
        📊 Heatmap Data
      </h3>
      <p
        style={{
          fontSize: '0.85rem',
          color: '#666',
          marginTop: '0',
          marginBottom: '1.5rem',
        }}
      >
        Add or edit the languages displayed in the heatmap.
      </p>

      {/* List of Language Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {languages.map((item, index) => (
          <div
            key={index}
            style={{
              padding: '1rem',
              background: '#fafafa',
              borderRadius: '8px',
              border: '1px solid #eee',
              position: 'relative',
            }}
          >
            {/* Remove Button */}
            <button
              onClick={() => handleRemoveItem(index)}
              title="Remove item"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                color: '#aaa',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#e03131')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#aaa')}
            >
              <TrashIconSvg />
            </button>

            {/* Row 1: Name and Logo */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1rem',
                // Make room for the button
                paddingRight: '24px',
              }}
            >
              <StyledFieldInput
                label="Name"
                type="text"
                value={item.name}
                placeholder="e.g., Python"
                onChange={(e) =>
                  handleItemChange(index, 'name', e.target.value)
                }
              />
              <StyledFieldInput
                label="Logo URL/Name"
                type="text"
                value={item.logo}
                placeholder="e.g., python.png"
                onChange={(e) =>
                  handleItemChange(index, 'logo', e.target.value)
                }
              />
            </div>

            {/* Row 2: Usage and Squares */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <StyledFieldInput
                label="Usage Value"
                type="number"
                value={item.usage}
                onChange={(e) =>
                  handleItemChange(index, 'usage', e.target.value)
                }
              />
              <StyledFieldInput
                label="Squares (Count)"
                type="number"
                value={item.squares}
                onChange={(e) =>
                  handleItemChange(index, 'squares', e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddItem}
        style={{
          width: '100%',
          padding: '0.8rem',
          marginTop: '1.5rem',
          background: 'hsla(217, 100%, 50%, 0.9)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.9rem',
          textAlign: 'center',
        }}
      >
        + Add Data
      </button>
    </div>
  );
};