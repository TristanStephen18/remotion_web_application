import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiFolder,
  FiGrid,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiSettings,
  FiCreditCard,
  FiHelpCircle,
  FiSidebar,
} from "react-icons/fi";
import toast from "react-hot-toast";

import "../../../assets/Logo.css";
import { LuSparkles } from "react-icons/lu";
import { backendPrefix } from "../../../config";

export type DashboardSection =
  | "home"
  | "templates"
  | "files"
  | "renders"
  | "profile"
  | "tools"
  | "subscription"
  | "settings";

interface DashboardSidebarNavProps {
  userPfp: string | null;
  active: DashboardSection;
  onChange: (section: DashboardSection) => void;
  userInitials?: string;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const DashboardSidebarNav: React.FC<DashboardSidebarNavProps> = ({
  active,
  onChange,
  userPfp,
  userInitials = "U",
  isCollapsed,
  setIsCollapsed,
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check subscription status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${backendPrefix}/api/subscription/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        console.log("🔍 Dashboard subscription check:", data);

        // ✅ NEW: Only redirect if trial expired AND no subscription
        if (data.success) {
          if (!data.hasSubscription && data.trialExpired) {
            toast.error(
              "Your free trial has expired. Please subscribe to continue.",
              {
                duration: 5000,
                icon: "⏰",
              }
            );
            navigate("/subscription");
          }
          // If hasSubscription is true, user can stay (includes free trial)
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        // Don't redirect on error - fail open
      }
    };

    checkStatus();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const navItems: Array<{
    id: DashboardSection;
    label: string;
    icon: React.ReactNode;
  }> = [
    { id: "home", label: "Home", icon: <FiHome /> },
    { id: "files", label: "Projects", icon: <FiFolder /> },
    { id: "templates", label: "Templates", icon: <FiGrid /> },
    { id: "tools", label: "Tools", icon: <LuSparkles /> },
    // { id: "home", label: "ViralMotion AI", icon: null },
  ];

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-gray-600 hover:text-gray-900"
        >
          <FiMenu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <span className="logo__dot"></span>
          <div className="flex flex-col leading-tight">
            <span className="logo__text text-lg text-gray-800 font-bold">
              ViralMotion
            </span>
            <span className="text-[10px] text-gray-500 font-medium tracking-wide">
              Create. Edit. Inspire.
            </span>
          </div>
        </div>
        <div className="w-[22px]"></div>
      </div>

      {/* SIDEBAR (desktop) */}
      <aside
        className={`hidden md:flex fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex-col py-5 shadow-sm z-40 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Top section with logo and burger */}
        <div className={`${isCollapsed ? "px-3" : "px-5"}`}>
          {isCollapsed ? (
            // Collapsed state - just logo dot and burger below
            <div className="flex flex-col items-center gap-3">
              <span
                className="logo__dot cursor-pointer"
                onClick={() => onChange("home")}
                title="Home"
              ></span>
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Expand sidebar"
              >
                <FiSidebar size={20} className="text-gray-600" />
              </button>
            </div>
          ) : (
            // Expanded state - logo with text and burger on right
            <div className="flex items-start justify-between">
              <div
                className="flex flex-col gap-2 cursor-pointer"
                onClick={() => onChange("home")}
              >
                <div className="flex items-center gap-2">
                  <span className="logo__dot"></span>
                  <span className="logo__text text-lg text-gray-800">
                    ViralMotion
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium tracking-wide pl-[33px]">
                  Create. Edit. Inspire.
                </span>
              </div>
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 mt-1"
                title="Collapse sidebar"
              >
                <FiSidebar size={20} className="text-gray-600" />
              </button>
            </div>
          )}
          {/* Divider */}
          <div className="border-b border-gray-100 mt-4"></div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-1 space-y-1 px-4 mt-6 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isCollapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                {item.icon == null ? (
                  <div
                    className={`logo__dot-sm ${isCollapsed ? "" : "mr-3"}`}
                  ></div>
                ) : (
                  <span className={`text-xl ${isCollapsed ? "" : "mr-3"}`}>
                    {item.icon}
                  </span>
                )}
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Profile section */}
        <div className="px-4 mt-4 border-t border-gray-100 pt-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex items-center gap-3 w-full hover:bg-gray-50 rounded-lg p-2 transition relative ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            {userPfp ? (
              <img
                src={userPfp}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border border-gray-300 object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold flex-shrink-0">
                {userInitials}
              </div>
            )}
            {!isCollapsed && (
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium text-gray-800">
                  My Account
                </span>
                <span className="text-xs text-gray-500">Manage profile</span>
              </div>
            )}
          </button>
          {menuOpen && (
            <div
              className={`absolute bottom-20 bg-white shadow-lg rounded-lg border border-gray-100 w-48 text-left z-50 ${
                isCollapsed ? "left-24" : "left-4"
              }`}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onChange("profile");
                }}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg"
              >
                <FiUser /> View Profile
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onChange("settings"); // ✅ Navigate to settings
                }}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <FiSettings /> Settings
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onChange("subscription");
                }}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <FiCreditCard /> Subscription Plans
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  toast("Support page coming soon!", { icon: "💬" });
                }}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <FiHelpCircle /> Support
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg"
              >
                <FiLogOut /> Log Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg border-r border-gray-200 z-50 transform transition-transform duration-300 md:hidden
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} w-64`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="logo flex flex-col gap-[2px]">
            <div className="flex items-center gap-2">
              <span className="logo__dot"></span>
              <span className="logo__text text-lg text-gray-800">
                ViralMotion
              </span>
            </div>
            <span className="text-[10px] text-gray-500 font-medium tracking-wide pl-[33px]">
              Create. Edit. Inspire.
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-gray-500 hover:text-gray-900"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChange(item.id);
                  setMobileOpen(false);
                }}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon == null ? (
                  <div className="logo__dot-sm mr-3"></div>
                ) : (
                  <span className="text-xl mr-3">{item.icon}</span>
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => {
              onChange("profile");
              setMobileOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <FiUser className="text-xl" /> View Profile
          </button>
          <button
            onClick={() => {
              onChange("settings"); // ✅ Navigate to settings
              setMobileOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <FiSettings className="text-xl" /> Settings
          </button>
          <button
            onClick={() => {
              setMobileOpen(false);
              onChange("subscription");
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <FiCreditCard className="text-xl" /> Subscription Plans
          </button>
          <button
            onClick={() => {
              setMobileOpen(false);
              toast("Support page coming soon!", { icon: "💬" });
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <FiHelpCircle className="text-xl" /> Support
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
          >
            <FiLogOut className="text-xl" /> Log Out
          </button>
        </nav>
      </div>
    </>
  );
};
