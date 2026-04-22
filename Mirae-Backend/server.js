require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 1. Import database configuration
const connectDB = require('./config/db'); 

// 2. Import all routes
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');
const trackerRoutes = require('./routes/trackerRoutes');
const profileRoutes = require('./routes/profileRoutes'); // 📄 Added for Resume/Profile management

// Initialize app
const app = express();

// Middleware - Configured for both local development ports
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

// 3. Connect to MongoDB
connectDB();

// 4. Mount all Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/profile', profileRoutes); // 🔐 Secured Profile routes

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Mirae Backend is running perfectly! 🚀' });
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌟 Mirae Backend is listening on port ${PORT}`);
  console.log(`🔗 Health check available at http://localhost:${PORT}/health`);
});
