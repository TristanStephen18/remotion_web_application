import React from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Button,
} from "@mui/material";

// Glass/Transparent Template Card Component
export const MinimalTemplateCard: React.FC<{
  label: string;
  description: string;
  onSelect: (template: string, description: string) => void;
  available: boolean;
  url: string;
}> = ({ label, description, onSelect, url, available }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (available) {
      onSelect(label, description);
    }
  };

  return (
    <Card
      onClick={isMobile ? handleClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        borderRadius: isMobile ? 3 : 4,
        overflow: "visible",
        background: available
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid",
        borderColor: available
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(255, 255, 255, 0.1)",
        cursor: available && isMobile ? "pointer" : "default",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: available
          ? "0 8px 32px rgba(31, 38, 135, 0.15)"
          : "0 4px 16px rgba(31, 38, 135, 0.08)",
        "&:hover": available
          ? {
              transform: isMobile ? "translateY(-4px)" : "translateY(-8px)",
              boxShadow: "0 12px 48px rgba(31, 38, 135, 0.2)",
              background: "rgba(255, 255, 255, 0.15)",
              borderColor: "rgba(255, 255, 255, 0.3)",
            }
          : {},
        opacity: available ? 1 : 0.6,
      }}
    >
      {/* Image Preview */}
      <Box
        sx={{
          position: "relative",
          height: isMobile ? 100 : 120,
          overflow: "hidden",
          bgcolor: "grey.900",
          borderRadius: `${isMobile ? 12 : 16}px ${isMobile ? 12 : 16}px 0 0`,
        }}
      >
        <img
          alt={`${label} preview`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: available ? "none" : "grayscale(100%)",
            transition: "transform 0.3s ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
          src={url}
        />
        {!available && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(8px)",
              borderRadius: 2,
              px: 1.5,
              py: 0.75,
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 14, color: "#fff" }} />
            <Typography
              variant="caption"
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.5px",
              }}
            >
              SOON
            </Typography>
          </Box>
        )}
      </Box>

      <CardContent
        sx={{
          p: isMobile ? 2 : 2.5,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "transparent",
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{
            mb: 0.75,
            lineHeight: 1.3,
            fontSize: isMobile ? "0.9375rem" : "1rem",
            color: available ? "grey.900" : "grey.600",
            letterSpacing: "-0.01em",
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.5,
            fontSize: isMobile ? "0.75rem" : "0.8125rem",
            flex: 1,
            color: available ? "grey.700" : "grey.500",
            opacity: 0.9,
          }}
        >
          {description}
        </Typography>

        {/* Desktop-only Button */}
        {!isMobile && available && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              size="small"
              fullWidth
              onClick={handleClick}
              endIcon={
                <ArrowForwardIcon
                  sx={{
                    fontSize: 18,
                    transition: "transform 0.2s ease",
                    transform: isHovered ? "translateX(4px)" : "translateX(0)",
                  }}
                />
              }
              sx={{
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.875rem",
                borderRadius: 2.5,
                py: 1,
                background: "rgba(25, 118, 210, 0.8)",
                backdropFilter: "blur(10px)",
                color: "white",
                boxShadow: isHovered
                  ? "0 8px 24px rgba(25, 118, 210, 0.3)"
                  : "0 4px 12px rgba(25, 118, 210, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                letterSpacing: "0.3px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  background: "rgba(25, 118, 210, 0.9)",
                  boxShadow: "0 12px 32px rgba(25, 118, 210, 0.4)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              Try this template
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};