// src/components/AuthModal.jsx
import React, { useState } from "react";

export default function AuthModal({ isLogin, setIsLogin, setUser, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // FORGOT PASSWORD STATES
  const [showForgot, setShowForgot] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [sentCode, setSentCode] = useState(false);
  const [codeError, setCodeError] = useState("");

  // src/components/AuthModal.jsx
const API_URL = "https://quickcart-bips.onrender.com/api"; 


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const body = isLogin ? { email, password } : { name, email, password };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem("token", data.token);
          setUser(data.user);
          onClose();
        } else {
          setIsLogin(true);
          setError("Account created! Please login.");
          setName("");
          setPassword("");
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
        setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // === FORGOT PASSWORD: SEND CODE ===
  const handleForgotPassword = async () => {
    setCodeError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSentCode(true);
        setCodeError("Verification code sent to your email!");
      } else {
        setCodeError(data.error || "Email not found");
      }
    } catch (err) {
      setCodeError("Failed to send code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // === VERIFY CODE & RESET PASSWORD ===
  const handleResetPassword = async () => {
    setCodeError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verifyCode, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setCodeError("Password reset successful! Please login.");
        setShowForgot(false);
        setSentCode(false);
        setVerifyCode("");
        setNewPassword("");
        setIsLogin(true);
      } else {
        setCodeError(data.error || "Invalid code");
      }
    } catch (err) {
      setCodeError("Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{showForgot ? "Reset Password" : isLogin ? "Login" : "Signup"}</h2>

        {/* FORGOT PASSWORD FLOW */}
        {showForgot ? (
          <div className="forgot-form">
            <p>Enter your email to reset password</p>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {sentCode ? (
              <>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  maxLength="6"
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button onClick={handleResetPassword} disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </>
            ) : (
              <button onClick={handleForgotPassword} disabled={loading}>
                {loading ? "Sending..." : "Send Code"}
              </button>
            )}

            {codeError && <p className={`status ${codeError.includes("sent") || codeError.includes("successful") ? "success" : "error"}`}>{codeError}</p>}

            <button
              className="link-btn"
              onClick={() => {
                setShowForgot(false);
                setSentCode(false);
                setCodeError("");
              }}
            >
              Back to Login
            </button>
          </div>
        ) : (
          /* LOGIN / SIGNUP FORM */
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Login" : "Create Account"}
            </button>

            {error && <p className={`status ${error.includes("created") ? "success" : "error"}`}>{error}</p>}

            {/* FORGOT PASSWORD BUTTON */}
            {isLogin && (
              <button
                type="button"
                className="link-btn"
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </button>
            )}

            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >
              {isLogin ? "Need an account? Signup" : "Have an account? Login"}
            </button>
          </form>
        )}

        <button className="close-btn" onClick={onClose}>×</button>
      </div>
    </div>
  );
}