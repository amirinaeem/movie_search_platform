const mongoose = require('mongoose');

// Simple User schema to demonstrate Create operation
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});

module.exports = mongoose.model('User', userSchema);