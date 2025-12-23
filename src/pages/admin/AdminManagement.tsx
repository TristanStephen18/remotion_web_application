import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";
import { useReAuth } from "../../contexts/ReAuthContext";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import type { AdminSection } from "../../components/admin/AdminSidebar";
import { backendPrefix } from "../../config";
import { FiUserPlus, FiShield } from "react-icons/fi";
import toast from "react-hot-toast";

export const AdminManagement: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const { token, isLoading } = useAdmin();
  const { requestReAuth } = useReAuth();
  const navigate = useNavigate();

  const handleSectionChange = (section: AdminSection) => {
    setActiveSection(section);
    if (section === "users") {
      navigate("/admin/users");
    } else if (section === "security") {
      navigate("/admin/security");
    } else if (section === "dashboard") {
      navigate("/admin/dashboard");
    }
  };

  const handleCreateAdmin = async () => {
    setCreating(true);

    try {
      // ✅ Request re-authentication
      const reAuthToken = await requestReAuth("Create New Admin User");
      
      if (!reAuthToken) {
        setCreating(false);
        return;
      }

      const response = await fetch(`${backendPrefix}/admin/auth/create-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Reauth-Token": reAuthToken,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`✅ Admin user created: ${data.admin.email}`, {
          duration: 5000,
        });
        setShowCreateModal(false);
        setFormData({ email: "", password: "", name: "" });
      } else {
        throw new Error(data.error || "Failed to create admin");
      }
    } catch (error: any) {
      console.error("Create admin error:", error);
      toast.error(`❌ ${error.message}`, { duration: 4000 });
    } finally {
      setCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        active={activeSection}
        onChange={handleSectionChange}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <main
        className={`px-8 py-4 min-h-screen transition-all duration-300 ${
          isCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create and manage admin accounts
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition"
          >
            <FiUserPlus className="w-5 h-5" />
            Create Admin User
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center">
            <FiShield className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Admin User Management
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Create additional admin accounts. All admins have equal access and
              can view all audit logs.
            </p>
          </div>
        </div>
      </main>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Create New Admin User
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Admin Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="admin@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Strong password (14+ characters)"
                  required
                  minLength={14}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be 14+ characters with uppercase, lowercase, numbers, and
                  special characters
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({ email: "", password: "", name: "" });
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAdmin}
                disabled={creating || !formData.email || !formData.password || !formData.name}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};