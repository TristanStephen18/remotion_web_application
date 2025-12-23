import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";
import {
  FiHome,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
  FiSidebar,
  FiShield,
  FiSettings,
} from "react-icons/fi";

export type AdminSection = "dashboard" | "users" | "analytics" | "security";

interface AdminSidebarProps {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  active,
  onChange,
  isCollapsed,
  setIsCollapsed,
}) => {
  const navigate = useNavigate();
  const { admin, logout } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ NEW: Menu state

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    { id: "dashboard" as AdminSection, label: "Dashboard", icon: <FiHome /> },
    { id: "users" as AdminSection, label: "Users", icon: <FiUsers /> },
    { id: "security" as AdminSection, label: "Security", icon: <FiShield /> },
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
          <FiShield className="w-6 h-6 text-indigo-600" />
          <div className="flex flex-col leading-tight">
            <span className="text-lg text-gray-800 font-bold">Admin Portal</span>
            <span className="text-[10px] text-gray-500 font-medium tracking-wide">
              Analytics & Management
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
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center cursor-pointer"
                onClick={() => onChange("dashboard")}
                title="Dashboard"
              >
                <FiShield className="w-5 h-5 text-indigo-600" />
              </div>
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Expand sidebar"
              >
                <FiSidebar size={20} className="text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div
                className="flex flex-col gap-2 cursor-pointer"
                onClick={() => onChange("dashboard")}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <FiShield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg text-gray-800 font-bold">
                    Admin Portal
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium tracking-wide pl-[41px]">
                  Analytics & Management
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
                <span className={`text-xl ${isCollapsed ? "" : "mr-3"}`}>
                  {item.icon}
                </span>
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* ✅ Admin profile section with dropdown */}
        <div className="px-4 mt-4 border-t border-gray-100 pt-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex items-center gap-3 w-full hover:bg-gray-50 rounded-lg p-2 transition relative ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold flex-shrink-0">
              {admin?.name.charAt(0).toUpperCase() || "A"}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium text-gray-800">
                  {admin?.name || "Admin"}
                </span>
                <span className="text-xs text-gray-500">
                  {admin?.role || "Administrator"}
                </span>
              </div>
            )}
          </button>

          {/* ✅ Dropdown Menu */}
          {menuOpen && (
            <div
              className={`absolute bottom-20 bg-white shadow-lg rounded-lg border border-gray-100 w-48 text-left z-50 ${
                isCollapsed ? "left-24" : "left-4"
              }`}
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">
                  {admin?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500">{admin?.email || ""}</p>
              </div>
              {/* <button
                onClick={() => {
                  setMenuOpen(false);
                  // Future: Navigate to admin settings
                }}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <FiSettings className="w-4 h-4" />
                Settings
              </button> */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                Log Out
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
        className={`fixed top-0 left-0 h-full bg-white shadow-lg border-r border-gray-200 z-50 transform transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FiShield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg text-gray-800 font-bold">Admin Portal</span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                Analytics & Management
              </span>
            </div>
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
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* ✅ Mobile Admin Profile with Dropdown */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                {admin?.name.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800">
                  {admin?.name || "Admin"}
                </span>
                <span className="text-xs text-gray-500">
                  {admin?.email || ""}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setMobileOpen(false);
                // Future: Navigate to settings
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiSettings className="text-lg" />
              Settings
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <FiLogOut className="text-lg" />
              Log Out
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};