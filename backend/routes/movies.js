/**
 * routes/movies.js
 * Movie list (DB) for homepage.
 */
const router = require('express').Router();
const { list } = require('../controllers/moviesController');

router.get('/', list);

module.exports = router;
