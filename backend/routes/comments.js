/**
 * routes/comments.js
 * Demo delete endpoints on sample comments collection.
 */
const router = require('express').Router();
const Comment = require('../models/Comment');
const Movie = require('../models/Movie');

router.delete('/:id', async (req, res) => {
  try {
    const result = await Comment.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Comment not found' });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting comment.' });
  }
});

router.delete('/movie/:title', async (req, res) => {
  try {
    const movie = await Movie.findOne({ title: req.params.title });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    const result = await Comment.deleteMany({ movie_id: movie._id });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting comments for movie.' });
  }
});

module.exports = router;
