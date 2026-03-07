const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

// Send a message
router.post('/', auth, async (req, res) => {
  const { receiver_username, content } = req.body;
  if (!receiver_username || !content)
    return res.status(400).json({ message: 'Receiver username and content are required' });

  try {
    // Find receiver by username
    const [users] = await db.query('SELECT id FROM users WHERE username = ?', [receiver_username]);
    if (users.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const receiver_id = users[0].id;
    await db.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
      [req.user.id, receiver_id, content]
    );
    res.status(201).json({ message: 'Message sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get conversation by username
router.get('/:username', auth, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id FROM users WHERE username = ?', [req.params.username]);
    if (users.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const otherId = users[0].id;
    const [messages] = await db.query(
      `SELECT * FROM messages
       WHERE (sender_id = ? AND receiver_id = ?)
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`,
      [req.user.id, otherId, otherId, req.user.id]
    );
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;