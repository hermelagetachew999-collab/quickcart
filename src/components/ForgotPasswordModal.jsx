import React, { useState } from "react";
const API_URL = "https://quickcart-bips.onrender.com";

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

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
      setStatus(res.ok ? "✅ Reset link sent to your email." : data.error || "Something went wrong.");
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
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          {status && <p className="status">{status}</p>}
        </form>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
    </div>
  );
}
