// import React from "react";
// import { Player } from "@remotion/player";
// import { QuoteComposition } from "../../remotion_compositions/QuoteTemplate";
// // import { duration } from "@mui/material";

// // A wrapper around the Remotion composition so Player can inject props
// const QuoteCompositionComponent: React.FC<{
//   quote: string;
//   author: string;
//   backgroundImage: string;
//   fontSize: number;
//   fontFamily: string;
//   fontColor: string;
// }> = ({ quote, author, backgroundImage, fontSize, fontFamily, fontColor }) => {
//   return (
//     <QuoteComposition
//       quote={quote}
//       author={author}
//       backgroundImage={backgroundImage}
//       fontFamily={fontFamily}
//       fontSize={fontSize}
//       fontColor={fontColor}
//     />
//   );
// };

// const RemotionQuotePlayer: React.FC<{
//   quote: string;
//   author: string;
//   backgroundImage: string;
//   fontSize: number;
//   fontFamily: string;
//   fontColor: string;
//   width?: number;
//   height?: number;
//   autoPlay?: boolean;
//   controls?: boolean;
//   loop?: boolean;
//   duration:number;
// }> = ({
//   quote,
//   author,
//   backgroundImage,
//   fontSize,
//   fontFamily,
//   fontColor,
//   autoPlay = true,
//   controls = true,
//   loop = true,
//   duration
// }) => {
//   return (
//     <Player
//       component={QuoteCompositionComponent}
//       inputProps={{
//         quote,
//         author,
//         backgroundImage,
//         fontSize,
//         fontFamily,
//         fontColor,
//       }}
//       durationInFrames={duration * 30}
//       compositionWidth={1080}
//       compositionHeight={1920}
//       fps={30}
//       controls={controls}
//       autoPlay={autoPlay}
//       loop={loop}
//       style={{
//         width: "100%",
//         height: "100%",
//       }}
//     />
//   );
// };

// export const QuoteSpotlightPreview: React.FC<{
//   quote: string;
//   author: string;
//   backgroundImage: string;
//   fontSize: number;
//   fontFamily: string;
//   fontColor: string;
//   showSafeMargins: boolean;
//   previewBg: string;
//   cycleBg: () => void;
//   previewScale: number;
//   onPreviewScaleChange: (value: number) => void;
//   onToggleSafeMargins: (value: boolean) => void;
//   duration: number;
// }> = ({
//   quote,
//   author,
//   backgroundImage,
//   fontSize,
//   fontFamily,
//   fontColor,
//   showSafeMargins,
//   previewBg,
//   cycleBg,
//   previewScale,
//   onPreviewScaleChange,
//   onToggleSafeMargins,
//   duration
// }) => {
//   return (
//     <div
//       style={{
//         flex: 1,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         background:
//           previewBg === "dark"
//             ? "#000"
//             : previewBg === "light"
//             ? "#f0f0f0"
//             : "#ccc",
//         transition: "background 0.3s",
//         position: "relative",
//       }}
//     >
//       {/* Theme cycle button */}
//       <button
//         onClick={cycleBg}
//         style={{
//           position: "absolute",
//           bottom: "20px",
//           right: "20px",
//           padding: "0.6rem 1rem",
//           borderRadius: "30px",
//           border: "none",
//           cursor: "pointer",
//           color: "white",
//           fontWeight: 600,
//           background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//         }}
//       >
//         {previewBg === "dark"
//           ? "🌞 Light"
//           : previewBg === "light"
//           ? "⬜ Grey"
//           : "🌙 Dark"}
//       </button>

//       {/* Checkbox for Safe Margins */}
//       <label
//         style={{
//           position: "absolute",
//           bottom: "20px",
//           left: "20px",
//           display: "flex",
//           alignItems: "center",
//           gap: "0.4rem",
//           color: "#fff",
//           fontSize: "0.85rem",
//           fontWeight: 500,
//           cursor: "pointer",
//         }}
//       >
//         <input
//           type="checkbox"
//           checked={showSafeMargins}
//           onChange={(e) => onToggleSafeMargins(e.target.checked)}
//         />
//         Show margins
//       </label>

