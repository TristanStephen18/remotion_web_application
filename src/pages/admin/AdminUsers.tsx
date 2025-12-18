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

  // ✅ NEW: Date filter states
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ✅ NEW: Sort states
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
  }, [token, page, subscriptionFilter, verifiedFilter, providerFilter, dateFrom, dateTo, sortBy, sortOrder, navigate, isLoading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleSectionChange = (section: AdminSection) => {
    setActiveSection(section);
    if (section === "dashboard") {
      navigate("/admin/dashboard");
    }
  };

  // ✅ NEW: Handle column sort
  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      // Toggle sort order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // New column, default to ascending
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1); // Reset to first page
  };

  // ✅ NEW: Render sort icon
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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
    };

    const badge = badges[status as keyof typeof badges] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and view all users • {totalUsers} total
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          {/* Search Row */}
          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email or name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                showFilters
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FiFilter className="w-4 h-4" />
              Filters
            </button>
          </form>

          {/* Filter Row */}
          {showFilters && (
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
              {/* Subscription Filter */}
              <select
                value={subscriptionFilter}
                onChange={(e) => {
                  setSubscriptionFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="">All Subscriptions</option>
                <option value="paid">Paid (Active + Trial)</option>
                <option value="active">Active Only</option>
                <option value="trialing">Paid Trial</option>
                <option value="free_trial">Free Trial</option>
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="">All Providers</option>
                <option value="local">Email/Local</option>
                <option value="google">Google</option>
              </select>

              {/* ✅ NEW: Date From Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">From:</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>

              {/* ✅ NEW: Date To Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">To:</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Clear Filters Button */}
              {(subscriptionFilter || verifiedFilter || providerFilter || search || dateFrom || dateTo) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                >
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">No users found</p>
              {(subscriptionFilter || verifiedFilter || providerFilter || search || dateFrom || dateTo) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {/* ✅ User Column - Sortable */}
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        User
                        {renderSortIcon("name")}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    {/* ✅ Joined Column - Sortable */}
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-2">
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                            {user.name
                              ? user.name.charAt(0).toUpperCase()
                              : user.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || "No name"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <FiMail className="w-3 h-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getSubscriptionBadge(user.subscriptionStatus, user.subscriptionPlan)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.provider || "local"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && users.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages} • Showing {users.length} of {totalUsers} users
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};