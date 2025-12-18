import React from "react";
import { motion } from "framer-motion";
import { FiMoon, FiSun, FiMonitor, FiInfo } from "react-icons/fi";
import toast from "react-hot-toast";

export const PreferencesTab: React.FC = () => {
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("light");

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme} mode!`);
    // TODO: Implement actual theme switching logic
  };

  return (
    <div className="space-y-6">
      {/* Coming Soon Banner */}
      <motion.div
        className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start gap-3">
          <FiInfo className="text-purple-600 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-semibold text-purple-900 mb-2">
              More Preferences Coming Soon!
            </p>
            <p className="text-sm text-purple-800 leading-relaxed">
              We're working on adding more customization options including
              default video settings, notification preferences, and language
              selection.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Theme Selector */}
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FiSun className="text-indigo-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-800">Theme</h3>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Choose how ViralMotion looks to you
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { value: "light", label: "Light", icon: <FiSun /> },
            { value: "dark", label: "Dark", icon: <FiMoon /> },
            { value: "system", label: "System", icon: <FiMonitor /> },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleThemeChange(option.value as any)}
              className={`p-4 rounded-xl border-2 transition-all ${
                theme === option.value
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`text-2xl ${
                    theme === option.value ? "text-indigo-600" : "text-gray-600"
                  }`}
                >
                  {option.icon}
                </div>
                <span
                  className={`text-sm font-semibold ${
                    theme === option.value ? "text-indigo-600" : "text-gray-700"
                  }`}
                >
                  {option.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Dark mode coming soon!
        </p>
      </motion.div>

      {/* Future Preferences Placeholder */}
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 opacity-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Additional Preferences (Coming Soon)
        </h3>

        <div className="space-y-3">
          {[
            "Default video format",
            "Default FPS (30/60)",
            "Auto-save interval",
            "Notification preferences",
            "Language selection",
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-sm text-gray-600">{item}</span>
              <span className="text-xs text-gray-400">Coming soon</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};