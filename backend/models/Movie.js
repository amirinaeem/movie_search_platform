/**
 * Movie.js
 * Movie schema (sample_mflix + TMDB enrichment).
 */
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
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
  overview: String,
  poster: String,   // full TMDB URL or /noposter.jpg
  tmdb_id: Number,
}, { collection: 'movies', timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
