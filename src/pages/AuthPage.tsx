import { useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../state/AuthContext";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register" | "forgot" | "reset">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetExpiresAt, setResetExpiresAt] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function isStrongPassword(value: string) {
    return value.length >= 6 && /[A-Za-z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setForgotSuccess("");
    setResetSuccess("");
    try {
      if (mode === "login") {
        await login(email, password);
      } else if (mode === "register") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (!isStrongPassword(password)) {
          throw new Error("Password must have at least 6 characters, one letter, one number, and one special character");
        }
        await register(name, email, password);
      } else if (mode === "forgot") {
        const data = await api("/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email }),
        });
        if (data?.resetToken) {
          setResetToken(data.resetToken);
          setResetExpiresAt(data.expiresAt || "");
          setForgotSuccess("Reset code generated successfully. Use it below to reset your password.");
        } else {
          setForgotSuccess("If the email exists, a reset code has been generated.");
        }
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (!isStrongPassword(password)) {
          throw new Error("Password must have at least 6 characters, one letter, one number, and one special character");
        }
        await api("/auth/reset-password", {
          method: "POST",
          body: JSON.stringify({ token: resetToken, password }),
        });
        setResetSuccess("Password reset successful. Please sign in.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
        setShowResetPassword(false);
        setShowResetConfirmPassword(false);
      }
    } catch (err: any) {
      setError(err.message || "Auth failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-clean">
        <div className="auth-brand">
          <span className="auth-brand-icon" aria-hidden="true"></span>
          <h1>
            <span>Shule</span>
            <span className="auth-brand-accent">Track</span>
          </h1>
        </div>

        <h2 className="auth-title">
          {mode === "login"
            ? "Welcome back"
            : mode === "register"
              ? "Create account"
              : mode === "forgot"
                ? "Forgot password"
                : "Reset password"}
        </h2>
        <p className="auth-subtitle">
          {mode === "login"
            ? "Sign in to manage your classes"
            : mode === "register"
              ? "Register to start managing your classes"
              : mode === "forgot"
                ? "Enter your email to generate a reset code"
                : "Enter reset code and your new password"}
        </p>

        <form className="auth-form" onSubmit={onSubmit}>
          {mode === "register" && (
            <label>
              Full Name
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Teacher Ian" />
            </label>
          )}
          {mode !== "reset" && (
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>
          )}
          {(mode === "login" || mode === "register" || mode === "reset") && (
            <label>
              Password
              <div className="password-input-wrap">
                <input
                  type={
                    mode === "login"
                      ? showLoginPassword
                        ? "text"
                        : "password"
                      : mode === "register"
                        ? showRegisterPassword
                          ? "text"
                          : "password"
                        : showResetPassword
                          ? "text"
                          : "password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                  placeholder="********"
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={
                    mode === "login"
                      ? showLoginPassword
                        ? "Hide password"
                        : "Show password"
                      : mode === "register"
                        ? showRegisterPassword
                          ? "Hide password"
                          : "Show password"
                        : showResetPassword
                          ? "Hide password"
                          : "Show password"
                  }
                  onClick={() => {
                    if (mode === "login") setShowLoginPassword((v) => !v);
                    else if (mode === "register") setShowRegisterPassword((v) => !v);
                    else setShowResetPassword((v) => !v);
                  }}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </button>
              </div>
            </label>
          )}
          {(mode === "register" || mode === "reset") && (
            <label>
              Confirm Password
              <div className="password-input-wrap">
                <input
                  type={
                    mode === "register"
                      ? showRegisterConfirmPassword
                        ? "text"
                        : "password"
                      : showResetConfirmPassword
                        ? "text"
                        : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                  placeholder="********"
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={
                    mode === "register"
                      ? showRegisterConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                      : showResetConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                  }
                  onClick={() =>
                    mode === "register"
                      ? setShowRegisterConfirmPassword((v) => !v)
                      : setShowResetConfirmPassword((v) => !v)
                  }
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </button>
              </div>
            </label>
          )}
          {mode === "reset" && (
            <label>
              Reset Code
              <input value={resetToken} onChange={(e) => setResetToken(e.target.value)} required />
            </label>
          )}
          {(mode === "register" || mode === "reset") && (
            <p className="muted auth-password-hint">
              Use at least 6 characters with one letter, one number, and one special character.
            </p>
          )}
          {forgotSuccess && (
            <div className="auth-reset-result">
              <p className="auth-reset-success">{forgotSuccess}</p>
              {resetToken && (
                <>
                  <p className="auth-reset-token-label">Reset Code</p>
                  <code className="auth-reset-token">{resetToken}</code>
                  {resetExpiresAt && (
                    <p className="muted auth-reset-expire">
                      Expires: {new Date(resetExpiresAt).toLocaleString()}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
          {resetSuccess && <p className="auth-reset-success">{resetSuccess}</p>}
          {error && <p className="error">{error}</p>}
          <button className="btn auth-submit" type="submit" disabled={submitting}>
            {submitting
              ? "Please wait..."
              : mode === "login"
                ? "Sign In"
                : mode === "register"
                  ? "Create Account"
                  : mode === "forgot"
                    ? "Generate Reset Code"
                    : "Reset Password"}
          </button>
          {mode === "login" && (
            <button
              type="button"
              className="btn btn-ghost auth-forgot-inline"
              onClick={() => {
                setMode("forgot");
                setError("");
                setPassword("");
              }}
            >
              Forgot password?
            </button>
          )}
        </form>
        <div className="auth-switch-stack">
          {mode === "login" && (
            <button
              className="btn btn-ghost auth-switch"
              onClick={() => {
                setMode("register");
                setError("");
                setPassword("");
                setConfirmPassword("");
              }}
            >
              Don't have an account? Register
            </button>
          )}
          {mode === "register" && (
            <button
              className="btn btn-ghost auth-switch"
              onClick={() => {
                setMode("login");
                setError("");
                setPassword("");
                setConfirmPassword("");
              }}
            >
              Already have an account? Log in
            </button>
          )}
          {mode === "forgot" && (
            <>
              <button
                className="btn btn-ghost auth-switch"
                onClick={() => {
                  setMode("reset");
                  setError("");
                }}
              >
                I have a reset code
              </button>
              <button
                className="btn btn-ghost auth-switch"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setForgotSuccess("");
                }}
              >
                Back to login
              </button>
            </>
          )}
          {mode === "reset" && (
            <button
              className="btn btn-ghost auth-switch"
              onClick={() => {
                setMode("login");
                setError("");
                setPassword("");
                setConfirmPassword("");
              }}
            >
              Back to login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
