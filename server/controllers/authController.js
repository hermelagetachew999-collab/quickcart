import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey12345';

// Helper function to generate 6-digit code
const generateResetCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.rows[0].id, email: user.rows[0].email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { name: user.rows[0].name, email: user.rows[0].email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const code = generateResetCode();
    const expiresAt = new Date(Date.now() + 15 * 60000); // 15 minutes from now

    await pool.query(
      'INSERT INTO password_resets (user_id, reset_code, expires_at) VALUES ($1, $2, $3)',
      [user.rows[0].id, code, expiresAt]
    );

    // Mock sending email
    console.log(`Password reset code for ${email}: ${code}`);
    res.json({ 
      message: 'Reset code sent!' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const verifyCode = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const reset = await pool.query(
      'SELECT * FROM password_resets WHERE user_id = $1 AND reset_code = $2 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [user.rows[0].id, code]
    );

    if (reset.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    res.json({ success: true, message: 'Code verified. You can now reset your password.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const reset = await pool.query(
      'SELECT * FROM password_resets WHERE user_id = $1 AND reset_code = $2 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [user.rows[0].id, code]
    );

    if (reset.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.rows[0].id]);
    await pool.query('DELETE FROM password_resets WHERE user_id = $1', [user.rows[0].id]);

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