//       {/* Scale controls (+ / - buttons) */}
//       <div
//         style={{
//           position: "absolute",
//           bottom: "70px", // just above the theme toggle button
//           right: "20px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "6px",
//         }}
//       >
//         <button
//           title="Increase Live Preview Size"
//           onClick={() =>
//             onPreviewScaleChange(Math.min(previewScale + 0.05, 1.1))
//           }
//           style={{
//             width: "30px",
//             height: "30px",
//             border: "none",
//             fontSize: "20px",
//             fontWeight: "bold",
//             cursor: "pointer",
//             background: "white",
//             color: "black",
//             boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
//           }}
//         >
//           +
//         </button>
//         <button
//           title="Decrease Live Preview Size"
//           onClick={() =>
//             onPreviewScaleChange(Math.max(previewScale - 0.05, 0.5))
//           }
//           style={{
//             width: "30px",
//             height: "30px",
//             border: "none",
//             fontSize: "20px",
//             fontWeight: "bold",
//             cursor: "pointer",
//             background: "white",
//             color: "black",
//             boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
//           }}
//         >
//           –
//         </button>
//       </div>

//       <div
//         style={{
//           transform: `scale(${previewScale})`, // ⭐ scale dynamically
//           transformOrigin: "center center",
//         }}
//       >
//         {/* Phone-like preview container */}
//         <div
//           style={{
//             width: "270px",
//             height: "480px",
//             border: "3px solid #222",
//             borderRadius: "24px",
//             overflow: "hidden",
//             background: "#000",
//             boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
//             position: "relative",
//           }}
//         >
//           <RemotionQuotePlayer
//             quote={quote}
//             author={author}
//             backgroundImage={backgroundImage}
//             fontSize={fontSize}
//             fontFamily={fontFamily}
//             fontColor={fontColor}
//             duration={duration}
//           />

//           {/* Optional safe margins overlay */}
//           {showSafeMargins && (
//             <div
//               style={{
//                 position: "absolute",
//                 inset: "5%",
//                 border: "2px dashed rgba(255,255,255,0.25)",
//                 pointerEvents: "none",
//                 zIndex: 10,
//               }}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };



// import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
// import { Player, type PlayerRef } from "@remotion/player";
// import { QuoteComposition } from "../../remotion_compositions/QuoteTemplate";

// // ============================================
// // TYPE DEFINITIONS (all local, no external imports needed)
// // ============================================

// // Clip timing for Remotion composition
// export interface ClipTiming {
//   startFrame: number;
//   endFrame: number;
// }

// // Clip and Track types (matching the editor)
// export interface Clip {
//   id: string;
//   start: number;
//   duration: number;
//   name: string;
//   color: string;
// }

// export interface Track {
//   id: string;
//   name: string;
//   color: string;
//   clips: Clip[];
// }

// // Player handle for external control
// export interface RemotionPlayerHandle {
//   play: () => void;
//   pause: () => void;
//   toggle: () => void;
//   seekTo: (frame: number) => void;
//   seekToTime: (timeInSeconds: number) => void;
//   getCurrentFrame: () => number;
//   isPlaying: () => boolean;
// }

// // ============================================
// // HELPER FUNCTIONS
// // ============================================

// // Convert clip time (seconds) to frames
// const clipToFrameTiming = (clip: Clip | undefined, fps: number): ClipTiming | undefined => {
//   if (!clip) return undefined;
//   return {
//     startFrame: Math.round(clip.start * fps),
//     endFrame: Math.round((clip.start + clip.duration) * fps),
//   };
// };

// // ============================================
// // COMPOSITION WRAPPER
// // ============================================

