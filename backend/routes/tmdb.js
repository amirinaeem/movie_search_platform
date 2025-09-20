/**
 * routes/tmdb.js
 * TMDB routes + exported seeding function.
 */
const router = require('express').Router();
const { search, seedDefaultMovies } = require('../controllers/tmdbController');

router.get('/search', search);

module.exports = { router, seedDefaultMovies };
