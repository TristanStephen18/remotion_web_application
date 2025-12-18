import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiX,
  FiShield,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { updatePassword } from "../../../utils/PasswordUpdater";
import { backendPrefix } from "../../../config";

interface SecurityTabProps {
  userData: any;
  fetchProfileDetails: () => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  userData,
  fetchProfileDetails,
}) => {
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
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
  const [passwordChange2FARequired, setPasswordChange2FARequired] = useState(false);
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

  useEffect(() => {
    if (userData?.twoFactorEnabled !== undefined) {
      setTwoFactorEnabled(userData.twoFactorEnabled);
    }
  }, [userData]);

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

        const hasExistingSecret =
          userData?.twoFactorSecret && data.secret === userData.twoFactorSecret;

        if (hasExistingSecret) {
          setShow2FAQRCode(false);
          toast.success("Enter the code from your existing authenticator app entry");
        } else {
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

  return (
    <div className="space-y-6">
      {/* Security Score */}
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Security Score</p>
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
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#d1fae5"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset={twoFactorEnabled ? "37.68" : "88.92"}
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
          </div>
        </div>
      </motion.div>

      {/* Password Card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setOpenPasswordModal(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-100 border-2 border-gray-200 rounded-xl flex items-center justify-center">
              <FiLock className="text-gray-600 text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Password</h4>
              <p className="text-sm text-gray-500">
                Change your account password
              </p>
              {userData?.passwordLastChanged && (
                <p className="text-xs text-gray-400 mt-1">
                  Last changed:{" "}
                  {new Date(userData.passwordLastChanged).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <button className="px-5 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium border border-gray-300 transition">
            Change
          </button>
        </div>
      </motion.div>

      {/* 2FA Card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`bg-white rounded-2xl shadow-sm border-2 p-6 hover:shadow-md transition-all cursor-pointer ${
          twoFactorEnabled
            ? "border-emerald-300"
            : "border-gray-200"
        }`}
        onClick={() => {
          if (twoFactorEnabled) {
            setOpen2FAModal(true);
          } else {
            handleEnable2FA();
          }
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                  twoFactorEnabled
                    ? "bg-emerald-50 ring-2 ring-emerald-200"
                    : "bg-gray-100 border-2 border-gray-200"
                }`}
              >
                <FiShield
                  className={`text-xl ${
                    twoFactorEnabled ? "text-emerald-600" : "text-gray-500"
                  }`}
                />
              </div>
              {twoFactorEnabled && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <FiCheck className="text-white text-xs" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-800">
                  Two-Factor Authentication
                </h4>
                {twoFactorEnabled && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full ring-1 ring-emerald-200">
                    <FiCheck size={12} />
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {twoFactorEnabled
                  ? "Your account is protected with 2FA"
                  : "Add an extra layer of security"}
              </p>
            </div>
          </div>
          <button
            disabled={isEnabling2FA}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 ${
              twoFactorEnabled
                ? "bg-white text-red-600 border-2 border-red-300 hover:bg-red-50"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isEnabling2FA
              ? "Loading..."
              : twoFactorEnabled
              ? "Disable"
              : "Enable"}
          </button>
        </div>
      </motion.div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {openPasswordModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setOpenPasswordModal(false);
              setPasswordChange2FARequired(false);
              setPasswordChange2FACode("");
              setPasswords({ old: "", new: "", confirm: "" });
            }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
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
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition disabled:opacity-50"
                    >
                      {isUpdatingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex gap-3">
                      <FiShield className="text-blue-600 mt-0.5" size={20} />
                      <div>
                        <p className="text-sm font-semibold text-blue-800">
                          Two-Factor Authentication Required
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          Enter the 6-digit code from your authenticator app
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
                        setPasswordChange2FACode(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="000000"
                      autoFocus
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
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
                            passwordChange2FACode
                          );

                          if (res === "success") {
                            toast.success("Password updated successfully!");
                            setOpenPasswordModal(false);
                            setPasswordChange2FARequired(false);
                            setPasswordChange2FACode("");
                            setPasswords({ old: "", new: "", confirm: "" });
                          }
                        } finally {
                          setIsUpdatingPassword(false);
                        }
                      }}
                      disabled={
                        isUpdatingPassword || passwordChange2FACode.length !== 6
                      }
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition disabled:opacity-50"
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
            onClick={() => {
              setOpen2FAModal(false);
              setQrCode(null);
              setTwoFactorSecret(null);
              setVerificationCode("");
              setDisable2FAPassword("");
              setShow2FAQRCode(false);
            }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
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
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10"
              >
                <FiX size={20} />
              </button>

              {twoFactorEnabled ? (
                // Disable 2FA View
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
                      <FiAlertCircle className="text-yellow-600 mt-0.5" size={20} />
                      <div>
                        <p className="text-sm font-semibold text-yellow-800">
                          Warning
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Disabling 2FA will make your account less secure.
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
                        onClick={() => setShowDisable2FAPassword(!showDisable2FAPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition"
                      >
                        {showDisable2FAPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
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
                      className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 shadow-sm transition disabled:opacity-50"
                    >
                      {isDisabling2FA ? "Disabling..." : "Disable 2FA"}
                    </button>
                  </div>
                </>
              ) : (
                // Enable 2FA View
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
                      {userData?.twoFactorSecret && !show2FAQRCode ? (
                        // Re-enable flow
                        <>
                          <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                            <div className="flex gap-3">
                              <FiCheck className="text-emerald-600 mt-0.5" size={20} />
                              <div>
                                <p className="text-sm font-semibold text-emerald-800">
                                  Your Authenticator is Already Set Up
                                </p>
                                <p className="text-sm text-emerald-700 mt-1">
                                  Just enter the code from your existing authenticator app.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Enter the 6-digit code
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={6}
                              value={verificationCode}
                              onChange={(e) =>
                                setVerificationCode(e.target.value.replace(/\D/g, ""))
                              }
                              placeholder="000000"
                              autoFocus
                              className="w-full border-2 border-gray-300 rounded-xl px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                          </div>

                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => {
                                setOpen2FAModal(false);
                                setQrCode(null);
                                setVerificationCode("");
                              }}
                              className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleConfirm2FA}
                              disabled={isEnabling2FA || verificationCode.length !== 6}
                              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition disabled:opacity-50"
                            >
                              {isEnabling2FA ? "Verifying..." : "Verify & Enable"}
                            </button>
                          </div>
                        </>
                      ) : (
                        // New setup flow
                        <>
                          <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                1
                              </div>
                              <p className="text-sm font-semibold text-gray-700">
                                Scan this QR code
                              </p>
                            </div>
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 flex justify-center">
                              <img src={qrCode} alt="QR Code" className="w-48 h-48" />
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
                                setVerificationCode(e.target.value.replace(/\D/g, ""))
                              }
                              placeholder="000000"
                              className="w-full border-2 border-gray-300 rounded-xl px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                          </div>

                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => {
                                setOpen2FAModal(false);
                                setQrCode(null);
                                setVerificationCode("");
                              }}
                              className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleConfirm2FA}
                              disabled={isEnabling2FA || verificationCode.length !== 6}
                              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition disabled:opacity-50"
                            >
                              {isEnabling2FA ? "Verifying..." : "Verify & Enable"}
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
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};