/**
 * Comment.js
 * sample_mflix.comments subset (used for delete examples).
 */
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  name: String,
  email: String,
  movie_id: mongoose.Schema.Types.ObjectId,
  text: String,
  date: Date,
}, { collection: 'comments' });

module.exports = mongoose.model('Comment', commentSchema);
