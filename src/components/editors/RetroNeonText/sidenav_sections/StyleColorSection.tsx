// import type React from 'react';
// import type { DynamicTextConfig } from '../Holder';

// export interface StyleColorProps {
//   style: DynamicTextConfig['style'];
//   colorScheme: DynamicTextConfig['colorScheme'];
//   spacing: DynamicTextConfig['spacing'];
//   onChange: (key: keyof DynamicTextConfig, value: any) => void;
// }

// // --- Option Data ---
// const spacingOptions: Array<{ value: DynamicTextConfig['spacing']; label: string }> = [
//     { value: 'tight', label: 'Tight' },
//     { value: 'normal', label: 'Normal' },
//     { value: 'wide', label: 'Wide' },
// ];

// const styleOptions: Array<{ value: DynamicTextConfig['style']; label: string }> = [
//     { value: 'neon', label: 'Neon Glow' },
//     { value: 'cyber', label: 'Cyberpunk Shadow' },
//     { value: 'gradient', label: 'Gradient Fill' },
//     { value: 'glass', label: 'Frosted Glass' },
//     { value: 'holographic', label: 'Holographic' },
//     { value: 'liquid', label: 'Liquid Flow' },
//     { value: 'electric', label: 'Electric Spark' },
//     { value: 'matrix', label: 'Matrix Code' },
// ];

// const colorSchemeOptions: Array<{ value: DynamicTextConfig['colorScheme']; label: string; color: string }> = [
//     { value: 'electric', label: 'Electric (Green/Blue)', color: 'linear-gradient(45deg, #00ff00, #0077ff)' },
//     { value: 'sunset', label: 'Sunset (Orange/Yellow)', color: 'linear-gradient(45deg, #ff8c00, #ffd700)' },
//     { value: 'ocean', label: 'Ocean (Cyan/Blue)', color: 'linear-gradient(45deg, #00ffff, #0000ff)' },
//     { value: 'cosmic', label: 'Cosmic (Purple/Pink)', color: 'linear-gradient(45deg, #8a2be2, #ff69b4)' },
//     { value: 'monochrome', label: 'Monochrome (White/Grey)', color: 'linear-gradient(45deg, #ffffff, #aaaaaa)' },
//     { value: 'rainbow', label: 'Rainbow (Multi-Hue)', color: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)' },
// ];

// // --- Shared Styles ---
// const buttonContainerStyle: React.CSSProperties = {
//     display: 'flex',
//     flexWrap: 'wrap',
//     gap: '0.5rem',
// };

// const baseButtonStyle: React.CSSProperties = {
//     padding: '0.6rem 1rem',
//     borderRadius: '8px',
//     border: '1px solid #ddd',
//     background: '#fafafa',
//     cursor: 'pointer',
//     fontSize: 14,
//     fontWeight: 500,
//     transition: 'all 0.15s ease-in-out',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '0.5rem',
//     flexShrink: 0,
// };

// const activeButtonStyle: React.CSSProperties = {
//     borderColor: '#0077ff',
//     background: '#e6f0ff',
//     color: '#0077ff',
// };

// // --- Spacing Button Map (for visual representation) ---
// const spacingVisualMap: Record<DynamicTextConfig['spacing'], React.CSSProperties> = {
//     tight: { letterSpacing: '-0.05em' },
//     normal: { letterSpacing: '0em' },
//     wide: { letterSpacing: '0.2em' },
// };

// // --- Custom Components ---

// const StyleButton: React.FC<{
//     value: DynamicTextConfig['style'];
//     current: DynamicTextConfig['style'];
//     label: string;
//     onChange: (value: DynamicTextConfig['style']) => void;
// }> = ({ value, current, label, onChange }) => {
//     const isActive = value === current;
    
//     // Simplistic visual representation based on style
//     const styleVisual = (
//         <span 
//             style={{ 
//                 height: '10px', 
//                 width: '10px', 
//                 borderRadius: '2px', 
//                 border: value === 'glass' ? '1px solid #999' : 'none',
//                 background: value === 'neon' ? '#0077ff' : 
//                             value === 'cyber' ? '#222' :
//                             value === 'gradient' ? 'linear-gradient(45deg, #0077ff, #ff0077)' :
//                             value === 'glass' ? 'rgba(255,255,255,0.4)' :
//                             value === 'holographic' ? 'radial-gradient(circle, #ff00ff, #00ffff)' :
//                             value === 'liquid' ? '#00cccc' :
//                             value === 'electric' ? 'yellow' :
//                             value === 'matrix' ? 'green' : '#999',
//                 boxShadow: value === 'neon' ? '0 0 4px #0077ff' : 'none',
//             }}
//         />
//     );

