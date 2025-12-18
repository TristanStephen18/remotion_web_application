import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2,
  FiAlertCircle,
  FiX,
  FiEye,
  FiEyeOff,
  FiShield,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { backendPrefix } from "../../../config";

interface DataPrivacyTabProps {
  userData: any;
}

export const DataPrivacyTab: React.FC<DataPrivacyTabProps> = ({ userData }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [delete2FACode, setDelete2FACode] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    if (!deletePassword) {
      toast.error("Password is required");
      return;
    }

    if (userData?.twoFactorEnabled && !delete2FACode && !requires2FA) {
      setRequires2FA(true);
      toast.error("2FA code required");
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendPrefix}/auth/delete-account`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: deletePassword,
          twoFactorCode: delete2FACode || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Account deleted successfully. Redirecting...");

        // Clear local storage and redirect to home
        localStorage.removeItem("token");
        
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else if (data.requires2FA) {
        setRequires2FA(true);
        toast.error("Please enter your 2FA code");
      } else {
        throw new Error(data.error || "Failed to delete account");
      }
    } catch (error: any) {
      console.error("Delete account error:", error);
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  const resetModal = () => {
    setOpenDeleteModal(false);
    setDeleteConfirmText("");
    setDeletePassword("");
    setShowDeletePassword(false);
    setDelete2FACode("");
    setRequires2FA(false);
  };

  return (
    <div className="space-y-6">
      {/* Warning Info */}
      <motion.div
        className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start gap-3">
          <FiAlertCircle
            className="text-red-600 mt-0.5 flex-shrink-0"
            size={20}
          />
          <div>
            <p className="text-sm font-semibold text-red-900 mb-2">
              Danger Zone
            </p>
            <p className="text-sm text-red-800 leading-relaxed">
              Actions in this section are permanent and cannot be undone. Please
              proceed with caution.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Delete Account */}
      <motion.div
        className="bg-white rounded-2xl shadow-sm border-2 border-red-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <FiTrash2 className="text-red-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Delete Account
            </h3>
            <p className="text-sm text-gray-500">
              Permanently remove your account
            </p>
          </div>
        </div>

        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl mb-4">
          <div className="flex gap-3">
            <FiAlertCircle
              className="text-red-600 mt-0.5 flex-shrink-0"
              size={18}
            />
            <div>
              <p className="text-sm font-semibold text-red-900 mb-2">
                Warning: This action is irreversible
              </p>
              <ul className="space-y-1.5 text-sm text-red-800">
                <li className="flex items-start gap-1.5">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span>All your projects will be permanently deleted</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span>Your subscription will be canceled</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span>All uploaded files will be removed</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span>This cannot be undone</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={() => setOpenDeleteModal(true)}
          className="w-full px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-sm transition"
        >
          Delete My Account
        </button>
      </motion.div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {openDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetModal}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={resetModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <FiX size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <FiTrash2 className="text-red-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Delete Account
                  </h2>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="text-sm text-red-900 leading-relaxed">
                  You are about to permanently delete your account and all
                  associated data. This includes all projects, uploads, and
                  subscription information.
                </p>
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your password to confirm
                </label>
                <div className="relative">
                  <input
                    type={showDeletePassword ? "text" : "password"}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showDeletePassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* 2FA Code if user has it enabled */}
              {userData?.twoFactorEnabled && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiShield className="text-indigo-600" size={16} />
                    <label className="block text-sm font-medium text-gray-700">
                      Enter your 2FA code
                    </label>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={delete2FACode}
                    onChange={(e) =>
                      setDelete2FACode(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="000000"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-center font-mono tracking-wider focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
                  />
                </div>
              )}

              {/* Type DELETE confirmation */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <strong>DELETE</strong> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={
                    isDeleting ||
                    deleteConfirmText !== "DELETE" ||
                    !deletePassword ||
                    (userData?.twoFactorEnabled && !delete2FACode)
                  }
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};