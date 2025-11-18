import React from 'react';

export interface MetricDataUI {
  frontNumber: string;
  frontLabel: string;
  backNumber: string;
  backLabel: string;
  color: string;
}

export interface FlipCardsDataProps {
  metrics: MetricDataUI[];
  setMetrics: (metrics: MetricDataUI[]) => void;
}

const TrashIconSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const StyledFieldInput: React.FC<{
  label: string;
  type: 'text' | 'number' | 'color';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}> = ({ label, type, value, onChange, placeholder, style = {} }) => (
  <label style={{ display: 'block', width: '100%' }}>
    <div style={{ marginBottom: '4px', color: '#333', fontWeight: 500, fontSize: '13px' }}>
      {label}
    </div>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: type === 'color' ? '4px' : '8px 10px',
        height: type === 'color' ? '40px' : 'auto',
        borderRadius: '6px',
        border: '1px solid #ddd',
        background: '#fff',
        fontSize: '14px',
        boxSizing: 'border-box',
        ...style,
      }}
    />
  </label>
);

export const FlipCardsDataSection: React.FC<FlipCardsDataProps> = ({
  metrics,
  setMetrics,
}) => {
  
  const handleItemChange = (
    index: number,
    field: keyof MetricDataUI,
    value: string
  ) => {
    const newMetrics = [...metrics];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    setMetrics(newMetrics);
  };

  const handleRemoveItem = (index: number) => {
    const newMetrics = metrics.filter((_, i) => i !== index);
    setMetrics(newMetrics);
  };

  const handleAddItem = () => {
    const newItem: MetricDataUI = {
      frontNumber: '',
      frontLabel: '',
      backNumber: '',
      backLabel: '',
      color: '#ffffff',
    };
    setMetrics([...metrics, newItem]);
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
        📊 Metric Cards Data
      </h3>
      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0', marginBottom: '1.5rem' }}>
        Add or edit the flipping metric cards.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {metrics.map((item, index) => (
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
            
            <div style={{ paddingRight: '24px', marginBottom: '1rem', fontWeight: 600, color: '#333' }}>
              Card {index + 1}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <StyledFieldInput
                label="Front Number"
                type="text"
                value={item.frontNumber}
                placeholder="e.g., 1,204"
                onChange={(e) => handleItemChange(index, 'frontNumber', e.target.value)}
              />
              <StyledFieldInput
                label="Front Label"
                type="text"
                value={item.frontLabel}
                placeholder="e.g., New Users"
                onChange={(e) => handleItemChange(index, 'frontLabel', e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <StyledFieldInput
                label="Back Number"
                type="text"
                value={item.backNumber}
                placeholder="e.g., +15.2%"
                onChange={(e) => handleItemChange(index, 'backNumber', e.target.value)}
              />
              <StyledFieldInput
                label="Back Label"
                type="text"
                value={item.backLabel}
                placeholder="e.g., vs. Q2"
                onChange={(e) => handleItemChange(index, 'backLabel', e.target.value)}
              />
            </div>

            <StyledFieldInput
              label="Card Color"
              type="color"
              value={item.color}
              onChange={(e) => handleItemChange(index, 'color', e.target.value)}
            />
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
        + Add Metric Card
      </button>
    </div>
  );
};