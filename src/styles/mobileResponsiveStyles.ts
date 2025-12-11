// ============================================================================
// MOBILE RESPONSIVE STYLES (VN Video Editor Style)
// ============================================================================

import type { ThemeColors } from "../contexts/ThemeContext";

export const getMobileResponsiveStyles = (colors: ThemeColors, isMobile: boolean) => {
  return {
    // Main container - changes from row to column on mobile
    mainContainer: {
      display: "flex",
      flexDirection: (isMobile ? "column" : "row") as "column" | "row",
      height: "100vh",
      width: "100vw",
      backgroundColor: colors.bgPrimary,
      overflow: "hidden",
    },

    // Sidebar - moves to bottom on mobile
    sidebar: {
      width: isMobile ? "100%" : "80px",
      height: isMobile ? "60px" : "100%",
      backgroundColor: colors.bgSecondary,
      borderRight: isMobile ? "none" : `1px solid ${colors.border}`,
      borderTop: isMobile ? `1px solid ${colors.border}` : "none",
      display: "flex",
      flexDirection: (isMobile ? "row" : "column") as "row" | "column",
      alignItems: "center",
      justifyContent: isMobile ? "space-around" : "flex-start",
      padding: isMobile ? "0 8px" : "16px 0",
      gap: isMobile ? "0" : "4px",
      position: isMobile ? "fixed" : "relative",
      bottom: isMobile ? 0 : "auto",
      left: isMobile ? 0 : "auto",
      zIndex: isMobile ? 100 : "auto",
      overflowX: isMobile ? "auto" : "visible",
      overflowY: isMobile ? "hidden" : "auto",
    },

    // Content area (preview + timeline)
    contentArea: {
      display: "flex",
      flexDirection: "column" as const,
      flex: 1,
      overflow: "hidden",
      marginBottom: isMobile ? "60px" : 0, // Space for bottom tabs
      position: "relative",
    },

    // Preview container
    previewContainer: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bgPrimary,
      padding: isMobile ? "8px" : "16px",
      overflow: "hidden",
      position: "relative",
    },

    // Timeline container
    timelineContainer: {
      height: isMobile ? "140px" : "auto",
      minHeight: isMobile ? "140px" : "200px",
      backgroundColor: colors.bgSecondary,
      borderTop: `1px solid ${colors.border}`,
      position: "relative",
      zIndex: 10,
    },

    // Panel - overlay on mobile, sidebar on desktop
    panel: {
      width: isMobile ? "100%" : "360px",
      height: isMobile ? "70vh" : "100%",
      backgroundColor: colors.bgPrimary,
      borderLeft: isMobile ? "none" : `1px solid ${colors.border}`,
      borderTop: isMobile ? `2px solid ${colors.border}` : "none",
      borderTopLeftRadius: isMobile ? "16px" : "0",
      borderTopRightRadius: isMobile ? "16px" : "0",
      position: (isMobile ? "fixed" : "relative") as "fixed" | "relative",
      bottom: isMobile ? "60px" : "auto", // Above bottom tabs
      left: isMobile ? 0 : "auto",
      right: isMobile ? 0 : "auto",
      zIndex: isMobile ? 200 : "auto",
      boxShadow: isMobile ? "0 -4px 20px rgba(0, 0, 0, 0.3)" : "none",
      display: "flex",
      flexDirection: "column" as const,
      overflow: "hidden",
      transition: "transform 0.3s ease-in-out",
    },

    // Panel header (mobile only - for dragging)
    panelHeader: {
      display: isMobile ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px",
      backgroundColor: colors.bgSecondary,
      borderTopLeftRadius: "16px",
      borderTopRightRadius: "16px",
      cursor: "grab",
    },

    panelDragHandle: {
      width: "40px",
      height: "4px",
      backgroundColor: colors.borderHeavy,
      borderRadius: "2px",
    },

    // Panel close button (mobile only)
    panelCloseButton: {
      display: isMobile ? "flex" : "none",
      position: "absolute" as const,
      top: "12px",
      right: "12px",
      width: "32px",
      height: "32px",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bgTertiary,
      border: `1px solid ${colors.border}`,
      borderRadius: "50%",
      cursor: "pointer",
      zIndex: 1,
      color: colors.textPrimary,
    },

    // Overlay backdrop (mobile only)
    overlay: {
      display: isMobile ? "block" : "none",
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: "60px", // Above bottom tabs
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 150,
      backdropFilter: "blur(2px)",
    },

    // Sidebar button - adjusted for mobile
    sidebarButton: {
      display: "flex",
      flexDirection: (isMobile ? "column" : "column") as "column",
      alignItems: "center",
      gap: isMobile ? "2px" : "6px",
      padding: isMobile ? "8px 12px" : "12px 8px",
      backgroundColor: "transparent",
      border: "none",
      borderRadius: isMobile ? "8px" : "8px",
      color: colors.textMuted,
      cursor: "pointer",
      transition: "all 0.2s",
      fontSize: isMobile ? "9px" : "10px",
      fontWeight: "500" as const,
      minWidth: isMobile ? "auto" : "100%",
      whiteSpace: "nowrap" as const,
    },

    sidebarButtonActive: {
      backgroundColor: colors.bgActive,
      color: colors.accent,
    },

    // Top bar for mobile (optional - for additional controls)
    mobileTopBar: {
      display: isMobile ? "flex" : "none",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px",
      backgroundColor: colors.bgSecondary,
      borderBottom: `1px solid ${colors.border}`,
      position: "relative",
      zIndex: 50,
    },
  };
};

// Hook to detect mobile screen size
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

// Add React import
import React from "react";