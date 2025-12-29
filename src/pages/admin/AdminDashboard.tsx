import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";
import { useReAuth } from "../../contexts/ReAuthContext";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import type { AdminSection } from "../../components/admin/AdminSidebar";
import { backendPrefix } from "../../config";
import { useAdminSessionTimeout } from "../../hooks/useAdminSessionTimeout";
import { SessionTimeoutWarning } from "../../components/admin/SessionTimeoutWarning";
import { SessionExpiredModal } from "../../components/admin/SessionExpiredModal";
import {
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiActivity,
  FiEye,
  FiRefreshCw,
  FiPackage,
  FiVideo,
  FiAlertCircle,
  FiClock,
  FiMousePointer,
} from "react-icons/fi";

interface Stats {
  users: {
    total: number;
    newLast7Days: number;
    newLast30Days: number;
  };
  subscriptions: {
    total: number;
    paid: number;
    freeTrial: number;
    conversionRate: string;
  };
  revenue: {
    mrr: string;
    arr: string;
  };
  visits: {
    last7Days: number;
    last30Days: number;
  };
  content: {
    totalProjects: number;
    totalRenders: number;
  };
  timestamp: string;
}

interface EngagementData {
  page: string;
  avgTimeOnPage: number;
  avgScrollDepth: number;
  totalSessions: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [engagementData, setEngagementData] = useState<EngagementData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { admin, token, logout, isLoading } = useAdmin();
  const { requestReAuth } = useReAuth();
  const navigate = useNavigate();

  const { showWarning, timeLeft, isExpired, extendSession, dismissWarning } =
    useAdminSessionTimeout(token);

