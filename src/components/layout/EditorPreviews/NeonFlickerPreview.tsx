import React from 'react';
import { Player } from '@remotion/player';
import {
  NeonFlickerTitle,
 type NeonConfig,
} from '../../remotion_compositions/NeonFlickerTitle'; // Adjust path

// --- Wrapper for Neon Player ---
const NeonCompositionComponent: React.FC<{
  config: NeonConfig;
}> = ({ config }) => {
  return <NeonFlickerTitle config={config} />;
};

const RemotionNeonPlayer: React.FC<{
  config: NeonConfig;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
}> = ({ config, autoPlay = true, controls = true, loop = true }) => {
  const fps = 30;
  const durationInFrames = fps * 6; // 6 seconds total

  return (
    <Player
      component={NeonCompositionComponent}
      inputProps={{
        config,
      }}
      durationInFrames={durationInFrames}
      compositionWidth={1920} // 16:9 Landscape
      compositionHeight={1080} // 16:9 Landscape
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
// --- END: Wrapper for Neon Player ---

interface PreviewProps {
  config: NeonConfig;
  previewBg: 'dark' | 'light' | 'grey';
  cycleBg: () => void;
  showSafeMargins: boolean;
  onToggleSafeMargins: () => void;
  previewScale: number;
  onPreviewScaleChange: (scale: number) => void;
}

export const NeonFlickerPreview: React.FC<PreviewProps> = ({
  config,
  previewBg,
  cycleBg,
  showSafeMargins,
  onToggleSafeMargins,
  previewScale,
  onPreviewScaleChange,
}) => {
  const bgHex =
    previewBg === 'dark'
      ? '#000'
      : previewBg === 'light'
      ? '#f0f0f0'
      : '#ccc';

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: bgHex,
        transition: 'background 0.3s',
        position: 'relative',
        overflow: 'hidden', // Hide overflow from scaling
      }}
    >
      {/* All controls are the same as Kinetic preview */}
      {/* Theme cycle button */}
      <button
        onClick={cycleBg}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          padding: '0.6rem 1rem',
          borderRadius: '30px',
          border: 'none',
          cursor: 'pointer',
          color: 'white',
          fontWeight: 600,
          background: 'linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 10,
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
          bottom: '20px',
          left: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: previewBg === 'dark' ? '#fff' : '#000',
          fontSize: '0.85rem',
          fontWeight: 500,
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        <input
          type="checkbox"
          checked={showSafeMargins}
          onChange={onToggleSafeMargins}
        />
        Show margins
      </label>

      {/* Scale controls (+ / - buttons) */}
      <div
        style={{
          position: 'absolute',
          bottom: '70px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 10,
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
            onPreviewScaleChange(Math.max(previewScale - 0.05, 0.2)) // Lowered min scale
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

      {/* Widescreen Preview Container */}
      <div
        style={{
          // Aspect ratio is 16:9
          width: 'calc(100% - 100px)',
          maxWidth: '1280px', // Max width
          aspectRatio: '16 / 9',
          border: '3px solid #222',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#000',
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          position: 'relative',
          transform: `scale(${previewScale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease',
        }}
      >
        <RemotionNeonPlayer config={config} autoPlay controls loop />

        {/* Optional safe margins overlay */}
        {showSafeMargins && (
          <div
            style={{
              position: 'absolute',
              inset: '5%', // 5% safe margin
              border: '2px dashed rgba(255,250,250,0.25)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        )}
      </div>
    </div>
  );
};