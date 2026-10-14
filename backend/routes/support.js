const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { auth, adminAuth } = require('../middleware/auth');

// Create support ticket
router.post('/', auth, async (req, res) => {
  try {
    const { type, subject, content } = req.body;

    const result = await pool.query(
      `INSERT INTO support_tickets (user_id, type, subject, content)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, type, subject, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's tickets
router.get('/my', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT st.*, u.name, u.username
       FROM support_tickets st
       JOIN users u ON st.user_id = u.id
       WHERE st.user_id = $1
       ORDER BY st.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get my tickets error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all tickets (admin)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT st.*, u.name, u.username
       FROM support_tickets st
       JOIN users u ON st.user_id = u.id
       ORDER BY st.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get all tickets error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Respond to ticket (admin)
router.put('/:ticketId/respond', adminAuth, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { admin_response, status } = req.body;

    const result = await pool.query(
      `UPDATE support_tickets
       SET admin_response = COALESCE($1, admin_response),
           status = COALESCE($2, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [admin_response, status, ticketId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Respond ticket error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
