// import React, { useState, useEffect } from 'react';
// import type { DynamicTextConfig } from '../Holder';

// export interface TextSplitProps {
//   text: string;
//   fontSize: number;
//   fontWeight: string;
//   splitBy: DynamicTextConfig['splitBy'];
//   onChange: (key: keyof DynamicTextConfig, value: any) => void;
//   onTextChange: (value: string) => void;
// }

// const textInputStyle: React.CSSProperties = {
//   width: '100%',
//   padding: '0.8rem',
//   borderRadius: '8px',
//   border: '1px solid #ddd',
//   background: '#fafafa',
//   fontSize: 14,
// };

// const radioStyle: React.CSSProperties = {
//     display: 'flex', 
//     alignItems: 'center', 
//     gap: '0.3rem', 
//     marginRight: '1rem',
//     fontWeight: 500,
//     color: '#333'
// };

// const SliderInput: React.FC<{
//   label: string;
//   value: number;
//   min: number;
//   max: number;
//   step: number;
//   onChange: (value: number) => void;
//   unit?: string;
// }> = ({ label, value, min, max, step, onChange, unit = '' }) => (
//   <label style={{ display: 'block', marginBottom: '1rem' }}>
//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         marginBottom: '0.3rem',
//       }}
//     >
//       <span style={{ fontWeight: 600, color: '#333' }}>{label}</span>
//       <span style={{ color: '#0077ff', fontVariantNumeric: 'tabular-nums' }}>
//         {value} {unit}
//       </span>
//     </div>
//     <input
//       type="range"
//       min={min}
//       max={max}
//       step={step}
//       value={value}
//       onChange={(e) => onChange(Number(e.target.value))}
//       style={{ width: '100%' }}
//     />
//   </label>
// );


// export const TextSplitSection = React.memo<TextSplitProps>(({
//   text,
//   fontSize,
//   fontWeight,
//   splitBy,
//   onChange,
//   onTextChange,
// }) => {
//   const [draftText, setDraftText] = useState(text);

//   useEffect(() => {
//     setDraftText(text);
//   }, [text]);

//   const handleLocalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setDraftText(e.target.value);
//     onTextChange(e.target.value);
//   };
  
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
//         📝 Text & Format
//       </h3>

//       <label style={{ display: 'block', marginBottom: '1rem' }}>
//         <div style={{ marginBottom: '0.3rem', color: '#333', fontWeight: 600 }}>
//           Content (Use `\n` for new line)
//         </div>
//         <textarea
//           rows={3}
//           value={draftText}
//           onChange={handleLocalChange}
//           style={{ ...textInputStyle, minHeight: '80px' }}
//         />
//       </label>

//       <SliderInput
//         label="Font Size"
//         value={fontSize}
//         min={50}
//         max={250}
//         step={5}
//         onChange={(v) => onChange('fontSize', v)}
//         unit="px"
//       />
      
//       <label style={{ display: 'block', marginBottom: '1rem' }}>
//         <div style={{ marginBottom: '0.3rem', color: '#333', fontWeight: 600 }}>
//           Font Weight
//         </div>
//         <select
//           value={fontWeight}
//           onChange={(e) => onChange('fontWeight', e.target.value)}
//           style={textInputStyle}
//         >
//           <option value="900">Black (900)</option>
//           <option value="700">Bold (700)</option>
//           <option value="500">Medium (500)</option>
//         </select>
//       </label>

//       <div style={{ marginBottom: '1rem' }}>
//         <div style={{ marginBottom: '0.3rem', color: '#333', fontWeight: 600 }}>
//           Animate By
//         </div>
//         <div style={{ display: 'flex' }}>
//           {['word', 'letter', 'line'].map((type) => (
//             <label key={type} style={radioStyle}>
//               <input
//                 type="radio"
//                 name="splitBy"
//                 value={type}
//                 checked={splitBy === type}
//                 onChange={() => onChange('splitBy', type as DynamicTextConfig['splitBy'])}
//               />
//               {type.charAt(0).toUpperCase() + type.slice(1)}
//             </label>
//           ))}
//         </div>
//         <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
//           Defines the unit of animation (e.g., each **letter** appears one by one).
//         </p>
//       </div>
//     </div>
//   );
// });