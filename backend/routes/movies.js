// backend/routes/movies.js
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

/**
 * GET /api/movies
 * Paginated list from MongoDB
 */
router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 50);
    const sort = req.query.sort || 'year';
    const order = req.query.order === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Movie.find({}).sort({ [sort]: order }).skip(skip).limit(limit),
      Movie.countDocuments({})
    ]);

    res.json({ items, total, page, limit });
  } catch (err) {
    console.error("❌ Error listing movies:", err);
    res.status(500).json({ error: 'Error listing movies.' });
  }
});

module.exports = router;