// const QuoteCompositionComponent: React.FC<{
//   quote: string;
//   author: string;
//   backgroundImage: string;
//   fontSize: number;
//   fontFamily: string;
//   fontColor: string;
//   textClip?: ClipTiming;
//   backgroundClip?: ClipTiming;
// }> = ({ quote, author, backgroundImage, fontSize, fontFamily, fontColor, textClip, backgroundClip }) => {
//   return (
//     <QuoteComposition
//       quote={quote}
//       author={author}
//       backgroundImage={backgroundImage}
//       fontFamily={fontFamily}
//       fontSize={fontSize}
//       fontColor={fontColor}
//       textClip={textClip}
//       backgroundClip={backgroundClip}
//     />
//   );
// };

// // ============================================
// // REMOTION QUOTE PLAYER (Internal Component)
// // ============================================

// interface RemotionQuotePlayerProps {
//   quote: string;
//   author: string;
//   backgroundImage: string;
//   fontSize: number;
//   fontFamily: string;
//   fontColor: string;
//   duration: number;
//   autoPlay?: boolean;
//   controls?: boolean;
//   loop?: boolean;
//   onFrameUpdate?: (frame: number) => void;
//   onPlayingChange?: (isPlaying: boolean) => void;
//   tracks?: Track[];
// }

// const RemotionQuotePlayer = forwardRef<RemotionPlayerHandle, RemotionQuotePlayerProps>(
//   (
//     {
//       quote,
//       author,
//       backgroundImage,
//       fontSize,
//       fontFamily,
//       fontColor,
//       autoPlay = false,
//       controls = false,
//       loop = false,
//       duration,
//       onFrameUpdate,
//       onPlayingChange,
//       tracks,
//     },
//     ref
//   ) => {
//     const playerRef = useRef<PlayerRef>(null);
//     const fps = 30;

//     // Extract clip timing from tracks
//     const videoTrack = tracks?.find(t => t.id === "track-1" || t.name === "Video");
//     const textTrack = tracks?.find(t => t.id === "track-2" || t.name === "Text");
    
//     const backgroundClip = clipToFrameTiming(videoTrack?.clips[0], fps);
//     const textClip = clipToFrameTiming(textTrack?.clips[0], fps);

//     // Expose control methods to parent
//     useImperativeHandle(ref, () => ({
//       play: () => {
//         playerRef.current?.play();
//       },
//       pause: () => {
//         playerRef.current?.pause();
//       },
//       toggle: () => {
//         playerRef.current?.toggle();
//       },
//       seekTo: (frame: number) => {
//         playerRef.current?.seekTo(frame);
//       },
//       seekToTime: (timeInSeconds: number) => {
//         const frame = Math.round(timeInSeconds * fps);
//         playerRef.current?.seekTo(frame);
//       },
//       getCurrentFrame: () => {
//         return playerRef.current?.getCurrentFrame() ?? 0;
//       },
//       isPlaying: () => {
//         return playerRef.current?.isPlaying() ?? false;
//       },
//     }));

//     // Set up event listeners for frame updates
//     useEffect(() => {
//       const { current } = playerRef;
//       if (!current) return;

//       // Using plain function type instead of CallbackListener
//       const handleFrameUpdate = () => {
//         onFrameUpdate?.(current.getCurrentFrame());
//       };

//       current.addEventListener('frameupdate', handleFrameUpdate);

//       return () => {
//         current.removeEventListener('frameupdate', handleFrameUpdate);
//       };
//     }, [onFrameUpdate]);

//     // Set up event listeners for play/pause state
//     useEffect(() => {
//       const { current } = playerRef;
//       if (!current) return;

//       const handlePlay = () => {
//         onPlayingChange?.(true);
//       };

//       const handlePause = () => {
//         onPlayingChange?.(false);
//       };

//       const handleEnded = () => {
//         onPlayingChange?.(false);
//       };

//       current.addEventListener('play', handlePlay);
//       current.addEventListener('pause', handlePause);
//       current.addEventListener('ended', handleEnded);

//       return () => {
//         current.removeEventListener('play', handlePlay);
//         current.removeEventListener('pause', handlePause);
//         current.removeEventListener('ended', handleEnded);
//       };
//     }, [onPlayingChange]);

//     return (
//       <Player
//         ref={playerRef}
//         component={QuoteCompositionComponent}
//         inputProps={{
//           quote,
//           author,
//           backgroundImage,
//           fontSize,
//           fontFamily,
//           fontColor,
//           textClip,
//           backgroundClip,
//         }}
//         durationInFrames={Math.max(1, Math.round(duration * fps))}
//         compositionWidth={1080}
//         compositionHeight={1920}
//         fps={fps}
//         controls={controls}
//         autoPlay={autoPlay}
//         loop={loop}
//         style={{
//           width: "100%",
//           height: "100%",
//         }}
//       />
//     );
//   }
// );

// RemotionQuotePlayer.displayName = "RemotionQuotePlayer";

// // ============================================
// // QUOTE SPOTLIGHT PREVIEW (Exported Component)
// // ============================================

// export interface QuoteSpotlightPreviewProps {
//   quote: string;
//   author: string;
//   backgroundImage: string;
//   fontSize: number;
//   fontFamily: string;
//   fontColor: string;
//   showSafeMargins: boolean;
//   previewBg: string;
//   cycleBg: () => void;
//   previewScale: number;
//   onPreviewScaleChange: (value: number) => void;
//   onToggleSafeMargins: (value: boolean) => void;
//   duration: number;
//   // Props for timeline sync
//   onFrameUpdate?: (frame: number) => void;
//   onPlayingChange?: (isPlaying: boolean) => void;
//   // Track data for clip timing
//   tracks?: Track[];
// }

// export const QuoteSpotlightPreview = forwardRef<
//   RemotionPlayerHandle,
//   QuoteSpotlightPreviewProps
// >(
//   (
//     {
//       quote,
//       author,
//       backgroundImage,
//       fontSize,
//       fontFamily,
//       fontColor,
//       showSafeMargins,
//       previewBg,
//       cycleBg,
//       previewScale,
//       onPreviewScaleChange,
//       onToggleSafeMargins,
//       duration,
//       onFrameUpdate,
//       onPlayingChange,
//       tracks,
//     },
//     ref
//   ) => {
//     const playerRef = useRef<RemotionPlayerHandle>(null);

//     // Forward the ref to parent
//     useImperativeHandle(ref, () => ({
//       play: () => playerRef.current?.play(),
//       pause: () => playerRef.current?.pause(),
//       toggle: () => playerRef.current?.toggle(),
//       seekTo: (frame: number) => playerRef.current?.seekTo(frame),
//       seekToTime: (timeInSeconds: number) =>
//         playerRef.current?.seekToTime(timeInSeconds),
//       getCurrentFrame: () => playerRef.current?.getCurrentFrame() ?? 0,
//       isPlaying: () => playerRef.current?.isPlaying() ?? false,
//     }));

//     return (
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           background:
//             previewBg === "dark"
//               ? "#000"
//               : previewBg === "light"
//               ? "#f0f0f0"
//               : "#ccc",
//           transition: "background 0.3s",
//           position: "relative",
//         }}
//       >
//         {/* Theme cycle button */}
//         <button
//           onClick={cycleBg}
//           style={{
//             position: "absolute",
//             bottom: "20px",
//             right: "20px",
//             padding: "0.6rem 1rem",
//             borderRadius: "30px",
//             border: "none",
//             cursor: "pointer",
//             color: "white",
//             fontWeight: 600,
//             background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//           }}
//         >
//           {previewBg === "dark"
//             ? "🌞 Light"
//             : previewBg === "light"
//             ? "⬜ Grey"
//             : "🌙 Dark"}
//         </button>

//         {/* Checkbox for Safe Margins */}
//         <label
//           style={{
//             position: "absolute",
//             bottom: "20px",
//             left: "20px",
//             display: "flex",
//             alignItems: "center",
//             gap: "0.4rem",
//             color: "#fff",
//             fontSize: "0.85rem",
//             fontWeight: 500,
//             cursor: "pointer",
//           }}
//         >
//           <input
//             type="checkbox"
//             checked={showSafeMargins}
//             onChange={(e) => onToggleSafeMargins(e.target.checked)}
//           />
//           Show margins
//         </label>

