import React, { useState, useEffect } from "react";
import { Button, Typography, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export const ExportModal: React.FC<{
  showExport: boolean;
  setShowExport: (val: boolean) => void;
  isExporting: boolean;
  exportUrl: string | null;
  onExport: (format: string) => void;
}> = ({ setShowExport, isExporting, exportUrl, onExport }) => {
  const [format, setFormat] = useState("mp4"); 
  const [previewFormat, setPreviewFormat] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>("light");

  // Listen for theme changes
  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = localStorage.getItem("editor-theme") || "light";
      setTheme(currentTheme);
    };

    // Set initial theme
    updateTheme();

    // Listen for storage events (when localStorage changes in other tabs/windows)
    window.addEventListener("storage", updateTheme);

    // Optional: Poll for changes in the same tab (if your coworker updates without triggering storage event)
    const interval = setInterval(updateTheme, 100);

    return () => {
      window.removeEventListener("storage", updateTheme);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (exportUrl) {
      const ext = exportUrl.split(".").pop()?.toLowerCase();
      if (ext === "gif" || ext === "mp4" || ext === "webm") {
        setPreviewFormat(ext); 
      }
    }
  }, [exportUrl]);

  const handleExport = () => {
    onExport(format);
  };

  // Theme-based styles
  const isDark = theme === "dark";
  const bgColor = isDark ? "#1e1e1e" : "#fff";
  const textColor = isDark ? "#e0e0e0" : "#000";
  const secondaryTextColor = isDark ? "#b0b0b0" : "#666";
  const borderColor = isDark ? "#444" : "#ccc";
  const previewBg = isDark ? "#2a2a2a" : "#f9f9f9";
  const selectBg = isDark ? "#2a2a2a" : "#fff";

  return (
    <>
      <div
        onClick={() => setShowExport(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1999,
        }}
      />

      <div
        style={{
          position: "fixed",
          top: "60px",
          right: "40px",
          width: "360px",
          background: bgColor,
          boxShadow: isDark 
            ? "0px 4px 20px rgba(0,0,0,0.6)" 
            : "0px 4px 20px rgba(0,0,0,0.2)",
          borderRadius: "10px",
          zIndex: 2000,
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          transition: "background 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Typography variant="h6" fontWeight={600} style={{ color: textColor }}>
            Export Project
          </Typography>
          <CloseIcon
            onClick={() => setShowExport(false)}
            style={{ cursor: "pointer", color: secondaryTextColor }}
          />
        </div>

        <Typography
          variant="body2"
          style={{ marginBottom: "0.5rem", fontWeight: 500, color: textColor }}
        >
          Choose format:
        </Typography>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1rem",
            borderRadius: "6px",
            border: `1px solid ${borderColor}`,
            background: selectBg,
            color: textColor,
            transition: "background 0.3s ease, border-color 0.3s ease",
          }}
        >
          <option value="mp4">MP4 (Video)</option>
          <option value="gif">GIF</option>
          <option value="webm">WebM</option>
        </select>

        <Button
          variant="contained"
          onClick={handleExport}
          disabled={isExporting}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            mb: 2,
            background: "#1976d2",
            "&:hover": { background: "#1565c0" },
          }}
        >
          {isExporting ? "Exporting..." : "Start Export"}
        </Button>

        {/* Success message */}
        {!isExporting && exportUrl && (
          <Typography
            variant="body2"
            color="success.main"
            style={{ marginBottom: "0.5rem", fontWeight: 600 }}
          >
            🎉 Your export is ready!
          </Typography>
        )}

        {/* File Preview Area */}
        <div
          style={{
            flex: 1,
            marginTop: "0.5rem",
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "9 / 16",
              maxHeight: 100,
              borderRadius: "6px",
              overflow: "hidden",
              background: previewBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.3s ease",
            }}
          >
            {isExporting ? (
              <CircularProgress size={32} sx={{ color: "#1976d2" }} />
            ) : exportUrl ? (
              previewFormat === "gif" ? (
                <img
                  src={exportUrl}
                  alt="Exported GIF"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <video
                  key={exportUrl}
                  controls
                  src={exportUrl}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    background: "#000",
                  }}
                />
              )
            ) : (
              <Typography
                variant="body2"
                style={{
                  textAlign: "center",
                  padding: "0.5rem",
                  fontSize: "0.85rem",
                  color: secondaryTextColor,
                }}
              >
                📹 Your export will appear here
              </Typography>
            )}
          </div>
        </div>

        {exportUrl && (
          <div
            style={{
              marginTop: "0.75rem",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              component="a"
              href={exportUrl ?? "#"}
              download={exportUrl}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!exportUrl || isExporting}
              startIcon={<FileDownloadIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                background: "#1976d2",
                "&:hover": { background: "#1565c0" },
              }}
            >
              Download
            </Button>
          </div>
        )}
      </div>
    </>
  );
};