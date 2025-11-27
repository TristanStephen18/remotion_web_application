import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TemplateNavigator } from "../../../utils/TemplateNavigator";
import { templateUrlFinder } from "../../../data/DashboardCardsData";

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
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
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
    return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, [selectedTemplate]);

  // Calculate aspect ratio
  const aspectRatio = videoDimensions.width && videoDimensions.height
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
                width: isPortrait
                  ? { xs: "100%", md: "auto" }
                  : "100%",
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
                label={`${videoDimensions.width || 1080}×${videoDimensions.height || 1920}`} 
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
                onClick={() => {
                  console.log(selectedTemplate);
                  const location = TemplateNavigator(selectedTemplate || "user");
                  window.open(location);
                  onClose();
                }}
                fullWidth
                sx={{
                  borderRadius: "12px",
                  textTransform: "uppercase",
                  fontWeight: 800,
                  background: "linear-gradient(90deg, #d81b60 0%, #42a5f5 100%)",
                  boxShadow: "0 8px 20px rgba(68, 91, 173, 0.12)",
                  py: 1.3,
                }}
              >
                Try this template
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