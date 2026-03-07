const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

// Create gig (sellers only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'seller')
    return res.status(403).json({ message: 'Only sellers can create gigs' });

  const { title, description, price } = req.body;
  if (!title || !description || !price)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    await db.query(
      'INSERT INTO gigs (seller_id, title, description, price) VALUES (?, ?, ?, ?)',
      [req.user.id, title, description, price]
    );
    res.status(201).json({ message: 'Gig created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all gigs (with optional search)
router.get('/', async (req, res) => {
  const { search } = req.query;
  try {
    let query = 'SELECT * FROM gigs';
    let params = [];
    if (search) {
      query += ' WHERE title LIKE ? OR description LIKE ?';
      params = [`%${search}%`, `%${search}%`];
    }
    const [gigs] = await db.query(query, params);
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;