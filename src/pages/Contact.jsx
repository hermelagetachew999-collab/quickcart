import React, { useState } from "react";
import { contact } from "../api";

export default function Contact({ user }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [replyEmail, setReplyEmail] = useState("");
  const [replyName, setReplyName] = useState("");
  const [replyMsg, setReplyMsg] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyStatus, setReplyStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    const res = await contact(form);
    if (res.success) {
      setStatus("Message sent! We'll reply soon.");
      setForm({ name: "", email: "", message: "" });
    } else {
      setStatus(res.error || "Failed. Try again.");
    }
  };

  const sendReply = async () => {
    if (!replyEmail || !replyMsg) return;
    setReplyLoading(true);
    setReplyStatus("");

    try {
      const res = await contact({
        name: replyName || "Admin",
        email: replyEmail,
        message: `ADMIN REPLY: ${replyMsg}`,
      });

      if (res.success) {
        setReplyStatus("Reply sent successfully!");
        setReplyMsg("");
        setReplyEmail("");
        setReplyName("");
      } else {
        setReplyStatus(res.error || "Failed to send reply.");
      }
    } catch {
      setReplyStatus("Network error.");
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <section className="contact-page">
      <div className="contact-container">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you! Send us a message.</p>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              placeholder="Write your name here..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Your Email</label>
            <input
              type="email"
              placeholder="username@gmail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
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

        {user?.email === "hermelagetachew999@gmail.com" && (
          <div className="admin-reply-box">
            <h3>Admin: Reply to Customer</h3>
            <input
              type="email"
              placeholder="Customer Email"
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
              rows="4"
              placeholder="Type your reply here..."
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
