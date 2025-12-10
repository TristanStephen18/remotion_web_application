// import type React from 'react';
// import type { DynamicTextConfig } from '../Holder';

// export interface CoreEffectsProps {
//   effects: boolean;
//   audioReactive: boolean;
//   interactiveMode: boolean;
//   onChange: (key: keyof DynamicTextConfig, value: any) => void;
// }

// const checkboxStyle: React.CSSProperties = {
//     display: 'flex', 
//     alignItems: 'center', 
//     gap: '0.5rem', 
//     marginBottom: '1rem',
//     cursor: 'pointer',
// };

// const labelStyle: React.CSSProperties = {
//     fontWeight: 600, 
//     color: '#333'
// };

// export const CoreEffectsSection: React.FC<CoreEffectsProps> = ({
//   effects,
//   audioReactive,
//   interactiveMode,
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
//         ✨ Core Effects
//       </h3>

//       {/* --- Particles/Effects Toggle --- */}
//       <label style={checkboxStyle}>
//         <input
//           type="checkbox"
//           checked={effects}
//           onChange={(e) => onChange('effects', e.target.checked)}
//         />
//         <span style={labelStyle}>Enable Particle Systems</span>
//       </label>
//       <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '1rem' }}>
//           Toggles secondary particle animations (sparks, dots, general noise).
//       </p>

//       {/* --- Audio Reactive Toggle --- */}
//       <label style={checkboxStyle}>
//         <input
//           type="checkbox"
//           checked={audioReactive}
//           onChange={(e) => onChange('audioReactive', e.target.checked)}
//           disabled={!effects} 
//         />
//         <span style={labelStyle}>Simulate Audio Reactivity</span>
//       </label>
//       <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '1rem' }}>
//           Simulates pulsating effects and beat triggers based on time, ideal for music visualizations.
//       </p>

//       {/* --- Interactive Mode Toggle --- */}
//       <label style={checkboxStyle}>
//         <input
//           type="checkbox"
//           checked={interactiveMode}
//           onChange={(e) => onChange('interactiveMode', e.target.checked)}
//         />
//         <span style={labelStyle}>Simulate Interactive Mode</span>
//       </label>
//       <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '1rem' }}>
//           (For future use) Simulates effects that would react to user input (e.g., hover).
//       </p>
//     </div>
//   );
// };