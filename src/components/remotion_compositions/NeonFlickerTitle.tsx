import React from 'react';
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  random,
  spring,
} from 'remotion';

// Import the config and type from your new file
import { type NeonConfig, defaultNeonConfig } from './neonConfig';


const GrainOverlay: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '2px 2px',
        opacity: 0.3,
        mixBlendMode: 'overlay' as const,
        pointerEvents: 'none' as const,
      }}
    />
  );
};

// --- Main Component ---
export const NeonFlickerTitle: React.FC<{
  config: NeonConfig;
}> = ({ config = defaultNeonConfig }) => {
  // ... the rest of your component code remains exactly the same ...
  
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig(); 

  const { text, colors, timing, effects } = config;

  const flickerDuration = timing.flickerDurationInSeconds * fps;
  const neonColors = colors.length > 0 ? colors : ['#FFFFFF']; 

  const containerOpacity = spring({
    frame,
    fps,
    durationInFrames: 30,
  });

  return (
    <div
      style={{
        width: width, 
        height: height, 
        background: 'linear-gradient(to bottom, #0a0018, #000000)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
        opacity: containerOpacity,
      }}
    >
      {effects.showGrain && <GrainOverlay />}

      <div style={{ display: 'flex', gap: '0.05em' }}>
        {text.split('').map((char, i) => {
          const seed = i * 100 + Math.floor(frame * 0.37);
          
          const chaosPhase =
            frame < flickerDuration
              ? random(seed) > 0.5 
              : true; 

          const colorIndex = Math.floor(random(seed + 999) * neonColors.length);
          const color = neonColors[colorIndex];

          const glowStrength = interpolate(
            Math.sin(frame / 10 + i * 0.5) + 1,
            [0, 2],
            [effects.glowPulseMin, effects.glowPulseMax]
          );

          return (
            <span
              key={i}
              style={{
                color: chaosPhase ? color : 'transparent',
                fontWeight: 'bold',
                fontSize: effects.fontSize,
                textShadow: chaosPhase
                  ? `0 0 ${glowStrength}px ${color}, 0 0 ${
                      glowStrength * 2
                    }px ${color}`
                  : 'none',
                transition: 'color 0.05s ease, text-shadow 0.05s ease',
                display: 'inline-block',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
      </div>
    </div>
  );
};