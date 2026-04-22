require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');
const trackerRoutes = require('./routes/trackerRoutes');
const profileRoutes = require('./routes/profileRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// 🛡️ CORS Policy configured for Frontend + Extension
app.use(
  cors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:5173',
      'chrome-extension://bdgphanpcmamocjgmijgbpdbhhjfbcbg' // 👈 Your Extension ID is allowed
    ],
    credentials: true,
  })
);
app.use(express.json());

// Connect to Database
connectDB();

// Mount all Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Mirae Backend is running perfectly! 🚀' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌟 Mirae Backend is listening on port ${PORT}`);
  console.log(`🔗 Health check available at http://localhost:${PORT}/health`);
});
