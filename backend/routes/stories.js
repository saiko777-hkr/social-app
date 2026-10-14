const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

// Create story
router.post('/', auth, async (req, res) => {
  try {
    const { image_url, caption, privacy = 'friends', custom_viewers = [] } = req.body;

    // Story expires in 24 hours
    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + 24);

    const result = await pool.query(
      `INSERT INTO stories (user_id, image_url, caption, privacy, expires_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, image_url, caption, privacy, expires_at]
    );

    const story = result.rows[0];

    // Add custom viewers if privacy is custom
    if (privacy === 'custom' && custom_viewers.length > 0) {
      for (const viewerId of custom_viewers) {
        await pool.query(
          'INSERT INTO story_privacy (story_id, user_id) VALUES ($1, $2)',
          [story.id, viewerId]
        );
      }
    }

    // Get user info
    const userResult = await pool.query(
      'SELECT name, username, avatar_url FROM users WHERE id = $1',
      [req.user.id]
    );

    res.status(201).json({
      ...story,
      user: userResult.rows[0]
    });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get stories (feed)
router.get('/', auth, async (req, res) => {
  try {
    // Get all active stories (not expired)
    const result = await pool.query(
      `SELECT s.*, u.name, u.username, u.avatar_url
       FROM stories s
       JOIN users u ON s.user_id = u.id
       WHERE s.expires_at > CURRENT_TIMESTAMP
       ORDER BY s.created_at DESC`
    );

    // Filter based on privacy
    const filteredStories = [];

    for (const story of result.rows) {
      let canView = false;

      if (story.privacy === 'public') {
        canView = true;
      } else if (story.privacy === 'friends') {
        // Check if following
        const followCheck = await pool.query(
          'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
          [req.user.id, story.user_id]
        );
        canView = followCheck.rows.length > 0 || story.user_id === req.user.id;
      } else if (story.privacy === 'custom') {
        const customCheck = await pool.query(
          'SELECT id FROM story_privacy WHERE story_id = $1 AND user_id = $2',
          [story.id, req.user.id]
        );
        canView = customCheck.rows.length > 0 || story.user_id === req.user.id;
      }

      if (canView) {
        filteredStories.push(story);
      }
    }

    res.json(filteredStories);
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's stories
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT s.*, u.name, u.username, u.avatar_url
       FROM stories s
       JOIN users u ON s.user_id = u.id
       WHERE s.user_id = $1 AND s.expires_at > CURRENT_TIMESTAMP
       ORDER BY s.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get user stories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// View story
router.post('/:storyId/view', auth, async (req, res) => {
  try {
    const { storyId } = req.params;

    // Check if already viewed
    const existingView = await pool.query(
      'SELECT id FROM story_viewers WHERE story_id = $1 AND user_id = $2',
      [storyId, req.user.id]
    );

    if (existingView.rows.length === 0) {
      await pool.query(
        'INSERT INTO story_viewers (story_id, user_id) VALUES ($1, $2)',
        [storyId, req.user.id]
      );
    }

    res.json({ message: 'Story viewed' });
  } catch (error) {
    console.error('View story error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get story viewers
router.get('/:storyId/viewers', auth, async (req, res) => {
  try {
    const { storyId } = req.params;

    // Check if user owns the story
    const story = await pool.query(
      'SELECT user_id FROM stories WHERE id = $1',
      [storyId]
    );

    if (story.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (story.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await pool.query(
      `SELECT sv.*, u.name, u.username, u.avatar_url
       FROM story_viewers sv
       JOIN users u ON sv.user_id = u.id
       WHERE sv.story_id = $1
       ORDER BY sv.viewed_at DESC`,
      [storyId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get viewers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete story
router.delete('/:storyId', auth, async (req, res) => {
  try {
    const { storyId } = req.params;

    // Check if user owns the story
    const story = await pool.query(
      'SELECT user_id FROM stories WHERE id = $1',
      [storyId]
    );

    if (story.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (story.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await pool.query('DELETE FROM stories WHERE id = $1', [storyId]);

    res.json({ message: 'Story deleted' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
