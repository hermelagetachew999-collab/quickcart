import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const app = express();

// === CORS SETUP ===
// Allow local dev URLs + production frontend URL
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://quickcart-gamma-green.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

// === MONGODB CONNECTION ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// === USER MODEL ===
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  resetCode: String,
  resetExpires: Number,
});
const User = mongoose.model("User", userSchema);

// === ORDER MODEL ===
const orderSchema = new mongoose.Schema({
  userId: String,
  userEmail: String,
  items: Array,
  total: Number,
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);

// === CONTACT ROUTE ===
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: "All fields required" });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: `"QuickCart Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Thank you for contacting QuickCart!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f9f4; border-radius: 10px;">
        <h3 style="color: #1abc9c;">Hi ${name},</h3>
        <p>Thank you for contacting <strong>QuickCart</strong>!</p>
        <p>We've received your message:</p>
        <p style="background: white; padding: 15px; border-left: 4px solid #1abc9c; margin: 15px 0;">
          ${message.replace(/\n/g, "<br>")}
        </p>
        <p>We will reply to you soon.</p>
        <p>Best regards,<br><strong>QuickCart Team</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to send" });
  }
});

// === SIGNUP ===
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { name, email } });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// === LOGIN ===
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { name: user.name, email } });
});

// === PLACE ORDER ===
app.post("/api/orders", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    const { items, total } = req.body;
    const order = await Order.create({
      userId: user._id,
      userEmail: user.email,
      items,
      total,
    });
    res.json({ success: true, order });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// === FORGOT PASSWORD ===
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  let normalizedEmail = email.toLowerCase().trim();

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const user = await User.findOne({ email: { $regex: `^${normalizedEmail}$`, $options: 'i' } });
    if (!user) return res.status(404).json({ error: "Email not found" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = code;
    user.resetExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: `"QuickCart Support" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "QuickCart Password Reset Code",
      text: `Your code: ${code} (expires in 10 minutes)`,
      html: `<p>Your code: <strong>${code}</strong> (expires in 10 minutes)</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to send code" });
  }
});

// === RESET PASSWORD ===
app.post("/api/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) return res.status(400).json({ error: "All fields required" });

  const user = await User.findOne({ email });
  if (!user || user.resetCode !== code || user.resetExpires < Date.now()) {
    return res.status(400).json({ error: "Invalid or expired code" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetCode = undefined;
  user.resetExpires = undefined;
  await user.save();

  res.json({ success: true });
});

// === TEST EMAIL ===
app.get("/test-email", async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: `"QuickCart Test" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "TEST EMAIL - WORKING!",
    text: "If you see this, email is 100% working!",
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Test email sent!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === START SERVER ===
const PORT = process.env.PORT || 5000;

// Only start listening locally (not on Vercel)
if (process.env.VERCEL) {
  console.log("Running on Vercel serverless environment");
} else {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;

