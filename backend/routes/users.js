const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * POST /api/users
 * Inserts a new user document into the users collection.  Expects
 * { name: string, email: string } in the request body.
 */
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }
    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

module.exports = router;