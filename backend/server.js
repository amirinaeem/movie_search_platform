/**
 * server.js
 * Express app bootstrap: DB connect, middleware, static assets, routes, seeding, error handlers.
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (e.g., /noposter.jpg)
app.use(express.static('public'));

// Routes
const authRoutes = require('./routes/auth');
const moviesRoutes = require('./routes/movies');
const commentsRoutes = require('./routes/comments');
const collectionsRoutes = require('./routes/collections');
const { router: tmdbRoutes, seedDefaultMovies } = require('./routes/tmdb');

app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/tmdb', tmdbRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start
const PORT = process.env.PORT || 5000;
const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  console.error('❌ Missing MONGODB_URI');
  process.exit(1);
}

mongoose.set('strictQuery', true);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 10000 })
  .then(async () => {
    console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`);

    // Seed 20 default movies (only if empty)
    await seedDefaultMovies();

    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

    // Debug
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    const count = await mongoose.connection.db.collection('movies').countDocuments();
    console.log('📊 Movies in DB:', count);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Safety nets
process.on('unhandledRejection', (r) => console.error('Unhandled Rejection:', r));
process.on('uncaughtException', (e) => { console.error('Uncaught Exception:', e); process.exit(1); });
