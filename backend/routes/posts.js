const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { content, image_url } = req.body;

    const result = await pool.query(
      `INSERT INTO posts (user_id, content, image_url)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, content, image_url]
    );

    // Get user info
    const userResult = await pool.query(
      'SELECT name, username, avatar_url, name_color FROM users WHERE id = $1',
      [req.user.id]
    );

    const post = {
      ...result.rows[0],
      user: userResult.rows[0]
    };

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all posts (feed)
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name, u.username, u.avatar_url, u.name_color, u.is_premium
       FROM posts p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC
       LIMIT 50`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's posts
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT p.*, u.name, u.username, u.avatar_url, u.name_color, u.is_premium
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like post
router.post('/:postId/like', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const { emoji = '❤️' } = req.body;

    // Check if already liked
    const existingLike = await pool.query(
      'SELECT id FROM likes WHERE user_id = $1 AND post_id = $2',
      [req.user.id, postId]
    );

    if (existingLike.rows.length > 0) {
      // Unlike
      await pool.query(
        'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
        [req.user.id, postId]
      );

      await pool.query(
        'UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1',
        [postId]
      );

      return res.json({ liked: false });
    }

    // Like
    await pool.query(
      'INSERT INTO likes (user_id, post_id, emoji) VALUES ($1, $2, $3)',
      [req.user.id, postId, emoji]
    );

    await pool.query(
      'UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1',
      [postId]
    );

    res.json({ liked: true, emoji });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get post likes
router.get('/:postId/likes', auth, async (req, res) => {
  try {
    const { postId } = req.params;

    const result = await pool.query(
      `SELECT l.*, u.name, u.username, u.avatar_url
       FROM likes l
       JOIN users u ON l.user_id = u.id
       WHERE l.post_id = $1
       ORDER BY l.created_at DESC`,
      [postId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get likes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Comment on post
router.post('/:postId/comment', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const result = await pool.query(
      `INSERT INTO comments (user_id, post_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, postId, content]
    );

    // Update comment count
    await pool.query(
      'UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1',
      [postId]
    );

    // Get user info
    const userResult = await pool.query(
      'SELECT name, username, avatar_url, name_color FROM users WHERE id = $1',
      [req.user.id]
    );

    const comment = {
      ...result.rows[0],
      user: userResult.rows[0]
    };

    res.status(201).json(comment);
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get post comments
router.get('/:postId/comments', auth, async (req, res) => {
  try {
    const { postId } = req.params;

    const result = await pool.query(
      `SELECT c.*, u.name, u.username, u.avatar_url, u.name_color
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at ASC`,
      [postId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete post
router.delete('/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if user owns the post
    const post = await pool.query(
      'SELECT user_id FROM posts WHERE id = $1',
      [postId]
    );

    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);

    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
