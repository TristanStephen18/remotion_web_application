import React from 'react';
import { Player } from '@remotion/player'; 
import { HeatmapComposition } from '../../remotion_compositions/HeatMap';
import type { HeatmapConfig } from '../../remotion_compositions/HeatMap'; 


const HeatmapCompositionComponent: React.FC<{
  config: HeatmapConfig;
}> = ({ config }) => {
  return <HeatmapComposition config={config} />;
};

const RemotionHeatmapPlayer: React.FC<{
  config: HeatmapConfig;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
}> = ({ config, autoPlay = true, controls = true, loop = true }) => {
  const fps = 30;
  const dataDuration =
    config.languages.reduce(
      (acc, lang) => acc + lang.squares * (fps * 0.08) + fps * 0.15,
      0
    ) +
    fps * 2.5; 
  const durationInFrames = Math.max(fps * 8, dataDuration); 

  return (
    <Player
    key={JSON.stringify(config)}
      component={HeatmapCompositionComponent}
      inputProps={{
        config,
      }}
      durationInFrames={Math.round(durationInFrames)}
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
  config: HeatmapConfig;
  previewBg: 'dark' | 'light' | 'grey';
  cycleBg: () => void;
  showSafeMargins: boolean;
  onToggleSafeMargins: () => void;
  previewScale: number;
  onPreviewScaleChange: (scale: number) => void;
  isMobile: boolean; 
}

export const HeatmapPreview: React.FC<PreviewProps> = ({
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
      ? '#000'
      : previewBg === 'light'
      ? '#f0f0f0'
      : '#ccc';

  const previewConfig = {
    ...config,
    languages: config.languages.filter(
      (lang) => lang.name.trim() !== '' && lang.squares > 0 && lang.usage > 0
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
      }}
    >
      {/* Theme cycle button */}
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
        }}
      >
        {previewBg === 'dark'
          ? '🌞 Light'
          : previewBg === 'light'
          ? '⬜ Grey'
          : '🌙 Dark'}
      </button>

      {/* Checkbox for Safe Margins */}
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
        <div
          style={{
            position: 'absolute',
            bottom: '70px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <button
            title="Increase Live Preview Size"
            onClick={() =>
              onPreviewScaleChange(Math.min(previewScale + 0.05, 1.1))
            }
            style={{
              width: '30px',
              height: '30px',
              border: 'none',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              background: 'white',
              color: 'black',
              boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
            }}
          >
            +
          </button>
          <button
            title="Decrease Live Preview Size"
            onClick={() =>
              onPreviewScaleChange(Math.max(previewScale - 0.05, 0.5))
            }
            style={{
              width: '30px',
              height: '30px',
              border: 'none',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              background: 'white',
              color: 'black',
              boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
            }}
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
        {/* Phone-like preview container */}
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
          <RemotionHeatmapPlayer
            config={previewConfig}
            autoPlay
            controls
            loop
          />

          {/* Optional safe margins overlay */}
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