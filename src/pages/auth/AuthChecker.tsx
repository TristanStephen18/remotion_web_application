import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser, tokenManager } from "../../services/authService";

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // ✅ Verify token is still valid
      const user = await getCurrentUser();
      
      if (user) {
        setIsAuthenticated(true);
        // ✅ Start auto-refresh
        tokenManager.startAutoRefresh();
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      }
      
      setIsLoading(false);
    };

    checkAuth();

    // ✅ Cleanup on unmount
    return () => {
      tokenManager.stopAutoRefresh();
    };
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;