const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const Movie = require('../models/Movie');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const buildPosterUrl = (path) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : null;

/**
 * --- CLEAN START ---
 * On server startup, drop the sample movies collection so we only store TMDB data.
 */
(async () => {
  try {
    if (await Movie.collection.countDocuments() > 0) {
      console.log("🧹 Dropping old movies collection...");
      await Movie.collection.drop();
      console.log("✅ Movies collection cleared. Will repopulate from TMDB.");
    }
  } catch (err) {
    if (err.code === 26) {
      console.log("ℹ️ Movies collection does not exist yet, nothing to drop.");
    } else {
      console.error("⚠️ Error dropping movies collection:", err.message);
    }
  }
})();

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
    console.error(err);
    res.status(500).json({ error: 'Error listing movies.' });
  }
});

/**
 * GET /api/movies/search?title=xxx
 * Always fetch from TMDB, save to Mongo, return results
 */
router.get('/search', async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) return res.status(400).json({ error: 'title query parameter is required' });

    console.log(`🌍 Searching TMDB: ${title}`);
    const tmdbRes = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`
    );
    const tmdbData = await tmdbRes.json();

    if (tmdbData.results?.length > 0) {
      const formatted = tmdbData.results.map((t) => ({
        title: t.title,
        year: t.release_date ? parseInt(t.release_date.split('-')[0]) : null,
        imdb: { rating: t.vote_average, votes: t.vote_count },
        genres: [], // optional enrichment later
        overview: t.overview,
        poster: buildPosterUrl(t.poster_path),
        tmdb_id: t.id,
      }));

      // Save to Mongo (ignore duplicates)
      await Movie.insertMany(formatted, { ordered: false }).catch(() => {});

      return res.json(formatted);
    }

    res.json([]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
