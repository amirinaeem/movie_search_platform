/**
 * collectionController.js
 * User collection CRUD (embedded).
 */
const Collection = require('../models/Collection');

exports.getCollection = async (req, res) => {
  const collection = await Collection.findOne({ user: req.userId });
  res.json(collection || { user: req.userId, movies: [] });
};

exports.addMovie = async (req, res) => {
  const { movie } = req.body;
  let collection = await Collection.findOne({ user: req.userId });
  if (!collection) collection = new Collection({ user: req.userId, movies: [] });

  const exists = collection.movies.some(m => String(m.tmdb_id) === String(movie.tmdb_id));
  if (!exists) collection.movies.push(movie);

  await collection.save();
  res.json(collection);
};

exports.removeMovie = async (req, res) => {
  const { tmdb_id } = req.body;
  const collection = await Collection.findOne({ user: req.userId });
  if (!collection) return res.status(404).json({ error: 'Collection not found' });

  collection.movies = collection.movies.filter(m => String(m.tmdb_id) !== String(tmdb_id));
  await collection.save();
  res.json(collection);
};
