import React from 'react';
import { Player } from '@remotion/player';
import { DynamicMetricCards } from '../../remotion_compositions/FlipCards';
import type { MetricCardsProps } from '../../remotion_compositions/FlipCards';

const FlipCardsCompositionComponent: React.FC<{
  config: MetricCardsProps;
}> = ({ config }) => {
  return <DynamicMetricCards {...config} />;
};

const RemotionFlipCardsPlayer: React.FC<{
  config: MetricCardsProps;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
}> = ({ config, autoPlay = true, controls = true, loop = true }) => {
  const fps = 30;
  
  const intervalSeconds = 2;
  const totalCycleSeconds = intervalSeconds * (config.metrics?.length || 1);
  const minDurationSeconds = 5; 
  
  const durationInFrames = Math.round(
    Math.max(totalCycleSeconds, minDurationSeconds) * fps
  );

  return (
    <Player
      component={FlipCardsCompositionComponent}
      inputProps={{
        config,
      }}
      durationInFrames={durationInFrames}
      compositionWidth={1080}
      compositionHeight={1920}
      fps={fps}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
};

interface PreviewProps {
  config: MetricCardsProps;
  previewBg: 'dark' | 'light' | 'grey';
  cycleBg: () => void;
  showSafeMargins: boolean;
  onToggleSafeMargins: () => void;
  previewScale: number;
  onPreviewScaleChange: (scale: number) => void;
  isMobile: boolean;
}

export const FlipCardsPreview: React.FC<PreviewProps> = ({
  config,
  previewBg,
  cycleBg,
  showSafeMargins,
  onToggleSafeMargins,
  previewScale,
  onPreviewScaleChange,
  isMobile,
}) => {
  const bgHex =
    previewBg === 'dark'
      ? '#111'
      : previewBg === 'light'
      ? '#f0f0f0'
      : '#ccc';

  const previewConfig = {
    ...config,
    metrics: config.metrics.filter(
      (m) => m.front.trim() !== '\n' && m.back.trim() !== '\n' && m.color
    ),
  };
  
  const effectivePreviewScale = isMobile ? 0.65 : previewScale;

  return (
    <div
      style={{
        flex: isMobile ? '0 0 45vh' : '1', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: bgHex,
        transition: 'background 0.3s',
        position: 'relative',
        order: isMobile ? -1 : 0,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={cycleBg}
        style={{
          position: 'absolute',
          bottom: isMobile ? '10px' : '20px',
          right: isMobile ? '10px' : '20px',
          padding: '0.6rem 1rem',
          borderRadius: '30px',
          border: 'none',
          cursor: 'pointer',
          color: 'white',
          fontWeight: 600,
          background: 'linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 20,
        }}
      >
        {previewBg === 'dark' ? '🌞 Light' : previewBg === 'light' ? '⬜ Grey' : '🌙 Dark'}
      </button>

      <label
        style={{
          position: 'absolute',
          bottom: isMobile ? '10px' : '20px',
          left: isMobile ? '10px' : '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: previewBg === 'dark' ? '#fff' : '#000',
          fontSize: '0.85rem',
          fontWeight: 500,
          cursor: 'pointer',
          zIndex: 20,
        }}
      >
        <input
          type="checkbox"
          checked={showSafeMargins}
          onChange={onToggleSafeMargins}
        />
        Show margins
      </label>

      {!isMobile && (
        <div style={{ position: 'absolute', bottom: '70px', right: '20px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 20 }}>
          <button
            title="Increase Live Preview Size"
            onClick={() => onPreviewScaleChange(Math.min(previewScale + 0.05, 1.1))}
            style={{ width: '30px', height: '30px', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', background: 'white', color: 'black', boxShadow: '0 3px 8px rgba(0,0,0,0.3)' }}
          >
            +
          </button>
          <button
            title="Decrease Live Preview Size"
            onClick={() => onPreviewScaleChange(Math.max(previewScale - 0.05, 0.5))}
            style={{ width: '30px', height: '30px', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', background: 'white', color: 'black', boxShadow: '0 3px 8px rgba(0,0,0,0.3)' }}
          >
            –
          </button>
        </div>
      )}

      <div
        style={{
          transform: `scale(${effectivePreviewScale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s',
        }}
      >
        <div
          style={{
            width: '270px',
            height: '480px',
            border: '3px solid #222',
            borderRadius: '24px',
            overflow: 'hidden',
            background: '#000',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            position: 'relative',
          }}
        >
          <RemotionFlipCardsPlayer
            config={previewConfig}
            autoPlay
            controls
            loop
          />

          {showSafeMargins && (
            <div
              style={{
                position: 'absolute',
                inset: '5%',
                border: '2px dashed rgba(255,255,255,0.25)',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};