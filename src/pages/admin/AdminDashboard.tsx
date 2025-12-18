import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import type { AdminSection } from "../../components/admin/AdminSidebar";
import { backendPrefix } from "../../config";
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

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const { admin, token, logout, isLoading } = useAdmin();
  const navigate = useNavigate();

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

  useEffect(() => {
    // ✅ CRITICAL: Wait for AdminContext to finish loading
    if (isLoading) {
      console.log("⏳ Waiting for admin session check...");
      return;
    }

    // ✅ Now we can safely check if token exists
    if (!token) {
      console.log("🚫 No token found - redirecting to login");
      navigate("/admin/login");
      return;
    }

    console.log("✅ Token found - fetching stats");
    fetchStats();

    // ✅ Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      console.log("🔄 Auto-refreshing stats...");
      fetchStats();
    }, 15000);

    // ✅ Cleanup interval on unmount
    return () => {
      console.log("🧹 Cleaning up interval");
      clearInterval(interval);
    };
  }, [token, navigate, isLoading]); // ✅ Dependencies

  const handleSectionChange = (section: AdminSection) => {
    setActiveSection(section);
    if (section === "users") {
      navigate("/admin/users");
    }
  };

  // ✅ Show loading while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Checking session...</p>
        </div>
      </div>
    );
  }

  // Loading state (fetching data)
  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
          <p className="text-sm text-gray-400 mt-2">Fetching analytics data</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchStats}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => navigate("/admin/login")}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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
      {/* Sidebar */}
      <AdminSidebar
        active={activeSection}
        onChange={handleSectionChange}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content */}
      <main
        className={`
          px-3 sm:px-4 md:px-8
          py-4 pt-16 md:pt-4
          min-h-screen
          transition-all duration-300
          ${isCollapsed ? "md:ml-20" : "md:ml-64"}
        `}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, {admin?.name || "Admin"}
            </p>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {statCards.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}
                >
                  {stat.icon}
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-400">{stat.subtext}</p>
            </div>
          ))}
        </div>

        {/* Breakdown Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscription Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Subscription Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Paid Subscribers
                </span>
                <span className="font-bold text-green-600 text-lg">
                  {stats.subscriptions.paid}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Free Trial Users
                </span>
                <span className="font-bold text-blue-600 text-lg">
                  {stats.subscriptions.freeTrial}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Total Active
                </span>
                <span className="font-bold text-gray-600 text-lg">
                  {stats.subscriptions.total}
                </span>
              </div>
            </div>
          </div>

          {/* Growth Metrics */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Growth Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  New Users (7d)
                </span>
                <span className="font-bold text-indigo-600 text-lg">
                  {stats.users.newLast7Days}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  New Users (30d)
                </span>
                <span className="font-bold text-purple-600 text-lg">
                  {stats.users.newLast30Days}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Visits (30d)
                </span>
                <span className="font-bold text-cyan-600 text-lg">
                  {stats.visits.last30Days.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with timestamp */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>
            Live • Last updated: {new Date(stats.timestamp).toLocaleString()}
          </span>
        </div>
      </main>
    </div>
  );
};