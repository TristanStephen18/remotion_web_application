import React, { useState } from "react";
import { useAdmin } from "../../../contexts/AdminContext";
import { useReAuth } from "../../../contexts/ReAuthContext";
import { backendPrefix } from "../../../config";
import { FiLock, FiCheck, FiX, FiAlertCircle, FiLogOut } from "react-icons/fi";

export const SecurityTab: React.FC = () => {
  const { token, logout } = useAdmin(); // ✅ Add logout
  const { requestReAuth } = useReAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logoutAllDevices, setLogoutAllDevices] = useState(true); // ✅ NEW: Default to true
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password strength checks
  const hasMinLength = newPassword.length >= 14;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const passwordsMatch = newPassword && newPassword === confirmPassword;

  const isPasswordValid =
    hasMinLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecial &&
    passwordsMatch;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!isPasswordValid) {
      setError("Please meet all password requirements");
      return;
    }

    try {
      setLoading(true);

      const reAuthToken = await requestReAuth("Change Admin Password");

      if (!reAuthToken) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${backendPrefix}/admin/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Reauth-Token": reAuthToken,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          logoutAllDevices, // ✅ NEW: Send flag
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // ✅ NEW: If logout all devices, redirect to login after 2 seconds
        if (logoutAllDevices) {
          setTimeout(() => {
            logout();
            window.location.href = "/admin/login";
          }, 2000);
        } else {
          setTimeout(() => setSuccess(false), 5000);
        }
      } else {
        setError(data.error || "Failed to change password");
      }
    } catch (err: any) {
      console.error("Password change error:", err);
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
          <FiLock className="text-indigo-600 text-lg sm:text-xl flex-shrink-0" />
          <span className="truncate">Change Password</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Update your admin password. Must meet all security requirements.
        </p>
      </div>

      {success && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 sm:gap-3">
          <FiCheck className="text-green-600 text-lg sm:text-xl flex-shrink-0 mt-0.5" />
          <p className="text-green-800 text-xs sm:text-sm">
            Password changed successfully! 
            {logoutAllDevices && " Logging out all devices..."}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3">
          <FiAlertCircle className="text-red-600 text-lg sm:text-xl flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-xs sm:text-sm break-words">{error}</p>
        </div>
      )}

      <form onSubmit={handleChangePassword} className="space-y-4 sm:space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="Enter current password"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="Enter new password"
          />

          {newPassword && (
            <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <p className="text-[10px] sm:text-xs font-medium text-gray-600 mb-1 sm:mb-2">
                Password must contain:
              </p>
              <PasswordRequirement
                met={hasMinLength}
                text="At least 14 characters"
              />
              <PasswordRequirement
                met={hasUpperCase}
                text="One uppercase letter"
              />
              <PasswordRequirement
                met={hasLowerCase}
                text="One lowercase letter"
              />
              <PasswordRequirement met={hasNumber} text="One number" />
              <PasswordRequirement
                met={hasSpecial}
                text="One special character (!@#$%^&*)"
              />
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="Confirm new password"
          />
          {confirmPassword && (
            <div className="mt-2">
              <PasswordRequirement
                met={passwordsMatch}
                text="Passwords match"
              />
            </div>
          )}
        </div>

        {/* ✅ NEW: Log out all devices checkbox */}
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={logoutAllDevices}
              onChange={(e) => setLogoutAllDevices(e.target.checked)}
              className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <FiLogOut className="text-orange-600 text-sm sm:text-base" />
                <span className="text-xs sm:text-sm font-medium text-gray-800">
                  Log out all devices
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">
                Recommended for security. This will log you out of all sessions including this one. You'll need to log in again.
              </p>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !isPasswordValid || !currentPassword}
          className="w-full px-4 sm:px-6 py-3 sm:py-3.5 min-h-[44px] bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-sm sm:text-base">Changing...</span>
            </>
          ) : (
            <>
              <FiLock className="text-base sm:text-lg" />
              <span>Change Password</span>
            </>
          )}
        </button>

        <p className="text-[10px] sm:text-xs text-gray-500 text-center">
          ⚠️ Changing your password will require re-authentication for security
        </p>
      </form>
    </div>
  );
};

const PasswordRequirement: React.FC<{ met: boolean; text: string }> = ({
  met,
  text,
}) => (
  <div className="flex items-start gap-1.5 sm:gap-2">
    {met ? (
      <FiCheck className="text-green-600 text-xs sm:text-sm flex-shrink-0 mt-0.5" />
    ) : (
      <FiX className="text-gray-400 text-xs sm:text-sm flex-shrink-0 mt-0.5" />
    )}
    <span className={`text-[10px] sm:text-xs leading-tight ${met ? "text-green-700" : "text-gray-500"}`}>
      {text}
    </span>
  </div>
);