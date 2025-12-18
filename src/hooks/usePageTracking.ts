import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../utils/analytics";

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view whenever route changes
    trackPageView(location.pathname);
  }, [location.pathname]);
};