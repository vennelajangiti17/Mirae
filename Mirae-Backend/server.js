require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 1. Import your clean database configuration (from your main branch)
const connectDB = require('./config/db'); 

// 2. Import all routes (combining your tracker with their auth)
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');
const trackerRoutes = require('./routes/trackerRoutes');

// Initialize app
const app = express();

// Middleware - Using your friend's specific frontend security settings
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

// 3. Connect to Database using your MVC setup
connectDB();

// 4. Mount all Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tracker', trackerRoutes);

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Mirae Backend is running perfectly! 🚀' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌟 Server is listening on port ${PORT}`);
});