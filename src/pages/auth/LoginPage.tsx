import React, { useEffect, useState } from "react";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleButton } from "../../components/ui/buttons/GoogleButton";
import { login, verify2FA } from "../../services/authService";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ NEW: 2FA state
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const response = await login(email, password);

      if (response.requires2FA) {
        // ✅ NEW: Show 2FA input
        setRequires2FA(true);
        setTempToken(response.tempToken || "");
        toast.success("Please enter your 2FA code");
        return;
      }

      if (!response.success) {
        setError(response.error || "Login failed");
        return;
      }

      toast.success("Login successful!");
      setTimeout(() => navigate("/initializing-login"), 1000);
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Handle 2FA verification
  const onVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (twoFactorCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    try {
      setLoading(true);
      const response = await verify2FA(tempToken, twoFactorCode);

      if (!response.success) {
        setError(response.error || "Invalid 2FA code");
        return;
      }

      toast.success("Login successful!");
      setTimeout(() => navigate("/initializing-login"), 1000);
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "true") {
      toast.success("Your email has been verified! Please log in.");
    }
  }, []);

  // ✅ NEW: 2FA view
  if (requires2FA) {
    return (
      <div className="auth__bg">
        <main className="auth__container">
          <section className="auth__card" role="dialog" aria-label="Two-Factor Authentication">
            <header className="auth__header">
              <div className="logo">
                <span className="logo__dot" />
                <span className="logo__text">ViralMotion</span>
              </div>
              <h1 className="auth__title">
                Two-Factor Authentication 🔐
              </h1>
              <p className="auth__subtitle">
                Enter the 6-digit code from your authenticator app
              </p>
            </header>

            {error && (
              <div className="auth__error" role="alert">
                {error}
              </div>
            )}

            <form className="auth__form" onSubmit={onVerify2FA} noValidate>
              <div className="field">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="input"
                  style={{ textAlign: "center", letterSpacing: "0.5em", fontSize: "1.5rem" }}
                  autoFocus
                  required
                />
              </div>

              <button
                className="btn btn--primary"
                type="submit"
                disabled={loading || twoFactorCode.length !== 6}
              >
                {loading ? <span className="spinner" aria-hidden /> : "Verify"}
              </button>

              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => {
                  setRequires2FA(false);
                  setTwoFactorCode("");
                  setTempToken("");
                }}
              >
                Back to Login
              </button>
            </form>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="auth__bg">
      <main className="auth__container">
        <section className="auth__card" role="dialog" aria-label="Login">
          <header className="auth__header">
            <div className="logo">
              <span className="logo__dot" />
              <span className="logo__text">ViralMotion</span>
            </div>
            <h1 className="auth__title">
              Welcome Back <span className="wave">👋</span>
            </h1>
            <p className="auth__subtitle">
              Sign in to continue creating snappy, TikTok-style animations.
            </p>
          </header>

          {error && (
            <div className="auth__error" role="alert">
              {error}
            </div>
          )}

          <form className="auth__form" onSubmit={onSubmit} noValidate>
            <div className="field">
              <span className="field__icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" />
                  <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
              <input
                type="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                autoComplete="email"
                aria-label="Email address"
                required
              />
            </div>

            <div className="field">
              <span className="field__icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                autoComplete="current-password"
                aria-label="Password"
                required
              />
              <button
                type="button"
                className="field__suffix"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 3-3c0-.5-.1-1-.3-1.4" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                )}
              </button>
            </div>

            <div className="auth__row">
              <a className="link" href="/forgot-password">
                Forgot password?
              </a>
            </div>

            <button
              style={{ marginTop: "10px" }}
              className="btn btn--primary"
              type="submit"
              disabled={loading}
            >
              {loading ? <span className="spinner" aria-hidden /> : "Log In"}
            </button>

            <div className="flex items-center">
              <div className="flex-grow h-px bg-gray-600"></div>
              <span className="mx-2 text-gray-400 text-sm">or</span>
              <div className="flex-grow h-px bg-gray-600"></div>
            </div>

            <GoogleButton />

            <div className="divider"></div>
          </form>

          <footer className="auth__footer">
            <span>Don't have an account?</span>
            <a className="link" href="/signup">
              Sign Up
            </a>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;