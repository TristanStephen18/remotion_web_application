import { backendPrefix } from "../config";

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  
  return sessionId;
};

// Track page visit
export const trackPageView = async (page: string) => {
  try {
    const sessionId = getSessionId();
    
    await fetch(`${backendPrefix}/admin/analytics/track-visit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page,
        sessionId,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    // Silently fail - analytics shouldn't break the app
    console.debug("Analytics tracking failed:", error);
  }
};

// Track custom events
export const trackEvent = async (eventType: string, eventData?: any) => {
  try {
    const token = localStorage.getItem("token");
    
    await fetch(`${backendPrefix}/admin/analytics/track-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        eventType,
        eventData,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.debug("Event tracking failed:", error);
  }
};