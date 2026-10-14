const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

// Follow user
router.post('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId == req.user.id) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    // Check if already following
    const existingFollow = await pool.query(
      'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
      [req.user.id, userId]
    );

    if (existingFollow.rows.length > 0) {
      // Unfollow
      await pool.query(
        'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
        [req.user.id, userId]
      );

      return res.json({ following: false });
    }

    // Follow
    await pool.query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
      [req.user.id, userId]
    );

    res.json({ following: true });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get followers
router.get('/:userId/followers', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT f.*, u.name, u.username, u.avatar_url, u.name_color, u.is_premium
       FROM follows f
       JOIN users u ON f.follower_id = u.id
       WHERE f.following_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get following
router.get('/:userId/following', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT f.*, u.name, u.username, u.avatar_url, u.name_color, u.is_premium
       FROM follows f
       JOIN users u ON f.following_id = u.id
       WHERE f.follower_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check if following
router.get('/check/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
      [req.user.id, userId]
    );

    res.json({ following: result.rows.length > 0 });
  } catch (error) {
    console.error('Check follow error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
