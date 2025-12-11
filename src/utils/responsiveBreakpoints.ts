// ============================================================================
// RESPONSIVE BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  // Mobile devices
  mobile: 320,
  mobileLarge: 480,
  
  // Tablets
  tablet: 768,
  tabletLarge: 1024,
  
  // Desktop
  desktop: 1280,
  desktopLarge: 1440,
  desktopXL: 1920,
} as const;

export const MEDIA_QUERIES = {
  mobile: `@media (max-width: ${BREAKPOINTS.mobileLarge - 1}px)`,
  tablet: `@media (min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.tabletLarge - 1}px)`,
  desktop: `@media (min-width: ${BREAKPOINTS.desktop}px)`,
  
  // Utility queries
  maxMobile: `@media (max-width: ${BREAKPOINTS.mobileLarge - 1}px)`,
  maxTablet: `@media (max-width: ${BREAKPOINTS.tabletLarge - 1}px)`,
  minTablet: `@media (min-width: ${BREAKPOINTS.tablet}px)`,
  minDesktop: `@media (min-width: ${BREAKPOINTS.desktop}px)`,
} as const;

// Hook for checking current breakpoint
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < BREAKPOINTS.tablet) {
        setBreakpoint('mobile');
      } else if (width < BREAKPOINTS.desktop) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };
    
    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);
  
  return breakpoint;
};

// Hook for checking if screen is below a certain size
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.tablet);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

import React from "react";