// backend/routes/tmdb.js
const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const Movie = require('../models/Movie');

dotenv.config();
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const buildPosterUrl = (path) =>
  path && path !== 'null'
    ? `https://image.tmdb.org/t/p/w500${path}`
    : '/noposter.jpg';


// 🔹 Seed 20 movies if DB is empty
async function seedDefaultMovies() {
  const count = await Movie.countDocuments();
  if (count > 0) {
    console.log(`📊 Movies already in DB: ${count} → skipping seed`);
    return;
  }

  console.log('🌱 Seeding 20 default movies from TMDB...');
  try {
    const tmdbRes = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=1`);
    const data = await tmdbRes.json();

    if (!data.results) {
      console.error('❌ Failed to fetch popular movies for seeding');
      return;
    }

    const formatted = data.results.slice(0, 20).map((m) => ({
      title: m.title,
      year: m.release_date ? parseInt(m.release_date.split('-')[0]) : null,
      imdb: { rating: m.vote_average, votes: m.vote_count },
      genres: [],
      overview: m.overview,
      poster: buildPosterUrl(m.poster_path),
      tmdb_id: m.id,
    }));

    await Movie.insertMany(formatted, { ordered: false });
    console.log('✅ Seeded 20 movies into DB');
  } catch (err) {
    console.error('❌ Error seeding movies:', err.message);
  }
}

// Call seeding on startup
seedDefaultMovies();

// 🔹 Search route
router.get('/search', async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) return res.status(400).json({ error: 'title query parameter is required' });

    console.log('🔍 Searching TMDB for:', title);
    const tmdbRes = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`
    );
    const tmdbData = await tmdbRes.json();

    if (tmdbData.results?.length > 0) {
      const formatted = tmdbData.results.map((m) => ({
        title: m.title,
        year: m.release_date ? parseInt(m.release_date.split('-')[0]) : null,
        imdb: { rating: m.vote_average, votes: m.vote_count },
        genres: [],
        overview: m.overview,
        poster: buildPosterUrl(m.poster_path),
        tmdb_id: m.id,
      }));

      await Movie.insertMany(formatted, { ordered: false }).catch(() => {});
      return res.json(formatted);
    }

    // fallback: MongoDB search
    const regex = new RegExp(title, 'i');
    const mongoMovies = await Movie.find({ title: regex }).limit(20);
    res.json(mongoMovies);
  } catch (err) {
    console.error('❌ Search failed:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
