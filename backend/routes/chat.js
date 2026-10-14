const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

// Send private message
router.post('/private', auth, async (req, res) => {
  try {
    const { receiver_id, content, amount_sent = 0 } = req.body;

    // Check if receiver exists
    const receiver = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [receiver_id]
    );

    if (receiver.rows.length === 0) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    // If sending money, check balance
    if (amount_sent > 0) {
      const senderBalance = await pool.query(
        'SELECT balance FROM users WHERE id = $1',
        [req.user.id]
      );

      if (senderBalance.rows[0].balance < amount_sent) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      // Deduct from sender
      await pool.query(
        'UPDATE users SET balance = balance - $1 WHERE id = $2',
        [amount_sent, req.user.id]
      );

      // Add to receiver
      await pool.query(
        'UPDATE users SET balance = balance + $1 WHERE id = $2',
        [amount_sent, receiver_id]
      );
    }

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content, amount_sent)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, receiver_id, content, amount_sent]
    );

    // Get sender info
    const senderResult = await pool.query(
      'SELECT name, username, avatar_url FROM users WHERE id = $1',
      [req.user.id]
    );

    const message = {
      ...result.rows[0],
      sender: senderResult.rows[0]
    };

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get private messages with a user
router.get('/private/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT m.*,
              u1.name as sender_name, u1.username as sender_username, u1.avatar_url as sender_avatar,
              u2.name as receiver_name, u2.username as receiver_username, u2.avatar_url as receiver_avatar
       FROM messages m
       JOIN users u1 ON m.sender_id = u1.id
       JOIN users u2 ON m.receiver_id = u2.id
       WHERE (m.sender_id = $1 AND m.receiver_id = $2)
          OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY m.created_at ASC`,
      [req.user.id, userId]
    );

    // Mark messages as read
    await pool.query(
      `UPDATE messages SET is_read = TRUE
       WHERE receiver_id = $1 AND sender_id = $2 AND is_read = FALSE`,
      [req.user.id, userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT
         CASE
           WHEN m.sender_id = $1 THEN m.receiver_id
           ELSE m.sender_id
         END as user_id,
         u.name, u.username, u.avatar_url,
         MAX(m.created_at) as last_message_time
       FROM messages m
       JOIN users u ON
         (m.sender_id = $1 AND m.receiver_id = u.id) OR
         (m.receiver_id = $1 AND m.sender_id = u.id)
       WHERE m.sender_id = $1 OR m.receiver_id = $1
       GROUP BY user_id, u.name, u.username, u.avatar_url
       ORDER BY last_message_time DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send group message
router.post('/group', auth, async (req, res) => {
  try {
    const { content } = req.body;

    const result = await pool.query(
      `INSERT INTO group_messages (user_id, content)
       VALUES ($1, $2)
       RETURNING *`,
      [req.user.id, content]
    );

    // Get user info
    const userResult = await pool.query(
      'SELECT name, username, avatar_url, name_color, is_premium FROM users WHERE id = $1',
      [req.user.id]
    );

    const message = {
      ...result.rows[0],
      user: userResult.rows[0]
    };

    res.status(201).json(message);
  } catch (error) {
    console.error('Send group message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get group messages
router.get('/group', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT gm.*, u.name, u.username, u.avatar_url, u.name_color, u.is_premium
       FROM group_messages gm
       JOIN users u ON gm.user_id = u.id
       ORDER BY gm.created_at DESC
       LIMIT 100`
    );

    res.json(result.rows.reverse());
  } catch (error) {
    console.error('Get group messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
