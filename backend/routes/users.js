const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { auth, adminAuth } = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, phone, name, username, display_name, bio, avatar_url,
              is_premium, is_admin, name_color, balance,
              last_name_change, last_username_change, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { display_name, bio, avatar_url, name_color } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET display_name = COALESCE($1, display_name),
           bio = COALESCE($2, bio),
           avatar_url = COALESCE($3, avatar_url),
           name_color = COALESCE($4, name_color),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, phone, name, username, display_name, bio, avatar_url,
                 is_premium, is_admin, name_color, balance`,
      [display_name, bio, avatar_url, name_color, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Change name (every 7 days)
router.put('/change-name', auth, async (req, res) => {
  try {
    const { name } = req.body;

    // Check last change
    const userResult = await pool.query(
      'SELECT last_name_change FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = userResult.rows[0];

    if (user.last_name_change) {
      const daysSinceChange = Math.floor(
        (new Date() - new Date(user.last_name_change)) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceChange < 7) {
        return res.status(400).json({
          error: `You can change your name in ${7 - daysSinceChange} days`
        });
      }
    }

    const result = await pool.query(
      `UPDATE users
       SET name = $1, last_name_change = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, name, last_name_change`,
      [name, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Change name error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Change username (every 25 days)
router.put('/change-username', auth, async (req, res) => {
  try {
    const { username } = req.body;

    // Check if username exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 AND id != $2',
      [username, req.user.id]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check last change
    const userResult = await pool.query(
      'SELECT last_username_change FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = userResult.rows[0];

    if (user.last_username_change) {
      const daysSinceChange = Math.floor(
        (new Date() - new Date(user.last_username_change)) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceChange < 25) {
        return res.status(400).json({
          error: `You can change your username in ${25 - daysSinceChange} days`
        });
      }
    }

    const result = await pool.query(
      `UPDATE users
       SET username = $1, last_username_change = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, username, last_username_change`,
      [username, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Change username error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (for admin)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, phone, name, username, display_name, is_premium,
              is_admin, is_blocked, created_at
       FROM users ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Block/Unblock user (admin)
router.put('/block/:userId', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { is_blocked } = req.body;

    const result = await pool.query(
      `UPDATE users SET is_blocked = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, name, username, is_blocked`,
      [is_blocked, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Make user premium (admin)
router.put('/premium/:userId', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { is_premium } = req.body;

    const result = await pool.query(
      `UPDATE users SET is_premium = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, name, username, is_premium`,
      [is_premium, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Premium user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search users
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;

    const result = await pool.query(
      `SELECT id, name, username, display_name, avatar_url, is_premium, name_color
       FROM users
       WHERE name ILIKE $1 OR username ILIKE $1
       LIMIT 20`,
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
