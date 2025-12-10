// import type React from 'react';
// import type { DynamicTextConfig } from '../Holder';

// export interface AnimationProps {
//   animationType: DynamicTextConfig['animationType'];
//   onChange: (key: keyof DynamicTextConfig, value: any) => void;
// }

// // --- Option Data ---
// const animationOptions: Array<{ value: DynamicTextConfig['animationType']; label: string; description: string }> = [
//     { value: 'typewriter', label: 'Typewriter', description: 'Sequentially reveals text one unit at a time.' },
//     { value: 'fade', label: 'Fade-in', description: 'Simple, simultaneous opacity transition for smooth appearance.' },
//     { value: 'slide', label: 'Slide-up', description: 'Text slides in from below with a slight bounce effect.' },
//     { value: 'wave', label: 'Wave Motion', description: 'Applies a continuous, undulating sine motion.' },
//     { value: 'glitch', label: 'Glitch Effect', description: 'Flicker, distort, and shift for a broken signal look.' },
//     { value: 'lightning', label: 'Lightning Strike', description: 'Rapid, sporadic flash of light and text visibility.' },
//     { value: 'morph', label: 'Morph', description: 'Continuously transforms the text shape and position.' },
//     { value: 'audioReactive', label: 'Audio Reactive', description: 'Pulsates based on sound volume or beat simulation.' },
//     { value: 'matrix', label: 'Matrix Rain', description: 'Appears as if falling code lines form the final text.' },
// ];

// // --- Shared Styles ---
// const buttonContainerStyle: React.CSSProperties = {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
//     gap: '0.6rem',
// };

// const baseButtonStyle: React.CSSProperties = {
//     padding: '0.6rem 0.8rem',
//     borderRadius: '8px',
//     border: '1px solid #ddd',
//     background: '#fafafa',
//     cursor: 'pointer',
//     fontSize: 13,
//     fontWeight: 500,
//     transition: 'all 0.15s ease-in-out',
//     display: 'flex',
//     flexDirection: 'column',
//     textAlign: 'center',
//     minHeight: '65px',
//     justifyContent: 'center',
// };

// const activeButtonStyle: React.CSSProperties = {
//     borderColor: '#0077ff',
//     background: '#e6f0ff',
//     color: '#0077ff',
// };

// // --- Custom Component ---

// const AnimationButton: React.FC<{
//     value: DynamicTextConfig['animationType'];
//     current: DynamicTextConfig['animationType'];
//     label: string;
//     description: string;
//     onChange: (value: DynamicTextConfig['animationType']) => void;
// }> = ({ value, current, label, description, onChange }) => {
//     const isActive = value === current;

//     // Styling based on the animation's nature
//     const visualStyle: React.CSSProperties = {
//         fontWeight: 700,
//         fontSize: '15px',
//         marginBottom: '0.3rem',
//         // Visual cues for the effect
//         ...(value === 'glitch' && { 
//             color: isActive ? '#ff0077' : '#e74c3c', 
//             textDecoration: 'underline wavy #ff0077 1px',
//         }),
//         ...(value === 'wave' && { 
//             color: isActive ? '#0077ff' : '#3498db', 
//             textShadow: isActive ? '0 2px 2px rgba(0,0,0,0.1)' : 'none',
//         }),
//         ...(value === 'lightning' && { 
//             color: isActive ? '#ffd700' : '#f1c40f', 
//             border: `1px dashed ${isActive ? '#ffd700' : '#f1c40f'}`,
//             padding: '2px 0',
//         }),
//         ...(value === 'matrix' && { 
//             color: isActive ? '#00ff41' : '#00cc33', 
//             fontFamily: 'monospace',
//         }),
//         ...(value === 'audioReactive' && { 
//             color: isActive ? '#9b59b6' : '#8e44ad', 
//             transform: `scale(${isActive ? 1.05 : 1})`,
//             transition: 'transform 0.2s',
//         }),
//     };

//     return (
//         <button
//             onClick={() => onChange(value)}
//             style={{
//                 ...baseButtonStyle,
//                 ...(isActive ? activeButtonStyle : {}),
//                 borderColor: isActive ? '#0077ff' : '#ddd',
//             }}
//             title={description}
//         >
//             <span style={visualStyle}>
//                 {label}
//             </span>
//             <span style={{ fontSize: '0.65rem', color: isActive ? '#0077ff' : '#666' }}>
//                 {description.split('(')[0].trim()}
//             </span>
//         </button>
//     );
// };


// // --- Main Component ---

// export const AnimationSection: React.FC<AnimationProps> = ({
//   animationType,
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
//         ▶️ Entrance Animation
//       </h3>

//       <div style={{ marginBottom: '1rem' }}>
//         <div style={{ marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>
//           Animation Type
//         </div>
//         <div style={buttonContainerStyle}>
//           {animationOptions.map(opt => (
//               <AnimationButton 
//                 key={opt.value} 
//                 value={opt.value} 
//                 current={animationType} 
//                 label={opt.label}
//                 description={opt.description}
//                 onChange={(v) => onChange('animationType', v)}
//               />
//           ))}
//         </div>
//         <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '1rem' }}>
//           The entrance and continuous motion effect applied to the text.
//         </p>
//       </div>
      
//       <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem' }}>
//         The choice of animation heavily influences the overall video mood.
//       </p>
//     </div>
//   );
// };