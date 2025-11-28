// import {
//   AbsoluteFill,
//   interpolate,
//   spring,
//   useCurrentFrame,
//   useVideoConfig,
//   Img,
// } from "remotion";
// import { loadFont } from "@remotion/google-fonts/CormorantGaramond";
// import { useCallback } from "react";

// const { fontFamily: defaultFontFamily } = loadFont();

// export const QuoteComposition: React.FC<{
//   quote: string;
//   author: string;
//   backgroundImage: string;
//   fontFamily?: string;
//   fontSize?: number; 
//   fontColor?: string;
// }> = ({
//   quote,
//   author,
//   backgroundImage,
//   fontFamily = defaultFontFamily,
//   fontSize = 1,
//   fontColor = "white",
// }) => {
//   const frame = useCurrentFrame();
//   const { fps, width, height } = useVideoConfig();

//   // Animation parameters
//   const quoteMarkScale = spring({
//     frame: frame * 0.7,
//     fps,
//     config: { damping: 15, stiffness: 120 },
//     durationInFrames: 45,
//   });

//   const quoteMarkOpacity = interpolate(frame, [0, 30], [0, 1], {
//     extrapolateRight: "clamp",
//   });

//   const bgOpacity = interpolate(frame, [30, 90], [0, 0.7], {
//     extrapolateRight: "clamp",
//   });

//   const textPush = spring({
//     frame: frame - 30,
//     fps,
//     config: { damping: 15, stiffness: 50 },
//     durationInFrames: 90,
//   });

//   const wordAppear = useCallback(
//     (index: number) => {
//       return interpolate(frame - 45 - index * 7, [0, 45], [0, 1], {
//         extrapolateRight: "clamp",
//       });
//     },
//     [frame],
//   );

//   const authorAppear = spring({
//     frame: frame - 45 - quote.split(" ").length * 7 - 15,
//     fps,
//     config: { damping: 15, stiffness: 80 },
//     durationInFrames: 45,
//   });

//   const words = quote.split(" ");

//   // Scale fonts relative to height with custom size multiplier
//   const baseFontSize = height * 0.050 * fontSize; // smaller than 0.050
//   const quoteMarkFontSize = height * 0.10 * fontSize; // smaller than 0.12
//   const authorFontSize = baseFontSize * 0.75; // slightly reduced

//   return (
//     <AbsoluteFill style={{ backgroundColor: "#000" }}>
//       {/* Background */}
//       <AbsoluteFill style={{ opacity: bgOpacity }}>
//         <Img
//           src={backgroundImage}
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             filter: "brightness(0.6)",
//           }}
//         />
//       </AbsoluteFill>

//       {/* Quotation mark */}
//       <div
//         style={{
//           position: "absolute",
//           fontSize: quoteMarkFontSize,
//           fontFamily,
//           color: fontColor,
//           fontStyle: "italic",
//           opacity: quoteMarkOpacity,
//           transform: `scale(${quoteMarkScale})`,
//           top: height * 0.12,
//           left: width * 0.1,
//           lineHeight: 0.8,
//           zIndex: 1,
//         }}
//       >
//         "
//       </div>

//       {/* Main quote text */}
//       <div
//         style={{
//           position: "absolute",
//           fontFamily,
//           color: fontColor,
//           fontSize: baseFontSize,
//           fontWeight: 400,
//           lineHeight: 1.6,
//           textAlign: "center",
//           zIndex: 2,
//           width: "80%", // wide block for portrait
//           left: "10%",
//           top: height * 0.3,
//           transform: `translateY(${interpolate(textPush, [0, 1], [50, 0])}px)`,
//         }}
//       >
//         {words.map((word, i) => {
//           const opacity = wordAppear(i);
//           return (
//             <span
//               key={i}
//               style={{
//                 display: "inline-block",
//                 marginLeft: 12,
//                 opacity,
//                 // fontStyle: i % 3 === 0 ? "italic" : "normal",
//               }}
//             >
//               {word}
//             </span>
//           );
//         })}
//       </div>

//       {/* Author */}
//       <div
//         style={{
//           position: "absolute",
//           fontFamily,
//           color: fontColor,
//           fontSize: authorFontSize,
//           fontWeight: 600,
//           bottom: height * 0.15,
//           right: width * 0.1,
//           opacity: authorAppear,
//           transform: `translateY(${interpolate(
//             authorAppear,
//             [0, 1],
//             [40, 0],
//           )}px)`,
//           letterSpacing: 1.5,
//           textTransform: "uppercase",
//           paddingTop: 15,
//           textAlign: "right",
//           width: "80%",
//         }}
//       >
//         — {author}
//       </div>
//     </AbsoluteFill>
//   );
// };






