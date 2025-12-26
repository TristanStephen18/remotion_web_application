import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

interface SessionTimeoutHook {
  showWarning: boolean;
  timeLeft: number; // seconds until expiry
  isExpired: boolean;
  extendSession: () => void;
  dismissWarning: () => void;
}

export const useAdminSessionTimeout = (
  token: string | null
): SessionTimeoutHook => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  const WARNING_THRESHOLD = 5 * 60; // Show warning 5 minutes before expiry

  useEffect(() => {
    if (!token) {
      setShowWarning(false);
      setIsExpired(false);
      return;
    }

    const checkExpiry = () => {
      try {
        const decoded: any = jwtDecode(token);
        const expiresAt = decoded.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        const remaining = Math.floor((expiresAt - now) / 1000); // seconds

        setTimeLeft(remaining);

        // ✅ Show warning if less than 5 minutes remaining
        if (remaining <= WARNING_THRESHOLD && remaining > 0) {
          setShowWarning(true);
        }

        // ✅ Session expired
        if (remaining <= 0) {
          setIsExpired(true);
          setShowWarning(false);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    };

    // Check immediately
    checkExpiry();

    // Check every 10 seconds
    const interval = setInterval(checkExpiry, 10000);

    return () => clearInterval(interval);
  }, [token]);

  const extendSession = useCallback(() => {
    // This will be handled by the modal (opens re-auth)
    setShowWarning(false);
  }, []);

  const dismissWarning = useCallback(() => {
    setShowWarning(false);
  }, []);

  return {
    showWarning,
    timeLeft,
    isExpired,
    extendSession,
    dismissWarning,
  };
};