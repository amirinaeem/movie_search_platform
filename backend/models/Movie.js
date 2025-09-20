const mongoose = require('mongoose');

/**
 * Movie schema (MongoDB sample_mflix + TMDB enrichment)
 */
const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    year: Number,

    directors: [String],
    cast: [String],
    genres: [String],

    imdb: {
      rating: Number,
      votes: Number,
      id: Number,
    },

    metacritic: Number,
    available_on: String,

    // ✅ TMDB extras
    overview: String,
    poster: String,       // full image URL from TMDB
    tmdb_id: Number,      // TMDB’s unique movie ID
  },
  { collection: 'movies' }
);

module.exports = mongoose.model('Movie', movieSchema);
