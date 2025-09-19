const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Movie = require('../models/Movie');

/**
 * DELETE /api/comments/:id
 * Deletes a single comment by its ID.
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Comment.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting comment.' });
  }
});

/**
 * DELETE /api/comments/movie/:title
 * Deletes all comments for a given movie title.  Looks up the movie’s `_id`
 * from the movies collection and then deletes any comments whose `movie_id`
 * matches.  Responds with the number of deleted comments.
 */
router.delete('/movie/:title', async (req, res) => {
  try {
    const { title } = req.params;
    // Find the movie by title
    const movie = await Movie.findOne({ title });
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    const result = await Comment.deleteMany({ movie_id: movie._id });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting comments for movie.' });
  }
});

module.exports = router;