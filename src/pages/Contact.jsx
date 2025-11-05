// src/pages/Contact.jsx
import React, { useState } from "react";

export default function Contact({ user }) {
  // === CONTACT FORM STATES ===
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  // === ADMIN REPLY STATES ===
  const [replyEmail, setReplyEmail] = useState("");
  const [replyName, setReplyName] = useState("");
  const [replyMsg, setReplyMsg] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyStatus, setReplyStatus] = useState("");

  // === SEND CONTACT MESSAGE ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("Message sent! We'll reply soon.");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("Failed. Try again.");
      }
    } catch (err) {
      setStatus("Network error. Is backend running?");
    }
  };

  // === ADMIN: SEND REPLY TO CUSTOMER ===
  const sendReply = async () => {
    if (!replyEmail || !replyMsg) return;

    setReplyLoading(true);
    setReplyStatus("");

    try {
      const res = await fetch("http://localhost:5000/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: replyEmail,
          customerName: replyName,
          replyMessage: replyMsg,
        }),
      });

      if (res.ok) {
        setReplyStatus("Reply sent successfully!");
        setReplyMsg("");
      } else {
        setReplyStatus("Failed to send reply.");
      }
    } catch (err) {
      setReplyStatus("Network error. Is backend running?");
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <section className="contact-page">
      <div className="contact-container">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you! Send us a message.</p>

        {/* === CONTACT FORM === */}
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              type="text"
              placeholder="Write your name here..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              id="email"
              type="email"
              placeholder="username@gmail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="6"
              placeholder="Type your message here..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {status === "Sending..." ? "Sending..." : "Send Message"}
          </button>
        </form>

        {status && (
          <p className={`status ${status.includes("sent") ? "success" : "error"}`}>
            {status}
          </p>
        )}

        {/* === ADMIN REPLY BOX (ONLY FOR YOU) === */}
        {user && user.email === "yourgmail@gmail.com" && (
          <div className="admin-reply-box">
            <h3>Admin: Reply to Customer</h3>

            <input
              type="email"
              placeholder="Customer Email (e.g. hermi@test.com)"
              value={replyEmail}
              onChange={(e) => setReplyEmail(e.target.value)}
            />

            <input
              type="text"
              placeholder="Customer Name (optional)"
              value={replyName}
              onChange={(e) => setReplyName(e.target.value)}
            />

            <textarea
              placeholder="Type your reply here..."
              rows="4"
              value={replyMsg}
              onChange={(e) => setReplyMsg(e.target.value)}
            />

            <button
              onClick={sendReply}
              disabled={!replyEmail || !replyMsg || replyLoading}
              className="reply-btn"
            >
              {replyLoading ? "Sending..." : "Send Reply"}
            </button>

            {replyStatus && (
              <p className={`status ${replyStatus.includes("sent") ? "success" : "error"}`}>
                {replyStatus}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}