import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

// CORS configuration
// CORS configuration
app.use(cors({
  origin: [
    'https://quickcart-frontend-beqlams6v.vercel.app', // NEW frontend URL
    'https://quickcart-front-pb6cdlauc-hermela-getachews-projects-6c383e2f.vercel.app', // Keep old for reference
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// In-memory storage (replace with MongoDB later)
const users = [];
const products = [
  { id: 1, name: 'Wireless Headphones', price: 99.99, image: '/images/headphones.jpg', description: 'High-quality wireless headphones with noise cancellation' },
  { id: 2, name: 'Smart Watch', price: 199.99, image: '/images/smartwatch.jpg', description: 'Feature-rich smartwatch with health monitoring' },
  { id: 3, name: 'Laptop Backpack', price: 49.99, image: '/images/backpack.jpg', description: 'Durable laptop backpack with USB charging port' },
  { id: 4, name: 'Bluetooth Speaker', price: 79.99, image: '/images/speaker.jpg', description: 'Portable Bluetooth speaker with amazing sound quality' }
];

// ===== ROUTES =====

// Root route
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'QuickCart API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from QuickCart API! Server is working.' });
});

// Get all products
app.get('/api/products', (req, res) => {
  res.json({ success: true, products });
});

// User registration
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if user exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists with this email' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { 
      id: users.length + 1, 
      name, 
      email, 
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    users.push(user);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback-secret-123', { expiresIn: '7d' });
    
    res.json({ 
      success: true,
      token, 
      user: { 
        name: user.name, 
        email: user.email 
      },
      message: 'Account created successfully!'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  try {
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback-secret-123', { expiresIn: '7d' });
    
    res.json({ 
      success: true,
      token, 
      user: { 
        name: user.name, 
        email: user.email 
      },
      message: 'Login successful!'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Contact form
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Simulate email sending (in production, integrate with nodemailer)
  console.log('Contact form submission:', { name, email, message });
  
  res.json({ 
    success: true, 
    message: 'Thank you for your message! We will get back to you soon.' 
  });
});

// Export for Vercel
export default app;