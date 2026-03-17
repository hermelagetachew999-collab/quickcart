import React, { useState } from "react";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { login, signup } from "../api";

export default function AuthModal({ isLogin, setIsLogin, setUser, onClose }) {
  console.log("AuthModal rendering. User is trying to", isLogin ? "Login" : "Signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = isLogin 
        ? await login({ email, password }) 
        : await signup({ name, email, password });

      if (data.error) {
        setError(data.error);
      } else {
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
      }
    } catch (err) {
      console.error("Auth Submission Error:", err);
      setError("Network error. Check your connection or API URL.");
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
            {!isLogin && <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            {isLogin && (
              <button type="button" className="link-btn small" onClick={() => setShowForgot(true)}>
                Forgot password?
              </button>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Login" : "Create Account"}
            </button>

            {error && <p className={`status ${error.includes("created") ? "success" : "error"}`}>{error}</p>}

            <button type="button" className="link-btn" onClick={() => { setIsLogin(!isLogin); setError(""); }}>
              {isLogin ? "Need an account? Signup" : "Have an account? Login"}
            </button>
          </form>

          <button className="close-btn" onClick={onClose}>×</button>
        </div>
      </div>

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </>
  );
}
