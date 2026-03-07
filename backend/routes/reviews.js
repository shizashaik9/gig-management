const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

// Submit a review
router.post('/', auth, async (req, res) => {
  const { order_id, gig_id, rating, comment } = req.body;
  if (!order_id || !gig_id || !rating)
    return res.status(400).json({ message: 'order_id, gig_id and rating are required' });

  if (rating < 1 || rating > 5)
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });

  try {
    await db.query(
      'INSERT INTO reviews (order_id, buyer_id, gig_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [order_id, req.user.id, gig_id, rating, comment]
    );
    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get reviews for a gig
router.get('/:gigId', async (req, res) => {
  try {
    const [reviews] = await db.query(
      'SELECT * FROM reviews WHERE gig_id = ? ORDER BY created_at DESC',
      [req.params.gigId]
    );
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;