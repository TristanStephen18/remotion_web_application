import type React from 'react';

export interface FlipCardsTextProps {
  title: string;
  subtitle: string;
  setText: (props: {
    title: string;
    subtitle: string;
  }) => void;
}

const textInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.8rem',
  borderRadius: '8px',
  border: '1px solid #ddd',
  background: '#fafafa',
  fontSize: 14,
};

export const FlipCardsTextSection: React.FC<FlipCardsTextProps> = ({
  title,
  subtitle,
  setText,
}) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText({ title: e.target.value, subtitle });
  };

  const handleSubtitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setText({ title, subtitle: e.target.value });
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
      <h3 style={{ marginBottom: '1rem', color: '#0077ff' }}>
        📝 Text Content
      </h3>

      <label style={{ display: 'block', marginBottom: '1rem' }}>
        <div style={{ marginBottom: '0.3rem', color: '#333', fontWeight: 600 }}>
          Title
        </div>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          style={textInputStyle}
        />
      </label>

      <label style={{ display: 'block', marginBottom: '1rem' }}>
        <div style={{ marginBottom: '0.3rem', color: '#333', fontWeight: 600 }}>
          Subtitle
        </div>
        <input
          type="text"
          value={subtitle}
          onChange={handleSubtitleChange}
          style={textInputStyle}
        />
      </label>

      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
        Set the main title and subtitle for the video.
      </p>
    </div>
  );
};