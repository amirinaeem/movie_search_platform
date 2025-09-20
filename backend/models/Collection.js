/**
 * Collection.js
 * Per-user movie collection (embedded movie snapshots).
 */
const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [{
    tmdb_id: String,
    title: String,
    year: Number,
    poster: String,
    overview: String,
    rating: Number,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Collection', collectionSchema);
