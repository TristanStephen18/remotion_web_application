import React from "react";
import { useNavigate } from "react-router-dom"; 
import { EditorIcons } from "./EditorIcons";
import type { SidebarTab } from '../../types/editor_types/index';
import { editorStyles } from "../../styles/editorStyles";

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const LayoutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="12" x2="21" y2="12" />
  </svg>
);

const WatchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="7" />
    <polyline points="12 9 12 12 13.5 13.5" />
    <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.35-10.7l.35-3.83A2 2 0 0 1 9.83 2h4.35a2 2 0 0 1 2 1.82l.35 3.83" />
  </svg>
);

// New Icon for the Blur Style template
const StyleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);

// Standardized Back Arrow (Matches EditorIcons stroke/size)
const BackArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

interface SidebarTabsProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onPanelToggle: (open: boolean) => void;
  templateId?: number; 
}

export const SidebarTabs: React.FC<SidebarTabsProps> = ({
  activeTab,
  onTabChange,
  onPanelToggle,
  templateId
}) => {
  const navigate = useNavigate();

  const handleTabClick = (tab: SidebarTab) => {
    if (activeTab === tab) {
      onTabChange(null);
      onPanelToggle(false);
    } else {
      onTabChange(tab);
      onPanelToggle(true);
    }
  };

  // Helper for rendering standard tabs
  const renderButton = (tab: SidebarTab, label: string, Icon: React.FC<any>) => (
    <button
      style={{
        ...editorStyles.sidebarButton,
        ...(activeTab === tab ? editorStyles.sidebarButtonActive : {}),
      }}
      onClick={() => handleTabClick(tab)}
      onMouseOver={(e) => {
        if (activeTab !== tab) {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
          e.currentTarget.style.color = "#888";
        }
      }}
      onMouseOut={(e) => {
        if (activeTab !== tab) {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "#666";
        }
      }}
      title={label}
    >
      <Icon />
      <span>{label}</span>
    </button>
  );

  return (
    <div style={editorStyles.leftSidebar}>
      
      {/* Back Button */}
      <button
        style={editorStyles.sidebarButton}
        onClick={() => navigate("/dashboard")}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
          e.currentTarget.style.color = "#888";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "#666";
        }}
        title="Back to Dashboard"
      >
        <BackArrowIcon />
        <span>Back</span>
      </button>

      {/* Separator Line */}
      <div style={{ width: '60%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '8px auto' }} />

      {/* Standard Editor Tabs */}
      {renderButton("text", "Text", EditorIcons.Type)}
      {renderButton("media", "Media", EditorIcons.Image)}
      {renderButton("audio", "Audio", EditorIcons.Music)}
      {renderButton("video", "Video", EditorIcons.Video)}
      
      {/* Template Specific Tabs */}
      {/* Corrected: Checking for templateId 9 for Chat */}
      {templateId === 9 && renderButton("chat" as any, "Chat", ChatIcon)}
      
      {templateId === 30 && renderButton("watch" as any, "Watch", WatchIcon)}
      {templateId === 8 && renderButton("carousel" as any, "Blur Style", StyleIcon)}
      
      {renderButton("tools", "Tools", EditorIcons.Tools)}

      {templateId === 6 && renderButton("layout", "Layout", LayoutIcon)}
    </div>
  );
};