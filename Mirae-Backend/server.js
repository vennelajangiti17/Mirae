// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const trackerRoutes = require('./routes/trackerRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/tracker', trackerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Mirae Backend is running perfectly! 🚀' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌟 Server is listening on port ${PORT}`);
});
