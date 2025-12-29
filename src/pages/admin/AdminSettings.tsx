import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import type { AdminSection } from "../../components/admin/AdminSidebar";
import { FiSettings, FiShield, FiUser } from "react-icons/fi";
import { SecurityTab } from "../../components/admin/settings/SecurityTab";
import { AccountTab } from "../../components/admin/settings/AccountTab";

export const AdminSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>("settings");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();

  const handleSectionChange = (section: AdminSection) => {
    setActiveSection(section);
    if (section === "dashboard") {
      navigate("/admin/dashboard");
    } else if (section === "users") {
      navigate("/admin/users");
    } else if (section === "security") {
      navigate("/admin/security");
    }
  };

  const tabs = [
    {
      name: "Account",
      icon: <FiUser />,
      component: <AccountTab />,
    },
    {
      name: "Security",
      icon: <FiShield />,
      component: <SecurityTab />,
    },
  ];

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
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-transparent to-purple-50 opacity-60" />
          <div className="relative z-10">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              {/* ✅ Responsive icon size */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <FiSettings className="text-white text-xl sm:text-2xl" />
              </div>
              <div className="min-w-0 flex-1">
                {/* ✅ Responsive text sizes */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 truncate">
                  Admin Settings
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1 line-clamp-2">
                  Manage your admin account security and preferences
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ RESPONSIVE Tabs with horizontal scroll */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-sm border border-gray-100 mb-4 sm:mb-6">
          {/* ✅ Scrollable tab container on mobile */}
          <div className="overflow-x-auto -mx-1.5 sm:mx-0">
            <div className="flex gap-1.5 sm:gap-2 px-1.5 sm:px-0 min-w-max sm:min-w-0">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTab(index)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                    selectedTab === index
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-base sm:text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ✅ Tab Content */}
        <div>{tabs[selectedTab].component}</div>
      </main>
    </div>
  );
};