//         {/* Scale controls (+ / - buttons) */}
//         <div
//           style={{
//             position: "absolute",
//             bottom: "70px",
//             right: "20px",
//             display: "flex",
//             flexDirection: "column",
//             gap: "6px",
//           }}
//         >
//           <button
//             title="Increase Live Preview Size"
//             onClick={() =>
//               onPreviewScaleChange(Math.min(previewScale + 0.05, 1.1))
//             }
//             style={{
//               width: "30px",
//               height: "30px",
//               border: "none",
//               fontSize: "20px",
//               fontWeight: "bold",
//               cursor: "pointer",
//               background: "white",
//               color: "black",
//               boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
//             }}
//           >
//             +
//           </button>
//           <button
//             title="Decrease Live Preview Size"
//             onClick={() =>
//               onPreviewScaleChange(Math.max(previewScale - 0.05, 0.5))
//             }
//             style={{
//               width: "30px",
//               height: "30px",
//               border: "none",
//               fontSize: "20px",
//               fontWeight: "bold",
//               cursor: "pointer",
//               background: "white",
//               color: "black",
//               boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
//             }}
//           >
//             –
//           </button>
//         </div>

//         <div
//           style={{
//             transform: `scale(${previewScale})`,
//             transformOrigin: "center center",
//           }}
//         >
//           {/* Phone-like preview container */}
//           <div
//             style={{
//               width: "270px",
//               height: "480px",
//               border: "3px solid #222",
//               borderRadius: "24px",
//               overflow: "hidden",
//               background: "#000",
//               boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
//               position: "relative",
//             }}
//           >
//             <RemotionQuotePlayer
//               ref={playerRef}
//               quote={quote}
//               author={author}
//               backgroundImage={backgroundImage}
//               fontSize={fontSize}
//               fontFamily={fontFamily}
//               fontColor={fontColor}
//               duration={duration}
//               onFrameUpdate={onFrameUpdate}
//               onPlayingChange={onPlayingChange}
//               tracks={tracks}
//             />

//             {/* Optional safe margins overlay */}
//             {showSafeMargins && (
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: "5%",
//                   border: "2px dashed rgba(255,255,255,0.25)",
//                   pointerEvents: "none",
//                   zIndex: 10,
//                 }}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }
// );

// QuoteSpotlightPreview.displayName = "QuoteSpotlightPreview";



import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { QuoteComposition } from "../../remotion_compositions/QuoteTemplate";

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface ClipTiming {
  startFrame: number;
  endFrame: number;
}

export interface Clip {
  id: string;
  start: number;
  duration: number;
  name: string;
  color: string;
  type?: "video" | "text" | "audio" | "effect";
  audioUrl?: string;
}

export interface Track {
  id: string;
  name: string;
  color: string;
  clips: Clip[];
  type?: "video" | "text" | "audio" | "effect";
  muted?: boolean;
}

export interface AudioClipData {
  audioUrl: string;
  startFrame: number;
  endFrame: number;
  volume?: number;
}

