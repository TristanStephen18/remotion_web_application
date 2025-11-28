// import type React from "react";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import { FakeTextSideNavs } from "../../../data/NavdataLiveEditor";
// import { MenuIcon } from "lucide-react";


// interface SidenavProps {
//     collapsed: boolean;
//     setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
//     activeSection: string;
//     setActiveSection: React.Dispatch<React.SetStateAction< "messages" |"voice" |"avatar" | "display"| "background"|"music" >>;
// }

// export const FakeTextVideoSideNavigation: React.FC<SidenavProps>=({collapsed, setCollapsed, activeSection, setActiveSection})=>{
//     return (
//         <div
//         style={{
//           width: collapsed ? "60px" : "180px",
//           background: "#fff",
//           borderRight: "1px solid #eee",
//           display: "flex",
//           flexDirection: "column",
//           transition: "width 0.3s",
//           overflow: "hidden",
//           position: "relative",
//         }}
//       >
//         <button
//           onClick={() => setCollapsed(!collapsed)}
//           style={{
//             padding: "0.75rem",
//             border: "none",
//             background: "transparent",
//             cursor: "pointer",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
//         </button>

//         {FakeTextSideNavs.map(({ key, label, icon }) => (
//           <button
//             key={key}
//             onClick={() => setActiveSection(key as any)}
//             style={{
//               padding: "1rem",
//               textAlign: "left",
//               border: "none",
//               background: activeSection === key ? "#f5f5f5" : "transparent",
//               cursor: "pointer",
//               fontWeight: 600,
//               display: "flex",
//               alignItems: "center",
//               gap: collapsed ? "0" : "0.5rem",
//               justifyContent: collapsed ? "center" : "flex-start",
//             }}
//           >
//             {icon}
//             {!collapsed && label}
//           </button>
//         ))}
//       </div>
//     );
// }

import React from "react";

interface SidenavProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<"messages" | "voice" | "avatar" | "display" | "background" | "music">>;
}

export const FakeTextVideoSideNavigation: React.FC<SidenavProps> = ({
  collapsed,
  setCollapsed,
  activeSection,
  setActiveSection,
}) => {
  const navItems = [
    { key: "messages", icon: "💬", label: "Messages" },
    { key: "voice", icon: "🎤", label: "Voice" },
    { key: "avatar", icon: "👤", label: "Avatar" },
    { key: "display", icon: "🎨", label: "Display" },
    { key: "background", icon: "🎬", label: "Background" },
    { key: "music", icon: "🎵", label: "Music" },
  ];

  return (
    <div
      style={{
        width: "90px",
        background: "#f8f9fa",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "1rem",
        gap: "0.5rem",
      }}
    >
      {navItems.map((item) => (
        <button
          key={item.key}
          onClick={() => setActiveSection(item.key as any)}
          style={{
            width: "70px",
            height: "70px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.25rem",
            borderRadius: "8px",
            transition: "all 0.2s ease",
            padding: "0.5rem",
            color: activeSection === item.key ? "#667eea" : "#6b7280",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f3f4f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: activeSection === item.key ? "600" : "400",
              color: activeSection === item.key ? "#667eea" : "#6b7280",
            }}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};