  const handleExtendSession = async () => {
    try {
      const reAuthToken = await requestReAuth("Extend Admin Session");
      
      if (!reAuthToken) {
        extendSession();
        return;
      }

      const response = await fetch(`${backendPrefix}/admin/auth/extend-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Reauth-Token": reAuthToken,
        },
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem("admin_token", data.token);
        window.location.reload();
      } else {
        throw new Error(data.error || "Failed to extend session");
      }
      
      extendSession();
    } catch (error) {
      console.error("Failed to extend session:", error);
      alert("Failed to extend session. Please try again.");
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error("No authentication token");
      }

      const response = await fetch(`${backendPrefix}/admin/analytics/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          navigate("/admin/login");
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      } else {
        throw new Error(data.error || "Failed to load analytics");
      }
    } catch (error: any) {
      console.error("Failed to fetch stats:", error);
      setError(error.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const fetchEngagement = async () => {
    try {
      if (!token) return;

      const response = await fetch(
        `${backendPrefix}/admin/analytics/engagement?days=7`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setEngagementData(data.engagement);
      }
    } catch (error) {
      console.error("Failed to fetch engagement:", error);
    }
  };

  useEffect(() => {
    if (isLoading) {
      console.log("⏳ Waiting for admin session check...");
      return;
    }

    if (!token) {
      console.log("🚫 No token found - redirecting to login");
      navigate("/admin/login");
      return;
    }

    console.log("✅ Token found - fetching stats");
    fetchStats();
    fetchEngagement();

    const interval = setInterval(() => {
      console.log("🔄 Auto-refreshing stats...");
      fetchStats();
      fetchEngagement();
    }, 15000);

    return () => {
      console.log("🧹 Cleaning up interval");
      clearInterval(interval);
    };
  }, [token, navigate, isLoading]);

  const handleSectionChange = (section: AdminSection) => {
    setActiveSection(section);
    if (section === "users") {
      navigate("/admin/users");
    } else if (section === "security") {
      navigate("/admin/security");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">Checking session...</p>
        </div>
      </div>
    );
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">Loading dashboard...</p>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">Fetching analytics data</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <FiAlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
            Failed to Load Dashboard
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
            <button
              onClick={fetchStats}
              className="px-4 sm:px-6 py-2 min-h-[44px] bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
            >
              Retry
            </button>
            <button
              onClick={() => navigate("/admin/login")}
              className="px-4 sm:px-6 py-2 min-h-[44px] bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats.users.total.toLocaleString(),
      icon: <FiUsers />,
      color: "bg-blue-500",
      subtext: `+${stats.users.newLast7Days} last 7 days`,
    },
    {
      label: "Active Subscribers",
      value: stats.subscriptions.total.toLocaleString(),
      icon: <FiTrendingUp />,
      color: "bg-green-500",
      subtext: `${stats.subscriptions.paid} paid`,
    },
    {
      label: "Monthly Revenue",
      value: stats.revenue.mrr,
      icon: <FiDollarSign />,
      color: "bg-purple-500",
      subtext: `ARR: ${stats.revenue.arr}`,
    },
    {
      label: "Conversion Rate",
      value: stats.subscriptions.conversionRate,
      icon: <FiActivity />,
      color: "bg-orange-500",
      subtext: "Signups → Paid",
    },
    {
      label: "Page Visits (7d)",
      value: stats.visits.last7Days.toLocaleString(),
      icon: <FiEye />,
      color: "bg-cyan-500",
      subtext: `${stats.visits.last30Days.toLocaleString()} last 30d`,
    },
    {
      label: "Total Projects",
      value: stats.content.totalProjects.toLocaleString(),
      icon: <FiPackage />,
      color: "bg-pink-500",
      subtext: "Created by users",
    },
    {
      label: "Total Renders",
      value: stats.content.totalRenders.toLocaleString(),
      icon: <FiVideo />,
      color: "bg-indigo-500",
      subtext: "Videos generated",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {showWarning && (
        <SessionTimeoutWarning
          timeLeft={timeLeft}
          onExtend={handleExtendSession}
          onDismiss={dismissWarning}
        />
      )}

      {isExpired && <SessionExpiredModal />}

      <AdminSidebar
        active={activeSection}
        onChange={handleSectionChange}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <main
        className={`
          px-3 sm:px-4 md:px-6 lg:px-8
          py-3 sm:py-4 pt-16 md:pt-4
          min-h-screen
          transition-all duration-300
          ${isCollapsed ? "md:ml-20" : "md:ml-64"}
        `}
      >
        {/* ✅ RESPONSIVE Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Welcome back, {admin?.name || "Admin"}
            </p>
          </div>
          <button
            onClick={() => {
              fetchStats();
              fetchEngagement();
            }}
            disabled={loading}
            className="px-3 sm:px-4 py-2 min-h-[44px] bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <FiRefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>

        {/* ✅ RESPONSIVE Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          {statCards.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center text-white text-lg sm:text-xl`}
                >
                  {stat.icon}
                </div>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm mb-1">{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 truncate">
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 truncate">{stat.subtext}</p>
            </div>
          ))}
        </div>

        {/* ✅ RESPONSIVE Grid for Breakdown Cards + Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Subscription Breakdown */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
              Subscription Breakdown
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between p-2.5 sm:p-3 bg-green-50 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-700 font-medium">
                  Paid Subscribers
                </span>
                <span className="font-bold text-green-600 text-base sm:text-lg">
                  {stats.subscriptions.paid}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 sm:p-3 bg-blue-50 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-700 font-medium">
                  Free Trial Users
                </span>
                <span className="font-bold text-blue-600 text-base sm:text-lg">
                  {stats.subscriptions.freeTrial}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-700 font-medium">Total Active</span>
                <span className="font-bold text-gray-600 text-base sm:text-lg">
                  {stats.subscriptions.total}
                </span>
              </div>
            </div>
          </div>

          {/* Growth Metrics */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
              Growth Metrics
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between p-2.5 sm:p-3 bg-indigo-50 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-700 font-medium">
                  New Users (7d)
                </span>
                <span className="font-bold text-indigo-600 text-base sm:text-lg">
                  {stats.users.newLast7Days}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 sm:p-3 bg-purple-50 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-700 font-medium">
                  New Users (30d)
                </span>
                <span className="font-bold text-purple-600 text-base sm:text-lg">
                  {stats.users.newLast30Days}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 sm:p-3 bg-cyan-50 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-700 font-medium">Visits (30d)</span>
                <span className="font-bold text-cyan-600 text-base sm:text-lg">
                  {stats.visits.last30Days.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* ✅ RESPONSIVE Page Engagement Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <FiMousePointer className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
              <span className="truncate">Page Engagement (7d)</span>
            </h3>
            {engagementData && engagementData.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {engagementData.slice(0, 3).map((page, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 sm:p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100"
                  >
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 truncate">
                      {page.page}
                    </p>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-xs">
                      <div className="flex flex-col items-center p-1.5 sm:p-2 bg-white rounded">
                        <FiClock className="w-3 h-3 text-indigo-600 mb-1" />
                        <span className="font-bold text-indigo-600 text-[10px] sm:text-xs">
                          {page.avgTimeOnPage}s
                        </span>
                        <span className="text-gray-500 text-[9px] sm:text-[10px]">Avg Time</span>
                      </div>
                      <div className="flex flex-col items-center p-1.5 sm:p-2 bg-white rounded">
                        <FiMousePointer className="w-3 h-3 text-purple-600 mb-1" />
                        <span className="font-bold text-purple-600 text-[10px] sm:text-xs">
                          {page.avgScrollDepth}%
                        </span>
                        <span className="text-gray-500 text-[9px] sm:text-[10px]">Scroll</span>
                      </div>
                      <div className="flex flex-col items-center p-1.5 sm:p-2 bg-white rounded">
                        <FiEye className="w-3 h-3 text-cyan-600 mb-1" />
                        <span className="font-bold text-cyan-600 text-[10px] sm:text-xs">
                          {page.totalSessions}
                        </span>
                        <span className="text-gray-500 text-[9px] sm:text-[10px]">Sessions</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <FiMousePointer className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-500">No engagement data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* ✅ RESPONSIVE Footer with timestamp */}
        <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-center">
            Live • Last updated: {new Date(stats.timestamp).toLocaleString()}
          </span>
        </div>
      </main>
    </div>
  );
};