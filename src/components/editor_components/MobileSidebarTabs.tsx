import React from "react";
import { useNavigate } from "react-router-dom";
import { EditorIcons } from "./EditorIcons";
import type { SidebarTab } from "../../types/editor_types/index";
import { useTheme } from "../../contexts/ThemeContext";

const ChatIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const LayoutIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="12" x2="21" y2="12" />
  </svg>
);

const WatchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="7" />
    <polyline points="12 9 12 12 13.5 13.5" />
    <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.35-10.7l.35-3.83A2 2 0 0 1 9.83 2h4.35a2 2 0 0 1 2 1.82l.35 3.83" />
  </svg>
);

const StyleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);

const CollageIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const BackArrowIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

interface MobileSidebarTabsProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onPanelToggle: (open: boolean) => void;
  templateId?: number;
  isMobile: boolean;
}

export const MobileSidebarTabs: React.FC<MobileSidebarTabsProps> = ({
  activeTab,
  onTabChange,
  onPanelToggle,
  templateId,
  isMobile,
}) => {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const sidebarStyles = {
    container: {
      width: isMobile ? "100%" : "80px",
      height: isMobile ? "60px" : "100%",
      backgroundColor: colors.bgSecondary,
      borderRight: isMobile ? "none" : `1px solid ${colors.border}`,
      borderTop: isMobile ? `1px solid ${colors.border}` : "none",
      display: "flex" as const,
      flexDirection: (isMobile ? "row" : "column") as "row" | "column",
      alignItems: "center",
      justifyContent: isMobile ? "space-around" : "flex-start",
      padding: isMobile ? "0 8px" : "16px 0",
      gap: isMobile ? "0" : "4px",
      position: (isMobile ? "fixed" : "relative") as "fixed" | "relative",
      bottom: isMobile ? 0 : "auto",
      left: isMobile ? 0 : "auto",
      right: isMobile ? 0 : "auto",
      zIndex: isMobile ? 100 : "auto",
      overflowX: (isMobile ? "auto" : "visible") as "auto" | "visible",
overflowY: (isMobile ? "hidden" : "auto") as "hidden" | "auto",
    },
    button: {
      display: "flex" as const,
      flexDirection: (isMobile ? "column" : "column") as "column",
      alignItems: "center",
      gap: isMobile ? "2px" : "6px",
      padding: isMobile ? "8px 12px" : "12px 8px",
      backgroundColor: "transparent",
      border: "none",
      borderRadius: "8px",
      color: colors.textMuted,
      cursor: "pointer",
      transition: "all 0.2s",
      fontSize: isMobile ? "9px" : "10px",
      fontWeight: "500" as const,
      minWidth: isMobile ? "auto" : "100%",
      whiteSpace: "nowrap" as const,
      flex: isMobile ? "0 0 auto" : "initial",
    },
    buttonActive: {
      backgroundColor: colors.bgActive,
      color: colors.accent,
    },
    iconWrapper: {
      width: isMobile ? "20px" : "24px",
      height: isMobile ? "20px" : "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    separator: {
      display: isMobile ? "none" : "block",
      width: "60%",
      height: "1px",
      backgroundColor: colors.border,
      margin: "8px auto",
    },
  };

  const handleTabClick = (tab: SidebarTab) => {
    if (activeTab === tab) {
      onTabChange(null);
      onPanelToggle(false);
    } else {
      onTabChange(tab);
      onPanelToggle(true);
    }
  };

  const renderButton = (
    tab: SidebarTab,
    label: string,
    Icon: React.FC<any>
  ) => (
    <button
      style={{
        ...sidebarStyles.button,
        ...(activeTab === tab ? sidebarStyles.buttonActive : {}),
      }}
      onClick={() => handleTabClick(tab)}
      onMouseOver={(e) => {
        if (activeTab !== tab) {
          e.currentTarget.style.backgroundColor = colors.bgHover;
          e.currentTarget.style.color = colors.textSecondary;
        }
      }}
      onMouseOut={(e) => {
        if (activeTab !== tab) {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = colors.textMuted;
        }
      }}
      title={label}
    >
      <div style={sidebarStyles.iconWrapper}>
        <Icon />
      </div>
      <span>{label}</span>
    </button>
  );

  return (
    <div style={sidebarStyles.container}>
      {/* Back Button - Hide on mobile to save space */}
      {!isMobile && (
        <>
          <button
            style={sidebarStyles.button}
            onClick={() => navigate("/dashboard")}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = colors.bgHover;
              e.currentTarget.style.color = colors.textSecondary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = colors.textMuted;
            }}
            title="Back to Dashboard"
          >
            <div style={sidebarStyles.iconWrapper}>
              <BackArrowIcon />
            </div>
            <span>Back</span>
          </button>

          {/* Separator Line */}
          <div style={sidebarStyles.separator} />
        </>
      )}

      {/* Standard Editor Tabs */}
      {renderButton("text", "Text", EditorIcons.Type)}
      {renderButton("media", "Media", EditorIcons.Image)}
      {renderButton("audio", "Audio", EditorIcons.Music)}
      {renderButton("video", "Video", EditorIcons.Video)}

      {/* Template Specific Tabs */}
      {templateId === 9 && renderButton("chat" as any, "Chat", ChatIcon)}
      {templateId === 30 && renderButton("watch" as any, "Watch", WatchIcon)}
      {templateId === 8 && renderButton("carousel" as any, "Style", StyleIcon)}
      {templateId === 19 && renderButton("collage" as any, "Grid", CollageIcon)}

      {renderButton("tools", "Tools", EditorIcons.Tools)}

      {templateId === 6 && renderButton("layout", "Layout", LayoutIcon)}
    </div>
  );
};