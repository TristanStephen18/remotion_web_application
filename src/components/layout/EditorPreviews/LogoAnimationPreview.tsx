import React from "react";
import { Player } from "@remotion/player";
import { LogoLiquidOverlay } from "../../remotion_compositions/LogoAnimation"; 
import type { LogoLiquidOverlayProps } from "../../remotion_compositions/LogoAnimation"; 

const LogoCompositionComponent: React.FC<{
  config: LogoLiquidOverlayProps; 
}> = ({ config }) => {
  return <LogoLiquidOverlay {...config} />;
};

const RemotionLogoPlayer: React.FC<{
  config: LogoLiquidOverlayProps; 
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
}> = ({ config, autoPlay = true, controls = true, loop = true }) => {
  const fps = 30;
  
  // 💡 FIX: Use nullish coalescing (?? 0) to ensure all duration properties are treated as numbers, preventing NaN.
  const totalDuration = (config.durationOutline ?? 0) + (config.durationFill ?? 0) + (config.durationEndPause ?? 0);
  const durationInFrames = Math.round(totalDuration * fps);

  // Fallback to a non-zero frame count if the calculation somehow results in 0 or less, though highly unlikely after fix.
  const safeDurationInFrames = Math.max(1, durationInFrames);

  return (
    <Player
      component={LogoCompositionComponent}
      inputProps={{
        config,
      }}
      durationInFrames={safeDurationInFrames} 
      compositionWidth={1920} 
      compositionHeight={1080} 
      fps={fps}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      acknowledgeRemotionLicense
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};

interface PreviewProps {
  config: LogoLiquidOverlayProps;
  previewBg: "dark" | "light" | "grey";
  cycleBg: () => void;
  showSafeMargins: boolean;
  onToggleSafeMargins: () => void;
  previewScale: number;
  onPreviewScaleChange: (scale: number) => void;
}

export const LogoAnimationPreview: React.FC<PreviewProps> = ({
  config,
  previewBg,
  cycleBg,
  showSafeMargins,
  onToggleSafeMargins,
  previewScale,
  onPreviewScaleChange,
}) => {
  const bgHex =
    previewBg === "dark"
      ? "#000"
      : previewBg === "light"
      ? "#f0f0f0"
      : "#ccc";

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: bgHex,
        transition: "background 0.3s",
        position: "relative",
      }}
    >
        
      {/* Theme cycle button */}
      <button
        onClick={cycleBg}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          padding: "0.6rem 1rem",
          borderRadius: "30px",
          border: "none",
          cursor: "pointer",
          color: "white",
          fontWeight: 600,
          background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        {previewBg === "dark"
          ? "🌞 Light"
          : previewBg === "light"
          ? "⬜ Grey"
          : "🌙 Dark"}
      </button>

      {/* Checkbox for Safe Margins */}
      <label
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          color: previewBg === "dark" ? "#fff" : "#000",
          fontSize: "0.85rem",
          fontWeight: 500,
          cursor: "pointer",
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
          position: "absolute",
          bottom: "70px",
          right: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <button
          title="Increase Live Preview Size"
          onClick={() =>
            onPreviewScaleChange(Math.min(previewScale + 0.05, 1.1))
          }
          style={{
            width: "30px",
            height: "30px",
            border: "none",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            background: "white",
            color: "black",
            boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
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
            width: "30px",
            height: "30px",
            border: "none",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            background: "white",
            color: "black",
            boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
          }}
        >
          –
        </button>
      </div>
      {/* --- End of controls --- */}

      <div
        style={{
          transform: `scale(${previewScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Landscape preview container (16:9 ratio) */}
        <div
          style={{
            width: "480px", // 16
            height: "270px", // 9
            border: "3px solid #222",
            borderRadius: "12px", // Less rounded for "monitor" look
            overflow: "hidden",
            background: "#000",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            position: "relative",
          }}
        >
          <RemotionLogoPlayer
            config={config}
            autoPlay
            controls
            loop
          />

          {/* Optional safe margins overlay */}
          {showSafeMargins && (
            <div
              style={{
                position: "absolute",
                inset: "5%",
                border: "2px dashed rgba(255,255,255,0.25)",
                pointerEvents: "none",
                zIndex: 10,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};