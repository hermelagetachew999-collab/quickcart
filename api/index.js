// ~/quickcart/server/index.js
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// ---------- Load .env ----------
dotenv.config();

// ---------- Express ----------
const app = express();
app.use(cors());
app.use(express.json());

// ---------- MongoDB ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

// ---------- Models ----------
import User from './models/User.js';
import Product from './models/Product.js';
import Cart from './models/Cart.js';

// ---------- Nodemailer ----------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ---------- TEST ROUTE ----------
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from QuickCart API!' });
});

// ---------- AUTH ROUTES ----------
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ---------- PRODUCT ROUTES ----------
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ---------- CART ROUTES ----------
app.get('/api/cart/:userId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    if (!cart) {
      cart = await Cart.create({ userId: req.params.userId, items: [] });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/api/cart/add', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existing = cart.items.find((i) => i.productId.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    await cart.populate('items.productId');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/api/cart/remove', async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();
    await cart.populate('items.productId');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ---------- EMAIL ROUTE (example) ----------
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Contact from ${name}`,
    text: message,
  };
  try {
    await transporter.sendMail(mailOptions);
    res.json({ msg: 'Email sent' });
  } catch (err) {
    res.status(500).json({ msg: 'Email error' });
  }
});

// ---------- EXPORT FOR VERCEL ----------
export const handler = serverless(app);