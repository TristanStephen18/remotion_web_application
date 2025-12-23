import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  Typography,
  IconButton,
  Box,
  Button,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { templateUrlFinder } from "../../../data/DashboardCardsData";
import { TEMPLATE_NAME_TO_ID } from "../../../utils/simpleTemplateRegistry";
import { TemplateNavigator } from "../../../utils/TemplateNavigator";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          overflow: "hidden",
          maxWidth: isMobile ? "100%" : isPortrait ? "700px" : "1000px",
          height: isMobile ? "100%" : "95vh",
          m: isMobile ? 0 : 2,
          position: "relative",
        },
      }}
    >
      {/* Video Background - SINGLE VIDEO */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)",
            zIndex: 2,
          },
        }}
      >
        <video
          ref={videoRef}
          muted
          autoPlay
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          src={`${templateUrlFinder(selectedTemplate as string)}`}
        />
      </Box>

      {/* Close Button */}
      <IconButton
        size="small"
        onClick={onClose}
        sx={{
          position: "absolute",
          top: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24,
          zIndex: 10,
          bgcolor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "white",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.2)",
            transform: "scale(1.05)",
          },
          transition: "all 0.2s ease-in-out",
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Content Overlay */}
      <Box
        sx={{
          position: "relative",
          zIndex: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          p: isMobile ? 3 : 4,
          color: "white",
        }}
      >
        {/* Combined Section - Template Info & Action Button */}
        <Box
          sx={{
            backdropFilter: "blur(20px)",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: isMobile ? 4 : 3,
            p: isMobile ? 3 : 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            ...(isMobile ? {
              width: "100%",
            } : {
              maxWidth: "420px",
              ml: 0,
              mr: "auto",
            }),
          }}
        >
          {/* Template Info */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                mb: isMobile ? 1 : 1.5,
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: isMobile ? "1.5rem" : "1.5rem",
              }}
            >
              {selectedTemplate || "Template"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                lineHeight: 1.5,
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                opacity: 0.9,
                mb: 2,
                fontSize: isMobile ? "0.875rem" : "0.875rem",
              }}
            >
              {selectedDescription || "No description available."}
            </Typography>

            {/* Technical Details - REDUCED SPACING */}
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ flexWrap: "wrap", gap: 0.5 }}
            >
              <Chip
                label={`${videoDimensions.width || 1080}×${videoDimensions.height || 1920}`}
                size="small"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                  fontSize: "0.75rem",
                  height: 28,
                  "& .MuiChip-label": {
                    fontWeight: 600,
                    px: 1,
                  },
                }}
              />
              <Chip
                label={isPortrait ? "Portrait" : "Landscape"}
                size="small"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                  fontSize: "0.75rem",
                  height: 28,
                  "& .MuiChip-label": {
                    fontWeight: 600,
                    px: 1,
                  },
                }}
              />
              {!isMobile && (
                <Chip
                  label="HD Video"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(10px)",
                    fontSize: "0.75rem",
                    height: 28,
                    "& .MuiChip-label": {
                      fontWeight: 600,
                      px: 1,
                    },
                  }}
                />
              )}
            </Stack>
          </Box>

          <Button
            variant="contained"
            disabled={!TEMPLATE_NAME_TO_ID[selectedTemplate || ""]}
            onClick={() => {
  const templateId = TEMPLATE_NAME_TO_ID[selectedTemplate || ""];
  if (templateId) {
    // Check TemplateNavigator first for wizard routes
    const route = TemplateNavigator(selectedTemplate || "");
    
    // If it's a wizard route (not /template/... and not /), use it
    if (route && !route.startsWith("/template") && route !== "/") {
      window.location.assign(route);
    } else {
      window.location.assign(`/editor?template=${templateId}`);
    }
  } else {
    toast.error("This template is currently unavailable");
    return;
  }
  onClose();
}}
            fullWidth
            size={isMobile ? "large" : "large"}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              py: isMobile ? 2 : 1.75,
              fontSize: isMobile ? "1.1rem" : "1rem",
              background: "rgba(255, 255, 255, 0.95)",
              color: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              "&:hover": {
                background: "rgba(255, 255, 255, 1)",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
              },
              "&:disabled": {
                background: "rgba(255, 255, 255, 0.5)",
                color: "rgba(0, 0, 0, 0.4)",
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            {TEMPLATE_NAME_TO_ID[selectedTemplate || ""] ? (
              "✨ Use This Template"
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CloseIcon sx={{ fontSize: 20 }} />
                Unavailable
              </Box>
            )}
          </Button>

          <Typography
            variant={isMobile ? "caption" : "body2"}
            sx={{
              mt: 2,
              textAlign: "center",
              opacity: 0.8,
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
              fontSize: isMobile ? "0.8rem" : "0.8rem",
            }}
          >
            {isMobile
              ? "Tap to start creating with this template"
              : "Start your creative journey with this stunning template"
            }
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};