import { backendPrefix } from "../config";

// ========== SESSION MANAGEMENT ==========

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  
  return sessionId;
};

const getVisitorId = (): string => {
  let visitorId = localStorage.getItem("visitor_id");
  
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("visitor_id", visitorId);
  }
  
  return visitorId;
};

const isBot = (): boolean => {
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /headless/i,
    /phantom/i,
    /lighthouse/i,
  ];
  
  const userAgent = navigator.userAgent;
  return botPatterns.some(pattern => pattern.test(userAgent));
};

const getDeviceInfo = () => {
  const width = window.innerWidth;
  
  let deviceType = 'desktop';
  if (width < 768) deviceType = 'mobile';
  else if (width < 1024) deviceType = 'tablet';
  
  return {
    deviceType,
    screenWidth: width,
    screenHeight: window.innerHeight,
    userAgent: navigator.userAgent,
  };
};

// ========== PAGE TRACKING ==========

let lastTrackedPage: string | null = null;
let pageStartTime: number | null = null;
let maxScrollDepth = 0;
let trackingQueue: any[] = [];
let flushTimeout: NodeJS.Timeout | null = null;
let periodicSaveInterval: NodeJS.Timeout | null = null; // ✅ NEW

const IGNORED_PAGES = [
  '/loading',
  '/initializing-login',
  '/auth/callback',
  '/auth/google',
  '/admin/login',
  '/admin/dashboard',
  '/admin/users',
  '/admin/security',
  '/admin/manage',
  '/admin/setup',
  '/admin/settings'
];

const shouldTrackPage = (page: string): boolean => {
  return !IGNORED_PAGES.some(ignored => page.startsWith(ignored));
};

// ✅ NEW: Save current page engagement
const saveCurrentPageEngagement = () => {
  if (!lastTrackedPage || !pageStartTime) return;
  
  const timeOnPage = Math.floor((Date.now() - pageStartTime) / 1000);
  
  // Only save if user spent at least 3 seconds
  if (timeOnPage >= 3 && timeOnPage < 3600) {
    console.log(`💾 Auto-saving engagement: ${lastTrackedPage} (${timeOnPage}s, ${maxScrollDepth}% scroll)`);
    
    queueAnalytics({
      type: 'engagement',
      page: lastTrackedPage,
      timeOnPage,
      maxScrollDepth,
    });
    
    // ✅ Flush immediately so data is sent
    flushAnalytics();
    
    // ✅ Reset timer to continue tracking
    pageStartTime = Date.now();
    maxScrollDepth = 0;
  }
};

export const trackPageView = async (page: string) => {
  try {
    if (isBot()) {
      console.debug("🤖 Bot detected - skipping");
      return;
    }
    
    if (!shouldTrackPage(page)) {
      console.debug("🚫 Ignoring page:", page);
      return;
    }
    
    if (lastTrackedPage === page) {
      console.debug("📊 Duplicate page - skipping");
      return;
    }
    
    // ✅ Save previous page engagement
    if (lastTrackedPage && pageStartTime) {
      const timeOnPage = Math.floor((Date.now() - pageStartTime) / 1000);
      
      if (timeOnPage > 0 && timeOnPage < 3600) {
        console.log(`📤 Saving engagement: ${lastTrackedPage} (${timeOnPage}s, ${maxScrollDepth}% scroll)`);
        
        queueAnalytics({
          type: 'engagement',
          page: lastTrackedPage,
          timeOnPage,
          maxScrollDepth,
        });
      }
    }
    
    // ✅ Start tracking new page
    pageStartTime = Date.now();
    maxScrollDepth = 0;
    lastTrackedPage = page;
    
    console.log(`📊 Tracking page: ${page}`);
    
    queueAnalytics({
      type: 'pageView',
      page,
      sessionId: getSessionId(),
      visitorId: getVisitorId(),
      referrer: document.referrer || null,
      ...getDeviceInfo(),
    });
    
    // ✅ NEW: Clear old interval and start new one for current page
    if (periodicSaveInterval) {
      clearInterval(periodicSaveInterval);
    }
    
    // ✅ Save current page engagement every 30 seconds
    periodicSaveInterval = setInterval(() => {
      saveCurrentPageEngagement();
    }, 30000); // 30 seconds
    
  } catch (error) {
    console.debug("Analytics failed:", error);
  }
};

const queueAnalytics = (data: any) => {
  trackingQueue.push({
    ...data,
    timestamp: new Date().toISOString(),
  });
  
  if (trackingQueue.length >= 10) {
    flushAnalytics();
  } else if (!flushTimeout) {
    flushTimeout = setTimeout(flushAnalytics, 2000);
  }
};

const flushAnalytics = async () => {
  if (trackingQueue.length === 0) return;
  
  const batch = [...trackingQueue];
  trackingQueue = [];
  
  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }
  
  try {
    await fetch(`${backendPrefix}/admin/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: batch }),
    });
    console.debug("📤 Flushed", batch.length, "analytics events");
  } catch (error) {
    console.debug("Analytics flush failed:", error);
  }
};

const trackScrollDepth = () => {
  const scrollPercentage = Math.round(
    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
  );
  
  maxScrollDepth = Math.max(maxScrollDepth, scrollPercentage);
};

export const trackEvent = async (eventType: string, eventData?: any) => {
  try {
    if (isBot()) return;
    
    queueAnalytics({
      type: 'event',
      eventType,
      eventData,
      page: window.location.pathname,
    });
  } catch (error) {
    console.debug("Event tracking failed:", error);
  }
};

// ✅ Initialize tracking
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', trackScrollDepth, { passive: true });
  
  // ✅ Save current page before unload
  window.addEventListener('beforeunload', () => {
    saveCurrentPageEngagement();
    flushAnalytics();
  });
  
  // ✅ Save when user switches tabs
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log("👁️ Tab hidden - saving engagement");
      saveCurrentPageEngagement();
      flushAnalytics();
    }
  });
  
  // ✅ NEW: Save when user is idle for 60 seconds
  let idleTimer: NodeJS.Timeout | null = null;
  
  const resetIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer);
    
    idleTimer = setTimeout(() => {
      console.log("😴 User idle - saving engagement");
      saveCurrentPageEngagement();
    }, 60000); // 60 seconds
  };
  
  // Reset idle timer on user activity
  ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetIdleTimer, { passive: true });
  });
  
  // Start idle timer
  resetIdleTimer();
}