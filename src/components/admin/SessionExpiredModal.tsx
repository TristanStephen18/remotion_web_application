import React from "react";
import { FiAlertTriangle, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";

export const SessionExpiredModal: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAdmin();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAlertTriangle className="text-white text-3xl" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Session Expired
        </h2>
        <p className="text-gray-600 mb-6">
          Your admin session has expired for security reasons. Please log in again to continue.
        </p>

        <button
          onClick={handleLogout}
          className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
        >
          <FiLogOut className="w-5 h-5" />
          Return to Login
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Admin sessions expire after 1 hour of inactivity
        </p>
      </div>
    </div>
  );
};