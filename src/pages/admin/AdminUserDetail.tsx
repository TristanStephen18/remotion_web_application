import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import type { AdminSection } from "../../components/admin/AdminSidebar";
import { backendPrefix } from "../../config";
import {
  FiArrowLeft,
  FiMail,
  FiCalendar,
  FiCheck,
  FiX,
  FiPackage,
  FiVideo,
  FiEye,
  FiImage,
  FiCreditCard,
  FiAlertCircle,
  FiShield,
} from "react-icons/fi";

interface UserDetail {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  verified: boolean;
  provider: string;
  stripeCustomerId: string | null;
  lastLogin: string | null;
  twoFactorEnabled: boolean;
  stats: {
    totalProjects: number;
    totalRenders: number;
    totalVisits: number;
    totalVeoGenerations: number;
    totalImageGenerations: number;
  };
  subscriptions: Array<{
    id: string;
    status: string;
    plan: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    createdAt: string;
    canceledAt: string | null;
  }>;
  recentProjects: Array<{
    id: number;
    title: string;
    createdAt: string;
  }>;
  recentRenders: Array<{
    id: string;
    type: string;
    renderedAt: string;
  }>;
  recentVisits: Array<{
    page: string;
    visitedAt: string;
  }>;
}

export const AdminUserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>("users");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { token, logout, isLoading } = useAdmin();
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${backendPrefix}/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error("Failed to fetch user details:", error);
      setError(error.message || "Failed to load user details");
      
      if (error.message.includes("Unauthorized")) {
        logout();
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;

    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchUserDetails();
  }, [token, userId, isLoading, navigate]);

  const handleSectionChange = (section: AdminSection) => {
    setActiveSection(section);
    if (section === "dashboard") {
      navigate("/admin/dashboard");
    } else if (section === "users") {
      navigate("/admin/users");
    }
  };

  const getSubscriptionBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      trialing: { color: "bg-blue-100 text-blue-800", label: "Trialing" },
      free_trial: { color: "bg-cyan-100 text-cyan-800", label: "Free Trial" },
      canceled: { color: "bg-red-100 text-red-800", label: "Canceled" },
      past_due: { color: "bg-orange-100 text-orange-800", label: "Past Due" },
    };

    const badge = badges[status] || { color: "bg-gray-100 text-gray-800", label: status };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to Load User</h2>
          <p className="text-gray-600 mb-6">{error || "User not found"}</p>
          <button
            onClick={() => navigate("/admin/users")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        active={activeSection}
        onChange={handleSectionChange}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <main
        className={`
          px-3 sm:px-4 md:px-8
          py-4 pt-16 md:pt-4
          min-h-screen
          transition-all duration-300
          ${isCollapsed ? "md:ml-20" : "md:ml-64"}
        `}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back to Users
        </button>

        {/* User Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  {user.name || "No Name"}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FiMail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  {user.verified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FiCheck className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <FiX className="w-3 h-3" />
                      Unverified
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    Provider: {user.provider || "Email"}
                  </span>
                  {user.twoFactorEnabled && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <FiShield className="w-3 h-3" />
                      2FA Enabled
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Member Since</p>
              <div className="flex items-center gap-1 text-gray-700">
                <FiCalendar className="w-4 h-4" />
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              {user.lastLogin && (
                <p className="text-xs text-gray-400 mt-1">
                  Last login: {new Date(user.lastLogin).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiPackage className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600">Projects</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{user.stats.totalProjects}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiVideo className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Renders</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{user.stats.totalRenders}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiEye className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-600">Visits (30d)</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{user.stats.totalVisits}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiVideo className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-600">AI Videos</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{user.stats.totalVeoGenerations}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiImage className="w-5 h-5 text-pink-500" />
              <span className="text-sm text-gray-600">AI Images</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{user.stats.totalImageGenerations}</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscription History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiCreditCard className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-800">Subscription History</h3>
            </div>

            {user.subscriptions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No subscriptions</p>
            ) : (
              <div className="space-y-3">
                {user.subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">{sub.plan}</span>
                      {getSubscriptionBadge(sub.status)}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Started: {new Date(sub.createdAt).toLocaleDateString()}</p>
                      <p>Current Period: {new Date(sub.currentPeriodStart).toLocaleDateString()} - {new Date(sub.currentPeriodEnd).toLocaleDateString()}</p>
                      {sub.canceledAt && (
                        <p className="text-red-600">Canceled: {new Date(sub.canceledAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiPackage className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">Recent Projects</h3>
            </div>

            {user.recentProjects.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No projects yet</p>
            ) : (
              <div className="space-y-2">
                {user.recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-sm text-gray-800 font-medium truncate">
                      {project.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Renders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiVideo className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-bold text-gray-800">Recent Renders</h3>
            </div>

            {user.recentRenders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No renders yet</p>
            ) : (
              <div className="space-y-2">
                {user.recentRenders.map((render) => (
                  <div
                    key={render.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-sm text-gray-800 font-medium">
                      {render.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(render.renderedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Page Visits */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiEye className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
            </div>

            {user.recentVisits.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              <div className="space-y-2">
                {user.recentVisits.map((visit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-sm text-gray-800 font-medium truncate">
                      {visit.page}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(visit.visitedAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};