const mongoose = require('mongoose');

/*
 * Comment schema representing documents in the sample_mflix.comments collection.
 * Used for delete operations in the assignment.
 */
const commentSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    movie_id: mongoose.Schema.Types.ObjectId,
    text: String,
    date: Date,
  },
  { collection: 'comments' }
);

module.exports = mongoose.model('Comment', commentSchema);