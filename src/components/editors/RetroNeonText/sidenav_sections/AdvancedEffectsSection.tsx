// import type React from 'react';
// import type { DynamicTextConfig } from '../Holder';

// export interface AdvancedEffectsProps {
//   environmentalEffects: boolean;
//   advancedEffects: boolean;
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

// export const AdvancedEffectsSection: React.FC<AdvancedEffectsProps> = ({
//   environmentalEffects,
//   advancedEffects,
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
//         🌍 Environmental & Advanced VFX
//       </h3>

//       {/* --- Environmental Effects Toggle --- */}
//       <label style={checkboxStyle}>
//         <input
//           type="checkbox"
//           checked={environmentalEffects}
//           onChange={(e) => onChange('environmentalEffects', e.target.checked)}
//         />
//         <span style={labelStyle}>Enable Environmental Effects</span>
//       </label>
//       <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '1rem' }}>
//           Toggles atmospheric elements like rain, fog, and soft background light blooms.
//       </p>

//       {/* --- Advanced Effects Toggle --- */}
//       <label style={checkboxStyle}>
//         <input
//           type="checkbox"
//           checked={advancedEffects}
//           onChange={(e) => onChange('advancedEffects', e.target.checked)}
//         />
//         <span style={labelStyle}>Enable Advanced Visual Effects</span>
//       </label>
//       <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '1rem' }}>
//           Toggles computationally intensive effects like complex geometric shapes, dynamic matrix rain, and subtle lens flares.
//       </p>
//     </div>
//   );
// };