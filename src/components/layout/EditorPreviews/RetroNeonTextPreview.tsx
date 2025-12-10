// import React from 'react';
// import { Player } from '@remotion/player'; 
// import DynamicTextTemplate from '../../remotion_compositions/RetroNeonText';
// import type { DynamicTextConfig } from '../../editors/RetroNeonText/Holder'; 

// // This wrapper is needed to pass config directly as inputProps
// const DynamicTextWrapper: React.FC<{ config: DynamicTextConfig }> = ({ config }) => {
//   return <DynamicTextTemplate {...config} />;
// };

// const RemotionTextPlayer: React.FC<{
//   config: DynamicTextConfig;
//   compositionWidth: number;
//   compositionHeight: number;
// }> = ({ config, compositionWidth, compositionHeight }) => {
//   const fps = 30;
//   const durationInFrames = 8 * fps; // Fixed for a standard loop/preview time

//   return (
//     <Player
//       key={JSON.stringify(config)}
//       component={DynamicTextWrapper}
//       inputProps={{
//         config,
//       }}
//       durationInFrames={durationInFrames}
//       compositionWidth={compositionWidth}
//       compositionHeight={compositionHeight}
//       fps={fps}
//       controls
//       autoPlay
//       loop
//       style={{
//         width: '100%',
//         height: '100%',
//       }}
//     />
//   );
// };

// interface PreviewProps {
//   config: DynamicTextConfig;
//   previewBg: 'dark' | 'light' | 'grey';
//   cycleBg: () => void;
//   showSafeMargins: boolean;
//   onToggleSafeMargins: () => void;
//   previewScale: number;
//   onPreviewScaleChange: (scale: number) => void;
//   isMobile: boolean; 
//   compositionWidth: number;
//   compositionHeight: number;
// }

// export const DynamicTextPreview: React.FC<PreviewProps> = ({
//   config,
//   previewBg,
//   cycleBg,
//   showSafeMargins,
//   onToggleSafeMargins,
//   previewScale,
//   onPreviewScaleChange,
//   isMobile, 
//   // compositionWidth and compositionHeight props are ignored here to enforce 1080x1920
// }) => {
  
//   // Enforce Portrait 9:16 (1080x1920) for the composition.
//   const compositionWidth = 1080;
//   const compositionHeight = 1920;
  
//   const bgHex = '#000'; 
  
//   const aspectRatio = compositionWidth / compositionHeight;
  
//   // --- UPDATED LOGIC FOR PORTRAIT ASPECT RATIO ---
//   const basePreviewHeight = isMobile ? 300 : 700; 
//   let previewHeight = basePreviewHeight; 
//   let previewWidth = previewHeight * aspectRatio;

//   // Adjust preview size constraints for desktop/non-mobile viewing
//   if (!isMobile) {
//       if (previewHeight > 800) {
//           previewHeight = 800; 
//           previewWidth = previewHeight * aspectRatio;
//       }
//       if (previewWidth > 400) { 
//           previewWidth = 400; 
//           previewHeight = previewWidth / aspectRatio;
//       }
//   }
//   // ---------------------------------------------
  
//   const effectivePreviewScale = isMobile ? 1.0 : previewScale;

//   return (
//     <div
//       style={{
//         flex: isMobile ? '0 0 45vh' : '1', 
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         background: bgHex,
//         transition: 'background 0.3s',
//         position: 'relative',
//         order: isMobile ? -1 : 0, 
//         overflow: 'hidden',
//       }}
//     >
//       {/* Theme cycle button is less useful but kept for UI consistency */}
//       <button
//         onClick={cycleBg}
//         style={{
//           position: 'absolute',
//           bottom: isMobile ? '10px' : '20px',
//           right: isMobile ? '10px' : '20px',
//           padding: '0.6rem 1rem',
//           borderRadius: '30px',
//           border: 'none',
//           cursor: 'pointer',
//           color: 'white',
//           fontWeight: 600,
//           background: 'linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)',
//           boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
//           zIndex: 10,
//         }}
//       >
//         {previewBg === 'dark'
//           ? '🌞 Light UI'
//           : previewBg === 'light'
//           ? '⬜ Grey UI'
//           : '🌙 Dark UI'}
//       </button>

//       {/* Checkbox for Safe Margins */}
//       <label
//         style={{
//           position: 'absolute',
//           bottom: isMobile ? '10px' : '20px',
//           left: isMobile ? '10px' : '20px',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '0.4rem',
//           color: '#fff',
//           fontSize: '0.85rem',
//           fontWeight: 500,
//           cursor: 'pointer',
//           zIndex: 10,
//         }}
//       >
//         <input
//           type="checkbox"
//           checked={showSafeMargins}
//           onChange={onToggleSafeMargins}
//         />
//         Show margins
//       </label>

//       {!isMobile && (
//         <div
//           style={{
//             position: 'absolute',
//             bottom: '70px',
//             right: '20px',
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '6px',
//             zIndex: 10,
//           }}
//         >
//           <button
//             title="Increase Live Preview Size"
//             onClick={() =>
//               onPreviewScaleChange(Math.min(previewScale + 0.05, 1.1))
//             }
//             style={{
//               width: '30px',
//               height: '30px',
//               border: 'none',
//               fontSize: '20px',
//               fontWeight: 'bold',
//               cursor: 'pointer',
//               background: 'white',
//               color: 'black',
//               boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
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
//               width: '30px',
//               height: '30px',
//               border: 'none',
//               fontSize: '20px',
//               fontWeight: 'bold',
//               cursor: 'pointer',
//               background: 'white',
//               color: 'black',
//               boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
//             }}
//           >
//             –
//           </button>
//         </div>
//       )}

//       <div
//         style={{
//           transform: `scale(${effectivePreviewScale})`,
//           transformOrigin: 'center center',
//           transition: 'transform 0.2s',
//         }}
//       >
//         {/* Preview container with dynamic aspect ratio, using calculated width and height */}
//         <div
//           style={{
//             width: `${previewWidth}px`,
//             height: `${previewHeight}px`,
//             border: '3px solid #222',
//             borderRadius: '12px',
//             overflow: 'hidden',
//             background: '#000',
//             boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
//             position: 'relative',
//           }}
//         >
//           <RemotionTextPlayer
//             config={config}
//             compositionWidth={compositionWidth}
//             compositionHeight={compositionHeight}
//           />

//           {/* Optional safe margins overlay */}
//           {showSafeMargins && (
//             <div
//               style={{
//                 position: 'absolute',
//                 inset: '5%', 
//                 border: '2px dashed rgba(255,255,255,0.25)',
//                 pointerEvents: 'none',
//                 zIndex: 10,
//               }}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };