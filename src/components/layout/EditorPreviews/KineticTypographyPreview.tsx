import React from "react";
import { Player } from "@remotion/player";
import { KineticTypographyIntro } from "../../remotion_compositions/KineticTypography";

// Import icons from their specific files
// --- REMOVED MUI ICONS ---
// import ZoomInIcon from "@mui/icons-material/ZoomIn";
// import ZoomOutIcon from "@mui/icons-material/ZoomOut";
// import SwitchCameraIcon from "@mui/icons-material/SwitchCamera";
// import SettingsIcon from "@mui/icons-material/Settings";

// Define the config interface matching Composition.tsx
interface TypographyConfig {
  id: string;
  words: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  timing: {
    staggerDelay: number;
    collisionFrame: number;
    explosionDelay: number;
  };
  effects: {
    shakeIntensity: number;
    particleCount: number;
    ballSize: number;
  };
}

// --- START: Wrapper for Kinetic Player ---
// A wrapper around the Remotion composition so Player can inject props
const KineticCompositionComponent: React.FC<{
  config: TypographyConfig;
}> = ({ config }) => {
  return <KineticTypographyIntro config={config} />;
};

const RemotionKineticPlayer: React.FC<{
  config: TypographyConfig;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
}> = ({ config, autoPlay = true, controls = true, loop = true }) => {
  const fps = 30;
  const durationInFrames = fps * 6; // 6 seconds

  return (
    <Player
      component={KineticCompositionComponent}
      inputProps={{
        config,
      }}
      durationInFrames={durationInFrames}
      compositionWidth={1080} // Force portrait
      compositionHeight={1920} // Force portrait
      fps={fps}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};
// --- END: Wrapper for Kinetic Player ---

interface PreviewProps {
  config: TypographyConfig;
  previewBg: "dark" | "light" | "grey";
  cycleBg: () => void;
  showSafeMargins: boolean;
  onToggleSafeMargins: () => void;
  previewScale: number;
  onPreviewScaleChange: (scale: number) => void;
}

export const KineticTypographyPreview: React.FC<PreviewProps> = ({
  config,
  previewBg,
  cycleBg,
  showSafeMargins,
  onToggleSafeMargins,
  previewScale,
  onPreviewScaleChange,
}) => {
  // --- REMOVED: controlButton style object ---

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
        // --- REMOVED: flexDirection: "column" ---
        justifyContent: "center", // ADDED
        alignItems: "center", // ADDED
        background: bgHex,
        transition: "background 0.3s",
        position: "relative", // ADDED
      }}
    >
      {/* --- REMOVED: CONTROL BAR --- */}

      {/* --- START: ADDED CONTROLS (from QuoteTemplatePreview) --- */}

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
          color: previewBg === "dark" ? "#fff" : "#000", // Adapted text color for light bg
          fontSize: "0.85rem",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={showSafeMargins}
          onChange={onToggleSafeMargins} // Adapted to Kinetic's prop (no event passed)
        />
        Show margins
      </label>

      {/* Scale controls (+ / - buttons) */}
      <div
        style={{
          position: "absolute",
          bottom: "70px", // just above the theme toggle button
          right: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <button
          title="Increase Live Preview Size"
          onClick={() =>
            onPreviewScaleChange(Math.min(previewScale + 0.05, 1.1)) // Matched Quote's logic
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
            onPreviewScaleChange(Math.max(previewScale - 0.05, 0.5)) // Matched Quote's logic
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

      {/* --- END: ADDED CONTROLS --- */}

      {/* --- REMOVED: Old PLAYER WRAPPER div --- */}
      <div
        style={{
          transform: `scale(${previewScale})`, // Scale the phone
          transformOrigin: "center center",
        }}
      >
        {/* Phone-like preview container */}
        <div
          style={{
            width: "270px",
            height: "480px",
            border: "3px solid #222",
            borderRadius: "24px",
            overflow: "hidden",
            background: "#000",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            position: "relative",
          }}
        >
          <RemotionKineticPlayer
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
                inset: "5%", // Phone-like safe margin
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