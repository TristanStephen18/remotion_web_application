import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import type { AdminSection } from "../../components/admin/AdminSidebar";
import { backendPrefix } from "../../config";
import toast from "react-hot-toast";
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
  FiStar,
  FiTrash2,
  FiAlertTriangle,
} from "react-icons/fi";
import { useReAuth } from "../../contexts/ReAuthContext";

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
    isLifetime?: boolean;
    isCompanyAccount?: boolean;
    companyName?: string | null;
    specialNotes?: string | null;
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

  const [showGrantModal, setShowGrantModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [grantingLifetime, setGrantingLifetime] = useState(false);
  const [revokingLifetime, setRevokingLifetime] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  const { token, logout, isLoading } = useAdmin();
  const navigate = useNavigate();
  const { requestReAuth } = useReAuth();

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${backendPrefix}/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
    } else if (section === "security") {
      navigate("/admin/security");
    }
  };

  const hasLifetimeAccess =
    user?.subscriptions.some(
      (sub) => sub.isLifetime && sub.status !== "canceled"
    ) || false;

  const lifetimeSubscription = user?.subscriptions.find(
    (sub) => sub.isLifetime && sub.status !== "canceled"
  );

  const handleGrantLifetime = async () => {
    setGrantingLifetime(true);

    try {
      const reAuthToken = await requestReAuth("Grant Lifetime Access");

      if (!reAuthToken) {
        setGrantingLifetime(false);
        return;
      }

      const response = await fetch(
        `${backendPrefix}/admin/subscriptions/grant-lifetime`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Reauth-Token": reAuthToken,
          },
          body: JSON.stringify({
            userId: userId,
            companyName: companyName.trim() || null,
            notes: specialNotes.trim() || null,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("✅ Lifetime access granted successfully!", {
          duration: 4000,
          position: "top-right",
        });
        setShowGrantModal(false);
        setCompanyName("");
        setSpecialNotes("");
        fetchUserDetails();
      } else {
        throw new Error(data.error || "Failed to grant lifetime access");
      }
    } catch (error: any) {
      console.error("Grant lifetime error:", error);
      toast.error(`❌ ${error.message}`, {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setGrantingLifetime(false);
    }
  };

  const handleRevokeLifetime = async () => {
    setRevokingLifetime(true);

    try {
      const reAuthToken = await requestReAuth("Revoke Lifetime Access");

      if (!reAuthToken) {
        setRevokingLifetime(false);
        return;
      }

      const response = await fetch(
        `${backendPrefix}/admin/subscriptions/revoke-lifetime`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Reauth-Token": reAuthToken,
          },
          body: JSON.stringify({ userId: userId }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("✅ Lifetime access revoked successfully!", {
          duration: 4000,
          position: "top-right",
        });
        setShowRevokeModal(false);
        fetchUserDetails();
      } else {
        throw new Error(data.error || "Failed to revoke lifetime access");
      }
    } catch (error: any) {
      console.error("Revoke lifetime error:", error);
      toast.error(`❌ ${error.message}`, {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setRevokingLifetime(false);
    }
  };

  const handleDeleteUser = async () => {
    setDeletingUser(true);

    try {
      const reAuthToken = await requestReAuth("Delete User Account");

      if (!reAuthToken) {
        setDeletingUser(false);
        return;
      }

      const response = await fetch(`${backendPrefix}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Reauth-Token": reAuthToken,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success("✅ User deleted successfully! Redirecting...", {
          duration: 4000,
          position: "top-right",
        });
        setShowDeleteModal(false);

        setTimeout(() => {
          navigate("/admin/users");
        }, 1000);
      } else {
        throw new Error(data.error || "Failed to delete user");
      }
    } catch (error: any) {
      console.error("Delete user error:", error);
      toast.error(`❌ ${error.message}`, {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setDeletingUser(false);
    }
  };

  const getSubscriptionBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      trialing: { color: "bg-blue-100 text-blue-800", label: "Trialing" },
      free_trial: { color: "bg-cyan-100 text-cyan-800", label: "Free Trial" },
      canceled: { color: "bg-red-100 text-red-800", label: "Canceled" },
      past_due: { color: "bg-orange-100 text-orange-800", label: "Past Due" },
      lifetime: {
        color:
          "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-900 font-semibold",
        label: "🌟 Lifetime",
      },
      company: {
        color:
          "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-900 font-semibold",
        label: "🏢 Company",
      },
    };

    const badge = badges[status] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };

    return (
      <span
        className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${badge.color}`}
      >
        {badge.label}
      </span>
    );
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Loading user details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <FiAlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
            Failed to Load User
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            {error || "User not found"}
          </p>
          <button
            onClick={() => navigate("/admin/users")}
            className="px-4 sm:px-6 py-2 min-h-[44px] bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base"
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
          px-3 sm:px-4 md:px-6 lg:px-8
          py-3 sm:py-4 pt-16 md:pt-4
          min-h-screen
          transition-all duration-300
          ${isCollapsed ? "md:ml-20" : "md:ml-64"}
        `}
      >
        {/* ✅ RESPONSIVE Back Button */}
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back to Users
        </button>

        {/* ✅ RESPONSIVE Lifetime Access Banner */}
        {hasLifetimeAccess && lifetimeSubscription && (
          <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl sm:rounded-2xl shadow-md">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                <FiStar className="text-white text-lg sm:text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold text-yellow-900 mb-1 sm:mb-2">
                  🌟 This user has Lifetime Access
                </p>
                <div className="text-[10px] sm:text-xs text-yellow-800 space-y-0.5 sm:space-y-1">
                  {lifetimeSubscription.isCompanyAccount && (
                    <p className="truncate">
                      <strong>Company:</strong>{" "}
                      {lifetimeSubscription.companyName || "N/A"}
                    </p>
                  )}
                  {lifetimeSubscription.specialNotes && (
                    <p className="line-clamp-2">
                      <strong>Notes:</strong> {lifetimeSubscription.specialNotes}
                    </p>
                  )}
                  <p>
                    <strong>Granted:</strong>{" "}
                    {new Date(
                      lifetimeSubscription.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ RESPONSIVE User Header Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
            {/* User Info */}
            <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl sm:text-2xl flex-shrink-0">
                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : user.email.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 truncate">
                  {user.name || "No Name"}
                </h1>
                <div className="flex items-center gap-1 sm:gap-2 text-gray-600 mb-2 text-xs sm:text-base">
                  <FiMail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {user.verified ? (
                    <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-800">
                      <FiCheck className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-yellow-100 text-yellow-800">
                      <FiX className="w-3 h-3" />
                      Unverified
                    </span>
                  )}
                  <span className="text-xs sm:text-sm text-gray-500 truncate">
                    Provider: {user.provider || "Email"}
                  </span>
                  {user.twoFactorEnabled && (
                    <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-800">
                      <FiShield className="w-3 h-3" />
                      2FA
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Date & Actions */}
            <div className="flex flex-col gap-3">
              <div className="text-left lg:text-right">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Member Since</p>
                <div className="flex items-center gap-1 text-gray-700 text-sm sm:text-base">
                  <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {user.lastLogin && (
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                    Last login: {new Date(user.lastLogin).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* ✅ RESPONSIVE Button group */}
              <div className="flex flex-col sm:flex-row gap-2">
                {!hasLifetimeAccess ? (
                  <button
                    onClick={() => setShowGrantModal(true)}
                    className="px-3 sm:px-4 py-2 min-h-[44px] bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    <FiStar className="w-4 h-4" />
                    <span className="hidden sm:inline">Grant Lifetime Access</span>
                    <span className="sm:hidden">Grant Lifetime</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowRevokeModal(true)}
                    className="px-3 sm:px-4 py-2 min-h-[44px] bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Revoke Lifetime</span>
                    <span className="sm:hidden">Revoke</span>
                  </button>
                )}

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-3 sm:px-4 py-2 min-h-[44px] bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-semibold hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete User</span>
                  <span className="sm:hidden">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ RESPONSIVE Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <FiPackage className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              <span className="text-xs sm:text-sm text-gray-600">Projects</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">
              {user.stats.totalProjects}
            </p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <FiVideo className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              <span className="text-xs sm:text-sm text-gray-600">Renders</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">
              {user.stats.totalRenders}
            </p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <FiEye className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
              <span className="text-xs sm:text-sm text-gray-600 truncate">Visits</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">
              {user.stats.totalVisits}
            </p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <FiVideo className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              <span className="text-xs sm:text-sm text-gray-600 truncate">AI Videos</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">
              {user.stats.totalVeoGenerations}
            </p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <FiImage className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
              <span className="text-xs sm:text-sm text-gray-600 truncate">AI Images</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">
              {user.stats.totalImageGenerations}
            </p>
          </div>
        </div>

        {/* ✅ RESPONSIVE Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Subscription History */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <FiCreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              <h3 className="text-base sm:text-lg font-bold text-gray-800">
                Subscription History
              </h3>
            </div>

            {user.subscriptions.length === 0 ? (
              <p className="text-xs sm:text-sm text-gray-500 text-center py-6 sm:py-8">
                No subscriptions
              </p>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {user.subscriptions.map((sub: any) => (
                  <div
                    key={sub.id}
                    className="border border-gray-200 rounded-lg p-3 sm:p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="font-medium text-gray-800 text-sm sm:text-base truncate">
                          {sub.plan}
                        </span>
                        {sub.companyName && (
                          <span className="text-[10px] sm:text-xs text-gray-500 truncate">
                            ({sub.companyName})
                          </span>
                        )}
                      </div>
                      {getSubscriptionBadge(sub.status)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 space-y-0.5 sm:space-y-1">
                      <p>
                        Started: {new Date(sub.createdAt).toLocaleDateString()}
                      </p>
                      {!sub.isLifetime && (
                        <p className="truncate">
                          Period:{" "}
                          {new Date(
                            sub.currentPeriodStart
                          ).toLocaleDateString()}{" "}
                          - {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                        </p>
                      )}
                      {sub.isLifetime && (
                        <p className="text-yellow-700 font-medium text-xs sm:text-sm">
                          🌟 Never expires
                        </p>
                      )}
                      {sub.canceledAt && (
                        <p className="text-red-600 text-xs sm:text-sm">
                          Canceled:{" "}
                          {new Date(sub.canceledAt).toLocaleDateString()}
                        </p>
                      )}
                      {sub.specialNotes && (
                        <p className="text-[10px] sm:text-xs text-gray-500 italic mt-1 sm:mt-2 line-clamp-2">
                          Note: {sub.specialNotes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <FiPackage className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <h3 className="text-base sm:text-lg font-bold text-gray-800">
                Recent Projects
              </h3>
            </div>

            {user.recentProjects.length === 0 ? (
              <p className="text-xs sm:text-sm text-gray-500 text-center py-6 sm:py-8">
                No projects yet
              </p>
            ) : (
              <div className="space-y-1.5 sm:space-y-2">
                {user.recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors gap-2"
                  >
                    <span className="text-xs sm:text-sm text-gray-800 font-medium truncate flex-1">
                      {project.title}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Renders */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <FiVideo className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <h3 className="text-base sm:text-lg font-bold text-gray-800">
                Recent Renders
              </h3>
            </div>

            {user.recentRenders.length === 0 ? (
              <p className="text-xs sm:text-sm text-gray-500 text-center py-6 sm:py-8">
                No renders yet
              </p>
            ) : (
              <div className="space-y-1.5 sm:space-y-2">
                {user.recentRenders.map((render) => (
                  <div
                    key={render.id}
                    className="flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors gap-2"
                  >
                    <span className="text-xs sm:text-sm text-gray-800 font-medium">
                      {render.type.toUpperCase()}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                      {new Date(render.renderedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Page Visits */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <FiEye className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              <h3 className="text-base sm:text-lg font-bold text-gray-800">
                Recent Activity
              </h3>
            </div>

            {user.recentVisits.length === 0 ? (
              <p className="text-xs sm:text-sm text-gray-500 text-center py-6 sm:py-8">
                No recent activity
              </p>
            ) : (
              <div className="space-y-1.5 sm:space-y-2">
                {user.recentVisits.map((visit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors gap-2"
                  >
                    <span className="text-xs sm:text-sm text-gray-800 font-medium truncate flex-1">
                      {visit.page}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                      {new Date(visit.visitedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ✅ RESPONSIVE Grant Lifetime Modal */}
        {showGrantModal && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowGrantModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowGrantModal(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 p-1"
              >
                <FiX size={20} />
              </button>

              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pr-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiStar className="text-white text-lg sm:text-2xl" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                    Grant Lifetime Access
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    User ID: {userId}
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., ViralMotion HQ"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                  />
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                    Leave empty for personal lifetime access
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Internal notes about this grant..."
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 resize-none"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-[10px] sm:text-xs text-yellow-800 leading-relaxed">
                  ⚠️ This will grant unlimited access to all features. The
                  subscription will never expire and won't be charged.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => setShowGrantModal(false)}
                  className="flex-1 px-4 py-2.5 min-h-[44px] bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm sm:text-base font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGrantLifetime}
                  disabled={grantingLifetime}
                  className="flex-1 px-4 py-2.5 min-h-[44px] bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {grantingLifetime ? "Granting..." : "Confirm Grant"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ RESPONSIVE Revoke Lifetime Modal */}
        {showRevokeModal && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowRevokeModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowRevokeModal(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 p-1"
              >
                <FiX size={20} />
              </button>

              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pr-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiTrash2 className="text-white text-lg sm:text-2xl" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                    Revoke Lifetime Access
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    User: {user.email}
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-red-800 leading-relaxed mb-2">
                  ⚠️ <strong>Are you sure?</strong>
                </p>
                <ul className="text-[10px] sm:text-xs text-red-700 space-y-1 ml-4">
                  <li>• User will lose lifetime access</li>
                  <li>• Subscription marked as canceled</li>
                  <li>• Must subscribe again for features</li>
                  <li>• Cannot be easily undone</li>
                </ul>
              </div>

              {lifetimeSubscription && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 sm:p-3 mb-4 sm:mb-6">
                  <p className="text-[10px] sm:text-xs text-gray-600 mb-1">
                    <strong>Current lifetime details:</strong>
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-600">
                    Type:{" "}
                    {lifetimeSubscription.isCompanyAccount
                      ? "Company"
                      : "Personal"}
                  </p>
                  {lifetimeSubscription.companyName && (
                    <p className="text-[10px] sm:text-xs text-gray-600 truncate">
                      Company: {lifetimeSubscription.companyName}
                    </p>
                  )}
                  <p className="text-[10px] sm:text-xs text-gray-600">
                    Granted:{" "}
                    {new Date(
                      lifetimeSubscription.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => setShowRevokeModal(false)}
                  className="flex-1 px-4 py-2.5 min-h-[44px] bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm sm:text-base font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevokeLifetime}
                  disabled={revokingLifetime}
                  className="flex-1 px-4 py-2.5 min-h-[44px] bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {revokingLifetime ? "Revoking..." : "Confirm Revoke"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ RESPONSIVE Delete User Modal */}
        {showDeleteModal && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 p-1"
              >
                <FiX size={20} />
              </button>

              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pr-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiAlertTriangle className="text-white text-lg sm:text-2xl" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                    Delete User Account
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    User: {user.email}
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-red-800 leading-relaxed mb-2 sm:mb-3">
                  <strong>⚠️ WARNING: This action cannot be undone!</strong>
                </p>
                <ul className="text-[10px] sm:text-xs text-red-700 space-y-1 sm:space-y-1.5 ml-4">
                  <li>• Account permanently deleted</li>
                  <li>• All projects & renders deleted</li>
                  <li>• All AI generations deleted</li>
                  <li>• All uploads & datasets deleted</li>
                  <li>• Stripe subscription canceled</li>
                  <li>• User immediately logged out</li>
                  <li>• This action is IRREVERSIBLE</li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 sm:p-3 mb-4 sm:mb-6">
                <p className="text-[10px] sm:text-xs text-gray-700 mb-2">
                  <strong>User Statistics:</strong>
                </p>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600">
                  <div>Projects: {user.stats.totalProjects}</div>
                  <div>Renders: {user.stats.totalRenders}</div>
                  <div>AI Videos: {user.stats.totalVeoGenerations}</div>
                  <div>AI Images: {user.stats.totalImageGenerations}</div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 sm:p-3 mb-4 sm:mb-6">
                <p className="text-[10px] sm:text-xs text-yellow-800">
                  <strong>💡 Tip:</strong> Consider revoking access instead of
                  deleting if you want to preserve data.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 min-h-[44px] bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm sm:text-base font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={deletingUser}
                  className="flex-1 px-4 py-2.5 min-h-[44px] bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {deletingUser ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};