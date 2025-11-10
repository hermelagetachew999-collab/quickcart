import React, { useState } from "react";

const API_URL = "https://quickcart-bips.onrender.com";

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = request code, 2 = reset password
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Step 1: Request reset code
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("✅ Reset code sent! Check server logs if email is unavailable.");
        setStep(2); // move to step 2 to enter code and new password
      } else {
        setStatus(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("⚠️ Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password using verification code
  const handleReset = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("✅ Password reset successful!");
        setStep(1); // go back to initial step or close modal
        setEmail("");
        setCode("");
        setNewPassword("");
      } else {
        setStatus(data.error || "Failed to reset password.");
      }
    } catch {
      setStatus("⚠️ Network error. Try again.");
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