export interface RemotionPlayerHandle {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seekTo: (frame: number) => void;
  seekToTime: (timeInSeconds: number) => void;
  getCurrentFrame: () => number;
  isPlaying: () => boolean;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const clipToFrameTiming = (clip: Clip | undefined, fps: number): ClipTiming | undefined => {
  if (!clip) return undefined;
  return {
    startFrame: Math.round(clip.start * fps),
    endFrame: Math.round((clip.start + clip.duration) * fps),
  };
};

// ============================================
// COMPOSITION WRAPPER
// ============================================

const QuoteCompositionComponent: React.FC<{
  quote: string;
  author: string;
  backgroundImage: string;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  textClip?: ClipTiming;
  backgroundClip?: ClipTiming;
  quoteClip?: ClipTiming;
  authorClip?: ClipTiming;
  audioClips?: AudioClipData[];
}> = ({ 
  quote, 
  author, 
  backgroundImage, 
  fontSize, 
  fontFamily, 
  fontColor, 
  textClip, 
  backgroundClip,
  quoteClip,
  authorClip,
  audioClips,
}) => {
  return (
    <QuoteComposition
      quote={quote}
      author={author}
      backgroundImage={backgroundImage}
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontColor={fontColor}
      textClip={textClip}
      backgroundClip={backgroundClip}
      quoteClip={quoteClip}
      authorClip={authorClip}
      audioClips={audioClips}
    />
  );
};

// ============================================
// REMOTION QUOTE PLAYER
// ============================================

interface RemotionQuotePlayerProps {
  quote: string;
  author: string;
  backgroundImage: string;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  duration: number;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  onFrameUpdate?: (frame: number) => void;
  onPlayingChange?: (isPlaying: boolean) => void;
  tracks?: Track[];
  currentTime?: number;
  showQuote?: boolean;
  showAuthor?: boolean;
}

const RemotionQuotePlayer = forwardRef<RemotionPlayerHandle, RemotionQuotePlayerProps>(
  (
    {
      quote,
      author,
      backgroundImage,
      fontSize,
      fontFamily,
      fontColor,
      autoPlay = false,
      controls = false,
      loop = false,
      duration,
      onFrameUpdate,
      onPlayingChange,
      tracks,
      currentTime,
      showQuote,
      showAuthor,
    },
    ref
  ) => {
    const playerRef = useRef<PlayerRef>(null);
    const fps = 30;

    // Extract clip timing from tracks
    const videoTrack = tracks?.find(t => t.id === "track-1" || t.name === "Video");
    const quoteTrack = tracks?.find(t => t.id === "track-2" || t.name === "Quote Text");
    const authorTrack = tracks?.find(t => t.id === "track-3" || t.name === "Author Text");
    
    const backgroundClip = clipToFrameTiming(videoTrack?.clips[0], fps);
    const quoteClip = clipToFrameTiming(quoteTrack?.clips[0], fps);
    const authorClip = clipToFrameTiming(authorTrack?.clips[0], fps);
    
    // Keep backward compatibility
    const textClip = quoteClip;

    // Extract audio clips from all audio tracks
    const audioClips: AudioClipData[] = tracks
      ?.filter(t => t.type === "audio")
      .flatMap(track => 
        track.clips
          .filter(clip => clip.audioUrl)
          .map(clip => ({
            audioUrl: clip.audioUrl!,
            startFrame: Math.round(clip.start * fps),
            endFrame: Math.round((clip.start + clip.duration) * fps),
            volume: track.muted ? 0 : 1,
          }))
      ) ?? [];

    console.log('🎵 Audio clips:', audioClips);

    useImperativeHandle(ref, () => ({
      play: () => {
        playerRef.current?.play();
      },
      pause: () => {
        playerRef.current?.pause();
      },
      toggle: () => {
        playerRef.current?.toggle();
      },
      seekTo: (frame: number) => {
        playerRef.current?.seekTo(frame);
      },
      seekToTime: (timeInSeconds: number) => {
        const frame = Math.round(timeInSeconds * fps);
        playerRef.current?.seekTo(frame);
      },
      getCurrentFrame: () => {
        return playerRef.current?.getCurrentFrame() ?? 0;
      },
      isPlaying: () => {
        return playerRef.current?.isPlaying() ?? false;
      },
    }));

    useEffect(() => {
      const { current } = playerRef;
      if (!current) return;

      const handleFrameUpdate = () => {
        onFrameUpdate?.(current.getCurrentFrame());
      };

      current.addEventListener('frameupdate', handleFrameUpdate);

      return () => {
        current.removeEventListener('frameupdate', handleFrameUpdate);
      };
    }, [onFrameUpdate]);

    useEffect(() => {
      const { current } = playerRef;
      if (!current) return;

      const handlePlay = () => {
        onPlayingChange?.(true);
      };

      const handlePause = () => {
        onPlayingChange?.(false);
      };

      const handleEnded = () => {
        onPlayingChange?.(false);
      };

      current.addEventListener('play', handlePlay);
      current.addEventListener('pause', handlePause);
      current.addEventListener('ended', handleEnded);

      return () => {
        current.removeEventListener('play', handlePlay);
        current.removeEventListener('pause', handlePause);
        current.removeEventListener('ended', handleEnded);
      };
    }, [onPlayingChange]);

    return (
      <Player
        ref={playerRef}
        component={QuoteCompositionComponent}
        inputProps={{
          quote,
          author,
          backgroundImage,
          fontSize,
          fontFamily,
          fontColor,
          textClip,
          backgroundClip,
          quoteClip,
          authorClip,
          audioClips,
        }}
        durationInFrames={Math.max(1, Math.round(duration * fps))}
        compositionWidth={1080}
        compositionHeight={1920}
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
  }
);

RemotionQuotePlayer.displayName = "RemotionQuotePlayer";

// ============================================
// QUOTE SPOTLIGHT PREVIEW
// ============================================

export interface QuoteSpotlightPreviewProps {
  quote: string;
  author: string;
  backgroundImage: string;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  showSafeMargins: boolean;
  previewBg: string;
  cycleBg: () => void;
  previewScale: number;
  onPreviewScaleChange: (value: number) => void;
  onToggleSafeMargins: (value: boolean) => void;
  duration: number;
  onFrameUpdate?: (frame: number) => void;
  onPlayingChange?: (isPlaying: boolean) => void;
  tracks?: Track[];
  currentTime?: number;
  showQuote?: boolean;
  showAuthor?: boolean;
}

export const QuoteSpotlightPreview = forwardRef(
  function QuoteSpotlightPreview(
    props: QuoteSpotlightPreviewProps,
    ref: React.Ref<RemotionPlayerHandle>
  ) {
    const {
      quote,
      author,
      backgroundImage,
      fontSize,
      fontFamily,
      fontColor,
      showSafeMargins,
      previewBg,
      cycleBg,
      previewScale,
      onPreviewScaleChange,
      onToggleSafeMargins,
      duration,
      onFrameUpdate,
      onPlayingChange,
      tracks,
      currentTime,
      showQuote,
      showAuthor,
    } = props;

    const playerRef = useRef<RemotionPlayerHandle>(null);

    useImperativeHandle(ref, () => ({
      play: () => playerRef.current?.play(),
      pause: () => playerRef.current?.pause(),
      toggle: () => playerRef.current?.toggle(),
      seekTo: (frame: number) => playerRef.current?.seekTo(frame),
      seekToTime: (timeInSeconds: number) =>
        playerRef.current?.seekToTime(timeInSeconds),
      getCurrentFrame: () => playerRef.current?.getCurrentFrame() ?? 0,
      isPlaying: () => playerRef.current?.isPlaying() ?? false,
    }));

    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            previewBg === "dark"
              ? "#000"
              : previewBg === "light"
              ? "#f0f0f0"
              : "#ccc",
          transition: "background 0.3s",
          position: "relative",
        }}
      >
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

        <label
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "#fff",
            fontSize: "0.85rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={showSafeMargins}
            onChange={(e) => onToggleSafeMargins(e.target.checked)}
          />
          Show margins
        </label>

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

        <div
          style={{
            transform: `scale(${previewScale})`,
            transformOrigin: "center center",
          }}
        >
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
            <RemotionQuotePlayer
              ref={playerRef}
              quote={quote}
              author={author}
              backgroundImage={backgroundImage}
              fontSize={fontSize}
              fontFamily={fontFamily}
              fontColor={fontColor}
              duration={duration}
              onFrameUpdate={onFrameUpdate}
              onPlayingChange={onPlayingChange}
              tracks={tracks}
              currentTime={currentTime}
              showQuote={showQuote}
              showAuthor={showAuthor}
            />

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
  }
);
(QuoteSpotlightPreview as any).displayName = "QuoteSpotlightPreview";
