import React, { useState } from "react";
import { forgotPassword, resetPassword } from "../api";

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); 
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const data = await forgotPassword(email);

      if (data.error) {
        setStatus(data.error);
      } else {
        setStatus(`✅ Reset code sent! Your code is: ${data.code}`);
        setStep(2); 
      }
    } catch {
      setStatus("⚠️ Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const data = await resetPassword({ email, code, newPassword });

      if (data.error) {
        setStatus(data.error);
      } else {
        setStatus("✅ Password reset successful!");
        setStep(1); 
        setEmail("");
        setCode("");
        setNewPassword("");
      }
    } catch {
      setStatus("⚠️ Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Forgot Password</h2>

        <form onSubmit={step === 1 ? handleSubmit : handleReset}>
          {step === 1 ? (
            <>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </form>

        {status && (
          <p className={`status ${status.includes("successful") ? "success" : "error"}`}>
            {status}
          </p>
        )}

        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
}
