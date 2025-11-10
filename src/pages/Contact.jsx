import React, { useState } from "react";

export default function Contact({ user }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
const API_URL = "https://quickcart-bips.onrender.com";




  const [replyEmail, setReplyEmail] = useState("");
  const [replyName, setReplyName] = useState("");
  const [replyMsg, setReplyMsg] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyStatus, setReplyStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Message sent! We'll reply soon.");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus(data.error || "Failed. Try again.");
      }
    } catch (err) {
      setStatus("Network error.");
    }
  };

  const sendReply = async () => {
    if (!replyEmail || !replyMsg) return;

    setReplyLoading(true);
    setReplyStatus("");

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: replyName || "Admin",
          email: replyEmail,
          message: `ADMIN REPLY: ${replyMsg}`
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setReplyStatus("Reply sent successfully!");
        setReplyMsg("");
        setReplyEmail("");
        setReplyName("");
      } else {
        setReplyStatus("Failed to send reply.");
      }
    } catch (err) {
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

        {user && user.email === "hermelagetachew999@gmail.com" && (
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