// import {
//   AbsoluteFill,
//   interpolate,
//   spring,
//   useCurrentFrame,
//   useVideoConfig,
//   Img,
// } from "remotion";
// import { loadFont } from "@remotion/google-fonts/CormorantGaramond";
// import { useCallback } from "react";

// const { fontFamily: defaultFontFamily } = loadFont();

// // Clip timing interface - exported for use in other files
// export interface ClipTiming {
//   startFrame: number;
//   endFrame: number;
// }

// export const QuoteComposition: React.FC<{
//   quote: string;
//   author: string;
//   backgroundImage: string;
//   fontFamily?: string;
//   fontSize?: number;
//   fontColor?: string;
//   // Optional clip timing from timeline
//   textClip?: ClipTiming;
//   backgroundClip?: ClipTiming;
// }> = ({
//   quote,
//   author,
//   backgroundImage,
//   fontFamily = defaultFontFamily,
//   fontSize = 1,
//   fontColor = "white",
//   textClip,
//   backgroundClip,
// }) => {
//   const frame = useCurrentFrame();
//   const { fps, width, height, durationInFrames } = useVideoConfig();

//   // Determine if elements should be visible based on clips
//   // If no clip timing provided, use full duration (backwards compatible)
//   const textStartFrame = textClip?.startFrame ?? 0;
//   const textEndFrame = textClip?.endFrame ?? durationInFrames;
//   const bgStartFrame = backgroundClip?.startFrame ?? 0;
//   const bgEndFrame = backgroundClip?.endFrame ?? durationInFrames;

//   // Check if we're within the clip ranges
//   const isTextVisible = frame >= textStartFrame && frame <= textEndFrame;
//   const isBgVisible = frame >= bgStartFrame && frame <= bgEndFrame;

//   // Calculate relative frame for text animations (frame within the text clip)
//   const textRelativeFrame = Math.max(0, frame - textStartFrame);
//   const bgRelativeFrame = Math.max(0, frame - bgStartFrame);

//   // Animation parameters - now using relative frames
//   const quoteMarkScale = spring({
//     frame: textRelativeFrame * 0.7,
//     fps,
//     config: { damping: 15, stiffness: 120 },
//     durationInFrames: 45,
//   });

//   const quoteMarkOpacity = interpolate(textRelativeFrame, [0, 30], [0, 1], {
//     extrapolateRight: "clamp",
//   });

//   // Background opacity - use bgRelativeFrame
//   const bgOpacity = interpolate(bgRelativeFrame, [0, 60], [0, 0.7], {
//     extrapolateRight: "clamp",
//   });

//   const textPush = spring({
//     frame: textRelativeFrame - 30,
//     fps,
//     config: { damping: 15, stiffness: 50 },
//     durationInFrames: 90,
//   });

//   const wordAppear = useCallback(
//     (index: number) => {
//       return interpolate(textRelativeFrame - 45 - index * 7, [0, 45], [0, 1], {
//         extrapolateRight: "clamp",
//       });
//     },
//     [textRelativeFrame]
//   );

//   const authorAppear = spring({
//     frame: textRelativeFrame - 45 - quote.split(" ").length * 7 - 15,
//     fps,
//     config: { damping: 15, stiffness: 80 },
//     durationInFrames: 45,
//   });

//   // Fade out animations when approaching clip end
//   const textClipDuration = textEndFrame - textStartFrame;
//   const fadeOutStart = textClipDuration - 30; // Start fading 30 frames before end
//   const textFadeOut = interpolate(
//     textRelativeFrame,
//     [fadeOutStart, textClipDuration],
//     [1, 0],
//     { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
//   );

//   const words = quote.split(" ");

//   // Scale fonts relative to height with custom size multiplier
//   const baseFontSize = height * 0.05 * fontSize;
//   const quoteMarkFontSize = height * 0.1 * fontSize;
//   const authorFontSize = baseFontSize * 0.75;

//   // Combined opacity for text elements (visibility + fade out)
//   const textOpacityMultiplier = isTextVisible ? textFadeOut : 0;

//   return (
//     <AbsoluteFill style={{ backgroundColor: "#000" }}>
//       {/* Background - only show within background clip range */}
//       {isBgVisible && (
//         <AbsoluteFill style={{ opacity: bgOpacity }}>
//           <Img
//             src={backgroundImage}
//             style={{
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//               filter: "brightness(0.6)",
//             }}
//           />
//         </AbsoluteFill>
//       )}

