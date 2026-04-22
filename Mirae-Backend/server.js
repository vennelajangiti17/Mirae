require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');
const trackerRoutes = require('./routes/trackerRoutes');

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

// DB CONNECTION
console.log('MONGO_URI loaded:', process.env.MONGO_URI ? 'YES' : 'NO');

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is missing. Check your .env file.');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// ROUTES
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tracker', trackerRoutes);

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Mirae Backend is running perfectly! 🚀' });
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌟 Server is listening on port ${PORT}`);
});