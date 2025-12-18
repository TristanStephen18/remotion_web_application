import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FiEdit2,
  FiCamera,
  FiMail,
  FiUser,
  FiCalendar,
  FiCopy,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { updateUsername } from "../../../utils/UsernameUpdater";
import { useProfileFileUpload } from "../../../hooks/uploads/ProfileUpload";

interface AccountTabProps {
  userData: any;
  fetchProfileDetails: () => void;
}

export const AccountTab: React.FC<AccountTabProps> = ({
  userData,
  fetchProfileDetails,
}) => {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameValue, setUsernameValue] = useState(userData?.name || "");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [profilePic, setProfilePic] = useState(
    userData?.profilePicture || null
  );

  const { uploadFile, isUploading } = useProfileFileUpload({ type: "image" });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formattedDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  // Profile picture upload handler
  const handleProfilePicChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadedUrl = await uploadFile(file);
      if (uploadedUrl) {
        setProfilePic(uploadedUrl);
        toast.success("Profile picture updated!");
        fetchProfileDetails();
      }
    }
  };

  // Copy to clipboard helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Profile Picture
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={
                profilePic ||
                "https://res.cloudinary.com/dnxc1lw18/image/upload/v1761048476/pfp_yitfgl.jpg"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {isUploading ? (
                <svg
                  className="animate-spin h-8 w-8 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="4"
                    className="opacity-25"
                  />
                  <path
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    className="opacity-75"
                  />
                </svg>
              ) : (
                <div className="text-center text-white">
                  <FiCamera size={20} className="mx-auto mb-1" />
                  <p className="text-xs font-medium">Change</p>
                </div>
              )}
            </div>

            {/* Mobile edit badge */}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg md:hidden">
              <FiCamera className="text-white" size={14} />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleProfilePicChange}
              className="hidden"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm text-gray-600 mb-2">
              Click on the image to upload a new profile picture
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG or GIF. Max size 5MB.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Username Section */}
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FiUser className="text-indigo-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-800">Username</h3>
        </div>

        {isEditingUsername ? (
          <div className="space-y-4">
            <input
              type="text"
              value={usernameValue}
              onChange={(e) => setUsernameValue(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="Enter your username"
            />
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  setIsUpdatingUsername(true);
                  try {
                    const res = await updateUsername(usernameValue);
                    if (res === "success") {
                      toast.success("Username updated!");
                      fetchProfileDetails();
                      setIsEditingUsername(false);
                    }
                  } finally {
                    setIsUpdatingUsername(false);
                  }
                }}
                disabled={isUpdatingUsername}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingUsername ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setIsEditingUsername(false);
                  setUsernameValue(userData.name);
                }}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Username</p>
              <p className="text-lg font-semibold text-gray-800">
                {usernameValue}
              </p>
            </div>
            <button
              onClick={() => setIsEditingUsername(true)}
              className="p-3 hover:bg-white rounded-lg transition border border-gray-200"
            >
              <FiEdit2 className="text-indigo-600" size={18} />
            </button>
          </div>
        )}
      </motion.div>

      {/* Email Address */}
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FiMail className="text-indigo-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-800">Email Address</h3>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 mb-1">Your Email</p>
          <p className="text-lg font-semibold text-gray-800">
            {userData.email}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Email changes coming soon
          </p>
        </div>
      </motion.div>

      {/* Account Information */}
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FiCalendar className="text-indigo-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-800">
            Account Information
          </h3>
        </div>

        <div className="space-y-4">
          {/* User ID */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">User ID</p>
              <p className="text-sm font-mono text-gray-800">
                {userData.id}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(userData.id.toString(), "User ID")}
              className="p-2 hover:bg-white rounded-lg transition border border-gray-200"
            >
              <FiCopy className="text-gray-600" size={16} />
            </button>
          </div>

          {/* Account Created */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Account Created</p>
            <p className="text-sm font-semibold text-gray-800">
              {formattedDate}
            </p>
          </div>

          {/* Last Login */}
          {userData.lastLogin && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Last Login</p>
              <p className="text-sm font-semibold text-gray-800">
                {new Date(userData.lastLogin).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};