//       {/* Text elements - only show within text clip range */}
//       {isTextVisible && (
//         <>
//           {/* Quotation mark */}
//           <div
//             style={{
//               position: "absolute",
//               fontSize: quoteMarkFontSize,
//               fontFamily,
//               color: fontColor,
//               fontStyle: "italic",
//               opacity: quoteMarkOpacity * textOpacityMultiplier,
//               transform: `scale(${quoteMarkScale})`,
//               top: height * 0.12,
//               left: width * 0.1,
//               lineHeight: 0.8,
//               zIndex: 1,
//             }}
//           >
//             "
//           </div>

//           {/* Main quote text */}
//           <div
//             style={{
//               position: "absolute",
//               fontFamily,
//               color: fontColor,
//               fontSize: baseFontSize,
//               fontWeight: 400,
//               lineHeight: 1.6,
//               textAlign: "center",
//               zIndex: 2,
//               width: "80%",
//               left: "10%",
//               top: height * 0.3,
//               transform: `translateY(${interpolate(textPush, [0, 1], [50, 0])}px)`,
//             }}
//           >
//             {words.map((word, i) => {
//               const opacity = wordAppear(i) * textOpacityMultiplier;
//               return (
//                 <span
//                   key={i}
//                   style={{
//                     display: "inline-block",
//                     marginLeft: 12,
//                     opacity,
//                   }}
//                 >
//                   {word}
//                 </span>
//               );
//             })}
//           </div>

//           {/* Author */}
//           <div
//             style={{
//               position: "absolute",
//               fontFamily,
//               color: fontColor,
//               fontSize: authorFontSize,
//               fontWeight: 600,
//               bottom: height * 0.15,
//               right: width * 0.1,
//               opacity: authorAppear * textOpacityMultiplier,
//               transform: `translateY(${interpolate(
//                 authorAppear,
//                 [0, 1],
//                 [40, 0]
//               )}px)`,
//               letterSpacing: 1.5,
//               textTransform: "uppercase",
//               paddingTop: 15,
//               textAlign: "right",
//               width: "80%",
//             }}
//           >
//             — {author}
//           </div>
//         </>
//       )}
//     </AbsoluteFill>
//   );
// };

import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  Audio,
  Sequence,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/CormorantGaramond";
import { useCallback } from "react";

const { fontFamily: defaultFontFamily } = loadFont();

// Clip timing interface
export interface ClipTiming {
  startFrame: number;
  endFrame: number;
}

// Audio clip interface
export interface AudioClipData {
  audioUrl: string;
  startFrame: number;
  endFrame: number;
  volume?: number;
}

