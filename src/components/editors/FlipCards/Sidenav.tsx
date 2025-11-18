import type React from 'react';
// Assuming Material UI icons are available
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import DataObjectIcon from '@mui/icons-material/DataObject';
import StyleIcon from '@mui/icons-material/Style';

// --- Simple Nav Data for this template ---
const flipCardsNavs = [
  {
    key: 'text',
    label: 'Text',
    icon: <TextFieldsIcon />,
  },
  {
    key: 'data',
    label: 'Data',
    icon: <DataObjectIcon />,
  },
  {
    key: 'style',
    label: 'Style',
    icon: <StyleIcon />,
  },
];

interface SidenavProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  activeSection: string;
  setActiveSection: React.Dispatch<
    React.SetStateAction<'text' | 'data' | 'style'> // <-- Updated sections
  >;
  isMobile: boolean;
}

export const FlipCardsTemplateSideNav: React.FC<SidenavProps> = ({
  collapsed,
  setCollapsed,
  activeSection,
  setActiveSection,
  isMobile,
}) => {
  const isVisuallyCollapsed = isMobile || collapsed;

  return (
    <div
      style={{
        width: isVisuallyCollapsed ? '60px' : '180px',
        background: '#fff',
        borderRight: '1px solid #eee',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Collapse Toggle */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            padding: '0.75rem',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </button>
      )}
      
      {isMobile && <div style={{height: '1rem'}} />}

      {/* Nav Items */}
      {flipCardsNavs.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => setActiveSection(key as any)} // Cast as any for simplicity
          style={{
            padding: '1rem',
            textAlign: 'left',
            border: 'none',
            background: activeSection === key ? '#f5f5f5' : 'transparent',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: isVisuallyCollapsed ? '0' : '0.5rem',
            justifyContent: isVisuallyCollapsed ? 'center' : 'flex-start',
          }}
        >
          {icon}
          {!isVisuallyCollapsed && label}
        </button>
      ))}
    </div>
  );
};