import React from "react";
import { FiClock, FiX, FiRefreshCw } from "react-icons/fi";

interface SessionTimeoutWarningProps {
  timeLeft: number; // seconds
  onExtend: () => void;
  onDismiss: () => void;
}

export const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = ({
  timeLeft,
  onExtend,
  onDismiss,
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <FiX size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
            <FiClock className="text-white text-2xl animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Session Expiring Soon
            </h2>
            <p className="text-sm text-gray-500">Your admin session is about to end</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-center mb-2 text-gray-700">
            <strong>Time remaining:</strong>
          </p>
          <div className="text-center">
            <span className="text-5xl font-bold text-orange-600">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>
          <p className="text-center text-xs text-gray-600 mt-2">
            You will be logged out automatically when time expires
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onExtend}
            className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <FiRefreshCw className="w-5 h-5" />
            Extend Session (Re-authenticate)
          </button>
          <button
            onClick={onDismiss}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Dismiss Warning
          </button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-4">
          💡 Tip: Extending your session requires password confirmation for security
        </p>
      </div>
    </div>
  );
};