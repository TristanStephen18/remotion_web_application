import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  FiEdit2,
  FiCamera,
  FiLock,
  FiEye,
  FiEyeOff,
  FiX,
  FiTrendingUp,
  FiPieChart,
  FiShield,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Tab } from "@headlessui/react";
import { templatesWithTheirIds } from "../../data/TemplateIds";
import { updateUsername } from "../../utils/UsernameUpdater";
import { updatePassword } from "../../utils/PasswordUpdater";
import { useProfileFileUpload } from "../../hooks/uploads/ProfileUpload";
import toast from "react-hot-toast";
import { backendPrefix } from "../../config";

// Helper function to generate continuous date range
const generateDateRange = (days: number) => {
  const result = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    result.push({
      date: date,
      day: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      renders: 0, // Default to 0
    });
  }

  return result;
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-800">
          {payload[0].payload.day}
        </p>
        <p className="text-sm text-gray-600">
          Renders:{" "}
          <span className="font-bold text-indigo-600">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

interface ProfilePageProps {
  userData: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  userDatasets: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  projects: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  userUploads: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  renders: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  fetchProfileDetails: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userData,
  userDatasets,
  userUploads,
  projects,
  renders,
  fetchProfileDetails,
}) => {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameValue, setUsernameValue] = useState(userData?.name || "");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwords, setPasswords] = useState({
    old: "",
    new: "",
    confirm: "",
  });
  const [passwordChange2FARequired, setPasswordChange2FARequired] =
    useState(false);
  const [passwordChange2FACode, setPasswordChange2FACode] = useState("");

  // 2FA states
  const [open2FAModal, setOpen2FAModal] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    userData?.twoFactorEnabled || false
  );
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);
  const [disable2FAPassword, setDisable2FAPassword] = useState("");
  const [showDisable2FAPassword, setShowDisable2FAPassword] = useState(false);
  const [show2FAQRCode, setShow2FAQRCode] = useState(false);

  const { uploadFile, isUploading } = useProfileFileUpload({ type: "image" });
  const [profilePic, setProfilePic] = useState(
    userData?.profilePicture || null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formattedDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown";

  const templatesUsageData = useMemo(() => {
    const counts: Record<string, number> = {};

    // Initialize all available templates with 0
    Object.keys(templatesWithTheirIds).forEach((templateId) => {
      counts[templateId] = 0;
    });

    // Count actual usage
    renders.forEach((r) => {
      if (!r.templateId) return;
      counts[r.templateId] = (counts[r.templateId] || 0) + 1;
    });

    // Only return templates that were actually used (or show all with 0s)
    return Object.entries(counts)
      .filter(([, usage]) => usage > 0) // Remove this line to show all templates
      .map(([templateId, usage]) => ({
        templateId,
        template: templatesWithTheirIds[templateId] || "Unknown",
        usage,
      }))
      .sort((a, b) => b.usage - a.usage); // Sort by most used
  }, [renders]);

  const [chartTimeRange, setChartTimeRange] = useState<
    "7d" | "30d" | "90d" | "all"
  >("30d");

  const mostUsedTemplateAllTime = templatesUsageData.length
    ? templatesUsageData.reduce((prev, curr) =>
        curr.usage > prev.usage ? curr : prev
      ).template
    : "No templates used yet.";

  const filteredRenderingData = useMemo(() => {
    if (chartTimeRange === "all") {
      // ✅ ALL TIME: Show only days with renders
      const counts: Record<string, number> = {};

      renders.forEach((render) => {
        if (!render.renderedAt) return;

        const renderDate = new Date(render.renderedAt);
        const renderDay = renderDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        counts[renderDay] = (counts[renderDay] || 0) + 1;
      });

      // Convert to array and sort by date
      return Object.entries(counts)
        .map(([day, renders]) => ({
          day,
          renders,
          date: new Date(day + ", 2024"),
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map(({ day, renders }) => ({ day, renders }));
    } else {
      // ✅ 7d, 30d, 90d: Show continuous dates (including zeros)
      const daysToShow =
        chartTimeRange === "7d" ? 7 : chartTimeRange === "30d" ? 30 : 90;

      // Generate continuous date range
      const dateRange = generateDateRange(daysToShow);

      // Map renders to dates
      renders.forEach((render) => {
        if (!render.renderedAt) return;

        const renderDate = new Date(render.renderedAt);
        const renderDay = renderDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        // Find matching date in our range
        const matchingDay = dateRange.find((d) => d.day === renderDay);
        if (matchingDay) {
          matchingDay.renders++;
        }
      });

      return dateRange;
    }
  }, [renders, chartTimeRange]);

  const filteredTemplatesUsageData = useMemo(() => {
    let filteredRenders = renders;

    // Filter renders based on time range (except "all")
    if (chartTimeRange !== "all") {
      const daysToShow =
        chartTimeRange === "7d" ? 7 : chartTimeRange === "30d" ? 30 : 90;

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToShow);

      filteredRenders = renders.filter((render) => {
        if (!render.renderedAt) return false;
        return new Date(render.renderedAt) >= cutoffDate;
      });
    }

    // Count template usage from filtered renders
    const counts: Record<string, number> = {};

    // Initialize all available templates with 0
    Object.keys(templatesWithTheirIds).forEach((templateId) => {
      counts[templateId] = 0;
    });

    // Count actual usage
    filteredRenders.forEach((r) => {
      if (!r.templateId) return;
      counts[r.templateId] = (counts[r.templateId] || 0) + 1;
    });

    // Only return templates that were actually used
    return Object.entries(counts)
      .filter(([, usage]) => usage > 0)
      .map(([templateId, usage]) => ({
        templateId,
        template:
          (templatesWithTheirIds[templateId] || "Unknown").slice(0, 15) + "...",
        usage,
      }))
      .sort((a, b) => b.usage - a.usage);
  }, [renders, chartTimeRange]);

  useEffect(() => {
    if (userData?.name) {
      setUsernameValue(userData.name);
    }
    if (userData?.profilePicture) {
      setProfilePic(userData.profilePicture);
    }
    if (userData?.twoFactorEnabled !== undefined) {
      setTwoFactorEnabled(userData.twoFactorEnabled);
    }
  }, [userData]);

  useEffect(() => {
    if (profilePic && profilePic !== userData?.profilePicture) {
      fetchProfileDetails();
    }
  }, [profilePic]); // eslint-disable-line react-hooks/exhaustive-deps

  // ==== Profile Picture Upload ====
  const handleProfilePicChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadedUrl = await uploadFile(file);
      if (uploadedUrl) {
        setProfilePic(uploadedUrl);
        toast.success("Profile picture updated!");
      }
    }
  };

  // ==== Enable 2FA ====
  const handleEnable2FA = async () => {
    setIsEnabling2FA(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendPrefix}/auth/2fa/enable`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setQrCode(data.qrCode);
        setTwoFactorSecret(data.secret);

        // ✅ NEW: Check if user has existing secret
        const hasExistingSecret =
          userData?.twoFactorSecret && data.secret === userData.twoFactorSecret;

        if (hasExistingSecret) {
          // ✅ User is re-enabling - skip QR code, go straight to verification
          setShow2FAQRCode(false);
          toast.success(
            "Enter the code from your existing authenticator app entry"
          );
        } else {
          // ✅ New setup - show QR code
          setShow2FAQRCode(true);
          toast.success("Scan the QR code with your authenticator app");
        }

        setOpen2FAModal(true);
      } else {
        toast.error(data.error || "Failed to enable 2FA");
      }
    } catch (error) {
      console.error("Enable 2FA error:", error);
      toast.error("Failed to enable 2FA");
    } finally {
      setIsEnabling2FA(false);
    }
  };

  // ==== Confirm 2FA Setup ====
  const handleConfirm2FA = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setIsEnabling2FA(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendPrefix}/auth/2fa/confirm`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();

      if (data.success) {
        setTwoFactorEnabled(true);
        setOpen2FAModal(false);
        setQrCode(null);
        setTwoFactorSecret(null);
        setVerificationCode("");
        toast.success("Two-factor authentication enabled successfully!");
        fetchProfileDetails();
      } else {
        toast.error(data.error || "Invalid code");
      }
    } catch (error) {
      console.error("Confirm 2FA error:", error);
      toast.error("Failed to confirm 2FA");
    } finally {
      setIsEnabling2FA(false);
    }
  };

  // ==== Disable 2FA ====
  const handleDisable2FA = async () => {
    if (!disable2FAPassword) {
      toast.error("Password is required to disable 2FA");
      return;
    }

    setIsDisabling2FA(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendPrefix}/auth/2fa/disable`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: disable2FAPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setTwoFactorEnabled(false);
        setOpen2FAModal(false);
        setDisable2FAPassword("");
        toast.success("Two-factor authentication disabled");
        fetchProfileDetails();
      } else {
        toast.error(data.error || "Failed to disable 2FA");
      }
    } catch (error) {
      console.error("Disable 2FA error:", error);
      toast.error("Failed to disable 2FA");
    } finally {
      setIsDisabling2FA(false);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* ==== Header ==== */}
      <motion.div
        layout
        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-transparent to-pink-50 opacity-60" />
        <div className="relative flex flex-col items-center gap-3 z-10">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Change profile picture"
          >
            <img
              src={
                profilePic ||
                "https://res.cloudinary.com/dnxc1lw18/image/upload/v1761048476/pfp_yitfgl.jpg"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300"
            />

            {/* Hover overlay - always shows on mobile */}
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
                  <FiCamera size={24} className="mx-auto mb-1" />
                  <p className="text-xs font-medium">Change Photo</p>
                </div>
              )}
            </div>

            {/* Mobile-visible edit badge */}
            <div className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg md:hidden">
              <FiCamera className="text-white" size={16} />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleProfilePicChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex-1 z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            {isEditingUsername ? (
              <input
                type="text"
                value={usernameValue}
                onChange={(e) => setUsernameValue(e.target.value)}
                className="text-xl sm:text-2xl font-semibold border-b-2 border-indigo-500 focus:outline-none bg-transparent w-full"
              />
            ) : (
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 break-words">
                {usernameValue || "User"}
              </h2>
            )}
            {!isEditingUsername ? (
              <button
                onClick={() => setIsEditingUsername(true)}
                className="text-gray-400 hover:text-indigo-500 transition flex-shrink-0"
                aria-label="Edit username"
              >
                <FiEdit2 />
              </button>
            ) : (
              <div className="flex flex-wrap gap-2 w-full sm:w-auto sm:flex-nowrap">
                <button
                  onClick={async () => {
                    setIsUpdatingUsername(true);
                    try {
                      const res = await updateUsername(usernameValue);
                      if (res === "success") {
                        toast.success("Username updated!");
                        fetchProfileDetails();
                      }
                    } finally {
                      setIsUpdatingUsername(false);
                      setIsEditingUsername(false);
                    }
                  }}
                  className="flex-1 sm:flex-none px-4 py-1.5 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 text-sm font-medium whitespace-nowrap"
                >
                  {isUpdatingUsername ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEditingUsername(false);
                    setUsernameValue(userData.name);
                  }}
                  aria-label="Cancel edit"
                  className="flex-1 sm:flex-none px-4 py-1.5 border border-gray-300 rounded-full text-sm hover:bg-gray-100 font-medium whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-500 mt-1">{userData.email}</p>
          <p className="text-xs text-gray-400 mt-0.5">Joined {formattedDate}</p>
        </div>
      </motion.div>

      <Tab.Group>
        <Tab.List className="flex gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-100 mt-8">
          <Tab
            className={({ selected }) =>
              `flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition ${
                selected
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            Overview
          </Tab>
          <Tab
            className={({ selected }) =>
              `flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition ${
                selected
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            Security
          </Tab>
        </Tab.List>

        <Tab.Panels className="mt-6">
          {/* OVERVIEW TAB - Combines stats, activity, and charts */}
          <Tab.Panel>
            {/* Stats Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              layout
            >
              {[
                {
                  label: "Most Used Template",
                  value: mostUsedTemplateAllTime,
                  icon: <FiTrendingUp />,
                  color: "text-indigo-600",
                  action: () => console.log("Navigate to templates"),
                },
                {
                  label: "Created Templates",
                  value: projects.length,
                  icon: <FiPieChart />,
                  color: "text-pink-500",
                  action: () => console.log("Navigate to projects"),
                },
                {
                  label: "Uploads",
                  value: userUploads.length,
                  icon: <FiCamera />,
                  color: "text-purple-500",
                  action: () => console.log("Navigate to uploads"),
                },
                {
                  label: "Datasets",
                  value: userDatasets.length,
                  icon: <FiTrendingUp />,
                  color: "text-green-500",
                  action: () => console.log("Navigate to datasets"),
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  onClick={stat.action}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-800">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`text-4xl ${stat.color}`}>{stat.icon}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Analytics Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Analytics
                </h3>
                <p className="text-sm text-gray-500">
                  {chartTimeRange === "all"
                    ? `Showing ${filteredRenderingData.length} active days`
                    : `Last ${
                        chartTimeRange === "7d"
                          ? "7"
                          : chartTimeRange === "30d"
                          ? "30"
                          : "90"
                      } days`}
                </p>
              </div>

              <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-200">
                {[
                  { value: "7d", label: "Last 7 Days" },
                  { value: "30d", label: "Last 30 Days" },
                  { value: "90d", label: "Last 90 Days" },
                  { value: "all", label: "All Activity" },
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() =>
                      setChartTimeRange(
                        range.value as "7d" | "30d" | "90d" | "all"
                      )
                    }
                    className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded transition ${
                      chartTimeRange === range.value
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Analytics Section - Charts */}
            <div className="space-y-6">
              {/* Desktop Charts - 2 Column Grid */}
              <div className="hidden lg:grid lg:grid-cols-2 gap-6">
                {/* Rendering History Chart */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Rendering History
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Your daily render count.
                  </p>

                  {filteredRenderingData.every((d) => d.renders === 0) ? (
                    // Empty state
                    <div className="h-[250px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FiTrendingUp className="text-gray-400 text-2xl" />
                        </div>
                        <p className="text-gray-600 font-medium">
                          No renders yet
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Start creating videos to see your analytics
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Chart */}
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={filteredRenderingData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="day"
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis allowDecimals={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="renders"
                            stroke="#6366F1"
                            strokeWidth={2}
                            dot={{ fill: "#6366F1", r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>

                      {/* Insight */}
                      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FiTrendingUp className="text-blue-600 text-lg" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-900">
                              Activity Insight
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                              {chartTimeRange === "all" ? (
                                <>
                                  You've rendered{" "}
                                  {filteredRenderingData.reduce(
                                    (sum, d) => sum + d.renders,
                                    0
                                  )}{" "}
                                  videos across {filteredRenderingData.length}{" "}
                                  active days. Your peak day had{" "}
                                  {Math.max(
                                    ...filteredRenderingData.map(
                                      (d) => d.renders
                                    )
                                  )}{" "}
                                  renders.
                                </>
                              ) : (
                                <>
                                  You rendered{" "}
                                  {filteredRenderingData.reduce(
                                    (sum, d) => sum + d.renders,
                                    0
                                  )}{" "}
                                  videos in this period. Your peak day had{" "}
                                  {Math.max(
                                    ...filteredRenderingData.map(
                                      (d) => d.renders
                                    )
                                  )}{" "}
                                  renders.
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Template Usage Chart */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Template Usage
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Most used templates.
                  </p>

                  {filteredTemplatesUsageData.length === 0 ? (
                    // Empty state
                    <div className="h-[250px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FiPieChart className="text-gray-400 text-2xl" />
                        </div>
                        <p className="text-gray-600 font-medium">
                          No templates used
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Create your first video to see template statistics
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Chart */}
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={filteredTemplatesUsageData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="template"
                            tick={{ fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis allowDecimals={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="usage"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            dot={{ fill: "#8B5CF6", r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>

                      {/* Insight */}
                      <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FiPieChart className="text-purple-600 text-lg" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-purple-900">
                              Template Preference
                            </p>
                            <p className="text-xs text-purple-700 mt-1">
                              Your favorite template is "
                              {filteredTemplatesUsageData[0]?.template}" with{" "}
                              {filteredTemplatesUsageData[0]?.usage} uses.
                              {filteredTemplatesUsageData.length > 1 &&
                                ` You've explored ${filteredTemplatesUsageData.length} different templates.`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Mobile Charts - Simplified View */}
              <div className="lg:hidden space-y-6">
                {/* Rendering History Chart - Mobile */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Rendering History
                  </h4>
                  <p className="text-xs text-gray-500 mb-4">
                    Your daily render count.
                  </p>

                  {filteredRenderingData.every((d) => d.renders === 0) ? (
                    // Empty state
                    <div className="h-[200px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <FiTrendingUp className="text-gray-400 text-xl" />
                        </div>
                        <p className="text-gray-600 text-sm font-medium">
                          No renders yet
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Start creating videos to see your analytics
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Chart */}
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={filteredRenderingData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
                          <XAxis
                            dataKey="day"
                            tick={{ fontSize: 10 }}
                            angle={-45}
                            textAnchor="end"
                            height={50}
                            interval="preserveStartEnd"
                          />
                          <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 10 }}
                            width={30}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="renders"
                            stroke="#6366F1"
                            strokeWidth={2}
                            dot={{ fill: "#6366F1", r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>

                      {/* Insight - Mobile */}
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-start gap-2">
                          <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FiTrendingUp className="text-blue-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-blue-900">
                              Activity Insight
                            </p>
                            <p className="text-xs text-blue-700 mt-0.5">
                              {chartTimeRange === "all" ? (
                                <>
                                  {filteredRenderingData.reduce(
                                    (sum, d) => sum + d.renders,
                                    0
                                  )}{" "}
                                  videos across {filteredRenderingData.length}{" "}
                                  active days.
                                </>
                              ) : (
                                <>
                                  {filteredRenderingData.reduce(
                                    (sum, d) => sum + d.renders,
                                    0
                                  )}{" "}
                                  videos in this period. Peak:{" "}
                                  {Math.max(
                                    ...filteredRenderingData.map(
                                      (d) => d.renders
                                    )
                                  )}{" "}
                                  renders.
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Template Usage Chart - Mobile */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Template Usage
                  </h4>
                  <p className="text-xs text-gray-500 mb-4">
                    Most used templates.
                  </p>

                  {filteredTemplatesUsageData.length === 0 ? (
                    // Empty state
                    <div className="h-[200px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <FiPieChart className="text-gray-400 text-xl" />
                        </div>
                        <p className="text-gray-600 text-sm font-medium">
                          No templates used
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {chartTimeRange === "all"
                            ? "Create your first video"
                            : "No templates in this period"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Chart */}
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={filteredTemplatesUsageData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
                          <XAxis
                            dataKey="template"
                            tick={{ fontSize: 9 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval={0}
                          />
                          <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 10 }}
                            width={30}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              fontSize: "12px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="usage"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            dot={{ fill: "#8B5CF6", r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>

                      {/* Insight - Mobile */}
                      <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="flex items-start gap-2">
                          <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FiPieChart className="text-purple-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-purple-900">
                              Template Preference
                            </p>
                            <p className="text-xs text-purple-700 mt-0.5">
                              {chartTimeRange === "all" ? (
                                <>
                                  Favorite: "
                                  {filteredTemplatesUsageData[0]?.template}" (
                                  {filteredTemplatesUsageData[0]?.usage} uses)
                                </>
                              ) : (
                                <>
                                  Top: "
                                  {filteredTemplatesUsageData[0]?.template}" (
                                  {filteredTemplatesUsageData[0]?.usage}×)
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* SECURITY TAB */}
          <Tab.Panel>
            {/* Professional Security Section */}
            <motion.div
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <FiShield className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Security Settings
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Manage your account security and authentication
                  </p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {/* Security Score */}
                <div className="mb-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Security Score
                      </p>
                      <p className="text-4xl font-bold text-emerald-600">
                        {twoFactorEnabled ? "85" : "65"}/100
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {twoFactorEnabled
                          ? "Great! Your account is secure"
                          : "Enable 2FA to improve security"}
                      </p>
                    </div>

                    {/* Circular Progress */}
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90">
                        {/* Background circle */}
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#d1fae5"
                          strokeWidth="8"
                          fill="none"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#10b981"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray="251.2"
                          strokeDashoffset={
                            twoFactorEnabled ? "37.68" : "88.92"
                          }
                          className="transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-emerald-600">
                          {twoFactorEnabled ? "85%" : "65%"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Security checklist */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FiCheck className="text-emerald-600" />
                      <span className="text-gray-700">Strong password</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {twoFactorEnabled ? (
                        <>
                          <FiCheck className="text-emerald-600" />
                          <span className="text-gray-700">
                            Two-factor authentication enabled
                          </span>
                        </>
                      ) : (
                        <>
                          <FiAlertCircle className="text-yellow-600" />
                          <span className="text-gray-700">
                            Enable 2FA to add +20 points
                          </span>
                        </>
                      )}
                    </div>
                    {twoFactorEnabled && (
                      <div className="flex items-center gap-2 text-sm">
                        <FiAlertCircle className="text-yellow-600" />
                        <span className="text-gray-700">
                          Add recovery email to reach 100
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Responsive Password Card */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 border-2 border-gray-300 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-gray-400 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 border-2 border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FiLock className="text-gray-600 text-lg sm:text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                        Password
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        Change your account password
                      </p>
                      {userData?.passwordLastChanged && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Last changed:{" "}
                          {new Date(
                            userData.passwordLastChanged
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setOpenPasswordModal(true)}
                    aria-label="Open password change dialog"
                    className="w-full sm:w-auto px-4 sm:px-5 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium border border-gray-300 transition-all hover:border-gray-400 flex-shrink-0"
                  >
                    Change Password
                  </button>
                </motion.div>

                {/* Responsive 2FA Card */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 border-2 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 ${
                    twoFactorEnabled
                      ? "border-emerald-300 hover:border-emerald-400"
                      : "border-gray-300 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all ${
                          twoFactorEnabled
                            ? "bg-emerald-50 ring-2 ring-emerald-200"
                            : "bg-gray-100 border-2 border-gray-200"
                        }`}
                      >
                        <FiShield
                          className={`text-lg sm:text-xl transition-colors ${
                            twoFactorEnabled
                              ? "text-emerald-600"
                              : "text-gray-500"
                          }`}
                        />
                      </div>
                      {twoFactorEnabled && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                          <FiCheck className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-1">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                          Two-Factor Authentication
                        </h4>
                        {twoFactorEnabled && (
                          <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full ring-1 ring-emerald-200">
                            <FiCheck size={12} />
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {twoFactorEnabled
                          ? "Your account is protected with 2FA"
                          : "Add an extra layer of security to your account"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (twoFactorEnabled) {
                        setOpen2FAModal(true);
                      } else {
                        handleEnable2FA();
                      }
                    }}
                    disabled={isEnabling2FA}
                    className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
                      twoFactorEnabled
                        ? "bg-white text-red-600 border-2 border-red-300 hover:bg-red-50 hover:border-red-400"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md"
                    }`}
                  >
                    {isEnabling2FA
                      ? "Loading..."
                      : twoFactorEnabled
                      ? "Disable 2FA"
                      : "Enable 2FA"}
                  </button>
                </motion.div>

                {/* Last Login Info */}
                {userData.lastLogin && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start sm:items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                  >
                    <FiAlertCircle
                      className="text-blue-500 flex-shrink-0 mt-0.5 sm:mt-0"
                      size={18}
                    />
                    <p className="text-xs sm:text-sm text-gray-700">
                      <span className="font-medium">Last login:</span>{" "}
                      {new Date(userData.lastLogin).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* ==== Password Change Modal ==== */}
      <AnimatePresence>
        {openPasswordModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <button
                onClick={() => {
                  setOpenPasswordModal(false);
                  setPasswordChange2FARequired(false);
                  setPasswordChange2FACode("");
                  setPasswords({ old: "", new: "", confirm: "" });
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <FiX size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  {passwordChange2FARequired ? (
                    <FiShield className="text-indigo-600 text-xl" />
                  ) : (
                    <FiLock className="text-indigo-600 text-xl" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {passwordChange2FARequired
                      ? "Verify Your Identity"
                      : "Change Password"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {passwordChange2FARequired
                      ? "Enter your 2FA code to continue"
                      : "Update your account password"}
                  </p>
                </div>
              </div>

              {!passwordChange2FARequired ? (
                <>
                  {/* ✅ Password Fields */}
                  {["old", "new", "confirm"].map((field) => (
                    <div key={field} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field === "old"
                          ? "Current Password"
                          : field === "new"
                          ? "New Password"
                          : "Confirm New Password"}
                      </label>
                      <div className="relative">
                        <input
                          type={
                            showPassword[field as keyof typeof showPassword]
                              ? "text"
                              : "password"
                          }
                          value={passwords[field as keyof typeof passwords]}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              [field]: e.target.value,
                            })
                          }
                          className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((prev) => ({
                              ...prev,
                              [field]: !prev[field as keyof typeof prev],
                            }))
                          }
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition"
                        >
                          {showPassword[field as keyof typeof showPassword] ? (
                            <FiEyeOff size={18} />
                          ) : (
                            <FiEye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => {
                        setOpenPasswordModal(false);
                        setPasswords({ old: "", new: "", confirm: "" });
                      }}
                      className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        if (passwords.new !== passwords.confirm) {
                          return toast.error("Passwords do not match");
                        }
                        if (passwords.new.length < 8) {
                          return toast.error(
                            "Password must be at least 8 characters"
                          );
                        }

                        setIsUpdatingPassword(true);
                        try {
                          const res = await updatePassword(
                            passwords.old,
                            passwords.new
                          );

                          // ✅ NEW: Check if 2FA is required
                          if (typeof res === "object" && res.requires2FA) {
                            setPasswordChange2FARequired(true);
                            setIsUpdatingPassword(false);
                            return;
                          }

                          if (res === "success") {
                            toast.success("Password updated successfully!");
                            setOpenPasswordModal(false);
                            setPasswords({ old: "", new: "", confirm: "" });
                          }
                        } finally {
                          setIsUpdatingPassword(false);
                        }
                      }}
                      disabled={isUpdatingPassword}
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm hover:shadow-md transition disabled:opacity-50"
                    >
                      {isUpdatingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* ✅ NEW: 2FA Verification Step */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex gap-3">
                      <FiShield
                        className="text-blue-600 mt-0.5 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <p className="text-sm font-semibold text-blue-800">
                          Two-Factor Authentication Required
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          Enter the 6-digit code from your authenticator app to
                          confirm this password change.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Authentication Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={passwordChange2FACode}
                      onChange={(e) =>
                        setPasswordChange2FACode(
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                      placeholder="000000"
                      autoFocus
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Enter the code from your authenticator app
                    </p>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setPasswordChange2FARequired(false);
                        setPasswordChange2FACode("");
                      }}
                      className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={async () => {
                        if (passwordChange2FACode.length !== 6) {
                          return toast.error("Please enter a 6-digit code");
                        }

                        setIsUpdatingPassword(true);
                        try {
                          const res = await updatePassword(
                            passwords.old,
                            passwords.new,
                            passwordChange2FACode // ✅ Pass 2FA code
                          );

                          if (res === "success") {
                            toast.success("Password updated successfully!");
                            setOpenPasswordModal(false);
                            setPasswordChange2FARequired(false);
                            setPasswordChange2FACode("");
                            setPasswords({ old: "", new: "", confirm: "" });
                          } else if (
                            typeof res === "string" &&
                            res !== "error"
                          ) {
                            toast.error(res);
                          }
                        } finally {
                          setIsUpdatingPassword(false);
                        }
                      }}
                      disabled={
                        isUpdatingPassword || passwordChange2FACode.length !== 6
                      }
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdatingPassword ? "Verifying..." : "Verify & Update"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2FA Modal */}
      <AnimatePresence>
        {open2FAModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <button
                onClick={() => {
                  setOpen2FAModal(false);
                  setQrCode(null);
                  setTwoFactorSecret(null);
                  setVerificationCode("");
                  setDisable2FAPassword("");
                  setShow2FAQRCode(false);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <FiX size={20} />
              </button>

              {twoFactorEnabled ? (
                //  Disable 2FA View
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <FiShield className="text-red-600 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Disable Two-Factor Authentication
                      </h2>
                      <p className="text-sm text-gray-500">
                        This will reduce your account security
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
                    <div className="flex gap-3">
                      <FiAlertCircle
                        className="text-yellow-600 mt-0.5 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <p className="text-sm font-semibold text-yellow-800">
                          Warning
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Disabling 2FA will make your account less secure.
                          You'll only need your password to log in.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your password to confirm
                    </label>
                    <div className="relative">
                      <input
                        type={showDisable2FAPassword ? "text" : "password"}
                        value={disable2FAPassword}
                        onChange={(e) => setDisable2FAPassword(e.target.value)}
                        placeholder="Your password"
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowDisable2FAPassword(!showDisable2FAPassword)
                        }
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition"
                      >
                        {showDisable2FAPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setOpen2FAModal(false);
                        setDisable2FAPassword("");
                      }}
                      className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDisable2FA}
                      disabled={isDisabling2FA || !disable2FAPassword}
                      className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 shadow-sm hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDisabling2FA ? "Disabling..." : "Disable 2FA"}
                    </button>
                  </div>
                </>
              ) : (
                // ✅ UPDATED: Smart Enable 2FA View
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <FiShield className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Enable Two-Factor Authentication
                      </h2>
                      <p className="text-sm text-gray-500">
                        {userData?.twoFactorSecret && !show2FAQRCode
                          ? "Verify using your existing authenticator app"
                          : "Add extra security to your account"}
                      </p>
                    </div>
                  </div>

                  {qrCode ? (
                    <>
                      {/* ✅ Show different UI based on whether it's re-enable or new setup */}
                      {userData?.twoFactorSecret && !show2FAQRCode ? (
                        // ✅ RE-ENABLE FLOW: Skip QR code, just verify
                        <>
                          <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                            <div className="flex gap-3">
                              <FiCheck
                                className="text-emerald-600 mt-0.5 flex-shrink-0"
                                size={20}
                              />
                              <div>
                                <p className="text-sm font-semibold text-emerald-800">
                                  Your Authenticator is Already Set Up
                                </p>
                                <p className="text-sm text-emerald-700 mt-1">
                                  No need to scan a new QR code. Just enter the
                                  6-digit code from your existing{" "}
                                  <strong>ViralMotion</strong> entry in your
                                  authenticator app.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Enter the 6-digit code from your authenticator
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={6}
                              value={verificationCode}
                              onChange={(e) =>
                                setVerificationCode(
                                  e.target.value.replace(/\D/g, "")
                                )
                              }
                              placeholder="000000"
                              autoFocus
                              className="w-full border-2 border-gray-300 rounded-xl px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                            <p className="text-xs text-gray-500 text-center mt-2">
                              Find the code under "ViralMotion" in your app
                            </p>
                          </div>

                          {/* ✅ Option to show QR code if they lost access */}
                          <div className="mb-6 text-center">
                            <button
                              type="button"
                              onClick={async () => {
                                if (
                                  !confirm(
                                    'This will generate a new QR code. You\'ll need to delete your old "ViralMotion" entry and scan the new one. Continue?'
                                  )
                                ) {
                                  return;
                                }

                                try {
                                  const token = localStorage.getItem("token");
                                  const response = await fetch(
                                    `${backendPrefix}/auth/2fa/reset`,
                                    {
                                      method: "POST",
                                      credentials: "include",
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                        "Content-Type": "application/json",
                                      },
                                    }
                                  );

                                  const data = await response.json();

                                  if (data.success) {
                                    setQrCode(data.qrCode);
                                    setTwoFactorSecret(data.secret);
                                    setShow2FAQRCode(true);
                                    toast.success(
                                      "New QR code generated. Delete your old entry and scan this one."
                                    );
                                  } else {
                                    toast.error(
                                      data.error || "Failed to reset 2FA"
                                    );
                                  }
                                } catch (error) {
                                  console.error("Reset 2FA error:", error);
                                  toast.error("Failed to reset 2FA");
                                }
                              }}
                              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium underline"
                            >
                              Lost access to your authenticator? Click to reset
                              and get a new QR code
                            </button>
                          </div>

                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => {
                                setOpen2FAModal(false);
                                setQrCode(null);
                                setTwoFactorSecret(null);
                                setVerificationCode("");
                                setShow2FAQRCode(false);
                              }}
                              className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleConfirm2FA}
                              disabled={
                                isEnabling2FA || verificationCode.length !== 6
                              }
                              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isEnabling2FA
                                ? "Verifying..."
                                : "Verify & Enable"}
                            </button>
                          </div>
                        </>
                      ) : (
                        // ✅ NEW SETUP FLOW: Show QR code
                        <>
                          {userData?.twoFactorSecret && show2FAQRCode && (
                            <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                              <div className="flex gap-3">
                                <FiAlertCircle
                                  className="text-yellow-600 mt-0.5 flex-shrink-0"
                                  size={20}
                                />
                                <div>
                                  <p className="text-sm font-semibold text-yellow-800">
                                    Resetting 2FA
                                  </p>
                                  <p className="text-sm text-yellow-700 mt-1">
                                    You'll need to delete your old "ViralMotion"
                                    entry from your authenticator app and scan
                                    this new QR code.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                1
                              </div>
                              <p className="text-sm font-semibold text-gray-700">
                                {userData?.twoFactorSecret && show2FAQRCode
                                  ? "Delete old entry and scan this new QR code"
                                  : "Scan this QR code"}
                              </p>
                            </div>
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 flex justify-center">
                              <img
                                src={qrCode}
                                alt="QR Code"
                                className="w-48 h-48"
                              />
                            </div>

                            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                              <p className="text-xs font-medium text-gray-500 mb-2">
                                Or enter this code manually:
                              </p>
                              <code className="text-sm font-mono text-gray-800 break-all select-all">
                                {twoFactorSecret}
                              </code>
                            </div>
                          </div>

                          <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                2
                              </div>
                              <p className="text-sm font-semibold text-gray-700">
                                Enter the 6-digit code
                              </p>
                            </div>
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={6}
                              value={verificationCode}
                              onChange={(e) =>
                                setVerificationCode(
                                  e.target.value.replace(/\D/g, "")
                                )
                              }
                              placeholder="000000"
                              className="w-full border-2 border-gray-300 rounded-xl px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                            <p className="text-xs text-gray-500 text-center mt-2">
                              Enter the code from your authenticator app
                            </p>
                          </div>

                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => {
                                setOpen2FAModal(false);
                                setQrCode(null);
                                setTwoFactorSecret(null);
                                setVerificationCode("");
                                setShow2FAQRCode(false);
                              }}
                              className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleConfirm2FA}
                              disabled={
                                isEnabling2FA || verificationCode.length !== 6
                              }
                              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isEnabling2FA
                                ? "Verifying..."
                                : "Verify & Enable"}
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
                      <p className="text-gray-600 font-medium">
                        Preparing 2FA setup...
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        This will only take a moment
                      </p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
