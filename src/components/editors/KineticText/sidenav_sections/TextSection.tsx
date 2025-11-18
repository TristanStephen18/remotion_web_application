import type React from "react";

export interface KineticTextProps {
  words: string[];
  setWords: React.Dispatch<React.SetStateAction<string[]>>;
}

export const KineticTextSection: React.FC<KineticTextProps> = ({
  words,
  setWords,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Split text by new lines to create the array of words
    setWords(e.target.value.split("\n"));
  };

  return (
    <div
      style={{
        marginBottom: "1.5rem",
        padding: "1rem",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        border: "1px solid #eee",
      }}
    >
      <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>
        📝 Text Content
      </h3>

      <label style={{ display: "block", marginBottom: "1rem" }}>
        <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
          Words (one per line)
        </div>
        <textarea
          value={words.join("\n")} // Join array with newlines for the textarea
          onChange={handleChange}
          style={{
            width: "100%",
            height: 150,
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#fafafa",
            fontSize: 14,
            fontFamily: "monospace",
          }}
        />
      </label>
      <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "-0.5rem" }}>
        Each line you enter here will be treated as a separate word that flies
        into the center.
      </p>
    </div>
  );
};