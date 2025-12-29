import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import type { AdminSection } from "../../components/admin/AdminSidebar";
import { backendPrefix } from "../../config";
import {
  FiShield,
  FiAlertTriangle,
  FiActivity,
  FiClock,
  FiTrendingUp,
  FiRefreshCw,
  FiDownload,
} from "react-icons/fi";

interface AuditLogData {
  id: string;
  adminId: number;
  action: string;
  targetType: string | null;
  targetId: number | null;
  targetEmail: string | null;
  status: "SUCCESS" | "FAILED";
  errorMessage: string | null;
  createdAt: string;
}

interface AuditLog {
  log: AuditLogData;
  admin: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface AuditStats {
  totalActions: number;
  failedActions: number;
  successRate: string;
  actionsByAdmin: Array<{
    adminId: number;
    adminName: string;
    count: number;
  }>;
  recentCriticalActions: AuditLog[];
}

export const AdminSecurity: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<AdminSection>("security");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filters
  const [filterAction, setFilterAction] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDays, setFilterDays] = useState(7);

  const { token, isLoading } = useAdmin();
  const navigate = useNavigate();

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        days: filterDays.toString(),
        limit: "50",
      });

      if (filterAction) params.append("action", filterAction);
      if (filterStatus) params.append("status", filterStatus);

      const response = await fetch(
        `${backendPrefix}/admin/audit/logs?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditStats = async () => {
    try {
      const response = await fetch(
        `${backendPrefix}/admin/audit/stats?days=${filterDays}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch audit stats:", error);
    }
  };

  useEffect(() => {
    if (isLoading) return;

    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchAuditLogs();
    fetchAuditStats();
  }, [token, isLoading, filterAction, filterStatus, filterDays]);

  const handleSectionChange = (section: AdminSection) => {
    setActiveSection(section);
    if (section === "dashboard") {
      navigate("/admin/dashboard");
    } else if (section === "users") {
      navigate("/admin/users");
    }
  };

  const getActionBadge = (action: string) => {
    if (!action) {
      return "bg-gray-100 text-gray-800";
    }

    const criticalActions = [
      "DELETE_USER",
      "GRANT_LIFETIME_ACCESS",
      "REVOKE_LIFETIME_ACCESS",
    ];

    if (criticalActions.includes(action)) {
      return "bg-red-100 text-red-800";
    }

    if (action.includes("FAILED")) {
      return "bg-orange-100 text-orange-800";
    }

    return "bg-blue-100 text-blue-800";
  };

  const getStatusBadge = (status: string) => {
    return status === "SUCCESS"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const exportLogs = () => {
    const csv = [
      ["Timestamp", "Admin", "Action", "Target", "Status", "Error"].join(","),
      ...logs.map((item) =>
        [
          new Date(item.log.createdAt).toISOString(),
          item.admin?.name || "Unknown",
          item.log.action,
          item.log.targetEmail || item.log.targetId || "N/A",
          item.log.status,
          item.log.errorMessage || "",
        ]
          .map((field) => `"${field}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading security data...</p>
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
        {/* ✅ RESPONSIVE Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
              Security & Audit
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Monitor admin activities and security events
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => {
                fetchAuditLogs();
                fetchAuditStats();
              }}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 min-h-[40px] bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 flex items-center justify-center gap-2 transition text-sm"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={exportLogs}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 min-h-[40px] bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 transition text-sm"
            >
              <FiDownload className="w-4 h-4" />
              <span className="hidden sm:inline">CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* ✅ RESPONSIVE Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FiActivity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Actions</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                {stats.totalActions}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2">
                Last {filterDays} days
              </p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FiAlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Failed Actions</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                {stats.failedActions}
              </p>
              <p className="text-[10px] sm:text-xs text-red-600 mt-1 sm:mt-2">
                Requires investigation
              </p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Success Rate</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                {stats.successRate}%
              </p>
              <p className="text-[10px] sm:text-xs text-green-600 mt-1 sm:mt-2">Healthy</p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FiShield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Critical Actions</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                {stats.recentCriticalActions.length}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2">Recent</p>
            </div>
          </div>
        )}

        {/* ✅ RESPONSIVE Recent Critical Actions */}
        {stats && stats.recentCriticalActions.length > 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <FiAlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
              <span className="truncate">Recent Critical Actions</span>
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {stats.recentCriticalActions.slice(0, 5).map((item) => (
                <div
                  key={item.log.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-red-50 rounded-lg border border-red-100 gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                      {item.log.action
                        ? item.log.action.replace(/_/g, " ")
                        : "UNKNOWN ACTION"}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-1 truncate">
                      By: {item.admin?.name || "Unknown"} • Target:{" "}
                      {item.log.targetEmail || item.log.targetId || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                    <span
                      className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getStatusBadge(
                        item.log.status
                      )}`}
                    >
                      {item.log.status}
                    </span>
                    <p className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                      {new Date(item.log.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ RESPONSIVE Filters */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <select
              value={filterDays}
              onChange={(e) => setFilterDays(parseInt(e.target.value))}
              className="px-3 py-2 min-h-[40px] text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value={1}>Last 24 hours</option>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 min-h-[40px] text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="SUCCESS">Success Only</option>
              <option value="FAILED">Failed Only</option>
            </select>

            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="flex-1 px-3 py-2 min-h-[40px] text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Actions</option>
              <option value="ADMIN_LOGIN">Login</option>
              <option value="DELETE_USER">Delete User</option>
              <option value="GRANT_LIFETIME_ACCESS">Grant Lifetime</option>
              <option value="REVOKE_LIFETIME_ACCESS">Revoke Lifetime</option>
              <option value="VIEW_USER_DETAILS">View User Details</option>
            </select>

            {(filterAction || filterStatus) && (
              <button
                onClick={() => {
                  setFilterAction("");
                  setFilterStatus("");
                }}
                className="px-3 sm:px-4 py-2 min-h-[40px] bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-xs sm:text-sm font-medium whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* ✅ RESPONSIVE Audit Logs Table */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                    Timestamp
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                    Admin
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                    Target
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                    Error
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 sm:py-12 text-center">
                      <FiClock className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                      <p className="text-sm sm:text-base text-gray-600">No audit logs found</p>
                    </td>
                  </tr>
                ) : (
                  logs.map((item) => (
                    <tr
                      key={item.log.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <FiClock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                          <span className="hidden sm:inline">
                            {new Date(item.log.createdAt).toLocaleString()}
                          </span>
                          <span className="sm:hidden">
                            {new Date(item.log.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">
                          {item.admin?.name || "Unknown"}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[100px] sm:max-w-none hidden sm:block">
                          {item.admin?.email || ""}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span
                          className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getActionBadge(
                            item.log.action
                          )}`}
                        >
                          <span className="hidden sm:inline">
                            {item.log.action
                              ? item.log.action.replace(/_/g, " ")
                              : "UNKNOWN"}
                          </span>
                          <span className="sm:hidden">
                            {item.log.action
                              ? item.log.action.split("_")[0]
                              : "?"}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 hidden md:table-cell">
                        <span className="truncate max-w-[150px] inline-block">
                          {item.log.targetEmail || item.log.targetId || "N/A"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getStatusBadge(
                            item.log.status
                          )}`}
                        >
                          {item.log.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 max-w-xs truncate hidden lg:table-cell">
                        {item.log.errorMessage || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};