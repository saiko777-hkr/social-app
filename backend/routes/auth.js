const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Register
router.post('/register', async (req, res) => {
  try {
    const { phone, password, name, username } = req.body;

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE phone = $1 OR username = $2',
      [phone, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Phone or username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin
    const isAdmin = phone === process.env.ADMIN_PHONE;

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (phone, password, name, username, is_admin)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, phone, name, username, is_admin, is_premium, created_at`,
      [phone, hashedPassword, name, username, isAdmin]
    );

    const user = result.rows[0];

    // Generate token
    const token = jwt.sign(
      { id: user.id, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        username: user.username,
        is_admin: user.is_admin,
        is_premium: user.is_premium,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Check if user exists
    const result = await pool.query(
      'SELECT * FROM users WHERE phone = $1',
      [phone]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check if blocked
    if (user.is_blocked) {
      return res.status(403).json({ error: 'Account is blocked' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        username: user.username,
        display_name: user.display_name,
        bio: user.bio,
        avatar_url: user.avatar_url,
        is_premium: user.is_premium,
        is_admin: user.is_admin,
        name_color: user.name_color,
        balance: user.balance,
        last_name_change: user.last_name_change,
        last_username_change: user.last_username_change
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
