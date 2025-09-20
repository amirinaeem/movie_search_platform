/**
 * routes/auth.js
 * Auth endpoints (signup/signin).
 */
const router = require('express').Router();
const { signup, signin } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;
