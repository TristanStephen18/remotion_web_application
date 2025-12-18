import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  FiEdit2,
  FiCamera,
  FiTrendingUp,
  FiPieChart,
} from "react-icons/fi";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { templatesWithTheirIds } from "../../data/TemplateIds";
import { updateUsername } from "../../utils/UsernameUpdater";
import { useProfileFileUpload } from "../../hooks/uploads/ProfileUpload";
import toast from "react-hot-toast";

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
      renders: 0,
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
  userData: any;
  userDatasets: any[];
  projects: any[];
  userUploads: any[];
  renders: any[];
  fetchProfileDetails: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userData,
  userUploads,
  projects,
  renders,
  fetchProfileDetails,
}) => {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameValue, setUsernameValue] = useState(userData?.name || "");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

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

    Object.keys(templatesWithTheirIds).forEach((templateId) => {
      counts[templateId] = 0;
    });

    renders.forEach((r) => {
      if (!r.templateId) return;
      counts[r.templateId] = (counts[r.templateId] || 0) + 1;
    });

    return Object.entries(counts)
      .filter(([, usage]) => usage > 0)
      .map(([templateId, usage]) => ({
        templateId,
        template: templatesWithTheirIds[templateId] || "Unknown",
        usage,
      }))
      .sort((a, b) => b.usage - a.usage);
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

      return Object.entries(counts)
        .map(([day, renders]) => ({
          day,
          renders,
          date: new Date(day + ", 2024"),
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map(({ day, renders }) => ({ day, renders }));
    } else {
      const daysToShow =
        chartTimeRange === "7d" ? 7 : chartTimeRange === "30d" ? 30 : 90;

      const dateRange = generateDateRange(daysToShow);

      renders.forEach((render) => {
        if (!render.renderedAt) return;

        const renderDate = new Date(render.renderedAt);
        const renderDay = renderDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

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

    const counts: Record<string, number> = {};

    Object.keys(templatesWithTheirIds).forEach((templateId) => {
      counts[templateId] = 0;
    });

    filteredRenders.forEach((r) => {
      if (!r.templateId) return;
      counts[r.templateId] = (counts[r.templateId] || 0) + 1;
    });

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
  }, [userData]);

  useEffect(() => {
    if (profilePic && profilePic !== userData?.profilePicture) {
      fetchProfileDetails();
    }
  }, [profilePic]); // eslint-disable-line

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
      {/* Header */}
      <motion.div
        layout
        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-transparent to-pink-50 opacity-60" />
        <div className="relative flex flex-col items-center gap-3 z-10">
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
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300"
            />

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

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 mb-8"
        layout
      >
        {[
          {
            label: "Most Used Template",
            value: mostUsedTemplateAllTime,
            icon: <FiTrendingUp />,
            color: "text-indigo-600",
          },
          {
            label: "Created Templates",
            value: projects.length,
            icon: <FiPieChart />,
            color: "text-pink-500",
          },
          {
            label: "Uploads",
            value: userUploads.length,
            icon: <FiCamera />,
            color: "text-purple-500",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`text-4xl ${stat.color}`}>{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Analytics Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Analytics</h3>
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
                setChartTimeRange(range.value as "7d" | "30d" | "90d" | "all")
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div className="h-[250px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiTrendingUp className="text-gray-400 text-2xl" />
                </div>
                <p className="text-gray-600 font-medium">No renders yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Start creating videos to see your analytics
                </p>
              </div>
            </div>
          ) : (
            <>
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
                      {chartTimeRange === "all"
                        ? `You've rendered ${filteredRenderingData.reduce(
                            (sum, d) => sum + d.renders,
                            0
                          )} videos across ${
                            filteredRenderingData.length
                          } active days.`
                        : `You rendered ${filteredRenderingData.reduce(
                            (sum, d) => sum + d.renders,
                            0
                          )} videos in this period.`}
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
          <h3 className="font-semibold text-gray-800 mb-2">Template Usage</h3>
          <p className="text-sm text-gray-500 mb-4">Most used templates.</p>

          {filteredTemplatesUsageData.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiPieChart className="text-gray-400 text-2xl" />
                </div>
                <p className="text-gray-600 font-medium">No templates used</p>
                <p className="text-sm text-gray-500 mt-1">
                  Create your first video to see template statistics
                </p>
              </div>
            </div>
          ) : (
            <>
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
                  <Tooltip />
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
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};