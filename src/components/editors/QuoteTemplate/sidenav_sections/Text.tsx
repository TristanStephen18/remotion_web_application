import type React from "react";
import { fontOptions } from "../../../../data/Fonts";
import { Box } from "@mui/material";
import { useState } from "react";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";

export interface CombinedQuoteEditorProps {
  quote: string;
  author: string;
  setQuote: React.Dispatch<React.SetStateAction<string>>;
  setAuthor: React.Dispatch<React.SetStateAction<string>>;
  handleAISuggestion: () => void;
  isGenerating: boolean;
  fontFamily: string;
  setFontFamily: React.Dispatch<React.SetStateAction<string>>;
  fontColor: string;
  setFontColor: React.Dispatch<React.SetStateAction<string>>;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
}

export const QuoteEditor: React.FC<CombinedQuoteEditorProps> = ({
  quote,
  author,
  setQuote,
  setAuthor,
  handleAISuggestion,
  isGenerating,
  fontFamily,
  fontColor,
  fontSize,
  setFontFamily,
  setFontColor,
  setFontSize,
}) => {
  const [fontWeight, setFontWeight] = useState<string>("Regular");
  const [opacity, setOpacity] = useState<number>(100);
  const [textOutline, setTextOutline] = useState<boolean>(false);
  const [textShadow, setTextShadow] = useState<boolean>(false);
  const [shadowX, setShadowX] = useState<number>(0);
  const [shadowY, setShadowY] = useState<number>(0);
  const [shadowBlur, setShadowBlur] = useState<number>(0);
  const [underline, setUnderline] = useState<boolean>(false);
  const [strikethrough, setStrikethrough] = useState<boolean>(false);

  const sectionStyle: React.CSSProperties = {
    marginBottom: "1.5rem",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.875rem",
    color: "#666",
    marginBottom: "0.5rem",
    fontWeight: 500,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    background: "#f5f5f5",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: "pointer",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1rem",
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem",
        background: "#fff",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          margin: "0 0 1.5rem 0",
          fontSize: "1.1rem",
          color: "#333",
          fontWeight: 600,
        }}
      >
        Edit Text
      </h3>

      {/* Quote Text Area */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Quote</label>
        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="Enter your quote here"
          style={{
            ...inputStyle,
            minHeight: "100px",
            resize: "vertical",
            lineHeight: "1.5",
          }}
        />
      </div>

      {/* Author Field */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Author</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="e.g. Abraham Lincoln"
          style={inputStyle}
        />
      </div>

      {/* Style Section - Font Family */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Font Family</label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          style={selectStyle}
        >
          {fontOptions.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Weight and Size Row */}
      <div style={{ ...sectionStyle, display: "flex", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Weight</label>
          <select
            value={fontWeight}
            onChange={(e) => setFontWeight(e.target.value)}
            style={selectStyle}
          >
            <option value="Light">Light</option>
            <option value="Regular">Regular</option>
            <option value="Medium">Medium</option>
            <option value="Bold">Bold</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Size</label>
          <input
            type="number"
            value={Math.round(fontSize * 100)}
            onChange={(e) => setFontSize(Number(e.target.value) / 100)}
            style={selectStyle}
            min="10"
            max="200"
          />
        </div>
      </div>

      {/* Text Formatting Buttons */}
      <div style={{ ...sectionStyle, display: "flex", gap: "0.5rem", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setUnderline(!underline)}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              background: underline ? "#f0f0f0" : "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FormatUnderlinedIcon fontSize="small" />
          </button>
          <button
            onClick={() => setStrikethrough(!strikethrough)}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              background: strikethrough ? "#f0f0f0" : "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FormatStrikethroughIcon fontSize="small" />
          </button>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button style={{ padding: "0.5rem 1rem", border: "1px solid #e0e0e0", background: "#fff", cursor: "pointer", fontSize: "0.85rem", borderRadius: "6px" }}>AA</button>
          <button style={{ padding: "0.5rem 1rem", border: "1px solid #e0e0e0", background: "#fff", cursor: "pointer", fontSize: "0.85rem", borderRadius: "6px" }}>aa</button>
          <button style={{ padding: "0.5rem 1rem", border: "1px solid #e0e0e0", background: "#fff", cursor: "pointer", fontSize: "0.85rem", borderRadius: "6px" }}>Aa</button>
          <button style={{ padding: "0.5rem 1rem", border: "1px solid #e0e0e0", background: "#fff", cursor: "pointer", fontSize: "0.85rem", borderRadius: "6px" }}>TT</button>
        </div>
      </div>

      {/* Opacity */}
      <div style={sectionStyle}>
        <div style={rowStyle}>
          <span style={labelStyle}>Opacity</span>
          <input
            type="checkbox"
            checked={opacity === 100}
            onChange={(e) => setOpacity(e.target.checked ? 100 : 50)}
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
          />
        </div>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <input
            type="range"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            min={0}
            max={100}
            style={{ flex: 1, cursor: "pointer" }}
          />
          <span style={{ minWidth: "40px", fontSize: "0.9rem", color: "#666" }}>{opacity}</span>
        </Box>
      </div>

      {/* Text Outline */}
      <div style={sectionStyle}>
        <div style={rowStyle}>
          <span style={labelStyle}>Text Outline</span>
          <input
            type="checkbox"
            checked={textOutline}
            onChange={(e) => setTextOutline(e.target.checked)}
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
          />
        </div>
        <Box
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "2px solid #e0e0e0",
            bgcolor: "#000",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Text Shadow */}
      <div style={sectionStyle}>
        <div style={rowStyle}>
          <span style={labelStyle}>Text Shadow</span>
          <input
            type="checkbox"
            checked={textShadow}
            onChange={(e) => setTextShadow(e.target.checked)}
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
          />
        </div>
        <Box
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "2px solid #e0e0e0",
            bgcolor: "#000",
            cursor: "pointer",
            mb: 2,
          }}
        />
        
        {/* Shadow Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", color: "#666" }}>X</span>
          <input
            type="number"
            value={shadowX}
            onChange={(e) => setShadowX(Number(e.target.value))}
            style={{ width: "80px", padding: "0.25rem", textAlign: "right", border: "1px solid #e0e0e0", borderRadius: "4px" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", color: "#666" }}>Y</span>
          <input
            type="number"
            value={shadowY}
            onChange={(e) => setShadowY(Number(e.target.value))}
            style={{ width: "80px", padding: "0.25rem", textAlign: "right", border: "1px solid #e0e0e0", borderRadius: "4px" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.85rem", color: "#666" }}>Blur</span>
          <input
            type="number"
            value={shadowBlur}
            onChange={(e) => setShadowBlur(Number(e.target.value))}
            style={{ width: "80px", padding: "0.25rem", textAlign: "right", border: "1px solid #e0e0e0", borderRadius: "4px" }}
          />
        </div>
      </div>

      {/* Color Picker */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Text Color</label>
        <input
          type="color"
          value={fontColor}
          onChange={(e) => setFontColor(e.target.value)}
          style={{
            width: "100%",
            height: "50px",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            cursor: "pointer",
          }}
        />
      </div>

      {/* AI Generate Button */}
      <button
        onClick={handleAISuggestion}
        disabled={isGenerating}
        style={{
          width: "100%",
          padding: "0.85rem",
          borderRadius: "8px",
          border: "none",
          cursor: isGenerating ? "not-allowed" : "pointer",
          color: "white",
          fontWeight: 600,
          background: isGenerating
            ? "#999"
            : "linear-gradient(90deg,#667eea,#764ba2)",
          marginBottom: "1rem",
          fontSize: "0.95rem",
        }}
      >
        {isGenerating ? "⏳ Generating..." : "✨ Generate with AI"}
      </button>

      {/* Delete Button */}
      <button
        style={{
          width: "100%",
          padding: "0.85rem",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
          background: "#fff",
          cursor: "pointer",
          fontWeight: 500,
          color: "#666",
          fontSize: "0.95rem",
        }}
      >
        Delete Text
      </button>
    </Box>
  );
};