const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routers
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const commentsRouter = require('./routes/comments');

// API routes
app.use('/api/users', usersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/comments', commentsRouter);

// Health check endpoint (useful for debugging/deployment)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

// Fallback route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Global error handler (catches thrown errors in routes)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server only after connecting to MongoDB
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Missing MONGODB_URI. Please set it in your .env file.');
  process.exit(1);
}

// Recommended: prepare for Mongoose 7 behavior
mongoose.set('strictQuery', true);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // fail fast if cannot connect
  })
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

    // 🔍 Test the collection after connection
    try {
      const sampleMovie = await mongoose.connection.db
        .collection('movies')
        .findOne({});
      console.log('Sample movie from DB:', sampleMovie?.title || sampleMovie);
    } catch (err) {
      console.error('Error fetching test movie:', err);
    }
  })
  .catch((err) => {
    console.error('❌ Error connecting to MongoDB:', err.message);
    process.exit(1);
  });


  mongoose.connection.once('open', async () => {
  console.log(`✅ Connected to DB: ${mongoose.connection.name}`);

  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections in DB:', collections.map(c => c.name));

  const count = await mongoose.connection.db.collection('movies').countDocuments();
  console.log('📊 Movies count:', count);

  const sample = await mongoose.connection.db.collection('movies').findOne();
  console.log('🎬 Sample movie:', sample?.title || sample);
});




// Handle unhandled promise rejections (last line of defense)
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