export const QuoteComposition: React.FC<{
  quote: string;
  author: string;
  backgroundImage: string;
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  textClip?: ClipTiming;        // Legacy: for backward compatibility
  backgroundClip?: ClipTiming;
  quoteClip?: ClipTiming;        // NEW: Separate quote timing
  authorClip?: ClipTiming;       // NEW: Separate author timing
  audioClips?: AudioClipData[];  // NEW: Audio clips
}> = ({
  quote,
  author,
  backgroundImage,
  fontFamily = defaultFontFamily,
  fontSize = 1,
  fontColor = "white",
  textClip,
  backgroundClip,
  quoteClip,
  authorClip,
  audioClips = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  // Use separate clips if provided, otherwise fall back to textClip
  const effectiveQuoteClip = quoteClip || textClip;
  const effectiveAuthorClip = authorClip || textClip;

  // Determine if elements should be visible based on clips
  const quoteStartFrame = effectiveQuoteClip?.startFrame ?? 0;
  const quoteEndFrame = effectiveQuoteClip?.endFrame ?? durationInFrames;
  const authorStartFrame = effectiveAuthorClip?.startFrame ?? 0;
  const authorEndFrame = effectiveAuthorClip?.endFrame ?? durationInFrames;
  const bgStartFrame = backgroundClip?.startFrame ?? 0;
  const bgEndFrame = backgroundClip?.endFrame ?? durationInFrames;

  // Check if we're within the clip ranges
  const isQuoteVisible = frame >= quoteStartFrame && frame <= quoteEndFrame;
  const isAuthorVisible = frame >= authorStartFrame && frame <= authorEndFrame;
  const isBgVisible = frame >= bgStartFrame && frame <= bgEndFrame;

  // Calculate relative frame for animations
  const quoteRelativeFrame = Math.max(0, frame - quoteStartFrame);
  const authorRelativeFrame = Math.max(0, frame - authorStartFrame);
  const bgRelativeFrame = Math.max(0, frame - bgStartFrame);

  // ============================================
  // QUOTE ANIMATIONS (using quoteRelativeFrame)
  // ============================================
  
  const quoteMarkScale = spring({
    frame: quoteRelativeFrame * 0.7,
    fps,
    config: { damping: 15, stiffness: 120 },
    durationInFrames: 45,
  });

  const quoteMarkOpacity = interpolate(quoteRelativeFrame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textPush = spring({
    frame: quoteRelativeFrame - 30,
    fps,
    config: { damping: 15, stiffness: 50 },
    durationInFrames: 90,
  });

  const wordAppear = useCallback(
    (index: number) => {
      return interpolate(quoteRelativeFrame - 45 - index * 7, [0, 45], [0, 1], {
        extrapolateRight: "clamp",
      });
    },
    [quoteRelativeFrame]
  );

  // Quote fade out animation
  const quoteClipDuration = quoteEndFrame - quoteStartFrame;
  const quoteFadeOutStart = quoteClipDuration - 30;
  const quoteFadeOut = interpolate(
    quoteRelativeFrame,
    [quoteFadeOutStart, quoteClipDuration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ============================================
  // AUTHOR ANIMATIONS (using authorRelativeFrame)
  // ============================================
  
  const authorAppear = spring({
    frame: authorRelativeFrame - 15,
    fps,
    config: { damping: 15, stiffness: 80 },
    durationInFrames: 45,
  });

  // Author fade out animation
  const authorClipDuration = authorEndFrame - authorStartFrame;
  const authorFadeOutStart = authorClipDuration - 30;
  const authorFadeOut = interpolate(
    authorRelativeFrame,
    [authorFadeOutStart, authorClipDuration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ============================================
  // BACKGROUND ANIMATIONS
  // ============================================
  
  const bgOpacity = interpolate(bgRelativeFrame, [0, 60], [0, 0.7], {
    extrapolateRight: "clamp",
  });

  // ============================================
  // STYLING
  // ============================================
  
  const words = quote.split(" ");
  const baseFontSize = height * 0.05 * fontSize;
  const quoteMarkFontSize = height * 0.1 * fontSize;
  const authorFontSize = baseFontSize * 0.75;

  // Combined opacity for each element
  const quoteOpacityMultiplier = isQuoteVisible ? quoteFadeOut : 0;
  const authorOpacityMultiplier = isAuthorVisible ? authorFadeOut : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Background */}
      {isBgVisible && (
        <AbsoluteFill style={{ opacity: bgOpacity }}>
          <Img
            src={backgroundImage}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.6)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* QUOTE ELEMENTS - only show within quote clip range */}
      {isQuoteVisible && (
        <>
          {/* Quotation mark */}
          <div
            style={{
              position: "absolute",
              fontSize: quoteMarkFontSize,
              fontFamily,
              color: fontColor,
              fontStyle: "italic",
              opacity: quoteMarkOpacity * quoteOpacityMultiplier,
              transform: `scale(${quoteMarkScale})`,
              top: height * 0.12,
              left: width * 0.1,
              lineHeight: 0.8,
              zIndex: 1,
            }}
          >
            "
          </div>

          {/* Main quote text */}
          <div
            style={{
              position: "absolute",
              fontFamily,
              color: fontColor,
              fontSize: baseFontSize,
              fontWeight: 400,
              lineHeight: 1.6,
              textAlign: "center",
              zIndex: 2,
              width: "80%",
              left: "10%",
              top: height * 0.3,
              transform: `translateY(${interpolate(textPush, [0, 1], [50, 0])}px)`,
            }}
          >
            {words.map((word, i) => {
              const opacity = wordAppear(i) * quoteOpacityMultiplier;
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    marginLeft: 12,
                    opacity,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </>
      )}

      {/* AUTHOR ELEMENT - only show within author clip range */}
      {isAuthorVisible && (
        <div
          style={{
            position: "absolute",
            fontFamily,
            color: fontColor,
            fontSize: authorFontSize,
            fontWeight: 600,
            bottom: height * 0.15,
            right: width * 0.1,
            opacity: authorAppear * authorOpacityMultiplier,
            transform: `translateY(${interpolate(
              authorAppear,
              [0, 1],
              [40, 0]
            )}px)`,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            paddingTop: 15,
            textAlign: "right",
            width: "80%",
          }}
        >
          — {author}
        </div>
      )}

      {/* AUDIO CLIPS - Smooth playback using Sequence */}
      {audioClips.map((audioClip, index) => {
        const clipDuration = audioClip.endFrame - audioClip.startFrame;
        
        return (
          <Sequence
            key={`audio-${index}`}
            from={audioClip.startFrame}
            durationInFrames={clipDuration}
          >
            <Audio
              src={audioClip.audioUrl}
              volume={audioClip.volume ?? 1}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};