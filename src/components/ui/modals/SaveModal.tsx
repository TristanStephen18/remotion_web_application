import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";

interface SaveProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, setStatus: (s: string) => void, screenshot: string) => Promise<void>;
  initialTitle?: string;
  screenshot: string;
}

const progressMessages = [
  "Still working on saving your design…",
  "Crunching data, almost there…",
  "Polishing up the final details…",
  "Hang tight, just a little longer…",
  "Making sure everything is perfect…",
];

type Mode = "editing" | "saving" | "success" | "error";

export const SaveProjectModal: React.FC<SaveProjectModalProps> = ({
  open,
  onClose,
  onSave,
  initialTitle = "",
  screenshot
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [status, setStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("editing");
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

    // Poll for changes in the same tab
    const interval = setInterval(updateTheme, 100);

    return () => {
      window.removeEventListener("storage", updateTheme);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setStatus(null);
      setErrorMessage(null);
      setMessageIndex(0);
      setMode("editing");
    }
  }, [open, initialTitle]);

  useEffect(() => {
    if (mode !== "saving") return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % progressMessages.length);
      setStatus(progressMessages[messageIndex]);
    }, 20000);

    return () => clearInterval(interval);
  }, [mode, messageIndex]);

  const handleSaveClick = async () => {
    if (!title.trim()) {
      setErrorMessage("Design name is required.");
      setMode("error");
      return;
    }

    setErrorMessage(null);
    setMode("saving");
    setStatus("Starting…");
    setMessageIndex(0);

    try {
      await onSave(title.trim(), (s) => setStatus(s), screenshot);
      setStatus("Your design was successfully saved! You can now view it in your templates!");
      setMode("success");
    } catch (err: any) {
      console.error("Save failed:", err);
      const message =
        (err && (err.message || (err.error ?? err))) || "Failed to save template";
      setErrorMessage(String(message));
      setMode("error");
    }
  };

  // Theme-based styles
  const isDark = theme === "dark";
  const bgColor = isDark ? "#1e1e1e" : "#fff";
  const textColor = isDark ? "#e0e0e0" : "rgba(0, 0, 0, 0.87)";
  const secondaryTextColor = isDark ? "#b0b0b0" : "rgba(0, 0, 0, 0.6)";

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (mode === "editing") onClose();
      }}
      PaperProps={{
        sx: {
          borderRadius: "14px",
          padding: 0,
          minWidth: 360,
          maxWidth: 480,
          backgroundColor: bgColor,
          transition: "background-color 0.3s ease",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1rem",
          fontWeight: 700,
          textAlign: "center",
          pb: 0,
          color: textColor,
        }}
      >
        {mode === "success"
          ? "Success"
          : mode === "error"
          ? "Error"
          : "Save this Design?"}
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 1 }}>
        {mode === "editing" && (
          <TextField
            label="Give your design a name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            size="small"
            error={!!errorMessage}
            helperText={errorMessage ?? "Give your design a descriptive name"}
            autoFocus
            sx={{
              "& .MuiInputBase-root": {
                color: textColor,
                backgroundColor: isDark ? "#2a2a2a" : "#fff",
              },
              "& .MuiInputLabel-root": {
                color: secondaryTextColor,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? "#444" : "rgba(0, 0, 0, 0.23)",
              },
              "& .MuiFormHelperText-root": {
                color: errorMessage ? undefined : secondaryTextColor,
              },
            }}
          />
        )}

        {mode === "saving" && (
          <Box mt={2} display="flex" alignItems="center" gap={1}>
            <CircularProgress size={18} />
            <Typography variant="body2" sx={{ color: textColor }}>
              {status}
            </Typography>
          </Box>
        )}

        {mode === "success" && (
          <Typography variant="body1" color="success.main" sx={{ mt: 1 }}>
            🎉 {status}
          </Typography>
        )}

        {mode === "error" && (
          <Typography variant="body1" color="error.main" sx={{ mt: 1 }}>
            ⚠️ {errorMessage}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2 }}>
        {mode === "editing" ? (
          <>
            <Button
              onClick={onClose}
              sx={{ 
                borderRadius: 1, 
                textTransform: "none",
                color: textColor,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveClick}
              variant="contained"
              sx={{ borderRadius: 1, textTransform: "none", px: 3 }}
            >
              Save
            </Button>
          </>
        ) : mode === "saving" ? (
          <Button 
            disabled 
            variant="outlined" 
            sx={{ 
              borderRadius: 1,
              color: secondaryTextColor,
            }}
          >
            Please wait...
          </Button>
        ) : (
          <Button
            onClick={onClose}
            variant="contained"
            sx={{ borderRadius: 1, textTransform: "none", px: 3 }}
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};