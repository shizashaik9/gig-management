const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

// Place an order
router.post('/', auth, async (req, res) => {
  const { gig_id } = req.body;
  if (!gig_id)
    return res.status(400).json({ message: 'Gig ID is required' });

  try {
    const [gigs] = await db.query('SELECT * FROM gigs WHERE id = ?', [gig_id]);
    if (gigs.length === 0)
      return res.status(404).json({ message: 'Gig not found' });

    const gig = gigs[0];
    await db.query(
      'INSERT INTO orders (gig_id, buyer_id, seller_id) VALUES (?, ?, ?)',
      [gig_id, req.user.id, gig.seller_id]
    );
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get my orders
router.get('/', auth, async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT orders.*, gigs.title, gigs.price FROM orders JOIN gigs ON orders.gig_id = gigs.id WHERE orders.buyer_id = ?',
      [req.user.id]
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;