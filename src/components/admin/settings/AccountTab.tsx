import React, { useState } from "react";
import { useAdmin } from "../../../contexts/AdminContext";
import { useReAuth } from "../../../contexts/ReAuthContext";
import { backendPrefix } from "../../../config";
import { FiUser, FiMail, FiCheck, FiAlertCircle, FiShield } from "react-icons/fi";

export const AccountTab: React.FC = () => {
  const { admin, token } = useAdmin();
  const { requestReAuth } = useReAuth();

  const [name, setName] = useState(admin?.name || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasChanges = name !== admin?.name;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!hasChanges) {
      setError("No changes to save");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    try {
      setLoading(true);

      const reAuthToken = await requestReAuth("Update Admin Profile");

      if (!reAuthToken) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${backendPrefix}/admin/auth/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Reauth-Token": reAuthToken,
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);

        if (data.admin) {
          localStorage.setItem("admin_user", JSON.stringify(data.admin));
        }

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setError(data.error || "Failed to update profile");
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ✅ RESPONSIVE Profile Information Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <FiUser className="text-indigo-600 text-lg sm:text-xl" />
            <span className="truncate">Profile Information</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Update your admin account details
          </p>
        </div>

        {/* ✅ RESPONSIVE Alert Messages */}
        {success && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 sm:gap-3">
            <FiCheck className="text-green-600 text-lg sm:text-xl flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-xs sm:text-sm">
              Profile updated successfully! Refreshing...
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3">
            <FiAlertCircle className="text-red-600 text-lg sm:text-xl flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-xs sm:text-sm break-words">{error}</p>
          </div>
        )}

        {/* ✅ RESPONSIVE Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-6">
          {/* Admin Name */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={100}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Enter your full name"
            />
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
              This name will be displayed throughout the admin panel
            </p>
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <FiMail className="text-gray-400 text-sm sm:text-base" />
              </div>
              <input
                type="email"
                value={admin?.email || ""}
                disabled
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
              Email cannot be changed for security reasons
            </p>
          </div>

          {/* Role (Read-only) */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <FiShield className="text-gray-400 text-sm sm:text-base" />
              </div>
              <input
                type="text"
                value={admin?.role || "admin"}
                disabled
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed capitalize"
              />
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
              Your role determines your permissions in the admin panel
            </p>
          </div>

          {/* ✅ RESPONSIVE Save Button with proper touch target */}
          <button
            type="submit"
            disabled={loading || !hasChanges}
            className="w-full px-4 sm:px-6 py-3 sm:py-3.5 min-h-[44px] bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-sm sm:text-base">Saving...</span>
              </>
            ) : (
              <>
                <FiCheck className="text-base sm:text-lg" />
                <span>Save Changes</span>
              </>
            )}
          </button>

          {hasChanges && !success && (
            <p className="text-[10px] sm:text-xs text-orange-600 text-center">
              ⚠️ You have unsaved changes
            </p>
          )}
        </form>
      </div>

      {/* ✅ RESPONSIVE Account Information Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
        <div className="mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-800">
            Account Information
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            View your account details
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* ✅ RESPONSIVE Info Rows */}
          <div className="flex justify-between items-start sm:items-center py-2 sm:py-3 border-b border-gray-100 gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              Admin ID
            </span>
            <span className="text-xs sm:text-sm text-gray-800 font-mono break-all text-right">
              #{admin?.id || "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-start sm:items-center py-2 sm:py-3 border-b border-gray-100 gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              Account Status
            </span>
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap">
              Active
            </span>
          </div>

          <div className="flex justify-between items-start sm:items-center py-2 sm:py-3 gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              Last Login
            </span>
            <span className="text-xs sm:text-sm text-gray-800 text-right break-words">
              {admin?.lastLogin
                ? new Date(admin.lastLogin).toLocaleString()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};