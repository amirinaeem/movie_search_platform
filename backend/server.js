// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routers
const { router: tmdbRouter, seedDefaultMovies } = require('./routes/tmdb');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const commentsRouter = require('./routes/comments');

// API routes
app.use('/api/tmdb', tmdbRouter);
app.use('/api/users', usersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/comments', commentsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Mongo + server start
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Missing MONGODB_URI. Please set it in your .env file.');
  process.exit(1);
}

mongoose.set('strictQuery', true);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(async () => {
    console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`);

    // 🚀 Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

    // 🌱 Seed if empty
    await seedDefaultMovies();

    // Debug info
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map((c) => c.name));

    const count = await mongoose.connection.db.collection('movies').countDocuments();
    console.log('📊 Movies in DB:', count);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Safety nets
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
