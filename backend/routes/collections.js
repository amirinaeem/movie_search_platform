/**
 * routes/collections.js
 * Collection endpoints (protected).
 */
const router = require('express').Router();
const protect = require('../middleware/auth');
const { getCollection, addMovie, removeMovie } = require('../controllers/collectionController');

router.get('/', protect, getCollection);
router.post('/add', protect, addMovie);
router.post('/remove', protect, removeMovie);

module.exports = router;
