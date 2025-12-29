import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import type { AdminSection } from "../../components/admin/AdminSidebar";
import { backendPrefix } from "../../config";
import {
  FiSearch,
  FiMail,
  FiCalendar,
  FiCheck,
  FiX,
  FiFilter,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";

interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  verified: boolean;
  provider: string;
  stripeCustomerId: string | null;
  subscriptionStatus: string | null;
  subscriptionPlan: string | null;
  currentPeriodEnd: string | null;
}

type SortBy = "name" | "email" | "createdAt";
type SortOrder = "asc" | "desc";

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeSection, setActiveSection] = useState<AdminSection>("users");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filter states
  const [subscriptionFilter, setSubscriptionFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Date filter states
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Sort states
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { token, logout, isLoading } = useAdmin();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder,
      });

      if (subscriptionFilter) params.append("subscription", subscriptionFilter);
      if (verifiedFilter) params.append("verified", verifiedFilter);
      if (providerFilter) params.append("provider", providerFilter);
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);

      const response = await fetch(
        `${backendPrefix}/admin/users?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setTotalPages(data.pagination.pages);
        setTotalUsers(data.pagination.total);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      if (error instanceof Error && error.message.includes("Unauthorized")) {
        logout();
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) {
      console.log("⏳ Waiting for admin session check...");
      return;
    }

    if (!token) {
      console.log("🚫 No token - redirecting to login");
      navigate("/admin/login");
      return;
    }

    console.log("✅ Token found - fetching users");
    fetchUsers();
  }, [
    token,
    page,
    subscriptionFilter,
    verifiedFilter,
    providerFilter,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
    navigate,
    isLoading,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleSectionChange = (section: AdminSection) => {
    setActiveSection(section);
    if (section === "dashboard") {
      navigate("/admin/dashboard");
    } else if (section === "security") {
      navigate("/admin/security");
    }
  };

  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const renderSortIcon = (column: SortBy) => {
    if (sortBy !== column) {
      return <span className="text-gray-400 opacity-50">⇅</span>;
    }
    return sortOrder === "asc" ? (
      <FiChevronUp className="w-4 h-4 text-indigo-600" />
    ) : (
      <FiChevronDown className="w-4 h-4 text-indigo-600" />
    );
  };

  const clearFilters = () => {
    setSubscriptionFilter("");
    setVerifiedFilter("");
    setProviderFilter("");
    setDateFrom("");
    setDateTo("");
    setSearch("");
    setPage(1);
  };

  const getSubscriptionBadge = (status: string | null, plan: string | null) => {
    if (!status) {
      return (
        <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-gray-100 text-gray-800">
          No Subscription
        </span>
      );
    }

    const badges = {
      active: {
        color: "bg-green-100 text-green-800",
        label: "Active (Paid)",
      },
      trialing: {
        color: "bg-blue-100 text-blue-800",
        label: "Paid Trial",
      },
      free_trial: {
        color: "bg-cyan-100 text-cyan-800",
        label: "Free Trial",
      },
      canceled: {
        color: "bg-red-100 text-red-800",
        label: "Canceled",
      },
      past_due: {
        color: "bg-orange-100 text-orange-800",
        label: "Past Due",
      },
      incomplete: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Incomplete",
      },
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

    const badge = badges[status as keyof typeof badges] || {
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
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage and view all users • {totalUsers} total
          </p>
        </div>

        {/* ✅ RESPONSIVE Search & Filter Bar */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6">
          {/* Search Row */}
          <form onSubmit={handleSearch} className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email or name..."
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-4 sm:px-6 py-2 min-h-[40px] bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base font-medium whitespace-nowrap"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 sm:px-4 py-2 min-h-[40px] rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base ${
                showFilters
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FiFilter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </form>

          {/* ✅ RESPONSIVE Filter Row */}
          {showFilters && (
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100">
              {/* Subscription Filter */}
              <select
                value={subscriptionFilter}
                onChange={(e) => {
                  setSubscriptionFilter(e.target.value);
                  setPage(1);
                }}
                className="flex-1 sm:flex-initial px-3 py-2 min-h-[40px] text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Subscriptions</option>
                <option value="paid">Paid (Active + Trial)</option>
                <option value="active">Active Only</option>
                <option value="trialing">Paid Trial</option>
                <option value="free_trial">Free Trial</option>
                <option value="lifetime">Lifetime Access</option>
                <option value="company">Company Accounts</option>
                <option value="none">No Subscription</option>
                <option value="canceled">Canceled</option>
              </select>

              {/* Verified Filter */}
              <select
                value={verifiedFilter}
                onChange={(e) => {
                  setVerifiedFilter(e.target.value);
                  setPage(1);
                }}
                className="flex-1 sm:flex-initial px-3 py-2 min-h-[40px] text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </select>

              {/* Provider Filter */}
              <select
                value={providerFilter}
                onChange={(e) => {
                  setProviderFilter(e.target.value);
                  setPage(1);
                }}
                className="flex-1 sm:flex-initial px-3 py-2 min-h-[40px] text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Providers</option>
                <option value="local">Email/Local</option>
                <option value="google">Google</option>
              </select>

              {/* Date From Filter */}
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">From:</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPage(1);
                  }}
                  className="flex-1 px-2 sm:px-3 py-2 min-h-[40px] text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Date To Filter */}
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">To:</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(1);
                  }}
                  className="flex-1 px-2 sm:px-3 py-2 min-h-[40px] text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Clear Filters Button */}
              {(subscriptionFilter ||
                verifiedFilter ||
                providerFilter ||
                search ||
                dateFrom ||
                dateTo) && (
                <button
                  onClick={clearFilters}
                  className="px-3 sm:px-4 py-2 min-h-[40px] bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                >
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>

        {/* ✅ RESPONSIVE Users Table */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <p className="text-sm sm:text-base text-gray-600 mb-4">No users found</p>
              {(subscriptionFilter ||
                verifiedFilter ||
                providerFilter ||
                search ||
                dateFrom ||
                dateTo) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        User
                        {renderSortIcon("name")}
                      </div>
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Subscription
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Provider
                    </th>
                    <th
                      className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        Joined
                        {renderSortIcon("createdAt")}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm flex-shrink-0">
                            {user.name
                              ? user.name.charAt(0).toUpperCase()
                              : user.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                              {user.name || "No name"}
                            </div>
                            <div className="text-[10px] sm:text-sm text-gray-500 flex items-center gap-1 truncate">
                              <FiMail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        {user.verified ? (
                          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-800">
                            <FiCheck className="w-3 h-3" />
                            <span className="hidden sm:inline">Verified</span>
                            <span className="sm:hidden">✓</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-yellow-100 text-yellow-800">
                            <FiX className="w-3 h-3" />
                            <span className="hidden sm:inline">Unverified</span>
                            <span className="sm:hidden">✗</span>
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                        {getSubscriptionBadge(
                          user.subscriptionStatus,
                          user.subscriptionPlan
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                        {user.provider || "local"}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3 flex-shrink-0" />
                          <span className="hidden sm:inline">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                          <span className="sm:hidden">
                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ✅ RESPONSIVE Pagination */}
          {!loading && users.length > 0 && (
            <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 min-h-[40px] bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 min-h-[40px] bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Next
                </button>
              </div>
              <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-right">
                Page {page} of {totalPages} • {users.length} of {totalUsers} users
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};