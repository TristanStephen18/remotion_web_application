import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface MobilePanelWrapperProps {
  showEdit?: boolean; // Track if edit panel is showing
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  children: React.ReactNode;
  title?: string;
}

export const MobilePanelWrapper: React.FC<MobilePanelWrapperProps> = ({
  isOpen,
  // showEdit = false,
  onClose,
  isMobile,
  children,
  title,
}) => {
  const { colors } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  // Reset position when opened/closed
  useEffect(() => {
    if (!isOpen) {
      setTranslateY(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isMobile) return;
    const newY = e.touches[0].clientY;
    const deltaY = newY - startY;
    
    // Only allow dragging down
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (!isMobile) return;
    setIsDragging(false);
    
    // If dragged down more than 150px, close the panel
    if (translateY > 150) {
      onClose();
    }
    
    // Reset position
    setTranslateY(0);
  };

  // Handle mouse events for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isMobile) return;
    setIsDragging(true);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !isMobile) return;
    const newY = e.clientY;
    const deltaY = newY - startY;
    
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleMouseUp = () => {
    if (!isMobile) return;
    setIsDragging(false);
    
    if (translateY > 150) {
      onClose();
    }
    
    setTranslateY(0);
  };

  // Add/remove mouse event listeners
  useEffect(() => {
    if (isDragging && isMobile) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isMobile, startY, translateY]);

  const styles = {
    overlay: {
      display: "none",
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: "60px", // Above bottom tabs
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 150,
      backdropFilter: "blur(2px)",
      animation: "fadeIn 0.2s ease-in-out",
    },
    panel: {
      width: isMobile ? "100%" : "360px",
      height: isMobile ? "40vh" : "100%",
      maxHeight: isMobile ? "40vh" : "100%",
      backgroundColor: isMobile ? colors.bgPrimary : "transparent",
      borderLeft: "none", 
      borderTop: isMobile ? `2px solid ${colors.border}` : "none",
      borderTopLeftRadius: isMobile ? "16px" : "0",
      borderTopRightRadius: isMobile ? "16px" : "0",
      
      position: (isMobile ? "fixed" : "relative") as "fixed" | "relative",
      bottom: isMobile ? "60px" : "auto", 
      left: isMobile ? 0 : "auto",
      right: isMobile ? 0 : "auto",
      zIndex: isMobile ? 200 : "auto",
      
      boxShadow: isMobile
        ? "0 -4px 20px rgba(0, 0, 0, 0.3)"
        : "none",
        
      display: isMobile ? (isOpen ? "flex" : "none") : "flex",
      flexDirection: "column" as const,
      overflow: "hidden",
      transform: isMobile ? `translateY(${translateY}px)` : "none",
      transition: isDragging ? "none" : "transform 0.3s ease-in-out",
      animation: isMobile && isOpen ? "slideUp 0.3s ease-out" : "none",
      pointerEvents: "auto" as "auto" | "none",
    },
    panelHeader: {
      display: isMobile ? "flex" : "none",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      padding: "6px 12px 4px",
      backgroundColor: colors.bgSecondary,
      borderTopLeftRadius: "16px",
      borderTopRightRadius: "16px",
      cursor: isDragging ? "grabbing" : "grab",
      position: "relative" as const,
      userSelect: "none" as const,
      gap: "4px",
      flexShrink: 0,
    },
    dragHandle: {
      width: "32px",
      height: "2px",
      backgroundColor: colors.borderHeavy,
      borderRadius: "2px",
      opacity: isDragging ? 0.5 : 1,
      flexShrink: 0,
    },
    title: {
      fontSize: "11px",
      fontWeight: "600" as const,
      color: colors.textPrimary,
      width: "100%",
      textAlign: "center" as const,
    },
    closeButton: {
      display: isMobile ? "flex" : "none",
      position: "absolute" as const,
      top: "6px",
      right: "10px",
      width: "24px",
      height: "24px",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bgTertiary,
      border: `1px solid ${colors.border}`,
      borderRadius: "50%",
      cursor: "pointer",
      zIndex: 1,
      color: colors.textPrimary,
      transition: "all 0.2s",
    },
    content: {
      flex: 1,
      overflow: "hidden", // Let children handle their own scrolling
      display: "flex",
      flexDirection: "column" as const,
      minHeight: 0, // Important for flex children to scroll properly
    },
  };

  return (
    <>
      {/* Overlay backdrop (mobile only) */}
      <div style={styles.overlay} onClick={onClose} />

      {/* Panel */}
      <div ref={panelRef} style={styles.panel} data-panel="true">
        {/* Drag handle (mobile only) */}
        <div
          style={styles.panelHeader}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div style={styles.dragHandle} />
          {title && <div style={styles.title}>{title}</div>}
        </div>

        {/* Close button (mobile only) */}
        <button
          style={styles.closeButton}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.bgHover;
            e.currentTarget.style.borderColor = colors.borderHeavy;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.bgTertiary;
            e.currentTarget.style.borderColor = colors.border;
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Panel content */}
        <div style={styles.content}>{children}</div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};