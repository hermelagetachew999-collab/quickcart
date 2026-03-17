import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { pool } from './db.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey12345';

// === ROUTES ===
app.use('/api', authRoutes);

// === PRODUCTS === (Mocked)
app.get('/api/products', (req, res) => {
  // This is kept strictly if frontend requests it locally, but current app uses dummyjson mostly
  res.json([]);
});

// === ORDERS ===
// Simple middleware to extract user from token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/api/orders', authMiddleware, async (req, res) => {
  const { items, total } = req.body;
  try {
    const newOrder = await pool.query(
      'INSERT INTO orders (user_id, items, total) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, JSON.stringify(items), total]
    );
    res.json({ success: true, order: newOrder.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
