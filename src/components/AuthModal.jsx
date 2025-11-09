import React, { useState } from "react";
import ForgotPasswordModal from "./ForgotPasswordModal";

export default function AuthModal({ isLogin, setIsLogin, setUser, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const API_URL = "https://quickcart-backend-btcl.onrender.com/api";



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/login" : "/api/register";
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

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>{isLogin ? "Login" : "Signup"}</h2>

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

            {/* 👇 “Forgot password?” link goes right here 👇 */}
            {isLogin && (
              <button
                type="button"
                className="link-btn small"
                onClick={() => setShowForgot(true)}
              >
                Forgot password?
              </button>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Login" : "Create Account"}
            </button>

            {error && (
              <p
                className={`status ${
                  error.includes("created") ? "success" : "error"
                }`}
              >
                {error}
              </p>
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

          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </>
  );
}
