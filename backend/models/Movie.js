const mongoose = require('mongoose');

/*
 * A simplified Movie schema matching the structure of documents in the
 * sample_mflix.movies collection.  Only the fields necessary for the
 * assignment are defined.  Additional fields can be added as needed.
 */
const movieSchema = new mongoose.Schema(
  {
    title: String,
    directors: [String],
    cast: [String],
    genres: [String],
    year: Number,
    imdb: {
      rating: Number,
      votes: Number,
      id: Number,
    },
    metacritic: Number,
    available_on: String,
  },
  { collection: 'movies' }
);

module.exports = mongoose.model('Movie', movieSchema);