//     return (
//         <button
//             onClick={() => onChange(value)}
//             style={{
//                 ...baseButtonStyle,
//                 ...(isActive ? activeButtonStyle : {}),
//             }}
//         >
//             {styleVisual}
//             {label}
//         </button>
//     );
// };

// const ColorSchemeButton: React.FC<{
//     value: DynamicTextConfig['colorScheme'];
//     current: DynamicTextConfig['colorScheme'];
//     label: string;
//     color: string;
//     onChange: (value: DynamicTextConfig['colorScheme']) => void;
// }> = ({ value, current, label, color, onChange }) => {
//     const isActive = value === current;

//     const colorVisual = (
//         <span 
//             style={{ 
//                 height: '14px', 
//                 width: '14px', 
//                 borderRadius: '50%', 
//                 background: color, 
//                 border: isActive ? '2px solid #0077ff' : '1px solid #999'
//             }}
//         />
//     );

//     return (
//         <button
//             onClick={() => onChange(value)}
//             style={{
//                 ...baseButtonStyle,
//                 ...(isActive ? activeButtonStyle : {}),
//             }}
//         >
//             {colorVisual}
//             {label.split('(')[0].trim()}
//         </button>
//     );
// };

// const SpacingButton: React.FC<{
//     value: DynamicTextConfig['spacing'];
//     current: DynamicTextConfig['spacing'];
//     label: string;
//     onChange: (value: DynamicTextConfig['spacing']) => void;
// }> = ({ value, current, label, onChange }) => {
//     const isActive = value === current;

//     return (
//         <button
//             onClick={() => onChange(value)}
//             style={{
//                 ...baseButtonStyle,
//                 ...(isActive ? activeButtonStyle : {}),
//             }}
//         >
//             <span style={{ 
//                 fontWeight: 800, 
//                 ...spacingVisualMap[value] 
//             }}>A B C</span>
//             {label}
//         </button>
//     );
// };


// // --- Main Component ---

// export const StyleColorSection: React.FC<StyleColorProps> = ({
//   style,
//   colorScheme,
//   spacing,
//   onChange,
// }) => {
//   return (
//     <div
//       style={{
//         marginBottom: '1.5rem',
//         padding: '1rem',
//         background: '#fff',
//         borderRadius: '12px',
//         boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
//         border: '1px solid #eee',
//       }}
//     >
//       <h3 style={{ marginBottom: '1rem', color: '#0077ff' }}>
//         🎨 Style & Color Scheme
//       </h3>

//       {/* --- Style --- */}
//       <div style={{ marginBottom: '1.5rem' }}>
//         <div style={{ marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>
//           Visual Style
//         </div>
//         <div style={buttonContainerStyle}>
//           {styleOptions.map(opt => (
//               <StyleButton 
//                 key={opt.value} 
//                 value={opt.value} 
//                 current={style} 
//                 label={opt.label}
//                 onChange={(v) => onChange('style', v)}
//               />
//           ))}
//         </div>
//         <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
//           Defines the core look: glow, shadow, fill, or texture.
//         </p>
//       </div>

//       {/* --- Color Scheme --- */}
//       <div style={{ marginBottom: '1.5rem' }}>
//         <div style={{ marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>
//           Color Scheme Preset
//         </div>
//         <div style={buttonContainerStyle}>
//           {colorSchemeOptions.map(opt => (
//               <ColorSchemeButton 
//                 key={opt.value} 
//                 value={opt.value} 
//                 current={colorScheme} 
//                 label={opt.label}
//                 color={opt.color}
//                 onChange={(v) => onChange('colorScheme', v)}
//               />
//           ))}
//         </div>
//         <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
//           A global preset that determines the primary, secondary, and background colors.
//         </p>
//       </div>
      
//       {/* --- Spacing --- */}
//       <div style={{ marginBottom: '1rem' }}>
//         <div style={{ marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>
//           Letter Spacing
//         </div>
//         <div style={buttonContainerStyle}>
//           {spacingOptions.map(opt => (
//               <SpacingButton 
//                 key={opt.value} 
//                 value={opt.value} 
//                 current={spacing} 
//                 label={opt.label}
//                 onChange={(v) => onChange('spacing', v)}
//               />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };