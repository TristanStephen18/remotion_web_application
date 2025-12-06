import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import { TemplateNavigator } from "../../../utils/TemplateNavigator";
import { templateUrlFinder } from "../../../data/DashboardCardsData";
import { TEMPLATE_NAME_TO_ID } from "../../../utils/simpleTemplateRegistry";
import toast from "react-hot-toast";

interface TemplatePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  selectedTemplate: string | null;
  selectedDescription: string;
}

export const TemplatePreviewDialog: React.FC<TemplatePreviewDialogProps> = ({
  open,
  onClose,
  selectedTemplate,
  selectedDescription,
}) => {
  const [videoDimensions, setVideoDimensions] = useState({
    width: 0,
    height: 0,
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoDimensions({
        width: video.videoWidth,
        height: video.videoHeight,
      });
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () =>
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, [selectedTemplate]);

  // Calculate aspect ratio
  const aspectRatio =
    videoDimensions.width && videoDimensions.height
      ? videoDimensions.width / videoDimensions.height
      : 9 / 16; // Default to portrait (1080x1920)

  const isPortrait = aspectRatio < 1;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
          maxWidth: isPortrait ? "900px" : "1200px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Template Preview
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <Box
          sx={{
            display: "flex",
            gap: 0,
            flexDirection: { xs: "column", md: "row" },
            minHeight: { xs: "auto", md: 480 },
          }}
        >
          {/* Preview Video - No padding, no background, exact aspect ratio */}
          <Box
            sx={{
              flex: "0 0 auto",
              width: {
                xs: "100%",
                md: isPortrait ? "auto" : "60%",
              },
              height: {
                xs: "auto",
                md: isPortrait ? 600 : "auto",
              },
              display: "flex",
              alignItems: "stretch",
              justifyContent: "center",
              bgcolor: "#000",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: isPortrait ? { xs: "100%", md: "auto" } : "100%",
                height: isPortrait
                  ? { xs: `calc(100vw / ${aspectRatio})`, md: "100%" }
                  : { xs: "auto", md: "100%" },
                aspectRatio: isPortrait
                  ? { md: `${aspectRatio}` }
                  : { xs: `${aspectRatio}`, md: "auto" },
                maxHeight: { xs: "70vh", md: isPortrait ? "600px" : "none" },
                bgcolor: "#000",
              }}
            >
              <video
                ref={videoRef}
                muted
                controls
                autoPlay
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
                src={`${templateUrlFinder(selectedTemplate as string)}`}
              />
            </Box>
          </Box>

          {/* Details */}
          <Box
            sx={{
              flex: { xs: "none", md: "1 1 auto" },
              minWidth: { md: "320px" },
              maxWidth: { md: "400px" },
              p: { xs: 2, md: 4 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2.5,
              bgcolor: "background.paper",
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {selectedTemplate ?? "—"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {selectedDescription ?? "No description available."}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip
                label={`${videoDimensions.width || 1080}×${
                  videoDimensions.height || 1920
                }`}
                size="small"
              />
              <Chip
                label={isPortrait ? "Portrait" : "Landscape"}
                size="small"
              />
            </Stack>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                disabled={!TEMPLATE_NAME_TO_ID[selectedTemplate || ""]}
                onClick={() => {
                  console.log(selectedTemplate);
                  const templateId =
                    TEMPLATE_NAME_TO_ID[selectedTemplate || ""];
                  if (templateId) {
                    const location = `/editor?template=${templateId}`;
                    window.open(location, "_blank");
                  } else {
                    toast.error("This template is currently unavailable");
                    return;
                  }
                  onClose();
                }}
                fullWidth
                sx={{
                  borderRadius: "12px",
                  textTransform: "uppercase",
                  fontWeight: 800,
                  py: 1.3,
                  ...(TEMPLATE_NAME_TO_ID[selectedTemplate || ""]
                    ? {
                        background:
                          "linear-gradient(90deg, #d81b60 0%, #42a5f5 100%)",
                        boxShadow: "0 8px 20px rgba(68, 91, 173, 0.12)",
                        "&:hover": {
                          boxShadow: "0 12px 28px rgba(68, 91, 173, 0.2)",
                        },
                      }
                    : {
                        background: "#e0e0e0",
                        color: "#9e9e9e",
                        border: "2px dashed #bdbdbd",
                        boxShadow: "none",
                        cursor: "not-allowed",
                        opacity: 0.6,
                        "&:hover": {
                          background: "#e0e0e0",
                        },
                      }),
                }}
              >
                {TEMPLATE_NAME_TO_ID[selectedTemplate || ""] ? (
                  "Try this template"
                ) : (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <svg
                      style={{ width: "16px", height: "16px" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Unavailable
                  </span>
                )}
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Tip: Use batch rendering for multiple variations. Single output
              opens the template editor.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
