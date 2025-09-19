const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// helper: case-insensitive partial match
const buildRegex = (str) => (str ? new RegExp(str, 'i') : undefined);



// Temporary debug route
router.get('/debug/first', async (req, res) => {
  try {
    const movie = await Movie.findOne();
    res.json(movie || { message: 'No movies found in collection' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Debug query failed' });
  }
});




/**
 * GET /api/movies
 * List movies with pagination/sorting for the homepage.
 * Query: page=1&limit=20&sort=year|imdb.rating|title&order=desc|asc
 */
router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 50);
    const sort = req.query.sort || 'year';
    const order = req.query.order === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;
    const filter = {}; // (extendable later)

    const [items, total] = await Promise.all([
      Movie.find(filter).sort({ [sort]: order }).skip(skip).limit(limit),
      Movie.countDocuments(filter),
    ]);

    res.json({ items, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error listing movies.' });
  }
});

/**
 * GET /api/movies/search?title=xxx
 * Partial, case-insensitive title search (returns array).
 */
router.get('/search', async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) return res.status(400).json({ error: 'title query parameter is required' });
    const regex = buildRegex(title);
    console.log("Searching for:", regex);
const movies = await Movie.find({ title: regex }).limit(20);
console.log("Found:", movies.length);
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error searching movies.' });
  }
});

/**
 * GET /api/movies/director/:director
 */
router.get('/director/:director', async (req, res) => {
  try {
    const director = req.params.director;
    const movies = await Movie.find({ directors: { $in: [director] } });
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching movies by director.' });
  }
});

/**
 * GET /api/movies/genre/:genre (sorted by year desc)
 */
router.get('/genre/:genre', async (req, res) => {
  try {
    const genre = req.params.genre;
    const movies = await Movie.find({ genres: { $in: [genre] } }).sort({ year: -1 });
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching movies by genre.' });
  }
});

/**
 * GET /api/movies/imdb/gt/:rating  (projection)
 */
router.get('/imdb/gt/:rating', async (req, res) => {
  try {
    const rating = parseFloat(req.params.rating);
    if (isNaN(rating)) return res.status(400).json({ error: 'Rating must be a number' });
    const movies = await Movie.find({ 'imdb.rating': { $gt: rating } }, { title: 1, imdb: 1 });
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching movies by IMDb rating.' });
  }
});

/**
 * GET /api/movies/stars?actors=Tom%20Hanks,Tim%20Allen&exclusive=true
 */
router.get('/stars', async (req, res) => {
  try {
    const { actors, exclusive } = req.query;
    if (!actors) return res.status(400).json({ error: 'actors query parameter is required' });
    const actorList = actors.split(',').map((a) => a.trim());
    const query = { cast: { $all: actorList } };
    if (exclusive) query.cast.$size = actorList.length;
    const movies = await Movie.find(query);
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching movies by stars.' });
  }
});

/**
 * GET /api/movies/comedy/director/:director
 */
router.get('/comedy/director/:director', async (req, res) => {
  try {
    const director = req.params.director;
    const movies = await Movie.find({
      directors: { $in: [director] },
      genres: { $in: ['Comedy'] },
    });
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching comedy movies by director.' });
  }
});

/**
 * PUT /api/movies/matrix/available_on
 */
router.put('/matrix/available_on', async (req, res) => {
  try {
    const platform = req.body.platform || 'Sflix';
    const result = await Movie.findOneAndUpdate(
      { title: 'The Matrix' },
      { $set: { available_on: platform } },
      { new: true }
    );
    if (!result) return res.status(404).json({ error: 'The Matrix not found' });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating The Matrix availability.' });
  }
});

/**
 * PATCH /api/movies/matrix/metacritic/increment?val=1
 */
router.patch('/matrix/metacritic/increment', async (req, res) => {
  try {
    const incVal = parseInt(req.query.val, 10) || 1;
    const result = await Movie.findOneAndUpdate(
      { title: 'The Matrix' },
      { $inc: { metacritic: incVal } },
      { new: true }
    );
    if (!result) return res.status(404).json({ error: 'The Matrix not found' });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error incrementing The Matrix metacritic.' });
  }
});

/**
 * PATCH /api/movies/year/:year/add-genre
 */
router.patch('/year/:year/add-genre', async (req, res) => {
  try {
    const year = parseInt(req.params.year, 10);
    if (isNaN(year)) return res.status(400).json({ error: 'Year must be an integer' });
    const genre = req.body.genre || 'Gen Z';
    const result = await Movie.updateMany({ year }, { $addToSet: { genres: genre } });
    res.json({ updatedCount: result.modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding genre to movies.' });
  }
});

/**
 * PATCH /api/movies/imdb/increase?threshold=5&increment=1
 */
router.patch('/imdb/increase', async (req, res) => {
  try {
    const threshold = parseFloat(req.query.threshold) || 5;
    const increment = parseFloat(req.query.increment) || 1;
    const result = await Movie.updateMany(
      { 'imdb.rating': { $lt: threshold } },
      { $inc: { 'imdb.rating': increment } }
    );
    res.json({ updatedCount: result.modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error increasing IMDb ratings.' });
  }
});

/**
 * DELETE /api/movies/no-genres
 */
router.delete('/no-genres', async (_req, res) => {
  try {
    const result = await Movie.deleteMany({
      $or: [{ genres: { $exists: false } }, { genres: { $size: 0 } }],
    });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting movies without genres.' });
  }
});

/**
 * Aggregations
 */
router.get('/aggregate/year-count', async (_req, res) => {
  try {
    const agg = await Movie.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(agg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error aggregating movies by year.' });
  }
});

router.get('/aggregate/director-average-rating', async (_req, res) => {
  try {
    const agg = await Movie.aggregate([
      { $unwind: '$directors' },
      { $match: { 'imdb.rating': { $ne: null } } },
      { $group: { _id: '$directors', avgRating: { $avg: '$imdb.rating' } } },
      { $sort: { avgRating: -1 } },
    ]);
    res.json(agg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error aggregating average ratings by director.' });
  }
});




module.exports = router;
